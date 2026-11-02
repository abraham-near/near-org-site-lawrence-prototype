import { buildStack } from "./geometry";
import styles from "./Stack.module.css";

// The isometric Stack (D6, D7), rendered on the server as plain SVG: decorative (aria-hidden); the text blocks
// carry the content. Lit like the draft: one gradient per face direction across the whole drawing, so blocks
// blend into continuous surfaces; each layer has its own top tone (tokens: --stack-*).
const G = buildStack();

export function StackDrawing() {
  const y1 = G.minY, y2 = G.minY + G.height;
  return (
    <svg className={styles.iso} viewBox={G.viewBox} aria-hidden="true" focusable="false" data-iso>
      <defs>
        <linearGradient id="stack-l" gradientUnits="userSpaceOnUse" x1="0" y1={y1} x2="0" y2={y2}>
          <stop offset="0" style={{ stopColor: "var(--stack-side-l-from)" }} />
          <stop offset="1" style={{ stopColor: "var(--stack-side-l-to)" }} />
        </linearGradient>
        <linearGradient id="stack-r" gradientUnits="userSpaceOnUse" x1="0" y1={y1} x2="0" y2={y2}>
          <stop offset="0" style={{ stopColor: "var(--stack-side-r-from)" }} />
          <stop offset="1" style={{ stopColor: "var(--stack-side-r-to)" }} />
        </linearGradient>
      </defs>
      <g>
        {G.cubes.map((c) => (
          <g key={c.key} className={styles.c} data-tone={c.layer}>
            {c.faces.map((f) => <polygon key={f.kind} className={styles[f.kind]} points={f.points} />)}
          </g>
        ))}
        <g className={styles.c} data-tone="protocol">
          <image href="/brand/icon.svg" width="1" height="1" transform={G.markTransform} preserveAspectRatio="xMidYMid meet" />
        </g>
        <g className={`${styles.c} ${styles.thread}`} data-tone="protocol" data-thread>
          <line x1={G.thread.x} y1={G.thread.y1} x2={G.thread.x} y2={G.thread.y2} />
          <circle cx={G.thread.x} cy={G.thread.y2} r="4" />
        </g>
      </g>
    </svg>
  );
}
