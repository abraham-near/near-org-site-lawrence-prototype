"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./own-styles.module.css";

// Review controls for the illustration styles (D53): Keep, Maybe or Drop per style, a note, and a summary to copy back.
// Choices stay in this browser (localStorage); the pickers and the summary share them through one window event.
type Verdict = "keep" | "maybe" | "drop" | "";
type Picks = Record<string, { v: Verdict; note: string }>;
const EVENT = "own-styles-picks";
const VERDICTS: { v: Exclude<Verdict, "">; label: string }[] = [
  { v: "keep", label: "Keep" },
  { v: "maybe", label: "Maybe" },
  { v: "drop", label: "Drop" },
];

const read = (key: string): Picks => {
  try { return JSON.parse(localStorage.getItem(key) ?? "{}") as Picks; } catch { return {}; }
};
const write = (key: string, p: Picks) => {
  try { localStorage.setItem(key, JSON.stringify(p)); } catch {}
  window.dispatchEvent(new Event(EVENT));
};

function usePicks(key: string) {
  const [picks, setPicks] = useState<Picks>({});
  useEffect(() => {
    const sync = () => setPicks(read(key));
    sync();
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, [key]);
  return picks;
}

// `store`: the localStorage key, one per review page (own-styles, own-hybrid)
export function Pick({ k, name, store = "near-own-styles-picks" }: { k: string; name: string; store?: string }) {
  const picks = usePicks(store);
  const cur = picks[k] ?? { v: "", note: "" };
  const update = (next: Partial<Picks[string]>) => write(store, { ...read(store), [k]: { ...cur, ...next } });
  return (
    <fieldset className={styles.pick}>
      <legend>Your call on {name}</legend>
      {VERDICTS.map((o) => (
        <label key={o.v} className={styles.choice}>
          <input type="radio" name={`pick-${k}`} checked={cur.v === o.v} onChange={() => update({ v: o.v })} />
          <span>{o.label}</span>
        </label>
      ))}
      <label className={styles.note}>
        <span className="sr-only">Note on {name}</span>
        <input type="text" value={cur.note} placeholder="What to change (optional)" onChange={(e) => update({ note: e.target.value })} />
      </label>
    </fieldset>
  );
}

export function Summary({ names, store = "near-own-styles-picks", title = "Own-your illustration styles" }: { names: { key: string; name: string }[]; store?: string; title?: string }) {
  const picks = usePicks(store);
  const [copied, setCopied] = useState(false);
  const text = useMemo(() => {
    const label = (v: Verdict) => VERDICTS.find((o) => o.v === v)?.label ?? "No call";
    const lines = names.map(({ key, name }) => {
      const p = picks[key];
      return `- ${name}: ${label(p?.v ?? "")}${p?.note.trim() ? `. ${p.note.trim()}` : ""}`;
    });
    return `${title}, my calls:\n${lines.join("\n")}`;
  }, [picks, names, title]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };
  return (
    <section className={styles.summary} aria-labelledby="summary-title">
      <h2 id="summary-title" className="t-h3">Your calls</h2>
      <p className={styles.lede}>Copy this and paste it to me in the chat. I’ll refine the styles you keep.</p>
      <pre className={styles.summaryText}>{text}</pre>
      <div className={styles.actions}>
        <button type="button" className="btn btn-primary" onClick={copy}>{copied ? "Copied" : "Copy my calls"}</button>
        <button type="button" className={styles.reset} onClick={() => write(store, {})}>Clear</button>
      </div>
    </section>
  );
}
