import { HomeSections } from "@/components/home/HomeSections";
import { StorySentence } from "@/components/home/story/StorySentence";

// The homepage, built one section at a time from spec/pages/home.md.
export default function HomePage() {
  return <HomeSections story={<StorySentence />} />;
}
