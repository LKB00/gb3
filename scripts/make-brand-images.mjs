// Makes the brand images in public/ from one drawing, so the logo can change in one place:
//   icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png, og.png (link preview, 1200x630)
// Run: npm run brand   (needs Chromium; in the cloud sandbox: CHROMIUM_PATH=/opt/pw-browsers/chromium npm run brand)
// The share image header uses the lime-circle logo (same as src/components/LogoMark.jsx and the favicon in index.html).
// The app icons use the "Two answers" drawing below (appIcon). An unused backup idea is in design/backup-icons/.
// Fonts: uses Bricolage Grotesque if installed, else the system sans font.
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';

const OUT = fileURLToPath(new URL('../public/', import.meta.url));
const INK = '#24282c';
const LIME = '#c2ef72';
const logo = (gap) => `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto">
  <circle cx="12" cy="12" r="10" fill="${LIME}" stroke="${gap}" stroke-width="1"/>
</svg>`;

const CORAL = '#f6a5a0';
// App icon "Two answers": a bad answer (coral, cross) behind a good one (lime, tick). Needs no fonts.
// `k` scales the drawing about the centre (1.16 normal; 0.84 keeps it inside the Android maskable safe zone).
const appIcon = (k) => `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:100%"><rect width="1024" height="1024" fill="${INK}"/>
<g transform="translate(512 512) scale(${k}) translate(-512 -512) translate(0 34)">
  <rect x="430" y="150" width="440" height="330" rx="110" fill="${CORAL}"/>
  <polygon points="600,470 800,610 770,470" fill="${CORAL}"/>
  <path d="M628 255 L738 365 M738 255 L628 365" fill="none" stroke="${INK}" stroke-width="64" stroke-linecap="round"/>
  <g stroke="${INK}" stroke-width="34" stroke-linejoin="round">
    <rect x="150" y="360" width="440" height="330" rx="110" fill="${LIME}"/>
    <polygon points="265,680 195,810 410,680" fill="${LIME}"/>
  </g>
  <rect x="167" y="377" width="406" height="296" rx="93" fill="${LIME}"/>
  <polygon points="277,668 212,780 392,668" fill="${LIME}"/>
  <path d="M262 528 L340 606 L482 442" fill="none" stroke="${INK}" stroke-width="68" stroke-linecap="round" stroke-linejoin="round"/>
</g></svg>`;

// `round` = rounded corners with see-through outside (the OS rounds the others); `k` = drawing scale (see appIcon).
const icon = (size, { round, k }) => ({
  size: [size, size],
  transparent: !!round,
  html: `<body style="margin:0"><div style="width:${size}px;height:${size}px;overflow:hidden;${round ? `border-radius:${Math.round(size * 0.22)}px;` : ''}">${appIcon(k)}</div></body>`,
});

const card = (rot, bg, dot, dotText, title, body) => `
  <div style="transform:rotate(${rot}deg);background:${bg};border-radius:28px;padding:22px 24px;width:400px;box-sizing:border-box">
    <div style="display:flex;align-items:center;gap:12px;font-weight:800;font-size:25px;color:#24282c"><span style="width:34px;height:34px;border-radius:50%;background:${dot};color:#fff;display:grid;place-items:center;font-size:20px">${dotText}</span>${title}</div>
    <div style="background:#fff;border-radius:18px;padding:16px 18px;margin-top:14px;font-size:23px;line-height:34px;color:#4b4f53">${body}</div></div>`;

const og = {
  size: [1200, 630],
  html: `<body style="margin:0;width:1200px;height:630px;background:${INK};font-family:'Bricolage Grotesque','DejaVu Sans',sans-serif;position:relative;overflow:hidden">
    <div style="position:absolute;left:72px;top:52px;display:flex;align-items:center;gap:20px;color:#c9ccc4;font-weight:800;font-size:27px;letter-spacing:0.05em">
      <div style="width:96px">${logo(INK)}</div>GOOD BOT, BAD BOT</div>
    <div style="position:absolute;left:72px;top:140px;width:620px;color:#fbfbf7;font-weight:800;font-size:84px;line-height:92px">Can you spot good AI design?</div>
    <div style="position:absolute;left:72px;top:432px;width:620px;color:#c9ccc4;font-size:25px;line-height:34px">Quick games about AI interaction design. Play, collect cards, keep your streak.</div>
    <div style="position:absolute;left:72px;top:536px;display:flex;gap:14px">${['This or That', 'Daily', 'Speed round', 'Stories'].map((t) => `<span style="background:#32373c;color:#fbfbf7;font-weight:800;font-size:22px;border-radius:999px;padding:12px 22px">${t}</span>`).join('')}</div>
    <div style="position:absolute;left:722px;top:112px;display:flex;flex-direction:column;gap:22px">
      ${card(-2, '#fae6e4', '#c1443a', '✕', 'No sources', 'Churn rose 4% after the pricing change.')}
      ${card(2, '#edf3dc', '#5a7a1f', '✓', 'Shows sources', 'Churn rose 4% after the pricing change <b style="background:#e8e8f0;border-radius:6px;padding:0 8px">1</b>')}
    </div></body>`,
};

const jobs = {
  'icon-192.png': icon(192, { round: true, k: 1.16 }),
  'icon-512.png': icon(512, { round: true, k: 1.16 }),
  'icon-maskable-512.png': icon(512, { round: false, k: 0.84 }),
  'apple-touch-icon.png': icon(180, { round: false, k: 1.16 }),
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
