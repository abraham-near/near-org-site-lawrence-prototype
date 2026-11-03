import gsap from "gsap";

// The answer arriving out of the meet line (D29), as part of a scrubbed timeline: "is where they connect." lifts away,
// NEAR slides to where it sits in "On NEAR, …", then "On" and the rest of the answer settle in around it. Fully
// reversible with the scroll. Distances are measured in layout pixels (offsetLeft ignores transforms), so the line can
// be scaled while it changes.
export function hideAnswer(root: Element) {
  gsap.set(root.querySelectorAll('[data-m="pre"], [data-m="near2"], [data-m="rest2"]'), { autoAlpha: 0 });
}

export function addMorph(tl: gsap.core.Timeline, root: Element, at: number, dur: number) {
  const m = (k: string) => root.querySelector<HTMLElement>(`[data-m="${k}"]`)!;
  const near1 = m("near1"), near2 = m("near2");
  const swap = at + dur * 0.62;
  tl.to(m("rest1"), { autoAlpha: 0, y: "-0.25em", duration: dur * 0.3, ease: "power1.in" }, at)
    .to(near1, { x: () => near2.offsetLeft - near1.offsetLeft, duration: dur * 0.42, ease: "power2.inOut" }, at + dur * 0.2)
    .set(near1, { autoAlpha: 0 }, swap)
    .set(near2, { autoAlpha: 1 }, swap)
    .fromTo([m("pre"), m("rest2")], { autoAlpha: 0, y: "0.25em" }, { autoAlpha: 1, y: 0, duration: dur * 0.34, stagger: dur * 0.04, ease: "power2.out" }, swap);
}
