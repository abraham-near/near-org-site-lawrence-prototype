import { Suspense } from "react";
import { DeeperFromUrl, DeeperView } from "./DeeperView";
import styles from "./GoDeeper.module.css";

// Section 4 (spec/pages/home.md §4): stories, posts, talks and press in one filtered section, laid out after the
// r16/v3 prototype (Lawrence, 2026-11-05: "study the go deeper from this version of the website and match it"). The
// heading and filters share a line over an ink rule; the newest item in the filter leads with its photo, and the rest
// follow as rows beside it. On desktop with motion the list scrolls through a window while the section holds (see
// DeeperView). The prerendered HTML shows "All"; the client picks up ?type= after load.
export function GoDeeper() {
  return (
    <section className={styles.deeper} aria-labelledby="deeper-title">
      <Suspense fallback={<DeeperView active="all" />}>
        <DeeperFromUrl />
      </Suspense>
    </section>
  );
}
