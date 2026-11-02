import Image from "next/image";
import styles from "./Origin.module.css";

// Section 5 (spec/pages/home.md §5, D10): the one place the 2017 AI-lab and Transformer story appears (F18).
// Editorial restraint (REF-TYPE-anthropic): heading and an image of "attention" left, the account right (D16). The claim carries a footnote
// mark that resolves to its literal source (REF-STORY-oryzo's footnote device, used to be exact). Copy verbatim (v4).
export function Origin() {
  return (
    <section className={styles.origin} aria-labelledby="origin-title">
      <div className={styles.inner}>
        <h2 id="origin-title" className={`t-h2 ${styles.title}`}>
          Built by people who helped <span className="accent">invent modern AI</span>
        </h2>
        <figure className={styles.figure}>
          <Image src="/images/home/home-origin-attention-v1.webp" alt="" fill sizes="(min-width: 1280px) 634px, (min-width: 768px) 50vw, 100vw" className={styles.img} />
        </figure>
        <div className={styles.body}>
          <p className="t-lede">
            NEAR began in 2017 as an AI lab. <span className={styles.nowrap}>Co-founder</span> <span className={styles.nowrap}>Illia Polosukhin</span> <span className={styles.nowrap}>co-authored</span> &ldquo;Attention Is All You
            Need&rdquo;<sup className={styles.mark}><a href="#origin-src"><span className="sr-only">Source </span>1</a></sup>, the paper that
            introduced the Transformer behind today&rsquo;s AI models. NEAR exists so the next era of AI is owned&nbsp;by&nbsp;its&nbsp;users.
          </p>
          <p className={styles.cta}>
            <a className="btn btn-secondary" href="/about">Our story</a>
          </p>
          <p id="origin-src" className={styles.source}>
            <span className={styles.num}>1</span>
            <span>Source: <a href="https://arxiv.org/abs/1706.03762">arXiv:1706.03762</a></span>
          </p>
        </div>
      </div>
    </section>
  );
}
