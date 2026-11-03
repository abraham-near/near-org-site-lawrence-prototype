import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StoryLayer } from "@/components/home/story/StoryLayer";
import { LabSwitch } from "@/components/home/story/LabSwitch";

// D29 review route: the homepage with story option A ("The layer"). Not linked, not indexed.
export const metadata: Metadata = { title: "Opening A: The layer", robots: { index: false, follow: false } };

export default function OpeningPage() {
  return <HomeSections story={<StoryLayer />}><LabSwitch current="a" /></HomeSections>;
}
