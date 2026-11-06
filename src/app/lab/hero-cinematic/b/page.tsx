import type { Metadata } from "next";
import { Single } from "../single";

export const metadata: Metadata = { title: "Hero: cinematic B", robots: { index: false, follow: false } };

export default function HeroCinematicB() {
  return <Single k="b" />;
}
