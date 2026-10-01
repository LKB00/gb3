# AI Patterns

A free website where designers **learn AI interaction design by doing**: you make the design decisions first, get instant feedback on common mistakes, and only then see the expert answer and the reasons behind it.

- **Pattern library**: 34 patterns in 7 groups (Input, Output, Control, Trust, Feedback, Agents, Voice & vision), including agentic patterns (autonomy dial, activity log & undo, pause & redirect, cost estimates), voice and image patterns, and a bias check.
- **Visual first**: every pattern shows a ✕ bad and a ✓ better screen, with short labels on the screen itself.
- **Design Lab**: on every pattern page, people build the feature one step at a time. Each pick shows in the live preview with instant feedback; a common mistake is explained and you try again.
- **Mistake Hunt** (`/practice`): realistic AI screens with hidden mistakes. Click what is wrong, then jump to the pattern that fixes it.
- **Live demos** for 15 patterns (including an L1–L5 autonomy explainer and a simulated voice conversation), and a **learning path** of 9 short visual lessons.
- **Teardowns**: stage-by-stage breakdowns of ChatGPT, Perplexity, GitHub Copilot and Claude Code.
- **Anti-patterns**: 8 AI dark patterns (from CDT and DarkBench research), with the fix for each.
- **Principles**: UX heuristics, Laws of UX and psychology per pattern, plus Microsoft's 18 Human-AI guidelines mapped to patterns.
- **Glossary** of plain-English AI terms, and further reading.
- Light and dark mode, works on phone and desktop. Lab progress is saved in the browser.

## Design

Simple layout (one top bar + one centered reading column), in the same design language as the Refund Agent and
Instead projects: sand paper, charcoal ink, 0.5px hairlines, pill controls, Lato + Libre Baskerville,
and soft pastels only for group tags and status. Icons are [Lucide](https://lucide.dev) (ISC license).

## Run it

```bash
npm install
npm run dev      # open the local link it prints
npm run build    # makes the final site in /dist
```

## Add content

- New pattern: add text to `src/data/patterns.js` and its pictures + Design Lab to `src/data/visuals.js`
  (screens are plain data, drawn by `src/mock/Mock.jsx`). A live demo in `src/demos/` is optional.
- New Mistake Hunt screen: add it to `src/data/hunts.js`.
- New lesson: add an item to `src/data/lessons.js`.

Built with React + Vite. Uses hash links (`/#/patterns`) so it works on GitHub Pages with no extra setup.

## Website

Live at **https://lkb00.github.io/patricka/** — every push to `main` builds and publishes the site automatically
(`.github/workflows/deploy.yml`). One-time setup: repo **Settings → Pages → Source: GitHub Actions**.

## UX decisions (why each part is here)

| Part | Why it is here |
|---|---|
| Top bar with 3 places only | Learn (guided), Practice (do) and Library (look up). Three choices are easy to remember, so people don't get lost. |
| Simple Home | One main button (Start / Continue) and three cards. No long lists on the first screen. |
| Breadcrumbs | Every inner page shows where you are and one step back. |
| Progress ring in the top bar | Your labs and hunts done, always visible, one click to Practice. |
| Pattern page in 3 tabs: Do, Understand, Reference | One short screen at a time instead of one long page. Doing comes first. |
| Do → Understand | After you pass a lab, one button takes you to the expert answer and the why. |
| "Why it matters" (Understand tab) | Learners need the reason before the rule. |
| The expert answer (bad vs better) | A picture teaches faster than text. Pins label the exact part that matters. |
| Real examples | Grounds each pattern in products people already use (ChatGPT, Perplexity, Gmail, Netflix…). |
| Principles behind it | Shows the UX heuristic, law or psychology that makes the pattern work. |
| Reference tab | Rules of thumb and details for later, out of the way while learning. |
| Library tabs | Patterns, Teardowns, Anti-patterns, Principles and Glossary feel like one place. |
| Guided Design Lab | One decision at a time with a step tracker; the part you are designing is highlighted in the preview; feedback comes the moment you pick; a summary shows what you got right first time. |
| Practice tabs | Design Labs and Mistake Hunt are two modes; only one is on screen at a time. |
| Mistake Hunt | Builds the skill of spotting problems in real screens, and links each mistake to its fix. |
| Light tints instead of outlines | Mistakes and good choices are marked with a soft background and a short note, not heavy strokes. |
| One spacing and type scale | Spacing 4/8/12/16/24/32/48/64 px; type 10/12/13/14/16/18/20/30/40 px, each with one job. |
| Page titles, contrast, keyboard focus | Easy to find tabs, readable text (WCAG AA), usable without a mouse. |
