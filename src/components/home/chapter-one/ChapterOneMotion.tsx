"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Chapter 1 choreography (D8). The stage is pinned by CSS `position: sticky`; ScrollTrigger only measures.
// Scrubbed (0.6 s smoothing): the line, the photo closing in, the mission pinch, the convergence and the anthem wipe.
// Discrete tweens at thresholds: the "Own your …" word roll and its drawing (D18). Runs only where CSS shows motion mode.
const MOTION = "(min-width: 1280px) and (prefers-reduced-motion: no-preference)";
const SCRUB = 0.6;
const NS = "http://www.w3.org/2000/svg";
// The mission arrival's lane (a left-hand hairline just above the point) and its longest trail, as a share of it
const ARRIVE_FAN = 5, TRAIL = 0.14;

export function ChapterOneMotion() {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = anchor.current?.closest<HTMLElement>('[data-ch="root"]');
    if (!root) return;
    const q = <T extends Element>(sel: string) => root.querySelector<T>(sel)!;
    const svg = q<SVGSVGElement>('[data-ch="lines"]');
    const photo = q<HTMLElement>('[data-ch="photo"]');
    const curtainL = q<HTMLElement>('[data-ch="curtain-l"]');
    const curtainR = q<HTMLElement>('[data-ch="curtain-r"]');
    const anthem = q<HTMLElement>("[data-wipe]");
    const mark = q<HTMLElement>('[data-ch="mark"]');
    const missionTitle = q<HTMLElement>('[data-beat="mission"] h2');
    const missionLede = q<HTMLElement>('[data-beat="mission"] .t-lede');
    const steps = [...root.querySelectorAll<HTMLElement>("[data-step]")];
    const ownStage = q<HTMLElement>('[data-ch="own-stage"]');
    const arts = [...ownStage.querySelectorAll<HTMLElement>("[data-art]")];
    const tag = (k: string) => q<HTMLElement>(`[data-tag="${k}"]`);
    const on = (el: Element, attr: string, v: boolean) => el.toggleAttribute(attr, v);
    const sub = (t: number, a: number, b: number) => gsap.utils.clamp(0, 1, gsap.utils.mapRange(a, b, 0, 1, t));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const ease = gsap.parseEase("power3.out");
    // Scrubbed curtains move evenly through their range (an ease-out front-loads the close-in: audit 2026-11-02)
    const easeIO = gsap.parseEase("power1.inOut");

    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      const prog = { claim: 0, clip: 0, fade: 0, glide: 0, anthem: 0, mission: 0, own: 0 };
      let current = -2;
      // The mission's arrival (D28, after Tempo's rail diagrams): once the hairlines have met, one green packet runs
      // in along a single hairline, its short trail retracting behind it, and lands on the point with a ring that grows
      // and fades. Plays once per pass (re-armed when the reader scrolls back above the pinch), then holds still.
      const arrive = { t: 0, ring: 0, fired: false };
      // One thread, carried beat to beat (D19). It only moves sideways between beats, never across copy:
      // A (claim → anthem): hangs in the photo, glides left to land beside the N mark, then draws down beside the
      // statement and rises away with it. M (mission): drops in at page centre above the heading once A has left the
      // screen; hairlines from both edges pinch to one green point between the heading and the lede. O (own): drops in
      // on the right once M has left, through the drawings and on into the Stack. One line on screen at a time.
      type Geo = { W: number; H: number; Xc: number; Xa: number; Xo: number; y: Record<string, number>; threadA: SVGPathElement; headA: SVGCircleElement; threadM: SVGPathElement; headM: SVGCircleElement; fans: SVGPathElement[]; pinch: SVGCircleElement; trail: SVGPathElement; packet: SVGCircleElement; ring: SVGCircleElement; threadO: SVGPathElement; headO: SVGCircleElement; end: SVGPathElement };
      let G: Geo | null = null;

      const el = <K extends keyof SVGElementTagNameMap>(name: K, attrs: Record<string, string | number>) => {
        const n = document.createElementNS(NS, name);
        for (const k in attrs) n.setAttribute(k, String(attrs[k]));
        svg.appendChild(n);
        return n;
      };

      function setStep(step: number, instant = false) {
        if (step === current || !G) return;
        const d = instant ? 0 : 0.6;
        steps.forEach((li, k) => {
          const isOn = k === step, past = k < step;
          gsap.to(li.querySelector("[data-word]"), { yPercent: isOn ? 0 : past ? -115 : 115, duration: d, ease: "power3.out", overwrite: true });
          gsap.to(li.querySelector("[data-line]"), { autoAlpha: isOn ? 1 : 0, y: isOn ? 0 : 8, duration: instant ? 0 : 0.32, delay: isOn && !instant ? 0.16 : 0, ease: "power2.out", overwrite: true });
        });
        // One drawing at a time: the outgoing one fades as the next arrives and plays its one move
        arts.forEach((a, k) => {
          on(a, "data-on", k === step);
          if (k === step && !instant) { a.removeAttribute("data-play"); void a.getBoundingClientRect(); a.setAttribute("data-play", ""); }
          if (k !== step) a.removeAttribute("data-play");
        });
        current = step;
      }

      function build() {
        const W = svg.clientWidth, H = svg.clientHeight;
        if (!W || !H) return;
        // The page container's inner edge, measured from a beat's resolved padding (margin + any space beyond 1440).
        const pad = parseFloat(getComputedStyle(q('[data-beat="claim"]')).paddingLeft) || 32;
        const R = W - pad, svgLeft = svg.getBoundingClientRect().left;
        // Claim: in the foliage, right of the copy. Anthem: just left of the N mark (the mark is never drawn over). Own:
        // centred in the free zone right of the copy (640 px column).
        const Xc = Math.min(R - 48, Math.max(pad + 700, W * 0.8));
        const m = mark.getBoundingClientRect();
        const Xa = m.left - 16 - svgLeft;
        const Xo = (Math.max(W * 0.5, pad + 640) + R) / 2;
        const y = { headStart: H * 0.18, headHero: H * 0.5, railBot: H * 0.66 };
        svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
        // Curtains meet exactly at the line (no 1 px seam of photo either side); widths only change on rebuild
        curtainL.style.width = `${Xc}px`;
        curtainR.style.width = `${W - Xc}px`;
        svg.replaceChildren();
        const dash = { pathLength: 1, "stroke-dasharray": 1, "stroke-dashoffset": 1 };
        const fans = Array.from({ length: 16 }, () => el("path", { class: "rail", ...dash }));
        const pinch = el("circle", { class: "dot", r: 6, opacity: 0 });
        const trail = el("path", { class: "trail", pathLength: 1, opacity: 0 });
        const packet = el("circle", { class: "dot", r: 3.5, opacity: 0 });
        const ring = el("circle", { class: "ring", r: 6, opacity: 0 });
        const threadA = el("path", { class: "thread" }), headA = el("circle", { class: "dot", r: 5 });
        const threadM = el("path", { class: "thread" }), headM = el("circle", { class: "dot", r: 5, opacity: 0 });
        const threadO = el("path", { class: "thread" }), headO = el("circle", { class: "dot", r: 5, opacity: 0 });
        // Each word's drawing hangs on the thread, as large as the free zone allows (up to 440 px), and the thread
        // carries on down to where the Stack picks up: the x of the Stack drawing's own thread, or the page centre.
        const ow = Math.min(440, 2 * (R - Xo) + 48);
        ownStage.style.setProperty("--own-w", `${ow}px`);
        ownStage.style.setProperty("--own-x", `${Xo - ow / 2}px`);
        ownStage.style.setProperty("--own-y", `${H / 2 - ow * 0.375}px`);
        const handoff = document.querySelector<SVGGraphicsElement>("[data-stack] [data-thread] line")?.getBoundingClientRect();
        const EX = handoff && handoff.width + handoff.height > 0 ? handoff.left + handoff.width / 2 - svgLeft : W / 2;
        const end = el("path", { class: "strand", ...dash, d: `M${Xo} ${y.railBot} C${Xo} ${y.railBot + 80} ${EX} ${H - 90} ${EX} ${H}` });
        tag("ai").style.left = `${pad}px`;
        tag("chain").style.right = `${W - R}px`;
        G = { W, H, Xc, Xa, Xo, y, threadA, headA, threadM, headM, fans, pinch, trail, packet, ring, threadO, headO, end };
        const was = current; current = -2;
        setStep(Math.max(was, -1), true);
        render();
      }

      // A vertical thread from the top edge, hidden when it has no length
      const line = (p: SVGPathElement, dot: SVGCircleElement | null, x: number, h: number, show = 1) => {
        const v = Math.max(0, h);
        p.setAttribute("d", v > 0 ? `M${x} 0 V${v}` : "");
        if (dot) { dot.setAttribute("cx", String(x)); dot.setAttribute("cy", String(v)); dot.setAttribute("opacity", String(v > 6 ? show : 0)); }
      };

      function render() {
        if (!G) return;
        const { W, y } = G, top = svg.getBoundingClientRect().top;
        const own = prog.own;
        // Claim: the line drops down the dark side of the photograph, which then closes in on it (curtains: transform only)
        const c = easeIO(prog.clip);
        curtainL.style.transform = curtainR.style.transform = `scaleX(${c})`;
        photo.style.opacity = String(1 - prog.fade);
        // Anthem: once the photo has gone, the line glides left and lands on the N mark as the statement arrives (its head
        // always above the mark, so it never crosses the copy); while the statement wipes on, it draws down beside it
        // (never frozen), and it rises away with the statement when the anthem scrolls on.
        const g = ease(prog.glide);
        const markTop = mark.getBoundingClientRect().top - top + 2, textEnd = anthem.getBoundingClientRect().bottom - top;
        let hA = lerp(y.headStart, y.headHero, ease(prog.claim));
        hA = lerp(hA, markTop, g);
        hA = lerp(hA, textEnd, prog.anthem);
        line(G.threadA, G.headA, lerp(G.Xc, G.Xa, g), hA);
        // Mission: centred. Once the anthem has gone under the header, the line drops in at page centre and hangs above
        // the heading; hairlines from both edges pinch to one green point between the heading and the lede. All of it
        // moves with the copy.
        const m = prog.mission;
        const h2 = missionTitle.getBoundingClientRect(), lede = missionLede.getBoundingClientRect();
        const enter = ease(sub(-textEnd, -60, 240)); // once the anthem line is fully under the header, over 300 px
        const hM = h2.top - top - 32;
        line(G.threadM, G.headM, W / 2, lerp(0, hM, enter), enter);
        const P = { x: W / 2, y: (h2.bottom + lede.top) / 2 - top };
        // The fan's spread: as wide as clears the heading's edge by 16 px (the curves close in towards the point)
        const gap = (lede.top - h2.bottom) / 2 - 16, edge = h2.width / 2 + 8;
        const reach = (t: number) => (W / 2) * (1 - t) ** 3 + 3 * (1 - t) ** 2 * t * W * 0.28 + 3 * (1 - t) * t * t * W * 0.14;
        let lo = 0, hi = 1;
        for (let n = 0; n < 20; n++) { const mid = (lo + hi) / 2; if (reach(mid) > edge) lo = mid; else hi = mid; }
        const spread = Math.min(100, gap / Math.max(0.01, (1 - lo) ** 2 * (1 + 2 * lo)));
        const r = ease(sub(m, 0.05, 0.45));
        G.fans.forEach((f, k) => {
          const side = k < 8 ? -1 : 1, i = k % 8, off = -spread + (2 * spread * i) / 7, x0 = side < 0 ? 0 : W;
          f.setAttribute("d", `M${x0} ${P.y + off} C${P.x + side * W * 0.28} ${P.y + off} ${P.x + side * W * 0.14} ${P.y} ${P.x} ${P.y}`);
          f.setAttribute("stroke-dashoffset", String(1 - r));
        });
        G.pinch.setAttribute("cx", String(P.x)); G.pinch.setAttribute("cy", String(P.y));
        G.pinch.setAttribute("opacity", String(sub(m, 0.35, 0.45)));
        // The arrival: fired as the fans complete; re-armed (and cleared) once the reader is back above the full point.
        // Packet (1.2 s), then the ring (0.6 s) as it lands; all of it is only as visible as the point it lands on.
        const point = sub(m, 0.35, 0.45);
        if (m >= 0.45 && !arrive.fired) {
          arrive.fired = true;
          gsap.timeline({ onUpdate: render })
            .fromTo(arrive, { t: 0 }, { t: 1, duration: 1.2, ease: "power1.out" })
            .fromTo(arrive, { ring: 0 }, { ring: 1, duration: 0.6, ease: "power2.out" }, "-=0.34"); // from t ≈ 0.92
        } else if (m < 0.4 && arrive.fired) {
          arrive.fired = false;
          gsap.killTweensOf(arrive);
          arrive.t = arrive.ring = 0;
        }
        const lane = G.fans[ARRIVE_FAN], t = arrive.t, moving = t > 0 && t < 1;
        // The trail follows the packet and retracts into it as it lands
        const tail = Math.min(TRAIL, t, 1 - t);
        G.trail.setAttribute("d", lane.getAttribute("d")!);
        G.trail.setAttribute("stroke-dasharray", `${tail} 2`);
        G.trail.setAttribute("stroke-dashoffset", String(tail - t));
        G.trail.setAttribute("opacity", String(moving ? point : 0));
        const at = lane.getPointAtLength(t * lane.getTotalLength());
        G.packet.setAttribute("cx", String(at.x)); G.packet.setAttribute("cy", String(at.y));
        G.packet.setAttribute("opacity", String(moving ? point * Math.min(1, (1 - t) / 0.1) : 0));
        G.ring.setAttribute("cx", String(P.x)); G.ring.setAttribute("cy", String(P.y));
        G.ring.setAttribute("r", String(6 * (1 + 1.4 * arrive.ring))); // grows to 2.4× the point
        G.ring.setAttribute("opacity", String(arrive.ring > 0 && arrive.ring < 1 ? point * (1 - arrive.ring) : 0));
        // The two sides are named at the fans' outer ends, under them (not level with the heading, which says it)
        tag("ai").style.top = tag("chain").style.top = `${P.y + spread + 14}px`;
        on(tag("ai"), "data-on", m > 0.25 && own < 0.02);
        on(tag("chain"), "data-on", m > 0.3 && own < 0.02);
        // Own your …: the line drops in on the right, through the drawing; the step follows the smoothed progress and
        // crossing a threshold fires the roll. Even holds per word, Identity holding through the end (DESIGN §4: ≥1.5 s).
        // Own your: once the mission line has gone under the header, the line drops in on the right (with its head until
        // the first drawing arrives) and runs down through the drawings.
        const oe = ease(sub(-hM, -60, 240));
        const step = own < 0.06 ? -1 : own < 0.29 ? 0 : own < 0.53 ? 1 : own < 0.77 ? 2 : 3;
        line(G.threadO, G.headO, G.Xo, lerp(0, y.railBot, oe), step < 0 ? oe : 0);
        setStep(step);
        // The thread runs on through the drawings and down into the Stack, unbroken, from the first word
        G.end.setAttribute("stroke-dashoffset", String(1 - sub(own, 0.06, 0.2)));
      }

      gsap.set(steps.map((li) => li.querySelector("[data-word]")), { y: 0, yPercent: 115 });
      gsap.set(steps.map((li) => li.querySelector("[data-line]")), { autoAlpha: 0, y: 8 });
      build();

      // Progress trackers, top to bottom. Start/end mirror where each beat's copy sits.
      const track = (key: keyof typeof prog, trigger: string | Element, start: string, end: string) =>
        gsap.to(prog, { [key]: 1, ease: "none", onUpdate: render, scrollTrigger: { trigger, start, end, scrub: SCRUB, invalidateOnRefresh: true } });
      const beat = (b: string) => q(`[data-beat="${b}"]`);
      track("claim", beat("claim"), "top 35%", "bottom 35%");
      track("clip", root, "top -25%", "top -75%");   // the photo clears before the anthem copy reaches it
      track("fade", root, "top -70%", "top -95%");
      track("glide", root, "top -80%", "top -130%"); // the line moves to the N mark as the anthem arrives (pins at -140%)
      // Anthem wipe: while pinned, each character goes from 18% to full, left to right, with a short hold at the end.
      const chars = anthem.querySelectorAll("[aria-hidden] span span");
      gsap.timeline({ scrollTrigger: { trigger: beat("anthem"), start: "top top", end: "bottom bottom", scrub: SCRUB } })
        .fromTo(chars, { opacity: 0.18 }, { opacity: 1, ease: "none", duration: 0.3, stagger: 0.04 })
        .to({}, { duration: chars.length * 0.04 * 0.2 });
      track("anthem", beat("anthem"), "top top", "bottom bottom");
      track("mission", beat("mission"), "top 35%", "bottom 35%");
      track("own", beat("own"), "top 35%", "bottom bottom");
      // The hand-overs between beats follow the copy's live position, so redraw on every scroll, not only inside a
      // tracker's range (otherwise the anthem line froze between the anthem's end and the mission)
      ScrollTrigger.create({ trigger: root, start: "top top", end: "bottom bottom", onUpdate: render });

      ScrollTrigger.addEventListener("refreshInit", build);
      return () => ScrollTrigger.removeEventListener("refreshInit", build);
    });
    // Phones and tablets (D15): the static thread comes alive with the reader's own scroll. The green rule draws down
    // the chapter and each beat's dot scales in as its beat arrives. Transform only (CSS reads --rule and data-dot).
    mm.add("(max-width: 1279px) and (prefers-reduced-motion: no-preference)", () => {
      const beats = q<HTMLElement>('[data-ch="beats"]');
      beats.setAttribute("data-dots", "");
      gsap.fromTo(beats, { "--rule": 0 }, { "--rule": 1, ease: "none", scrollTrigger: { trigger: beats, start: "top 70%", end: "bottom 70%", scrub: SCRUB } });
      beats.querySelectorAll<HTMLElement>("[data-beat]").forEach((b) => ScrollTrigger.create({
        trigger: b, start: "top 55%",
        onEnter: () => b.setAttribute("data-dot", ""), onLeaveBack: () => b.removeAttribute("data-dot"),
      }));
      return () => { beats.removeAttribute("data-dots"); beats.querySelectorAll("[data-dot]").forEach((b) => b.removeAttribute("data-dot")); };
    });
    return () => mm.revert();
  }, { scope: anchor });

  return <span ref={anchor} hidden />;
}
