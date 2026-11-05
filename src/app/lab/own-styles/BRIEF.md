# Own-your illustration styles: builder brief (D53)

Lawrence chose the **Original** homepage direction (/lab/dir-o) as the base. On its horizontal rail, four stations read
"Own your data. / assets. / intelligence. / identity." Each has a small drawing above the line (today:
`site/src/components/home/chapter-one/OwnArt.tsx` + `OwnArt.module.css`, READ BOTH FIRST). He wants **8 new
illustration styles** for these four drawings, mocked up as statics over the rail's background, to narrow down.

## Where you work
- Review page (already built, don't restyle it): `site/src/app/lab/own-styles/` — `page.tsx`, `Stage.tsx` (full-screen
  mock + real-size crops over the ridges/mist background), `styles/types.ts` (the `StyleDef` contract),
  `styles/index.ts` (registry).
- You own ONLY your two folders: `site/src/app/lab/own-styles/styles/<key>/` (replace the placeholder `index.tsx`; add a
  `.module.css` and any helper files inside the folder). Touch nothing else (no shared files, no tokens, no other styles).
- Dev server already running: http://localhost:3200/lab/own-styles#<key> (DON'T start/stop/restart servers).
- Verify visually with Playwright (installed in `site/`): screenshot your two sections at 1440 wide (and a crop at 390
  to check nothing breaks), look at the images, iterate until they're genuinely good. Save screenshots to the scratchpad
  dir you're given. Then run, from `site/`: `npx eslint src/app/lab/own-styles` and `npx tsc --noEmit`.
- No commits, no git operations.

## The contract
`export const style: StyleDef = { key, name, refs, summary, motion, Art }` where `Art({ which })` renders one of
`"data" | "assets" | "intelligence" | "identity"`. It's placed in a 320 px wide slot (in the full-screen mock it's scaled
to ~22% of the frame). Draw on a 240 × 180 design box (like OwnArt) so it lands 320 × 240; it may overflow a little.
Static end state only (these are stills); describe the intended motion in `motion` (one sentence).
- `name`: 1–2 words. `refs`: which of his favourites it draws on. `summary`: 1–2 plain sentences on the look.
- Write `Art` as a named function component (lint: react/display-name).

## What each drawing must show (the same metaphors and facts as today, restyled; recompose freely)
- data: a note/document whose text lines become private dots; a "Private" tag. (Copy: "Transactions and prompts stay
  confidential, even from the infrastructure running them.")
- assets: one account (a wallet card with cards behind it), two coins, a swap arc between them, a "Swap" tag; the
  destination coin is the green element. (Copy: "Hold, swap and move everything you have from one account only you control.")
- intelligence: an enclave (a sealed box/chip), a message going in, a signed receipt coming out, a "Signed proof" tag.
  (Copy: "Inference and agents run inside hardware enclaves, and every request returns a signed proof of what ran.")
- identity: an ID badge reading "your-name" / ".near", a key ring with the old key turning away and a new key (green),
  a "35+ chains" tag. (Copy: "One NEAR account that reads like a name, works across 35+ chains, and upgrades to
  post-quantum keys in a single rotation.")
Any extra micro-labels must be words taken verbatim from those copy lines (e.g. "Hold", "Swap", "Move", "Inference",
"Agents", "Transactions", "Prompts", "post-quantum"). **Never invent numbers, coordinates, prices, chain names, logos or
facts.** No logos at all (never draw or redraw the NEAR N or any brand mark).

## Non-negotiables (spec/DESIGN.md, spec/DECISIONS.md; read DESIGN.md's colour + type sections)
- Colours only from tokens in `site/src/styles/tokens.css` (`var(--color-…)`; `color-mix()` of tokens is fine). No hex,
  rgb or named colours anywhere. Fonts only `var(--font-sans)` / `var(--font-mono)` / `var(--font-accent)`.
- Light mode; NEAR green (`--color-green`, text-safe `--color-green-text`) is the ONLY saturated colour, used for the
  one "yours" element per drawing (plus tiny accents at most). Forest/ink allowed for tags.
- Text inside drawings renders ≥ 13 px at the 320 px slot (≥ 10 design units on the 240 box).
- Refined, detailed, vector-based, elegant. Not grungy, not crypto-bro, not clip-art, not cute. Fine technical detail is
  welcome. Keep it legible against the misty ridges background (check contrast; a paper fill behind objects is fine).
- Never run a white or lighter highlight along a line (also not in the motion description); lines draw on/off and fade.
- Decorative: the root element `aria-hidden="true"`; SVG `focusable="false"`.

## His taste (from his Figma "WHAT I WANT" board)
Favourite site: Tempo (clean minimal, grid, imagery mixed with clean animated vector graphics; their cards: hairline
stacked account cards, a dotted globe, black pill tags). Monad (same, coloured hover states). Sui (one motif carrying the
page). Microsoft Pixel R&D (ribbed glass lamellae, prismatic fringes on neutral surfaces). PARK Stuttgart (graded subtle
imagery + fine instrument detail: hairline grids, crosshair nodes, tiny UI marks). Simple Done Well / Arc'teryx / Synais
(desaturated photography where green is the only colour; framed windows, viewfinder marks). Momentum / Fractalized
(editorial negative space, graphic shapes from a mark's construction drawing, engineered renders, quiet two-tone).
Screens of all of these: `references/screens/<name>/` (tempo, monad, sui, msft-pixel, park-stuttgart, simple-done-well,
arcteryx, synais, momentum, fractalized). Look at the ones your styles cite.

## Report back (short)
For each style: name, the look in two sentences, what you checked, screenshot paths, and anything you're unsure of.
