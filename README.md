# AI Patterns

A free learning website for designers about **AI design patterns** and **AI interaction design**.

- **Pattern library**: 22 patterns in 6 groups (Input, Output, Control, Trust, Feedback, Agents).
- **Visual first**: every pattern shows a ✕ bad and a ✓ better screen, with short labels on the screen itself.
- **Design Lab**: on every pattern page, people build the feature by picking options. "Check my design" marks common mistakes in red and explains why.
- **Mistake Hunt** (`/practice`): realistic AI screens with hidden mistakes. Click what is wrong, then jump to the pattern that fixes it.
- **Live demos** for 12 patterns, and a **learning path** of 7 short visual lessons.
- Light and dark mode, works on phone and desktop. Lab progress is saved in the browser.

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
