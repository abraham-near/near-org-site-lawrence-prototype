# site/ — near.org

The near.org website. Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4.

A work-in-progress redesign of the near.org homepage, built section by section from a written spec (the spec and design files live outside this repository).

**Status:** the homepage is built. Inner pages linked from the header and footer don't exist yet, and the newsletter form isn't connected to a provider (it shows a success message but sends nothing).

**Fonts are not included** (licensed). Add them before building: see `src/fonts/README.md`.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run check` | Lint + typecheck + production build: must pass before any section is "done" |
| `npm run shots -- / /system` | Screenshots at 390/768/1440/1920 (full page + per section) into `.shots/<timestamp>/` (dev server must be running) |
| `npm run detect` | Impeccable design detector against the running dev server (`DETECT_URL=…` to override) |

## Structure

```
src/
├── app/                 routes (App Router). `/system` = internal design-token specimen (noindex)
├── components/
│   └── brand/           Logo (official marks only)
├── fonts/               licensed WOFF2, not included in this repo (see src/fonts/README.md)
└── styles/
    ├── tokens.css       design tokens, mirror of spec/DESIGN.md
    └── fonts.ts         next/font/local setup
public/brand/            official SVGs copied from ../assets/brand/
scripts/screenshots.mjs  review screenshots
```

New components go in `src/components/<area>/PascalCase.tsx` (e.g. `components/home/Hero.tsx`, `components/ui/Button.tsx`).

## Dropbox

`node_modules/` and `.next/` are marked ignored by Dropbox. If they are deleted and recreated, re-mark them:

```bash
xattr -w 'com.apple.fileprovider.ignore#P' 1 node_modules .next
```
