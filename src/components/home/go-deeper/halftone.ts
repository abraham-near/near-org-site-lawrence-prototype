// The lead photo's entrance (after the r16/v3 prototype): the photo appears through a dot halftone that resolves into
// it. A grid of dots is cut from the photo itself, each sized by its tone (darker = bigger), sweeping in from the top-left
// corner until the dots merge into the whole picture. It is drawn on one canvas laid over the photo; the photo itself
// stays hidden (opacity) until the halftone completes, then the canvas clears. Motion only: the caller gates it.

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const smooth = (t: number) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
const REPLAY_MS = 1100; // a filter switch replays the reveal on its own clock (power2.out)

type Grid = { W: number; H: number; n: number; L: Float32Array; X: Float32Array; Y: Float32Array; D: Float32Array; R: number };

export type Halftone = { set: (q: number) => void; replay: () => void; resize: () => void; destroy: () => void };

export function halftone(media: HTMLElement, img: HTMLImageElement): Halftone {
  const cv = document.createElement("canvas");
  cv.setAttribute("aria-hidden", "true");
  cv.dataset.dots = "";
  media.appendChild(cv);
  const c = cv.getContext("2d")!;
  const src = document.createElement("canvas");
  const s = src.getContext("2d", { willReadFrequently: true })!;
  let G: Grid | null = null, dpr = 1, scrollQ = 0, playQ = 1, last = -1, raf = 0;

  const grid = () => {
    G = null;
    if (!img.complete || !img.naturalWidth) return;
    const W = media.clientWidth, H = media.clientHeight;
    if (!W || !H) return;
    dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = src.width = Math.round(W * dpr);
    cv.height = src.height = Math.round(H * dpr);
    // the photo drawn as object-fit: cover into the box, in device pixels
    const iw = img.naturalWidth, ih = img.naturalHeight, k = Math.max(src.width / iw, src.height / ih);
    s.drawImage(img, (src.width - iw * k) / 2, (src.height - ih * k) / 2, iw * k, ih * k);
    let data: Uint8ClampedArray;
    try { data = s.getImageData(0, 0, src.width, src.height).data; } catch { return; }
    const cs = W <= 520 ? 7 : 9, nx = Math.ceil(W / cs) + 1, ny = Math.ceil(H / cs) + 1;
    const ox = (W - (nx - 1) * cs) / 2, oy = (H - (ny - 1) * cs) / 2, n = nx * ny;
    const L = new Float32Array(n), X = new Float32Array(n), Y = new Float32Array(n), D = new Float32Array(n);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const k2 = j * nx + i, x = ox + i * cs, y = oy + j * cs;
      const px = clamp(Math.round(x * dpr), 0, src.width - 1), py = clamp(Math.round(y * dpr), 0, src.height - 1), o = 4 * (py * src.width + px);
      L[k2] = (0.2126 * data[o] + 0.7152 * data[o + 1] + 0.0722 * data[o + 2]) / 255;
      X[k2] = x; Y[k2] = y; D[k2] = (x / W) * 0.62 + (y / H) * 0.38; // the sweep runs from the top-left corner across
    }
    G = { W, H, n, L, X, Y, D, R: cs * 0.76 };
    last = -1;
  };

  const draw = () => {
    const q = Math.min(scrollQ, playQ);
    if (q === last) return;
    last = q;
    const done = q >= 0.999;
    // Until the grid exists (photo still loading) the photo shows as usual, so nothing is ever blank for long
    media.toggleAttribute("data-done", done || !G);
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, cv.width, cv.height);
    if (done || !G) return;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.beginPath();
    let any = false;
    for (let k = 0; k < G.n; k++) {
      const t = clamp(q * 1.45 - G.D[k] * 0.45, 0, 1);
      if (t <= 0) continue;
      const tone = 0.28 + 0.72 * (1 - G.L[k]);
      const r = G.R * clamp(smooth(t / 0.55) * tone * 0.62 + smooth((t - 0.5) / 0.5), 0, 1);
      if (r < 0.3) continue;
      c.moveTo(G.X[k] + r, G.Y[k]);
      c.arc(G.X[k], G.Y[k], r, 0, Math.PI * 2);
      any = true;
    }
    if (!any) return;
    c.fillStyle = "#000"; // a mask only: every dot is then filled with the photo's own pixels
    c.fill();
    c.globalCompositeOperation = "source-in";
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.drawImage(src, 0, 0);
    c.globalCompositeOperation = "source-over";
  };

  const ready = () => { grid(); last = -1; draw(); };
  if (img.complete && img.naturalWidth) ready(); else img.addEventListener("load", ready, { once: true });

  return {
    set(q) { scrollQ = q; draw(); },
    replay() {
      cancelAnimationFrame(raf);
      let v = 0, t0 = performance.now();
      playQ = 0; last = -1; draw();
      // its own clock steps at most 50 ms a frame, so a long frame never skips the reveal
      const step = (t: number) => {
        v = Math.min(1, v + Math.min(50, t - t0) / REPLAY_MS); t0 = t;
        playQ = 1 - (1 - v) * (1 - v);
        draw();
        raf = v < 1 ? requestAnimationFrame(step) : 0;
      };
      raf = requestAnimationFrame(step);
    },
    resize() { grid(); last = -1; draw(); },
    destroy() {
      cancelAnimationFrame(raf);
      img.removeEventListener("load", ready);
      cv.remove();
      media.removeAttribute("data-done");
    },
  };
}
