import Image from "next/image";
import { NewsletterForm } from "./NewsletterForm";
import styles from "./Close.module.css";

// Section 8 (spec/pages/home.md §8, copy board Step 19; redesigned in D22 after Lawrence's reference): the page's close
// as one quiet, centred panel on the cream page. The NEAR N in its black tile, "NEAR belongs to *you*", the line, then the
// email field and button as one pill. The ink footer then rises over the cream surface (D11). Copy verbatim (v4).
export function Close() {
  return (
    <section className={styles.close} aria-labelledby="close-title">
      <div className={styles.inner}>
        <div className={styles.panel}>
          <Image src="/brand/icon_tile.svg" alt="" width={56} height={56} className={styles.mark} unoptimized />
          <h2 id="close-title" className={`t-h2 ${styles.title}`}>NEAR belongs to <span className="accent">you</span></h2>
          <p className={`t-lede ${styles.lede}`}>Get the latest product launches, protocol milestones, and ecosystem updates straight to your&nbsp;inbox.</p>
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
