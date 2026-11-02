import { ChapterOne } from "@/components/home/chapter-one/ChapterOne";
import { StackSection } from "@/components/home/stack/StackSection";
import { ProofStrip } from "@/components/home/proof/ProofStrip";
import { GoDeeper } from "@/components/home/go-deeper/GoDeeper";
import { Origin } from "@/components/home/origin/Origin";
import { Testimonials } from "@/components/home/testimonials/Testimonials";
import { GetIntoNear } from "@/components/home/paths/GetIntoNear";
import { Close } from "@/components/home/close/Close";

// The homepage, built one section at a time from spec/pages/home.md.
export default function HomePage() {
  return (
    <main id="main">
      <ChapterOne />
      <StackSection />
      <ProofStrip />
      <GoDeeper />
      <Origin />
      <Testimonials />
      <GetIntoNear />
      <Close />
    </main>
  );
}
