# Hero versions: builder brief (D90)

ROOT = `/Users/lawrence/Library/CloudStorage/Dropbox-Personal/claude code/NEAR ORG`. Read `ROOT/CLAUDE.md` first (light
mode, token colours only in code, never fabricate, **never generate or redraw logos**, no text in renders). Site:
`ROOT/site` (Next.js 16 App Router, TS, Tailwind v4; read `site/node_modules/next/dist/docs/` before any Next API you are
unsure of). Lawrence (design lead) is away; work without stopping, check everything with your own eyes, iterate until
it is genuinely good, then report. A critic reviews after you.

## What Lawrence asked
> I like all the concepts in addition to the original concept. I want to finish them all completely, including camera
> move and animating the mograph elements on top of them that track. Unfurl should unfurl some and the water drops move as
> the camera moves down; I want natural movement. The clouds on the mountain scene should definitely animate visibly on
> scroll. On the desert shot the lighting should animate as if the sun is moving, like a time lapse, and sand blows as the
> camera moves down. The gate should have realistic moving reflections and blowing grass as the camera moves down. All of
> these should have some z movement as well. Which version we see when the page loads is random (including the current
> original).

The four static concepts are on http://localhost:3200/lab/hero-cinematic (and `/a` … `/d`), built in
`site/src/components/home/chapter-one/cinematic/` (`CinematicHero.tsx`, `options.tsx`, `layers/*.tsx`, `vec.tsx`,
`data/`), stills in `site/public/images/lab/hero-cinematic/`, sources in `ROOT/assets/generated/2026-11-05_hero-cinematic/`
(`out/` PNGs, `LOG.md`). Spec D89 in `ROOT/spec/DECISIONS.md`.

## How the original works (match it)
`/home`'s hero (the "original"): `site/src/components/home/chapter-one/` (`ChapterOne.tsx`, `HeroVideo.tsx`,
`ChapterOneMotion.tsx`, `layer/HeroLayer.tsx` + `core.ts` + `dust.ts`), wired in `site/src/app/home/page.tsx`.
- A 10 s Seedance clip, the camera moving through the scene, **scrubbed by the reader's scroll and never played on its
  own** (WCAG 2.2.2), desktop with motion only (≥1280 px); its first frame is the poster (first paint, LCP), and phones,
  tablets and reduced motion keep the still with a gentle parallax.
- Encoded for seeking: H.264, crf ≈ 27, 1920 px wide, a keyframe every 4 frames, no B-frames, no audio, 24 fps
  (see "In use on the site" in `ROOT/assets/README.md` for the exact ffmpeg settings used).
- The vector layer is **tracked to the footage**: points on real features followed through every frame with OpenCV optical
  flow (`ROOT/assets/generated/2026-11-04_hero-explore/` `track.py`, `select_*.py`, `pipeline.sh`; and
  `ROOT/assets/generated/2026-11-05_hero-reverse-track/` for a reverse pass and `smooth_tracks.py`), saved as JSON, and
  drawn each frame at the video's current frame (`HeroLayer.tsx` reads the frame on screen, so the marks only move with
  the scroll). Run Python with `~/.near-org-cv/bin/python -I` (OpenCV is there).
- Rules from Lawrence (D45, D59, D60, D64–D67, memory `motion-graphics-feedback.md`, `illustration-taste.md` in
  `/Users/lawrence/.claude/projects/-Users-lawrence-Library-CloudStorage-Dropbox-Personal-claude-code-NEAR-ORG/memory/`):
  **never a light running along a line** (lines draw on/off or are carried rigidly; markers may travel); lines joining dots
  are strongest at the dots; the layer thins out towards the headline and keeps clear of the copy; green is the only
  saturated colour and sparing; dense, precise micro-detail; no text labels.

## Your version
Make your concept a full hero like the original: a camera move video + a vector layer tracked to it.
- **Video:** Higgsfield `seedance_2_5`, `--mode omni_reference`, `--start-image` your concept's still (the PNG in
  `ROOT/assets/generated/2026-11-05_hero-cinematic/out/`, or the lab WebP), 16:9, no audio. The camera **moves down**
  through the scene with **some z movement** (a slow push in or pull back), slow and cinematic, plus your scene's own
  natural motion (in your prompt below). Keep the light, airy, misty grade of the still, the calm space on the left where
  the headline sits, and the first frame identical to the still (so the poster swap is invisible).
- **Credits (hard cap 184 per version; the account has ~812 for all four):** first one 720p 8 s test take (56 credits) to
  prove the motion and prompt; then one 1080p 8 s final take (128 credits). Check prices with
  `higgsfield generate cost …` before submitting. No further takes; if the final has a flaw, fix it in the edit
  (trim, speed, grade, crop) or the layer. Log every job (prompt, job id, credits) in a `LOG.md` in
  `ROOT/assets/generated/2026-11-05_hero-<key>/` (sources go there) and a line in `ROOT/assets/README.md`.
- **Encode** like the original (above) to `site/public/videos/home/home-hero-<key>-v1.mp4`; the first frame as
  `site/public/images/home/home-hero-<key>-v1.webp` (same size and grade as the video's first frame).
- **Layer:** re-track your concept's vector layer to the footage (OpenCV; points on the real features: ridges, the summit,
  the coil and drops, the dune crest and ripples, the ring's edge and the grass edge, whatever your design uses), and draw
  it each frame at the video's current frame, like `HeroLayer` does (you may import from `layer/core.ts` and the cinematic
  `vec.tsx`/`geom.ts`, read-only; put your own code in your folder). Keep the static concept's design and density; let it
  move with the footage; add restrained life where it helps (markers riding tracks, ticks breathing, arcs drawing on as
  the scroll reaches them). The still (phones, reduced motion, no JS) shows the layer at frame 0.
- **Export:** replace your placeholder `site/src/components/home/chapter-one/heroes/<key>/index.tsx` with
  `export const hero: HeroVariant = { key, name, poster, video, layer }` (the same shape `ChapterOne` takes as `hero`;
  `layer` is your client component). Put any other code in `heroes/<key>/`.
- **Review page:** `site/src/app/lab/hero-live-<key>/page.tsx` rendering the full homepage with your hero, like
  `site/src/app/lab/hero-z-j/page.tsx` does: `<HomeSections story={<StoryRail look="horizon" art="orbit-live" />}
  hero={hero} />` (copy `/home`'s story props from `site/src/app/home/page.tsx`).

## Your files only
`site/src/components/home/chapter-one/heroes/<key>/**`, `site/src/app/lab/hero-live-<key>/**`,
`site/public/videos/home/home-hero-<key>-v1.mp4`, `site/public/images/home/home-hero-<key>-v1.webp`,
`ROOT/assets/generated/2026-11-05_hero-<key>/**`, and one appended section in `ROOT/assets/README.md`. Don't edit
`ChapterOne.tsx`, `HeroVideo.tsx`, `ChapterOneMotion.tsx`, `layer/*`, `cinematic/*`, `heroes/index.ts`,
`heroes/types.ts`, `/home`, `spec/` or git: three other builders and an integrator (random selection) work at the same
time. If you need a shared change (e.g. `HeroVideo` must accept a different FPS or duration), say so in your report and
make your version work without it if you can. Dev server http://localhost:3200 (don't start/stop servers; reload after
adding files to `public/`). Scratch: `/private/tmp/claude-501/-Users-lawrence-Library-CloudStorage-Dropbox-Personal-claude-code-NEAR-ORG/362b42aa-4ffd-4f4c-942f-f08389248301/scratchpad/hero-<key>/`.

## Check
Playwright from `ROOT/site` (`ROOT/handoff/scripts/verify/_pw.mjs`; launch Chromium with
`--use-angle=metal --enable-gpu --ignore-gpu-blocklist`): on `/lab/hero-live-<key>` at 1440 × 900 and 1920 × 1080, scroll
through the hero in steps and capture frames (the camera move, the scene's motion, the layer staying exactly on the
features at every step; no drift, no jitter); the first frame vs the poster (no visible swap); 390 and reduced motion (the
still with the layer). No console errors. `npx eslint src/components/home/chapter-one/heroes/<key> src/app/lab/hero-live-<key>`
and `npx tsc --noEmit`. Frame time while scrubbing (`ROOT/handoff/scripts/verify/frametime.mjs`, read it; make a scratch
copy that scrolls through the hero).

## Report (short)
The video (what moves, how the camera moves, duration), the layer (what's tracked, what animates), credits spent, files,
best screenshot paths (a scrub sheet of 6–9 frames at 1440, first frame vs poster, 390), anything unsure or any shared
change needed.
