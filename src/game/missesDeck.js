import { subtle } from '../data/subtle';
import { classicRound, hardRound } from './decks';
import { readMisses } from '../progress';
import { shuffle } from '../lib/random';

// "Your misses": up to n of the rounds you got wrong, in a fresh order.
// A round leaves the deck the moment you get it right (anywhere: This or That, the Daily, Speed, a boss).
export function missesDeck(n = 10, rng = Math.random) {
  return shuffle(readMisses(), rng)
    .slice(0, n)
    .map((key) => {
      const id = key.slice(2);
      return key.startsWith('c:') ? classicRound(id, rng() < 0.5) : hardRound(subtle.find((s) => s.id === id), rng() < 0.5);
    });
}
