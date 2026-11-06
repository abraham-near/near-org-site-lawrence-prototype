import type { Metadata } from "next";
import { Single } from "../single";

export const metadata: Metadata = { title: "Hero: cinematic D", robots: { index: false, follow: false } };

export default function HeroCinematicD() {
  return <Single k="d" />;
}
