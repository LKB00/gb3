// The Mystery card: a bonus card that is not one of the 38. It unlocks after a 7-day streak
// (achievement 'streak-7'). Same shape as a pattern in patterns.js plus its visuals.js entry
// (`compare` and a short Fix it `lab`), so Compare and Lab can draw it.
// Its id is not in patterns.js on purpose: it never counts as a collected card or for XP.
import { user, ai, note, text, chips, buttons } from '../mock/blocks.js';

const opt = (label, ok, why, blocks) => ({ label, ok, why, blocks });
const slot = (id) => ({ slot: id });

const ask = user('Can I bring my dog on the train?');
const answer = ai('**Yes!** Small dogs ride free.');
const catchLine = note('Big dogs need a ticket and a lead.', { tone: 'warn' });
const more = chips([':more Show the full rules', 'Ticket prices']);
const wall = text(
  'Great question! Train rules for pets have changed a lot over the years, and they differ by route, by company and by season. Pets can be a joy on trips, but also a worry for other riders…',
);

export const mystery = {
  id: 'short-answer-first',
  title: 'Short answer first',
  category: 'output',
  summary: 'Lead with a short, clear answer. Put the long details one tap away.',
  problem: 'Long AI answers bury the one line people came for. They scroll, skim, and still miss it.',
  solution: 'Say the answer in the first line. Add the one catch that matters. Keep the rest behind “More”.',
  dos: ['Answer in the first line', 'Keep the key catch next to the answer', 'Offer details on tap'],
  donts: ['Open with “Great question!”', 'Hide the catch deep in the text'],
  compare: {
    bad: {
      caption: 'The answer is in there somewhere',
      blocks: [ask, { ...wall, pin: 'Still no answer' }],
    },
    good: {
      caption: 'Answer first, details on tap',
      blocks: [ask, { ...answer, pin: 'The answer, in line 1' }, { ...catchLine, pin: 'The catch, up front' }, { ...more, pin: 'More if they want it' }],
    },
  },
  lab: {
    goal: 'Someone asks a quick question. Get them the answer fast.',
    frame: [ask, slot('first'), slot('catch'), slot('details')],
    decisions: [
      {
        id: 'first',
        label: 'What comes first?',
        options: [
          opt('A friendly warm-up', false, 'Nice words, but the answer is still hiding.', [text('Great question! Train rules for pets have changed a lot over the years…')]),
          opt('The answer itself', true, 'They know in one second.', [answer]),
          opt('All 8 rules in a list', false, 'Now they must read all 8 to find a yes or no.', [buttons(['Rule 1', 'Rule 2', 'Rule 3', '+5 more'])]),
        ],
      },
      {
        id: 'catch',
        label: 'Where does the catch go?',
        options: [
          opt('Deep in the details', false, 'Someone with a big dog gets a nasty surprise at the gate.', []),
          opt('One short line under the answer', true, 'The thing that could bite them is right there.', [catchLine]),
        ],
      },
      {
        id: 'details',
        label: 'And the long details?',
        options: [
          opt('Show them all, right away', false, 'A wall of text pushes the answer off the screen.', [wall]),
          opt('Leave them out', false, 'Some people do need the full rules. Keep them close.', []),
          opt('One tap away', true, 'Short for most people, deep for the curious.', [more]),
        ],
      },
    ],
  },
};
