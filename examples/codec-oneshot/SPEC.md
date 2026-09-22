# SPEC: Codec Portfolio — Astro One-Shot Build

> Executable instructions. This is not a guide: it is a contract. Produce
> exactly what is asked, with exactly the data given. Nothing more, nothing less.

---

## 1. ROLE

You are a **frontend and UI/UX design expert with a specialization in Astro**.
You master:

- Astro (`.astro` components, TypeScript frontmatter, layouts, props)
- Modern framework-free CSS (custom properties, `clamp()`, grid, pseudo-elements)
- Terminal / retro-CRT interface design (scanlines, phosphor glow, monospace typography)
- WCAG 2.1 AA accessibility (contrast, semantic HTML, `prefers-reduced-motion`)

Your job is to generate a complete, working Astro project in a single pass.

---

## 2. OBJECTIVE

Build the landing page (single-page scroll) of a personal portfolio with a
**MGS1 Codec / military terminal** aesthetic: CRT black background, teal accent,
scanlines, phosphor glow. The site must look like a 1990s military communication
device, not like a generic portfolio.

**Allowed stack (and only this):**
- Astro 4.x — no React, no Tailwind, no UI libraries
- Plain CSS (one global file + scoped styles per component)
- TypeScript for embedded data

**Forbidden:** BFF, server APIs, Docker, nginx, npm workspaces, monorepos,
Turborepo. Static frontend only.

---

## 2.5 EXECUTION PROTOCOL (mandatory — controls your reasoning)

**Do NOT think about the whole project at once. Work FILE BY FILE, in this
exact order. Your chain of thought must only contain the current file.**

Before writing each file, reason about ONLY three things:
1. What it receives (props/already-existing imports) and what it must contain per this spec.
2. Write the complete file, no placeholders.
3. One check line: "does it meet the spec section that applies to it?" then move to the next.

The order is:

```
1. package.json           → §3 (verbatim)
2. astro.config.mjs       → §3 (verbatim)
3. tsconfig.json          → §3 (verbatim)
4. public/favicon.svg     → §7
5. public/Dossier_and_background_no_bg.png → copy byte-for-byte, do not read or process
6. src/styles/global.css  → §5 + §6 (tokens + CRT effects)
7. src/data/content.ts    → §4 (verbatim, complete)
8. src/components/atoms/Button.astro → §7
9. src/components/atoms/Badge.astro  → §7
10. Header.astro   → §7
11. Hero.astro     → §7 (3-column split terminal)
12. Projects.astro → §7
13. Skills.astro   → §7
14. Experience.astro → §7
15. About.astro    → §7
16. Footer.astro   → §7
17. src/pages/index.astro → composes the above + <Layout> with Google Fonts
18. npm install
19. npx astro build → if it fails, fix ONLY the file the error points to and rebuild
```

Protocol rules:
- Do not pre-decide anything about future files while writing the current one.
- Do not rewrite an already-finished file unless the build flags it as an error.
- After a successful build, run the FINAL VERIFICATION PHASE: review the full
  checklist in §9 once against the generated files, declare each item `[x]` or
  `[ ]` with its evidence, and fix any failures found before declaring done.

---

## 3. DELIVERABLES AND ALLOWED COMMANDS

### Exact file structure

```
codec-portfolio/
├── package.json
├── astro.config.mjs
├── tsconfig.json
├── public/
│   ├── favicon.svg
│   └── Dossier_and_background_no_bg.png   ← copy this asset unmodified
└── src/
    ├── styles/global.css
    ├── data/content.ts
    ├── components/
    │   ├── Header.astro
    │   ├── Hero.astro
    │   ├── Projects.astro
    │   ├── Skills.astro
    │   ├── Experience.astro
    │   ├── About.astro
    │   ├── Footer.astro
    │   └── atoms/
    │       ├── Button.astro
    │       └── Badge.astro
    └── pages/
        └── index.astro
```

No additional files. No missing files.

### Minimum content of config files (use verbatim)

`package.json`:
```json
{
  "name": "codec-portfolio",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^4.16.0"
  }
}
```

`astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
export default defineConfig({});
```

`tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict"
}
```

### ALLOWED commands (run if necessary)

```bash
npm install          # install astro
npx astro dev        # dev server (verify it compiles)
npx astro build      # production build (final verification)
```

You are authorized to install dependencies (`npm install`) and run Astro
commands to verify the result. You are NOT authorized to: run `npm create
astro`, install packages other than `astro`, or initialize git.

### Mandatory verification before finishing

1. `npx astro build` completes without errors.
2. Open `dist/index.html` via `npx astro preview` and visually confirm:
   dark background, visible scanlines, monospace font loaded.

---

## 4. VERBATIM DATA

**Critical anti-hallucination rule:** All visible text on the page comes
EXCLUSIVELY from this block. Inventing, paraphrasing, translating, shortening
or adding content is forbidden. If a datum does not appear here, it does not exist.

This content goes into `src/data/content.ts`. Splitting it into multiple JSON
files or using fetch/dynamic imports is forbidden.

```typescript
// src/data/content.ts

export const profile = {
  name: "David Rodríguez de la Cruz",
  alias: "Davo",
  title: "Senior SDET | ISTQB® Certified",
  tagline: "Building Quality Architecture for Fintech at Scale",
  location: "Mexico City, Mexico (USMCA/CUSMA Eligible)",
  summary: "Senior SDET with 5+ years building and scaling quality engineering platforms, defining quality architecture standards, and scaling CI/CD pipelines for large-scale fintech microservices systems. Proven track record of eliminating production incidents through a 90% reduction in release cycle time and a 70% improvement in pre-production defect detection.",
  social: {
    github: "https://github.com/davidrodcruz",
    linkedin: "https://linkedin.com/in/davidrodcruz",
    email: "drc412@gmail.com",
  },
  work_status: "Mexican citizen eligible for USMCA/CUSMA TN Professional Work Permit (LMIA-exempt, no sponsorship required)",
};

export const navigation = [
  { label: "Home", path: "#home" },
  { label: "Projects", path: "#projects" },
  { label: "Skills", path: "#skills" },
  { label: "Experience", path: "#experience" },
  { label: "About", path: "#about" },
  { label: "Contact", path: "#contact" },
];

export const projects = [
  {
    id: "codec",
    name: "CODEC",
    subtitle: "Contract Validation Cycle",
    description: "Decode integration contracts between microservices. Ensure API compatibility across services.",
    color: "#10B981",
    technologies: ["Python", "Pact", "Behave", "JSON Schema"],
    stats: [
      { title: "CONSUMER", subtitle: "DRIVEN" },
      { title: "BREAKING", subtitle: "CHANGES" },
      { title: "PACT", subtitle: "INTEGRATION" },
    ],
  },
  {
    id: "foxhound",
    name: "FOXHOUND",
    subtitle: "API Testing Framework",
    description: "Hunt down API vulnerabilities with precision. A comprehensive API testing framework built with Python, Playwright, and Behave.",
    color: "#F59E0B",
    technologies: ["Python", "Playwright", "Behave", "Allure"],
    stats: [
      { title: "MODULAR", subtitle: "ARCHITECTURE" },
      { title: "MULTI", subtitle: "ENVIRONMENTS" },
      { title: "< 5 MIN", subtitle: "DEPLOY TIME" },
    ],
  },
  {
    id: "patriot",
    name: "PATRIOT",
    subtitle: "Web UI Testing Framework",
    description: "Protect web interfaces with automated UI testing. Built with Playwright for cross-browser compatibility.",
    color: "#8B5CF6",
    technologies: ["Python", "Playwright", "Behave", "Allure"],
    stats: [
      { title: "POM", subtitle: "PATTERN" },
      { title: "3+", subtitle: "BROWSERS" },
      { title: "VISUAL", subtitle: "REGRESSION" },
    ],
  },
  {
    id: "stinger",
    name: "STINGER",
    subtitle: "Mobile UI Testing Framework",
    description: "Sting mobile bugs before they reach production. Mobile testing automation with Appium and Playwright.",
    color: "#EF4444",
    technologies: ["Python", "Appium", "Playwright", "Behave"],
    stats: [
      { title: "iOS", subtitle: "+ ANDROID" },
      { title: "REAL", subtitle: "DEVICES" },
      { title: "GESTURE", subtitle: "SUPPORT" },
    ],
  },
];

export const skillCategories = [
  {
    name: "Quality Engineering",
    items: [
      { name: "Testing Trophy Model", level: "expert", years: 5 },
      { name: "Test Coverage Strategy", level: "expert", years: 5 },
      { name: "Testing Governance", level: "expert", years: 5 },
      { name: "Quality Architecture", level: "expert", years: 5 },
      { name: "Shift-Left Testing", level: "expert", years: 5 },
      { name: "Developer Enablement", level: "expert", years: 5 },
      { name: "PACT Contract Testing CDCT", level: "expert", years: 3 },
    ],
  },
  {
    name: "Programming Languages",
    items: [
      { name: "Python (Pytest, Behave, Requests)", level: "expert", years: 5 },
      { name: "SQL", level: "advanced", years: 5 },
      { name: "Bash Scripting", level: "intermediate", years: 5 },
      { name: "Java (Rest Assured)", level: "intermediate", years: 2 },
      { name: "Go", level: "beginner", years: 1 },
      { name: "C#", level: "beginner", years: 1 },
    ],
  },
  {
    name: "Testing Frameworks",
    items: [
      { name: "Pytest", level: "expert", years: 5 },
      { name: "Behave (BDD)", level: "expert", years: 5 },
      { name: "Playwright", level: "advanced", years: 3 },
      { name: "Selenium", level: "advanced", years: 3 },
      { name: "Appium", level: "advanced", years: 3 },
      { name: "API Testing", level: "expert", years: 5 },
      { name: "Integration Testing", level: "expert", years: 5 },
      { name: "Contract Testing", level: "expert", years: 3 },
      { name: "E2E Testing", level: "advanced", years: 5 },
      { name: "Risk-based Testing", level: "advanced", years: 5 },
    ],
  },
  {
    name: "CI/CD & DevOps",
    items: [
      { name: "GitHub Actions", level: "expert", years: 3 },
      { name: "Jenkins", level: "advanced", years: 3 },
      { name: "CI/CD Pipeline Design", level: "advanced", years: 5 },
      { name: "Artifact-based Reporting", level: "advanced", years: 3 },
    ],
  },
  {
    name: "Cloud & Infrastructure",
    items: [
      { name: "AWS (ECS, S3, SNS, IAM, CloudWatch)", level: "advanced", years: 3 },
      { name: "Docker", level: "advanced", years: 4 },
      { name: "Linux", level: "advanced", years: 5 },
    ],
  },
];

export const experience = [
  {
    company: "Stori",
    role: "Sr. SDET (Quality Architecture & Tooling)",
    period: "2025-01 — Present",
    location: "Mexico City, Mexico",
    highlights: [
      "Defined and executed the 'Testing Trophy' architectural standard, driving organizational shift from brittle E2E-heavy validation to scalable Unit → Integration/Contract → E2E testing models",
      "Architected an LLM-powered Agentic Platform using MCP-based agents to automate testing lifecycle across multi-language codebases (Go, Python, JS), driving autonomy across 43+ engineering squads",
      "Engineered enterprise-grade Contract Testing infrastructure (Pact Community) on AWS to map dependencies and replicate premium PactFlow features",
      "Built 360° Quality & Observability Platform integrating AI test generation, CI execution, and custom dashboard (SonarCloud/GitHub APIs) to monitor coverage trends across 1,300+ microservices",
    ],
    technologies: ["Python", "Go", "AWS ECS", "Pact", "LLM/MCP", "GitHub Actions"],
  },
  {
    company: "Stori",
    role: "Sr. Software QA Engineer",
    period: "2024-08 — 2025-01",
    location: "Mexico City, Mexico",
    highlights: [
      "Led backend test automation standardization initiative across 7+ engineering squads, establishing reusable BDD patterns and framework architecture",
      "Scaled AWS ECS distributed testing architecture (Python/Behave), reducing release cycles by 90%, improving defect detection by 70%, and catching 50%+ of bugs autonomously pre-code review",
      "Defined quality KPIs and automation coverage targets at team level, creating data-driven quality baselines",
    ],
    technologies: ["Python", "Behave", "AWS ECS", "BDD", "Jenkins"],
  },
  {
    company: "Stori",
    role: "Mid Software QA Engineer",
    period: "2023-01 — 2024-08",
    location: "Mexico City, Mexico",
    highlights: [
      "Implemented mobile test automation framework using Appium for Android and iOS applications",
      "Designed risk-based test strategies ensuring comprehensive coverage of business-critical and regulatory compliance scenarios",
    ],
    technologies: ["Appium", "Python", "iOS", "Android"],
  },
  {
    company: "Titanium Solutions",
    role: "Software QA Engineer (API Automation)",
    period: "2021-06 — 2022-01",
    location: "Aguascalientes, Mexico",
    highlights: [
      "Maintained and extended Java-based API automation framework (Rest Assured) for backend service validation",
      "Supported CI integration and regression test execution across microservices",
    ],
    technologies: ["Java", "Rest Assured", "API Testing", "Jenkins"],
  },
];
```

Fixed decorative UI texts (allowed because they are part of the design, not
data): `"FREQUENCY 140.85"` in the header, `"END TRANSMISSION"` in the footer,
the section headings `"// PROJECTS"`, `"// SKILLS"`, `"// EXPERIENCE"`,
`"// ABOUT"`, `"// CONTACT"`, and the hero dossier panel headings:
`"// Operator Dossier"`, `"> Profile_Summary"`, `"> Quick_Stats"`,
`"Eligibility"`, `"Codec Channel Active"` and `"WELCOME TO MOTHER BASE"`.
Nothing else outside the data.

**Asset:** The file `Dossier_and_background_no_bg.png` (2.2 MB, operator image
with transparent background) ships alongside this specification. Copy it to
`public/` UNMODIFIED. It is the only image on the site.

---

## 5. DESIGN TOKENS (verbatim)

Define in `src/styles/global.css` as custom properties:

| Token | Value |
|-------|-------|
| `--color-base` | `#0B1111` (page background) |
| `--color-section` | `#152A2D` (level-2 section backgrounds) |
| `--color-card` | `#3F5C62` (card backgrounds) |
| `--color-border` | `#548A90` (borders) |
| `--color-accent` | `#93C6D0` (CTAs, primary accents) |
| `--color-headline` | `#D1E2E4` (H1/H2/H3) |
| `--color-body` | `#9BB5A9` (body text) |
| `--color-meta` | `#588E77` (metadata, subtitles) |

**Font:** Share Tech Mono from Google Fonts (`<link>` in `<head>`), weight
400; hierarchy through size and uppercase, not extra weights.

| Element | Size |
|---------|------|
| H1 hero | `clamp(2.5rem, 5vw, 4rem)`, uppercase |
| H2 section | `clamp(1.75rem, 3vw, 2.5rem)`, uppercase |
| Card title | `1.25rem` |
| Body | `1rem`, line-height 1.6 |
| Labels/meta | `0.75rem`, uppercase, letter-spacing 0.1em |

**Layout:** single-page scroll with anchors. Sections `min-h-screen`,
vertically centered content, `max-width: 72rem` centered. Responsive grids:
`repeat(auto-fit, minmax(280px, 1fr))`.
One column mobile → 2 tablet → 3 desktop emerges from auto-fit (do not write
column media queries).

---

## 6. CRT EFFECTS (literal CSS recipes — copy them)

Scanlines (apply to `body::after`, `pointer-events: none`, high z-index):
```css
body::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 1px,
    rgba(0, 0, 0, 0.3) 1px,
    rgba(0, 0, 0, 0.3) 2px
  );
}
```

Phosphor glow (on H1/H2):
```css
h1, h2 {
  text-shadow: 0 0 5px rgba(147, 198, 208, 0.5), 0 0 10px rgba(147, 198, 208, 0.3);
}
```

CRT flicker on load (once, subtle):
```css
@keyframes crt-flicker {
  0% { opacity: 0.8; }
  20% { opacity: 0.9; }
  40% { opacity: 0.75; }
  60% { opacity: 1; }
  100% { opacity: 1; }
}
body { animation: crt-flicker 0.4s ease-out; }
```

Reveal on scroll (fade-in-up) using CSS only:
```css
section > * {
  animation: fade-up 0.5s ease-out both;
}
@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
```

Mandatory accessibility:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## 7. PAGE STRUCTURE (exact order)

### Header (fixed top)
`position: fixed`, base background with `backdrop-filter: blur()`, bottom
border `--color-border`. Left: `profile.alias` (Davo). Right: nav with the 6
`navigation` links. Below the alias in meta micro-text: `FREQUENCY 140.85`.

### Hero (`<section id="home">`) — 3-column Split Terminal
Vertically centered, min-h-screen. On desktop (≥1024px) the hero is one row of
3 columns at 50% / 25% / 25%; on mobile they stack vertically in the same
order. Below the row, centered CTA buttons.

**Left column (50%)** — terminal panel, vertically centered:
1. Meta line: `Codec Channel Active` (uppercase, letter-spacing 0.3em)
2. H1: `WELCOME TO MOTHER BASE` (uppercase, glow, wide tracking)
3. Body subtitle: `The place for DAVO frameworks`

**Center column (25%)** — `// Operator Dossier` panel: card with accent/40
border, base/80 background, header with pulsing accent dot + text
`// Operator Dossier`. Body with two blocks:
- `> Profile_Summary` (uppercase meta label): paragraph = `profile.summary`
- `> Quick_Stats` (uppercase meta label): 2x2 grid of stat cards
  (section background, border/30 border). EXACT content of the 4 stats:
  | value | label |
  |-------|-------|
  | `5+` | `Years` |
  | `43+` | `Squads` |
  | `1,300+` | `Microservices` |
  | `90%` | `Cycle Reduction` |
  Value in accent with glow, label in small uppercase meta.
- Final block with accent/40 border and accent/5 background: shield SVG icon +
  `Eligibility` label (accent), text = `profile.work_status`

**Right column (25%)** — operator portrait: card identical to the center one
(accent/40 border, base/80 background), centered content:
```html
<img src="/Dossier_and_background_no_bg.png"
     alt="Operator DAVO — System Architect"
     class="w-full h-full object-contain" loading="eager" />
```
object-contain preserves the PNG's transparent background over the dark card.

**Bottom row:** two side-by-side centered buttons (`mt-10`, gap 6):
- Primary: `VIEW PROJECTS` → internal link to `#projects` (accent bg, base text)
- Secondary: `CONTACT` → internal link to `#contact` (transparent, accent border)
And below, a scroll indicator: centered chevron-down SVG in meta color,
bounce animation (disabled with reduced motion).

### Projects (`<section id="projects">`)
H2 `// PROJECTS`. Grid auto-fit minmax(280px, 1fr). Each card:
- Background `--color-card`, border `--color-border`, hover with accent glow box-shadow
- Name (uppercase), subtitle in `project.color`
- Short description
- Technology badges (thin border, meta text, uppercase)
- Row of 3 stats: each stat is large title + small subtitle below

### Skills (`<section id="skills">`)
H2 `// SKILLS`. One card per category (`skillCategories`); inside, a list of
chips: name + level bar. Bar = container div with inner div whose width follows
the level: expert=100%, advanced=75%, intermediate=50%, beginner=25%.
Bar color: accent for expert, border-color for the rest.

### Experience (`<section id="experience">`)
H2 `// EXPERIENCE`. Vertical timeline: left line with
`border-left: 1px solid var(--color-border)`, accent dots per entry. Per entry:
`role` (headline), `company · period · location` (meta), bullets from
`highlights`, badges from `technologies`.

### About (`<section id="about">`)
H2 `// ABOUT`. Single paragraph: `profile.summary`. Below, meta lines:
years of experience are implicit in the summary (do NOT add data not provided).

### Footer / Contact (`<footer id="contact">`)
Title `// CONTACT`, links to GitHub, LinkedIn and email from `profile.social`
(open in new tab, `rel="noopener noreferrer"`). At the end, a centered line in
meta color: `— END TRANSMISSION —`.

### favicon.svg
Simple inline SVG: rounded square `#0B1111` with horizontal teal bars
(`#93C6D0`) simulating a codec signal. No external images anywhere on the site.

---

## 8. HARD RULES (anti-hallucination)

1. **ZERO JavaScript.** All interactivity is CSS or native HTML anchors.
2. Zero dependencies beyond `astro`. Zero CDNs except Google Fonts.
3. Zero placeholders: forbidden "Lorem ipsum", "// rest here", "...". Every
   component complete, or this spec fails.
4. Zero new images: only favicon.svg and `Dossier_and_background_no_bg.png`
   (copied verbatim to public/). Everything else is text-driven.
5. Zero invented content: all visible text comes from §4 or from the
   decorative-text list in §4. If it is not there, it does not go in.
6. Zero explanatory comments in generated code (code speaks for itself).
7. No dark mode toggle, i18n, SEO schemas, analytics, RSS or speculative
   features. Only §7.

---

## 9. ACCEPTANCE CHECKLIST

Verify every item before declaring done:

- [ ] `npx astro build` succeeds, zero errors and zero type warnings
- [ ] File structure matches §3 exactly
- [ ] All rendered data matches §4 character for character
- [ ] Scanlines and flicker present; both disabled under reduced motion
- [ ] Responsive: mobile 1 col, tablet 2, desktop 3+ (auto-fit, no column media queries)
- [ ] Text/background contrast ≥ AA for body (#9BB5A9 on #0B1111)
- [ ] Header nav works with internal anchors
- [ ] Social links open in new tab with safe rel
- [ ] Zero JS files generated besides Astro runtime ones
