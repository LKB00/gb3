# AI Patterns: full project context (handoff file)

> **Read this first in a new session.** It is written so a fresh AI session (or a new person) can continue the work
> with the same context: what the site is, what the owner wants, how to work, how to ship, what was decided and why,
> and what is still open. Keep it up to date (see [Keeping this file current](#14-keeping-this-file-current)).
>
> Last updated: **2026-10-01**, after PR #22 (edge-case fixes). Live site: <https://lkb00.github.io/patricka/>

## Contents
1. [Snapshot](#1-snapshot)
2. [The owner and how to work with them](#2-the-owner-and-how-to-work-with-them)
3. [Runbooks: develop, check, preview, ship](#3-runbooks-develop-check-preview-ship)
4. [Sandbox environment gotchas](#4-sandbox-environment-gotchas)
5. [Product: what the site is and the rules of every feature](#5-product-what-the-site-is-and-the-rules-of-every-feature)
6. [Architecture](#6-architecture)
7. [Saved data and backup codes](#7-saved-data-and-backup-codes)
8. [Sound, haptics, motion, phone, accessibility](#8-sound-haptics-motion-phone-accessibility)
9. [Content inventory and how to add content](#9-content-inventory-and-how-to-add-content)
10. [Quality system: checks and tests](#10-quality-system-checks-and-tests)
11. [History and decisions](#11-history-and-decisions)
12. [Known limits and not-verifiable items](#12-known-limits-and-not-verifiable-items)
13. [Open ideas (backlog)](#13-open-ideas-backlog)
14. [Keeping this file current](#14-keeping-this-file-current)
15. [Glossary of project words](#15-glossary-of-project-words)

---

## 1. Snapshot

| | |
|---|---|
| **What** | A playful website about **AI design patterns, AI interaction design and agentic UX**. A game, not a course. |
| **Live** | <https://lkb00.github.io/patricka/> (GitHub Pages, hash routes like `/#/play`) |
| **Repo** | `LKB00/patricka`. Work branch: `claude/awesome-rubin-9zmea8`. Live branch: `main` |
| **Stack** | React 18.3, react-router-dom 6 (`HashRouter`), Vite 6 (`base: './'`), lucide-react icons. Plain CSS (no framework). No backend. |
| **State** | Everything a visitor earns lives in their own browser (`localStorage`). No accounts, no server. |
| **Deploy** | Push/merge to `main` runs `.github/workflows/deploy.yml` (npm ci, lint, build, publish to Pages). |
| **Size** | About 170 KB of JavaScript (gzip). About 16,000 lines of source. |
| **Languages in code** | JavaScript (JSX). No TypeScript. No unit-test framework. Quality comes from `npm run check`. |
| **Fonts** | Bricolage Grotesque (headings), Lato (text), Libre Baskerville (user speech in mock screens), loaded from Google Fonts in `index.html`. |
| **Design language** | Copied from the owner's other projects (warm "sand paper" `#fbfbf7`, charcoal ink `#24282c`, lime accent `#c2ef72`, soft pastels per pattern group, pill buttons, hairline borders). |
| **Optional stats** | Plausible, **off** unless the repo variable `VITE_PLAUSIBLE_DOMAIN` is set (see README). Not enabled today. |

---

## 2. The owner and how to work with them

**Language.** The owner is not strong in English. **Always reply in easy, short English.** Use short sentences, simple words,
bullets and small tables. Avoid jargon. (UI text on the site is also plain and friendly.)

**How they work.** They give short instructions ("Build all of them", "Make live", "Now optimise the code base"). They test on a real
phone and by looking at the preview. They react to what they *see*. Most of their feedback changed the direction of the site (see
[History](#11-history-and-decisions)). Do the work end to end, then explain what changed in plain words. Do not ask unneeded questions.

**Magic phrase: "Make live".** It means: create a pull request from the work branch to `main`, merge it, and confirm the GitHub Actions
deploy succeeded. Details in [Runbook: ship](#ship-make-live). Do **not** make a PR or merge unless they say this (or ask for a PR).

**HARD CONSTRAINT (from the owner, verbatim):**
> "I have told you about the get up which you can use, so don't make any changes on in those Repo. You can copy, but you can't make changes there."

This means the reference repos **`LKB00/refund-agent`** and **`LKB00/instead-design-assignment`** are **read-only**. Reading and copying
ideas/styles from them is fine. **Never modify, commit to, push to, or open PRs in them.** The site's look comes from them.

**Style of answers that worked well**
- Start with what happened (done / not live yet), then a short list of what changed, then what to do next ("Say **Make live**").
- Say clearly when something is **not live yet** and when something **could not be verified** (see [limits](#12-known-limits-and-not-verifiable-items)).
- Be honest about problems found in your own earlier work (this happened: the smoke test was weaker than believed; it was fixed).
- Give the preview link before "Make live" so they can try changes first.

---

## 3. Runbooks: develop, check, preview, ship

### Start of a session (do this first)
```bash
cd /home/user/patricka          # the repo is already cloned here in the cloud sandbox
git checkout claude/awesome-rubin-9zmea8
git fetch origin main && git merge --ff-only origin/main   # work branch should start from latest main
npm ci                           # if node_modules is missing
npm run check                    # should say "All good."
```
If the PR for the work branch was already merged, treat new work as a fresh change: restart the work branch from `main`
(`git fetch origin main && git checkout -B claude/awesome-rubin-9zmea8 origin/main`) and keep the same branch name.

### Develop
```bash
npm run dev          # local site with instant reload
```
Find where to change things in the **"Common changes" table in README.md** (it is the quick map) and in [section 6](#6-architecture) below.

### Check before every push
```bash
npm run check        # lint + validate (content) + build + smoke (every page in a real browser). About 70 to 90 seconds.
```
In the cloud sandbox Playwright needs the pre-installed Chromium:
```bash
CHROMIUM_PATH=/opt/pw-browsers/chromium npm run check
```
Individual parts: `npm run lint`, `npm run validate`, `npm run build`, `npm run smoke`.

### Commit and push
- Develop only on **`claude/awesome-rubin-9zmea8`**. Push with `git push -u origin claude/awesome-rubin-9zmea8`.
- Commit messages: a clear title, a short body listing what changed and why. End them with the attribution trailers the environment asks
  for (`Co-Authored-By: ...` and `Claude-Session: ...`). Do **not** put model names anywhere else in the repo.
- There is **no `gh` CLI**. Use the GitHub MCP tools (`mcp__github__*`; load with ToolSearch if needed).

### Preview (so the owner can try before "Make live")
The owner looks at a **private Claude Artifact**. It is one self-contained HTML page, republished to the **same URL** each time:
1. `npm run build`
2. Inline the build output into one file in the scratchpad (`ai-patterns.html`): put the built CSS in a `<style>`, the built JS in a
   `<script type="module">` (escape `</script`), and **remove the `<link rel="manifest">`** tag.
3. Publish with the Artifact tool using the **same file path** and the existing artifact `url` (find it with `action: "list"`; the
   title is "AI Patterns"). Warning shown about downloads is expected and harmless (downloads do not work in the preview).
4. In the preview, downloads (e.g. "Save player card") and the service worker do not work. That is normal.

### Ship ("Make live")
1. Make sure `npm run check` passed and everything is committed and pushed to the work branch.
2. `mcp__github__create_pull_request` (head = work branch, base = `main`). Look for a PR template first (none exists today).
   End the PR description with the "Generated with Claude Code" line and the session link the environment gives.
3. `mcp__github__merge_pull_request` with `merge_method: "merge"`.
4. Confirm the deploy: `mcp__github__actions_list` with `method: list_workflow_runs` (repo `LKB00/patricka`). The new run is titled
   "Merge pull request #N ..." and must reach `status: completed`, `conclusion: success`. It can take about 40 seconds to appear.
5. Tell the owner it is live, give the link, and say to refresh (or close and reopen the installed app, sometimes twice).
6. If the deploy fails: read the job logs (`mcp__github__get_job_logs`), fix on the work branch, and ship again. Lint runs before the
   build in CI, so a lint error stops the deploy.

> The sandbox **cannot open the live site** (see next section), so "live" is confirmed from the successful workflow run, not from loading the page.

---

## 4. Sandbox environment gotchas

- **Network is restricted.** Blocked from the sandbox: the live site (`lkb00.github.io`), Google Fonts (`net::ERR_FAILED` in the console is
  expected and not a bug), and unrelated sites such as `aiuxplayground.com` (WebFetch is blocked; WebSearch works). Do not try to `curl` the live site.
- **No `gh`.** Use GitHub MCP tools. GitHub scope is limited to `LKB00/patricka` (other repos need `add_repo`; the two reference repos are read-only anyway).
- **Browser tests**: Chromium is at `/opt/pw-browsers/chromium`. Do not run `playwright install`. Use `executablePath` (or `CHROMIUM_PATH` for `npm run smoke`).
  `playwright` is a devDependency of the repo.
- **Port clashes.** `npm run smoke` starts its own server on port 4180 (or the next free one). If you start `vite preview` yourself, start it with
  `run_in_background`.
- **Never `pkill -f "vite preview"` or `pkill -f smoke`**: the pattern also matches the shell running the command and kills it. Use `TaskStop` on a background task id instead.
- **Do not leave scratch files in the repo** (it happened once: a test script written to the repo root). Put test scripts in the scratchpad directory.
- **Fake time in tests.** Playwright's `page.clock.install({ time })` plus `clock.runFor(ms)` lets you test the 60-second Speed round and midnight rollover quickly.
  With a fake clock, real promises (like clipboard) are not advanced by `runFor`; use real `waitForTimeout` for those.
- **Hash navigation does not reload the page.** In tests, a `goto('#/other')` can resolve before React renders the new page (the old smoke test measured the previous page because of this). The current smoke test waits for the new `.route` element.
- Screenshots: Playwright full-page screenshots need `reducedMotion: 'reduce'` (otherwise scroll-reveal sections stay faded) and `serviceWorkers: 'block'`.

---

## 5. Product: what the site is and the rules of every feature

### 5.1 Concept and product rules (from owner feedback)
- It **must not feel like an educational platform, syllabus or course.** It should be fun, quick, rewarding: games, XP, streaks, cards to collect.
- Anyone curious about AI design patterns should be playing in **one second**. Simple structure, no "information heavy" pages, no getting lost.
- Three places only: **Play** (games), **Cards** (the pattern collection), **Explore** (deeper reading). Plus **Me** (profile/settings) on phones.
- Instant feedback everywhere (sound, vibration, motion, XP pops). Everything on a phone must feel made for a phone.
- The look follows the owner's other projects (see Snapshot).

### 5.2 Pages and routes (`src/App.jsx`)
| Route | Page | Notes |
|---|---|---|
| `/` | Home | Status line (level, XP, cards, streak), a 5-round This or That right on the page, the Daily banner and the game tiles |
| `/play` | Play hub | Level card, Today card (goal + streak), Daily banner, game tiles, badges |
| `/play/daily` | Daily challenge | See 5.3 |
| `/play/this-or-that` | This or That | `?mode=hard` for Hard mode |
| `/play/speed` | Speed round | `?vs=&seed=&from=` for challenge links |
| `/play/power` | How much power? | Autonomy-level game |
| `/play/build` | Build mode | `?brief=research|travel|writer|car` |
| `/play/story`, `/play/story/:id` | Stories | ids: `tidy`, `nova`, `sage`, `pilot` |
| `/play/spot-the-flaw` | Spot the flaw | 10 screens |
| `/play/card` | Player card | Image made in the browser |
| `/patterns`, `/patterns/:id` | Cards | 37 patterns; tabs `?view=do|understand|reference` (shown as Play, Why it works, Cheat sheet; default `do`); `?category=` filter |
| `/autonomy` | Autonomy ladder | `?level=1..5`; has a level finder |
| `/teardowns`, `/teardowns/:id` | Teardowns | ChatGPT, Perplexity, GitHub Copilot, Claude Code |
| `/anti-patterns` | Dark patterns | 8 |
| `/principles` | Principles | UX laws + Microsoft HAX 18 guidelines; `?focus=` scrolls to one |
| `/glossary` | Glossary | 22 terms + further reading |
| `/learn`, `/learn/:id` | Deep dives | 9 short reads |
| `/me` | Me | Level, today, badges, settings (sound, vibration, dark mode), backup |
| `/practice` | redirects to `/play` | old link |
| `*` | Not found | |

### 5.3 Game rules (exact)
**XP and levels** (`src/progress.js`, `XP`, `LEVELS`, `xpParts`)
| Source | XP |
|---|---|
| Each star on a collected card (Fix it) | 10 per star (a collected card counts at least 1 star) |
| Each Spot-the-flaw screen finished | 30 |
| Best This-or-That streak | 5 per streak point |
| Each right Daily answer (ever) | 10 |
| Each story: best trust score | round(trust / 2) per story |
| Each Build brief: best stars | 10 per star |
| Speed round best points | 2 per point |
| How much power? best points (max 16) | 2 per point |

Levels (XP needed): Rookie 0, Prompt tinkerer 100, Pattern spotter 300, Interaction designer 600, AI UX pro 1000, Legend 1300.

**Moves, daily goal and streak.** Every answer in any game is a "move" (`markPlayed`). The daily goal is **10 moves** (`DAILY_GOAL`).
The day streak counts days with at least one move. **One free "skip day" per 7 days** keeps the streak if a day is missed. If today is not played
yet, the streak is still kept (you still have time). Streak math is `streakInfo` in `progress.js`.

**This or That** (`components/ThisOrThat.jsx`): 10 rounds. Two versions of the same AI screen; tap the better one. Classic uses one round
per pattern (visuals), Hard uses the 30 "one small detail differs" pairs (`data/subtle.js`). Pins/captions appear after answering. Keys: Left/Right (or A/B), Enter for next.
Shortcuts with Ctrl/Cmd/Alt and held keys are ignored. Streak of 3+ plays the combo sound.

**Daily** (`pages/Daily.jsx`): 5 rounds: easy, easy, hard, easy, hard. Same for everyone on the same date (seeded with `ai-patterns:<YYYY-MM-DD>`).
**One try per day**; the first result of the day is saved. Daily #1 = **1 Oct 2026**; the displayed number is never below 1 (`dailyLabel`). Result shows a Wordle-style
grid, share/copy, countdown to the next Daily, and "challenge a friend". Playing a friend's challenge for a past day replays it but does not save it.

**Speed round** (`pages/Speed.jsx`): 60 seconds, 3-2-1 countdown. Classic and hard rounds mixed from a **seeded** deck (`speed:<seed>`).
Right = +1; **3 in a row turns on x2**; wrong = **-1 point (never below 0)** so random tapping does not pay. Last 5 seconds tick. A "quit" button is on screen.
While playing, the body gets class `focus-mode` (top/bottom bars hidden on phones). Result: points, accuracy, new best, XP, share link.

**Fix it** (`components/Lab.jsx`, one per pattern, reached from the card's Play tab): step by step, one decision at a time with instant feedback; 3 stars = no mistakes,
2 = one mistake, 1 = more. Finishing flips a **collectible card** (`FlipCard`) with a glow and star chimes. "Reveal the answer (no card)" exists for people who give up.

**Spot the flaw** (`components/Hunt.jsx`): a realistic AI screen with hidden mistakes; tap what is wrong, tap fine parts to be told they are fine. Each of the 10 screens gives 30 XP once.

**Stories** (`pages/Story.jsx`, `data/story.js`): 4 branching stories. Each scene = setup + a screen + a question + choices. Each choice changes **trust (0 to 100)**,
shows a reaction and may change the path (`next`). The final trust picks one of 4 endings (`endings[].min`). Best trust per story is saved.
`tidy` = file-cleanup agent (Priya), `nova` = kitchen voice assistant, `sage` = bank help bot, `pilot` = coding agent.

**Build mode** (`pages/Build.jsx`, `data/builds.js`): a brief and a box of pieces. Tap or drag pieces onto a blank AI screen. Each piece is `need`, `nice` or `trap`.
Stars: **3** = all needs and no traps; **2** = (missing + traps) <= 2; else **1**. Pieces explain their pattern after "Check my screen".

**How much power?** (`pages/Power.jsx`, `data/autonomy.js`): 8 tasks dealt from 21 (one for each of the 5 levels first, then random). Pick the autonomy level
(1 Suggest, 2 Draft, 3 Confirm, 4 Act & tell, 5 Act alone). **Exact = 2 points, one step off = 1**, else 0. Score out of 16; stars: >=14 three, >=10 two, else one. After each answer: why, plus the patterns that level needs.

**Autonomy ladder** (`pages/Autonomy.jsx`): five levels with who decides, who acts, good for, watch out, patterns to build, and a mock screen. The **level finder** asks 4 questions
(how bad if wrong, can it be undone, how often, needs taste) and `suggestLevel()` returns a starting level. Idea taken from research on aiuxplayground.com ("autonomy is a product decision").

**Challenge a friend** (`game/challenge.js`): everything is in the link. Params: `vs` (whole number 0 to 999), `from` (name, max 24 chars, control chars stripped),
`seed` (letters/digits, max 16), `d` (YYYY-MM-DD, Daily), `r` (up to 5 chars of 0/1, Daily grid). A Speed challenge **needs a seed** or it is ignored. Bad params are ignored safely.

**Player card** (`pages/PlayerCard.jsx`): name (max 24 chars), "AI designer type" (from the group you mastered most), level, XP, stats and badges. Drawn on a 1080x1350 canvas and saved/shared as an image. Long text shrinks to fit (`fillFit`).

**Badges** (`components/play/Badges.jsx`): one per pattern group; collect all cards for the badge, all with 3 stars for gold.

**Install and backup** (`components/play/AppAndBackup.jsx`, on the Me page): install prompt (Android/desktop `beforeinstallprompt`, iOS hint) and backup code (see section 7).

---

## 6. Architecture

### 6.1 Folder map
```
index.html                 fonts, Open Graph/Twitter tags, manifest link, theme colour
public/                    og.png, icons, manifest.webmanifest, sw.js (service worker)
scripts/smoke.mjs          browser test of every page (npm run smoke)
scripts/validate.mjs       content checker (npm run validate)
eslint.config.js           lint rules (npm run lint)
.github/workflows/deploy.yml   CI: install, lint, build, publish to Pages
src/
  main.jsx                 entry: HashRouter, ErrorBoundary, registers service worker (production only)
  App.jsx                  all routes; wraps routes in ErrorBoundary + .route (page transition)
  progress.js              ALL saved progress, XP/levels, streaks, backup (the one place that touches game saves)
  data/                    all content as plain JS (see section 9)
  config/nav.js            menus and Explore tabs (one source for TopBar, BottomNav, LibraryTabs)
  config/games.js          the game tiles (one entry per game)
  pages/                   one file per route
  components/              shared UI; components/play/ = Play hub parts
  mock/Mock.jsx            draws fake app screens from data; mock/blocks.js = builders (ai(), modal(), ...)
  demos/                   small working demos on pattern pages (registry in demos/index.js)
  game/                    decks.js (rounds, daily deck), fx.js (sound+haptics), challenge.js, install.js, track.js,
                           archetype.js (player type), useRandomChallenge.js
  lib/                     storage.js, random.js (shuffle, seeded), dates.js (dayKey), clipboard.js, theme.js,
                           useTitle.js, useCountUp.js
  styles/                  CSS split by area (see 6.4)
```

### 6.2 Routing and layout
- `HashRouter` so GitHub Pages needs no server rules. Links look like `/#/patterns/citations`.
- `App.jsx` renders `TopBar`, then `<main>` with `ErrorBoundary key={pathname}` and `div.route` (re-keyed on path change so each page plays the enter animation and a crash resets on navigation), `Footer`, then `BottomNav` (phones only).
- Phones (<= 720px): bottom tab bar (Home, Play, Cards, Explore, Me), a back button in the top bar (`parentOf()` in `config/nav.js`), no breadcrumbs, no footer.
- `window.scrollTo({ behavior: 'instant' })` on every path change.

### 6.3 Data model (`src/data`)
- `patterns.js`: `{ id, title, category, summary, problem, solution, when[], avoid[], dos[], donts[], examples[], demo? }` and `categories` (7).
- `visuals.js`: per pattern `{ compare: { bad, good }, lab: { goal, frame[], decisions[{ id, label, options[{ label, ok, why, blocks[] }] }] } }`. Exactly **one** `ok` option per decision. A `{ slot: id }` in `frame` marks where a decision's chosen blocks appear. An option with empty `blocks` means "adds nothing".
- Screen **blocks** are plain objects `{ type, ... }` drawn by `mock/Mock.jsx` (user, ai, note, text, chips, buttons, input, ghost, edit, steps, spinner, banner, toast, variants, rows, card, list, check, diff, modal, slider, toggle, avatar, voice, image, blank/empty). Build them with `mock/blocks.js`. Button label prefixes: `!Label` primary, `-Label` danger. Text: `[1]` = citation pill, `**x**` = bold, `:icon text` = icon.
- Others: `examples.js` (real products per pattern), `principles.js` (UX laws, `patternPrinciples` as `[principleId, reason]` pairs, HAX guidelines), `lessons.js`, `teardowns.js`, `antipatterns.js`, `glossary.js`, `hunts.js`, `subtle.js`, `story.js`, `builds.js`, `autonomy.js`.
- Every cross reference (pattern ids, scene names, ...) is verified by `npm run validate`.

### 6.4 Styles (`src/styles/index.css` imports, in this order, and order matters)
`tokens` (colours, fonts, dark mode) > `base` > `shell` (top bar, page, tabs, crash screen) > `controls` (buttons, chips, tags) > `mock` (fake screens) > `demos` > `lab` > `pattern` > `explore` > `home` > `game-core` (XP pill, confetti, This or That, tiles) > `play` > `daily-story` > `card-speed` > `build` > `phone` (<= 720px rules; keep near the end) > `autonomy` > `motion` (always last).
- Dark mode: `:root[data-theme='dark']` and `prefers-color-scheme: dark`. Colours are tokens (`--paper`, `--ink`, `--lime`, `--p-<group>` pastels, `--positive`, `--negative`).
- Newer areas keep their own phone rules inside their file (see `autonomy.css`).
- Generic motion rules use `:where()` (zero weight) so a component's own animation wins.

### 6.5 Important patterns in the code
- **One storage layer**: `lib/storage.js` (`readJSON`, `writeJSON`, `useStored`). Every write dispatches the `progress-change` event, so all hooks update together.
- **Data is cleaned when read** (`progress.js`: `cleanStats`, `cleanStars`, `cleanDaily`, `cleanDays`, `cleanList`). Wrong types, NaN, huge numbers, unknown ids and bad date keys are dropped or clamped. **When you add a saved field, add it to the clean functions**, or bad data could crash a page.
- **Best-score helpers**: `saveBest(field, value)` and `saveBestIn(field, id, value)` keep the maximum. A new best score = a `saveBest` line + a line in `xpParts()`.
- **Seeded randomness**: `lib/random.js` `seeded(key)` (mulberry32) so the Daily and challenge links give everyone the same rounds.
- **Clipboard** only through `lib/clipboard.js` `copyText()` (clipboard API, then `execCommand`, then a prompt box).
- **Error screen**: `components/ErrorBoundary.jsx` wraps the whole app and each page; offers Try again, Go home and (with a confirm) Clear saved data.
- **Games registry**: `config/games.js` defines the tiles (title, text, icon, tone class, meta line). To add a game: page in `pages/`, route in `App.jsx`, entry in `games.js`.
- **Count-up numbers**: `<CountUp value={n} />` or `useCountUp(n)`.
- **Service worker** (`public/sw.js`, cache `ai-patterns-v1`): pages network-first, built files and fonts cache-first. Registered only in production.

---

## 7. Saved data and backup codes

`localStorage` keys (all in the visitor's browser):

| Key | Shape | Meaning |
|---|---|---|
| `labs-passed` | `['citations', ...]` | collected cards (known pattern ids only) |
| `hunts-done` | `['chat', ...]` | finished Spot-the-flaw screens (known ids only) |
| `lab-stars` | `{ patternId: 1..3 }` | best stars per card |
| `game-stats` | `{ bestStreak, speedBest, powerBest, builds: {id: 1..3}, stories: {id: 0..100}, storyBest? }` | best scores (`storyBest` is a legacy field for the first story) |
| `daily` | `{ 'YYYY-MM-DD': [bool x5] }` | Daily results |
| `days` | `{ 'YYYY-MM-DD': moves }` | moves per day (streak, goal) |
| `player-name` | string (max 24) | name for card and challenge links |
| `theme` | `'light'` or `'dark'` | absent = follow the system |
| `fx-sound`, `fx-haptic` | `'1'` or `'0'` | default on. Legacy `fx-on='0'` is honoured |
| `fx-hint` | `'1'` | the one-time "sound is on" hint was shown |

**Backup code** = `AIP1.` + base64url(JSON of the progress keys + name). Restoring **merges** with what is there (numbers keep the larger value, lists are unions) and
cannot lose progress. Incoming data is cleaned the same way as reads; arrays/empty/huge/invalid codes are rejected with a friendly message; `__proto__`-style keys are skipped.
Round trip (export in one browser, restore in another) was verified to give identical data and XP.

---

## 8. Sound, haptics, motion, phone, accessibility

**Sound** (`game/fx.js`): synthesized with the Web Audio API (no audio files). C-major pentatonic so any mix sounds friendly. `fx('name', opts)` plays a sound and a vibration.
Names: tap, select, nav, toggle, right(streak), wrong, combo(streak), star(n), win, levelup, goal, flip, place, remove, trustUp, trustDown, tick, go, timeup.
On by default; two separate switches on the Me page; the top-bar speaker toggles both. A global `pointerdown` listener gives every button/link/tab a soft tap, except elements matching `SILENT` (game answers play their own sound). Browsers only allow audio after a first tap.
**Haptics**: Android `navigator.vibrate` patterns (`BUZZ`); iPhone (Safari 17.4+) uses a hidden `<input type="checkbox" switch>` label click to get a system tap.

**Motion** (`styles/motion.css`, all inside `@media (prefers-reduced-motion: no-preference)`, so reduced-motion users get none):
- page enter (`.route`), staggered arrival of tiles/badges/lists (`--i` by `nth-child`), scene slide-in for Lab/Story/This or That (keyed elements remount), pop for right and shake for wrong answers, meters and the goal ring fill when shown, rolling XP/score numbers, press feedback, hover lift only with a mouse, scroll-reveal of `.block` sections using `animation-timeline: view()` (progressive enhancement), light/dark cross-fade (`html.theme-fade`).

**Phone experience** (<= 720px, `styles/phone.css`): bottom nav, back button, edge-to-edge games, sticky action bars above the nav (Next/Check), `focus-mode` for Speed, `hover: none` press feedback, compact top bar below 440px, and a **landscape** compaction (`max-width: 900px` and `max-height: 480px`: icon-only bottom bar, 44px). `pointer: coarse` makes small targets at least 32px.

**Accessibility**: skip link, one `h1` per page (a visually hidden one on This or That), `aria-level` fixes for card/Lab headings, `role=tablist/tab/radio` patterns, `aria-live` for feedback, keyboard support for all games, focus ring, `prefers-reduced-motion`. An audit found no missing names, alt text or duplicate ids. Colour contrast was **not** formally measured.

---

## 9. Content inventory and how to add content

| Content | Count | File | Add by |
|---|---|---|---|
| Patterns | 37 (Input 6, Output 3, Control 4, Trust 8, Feedback 2, Agents 9, Voice & vision 5) | `data/patterns.js` + `data/visuals.js` + `data/examples.js` + `data/principles.js` (`patternPrinciples`) | add all four entries; a `demo` is optional (`src/demos/`, registered in `demos/index.js`) |
| Hard pairs | 30 | `data/subtle.js` | `pair(...)` entry |
| Spot-the-flaw screens | 10 | `data/hunts.js` | blocks with `mistake: { text, pattern }` |
| Stories | 4 | `data/story.js` | scenes + endings; export in `stories` |
| Build briefs | 4 | `data/builds.js` | pieces with `need/nice/trap` |
| Power tasks | 21 | `data/autonomy.js` `tasks` | `task(id, text, detail, level, tags, why)`; keep >= 2 per level |
| Teardowns | 4 | `data/teardowns.js` | journey stages with pattern ids |
| Dark patterns | 8 | `data/antipatterns.js` | |
| Glossary | 22 terms | `data/glossary.js` | |
| Deep dives | 9 | `data/lessons.js` | |

After any content change run `npm run validate` (or `npm run check`). It catches typos in pattern ids, stories that lead to missing scenes or loops, unwinnable briefs, a decision without exactly one right option, unknown block types, and leftover text like `undefined`.
The README "Common changes" table lists the exact file for each kind of change.

---

## 10. Quality system: checks and tests

`npm run check` = `lint` + `validate` + `build` + `smoke`.
- **lint** (ESLint 9 + react + react-hooks): unused names, undefined names, hook mistakes. Also runs in CI before the build.
- **validate** (`scripts/validate.mjs`): see section 9.
- **smoke** (`scripts/smoke.mjs`): builds a preview server, opens **every route** (all patterns x 3 views, teardowns, lessons, stories, briefs) on **desktop and a 320px phone**; fails on page errors, console errors, a crash screen, an empty page, or sideways scrolling; taps the first answer in 6 games; then opens 10 pages with **deliberately broken saved data**.

Things the repo does **not** have: unit tests, visual regression, a real-device lab. During development the following one-off checks were run from the scratchpad (not in the repo) and can be recreated when changing risky areas:
- before/after **screenshot comparison** of 76 views for the big refactor (pixel diff);
- a **fuzz** of 14 junk values x 10 storage keys x 10 routes (1,400 loads);
- a **URL fuzz** (49 odd links: bad params, unknown ids, `__proto__`, very long strings, bad encodings);
- **game edge cases** with a fake clock (Speed quit/leave/timeout, midnight rollover, pre-launch date, clipboard blocked);
- **backup** junk codes and round trip; **player card** with the longest name; an **a11y audit** script; a sweep at 320/390/landscape/tablet sizes.

---

## 11. History and decisions

### Timeline (PR numbers on `LKB00/patricka`)
| PR | What |
|---|---|
| #1 | First site + GitHub Pages deploy workflow |
| #2 to #6 | Visual and hands-on patterns (22 patterns, Design Labs, Mistake Hunt); restyles (pastel, minimal, calm docs-style); UX pass |
| #7, #8 | Real examples, principles; research update: agentic patterns, dark patterns, HAX guidelines, glossary |
| #9 | Voice & vision patterns, product teardowns, bias check |
| #10 | "Learning by doing" at the core |
| #11 | Simpler navigation (owner: "I am getting lost... information heavy") |
| #12 | Design Lab rebuilt as a guided step-by-step flow (owner: "your task is confusing") |
| #13 | Turned the site into a playful game (owner: "should not feel like an educational platform") |
| #14 | Daily challenge, Agent on duty story, Hard mode (from research "what else can we add?") |
| #15 | Day streak, daily goal, shareable player card |
| #16 | Speed round, card-flip reveal, first sound/vibration |
| #17 | Build mode, 3 more stories, challenge-a-friend links, installable app (PWA), backup code, link previews (OG image), 2026 patterns, optional stats, "I disagree" links |
| #18 | Phone-specific experience (owner: "mobile experience needs to be mobile specific") |
| #19 | Rich sound effects and haptics, on by default (owner: "sound effect, haptic and all") |
| #20 | Autonomy ladder + "How much power?" game (ideas from aiuxplayground.com research) |
| #21 | Code restructure (CSS split, config registries, shared helpers, ESLint, smoke test, docs) + smooth motion |
| #22 | Edge cases: corrupt saved data crash, clipboard fallbacks, long names, key shortcuts, tap targets, landscape, stronger tests |

### Decisions worth remembering
- **No backend, no accounts.** Progress is per browser; the backup code moves it. Challenge links carry all data in the URL.
- **Hash routing** for static hosting.
- **Games over lessons.** The pattern knowledge is delivered by playing; reading pages live under Explore.
- **Sound and vibration default ON** with a one-time "Turn off" hint and separate switches (owner asked for sound/haptics).
- **Lazy-loading pages was skipped on purpose**: it would break offline use for pages not visited yet, and the whole app is only about 170 KB gzip.
- **Wrong taps cost points** in Speed because random tapping earned big XP in an early version.
- **Free skip day** in the streak so one busy day does not erase weeks of play.
- **Data cleaned on read**, not only on write, because storage can be changed by hand or by old versions.
- **`:where()` for generic motion rules** so component animations are not overridden by the last-loaded file.
- **`:not(.is-good):not(.is-bad)`** is used on `.tot-option` entrance animation so the answer states keep their own animations.
- **Pastel CSS tokens per group** (`--p-input` etc.) colour tiles, badges, tags and the ladder steps; `--p-voice` lives in `explore.css`.
- Past bugs worth not repeating: media query placed before its base rule (overridden); step state named `now` but the styled name is `active`; autofocus on Next scrolled the page (use `focus({ preventScroll: true })`); Enter double-advancing when a button had focus.

---

## 12. Known limits and not-verifiable items

- **Not verified on real devices:** actual audio output, **iPhone haptics** (the `switch` trick), Android vibration feel, installed-app behaviour. The owner was asked to check these on their phone; no reply yet.
- **The live site cannot be opened from the sandbox**, so deploys are confirmed from the workflow result only.
- **Plausible stats are off.** To enable: set the repo variable `VITE_PLAUSIBLE_DOMAIN` (Settings > Secrets and variables > Actions > Variables); see README "Visitor stats (optional)".
- GitHub Pages: set once under Settings > Pages > Source: GitHub Actions (already done).
- Google Fonts load from the internet; offline the browser falls back to system fonts.
- Scroll-reveal uses `animation-timeline: view()` (Chrome 115+, Safari 26+); other browsers simply show everything.
- A player's progress is lost if they clear browser data, unless they made a backup code.
- Date logic uses the visitor's local date, so the Daily changes at their local midnight (people in different time zones can be on different Daily numbers).
- Text content such as product descriptions in teardowns/examples is based on public information and can go out of date (a note on the Teardowns page says so).
- Colour contrast has not been measured with a tool.

---

## 13. Open ideas (backlog)

From the research on aiuxplayground.com (not built yet):
1. **Sandbox Preview pattern**: a new pattern card ("try it safely before it's real"), close to "Preview before apply" but about actions (send, delete, pay).
2. **"Try it" mini demos on every pattern page** (bad vs good, clickable) instead of only 15 demos.
3. **"When NOT to use it" line** on each pattern card (the data already has `avoid[]`; surface it more).
4. **A "Preview the result first" piece** in Build mode (travel and car briefs) and a matching trap.

Other options:
- Turn on Plausible and look at what people play.
- Test sound/haptics on real phones; tune volumes.
- Add unit tests for `progress.js` (XP, streak, clean functions, import) and `lib/random.js`.
- More stories, hard pairs and Spot-the-flaw screens; new pattern groups as the field changes.
- A real contrast check; a screen reader pass on the games.
- Optional: leaderboard-free "friends" features stay link-only (no server) unless the owner decides otherwise.

---

## 14. Keeping this file current

When you finish a session that changes behaviour, **update this file in the same PR**:
- Add a row to the **Timeline** (section 11) and any new **decision**.
- Update counts in sections 1 and 9 and the **routes table** (5.2) if pages changed. `npm run validate` prints the content counts.
- Update XP/levels or game rules (5.3) if scoring changes.
- Move finished items out of the **backlog** (13); add new ideas.
- Update the "Last updated" line at the top.
Also keep `README.md` (feature list, "Common changes") and `CLAUDE.md` (short rules) in step.

---

## 15. Glossary of project words

| Word | Meaning here |
|---|---|
| **Pattern / card** | One AI design pattern (e.g. "Show sources"). Collected as a card by winning its Fix it game. |
| **Fix it / Design Lab / Lab** | The guided step-by-step game on each pattern (`Lab.jsx`). |
| **Spot the flaw / Hunt / Mistake Hunt** | Find hidden mistakes on a fake AI screen (`Hunt.jsx`). |
| **Compare** | The good/bad pair of screens shown on a pattern page. |
| **Mock / block** | Fake app screen and one element of it, drawn from data by `Mock.jsx`. |
| **Move** | Any answer in any game; counts toward the daily goal (10) and the day streak. |
| **Freeze / skip day** | One missed day per 7 that does not break the streak. |
| **Daily** | The once-a-day 5-round challenge, same for everyone. |
| **Seed** | Short text that makes random rounds repeat exactly (Daily, challenge links). |
| **Brief / piece / need / nice / trap** | Build mode: the task, a part you can add, a must-have, a bonus, a common mistake. |
| **Trust** | Story score 0 to 100 (a person's trust in your AI). |
| **Autonomy level** | How much the AI does alone: 1 Suggest, 2 Draft, 3 Confirm, 4 Act & tell, 5 Act alone. |
| **Make live** | Owner's phrase: PR to `main`, merge, confirm the deploy. |
| **Work branch** | `claude/awesome-rubin-9zmea8`. |
| **Reference repos** | `LKB00/refund-agent` and `LKB00/instead-design-assignment`: source of the design language, **read-only**. |
