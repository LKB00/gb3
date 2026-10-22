// Achievements: small surprises for playing in different ways. Shown on the Me page; a toast pops when one is earned.
// Two kinds of rule:
//   test(p)   looks at saved progress (checked whenever progress changes)
//   event(e)  looks at one moment: { type: 'answer', hour } or { type: 'misses-cleared' }
// p = { passed, hunts, stars, stats, daily, days, bestDayStreak, storyTop, bossBeaten }
// secret: true hides the name and rule until it is earned.
// reward: a short line about what it unlocks (the streak ones unlock player card colours, see game/cardThemes.js).
import { categories, patterns } from './patterns.js';

export const achievements = [
  { id: 'first-card', name: 'First card', how: 'Win your first card in Fix it.', test: (p) => p.passed.length >= 1 },
  {
    id: 'collector',
    name: 'Full set',
    how: 'Collect every card in one group.',
    test: (p) => categories.some((c) => patterns.filter((x) => x.category === c.id).every((x) => p.passed.includes(x.id))),
  },
  { id: 'three-stars', name: 'Flawless fix', how: 'Win a card with all 3 stars.', test: (p) => Object.values(p.stars).some((s) => s === 3) },
  {
    id: 'perfect-daily',
    name: 'Perfect Daily',
    how: 'Get all 5 right in a Daily.',
    test: (p) => Object.values(p.daily).some((r) => r.length === 5 && r.every(Boolean)),
  },
  { id: 'on-fire', name: 'On fire', how: 'Get 10 right in a row in This or That.', test: (p) => p.stats.bestStreak >= 10 },
  { id: 'lightning', name: 'Lightning', how: 'Score 30 or more in a Speed round.', test: (p) => p.stats.speedBest >= 30 },
  { id: 'sharp-eye', name: 'Sharp eye', how: 'Finish 5 Spot the flaw screens.', test: (p) => p.hunts.length >= 5 },
  { id: 'trusted', name: 'Trusted', how: 'Reach the best ending in a story.', test: (p) => p.storyTop },
  { id: 'ship-it', name: 'Ship it', how: 'Get 3 stars in Build mode.', test: (p) => Object.values(p.stats.builds).some((s) => s === 3) },
  { id: 'boss-slayer', name: 'Boss slayer', how: 'Beat a boss round.', test: (p) => p.bossBeaten >= 1 },
  { id: 'streak-3', name: '3 days in a row', how: 'Play 3 days in a row.', reward: 'Unlocks the Lime player card.', test: (p) => p.bestDayStreak >= 3 },
  { id: 'streak-7', name: 'A whole week', how: 'Play 7 days in a row.', reward: 'Unlocks the Ocean player card.', test: (p) => p.bestDayStreak >= 7 },
  { id: 'streak-30', name: 'A whole month', how: 'Play 30 days in a row.', reward: 'Unlocks the Gold player card.', test: (p) => p.bestDayStreak >= 30 },
  { id: 'night-owl', name: 'Night owl', how: 'Play after midnight.', secret: true, event: (e) => e.type === 'answer' && e.hour < 5 },
  { id: 'early-bird', name: 'Early bird', how: 'Play before 7 in the morning.', secret: true, event: (e) => e.type === 'answer' && e.hour >= 5 && e.hour < 7 },
  { id: 'clean-slate', name: 'Clean slate', how: 'Empty your misses deck.', secret: true, event: (e) => e.type === 'misses-cleared' },
];

export const getAchievement = (id) => achievements.find((a) => a.id === id);
