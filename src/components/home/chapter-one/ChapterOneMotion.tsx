"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Chapter 1 choreography (D8). The stage is pinned by CSS `position: sticky`; ScrollTrigger only measures.
// Scrubbed (0.6 s smoothing): the line, the photo closing in, the rails, the convergence and the anthem wipe.
// Discrete tweens at thresholds: the "Own your …" word roll and its strand. Runs only where CSS shows motion mode.
const MOTION = "(min-width: 1280px) and (prefers-reduced-motion: no-preference)";
const SCRUB = 0.6;
const WORDS = ["data", "assets", "intelligence", "identity"];
const NS = "http://www.w3.org/2000/svg";

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
    const steps = [...root.querySelectorAll<HTMLElement>("[data-step]")];
    const tag = (k: string) => q<HTMLElement>(`[data-tag="${k}"]`);
    const on = (el: Element, attr: string, v: boolean) => el.toggleAttribute(attr, v);
    const sub = (t: number, a: number, b: number) => gsap.utils.clamp(0, 1, gsap.utils.mapRange(a, b, 0, 1, t));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const ease = gsap.parseEase("power3.out");
    // Scrubbed curtains move evenly through their range (an ease-out front-loads the close-in: audit 2026-11-02)
    const easeIO = gsap.parseEase("power1.inOut");

    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      const prog = { claim: 0, clip: 0, fade: 0, anthem: 0, mission: 0, own: 0 };
      let current = -2;
      type Geo = { W: number; X: number; y: Record<string, number>; rails: SVGPathElement[]; thread: SVGPathElement; head: SVGCircleElement; joins: SVGCircleElement[]; fans: SVGPathElement[]; ends: SVGPathElement[]; nodes: SVGCircleElement[] };
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
        G.fans.forEach((f, k) => gsap.to(f, { attr: { "stroke-dashoffset": k <= step ? 0 : 1 }, duration: d, ease: "power3.out", overwrite: true }));
        G.nodes.forEach((n, k) => { gsap.to(n, { attr: { opacity: k <= step ? 1 : 0 }, duration: instant ? 0 : 0.3, delay: k === step && !instant ? 0.35 : 0, overwrite: true }); n.classList.toggle("lit", k <= step); });
        current = step;
      }

      function build() {
        const W = svg.clientWidth, H = svg.clientHeight;
        if (!W || !H) return;
        // The page container's inner edge, measured from a beat's resolved padding (margin + any space beyond 1440).
        const pad = parseFloat(getComputedStyle(q('[data-beat="claim"]')).paddingLeft) || 32;
        // Free zone, right of the copy: never closer than 32 px to the anthem's longest line.
        const mission = q('[data-beat="mission"] h2').getBoundingClientRect().right; // set one sentence per line (D15)
        const L = Math.max(W * 0.5, pad + 640, anthem.getBoundingClientRect().right + 32, mission + 32), R = W - pad;
        const X = (L + R) / 2;
        const y = { headStart: H * 0.18, headHero: H * 0.5, headAnthem: H * 0.58, railTop: H * 0.34, railBot: H * 0.66, node: H * 0.82 };
        svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
        // Curtains meet exactly at the line (no 1 px seam of photo either side); widths only change on rebuild
        curtainL.style.width = `${X}px`;
        curtainR.style.width = `${W - X}px`;
        svg.replaceChildren();
        const dash = { pathLength: 1, "stroke-dasharray": 1, "stroke-dashoffset": 1 };
        const rails = [y.railTop, y.railBot].map((ry) => el("path", { class: "rail", d: `M${L} ${ry} H${R}`, ...dash }));
        const thread = el("path", { class: "thread" });
        const head = el("circle", { class: "dot", r: 5 });
        const joins = [y.railTop, y.railBot].map((ry) => el("circle", { class: "dot", cx: X, cy: ry, r: 4, opacity: 0 }));
        // The anthem is off screen by the last beat, so the four nodes may use the whole free half of the stage.
        // Nodes keep their outer labels inside the right margin.
        const LN = Math.max(W * 0.5, pad + 700), RN = R - 90;
        const nodesX = [0, 1, 2, 3].map((k) => LN + (RN - LN) * (k + 0.5) / 4);
        // Each word draws its own strand to a node; at the end all four converge where the Stack picks up: the x of the
        // Stack drawing's own thread (D14 puts the drawing on the right), or the page centre if it isn't there.
        const handoff = document.querySelector<SVGGraphicsElement>("[data-stack] [data-thread] line")?.getBoundingClientRect();
        const EX = handoff && handoff.width + handoff.height > 0 ? handoff.left + handoff.width / 2 - svg.getBoundingClientRect().left : W / 2;
        const fans = nodesX.map((nx) => el("path", { class: "strand", ...dash, d: `M${X} ${y.railBot} C${X} ${y.railBot + 50} ${nx} ${y.node - 60} ${nx} ${y.node}` }));
        const ends = nodesX.map((nx) => el("path", { class: "strand", ...dash, d: `M${nx} ${y.node} C${nx} ${y.node + 60} ${EX} ${H - 70} ${EX} ${H}` }));
        const nodes = nodesX.map((nx) => el("circle", { class: "node", cx: nx, cy: y.node, r: 6, opacity: 0 }));
        const place = (k: string, x: number, yy: number) => { const t = tag(k); t.style.left = `${x}px`; t.style.top = `${yy}px`; };
        place("ai", L, y.railTop - 30);
        place("chain", L, y.railBot + 12);
        place("near", X + 16, (y.railTop + y.railBot) / 2 - 10);
        WORDS.forEach((k, n) => { place(k, nodesX[n] + (n < 2 ? -14 : 14), y.node - 10); on(tag(k), "data-left", n < 2); });
        G = { W, X, y, rails, thread, head, joins, fans, ends, nodes };
        const was = current; current = -2;
        setStep(Math.max(was, -1), true);
        render();
      }

      function render() {
        if (!G) return;
        const { X, y } = G;
        // Claim: the line drops down the dark side of the photograph.
        let headY = lerp(y.headStart, y.headHero, ease(prog.claim));
        // Anthem: while the copy wipes on, the line keeps drawing slowly downward (never frozen).
        headY = lerp(headY, y.headAnthem, prog.anthem);
        // Anthem: the photograph closes in on the line until only the line is left (curtains scale in: transform only).
        const c = easeIO(prog.clip);
        curtainL.style.transform = curtainR.style.transform = `scaleX(${c})`;
        photo.style.opacity = String(1 - prog.fade);
        // Mission: AI rail above, blockchain rail below; the line connects them.
        const m = prog.mission, own = prog.own;
        const r = ease(sub(m, 0.05, 0.5));
        headY = lerp(headY, y.railBot, ease(sub(m, 0.35, 0.8)));
        const railsOut = 1 - sub(own, 0.05, 0.25);
        G.rails.forEach((p) => { p.setAttribute("stroke-dashoffset", String(1 - r)); p.style.opacity = String(railsOut); });
        G.joins[0].setAttribute("opacity", String(sub(m, 0.4, 0.5) * railsOut));
        G.joins[1].setAttribute("opacity", String(sub(m, 0.75, 0.85) * railsOut));
        on(tag("ai"), "data-on", m > 0.3 && own < 0.15);
        on(tag("chain"), "data-on", m > 0.35 && own < 0.15);
        on(tag("near"), "data-on", m > 0.8 && own < 0.15);
        G.thread.setAttribute("d", `M${X} 0 V${headY}`);
        G.head.setAttribute("cx", String(X)); G.head.setAttribute("cy", String(headY));
        G.head.setAttribute("opacity", String(1 - sub(own, 0.05, 0.15)));
        // Own your …: the step follows the smoothed progress; crossing a threshold fires the roll.
        // Even holds per word (~430 px each at 1440×900), Identity holding through the converge (DESIGN §4: ≥1.5 s to read)
        const step = own < 0.02 ? -1 : own < 0.27 ? 0 : own < 0.52 ? 1 : own < 0.77 ? 2 : 3;
        setStep(step);
        WORDS.forEach((k, n) => { on(tag(k), "data-on", n <= step); on(tag(k), "data-now", n === step && own < 0.9); });
        // Converge: all four strands run down into the Stack.
        const conv = sub(own, 0.85, 1);
        G.ends.forEach((p) => p.setAttribute("stroke-dashoffset", String(1 - conv)));
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
      // Anthem wipe: while pinned, each character goes from 18% to full, left to right, with a short hold at the end.
      const chars = anthem.querySelectorAll("[aria-hidden] span span");
      gsap.timeline({ scrollTrigger: { trigger: beat("anthem"), start: "top top", end: "bottom bottom", scrub: SCRUB } })
        .fromTo(chars, { opacity: 0.18 }, { opacity: 1, ease: "none", duration: 0.3, stagger: 0.04 })
        .to({}, { duration: chars.length * 0.04 * 0.2 });
      track("anthem", beat("anthem"), "top top", "bottom bottom");
      track("mission", beat("mission"), "top 35%", "bottom 35%");
      track("own", beat("own"), "top 35%", "bottom bottom");
      // "Pause motion" fades out over the chapter's last 10 vh, so it never rides into the Stack (D15)
      gsap.to(q('[data-ch="toggle"]'), { autoAlpha: 0, ease: "none", scrollTrigger: { trigger: root, start: "bottom 110%", end: "bottom bottom", scrub: true } });

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
