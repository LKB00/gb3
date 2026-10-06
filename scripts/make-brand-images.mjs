// Makes the brand images in public/ from one drawing, so the logo can change in one place:
//   icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png, favicon.svg, favicon-32.png, og.png (link preview, 1200x630)
// Run: npm run brand   (needs Chromium; in the cloud sandbox: CHROMIUM_PATH=/opt/pw-browsers/chromium npm run brand)
// The app icons, tab icon and share image all use the "Two answers" drawing below (appIcon). The in-app logo
// (src/components/LogoMark.jsx) is the lime circle and is not made here. An unused backup idea is in design/backup-icons/.
// Fonts: the share image embeds Bricolage Grotesque and Lato from design/fonts/, so no font needs to be installed.
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import fs from 'fs';

const OUT = fileURLToPath(new URL('../public/', import.meta.url));
const INK = '#24282c';
const LIME = '#c2ef72';

const CORAL = '#f6a5a0';
// App icon "Two answers": a bad answer (coral, cross) behind a good one (lime, tick). Needs no fonts.
// `k` scales the drawing about the centre (1.16 normal; 0.84 keeps it inside the Android maskable safe zone).
const appIcon = (k, rx = 0) => `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:100%"><rect width="1024" height="1024" rx="${rx}" fill="${INK}"/>
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

// Brand fonts are embedded (design/fonts, OFL licence), so the share image looks the same on any machine.
const font = (file) => fs.readFileSync(fileURLToPath(new URL('../design/fonts/' + file, import.meta.url))).toString('base64');
const fontCss = `
  @font-face{font-family:'Bricolage Grotesque';font-weight:800;src:url(data:font/woff2;base64,${font('bricolage-grotesque-latin-800-normal.woff2')}) format('woff2')}
  @font-face{font-family:Lato;font-weight:400;src:url(data:font/woff2;base64,${font('lato-latin-400-normal.woff2')}) format('woff2')}
  @font-face{font-family:Lato;font-weight:700;src:url(data:font/woff2;base64,${font('lato-latin-700-normal.woff2')}) format('woff2')}`;

// One answer card: a bad (coral, cross) or good (lime, tick) AI answer to the same question.
const card = ({ rot, bg, mark, title, body, x, y, z }) => `
  <div style="position:absolute;left:${x}px;top:${y}px;z-index:${z};transform:rotate(${rot}deg);background:${bg};border-radius:34px;padding:24px 26px 26px;width:420px;box-sizing:border-box;box-shadow:0 0 0 8px ${INK}">
    <div style="display:flex;align-items:center;gap:14px;font-family:'Bricolage Grotesque';font-weight:800;font-size:32px;color:${INK}">
      <span style="width:44px;height:44px;border-radius:50%;background:${INK};display:grid;place-items:center">${mark}</span>${title}</div>
    <div style="background:#fff;border-radius:20px;padding:18px 20px;margin-top:16px;font-family:Lato;font-size:28px;line-height:38px;color:#3b3f43">${body}</div></div>`;
const tick = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${LIME}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l5 5L19.5 7"/></svg>`;
const cross = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${CORAL}" stroke-width="3.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`;

const og = {
  size: [1200, 630],
  html: `<body style="margin:0;width:1200px;height:630px;background:${INK};position:relative;overflow:hidden"><style>${fontCss}</style>
    <div style="position:absolute;left:72px;top:58px;display:flex;align-items:center;gap:22px">
      <div style="width:92px;height:92px">${appIcon(1.16, 225)}</div>
      <div style="font-family:'Bricolage Grotesque';font-weight:800;font-size:44px;color:#fbfbf7;letter-spacing:-0.01em">Good Bot, Bad Bot</div></div>
    <div style="position:absolute;left:72px;top:186px;width:640px;font-family:'Bricolage Grotesque';font-weight:800;font-size:94px;line-height:98px;letter-spacing:-0.02em;color:#fbfbf7">Can you spot <span style="color:${LIME}">good</span> AI design?</div>
    <div style="position:absolute;left:72px;top:494px;width:640px;font-family:Lato;font-weight:400;font-size:29px;line-height:40px;color:#c9ccc4;white-space:nowrap">Quick games. Collect cards. Keep your streak.</div>
    <div style="position:absolute;left:72px;top:550px;font-family:Lato;font-weight:700;font-size:27px;color:${LIME};letter-spacing:0.01em">gb3.lokeshbhatia.com</div>
    ${card({ rot: -2.5, bg: CORAL, mark: cross, title: 'No sources', body: 'Churn rose 4% after the pricing change.', x: 718, y: 70, z: 1 })}
    ${card({ rot: 2, bg: LIME, mark: tick, title: 'Shows sources', body: `Churn rose 4% after the pricing change <b style="background:#e8e8f0;border-radius:8px;padding:0 10px;font-size:24px">1</b>`, x: 748, y: 318, z: 2 })}
  </body>`,
};

const jobs = {
  'icon-192.png': icon(192, { round: true, k: 1.16 }),
  'icon-512.png': icon(512, { round: true, k: 1.16 }),
  'icon-maskable-512.png': icon(512, { round: false, k: 0.84 }),
  'apple-touch-icon.png': icon(180, { round: false, k: 1.16 }),
  'favicon-32.png': icon(32, { round: true, k: 1.16 }),
  'og.png': og,
};

// Browser-tab icon: the same drawing as a rounded tile, as SVG (sharp at any size). favicon-32.png above is the fallback.
fs.writeFileSync(OUT + 'favicon.svg', appIcon(1.16, 225).replace(' style="display:block;width:100%;height:100%"', ''));
console.log('wrote public/favicon.svg');

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
for (const [file, job] of Object.entries(jobs)) {
  const page = await browser.newPage({ viewport: { width: job.size[0], height: job.size[1] } });
  await page.setContent(job.html);
  await page.screenshot({ path: OUT + file, omitBackground: !!job.transparent });
  await page.close();
  console.log('wrote public/' + file);
}
await browser.close();
