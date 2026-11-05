# Rail motion options: builder brief (D72)

The homepage (`/home`) is the master. On its horizontal rail, four "Own your …" stations each show an Orbit drawing:
a CGI render (chrome, satin and frosted glass, a transparent WebP) with fine vector orbits, ticks, markers and one
small tag. Read `site/src/components/home/story/orbit/OrbitArt.tsx`, `orbit.module.css` and `geom.ts` first. Look at
the current data and assets stations on http://localhost:3200/home (scroll through the rail at 1440 × 900).

Lawrence's words for this round, edited only for length:

> I like this design but I want to change it. The combination of CGI-looking renders and graphic details I want to
> keep. We will always have vector elements in addition to CGI renders. The idea of a frosted circle with a metallic
> edge I like, and I want this to be an element that is animated and then tracked into the site. You can use Higgsfield
> to render the animation.
>
> **Data:** the frosted circle is rotated when it enters frame. As it slides across and reaches the centre of the
> frame it is flat to camera, so we see the complete circle and not at an angle. We should still see a very, very
> subtle micro bevel of the metallic around the edge. Keep all the graphical orbiting elements. We should see just one
> ball. That ball animates in a loop, left to right to left to right, and passes behind the frosted glass, so the data
> is represented by the green spherical metallic ball. We see it, and when it goes behind the circle it's super frosted
> and diffused, to convey the concept of confidential.
>
> **Assets:** I like this angled circular path; keep that design. Both balls circular as now, but the same diameter
> (now they are different sizes). Then just see them rotating around their path in a seamless loop: when it slides into
> frame they're moving a little, and when the scroll stops and it's in the middle of the frame the animation continues
> as a loop, even when the person isn't touching anything.
>
> Keep the same render style. Make sure they work over the light background and include vector elements tracked to
> them. Three options of each, and I'll select.

## The three options (one builder each; both stations per option)
1. **Live glass** (`orbit/motion/o1/`): the renders as stills (Higgsfield `gpt_image_2_5`, transparent background),
   animated in the browser.
   - **Data:** the disc is a flat-to-camera frosted disc still (its micro-bevel in the render), turned in CSS 3D
     (`rotateY`, with perspective) by the slide. A real `backdrop-filter` blur, clipped to the disc's shape, frosts
     whatever passes behind it: the ridges and the green ball. A thin metallic rim strip shows the edge's thickness
     while it is angled. The ball is a still sprite looping behind.
   - **Assets:** the ring as a still; the two ball sprites move along its projected ellipse, scaled and depth-sorted
     (in front of or behind the ring) as they go round.
   - **Vectors:** computed every frame from the same projection, so they are exactly "tracked".
2. **Rendered film** (`orbit/motion/o2/`): the motion rendered as video in Higgsfield (Seedance 2.5; start and end
   frames from `gpt_image_2_5` stills), on a plain white background, composited over the page with
   `mix-blend-mode: multiply` (white drops out; check it reads as glass over the light ridges).
   - **Data:** the disc's turn from angled to flat is rendered as a clip and scrubbed by the slide (seek the video or
     use an image sequence); the ball is a separate sprite looping behind, blurred where the tracked disc covers it.
   - **Assets:** a seamless orbit loop, the same start and end frame, playing continuously.
   - **Vectors:** tracked from the footage with OpenCV (the hero's tools are in
     `assets/generated/2026-11-04_hero-explore/`, with a Python venv at
     `/private/tmp/claude-501/-Users-lawrence-Library-CloudStorage-Dropbox-Personal-claude-code-NEAR-ORG/3845a99f-9eea-4927-a5c1-4ebe7150120e/scratchpad/cvenv`).
3. **Real-time 3D** (`orbit/motion/o3/`): three.js. Add `three` as a dependency (exact version, `npm install three
   @types/three`). Load it with a dynamic `import()` only on the client, so it adds nothing to pages that don't use it.
   - **Data:** a frosted disc in `MeshPhysicalMaterial` (transmission with roughness, so the ball behind is genuinely
     diffused) with a thin metallic bevel ring; a metallic green ball looping behind.
   - **Assets:** the tilted ring with two equal metallic balls orbiting.
   - **Lighting:** a neutral studio environment (`RoomEnvironment` or a generated HDR), transparent canvas.
   - **Vectors:** projected from the scene each frame (SVG over the canvas).

## Shared rules
- **Contract:** your option's `index.tsx` exports `name` ("Live glass", "Rendered film" or "Real-time 3D"),
  `note` (two plain sentences on how it's made and how it moves), `DataArt` and `AssetsArt`. Each takes
  `HTMLAttributes<HTMLDivElement>` and spreads them on its root. The root carries `data-art="data"` or
  `data-art="assets"` and `aria-hidden="true"`, and fills its slot at 4:3 (420 × 315 at full size, smaller on short
  screens). Client components where needed (`"use client"`).
- **The slide:** use `useSlide` from `orbit/motion/slide.ts`. It gives the slide (−1 entering from the right, 0 at
  the centre, +1 leaving left) and the time, every frame while on screen.
  - Data: the disc's turn follows the slide, about 60–70° at ±1 and exactly flat at 0, eased so it settles flat for
    a stretch either side of the centre.
  - Loops run on the time, so they keep going when the scroll stops.
- **Reduced motion and phones:** with reduced motion, no JS, or on the static reading (phones and tablets, the same
  component in a list), show the rest state: the disc flat, the ball at rest beside the disc (or half behind it),
  and the assets balls at a pleasing point on the ring. Never a blank. Respect `prefers-reduced-motion`.
- **Performance:** only animate while on screen (useSlide already stops off screen), and use transform and opacity
  where possible. No layout thrash.
- **Keep from Orbit:**
  - the vector vocabulary (perspective orbits split behind and in front, graduated arcs with fine ticks, tiny
    markers, the ticked ecliptic);
  - one tag per station, "Private" (data) and "Swap" (assets), at 13 px or more at the slot's size (see Orbit's
    `--fit`);
  - the gradient rule: a line that joins dots is strongest at its dots;
  - green (`--color-green`) is the only saturated colour: the data ball, the green assets ball, the swap arc.
- **Never:**
  - a light or highlight running along a line;
  - text, logos or the NEAR N inside renders;
  - any colour in code that isn't a token (`var(--color-…)` or `color-mix()` of tokens; render pixels are exempt).
- **The ball sizes:** in assets, both balls the same diameter. In data, one ball only.
- **Your files only:** you own your option folder, `site/public/images/home/own/motion/o<N>/` for your assets, and
  `assets/generated/2026-11-05_rail-motion/o<N>/` for sources (with a `LOG.md` of prompts, job IDs and credits).
  Option 3 may also edit `site/package.json` and `site/package-lock.json` to add three. Don't touch any other file;
  ask in your report if you need a shared change.
- **Higgsfield:** pre-approved. Budget: about 40 credits for option 1, 150 for option 2 and 20 for option 3. Use the
  `higgsfield` CLI with `--wait`. Generated stills come with transparent backgrounds (`--background transparent`).
  `gpt_image_2_5`, high quality, 2k. Seedance 2.5 for video (`higgsfield model get seedance_2_5 --json` for its
  parameters; `omni_reference` mode with start and end images).
- **Reference:** the current Orbit renders in `site/public/images/home/own/orbit-*.webp` set the style.

## Check your work
- The dev server is http://localhost:3200 (don't start or stop servers). It may need a reload after you add files to
  `public/`.
- **Demos:** `/lab/rail-motion` shows your two drawings in looping demos (slide in, hold, slide out).
- **The rail:** `/lab/orbit-<N>` is the homepage with your option on the rail.
- **Playwright** (installed in `site/`; scripts in your scratchpad folder):
  - capture frames of the slide (−1, −0.5, −0.2, 0) and of the loop at rest (several moments over 2–4 s) at
    1440 × 900, at 2× for detail;
  - check the static reading at 390;
  - check reduced motion;
  - check for console errors.
- Look at the frames properly and iterate until they are genuinely good. The disc must read as frosted glass with a
  bevel, and the ball behind it as truly diffused. The vectors must sit exactly on the objects.
- Run `npx eslint src/components/home/story/orbit` and `npx tsc --noEmit` from `site/`.
- No git.

## Report (short)
- the look and the motion in a few sentences;
- the credits you spent;
- your files;
- your screenshot paths;
- anything you're unsure of, or any shared change you need.
