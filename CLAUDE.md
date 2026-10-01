# Notes for AI assistants working on this repo

- Read README.md → "How the code is organised" and "Common changes" first. Most edits are in `src/data/`.
- Keep one source of truth: menus in `src/config/nav.js`, game tiles in `src/config/games.js`,
  fake-screen builders in `src/mock/blocks.js`, saved progress only through `src/progress.js`.
- Styles: edit the matching file in `src/styles/`. Order in `styles/index.css` matters.
- Before pushing, run `npm run check` (lint + content validation + build + smoke test of every page, desktop and small phone).
- Saved data is cleaned when read (`src/progress.js`). Add new saved fields to the clean functions there, so bad data can never crash a page.
- Copy to clipboard only through `src/lib/clipboard.js` (it has fallbacks).
  In the Claude Code cloud sandbox: `CHROMIUM_PATH=/opt/pw-browsers/chromium npm run check`.
- Write UI text in plain, easy English. Keep it playful, not like a course.
- Never edit the reference repos LKB00/refund-agent or LKB00/instead-design-assignment (read-only).
