import type React from "react";
import Image from "next/image";
import { ANSWER, CONNECT, MEET, OWN, PROBLEM } from "@/components/home/story/copy";
import { LayerFigure, OWN_FIGURES } from "./figures";
import { StoryMotion } from "./StoryMotion";
import s from "../graphics/survey.module.css";
import st from "./Story.module.css";

// Direction A, the story (research/dir-a.md §5.2): the anthem on a ruled sheet, then the traverse.
// The anthem: six set lines on hairline baselines, with line numbers in the margin (Mono); with motion the sheet pins
// and each line wipes on word by word, its baseline drawing under it and its number arriving as it goes solid.
// The traverse (the horizontal rail, kept horizontal): one surveyed line with chainage ticks carries the story
// sideways. AI and blockchain at the two ends meet at NEAR; the layer beneath your agents is someone else's while the
// problem is read and turns user-owned with the answer; then four stations, one for each thing you own. Desktop with
// motion: the stage pins and the track slides as the reader scrolls down (StoryMotion). Elsewhere it is a native
// sideways scroller with snap, and the three headings sit above it. Copy verbatim (components/home/story/copy.ts).

const ANTHEM: { text: string; green?: boolean }[] = [
  { text: "NEAR is open infrastructure" },
  { text: "powering the agent economy." },
  { text: "Confidential by design and secured" },
  { text: "for the quantum era, it lets you" },
  { text: "trade anything, anywhere, and" },
  { text: "own your intelligence.", green: true },
];
const SENTENCE = ANTHEM.map((l) => l.text).join(" ");

// Station centres on the track, in vw (motion layout); StoryMotion moves the track to bring each to the middle
export const TRACK = { hub: 50, gate: 145, own: [225, 295, 365, 435], end: 495 };
const chain = (vw: number) => `${Math.floor(vw / 100)}+${String(Math.round((vw % 100) * 10)).padStart(3, "0")}`;

export function Story() {
  return (
    <section id="story" className={`${st.story} ${s.sheet}`} aria-labelledby="story-anthem">
      {/* The anthem */}
      <div className={st.anthemTrack} data-an="root">
        <div className={st.anthemSheet} data-a-watch="0.4">
          <h2 id="story-anthem" className={st.anthem}>
            <span className="sr-only">{SENTENCE}</span>
            <span aria-hidden="true" className={st.anthemLines}>
              <Image src="/brand/icon_tile.svg" alt="" width={160} height={160} className={st.tile} unoptimized />
              {ANTHEM.map((l, i) => (
                <span key={i} className={`${st.aLine} ${i < 2 ? st.aBeside : ""}`} data-an="line">
                  <span className={st.aNo} data-an="no" />
                  <span className={`${st.aText} ${l.green ? st.aGreen : ""}`}>
                    {l.text.split(" ").map((w, k) => <span key={k} className={st.aw} data-an="w">{w} </span>)}
                  </span>
                  <span className={st.aRule} data-an="rule" />
                </span>
              ))}
            </span>
          </h2>
        </div>
      </div>

      {/* The traverse */}
      <div className={st.trTrack} data-tr="root">
        <div className={st.trStage} data-tr="stage">
          <div className={st.heads}>
            <h3 className={st.connect} data-tr="connect">
              {CONNECT.map((c) => <span key={c} className={st.sent}>{c} </span>)}
              <span className={st.sent}>{MEET.near}{MEET.rest}</span>
            </h3>
            <p className={st.problem} data-tr="problem">{PROBLEM}</p>
            <p className={st.answer} data-tr="answer">
              {ANSWER.pre}{ANSWER.near}{ANSWER.mid}<span className={st.owned}>{ANSWER.owned}</span>
            </p>
          </div>

          <div className={st.viewport} data-tr="viewport" tabIndex={0} role="region" aria-label="The four things you own">
            <div className={st.track} data-tr="track" style={{ "--end": `${TRACK.end}vw` } as React.CSSProperties}>
              <span className={st.line} />
              <span className={st.lineGreen} data-tr="green" />
              <span className={st.chainage} />

              {/* Station 0: the two ends meet at NEAR */}
              <div className={`${st.panel} ${st.pConnect}`} aria-hidden="true" data-a-watch="0.3" style={{ "--x": TRACK.hub } as React.CSSProperties}>
                <span className={`${st.end} ${st.endL}`} data-tr="end"><b>AI</b> the frontend</span>
                <span className={`${st.end} ${st.endR}`} data-tr="end"><b>Blockchain</b> the backend</span>
                <span className={`${st.half} ${st.halfL}`} data-tr="halfL" />
                <span className={`${st.half} ${st.halfR}`} data-tr="halfR" />
                <span className={st.hub} data-tr="hub"><Image src="/brand/icon.svg" alt="" width={639} height={639} unoptimized /></span>
                <span className={st.km}>{chain(TRACK.hub)}</span>
              </div>

              {/* Station 1: the layer beneath your agents */}
              <div className={`${st.panel} ${st.pGate}`} aria-hidden="true" data-a-watch="0.3" data-tr="gate" style={{ "--x": TRACK.gate } as React.CSSProperties}>
                <div className={st.figure}><LayerFigure /></div>
                <span className={st.node} />
                <span className={st.km}>{chain(TRACK.gate)}</span>
              </div>

              {/* Stations 2–5: own your … */}
              <ol className={st.ownList}>
                {OWN.map((o, i) => {
                  const Fig = OWN_FIGURES[o.key];
                  return (
                    <li key={o.key} className={`${st.panel} ${st.pOwn}`} data-a-watch="0.35" data-tr="station" style={{ "--x": TRACK.own[i] } as React.CSSProperties}>
                      <div className={st.figure} aria-hidden="true"><Fig /></div>
                      <span className={st.node} aria-hidden="true"><svg viewBox="-12 -12 24 24"><circle r="9" className={`${s.green} ${s.pulse}`} /></svg></span>
                      <span className={st.km} aria-hidden="true">{chain(TRACK.own[i])}</span>
                      <h4 className={st.ownTitle}>Own your <span className="accent">{o.word}</span></h4>
                      <p className={st.ownLine}>{o.line}</p>
                    </li>
                  );
                })}
              </ol>
              <span className={st.terminus} aria-hidden="true">
                <svg viewBox="-14 -14 28 28"><circle r="8" className={s.ink} /><path d="M-13 0H13M0-13V13" className={s.ink} /><circle r="2.5" className={s.inkFill} /></svg>
              </span>
            </div>
          </div>
          <p className={st.readout} aria-hidden="true"><span className={st.readLabel}>Chainage</span> <span className={s.num} data-tr="ch">0+000</span></p>
        </div>
      </div>
      <StoryMotion track={TRACK} />
    </section>
  );
}
