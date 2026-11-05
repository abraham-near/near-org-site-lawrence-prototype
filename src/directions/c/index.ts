// Direction C, "Field": each section of the homepage as its own component, keyed as the brief asks. The page itself
// is FieldHome (route: /lab/dir-c).
import { Hero } from "./Hero";
import { Story } from "./Story";
import { Stack } from "./Stack";
import { Proof } from "./Proof";
import { Deeper } from "./Deeper";
import { Origin } from "./Origin";
import { Voices } from "./Voices";
import { Paths } from "./Paths";
import { Close } from "./Close";

export { FieldHome } from "./FieldHome";
export { FieldMotion } from "./FieldMotion";

export const sections = {
  hero: Hero,
  story: Story,
  stack: Stack,
  proof: Proof,
  deeper: Deeper,
  origin: Origin,
  voices: Voices,
  paths: Paths,
  close: Close,
};
export { Hero as hero, Story as story, Stack as stack, Proof as proof, Deeper as deeper, Origin as origin, Voices as voices, Paths as paths, Close as close };
