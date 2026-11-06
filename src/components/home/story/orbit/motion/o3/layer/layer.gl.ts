import * as THREE from "three";
import { kit, type Pal, type Tokens, type View } from "../gl";
import { LAYER, shapeOf, tokenAt, type LayerPose } from "./layer.scene";

// The layer moments (D86, design B), in the shared studio (loaded with a dynamic import, client only). See
// layer.scene.ts for the scene, the change and the vectors.
//
// What the frost sees: only opaque things are drawn into three's transmission pass. The tokens are given pale matte
// stand-ins there (a disc and a rim), so the growing core blurs them to soft pale discs; their clear glass is drawn
// over the screen instead and leaves no trace in that pass. The plate is seen there as an even satin. The core's
// collar, its edge lines and the tokens' polished parts are drawn on screen only, so the frost never smears chrome or
// stains beside them (D75).
const { palette, mix, getEngine, studio, polished, polishedDark, onlyIn, view } = kit;

// Brushed, turned metal: a direction field round the centre for the anisotropic highlight (the plate's top face; the
// cylinder's cap is mapped planar, so the tangent of a circle in uv space is the brushing direction)
function turned() {
  const n = 256, data = new Uint8Array(n * n * 4);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const u = (x + 0.5) / n - 0.5, v = (y + 0.5) / n - 0.5, l = Math.hypot(u, v) || 1;
    const i = (y * n + x) * 4;
    data[i] = Math.round((-v / l * 0.5 + 0.5) * 255);
    data[i + 1] = Math.round((u / l * 0.5 + 0.5) * 255);
    data[i + 2] = 255;
    data[i + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, n, n);
  tex.needsUpdate = true;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

// The plate's top: calm satin chrome, turned. A faint anisotropy only (a strong one throws a radial fan, a CD), fine
// turned hairlines as a quiet texture (procedural: a ring every 1/70 unit, antialiased and faded where they crowd);
// the polished rim carries the brightness
function brushed(pal: Pal) {
  const m = new THREE.MeshPhysicalMaterial({
    color: pal.onDark, metalness: 1, roughness: 0.45, anisotropy: 0.15, anisotropyMap: turned(), envMapIntensity: 1,
    emissive: mix(pal.surface, pal.surface2, 0.3), emissiveIntensity: 0.1,
  });
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vLoc;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvLoc = position;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vLoc;")
      .replace("#include <color_fragment>", `#include <color_fragment>
      {
        float r = length(vLoc.xz) * 70.0;
        float fr = fwidth(r);
        float line = 1.0 - smoothstep(0.0, 1.0, abs(fract(r) - 0.5) / max(fr, 1e-4));
        float pass = 0.6 + 0.4 * sin(r * 0.37);
        diffuseColor.rgb *= 1.0 - 0.06 * line * pass * (1.0 - smoothstep(0.25, 0.5, fr));
      }`);
  };
  m.customProgramCacheKey = () => "layer-brushed-2";
  return m;
}

// Clear polished glass, for the tokens. Not three's transmission: the tokens are drawn over what is on screen, so they
// show the real plate through them, and are left out of the frost's view (transparent things are never drawn into the
// transmission pass; inside the core the frost covers them). What makes them read as glass on a light plate:
// - the walls: a neutral grey-ink Fresnel, denser toward the silhouette and darkest in a band just under the top edge
//   (the light the wall turns back), never white;
// - the face: nearly clear, with the plate's turned hairlines seen through it a touch offset (the refraction), a
//   darker zone inside its edge where the wall shows through, and a crisp bright line just inside the bead
type Clear = { mat: THREE.MeshPhysicalMaterial; deckInv: THREE.Matrix4 };
function clear(pal: Pal, R: number, H: number): Clear {
  const deckInv = new THREE.Matrix4();
  const m = new THREE.MeshPhysicalMaterial({
    color: pal.onDark, metalness: 0, roughness: 0.05, transparent: true, envMapIntensity: 1.2, specularIntensity: 1,
  });
  const u = { uEdge: { value: mix(pal.ink, pal.surface2, 0.4) }, uHi: { value: pal.onDark.clone() }, uDeckInv: { value: deckInv } };
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vLoc;\nvarying vec3 vObjN;\nvarying vec3 vWorld;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvLoc = position;\nvObjN = normal;\nvWorld = (modelMatrix * vec4(position, 1.0)).xyz;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vLoc;\nvarying vec3 vObjN;\nvarying vec3 vWorld;\nuniform vec3 uEdge;\nuniform vec3 uHi;\nuniform mat4 uDeckInv;")
      .replace("#include <opaque_fragment>", `#include <opaque_fragment>
      {
        float f = 1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0);
        float a;
        vec3 c = gl_FragColor.rgb;
        if (abs(vObjN.y) < 0.5) {
          float under = smoothstep(0.45, 0.95, vLoc.y / ${H.toFixed(4)});
          c = mix(c, uEdge, 0.6 + 0.25 * under);
          a = mix(0.3, 0.8, pow(f, 1.4)) + 0.2 * under;
        } else {
          float rr = length(vLoc.xz) / ${R.toFixed(4)};
          // the plate's hairlines, seen through the face a little shifted
          vec2 pp = (uDeckInv * vec4(vWorld, 1.0)).xz + vec2(0.004, 0.016);
          float r = length(pp) * 70.0, fr = fwidth(r);
          float line = (1.0 - smoothstep(0.0, 1.0, abs(fract(r) - 0.5) / max(fr, 1e-4))) * (1.0 - smoothstep(0.25, 0.5, fr));
          float wall = smoothstep(0.62, 0.9, rr) * (1.0 - smoothstep(0.9, 0.93, rr));
          float hi = smoothstep(0.925, 0.94, rr) * (1.0 - smoothstep(0.955, 0.97, rr));
          // across the face: the wall's shade refracted in toward the front, a soft bright reflection toward the back
          float fz = vLoc.z / ${R.toFixed(4)};
          float shade = smoothstep(-0.3, 0.95, fz);
          float glint = (1.0 - smoothstep(-0.75, -0.35, fz)) * (1.0 - smoothstep(0.84, 0.92, rr));
          // (an overlay: grey-ink where the glass darkens what is behind it, white where it reflects)
          float dark = 0.05 + 0.2 * line + 0.42 * wall + 0.3 * shade;
          float lit = clamp(hi + 0.7 * glint, 0.0, 1.0);
          c = mix(uEdge, uHi, lit);
          a = max(dark * (1.0 - lit), 0.85 * lit);
        }
        gl_FragColor = vec4(c, clamp(a, 0.0, 1.0));
      }`);
  };
  m.customProgramCacheKey = () => "layer-clear-4";
  return { mat: m, deckInv };
}

// The core's frost: neutral milky glass that turns NEAR green, with three people etched into its top face (D95; it
// was the official N; a mask, `mark`). Green, it reads as frosted glass rather than paint: the face is pale and
// milky (B2's lightness) in the stations' deeper blue-green hue; the saturated green sits in the thickness, the walls
// and a denser band inside the rim; at the very edge a fine bright line where light pipes to the rim; a soft sheen
// falls across the face from the key light's side (upper left, at the back)
type Core = { mat: THREE.MeshPhysicalMaterial; set: (green: number, mark: number) => void };
function frost(pal: Pal, nTex: THREE.Texture, top: boolean): Core {
  const neutral = pal.onDark.clone();
  const green = mix(pal.green, pal.ink, 0.22);
  const m = new THREE.MeshPhysicalMaterial({
    color: neutral.clone(), metalness: 0, roughness: 0.4, transmission: 1, thickness: 0.3, ior: 1.4,
    specularIntensity: 0.8, envMapIntensity: 1.1, attenuationColor: pal.onDark.clone(), attenuationDistance: 2.5,
    premultipliedAlpha: true,
  });
  const u = {
    uN: { value: nTex }, uMark: { value: 0 }, uGreen: { value: 0 },
    uGlow: { value: mix(pal.onDark, pal.surface2, 0.15) }, uMilk: { value: mix(pal.onDark, mix(pal.green, pal.ink, 0.15), 0.45) },
    uDeep: { value: mix(mix(pal.green, pal.ink, 0.6), pal.surface2, 0.1) }, uHi: { value: pal.onDark.clone() },
  };
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vLoc;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvLoc = position;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vLoc;\nuniform sampler2D uN;\nuniform float uMark;\nuniform float uGreen;\nuniform vec3 uGlow;\nuniform vec3 uMilk;\nuniform vec3 uDeep;\nuniform vec3 uHi;")
      .replace("#include <opaque_fragment>", `{
        float rr = length(vLoc.xz);
        float sheen = 0.5 + 0.5 * dot(vLoc.xz, normalize(vec2(-0.6, -0.8)));
        ${top ? `
        // the face: milky, paler toward the key light; a denser band inside the rim; a fine bright line at the edge
        float band = smoothstep(0.74, 0.93, rr) * (1.0 - smoothstep(0.95, 0.985, rr));
        float edge = smoothstep(0.965, 0.995, rr);
        float milk = mix(0.62, 0.5, uGreen) * (1.0 - band) * (0.8 + 0.3 * sheen);
        outgoingLight = mix(outgoingLight, mix(uGlow, uMilk, uGreen), milk);
        outgoingLight *= 1.0 - 0.05 * band * uGreen;
        outgoingLight += uGlow * (edge * mix(0.3, 0.45, uGreen) + 0.06 * sheen);
        // the mark (the people): a shallow incised line. Inside it the glass is a touch deeper and clearer; along its walls a bright
        // edge on the side away from the light and a dark one toward it
        vec2 uv = vec2(vLoc.x, -vLoc.z) / 0.98 + 0.5;
        vec2 px = vec2(1.0 / 1024.0);
        vec2 ld = normalize(vec2(-0.55, 0.83)) * 2.5 * px;
        float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
        float n = texture2D(uN, uv).r * inside;
        float e = (texture2D(uN, uv + ld).r - texture2D(uN, uv - ld).r) * inside;
        outgoingLight = mix(outgoingLight, outgoingLight * 0.66 + uDeep * 0.16, n * uMark);
        outgoingLight += uHi * max(-e, 0.0) * 0.55 * uMark;
        outgoingLight *= 1.0 - max(e, 0.0) * 0.35 * uMark;` : `
        // the wall: the glass's thickness, where the colour is densest; a little milk and a glow at its upper lip
        outgoingLight = mix(outgoingLight, uGlow, 0.55 * (1.0 - uGreen));
        outgoingLight *= mix(0.84, 1.0, smoothstep(0.0, 1.0, vLoc.y));
        outgoingLight += uGlow * smoothstep(0.85, 1.0, vLoc.y) * 0.18;`}
      }
      #include <opaque_fragment>`);
  };
  m.customProgramCacheKey = () => `layer-frost-${top ? "top" : "side"}-7`;
  return {
    mat: m,
    set(g, mark) {
      m.color.copy(neutral).lerp(green, g);
      m.attenuationColor.copy(pal.onDark).lerp(green, g);
      m.specularIntensity = 0.8 - 0.25 * g;
      u.uGreen.value = g;
      u.uMark.value = mark;
    },
  };
}

// D95: users, not NEAR's N ("I want to use a user image on the green disc so it doesn't look like it's NEAR owned";
// then "make this icon closer to the reference image I showed that had 3 people"). After Lawrence's reference: three
// equal people in an even outline (a ring for the head, the shoulders' outline tucking in under it, a flat foot), one
// in front and two behind it, higher and to either side, whose lines break with a clear gap where the front one passes
// in front of them. Stroked into the mask, so it etches into the core exactly as the N did. Units: the front figure's
// head centre is at (0, -0.285), the group spans about ±1.28 by ±1; set a third larger than the N (Lawrence: "make the
// people larger on the disc"), the four ticks round it moved out to clear them (layer.scene.ts).
function person(g: CanvasRenderingContext2D, dx: number, dy: number) {
  const head = new Path2D(), body = new Path2D();
  head.arc(dx, dy - 0.285, 0.405, 0, Math.PI * 2);
  const w = 0.7, r = 0.11, foot = 0.935;
  body.moveTo(dx - 0.1, dy + 0.13);
  body.bezierCurveTo(dx - 0.3, dy + 0.2, dx - 0.5, dy + 0.25, dx - 0.6, dy + 0.34);
  body.bezierCurveTo(dx - 0.67, dy + 0.41, dx - w, dy + 0.48, dx - w, dy + 0.58);
  body.lineTo(dx - w, dy + foot - r);
  body.quadraticCurveTo(dx - w, dy + foot, dx - w + r, dy + foot);
  body.lineTo(dx + w - r, dy + foot);
  body.quadraticCurveTo(dx + w, dy + foot, dx + w, dy + foot - r);
  body.lineTo(dx + w, dy + 0.58);
  body.bezierCurveTo(dx + w, dy + 0.48, dx + 0.67, dy + 0.41, dx + 0.6, dy + 0.34);
  body.bezierCurveTo(dx + 0.5, dy + 0.25, dx + 0.3, dy + 0.2, dx + 0.1, dy + 0.13);
  return { head, body };
}
function markTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const g = c.getContext("2d")!;
  g.fillStyle = "black";
  g.fillRect(0, 0, 1024, 1024);
  g.setTransform(365, 0, 0, 365, 512, 512 + 365 * 0.03);
  g.lineJoin = g.lineCap = "round";
  const line = 0.1, gap = 0.09;
  // the two behind
  g.strokeStyle = "white";
  g.lineWidth = line;
  for (const dx of [-0.53, 0.53]) { const p = person(g, dx, -0.27); g.stroke(p.head); g.stroke(p.body); }
  // the front one: first clear a gap round it (its silhouette filled, its outline widened), then draw it
  const f = person(g, 0, 0);
  g.fillStyle = g.strokeStyle = "black";
  g.fill(f.head); g.fill(f.body);
  g.lineWidth = line + 2 * gap;
  g.stroke(f.head); g.stroke(f.body);
  g.strokeStyle = "white";
  g.lineWidth = line;
  g.stroke(f.head); g.stroke(f.body);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

// A glyph's outline as a flat shape (a regular polygon or a circle, `w` wide), or a filled dot
function outline(points: [number, number][], w: number) {
  const s = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)));
  // the inner edge, offset inward by w along each corner's bisector
  const n = points.length, inner: THREE.Vector2[] = [];
  for (let i = 0; i < n; i++) {
    const p = new THREE.Vector2(...points[i]), a = new THREE.Vector2(...points[(i + n - 1) % n]), b = new THREE.Vector2(...points[(i + 1) % n]);
    const e0 = p.clone().sub(a).normalize(), e1 = b.clone().sub(p).normalize();
    const n0 = new THREE.Vector2(-e0.y, e0.x), n1 = new THREE.Vector2(-e1.y, e1.x); // inward for a counter-clockwise loop
    const bis = n0.clone().add(n1).normalize(), k = w / Math.max(0.2, bis.dot(n0));
    inner.push(p.clone().add(bis.multiplyScalar(k)));
  }
  s.holes.push(new THREE.Path(inner.reverse()));
  return new THREE.ShapeGeometry(s);
}
const ring = (r: number, w: number) => {
  const s = new THREE.Shape().absarc(0, 0, r, 0, Math.PI * 2, false);
  s.holes.push(new THREE.Path().absarc(0, 0, r - w, 0, Math.PI * 2, true));
  return new THREE.ShapeGeometry(s, 48);
};
const poly = (k: number, r: number, a0: number) => Array.from({ length: k }, (_, i) => {
  const a = a0 + (i / k) * Math.PI * 2;
  return [r * Math.cos(a), r * Math.sin(a)] as [number, number];
});
function glyph(i: number) {
  const w = 0.009;
  switch (i) {
    case 0: return new THREE.CircleGeometry(0.032, 40); // dot
    case 1: return outline(poly(4, 0.068, Math.PI / 4), w); // square
    case 2: return outline(poly(3, 0.07, Math.PI / 2), w); // triangle
    case 3: return outline(poly(4, 0.072, 0), w); // diamond
    case 4: return ring(0.062, w); // ring
    default: return outline([[-0.074, -0.042], [0.074, -0.042], [0.074, 0.042], [-0.074, 0.042]], w); // small rectangle
  }
}

export function layerView(tokens: Tokens): View<LayerPose> {
  const e = getEngine();
  const pal: Pal = palette(tokens);
  const scene = new THREE.Scene();
  const camera = studio(scene, e.env, pal);
  const { plate: P, token: T } = LAYER;

  // the plate, leaned toward the camera; everything on it turns with the arrival (yaw)
  const lean = new THREE.Group();
  lean.rotation.x = LAYER.tilt;
  lean.position.y = LAYER.y;
  scene.add(lean);
  const deck = new THREE.Group();
  lean.add(deck);

  // the plate: a thin disc, its top brushed and turned, its edge polished, with a micro-bevel at the top edge
  const plateGeo = new THREE.CylinderGeometry(P.R, P.R, P.depth, 256, 1);
  plateGeo.translate(0, -P.depth / 2, 0);
  const plate = new THREE.Mesh(plateGeo, [polished(pal), brushed(pal), polishedDark(pal)]);
  plate.onBeforeRender = (r) => {
    const on = r.getRenderTarget() === null;
    (plate.material as THREE.Material[]).forEach((m) => { m.colorWrite = on; m.depthWrite = on; });
  };
  deck.add(plate);
  // what the glass sees of the plate: an even light satin, so the frost and the tokens' glass carry no streaks of the
  // brushed metal's studio reflections (they read as light running through the glass)
  const plateSeen = new THREE.CircleGeometry(P.R, 128);
  plateSeen.rotateX(-Math.PI / 2);
  deck.add(onlyIn(new THREE.Mesh(plateSeen, new THREE.MeshBasicMaterial({ color: mix(pal.surface2, pal.muted, 0.32) })), true));
  for (const [r, m] of [[P.R - 0.002, polishedDark(pal)], [P.R - 0.016, polished(pal)]] as const) {
    const t = onlyIn(new THREE.Mesh(new THREE.TorusGeometry(r, 0.005, 10, 320), m), false);
    t.rotation.x = Math.PI / 2;
    deck.add(t);
  }

  // the tokens: clear glass, a thin polished chrome band at the foot and a fine chrome bead round the top edge, a glyph
  // etched into each top
  const glass = clear(pal, T.r, T.h), chrome = polished(pal);
  const cut = new THREE.MeshStandardMaterial({ color: mix(pal.ink, pal.surface2, 0.12), metalness: 0.1, roughness: 0.5 });
  const tokenGeo = new THREE.CylinderGeometry(T.r, T.r, T.h, 96, 1);
  tokenGeo.translate(0, T.h / 2, 0);
  const bandGeo = new THREE.CylinderGeometry(T.r + 0.003, T.r + 0.003, 0.02, 96, 1, true);
  bandGeo.translate(0, 0.01, 0);
  const beadGeo = new THREE.TorusGeometry(T.r - 0.004, 0.0075, 12, 120);
  beadGeo.rotateX(Math.PI / 2);
  beadGeo.translate(0, T.h, 0);
  // what the frost sees of a token (drawn into the transmission pass only): a pale disc with a faintly greyer rim, a
  // little lighter than the plate as the frost sees it, so under the frost each token blurs to a soft pale disc (its
  // polished chrome and dark glyph there would blur to dark stains, which read as dirt); on screen the polished parts
  const seenRim = new THREE.MeshBasicMaterial({ color: mix(pal.onDark, pal.surface2, 0.45) });
  const seenTop = new THREE.MeshBasicMaterial({ color: pal.onDark, toneMapped: false });
  const topGeo = new THREE.CircleGeometry(T.r - 0.01, 64);
  topGeo.rotateX(-Math.PI / 2);
  topGeo.translate(0, T.h - 0.004, 0);
  // and a fine dark hairline just inside the bead, so the top's edge reads crisp
  const dark = polishedDark(pal);
  const lineGeo = new THREE.TorusGeometry(T.r - 0.017, 0.0028, 8, 120);
  lineGeo.rotateX(Math.PI / 2);
  lineGeo.translate(0, T.h + 0.001, 0);
  const pucks = T.at.map((_, i) => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(tokenGeo, glass.mat));
    g.add(onlyIn(new THREE.Mesh(bandGeo, chrome), false), onlyIn(new THREE.Mesh(beadGeo, chrome), false), onlyIn(new THREE.Mesh(lineGeo, dark), false));
    g.add(onlyIn(new THREE.Mesh(bandGeo, seenRim), true), onlyIn(new THREE.Mesh(beadGeo, seenRim), true), onlyIn(new THREE.Mesh(topGeo, seenTop), true));
    const gl = glyph(i);
    gl.rotateX(-Math.PI / 2);
    gl.translate(0, T.h + 0.0012, 0);
    g.add(onlyIn(new THREE.Mesh(gl, cut), false));
    deck.add(g);
    return g;
  });

  // the core: a unit cylinder scaled to its radius and height each frame; frosted side and top (the top carries the people),
  // no bottom (it sits on the plate)
  const nTex = markTexture();
  const side = frost(pal, nTex, false), top = frost(pal, nTex, true);
  const none = new THREE.MeshBasicMaterial({ visible: false });
  const coreGeo = new THREE.CylinderGeometry(1, 1, 1, 192, 1);
  coreGeo.translate(0, 0.5, 0);
  const core = new THREE.Mesh(coreGeo, [side.mat, top.mat, none]);
  core.position.y = 0.0015;
  deck.add(core);
  // the collar: a low polished chrome bezel rising round the core's foot as it becomes the user's, with a fine bead at its lip (on screen
  // only, so the frost never smears it)
  // the core's edges, on screen only: at the top a dark hairline at the very edge and a bright one just inside it (the
  // stations' micro-bevel), and a fine dark line where it meets the plate
  const edge = (m: THREE.Material, tube: number) => {
    const g = new THREE.TorusGeometry(1, tube, 8, 320);
    g.rotateX(Math.PI / 2);
    const t = onlyIn(new THREE.Mesh(g, m), false);
    deck.add(t);
    return t;
  };
  const topDark = edge(polishedDark(pal), 0.0042), topBright = edge(polished(pal), 0.0036), foot = edge(polishedDark(pal), 0.004);
  const collarGeo = new THREE.CylinderGeometry(1, 1, 1, 192, 1, true);
  collarGeo.translate(0, 0.5, 0);
  const collar = onlyIn(new THREE.Mesh(collarGeo, polished(pal)), false);
  deck.add(collar);
  const lip = onlyIn(new THREE.Mesh(new THREE.TorusGeometry(1, 0.0065, 10, 320), polished(pal)), false);
  lip.rotation.x = Math.PI / 2;
  deck.add(lip);

  const apply = (p: LayerPose) => {
    const S = shapeOf(p.own);
    deck.rotation.y = p.yaw;
    scene.updateMatrixWorld();
    glass.deckInv.copy(deck.matrixWorld).invert();
    pucks.forEach((g, i) => g.position.set(...tokenAt(i, S.rT)));
    core.scale.set(S.R, S.h, S.R);
    side.set(S.green, 0);
    top.set(S.green, S.mark);
    // (unit rings scaled to the core's radius)
    const ringAt = (t: THREE.Mesh, r: number, y: number) => { t.scale.set(r, 1, r); t.position.y = y; };
    ringAt(topDark, S.R - 0.002, S.h + 0.0015);
    ringAt(topBright, S.R - 0.016, S.h + 0.0015);
    ringAt(foot, S.R + 0.002, 0.002);
    const c = S.collar;
    collar.visible = lip.visible = c > 0.002;
    // a low bezel round the foot, a third of the core's height, so the frosted green wall shows above it (B2)
    const ch = S.h * 0.33 * c;
    collar.scale.set(S.R + 0.006, Math.max(1e-3, ch), S.R + 0.006);
    lip.scale.set(S.R + 0.003, S.R + 0.003, 1);
    lip.position.y = ch;
  };
  return view(scene, camera, apply);
}
