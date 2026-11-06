import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";

// The homepage, built one section at a time from spec/pages/home.md; at /home while / is the versions index (D39).
// Since D71 it is the master, "Original + Orbit" (/lab/orbit), with the rail in its Horizon look (D35) and Orbit's
// drawings on the four stations (D56): since D73 the data station is animated live glass and the assets station
// real-time 3D (orbit/motion). D90: the hero is one of five versions at random on each load, the original (the take j
// pull-back with its tracked layer, D50-D68) and four more (chapter-one/heroes); ?hero=<key> shows one, and
// /lab/hero-live lists them. Every other option stays in /lab and in the frozen copies under /versions.
export default function HomePage() {
  return <HomeSections story={<StoryRail look="horizon" art="orbit-live" />} hero="random" />;
}
