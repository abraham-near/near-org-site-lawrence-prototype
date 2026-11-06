import * as THREE from "three";
import { kit, type Tokens, type View } from "../gl";
import { BEZEL, BEZEL_FRAME, type BezelPose } from "./bezel.scene";

// Identity option "bezel" (D80, lab): the WebGL scene, loaded with a dynamic import. Every turned part is a profile
// revolved about the piece's axis (z, out of its face), with small fillets at the corners so each machined edge
// catches a fine line of studio light. Only the backdrop is drawn into the glass's transmission pass: everything
// opaque is on screen only, so the frost never refracts the chrome or the green beside it (D75).
const { palette, mix, getEngine, backdrop, studio, frosted, polished, polishedDark, greenBall, onlyIn, cleanEdge, view } = kit;

type Pt = [number, number]; // (radius, height) in the piece's frame

// A profile, anticlockwise in (r, h) (so the faces point outward), its corners rounded by `f` and a point added just
// inside each end of the straight runs, so a flat face keeps its own normal right up to its fillets. Open profiles
// (the disc, which ends on the axis) leave their two ends as they are.
function rounded(corners: Pt[], f: number[], n = 6, closed = true): Pt[] {
  const N = corners.length, arcs: Pt[][] = [];
  for (let i = 0; i < N; i++) {
    const p = corners[i], a = corners[(i + N - 1) % N], b = corners[(i + 1) % N], r = f[i] ?? 0;
    if (!r || (!closed && (i === 0 || i === N - 1))) { arcs.push([p]); continue; }
    const u = norm([a[0] - p[0], a[1] - p[1]]), v = norm([b[0] - p[0], b[1] - p[1]]);
    const th = Math.acos(Math.max(-1, Math.min(1, u[0] * v[0] + u[1] * v[1])));
    const t = r / Math.tan(th / 2), bis = norm([u[0] + v[0], u[1] + v[1]]), k = r / Math.sin(th / 2);
    const c: Pt = [p[0] + bis[0] * k, p[1] + bis[1] * k];
    const p1: Pt = [p[0] + u[0] * t, p[1] + u[1] * t], p2: Pt = [p[0] + v[0] * t, p[1] + v[1] * t];
    const a1 = Math.atan2(p1[1] - c[1], p1[0] - c[0]);
    let a2 = Math.atan2(p2[1] - c[1], p2[0] - c[0]);
    while (a2 - a1 > Math.PI) a2 -= Math.PI * 2;
    while (a1 - a2 > Math.PI) a2 += Math.PI * 2;
    arcs.push(Array.from({ length: n + 1 }, (_, j) => { const q = a1 + ((a2 - a1) * j) / n; return [c[0] + r * Math.cos(q), c[1] + r * Math.sin(q)] as Pt; }));
  }
  const out: Pt[] = [];
  for (let i = 0; i < (closed ? N : N - 1); i++) {
    const A = arcs[i], B = arcs[(i + 1) % N], s = A[A.length - 1], e = B[0];
    const l = Math.hypot(e[0] - s[0], e[1] - s[1]), d = Math.min(0.0015, l / 4) / (l || 1);
    out.push(...A, [s[0] + (e[0] - s[0]) * d, s[1] + (e[1] - s[1]) * d], [e[0] - (e[0] - s[0]) * d, e[1] - (e[1] - s[1]) * d]);
  }
  if (!closed) out.push(...arcs[N - 1]);
  return out;
}
function norm(v: Pt): Pt { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; }

// Revolve a closed profile about z (no seam: the last column joins the first). `rAt` may move a point's radius by its
// angle (the collar's flutes).
function revolve(profile: Pt[], seg: number, rAt?: (a: number, r: number, h: number) => number) {
  const P = profile.length, pos = new Float32Array(seg * P * 3), idx: number[] = [];
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    for (let j = 0; j < P; j++) {
      const [r0, h] = profile[j], r = rAt ? rAt(a, r0, h) : r0, o = (i * P + j) * 3;
      pos[o] = r * c; pos[o + 1] = r * s; pos[o + 2] = h;
    }
  }
  for (let i = 0; i < seg; i++) for (let j = 0; j < P; j++) {
    const a = i * P + j, b = ((i + 1) % seg) * P + j, c = i * P + ((j + 1) % P), d = ((i + 1) % seg) * P + ((j + 1) % P);
    idx.push(a, b, c, b, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  // on the axis every column meets at one point: give it the axis's own normal, so no star shows at the centre
  const nrm = g.getAttribute("normal") as THREE.BufferAttribute;
  for (let v = 0; v < seg * P; v++) {
    if (Math.hypot(pos[v * 3], pos[v * 3 + 1]) < 1e-6) nrm.setXYZ(v, 0, 0, Math.sign(nrm.getZ(v)) || 1);
  }
  return g;
}

// The frosted ring's milkiness: brighter toward its two edges, a little more on the upper left (the key light), by
// radius in the piece's frame
function milky(m: THREE.MeshPhysicalMaterial, color: THREE.Color, rIn: number, rOut: number) {
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uMilk = { value: color };
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vObjP;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvObjP = position;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform vec3 uMilk;\nvarying vec3 vObjP;")
      .replace("#include <opaque_fragment>", `{
        float rr = length(vObjP.xy);
        float k = clamp((rr - ${rIn.toFixed(4)}) / ${(rOut - rIn).toFixed(4)}, 0.0, 1.0);
        float edge = pow(1.0 - k, 6.0) * 0.6 + pow(k, 5.0);
        vec2 dir = normalize(vObjP.xy + vec2(1e-4));
        float key = 0.5 + 0.5 * dot(dir, normalize(vec2(-0.6, 0.8)));   // toward the key light, upper left
        outgoingLight = outgoingLight * (0.97 - 0.06 * (1.0 - key)) + uMilk * (0.02 + 0.2 * edge) * (0.6 + 0.4 * key);
      }
      #include <opaque_fragment>`);
  };
  m.customProgramCacheKey = () => "id-bezel-milky-1";
  return m;
}

// A polished hairline round the glass's edge (on screen only): the bright line that makes a thin glass edge read
function hairline(r: number, tube: number, z: number, m: THREE.Material) {
  const t = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 10, 360), m);
  t.position.z = z;
  return t;
}

export function bezelView(tokens: Tokens): View<BezelPose> {
  const e = getEngine();
  const pal = palette(tokens);
  const scene = new THREE.Scene();
  const camera = studio(scene, e.env, pal);
  // the page as the glass sees it, at partial alpha (as the assets washer's), so the ridges behind show faintly through
  scene.add(backdrop(pal.surface, 0.62));

  const frame = new THREE.Group();
  frame.rotation.set(BEZEL_FRAME.x, BEZEL_FRAME.y, 0);
  frame.scale.setScalar(BEZEL.scale);
  scene.add(frame);
  // every metal part is the stations' polished chrome; the turned parts have rounded, crowned profiles, so they carry
  // the studio's light and dark round them instead of one flat tone
  const chrome = polished(pal), dark = polishedDark(pal);
  const screen = (m: THREE.Mesh) => onlyIn(m, false);

  // the case: fixed, its top crowned; its index a fine raised bar at 12 o'clock
  const C = BEZEL.case;
  frame.add(screen(new THREE.Mesh(revolve(rounded([[C.rIn, C.zBot], [C.rOut, C.zBot], [C.rOut, C.zTop - 0.01], [C.rOut - 0.045, C.zTop], [C.rIn, C.zTop]], [0.004, 0.006, 0.03, 0.04, 0.008], 8), 360), chrome)));
  const I = BEZEL.index;
  const index = screen(new THREE.Mesh(new THREE.BoxGeometry(I.r1 - I.r0, I.w, I.h), chrome));
  index.position.set(0, (I.r0 + I.r1) / 2, C.zTop + I.h / 2 - 0.002);
  index.rotation.z = Math.PI / 2;
  frame.add(index);

  // the bezel, which turns
  const bezel = new THREE.Group();
  frame.add(bezel);
  const L = BEZEL.collar;
  // the flutes: on the outer wall and up into its chamfer, run out just short of the top, so the collar's top edge stays
  // a clean circle
  const sat = (v: number) => Math.max(0, Math.min(1, v));
  const flute = (a: number, r: number, h: number) => {
    const w = sat((r - (L.rOut - 0.014)) / 0.014) * sat((L.zTop - 0.004 - h) / 0.006);
    const u = ((a / (Math.PI * 2)) * L.flutes) % 1;
    return r - L.depth * w * Math.pow(Math.sin(Math.PI * u), 0.8);
  };
  bezel.add(screen(new THREE.Mesh(revolve(rounded([[L.rIn, L.zBot], [L.rOut, L.zBot], [L.rOut, L.zTop - 0.01], [L.rOut - 0.018, L.zTop], [L.rIn, L.zTop]], [0.004, 0.006, 0.014, 0.012, 0.004], 8), L.flutes * 10, flute), chrome)));

  // the glass: a thin flat ring, frosted through, its two top edges crisp (a dark hairline at the very edge, a bright one
  // just inside it, as the data disc's)
  const G = BEZEL.glass;
  const frost = frosted(mix(pal.surface2, pal.onDark, 0.6), pal, 0.36);
  frost.thickness = 0.1;
  const glass = milky(frost, mix(pal.onDark, pal.muted, 0.04), G.rIn, G.rOut);
  bezel.add(new THREE.Mesh(revolve(rounded([[G.rIn, G.zBot], [G.rOut, G.zBot], [G.rOut, G.zTop], [G.rIn, G.zTop]], [0.003, 0, 0, 0.004]), 360), glass));
  bezel.add(
    screen(hairline(G.rIn + 0.003, 0.0042, G.zTop - 0.002, dark)), screen(hairline(G.rIn + 0.016, 0.004, G.zTop, chrome)),
    screen(hairline(G.rOut - 0.012, 0.004, G.zTop, chrome)),
  );
  // behind the glass, seen only through it (the glass covers them on screen at any tilt): two fine chrome rings, which the
  // frost blurs into soft bright bands, so the glass reads as glass. Never the green (D75).
  for (const b of BEZEL.back) {
    // (a satin polish: a mirror finish breaks into blotches of the studio's lights once the frost blurs it)
    const t = onlyIn(new THREE.Mesh(new THREE.TorusGeometry(b.r, b.tube, 16, 360), new THREE.MeshPhysicalMaterial({ color: pal.onDark, metalness: 1, roughness: 0.3 })), true);
    t.position.z = BEZEL.backZ;
    bezel.add(t);
  }

  // the graduations: inlaid chrome bars every 3°, longer every 15° (one click); at the zero a polished bead
  const D = BEZEL.grad, box = new THREE.BoxGeometry(1, 1, 1);
  const minor = new THREE.InstancedMesh(box, chrome, BEZEL.ticks), major = new THREE.InstancedMesh(box.clone(), chrome, BEZEL.ticks / 5);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), zAxis = new THREE.Vector3(0, 0, 1);
  let nMinor = 0, nMajor = 0;
  for (let i = 1; i < BEZEL.ticks; i++) {
    const a = Math.PI / 2 + (i / BEZEL.ticks) * Math.PI * 2, big = i % 5 === 0, r0 = big ? D.major : D.minor;
    const rm = (r0 + D.r1) / 2;
    q.setFromAxisAngle(zAxis, a);
    m4.compose(new THREE.Vector3(rm * Math.cos(a), rm * Math.sin(a), G.zTop + D.h / 2 - 0.0015), q, new THREE.Vector3(D.r1 - r0, big ? D.wMajor : D.wMinor, D.h));
    if (big) major.setMatrixAt(nMajor++, m4); else minor.setMatrixAt(nMinor++, m4);
  }
  minor.count = nMinor; major.count = nMajor;
  bezel.add(screen(minor), screen(major));
  const Z = BEZEL.zero;
  const bead = screen(new THREE.Mesh(new THREE.SphereGeometry(Z.bead, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), chrome));
  bead.rotation.x = Math.PI / 2;
  bead.position.set(0, Z.r, G.zTop - 0.002);
  bezel.add(bead);

  // the thin polished ring inside the glass
  const R = BEZEL.ring;
  frame.add(screen(hairline(R.r, R.tube, R.z, chrome)));

  // the hub: turned chrome, a shallow cone stepping up to the jewel's setting
  const H = BEZEL.hub, J = BEZEL.jewel;
  frame.add(screen(new THREE.Mesh(revolve(rounded([
    [0, -0.03], [H.r, -0.03], [H.r, 0.008], [0.24, 0.026], [J.r + 0.03, 0.03], [J.r + 0.03, J.z + 0.022], [J.r + 0.004, J.z + 0.022], [J.r + 0.004, J.z], [0, J.z],
  ], [0, 0.004, 0.008, 0.02, 0.006, 0.008, 0.004, 0.002, 0], 6, false), 360), chrome)));

  // the jewel: the account, a small green cabochon set in the hub
  const Rs = (J.r * J.r + J.h * J.h) / (2 * J.h), th = Math.acos((Rs - J.h) / Rs);
  const jewel = screen(new THREE.Mesh(new THREE.SphereGeometry(Rs, 96, 48, 0, Math.PI * 2, 0, th), cleanEdge(greenBall(pal), mix(pal.green, pal.ink, 0.5))));
  jewel.rotation.x = Math.PI / 2;
  jewel.position.z = J.z + J.h - Rs;
  frame.add(jewel);

  return view(scene, camera, (p) => { bezel.rotation.z = p.turn; });
}
