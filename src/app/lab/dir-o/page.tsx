import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { LabSwitch } from "@/components/home/story/LabSwitch";
import { HeroLayer } from "@/components/home/chapter-one/layer/HeroLayer";
import { ZMOVE } from "../hero/options";
import { DIR_SWITCH } from "../directions/switch";

export const metadata: Metadata = { title: "Directions: Original", robots: { index: false, follow: false } };

// D52: the original direction for comparison with A, B and C: today's homepage with the take j hero (A4 + dust, D51).
export default function DirectionOriginal() {
  return (
    <HomeSections story={<StoryRail look="horizon" />} hero={{ ...ZMOVE.j, layer: <HeroLayer look="plexusDust" data="zj2" /> }}>
      <LabSwitch current="o" options={DIR_SWITCH} label="Directions" />
    </HomeSections>
  );
}
