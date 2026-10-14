import { useState } from 'react';
import { Copy, Download, Share2 } from 'lucide-react';
import { patterns } from '../data/patterns';
import { archetype, wonGroups } from '../game/archetype';
import { useGameStats, usePassed, useStars, useStreak, useXP } from '../progress';
import { copyText } from '../lib/clipboard';
import LogoMark, { ICON_SVG } from '../components/LogoMark';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTitle } from '../lib/useTitle';

// Player card: your level, AI-designer type, stats and badges on one card
// you can save as an image or share. Built from local progress only.
const DOT = {
  input: '#8fb3d9',
  output: '#a9a3d6',
  control: '#9fbf6a',
  trust: '#e0a77e',
  feedback: '#d99aab',
  agents: '#d2b850',
  voice: '#6fb3ad',
};
const INK = '#24282c';
const LIME = '#c2ef72';
const PAPER = '#fbfbf7';

function readName() {
  try {
    return (localStorage.getItem('player-name') || '').slice(0, 24);
  } catch {
    return '';
  }
}

function useCardData() {
  const passed = usePassed();
  const stars = useStars();
  const stats = useGameStats();
  const { xp, level, levelNum, starTotal } = useXP();
  const { streak } = useStreak();
  return {
    type: archetype(passed, stars),
    groups: wonGroups(passed),
    level,
    levelNum,
    xp,
    stats: [
      ['Cards', `${passed.length}/${patterns.length}`],
      ['Stars', `${starTotal}/${patterns.length * 3}`],
      ['Day streak', String(streak)],
      ['Best streak', String(stats.bestStreak || 0)],
    ],
  };
}

// Draws the same card on a canvas (1080 × 1350, good for LinkedIn and Instagram).
// The app icon (same drawing as components/LogoMark.jsx), top-left at (x, y), size px.
function loadIcon() {
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(ICON_SVG);
  return img.decode().then(() => img, () => null);
}
function drawLogo(g, icon, x, y, size) {
  if (!icon) return;
  g.save();
  g.beginPath();
  g.roundRect(x, y, size, size, size * 0.22);
  g.clip();
  g.drawImage(icon, x, y, size, size);
  g.restore();
  g.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  g.lineWidth = 2;
  g.beginPath();
  g.roundRect(x, y, size, size, size * 0.22);
  g.stroke();
}

// Draw text that shrinks until it fits the width (long names, long type names).
function fillFit(g, text, x, y, maxWidth, weight, size, family, minSize = 24) {
  let s = size;
  g.font = `${weight} ${s}px ${family}`;
  while (s > minSize && g.measureText(text).width > maxWidth) {
    s -= 2;
    g.font = `${weight} ${s}px ${family}`;
  }
  g.fillText(text, x, y);
}

async function drawCard(name, data) {
  await document.fonts?.ready;
  const icon = await loadIcon();
  const W = 1080;
  const H = 1350;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const g = cv.getContext('2d');
  const display = '"Bricolage Grotesque", Lato, system-ui, sans-serif';
  const sans = 'Lato, system-ui, sans-serif';
  const round = (x, y, w, h, r, fill) => {
    g.beginPath();
    g.roundRect(x, y, w, h, r);
    g.fillStyle = fill;
    g.fill();
  };

  round(0, 0, W, H, 64, INK);
  // header
  drawLogo(g, icon, 84, 86, 72);
  g.fillStyle = '#c9ccc4';
  g.font = `700 30px ${sans}`;
  g.fillText('GOOD BOT, BAD BOT · PLAYER CARD', 200, 131);

  // name + type
  g.fillStyle = PAPER;
  fillFit(g, name || 'Player', 84, 290, 912, 800, 64, display);
  g.fillStyle = LIME;
  fillFit(g, data.type.name, 84, 410, 912, 800, 96, display);
  g.fillStyle = '#c9ccc4';
  fillFit(g, data.type.line, 84, 475, 912, 400, 38, sans);

  // level pill
  round(84, 540, 912, 130, 36, '#33383d');
  round(112, 568, 74, 74, 22, LIME);
  g.fillStyle = INK;
  g.font = `800 44px ${display}`;
  g.textAlign = 'center';
  g.fillText(String(data.levelNum), 149, 620);
  g.textAlign = 'left';
  g.fillStyle = PAPER;
  g.font = `800 44px ${display}`;
  g.fillText(data.level.name, 212, 620);
  g.fillStyle = LIME;
  g.textAlign = 'right';
  g.fillText(`${data.xp} XP`, 964, 620);
  g.textAlign = 'left';

  // stats 2 × 2
  data.stats.forEach(([label, value], i) => {
    const x = 84 + (i % 2) * 464;
    const y = 700 + Math.floor(i / 2) * 200;
    round(x, y, 448, 180, 32, '#33383d');
    g.fillStyle = PAPER;
    g.font = `800 72px ${display}`;
    g.fillText(value, x + 36, y + 100);
    g.fillStyle = '#c9ccc4';
    g.font = `400 32px ${sans}`;
    g.fillText(label, x + 36, y + 148);
  });

  // badges
  g.fillStyle = '#c9ccc4';
  g.font = `700 28px ${sans}`;
  g.fillText('BADGES', 84, 1150);
  data.groups.forEach((b, i) => {
    const cx = 108 + i * 84;
    g.beginPath();
    g.arc(cx, 1205, 28, 0, Math.PI * 2);
    if (b.won) {
      g.fillStyle = DOT[b.id];
      g.fill();
    } else {
      g.strokeStyle = '#4a4f55';
      g.lineWidth = 4;
      g.stroke();
    }
  });

  g.fillStyle = '#8d918a';
  g.font = `400 28px ${sans}`;
  g.fillText('gb3.lokeshbhatia.com', 84, 1290);
  g.textAlign = 'right';
  g.fillText(new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }), 996, 1290);
  return cv;
}

// Can this browser share an image file (most phones)? Then sharing is the main button.
function canShareFiles() {
  try {
    return typeof navigator !== 'undefined' && !!navigator.canShare?.({ files: [new File([''], 'card.png', { type: 'image/png' })] });
  } catch {
    return false;
  }
}

export default function PlayerCard() {
  useTitle('Player card');
  const [name, setName] = useState(readName);
  const [shareFiles] = useState(canShareFiles);
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;
  const [msg, setMsg] = useState('');
  const data = useCardData();

  const save = (v) => {
    setName(v);
    try {
      localStorage.setItem('player-name', v);
    } catch {
      /* not saved */
    }
  };
  const flash = (m) => {
    setMsg(m);
    setTimeout(() => setMsg(''), 2200);
  };
  const toBlob = async () => {
    const cv = await drawCard(name.trim(), data);
    return new Promise((res) => cv.toBlob(res, 'image/png'));
  };
  const download = async () => {
    const blob = await toBlob();
    if (!blob) return flash('Couldn’t make the image. Try again?');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'good-bot-bad-bot-player-card.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    flash('Saved! Go show it off.');
  };
  const text = `I’m “${data.type.name}” on Good Bot, Bad Bot: level ${data.levelNum} ${data.level.name}, ${data.xp} XP. What kind of AI designer are you? ${window.location.origin}${window.location.pathname}`;
  const share = async () => {
    try {
      const file = new File([await toBlob()], 'good-bot-bad-bot-player-card.png', { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], text });
      else await navigator.share({ text });
    } catch {
      /* cancelled */
    }
  };
  const copy = async () => {
    if (await copyText(text)) flash('Copied! Paste it anywhere.');
  };

  return (
    <div className="page page-wide">
      <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: 'Player card' }]} />
      <div className="pc-layout">
        <div className="pc-card" aria-label="Your player card">
          <p className="pc-brand"><LogoMark /> GOOD BOT, BAD BOT · PLAYER CARD</p>
          <p className={'pc-name' + (name.trim().length > 16 ? ' is-long' : '')}>{name.trim() || 'Player'}</p>
          <p className="pc-type">{data.type.name}</p>
          <p className="pc-line">{data.type.line}</p>
          <div className="pc-level">
            <span className="pc-level-num">{data.levelNum}</span>
            <strong>{data.level.name}</strong>
            <span className="pc-xp">{data.xp} XP</span>
          </div>
          <div className="pc-stats">
            {data.stats.map(([label, value]) => (
              <div key={label}><strong>{value}</strong><span>{label}</span></div>
            ))}
          </div>
          <p className="pc-label">Badges</p>
          <div className="pc-badges">
            {data.groups.map((b) => (
              <span key={b.id} className={'pc-badge' + (b.won ? ' is-won' : '')} style={b.won ? { background: DOT[b.id] } : undefined} title={`${b.name}${b.won ? ' · won' : ''}`} />
            ))}
          </div>
        </div>

        {/* On phones the name and Share/Save come right after the title, above the card, so no scrolling is needed. */}
        <h1 className="display pc-title">Your player card</h1>
        <p className="lead pc-lead">What kind of AI designer are you? Your title comes from the cards you collect most. Play more and watch it change.</p>
        <div className="pc-actions">
          <label className="pc-field">
            <span className="label">Name on the card</span>
            <input value={name} maxLength={24} placeholder="Your name" onChange={(e) => save(e.target.value)} />
          </label>
          <div className="row wrap">
            {shareFiles ? (
              <>
                <button type="button" className="btn btn-primary btn-lg" onClick={share}>
                  <Share2 size={15} strokeWidth={1.75} aria-hidden /> Share image
                </button>
                <button type="button" className="btn btn-ghost btn-lg" onClick={download}>
                  <Download size={15} strokeWidth={1.75} aria-hidden /> Save
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-primary btn-lg" onClick={download}>
                  <Download size={15} strokeWidth={1.75} aria-hidden /> Save image
                </button>
                {canShare && (
                  <button type="button" className="btn btn-ghost btn-lg" onClick={share}>
                    <Share2 size={15} strokeWidth={1.75} aria-hidden /> Share
                  </button>
                )}
              </>
            )}
            <button type="button" className="btn btn-ghost btn-lg" onClick={copy}>
              <Copy size={15} strokeWidth={1.75} aria-hidden /> Copy text
            </button>
          </div>
          <p className="small muted" role="status">{msg || 'It’s made on your device. Nothing is uploaded.'}</p>
        </div>
      </div>
    </div>
  );
}
