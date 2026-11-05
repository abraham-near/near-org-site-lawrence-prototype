import type { Metadata } from "next";
import { DirectionA } from "@/directions/a";
import { LabSwitch } from "@/components/home/story/LabSwitch";
import { DIR_SWITCH } from "../directions/switch";

export const metadata: Metadata = {
  title: "Direction A: Survey",
  description: "Homepage direction A: a technical atlas with micrographics.",
  robots: { index: false, follow: false },
};

// Direction A, "Survey" (research/dir-a.md): the full homepage in this direction. Header and footer come from the layout.
export default function DirectionAPage() {
  return (
    <>
      <DirectionA />
      <LabSwitch current="a" options={DIR_SWITCH} label="Directions" />
    </>
  );
}
