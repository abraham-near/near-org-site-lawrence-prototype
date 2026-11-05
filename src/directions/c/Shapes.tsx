import styles from "./Field.module.css";

// Shared pieces of the Field shape system, rendered on the server.

// The visible 12-column grid (4 on phones): each column's edges as faint hairlines behind a section's content
export function Guides() {
  return (
    <div className={styles.guides} aria-hidden="true">
      <div className={styles.wrap}>
        <div className={styles.grid}>
          {Array.from({ length: 12 }, (_, i) => <span key={i} />)}
        </div>
      </div>
    </div>
  );
}

// A hatch pattern: parallel lines `gap` apart at `angle` degrees (0 = horizontal), in user space
export function Hatch({ id, angle, gap = 6, width = 0.75, color = "currentColor", bg }: { id: string; angle: number; gap?: number; width?: number; color?: string; bg?: string }) {
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width={gap} height={gap} patternTransform={`rotate(${angle})`}>
      {bg && <rect width={gap} height={gap} fill={bg} />}
      <line x1="0" y1={gap / 2} x2={gap} y2={gap / 2} stroke={color} strokeWidth={width} />
    </pattern>
  );
}

// A construction anchor: a small square centred on a vertex
export function Anchor({ x, y, s = 7, className = "" }: { x: number; y: number; s?: number; className?: string }) {
  return <rect className={`${styles.anchor} ${className}`} x={x - s / 2} y={y - s / 2} width={s} height={s} />;
}

// The ↗ for links that leave near.org
export function Ext() {
  return (
    <>
      <svg className={styles.ext} viewBox="0 0 10 10" width="10" height="10" aria-hidden="true" focusable="false">
        <path d="M3 1.5h5.5V7M8.5 1.5 1.5 8.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span className="sr-only"> (another site)</span>
    </>
  );
}
