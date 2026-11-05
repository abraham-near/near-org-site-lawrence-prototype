import Image from "next/image";
import { CloseForm } from "./CloseForm";
import glass from "../glass.module.css";
import s from "./Close.module.css";

// Direction B, Close (spec/pages/home.md §8, D22; copy verbatim). The large panel is a photograph of glass lamellae
// stacked in daylight, their edges resolving to green (Higgsfield, LOG.md: lamellae-a); a frosted pane stands over it
// with the N in its black tile, "NEAR belongs to *you*", the line and the email pill. The lamellae show sharp beside the
// pane and soft through it. The ink footer follows (site chrome).
export function Close() {
  return (
    <section id="close" className={s.close} aria-labelledby="b-close-title">
      <div className={s.inner}>
        <div className={s.panel}>
          <Image src="/directions/b/dir-b-lamellae-a.webp" alt="" fill sizes="(min-width: 1440px) 1312px, 100vw" decoding="async" className={s.bg} />
          <div className={`${glass.glass} ${glass.edge} ${s.pane}`}>
            <Image src="/brand/icon_tile.svg" alt="" width={56} height={56} className={s.mark} unoptimized />
            <h2 id="b-close-title" className={`t-h2 ${s.title}`}>NEAR belongs to <span className="accent">you</span></h2>
            <p className={`t-lede ${s.lede}`}>Get the latest product launches, protocol milestones, and ecosystem updates straight to your&nbsp;inbox.</p>
            <CloseForm />
          </div>
        </div>
      </div>
    </section>
  );
}
