import { Hero } from "./hero/Hero";
import { Story } from "./story/Story";
import { Stack } from "./stack/Stack";
import { Proof } from "./proof/Proof";
import { Deeper } from "./deeper/Deeper";
import { Origin } from "./origin/Origin";
import { Voices } from "./voices/Voices";
import { Paths } from "./paths/Paths";
import { Close } from "./close/Close";
import { Watch } from "./graphics/Watch";

// Direction A, "Survey" (research/dir-a.md): the homepage as one survey sheet. Sections in the brief's order; Watch
// starts each section's micro-motions as it comes into view.
export function DirectionA() {
  return (
    <main id="main">
      <Hero />
      <Story />
      <Stack />
      <Proof />
      <Deeper />
      <Origin />
      <Voices />
      <Paths />
      <Close />
      <Watch />
    </main>
  );
}
