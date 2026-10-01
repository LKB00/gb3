import { useEffect, useState } from 'react';

// Sound and vibration for game moments. Off by default; one toggle in the top bar.
// Sounds are made with the Web Audio API (no audio files), short and quiet.
const KEY = 'fx-on';
const EVENT = 'fx-change';

export function fxOn() {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function setFx(on) {
  try {
    localStorage.setItem(KEY, on ? '1' : '0');
  } catch {
    /* not saved */
  }
  window.dispatchEvent(new Event(EVENT));
  if (on) fx('right');
}

export function useFx() {
  const [on, setOn] = useState(fxOn);
  useEffect(() => {
    const u = () => setOn(fxOn());
    window.addEventListener(EVENT, u);
    return () => window.removeEventListener(EVENT, u);
  }, []);
  return [on, () => setFx(!on)];
}

let ctx;
function tone(freq, start, dur, type = 'sine', vol = 0.08) {
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  const t = ctx.currentTime + start;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

const SOUNDS = {
  right: () => { tone(660, 0, 0.12); tone(990, 0.08, 0.16); },
  wrong: () => { tone(220, 0, 0.18, 'triangle', 0.07); tone(180, 0.1, 0.2, 'triangle', 0.06); },
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.22)),
  flip: () => { tone(400, 0, 0.06, 'square', 0.03); tone(800, 0.05, 0.08, 'sine', 0.05); },
  tick: () => tone(1200, 0, 0.05, 'square', 0.025),
};
const BUZZ = { right: 15, wrong: [30, 40, 30], win: [20, 40, 20, 40, 60], flip: 10, tick: 0 };

export function fx(name) {
  if (!fxOn()) return;
  try {
    SOUNDS[name]?.();
  } catch {
    /* audio not available */
  }
  try {
    if (BUZZ[name]) navigator.vibrate?.(BUZZ[name]);
  } catch {
    /* vibration not available */
  }
}
