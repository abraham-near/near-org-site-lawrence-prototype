import type { Metadata } from "next";
import { Single } from "../single";

export const metadata: Metadata = { title: "Hero: cinematic A", robots: { index: false, follow: false } };

export default function HeroCinematicA() {
  return <Single k="a" />;
}
