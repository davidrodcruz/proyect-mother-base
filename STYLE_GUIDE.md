# Visual Style Guide — Mother Base Portfolio

**Version:** 1.0.0  
**Last Updated:** June 14, 2026  
**Design Language:** MGS1 Codec Tactical Interface  
**Accessibility Target:** WCAG 2.1 AA (AAA where possible)

---

## 1. Design Philosophy

This style guide defines the visual language for David (Davo)'s SDET/BFF portfolio — a **tactical, industrial, cold** interface inspired by Metal Gear Solid's codec communication system. The design is **API First** in mentality: every visual element maps to a data structure, every interaction maps to an endpoint.

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Tactical Precision** | Every pixel serves a purpose. No decoration without function. |
| **Industrial Coldness** | Steel and circuitry, not warmth and comfort. |
| **API First** | Visual elements are UI representations of backend data. |
| **MGS1 Lore** | The codec IS the product. Design decisions reinforce the metaphor. |
| **$0 Ambition** | Prove that open-source tools rival paid solutions. |

---

## 2. Color System

### 2.1 Palette

| Token | Hex | RGB | Role | Usage |
|-------|-----|-----|------|-------|
| `base` | `#0B1111` | `11, 17, 17` | Page background | Dark void, CRT black |
| `section` | `#152A2D` | `21, 42, 45` | Section backgrounds, Level 2 containers | Main content areas |
| `card` | `#3F5C62` | `63, 92, 98` | Card backgrounds, highlighted modules | Project cards, feature blocks |
| `border` | `#548A90` | `84, 138, 144` | Fine separators, borders | Dividers, card borders, subtle lines |
| `accent` | `#93C6D0` | `147, 198, 208` | Primary accent, CTA buttons | Interactive elements, primary actions |
| `headline` | `#D1E2E4` | `209, 226, 228` | Headlines (H1, H2, H3), highlighted text | Titles, framework names, key text |
| `body` | `#9BB5A9` | `155, 181, 169` | Body text, short subtitles | Descriptions, paragraphs, content |
| `meta` | `#588E77` | `88, 142, 119` | Subtext, metadata, success states | Dates, technologies, secondary info |
| `danger` | `#FF0000` | `255, 0, 0` | Alert accent (MGS1 lore) | Errors, warnings, failed tests |

### 2.2 Color Application Rules

#### Backgrounds
```
Page Background:      #0B1111 (base)
Section Background:   #152A2D (section)
Card Background:      #3F5C62 (card)
```

#### Text
```
Headlines:            #D1E2E4 (headline)
Body Text:            #9BB5A9 (body)
Metadata/Subtext:     #588E77 (meta)
```

#### Borders & Separators
```
Fine Borders:         #548A90 (border)
Card Borders:         #548A90 at 50% opacity
Section Dividers:     #548A90 at 30% opacity
```

#### Interactive Elements
```
Primary CTA:          #93C6D0 (accent) background
Primary CTA Text:     #0B1111 (base) — dark text on light button
Primary CTA Hover:    #93C6D0 at 80% opacity
Secondary CTA:        transparent background, #93C6D0 border
Secondary CTA Text:   #93C6D0
Secondary CTA Hover:  #93C6D0 at 10% opacity background
```

#### States
```
Success:              #588E77 (meta)
Error/Warning:        #FF0000 (danger)
Info:                 #93C6D0 (accent)
Disabled:             #548A90 at 50% opacity
```

### 2.3 Contrast Ratios

| Foreground | Background | Ratio | WCAG Level |
|------------|------------|-------|------------|
| `#D1E2E4` | `#0B1111` | 14.8:1 | AAA |
| `#D1E2E4` | `#152A2D` | 11.2:1 | AAA |
| `#D1E2E4` | `#3F5C62` | 6.4:1 | AA |
| `#9BB5A9` | `#0B1111` | 9.1:1 | AAA |
| `#9BB5A9` | `#152A2D` | 6.8:1 | AA |
| `#9BB5A9` | `#3F5C62` | 3.9:1 | AA (large text) |
| `#93C6D0` | `#0B1111` | 10.2:1 | AAA |
| `#93C6D0` | `#152A2D` | 7.7:1 | AAA |
| `#93C6D0` | `#3F5C62` | 4.4:1 | AA |
| `#588E77` | `#0B1111` | 5.1:1 | AA |
| `#588E77` | `#152A2D` | 3.8:1 | AA (large text) |

---

## 3. Typography

### 3.1 Font Family

**Primary:** Share Tech Mono  
**Fallback:** monospace

```
font-family: 'Share Tech Mono', monospace;
```

**Justification:** Monospace-first because this IS a technical product. Physical object reference: 1970s terminal manual. Not a "tech aesthetic" choice — it's the correct tool for a terminal-inspired interface.

### 3.2 Type Scale

#### Desktop (≥768px)

| Element | Size | Weight | Line Height | Letter Spacing | Color | Transform |
|---------|------|--------|-------------|----------------|-------|-----------|
| H1 | `clamp(2.5rem, 5vw, 4rem)` | 700 | 1.1 | 0.02em | `#D1E2E4` | uppercase |
| H2 | `clamp(1.75rem, 3vw, 2.5rem)` | 700 | 1.2 | 0.02em | `#D1E2E4` | uppercase |
| H3 | `clamp(1.25rem, 2vw, 1.75rem)` | 700 | 1.3 | 0.01em | `#D1E2E4` | none |
| Body | `1rem` | 400 | 1.6 | 0 | `#9BB5A9` | none |
| Body Large | `1.125rem` | 400 | 1.6 | 0 | `#9BB5A9` | none |
| Caption | `0.875rem` | 400 | 1.5 | 0 | `#588E77` | none |
| Label | `0.75rem` | 400 | 1.4 | 0.1em | `#588E77` | uppercase |
| Code | `0.875rem` | 400 | 1.5 | 0 | `#93C6D0` | none |

#### Mobile (<768px)

| Element | Size | Weight | Line Height | Letter Spacing | Color | Transform |
|---------|------|--------|-------------|----------------|-------|-----------|
| H1 | `2rem` | 700 | 1.1 | 0.02em | `#D1E2E4` | uppercase |
| H2 | `1.5rem` | 700 | 1.2 | 0.02em | `#D1E2E4` | uppercase |
| H3 | `1.25rem` | 700 | 1.3 | 0.01em | `#D1E2E4` | none |
| Body | `0.9375rem` | 400 | 1.6 | 0 | `#9BB5A9` | none |
| Caption | `0.8125rem` | 400 | 1.5 | 0 | `#588E77` | none |
| Label | `0.6875rem` | 400 | 1.4 | 0.1em | `#588E77` | uppercase |

### 3.3 Typography Rules

1. **Headlines:** Always `#D1E2E4`. Large, legible, high contrast on dark backgrounds.
2. **Body:** Always `#9BB5A9`. Softer than cyan to avoid eye fatigue, but still highly legible.
3. **Metadata:** Always `#588E77`. Darker, desaturated green for secondary/technical information.
4. **Never use all-caps for body copy.** Reserve uppercase for headlines and labels only.
5. **Line height:** 1.6 for body (light on dark needs more breathing room), 1.1-1.2 for headings.

---

## 4. Spacing System

### 4.1 Base Unit

**8px grid system.** All spacing values are multiples of 8px.

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | `4px` | Tight spacing (icon margins, inline elements) |
| `space-2` | `8px` | Small spacing (between related elements) |
| `space-3` | `12px` | Medium-small spacing |
| `space-4` | `16px` | Standard spacing (card padding, gaps) |
| `space-5` | `20px` | Medium spacing |
| `space-6` | `24px` | Large spacing (section padding) |
| `space-8` | `32px` | Extra-large spacing |
| `space-10` | `40px` | Section gaps |
| `space-12` | `48px` | Major section spacing |
| `space-16` | `64px` | Hero section padding |
| `space-20` | `80px` | Page-level vertical spacing |
| `space-24` | `96px` | Maximum spacing |

### 4.2 Spacing Rules

- **Card padding:** `24px` (space-6) on desktop, `16px` (space-4) on mobile
- **Section padding:** `96px` (space-24) vertical on desktop, `64px` (space-16) on mobile
- **Component gaps:** `16px` (space-4) between related elements
- **Grid gaps:** `24px` (space-6) on desktop, `16px` (space-4) on mobile

---

## 5. Layout System

### 5.1 Grid

**Desktop:** 12-column grid with `24px` gutters  
**Mobile:** 4-column grid with `16px` gutters

```
Max width: 1200px (centered)
Breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1023px
  - Desktop: ≥ 1024px
```

### 5.2 Layout Patterns

#### Single-Page Scroll (Landing)
```
┌─────────────────────────────────────┐
│ Hero (min-h-screen)                 │
├─────────────────────────────────────┤
│ Projects (min-h-screen)             │
├─────────────────────────────────────┤
│ Skills (auto)                       │
├─────────────────────────────────────┤
│ Experience (auto)                   │
├─────────────────────────────────────┤
│ About (auto)                        │
├─────────────────────────────────────┤
│ Contact (auto)                      │
└─────────────────────────────────────┘
```

#### Detail Page (Projects/[id])
```
┌─────────────────────────────────────┐
│ Header (fixed)                      │
├─────────────────────────────────────┤
│ Back Link                           │
│ Title + Subtitle                    │
│ Status Badge                        │
│ Description                         │
│ Tech Stack                          │
│ Features Grid                       │
│ Architecture                        │
│ Stats                               │
│ Action Buttons                      │
├─────────────────────────────────────┤
│ Footer                              │
└─────────────────────────────────────┘
```

### 5.3 Responsive Behavior

| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Project Cards | 2 columns | 2 columns | 1 column |
| Skill Categories | 3 columns | 2 columns | 1 column |
| Feature Grid | 2 columns | 2 columns | 1 column |
| Stats Grid | 3 columns | 3 columns | 3 columns |
| Contact Layout | 2 columns | 1 column | 1 column |
| Header Nav | Horizontal | Horizontal | Hamburger |

---

## 6. Components

### 6.1 Buttons

#### Primary Button
```
Background:     #93C6D0
Text:           #0B1111 (dark on light)
Border:         none
Padding:        12px 24px (desktop), 10px 20px (mobile)
Border Radius:  6px
Font:           Share Tech Mono, 0.875rem, uppercase, 0.1em letter-spacing
Hover:          background #93C6D0 at 80%, shadow 0 0 15px rgba(147,198,208,0.3)
Active:         background #93C6D0 at 90%
```

#### Secondary Button
```
Background:     transparent
Text:           #93C6D0
Border:         2px solid #93C6D0
Padding:        12px 24px (desktop), 10px 20px (mobile)
Border Radius:  6px
Font:           Share Tech Mono, 0.875rem, uppercase, 0.1em letter-spacing
Hover:          background rgba(147,198,208,0.1), shadow 0 0 10px rgba(147,198,208,0.2)
Active:         background rgba(147,198,208,0.15)
```

#### Ghost Button
```
Background:     transparent
Text:           #93C6D0
Border:         none
Padding:        8px 16px
Font:           Share Tech Mono, 0.75rem, uppercase, 0.1em letter-spacing
Hover:          text #D1E2E4
```

### 6.2 Cards

#### Project Card
```
Background:     #3F5C62
Border:         1px solid #548A90
Padding:        24px
Border Radius:  8px
Shadow:         none (default)
Hover:          shadow 0 0 20px rgba(147,198,208,0.2), border-color #93C6D0

Title:          #D1E2E4, 1.25rem, bold
Subtitle:       #588E77, 0.875rem
Description:    #9BB5A9, 0.9375rem
Stats:          #93C6D0, 1.5rem, bold
Stats Label:    #588E77, 0.6875rem, uppercase
```

#### Skill Category Card
```
Background:     #3F5C62
Border:         1px solid #548A90
Padding:        20px
Border Radius:  8px

Title:          #D1E2E4, 1rem, bold
Chips:          inline-flex, background #152A2D, border 1px solid #548A90
```

#### Feature Card
```
Background:     #152A2D
Border:         1px solid #548A90
Padding:        16px
Border Radius:  6px

Title:          #D1E2E4, 1rem, semibold
Description:    #9BB5A9, 0.875rem
```

### 6.3 Badges

#### Technology Badge
```
Background:     transparent
Border:         1px solid #548A90
Text:           #9BB5A9
Padding:        4px 10px
Border Radius:  4px
Font:           0.75rem, uppercase, 0.05em letter-spacing
```

#### Status Badge (Success)
```
Background:     rgba(88,142,119,0.2)
Border:         1px solid #588E77
Text:           #588E77
```

#### Status Badge (Error)
```
Background:     rgba(255,0,0,0.2)
Border:         1px solid #FF0000
Text:           #FF0000
```

### 6.4 Timeline

```
Line Color:     #548A90
Line Width:     2px
Dot Color:      #93C6D0
Dot Size:       12px
Dot Shadow:     0 0 10px rgba(147,198,208,0.5)

Entry Background: #3F5C62
Entry Border:     1px solid #548A90
Entry Padding:    24px

Role:           #D1E2E4, 1.125rem, bold
Company:        #9BB5A9, 0.9375rem
Period:         #588E77, 0.75rem, uppercase
```

### 6.5 Header

```
Background:     #0B1111 at 90% opacity
Backdrop Blur:  12px
Border Bottom:  1px solid rgba(84,138,144,0.2)
Height:         64px
Position:       fixed, top 0, full width, z-index 50

Logo:           #93C6D0, 1.25rem, bold
Nav Links:      #588E77, 0.875rem, uppercase, 0.1em letter-spacing
Nav Hover:      #93C6D0
Nav Active:     #93C6D0, with glow
```

### 6.6 Footer

```
Border Top:     1px solid rgba(84,138,144,0.2)
Background:     #0B1111 at 90% opacity
Padding:        48px 0

End Label:      #588E77, 0.75rem, uppercase, 0.2em letter-spacing
Logo:           #93C6D0, 1.25rem
Social Links:   #588E77, hover #93C6D0
Copyright:      #588E77 at 50%, 0.75rem
```

### 6.7 Form Elements

#### Input/Textarea
```
Background:     #152A2D
Border:         1px solid #548A90
Text:           #9BB5A9
Padding:        12px 16px
Border Radius:  6px

Focus:          border-color #93C6D0, shadow 0 0 10px rgba(147,198,208,0.1)
Placeholder:    #588E77
```

#### Label
```
Text:           #588E77
Font:           0.75rem, uppercase, 0.1em letter-spacing
Margin Bottom:  8px
```

---

## 7. Effects & Motion

### 7.1 CRT Effects

| Effect | Implementation | Performance |
|--------|----------------|-------------|
| Scanlines | `::after` pseudo-element, `repeating-linear-gradient` | GPU-accelerated |
| Phosphor Glow | `text-shadow` with teal colors | Minimal impact |
| Grid Pattern | `radial-gradient` background | Minimal impact |
| Section Divider | `linear-gradient` with border colors | Minimal impact |

### 7.2 Animations

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Glow Pulse | 2s | ease-in-out | Infinite |
| Hover Glow | 0.2s | ease-out | Hover |
| Page Load | 0.3s | ease-out | DOMContentLoaded |
| Scroll Reveal | 0.5s | ease-out | IntersectionObserver |

### 7.3 Reduced Motion

All animations respect `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Accessibility

### 8.1 Color Contrast

All text-background combinations meet WCAG AA standards:

- **Headlines:** 14.8:1 ratio (AAA)
- **Body text:** 9.1:1 ratio (AAA)
- **Accent/CTA:** 10.2:1 ratio (AAA)
- **Metadata:** 5.1:1 ratio (AA)

### 8.2 Keyboard Navigation

- All interactive elements are focusable
- Focus ring: `2px solid #93C6D0` with `2px` offset
- Skip-to-content link available
- Tab order follows visual flow

### 8.3 Screen Reader Support

- Semantic HTML throughout (headings, landmarks, ARIA labels)
- Meaningful alt text for all images
- `aria-label` on icon-only buttons
- Form inputs linked to labels

### 8.4 Motion Sensitivity

- All animations disabled when `prefers-reduced-motion: reduce` is active
- No auto-playing video or audio
- No flashing content (3 flashes or below threshold)

---

## 9. Component States

### 9.1 Button States

| State | Visual | Description |
|-------|--------|-------------|
| Default | #93C6D0 bg, #0B1111 text | Ready to interact |
| Hover | Slightly dimmed, glow shadow | Mouse over |
| Active/Pressed | More dimmed | Click in progress |
| Focus | 2px solid ring | Keyboard focused |
| Disabled | 50% opacity, no pointer events | Cannot interact |
| Loading | Spinner replaces text | Processing |

### 9.2 Card States

| State | Visual | Description |
|-------|--------|-------------|
| Default | #3F5C62 bg, #548A90 border | Resting state |
| Hover | Glow shadow, border highlights | Mouse over |
| Focus | Border #93C6D0 | Keyboard focused |
| Active | Background slightly changes | Click in progress |

### 9.3 Link States

| State | Visual | Description |
|-------|--------|-------------|
| Default | #93C6D0 text | Not visited |
| Hover | #D1E2E4 text, underline | Mouse over |
| Visited | #93C6D0 text | Previously visited |
| Focus | 2px solid ring | Keyboard focused |

---

## 10. Responsive Breakpoints

| Breakpoint | Width | Columns | Gutter | Padding |
|------------|-------|---------|--------|---------|
| Mobile | < 640px | 4 | 16px | 16px |
| Tablet | 640px - 1023px | 8 | 24px | 24px |
| Desktop | ≥ 1024px | 12 | 24px | 32px |

### 10.1 Mobile-First Approach

All styles are written mobile-first. Desktop styles use `@media (min-width: ...)`.

```css
/* Mobile default */
.card { padding: 16px; }

/* Tablet and up */
@media (min-width: 640px) {
  .card { padding: 20px; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .card { padding: 24px; }
}
```

---

## 11. Iconography

### 11.1 Icon Style

- **Stroke width:** 1.5px
- **Color:** Inherits from parent (currentColor)
- **Size:** 20px default, 24px for standalone, 16px for inline

### 11.2 Icon Usage

| Context | Size | Color |
|---------|------|-------|
| Navigation | 20px | Current nav color |
| Button icon | 16px | Button text color |
| Social links | 20px | #588E77, hover #93C6D0 |
| Status indicator | 12px | Status color |

---

## 12. Data Visualization

### 12.1 Stats Display

```
Value:      #93C6D0, 2rem, bold
Label:      #588E77, 0.75rem, uppercase
Container:  #152A2D, border 1px solid #548A90
```

### 12.2 Skill Level Bars

```
Bar Background:  #152A2D
Bar Fill:        #93C6D0 (expert), #588E77 (advanced), #548A90 (intermediate)
Bar Height:      12px
Bar Width:       4px
```

### 12.3 Timeline Indicators

```
Active:     #93C6D0 with glow
Past:       #548A90
Future:     #548A90 at 50% opacity
```

---

## 13. Print Styles

```css
@media print {
  body { background: white; color: black; }
  .crt-overlay, .crt-scanline-bar { display: none; }
  a { color: black; text-decoration: underline; }
  .no-print { display: none; }
}
```

---

## 14. Implementation Checklist

- [ ] Tailwind config updated with all color tokens
- [ ] CSS variables defined in global.css
- [ ] All components use semantic color tokens
- [ ] Contrast ratios verified for all text/background pairs
- [ ] Keyboard navigation tested
- [ ] Screen reader testing completed
- [ ] Reduced motion tested
- [ ] Print styles implemented
- [ ] Responsive breakpoints tested on real devices
- [ ] Dark mode only (no light mode toggle needed)

---

## Appendix A: Color Palette Visual Reference

```
┌─────────────────────────────────────────────────────────────┐
│ #0B1111  ██████████████████████████████████████████████████ │
│ #152A2D  ██████████████████████████████████████████████████ │
│ #3F5C62  ██████████████████████████████████████████████████ │
│ #548A90  ██████████████████████████████████████████████████ │
│ #93C6D0  ██████████████████████████████████████████████████ │
│ #D1E2E4  ██████████████████████████████████████████████████ │
│ #9BB5A9  ██████████████████████████████████████████████████ │
│ #588E77  ██████████████████████████████████████████████████ │
│ #FF0000  ██████████████████████████████████████████████████ │
└─────────────────────────────────────────────────────────────┘
```

---

## Appendix B: Tailwind Configuration Reference

```javascript
colors: {
  base: '#0B1111',
  section: '#152A2D',
  card: '#3F5C62',
  border: '#548A90',
  accent: {
    DEFAULT: '#93C6D0',
    light: '#A8D4DC',
    dark: '#7BB8C4',
  },
  headline: '#D1E2E4',
  body: '#9BB5A9',
  meta: '#588E77',
  danger: '#FF0000',
}
```
