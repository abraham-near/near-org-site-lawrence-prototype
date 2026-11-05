"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { FILTERS, LOGOS, TYPE_LABEL, TILE_LABEL, select, type DeeperFilter, type DeeperItem } from "@/components/home/go-deeper/content";
import glass from "../glass.module.css";
import s from "./Deeper.module.css";

// Direction B, Go deeper (spec/pages/home.md §4; content from components/home/go-deeper/content.ts, unchanged). One
// filtered section: the filter is a glass segmented control (a tablist, arrows and Home/End, mirrored in ?type=). The
// lead item is large, its caption on a frosted plate over the photograph; two more sit beside it; the rest are hairline
// rows with a type glyph, in two columns. Customer stories show the company's own logo (D37). Switching filters: the
// old panel goes out fast, the new one settles in (D28). Every item is one link (its page, or the blog until the CMS).
const href = (it: DeeperItem) => it.url ?? "/blog";

function Meta({ it, logo = false }: { it: DeeperItem; logo?: boolean }) {
  const l = logo && it.type === "story" ? LOGOS[it.id] : undefined;
  return (
    <p className={s.meta}>
      <span className={s.type}>{TYPE_LABEL[it.type]}</span>
      {l ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={l.src} alt={it.source} width={Math.round((l.w / l.h) * l.height)} height={l.height} className={s.logo} />
      ) : it.source && <span className={s.source}>{it.source}</span>}
    </p>
  );
}

function Glyph({ type }: { type: DeeperItem["type"] }) {
  return (
    <svg className={s.glyph} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      {type === "watch" && <><rect x="2.5" y="4.5" width="15" height="11" rx="1.5" /><path d="M8.5 7.5v5l4-2.5z" /></>}
      {type === "read" && <><path d="M4.5 3.5h8l3 3v10h-11z" /><path d="M7 9.5h6M7 12.5h6" /></>}
      {(type === "story" || type === "press") && <><circle cx="10" cy="10" r="6.5" /><path d="M10 3.5v13M3.5 10h13" /></>}
    </svg>
  );
}

export function Deeper() {
  const [filter, setFilter] = useState<DeeperFilter>("all");
  const [shown, setShown] = useState<DeeperFilter>("all");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // ?type= in, once after hydration (the prerendered HTML shows All); then mirrored out
  useEffect(() => {
    const id = window.setTimeout(() => {
      const t = new URLSearchParams(window.location.search).get("type") as DeeperFilter | null;
      if (t && FILTERS.some((f) => f.key === t)) { setFilter(t); setShown(t); }
    }, 0);
    return () => clearTimeout(id);
  }, []);
  // Out fast (120 ms), then in slow
  useEffect(() => {
    if (filter === shown) return;
    const id = window.setTimeout(() => setShown(filter), 120);
    const url = new URL(window.location.href);
    if (filter === "all") url.searchParams.delete("type"); else url.searchParams.set("type", filter);
    window.history.replaceState(null, "", url);
    return () => clearTimeout(id);
  }, [filter, shown]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = FILTERS.length;
    const to = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    setFilter(FILTERS[to].key);
    tabs.current[to]?.focus();
  };

  const { featured, more } = select(shown);
  const [lead, ...side] = featured;
  const label = FILTERS.find((f) => f.key === shown)?.label ?? "All";

  return (
    <section id="deeper" className={s.deeper} aria-labelledby="b-deeper-title">
      <div className={s.inner}>
        <div className={s.head}>
          <h2 id="b-deeper-title" className="t-h2">Go <span className="accent">deeper</span></h2>
          <div className={`${glass.glass} ${s.filters}`} role="tablist" aria-label="Filter by type">
            {FILTERS.map((f, i) => (
              <button
                key={f.key} ref={(el) => { tabs.current[i] = el; }} type="button" role="tab" id={`b-deeper-tab-${f.key}`}
                aria-selected={f.key === filter} aria-controls="b-deeper-panel" tabIndex={f.key === filter ? 0 : -1}
                className={s.filter} onClick={() => setFilter(f.key)} onKeyDown={(e) => onKey(e, i)}
              >{f.label}</button>
            ))}
          </div>
        </div>

        <div id="b-deeper-panel" role="tabpanel" aria-labelledby={`b-deeper-tab-${filter}`} className={s.panel} data-out={filter !== shown || undefined} key={shown}>
          <div className={s.featured} data-count={featured.length}>
            {lead && (
              <a className={`${s.item} ${s.lead}`} href={href(lead)}>
                <span className={s.frame}>
                  {lead.image && <Image src={lead.image} alt="" decoding="async" fill sizes="(min-width: 1280px) 760px, 100vw" className={s.img} />}
                  <span className={`${glass.glass} ${glass.edge} ${s.plate}`}>
                    <Meta it={lead} logo />
                    <span className={s.leadTitle}>{lead.title}</span>
                  </span>
                </span>
              </a>
            )}
            {side.map((it) => (
              <a key={it.id} className={`${s.item} ${s.side}`} href={href(it)}>
                <span className={s.frame}>{it.image && <Image src={it.image} alt="" decoding="async" fill sizes="(min-width: 1280px) 520px, 100vw" className={s.img} />}</span>
                <Meta it={it} logo />
                <span className={s.sideTitle}>{it.title}</span>
              </a>
            ))}
          </div>

          {more.length > 0 ? (
            <ul className={s.more}>
              {more.map((it) => (
                <li key={it.id}>
                  <a className={s.row} href={href(it)}>
                    <Glyph type={it.type} />
                    <span className={s.rowType}>{TILE_LABEL[it.type]}</span>
                    <span className={s.rowTitle}>{it.title}</span>
                    {it.source && <span className={s.rowSource}>{it.source}</span>}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className={s.empty}>That&rsquo;s everything in {label} for now.</p>
          )}
        </div>

        <p className={s.all}><a className="btn btn-secondary" href="/blog">View everything</a></p>
      </div>
    </section>
  );
}
