"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import s from "./Close.module.css";

// The newsletter form, as the live one (components/home/close/NewsletterForm.tsx: same states and wording), styled for
// the glass pane. A labelled, required email field; inline error with focus back to the field; the success line takes
// the field row's place (no jump) and takes focus. No provider is wired yet (TASKS): nothing is sent.
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
    <form className={s.form} method="post" noValidate onSubmit={submit}>
      <label htmlFor={`${id}-email`} className="sr-only">Email address</label>
      <div className={s.slot}>
        <div className={s.row} data-done={done || undefined} inert={done}>
          <input
            ref={input} id={`${id}-email`} name="email" type="email" required autoComplete="email" inputMode="email" spellCheck={false} placeholder="Email address"
            className={s.input} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined}
            onInput={() => error && setError(null)}
          />
          <button type="submit" className={`btn btn-primary ${s.submit}`}>Subscribe</button>
        </div>
        <div role="status" className={s.status}>
          {done && (
            <p ref={success} tabIndex={-1} className={s.success}>
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Thanks for subscribing.
            </p>
          )}
        </div>
      </div>
      <p id={`${id}-error`} className={s.error}>
        {error && (
          <>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M8 4.5v4.5M8 11v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            {error}
          </>
        )}
      </p>
      <p className={s.note}>By subscribing, you agree to our <a href="/privacy">Privacy Policy</a>.</p>
    </form>
  );
}
