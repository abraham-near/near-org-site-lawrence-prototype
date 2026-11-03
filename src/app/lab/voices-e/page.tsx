import type { Metadata } from "next";
import { Origin } from "@/components/home/origin/Origin";
import { GetIntoNear } from "@/components/home/paths/GetIntoNear";
import { OPTIONS } from "../voices/options";

export const metadata: Metadata = { title: "Lab: testimonials option E", robots: { index: false, follow: false } };

// Option E in context: between Origin and Get into NEAR, as on the homepage (D31). All options: /lab/voices.
const option = OPTIONS.find((o) => o.key === "e")!;

export default function VoicesOptionE() {
  const { Section } = option;
  return (
    <main id="main">
      <Origin />
      <Section />
      <GetIntoNear />
    </main>
  );
}
