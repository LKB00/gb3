// Makes the brand images in public/ from one drawing, so the logo can change in one place:
//   icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png, og.png (link preview, 1200x630)
// Run: npm run brand   (needs Chromium; in the cloud sandbox: CHROMIUM_PATH=/opt/pw-browsers/chromium npm run brand)
// The logo drawing is the same as src/components/LogoMark.jsx and the favicon in index.html.
// Fonts: uses Bricolage Grotesque if installed, else the system sans font.
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';

const OUT = fileURLToPath(new URL('../public/', import.meta.url));
const INK = '#24282c';
const LIME = '#c2ef72';
const logo = (gap) => `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto">
  <circle cx="12" cy="12" r="10" fill="${LIME}" stroke="${gap}" stroke-width="1"/>
</svg>`;

// App icon: dark tile with the logo. `round` = rounded corners with see-through outside; `scale` = logo width as a share of the tile.
const icon = (size, { round, scale }) => ({
  size: [size, size],
  transparent: !!round,
  html: `<body style="margin:0"><div style="width:${size}px;height:${size}px;background:${INK};${round ? `border-radius:${Math.round(size * 0.22)}px;` : ''}display:grid;place-items:center">
    <div style="width:${Math.round(size * scale)}px">${logo(INK)}</div></div></body>`,
});


const og = {
  size: [1200, 630],
  html: `<body style="margin:0;width:1200px;height:630px;background:#fbfbf7;font-family:'Bricolage Grotesque','DejaVu Sans',sans-serif;position:relative;overflow:hidden">
    <div style="position:absolute;left:72px;top:52px;display:flex;align-items:center;gap:14px;color:#24282c;font-weight:700;font-size:32px;letter-spacing:-0.01em">
      <div style="width:42px;height:42px;border-radius:50%;background:${LIME};border:2px solid ${INK}"></div>AI Patterns</div>
    <div style="position:absolute;left:72px;top:160px;width:620px;color:#24282c;font-weight:700;font-size:64px;line-height:72px">Quick games about AI interaction design.</div>
    <div style="position:absolute;left:72px;top:428px;width:620px;color:#4b4f53;font-size:24px;line-height:34px">Spot good AI design, collect pattern cards, keep your streak.</div>
    <div style="position:absolute;left:72px;top:518px;display:flex;gap:12px">${['This or That', 'Daily', 'Speed round'].map((t) => `<span style="background:#e8e8f0;color:#24282c;font-weight:700;font-size:18px;border-radius:8px;padding:10px 18px">${t}</span>`).join('')}</div></body>`,
};

const jobs = {
  'icon-192.png': icon(192, { round: true, scale: 0.62 }),
  'icon-512.png': icon(512, { round: true, scale: 0.62 }),
  'icon-maskable-512.png': icon(512, { round: false, scale: 0.5 }),
  'apple-touch-icon.png': icon(180, { round: false, scale: 0.6 }),
  'og.png': og,
};

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
for (const [file, job] of Object.entries(jobs)) {
  const page = await browser.newPage({ viewport: { width: job.size[0], height: job.size[1] } });
  await page.setContent(job.html);
  await page.screenshot({ path: OUT + file, omitBackground: !!job.transparent });
  await page.close();
  console.log('wrote public/' + file);
}
await browser.close();
