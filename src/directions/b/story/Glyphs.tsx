import type { OwnKey } from "@/components/home/chapter-one/OwnArt";
import s from "./Story.module.css";

// Etched glyphs for the four things you own, drawn for the glass panes on the rail: hairlines in ink, one element in
// NEAR green (data-g) that draws on when its pane is the one being read. Decorative (aria-hidden by the caller).
const rows = [0, 1, 2, 3, 4, 5];

export function Glyph({ which }: { which: OwnKey }) {
  return (
    <svg className={s.glyph} viewBox="0 0 160 160" aria-hidden="true" focusable="false">
      {which === "data" && (
        <g>
          {rows.map((r) => (
            <g key={r} transform={`translate(28 ${30 + r * 18})`}>
              <rect width="8" height="8" y="-4" />
              {/* rows 1–4 are confidential: dotted, unreadable */}
              <line x1="16" x2={r === 0 || r === 5 ? 96 : 104 - r * 6} className={r > 0 && r < 5 ? s.dotted : undefined} />
            </g>
          ))}
          <path data-g d="M20 38H14V120H20M120 38H126V120H120" />
        </g>
      )}
      {which === "assets" && (
        <g>
          {[0, 1, 2].map((i) => <ellipse key={`a${i}`} cx="56" cy={104 - i * 14} rx="26" ry="9" />)}
          {[0, 1].map((i) => <ellipse key={`b${i}`} cx="108" cy={110 - i * 14} rx="26" ry="9" />)}
          <path d="M56 62V48M108 82V48" className={s.dotted} />
          <path data-g d="M60 40C70 26 96 26 106 40M100 36l6 4 2-7" />
          <ellipse data-g cx="108" cy="82" rx="26" ry="9" />
        </g>
      )}
      {which === "intelligence" && (
        <g>
          <rect x="44" y="44" width="72" height="72" rx="3" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <line x1={56 + i * 16} x2={56 + i * 16} y1="32" y2="44" />
              <line x1={56 + i * 16} x2={56 + i * 16} y1="116" y2="128" />
              <line y1={56 + i * 16} y2={56 + i * 16} x1="32" x2="44" />
              <line y1={56 + i * 16} y2={56 + i * 16} x1="116" x2="128" />
            </g>
          ))}
          <path d="M62 66L80 80L98 66M62 94L80 80L98 94" />
          {[[62, 66], [98, 66], [62, 94], [98, 94]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="2.5" />)}
          <circle data-g cx="80" cy="80" r="5" />
          <path data-g d="M120 128l5 5 10-11" />
        </g>
      )}
      {which === "identity" && (
        <g>
          <rect x="30" y="50" width="100" height="62" rx="4" />
          <circle cx="54" cy="74" r="10" />
          <path d="M40 98c3-8 9-11 14-11s11 3 14 11" />
          <line x1="78" x2="118" y1="70" y2="70" />
          <line x1="78" x2="106" y1="82" y2="82" className={s.dotted} />
          <path data-g d="M128 36a22 22 0 1 1-30-4" />
          <path data-g d="M96 26l2 7-7 1" />
        </g>
      )}
    </svg>
  );
}
