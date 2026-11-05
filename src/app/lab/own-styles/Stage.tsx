import type { CSSProperties } from "react";
import type { OwnKey } from "@/components/home/chapter-one/OwnArt";
import { ANSWER, OWN } from "@/components/home/story/copy";
import type { StyleDef } from "./styles/types";
import styles from "./own-styles.module.css";

// Statics of the rail's "Own your …" stations (D53), drawn over the Original's background (C1 Horizon, D32): the ridges
// panorama at low strength with its mist, the line with its tick scale, survey hairlines, the playhead and the corners
// that lock on. Nothing moves; each style's Art shows its end state.
const CORNERS = ["tl", "tr", "bl", "br"] as const;
const own = (which: OwnKey) => OWN.find((o) => o.key === which)!;

// Where each station sits on the panorama, so the four crops don't all show the same hills
const PAN: Record<OwnKey, number> = { data: 8, assets: 30, intelligence: 52, identity: 74 };

function Back({ which }: { which: OwnKey }) {
  return (
    <div className={styles.back} aria-hidden="true" style={{ "--pan": `${PAN[which]}%` } as CSSProperties}>
      <div className={styles.plate} />
      <div className={styles.mist} />
    </div>
  );
}

function Rail({ survey = true }: { survey?: boolean }) {
  return (
    <div aria-hidden="true">
      <span className={styles.rail} />
      <span className={styles.green} />
      <span className={styles.ticks} />
      {survey && <><span className={styles.survey} style={{ left: "12.5%" }} /><span className={styles.survey} style={{ left: "75%" }} /></>}
      <span className={styles.playhead} />
      <span className={styles.dot} />
    </div>
  );
}

function Title({ which }: { which: OwnKey }) {
  return <p className={styles.title}>Own your <span className="accent">{own(which).word}</span></p>;
}

// The whole screen at 1440 × 810, scaled to its box (every size in cqw, so it scales as one picture). `large` gives the
// drawing a 420 × 315 slot (the rendered styles, D54) instead of 320 × 240
export function Screen({ style, which = "assets", large = false }: { style: StyleDef; which?: OwnKey; large?: boolean }) {
  const { Art } = style;
  return (
    <figure className={styles.screen} data-large={large || undefined} aria-label={`${style.name}: the "Own your ${own(which).word}" station, full screen`}>
      <Back which={which} />
      <p className={styles.answer} aria-hidden="true">
        {ANSWER.pre}{ANSWER.near}{ANSWER.mid}<span className={styles.owned}>{ANSWER.owned}</span>
      </p>
      <Rail />
      <span className={styles.finder} aria-hidden="true">{CORNERS.map((c) => <span key={c} className={`${styles.corner} ${styles[c]}`} />)}</span>
      <div className={styles.slot}><Art which={which} /></div>
      <Title which={which} />
      <p className={styles.line}>{own(which).line}</p>
    </figure>
  );
}

// One station at its real size (the drawing 320 wide, as on the page; 420 with `large`, D54), cropped around it
export function Crop({ style, which, large = false }: { style: StyleDef; which: OwnKey; large?: boolean }) {
  const { Art } = style;
  return (
    <figure className={styles.crop} data-large={large || undefined} aria-label={`${style.name}: Own your ${own(which).word}`}>
      <Back which={which} />
      <Rail survey={false} />
      <div className={styles.cropSlot}><Art which={which} /></div>
      <Title which={which} />
    </figure>
  );
}
