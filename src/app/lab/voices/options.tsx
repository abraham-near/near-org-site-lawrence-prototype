import type { ComponentType } from "react";
import { Testimonials } from "@/components/home/testimonials/Testimonials";
import { VoicesIndex } from "@/components/home/testimonials/VoicesIndex";
import { VoicesReadIn } from "@/components/home/testimonials/VoicesReadIn";
import { VoicesMarked } from "@/components/home/testimonials/VoicesMarked";
import { VoicesPraise } from "@/components/home/testimonials/VoicesPraise";
import { VoicesLeader } from "@/components/home/testimonials/VoicesLeader";
import { VoicesStage } from "@/components/home/testimonials/VoicesStage";
import { VoicesTiles } from "@/components/home/testimonials/VoicesTiles";

// The testimonial options for Lawrence to compare (D31, D34). Each takes a heading id, so several can share one page.
// Round 2 mimics one real site each; its reference screenshot (references/2026-11-03_quote-sections/) shows beside it.
export type VoicesOption = {
  key: string; label: string; name: string; round: 0 | 1 | 2; note: string;
  ref?: { site: string; url: string; img?: string }; needs?: string;
  Section: ComponentType<{ titleId?: string }>;
};

export const OPTIONS: VoicesOption[] = [
  {
    key: "d", label: "D", name: "Praise page", round: 2, Section: VoicesPraise,
    note: "Two staggered columns where the shorter a quote is, the larger it’s set: Horsley’s five words lead at h1. Hairlines, names and roles stacked under each quote. No motion.",
    ref: { site: "James Clear, Atomic Habits", url: "https://jamesclear.com/atomic-habits", img: "jamesclear-praise-by-length.png" },
  },
  {
    key: "e", label: "E", name: "Speaker, leader, words", round: 2, Section: VoicesLeader,
    note: "One line per voice: the name, a thin rule, then the words in Kepler italic. On first view each rule draws from the name to the words, once.",
    ref: { site: "Craft", url: "https://www.craft.do", img: "craft-name-rule-italic.png" },
    needs: "Needs a decision: quoted speech in Kepler italic (DESIGN §2 keeps Kepler for closing accents).",
  },
  {
    key: "f", label: "F", name: "One voice per screen", round: 2, Section: VoicesStage,
    note: "Desktop: the section pins a full-screen stage; each quote is centred at h1 and its words ink in as you scroll, then the next takes its place. Elsewhere the four stack, fully inked.",
    ref: { site: "Attio", url: "https://attio.com", img: "attio-pinned-ink-in-mid.png" },
    needs: "Needs a decision: a second orchestrated scroll moment (DESIGN §4 allows one per page).",
  },
  {
    key: "g", label: "G", name: "Tiles that flood mint", round: 2, Section: VoicesTiles,
    note: "Four name tiles; one is flooded mint and shows its quote between double hairlines. Hover or focus moves the flood. On touch every tile shows its quote.",
    ref: { site: "Flighty", url: "https://flighty.com", img: "flighty-press-tile-hover.png" },
  },
  {
    key: "current", label: "Now", name: "The live section", round: 0, Section: Testimonials,
    note: "One quote large, three on hairlines. Kept for comparison.",
  },
  {
    key: "a", label: "A", name: "Index", round: 1, Section: VoicesIndex,
    note: "The names are a roster; hover, tap or arrow to a name and its quote takes the stage.",
    ref: { site: "Stripe and Mercury", url: "https://stripe.com" },
  },
  {
    key: "b", label: "B", name: "Read-in", round: 1, Section: VoicesReadIn,
    note: "Four quotes set large, alternating sides; each one’s words fill in as you scroll it into view.",
    ref: { site: "Daylight", url: "https://daylightcomputer.com" },
    needs: "Conflicts with D8 (GSAP owns scroll motion) and is close to the §6 zigzag tell.",
  },
  {
    key: "c", label: "C", name: "Marked", round: 1, Section: VoicesMarked,
    note: "Today’s layout with a mint highlighter under one phrase per quote.",
    ref: { site: "Basecamp", url: "https://basecamp.com" },
  },
];
