"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MOTION_EVENT, motionPaused } from "@/components/MotionToggle";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The hero's slow loop and parallax. The poster (next/image, preloaded) is the first paint and the LCP; the video
// fades in over it only once it's actually playing. It plays only when motion is allowed, the page toggle isn't
// paused and the photo is actually in view (on desktop: until the claim beat has scrolled past and the curtains
// close). Parallax moves the media wrapper (transform only, scrubbed with the user's scroll).
export function HeroMedia() {
  const video = useRef<HTMLVideoElement>(null);

  useGSAP(() => {
    const v = video.current;
    const media = v?.closest<HTMLElement>("[data-ch='media']");
    const root = v?.closest<HTMLElement>("[data-ch='root']");
    if (!v || !media || !root) return;

    const mm = gsap.matchMedia();
    mm.add({
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 1280px) and (prefers-reduced-motion: no-preference)",
    }, (ctx) => {
      const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
      if (!motion) return;

      let inView = false;
      const sync = () => { if (inView && !motionPaused()) v.play().catch(() => {}); else v.pause(); };
      const onPlaying = () => v.setAttribute("data-playing", "");
      v.addEventListener("playing", onPlaying);
      window.addEventListener(MOTION_EVENT, sync);

      if (desktop) {
        // Pinned stage: the photo drifts up and settles from a slight zoom while the claim scrolls; the loop runs
        // while the claim is on screen (the photo is gone once the anthem's curtains close).
        gsap.fromTo(media, { yPercent: 0, scale: 1.08 }, {
          yPercent: -5, scale: 1, ease: "none",
          scrollTrigger: { trigger: root.querySelector("[data-beat='claim']"), start: "top top", end: "bottom top", scrub: 0.6 },
        });
        ScrollTrigger.create({
          trigger: root.querySelector("[data-beat='claim']"), start: "top bottom", end: "bottom top",
          onToggle: (self) => { inView = self.isActive; sync(); },
        });
      } else {
        // Phones/tablets: the photo band moves slower than the page; the loop runs while the band is on screen.
        gsap.fromTo(media, { yPercent: -4, scale: 1.08 }, {
          yPercent: 4, ease: "none",
          scrollTrigger: { trigger: media.parentElement, start: "top bottom", end: "bottom top", scrub: true, onToggle: (self) => { inView = self.isActive; sync(); } },
        });
      }
      return () => { window.removeEventListener(MOTION_EVENT, sync); v.removeEventListener("playing", onPlaying); v.pause(); v.removeAttribute("data-playing"); };
    });
    return () => mm.revert();
  }, { scope: video });

  return (
    <video ref={video} className="hero-video" muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1}>
      <source src="/videos/home/home-hero-grasses-loop-v3-1280.mp4" type="video/mp4" media="(max-width: 767px)" />
      <source src="/videos/home/home-hero-grasses-loop-v3-2206.webm" type="video/webm" />
      <source src="/videos/home/home-hero-grasses-loop-v3-2206.mp4" type="video/mp4" />
    </video>
  );
}
