import { OwnArt } from "@/components/home/chapter-one/OwnArt";
import type { StyleDef } from "./types";
import { style as fine } from "./fine";
import { style as survey } from "./survey";
import { style as stipple } from "./stipple";
import { style as plexus } from "./plexus";
import { style as glass } from "./glass";
import { style as window } from "./window";
import { style as axo } from "./axo";
import { style as construct } from "./construct";

// The eight illustration styles (D53), in the order shown, and today's drawings (D18) for comparison
export const CURRENT: StyleDef = {
  key: "current",
  name: "Today",
  refs: "Tempo",
  summary: "The drawings on the rail now (D18): ink hairlines on paper fills, one green element, dark tags with PRODUCT.md facts.",
  motion: "One small move per drawing as its station arrives.",
  Art: OwnArt,
};

export const STYLES: StyleDef[] = [fine, survey, stipple, plexus, glass, window, axo, construct];
