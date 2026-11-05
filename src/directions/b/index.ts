import { Hero } from "./hero/Hero";
import { Story } from "./story/Story";
import { Stack } from "./stack/Stack";
import { Proof } from "./proof/Proof";
import { Deeper } from "./deeper/Deeper";
import { Origin } from "./origin/Origin";
import { Voices } from "./voices/Voices";
import { Paths } from "./paths/Paths";
import { Close } from "./close/Close";

// Direction B, "Prism": each homepage section as a component, keyed by its section id (research/dir-b.md).
export const DIR_B = { hero: Hero, story: Story, stack: Stack, proof: Proof, deeper: Deeper, origin: Origin, voices: Voices, paths: Paths, close: Close };
export { Hero, Story, Stack, Proof, Deeper, Origin, Voices, Paths, Close };
export default DIR_B;
