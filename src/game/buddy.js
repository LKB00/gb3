import { buddyLines } from '../data/buddy';
import { readJSON, writeJSON } from '../lib/storage';

// The bot buddy: a small GB3 face that says one short line at real moments
// (a streak, a lost streak, a trap, a win, coming back). buddy('streak3') from anywhere.
// Quiet on purpose: at most one line every 20 seconds, never while another toast is showing,
// and it can be switched off on the Me page (saved as 'buddy': { off: true }).
const GAP = 20000;
let last = 0;

export const buddyOn = () => !readJSON('buddy', {}).off;
export const setBuddyOn = (on) => writeJSON('buddy', { off: !on });

export function buddy(moment) {
  const lines = buddyLines[moment];
  if (!lines || typeof window === 'undefined' || !buddyOn()) return;
  if (Date.now() - last < GAP || document.querySelector('.goal-toast:not(.sound-hint)')) return; // the sound hint sits at the top, so it's fine
  last = Date.now();
  const text = lines[Math.floor(Math.random() * lines.length)];
  window.dispatchEvent(new CustomEvent('gb3-buddy', { detail: { text } }));
}
