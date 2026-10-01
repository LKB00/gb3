import { useSearchParams } from 'react-router-dom';

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

export function challengeLink(path, params) {
  const q = new URLSearchParams({ ...params, from: playerName() || 'A friend' });
  return `${window.location.origin}${window.location.pathname}#${path}?${q.toString()}`;
}

export function useChallenge() {
  const [params] = useSearchParams();
  const vs = params.get('vs');
  if (vs === null) return null;
  const n = Number(vs);
  if (!Number.isFinite(n) || n < 0 || n > 999) return null;
  return {
    score: Math.round(n),
    from: cleanName(params.get('from')) || 'A friend',
    seed: (params.get('seed') || '').replace(/[^a-z0-9]/gi, '').slice(0, 16),
    day: /^\d{4}-\d{2}-\d{2}$/.test(params.get('d') || '') ? params.get('d') : null,
    grid: (params.get('r') || '').replace(/[^01]/g, '').slice(0, 5),
  };
}

export function verdict(mine, theirs, from) {
  if (mine > theirs) return { tone: 'good', text: `You beat ${from} by ${mine - theirs}! 🎉` };
  if (mine === theirs) return { tone: 'ok', text: `A tie with ${from}. Rematch?` };
  return { tone: 'bad', text: `${from} wins by ${theirs - mine}. Try again?` };
}
