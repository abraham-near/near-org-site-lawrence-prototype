import { Hero } from "./Hero";
import { Story } from "./Story";
import { Stack } from "./Stack";
import { Proof } from "./Proof";
import { Deeper } from "./Deeper";
import { Origin } from "./Origin";
import { Voices } from "./Voices";
import { Paths } from "./Paths";
import { Close } from "./Close";
import { FieldMotion } from "./FieldMotion";
import styles from "./Field.module.css";

// Direction C, "Field" (research/dir-c.md): the homepage as a Swiss editorial page on a visible 12-column grid, its
// graphics built from the N's construction (construction.ts), with one motion motif: shapes and type travel along the
// N's diagonal as the reader scrolls. Rhythm: the photograph, light, light, light (the Stack), green (Proof), light,
// forest (Origin, the one dark section), light, light, green (Close), then the site's ink footer.
export function FieldHome() {
  return (
    <main id="main" className={styles.field} data-field>
      <Hero />
      <Story />
      <Stack />
      <Proof />
      <Deeper />
      <Origin />
      <Voices />
      <Paths />
      <Close />
      <FieldMotion />
    </main>
  );
}
