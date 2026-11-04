import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";

// The homepage, built one section at a time from spec/pages/home.md; at /home while / is the versions index (D39).
// The story after the anthem is the rail in its Horizon look (D35, Lawrence's pick; every other option is kept at tag
// options-2026-11-03, in /lab and in the frozen copies under /versions).
export default function HomePage() {
  return <HomeSections story={<StoryRail look="horizon" />} />;
}
