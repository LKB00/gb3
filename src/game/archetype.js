import { categories, patterns } from '../data/patterns';

// "What kind of AI designer are you?" Picked from the group where you've
// collected the most (stars count), so it changes as you play.
export const ARCHETYPES = {
  input: { name: 'The Guide', line: 'You help people ask for the right thing.' },
  output: { name: 'The Storyteller', line: 'You make AI answers clear and easy to use.' },
  control: { name: 'The Steward', line: 'You keep people in charge, never the AI.' },
  trust: { name: 'The Trust Keeper', line: 'You make AI honest about what it knows.' },
  feedback: { name: 'The Listener', line: 'You turn mistakes into better AI.' },
  agents: { name: 'The Agent Wrangler', line: 'You let AI act on its own, safely.' },
  voice: { name: 'The Voice Whisperer', line: 'You design AI people can talk to.' },
  none: { name: 'The Newcomer', line: 'Every legend starts somewhere. Go play!' },
};

export function archetype(passed, stars) {
  let best = 'none';
  let bestScore = 0;
  for (const c of categories) {
    const list = patterns.filter((p) => p.category === c.id);
    const score = list.reduce((n, p) => n + (passed.includes(p.id) ? Math.max(stars[p.id] || 1, 1) : 0), 0) / (list.length * 3);
    if (score > bestScore) {
      best = c.id;
      bestScore = score;
    }
  }
  return { id: best, ...ARCHETYPES[best] };
}

// Which group badges are won (all cards collected).
export function wonGroups(passed) {
  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    won: patterns.filter((p) => p.category === c.id).every((p) => passed.includes(p.id)),
  }));
}
