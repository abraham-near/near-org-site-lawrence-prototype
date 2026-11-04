import type { HTMLAttributes } from "react";
import own from "../chapter-one/OwnArt.module.css";
import styles from "./NearArt.module.css";

// The layer beneath your agents, drawn in the "Own your …" drawings' style (D38; OwnArt.tsx): three agents wired down
// into a tile that sits on a wide slab. While someone else runs the layer the wires are dashed and the tile is empty (NEAR
// isn't the one the problem describes); once it is user-owned the wires run solid, the official black N (icon.svg's
// path, unaltered) fades into the tile and a "User-owned" tag arrives. Without motion it shows that end state; the rail's timeline scrubs the change
// (StoryRailMotion: data-n parts). Decorative: the answer beside it carries the meaning.
const N = "m457.61,144c-13,0-25.07,6.74-31.88,17.82l-73.37,108.93c-2.39,3.59-1.42,8.43,2.17,10.82,2.91,1.94,6.76,1.7,9.41-.58l72.22-62.64c1.2-1.08,3.05-.97,4.13.23.49.55.75,1.26.75,1.99v196.12c0,1.62-1.31,2.92-2.93,2.92-.87,0-1.69-.38-2.24-1.05L217.56,157.24c-7.11-8.39-17.55-13.23-28.54-13.24h-7.63c-20.65,0-37.39,16.74-37.39,37.39v276.22c0,20.65,16.74,37.39,37.39,37.39,13,0,25.07-6.74,31.88-17.82l73.37-108.93c2.39-3.59,1.42-8.43-2.17-10.82-2.91-1.94-6.76-1.7-9.41.58l-72.22,62.64c-1.2,1.08-3.05.97-4.13-.23-.49-.55-.75-1.26-.74-1.99v-196.17c0-1.62,1.31-2.92,2.93-2.92.86,0,1.69.38,2.24,1.05l218.28,261.37c7.11,8.39,17.55,13.23,28.54,13.24h7.63c20.65.01,37.4-16.72,37.42-37.37V181.39c0-20.65-16.74-37.39-37.39-37.39Z";

const AGENTS = [[60, 22], [120, 14], [180, 22]] as const;
const WIRES = "M66 28L100 56M120 22V56M174 28L140 56";

export function NearArt({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${own.art} ${className}`} data-art="near" aria-hidden="true" {...rest}>
      <svg viewBox="0 0 240 180" focusable="false">
        <path className={`${own.dash} ${styles.before}`} d={WIRES} data-n="before" />
        <path className={own.kn} d={WIRES} data-n="after" />
        {AGENTS.map(([x, y]) => (
          <g key={x}><circle className={own.k} cx={x} cy={y} r="8" /><circle className={own.ink} cx={x} cy={y} r="2.5" /></g>
        ))}
        <rect className={own.k} x="30" y="124" width="180" height="26" rx="6" />
        <path className={own.soft} d="M44 137h36" />
        <rect className={own.k} x="86" y="56" width="68" height="68" rx="15" />
        <g className={styles.markBox} transform="translate(120 90) scale(0.12) translate(-319.5 -319.5)">
          <path className={styles.mark} d={N} data-n="after" />
        </g>
        <g transform="translate(148 140)">
          <g className={own.tag} data-n="tag">
            <rect width="86" height="20" rx="4" />
            <circle className={own.g} cx="10" cy="10" r="3" />
            <text x="18" y="13.5">User-owned</text>
          </g>
        </g>
      </svg>
    </div>
  );
}
