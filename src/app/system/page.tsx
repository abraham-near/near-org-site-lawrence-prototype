import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";

export const metadata: Metadata = {
  title: "System",
  robots: { index: false, follow: false },
};

const COLOURS = [
  { token: "surface", hex: "#F5F4F1", note: "Page background" },
  { token: "surface-2", hex: "#E2E1DE", note: "Cards, inputs" },
  { token: "ink", hex: "#262626", note: "Text, dark sections" },
  { token: "muted", hex: "#5F6669", note: "Secondary text" },
  { token: "green", hex: "#00DC8D", note: "The accent" },
  { token: "green-text", hex: "#2E7424", note: "Green text on light" },
  { token: "forest", hex: "#0A2018", note: "Deep dark section" },
];

const TYPE = [
  { cls: "t-display", label: "display · Montreal 500", sample: <>Own your <span className="accent">world.</span></> },
  { cls: "t-h1", label: "h1 · Montreal 500", sample: <>The settlement layer <span className="accent">for agents</span></> },
  { cls: "t-h2", label: "h2 · Montreal 500", sample: <>The NEAR <span className="accent">Stack</span></> },
  { cls: "t-h3", label: "h3 · Montreal 500", sample: <>Built to connect</> },
  { cls: "t-h4", label: "h4 · Montreal 500", sample: <>One account for every chain</> },
  { cls: "t-title-editorial", label: "title-editorial · Kepler Italic", sample: <>Intelligence</> },
  { cls: "t-lede", label: "lede · Montreal 400", sample: <>The open network where people and AI agents hold, move and settle value.</> },
  { cls: "t-body", label: "body · Montreal 400", sample: <>Your keys, your assets, no compromises. NEAR accounts pair programmable access keys with post-quantum signing, so you get the ease of a web login with the guarantees of true self custody.</> },
  { cls: "t-small", label: "small · Montreal 400", sample: <>Figures as of 31 Oct 2026. Sources: Dune, NearBlocks.</> },
  { cls: "t-label", label: "label · Montreal 500 uppercase", sample: <>The future of finance is yours</> },
  { cls: "t-mono", label: "mono · Montreal Mono 400", sample: <>await intents.swap({"{"} from: &quot;USDC@base&quot;, to: &quot;SOL&quot; {"}"})</> },
];

export default function SystemPage() {
  return (
    <main>
      <section className="section container-page">
        <p className="t-label text-muted">Internal · design system specimen</p>
        <h1 className="t-h1 mt-6">
          near.org <span className="accent">system</span>
        </h1>
        <p className="t-lede mt-6 text-muted">
          Live render of the tokens in <code className="t-mono">src/styles/tokens.css</code>. Source of truth:{" "}
          <code className="t-mono">spec/DESIGN.md</code>.
        </p>
      </section>

      <section className="section container-page border-t border-line" aria-labelledby="colour">
        <h2 id="colour" className="t-h2">Colour</h2>
        <ul className="mt-10 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
          {COLOURS.map((c) => (
            <li key={c.token}>
              <div className="h-24 rounded-md border border-line" style={{ background: c.hex }} />
              <p className="t-h4 mt-3">{c.token}</p>
              <p className="t-small text-muted">
                {c.hex} · {c.note}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section container-page border-t border-line" aria-labelledby="type">
        <h2 id="type" className="t-h2">Type</h2>
        <div className="mt-10 divide-y divide-line">
          {TYPE.map((t) => (
            <div key={t.cls} className="grid gap-4 py-8 lg:grid-cols-[240px_1fr] lg:items-baseline">
              <p className="t-small text-muted">{t.label}</p>
              <p className={t.cls}>{t.sample}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section container-page border-t border-line" aria-labelledby="actions">
        <h2 id="actions" className="t-h2">Actions</h2>
        <div className="mt-10 flex flex-wrap gap-4">
          <a className="btn btn-primary" href="#actions">Use near.com</a>
          <a className="btn btn-secondary" href="#actions">Build on NEAR</a>
        </div>
      </section>

      <section className="section container-page border-t border-line" aria-labelledby="marks">
        <h2 id="marks" className="t-h2">Brand marks</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-10 rounded-lg bg-surface-2 p-10"><Logo height={40} /><Logo variant="icon" height={40} /></div>
          <div className="flex items-center gap-10 rounded-lg bg-green p-10"><Logo height={40} /><Logo variant="icon" height={40} /></div>
          <div className="flex items-center gap-10 rounded-lg bg-ink p-10"><Logo tone="light" height={40} /><Logo variant="icon" tone="light" height={40} /></div>
          <div className="flex items-center gap-10 rounded-lg bg-forest p-10"><Logo tone="light" height={40} /><Logo variant="icon" tone="light" height={40} /></div>
        </div>
      </section>

      <section className="section bg-ink text-on-dark" aria-labelledby="dark">
        <div className="container-page">
          <h2 id="dark" className="t-h2">A dark section <span className="accent">(1 of 2)</span></h2>
          <p className="t-body mt-6 text-on-dark-muted">Dark sections are allowed at most twice per page, each with a stated purpose (D1).</p>
        </div>
      </section>
    </main>
  );
}
