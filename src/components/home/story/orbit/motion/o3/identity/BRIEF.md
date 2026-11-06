# Identity options: builder brief (D80, lab)

The homepage (`/home`) has a horizontal story rail with four "Own your …" stations. Three are now animated real-time
3D (three.js): **data** (a frosted disc turning flat to camera, a green ball diffused behind it), **assets** (a frosted
glass washer, one green ball orbiting it) and **intelligence** (a frosted glass sphere with a clear glass band, a green
machined core turning inside, a chrome ball outside). The fourth, **Own your identity**, is still Orbit's static
drawing: a green ring floating over a frosted disc engraved "your-name.near", with a ghost of the old ring at its
previous tilt. Lawrence, the design lead:

> I want static options of own your identity to choose from before we go into detail animating it. I don't want
> generic iconography, but the visual we have doesn't work possibly. In the same visual style as our other 3, give me
> options for that one before we animate it.

The line it illustrates (`site/src/components/home/story/copy.ts`): **"One NEAR account that reads like a name, works
across 35+ chains, and upgrades to post-quantum keys in a single rotation."**

Five builders each make one option, in parallel. Yours is named in your prompt.

## Read first
- `ROOT/CLAUDE.md` (ROOT = `/Users/lawrence/Library/CloudStorage/Dropbox-Personal/claude code/NEAR ORG`).
- `site/src/components/home/story/orbit/motion/o3/`: `index.tsx` (the `Stage` component, now exported, and the three
  stations' components), `gl.ts` (the shared renderer, studio, materials; the `kit` export at the bottom gives you
  `palette, mix, getEngine, backdrop, studio, frosted, polished, polishedDark, greenBall, onlyIn, softShadow, machined,
  veiled, cleanEdge, view`), `scenes.ts` (poses and the vectors projected from 3D), `geo.ts` (camera, markers).
- `site/src/components/home/story/orbit/OrbitArt.tsx` and `orbit.module.css`: Orbit's vector vocabulary and classes.
- `ROOT/spec/DECISIONS.md` D72–D79 (search `## D72.`), especially D75 (artifacts Lawrence called "an error": glass
  refracting a ball's own pixels beside it; lines drawn across a ball) and D78 (nothing crossing a glass face from
  behind).
- Look at the three live stations: http://localhost:3200/home, scroll into the rail (or `/lab/rail-motion`), and the
  current identity drawing. They set the quality bar.

## What to make
A **static** scene at rest, as a component that drops into the identity station's 420 × 315 slot:
- `identity/<your-key>.tsx` exports `name` (2–3 words), `note` (two plain sentences: what we see, and what it says
  about the line), and `Art` (takes `HTMLAttributes<HTMLDivElement>`, spreads them on its root; root `data-art=
  "identity"`, `aria-hidden="true"`). Use `Stage` from `../index` with `which="identity"`, a pose that ignores slide and
  time (it is static), vectors computed from the same projection, and `still="identity-<your-key>"`.
- Put your three.js scene in `identity/<your-key>.gl.ts` (loaded with a dynamic `import()` like the stations, so it adds
  nothing to pages that don't use it) and its geometry and vectors in `identity/<your-key>.scene.ts` if that helps.
- A fallback still captured from your live scene at rest: `site/public/images/home/own/motion/o3/identity-<your-key>.webp`
  (840 × 630, transparent WebP), the way `ROOT/assets/generated/2026-11-05_rail-motion/o3/LOG.md` describes (freeze
  `performance.now`, read the canvas). Capture it on `/lab/identity`.
- Think ahead to motion: say in your note-to-me (not the page) how it would animate later, but build it static.

## Style (the same as the other three)
- Real-time 3D in the shared studio: frosted glass (transmission with roughness, the `veiled` rim), polished chrome,
  and **exactly one green part** (the token green, like the green balls and the intelligence core). Light, airy, on the
  light page; transparent canvas. **No drop shadows.** Mostly front-on or a gentle three-quarter, like the others.
- Dense, precise micro-detail is welcome (Lawrence loves it): fine machined edges, bevels, graduations.
- Orbit's vector layer, projected from the scene: perspective orbits split behind and in front, graduated arcs with
  fine ticks, tiny markers (ring, cross, square), a ticked ecliptic. Few, precise. Lines that join dots are strongest
  at the dots. Nothing crosses a glass or metal face from behind; no line across the green part.
- **No text or tags**, no NEAR N, no logos, in the render or the vectors.
- **No generic iconography:** no keys, padlocks, fingerprints, ID cards, person silhouettes, shields, globes, chain
  links, network graphs, infinity signs. The object should be a beautiful machined thing that carries the idea.
- Token colours only in code (`var(--color-…)`, `color-mix()` of tokens, or tokens read at runtime as `Stage` does).
- Size: the composition should fill the slot about as much as the intelligence station does, centred.

## Your files only
`identity/<your-key>.tsx`, `identity/<your-key>.gl.ts`, `identity/<your-key>.scene.ts`, the still, and scratch files in
`/private/tmp/claude-501/-Users-lawrence-Library-CloudStorage-Dropbox-Personal-claude-code-NEAR-ORG/362b42aa-4ffd-4f4c-942f-f08389248301/scratchpad/identity/<your-key>/`.
Don't edit `gl.ts`, `index.tsx`, `scenes.ts`, the lab page, or another option's files (other builders are working in
them at the same time). If you need a shared change, say so in your report. No git. Don't start or stop servers (dev
is http://localhost:3200; reload after adding files to `public/`). No Higgsfield needed.

## Check your work
- `/lab/identity` shows your option at full size and at twice the size, beside today's drawing. Capture both with
  Playwright (in `site/`; `ROOT/handoff/scripts/verify/_pw.mjs` exports `chromium`) at 1440 × 900, 2×, and look
  properly. Iterate until it is genuinely good: real glass, real chrome, vectors exactly on the objects, no artifacts.
- Reduced motion (`emulateMedia({ reducedMotion: "reduce" })`) shows your still, never a blank.
- No console errors on `/lab/identity`. From `site/`: `npx eslint src/components/home/story/orbit/motion/o3/identity`
  and `npx tsc --noEmit` (errors in another builder's half-made file aren't yours; mention them).

## Report (short)
The look in a few sentences; how it would animate later; your files; your best screenshot paths (full size, 2×); what
you're unsure of.
