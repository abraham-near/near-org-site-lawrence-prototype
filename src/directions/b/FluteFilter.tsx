// True refraction for reeded glass, where the browser can do it: an SVG displacement filter used as a backdrop-filter
// (Chromium only; Safari and Firefox keep the CSS frost and rib shading). Noise that varies only across (y frequency
// ~0) makes narrow vertical bands; each band shifts what is behind it sideways by its own amount, the way the ribs of
// reeded glass bend the land behind them into steps. The green channel is pinned to neutral so nothing shifts
// vertically. Built from primitives only (no feImage, which the compositor drops in backdrop filters).
export function FluteFilter() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <filter id="b-flute" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="turbulence" baseFrequency="0.07 0.0001" numOctaves="1" seed="3" result="noise" />
        <feColorMatrix in="noise" type="matrix" values="1 0 0 0 0  0 0 0 0 0.5  0 0 0 0 0  0 0 0 0 1" result="map" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale="8" xChannelSelector="R" yChannelSelector="G" result="bent" />
        <feGaussianBlur in="bent" stdDeviation="0.6" />
      </filter>
    </svg>
  );
}
