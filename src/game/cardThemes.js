import { readJSON, writeJSON } from '../lib/storage';

// Player card colours. Classic is free; the others unlock with day streaks (see data/achievements.js).
// `unlock` = the achievement id that unlocks it. Colours are fixed (the card is an image, not the page).
// bg = card, panel = boxes, ink = main text, soft = small text, accent = title and level, line = empty badge ring, faint = footer.
export const cardThemes = [
  { id: 'classic', name: 'Classic', unlock: null, bg: '#24282c', panel: '#33383d', ink: '#fbfbf7', soft: '#c9ccc4', accent: '#c2ef72', line: '#4a4f55', faint: '#8d918a' },
  { id: 'lime', name: 'Lime', unlock: 'streak-3', bg: '#c2ef72', panel: '#d6f69e', ink: '#24282c', soft: '#3f4d25', accent: '#24282c', line: '#8fae55', faint: '#4a5a2c' },
  { id: 'ocean', name: 'Ocean', unlock: 'streak-7', bg: '#1d3b53', panel: '#28506f', ink: '#f2f7fb', soft: '#b4cde0', accent: '#8fd3ff', line: '#3f6886', faint: '#8fadc4' },
  { id: 'gold', name: 'Gold', unlock: 'streak-30', bg: '#3a2e12', panel: '#4d3e1a', ink: '#fff8e6', soft: '#dccca3', accent: '#f5c84b', line: '#6a5729', faint: '#b3a57f' },
];

// The chosen colour, if it is unlocked; otherwise Classic.
export function readCardTheme(earned) {
  const { id } = readJSON('card-theme', {}); // saved as { id }: storage only keeps lists and objects
  const t = cardThemes.find((x) => x.id === id);
  return t && (!t.unlock || earned[t.unlock]) ? t : cardThemes[0];
}
export const saveCardTheme = (id) => writeJSON('card-theme', { id });
