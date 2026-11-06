import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { kit, type Tokens, type View } from "../gl";
import { PATTERN, SEAL, type SealPose } from "./seal.scene";

// Identity option "seal" (D80, lab), loaded with a dynamic import on the client only. The shared studio and materials
// (gl.ts `kit`): a thin frosted glass disc with a polished chrome edge, and under it a chrome base ring that the frost
// blurs (so the glass proves itself); above it a polished chrome seal, machined on a lathe (a chamfered face lip, a band
// of fine grip grooves, a stepped crown), its face a satin field with the engine-turned pattern standing in polished
// relief; in the glass beneath, the same pattern inlaid in green metal, the only green part. No drop shadows. The seal
// and the inlay are drawn on screen only, so the frost never smears them beside themselves (D75).

const { palette, mix, getEngine, backdrop, studio, frosted, polished, polishedDark, onlyIn, veiled, view } = kit;

// A lathe profile as separate bands, each with its own normal, so the machined edges stay crisp (one LatheGeometry
// would smooth its normals round every corner)
function lathe(pts: [number, number][], seg = 256) {
  const parts: THREE.BufferGeometry[] = [];
  for (let i = 0; i + 1 < pts.length; i++) {
    const g = new THREE.LatheGeometry([new THREE.Vector2(...pts[i]), new THREE.Vector2(...pts[i + 1])], seg);
    parts.push(g.toNonIndexed());
    g.dispose();
  }
  const m = mergeGeometries(parts);
  parts.forEach((g) => g.dispose());
  return m;
}

// The pattern as extruded pieces lying in the local xz plane, from height y0 up by `depth` (shape (sx, sy) → (x, z) =
// (sx, -sy), the same mapping as `patPt`); interlacing bands each lifted by their `z` hairs, so they never fight
function patternShapes() {
  const k = SEAL.RP, rad = (d: number) => (d * Math.PI) / 180;
  const out: { shape: THREE.Shape; z: number }[] = [];
  for (const b of PATTERN.bands) {
    const n = b.k ? 720 : 360;
    const at = (i: number, o: number) => {
      const t = (i / n) * Math.PI * 2, r = (b.r + b.a * Math.sin(b.k * t + rad(b.ph)) + o) * k;
      return new THREE.Vector2(b.c[0] * k + r * Math.cos(t), b.c[1] * k + r * Math.sin(t));
    };
    const shape = new THREE.Shape(Array.from({ length: n }, (_, i) => at(i, b.w / 2)));
    shape.holes.push(new THREE.Path(Array.from({ length: n }, (_, i) => at(n - i, -b.w / 2))));
    out.push({ shape, z: b.z });
  }
  for (const b of PATTERN.bars) {
    const c = Math.cos(rad(b.a)), s = Math.sin(rad(b.a)), w = (b.w * k) / 2;
    const p = (r: number, o: number) => new THREE.Vector2(r * k * c - o * s, r * k * s + o * c);
    out.push({ shape: new THREE.Shape([p(b.r0, -w), p(b.r1, -w), p(b.r1, w), p(b.r0, w)]), z: 0 });
  }
  const d = PATTERN.dot;
  out.push({ shape: new THREE.Shape().absarc(d.c[0] * k, d.c[1] * k, d.r * k, 0, Math.PI * 2, false), z: 0 });
  return out;
}
function patternGeo(y0: number, depth: number, bevel: number) {
  const parts = patternShapes().map(({ shape, z }) => {
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: depth - 2 * bevel, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel * 0.6, bevelSegments: 1, curveSegments: 64,
    });
    g.translate(0, 0, bevel + z * 0.0006);
    const flat = g.index ? g.toNonIndexed() : g;
    if (flat !== g) g.dispose();
    return flat;
  });
  const g = mergeGeometries(parts);
  parts.forEach((p) => p.dispose());
  g.rotateX(-Math.PI / 2);
  g.translate(0, y0, 0);
  return g;
}

// A radial mask (centre to edge, on the cylinder's caps) for the disc's soft veil toward its rim, as the data disc's
function rimMask() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, "black"); grad.addColorStop(0.62, "black"); grad.addColorStop(0.93, "gray"); grad.addColorStop(1, "white");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

// Turned metal: fine concentric hairlines about the pattern's centre (in the mesh's own xz plane), antialiased to the
// pixel and faded where they crowd, and the lathe's sheen, a broad bow tie of brighter metal along one diameter (toward
// the key light, upper left), as on any face turned on a lathe. Procedural, no texture.
function turned(m: THREE.MeshPhysicalMaterial, rings: number, sheen: number, depth: number, key: string) {
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vTurn;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvTurn = position;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vTurn;")
      .replace("#include <color_fragment>", `#include <color_fragment>
      {
        float r = length(vTurn.xz);
        float u = r * ${rings.toFixed(1)};
        float fu = fwidth(u);
        float d = abs(fract(u) - 0.5) / max(fu, 1e-4);
        float line = (1.0 - smoothstep(0.35, 1.1, d)) * (1.0 - smoothstep(0.25, 0.4, fu));
        float th = atan(vTurn.z, vTurn.x);
        float bow = pow(abs(cos(th - 2.3)), 5.0);
        diffuseColor.rgb *= (1.0 - ${sheen.toFixed(3)} + ${(2 * sheen).toFixed(3)} * bow) * (1.0 - ${depth.toFixed(3)} * line);
      }`);
  };
  m.customProgramCacheKey = () => `seal-turned-${key}`;
  return m;
}

export function sealView(tokens: Tokens): View<SealPose> {
  const e = getEngine();
  const pal = palette(tokens);
  const scene = new THREE.Scene();
  const camera = studio(scene, e.env, pal);
  // the page as the glass sees it, a touch brighter than the page, so the frost reads milky and light (as the data disc)
  scene.add(backdrop(mix(pal.surface, pal.onDark, 0.5), 0.86));

  const frame = new THREE.Group();
  frame.position.set(...SEAL.at);
  frame.rotation.x = SEAL.tilt;
  scene.add(frame);

  // ── The disc: thin frosted glass (its top at y = 0; transmission with roughness, a view-angle veil and a soft glow
  // toward the rim), its round side polished chrome, a dark and a bright hairline at the top edge
  const { R, thick } = SEAL;
  const body = new THREE.CylinderGeometry(R, R, thick, 200, 1);
  body.translate(0, -thick / 2, 0);
  const glass = veiled(frosted(pal.onDark, pal, 0.42), mix(pal.onDark, pal.muted, 0.04), 0.04, 0.45, 2.4, 0.06);
  glass.emissive = pal.onDark.clone();
  glass.emissiveMap = rimMask();
  glass.emissiveIntensity = 0.3;
  frame.add(new THREE.Mesh(body, [polished(pal), glass, glass]));
  const dark = new THREE.Mesh(new THREE.TorusGeometry(R - 0.002, 0.0055, 10, 256), polishedDark(pal));
  const bright = new THREE.Mesh(new THREE.TorusGeometry(R - 0.016, 0.005, 10, 256), polished(pal));
  dark.rotation.x = bright.rotation.x = Math.PI / 2;
  frame.add(onlyIn(dark, false), onlyIn(bright, false));

  // ── Under the glass, a satin chrome base ring and a finer one inside it (satin, so the frost blurs them evenly), wholly within the disc's outline: they are seen only
  // through the frost (softly through the top, so the blur proves the glass)
  const satin = new THREE.MeshPhysicalMaterial({ color: mix(pal.onDark, pal.ink, 0.35), metalness: 1, roughness: 0.32 });
  const base = new THREE.Mesh(new THREE.TorusGeometry(R * 0.8, 0.024, 24, 256), satin);
  base.rotation.x = Math.PI / 2;
  base.position.y = -thick - 0.05;
  const fine = new THREE.Mesh(new THREE.TorusGeometry(R * 0.68, 0.008, 12, 256), satin.clone());
  fine.rotation.x = Math.PI / 2;
  fine.position.y = -thick - 0.035;
  frame.add(base, fine);

  // ── The impression: the pattern in green metal (the only green part), turned like the seal's face, inlaid into the
  // glass and standing a hair proud of it, so its tops and their edges are crisp. On screen only, with nothing green
  // behind the glass: if the frost saw it, its refraction would shift and smear the green round the mark (D75)
  const green = turned(new THREE.MeshPhysicalMaterial({ color: mix(pal.green, pal.ink, 0.26), metalness: 0.95, roughness: 0.22 }), 420, 0.3, 0.12, "green");
  frame.add(onlyIn(new THREE.Mesh(patternGeo(-0.006, 0.006 + SEAL.inlay, 0.002), green), false));

  // ── The seal: lathe-turned chrome, its face down (local y = -H/2), its pattern standing from a satin recessed field
  const { Rs, H, bevel: b, relief, RP } = SEAL;
  const yaw = new THREE.Group();
  yaw.position.y = SEAL.lift;
  yaw.rotation.y = SEAL.yaw;
  frame.add(yaw);
  const seal = new THREE.Group();
  seal.rotation.x = SEAL.tip;
  yaw.add(seal);
  const y0 = -H / 2, rf = RP * 1.05; // the face's plane, and the recessed field's radius
  // the profile from the field's wall round the lip, the chamfer, the side with its grip grooves, to the crown
  const prof: [number, number][] = [[rf, y0 + relief], [rf, y0], [Rs - b, y0], [Rs, y0 + b], [Rs, y0 + 0.1]];
  const g0 = y0 + 0.1, pitch = 0.017, gd = 0.007;
  for (let i = 0; i < 9; i++) {
    const y = g0 + i * pitch;
    prof.push([Rs - gd, y + pitch * 0.35], [Rs, y + pitch * 0.7], [Rs, y + pitch]);
  }
  const yc = H / 2;
  prof.push([Rs, yc - b], [Rs - b, yc], [Rs * 0.8, yc], [Rs * 0.78, yc - 0.012], [0, yc - 0.012]);
  const parts: THREE.Mesh[] = [new THREE.Mesh(lathe(prof), polished(pal))];
  // the field: satin chrome, recessed by `relief`
  const fieldGeo = new THREE.CircleGeometry(rf, 160);
  fieldGeo.rotateX(Math.PI / 2);
  fieldGeo.translate(0, y0 + relief, 0);
  parts.push(new THREE.Mesh(fieldGeo, turned(new THREE.MeshPhysicalMaterial({ color: mix(pal.onDark, pal.ink, 0.42), metalness: 1, roughness: 0.4 }), 520, 0.18, 0.35, "field")));
  // the pattern in polished relief, its tops on the face's plane
  parts.push(new THREE.Mesh(patternGeo(y0, relief, 0.0015), turned(polished(pal), 420, 0.25, 0, "relief")));
  for (const p of parts) seal.add(onlyIn(p, false));

  return view(scene, camera, () => {});
}
