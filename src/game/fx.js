import { useEffect, useState } from 'react';

// Sound and haptics (touch feedback) for every game moment.
// - ON by default; two separate switches on the Me page (sound, vibration).
// - Sounds are synthesized with the Web Audio API: no audio files, tiny, instant.
// - Haptics: the Vibration API on Android. iPhones don't support it in the browser,
//   so on iOS (Safari 17.4+) we use the native "switch" control trick, which gives
//   a light system tap. Older iPhones just get sound.
// - Browsers only allow audio after a tap, so the first sound plays on the first tap.
const KEYS = { sound: 'fx-sound', haptic: 'fx-haptic' };
const EVENT = 'fx-change';

function readFlag(key) {
  try {
    const v = localStorage.getItem(key);
    if (v === null) {
      // Older versions saved one switch ('fx-on'); respect an explicit "off".
      return localStorage.getItem('fx-on') !== '0';
    }
    return v === '1';
  } catch {
    return true;
  }
}

export const soundOn = () => readFlag(KEYS.sound);
export const hapticOn = () => readFlag(KEYS.haptic);
// Kept for older imports: true when either kind of feedback is on.
export const fxOn = () => soundOn() || hapticOn();

function setFlag(kind, on) {
  try {
    localStorage.setItem(KEYS[kind], on ? '1' : '0');
  } catch {
    /* not saved */
  }
  window.dispatchEvent(new Event(EVENT));
  if (on) fx(kind === 'sound' ? 'select' : 'tap');
}

function useFlag(kind) {
  const read = kind === 'sound' ? soundOn : hapticOn;
  const [on, setOn] = useState(read);
  useEffect(() => {
    const u = () => setOn(read());
    window.addEventListener(EVENT, u);
    return () => window.removeEventListener(EVENT, u);
  }, [read]);
  return [on, () => setFlag(kind, !on)];
}
export const useSound = () => useFlag('sound');
export const useHaptic = () => useFlag('haptic');
// The top-bar speaker button switches both together.
export function useFx() {
  const [s] = useFlag('sound');
  const [h] = useFlag('haptic');
  const on = s || h;
  return [
    on,
    () => {
      setFlag('sound', !on);
      setFlag('haptic', !on);
    },
  ];
}

// ---------------- Sound ----------------
let ctx;
let master;
function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// One note with a soft attack and a natural decay.
function note(freq, at, dur, { type = 'sine', vol = 0.12, glide } = {}) {
  const c = audio();
  if (!c) return;
  const t = c.currentTime + at;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (glide) o.frequency.exponentialRampToValueAtTime(glide, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.03);
}

// A short burst of filtered noise: whooshes and paper-like card sounds.
function noise(at, dur, { from = 800, to = 3000, vol = 0.08 } = {}) {
  const c = audio();
  if (!c) return;
  const t = c.currentTime + at;
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = 'bandpass';
  f.Q.value = 1.2;
  f.frequency.setValueAtTime(from, t);
  f.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(master);
  src.start(t);
  src.stop(t + dur + 0.02);
}

// C major pentatonic, so any combination of notes sounds friendly.
const SCALE = [523, 587, 659, 784, 880, 1047, 1175, 1319, 1568, 1760];

const SOUNDS = {
  // UI
  tap: () => note(1800, 0, 0.03, { type: 'triangle', vol: 0.05 }),
  select: () => note(880, 0, 0.07, { vol: 0.08 }),
  nav: () => { note(660, 0, 0.05, { vol: 0.05 }); note(990, 0.03, 0.06, { vol: 0.04 }); },
  toggle: () => note(1200, 0, 0.04, { type: 'square', vol: 0.03 }),
  // Answers
  right: ({ streak = 0 } = {}) => {
    const i = Math.min(streak, SCALE.length - 3);
    note(SCALE[i], 0, 0.12);
    note(SCALE[i + 2], 0.07, 0.18);
  },
  wrong: () => {
    note(311, 0, 0.16, { type: 'triangle', vol: 0.1, glide: 260 });
    note(233, 0.11, 0.24, { type: 'triangle', vol: 0.09, glide: 196 });
  },
  combo: ({ streak = 3 } = {}) => {
    const base = Math.min(streak - 3, 4);
    [0, 2, 4].forEach((k, n) => note(SCALE[base + k], n * 0.05, 0.12, { vol: 0.09 }));
  },
  // Rewards
  star: ({ n = 1 } = {}) => note(SCALE[3 + n * 2] || 1568, 0, 0.35, { vol: 0.1 }),
  win: () => [523, 659, 784, 1047].forEach((f, i) => note(f, i * 0.085, 0.28, { vol: 0.11 })),
  levelup: () => {
    [523, 659, 784, 1047, 1319].forEach((f, i) => note(f, i * 0.07, 0.3, { vol: 0.1 }));
    note(1568, 0.38, 0.6, { vol: 0.08 });
  },
  goal: () => { note(784, 0, 0.18); note(1175, 0.1, 0.35); },
  flip: () => { noise(0, 0.18, { from: 600, to: 4000, vol: 0.07 }); note(1320, 0.16, 0.22, { vol: 0.08 }); },
  place: () => { noise(0, 0.07, { from: 2000, to: 800, vol: 0.05 }); note(440, 0.02, 0.08, { vol: 0.06 }); },
  remove: () => note(520, 0, 0.08, { vol: 0.05, glide: 380 }),
  // Story
  trustUp: () => { note(587, 0, 0.12); note(880, 0.08, 0.2); },
  trustDown: () => note(392, 0, 0.3, { type: 'triangle', vol: 0.09, glide: 294 }),
  // Timer
  tick: () => note(1400, 0, 0.04, { type: 'square', vol: 0.03 }),
  go: () => { note(784, 0, 0.1, { vol: 0.1 }); note(1568, 0.06, 0.25, { vol: 0.1 }); },
  timeup: () => [784, 659, 523].forEach((f, i) => note(f, i * 0.1, 0.22, { vol: 0.09 })),
};

// ---------------- Haptics ----------------
const BUZZ = {
  tap: 8, select: 12, nav: 8, toggle: 10,
  right: 18, wrong: [40, 50, 40], combo: [15, 30, 15, 30, 25],
  star: 20, win: [20, 40, 20, 40, 70], levelup: [30, 40, 30, 40, 30, 40, 90], goal: [25, 50, 60],
  flip: 15, place: 10, remove: 8, trustUp: 18, trustDown: [40, 60, 40],
  tick: 6, go: 40, timeup: [60, 80, 60],
};

let iosSwitch;
// iPhone: toggling a native <input type="checkbox" switch> plays a system haptic.
function iosTap(times = 1) {
  if (!iosSwitch) {
    const label = document.createElement('label');
    label.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none';
    label.setAttribute('aria-hidden', 'true');
    iosSwitch = document.createElement('input');
    iosSwitch.type = 'checkbox';
    iosSwitch.setAttribute('switch', '');
    iosSwitch.tabIndex = -1;
    label.appendChild(iosSwitch);
    document.body.appendChild(label);
  }
  for (let i = 0; i < times; i++) setTimeout(() => iosSwitch.parentElement.click(), i * 90);
}

function haptic(name) {
  const p = BUZZ[name];
  if (!p) return;
  if (typeof navigator.vibrate === 'function') {
    navigator.vibrate(p);
  } else if (/iP(hone|ad|od)/.test(navigator.userAgent)) {
    iosTap(Array.isArray(p) ? Math.min(3, Math.ceil(p.length / 2)) : 1);
  }
}

// The first time a sound plays, show a one-time hint with a quick "Turn off".
function firstSoundHint() {
  try {
    if (localStorage.getItem('fx-hint')) return;
    localStorage.setItem('fx-hint', '1');
  } catch {
    return;
  }
  window.dispatchEvent(new Event('fx-hint'));
}
export function turnAllOff() {
  setFlag('sound', false);
  setFlag('haptic', false);
}

// Play a moment: fx('right', { streak: 4 })
export function fx(name, opts) {
  if (soundOn()) {
    firstSoundHint();
    try {
      SOUNDS[name]?.(opts);
    } catch {
      /* audio not available */
    }
  }
  if (hapticOn()) {
    try {
      haptic(name);
    } catch {
      /* haptics not available */
    }
  }
}

// A soft tap on any button, link or tab, so the whole site feels physical.
// Game answers play their own sounds, so they are skipped here.
const SILENT = '.lab-opt, .tot-option, .story-choice, .build-piece, .speed-option, .mb-click, [data-fx="off"]';
export function listenForTaps() {
  document.addEventListener(
    'pointerdown',
    (e) => {
      if (e.button !== 0) return;
      const el = e.target.closest('button, a, [role="tab"], summary, label');
      if (!el || el.closest(SILENT) || el.disabled) return;
      const kind = el.closest('.bottomnav, .topnav-links, .tabs') ? 'nav' : 'tap';
      fx(kind);
    },
    { passive: true }
  );
}
