import type { OwnKey } from "@/components/home/chapter-one/OwnArt";
import { OrbitArt } from "@/components/home/story/orbit/OrbitArt";
import type { StyleDef } from "../../../own-styles/styles/types";

// Orbit (D54): the drawing lives with the rail (components/home/story/orbit, D56); this is its entry on the lab page
function Art({ which }: { which: OwnKey }) {
  return <OrbitArt which={which} />;
}

export const style: StyleDef = {
  key: "orbit",
  name: "Orbit",
  refs: "Celestial atlases and orbital diagrams; FutureDeluxe chrome (Meta Connect, Nothing)",
  summary:
    "Polished chrome and satin metal spheres with frosted glass rings and planes, with one green sphere or ring, in a lot of air. A celestial atlas threads through them: thin perspective orbits that pass behind the glass and in front of it, graduated arcs with fine ticks, tiny markers, a ticked horizon, and one small tag per station.",
  motion:
    "On arrival the orbits draw on (far half first, then the near half), ticks and markers pop in and the labels rise; then each station's one move: the green sphere drifts in behind the frost, a small ring travels the swap orbit, the request ray goes in and the signed trace comes out, the old ring appears and the new one settles. About 1.9 s, then still. On hover the drawing moves with the pointer as one piece, its tag a step further, the lines firm up and the green part lifts.",
  Art,
};
