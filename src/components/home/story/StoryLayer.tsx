import { CONNECT, OWN, PROBLEM } from "./copy";
import { MorphLine, StoryStatic } from "./StoryStatic";
import { StoryLayerMotion } from "./StoryLayerMotion";
import base from "./Story.module.css";
import styles from "./StoryLayer.module.css";

// Story option A, "The layer" (D29): the words on the left, a cross-section on the right. Three bands, AI on top and
// Blockchain below, with the green line running between them through the middle band, the layer. While the problem is
// on, that layer goes dark (someone else's); as the answer arrives it turns green from the left (user-owned); then it
// opens into the four things you own, one lit at a time as "Own your …" lists them on the left (the line being read
// opens under its row). It sets up the Stack.
const W = 560, BW = 504, BH = 104, X = 28, Y = { ai: 40, layer: 248, chain: 456 }, CELL = BW / 4;

export function StoryLayer() {
  return (
    <section className={base.story} aria-labelledby="story-title" data-story="layer">
      <StoryStatic titleId="story-title" />
      <div className={base.track} style={{ "--story-h": "600vh" } as React.CSSProperties} aria-hidden="true">
        <div className={`${base.stage} ${styles.stage}`} data-s="stage">
          <div className={styles.copy} data-s="copy">
            <div className={styles.connect}>
              {CONNECT.map((s, i) => <p key={s} className={styles.line} data-s={`c${i}`}>{s}</p>)}
              <MorphLine className={styles.slot} />
            </div>
            <div className={styles.problem} data-s="problem">
              <p>{PROBLEM.split(" ").map((w, i) => <span key={i} className={styles.pw}>{w} </span>)}</p>
            </div>
            <div className={styles.own} data-s="own">
              <ol className={styles.rows}>
                {OWN.map((o) => (
                  <li key={o.key} className={styles.row} data-s="row">
                    <span className={styles.rowTitle}>Own your <span className="accent">{o.word}</span></span>
                    <span className={styles.lineWrap} data-s="oline"><span className={`t-lede ${styles.ownLine}`}>{o.line}</span></span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <svg className={styles.diagram} viewBox={`0 0 ${W} 600`} data-s="diagram">
            {/* The line NEAR draws between the two ends; it runs behind the layer band */}
            <g data-s="link">
              <line className={styles.link} x1={W / 2} x2={W / 2} y1={Y.ai + BH} y2={Y.chain} pathLength={1} data-s="linkline" />
            </g>
            <g data-s="ai">
              <rect className={styles.band} x={X} y={Y.ai} width={BW} height={BH} rx="8" pathLength={1} data-s="frame" />
              <text className={styles.name} x={X + 24} y={Y.ai + 58} data-s="label">AI <tspan className={styles.sub}>the frontend</tspan></text>
            </g>
            <g data-s="chain">
              <rect className={styles.band} x={X} y={Y.chain} width={BW} height={BH} rx="8" pathLength={1} data-s="frame" />
              <text className={styles.name} x={X + 24} y={Y.chain + 58} data-s="label">Blockchain <tspan className={styles.sub}>the backend</tspan></text>
            </g>
            {/* The layer: an outline, then dark, then green from the left, then four cells */}
            <g data-s="layer">
              <clipPath id="story-layer-clip"><rect x={X} y={Y.layer} width={BW} height={BH} rx="8" /></clipPath>
              <rect className={styles.bandFill} x={X} y={Y.layer} width={BW} height={BH} rx="8" />
              <g clipPath="url(#story-layer-clip)">
                <rect className={styles.dark} x={X} y={Y.layer} width={BW} height={BH} data-s="dark" />
                <rect className={styles.green} x={X} y={Y.layer} width={BW} height={BH} data-s="green" />
              </g>
              <rect className={styles.band} x={X} y={Y.layer} width={BW} height={BH} rx="8" pathLength={1} data-s="frame" />
              <circle className={styles.point} cx={W / 2} cy={Y.layer + BH / 2} r="6" data-s="point" />
              <text className={`${styles.name} ${styles.layerName}`} x={X + 24} y={Y.layer + 58} data-s="layerLabel">the layer</text>
              <text className={`${styles.name} ${styles.owned}`} x={X + BW - 24} y={Y.layer + 58} textAnchor="end" data-s="ownedLabel">user-owned</text>
            </g>
            <g data-s="cells">
              {OWN.map((o, i) => (
                <g key={o.key} data-s="cell">
                  <rect className={styles.cell} x={X + i * CELL} y={Y.layer} width={CELL} height={BH} rx="8" />
                  <text className={styles.cellName} x={X + i * CELL + CELL / 2} y={Y.layer + 58} textAnchor="middle">{o.word.replace(".", "")}</text>
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>
      <StoryLayerMotion cell={CELL} x={X} />
    </section>
  );
}
