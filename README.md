# AI Patterns

A playground for AI interaction design. Not a course: quick games, instant wins, pattern cards to collect, XP and levels. Anyone curious about AI design patterns can jump in and play in one second.

- **Daily challenge** (`/play/daily`): 5 rounds, the same for everyone each day (3 classic + 2 hard), one try. Wordle-style share grid (copy, X, LinkedIn), days-in-a-row streak, countdown to the next Daily.
- **Agent on duty** (`/play/story`): a short branching story. You design Tidy, a file-cleanup agent; each choice moves Priya's trust meter, and trust decides one of 4 endings.
- **This or That** (`/play/this-or-that`, and a 5-round version right on Home): two versions of the same AI screen, tap the better one. Score, streak, keyboard ← / →. **Hard mode** (`?mode=hard`): 20 near-identical pairs where only one detail differs.
- **Fix it** (the Play tab on each card): build an AI feature one decision at a time with instant feedback. Win the card with 1–3 stars.
- **Spot the flaw** (`/play/spot-the-flaw`): realistic AI screens with hidden mistakes. Tap what is wrong.
- **Cards** (`/patterns`): 34 pattern cards in 7 groups (Input, Output, Control, Trust, Feedback, Agents, Voice & vision). Each has Play, Why it works and Cheat sheet tabs.
- **XP, levels and badges** (`/play`): stars, flaws found and best streak add up to XP; 6 levels from Rookie to Legend; a badge per group (gold with all 3 stars).
- **Explore**: Teardowns of ChatGPT, Perplexity, GitHub Copilot and Claude Code; 8 AI dark patterns; Principles (UX heuristics, psychology, Microsoft's 18 Human-AI guidelines); Glossary; Deep dives (9 short reads).
- Light and dark mode, works on phone and desktop. Progress is saved only in the browser.

## Design

Simple layout (one top bar + one centered reading column), in the same design language as the Refund Agent and
Instead projects: sand paper, charcoal ink, 0.5px hairlines, pill controls, Bricolage Grotesque for headings + Lato for text,
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
| Top bar: Play, Cards, Explore | Three places, named like a product, not a course. Easy to remember. |
| XP pill in the top bar | Your score is always visible and a tap away; it grows as you play. |
| Home starts a game | No reading needed: the first This or That round is right under the headline. |
| This or That | The fastest way in: two screens, one tap, instant answer, a streak to protect. |
| Fix it, one step at a time | One decision at a time with instant feedback; a slip is explained and you try again. Stars reward a clean run. |
| Cards to collect | Patterns become collectible cards (locked until you win them), which gives a reason to come back. |
| Daily challenge + share grid | A small reason to come back every day, and a result people want to post. No fake leaderboards: we have no server, so we never invent numbers. |
| Story mode with a trust meter | Choices with visible consequences (and a branch when things go wrong) are more gripping than single questions. |
| Hard mode | Near-identical screens train the eye for small details, like a design review. |
| Levels and badges | Small, honest goals (next level, finish a group) instead of a syllabus. |
| Confetti, XP pops, card unlocks | Short moments of delight on wins; turned off for people who prefer reduced motion. |
| Breadcrumbs | Every inner page shows where you are and one step back. |
| Card page tabs: Play, Why it works, Cheat sheet | One short screen at a time. Playing comes first. |
| Explore tabs | Teardowns, Dark patterns, Principles, Glossary and Deep dives feel like one place. |
| Light tints instead of outlines | Mistakes and good choices are marked with a soft background and a short note, not heavy strokes. |
| One spacing and type scale | Spacing 4/8/12/16/24/32/48/64 px; type 10/12/13/14/16/18/20/30/40 px, each with one job. |
| Page titles, contrast, keyboard focus | Easy to find tabs, readable text (WCAG AA), usable without a mouse. |
