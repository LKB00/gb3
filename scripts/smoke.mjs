// Smoke test: opens every page of the built site in a real browser (desktop and
// phone size) and fails if any page crashes, logs an error or scrolls sideways.
// Run with `npm run check` (lint + build + this). Takes about a minute.
// New patterns, teardowns, lessons, stories and briefs are picked up automatically.
import { preview } from 'vite';
import { chromium } from 'playwright';
import { patterns } from '../src/data/patterns.js';
import { teardowns } from '../src/data/teardowns.js';
import { lessons } from '../src/data/lessons.js';
import { stories } from '../src/data/story.js';
import { builds } from '../src/data/builds.js';

const routes = [
  '/', '/me', '/play', '/play/this-or-that', '/play/this-or-that?mode=hard', '/play/spot-the-flaw', '/play/daily',
  '/play/story', '/play/card', '/play/speed', '/play/build', '/play/power', '/patterns', '/principles',
  '/anti-patterns', '/glossary', '/teardowns', '/learn', '/autonomy', '/does-not-exist',
  ...patterns.flatMap((p) => [`/patterns/${p.id}`, `/patterns/${p.id}?view=understand`, `/patterns/${p.id}?view=reference`]),
  ...teardowns.map((t) => `/teardowns/${t.id}`),
  ...lessons.map((l) => `/learn/${l.id}`),
  ...stories.map((s) => `/play/story/${s.id}`),
  ...builds.map((b) => `/play/build?brief=${b.id}`),
];

// A first tap in each game, to catch crashes after the first answer.
const taps = [
  ['/play/this-or-that', '.tot-option'],
  ['/play/power', '.power-opt'],
  ['/play/build', '.build-piece'],
  ['/play/story/tidy', '.story-choice'],
  ['/play/spot-the-flaw', '.mb-click'],
  ['/patterns/citations', '.lab-opt'],
];

const server = await preview({ preview: { port: 4174, strictPort: true }, logLevel: 'silent' });
const base = 'http://localhost:4174/#';
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const problems = [];

for (const [name, viewport] of [['desktop', { width: 1280, height: 860 }], ['phone', { width: 360, height: 760 }]]) {
  const ctx = await browser.newContext({ viewport, serviceWorkers: 'block', isMobile: name === 'phone', hasTouch: name === 'phone' });
  const page = await ctx.newPage();
  let where = '';
  page.on('pageerror', (e) => problems.push(`${name} ${where}: ${e.message}`));
  page.on('console', (m) => {
    // Web fonts can't load without internet; that's not a site bug.
    if (m.type() === 'error' && !/net::ERR|fonts\.g/.test(m.text())) problems.push(`${name} ${where}: ${m.text()}`);
  });
  const visit = async (route) => {
    where = route;
    await page.goto(base + route);
    await page.waitForSelector('#main');
    if (await page.locator('#main').innerText().then((t) => t.trim() === '')) problems.push(`${name} ${route}: empty page`);
    const extra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (extra > 1) problems.push(`${name} ${route}: scrolls sideways by ${extra}px`);
  };
  for (const r of routes) await visit(r);
  for (const [r, sel] of taps) {
    await visit(r);
    where = `${r} (tap ${sel})`;
    await page.locator(sel).first().click();
    await page.waitForTimeout(200);
  }
  await ctx.close();
}

await browser.close();
await new Promise((r) => server.httpServer.close(r));
console.log(`Checked ${routes.length} pages and ${taps.length} game taps, on desktop and phone.`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n- ` + problems.join('\n- '));
  process.exit(1);
}
console.log('All good.');
