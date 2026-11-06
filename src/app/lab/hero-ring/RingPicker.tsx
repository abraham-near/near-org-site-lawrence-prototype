"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./hero-ring.module.css";

type Option = { key: string; name: string; note: string; href: string; thumb: string };
const KEY = "near-hero-ring-picks";

// The ring options with a "make this one in motion" tick each; the ticks stay in this browser (localStorage) between
// visits, and the summary lists the chosen keys to copy back into the chat.
export function RingPicker({ options }: { options: Option[] }) {
  const [picked, setPicked] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "null") as unknown;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring saved choices after hydration
      if (Array.isArray(saved)) setPicked(saved.filter((k): k is string => options.some((o) => o.key === k)));
    } catch {}
  }, [options]);

  const save = (next: string[]) => {
    setPicked(next);
    try { if (next.length) localStorage.setItem(KEY, JSON.stringify(next)); else localStorage.removeItem(KEY); } catch {}
  };
  const toggle = (k: string, on: boolean) => save(options.map((o) => o.key).filter((x) => (x === k ? on : picked.includes(x))));

  const chosen = options.filter((o) => picked.includes(o.key));
  const summary = chosen.length
    ? `Ring hero options to make in motion (${chosen.length}): ${chosen.map((o) => o.key).join(", ")}\n${chosen.map((o) => `- ${o.key}: ${o.name}`).join("\n")}`
    : "Ring hero options to make in motion: none chosen yet.";

  const copy = async () => {
    try { await navigator.clipboard.writeText(summary); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  return (
    <>
      <ol className={styles.grid}>
        {options.map((o) => {
          const on = picked.includes(o.key), id = `pick-${o.key}`;
          return (
            <li key={o.key} className={styles.card} data-chosen={on || undefined}>
              <Link className={styles.thumb} href={o.href} prefetch={false}>
                {/* eslint-disable-next-line @next/next/no-img-element -- static lab thumbnails, sized by CSS */}
                <img src={o.thumb} alt={`${o.name}: the homepage's opening view`} loading="lazy" />
              </Link>
              <h2 className="t-h4">{o.name}</h2>
              <p className={styles.note}>{o.note}</p>
              <p className={styles.open}><Link href={o.href} prefetch={false}>Open the page<span className="sr-only">: {o.name}</span></Link></p>
              <label className={styles.choice} htmlFor={id}>
                <input id={id} type="checkbox" checked={on} onChange={(e) => toggle(o.key, e.target.checked)} />
                <span>Make this one in motion</span>
              </label>
            </li>
          );
        })}
      </ol>

      <section className={styles.summary} aria-labelledby="summary-title">
        <h2 id="summary-title" className="t-h3">Your selection</h2>
        <p className={styles.lede}>Copy this and paste it to me in the chat. I’ll make the ones you picked in full motion.</p>
        <pre className={styles.summaryText} aria-live="polite">{summary}</pre>
        <div className={styles.actions}>
          <button type="button" className="btn btn-primary" onClick={copy} disabled={!chosen.length}>{copied ? "Copied" : "Copy selection"}</button>
          <button type="button" className={styles.reset} onClick={() => save([])} disabled={!chosen.length}>Clear</button>
        </div>
      </section>
    </>
  );
}
