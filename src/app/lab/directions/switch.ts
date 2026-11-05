import { VERSIONS } from "./data";

// The lab switch across the four directions (D52), with the contact sheet first and the Original with Orbit (D56) last
export const DIR_SWITCH = [
  { href: "/lab/directions", key: "sheet", name: "Contact sheet" },
  ...VERSIONS.map((v) => ({ href: v.route, key: v.key, name: v.name })),
  { href: "/lab/orbit", key: "orbit", name: "Original + Orbit" },
];
