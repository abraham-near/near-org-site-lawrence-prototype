import type React from "react";
import Image from "next/image";
import { SplitText } from "@/components/home/chapter-one/SplitText";
import { ANSWER, CONNECT, MEET, OWN, PROBLEM } from "@/components/home/story/copy";
import { Glyph } from "./Glyphs";
import { StoryMotion } from "./StoryMotion";
import glass from "../glass.module.css";
import s from "./Story.module.css";

// Direction B, the story: the anthem, then the rail (copy verbatim from components/home/story/copy.ts and home.md §1.2).
// 1. The anthem is set on a frosted glass slab that stands half over a photograph of fluted glass lamellae (Higgsfield,
//    LOG.md: lamellae-b); its characters wipe on with the scroll and "own your intelligence." arrives in green.
// 2. The rail is one horizontal line of light. AI and blockchain come in as two beams and meet in a glass prism (NEAR);
//    one green beam leaves it and runs on as the rail. It passes behind a frosted slab, the layer beneath your agents,
//    which clears as the answer arrives, then through four standing panes, one for each thing you own.
// Desktop and tablet with motion: pinned, the world slides sideways with the scroll (GSAP). Otherwise the same world is
// a native sideways scroller with snap points, so it stays horizontal everywhere.
const vw = (n: number) => ({ "--w": n } as React.CSSProperties);

export function Story() {
  return (
    <section id="story" className={s.story} aria-labelledby="b-story-title">
      <h2 id="b-story-title" className="sr-only">What NEAR is, and what you own on it</h2>

      {/* ── The anthem ─────────────────────────────────────────── */}
      <div className={s.anthemTrack} data-b="anthem">
        <div className={s.anthemStage}>
          <div className={s.anthemGrid}>
            <figure className={s.plate} aria-hidden="true">
              {/* Fetched early but behind the hero (low priority), decoded off the main thread, so the first scroll never waits on it */}
              <Image src="/directions/b/dir-b-lamellae-b.webp" alt="" fill sizes="(min-width: 1280px) 62vw, 100vw" quality={88} loading="eager" fetchPriority="low" decoding="async" className={s.plateImg} />
            </figure>
            <div className={`${glass.glass} ${glass.edge} ${s.slab}`}>
              <p className={s.statement} data-b="wipe">
                <Image src="/brand/icon_tile.svg" alt="" width={160} height={160} className={s.tile} unoptimized />
                <SplitText
                  wordClass={s.wd}
                  charClass={s.ch}
                  breakClass={s.lb}
                  parts={[
                    { text: "NEAR is open infrastructure powering the agent economy. Confidential by design and secured for the quantum era, it lets you trade anything, anywhere, and " },
                    { text: "own your intelligence.", className: s.hl },
                  ]}
                />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── The rail ───────────────────────────────────────────── */}
      <div className={s.railTrack} data-b="rail">
        <div className={s.railStage} data-b="rail-stage" tabIndex={0} role="group" aria-label="The story, read sideways">
          <div className={s.world} data-b="world">
            <span className={s.rail} aria-hidden="true" data-b="beam" />

            {/* A: two beams meet in the prism */}
            <div className={`${s.panel} ${s.panelA}`} style={vw(100)} data-b="panel">
              <div className={s.top}>
                {CONNECT.map((l) => <p key={l} className={s.connect}>{l}</p>)}
                <p className={s.connect}>{MEET.near}{MEET.rest.replace(" connect.", " ")}<span className="accent">connect.</span></p>
              </div>
              <Prism />
            </div>

            {/* B: the layer beneath your agents, frosted, then clear */}
            <div className={`${s.panel} ${s.panelB}`} style={vw(100)} data-b="panel">
              <div className={s.top}>
                <div className={s.swap}>
                  <p className={s.problem} data-b="problem">{PROBLEM}</p>
                  <p className={s.answer} data-b="answer">{ANSWER.pre}{ANSWER.near}{ANSWER.mid}<span className={s.owned}>{ANSWER.owned}</span></p>
                </div>
              </div>
              <div className={s.layer} aria-hidden="true">
                <span className={`${glass.edge} ${s.clear}`} />
                {/* Clear: the layer drawn crisp, its line in green (yours) */}
                <LayerArt className={s.artCrisp} data-b="layer-crisp" />
                {/* Frosted: someone else's layer, the same drawing seen softly through the frost, the rail too */}
                <span className={s.frost} data-b="frost">
                  <LayerArt className={s.artSoft} />
                  <span className={s.softRail} />
                </span>
              </div>
            </div>

            {/* C–F: the four stations */}
            {OWN.map((o) => (
              <div key={o.key} className={`${s.panel} ${s.station}`} style={vw(52)} data-b="station">
                <span className={s.stopDot} aria-hidden="true" />
                <div className={`${glass.glass} ${glass.edge} ${s.pane}`} aria-hidden="true">
                  <Glyph which={o.key} />
                </div>
                <div className={s.below}>
                  <h3 className={s.ownTitle}>Own your <span className="accent">{o.word}</span></h3>
                  <p className={`t-lede ${s.ownLine}`}>{o.line}</p>
                </div>
              </div>
            ))}
            <div className={s.tail} style={vw(18)} aria-hidden="true" />
          </div>

          <div className={s.progress} aria-hidden="true"><span data-b="progress" /></div>
        </div>
      </div>
      <StoryMotion />
    </section>
  );
}

// The prism: AI and blockchain enter its left face as two hairline beams; inside the glass they bend into one; one green
// beam leaves the right face, its fringes (mint, green, deep green) resolving into a single line within a few pixels.
function Prism() {
  return (
    <div className={s.prism} aria-hidden="true">
      <svg viewBox="0 0 720 360" className={s.prismSvg}>
        <line className={s.beamIn} data-b="beam-ai" x1="10" y1="40" x2="462" y2="172" />
        <line className={s.beamIn} data-b="beam-chain" x1="10" y1="320" x2="462" y2="188" />
        <circle className={s.node} cx="10" cy="40" r="3" />
        <circle className={s.node} cx="10" cy="320" r="3" />
        {/* inside the glass: the two become one */}
        <path className={s.beamInside} d="M462 172L520 180L580 180M462 188L520 180" />
      </svg>
      <span className={s.prismGlass} />
      <svg viewBox="0 0 720 360" className={s.prismSvg}>
        {/* One edge treatment on all three faces; the light leaves from one point on the exit face, its mint and deep
            fringes opening from that point and fading within a few pixels while the green beam runs on */}
        <polygon className={s.prismBody} points="520,50 410,290 630,290" />
        <path className={s.fringeMint} d="M580 180L640 175" />
        <path className={s.fringeDeep} d="M580 180L640 185" />
        <line className={s.beamOut} data-b="beam-out" x1="580" y1="180" x2="720" y2="180" />
        <circle className={s.exitPoint} cx="580" cy="180" r="2.5" />
        <image href="/brand/icon.svg" x="502" y="206" width="36" height="36" />
      </svg>
      <p className={`${s.end} ${s.endAi}`}>AI <em>the frontend</em></p>
      <p className={`${s.end} ${s.endChain}`}>Blockchain <em>the backend</em></p>
      <p className={`${s.end} ${s.endNear}`}>NEAR</p>
    </div>
  );
}

// The layer beneath your agents: three agents above, each joined down to one shared ledger of blocks. Behind the frost
// it is somebody else's, soft and grey; cleared, its chain runs green and the last block is filled: yours.
function LayerArt({ className, ...rest }: { className: string } & React.HTMLAttributes<SVGSVGElement>) {
  const blocks = Array.from({ length: 8 }, (_, i) => 44 + i * 44);
  return (
    <svg className={className} viewBox="0 0 400 240" preserveAspectRatio="xMidYMid meet" {...rest}>
      {[110, 200, 290].map((x) => (
        <g key={x}>
          <circle cx={x} cy="38" r="11" />
          <circle cx={x} cy="38" r="3" className={s.fill} />
          <path d={`M${x} 49V${x === 200 ? 96 : 78}${x === 200 ? "" : `L200 96`}`} />
        </g>
      ))}
      <rect x="20" y="110" width="360" height="72" rx="4" />
      <path className={s.chain} d={`M${blocks[0]} 146H${blocks[blocks.length - 1]}`} />
      {blocks.map((x, i) => <rect key={x} x={x - 9} y="137" width="18" height="18" rx="2" className={i === blocks.length - 1 ? s.mine : s.block} />)}
      <path d="M200 96V110" />
    </svg>
  );
}
