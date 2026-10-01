# AI Patterns

A free learning website for designers about **AI design patterns** and **AI interaction design**.

- **Pattern library** — 12 patterns in 5 groups (Input, Output, Control, Trust, Feedback). Each has: problem, solution, when to use / avoid, do & don't, real examples.
- **Live demos** — every pattern has a small interactive demo you can click and try.
- **Learning path** — 6 short lessons, from basics to advanced, linked to the patterns.
- Light and dark mode, works on phone and desktop.

## Run it

```bash
npm install
npm run dev      # open the local link it prints
npm run build    # makes the final site in /dist
```

## Add content

- New pattern: add an item to `src/data/patterns.js`, and a demo component in `src/demos/` (register it in `src/demos/index.js`).
- New lesson: add an item to `src/data/lessons.js`.

Built with React + Vite. Uses hash links (`/#/patterns`) so it works on GitHub Pages with no extra setup.
