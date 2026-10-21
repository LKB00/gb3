import { useEffect, useState } from 'react';
import { CODE } from '../game/track';

// "717 visits" with the game's three characters, from GoatCounter's public counter for the whole site.
// The counter only answers when "Allow using the visitor counter" is on in GoatCounter's settings;
// until then (or offline) this shows nothing. The answer (or "no number") is kept for 10 minutes per visit,
// so pages don't ask again on every tap.
const KEY = 'gb3-visits';
const remember = (n) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ n, at: Date.now() }));
  } catch {
    /* ignore */
  }
};
const FRESH = 10 * 60 * 1000;

function cached() {
  try {
    const v = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    return v && Number.isFinite(v.n) && Date.now() - v.at < FRESH ? v.n : null;
  } catch {
    return null;
  }
}

// The three characters of the game: you (the player), a good bot (lime, like the ✓ in the logo)
// and a bad bot (pink, like the ✕). Fixed colours, so they read the same in light and dark mode.
const INK = '#24282c';
const line = { fill: 'none', stroke: INK, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };

function Player() {
  return (
    <svg viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="16" fill="#cfe0f2" />
      <path d="M6.5 31c1.2-5.2 5-8 9.5-8s8.3 2.8 9.5 8" fill="#c2ef72" stroke={INK} strokeWidth="1.6" />
      <circle cx="16" cy="14" r="6.2" fill="#f2c9a2" stroke={INK} strokeWidth="1.6" />
      <path d="M9.9 13.2c.4-3.6 3-5.6 6.1-5.6 3.3 0 5.7 2 6.1 5.4-2.4-.3-4.6-1.3-6.1-3-1.3 1.6-3.4 2.8-6.1 3.2Z" fill={INK} />
      <circle cx="13.7" cy="14.6" r="0.95" fill={INK} />
      <circle cx="18.3" cy="14.6" r="0.95" fill={INK} />
      <path d="M14 17.1c1.2.9 2.8.9 4 0" {...line} />
    </svg>
  );
}

function GoodBot() {
  return (
    <svg viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="16" fill="#c2ef72" />
      <path d="M16 9.5V6.6" {...line} />
      <circle cx="16" cy="5.6" r="1.6" fill={INK} />
      <rect x="8.5" y="9.5" width="15" height="13" rx="4" fill="#fbfbf7" stroke={INK} strokeWidth="1.6" />
      <path d="M8.5 14.5H7M25 14.5h-1.5" {...line} />
      <circle cx="12.8" cy="15" r="1.5" fill={INK} />
      <circle cx="19.2" cy="15" r="1.5" fill={INK} />
      <path d="M12.6 18.6c2 1.6 4.8 1.6 6.8 0" {...line} />
    </svg>
  );
}

function BadBot() {
  return (
    <svg viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="16" fill="#f6a5a0" />
      <path d="M16 9.5V7.6l2.3-2" {...line} />
      <circle cx="18.6" cy="5.3" r="1.5" fill={INK} />
      <rect x="8.5" y="9.5" width="15" height="13" rx="4" fill="#fbfbf7" stroke={INK} strokeWidth="1.6" />
      <path d="M8.5 14.5H7M25 14.5h-1.5" {...line} />
      <path d="M11.5 13.7l2.6 2.6M14.1 13.7l-2.6 2.6M17.9 13.7l2.6 2.6M20.5 13.7l-2.6 2.6" {...line} />
      <path d="M12.6 19.8l1.7-1.2 1.7 1.2 1.7-1.2 1.7 1.2" {...line} />
    </svg>
  );
}

export default function VisitCount({ className = '' }) {
  const [n, setN] = useState(cached);
  useEffect(() => {
    if (n != null || !CODE) return;
    let off = false;
    fetch(`https://${CODE}.goatcounter.com/counter/TOTAL.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        // GoatCounter sends the number as text with separators, like "1,234".
        const num = Number(String(d?.count ?? '').replace(/\D/g, ''));
        remember(num || 0);
        if (!off && num) setN(num);
      })
      .catch(() => remember(0));
    return () => {
      off = true;
    };
  }, [n]);
  if (!n) return null;
  return (
    <p className={'visits ' + className}>
      <span className="visits-faces" aria-hidden>
        <Player />
        <GoodBot />
        <BadBot />
      </span>
      <strong>{n.toLocaleString('en-US')}</strong> visits
    </p>
  );
}
