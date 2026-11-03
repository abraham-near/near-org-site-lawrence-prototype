import { Suspense } from "react";
import { DeeperFromUrl, DeeperView } from "./DeeperView";
import styles from "./GoDeeper.module.css";

// Section 4 (spec/pages/home.md §4, layout 4C, D9): stories, posts, talks and press in one filtered section.
// Two featured items with images, then a sideways strip of older items with a type glyph. The prerendered HTML
// shows "All"; the client picks up ?type= after load. From tablet up the opener is centred (D19): the heading and the
// filters, then the items, then "View everything".
export function GoDeeper() {
  return (
    <section className={styles.deeper} aria-labelledby="deeper-title">
      <div className={styles.inner}>
        <header className={styles.head}>
          <h2 id="deeper-title" className="t-h2">Go <span className="accent">deeper</span></h2>
        </header>
        <Suspense fallback={<DeeperView active="all" />}>
          <DeeperFromUrl />
        </Suspense>
        <p className={styles.all}>
          <a href="/blog">View everything</a>
        </p>
      </div>
    </section>
  );
}
