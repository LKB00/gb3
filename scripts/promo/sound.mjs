// Step 2 of the promo video: makes the sound track (original music + sound effects) from code, so there are no
// licence questions. Writes scripts/promo/out/sound.wav (32 s, 48 kHz stereo). render.mjs adds it to both videos.
//   node scripts/promo/sound.mjs
// The effects are timed to the animation in promo.html. If you move a scene there, move its sounds in SFX below.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const SR = 48000;
const DURATION = 32;
const N = SR * DURATION;
const bus = () => [new Float32Array(N), new Float32Array(N)];
const music = bus(); // pumped by the kick (sidechain)
const drums = bus();
const sfx = bus();
const verb = bus(); // reverb send
const echo = bus(); // delay send (arp)

let seed = 12345;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const noise = () => rand() * 2 - 1;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const TAU = Math.PI * 2;

// Write a mono signal fn(t) (t in seconds from `start`) into a bus, panned (-1 left .. 1 right), with a reverb send.
function put(target, start, dur, fn, { pan = 0, gain = 1, send = 0, delay = 0 } = {}) {
  const i0 = Math.max(0, Math.round(start * SR));
  const i1 = Math.min(N, Math.round((start + dur) * SR));
  const l = Math.cos(((pan + 1) * Math.PI) / 4) * gain, r = Math.sin(((pan + 1) * Math.PI) / 4) * gain;
  for (let i = i0; i < i1; i++) {
    const v = fn((i - i0) / SR);
    target[0][i] += v * l;
    target[1][i] += v * r;
    if (send) { verb[0][i] += v * l * send; verb[1][i] += v * r * send; }
    if (delay) { echo[0][i] += v * l * delay; echo[1][i] += v * r * delay; }
  }
}

// A biquad filter (RBJ cookbook). type: lp, hp, bp. Cutoff can change per sample.
function biquad(type) {
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  return (x, f, q = 0.7) => {
    const w = (TAU * Math.min(f, SR * 0.45)) / SR, a = Math.sin(w) / (2 * q), c = Math.cos(w);
    let b0, b1, b2;
    if (type === 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = b0; }
    else if (type === 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = b0; }
    else { b0 = a; b1 = 0; b2 = -a; }
    const a0 = 1 + a, a1 = -2 * c, a2 = 1 - a;
    const y = (b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    return y;
  };
}

const env = (t, dur, a, r) => (t < a ? t / a : t > dur - r ? Math.max(0, (dur - t) / r) : 1);

// ---------- instruments ----------
// Warm pad: soft additive saw, two voices a little out of tune, slow attack.
function pad(start, dur, midi, gain = 0.05) {
  const f = mtof(midi);
  put(music, start, dur + 1.2, (t) => {
    const e = env(t, dur + 1.2, 0.5, 1.2);
    let v = 0;
    for (const d of [-0.004, 0.004]) for (let n = 1; n <= 7; n++) v += Math.sin(TAU * f * (1 + d) * n * t + n) / Math.pow(n, 1.6);
    return v * e;
  }, { gain, send: 0.5, pan: (midi % 5) / 5 - 0.4 });
}
// Pluck for the arpeggio: bright at first, then soft.
function pluck(start, midi, gain = 0.06, pan = 0) {
  const f = mtof(midi);
  put(music, start, 0.9, (t) => {
    let v = 0;
    for (let n = 1; n <= 6; n++) v += (Math.sin(TAU * f * n * t) / n) * Math.exp(-t * (5 + n * 3));
    return v * Math.min(1, t / 0.003);
  }, { gain, send: 0.25, delay: 0.35, pan });
}
function bass(start, dur, midi, gain = 0.22) {
  const f = mtof(midi);
  put(music, start, dur, (t) => (Math.sin(TAU * f * t) + 0.25 * Math.sin(TAU * 2 * f * t)) * Math.exp(-t * 2.2) * Math.min(1, t / 0.005) * env(t, dur, 0.001, 0.03), { gain });
}
const kicks = [];
function kick(start, gain = 0.5) {
  kicks.push(start);
  put(drums, start, 0.5, (t) => Math.sin(TAU * (45 * t + (95 / 28) * (1 - Math.exp(-t * 28)))) * Math.exp(-t * 7) + noise() * Math.exp(-t * 300) * 0.3, { gain });
}
function clap(start, gain = 0.16) {
  const bp = biquad('bp');
  put(drums, start, 0.3, (t) => {
    const bursts = t < 0.03 ? Math.exp(-((t * 1000) % 10) * 0.35) : Math.exp(-(t - 0.03) * 22);
    return bp(noise(), 1400, 1.2) * bursts;
  }, { gain, send: 0.35 });
}
function hat(start, gain = 0.05, open = false) {
  const hp = biquad('hp');
  put(drums, start, open ? 0.25 : 0.06, (t) => hp(noise(), 8000) * Math.exp(-t * (open ? 14 : 70)), { gain, pan: 0.3 });
}

// ---------- sound effects ----------
// Tiny key click (typing).
function key(start) {
  const hp = biquad('hp'), g = 0.5 + rand() * 0.5, f = 1800 + rand() * 900;
  put(sfx, start, 0.04, (t) => (hp(noise(), 3000) * 0.7 + Math.sin(TAU * f * t) * 0.4) * Math.exp(-t * 160), { gain: 0.16 * g, pan: rand() * 0.4 - 0.2 });
}
// "Nope": two low notes going down.
function nope(start) {
  for (const [dt, m] of [[0, 57], [0.13, 53]]) {
    const f = mtof(m), lp = biquad('lp');
    put(sfx, start + dt, 0.22, (t) => lp(Math.sign(Math.sin(TAU * f * t)) * 0.6 + Math.sin(TAU * f * t), 1600) * Math.exp(-t * 9) * Math.min(1, t / 0.004), { gain: 0.16, send: 0.15 });
  }
}
// Whoosh: filtered noise that sweeps up and across.
function whoosh(start, dur = 0.5, gain = 0.22, up = true) {
  const bp = biquad('bp');
  put(sfx, start, dur, (t) => {
    const x = t / dur, f = up ? 300 * Math.pow(12, x) : 3600 * Math.pow(1 / 12, x);
    return bp(noise(), f, 0.9) * Math.pow(Math.sin(Math.PI * Math.pow(x, 0.7)), 2);
  }, { gain, send: 0.3, pan: up ? 0.25 : -0.25 });
}
// Big low hit with a little noise on top.
function impact(start, gain = 0.6) {
  const lp = biquad('lp');
  put(sfx, start, 2.0, (t) => Math.sin(TAU * (32 * t + (70 / 9) * (1 - Math.exp(-t * 9)))) * Math.exp(-t * 2.6) + lp(noise(), 900) * Math.exp(-t * 12) * 0.5, { gain, send: 0.4 });
}
// Bell / chime note.
function bell(start, midi, gain = 0.1, pan = 0, decay = 3) {
  const f = mtof(midi);
  put(sfx, start, 2.2, (t) => (Math.sin(TAU * f * t) + 0.45 * Math.sin(TAU * f * 2.0 * t) * Math.exp(-t * 4) + 0.25 * Math.sin(TAU * f * 3.01 * t) * Math.exp(-t * 7)) * Math.exp(-t * decay) * Math.min(1, t / 0.002), { gain, send: 0.45, pan });
}
// Rising noise + tone before the logo.
function riser(start, dur) {
  const hp = biquad('hp');
  put(sfx, start, dur, (t) => {
    const x = t / dur;
    return (hp(noise(), 400 + 5000 * x * x) * 0.6 + Math.sin(TAU * (200 * t + 300 * x * x * dur)) * 0.25) * x * x;
  }, { gain: 0.2, send: 0.3 });
}
// Sparkle: many quiet high bells.
function shimmer(start, gain = 0.03) {
  for (let i = 0; i < 9; i++) bell(start + i * 0.045, 84 + [0, 4, 7, 11, 12, 16, 19, 23, 24][i], gain, rand() * 1.2 - 0.6, 5);
}
// Finger tap on glass.
function tap(start) {
  put(sfx, start, 0.08, (t) => Math.sin(TAU * 520 * t) * Math.exp(-t * 60) + noise() * Math.exp(-t * 400) * 0.3, { gain: 0.35 });
}
// Soft pop.
function pop(start, gain = 0.3) {
  put(sfx, start, 0.15, (t) => Math.sin(TAU * (260 * t + 1800 * t * t)) * Math.exp(-t * 30) * Math.min(1, t / 0.002), { gain, send: 0.2 });
}
// Coin-like reward (+10 XP).
function coin(start) {
  for (const [dt, m] of [[0, 83], [0.07, 88]]) {
    const f = mtof(m);
    put(sfx, start + dt, 0.5, (t) => (Math.sin(TAU * f * t) + Math.sin(TAU * 3 * f * t) / 3 + Math.sin(TAU * 5 * f * t) / 6) * Math.exp(-t * (dt ? 6 : 30)), { gain: 0.07, send: 0.3 });
  }
}
// Scratch for the strike-through line.
function strike(start) {
  const bp = biquad('bp');
  put(sfx, start, 0.22, (t) => bp(noise(), 1500 + 4000 * (t / 0.22), 2) * Math.sin(Math.PI * (t / 0.22)), { gain: 0.08, pan: -0.35 });
}

// ---------- music ----------
// 124.7 BPM, so the drop lands on the cut to scene 2 (4.3 s) and the groove comes back on scene 4 (12.0 s).
const BEAT = 7.7 / 16;
const T0 = 4.3 - 8 * BEAT;
const at = (b) => T0 + b * BEAT;
// A minor: Am7, Fmaj7, C, G6 (bass note, pad notes, arp notes).
const CHORDS = [
  [45, [57, 60, 64, 67], [69, 72, 76, 79]],
  [41, [53, 57, 60, 64], [65, 69, 72, 76]],
  [48, [55, 60, 64, 67], [67, 72, 76, 79]],
  [43, [55, 59, 62, 64], [67, 71, 74, 79]],
];
const END = 27.9; // the end card
const lastBeat = Math.floor((END - T0) / BEAT);
for (let bar = 0; bar * 4 < lastBeat; bar++) {
  const [root, padNotes, arp] = CHORDS[bar % 4];
  const b0 = bar * 4, s = Math.max(0, at(b0)), barEnd = Math.min(at(b0 + 4), END);
  const full = (b) => (b >= 8 && b < 17) || (b >= 24 && b < lastBeat); // drums + bass
  const breakdown = (b) => b >= 17 && b < 24; // logo moment: pad and arp only
  for (const m of padNotes) pad(s, barEnd - s, m, b0 < 8 ? 0.035 : 0.045);
  for (let k = 0; k < 8; k++) {
    const b = b0 + k / 2, t = at(b);
    if (t < 0 || t >= END) continue;
    // Intro: a soft heartbeat; then the arp comes in.
    if (b < 8 && k % 2 === 0) put(drums, t, 0.4, (x) => Math.sin(TAU * 55 * x) * Math.exp(-x * 9), { gain: b0 >= 4 ? 0.25 : 0.18 });
    if (b >= 8 && b < lastBeat) pluck(t, arp[[0, 2, 1, 3, 2, 1, 3, 2][k]], breakdown(b) ? 0.07 : 0.05, k % 2 ? 0.35 : -0.35);
    if (full(b)) {
      if (k % 2 === 0) kick(t, 0.45);
      if (k === 2 || k === 6) clap(t);
      hat(t + (k % 2 ? 0 : BEAT / 2), b >= 30 ? 0.06 : 0.045, k === 7);
      if (b >= 30) hat(t + BEAT / 4, 0.025); // a little more energy for the game montage
      bass(t, BEAT / 2 - 0.01, root + (k === 7 ? 12 : 0));
    }
  }
}
// End: one warm C major chord that rings out.
for (const m of [48, 55, 60, 64, 67, 71, 74]) pad(END, 3.2, m, m < 50 ? 0.05 : 0.04);
bass(END, 2.5, 36, 0.25);

// ---------- effects on the timeline (seconds match promo.html) ----------
const hook = 'Done! I deleted 2,340 old emails for you.';
for (let i = 0; i < hook.length; i++) if (hook[i] !== ' ') key(0.2 + (i / hook.length) * 1.25);
nope(1.6);
whoosh(1.85, 0.35, 0.18);
impact(2.15, 0.55);
whoosh(3.8, 0.5, 0.2, false);
[5.0, 5.5, 6.0].forEach((a, i) => {
  whoosh(a - 0.05, 0.3, 0.08);
  bell(a + 0.25, [79, 83, 86][i], 0.09, 0.35); // rising "ding" on each good choice
  strike(a + 0.45);
});
whoosh(8.4, 0.5, 0.2, false);
riser(7.4, 1.5);
impact(8.95, 0.5);
shimmer(8.97, 0.035);
for (const [d, m] of [[0, 72], [0.06, 76], [0.12, 79], [0.18, 84]]) bell(9.0 + d, m, 0.05, 0);
whoosh(11.5, 0.5, 0.2, false);
whoosh(12.0, 0.7, 0.16);
tap(14.5);
for (const [d, m] of [[0, 84], [0.07, 88], [0.14, 91]]) bell(14.58 + d, m, 0.07, 0.2);
coin(14.75);
whoosh(17.8, 0.5, 0.2, false);
whoosh(18.4, 0.7, 0.16);
[19.6, 20.8, 22.0].forEach((a) => { whoosh(a, 0.45, 0.13); pop(a + 0.35, 0.12); });
whoosh(23.3, 0.5, 0.2, false);
whoosh(23.9, 0.9, 0.18);
shimmer(24.9, 0.025);
whoosh(27.4, 0.5, 0.2, false);
pop(27.95, 0.3);
bell(28.0, 84, 0.06);
pop(28.9, 0.28);
for (const [d, m] of [[0, 79], [0.08, 84]]) bell(28.95 + d, m, 0.06, 0.15);

// ---------- mix ----------
// Ping-pong delay for the arp (3/4 beat), into the reverb a little.
const dl = Math.round(BEAT * 0.75 * SR);
for (let i = dl; i < N; i++) {
  echo[0][i] += echo[1][i - dl] * 0.38;
  echo[1][i] += echo[0][i - dl] * 0.38;
}
// Simple reverb: 4 comb + 2 all-pass filters per side.
function reverb(x, sizes) {
  const out = new Float32Array(N);
  for (const d of sizes.slice(0, 4)) {
    const buf = new Float32Array(d); let j = 0, lp = 0;
    for (let i = 0; i < N; i++) { const y = buf[j]; lp = y * 0.7 + lp * 0.3; buf[j] = x[i] + lp * 0.84; out[i] += y * 0.25; j = (j + 1) % d; }
  }
  for (const d of sizes.slice(4)) {
    const buf = new Float32Array(d); let j = 0;
    for (let i = 0; i < N; i++) { const b = buf[j]; const y = -out[i] + b; buf[j] = out[i] + b * 0.5; out[i] = y; j = (j + 1) % d; }
  }
  return out;
}
const rv = [reverb(verb[0], [1557, 1617, 1491, 1422, 225, 556]), reverb(verb[1], [1580, 1640, 1514, 1445, 248, 579])];

// Sidechain: music ducks a little on every kick, for a modern pumping feel.
const pump = new Float32Array(N).fill(1);
for (const k of kicks) {
  const i0 = Math.round(k * SR);
  for (let i = i0; i < Math.min(N, i0 + SR * 0.4); i++) pump[i] = Math.min(pump[i], 1 - 0.45 * Math.exp(-((i - i0) / SR) * 9));
}

const out = [new Float32Array(N), new Float32Array(N)];
let peak = 0;
for (let c = 0; c < 2; c++) {
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const fade = Math.min(1, t / 0.02) * Math.min(1, (DURATION - t) / 0.6);
    const v = (music[c][i] + echo[c][i] * 0.5) * pump[i] * 0.8 + drums[c][i] * 0.75 + sfx[c][i] + rv[c][i] * 0.6;
    out[c][i] = Math.tanh(v * 1.1) * fade;
    peak = Math.max(peak, Math.abs(out[c][i]));
  }
}

// 16-bit WAV, peak at -1 dB (render.mjs sets the final loudness).
const norm = 0.89 / peak;
const wav = Buffer.alloc(44 + N * 4);
wav.write('RIFF', 0); wav.writeUInt32LE(36 + N * 4, 4); wav.write('WAVE', 8); wav.write('fmt ', 12);
wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(2, 22); wav.writeUInt32LE(SR, 24);
wav.writeUInt32LE(SR * 4, 28); wav.writeUInt16LE(4, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  wav.writeInt16LE(Math.round(out[0][i] * norm * 32767), 44 + i * 4);
  wav.writeInt16LE(Math.round(out[1][i] * norm * 32767), 46 + i * 4);
}
const file = fileURLToPath(new URL('out/sound.wav', import.meta.url));
fs.mkdirSync(fileURLToPath(new URL('out', import.meta.url)), { recursive: true });
fs.writeFileSync(file, wav);
console.log('Saved', file);
