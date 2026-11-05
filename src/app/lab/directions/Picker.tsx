"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SECTIONS, VERSIONS, sectionHref, thumb, type VersionKey } from "./data";
import styles from "./directions.module.css";

type Picks = Record<string, { v: VersionKey; note: string }>;
const KEY = "near-directions-picks";
const blank = (): Picks => Object.fromEntries(SECTIONS.map((s) => [s.key, { v: "o" as VersionKey, note: "" }]));

// The section picker (D52): for every section, the four versions side by side; choose one per section, add a note if
// you like, and copy the summary to send back. Choices stay in this browser (localStorage) between visits.
export function Picker() {
  const [picks, setPicks] = useState<Picks>(blank);
  const [copied, setCopied] = useState(false);
  const [missing, setMissing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "null") as Picks | null;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring saved choices after hydration
      if (saved) setPicks({ ...blank(), ...saved });
    } catch {}
  }, []);
  const update = (key: string, next: Partial<Picks[string]>) =>
    setPicks((p) => {
      const out = { ...p, [key]: { ...p[key], ...next } };
      try { localStorage.setItem(KEY, JSON.stringify(out)); } catch {}
      return out;
    });

  const summary = useMemo(() => {
    const name = (v: VersionKey) => VERSIONS.find((x) => x.key === v)!.name;
    const lines = SECTIONS.map((s) => `- ${s.name}: ${name(picks[s.key].v)}${picks[s.key].note.trim() ? `. ${picks[s.key].note.trim()}` : ""}`);
    return `Homepage directions, my picks per section:\n${lines.join("\n")}`;
  }, [picks]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(summary); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  return (
    <>
      <ol className={styles.sections}>
        {SECTIONS.map((s) => (
          <li key={s.key} className={styles.section}>
            <div className={styles.sectionHead}>
              <h3 className="t-h4">{s.name}</h3>
              <label className={styles.noteField}>
                <span className="sr-only">Note for {s.name}</span>
                <input type="text" value={picks[s.key].note} placeholder="Add a note (optional)" onChange={(e) => update(s.key, { note: e.target.value })} />
              </label>
            </div>
            <fieldset className={styles.options}>
              <legend className="sr-only">Which version of {s.name}</legend>
              {VERSIONS.map((v) => {
                const id = `${s.key}-${v.key}`, chosen = picks[s.key].v === v.key;
                return (
                  <div key={v.key} className={styles.option} data-chosen={chosen || undefined}>
                    <Link className={styles.thumb} href={sectionHref(v.key, s)} target="_blank" rel="noreferrer">
                      {missing[id] ? (
                        <span className={styles.noThumb}>Open in context</span>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element -- static lab thumbnails, sized by CSS
                        <img src={thumb(v.key, s.key)} alt={`${v.name}: ${s.name}`} loading="lazy" onError={() => setMissing((m) => ({ ...m, [id]: true }))} />
                      )}
                    </Link>
                    <label className={styles.choice}>
                      <input type="radio" name={s.key} checked={chosen} onChange={() => update(s.key, { v: v.key })} />
                      <span>{v.name}</span>
                    </label>
                    {s.notes[v.key] && <p className={styles.optionNote}>{s.notes[v.key]}</p>}
                  </div>
                );
              })}
            </fieldset>
          </li>
        ))}
      </ol>

      <section className={styles.summary} aria-labelledby="summary-title">
        <h2 id="summary-title" className="t-h3">Your combination</h2>
        <p className={styles.lede}>Copy this and paste it to me in the chat. I’ll build the page from the sections you picked.</p>
        <pre className={styles.summaryText}>{summary}</pre>
        <div className={styles.actions}>
          <button type="button" className="btn btn-primary" onClick={copy}>{copied ? "Copied" : "Copy my picks"}</button>
          <button type="button" className={styles.reset} onClick={() => { setPicks(blank()); try { localStorage.removeItem(KEY); } catch {} }}>Reset to original</button>
        </div>
      </section>
    </>
  );
}
