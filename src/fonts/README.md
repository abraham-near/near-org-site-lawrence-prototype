# Fonts (not included)

The site uses licensed fonts that can't be redistributed in a public repository. To build locally, add these
WOFF2 files to this folder (names must match `src/styles/fonts.ts`):

- `PPNeueMontreal-Regular.woff2`, `PPNeueMontreal-Medium.woff2`, `PPNeueMontrealMono-Regular.woff2` ([Pangram Pangram](https://pangrampangram.com/products/neue-montreal))
- `KeplerStd-ItDisp.woff2`, `KeplerStd-Italic.woff2` (Adobe Kepler Std, Italic Display and Italic)

The production build subsets Montreal 400/500 and Mono to Latin (U+0000–00FF plus common punctuation).
