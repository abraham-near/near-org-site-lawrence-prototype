import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { LabSwitch } from "@/components/home/story/LabSwitch";
import { GRADES, HERO_SWITCH } from "../hero/options";

export const metadata: Metadata = { title: "Hero: green 2", robots: { index: false, follow: false } };

// D40 review route: the homepage with the hero's trees graded green, strength 2 of 3. All options: /lab/hero.
export default function HeroGreen2() {
  return (
    <HomeSections story={<StoryRail look="horizon" />} hero={GRADES[2]}>
      <LabSwitch current="g2" options={HERO_SWITCH} label="Hero options" />
    </HomeSections>
  );
}
