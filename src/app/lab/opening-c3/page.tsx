import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryRail } from "@/components/home/story/StoryRail";
import { LabSwitch } from "@/components/home/story/LabSwitch";

// D32 review route: the homepage with the rail in its "Drafting" look. Not linked, not indexed.
export const metadata: Metadata = { title: "Opening C3: Drafting", robots: { index: false, follow: false } };

export default function OpeningPage() {
  return <HomeSections story={<StoryRail look="drafting" />}><LabSwitch current="c3" /></HomeSections>;
}
