"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FILTERS, LOGOS, TYPE_LABEL, lead, type DeeperFilter, type DeeperItem } from "./content";
import styles from "./GoDeeper.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Go deeper, after the r16/v3 prototype: the heading with the filters on its right over an ink rule; then, per filter,
// the newest item large with its photo on the left and every other item as a row (meta, title, thumbnail) on the right.
// The filter tablist (arrows, Home/End) is mirrored in ?type= so a filter can be linked to. All panels share one grid
// cell on desktop, so switching never moves the page there (D9).
//
// Desktop with motion: the list is a window the photo's height showing --n rows (4, or 3 on screens under 800 px tall).
// The section holds still (CSS sticky, D8) while the page scroll moves the list up through the window, a row at a time
// with a short hold at each (scrubbed and reversible; native scrolling throughout). The hold lasts as long as the
// active filter needs to bring its last row in (CSS: --rows), so a filter whose rows fit has none.
// Elsewhere (phones, tablets, reduced motion, no JS) the whole list simply shows.

const isFilter = (v: string | null): v is DeeperFilter => FILTERS.some((f) => f.key === v);
const WIN = "(min-width: 1280px) and (prefers-reduced-motion: no-preference)";
const FLOW = "(max-width: 1279px) and (prefers-reduced-motion: no-preference)";
const SCRUB = 0.6; // DESIGN §4: about 0.6 s of scrub smoothing
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const smooth = (t: number) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
const pad = (n: number) => String(n).padStart(2, "0");

// Reads ?type= (client-rendered under Suspense; the prerendered fallback is the "All" view).
export function DeeperFromUrl() {
  const params = useSearchParams();
  const type = params.get("type");
  // A choice shows at once; the URL (replaceState, so no history entries) catches up a moment later (D28).
  const [picked, setPicked] = useState<DeeperFilter | null>(null);
  const active: DeeperFilter = picked ?? (isFilter(type) ? type : "all");
  const choose = (next: DeeperFilter) => {
    setPicked(next);
    const u = new URL(window.location.href);
    if (next === "all") u.searchParams.delete("type"); else u.searchParams.set("type", next);
    window.history.replaceState(null, "", u);
  };
  return <DeeperView active={active} onSelect={choose} />;
}

export function DeeperView({ active, onSelect }: { active: DeeperFilter; onSelect?: (f: DeeperFilter) => void }) {
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const track = useRef<HTMLDivElement>(null);
  const held = useRef(false); // the section was holding (sticky) when the filter changed
  const seen = useRef<number | null>(null); // where the stage sat on screen just before a switch
  const first = useRef(true);
  const [near, setNear] = useState(false); // thumbnails load once the section is within two screens
  const rows = lead(active).rest.length || 1; // the empty note takes one row

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: "200% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const select = (next: DeeperFilter) => {
    const el = track.current;
    if (el) {
      const r = el.getBoundingClientRect();
      held.current = r.top <= 1 && r.bottom >= innerHeight - 1;
      seen.current = (el.firstElementChild ?? el).getBoundingClientRect().top;
    }
    onSelect?.(next);
  };

  useGSAP(() => {
    const el = track.current;
    const panel = el?.querySelector<HTMLElement>(`#deeper-panel-${active}`);
    if (!el || !panel) return;
    const switched = !first.current;
    first.current = false;
    // The track's length (desktop) or the list's (elsewhere) just changed, so the page may have moved under the reader
    // (a shorter track ends the hold early). Keep the stage exactly where the reader saw it: if it was holding, the new
    // list starts at its top; otherwise the page shifts by however far the stage moved. Then re-measure the triggers.
    if (switched) {
      const stage = (el.firstElementChild ?? el) as HTMLElement;
      const win = matchMedia(WIN).matches, old = seen.current;
      if (held.current && win) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY, behavior: "instant" });
      // Past the hold, the stage rests at the track's end, so its place depends on the new track's length: put the
      // page where the stage ends exactly where it was (a longer list then shows its last rows)
      else if (win && old !== null && old < -0.5) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - old + el.offsetHeight - innerHeight, behavior: "instant" });
      else if (old !== null) {
        const moved = stage.getBoundingClientRect().top - old;
        if (Math.abs(moved) > 0.5) window.scrollBy({ top: moved, behavior: "instant" });
      }
      held.current = false;
      seen.current = null;
    }
    const list = panel.querySelector<HTMLElement>("[data-list]");
    const bar = panel.querySelector<HTMLElement>("[data-bar]"), thumb = bar?.firstElementChild as HTMLElement | null;
    const items = [...panel.querySelectorAll<HTMLElement>("[data-row]")];
    const setK = (row: HTMLElement, v: number) => {
      row.style.setProperty("--k", smooth(v * 1.6).toFixed(3));
      row.style.setProperty("--kt", smooth((v - 0.25) / 0.75).toFixed(3));
    };
    const mm = gsap.matchMedia();

    // D96: no halftone on the lead photo any more (Lawrence: "remove this pixel effect when the image appears"); it
    // fades in as it loads, like the thumbnails

    // Desktop: the windowed list, moved by the page scroll while the section holds
    mm.add(WIN, () => {
      if (!list) return;
      const N = () => parseInt(getComputedStyle(el).getPropertyValue("--n"), 10) || 4;
      const steps = () => Math.max(0, items.length - N());
      const hold = (t: number) => smooth((t - 0.2) / 0.6); // a hold at each row, then a smooth step to the next
      let cur = 0;
      const render = (x: number) => {
        const n = steps(), sx = x * n, i = Math.min(n, Math.floor(sx)), e = n ? i + (i < n ? hold(sx - i) : 0) : 0;
        cur = e;
        const rowh = (list.parentElement?.clientHeight ?? 0) / N();
        list.style.transform = `translate3d(0, ${(-e * rowh).toFixed(2)}px, 0)`;
        // D96: the scroll bar on the window's right edge: the thumb is the share of rows in view, at the rows shown
        if (thumb) {
          const all = items.length, H = list.parentElement?.clientHeight ?? 0;
          thumb.style.height = `${((Math.min(N(), all) / all) * H).toFixed(1)}px`;
          thumb.style.transform = `translate3d(0, ${((e / all) * H).toFixed(2)}px, 0)`;
          bar?.toggleAttribute("data-on", n > 0);
        }
      };
      const state = { x: 0 };
      const tl = gsap.timeline({ paused: true }).fromTo(state, { x: 0 }, { x: 1, duration: 1, ease: "none", immediateRender: false, onUpdate: () => render(state.x) });
      const st = ScrollTrigger.create({ trigger: el, start: "top top", end: "bottom bottom", scrub: SCRUB, animation: tl, onRefresh: () => render(state.x) });
      render(0);
      // The rows draw in as the section comes up: one clock for the window, staggered by row
      const drawIn = (v: number) => items.forEach((row, j) => setK(row, clamp((v * 1.5 - 0.09 * Math.min(j, N())) / 0.7, 0, 1)));
      const tIn = ScrollTrigger.create({ trigger: el, start: "top bottom", end: "top 20%", onUpdate: (s) => drawIn(s.progress), onRefresh: (s) => drawIn(s.progress) });
      // Keyboard: a row reached by Tab outside the window brings the page to the step that shows it
      const onFocus = (e: FocusEvent) => {
        const row = (e.target as HTMLElement).closest<HTMLElement>("[data-row]");
        const i = row ? items.indexOf(row) : -1, n = N(), k = steps();
        if (i < 0 || !k || (i >= cur - 0.01 && i <= cur + n - 1 + 0.01 && st.isActive)) return;
        const s = clamp(i < cur ? i : i - n + 1, 0, k);
        const y = st.start + (s / k) * (st.end - st.start);
        requestAnimationFrame(() => { window.scrollTo({ top: y, behavior: "instant" }); tl.progress(s / k); render(s / k); });
      };
      panel.addEventListener("focusin", onFocus);
      // D98 (Lawrence: "this scroll bar should be draggable"): the page scroll moves the list, so dragging the thumb
      // scrolls the page to the matching point (the rows and the thumb follow, through the same scrub); a press on the
      // track jumps the thumb's middle to it and drags from there
      let grab = 0;
      const toPointer = (e: PointerEvent) => {
        if (!bar || !thumb) return;
        const r = bar.getBoundingClientRect(), th = thumb.offsetHeight, room = r.height - th;
        const x = room > 0 ? clamp((e.clientY - r.top - grab) / room, 0, 1) : 0;
        window.scrollTo({ top: st.start + x * (st.end - st.start), behavior: "instant" });
      };
      const onMove = (e: PointerEvent) => toPointer(e);
      const onUp = (e: PointerEvent) => {
        bar?.releasePointerCapture(e.pointerId);
        bar?.removeAttribute("data-drag");
        bar?.removeEventListener("pointermove", onMove);
        bar?.removeEventListener("pointerup", onUp);
        bar?.removeEventListener("pointercancel", onUp);
      };
      const onDown = (e: PointerEvent) => {
        if (!bar || !thumb || e.button !== 0) return;
        e.preventDefault();
        const t = thumb.getBoundingClientRect();
        grab = e.clientY >= t.top && e.clientY <= t.bottom ? e.clientY - t.top : t.height / 2;
        bar.setPointerCapture(e.pointerId);
        bar.setAttribute("data-drag", "");
        bar.addEventListener("pointermove", onMove);
        bar.addEventListener("pointerup", onUp);
        bar.addEventListener("pointercancel", onUp);
        toPointer(e);
      };
      bar?.addEventListener("pointerdown", onDown);
      return () => {
        bar?.removeEventListener("pointerdown", onDown);
        panel.removeEventListener("focusin", onFocus);
        st.kill(); tIn.kill(); tl.kill();
        list.style.transform = "";
        bar?.removeAttribute("data-on");
        items.forEach((row) => { row.style.removeProperty("--k"); row.style.removeProperty("--kt"); });
      };
    });

    // Phones and tablets: each row draws in over the first 64 px after it enters
    mm.add(FLOW, () => {
      const sts = items.map((row) => {
        setK(row, 0);
        return ScrollTrigger.create({ trigger: row, start: "clamp(top bottom)", end: "clamp(top bottom-=64)", onUpdate: (s) => setK(row, s.progress), onRefresh: (s) => setK(row, s.progress) });
      });
      return () => { sts.forEach((s) => s.kill()); items.forEach((row) => { row.style.removeProperty("--k"); row.style.removeProperty("--kt"); }); };
    });

    const raf = switched ? requestAnimationFrame(() => ScrollTrigger.refresh()) : 0;
    return () => { cancelAnimationFrame(raf); mm.revert(); };
  }, { scope: track, dependencies: [active], revertOnUpdate: true });

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = FILTERS.length;
    const to = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    select(FILTERS[to].key);
    tabs.current[to]?.focus();
  };

  return (
    <div ref={track} className={styles.track} style={{ "--rows": rows } as CSSProperties}>
      <div className={styles.stage}>
        <div className={styles.inner}>
          <header className={styles.head}>
            <h2 id="deeper-title" className="t-h2">Go <span className="accent">deeper</span></h2>
            <div className={styles.filters} role="tablist" aria-label="Filter by type">
              {FILTERS.map((f, i) => (
                <button
                  key={f.key} ref={(el) => { tabs.current[i] = el; }}
                  type="button" role="tab" id={`deeper-tab-${f.key}`} aria-controls={`deeper-panel-${f.key}`}
                  aria-selected={f.key === active} tabIndex={f.key === active ? 0 : -1}
                  className={styles.filter} onClick={() => select(f.key)} onKeyDown={(e) => onKey(e, i)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </header>
          <div className={styles.panels}>
            {FILTERS.map((f) => <Panel key={f.key} filter={f.key} label={f.label} active={f.key === active} near={near} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({ filter, label, active, near }: { filter: DeeperFilter; label: string; active: boolean; near: boolean }) {
  const { first, rest } = lead(filter);
  return (
    <div role="tabpanel" id={`deeper-panel-${filter}`} aria-labelledby={`deeper-tab-${filter}`} className={styles.panel} data-active={active || undefined} inert={!active}>
      {first && <Featured item={first} show={active} eager={filter === "all"} />}
      <div className={styles.win}>
        {rest.length > 0 ? (
          <>
            <ol className={styles.list} data-list aria-label={`More in ${label}`}>
              {rest.map((it, i) => <Row key={it.id} item={it} n={i + 2} show={active && near} />)}
            </ol>
            {/* D96: a scroll bar on the window's right edge (desktop with motion, where the list moves in the window) */}
            <span className={styles.bar} data-bar aria-hidden="true"><span className={styles.thumb2} /></span>
          </>
        ) : (
          <p className={styles.empty}>That&rsquo;s everything in {label} for now.</p>
        )}
      </div>
      <div className={styles.foot}>
        <a href="/blog" className={styles.all}>View everything</a>
      </div>
    </div>
  );
}

// Every item is one link (D20): its own page where the URL is on record, otherwise the blog listing (never a dead "#")
const Title = ({ item }: { item: DeeperItem }) => {
  const href = item.url ?? "/blog", external = /^https?:/.test(href);
  return (
    <a href={href} className={styles.stretch}>
      {item.title}
      {external && <span className="sr-only"> (another site)</span>}
    </a>
  );
};
// A customer story's company, as its own logo (D37), small and in its published colours; the name is its alt text
const Source = ({ item }: { item: DeeperItem }) => {
  const logo = item.type === "story" ? LOGOS[item.id] : undefined;
  if (!logo) return <span className={styles.source}>{item.source}</span>;
  return (
    <span className={styles.source}>
      <Image src={logo.src} alt={item.source ?? ""} width={Math.round((logo.w / logo.h) * logo.height)} height={logo.height} className={styles.logo} style={{ height: logo.height }} unoptimized />
    </span>
  );
};
// The position in the filter (01, 02 …) is for the eye only; dates show only once they are real (D16)
const Meta = ({ item, n }: { item: DeeperItem; n: number }) => (
  <p className={styles.meta}>
    <span className={styles.idx} aria-hidden="true">{pad(n)}</span>
    <span className={styles.type}>{TYPE_LABEL[item.type]}</span>
    <Source item={item} />
    {item.date && <time dateTime={item.date}>{item.date}</time>}
  </p>
);

// The lead item. Its image loads only for the visible panel; hidden panels keep the media box, so the shared height holds
function Featured({ item, show, eager }: { item: DeeperItem; show: boolean; eager: boolean }) {
  return (
    <article className={styles.feat}>
      <div className={styles.media} data-media>
        {item.image && show && <Image src={item.image} alt="" fill sizes="(min-width: 1440px) 604px, (min-width: 1280px) 46vw, (min-width: 768px) 50vw, 100vw" loading={eager ? undefined : "lazy"} className={styles.img} onLoad={(e) => e.currentTarget.setAttribute("data-loaded", "")} />}
      </div>
      <div className={styles.featText}>
        <Meta item={item} n={1} />
        <h3 className={styles.featTitle}><Title item={item} /></h3>
        {item.note && <p className={styles.note}>{item.note}</p>}
      </div>
    </article>
  );
}

function Row({ item, n, show }: { item: DeeperItem; n: number; show: boolean }) {
  return (
    <li className={styles.row} data-row>
      <div className={styles.rowText}>
        <Meta item={item} n={n} />
        <h3 className={styles.rowTitle}><Title item={item} /></h3>
        {item.note && <p className={styles.note}>{item.note}</p>}
      </div>
      <div className={styles.thumb}>
        {item.image && show && <Image src={item.image} alt="" fill sizes="(min-width: 1280px) 150px, 96px" className={styles.img} onLoad={(e) => e.currentTarget.setAttribute("data-loaded", "")} />}
      </div>
    </li>
  );
}
