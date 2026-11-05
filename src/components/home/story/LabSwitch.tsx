import Link from "next/link";
import styles from "./LabSwitch.module.css";

// Review aid for the D29 story options and the D32 rail looks (lab routes only, never on the homepage): a small fixed
// switch between them.
const OPTIONS = [
  { href: "/lab/opening-a", key: "a", name: "A Layer" },
  { href: "/lab/opening-b", key: "b", name: "B Sentence" },
  { href: "/lab/opening-c", key: "c", name: "C Rail" },
  { href: "/lab/opening-c1", key: "c1", name: "C1 Horizon" },
  { href: "/lab/opening-c2", key: "c2", name: "C2 Window" },
  { href: "/lab/opening-c3", key: "c3", name: "C3 Drafting" },
];

type Option = { href: string; key: string; name: string };

// Also used by the hero options (D40), with their own list
export function LabSwitch({ current, options = OPTIONS, label = "Story options" }: { current: string; options?: Option[]; label?: string }) {
  return (
    <nav className={styles.switch} aria-label={label}>
      {options.map((o) => (
        <Link key={o.key} href={o.href} className={styles.link} aria-current={o.key === current ? "page" : undefined}>{o.name}</Link>
      ))}
    </nav>
  );
}
