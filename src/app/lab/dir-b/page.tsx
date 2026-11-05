import type { Metadata } from "next";
import { DIR_B } from "@/directions/b";
import { LabSwitch } from "@/components/home/story/LabSwitch";
import { DIR_SWITCH } from "../directions/switch";

export const metadata: Metadata = { title: "Direction B: Prism", robots: { index: false, follow: false } };

// Direction B, "Prism" (2026-11-04): the full homepage in vector plus rendered material: frosted glass and prismatic
// refraction resolving to NEAR green. research/dir-b.md has the principles and the material system.
export default function DirectionB() {
  const { hero: Hero, story: Story, stack: Stack, proof: Proof, deeper: Deeper, origin: Origin, voices: Voices, paths: Paths, close: Close } = DIR_B;
  return (
    <main id="main">
      <Hero />
      <Story />
      <Stack />
      <Proof />
      <Deeper />
      <Origin />
      <Voices />
      <Paths />
      <Close />
      <LabSwitch current="b" options={DIR_SWITCH} label="Directions" />
    </main>
  );
}
