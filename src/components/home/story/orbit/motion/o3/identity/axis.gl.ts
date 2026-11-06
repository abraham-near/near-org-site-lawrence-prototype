import * as THREE from "three";
import { kit, type Tokens, type View } from "../gl";
import { AXIS, PIN, plateY, type AxisPose } from "./axis.scene";

// Identity option "axis" (D80, lab), its WebGL: loaded with a dynamic import on the client only, in the shared studio.
// Thin frosted glass plates, each with a fine chrome micro-bevel, evenly spaced on one axis, and one polished green pin
// through all of them. The pin is drawn twice: polished on screen (seen sharp wherever no glass is in front of it), and
// a quieter matte green into the glass's transmission pass only, so where it runs behind a plate the frost diffuses it
// and it stays the token's green.
const { palette, mix, getEngine, backdrop, studio, frosted, polished, polishedDark, greenBall, onlyIn, view } = kit;

// The plate's face, drawn once on a canvas (u, v about the centre, as three's cylinder caps map them): a soft milky glow
// toward the rim for the emissive map, and for the colour map one etched hairline circle just inside the bevel, which
// darkens the light through the glass a touch (radial ticks were tried: at this grazing angle they vanish)
const TEX = 2048;
function face() {
  const make = (draw: (g: CanvasRenderingContext2D, c: number) => void) => {
    const cv = document.createElement("canvas");
    cv.width = cv.height = TEX;
    const g = cv.getContext("2d")!;
    draw(g, TEX / 2);
    return cv;
  };
  const glow = make((g, c) => {
    const grad = g.createRadialGradient(c, c, 0, c, c, c);
    grad.addColorStop(0, "black"); grad.addColorStop(0.6, "black"); grad.addColorStop(0.92, "gray"); grad.addColorStop(1, "white");
    g.fillStyle = grad;
    g.fillRect(0, 0, TEX, TEX);
  });
  const etch = make((g, c) => {
    g.fillStyle = "white";
    g.fillRect(0, 0, TEX, TEX);
    g.strokeStyle = "rgb(150,150,150)";
    g.lineWidth = 2.2;
    g.beginPath();
    g.arc(c, c, c * 0.875, 0, Math.PI * 2);
    g.stroke();
  });
  return { glow, etch };
}

// Frosted glass blurs what is close behind it less than what is far behind it. three's transmission blurs by a single
// roughness, so here the blur grows with the distance from the plate's centre, where the pin passes: seen a little from
// above, the pin just under a plate shows through that plate near its centre (nearly sharp), and further down through
// glass further out (soft). Only the transmission's roughness changes; the plate's own sheen keeps its frost.
function closeSharp(m: THREE.MeshPhysicalMaterial, rough0: number, r0: number, r1: number) {
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec2 vPlate;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvPlate = position.xz;");
    // (only the blur of the transmitted sample: the Fresnel split keeps the plate's own roughness, so the face stays even)
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", `#include <common>\nvarying vec2 vPlate;\nfloat txRough(float r) { return mix(${rough0.toFixed(3)}, r, smoothstep(${r0.toFixed(3)}, ${r1.toFixed(3)}, length(vPlate))); }`)
      .replace("#include <transmission_pars_fragment>", THREE.ShaderChunk.transmission_pars_fragment.replaceAll(
        "getTransmissionSample( refractionCoords, roughness,", "getTransmissionSample( refractionCoords, txRough( roughness ),"));
  };
  m.customProgramCacheKey = () => `id-axis-sharp-${rough0}-${r0}-${r1}`;
  return m;
}

// The pin's machined profile, turned about y: a plain shaft with a fine chamfer at each end
function pinGeometry(r: number, y0: number, y1: number) {
  const c = r * 0.45;
  const pts = [
    [0, y0], [r - c, y0], [r, y0 + c], [r, y1 - c], [r - c, y1], [0, y1],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(pts, 48);
}

export function axisView(tokens: Tokens): View<AxisPose> {
  const e = getEngine();
  const pal = palette(tokens);
  const scene = new THREE.Scene();
  const camera = studio(scene, e.env, pal);
  // the page as the glass sees it, a touch brighter than the page, so the frost reads milky and light
  scene.add(backdrop(mix(pal.surface, pal.onDark, 0.6), 0.86));

  const frame = new THREE.Group();
  frame.rotation.x = AXIS.tilt;
  frame.position.set(AXIS.x, AXIS.y, 0);
  scene.add(frame);

  const { R, thick } = AXIS;
  const { glow: glowCanvas, etch: etchCanvas } = face();
  const aniso = e.renderer.capabilities.getMaxAnisotropy();
  const glow = new THREE.CanvasTexture(glowCanvas), etch = new THREE.CanvasTexture(etchCanvas);
  etch.colorSpace = THREE.SRGBColorSpace;
  glow.anisotropy = etch.anisotropy = aniso; // the plates are seen at a grazing 9°: keep the etching crisp
  const glass = closeSharp(frosted(mix(pal.onDark, pal.surface2, 0.08), pal, 0.42), 0.12, 0, 0.9);
  glass.thickness = 0.03;
  glass.specularIntensity = 0.55; // the faces keep an even sheen: no dark smudges of the studio across them
  glass.emissive = pal.onDark.clone();
  glass.emissiveMap = glow;
  glass.map = etch;
  glass.emissiveIntensity = 0.38;
  // the plate's edge: bright, softly brushed chrome, so the thin band reads silver rather than as a dark outline
  const edge = new THREE.MeshPhysicalMaterial({ color: pal.onDark, metalness: 1, roughness: 0.3, envMapIntensity: 1.6 });
  const dark = polishedDark(pal), bright = polished(pal);
  const body = new THREE.CylinderGeometry(R, R, thick, 192, 1);
  const hairDark = new THREE.TorusGeometry(R - 0.001, 0.0024, 10, 256);
  const hairBright = new THREE.TorusGeometry(R - 0.012, 0.0032, 10, 256);
  hairDark.rotateX(Math.PI / 2);
  hairBright.rotateX(Math.PI / 2);
  for (let k = 0; k < AXIS.n; k++) {
    const plate = new THREE.Group();
    plate.position.y = plateY(k);
    plate.add(new THREE.Mesh(body, [edge, glass, glass]));
    // the micro-bevel round the top face: a dark hairline at the very edge and a bright one just inside it
    const d = new THREE.Mesh(hairDark, dark), b = new THREE.Mesh(hairBright, bright);
    d.position.y = b.position.y = thick / 2;
    plate.add(d, b);
    frame.add(plate);
  }

  // the pin: polished green on screen; a quieter matte green as the glass sees it
  const shaft = pinGeometry(AXIS.pin, PIN.bottom, PIN.top);
  frame.add(onlyIn(new THREE.Mesh(shaft, greenBall(pal)), false));
  frame.add(onlyIn(new THREE.Mesh(shaft.clone(), new THREE.MeshPhysicalMaterial({
    color: mix(pal.green, pal.ink, 0.32), metalness: 0.85, roughness: 0.28,
  })), true));

  const v = view<AxisPose>(scene, camera, () => {}); // static: nothing moves
  return { ...v, dispose: () => { etch.dispose(); v.dispose(); } }; // (the shared dispose frees the emissive map only)
}
