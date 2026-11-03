import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { StorySentence } from "@/components/home/story/StorySentence";
import { LabSwitch } from "@/components/home/story/LabSwitch";

// D29 review route: the homepage with story option B ("The sentence"). Not linked, not indexed.
export const metadata: Metadata = { title: "Opening B: The sentence", robots: { index: false, follow: false } };

export default function OpeningPage() {
  return <HomeSections story={<StorySentence />}><LabSwitch current="b" /></HomeSections>;
}
