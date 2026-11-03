import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { LabSwitch } from "@/components/home/story/LabSwitch";

// D29 review route: the homepage with story option C ("The rail"). Not linked, not indexed.
export const metadata: Metadata = { title: "Opening C: The rail", robots: { index: false, follow: false } };

export default function OpeningPage() {
  return <HomeSections story={<StoryRail />}><LabSwitch current="c" /></HomeSections>;
}
