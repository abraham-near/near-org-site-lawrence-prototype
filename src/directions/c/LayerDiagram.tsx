import Image from "next/image";
import { Anchor, Hatch } from "./Shapes";
import { N_RUN } from "./construction";
import styles from "./Story.module.css";

// The layer beneath your agents, drawn as a sliced view of one diagonal stroke at the N's angle: AI on top, blockchain
// at the foot, and the layer between them, with three agents' requests running down through it. While the problem is
// read the layer is hatched solid ink (someone else's, opaque); with the answer it turns NEAR green and the requests
// run solid. StoryMotion drives the states (data-m); the static page shows the answer's state. HTML labels sit over
// the drawing so they keep their size (13 px floor) at any width.
const VB = { w: 760, h: 540 };
const WIDTH = 300;
const left = (y: number) => 24 + y * N_RUN;
const band = (y0: number, y1: number) => `${left(y0)},${y0} ${left(y0) + WIDTH},${y0} ${left(y1) + WIDTH},${y1} ${left(y1)},${y1}`;
const AI = [24, 150] as const, LAYER = [222, 304] as const, CHAIN = [376, 506] as const;
const AGENTS = [356, 392, 428];
const pct = (x: number, y: number) => ({ left: `${(x / VB.w) * 100}%`, top: `${(y / VB.h) * 100}%` });

export function LayerDiagram({ className = "" }: { className?: string }) {
  return (
    <div className={`${styles.diagram} ${className}`} aria-hidden="true">
      <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className={styles.diagramSvg} focusable="false">
        <defs>
          <Hatch id="c-layer-light" angle={-56} gap={5} width={0.6} color="var(--color-ink)" />
          <Hatch id="c-layer-dense" angle={-56} gap={2.6} width={1} color="var(--color-ink)" />
        </defs>
        {/* The stroke's two edges as dashed construction lines, past both ends */}
        <path className={styles.dash} d={`M${left(0) - 12 * N_RUN} -12L${left(VB.h + 12)} ${VB.h + 12}`} />
        <path className={styles.dash} d={`M${left(0) - 12 * N_RUN + WIDTH} -12L${left(VB.h + 12) + WIDTH} ${VB.h + 12}`} />

        <polygon points={band(...AI)} fill="url(#c-layer-light)" opacity="0.5" />
        <polygon className={styles.outline} points={band(...AI)} />
        <polygon points={band(...CHAIN)} fill="url(#c-layer-light)" opacity="0.5" />
        <polygon className={styles.outline} points={band(...CHAIN)} />

        {/* The layer: empty, then someone else's (dense hatch), then NEAR's (green) */}
        <polygon className={styles.paper} points={band(...LAYER)} />
        <polygon points={band(...LAYER)} fill="url(#c-layer-dense)" opacity="0.7" data-m="layerInk" className={styles.layerInk} />
        <polygon className={`${styles.green} ${styles.layerGreen}`} points={band(...LAYER)} data-m="layerGreen" />
        <polygon className={styles.outline} points={band(...LAYER)} />

        {/* Three agents' requests, from AI down through the layer to the chain: dashed while it isn't yours */}
        {AGENTS.map((x) => (
          <g key={x}>
            <path className={`${styles.dash} ${styles.reqDash}`} d={`M${x} ${AI[1]}V${CHAIN[0]}`} data-m="reqDash" />
            <path className={`${styles.req} ${styles.drawLine}`} pathLength={1} d={`M${x} ${AI[1]}V${CHAIN[0]}`} data-m="req" />
            <Anchor x={x} y={AI[1]} s={6} />
            <Anchor x={x} y={CHAIN[0]} s={6} />
          </g>
        ))}
        {[AI, LAYER, CHAIN].map(([y0, y1]) => (
          <g key={y0}>
            <Anchor x={left(y0)} y={y0} /><Anchor x={left(y0) + WIDTH} y={y0} />
            <Anchor x={left(y1)} y={y1} /><Anchor x={left(y1) + WIDTH} y={y1} />
          </g>
        ))}
      </svg>
      <span className={styles.dLabel} style={pct(left(AI[1]) + WIDTH + 28, AI[0] + 34)}><b>AI</b><span className={styles.dSub}>the frontend</span></span>
      <span className={styles.dLabel} style={pct(left(CHAIN[0]) - 210, CHAIN[0] + 46)}><b>Blockchain</b><span className={styles.dSub}>the backend</span></span>
      <span className={`${styles.dLabel} ${styles.dOwned}`} style={pct(left(LAYER[1]) + WIDTH + 28, LAYER[0] + 20)} data-m="owned">
        <Image src="/brand/icon_tile.svg" alt="" width={32} height={32} className={styles.dTile} unoptimized />
        <b>User-owned</b>
      </span>
    </div>
  );
}
