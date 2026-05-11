# Prabhuram RVS — Portfolio Design

Editorial, architectural, and quietly cinematic. Bone-white paper, ink-black type, vermilion red as a single accent. Magazine-grade type, asymmetric grid, slow precise motion. Vanilla HTML5/CSS/JS, no frameworks, no build step.

## Audience & purpose

Hiring practices, recruiters, and clients evaluating Prabhuram as a UK-based architect / interior designer. Portfolio must read as professional, sophisticated, and original — not a template. The site supplements (does not replace) the printed portfolio book.

## Source material

68 portfolio spreads scraped from Behance gallery 132782843. Identified projects:

- Epilogue: An Atheist's Adieu — Iris Road Power Station, postgraduate thesis 2018
- Heron's Court — Cookham, Chesney + Last Architects, 2019
- Boatman's House (Dock East) — Isle of Dogs, Chesney + Last, 2019
- Memory Bank — Non-Architecture Competition, Community Award 2019
- Environmental Awareness Center — Inland Aqualife, Chennai, undergrad thesis 2014
- Squatters — Thiruparankundram flyover, 2016
- Landscape Residence — Madurai, 2013
- Proposed Facade Designs — Brazil, freelance 2017

Software: Adobe CS, SketchUp, AutoCAD, V-Ray, VectorWorks, Lumion 8.

## Design system

### Palette
- `--paper`: #f4f1ec (background)
- `--surface`: #ece8e0 (raised cards)
- `--ink`: #141414 (primary type)
- `--graphite`: #2d2d2d (secondary)
- `--concrete`: #8b8680 (muted)
- `--rule`: #1a1a1a at 12% (hairlines)
- `--vermilion`: #c0392b (accent — used sparingly)
- `--ochre`: #b8956a (rarely)

### Typography
- Display serif: **Cormorant Garamond** (700/300 italic) — masthead, project titles
- Body sans: **Inter** (300/400/500) — copy, nav, UI
- Mono: **JetBrains Mono** (400) — numerics, project indices, section nodes

Type scale (clamp): 12 / 14 / 16 / 20 / 28 / 40 / 64 / 96 / 144.

### Grid
12 column, 24px gutter, max width 1320px. Asymmetric editorial — text 5-cols, image 7-cols, etc. Generous whitespace.

### Motifs (the "architectural detail")
- Hairline rules (1px ink @ 12%) under every label
- Mono section nodes: `[ 01 ]  INTRODUCTION`, `[ 02 ]  ON THE DRAWING BOARD`
- Corner brackets (┌ ┐ └ ┘) revealed on image hover — drafting marks
- Crosshair "+" at major grid intersections (purely decorative SVG)
- Red dot status indicator next to "Available for collaborations"
- Vertical sticky page index, like a book's running header

### Motion
Discipline before flair. Everything sub-300ms with the same easing curve `cubic-bezier(.2,.7,.2,1)`. No bounces, no parallax loops.

- Page enter: blueprint grid revealing (one-shot, 600ms)
- Section reveal: opacity 0 → 1, translateY 16px → 0, stagger 60ms (IntersectionObserver)
- Image hover: corner brackets fade in, image desaturates 0 → 8%
- Link hover: red underline draws left → right
- Cursor: small ink dot + larger ring follower, ring snaps to interactive elements (desktop only)
- Nav: shrinks at scroll > 80px, active section highlighted

### Page architecture

```
[ Fixed top nav   |  Vertical section index left ]

00  HERO            full viewport, name in display serif, scroll cue
01  MANIFESTO       pull quote + bio paragraph, portrait + data column
02  SELECTED WORKS  4 flagship projects, alternating layout
03  ARCHIVE         grid of remaining projects, filter by Id/Ad/Ld/Fd
04  PROCESS         tools, methods, skills (visual lineup)
05  TIMELINE        education + experience, vertical with red rail
06  RECOGNITION     awards strip
07  CONTACT         large CTA + direct contact + form
   FOOTER
```

### Interactions
- IntersectionObserver scroll reveal
- Smooth scroll for anchor nav
- Lightbox modal: click any project image, opens full-bleed gallery of that project's spreads (uses real downloaded webp pages)
- Filter chips on archive section toggle Id/Ad/Ld/Fd categories
- Reduced-motion respects `prefers-reduced-motion`
- Custom cursor disabled on touch devices

### Files
- `index.html`
- `assets/css/main.css`
- `assets/js/main.js`
- `assets/img/p01.webp …  p68.webp` (already downloaded)
- `assets/img/portrait.webp` (extracted from p03 if available)

### Out of scope
- No backend / form submission (mailto only)
- No CMS
- No analytics
- No PWA / service worker
- No build step
