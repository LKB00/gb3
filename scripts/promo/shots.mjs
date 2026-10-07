// Step 1 of the promo video: real phone screenshots of the built site (run `npm run build` first).
// Size 393x764 = an iPhone screen (393x852) minus the status bar (54) and home bar (34) that promo.html draws.
// Saves PNGs to scripts/promo/shots/ (not committed). Used by promo.html. See scripts/promo/README.md.
import { preview } from 'vite';
import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT = 'scripts/promo/shots';
fs.mkdirSync(OUT, { recursive: true });
const font = (n) => fs.readFileSync('design/fonts/' + n).toString('base64');
const css = `@font-face{font-family:'Bricolage Grotesque';font-weight:200 800;src:url(data:font/woff2;base64,${font('bricolage-grotesque-latin-800-normal.woff2')})}
@font-face{font-family:Lato;font-weight:400;src:url(data:font/woff2;base64,${font('lato-latin-400-normal.woff2')})}
@font-face{font-family:Lato;font-weight:700 900;src:url(data:font/woff2;base64,${font('lato-latin-700-normal.woff2')})}
*{transition:none!important;animation-duration:0s!important} .sound-hint{display:none!important}`;

const server = await preview({ preview: { port: 4190 }, logLevel: 'silent' });
const base = `${server.resolvedUrls.local[0]}#`;
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await browser.newContext({ viewport: { width: 393, height: 764 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, serviceWorkers: 'block', colorScheme: 'light' });
const page = await ctx.newPage();

// A player who has played a bit: streak, XP, some cards won in the Trust group.
await page.goto(base + '/');
await page.evaluate(() => {
  const days = {};
  for (let i = 0; i < 12; i++) { const d = new Date(); d.setDate(d.getDate() - i); days[d.toISOString().slice(0, 10)] = 6; }
  localStorage.setItem('days', JSON.stringify(days));
  localStorage.setItem('labs-passed', JSON.stringify(['citations', 'confidence-signals', 'ai-disclosure', 'set-expectations', 'explain-why', 'stop-and-undo', 'plan-first', 'action-approval', 'prompt-starters']));
  localStorage.setItem('player-name', 'Alex');
  localStorage.setItem('game-stats', JSON.stringify({ bestStreak: 14, speedBest: 42, powerBest: 13 }));
});

const open = async (route) => {
  await page.goto(base + route);
  await page.reload();
  await page.addStyleTag({ content: css });
  await page.waitForTimeout(700);
};
for (const [name, route] of [['home', '/'], ['play', '/play'], ['speed', '/play/speed'], ['build', '/play/build'], ['power', '/play/power'], ['story', '/play/story/tidy'], ['pattern', '/patterns/citations']]) {
  await open(route);
  await page.screenshot({ path: `${OUT}/${name}.png` });
}

// This or That: before the tap, and after tapping A when A is right (pairs are random, so retry).
for (let i = 0; i < 20; i++) {
  await open('/play/this-or-that');
  await page.screenshot({ path: `${OUT}/tot.png` });
  // Where answer A is, so the video's tap lands on it.
  const a = await page.locator('.tot-option').first().boundingBox();
  fs.writeFileSync(`${OUT}/meta.js`, `window.SHOTS = ${JSON.stringify({ tapA: { x: a.x + a.width / 2, y: a.y + a.height / 2 } })};\n`);
  await page.locator('.tot-option').first().click();
  await page.waitForTimeout(500);
  if (await page.getByText('Nice pick.').count()) {
    await page.screenshot({ path: `${OUT}/tot-tap.png` });
    break;
  }
}

await open('/play/card');
await page.locator('.pc-card').screenshot({ path: `${OUT}/card.png` });

await browser.close();
server.httpServer.close();
console.log('Screenshots saved to', OUT);
