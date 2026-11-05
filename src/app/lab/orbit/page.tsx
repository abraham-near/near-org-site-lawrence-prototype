import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { LabSwitch } from "@/components/home/story/LabSwitch";
import { HeroLayer } from "@/components/home/chapter-one/layer/HeroLayer";
import { ZMOVE } from "../hero/options";
import { DIR_SWITCH } from "../directions/switch";

export const metadata: Metadata = { title: "Lab: Original with Orbit", robots: { index: false, follow: false } };

// D56: the Original direction (D53) with the Orbit illustrations (D54/D55) on the rail's four stations, live, with
// their micro-animations and hover. Everything else as /lab/dir-o. Since D71 this is the homepage (/home); kept here
// for the lab switch.
export default function OriginalOrbit() {
  return (
    <HomeSections story={<StoryRail look="horizon" art="orbit" />} hero={{ ...ZMOVE.j, layer: <HeroLayer look="plexusDust" data="zj2" /> }}>
      <LabSwitch current="orbit" options={DIR_SWITCH} label="Directions" />
    </HomeSections>
  );
}
