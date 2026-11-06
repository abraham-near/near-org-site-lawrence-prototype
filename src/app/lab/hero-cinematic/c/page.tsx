import type { Metadata } from "next";
import { Single } from "../single";

export const metadata: Metadata = { title: "Hero: cinematic C", robots: { index: false, follow: false } };

export default function HeroCinematicC() {
  return <Single k="c" />;
}
