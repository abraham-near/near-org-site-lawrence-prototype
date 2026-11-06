import * as THREE from "three";
import { kit, type Tokens, type View } from "../gl";
import { AXIS, REFINED, ringTurn, type RefinedPose } from "./refined.scene";

// Identity option E, "refined" (D80, lab), in the shared studio (loaded with a dynamic import, client only): a slim
// machined green ring floating over a broad frosted glass disc with a chrome micro-bevel. The ring is drawn on screen
// only, so the disc's transmission never smears its green beside it (D75).
const { palette, mix, getEngine, backdrop, studio, frosted, polished, polishedDark, greenBall, onlyIn, view } = kit;

// A radial mask (centre to edge) for the disc's soft glow toward its rim
function rimMask() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, "black"); grad.addColorStop(0.6, "black"); grad.addColorStop(0.92, "gray"); grad.addColorStop(1, "white");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

// The ring's machined section, lathed about its axis: a slim band with 45° chamfers on all four edges and a fine
// V-groove cut round the middle of its top face. Each facet is its own strip, so the edges stay crisp (no smoothing
// across a chamfer).
function ringStrips(r: number, w: number, h: number) {
  const ri = r - w / 2, ro = r + w / 2, hh = h / 2, c = 0.011, g = 0.006, gd = 0.004;
  const pts: [number, number][] = [
    [ro - c, -hh], [ro, -hh + c], [ro, hh - c], [ro - c, hh],
    [r + g, hh], [r, hh - gd], [r - g, hh],
    [ri + c, hh], [ri, hh - c], [ri, -hh + c], [ri + c, -hh], [ro - c, -hh],
  ];
  const out: THREE.BufferGeometry[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    out.push(new THREE.LatheGeometry([new THREE.Vector2(...pts[i]), new THREE.Vector2(...pts[i + 1])], 512));
  }
  return out;
}

// The ring's outer face, machined: a fine straight knurl round the band between its chamfers (a hairline every degree,
// antialiased to the pixel and faded where the lines crowd toward the outline, so it never shimmers), and one index
// notch cut across the whole face at the front left, where the turn can be read from later
function knurled(m: THREE.MeshPhysicalMaterial, r: number, h: number) {
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vObj; varying vec3 vObjN;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvObj = position; vObjN = normal;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vObj; varying vec3 vObjN;")
      .replace("#include <color_fragment>", `#include <color_fragment>
      {
        float rad = length(vObj.xz);
        float outer = step(${r.toFixed(4)}, rad) * (1.0 - smoothstep(0.25, 0.45, abs(normalize(vObjN).y)));
        float a = atan(vObj.z, vObj.x);
        float u = a * ${(360 / (2 * Math.PI)).toFixed(4)};          // one line a degree
        float fu = fwidth(u);
        float d = abs(fract(u) - 0.5) / max(fu, 1e-4);
        float line = 1.0 - smoothstep(0.3, 1.0, d);
        float fade = 1.0 - smoothstep(0.22, 0.4, fu);
        float band = 1.0 - smoothstep(${(h * 0.26).toFixed(4)}, ${(h * 0.32).toFixed(4)}, abs(vObj.y));
        float knurl = line * fade * band * outer;
        // the index notch: a slot about a degree and a half wide, centred at 118° (front left)
        float da = abs(mod(a - radians(118.0) + PI, 2.0 * PI) - PI);
        float notch = (1.0 - smoothstep(0.011, 0.015, da)) * step(${(r * 0.96).toFixed(4)}, rad);
        diffuseColor.rgb *= (1.0 - 0.45 * knurl) * (1.0 - 0.7 * notch);
      }`);
  };
  m.customProgramCacheKey = () => "o3-identity-refined-knurl-1";
  return m;
}

export function refinedView(tokens: Tokens): View<RefinedPose> {
  const e = getEngine();
  const pal = palette(tokens);
  const scene = new THREE.Scene();
  const camera = studio(scene, e.env, pal);
  // the page as the glass sees it, a touch brighter than the page (as the data disc), so the frost reads milky and light
  scene.add(backdrop(mix(pal.surface, pal.onDark, 0.5), 0.86));

  const frame = new THREE.Group();
  frame.rotation.x = REFINED.tilt;
  frame.position.set(...REFINED.pos);
  scene.add(frame);

  // the disc: milky frosted glass faces, its round side polished metal
  const { R, thick } = REFINED.disc;
  // (frosted less than the data disc: the hoop under it should read as a soft line through the glass, not a smudge)
  const glass = frosted(pal.onDark, pal, 0.34);
  glass.emissive = pal.onDark.clone();
  glass.emissiveMap = rimMask();
  glass.emissiveIntensity = 0.3;
  // seen this low, the frost's grazing reflection picks up the studio's dark panels as smudges: kept quiet
  glass.specularIntensity = 0.35;
  glass.envMapIntensity = 0.8;
  for (const y of [thick / 2, -thick / 2]) {
    const face = new THREE.CircleGeometry(R, 200);
    face.rotateX(y > 0 ? -Math.PI / 2 : Math.PI / 2);
    face.translate(0, y, 0);
    frame.add(new THREE.Mesh(face, glass));
  }
  // the round side, on screen only: if the glass saw its dark chrome in the transmission pass, the frost would blur it
  // into grey smudges across the face
  // (its studio turned over for this part only: seen this low, plain chrome mirrors the studio's dark floor and reads
  // as gunmetal; flipped, the side and the bevel catch the bright ceiling and read as polished chrome)
  const bright = (m: THREE.MeshPhysicalMaterial) => { m.envMap = e.env; m.envMapRotation.set(Math.PI, 0, 0); return m; };
  const side = bright(polished(pal));
  frame.add(onlyIn(new THREE.Mesh(new THREE.CylinderGeometry(R, R, thick, 200, 1, true), side), false));
  // the micro bevel on each face: a dark hairline at the very edge and a bright one just inside it
  for (const y of [thick / 2, -thick / 2]) {
    const dark = new THREE.Mesh(new THREE.TorusGeometry(R - 0.002, 0.0062, 12, 320), polishedDark(pal));
    const lit = new THREE.Mesh(new THREE.TorusGeometry(R - 0.018, 0.0055, 12, 320), bright(polished(pal)));
    for (const m of [dark, lit]) { m.rotation.x = Math.PI / 2; m.position.y = y; frame.add(onlyIn(m, false)); }
  }

  // a fine chrome hoop hung under the disc: its front arc comes out sharp below the rim, the rest passes under the glass
  // and the frost blurs it, so the disc reads as glass (chrome, not the green: D75)
  const U = REFINED.under;
  // (on screen polished chrome; through the frost the glass sees a quieter, matte grey version of it, so the blurred
  // arc reads as a soft line under the glass instead of dissolving into the frost's white)
  const hoopGeo = new THREE.TorusGeometry(U.r, U.tube, 16, 400);
  const hoop = onlyIn(new THREE.Mesh(hoopGeo, bright(polished(pal))), false);
  const hoopSeen = onlyIn(new THREE.Mesh(hoopGeo.clone(), new THREE.MeshStandardMaterial({ color: mix(pal.ink, pal.surface2, 0.62), metalness: 0.2, roughness: 0.6 })), true);
  for (const m of [hoop, hoopSeen]) { m.rotation.x = Math.PI / 2; m.position.y = U.y; frame.add(m); }

  // the ring: green metal, machined, on screen only
  const { c, r, w, h } = REFINED.ring;
  const pivot = new THREE.Group();
  pivot.position.set(...c);
  frame.add(pivot);
  const metal = knurled(greenBall(pal), r, h);
  metal.side = THREE.DoubleSide;
  for (const g of ringStrips(r, w, h)) pivot.add(onlyIn(new THREE.Mesh(g, metal), false));
  const axis = new THREE.Vector3(...AXIS);

  return view(scene, camera, (p) => {
    pivot.quaternion.setFromAxisAngle(axis, ringTurn(p));
  });
}
