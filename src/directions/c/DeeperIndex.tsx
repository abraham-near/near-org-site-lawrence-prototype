"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { FILTERS, ITEMS, LOGOS, TYPE_LABEL, type DeeperFilter } from "@/components/home/go-deeper/content";
import styles from "./Lower.module.css";

// Go deeper as a Swiss index: a filter row, then a dated-catalogue list of every item on hairlines (type, title,
// source), with one picture frame beside it that shows the item under the pointer or keyboard focus (out fast, in
// slow: D28). Content, images, logos (D37) and links come from the current section (go-deeper/content.ts), unchanged;
// an item without its own page links to the blog listing (D20). The filter is a tablist (←/→, Home, End).
const SHOW = 8;
const ARROW = <svg className={styles.rowArrow} viewBox="0 0 10 10" width="10" height="10" aria-hidden="true" focusable="false"><path d="M3 1.5h5.5V7M8.5 1.5 1.5 8.5" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>;

export function DeeperIndex() {
  const [filter, setFilter] = useState<DeeperFilter>("all");
  const [hot, setHot] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const list = ITEMS.filter((it) => filter === "all" || it.type === filter).slice(0, SHOW);
  const shown = list[Math.min(hot, list.length - 1)];

  const pick = (f: DeeperFilter) => { setFilter(f); setHot(0); };
  const onKey = (e: KeyboardEvent, i: number) => {
    const n = FILTERS.length;
    const to = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    pick(FILTERS[to].key);
    tabs.current[to]?.focus();
  };

  return (
    <div className={styles.dBody}>
      <div className={styles.dTabs} role="tablist" aria-label="Filter by type">
        {FILTERS.map((f, i) => (
          <button
            key={f.key} ref={(el) => { tabs.current[i] = el; }} type="button" role="tab" id={`c-deeper-tab-${f.key}`}
            aria-selected={f.key === filter} aria-controls="c-deeper-list" tabIndex={f.key === filter ? 0 : -1}
            className={styles.dTab} onClick={() => pick(f.key)} onKeyDown={(e) => onKey(e, i)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <figure className={styles.dPreview} aria-hidden="true">
        <div className={styles.dFrame}>
          {list.map((it) => it.image && (
            <Image key={`${filter}-${it.id}`} src={it.image} alt="" fill sizes="(min-width: 1280px) 520px, (min-width: 768px) 40vw, 100vw" className={styles.dImg} data-on={it.id === shown?.id || undefined} />
          ))}
          <span className={styles.dCorner} />
        </div>
        <figcaption className={styles.dCap}>{shown ? TYPE_LABEL[shown.type] : ""}</figcaption>
      </figure>

      <ol className={styles.dList} id="c-deeper-list" role="tabpanel" aria-labelledby={`c-deeper-tab-${filter}`} key={filter}>
        {list.map((it, i) => {
          const logo = it.type === "story" ? LOGOS[it.id] : undefined;
          return (
            <li key={it.id} className={styles.dRow} data-on={i === hot || undefined}>
              <a className={styles.dLink} href={it.url ?? "/blog"} onPointerEnter={() => setHot(i)} onFocus={() => setHot(i)}>
                <span className={styles.dType}>{TYPE_LABEL[it.type]}</span>
                <span className={styles.dTitle}>{it.title}</span>
                <span className={styles.dSource}>
                  {logo ? (
                    <Image src={logo.src} alt={it.source ?? ""} width={Math.round((logo.w / logo.h) * logo.height)} height={logo.height} className={styles.dLogo} style={{ height: logo.height }} unoptimized />
                  ) : it.source}
                  {it.url && ARROW}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
