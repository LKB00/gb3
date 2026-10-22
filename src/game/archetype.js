import { categories, patterns } from '../data/patterns';

// "What kind of AI designer are you?": one type per group. Which one you are, and its rank
// (Rising → The → Master), is worked out in game/designerType.js.
export const ARCHETYPES = {
  input: { name: 'The Guide', line: 'You help people ask for the right thing.' },
  output: { name: 'The Storyteller', line: 'You make AI answers a joy to read and use.' },
  control: { name: 'The Steward', line: 'You keep people in charge, never the AI.' },
  trust: { name: 'The Trust Keeper', line: 'You make AI honest about what it doesn’t know.' },
  feedback: { name: 'The Listener', line: 'You turn mistakes into better AI.' },
  agents: { name: 'The Agent Wrangler', line: 'You let AI act on its own, safely.' },
  voice: { name: 'The Voice Whisperer', line: 'You design AI people can talk to.' },
  none: { name: 'The Newcomer', line: 'Every legend starts somewhere. Go play!' },
};

// Which group badges are won (all cards collected).
export function wonGroups(passed) {
  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    won: patterns.filter((p) => p.category === c.id).every((p) => passed.includes(p.id)),
  }));
}
