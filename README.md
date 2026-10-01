# AI Patterns

A playground for AI interaction design. Not a course: quick games, instant wins, pattern cards to collect, XP and levels. Anyone curious about AI design patterns can jump in and play in one second.

- **Daily challenge** (`/play/daily`): 5 rounds, the same for everyone each day (3 classic + 2 hard), one try. Wordle-style share grid (copy, X, LinkedIn), days-in-a-row streak, countdown to the next Daily.
- **Agent on duty** (`/play/story`): a short branching story. You design Tidy, a file-cleanup agent; each choice moves Priya's trust meter, and trust decides one of 4 endings.
- **This or That** (`/play/this-or-that`, and a 5-round version right on Home): two versions of the same AI screen, tap the better one. Score, streak, keyboard ← / →. **Hard mode** (`?mode=hard`): 20 near-identical pairs where only one detail differs.
- **Fix it** (the Play tab on each card): build an AI feature one decision at a time with instant feedback. Win the card with 1–3 stars.
- **Spot the flaw** (`/play/spot-the-flaw`): realistic AI screens with hidden mistakes. Tap what is wrong.
- **Cards** (`/patterns`): 34 pattern cards in 7 groups (Input, Output, Control, Trust, Feedback, Agents, Voice & vision). Each has Play, Why it works and Cheat sheet tabs.
- **Build mode** (`/play/build`): a blank AI screen and a box of pieces. Tap or drag the right pieces on, leave the traps out, then check. 4 briefs (research answer, travel agent, long writing task, voice in a car), 1–3 stars each.
- **Stories** (`/play/story`): 4 branching stories with a trust meter and 4 endings each: a file-cleanup agent (Priya), a kitchen voice assistant (Arjun), a bank help bot (Meera) and a coding agent (Kabir).
- **Challenge a friend**: after the Daily or a Speed round, copy a link. Your friend plays the exact same rounds (seeded) and sees your score to beat. Everything is in the link, no server.
- **Speed round** (`/play/speed`): 60 seconds of quick "which is better?" picks (classic + hard mixed). 3 in a row = ×2 points; a wrong tap costs 1 point, so random tapping doesn't pay. 3-2-1 countdown, ticking last 5 seconds, copyable score.
- **Card flip**: winning a Fix it challenge flips your new pattern card over with a glow.
- **Sound and vibration** (speaker button in the top bar, off by default): short sounds made with Web Audio (no files) and phone vibration on right, wrong, win and card flip.
- **Day streak + daily goal** (`/play`, flame in the top bar): any answer in any game is a "move"; 10 moves is the daily goal. One missed day per week is covered by a free skip day, so one busy day doesn't wipe out a streak. A toast celebrates the goal.
- **Player card** (`/play/card`): your name, AI-designer type (from the group you've mastered most, e.g. "The Trust Keeper"), level, XP, stats and badges. Save as a 1080×1350 image or share; made in the browser, nothing uploaded.
- **XP, levels and badges** (`/play`): stars, flaws found and best streak add up to XP; 6 levels from Rookie to Legend; a badge per group (gold with all 3 stars).
- **Explore**: Teardowns of ChatGPT, Perplexity, GitHub Copilot and Claude Code; 8 AI dark patterns; Principles (UX heuristics, psychology, Microsoft's 18 Human-AI guidelines); Glossary; Deep dives (9 short reads).
- **Installable app**: add it to the home screen or dock; works offline (service worker in `public/sw.js`).
- **Backup code** (`/play` → Your progress): copy a code with all progress and paste it on another device. Restoring merges and never loses progress.
- **Link previews**: Open Graph and Twitter tags with `public/og.png`, so shared links show a title card.
- **“I disagree”** links on answers open a ready-to-send GitHub issue.
- Light and dark mode, works on phone and desktop. Progress is saved only in the browser.

## Visitor stats (optional)

Off by default. To turn on privacy-friendly stats with [Plausible](https://plausible.io) (no cookies, no personal data):

1. Create a Plausible site for `lkb00.github.io`.
2. In GitHub → Settings → Secrets and variables → Actions → **Variables**, add `VITE_PLAUSIBLE_DOMAIN` = `lkb00.github.io`.
3. Deploy again. Page views and "Game finished" events will show up in Plausible.

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
| Day streak with a free skip day | Builds a habit without guilt: one busy day doesn't reset weeks of play, and today not played yet never shows as broken. |
| Player card + designer type | Something personal to keep and show off; the type changes as you play, so it's a reason to explore other groups. |
| Speed round | Pace and pressure for players who already know the basics; the wrong-tap cost keeps it about skill, not luck. |
| Card flip, sounds, vibration | Small sensory rewards at the moment of a win; sound is off by default and motion respects reduced-motion settings. |
| Build mode | Designing from a blank screen is the closest thing to real work; traps teach what to leave out. |
| Four stories | Different products (agent, voice, support, coding) show the same trust ideas in new places. |
| Challenge links | The fastest way for one player to bring the next one, with no accounts or server. |
| Installable app + backup code | Feels like a real app on a phone, and progress isn't trapped in one browser. |
| Levels and badges | Small, honest goals (next level, finish a group) instead of a syllabus. |
| Confetti, XP pops, card unlocks | Short moments of delight on wins; turned off for people who prefer reduced motion. |
| Breadcrumbs | Every inner page shows where you are and one step back. |
| Card page tabs: Play, Why it works, Cheat sheet | One short screen at a time. Playing comes first. |
| Explore tabs | Teardowns, Dark patterns, Principles, Glossary and Deep dives feel like one place. |
| Light tints instead of outlines | Mistakes and good choices are marked with a soft background and a short note, not heavy strokes. |
| One spacing and type scale | Spacing 4/8/12/16/24/32/48/64 px; type 10/12/13/14/16/18/20/30/40 px, each with one job. |
| Page titles, contrast, keyboard focus | Easy to find tabs, readable text (WCAG AA), usable without a mouse. |
