# AI Patterns

A free learning website for designers about **AI design patterns** and **AI interaction design**.

- **Pattern library**: 29 patterns in 6 groups (Input, Output, Control, Trust, Feedback, Agents), including agentic patterns: autonomy dial, activity log & undo, pause & redirect, cost estimates.
- **Visual first**: every pattern shows a ✕ bad and a ✓ better screen, with short labels on the screen itself.
- **Design Lab**: on every pattern page, people build the feature by picking options. "Check my design" marks common mistakes in red and explains why.
- **Mistake Hunt** (`/practice`): realistic AI screens with hidden mistakes. Click what is wrong, then jump to the pattern that fixes it.
- **Live demos** for 14 patterns (including an interactive L1–L5 autonomy explainer), and a **learning path** of 8 short visual lessons.
- **Anti-patterns**: 8 AI dark patterns (from CDT and DarkBench research), with the fix for each.
- **Principles**: UX heuristics, Laws of UX and psychology per pattern, plus Microsoft's 18 Human-AI guidelines mapped to patterns.
- **Glossary** of plain-English AI terms, and further reading.
- Light and dark mode, works on phone and desktop. Lab progress is saved in the browser.

## Design

Docs-style layout (sidebar + reading column), in the same design language as the Refund Agent and
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
| Sidebar with every pattern | One-click access to all 22 patterns; the current one stays highlighted and in view, so you never lose your place. |
| "Why it matters" under each title | Learners need the reason before the rule. The problem comes first, then the solution. |
| See the difference (bad vs better) | A picture teaches faster than text. Pins label the exact part that matters. |
| Real examples | Grounds each pattern in products people already use (ChatGPT, Perplexity, Gmail, Netflix…). |
| Principles behind it | Shows the UX heuristic, law or psychology that makes the pattern work, linked to the Principles page. |
| Try it (live demo) | Feeling the interaction makes it stick. |
| Design Lab | Learning by doing; mistakes are explained the moment you make them, in plain words. |
| Rules of thumb | A quick summary to remember and reuse at work. |
| Details (collapsed lower down) | Depth for people who want it, without slowing everyone else down. |
| On this page | Long pages stay easy to move around. |
| Mistake Hunt | Builds the skill of spotting problems in real screens, and links each mistake to its fix. |
| Light tints instead of outlines | Mistakes and good choices are marked with a soft background and a short note, not heavy strokes. |
| One spacing and type scale | Spacing 4/8/12/16/24/32/48/64 px; type 10/12/13/14/16/18/20/30/40 px, each with one job. |
| Page titles, contrast, keyboard focus | Easy to find tabs, readable text (WCAG AA), usable without a mouse. |
