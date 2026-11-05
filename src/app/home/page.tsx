import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { HeroLayer } from "@/components/home/chapter-one/layer/HeroLayer";

// The homepage, built one section at a time from spec/pages/home.md; at /home while / is the versions index (D39).
// Since D71 it is the master, "Original + Orbit" (/lab/orbit): the take j pull-back with its tracked layer (option 1 +
// Dust on data zj2, D50-D68), and the rail in its Horizon look (D35) with Orbit's drawings on the four stations (D56):
// since D73 the data station is animated live glass and the assets station real-time 3D (orbit/motion).
// Every other option stays in /lab and in the frozen copies under /versions.
const HERO = {
  poster: "/images/home/home-hero-ridges-take-j-v1.webp",
  video: "/videos/home/home-hero-ridges-take-j-v1.mp4",
};

export default function HomePage() {
  return <HomeSections story={<StoryRail look="horizon" art="orbit-live" />} hero={{ ...HERO, layer: <HeroLayer look="plexusDust" data="zj2" /> }} />;
}
