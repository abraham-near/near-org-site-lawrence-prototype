// Site map for the header and footer, from the draft site (Lawrence, 2026-11-02: "the header here is correct").
// Descriptors are the draft's, except two kept to verified facts: near.com says 35+ chains (PRODUCT.md F3; the draft
// said 30+), and Quantum Security uses the copy board's single quantum term. Internal routes are planned pages.

export type NavLink = { label: string; href: string; description?: string; external?: boolean };
export type NavSection = { heading?: string; links: NavLink[] };
export type NavGroup = { id: string; label: string; sections: NavSection[] };

const L = {
  nearCom: { label: "near.com", href: "https://near.com", description: "One account, 35+ chains, confidential by default", external: true },
  intents: { label: "Intents", href: "https://intents.near.org", description: "The universal liquidity layer for onchain markets", external: true },
  nearAi: { label: "NEAR AI", href: "https://near.ai", description: "Confidential, verifiable inference and agents", external: true },
  protocol: { label: "Protocol", href: "/protocol", description: "The settlement layer for the agent economy" },
  chainAbstraction: { label: "Chain Abstraction", href: "/chain-abstraction", description: "How NEAR connects any chain" },
  quantum: { label: "Quantum Security", href: "/quantum-security", description: "Post-quantum keys, live on mainnet" },
  docs: { label: "Docs", href: "https://docs.near.org/", description: "Build on NEAR", external: true },
  solutions: { label: "Solutions", href: "/solutions", description: "Explore use cases" },
  research: { label: "Research", href: "/research", description: "White paper and protocol work" },
  blog: { label: "Blog", href: "/blog", description: "News and deep dives" },
  analytics: { label: "Analytics", href: "/analytics", description: "Live onchain metrics" },
  brand: { label: "Brand", href: "/brand", description: "Logos and guidelines" },
  contact: { label: "Contact", href: "/contact-us", description: "Connect with the team" },
  careers: { label: "Careers", href: "https://job-boards.eu.greenhouse.io/nearfoundation", description: "Build the agent economy", external: true },
  history: { label: "History", href: "/about", description: "From 2017 to now" },
  roadmap: { label: "Roadmap", href: "https://roadmap.near.org/", description: "What ships next", external: true },
  economics: { label: "Economics", href: "/economics", description: "Revenue, buybacks, supply" },
  foundation: { label: "NEAR Foundation", href: "/near-foundation", description: "Supporting a decentralized ecosystem" },
  ecosystem: { label: "Ecosystem", href: "/ecosystem" },
  community: { label: "Community", href: "/community", description: "Validators, builders, Legion, and events" },
  governance: { label: "Governance", href: "https://houseofstake.org/", description: "House of Stake", external: true },
} satisfies Record<string, NavLink>;

export const NAV: NavGroup[] = [
  { id: "products", label: "Products", sections: [{ links: [L.nearCom, L.intents, L.nearAi] }] },
  { id: "stack", label: "Stack", sections: [{ links: [L.protocol, L.chainAbstraction, L.quantum] }] },
  {
    id: "resources",
    label: "Resources",
    sections: [
      { heading: "Build", links: [L.docs, L.solutions] },
      { heading: "Learn", links: [L.research, L.blog, L.analytics] },
      { heading: "Connect", links: [L.brand, L.contact, L.careers] },
    ],
  },
  {
    id: "about",
    label: "About",
    sections: [
      { heading: "Fundamentals", links: [L.history, L.roadmap, L.economics] },
      { heading: "Ecosystem", links: [L.foundation, L.community, L.governance] },
    ],
  },
];

// Footer columns (the draft's eight groups; the footer also lists Ecosystem and the legal pages).
export const FOOTER: NavSection[] = [
  { heading: "Products", links: [L.nearCom, L.intents, L.nearAi] },
  { heading: "Stack", links: [L.protocol, L.chainAbstraction, L.quantum] },
  { heading: "Build", links: [L.docs, L.solutions] },
  { heading: "Learn", links: [L.research, L.blog, L.analytics] },
  { heading: "Connect", links: [L.brand, L.contact, L.careers] },
  { heading: "Fundamentals", links: [L.history, L.roadmap, L.economics] },
  { heading: "Ecosystem", links: [L.foundation, L.ecosystem, L.community, L.governance] },
  {
    heading: "Terms and Policies",
    links: [
      { label: "Terms of Use", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Official Rules", href: "/official-rules" },
    ],
  },
];

export const PRIMARY_ACTION: NavLink = { label: "Get started", href: "https://near.com", external: true };
