import { CinematicHero } from "@/components/home/chapter-one/cinematic/CinematicHero";
import { CINEMATIC } from "@/components/home/chapter-one/cinematic/options";
import type { CinematicOption } from "@/components/home/chapter-one/cinematic/CinematicHero";
import { LabSwitch } from "@/components/home/story/LabSwitch";

const SWITCH = [
  { href: "/lab/" + "hero-cinematic", key: "all", name: "All four" },
  ...CINEMATIC.map((o) => ({ href: "/lab/" + "hero-cinematic/" + o.key, key: o.key, name: `${o.key.toUpperCase()} ${o.name}` })),
];

// Lab: one cinematic hero option at true size, as the first screen of /home would show it (one static route each)
export function Single({ k }: { k: CinematicOption["key"] }) {
  const o = CINEMATIC.find((c) => c.key === k)!;
  return (
    <main id="main">
      <CinematicHero o={o} preload />
      <LabSwitch current={o.key} options={SWITCH} label="Cinematic hero options" />
    </main>
  );
}
