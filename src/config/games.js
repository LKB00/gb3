import { BookOpenText, Check, Flame, Gauge, Hammer, Puzzle, ScanSearch, Shuffle, Star, Timer, Zap } from 'lucide-react';
import { patterns } from '../data/patterns';
import { hunts } from '../data/hunts';
import { builds } from '../data/builds';
import { stories } from '../data/story';
import { storyBests } from '../progress';

// Every game on the Play page, in the order shown. The tiles are drawn from
// this list (components/play/GameTiles.jsx).
//
// Add a game in 3 steps:
//   1. Make the page in src/pages/ (copy Power.jsx as a starting point).
//   2. Add its route in src/App.jsx.
//   3. Add an entry here.
//
//   to     the page it opens (or random: true to open a random pattern challenge)
//   tone   tile colour class (game-a … game-g in styles/game-core.css + autonomy.css)
//   meta   the small line at the bottom: (progress) => [Icon, text]
//          progress = { stats, passed, huntsDone }
export const games = [
  {
    id: 'power',
    to: '/play/power',
    title: 'How much power?',
    blurb: 'Should the AI suggest, ask first or just do it? Pick the right level for 8 real tasks.',
    icon: Gauge,
    tone: 'game-g',
    wide: true,
    isNew: true,
    meta: ({ stats }) => [Star, `Best ${stats.powerBest || 0}/16`],
  },
  {
    id: 'speed',
    to: '/play/speed',
    title: 'Speed round',
    blurb: '60 seconds. Tap the better screen, fast. 3 in a row = ×2 points.',
    icon: Timer,
    tone: 'game-e',
    meta: ({ stats }) => [Zap, `Best ${stats.speedBest || 0} pts`],
  },
  {
    id: 'build',
    to: '/play/build',
    title: 'Build mode',
    blurb: 'A blank AI screen and a box of pieces. Build it right, skip the traps.',
    icon: Hammer,
    tone: 'game-f',
    meta: ({ stats }) => [Star, `${Object.keys(stats.builds || {}).length}/${builds.length} briefs`],
  },
  {
    id: 'stories',
    to: '/play/story',
    title: 'Stories',
    blurb: `Design an AI product through a short story. Keep a real person’s trust. ${stories.length} stories.`,
    icon: BookOpenText,
    tone: 'game-d',
    meta: ({ stats }) => [Star, `${Object.keys(storyBests(stats)).length}/${stories.length} played`],
  },
  {
    id: 'this-or-that',
    to: '/play/this-or-that',
    title: 'This or That',
    blurb: 'Two AI screens. Tap the better one. Classic or Hard mode.',
    icon: Shuffle,
    tone: 'game-a',
    meta: ({ stats }) => [Flame, `Best streak ${stats.bestStreak || 0}`],
  },
  {
    id: 'fix-it',
    random: true,
    title: 'Fix it',
    blurb: 'Build an AI feature step by step. Win a pattern card.',
    icon: Puzzle,
    tone: 'game-b',
    meta: ({ passed }) => [Star, `${passed.length}/${patterns.length} cards`],
  },
  {
    id: 'spot-the-flaw',
    to: '/play/spot-the-flaw',
    title: 'Spot the flaw',
    blurb: 'Real-looking AI screens with hidden mistakes. Find them all.',
    icon: ScanSearch,
    tone: 'game-c',
    meta: ({ huntsDone }) => [Check, `${huntsDone.length}/${hunts.length} screens`],
  },
];
