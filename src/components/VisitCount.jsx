import { useEffect, useState } from 'react';
import { CODE } from '../game/track';

// "717 visits" with three little faces, from GoatCounter's public counter for the whole site.
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
        <span>🙂</span>
        <span>😎</span>
        <span>🤖</span>
      </span>
      <strong>{n.toLocaleString('en-US')}</strong> visits
    </p>
  );
}
