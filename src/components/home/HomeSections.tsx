import type { ReactNode } from "react";
import { ChapterOne, type HeroOptions } from "@/components/home/chapter-one/ChapterOne";
import { StackSection } from "@/components/home/stack/StackSection";
import { ProofStrip } from "@/components/home/proof/ProofStrip";
import { GoDeeper } from "@/components/home/go-deeper/GoDeeper";
import { Origin } from "@/components/home/origin/Origin";
import { Testimonials } from "@/components/home/testimonials/Testimonials";
import { GetIntoNear } from "@/components/home/paths/GetIntoNear";
import { Close } from "@/components/home/close/Close";

// The homepage, built one section at a time from spec/pages/home.md. `story` is the beat after the anthem (D29): the
// homepage uses the chosen option; /lab/opening-* render each option in place for comparison. `hero` is for the lab's
// hero options (/lab/hero-*).
export function HomeSections({ story, hero, children }: { story: ReactNode; hero?: HeroOptions; children?: ReactNode }) {
  return (
    <main id="main">
      <ChapterOne hero={hero} />
      {story}
      <StackSection />
      <ProofStrip />
      <GoDeeper />
      <Origin />
      <Testimonials />
      <GetIntoNear />
      <Close />
      {children}
    </main>
  );
}
