import { useState } from 'react';
import { Copy, Download, Lock, Share2 } from 'lucide-react';
import { patterns } from '../data/patterns';
import { wonGroups } from '../game/archetype';
import { designerType } from '../game/designerType';
import { useAchievements, useGameStats, usePassed, useStars, useStreak, useXP } from '../progress';
import { getAchievement } from '../data/achievements';
import { cardThemes, readCardTheme, saveCardTheme } from '../game/cardThemes';
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
    type: designerType({ passed, stars }),
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

async function drawCard(name, data, t) {
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

  round(0, 0, W, H, 64, t.bg);
  // header
  drawLogo(g, icon, 84, 86, 72);
  g.fillStyle = t.soft;
  g.font = `700 30px ${sans}`;
  g.fillText('GOOD BOT, BAD BOT · PLAYER CARD', 200, 131);

  // name + type
  g.fillStyle = t.ink;
  fillFit(g, name || 'Player', 84, 290, 912, 800, 64, display);
  g.fillStyle = t.accent;
  fillFit(g, data.type.name, 84, 410, 912, 800, 96, display);
  g.fillStyle = t.soft;
  fillFit(g, data.type.line, 84, 475, 912, 400, 38, sans);

  // level pill
  round(84, 540, 912, 130, 36, t.panel);
  round(112, 568, 74, 74, 22, t.accent);
  g.fillStyle = t.bg;
  g.font = `800 44px ${display}`;
  g.textAlign = 'center';
  g.fillText(String(data.levelNum), 149, 620);
  g.textAlign = 'left';
  g.fillStyle = t.ink;
  g.font = `800 44px ${display}`;
  g.fillText(data.level.name, 212, 620);
  g.fillStyle = t.accent;
  g.textAlign = 'right';
  g.fillText(`${data.xp} XP`, 964, 620);
  g.textAlign = 'left';

  // stats 2 × 2
  data.stats.forEach(([label, value], i) => {
    const x = 84 + (i % 2) * 464;
    const y = 700 + Math.floor(i / 2) * 200;
    round(x, y, 448, 180, 32, t.panel);
    g.fillStyle = t.ink;
    g.font = `800 72px ${display}`;
    g.fillText(value, x + 36, y + 100);
    g.fillStyle = t.soft;
    g.font = `400 32px ${sans}`;
    g.fillText(label, x + 36, y + 148);
  });

  // badges
  g.fillStyle = t.soft;
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
      g.strokeStyle = t.line;
      g.lineWidth = 4;
      g.stroke();
    }
  });

  g.fillStyle = t.faint;
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
  const earned = useAchievements();
  const [themeId, setThemeId] = useState(() => readCardTheme(earned).id);
  const [hint, setHint] = useState('');
  const isOpen = (t) => !t.unlock || !!earned[t.unlock];
  // A saved colour that is locked again (cleared data) falls back to Classic.
  const theme = cardThemes.find((t) => t.id === themeId && isOpen(t)) || cardThemes[0];
  const pickTheme = (t) => {
    if (!isOpen(t)) {
      const how = getAchievement(t.unlock)?.how || 'Keep your day streak going.';
      setHint(`${how.replace(/\.$/, '')} to unlock ${t.name}.`);
      return;
    }
    setHint('');
    setThemeId(t.id);
    saveCardTheme(t.id);
  };
  const cardStyle = {
    '--pc-bg': theme.bg,
    '--pc-panel': theme.panel,
    '--pc-ink': theme.ink,
    '--pc-soft': theme.soft,
    '--pc-accent': theme.accent,
    '--pc-line': theme.line,
  };

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
    const cv = await drawCard(name.trim(), data, theme);
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
        <div className="pc-card" style={cardStyle} aria-label="Your player card">
          <p className="pc-brand"><LogoMark /> GOOD BOT, BAD BOT · PLAYER CARD</p>
          <p className={'pc-name' + (name.trim().length > 16 ? ' is-long' : '')}>{name.trim() || 'Player'}</p>
          <p className="pc-type">{data.type.name}</p>
          <p className="pc-line">{data.type.line}</p>
          {/* Only on the page, not on the saved image. */}
          {data.type.next && <p className="pc-line pc-next" style={{ opacity: 0.8 }}>{data.type.next}</p>}
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
          <div className="pc-colors" role="group" aria-label="Card colour">
            {cardThemes.map((t) => {
              const locked = !isOpen(t);
              return (
                <button
                  key={t.id}
                  type="button"
                  className={'pc-swatch' + (locked ? ' is-locked' : '')}
                  style={{ '--sw-bg': t.bg, '--sw-accent': t.accent }}
                  aria-pressed={t.id === theme.id}
                  aria-label={locked ? `${t.name}, locked` : t.name}
                  title={locked ? `${t.name} (locked)` : t.name}
                  onClick={() => pickTheme(t)}
                >
                  {locked && <Lock size={14} strokeWidth={1.75} aria-hidden />}
                </button>
              );
            })}
            <span className="small muted pc-colors-hint" role="status">{hint}</span>
          </div>
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
