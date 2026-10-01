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

// Any free port, so a preview you already have running doesn't get in the way.
const server = await preview({ preview: { port: 4180 }, logLevel: 'silent' });
const base = `${server.resolvedUrls.local[0]}#`;
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const problems = [];

// Saved data that is the wrong shape must never break the site.
const brokenSaves = {
  'labs-passed': '123', 'hunts-done': '{}', 'lab-stars': '[1,2]', 'game-stats': '{"bestStreak":"x","builds":5,"speedBest":-1}',
  daily: '{"2026-10-01":"yes"}', days: '[]', 'player-name': '{"a":1}',
};
const savedRoutes = ['/', '/me', '/play', '/play/daily', '/play/card', '/play/speed', '/play/power', '/play/story', '/patterns', '/patterns/citations'];

for (const [name, viewport] of [['desktop', { width: 1280, height: 860 }], ['phone', { width: 320, height: 640 }]]) {
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
    // Hash links don't reload the page. A new path remounts .route (mark the old one and wait for
    // the new one); a query-only change (?view=) updates in place, so just give React a moment.
    const samePath = new URL(page.url()).hash.split('?')[0] === `#${route.split('?')[0]}`;
    if (!samePath) await page.evaluate(() => document.querySelector('.route')?.setAttribute('data-old', '1')).catch(() => {});
    await page.goto(base + route);
    if (!samePath) await page.waitForSelector('.route:not([data-old])', { timeout: 5000 }).catch(() => {});
    await page.waitForSelector('#main');
    await page.waitForTimeout(120);
    if (await page.locator('.crash').count()) problems.push(`${name} ${route}: crash screen shown`);
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
    if (await page.locator('.crash').count()) problems.push(`${name} ${r}: crash screen after tapping ${sel}`);
  }
  if (name === 'phone') {
    // A long streak and big XP make the top bar's right side wide; it must still fit on screen.
    await page.evaluate(() => {
      const days = {};
      for (let i = 0; i < 150; i++) { const d = new Date(); d.setDate(d.getDate() - i); days[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`] = 12; }
      localStorage.clear();
      localStorage.setItem('days', JSON.stringify(days));
      localStorage.setItem('game-stats', JSON.stringify({ bestStreak: 300, speedBest: 500, powerBest: 16 }));
    });
    await page.reload();
    await visit('/');
    await page.waitForTimeout(900); // numbers roll up
    const edge = await page.evaluate(() => Math.round(document.querySelector('.topnav-right').getBoundingClientRect().right - window.innerWidth));
    if (edge > 0) problems.push(`phone top bar: streak and XP pills run ${edge}px off the screen with big numbers`);
    await page.evaluate((saves) => { localStorage.clear(); for (const k in saves) localStorage.setItem(k, saves[k]); }, brokenSaves);
    await page.reload();
    for (const r of savedRoutes) await visit(r);
    await page.evaluate(() => localStorage.clear());
  }
  await ctx.close();
}

await browser.close();
await new Promise((r) => server.httpServer.close(r));
console.log(`Checked ${routes.length} pages, ${taps.length} game taps and ${savedRoutes.length} pages with broken saved data, on desktop and a small phone.`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n- ` + problems.join('\n- '));
  process.exit(1);
}
console.log('All good.');
