"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { FILTERS, ITEMS, LOGOS, TYPE_LABEL, type DeeperFilter, type DeeperItem, type DeeperType } from "@/components/home/go-deeper/content";
import { Corners } from "../graphics/Marks";
import d from "./Deeper.module.css";

// Go deeper as an atlas index (research/dir-a.md §5.5). The filter is a ruled tablist (arrows, Home/End) mirrored in
// ?type=; switching fades the old panel out fast and settles the new one in (D28). Each panel: up to three plates
// (images with registration corners, the newest first), then a gazetteer of the rest on hairlines. Items link to their
// own page where on record, otherwise to the blog listing (D20). Content: components/home/go-deeper/content.ts.
const FEATURED = 3, MORE = 9;
const pick = (f: DeeperFilter) => {
  const list = ITEMS.filter((it) => f === "all" || it.type === f);
  return { featured: list.slice(0, FEATURED), more: list.slice(FEATURED, FEATURED + MORE) };
};
const href = (it: DeeperItem) => it.url ?? "/blog";

function Glyph({ type }: { type: DeeperType }) {
  return (
    <svg className={d.glyph} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      {type === "story" && <><circle cx="8" cy="8" r="4.5" /><path d="M8 1v3.5M8 11.5V15M1 8h3.5M11.5 8H15" /></>}
      {type === "read" && <><rect x="3" y="1.5" width="10" height="13" /><path d="M5.5 5h5M5.5 8h5M5.5 11h3" /></>}
      {type === "watch" && <><rect x="1.5" y="2.5" width="13" height="11" /><path d="M6.5 5.5v5l4-2.5z" /></>}
      {type === "press" && <><path d="M2 3h12v10H2zM5 6h6M5 9h6" /></>}
    </svg>
  );
}

function Source({ it }: { it: DeeperItem }) {
  const logo = it.type === "story" ? LOGOS[it.id] : undefined;
  if (logo) return <Image src={logo.src} alt={it.source ?? ""} width={Math.round((logo.w / logo.h) * logo.height)} height={logo.height} className={d.logo} unoptimized />;
  return <span>{it.source}</span>;
}

function Panel({ f }: { f: DeeperFilter }) {
  const { featured, more } = pick(f);
  const label = FILTERS.find((x) => x.key === f)?.label ?? "";
  return (
    <>
      <ul className={d.plates} data-n={featured.length}>
        {featured.map((it, i) => (
          <li key={it.id} className={d.plate} data-lead={i === 0 || undefined}>
            <a href={href(it)} className={d.plateLink}>
              <span className={d.frame}>
                <span className={d.clip}>{it.image && <Image src={it.image} alt="" fill sizes={i === 0 ? "(min-width: 1280px) 640px, 100vw" : "(min-width: 1280px) 320px, 50vw"} className={d.img} />}</span>
                <Corners />
              </span>
              <span className={d.meta}><Glyph type={it.type} />{TYPE_LABEL[it.type]}</span>
              <span className={d.title}>{it.title}</span>
              <span className={d.source}><Source it={it} /></span>
            </a>
          </li>
        ))}
      </ul>
      {more.length > 0 ? (
        <ul className={d.index}>
          {more.map((it) => (
            <li key={it.id}>
              <a href={href(it)} className={d.row}>
                <span className={d.rowType}><Glyph type={it.type} /><span>{TYPE_LABEL[it.type]}</span></span>
                <span className={d.rowTitle}>{it.title}</span>
                <span className={d.rowSource}><Source it={it} /></span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className={d.empty}>That&apos;s everything in {label} for now.</p>
      )}
    </>
  );
}

export function DeeperIndex() {
  const [active, setActive] = useState<DeeperFilter>("all");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("type") as DeeperFilter | null;
    if (t && FILTERS.some((f) => f.key === t)) queueMicrotask(() => setActive(t));
  }, []);

  const choose = (f: DeeperFilter) => {
    setActive(f);
    const url = new URL(window.location.href);
    if (f === "all") url.searchParams.delete("type"); else url.searchParams.set("type", f);
    window.history.replaceState(null, "", url);
  };
  const onKey = (e: KeyboardEvent, i: number) => {
    const n = FILTERS.length;
    const to = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    choose(FILTERS[to].key);
    tabs.current[to]?.focus();
  };

  return (
    <>
      <div className={d.filters} role="tablist" aria-label="Filter by type">
        {FILTERS.map((f, i) => (
          <button
            key={f.key} ref={(el) => { tabs.current[i] = el; }} type="button" role="tab" id={`a-deeper-tab-${f.key}`}
            aria-selected={f.key === active} aria-controls={`a-deeper-panel-${f.key}`} tabIndex={f.key === active ? 0 : -1}
            className={d.filter} onClick={() => choose(f.key)} onKeyDown={(e) => onKey(e, i)}
          >
            {f.label}<span className={d.count} aria-hidden="true">{f.key === "all" ? ITEMS.length : ITEMS.filter((it) => it.type === f.key).length}</span>
          </button>
        ))}
      </div>
      <div className={d.panels}>
        {FILTERS.map((f) => (
          <div key={f.key} role="tabpanel" id={`a-deeper-panel-${f.key}`} aria-labelledby={`a-deeper-tab-${f.key}`} className={d.panel} data-active={f.key === active || undefined} inert={f.key !== active}>
            <Panel f={f.key} />
          </div>
        ))}
      </div>
    </>
  );
}
