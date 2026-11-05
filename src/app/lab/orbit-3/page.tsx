import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { LabSwitch } from "@/components/home/story/LabSwitch";
import { HeroLayer } from "@/components/home/chapter-one/layer/HeroLayer";
import { MOTION_SWITCH } from "../rail-motion/switch";

export const metadata: Metadata = { title: "Lab: rail motion, option 3", robots: { index: false, follow: false } };

// D72: the homepage with motion option 3 on the rail's data and assets stations (Orbit on the other two)
const HERO = { poster: "/images/home/home-hero-ridges-take-j-v1.webp", video: "/videos/home/home-hero-ridges-take-j-v1.mp4" };

export default function RailMotion3() {
  return (
    <HomeSections story={<StoryRail look="horizon" art="orbit-3" />} hero={{ ...HERO, layer: <HeroLayer look="plexusDust" data="zj2" /> }}>
      <LabSwitch current="o3" options={MOTION_SWITCH} label="Rail motion options" />
    </HomeSections>
  );
}
