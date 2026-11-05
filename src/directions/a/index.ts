// Direction A, "Survey" (research/dir-a.md). Each section is exported on its own so sections can be mixed between
// directions (each carries its own id: hero, story, stack, proof, deeper, origin, voices, paths, close). A mixed page
// must also render <Watch /> once (it starts the micro-motions).
import { Hero } from "./hero/Hero";
import { Story } from "./story/Story";
import { Stack } from "./stack/Stack";
import { Proof } from "./proof/Proof";
import { Deeper } from "./deeper/Deeper";
import { Origin } from "./origin/Origin";
import { Voices } from "./voices/Voices";
import { Paths } from "./paths/Paths";
import { Close } from "./close/Close";

export { DirectionA } from "./DirectionA";
export { Watch } from "./graphics/Watch";

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
export default sections;
