# Own-your hybrid renders: builder brief (D54)

Round two of the illustrations for the four "Own your …" stations on the homepage rail. Round one (eight flat vector
styles) is at http://localhost:3200/lab/own-styles. Lawrence's direction for this round, in his words:

> "A combination of 2D illustrative lines combined with high-end Redshift 3D-looking rendered elements, such as glass
> planes, frosted glass elements and metal elements, that coexist with the 3D vector lines in a seamless, elegant image.
> You can use the Microsoft Pixel R&D at ManvsMachine references as one style… ManvsMachine, Tendril and FutureDeluxe
> for CGI references… additional 2D references that have thinner lines, all new more abstract concepts with hyper micro
> details to add sophistication."

Read `research/own-hybrid.md` (references and ingredients), the project's `CLAUDE.md`, and `spec/DESIGN.md`'s colour
and type sections. Look at `references/screens/msft-pixel/` (01.jpg, video-frames.jpg), `tempo/`, `park-stuttgart/`,
`fractalized/`, `arcteryx/`.

## Where you work
- Review page (built; don't restyle it): `site/src/app/lab/own-hybrid/page.tsx`, reusing `../own-styles/Stage.tsx`
  with `large` (the drawing in a **420 × 315** slot; the full-screen mock scales it to ~29% of the frame).
- You own ONLY your style folders `site/src/app/lab/own-hybrid/styles/<key>/` (replace the placeholder), your render
  files `site/public/lab/own-hybrid/<key>-*.webp`, and `assets/generated/2026-11-04_own-hybrid/<key>/`. Append your
  entries to `assets/README.md` under a heading "Own-your hybrid renders — 2026-11-04 (D54)" (create it if missing,
  above the D53 section; another builder may be appending at the same time, so re-read the file just before you edit
  and only insert your own lines).
- Dev server: http://localhost:3200/lab/own-hybrid#<key> (don't start/stop servers). Verify with Playwright screenshots
  at 1440 (full-screen mock and the four crops; 2x for detail) and a 390 crop. Look at them properly and iterate.
  Then from `site/`: `npx eslint src/app/lab/own-hybrid` and `npx tsc --noEmit`. No git.

## The contract
`export const style: StyleDef` (type in `site/src/app/lab/own-styles/styles/types.ts`): `key, name, refs, summary,
motion, Art`. `Art({ which })` for `"data" | "assets" | "intelligence" | "identity"`, a named function component,
root `aria-hidden="true"`, filling the 420 × 315 box (`width: 100%; aspect-ratio: 4 / 3; position: relative`). Static
end state; `motion` = one sentence on how it would move (draw-on lines, a slow material move; never a light running
along a line).

## How to make it (the pipeline; proven)
1. **Composition first.** Decide each station's abstract concept and draw a rough layout (you may rasterise a simple
   SVG layout to PNG with Playwright and pass it as an image reference so the render follows your geometry).
2. **Render** with Higgsfield (pre-approved spend; budget about 60 credits per builder, ~2.75 each at high/2k):
   ```
   higgsfield generate create gpt_image_2_5 --prompt "…" --aspect_ratio 4:3 --background transparent \
     --quality high --resolution 2k [--image layout.png] --wait --json > job.json
   ```
   Then `curl` the `result_url` to `assets/generated/2026-11-04_own-hybrid/<key>/<station>-vN.png`.
   Prompt like a CGI art director: "High-end Redshift/Octane CGI product render, isolated on a fully transparent
   background … materials … neutral cool silver/white studio lighting, soft realistic contact shadow … minimal, elegant
   … three-quarter view from slightly above … no text, no logos, no background, no floor." The one coloured material is
   NEAR green, `#00DC8D` (anodised metal, tinted glass or a lit edge). Everything else neutral: clear/frosted glass,
   bead-blasted or brushed aluminium, polished steel, sapphire, matte white ceramic. **No text, numbers or logos inside
   renders** (all words go in the vector layer). A test render is at
   `assets/generated/2026-11-04_own-hybrid/test1.png` (fluted frosted glass + engraved aluminium disc + green disc),
   showing the quality bar.
3. **Web copy:** `cwebp -q 82 -alpha_q 90 -resize 1260 0 in.png -o site/public/lab/own-hybrid/<key>-<station>.webp`
   (keep each under ~250 KB). Check the alpha: glass should let the ridges show through, not sit on a white card.
4. **Vector layer**, registered to the render: an SVG under the image (lines that pass *behind* glass) and one over it
   (lines in front), plus HTML/SVG labels. This is what makes it seamless and sophisticated:
   - 3D vector lines in the render's own perspective: continue its edges and axes as hairlines, perspective ellipses for
     orbits and rotations, projection lines to a ground plane, exploded-assembly axes;
   - 2D micro detail: 0.5–0.75 px hairlines (ink via `color-mix` of tokens), micro tick scales, crosshairs, registration
     marks, hatching, dot matrices, tiny index squares, dimension lines. Hyper-fine but sparse: sophistication, not noise.
   - Place by measuring the render (look at it at 2x; iterate until lines meet the object's edges exactly).
5. **Labels:** the facts stay, small and precise, ≥ 13 px rendered (≥ 13 px at the 420 slot): "Private", "Swap",
   "Signed proof", "35+ chains", "your-name" / ".near". Extra micro-labels only with words verbatim from the copy lines:
   data: "Transactions and prompts stay confidential, even from the infrastructure running them."
   assets: "Hold, swap and move everything you have from one account only you control."
   intelligence: "Inference and agents run inside hardware enclaves, and every request returns a signed proof of what ran."
   identity: "One NEAR account that reads like a name, works across 35+ chains, and upgrades to post-quantum keys in a single rotation."
   Never invent numbers, coordinates, part numbers, chain names or logos. No NEAR N.

## Concepts: new and more abstract (each style may interpret these its own way)
- **data:** information passing through a frosted or fluted glass plane and coming out private (fine lines become dots
  or a blur; the plane is the confidentiality).
- **assets:** precision discs/tokens (metal) held in one account (a glass plane or tray), a swap as an arc or orbit
  between two, the destination green.
- **intelligence:** a sealed crystal or glass volume (the hardware enclave) with a machined core; a request enters as a
  ray, a signed trace or seal leaves (green).
- **identity:** a ring/disc that carries the name (engraved via the vector layer, not in the render); the old key or
  ring as a wireframe ghost, the new one in green metal, the rotation as a perspective arc.

## Non-negotiables
- Colours in code only from tokens (`var(--color-…)`, `color-mix()` of tokens). No hex/rgb in CSS/TSX (the render's
  pixels are exempt). Fonts: `var(--font-sans)` / `var(--font-mono)`.
- Light mode; refined, elegant, not crypto-bro, not grungy, not sci-fi neon, no glows or lens flares, no dark
  backgrounds. Green is the only saturated colour.
- Never run a white or lighter highlight along a line.
- Keep each station's art inside its 420 × 315 box (a little overflow for a hairline or label is OK) and legible over
  the misty ridges at both the full-screen scale and real size.

## Report back (short)
Per style: name, the look in two sentences, credits spent, files, screenshot paths, doubts.
