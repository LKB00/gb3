// Step 2 of the promo video: renders promo.html frame by frame and makes an MP4 with ffmpeg.
//   node scripts/promo/render.mjs            -> design/video/gb3-promo.mp4 (1080x1920, 30 fps)
//   node scripts/promo/render.mjs 2.5 14.8   -> only still frames at those seconds (for checking), in scripts/promo/stills/
// Needs Chromium (CHROMIUM_PATH in the cloud sandbox) and ffmpeg. Run shots.mjs first. See scripts/promo/README.md.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const FPS = 30;
const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const stills = process.argv.slice(2).map(Number);

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.on('pageerror', (e) => { console.error(e); process.exit(1); });
await page.goto('file://' + here('promo.html') + '?render');
await page.evaluate(() => window.ready);
const duration = await page.evaluate(() => window.DURATION);
const frame = async (t) => {
  await page.evaluate((s) => window.render(s), t);
  return page.screenshot({ type: 'png' });
};

if (stills.length) {
  fs.mkdirSync(here('stills'), { recursive: true });
  for (const t of stills) fs.writeFileSync(here(`stills/${t}.png`), await frame(t));
  console.log('Stills saved to scripts/promo/stills/');
} else {
  const out = here('../../design/video/gb3-promo.mp4');
  fs.mkdirSync(here('../../design/video'), { recursive: true });
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const total = Math.round(duration * FPS);
  for (let i = 0; i < total; i++) {
    const buf = await frame(i / FPS);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 60 === 0) process.stdout.write(`\rframe ${i}/${total}`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  console.log(`\nSaved ${out}`);
}
await browser.close();
