# Notes for AI assistants working on this repo

**Start with [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md).** It has the full context: what the site is, the owner's preferences,
how to ship ("Make live"), the exact game rules, architecture, decisions, known limits and open ideas.

Short rules:
- The owner prefers **easy English** in replies (short sentences, simple words).
- Work only on branch `claude/awesome-rubin-9zmea8`. Make a PR and merge only when the owner says **"Make live"** (or asks for a PR).
- **Never edit** the reference repos `LKB00/refund-agent` and `LKB00/instead-design-assignment` (read-only; copying ideas is fine).
- Read README.md → "How the code is organised" and "Common changes" first. Most edits are in `src/data/`.
- Keep one source of truth: menus in `src/config/nav.js`, game tiles in `src/config/games.js`,
  fake-screen builders in `src/mock/blocks.js`, saved progress only through `src/progress.js`.
- Styles: edit the matching file in `src/styles/`. Order in `styles/index.css` matters.
- Before pushing, run `npm run check` (lint + content validation + build + smoke test of every page, desktop and small phone).
  In the Claude Code cloud sandbox: `CHROMIUM_PATH=/opt/pw-browsers/chromium npm run check`.
- Saved data is cleaned when read (`src/progress.js`). Add new saved fields to the clean functions there, so bad data can never crash a page.
- Copy to clipboard only through `src/lib/clipboard.js` (it has fallbacks).
- Write UI text in plain, easy English. Keep it playful, not like a course.
- Update `docs/PROJECT_CONTEXT.md` in the same PR when behaviour, rules or counts change.
