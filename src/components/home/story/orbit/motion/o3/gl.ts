import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { CAM, CAM_POS } from "./geo";
import { ASSETS, DATA, DATA_TILT, type AssetsPose, type DataPose } from "./scenes";

// Option 3's WebGL (D72), loaded with a dynamic import on the client only. One renderer for the whole page: each
// drawing renders its scene into the corner of the shared canvas and copies it into its own 2D canvas straight away
// (transparent, so the page shows round the glass). A neutral studio (RoomEnvironment through PMREM) lights everything;
// one soft key light from the upper left. The frosted glass is MeshPhysicalMaterial transmission with roughness, so the
// green ball behind the disc is genuinely blurred by three's transmission pass.
//
// The glass sees a backdrop of the page's own surface colour (drawn into the transmission pass only, never on screen),
// at partial alpha, so the frost reads as milky glass over the light page and lets the lines under it show, muted.

// Every material colour comes from the page's tokens, read at runtime
export type Tokens = { green: string; surface: string; surface2: string; onDark: string; ink: string };
type Pal = { green: THREE.Color; surface: THREE.Color; surface2: THREE.Color; onDark: THREE.Color; ink: THREE.Color };
const palette = (t: Tokens): Pal => ({
  green: new THREE.Color(t.green), surface: new THREE.Color(t.surface), surface2: new THREE.Color(t.surface2),
  onDark: new THREE.Color(t.onDark), ink: new THREE.Color(t.ink),
});
const mix = (a: THREE.Color, b: THREE.Color, k: number) => a.clone().lerp(b, k);
type Engine = { renderer: THREE.WebGLRenderer; env: THREE.Texture; users: number };
let engine: Engine | null = null;
let release = 0;

function getEngine(): Engine {
  if (engine) { clearTimeout(release); return engine; }
  const canvas = document.createElement("canvas");
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, premultipliedAlpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(1); // the drawings pass device pixels (capped at 2×) themselves
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.autoClear = false;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = pmrem.fromScene(room, 0.06).texture; // a little blurred, so chrome reads as smooth studio light
  room.dispose();
  pmrem.dispose();
  engine = { renderer, env, users: 0 };
  return engine;
}

function dropEngine() {
  if (!engine || --engine.users > 0) return;
  // a short grace, so a remount (fast refresh, a re-render) doesn't rebuild the studio
  release = window.setTimeout(() => {
    if (!engine || engine.users > 0) return;
    engine.env.dispose();
    engine.renderer.dispose();
    engine.renderer.forceContextLoss();
    engine = null;
  }, 1500);
}

// The page surface, seen by the glass only
function backdrop(color: THREE.Color, alpha: number) {
  const mat = new THREE.ShaderMaterial({
    uniforms: { c: { value: color }, a: { value: alpha } },
    vertexShader: "void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: "uniform vec3 c; uniform float a; void main(){ gl_FragColor = vec4(c, a); }",
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), mat);
  mesh.position.set(-CAM_POS[0] * 0.8, -CAM_POS[1] * 0.8, -CAM_POS[2] * 0.8); // well behind everything, facing the lens
  mesh.lookAt(...CAM_POS);
  mesh.renderOrder = -1;
  mesh.onBeforeRender = (r) => { mat.colorWrite = r.getRenderTarget() !== null; };
  return mesh;
}

function studio(scene: THREE.Scene, env: THREE.Texture, pal: Pal) {
  scene.environment = env;
  scene.environmentIntensity = 1;
  const key = new THREE.DirectionalLight(pal.onDark, 1.1);
  key.position.set(-4, 6, 5);
  scene.add(key);
  const camera = new THREE.PerspectiveCamera(CAM.fov, 4 / 3, 1, 120);
  camera.position.set(...CAM_POS);
  camera.lookAt(0, 0, 0);
  return camera;
}

const frosted = (tint: THREE.Color, pal: Pal, roughness: number) => new THREE.MeshPhysicalMaterial({
  color: tint, metalness: 0, roughness, transmission: 1, thickness: 0.18, ior: 1.45,
  specularIntensity: 0.9, attenuationColor: pal.surface, attenuationDistance: 1.6, premultipliedAlpha: true,
});
const polished = (pal: Pal) => new THREE.MeshPhysicalMaterial({ color: pal.onDark, metalness: 1, roughness: 0.08 });
const polishedDark = (pal: Pal) => new THREE.MeshPhysicalMaterial({ color: mix(pal.ink, pal.surface2, 0.35), metalness: 1, roughness: 0.2 });
const chromeBall = (pal: Pal) => new THREE.MeshPhysicalMaterial({ color: pal.onDark, metalness: 1, roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.05 });
const greenBall = (pal: Pal) => new THREE.MeshPhysicalMaterial({
  color: pal.green, metalness: 0.92, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.06,
});

// Draw a mesh only into the glass's transmission pass (seen through the frost), or only on screen
const onlyIn = (mesh: THREE.Mesh, glass: boolean) => {
  const m = mesh.material as THREE.Material;
  mesh.onBeforeRender = (r) => { const on = (r.getRenderTarget() !== null) === glass; m.colorWrite = on; m.depthWrite = on; };
  return mesh;
};

// A radial mask (centre to edge) for the disc's soft inner glow toward its rim
function rimMask() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, "black"); grad.addColorStop(0.55, "black"); grad.addColorStop(0.9, "gray"); grad.addColorStop(1, "white");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

// A soft round shadow (an alpha mask in the ink colour), for a ball sitting on the glass and the ring over the page
function softShadow(ink: THREE.Color, opacity: number) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "white"); grad.addColorStop(0.45, "gray"); grad.addColorStop(1, "black");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const mask = new THREE.CanvasTexture(c);
  const mat = new THREE.MeshBasicMaterial({ color: ink, alphaMap: mask, transparent: true, opacity, depthWrite: false, toneMapped: false });
  const geo = new THREE.PlaneGeometry(1, 1);
  geo.rotateX(-Math.PI / 2);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData.mask = mask;
  return mesh;
}

export type View<P> = { update: (pose: P) => void; draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void; dispose: () => void };

function view<P>(scene: THREE.Scene, camera: THREE.Camera, update: (pose: P) => void): View<P> {
  const e = getEngine();
  e.users++;
  return {
    update,
    draw(ctx, w, h) {
      const r = e.renderer, c = r.domElement;
      if (c.width < w || c.height < h) r.setSize(Math.max(c.width, w), Math.max(c.height, h), false);
      r.setViewport(0, 0, w, h);
      r.setScissor(0, 0, w, h);
      r.setScissorTest(true);
      r.clear();
      r.render(scene, camera);
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(c, 0, c.height - h, w, h, 0, 0, w, h);
    },
    dispose() {
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
          (o.userData.mask as THREE.Texture | undefined)?.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => (m as THREE.MeshPhysicalMaterial).emissiveMap?.dispose());
        }
      });
      scene.clear();
      dropEngine();
    },
  };
}

export function dataView(tokens: Tokens): View<DataPose> {
  const e = getEngine();
  const pal = palette(tokens);
  const scene = new THREE.Scene();
  const camera = studio(scene, e.env, pal);
  // the page as the glass sees it, a touch brighter than the page, so the frost reads milky and light
  scene.add(backdrop(mix(pal.surface, pal.onDark, 0.5), 0.86));

  const frame = new THREE.Group();
  frame.rotation.x = DATA_TILT;
  scene.add(frame);
  const disc = new THREE.Group();
  frame.add(disc);
  // the frosted disc: bright milky glass with a soft glow toward its rim; its round side polished metal
  const body = new THREE.CylinderGeometry(DATA.R, DATA.R, DATA.thick, 160, 1);
  body.rotateX(Math.PI / 2);
  const glass = frosted(pal.onDark, pal, 0.55);
  glass.emissive = pal.onDark.clone();
  glass.emissiveMap = rimMask();
  glass.emissiveIntensity = 0.32;
  disc.add(new THREE.Mesh(body, [polished(pal), glass, glass]));
  // the micro bevel on each face: a dark hairline at the very edge and a bright one just inside it
  for (const z of [DATA.thick / 2, -DATA.thick / 2]) {
    const dark = new THREE.Mesh(new THREE.TorusGeometry(DATA.R - 0.002, 0.0062, 12, 240), polishedDark(pal));
    const bright = new THREE.Mesh(new THREE.TorusGeometry(DATA.R - 0.017, 0.0058, 12, 240), polished(pal));
    dark.position.z = bright.position.z = z;
    disc.add(dark, bright);
  }
  // the ball: polished metal on screen; through the frost the glass sees a quieter, matte version of the same green,
  // so the diffused ball stays the token's green instead of blooming into a bright mint
  const sphere = new THREE.SphereGeometry(DATA.ball, 64, 48);
  const ball = onlyIn(new THREE.Mesh(sphere, greenBall(pal)), false);
  const seen = onlyIn(new THREE.Mesh(sphere.clone(), new THREE.MeshStandardMaterial({ color: mix(mix(pal.green, pal.ink, 0.45), pal.surface2, 0.12), metalness: 0.2, roughness: 0.6 })), true);
  frame.add(ball, seen);

  return view(scene, camera, (p) => {
    disc.rotation.y = p.yaw;
    ball.position.set(...p.ball);
    seen.position.set(...p.ball);
  });
}

export function assetsView(tokens: Tokens): View<AssetsPose> {
  const e = getEngine();
  const pal = palette(tokens);
  const scene = new THREE.Scene();
  const camera = studio(scene, e.env, pal);
  scene.add(backdrop(pal.surface, 0.62));

  const frame = new THREE.Group();
  frame.rotation.x = ASSETS.tilt;
  frame.position.y = ASSETS.y;
  scene.add(frame);
  // the washer: a frosted annulus with polished, slightly bevelled edges
  const shape = new THREE.Shape().absarc(0, 0, ASSETS.rOut, 0, Math.PI * 2, false);
  shape.holes.push(new THREE.Path().absarc(0, 0, ASSETS.rIn, 0, Math.PI * 2, true));
  const bev = 0.012;
  const ring = new THREE.ExtrudeGeometry(shape, { depth: ASSETS.thick - 2 * bev, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: 3, curveSegments: 180 });
  ring.translate(0, 0, -(ASSETS.thick - 2 * bev) / 2);
  ring.rotateX(-Math.PI / 2);
  frame.add(new THREE.Mesh(ring, [frosted(mix(pal.surface2, pal.onDark, 0.2), pal, 0.42), polished(pal)]));
  const geo = new THREE.SphereGeometry(ASSETS.ball, 64, 48);
  const chrome = new THREE.Mesh(geo, chromeBall(pal));
  const greenM = new THREE.Mesh(geo.clone(), greenBall(pal));
  frame.add(chrome, greenM);
  // where the balls sit on the glass, and the ring's own soft shadow on the page below
  const contact = [softShadow(pal.ink, 0.5), softShadow(pal.ink, 0.5)];
  for (const c of contact) { c.scale.setScalar(ASSETS.ball * 3.6); frame.add(c); }
  const ground = softShadow(pal.ink, 0.07);
  ground.scale.set(ASSETS.rOut * 2.5, 1, ASSETS.rOut * 2.2);
  ground.position.y = -0.55;
  frame.add(ground);
  const top = ASSETS.thick / 2 + 0.003;

  return view(scene, camera, (p) => {
    chrome.position.set(...p.chrome);
    greenM.position.set(...p.green);
    contact[0].position.set(p.chrome[0], top, p.chrome[2]);
    contact[1].position.set(p.green[0], top, p.green[2]);
  });
}
