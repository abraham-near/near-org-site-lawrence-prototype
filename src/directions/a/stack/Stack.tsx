import type React from "react";
import { PLATE_ASPECT, StackPlate } from "./StackPlate";
import { StackPanel } from "./StackPanel";
import { StackMotion } from "./StackMotion";
import st from "./Stack.module.css";

// Direction A, the Stack (research/dir-a.md §5.3): the page's one dark section, on forest, drawn as an engineering
// plate. Same three columns as the live page (the layer list, the selected layer's detail, the drawing) and the same
// behaviour (pinned step-through on desktop with motion; hover and click on the drawing), with the copy and figures
// of components/home/stack/layers.ts. Then the secondary row (Governance, Economics), as on the live page; the pin is
// only as tall as its content, so the row follows it without a dead band.
export function Stack() {
  return (
    <section id="stack" className={st.band} aria-labelledby="a-stack-title" data-a-stack data-tone="dark" data-sel="protocol">
      <div className={st.inner}>
        <div className={st.track} data-track>
          <div className={st.pin}>
            <header className={st.head}>
              <h2 id="a-stack-title" className="t-h2">Four layers. One <span className="accent">system.</span></h2>
              <p className="t-lede">Each layer does one job, and together they keep your world in your&nbsp;hands.</p>
            </header>
            <div className={st.cols}>
              <div className={st.art} style={{ "--ar": PLATE_ASPECT.toFixed(4) } as React.CSSProperties}><StackPlate /></div>
              <StackPanel />
            </div>
          </div>
        </div>

        <div className={st.secondary}>
          <div>
            <h3 className="t-h4">Governance</h3>
            <p>The network is user-owned too. NEAR&apos;s direction is set onchain through House of Stake.</p>
            <a className={st.more} href="https://houseofstake.org/">House of Stake<svg viewBox="0 0 10 10" width="9" height="9" aria-hidden="true" focusable="false"><path d="M3 1.5h5.5V7M8.5 1.5 1.5 8.5" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg><span className="sr-only"> (another site)</span></a>
          </div>
          <div>
            <h3 className="t-h4">Economics</h3>
            <p>How the network sustains itself, explained in one&nbsp;place.</p>
            <a className={st.more} href="/economics">Read the fundamentals</a>
          </div>
        </div>
      </div>
      <StackMotion />
    </section>
  );
}
