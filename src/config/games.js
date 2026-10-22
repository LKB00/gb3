import { BookOpenText, Check, Crown, Flame, Gauge, Hammer, Puzzle, RotateCcw, ScanSearch, Shuffle, Star, Swords, Timer, Zap } from 'lucide-react';
import { patterns } from '../data/patterns';
import { hunts } from '../data/hunts';
import { builds } from '../data/builds';
import { stories } from '../data/story';
import { categories } from '../data/patterns';
import { storyBests } from '../progress';
import { bossBeaten } from '../game/decks';

// Every game on the Play page, in the order shown. The tiles are drawn from
// this list (components/play/GameTiles.jsx), in two groups: quick games and deeper games.
//
// Add a game in 3 steps:
//   1. Make the page in src/pages/ (copy Power.jsx as a starting point).
//   2. Add its route in src/App.jsx.
//   3. Add an entry here.
//
//   to     the page it opens (or random: true to open a random pattern challenge)
//   tone   tile colour class (game-a … game-g in styles/game-core.css + autonomy.css)
//   group  'quick' (1-2 minutes) or 'deep' (about 5 minutes): the two lists on the Play page
//   isNew  shows a small "New" pill
//   meta   your progress in this game: (progress) => [Icon, text, played]
//          progress = { stats, passed, huntsDone, misses }; the line only shows once played is true
//   show   optional: (progress) => false hides the row (e.g. "Your misses" with nothing in it)
export const games = [
  {
    id: 'misses',
    to: '/play/this-or-that?mode=misses',
    title: 'Your misses',
    blurb: 'The screens you got wrong. Win them back and the deck empties.',
    icon: RotateCcw,
    tone: 'game-f',
    group: 'quick',
    show: ({ misses }) => misses.length > 0,
    meta: ({ misses }) => [RotateCcw, `${misses.length} to win back`, true],
  },
  {
    id: 'this-or-that',
    to: '/play/this-or-that',
    title: 'This or That',
    blurb: 'Two AI screens. Tap the better one. Try Hard mode if you dare.',
    icon: Shuffle,
    tone: 'game-a',
    group: 'quick',
    meta: ({ stats }) => [Flame, `Best streak: ${stats.bestStreak || 0} in a row`, (stats.bestStreak || 0) > 0],
  },
  {
    id: 'fix-it',
    random: true,
    title: 'Fix it',
    blurb: 'Get one AI feature right, one choice at a time. Win its card.',
    icon: Puzzle,
    tone: 'game-b',
    group: 'deep',
    meta: ({ passed }) => [Star, `${passed.length}/${patterns.length} cards`, passed.length > 0],
  },
  {
    id: 'speed',
    to: '/play/speed',
    title: 'Speed round',
    blurb: '60 seconds. Tap the better AI screen, fast. Get 3 in a row for double points.',
    icon: Timer,
    tone: 'game-e',
    group: 'quick',
    meta: ({ stats }) => [Zap, `Best: ${stats.speedBest || 0} points`, (stats.speedBest || 0) > 0],
  },
  {
    id: 'power',
    to: '/play/power',
    title: 'How much power?',
    blurb: 'Should the AI ask you first, or just do it? Decide for 8 real tasks.',
    icon: Gauge,
    tone: 'game-g',
    isNew: true,
    group: 'quick',
    meta: ({ stats }) => [Star, `Best: ${stats.powerBest || 0}/16`, (stats.powerBest || 0) > 0],
  },
  {
    id: 'build',
    to: '/play/build',
    title: 'Build mode',
    blurb: 'Build an AI screen from parts. Pick the good ones, dodge the traps.',
    icon: Hammer,
    tone: 'game-f',
    group: 'deep',
    meta: ({ stats }) => [Star, `${Object.keys(stats.builds || {}).length}/${builds.length} built`, Object.keys(stats.builds || {}).length > 0],
  },
  {
    id: 'stories',
    to: '/play/story',
    title: 'Stories',
    blurb: `${stories.length} short stories. You make the AI’s choices. Can you keep people’s trust?`,
    icon: BookOpenText,
    tone: 'game-d',
    group: 'deep',
    meta: ({ stats }) => [Star, `${Object.keys(storyBests(stats)).length}/${stories.length} played`, Object.keys(storyBests(stats)).length > 0],
  },
  {
    id: 'spot-the-flaw',
    to: '/play/spot-the-flaw',
    title: 'Spot the flaw',
    blurb: 'Real-looking AI screens with hidden mistakes. Can you find them all?',
    icon: ScanSearch,
    tone: 'game-c',
    group: 'deep',
    meta: ({ huntsDone }) => [Check, `${huntsDone.length}/${hunts.length} screens done`, huntsDone.length > 0],
  },
  {
    id: 'boss',
    to: '/play/boss',
    title: 'Boss rounds',
    blurb: '8 tough screens from one group. Get 7 right to beat its boss.',
    icon: Swords,
    tone: 'game-d',
    group: 'deep',
    meta: ({ stats }) => {
      const beaten = Object.entries(stats.boss || {}).filter(([g, n]) => bossBeaten(g, n)).length;
      return [Crown, `${beaten}/${categories.length} bosses beaten`, Object.keys(stats.boss || {}).length > 0];
    },
  },
];
