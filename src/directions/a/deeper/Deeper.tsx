import { DeeperIndex } from "./DeeperIndex";
import s from "../graphics/survey.module.css";
import d from "./Deeper.module.css";

// Direction A, Go deeper (research/dir-a.md §5.5): stories, posts and talks as an atlas index: the heading and a ruled
// filter, three plates, then a gazetteer of the rest. "View everything" → /blog.
export function Deeper() {
  return (
    <section id="deeper" className={`${d.deeper} ${s.sheet}`} aria-labelledby="a-deeper-title">
      <div className={d.inner}>
        <header className={d.head}>
          <h2 id="a-deeper-title" className="t-h2">Go <span className="accent">deeper</span></h2>
        </header>
        <DeeperIndex />
        <p className={d.all}><a className="btn btn-secondary" href="/blog">View everything</a></p>
      </div>
    </section>
  );
}
