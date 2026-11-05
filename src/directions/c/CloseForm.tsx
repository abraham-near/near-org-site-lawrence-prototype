"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import styles from "./Lower.module.css";

// The newsletter form, as on the current close (ACCEPTANCE §5): a visible label, a required email field, inline error
// and success states that keep their box (no jump), focus to the success line. On the green field (DESIGN §1) the field
// is surface and the button ink. No provider is wired yet (TASKS): a valid submit shows success and sends nothing.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CloseForm() {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const success = useRef<HTMLParagraphElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => { if (done) success.current?.focus(); }, [done]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = input.current?.value.trim() ?? "";
    const problem = !value ? "Enter your email address." : !EMAIL.test(value) ? "Enter an email address like name@example.com." : null;
    setError(problem);
    if (problem) { input.current?.focus(); return; }
    setDone(true); // [[TBD: newsletter provider]]
  };

  return (
    <form className={styles.cForm} method="post" noValidate onSubmit={submit}>
      <label htmlFor={`${id}-email`} className={styles.cLabel}>Email address</label>
      <div className={styles.cSlot}>
        <div className={styles.cRow} data-done={done || undefined} inert={done}>
          <input
            ref={input} id={`${id}-email`} name="email" type="email" required autoComplete="email" inputMode="email" spellCheck={false}
            className={styles.cInput} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined}
            onInput={() => error && setError(null)}
          />
          <button type="submit" className={`btn ${styles.cSubmit}`}>Subscribe</button>
        </div>
        <div role="status" className={styles.cStatus}>
          {done && (
            <p ref={success} tabIndex={-1} className={styles.cSuccess}>
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Thanks for subscribing.
            </p>
          )}
        </div>
      </div>
      <p id={`${id}-error`} className={styles.cError}>{error}</p>
      <p className={styles.cNote}>By subscribing, you agree to our <a href="/privacy">Privacy Policy</a>.</p>
    </form>
  );
}
