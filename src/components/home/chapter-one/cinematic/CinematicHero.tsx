import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { GoArrow } from "@/components/GoArrow";
import { HeroInView } from "../HeroInView";
import styles from "./CinematicHero.module.css";

// Lab (/lab/hero-cinematic): a static first screen for the cinematic hero options. The same claim, lede and button as
// /home's ChapterOne, set the same way, over one still photograph with a vector layer drawn in code on its features.
// No video, no scroll motion: the photo and its SVG share one box with the photo's aspect ratio, sized to cover the
// screen from a focal point (--fx / --fy), so every line stays registered to the land at any width.
export type CinematicOption = {
  key: "a" | "b" | "c" | "d";
  name: string;
  note: string;
  src: string;
  w: number;
  h: number;
  fx: number; // focal point, 0-1, on the wide screen
  fy: number;
  mfx: number; // focal point on the phone band, and its zoom (≥ 1), so the subject clears the floating nav
  mfy: number;
  mz: number;
  layer: ReactNode;
};

export function CinematicHero({ o, h1 = true, preload = false }: { o: CinematicOption; h1?: boolean; preload?: boolean }) {
  const H = h1 ? "h1" : "h2";
  const box = { "--fx": o.fx, "--fy": o.fy, "--mfx": o.mfx, "--mfy": o.mfy, "--mz": o.mz, "--arn": o.w / o.h } as CSSProperties;
  return (
    <section className={styles.hero} data-ch="root" aria-label={`Option ${o.key.toUpperCase()}, ${o.name}`} data-option={o.key}>
      <div className={styles.stage} aria-hidden="true">
        <div className={styles.box} style={box}>
          <Image src={o.src} alt="" fill sizes="(min-width: 1280px) 100vw, 180vw" quality={75} preload={preload} className={styles.img} />
          <svg className={styles.svg} viewBox={`0 0 ${o.w} ${o.h}`} preserveAspectRatio="none">{o.layer}</svg>
        </div>
      </div>
      <div className={styles.beats}>
        <div className={styles.beat} data-beat="claim">
          <div className={styles.copy}>
            <H className="t-display">
              Own your <span className="accent">world.</span>
            </H>
            <p className={`t-lede ${styles.lede}`}>AI is starting to act for you. NEAR keeps your money, your data and your AI in your&nbsp;hands.</p>
            <a className={`btn btn-primary ${styles.cta}`} href="https://near.com">Get started<GoArrow /></a>
          </div>
        </div>
      </div>
      {/* The header's action steps back to an outline while this claim is on screen, as on /home */}
      <HeroInView />
    </section>
  );
}
