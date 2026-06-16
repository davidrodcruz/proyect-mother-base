# Design

## Visual System

**Aesthetic lane:** Military terminal / MGS1 Codec interface — a literal terminal, not a metaphorical one. The physical reference is a 1990s military communication device: teal on black, scanlines, waveform readouts, HUD-style grid overlays.

## Color Strategy

**Drenched** — teal carries the entire brand. CRT black is the void. Amber is the warning accent. No neutrals hedging around the edges.

| Token | Hex | Role |
|-------|-----|------|
| `base` | `#0B1111` | CRT black — page void |
| `section` | `#152A2D` | Section backgrounds, Level 2 containers |
| `card` | `#3F5C62` | Card backgrounds, highlighted modules |
| `border` | `#548A90` | Fine separators, borders |
| `accent` | `#93C6D0` | Primary accent, CTA buttons |
| `headline` | `#D1E2E4` | Headlines (H1, H2, H3), highlighted text |
| `body` | `#9BB5A9` | Body text, short subtitles |
| `meta` | `#588E77` | Subtext, metadata, success states |
| `danger` | `#FF0000` | Alert accent (MGS1 lore) |

## Typography

**Font:** Share Tech Mono (Google Fonts) — monospace-first, justified because this IS a technical product. Physical object reference: 1970s terminal manual. Single family with weight contrast (400 body, 700 headings via size/weight).

| Element | Size | Weight | Transform |
|---------|------|--------|-----------|
| Hero title | `clamp(2.5rem, 5vw, 4rem)` | 700 | uppercase |
| Section heading | `clamp(1.75rem, 3vw, 2.5rem)` | 700 | uppercase |
| Card title | `1.25rem` | 700 | none |
| Body text | `1rem` | 400 | none |
| Label/meta | `0.75rem` | 400 | uppercase, letter-spacing 0.1em |
| Code/tech | `0.875rem` | 400 | none |

Line-height: 1.6 for body (light on dark needs more breathing room), 1.1-1.2 for headings.

## Layout

- **Single-page scroll** for the landing page: Hero → Projects → Skills → Experience → About → Contact
- **Detail pages** for individual frameworks: `/projects/[id]`
- Full-viewport sections with `min-h-screen` and vertical centering
- Fluid spacing with `clamp()` that breathes on larger viewports
- Responsive: single-column mobile, 2-column tablet, 3-column desktop for grids
- Cards use `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`

## CRT Effects

| Effect | Implementation |
|--------|----------------|
| Scanlines | `::after` pseudo-element with `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)` |
| Phosphor glow | `text-shadow: 0 0 5px #93C6D0, 0 0 10px #93C6D0, 0 0 20px #93C6D0` |
| CRT curvature | Subtle `border-radius` + `box-shadow: inset 0 0 50px rgba(0,0,0,0.5)` |
| Grid pattern | `background-image: radial-gradient(circle, rgba(147,198,208,0.08) 1px, transparent 1px)` |
| Waveform | CSS `@keyframes` animating border/dash patterns |
| Channel static | Brief `opacity` + `filter: brightness()` flicker for page transitions |

## Motion

- **Page load:** Subtle CRT flicker (0.3s), then settle
- **Scroll:** Sections reveal with fade-in-up (0.5s, ease-out)
- **Page transitions:** Channel-change effect (static/glitch, 0.2s)
- **Hover:** Glow intensify + scanline flicker on interactive elements
- **Reduced motion:** All animations disabled via `prefers-reduced-motion: reduce`

## Components

| Component | Style |
|-----------|-------|
| Cards | Card (#3F5C62) background, border (#548A90), hover glow with accent (#93C6D0) |
| Badges | Border (#548A90), text (meta #588E77 or accent #93C6D0) |
| Buttons | Primary: accent (#93C6D0) bg + base (#0B1111) text; Secondary: transparent + accent border |
| Skill chips | Section (#152A2D) bg, border (#548A90), level bars with accent/meta colors |
| Timeline | Vertical border line, accent dots, card backgrounds |
| Header | Fixed top, base bg + blur, border bottom |
| Footer | "END TRANSMISSION" style, minimal |

## Imagery

This is a text-and-type-driven design. No stock photography. Visual interest comes from:
- CRT effects (scanlines, glow, flicker)
- Waveform decorations (CSS/SVG)
- Grid patterns (HUD overlay)
- Typography contrast (size, weight, glow intensity)

The only "imagery" is the favicon (teal codec icon) and any future framework logos.
