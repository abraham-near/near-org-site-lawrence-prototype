import type React from "react";
import s from "../graphics/survey.module.css";
import f from "./Figures.module.css";

// The traverse's figures (research/dir-a.md §5.2): small technical drawings in hairline, each with one green mark (what
// is yours). Every figure sits on the traverse line (its viewBox's bottom edge, y = 200) and draws on when its station
// is reached (its watch area). Decorative: the captions beside them carry the meaning.

// The official N (public/brand/icon.svg's path, unaltered)
export const N_PATH = "m457.61,144c-13,0-25.07,6.74-31.88,17.82l-73.37,108.93c-2.39,3.59-1.42,8.43,2.17,10.82,2.91,1.94,6.76,1.7,9.41-.58l72.22-62.64c1.2-1.08,3.05-.97,4.13.23.49.55.75,1.26.75,1.99v196.12c0,1.62-1.31,2.92-2.93,2.92-.87,0-1.69-.38-2.24-1.05L217.56,157.24c-7.11-8.39-17.55-13.23-28.54-13.24h-7.63c-20.65,0-37.39,16.74-37.39,37.39v276.22c0,20.65,16.74,37.39,37.39,37.39,13,0,25.07-6.74,31.88-17.82l73.37-108.93c2.39-3.59,1.42-8.43-2.17-10.82-2.91-1.94-6.76-1.7-9.41.58l-72.22,62.64c-1.2,1.08-3.05.97-4.13-.23-.49-.55-.75-1.26-.74-1.99v-196.17c0-1.62,1.31-2.92,2.93-2.92.86,0,1.69.38,2.24,1.05l218.28,261.37c7.11,8.39,17.55,13.23,28.54,13.24h7.63c20.65.01,37.4-16.72,37.42-37.37V181.39c0-20.65-16.74-37.39-37.39-37.39Z";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
const P = { pathLength: 1 } as const;

function Frame({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <svg className={f.fig} viewBox="0 0 320 200" aria-hidden="true" focusable="false" data-label={label}>
      <defs>
        <pattern id={`hatch-${label}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" className={s.faint} />
        </pattern>
      </defs>
      {children}
    </svg>
  );
}

// The layer beneath your agents: three agents wired down into a tile on a hatched slab. Someone else's while the
// problem is read (dashed wires, an empty tile); NEAR's with the answer (solid wires, the N, a "User-owned" tag).
export function LayerFigure() {
  const agents = [[80, 34], [160, 24], [240, 34]] as const;
  const wires = "M86 42L140 98M160 33V98M234 42L180 98";
  return (
    <Frame label="layer">
      <rect x="40" y="160" width="240" height="26" fill={`url(#hatch-layer)`} className={`${s.hair} ${s.draw}`} {...P} style={d(100)} />
      <path className={`${s.hair} ${s.dash} ${f.before}`} d={wires} data-tr="before" />
      <path className={`${s.ink} ${s.draw} ${f.after}`} d={wires} {...P} data-tr="after" style={d(200)} />
      {agents.map(([x, y], i) => (
        <g key={x} transform={`translate(${x} ${y})`} className={s.pop} style={d(300 + i * 120)}>
          <circle r="9" className={`${s.ink} ${s.paper}`} /><circle r="2.5" className={s.inkFill} />
        </g>
      ))}
      <rect x="126" y="98" width="68" height="62" rx="6" className={`${s.ink} ${s.paper}`} />
      <g transform="translate(160 129) scale(0.075) translate(-319.5 -319.5)" className={f.after} data-tr="after">
        <path d={N_PATH} className={s.inkFill} />
      </g>
      {/* the tag, on a leader from the tile */}
      <g className={f.after} data-tr="tag">
        <path className={`${s.hair} ${s.draw}`} d="M194 116H236V96" {...P} style={d(500)} />
        <g transform="translate(222 70)">
          <rect width="96" height="26" rx="4" className={`${s.ink} ${s.paper}`} />
          <circle cx="12" cy="13" r="3" className={s.greenFill} />
          <text x="22" y="17.5" className={f.tag}>User-owned</text>
        </g>
      </g>
    </Frame>
  );
}

// Own your data: a sealed record inside someone else's infrastructure; a sightline from outside stops at its wall
export function DataFigure() {
  return (
    <Frame label="data">
      <rect x="24" y="18" width="272" height="166" className={`${s.hair} ${s.dash}`} />
      <rect x="104" y="58" width="128" height="96" className={`${s.ink} ${s.draw}`} {...P} style={d(150)} />
      {[74, 88, 102, 116, 130].map((y, i) => (
        <path key={y} className={`${s.hair} ${s.tickX}`} d={`M118 ${y}H${200 - (i % 3) * 22}`} style={{ "--i": i, "--d": "500ms", "--a-step": "70ms" } as React.CSSProperties} />
      ))}
      {/* the seal on the record's lid: yours */}
      <g transform="translate(168 58)" className={s.pop} style={d(700)}>
        <circle r="6" className={`${s.green} ${s.paper}`} /><circle r="2" className={s.greenFill} />
      </g>
      {/* the sightline from the infrastructure, stopped at the wall */}
      <g className={s.pop} style={d(250)} transform="translate(46 40)">
        <path className={s.ink} d="M-7 0H-2.5M2.5 0H7M0-7V-2.5M0 2.5V7" />
      </g>
      <path className={`${s.hair} ${s.draw}`} d="M52 46L100 84" {...P} style={d(450)} />
      <path className={`${s.ink} ${s.draw}`} d="M95 90L107 78" {...P} style={d(900)} />
    </Frame>
  );
}

// Own your assets: one account, the things you hold around it on a range ring, one swap drawn between two of them
export function AssetsFigure() {
  const held = [[70, 52, 14], [252, 46, 10], [64, 158, 10], [258, 150, 16], [160, 26, 8]] as const;
  return (
    <Frame label="assets">
      <circle cx="160" cy="104" r="78" className={`${s.faint} ${s.draw}`} {...P} style={d(0)} />
      {Array.from({ length: 36 }, (_, k) => {
        const a = (k / 36) * Math.PI * 2, r1 = 78, r2 = k % 9 === 0 ? 70 : 74;
        return <line key={k} className={`${s.hair} ${s.fade}`} x1={160 + Math.cos(a) * r1} y1={104 + Math.sin(a) * r1} x2={160 + Math.cos(a) * r2} y2={104 + Math.sin(a) * r2} style={d(200 + k * 12)} />;
      })}
      {held.map(([x, y, r], i) => (
        <g key={i}>
          <path className={`${s.hair} ${s.draw}`} d={`M160 104L${x} ${y}`} {...P} style={d(400 + i * 90)} />
          <circle cx={x} cy={y} r={r} className={`${s.ink} ${s.paper} ${s.pop}`} style={d(500 + i * 90)} />
        </g>
      ))}
      <path className={`${s.green} ${s.draw}`} d="M84 54Q160 -6 242 44" {...P} style={d(1000)} />
      <rect x="150" y="94" width="20" height="20" className={`${s.green} ${s.paper} ${s.pop}`} style={d(300)} />
    </Frame>
  );
}

// Own your intelligence: a request goes into an enclave on a chip; a signed proof comes out
export function IntelligenceFigure() {
  const pins = Array.from({ length: 9 }, (_, k) => 66 + k * 11);
  return (
    <Frame label="intelligence">
      <rect x="104" y="56" width="112" height="112" className={`${s.ink} ${s.draw}`} {...P} />
      {pins.map((p, i) => (
        <g key={p} className={s.fade} style={d(200 + i * 30)}>
          <path className={s.hair} d={`M${p + 38} 56V48M${p + 38} 168V176M104 ${p}H96M216 ${p}H224`} />
        </g>
      ))}
      <rect x="126" y="78" width="68" height="68" className={`${s.hair} ${s.dash}`} />
      <path className={`${s.hair} ${s.draw}`} d="M144 126L160 96L176 126Z" {...P} style={d(500)} />
      {[[144, 126], [160, 96], [176, 126]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" className={`${s.ink} ${s.paper} ${s.pop}`} style={d(600 + i * 80)} />
      ))}
      {/* request in */}
      <path className={`${s.hair} ${s.draw}`} d="M30 112H96M88 106L96 112L88 118" {...P} style={d(300)} />
      <circle cx="30" cy="112" r="3" className={`${s.inkFill} ${s.pop}`} style={d(250)} />
      {/* proof out */}
      <path className={`${s.hair} ${s.draw}`} d="M224 112H250" {...P} style={d(900)} />
      <g className={s.fade} style={d(1000)}>
        <rect x="250" y="84" width="48" height="58" className={`${s.ink} ${s.paper}`} />
        <path className={s.hair} d="M258 96H290M258 104H282" />
        <path className={s.green} d="M262 124L270 131L286 114" />
      </g>
    </Frame>
  );
}

// Own your identity: your key at the centre of a ring of 35 ticks (one per chain it reaches, F3), with the arc of a
// single key rotation around it
export function IdentityFigure() {
  return (
    <Frame label="identity">
      {Array.from({ length: 35 }, (_, k) => {
        const a = -Math.PI / 2 + (k / 35) * Math.PI * 2, r1 = 64, r2 = 54;
        return (
          <line key={k} className={`${s.hair} ${s.fade}`} x1={160 + Math.cos(a) * r1} y1={104 + Math.sin(a) * r1} x2={160 + Math.cos(a) * r2} y2={104 + Math.sin(a) * r2} style={d(k * 28)} />
        );
      })}
      <circle cx="160" cy="104" r="40" className={`${s.faint} ${s.draw}`} {...P} />
      <path className={`${s.ink} ${s.draw}`} d="M235 70A82 82 0 0 1 222 158" {...P} style={d(1100)} />
      <path className={`${s.ink} ${s.fade}`} d="M215 150L222 158L231 151" style={d(1600)} />
      <g className={s.pop} style={d(900)}>
        <circle cx="148" cy="104" r="9" className={`${s.green} ${s.paper}`} />
        <path className={s.green} d="M157 104H182M174 104V112M180 104V110" />
      </g>
    </Frame>
  );
}

export const OWN_FIGURES = { data: DataFigure, assets: AssetsFigure, intelligence: IntelligenceFigure, identity: IdentityFigure };
