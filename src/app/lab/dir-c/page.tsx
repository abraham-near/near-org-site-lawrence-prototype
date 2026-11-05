import type { Metadata } from "next";
import { FieldHome } from "@/directions/c/FieldHome";
import { LabSwitch } from "@/components/home/story/LabSwitch";
import { DIR_SWITCH } from "../directions/switch";

export const metadata: Metadata = {
  title: "Direction C: Field",
  description: "Homepage direction C: a Swiss editorial page on a visible grid, with graphics built from the N's construction.",
  robots: { index: false, follow: false },
};

// Direction C, "Field" (research/dir-c.md): the full homepage in this direction. Not indexed.
export default function DirectionC() {
  return (
    <>
      <FieldHome />
      <LabSwitch current="c" options={DIR_SWITCH} label="Directions" />
    </>
  );
}
