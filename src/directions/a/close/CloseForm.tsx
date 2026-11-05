"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import styles from "./Close.module.css";

// Direction A: the live page's newsletter form (components/home/close/NewsletterForm.tsx), unchanged in behaviour, with this
// direction's styles. The newsletter form: a labelled, required email field with inline error and success states (ACCEPTANCE §5).
// No provider is wired yet (TASKS): a valid submit shows the success state but sends nothing.
// The form keeps its box in both states (the success line takes the field row's place), so the page never jumps,
// and focus moves to the success line so keyboard and screen-reader users land on it.
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
    setDone(true); // [[TBD: newsletter provider]]: send `value` to the provider here (a server action, so it also works without JS)
  };

  return (
    <form className={styles.form} method="post" noValidate onSubmit={submit}>
      {/* The field and button are one pill (D22); the label stays for screen readers, the placeholder says it on screen */}
      <label htmlFor={`${id}-email`} className="sr-only">Email address</label>
      <div className={styles.slot}>
        <div className={styles.row} data-done={done || undefined} inert={done}>
          <input
            ref={input} id={`${id}-email`} name="email" type="email" required autoComplete="email" inputMode="email" spellCheck={false} placeholder="Email address"
            className={styles.input} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined}
            onInput={() => error && setError(null)}
          />
          <button type="submit" className={`btn btn-primary ${styles.submit}`}>Subscribe</button>
        </div>
        {/* Always present, so the success text is announced when it's written in */}
        <div role="status" className={styles.statusSlot}>
          {done && (
            <p ref={success} tabIndex={-1} className={styles.success}>
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Thanks for subscribing.
            </p>
          )}
        </div>
      </div>
      <p id={`${id}-error`} className={styles.error}>
        {error && (
          <>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M8 4.5v4.5M8 11v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            {error}
          </>
        )}
      </p>
      <p className={styles.formNote}>By subscribing, you agree to our <a href="/privacy">Privacy Policy</a>.</p>
    </form>
  );
}
