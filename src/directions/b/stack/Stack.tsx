import { StackGlass } from "./StackGlass";
import { StackTabs } from "./StackTabs";
import s from "./Stack.module.css";

// Direction B, the Stack (spec/pages/home.md §2; content from components/home/stack/layers.ts, unchanged): the page's
// one dark band, a forest field. The heading, then three columns: the four layers as a list (core first), the selected
// layer's detail on a dark glass panel, and the Stack drawn as glass slabs with refractive green edges standing on an
// isometric floor of hairlines. Then the secondary row (governance, economics).
export function Stack() {
  return (
    <section id="stack" className={s.band} aria-labelledby="b-stack-title" data-tone="dark" data-active="protocol">
      <div className={s.inner}>
        <header className={s.head}>
          <h2 id="b-stack-title" className="t-h2">Four layers. One <span className="accent">system.</span></h2>
          <p className={`t-lede ${s.lede}`}>Each layer does one job, and together they keep your world in your&nbsp;hands.</p>
        </header>
        <div className={s.art} data-art><StackGlass /></div>
        <StackTabs />
        <div className={s.secondary}>
          <div>
            <h3 className="t-h4">Governance</h3>
            <p>The network is user-owned too. NEAR&apos;s direction is set onchain through House of Stake.</p>
            <a className={s.more} href="https://houseofstake.org/">House of Stake<svg viewBox="0 0 10 10" width="9" height="9" aria-hidden="true" focusable="false"><path d="M3 1.5h5.5V7M8.5 1.5 1.5 8.5" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg><span className="sr-only"> (another site)</span></a>
          </div>
          <div>
            <h3 className="t-h4">Economics</h3>
            <p>How the network sustains itself, explained in one&nbsp;place.</p>
            <a className={s.more} href="/economics">Read the fundamentals</a>
          </div>
        </div>
      </div>
    </section>
  );
}
