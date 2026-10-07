// Step 3 of the promo video: renders promo.html frame by frame, then adds the sound (sound.mjs) with ffmpeg.
//   node scripts/promo/render.mjs                -> design/video/gb3-promo.mp4         (1080x1920, Reels/Shorts)
//   node scripts/promo/render.mjs --square       -> design/video/gb3-promo-square.mp4  (1080x1080, LinkedIn feed)
//   node scripts/promo/render.mjs --sound-only   -> only re-adds the sound to the last render (fast; add --square for that one)
//   node scripts/promo/render.mjs 2.5 14.8       -> only still frames at those seconds, in scripts/promo/stills/ (add --square too)
// Needs Chromium (CHROMIUM_PATH in the cloud sandbox) and ffmpeg. Run shots.mjs and sound.mjs first. See scripts/promo/README.md.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const FPS = 30;
const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const args = process.argv.slice(2);
const square = args.includes('--square');
const soundOnly = args.includes('--sound-only');
const stills = args.filter((a) => !a.startsWith('--')).map(Number);
const name = square ? 'gb3-promo-square' : 'gb3-promo';
const size = square ? { width: 1080, height: 1080 } : { width: 1080, height: 1920 };
fs.mkdirSync(here('out'), { recursive: true });
const silent = here(`out/${name}-silent.mp4`);
const final = here(`../../design/video/${name}.mp4`);
const audio = here('out/sound.wav');

const ffmpeg = (list, opts) => {
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', ...list], opts);
  return { ff, done: new Promise((res, rej) => ff.on('close', (c) => (c ? rej(new Error('ffmpeg failed')) : res()))) };
};

if (!soundOnly) {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: size });
  page.on('pageerror', (e) => { console.error(e); process.exit(1); });
  await page.goto('file://' + here('promo.html') + '?render' + (square ? '&square' : ''));
  await page.evaluate(() => window.ready);
  const duration = await page.evaluate(() => window.DURATION);
  const frame = async (t) => {
    await page.evaluate((s) => window.render(s), t);
    return page.screenshot({ type: 'png' });
  };

  if (stills.length) {
    fs.mkdirSync(here('stills'), { recursive: true });
    for (const t of stills) fs.writeFileSync(here(`stills/${square ? 'square-' : ''}${t}.png`), await frame(t));
    console.log('Stills saved to scripts/promo/stills/');
    await browser.close();
    process.exit(0);
  }

  const { ff, done } = ffmpeg(['-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-pix_fmt', 'yuv420p', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
  const total = Math.round(duration * FPS);
  for (let i = 0; i < total; i++) {
    const buf = await frame(i / FPS);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 60 === 0) process.stdout.write(`\rframe ${i}/${total}`);
  }
  ff.stdin.end();
  await done;
  await browser.close();
  console.log('');
}

// Add the sound (if sound.mjs has made it). The video is copied as is, so this is quick.
fs.mkdirSync(here('../../design/video'), { recursive: true });
const withSound = fs.existsSync(audio)
  ? ['-i', silent, '-i', audio, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest']
  : ['-i', silent, '-c:v', 'copy'];
await ffmpeg([...withSound, '-movflags', '+faststart', final], { stdio: 'inherit' }).done;
console.log(`Saved ${final}${fs.existsSync(audio) ? ' (with sound)' : ' (no sound: run sound.mjs first)'}`);
