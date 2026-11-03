"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FILTERS, TILE_LABEL, TYPE_LABEL, select, type DeeperFilter, type DeeperItem, type DeeperType } from "./content";
import styles from "./GoDeeper.module.css";

// The filter tablist and its five panels (layout 4C, D9). All panels share one grid cell, so the section always
// holds the tallest filter's height and switching never moves the page (on phones only the active one is shown;
// see the CSS). The filter is mirrored in ?type= so a filter can be linked to.

const isFilter = (v: string | null): v is DeeperFilter => FILTERS.some((f) => f.key === v);

// Reads ?type= (client-rendered under Suspense; the prerendered fallback is the "All" view).
export function DeeperFromUrl() {
  const params = useSearchParams();
  const type = params.get("type");
  // A choice shows at once; the URL (replaceState, so no history entries) catches up a moment later. Without this
  // the old panel stayed active for ~300 ms, so a quick Tab landed in it and lost focus when it hid (D28).
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

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = FILTERS.length;
    const to = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    onSelect?.(FILTERS[to].key);
    tabs.current[to]?.focus();
  };

  return (
    <>
      <div className={styles.filters} role="tablist" aria-label="Filter by type">
        {FILTERS.map((f, i) => (
          <button
            key={f.key} ref={(el) => { tabs.current[i] = el; }}
            type="button" role="tab" id={`deeper-tab-${f.key}`} aria-controls={`deeper-panel-${f.key}`}
            aria-selected={f.key === active} tabIndex={f.key === active ? 0 : -1}
            className={styles.filter} onClick={() => onSelect?.(f.key)} onKeyDown={(e) => onKey(e, i)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className={styles.panels}>
        {FILTERS.map((f) => <Panel key={f.key} filter={f.key} label={f.label} active={f.key === active} />)}
      </div>
    </>
  );
}

function Panel({ filter, label, active }: { filter: DeeperFilter; label: string; active: boolean }) {
  const { featured, more } = select(filter);
  return (
    <div
      role="tabpanel" id={`deeper-panel-${filter}`} aria-labelledby={`deeper-tab-${filter}`}
      className={styles.panel} data-active={active || undefined} inert={!active}
    >
      <div className={styles.featGrid} data-count={featured.length}>
        {featured.map((it, i) => <Featured key={it.id} item={it} show={active} eager={filter === "all" && i < 2} wide={featured.length === 1} />)}
      </div>
      {more.length > 0 ? <Strip items={more} label={label} /> : (
        <p className={styles.empty}>That&rsquo;s everything in {label} for now. <a href="/blog">View everything</a></p>
      )}
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
const Source = ({ item }: { item: DeeperItem }) => <>{item.source}</>;
// Dates show only once they are real; until then the section note covers them (one marker, not one per item)
const DateTbd = ({ item }: { item: DeeperItem }) => (item.date ? <time dateTime={item.date}>{item.date}</time> : null);

// Images load only for the visible panel; hidden panels keep the media box, so the shared height still holds.
function Featured({ item, show, eager, wide }: { item: DeeperItem; show: boolean; eager: boolean; wide: boolean }) {
  return (
    <article className={styles.feat}>
      <div className={styles.media}>
        {item.image && show && <Image src={item.image} alt="" fill sizes={wide ? "(min-width: 1440px) 1316px, 100vw" : "(min-width: 1440px) 634px, (min-width: 768px) 50vw, 100vw"} loading={eager ? undefined : "lazy"} className={styles.img} onLoad={(e) => e.currentTarget.setAttribute("data-loaded", "")} />}
      </div>
      <p className={styles.meta}><span className={styles.type}>{TYPE_LABEL[item.type]}</span><DateTbd item={item} /></p>
      <h3 className={styles.featTitle}><Title item={item} /></h3>
      <p className={styles.src}><Source item={item} /></p>
      {item.note && <p className={styles.note}>{item.note}</p>}
    </article>
  );
}

// The older items: a horizontally scrolling strip of hairline tiles with a type glyph (never images). The scroll
// buttons only show when the strip overflows.
function Strip({ items, label }: { items: DeeperItem[]; label: string }) {
  const strip = useRef<HTMLOListElement>(null);
  const nav = useRef<HTMLDivElement>(null);
  const prev = useRef<HTMLButtonElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const id = `deeper-strip-${label.toLowerCase().replace(/\W+/g, "-")}`;

  useEffect(() => {
    const s = strip.current, n = nav.current;
    if (!s || !n) return;
    // Hide the buttons when nothing overflows; disable each one at its end.
    const sync = () => {
      const max = s.scrollWidth - s.clientWidth;
      n.hidden = max <= 1;
      if (prev.current) prev.current.disabled = s.scrollLeft <= 1;
      if (next.current) next.current.disabled = s.scrollLeft >= max - 1;
    };
    const ro = new ResizeObserver(sync);
    ro.observe(s);
    s.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => { ro.disconnect(); s.removeEventListener("scroll", sync); };
  }, []);

  const go = (dir: number) => {
    const s = strip.current;
    if (!s) return;
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    s.scrollBy({ left: dir * s.clientWidth * 0.8, behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <div className={styles.stripWrap}>
      {/* Focusable so keyboard users can scroll it with the arrow keys */}
      <ol ref={strip} id={id} className={styles.strip} tabIndex={0} aria-label={`More in ${label}, scrolls sideways`}>
        {items.map((it) => (
          <li key={it.id} className={styles.tile}>
            <p className={styles.meta}><Glyph type={it.type} /><span>{TILE_LABEL[it.type]}</span><DateTbd item={it} /></p>
            <h3 className={styles.tileTitle}><Title item={it} /></h3>
            <p className={styles.tileSrc}><Source item={it} /></p>
          </li>
        ))}
      </ol>
      <div ref={nav} className={styles.stripNav}>
        <button ref={prev} type="button" className={styles.navBtn} onClick={() => go(-1)} aria-controls={id} aria-label="Previous items">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6 8.5 12l6 6" /></svg>
        </button>
        <button ref={next} type="button" className={styles.navBtn} onClick={() => go(1)} aria-controls={id} aria-label="Next items">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  );
}

// Type glyphs: simple line icons (not logos).
function Glyph({ type }: { type: DeeperType }) {
  return (
    <svg className={styles.glyph} viewBox="0 0 24 24" aria-hidden="true">
      {type === "story" && <><rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M8 13.5c0-2 .8-3.3 2.6-4M13 13.5c0-2 .8-3.3 2.6-4" /></>}
      {type === "read" && <><path d="M6 3.5h8.5l4 4v13H6z" /><path d="M14.5 3.5v4h4M9 12h6.5M9 15.5h6.5" /></>}
      {type === "watch" && <><circle cx="12" cy="12" r="8.5" /><path d="M10.2 8.8v6.4l5.2-3.2z" /></>}
      {type === "press" && <><path d="M4 5.5h13v13H6a2 2 0 0 1-2-2z" /><path d="M17 9h3v8a1.5 1.5 0 0 1-3 0M7.5 9h6M7.5 12h6M7.5 15h4" /></>}
    </svg>
  );
}
