import { NewsletterForm } from "./NewsletterForm";
import styles from "./Close.module.css";

// Section 8 (spec/pages/home.md §8, copy board Step 19): the page's close. NEAR green as one full-bleed field
// (REF-COLOR-simpledonewell), ink type on it; the ink footer then rises over the green (D11; data-page-end sets the
// footer's pre-wipe ground). Heading left, the line and the form right (REF-HERO-tempo's claim + plain line, without
// the pills). Copy verbatim (v4).
export function Close() {
  return (
    <section className={styles.close} aria-labelledby="close-title" data-page-end="green">
      <div className={styles.inner}>
        <h2 id="close-title" className={`t-h1 ${styles.title}`}><span className={styles.keep}>NEAR belongs</span> to <span className="accent">you</span></h2>
        <div className={styles.body}>
          <p className="t-lede">Get the latest product launches, protocol milestones, and ecosystem updates straight to your&nbsp;inbox.</p>
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
