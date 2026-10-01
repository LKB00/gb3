import { useState } from 'react';
import { Copy, Download, Share2 } from 'lucide-react';
import { patterns } from '../data/patterns';
import { archetype, wonGroups } from '../game/archetype';
import { useGameStats, usePassed, useStars, useStreak, useXP } from '../progress';
import { copyText } from '../lib/clipboard';
import LogoMark from '../components/LogoMark';
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
    return localStorage.getItem('player-name') || '';
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
      ['Stars', String(starTotal)],
      ['Day streak', String(streak)],
      ['Best run', String(stats.bestStreak || 0)],
    ],
  };
}

// Draws the same card on a canvas (1080 × 1350, good for LinkedIn and Instagram).
// The two-bot logo (same drawing as components/LogoMark.jsx), top-left at (x, y), scaled.
function drawLogo(g, x, y, k) {
  const c = (cx, cy, r, fill) => { g.beginPath(); g.arc(x + cx * k, y + cy * k, r * k, 0, Math.PI * 2); g.fillStyle = fill; g.fill(); };
  const curve = (x1, y1, cx, cy, x2, y2) => { g.beginPath(); g.moveTo(x + x1 * k, y + y1 * k); g.quadraticCurveTo(x + cx * k, y + cy * k, x + x2 * k, y + y2 * k); g.stroke(); };
  const line = (x1, y1, x2, y2) => { g.beginPath(); g.moveTo(x + x1 * k, y + y1 * k); g.lineTo(x + x2 * k, y + y2 * k); g.stroke(); };
  c(13, 14, 12, LIME);
  c(31, 14, 13, INK); // dark gap between the bots
  c(31, 14, 12, '#f6a5a0');
  for (const [cx, cy] of [[9.5, 12], [16.5, 12], [27.5, 12.5], [34.5, 12.5]]) c(cx, cy, 1.8, INK);
  g.strokeStyle = INK;
  g.lineWidth = 2 * k;
  g.lineCap = 'round';
  curve(8.5, 17, 13, 21.6, 17.5, 17);
  curve(26.5, 20.8, 31, 16.2, 35.5, 20.8);
  line(26.2, 8.4, 29.6, 10.2);
  line(35.8, 8.4, 32.4, 10.2);
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
  drawLogo(g, 84, 96, 2.1);
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
  g.fillText('lkb00.github.io/patricka', 84, 1290);
  g.textAlign = 'right';
  g.fillText(new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }), 996, 1290);
  return cv;
}

export default function PlayerCard() {
  useTitle('Player card');
  const [name, setName] = useState(readName);
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
    if (!blob) return flash('Could not make the image');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'good-bot-bad-bot-player-card.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    flash('Image saved');
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
    if (await copyText(text)) flash('Text copied');
  };

  return (
    <div className="page page-wide">
      <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: 'Player card' }]} />
      <div className="pc-layout">
        <div className="pc-card" aria-label="Your player card">
          <p className="pc-brand"><LogoMark /> GOOD BOT, BAD BOT · PLAYER CARD</p>
          <p className="pc-name">{name.trim() || 'Player'}</p>
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

        <div className="pc-side">
          <h1 className="display">Your player card</h1>
          <p className="lead">What kind of AI designer are you? Your type comes from the group you’ve mastered most, so it changes as you play.</p>
          <label className="pc-field">
            <span className="label">Name on the card</span>
            <input value={name} maxLength={24} placeholder="Player" onChange={(e) => save(e.target.value)} />
          </label>
          <div className="row wrap">
            <button type="button" className="btn btn-primary btn-lg" onClick={download}>
              <Download size={15} strokeWidth={1.75} aria-hidden /> Save image
            </button>
            {typeof navigator !== 'undefined' && navigator.share && (
              <button type="button" className="btn btn-ghost btn-lg" onClick={share}>
                <Share2 size={15} strokeWidth={1.75} aria-hidden /> Share
              </button>
            )}
            <button type="button" className="btn btn-ghost btn-lg" onClick={copy}>
              <Copy size={15} strokeWidth={1.75} aria-hidden /> Copy text
            </button>
          </div>
          <p className="small muted" role="status">{msg || 'The image is made in your browser. Nothing is uploaded.'}</p>
        </div>
      </div>
    </div>
  );
}
