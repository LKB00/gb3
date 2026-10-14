import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { copyText } from '../lib/clipboard';

// "Challenge a friend": everything lives in the link (no server).
// The friend plays the exact same rounds and sees the score to beat.
// Strips invisible control characters from names typed by people.
// eslint-disable-next-line no-control-regex
const cleanName = (s) => String(s || '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, 24);

export function playerName() {
  try {
    return cleanName(localStorage.getItem('player-name')) || '';
  } catch {
    return '';
  }
}

// Same key and format as the player card (a plain string, max 24 chars).
export function savePlayerName(name) {
  const v = cleanName(name);
  if (!v) return;
  try {
    localStorage.setItem('player-name', v);
  } catch {
    /* not saved */
  }
}

export function challengeLink(path, params) {
  const q = new URLSearchParams({ ...params, from: playerName() || 'A friend' });
  return `${window.location.origin}${window.location.pathname}#${path}?${q.toString()}`;
}

export function useChallenge() {
  const [params] = useSearchParams();
  const vs = params.get('vs');
  if (vs === null) return null;
  if (!/^\d{1,3}$/.test(vs)) return null; // whole numbers only: not "", "1e2", "0x10", "-5"
  const n = Number(vs);
  return {
    score: Math.round(n),
    from: cleanName(params.get('from')) || 'A friend',
    seed: (params.get('seed') || '').replace(/[^a-z0-9]/gi, '').slice(0, 16),
    day: /^\d{4}-\d{2}-\d{2}$/.test(params.get('d') || '') ? params.get('d') : null,
    grid: (params.get('r') || '').replace(/[^01]/g, '').slice(0, 5),
  };
}

export function verdict(mine, theirs, from) {
  if (mine > theirs) return { tone: 'good', text: `You beat ${from} by ${mine - theirs}! Bragging rights are yours 🎉` };
  if (mine === theirs) return { tone: 'ok', text: `Dead even with ${from}! One more to settle it?` };
  return { tone: 'bad', text: `${from} wins by ${theirs - mine} this time. Your turn to win it back!` };
}

// What a dare says. With `vs` (the friend's challenge you just played), it answers them by name.
export function dailyDareText({ score, total, num, vs }) {
  if (!vs) return `I got ${score}/${total} on Good Bot, Bad Bot Daily #${num}. Can you beat me?`;
  if (score > vs.score) return `I beat ${vs.from}’s ${vs.score} with ${score}/${total} on Daily #${num}. Your move:`;
  if (score === vs.score) return `${vs.score}–${score} with ${vs.from} on Daily #${num}. Dead even. Rematch?`;
  return `${vs.from} won ${vs.score}–${score} on Daily #${num}. Rematch?`;
}

export function speedDareText({ points, vs }) {
  if (!vs) return `⚡ I scored ${points} in the Good Bot, Bad Bot speed round. Same screens, same order. Can you beat me?`;
  if (points > vs.score) return `⚡ I beat ${vs.from}’s ${vs.score} with ${points} in the speed round. Your move:`;
  if (points === vs.score) return `⚡ ${vs.score}–${points} with ${vs.from} in the speed round. Dead even. Rematch?`;
  return `⚡ ${vs.from} won ${vs.score}–${points} in the speed round. Rematch?`;
}

// Share sheet when the phone has one, else copy. Returns 'shared', 'copied', 'manual' or 'cancelled'.
export async function shareOrCopy(text, url) {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ text, url });
      return 'shared';
    } catch (e) {
      if (e?.name === 'AbortError') return 'cancelled';
      /* share blocked: copy instead */
    }
  }
  return (await copyText(`${text} ${url}`)) ? 'copied' : 'manual';
}

// The "Challenge a friend" button: asks for a name once (so friends know who dared them),
// then shares or copies. `build()` runs after the name is saved, so the link carries it.
export function useDare() {
  const [askName] = useState(() => !playerName());
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const send = async (build) => {
    if (askName) savePlayerName(name);
    const { text, url } = build();
    const r = await shareOrCopy(text, url);
    if (r !== 'copied') return;
    setStatus('copied');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(''), 2000);
  };
  return { askName, name, setName: (v) => setName(String(v).slice(0, 24)), copied: status === 'copied', send };
}
