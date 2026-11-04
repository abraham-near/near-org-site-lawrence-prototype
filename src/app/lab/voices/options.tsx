import type { ComponentType } from "react";
import { Testimonials } from "@/components/home/testimonials/Testimonials";
import { VoicesIndex } from "@/components/home/testimonials/VoicesIndex";
import { VoicesReadIn } from "@/components/home/testimonials/VoicesReadIn";
import { VoicesMarked } from "@/components/home/testimonials/VoicesMarked";
import { VoicesPraise } from "@/components/home/testimonials/VoicesPraise";
import { VoicesLeader } from "@/components/home/testimonials/VoicesLeader";
import { VoicesStage } from "@/components/home/testimonials/VoicesStage";
import { VoicesTiles } from "@/components/home/testimonials/VoicesTiles";
import { VoicesJunction } from "@/components/home/testimonials/VoicesJunction";
import { VoicesPlate } from "@/components/home/testimonials/VoicesPlate";
import { VoicesSheet } from "@/components/home/testimonials/VoicesSheet";

// The testimonial options for Lawrence to compare (D31, D34, D36). Each takes a heading id, so several can share one page.
// Round 2 mimics one real site each; its reference screenshot (references/2026-11-03_quote-sections/) shows beside it.
export type VoicesOption = {
  key: string; label: string; name: string; round: 0 | 1 | 2 | 3; note: string;
  ref?: { site: string; url: string; img?: string }; needs?: string;
  Section: ComponentType<{ titleId?: string }>;
};

export const OPTIONS: VoicesOption[] = [
  {
    key: "h", label: "H", name: "Junction", round: 3, Section: VoicesJunction,
    note: "The page’s own drawing language: the thread drops in and lands on a flat plan of the Stack’s rings, N mark at the core. Four fine connectors leave the outer ring and run to the voices, each met by an end node on the voice’s rule and labelled with the speaker’s organisation. Hover a voice and its connector turns mint.",
    ref: { site: "Tempo’s settlement diagram, with Monad’s frame nodes", url: "https://tempo.xyz", img: "tempo-settlement-connectors.png" },
    needs: "Asks one question: may the thread reach this section?",
  },
  {
    key: "i", label: "I", name: "Survey plate", round: 3, Section: VoicesPlate,
    note: "A graded still with a surveyor’s crosshair grid and ruler ticks. Four crossings are live mint nodes; a leader runs from each out to its voice, set as a margin note with a bracket-tick credit.",
    ref: { site: "PARK Stuttgart (from your board), Tufte’s sidenotes and Works in Progress captions", url: "https://www.instagram.com/p/DdRnpbljv9m/", img: "park-stuttgart-crosshair-grid.jpg" },
    needs: "Brings an image into this section (the dune from the approved hero round).",
  },
  {
    key: "j", label: "J", name: "Credits sheet", round: 3, Section: VoicesSheet,
    note: "The grid drawn as dashed rails; four cells cut from it share hairline edges, with crosshair nodes at the corners and a mint centre. Each cell is a credit block: the quote, a ruler with one tick per word, and label-over-value credits. The featured cell is graph paper.",
    ref: { site: "Payload’s drawn grid, A24’s credits, Zed’s graph paper", url: "https://payloadcms.com", img: "payload-grid-quote-cells.png" },
  },
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
