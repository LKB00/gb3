// Visual content for every pattern:
//  - compare: a "bad" and a "good" mock screen with short pins (labels on the screen)
//  - lab: the Design Lab. People pick one option per decision; wrong options are
//         common mistakes, and `why` explains them after "Check my design".
// Blocks are drawn by src/mock/Mock.jsx.

import { user, ai, note, text, chips, buttons, input, ph, ghost, edit, steps, spinner, banner, toast, variants, rows, card, list, check, diff, modal, slider, toggle, avatar, blank } from '../mock/blocks.js';

const opt = (label, ok, why, blocks) => ({ label, ok, why, blocks });
const slot = (id) => ({ slot: id });

// shared bits
const email =
  'Hi Priya, thanks for joining the design review. Your notes on checkout helped a lot. Could you share the research file before Friday?';
const invoiceRows = (tags) =>
  rows([
    { label: 'Vendor', value: 'Pixel Studio', ...tags[0] },
    { label: 'Date', value: '12 Sep 2026', ...tags[1] },
    { label: 'Total', value: '₹ 48,500', ...tags[2] },
    { label: 'Tax ID', value: '29AB…C1Z?', ...tags[3] },
  ]);
const sure = { tag: 'Sure', tone: 'ok' };
const checkIt = { tag: 'Check this', tone: 'warn' };
const notSure = { tag: 'Not sure', tone: 'bad' };

export const visuals = {
  /* ================= INPUT ================= */
  'prompt-starters': {
    compare: {
      bad: { caption: 'People freeze at an empty box', blocks: [blank(''), ph('Ask anything…', { pin: 'No hint what to ask' })] },
      good: {
        caption: 'Examples teach what is possible',
        blocks: [
          note('Write, summarize or brainstorm. Try one:'),
          chips([':pen Write onboarding copy', ':file Summarize research', ':palette Suggest palettes'], { pin: 'Real, specific examples' }),
          ph('Ask, or pick an example…'),
        ],
      },
    },
    lab: {
      goal: 'A new AI writing app says hello. Show people what to ask.',
      frame: [slot('message'), slot('examples'), slot('click')],
      decisions: [
        {
          id: 'message',
          label: 'What does the welcome say?',
          options: [
            opt('"Hello! I am an AI."', false, 'People still don’t know what the AI is for.', [note('Hello! I am an AI.')]),
            opt('"Write, summarize or brainstorm"', true, 'In four words, people know what it’s for.', [note('Write, summarize or brainstorm. Try one:')]),
          ],
        },
        {
          id: 'examples',
          label: 'Show example requests?',
          options: [
            opt('None', false, 'People stare at an empty box, unsure what to type. Many leave.', []),
            opt('12 generic ones', false, 'Twelve vague ideas feel like noise. People skip them all.', [
              chips(['Ask me', 'Help', 'Write', 'Ideas', 'Fix', 'Explain', 'Plan', 'Chat', 'Code', 'Learn', 'Create', 'More…']),
            ]),
            opt('3 specific ones', true, 'Three real ideas show what’s possible at a glance.', [
              chips([':pen Write onboarding copy', ':file Summarize research', ':palette Suggest palettes']),
            ]),
          ],
        },
        {
          id: 'click',
          label: 'Tapping an example…',
          options: [
            opt('Sends it right away', false, 'People can’t tweak it first, and get an answer they didn’t want.', [
              user('Write onboarding copy'),
              { type: 'spinner', text: 'Writing…' },
            ]),
            opt('Fills the box to edit', true, 'People can make it their own before sending.', [input('Write onboarding copy for a budgeting app▍')]),
          ],
        },
      ],
    },
  },

  'clarifying-questions': {
    compare: {
      bad: {
        caption: 'AI guesses, person starts over',
        blocks: [
          user('Make a launch post for the dashboard.'),
          ai('Big news, everyone! Our dashboard just got better…', { pin: 'Guessed the audience' }),
          user('No… this is for investors.', { pin: 'Wasted round' }),
        ],
      },
      good: {
        caption: 'One quick question first',
        blocks: [
          user('Make a launch post for the dashboard.'),
          ai('Quick check: **who is this for?**'),
          chips(['Customers', 'Team', 'Investors', 'Just guess'], { pin: 'Tap, don\'t type' }),
        ],
      },
    },
    lab: {
      goal: 'Someone asks: “Make a launch post.” For whom? Help the AI get it right.',
      frame: [user('Make a launch post for the new dashboard.'), slot('first'), slot('answer'), slot('skip')],
      decisions: [
        {
          id: 'first',
          label: 'The AI first…',
          options: [
            opt('Guesses and writes it all', false, 'One wrong guess, and the person starts over.', [ai('Big news, everyone! Our dashboard…')]),
            opt('Asks 5 questions', false, 'It feels like a tax form. People give up.', [
              ai('Who is the audience? What tone? How long? Which channel? Emoji or not?'),
            ]),
            opt('Asks 1 key question', true, 'One smart question, and the post lands right.', [ai('Quick check: **who is this for?**')]),
          ],
        },
        {
          id: 'answer',
          label: 'People answer by…',
          options: [
            opt('Typing a reply', false, 'Typing is slow, especially on a phone.', [ph('Type your answer…')]),
            opt('Tapping a button', true, 'One tap. Done.', [chips(['Customers', 'Team', 'Investors'])]),
          ],
        },
        {
          id: 'skip',
          label: 'Can they skip?',
          options: [
            opt('No, they must answer', false, 'People in a hurry feel stuck. Let them skip.', []),
            opt('"Just guess" option', true, 'Busy people get a draft right away. No quiz.', [chips(['Just guess'])]),
          ],
        },
      ],
    },
  },

  'visible-context': {
    compare: {
      bad: {
        caption: 'Hidden context, wrong file',
        blocks: [user('Summarize this.'), ai('Here is a summary of **old-draft-v2.pdf**…', { pin: 'Used the wrong file' })],
      },
      good: {
        caption: 'You see what the AI sees',
        blocks: [chips([':file Q3-report.pdf', ':plus Add'], { pin: 'Visible + removable' }), input('Summarize this.')],
      },
    },
    lab: {
      goal: 'An AI in a docs app answers from your files. Show what it reads.',
      frame: [slot('show'), slot('change'), input('Summarize this.'), slot('limit')],
      decisions: [
        {
          id: 'show',
          label: 'Show which files the AI reads?',
          options: [
            opt('No, the AI decides', false, 'If the AI grabs the wrong file, people never find out.', []),
            opt('Yes, show the files', true, 'People see it’s using the right file.', [chips([':file Q3-report.pdf'])]),
          ],
        },
        {
          id: 'change',
          label: 'Can people change it?',
          options: [
            opt('No', false, 'Wrong file? People are stuck with it.', []),
            opt('Remove or add', true, 'People stay in charge of what the AI reads.', [buttons([':x Remove', ':plus Add file'])]),
          ],
        },
        {
          id: 'limit',
          label: 'The file is too long for the AI…',
          options: [
            opt('Cut it silently', false, 'The AI reads half the file, and nobody knows.', []),
            opt('Say what was used', true, 'It owns up to what it skipped.', [note('Used the first 50 of 80 pages.', { tone: 'warn' })]),
          ],
        },
      ],
    },
  },

  'structured-controls': {
    compare: {
      bad: {
        caption: 'Needs "prompt magic"',
        blocks: [input('Write a reply. Formal but warm, under 80 words, bullet points, no emoji, British spelling…', { pin: 'Most people can\'t write this' })],
      },
      good: {
        caption: 'Common needs are one tap',
        blocks: [
          input('Reply to this email'),
          chips(['Friendly', 'Formal', 'Short'], { on: 0, pin: 'Tone in one tap' }),
          slider('Length', 30, 'Short', 'Long'),
        ],
      },
    },
    lab: {
      goal: 'The AI wrote a reply. Help people make it shorter or friendlier.',
      frame: [ai('Hi Sam, thanks for the update! Friday works for me…'), slot('how'), slot('count')],
      decisions: [
        {
          id: 'how',
          label: 'To change tone or length, people…',
          options: [
            opt('Type it in the chat box', false, 'People don’t know what words to type.', [ph('e.g. "make it formal, under 80 words"')]),
            opt('Tap buttons and a slider', true, 'One tap does the typing for them.', [
              chips(['Friendly', 'Formal', 'Short'], { on: 1 }),
              slider('Length', 35, 'Short', 'Long'),
            ]),
          ],
        },
        {
          id: 'count',
          label: 'How many settings?',
          options: [
            opt('15 up front', false, 'A wall of 15 settings. People freeze.', [
              rows([
                { label: 'Tone', value: 'Formal' },
                { label: 'Length', value: '80 words' },
                { label: 'Format', value: 'Bullets' },
                { label: 'Emoji', value: 'Off' },
                { label: 'Spelling', value: 'UK' },
                { label: '+ 10 more…', value: '' },
              ]),
            ]),
            opt('Show 2–3, hide the rest', true, 'Common ones up front. The rest wait.', [buttons([':more More options'])]),
          ],
        },
      ],
    },
  },

  /* ================= OUTPUT ================= */
  'streaming-response': {
    compare: {
      bad: {
        caption: 'Silent waiting feels broken',
        blocks: [user('Summarize my 3 interviews.'), spinner('Loading…', { pin: 'Loading what? How long?' }), blank('')],
      },
      good: {
        caption: 'Progress you can see',
        blocks: [
          user('Summarize my 3 interviews.'),
          steps([['Reading 3 notes', 'done'], ['Finding themes', 'done'], ['Writing summary', 'active']], { pin: 'Plain-word steps' }),
          ai('Top themes: (1) People cannot find saved items…', { caret: true }),
          buttons(['-:stop Stop']),
        ],
      },
    },
    lab: {
      goal: 'The AI needs 20 seconds to answer. Make the wait feel short.',
      frame: [user('Summarize my 3 interview notes.'), slot('progress'), slot('text'), slot('stop')],
      decisions: [
        {
          id: 'progress',
          label: 'While it works, show…',
          options: [
            opt('Nothing', false, 'A still screen looks broken. People tap again, or leave.', [blank('')]),
            opt('A spinner only', false, 'A spinner says “wait”, but not for what or how long. The wait drags.', [spinner('Loading…')]),
            opt('Live steps', true, 'Real progress makes the wait feel short.', [
              steps([['Reading 3 notes', 'done'], ['Finding themes', 'done'], ['Writing summary', 'active']]),
            ]),
          ],
        },
        {
          id: 'text',
          label: 'The answer appears…',
          options: [
            opt('All at the end', false, '20 seconds of nothing. Feels like forever.', [note('The answer will appear when it is finished.')]),
            opt('Word by word', true, 'People start reading right away.', [ai('Top themes: (1) People cannot find saved items…', { caret: true })]),
          ],
        },
        {
          id: 'stop',
          label: 'Can people stop it?',
          options: [
            opt('No', false, 'If it goes off track, people are stuck watching.', []),
            opt('Stop button', true, 'Off track? One tap stops it.', [buttons(['-:stop Stop'])]),
          ],
        },
      ],
    },
  },

  'multiple-variants': {
    compare: {
      bad: {
        caption: 'One take-it-or-leave-it guess',
        blocks: [user('Headline for our project app'), ai('Track every project in one place.', { pin: 'Only one option' })],
      },
      good: {
        caption: 'Choosing beats describing',
        blocks: [
          user('Headline for our project app'),
          variants(['Track every project in one place.', 'Your projects, finally organized.', 'Stop chasing updates.'], {
            on: 1,
            pin: 'Truly different',
          }),
          buttons(['!Use B', 'More like B']),
        ],
      },
    },
    lab: {
      goal: 'The AI writes a website headline. Help people find one they love.',
      frame: [user('Write a headline for our project app.'), slot('count'), slot('next')],
      decisions: [
        {
          id: 'count',
          label: 'How many results?',
          options: [
            opt('1', false, 'One option is “take it or leave it”. Picking beats explaining.', [ai('Track every project in one place.')]),
            opt('3 different', true, 'A few real choices, easy to compare.', [
              variants(['Track every project in one place.', 'Your projects, finally organized.', 'Stop chasing updates.']),
            ]),
            opt('10 similar', false, 'Ten near-copies. People’s eyes glaze over.', [
              variants(['Track projects.', 'Track your projects.', 'Track all projects.', 'Projects, tracked.', 'Track projects here.', 'Track projects easily.']),
            ]),
          ],
        },
        {
          id: 'next',
          label: 'After people pick one…',
          options: [
            opt('Nothing', false, 'A dead end. People can’t build on the one they like.', []),
            opt('"Use" + "More like this"', true, 'People grow the one they like.', [buttons(['!Use B', 'More like B'])]),
          ],
        },
      ],
    },
  },

  'regenerate-history': {
    compare: {
      bad: {
        caption: 'Retry deletes the old answer',
        blocks: [ai('Fresh beans, warm hearts.'), buttons([':retry Regenerate'], { pin: 'Old answer lost' })],
      },
      good: {
        caption: 'Every version is kept',
        blocks: [ai('Fresh beans, warm hearts.'), buttons([':left', '2 / 3', ':right', ':retry Retry'], { pin: 'Go back anytime' }), chips(['Shorter', 'Funnier', 'Formal'])],
      },
    },
    lab: {
      goal: 'People don’t like the answer, so they tap “Try again”. Keep it safe.',
      frame: [user('Tagline for a coffee shop'), ai('Fresh beans, warm hearts.'), slot('regen'), slot('steer')],
      decisions: [
        {
          id: 'regen',
          label: 'When people tap "Try again"…',
          options: [
            opt('Replace the answer', false, 'Worse new answer? The old one is gone forever.', [buttons([':retry Regenerate'])]),
            opt('Keep versions ‹ 2/3 ›', true, 'Nothing lost. People flip back and compare.', [buttons([':left', '2 / 3', ':right', ':retry Retry'])]),
          ],
        },
        {
          id: 'steer',
          label: 'Can they say what to change?',
          options: [
            opt('No, random retry', false, 'People roll the dice again and again.', []),
            opt('Quick hints', true, 'A hint like "shorter" gets closer, faster.', [chips(['Shorter', 'Funnier', 'More formal'])]),
          ],
        },
      ],
    },
  },

  /* ================= CONTROL ================= */
  'editable-output': {
    compare: {
      bad: {
        caption: 'Fix 1 word = redo everything',
        blocks: [ai(email), buttons(['Copy', ':retry Regenerate all'], { pin: 'Only all-or-nothing' })],
      },
      good: {
        caption: 'A draft you can shape',
        blocks: [
          note(':sparkle AI draft · review before sending', { tone: 'accent' }),
          edit(email, { sel: 'Your notes on checkout helped a lot.', pin: 'Edit directly' }),
          buttons([':sparkle Rewrite selection']),
        ],
      },
    },
    lab: {
      goal: 'The AI wrote an email. It is 80% right. Help people fix the rest.',
      frame: [slot('label'), slot('edit'), slot('part')],
      decisions: [
        {
          id: 'edit',
          label: 'How can people change it?',
          options: [
            opt('Copy it, or ask again', false, 'People lose the good 80% to fix 20%. Ouch.', [ai(email)]),
            opt('Edit text directly', true, 'The draft is theirs. They fix it right in place.', [edit(email)]),
          ],
        },
        {
          id: 'part',
          label: 'To fix just one part…',
          options: [
            opt('Rewrite everything', false, 'The parts people loved change too.', [buttons([':retry Regenerate all'])]),
            opt('Rewrite only the selected part', true, 'Only the weak part changes.', [buttons([':sparkle Rewrite selection'])]),
          ],
        },
        {
          id: 'label',
          label: 'Mark it as a draft?',
          options: [
            opt('No', false, 'People may hit send without reading it.', []),
            opt('"AI draft · review"', true, 'A gentle reminder to check before sending.', [note(':sparkle AI draft · review before sending', { tone: 'accent' })]),
          ],
        },
      ],
    },
  },

  'inline-suggestions': {
    compare: {
      bad: {
        caption: 'AI changes your words',
        blocks: [edit('Thanks for the feedback! I will update the design today. Kind regards, The Team'), note(':sparkle AI improved your text', { pin: 'Changed without asking' })],
      },
      good: {
        caption: 'Grey = only an idea',
        blocks: [ghost('Thanks for the fe', 'edback, I will update the design today.', { pin: 'Clearly a suggestion' }), note('Tab accept · Esc ignore')],
      },
    },
    lab: {
      goal: 'The AI guesses the next words as people type. Keep it polite.',
      frame: [slot('style'), slot('accept'), slot('typing')],
      decisions: [
        {
          id: 'style',
          label: 'The suggestion looks…',
          options: [
            opt('Like typed text', false, 'People can’t tell their words from the AI’s.', [ghost('Thanks for the fe', 'edback, I will update the design today.', { solid: true })]),
            opt('Light grey', true, 'Clearly a hint, not their words.', [ghost('Thanks for the fe', 'edback, I will update the design today.')]),
          ],
        },
        {
          id: 'accept',
          label: 'How do people accept it?',
          options: [
            opt('Automatically', false, 'Words people never chose. Now they must delete them.', [note('Applied automatically')]),
            opt('A pop-up asks each time', false, 'A pop-up every few seconds breaks the flow.', [modal('Use the AI suggestion?', '', ['Yes', 'No'])]),
            opt('Press Tab', true, 'Easy to take, easy to ignore.', [note('Tab accept · Esc ignore')]),
          ],
        },
        {
          id: 'typing',
          label: 'While a suggestion loads…',
          options: [
            opt('Typing waits', false, 'Waiting to type your own words feels broken.', [spinner('Please wait…')]),
            opt('Typing never waits', true, 'The AI should wait for people, not the other way round.', []),
          ],
        },
      ],
    },
  },

  'stop-and-undo': {
    compare: {
      bad: {
        caption: 'No way back',
        blocks: [steps([['Renaming 24 layers', 'done'], ['Deleting 12 layers', 'done']]), toast('Done! 12 layers deleted.', '', { pin: 'No undo, no confirm' })],
      },
      good: {
        caption: 'Mistakes are cheap',
        blocks: [
          steps([['Renaming 24 layers', 'active']]),
          buttons(['-:stop Stop'], { pin: 'Stop anytime' }),
          toast('Renamed 24 layers', 'Undo', { pin: 'One-click undo' }),
        ],
      },
    },
    lab: {
      goal: 'An AI agent cleans up a design file on its own. Keep people safe.',
      frame: [slot('stop'), slot('after'), slot('risky')],
      decisions: [
        {
          id: 'stop',
          label: 'While it works',
          options: [
            opt('No controls', false, 'If it goes wrong, people can only watch.', [steps([['Renaming 24 layers', 'active']])]),
            opt('Stop button', true, 'People can stop it the moment it goes wrong.', [steps([['Renaming 24 layers', 'active']]), buttons(['-:stop Stop'])]),
          ],
        },
        {
          id: 'after',
          label: 'When it finishes',
          options: [
            opt('"Done!"', false, 'With no way back, people get scared to use the AI.', [toast('Done! 24 layers renamed.')]),
            opt('Summary + Undo', true, 'Any mistake is one tap from fixed.', [toast('Renamed 24 layers', 'Undo')]),
          ],
        },
        {
          id: 'risky',
          label: 'Before deleting layers',
          options: [
            opt('Just delete', false, 'Deleted work can’t come back. Always ask first.', [toast('Deleted 12 layers')]),
            opt('Confirm with details', true, 'People see what goes, before it goes.', [modal('Delete 12 unused layers?', 'They are hidden and not used anywhere.', ['Cancel', '-Delete 12'])]),
          ],
        },
      ],
    },
  },

  'preview-changes': {
    compare: {
      bad: {
        caption: 'What changed? Nobody knows',
        blocks: [edit('We use this tool to plan work and share it with the team.'), toast('Document improved', '', { pin: 'Changed silently' })],
      },
      good: {
        caption: 'Before → after, you decide',
        blocks: [
          diff([['utilize', 'use'], ['in order to', 'to'], ['a large number of', 'many']], { pin: 'See every change' }),
          buttons([':check Accept', ':x Reject', 'Next']),
          note('3 changes · 1 reviewed'),
        ],
      },
    },
    lab: {
      goal: 'The AI rewrote parts of a 3-page doc. Help people check every change.',
      frame: [slot('show'), slot('choose'), slot('count')],
      decisions: [
        {
          id: 'show',
          label: 'Show the changes as…',
          options: [
            opt('The new version', false, 'People can’t spot what changed. They must trust it blindly.', [edit('We use this tool to plan work and share it with the team.')]),
            opt('Before → after', true, 'Every change jumps out. Easy to check.', [diff([['utilize', 'use'], ['in order to', 'to']])]),
          ],
        },
        {
          id: 'choose',
          label: 'How do people accept changes?',
          options: [
            opt('Accept all or nothing', false, 'One bad change means losing the good ones too.', [buttons(['!Accept all', 'Reject all'])]),
            opt('Accept each change', true, 'Keep the good, drop the bad.', [buttons([':check Accept', ':x Reject', 'Next'])]),
          ],
        },
        {
          id: 'count',
          label: 'Show how many are left?',
          options: [
            opt('No', false, 'People can’t tell if they checked them all.', []),
            opt('"12 changes · 3 reviewed"', true, 'People always know how much is left.', [note('12 changes · 3 reviewed')]),
          ],
        },
      ],
    },
  },

  /* ================= TRUST ================= */
  'set-expectations': {
    compare: {
      bad: {
        caption: 'Over-promise → blind trust',
        blocks: [banner('info', 'Meet Max', 'The AI that knows everything!', { pin: 'Not true' }), ph('Ask Max anything…')],
      },
      good: {
        caption: 'Honest strengths and limits',
        blocks: [
          card('Your research assistant', 'Works with your uploaded notes.'),
          list(['✓ Summarize interviews', '✓ Find themes', '✕ Can\'t see Figma files'], { pin: 'Says the limit' }),
          note('Can make mistakes. Check important info.'),
        ],
      },
    },
    lab: {
      goal: 'A new AI research helper says hi. Make its welcome honest.',
      frame: [slot('promise'), slot('can'), slot('mistakes')],
      decisions: [
        {
          id: 'promise',
          label: 'The headline',
          options: [
            opt('"Knows everything!"', false, 'People believe it blindly, then feel let down. Promise less.', [banner('info', 'Meet Max', 'The AI that knows everything!')]),
            opt('"Your research assistant"', true, 'A clear, honest role.', [card('Your research assistant', 'Works with your uploaded notes.')]),
          ],
        },
        {
          id: 'can',
          label: 'Describe what it can do with…',
          options: [
            opt('A 10-item feature list', false, 'Ten bullets? Eyes slide past.', [
              list(['• Summaries', '• Themes', '• Quotes', '• Personas', '• Journeys', '• Charts', '• Tags', '• + 3 more']),
            ]),
            opt('2 strengths + 1 limit', true, 'Short, and honest about the limit.', [list(['✓ Summarize interviews', '✓ Find themes', '✕ Can\'t see Figma files'])]),
          ],
        },
        {
          id: 'mistakes',
          label: 'Say it can make mistakes?',
          options: [
            opt('No', false, 'People copy wrong answers without a second look.', []),
            opt('"Can make mistakes"', true, 'A small reminder that’s always there.', [note('Can make mistakes. Check important info.')]),
          ],
        },
      ],
    },
  },

  citations: {
    compare: {
      bad: {
        caption: 'Confident, but from where?',
        blocks: [
          user('Why do users struggle with export?'),
          ai('Most users cannot find the export button and it is a top support topic.', { pin: 'No proof' }),
          note('Sources: report.pdf · tickets.csv', { pin: 'Which says what?' }),
        ],
      },
      good: {
        caption: 'Check each claim in one tap',
        blocks: [
          user('Why do users struggle with export?'),
          ai('Most users cannot find it [1]. It is a top support topic [2].', { pin: 'Source next to claim' }),
          card('[1] Q3 research report', '"7 of 10 could not find export."'),
        ],
      },
    },
    lab: {
      goal: 'The AI answers from company docs. Help people check it’s true.',
      frame: [user('Why do users struggle with export?'), slot('place'), slot('preview'), slot('gap')],
      decisions: [
        {
          id: 'place',
          label: 'Where do sources go?',
          options: [
            opt('No sources', false, 'Wrong answers look just as true as right ones.', [ai('Most users cannot find it. It is a top support topic.')]),
            opt('A list at the end', false, 'People can’t tell which source backs which fact.', [
              ai('Most users cannot find it. It is a top support topic.'),
              note('Sources: report.pdf · tickets.csv'),
            ]),
            opt('Next to each claim', true, 'Every fact can be checked right where it sits.', [ai('Most users cannot find it [1]. It is a top support topic [2].')]),
          ],
        },
        {
          id: 'preview',
          label: 'Tapping a source…',
          options: [
            opt('Opens a new tab', false, 'A new tab is work, so most people never check.', [note('Opens report.pdf in a new tab')]),
            opt('Shows the quote here', true, 'Checking takes one second.', [card('[1] Q3 research report', '"7 of 10 could not find export."')]),
          ],
        },
        {
          id: 'gap',
          label: 'No source for one fact',
          options: [
            opt('Say nothing', false, 'It looks as solid as the rest. People get fooled.', []),
            opt('Say it clearly', true, 'Saying “I have no source” is honest. People trust it more.', [note('No source about export speed, so I left it out.', { tone: 'warn' })]),
          ],
        },
      ],
    },
  },

  'confidence-signals': {
    compare: {
      bad: {
        caption: 'Fake precision',
        blocks: [{ ...invoiceRows([{ tag: '98.7%' }, { tag: '97.2%' }, { tag: '61.4%' }, { tag: '43.0%' }]), pin: 'What does 61.4% mean?' }],
      },
      good: {
        caption: 'Words + color show where to look',
        blocks: [invoiceRows([sure, sure, checkIt, notSure]), buttons(['Show only "check this" (2)'], { pin: 'Review faster' })],
      },
    },
    lab: {
      goal: 'The AI read an invoice, but some parts are unsure. Show which.',
      frame: [slot('show'), slot('hint'), slot('filter')],
      decisions: [
        {
          id: 'show',
          label: 'Show how sure it is with…',
          options: [
            opt('Nothing', false, 'Everything looks sure, so people trust the mistakes too.', [invoiceRows([{}, {}, {}, {}])]),
            opt('Exact percent', false, '61.4% looks exact, but it’s a rough guess. People trust it too much.', [invoiceRows([{ tag: '98.7%' }, { tag: '97.2%' }, { tag: '61.4%' }, { tag: '43.0%' }])]),
            opt('Words + icon + color', true, 'Clear at a glance. Words help people who can’t see colors well.', [invoiceRows([sure, sure, checkIt, notSure])]),
          ],
        },
        {
          id: 'hint',
          label: 'Say why it is unsure?',
          options: [
            opt('No', false, 'People don’t know what to check.', []),
            opt('Short hint', true, 'Points to exactly what to check.', [note('Total: blurry digit, may be 46,500', { tone: 'warn' })]),
          ],
        },
        {
          id: 'filter',
          label: 'Help people check',
          options: [
            opt('Nothing', false, 'People must re-check every field. Tiring.', []),
            opt('"Show only check (2)"', true, 'People check only the 2 shaky fields.', [buttons(['Show only "check this" (2)'])]),
          ],
        },
      ],
    },
  },

  'ai-disclosure': {
    compare: {
      bad: {
        caption: 'Looks human-written',
        blocks: [avatar('Asha K', 'Product designer'), text('Our new onboarding cuts setup time in half. Try it today!', { pin: 'AI-written, no label' })],
      },
      good: {
        caption: 'Clear and honest',
        blocks: [
          avatar('Asha K', 'Product designer', 'AI-assisted', { pin: 'Visible label' }),
          text('Our new onboarding cuts setup time in half. Try it today!'),
          note('Written with AI, edited by Asha'),
        ],
      },
    },
    lab: {
      goal: 'In a team app, the AI writes posts for people. Readers should know.',
      frame: [slot('label'), text('Our new onboarding cuts setup time in half. Try it today!'), slot('edited')],
      decisions: [
        {
          id: 'label',
          label: 'Show that AI wrote it?',
          options: [
            opt('No label', false, 'Readers feel tricked when they find out later.', [avatar('Asha K', 'Product designer')]),
            opt('Tiny grey "ai" at the end', false, 'A label nobody sees is no label. Readers still feel tricked.', [
              avatar('Asha K', 'Product designer'),
              note('ai', { tone: 'faint' }),
            ]),
            opt('Badge by the name', true, 'Readers see it at the same moment as the name.', [avatar('Asha K', 'Product designer', 'AI-assisted')]),
          ],
        },
        {
          id: 'edited',
          label: 'After the person edits it',
          options: [
            opt('Remove the label', false, 'Readers are misled. It’s still partly AI.', []),
            opt('"Written with AI, edited by Asha"', true, 'Tells the whole true story.', [note('Written with AI, edited by Asha')]),
          ],
        },
      ],
    },
  },

  'explain-why': {
    compare: {
      bad: {
        caption: 'A score is not a reason',
        blocks: [card('Advanced Prototyping', '', { tag: 'Recommended' }), note('Match score: 0.92', { pin: 'Means nothing to people' })],
      },
      good: {
        caption: 'Real reasons from your data',
        blocks: [
          card('Advanced Prototyping', '', { tag: 'Recommended' }),
          list(['✓ You finished "Figma Basics"', '✓ You opened 4 prototyping lessons'], { pin: 'Plain words' }),
          buttons(['Not relevant']),
        ],
      },
    },
    lab: {
      goal: 'An app suggests a course to a learner. Help them see why.',
      frame: [card('Advanced Prototyping', '', { tag: 'Recommended' }), slot('why'), slot('fix')],
      decisions: [
        {
          id: 'why',
          label: 'Explain the pick with…',
          options: [
            opt('Nothing', false, 'People can’t judge it. They ignore it, or follow blindly.', []),
            opt('Score "0.92"', false, '0.92 means nothing to people. It’s a score, not a reason.', [note('Match score: 0.92')]),
            opt('2 plain reasons', true, 'People can see if the reasons fit them.', [list(['✓ You finished "Figma Basics"', '✓ You opened 4 prototyping lessons'])]),
          ],
        },
        {
          id: 'fix',
          label: 'If a reason is wrong',
          options: [
            opt('Nothing to do', false, 'People get the same bad picks again and again.', []),
            opt('"This is wrong"', true, 'People teach the AI. Next picks improve.', [buttons(['This is wrong', 'Show less like this'])]),
          ],
        },
      ],
    },
  },

  'memory-controls': {
    compare: {
      bad: {
        caption: '"How does it know that?"',
        blocks: [user('Ideas for a weekend trip?'), ai('Since your divorce last year, maybe a solo trip…', { pin: 'Creepy, never shared on purpose' })],
      },
      good: {
        caption: 'People see and control memory',
        blocks: [
          note(':save Memory updated: "Prefers short answers"', { tone: 'accent', pin: 'Says when it saves' }),
          rows([
            { label: 'Prefers short answers', value: '', action: 'Delete' },
            { label: 'Works in Figma', value: '', action: 'Delete' },
          ]),
          toggle('Memory', true),
        ],
      },
    },
    lab: {
      goal: 'The AI can remember things about people. Keep them in control.',
      frame: [slot('notice'), slot('manage'), slot('off')],
      decisions: [
        {
          id: 'notice',
          label: 'When it saves something',
          options: [
            opt('Save silently', false, 'People feel watched when the AI “knows” things.', []),
            opt('Small "Memory updated" note', true, 'No creepy surprise later.', [note(':save Memory updated: "Prefers short answers"', { tone: 'accent' })]),
          ],
        },
        {
          id: 'manage',
          label: 'Where can people see it?',
          options: [
            opt('Nowhere', false, 'Hidden memory. Zero control.', []),
            opt('Deep in Settings', false, 'Hidden in Settings feels like no control.', [note('Settings › Advanced › Data › Export')]),
            opt('A clear list with Delete', true, 'Easy to check and fix.', [
              rows([
                { label: 'Prefers short answers', value: '', action: 'Delete' },
                { label: 'Works in Figma', value: '', action: 'Delete' },
              ]),
            ]),
          ],
        },
        {
          id: 'off',
          label: 'Can people turn memory off?',
          options: [
            opt('No', false, 'Some chats are private. People need an off switch.', []),
            opt('Memory switch', true, 'People choose when the AI remembers.', [toggle('Memory', true)]),
          ],
        },
      ],
    },
  },

  /* ================= FEEDBACK ================= */
  'feedback-loop': {
    compare: {
      bad: {
        caption: 'A survey nobody fills',
        blocks: [ai('Here are 4 ideas for your empty state…'), modal('Rate your experience (1–10)', 'Tell us more (required)', ['!Submit survey'], { pin: 'Interrupts the task' })],
      },
      good: {
        caption: 'One tap, quick reasons',
        blocks: [ai('Here are 4 ideas for your empty state…'), buttons([':up', ':down'], { pin: 'One click' }), chips(['Not accurate', 'Too long', 'Wrong tone'])],
      },
    },
    lab: {
      goal: 'Make it easy for people to tell you when the AI got it wrong.',
      frame: [ai('Here are 4 ideas for your empty state…'), slot('ask'), slot('reason'), slot('after')],
      decisions: [
        {
          id: 'ask',
          label: 'How do people give feedback?',
          options: [
            opt('No way', false, 'Upset people can’t say so. Your team never learns.', []),
            opt('Pop-up survey', false, 'It blocks the task. Most people close it, annoyed.', [modal('Rate your experience (1–10)', '', ['!Submit'])]),
            opt('Thumbs up / down', true, 'One click, right where the answer is.', [buttons([':up', ':down'])]),
          ],
        },
        {
          id: 'reason',
          label: 'After thumbs down',
          options: [
            opt('Required text box', false, 'Feels like homework. Most people give up.', [ph('Describe the problem (required)')]),
            opt('Optional quick reasons', true, 'Fast for people, useful for your team.', [chips(['Not accurate', 'Too long', 'Wrong tone'])]),
          ],
        },
        {
          id: 'after',
          label: 'After sending',
          options: [
            opt('Nothing happens', false, 'Feels like talking to a wall.', []),
            opt('Thanks + a fix', true, 'People feel heard, and get a better answer right away.', [toast('Thanks! Want a shorter version?', 'Shorten')]),
          ],
        },
      ],
    },
  },

  'graceful-errors': {
    compare: {
      bad: {
        caption: 'Dead end',
        blocks: [ph('Ask anything…', { pin: 'Your text is gone' }), banner('bad', 'Error 413', 'Request failed.', { pin: 'Code, no help' })],
      },
      good: {
        caption: 'Clear reason, next step',
        blocks: [
          input('Make a mood board from brand-guide.pdf', { pin: 'Text kept' }),
          banner('warn', 'That file is too big', 'Limit is 20 MB, yours is 45 MB.'),
          buttons(['!Use first 30 pages', 'Upload smaller file'], { pin: 'Next steps' }),
        ],
      },
    },
    lab: {
      goal: 'An upload failed: the file is too big. Help people fix it fast.',
      frame: [slot('input'), slot('msg'), slot('next')],
      decisions: [
        {
          id: 'msg',
          label: 'What does the error say?',
          options: [
            opt('"Error 413"', false, 'A code leaves most people lost.', [banner('bad', 'Error 413', 'Request failed.')]),
            opt('"Something went wrong"', false, 'Too vague. People don’t know what to fix.', [banner('bad', 'Something went wrong', '')]),
            opt('What happened + why', true, 'Plain words, real numbers.', [banner('warn', 'That file is too big', 'Limit is 20 MB, yours is 45 MB.')]),
          ],
        },
        {
          id: 'input',
          label: 'What they typed',
          options: [
            opt('Clear it', false, 'Retyping it all feels awful. Never throw away their work.', [ph('Ask anything…')]),
            opt('Keep it', true, 'Nothing is lost. Phew.', [input('Make a mood board from brand-guide.pdf')]),
          ],
        },
        {
          id: 'next',
          label: 'What can they do next?',
          options: [
            opt('None', false, 'A dead end. People give up and leave.', []),
            opt('1–2 concrete actions', true, 'People know exactly what to do next.', [buttons(['!Use first 30 pages', 'Upload smaller file'])]),
          ],
        },
      ],
    },
  },

  /* ================= AGENTS ================= */
  'plan-first': {
    compare: {
      bad: {
        caption: 'Starts before you can stop it',
        blocks: [user('Clean up our design system file'), steps([['Step 3 of 38: Deleting unused components', 'active']], { pin: 'Already deleting!' })],
      },
      good: {
        caption: 'Fix the plan, then start',
        blocks: [
          user('Clean up our design system file'),
          card('Plan · about 5 min', ''),
          check(['Find unused components', 'Rename layers to match', 'Group colors into styles', 'Show me before deleting'], { pin: 'Short + editable' }),
          buttons([':edit Edit', '!Start']),
        ],
      },
    },
    lab: {
      goal: 'Someone asks an AI agent: "Clean up our design file." What comes first?',
      frame: [user('Clean up our design system file'), slot('start'), slot('size'), slot('edit')],
      decisions: [
        {
          id: 'start',
          label: 'Before it starts',
          options: [
            opt('Start right away', false, 'If the agent got it wrong, people find out too late.', [steps([['Deleting unused components', 'active']])]),
            opt('Show a plan, wait', true, 'Mistakes are caught before they cost anything.', [
              check(['Find unused components', 'Rename layers', 'Group colors', 'Ask before deleting']),
              buttons(['!Start']),
            ]),
          ],
        },
        {
          id: 'size',
          label: 'How long is the plan?',
          options: [
            opt('38 technical steps', false, 'Nobody reads 38 steps. People click OK and hope.', [note('Step 1/38: resolve node tree… Step 2/38: …')]),
            opt('4 steps + time', true, 'Short enough to really read.', [note('4 steps · about 5 minutes')]),
          ],
        },
        {
          id: 'edit',
          label: 'Can people change it?',
          options: [
            opt('Only approve / cancel', false, 'One bad step means saying no to the whole plan.', [buttons(['Approve', 'Cancel'])]),
            opt('Edit, add, remove steps', true, 'People fix only the wrong step.', [buttons([':edit Edit steps', ':plus Add step'])]),
          ],
        },
      ],
    },
  },

  'action-approval': {
    compare: {
      bad: {
        caption: 'Proceed with… what?',
        blocks: [modal('Proceed?', '', ['!OK'], { pin: 'Vague → blind "OK"' })],
      },
      good: {
        caption: 'Exact details, easy cancel',
        blocks: [modal('Send email to 240 customers?', 'Subject: "Price update in October"', ['Cancel', 'Review email', '!Send to 240'], { pin: 'Who, what, how many' })],
      },
    },
    lab: {
      goal: 'An AI agent is about to email 240 customers. When should it ask first?',
      frame: [slot('ask'), slot('level'), slot('settings')],
      decisions: [
        {
          id: 'ask',
          label: 'Before sending',
          options: [
            opt('Just send', false, '240 emails can’t be unsent.', [toast('Sent to 240 customers')]),
            opt('Ask "Proceed?"', false, 'People click OK without really looking.', [modal('Proceed?', '', ['!OK'])]),
            opt('Show who, what, how many', true, 'People see what will happen, then say yes for real.', [
              modal('Send email to 240 customers?', 'Subject: "Price update in October"', ['Cancel', 'Review', '!Send to 240']),
            ]),
          ],
        },
        {
          id: 'level',
          label: 'For small, safe actions',
          options: [
            opt('Ask every time', false, 'Too many questions. People stop reading and click Yes to everything.', [modal('Create a draft?', '', ['!Yes'])]),
            opt('Just do them', true, 'Drafts are safe. Save the questions for risky moments.', [note('Drafted 3 replies (not sent)')]),
          ],
        },
        {
          id: 'settings',
          label: 'Can people choose when it asks?',
          options: [
            opt('None', false, 'People can’t choose how careful it is.', []),
            opt('"Ask before sending"', true, 'People choose how much freedom the AI gets.', [toggle('Ask before sending emails', true)]),
          ],
        },
      ],
    },
  },

  'task-status': {
    compare: {
      bad: {
        caption: 'Locked screen, bot loop',
        blocks: [spinner('Please keep this window open (15 min)', { pin: 'Can\'t do anything else' }), ai('Sorry, I didn\'t get that. Please rephrase.', { pin: 'No way out' })],
      },
      good: {
        caption: 'Work in the background',
        blocks: [
          rows(
            [
              { label: 'Competitor research', value: '60%', tag: 'Running', tone: 'accent' },
              { label: 'Survey summary', value: '', tag: 'Needs you', tone: 'warn' },
              { label: 'Interview tags', value: '', tag: 'Done', tone: 'ok' },
            ],
            { pin: 'Status at a glance' }
          ),
          toast('Survey summary needs your input', 'Open'),
          buttons(['Talk to a person']),
        ],
      },
    },
    lab: {
      goal: 'An AI task takes 15 minutes, and a help bot gets stuck. Keep people informed.',
      frame: [slot('wait'), slot('done'), slot('human')],
      decisions: [
        {
          id: 'wait',
          label: 'During the 15 minutes',
          options: [
            opt('Lock the screen', false, 'People are stuck for 15 minutes.', [spinner('Please keep this window open (15 min)')]),
            opt('Run in the background, show status', true, 'People keep working and can check anytime.', [
              rows([{ label: 'Competitor research', value: '60%', tag: 'Running', tone: 'accent' }]),
            ]),
          ],
        },
        {
          id: 'done',
          label: 'When it is done or stuck',
          options: [
            opt('Nothing', false, 'Stuck tasks sit there, and nobody knows.', []),
            opt('Notify', true, 'People come back at the right moment.', [toast('Research needs your input', 'Open')]),
          ],
        },
        {
          id: 'human',
          label: 'The help bot is stuck',
          options: [
            opt('"Please rephrase"', false, 'The bot goes in circles. People get angry and leave.', [ai('Sorry, I didn\'t get that. Please rephrase.')]),
            opt('"Talk to a person"', true, 'A clear way out, with the chat attached.', [buttons(['!Talk to a person']), note('Your chat is shared, so you don\'t repeat yourself.')]),
          ],
        },
      ],
    },
  },
  /* ================= NEW: INPUT ================= */
  'contextual-nudge': {
    compare: {
      bad: {
        caption: 'Interrupts, then repeats',
        blocks: [modal('Try our new AI assistant!', 'It can do so much for you.', ['!Try now', 'Later'], { pin: 'Pop-up mid-task' }), note('Shown again on every page', { tone: 'warn' })],
      },
      good: {
        caption: 'Small, in context, easy to skip',
        blocks: [
          text('Re: Q3 roadmap (14 replies)'),
          chips([':sparkle Summarize this thread', ':x'], { pin: 'Right place, right time' }),
          note('Not shown again if you skip it'),
        ],
      },
    },
    lab: {
      goal: 'An email app can sum up long threads. Help people find it without nagging.',
      frame: [text('Re: Q3 roadmap (14 replies)'), slot('where'), slot('when'), slot('after')],
      decisions: [
        {
          id: 'where',
          label: 'Where does the offer appear?',
          options: [
            opt('Pop-up over the screen', false, 'Interrupts the task and feels like an ad.', [modal('Try our new AI assistant!', '', ['!Try now', 'Later'])]),
            opt('Small chip in the thread', true, 'Sits right where the help is useful.', [chips([':sparkle Summarize this thread'])]),
          ],
        },
        {
          id: 'when',
          label: 'When is it shown?',
          options: [
            opt('On every email', false, 'Offers everywhere become noise people ignore.', [note('Shown on all 214 emails')]),
            opt('Only on long threads', true, 'Shown when it clearly saves time.', [note('Shown on threads with 10+ replies')]),
          ],
        },
        {
          id: 'after',
          label: 'If people say no',
          options: [
            opt('Keep asking', false, 'Asking again after a “no” feels pushy. People trust it less.', [note('Asks again tomorrow', { tone: 'warn' })]),
            opt('Back off', true, 'It listens to the “no”, so people stay happy to see it.', [note('Hidden for this thread · Turn off in Settings')]),
          ],
        },
      ],
    },
  },

  'reply-to-part': {
    compare: {
      bad: {
        caption: 'Retype and hope',
        blocks: [ai('Plan: 1) Interview 5 users. 2) Run a survey with 200 people. 3) Build a prototype.'), user('Can you change the second step to something cheaper?', { pin: 'Must describe the part' })],
      },
      good: {
        caption: 'Point at the exact part',
        blocks: [
          edit('Plan: 1) Interview 5 users. 2) Run a survey with 200 people. 3) Build a prototype.', { sel: '2) Run a survey with 200 people.' }),
          buttons([':sparkle Ask about this', 'Shorten', 'Explain'], { pin: 'Acts on the selection' }),
          note('Quoting: “Run a survey with 200 people”'),
        ],
      },
    },
    lab: {
      goal: 'The AI gave a long answer. People want to change just one part.',
      frame: [slot('select'), slot('quote'), slot('scope')],
      decisions: [
        {
          id: 'select',
          label: 'When people select text…',
          options: [
            opt('Nothing happens', false, 'People must copy, paste and explain which part. So much work.', [edit('Plan: 1) Interview 5 users. 2) Run a survey with 200 people. 3) Build a prototype.')]),
            opt('Show quick actions', true, 'Select, tap, done.', [
              edit('Plan: 1) Interview 5 users. 2) Run a survey with 200 people. 3) Build a prototype.', { sel: '2) Run a survey with 200 people.' }),
              buttons([':sparkle Ask about this', 'Shorten', 'Explain']),
            ]),
          ],
        },
        {
          id: 'quote',
          label: 'In the message box',
          options: [
            opt('Empty box', false, 'People forget what they selected, and so might the AI.', [ph('Ask anything…')]),
            opt('Show the quoted part', true, 'Both the person and the AI know exactly what is meant.', [note('Quoting: “Run a survey with 200 people”'), input('Make this cheaper')]),
          ],
        },
        {
          id: 'scope',
          label: 'The AI changes…',
          options: [
            opt('The whole answer', false, 'Parts people liked change too.', [ai('New plan: 1) Talk to 3 users. 2) Post a quick poll. 3) Sketch ideas.')]),
            opt('Only that part', true, 'The rest stays exactly as it was.', [diff([['Run a survey with 200 people', 'Post a 3-question poll in the app']])]),
          ],
        },
      ],
    },
  },

  'show-understanding': {
    compare: {
      bad: {
        caption: 'Acts on a silent guess',
        blocks: [spinner('Listening…'), ai('Booked a table for 14 people.', { pin: 'Heard “14”, not “4”' })],
      },
      good: {
        caption: 'Shows what it heard, then acts',
        blocks: [
          note('Heard:', { tone: 'accent' }),
          edit('Book a table for 4 people at 7 pm', { sel: '4', pin: 'Transcript you can fix' }),
          buttons(['!Book it', 'Edit']),
        ],
      },
    },
    lab: {
      goal: 'Someone says “Book a table for four at seven” to a voice assistant.',
      frame: [slot('state'), slot('show'), slot('confirm')],
      decisions: [
        {
          id: 'state',
          label: 'While it listens',
          options: [
            opt('No signal', false, 'People wonder: is it even listening?', [blank('')]),
            opt('Clear listening state', true, 'People know when to talk and when to stop.', [spinner('Listening… tap to stop')]),
          ],
        },
        {
          id: 'show',
          label: 'Show what it understood?',
          options: [
            opt('No, just act', false, 'A misheard number turns into a wrong booking.', []),
            opt('Show the words it heard', true, 'People spot a mishearing before anything happens.', [edit('Book a table for 4 people at 7 pm', { sel: '4' })]),
          ],
        },
        {
          id: 'confirm',
          label: 'Before booking',
          options: [
            opt('Book right away', false, 'A mishearing turns into a wrong booking.', [toast('Booked for 14 people at 7 pm')]),
            opt('Quick confirm + edit', true, 'One tap to go, one tap to fix.', [buttons(['!Book it', 'Edit'])]),
          ],
        },
      ],
    },
  },

  /* ================= NEW: AGENTS ================= */
  'autonomy-dial': {
    compare: {
      bad: {
        caption: 'One setting for everything',
        blocks: [toggle('AI agent', true), note('The agent acts on everything automatically.', { pin: 'All or nothing' })],
      },
      good: {
        caption: 'Freedom set per task',
        blocks: [
          rows(
            [
              { label: 'Draft replies', value: '', tag: 'Act on its own', tone: 'ok' },
              { label: 'Send emails', value: '', tag: 'Ask first', tone: 'warn' },
              { label: 'Delete files', value: '', tag: 'Suggest only', tone: 'accent' },
            ],
            { pin: 'Risky tasks stay supervised' }
          ),
        ],
      },
    },
    lab: {
      goal: 'An AI agent handles email. Decide how much it can do on its own.',
      frame: [slot('levels'), slot('default'), slot('change')],
      decisions: [
        {
          id: 'levels',
          label: 'How do people set its freedom?',
          options: [
            opt('One on/off switch', false, 'Safe and risky tasks get the same freedom.', [toggle('AI agent', true)]),
            opt('Per task, in plain words', true, 'Risky tasks get less freedom. Safe ones get more.', [
              rows([
                { label: 'Draft replies', value: '', tag: 'Act on its own', tone: 'ok' },
                { label: 'Send emails', value: '', tag: 'Ask first', tone: 'warn' },
              ]),
            ]),
          ],
        },
        {
          id: 'default',
          label: 'At the start, it should…',
          options: [
            opt('Act on its own', false, 'Free from day one, its first mistake can be a big one.', [note('New tasks: Act on its own', { tone: 'warn' })]),
            opt('Ask first', true, 'Start safe, let people loosen it as trust grows.', [note('New tasks: Ask first')]),
          ],
        },
        {
          id: 'change',
          label: 'Where can people change it later?',
          options: [
            opt('Deep in Settings', false, 'Hard-to-reach controls feel like no control.', [note('Settings › Advanced › Agents › Permissions')]),
            opt('Right where the agent works', true, 'People adjust it right when they need to.', [buttons([':more Ask first'])]),
          ],
        },
      ],
    },
  },

  'action-log': {
    compare: {
      bad: {
        caption: '“Done.” But what changed?',
        blocks: [toast('Agent finished. 37 actions completed.', '', { pin: 'No record, no undo' })],
      },
      good: {
        caption: 'A record you can read and reverse',
        blocks: [
          rows(
            [
              { label: '10:02 Renamed 24 layers', value: '', action: 'Undo' },
              { label: '10:03 Merged 6 color styles', value: '', action: 'Undo' },
              { label: '10:04 Moved 3 icons to Assets', value: '', action: 'Undo' },
            ],
            { pin: 'Each step, in plain words' }
          ),
          buttons([':retry Restore to 10:00']),
        ],
      },
    },
    lab: {
      goal: 'An AI agent changed a design file while you were away. Show what it did.',
      frame: [slot('record'), slot('words'), slot('undo')],
      decisions: [
        {
          id: 'record',
          label: 'After the run, show…',
          options: [
            opt('“Done” only', false, 'People can’t check or fix what they can’t see.', [toast('Agent finished. 37 actions completed.')]),
            opt('A step-by-step log', true, 'Every change is there to check.', [
              rows([
                { label: '10:02 Renamed 24 layers', value: '' },
                { label: '10:03 Merged 6 color styles', value: '' },
              ]),
            ]),
          ],
        },
        {
          id: 'words',
          label: 'Log lines are written…',
          options: [
            opt('As raw system logs', false, 'Raw logs look like code. Most people can’t read them.', [note('PATCH /nodes/4:12 {"name":"Card"} 200 OK')]),
            opt('In plain words', true, 'Anyone can understand what happened.', [note('Renamed “Rectangle 42” to “Card”')]),
          ],
        },
        {
          id: 'undo',
          label: 'Can people undo changes?',
          options: [
            opt('Not possible', false, 'Without undo, people stop letting the agent act.', []),
            opt('Undo each step or restore', true, 'Any step can be undone, so people trust the agent more.', [buttons(['Undo step', ':retry Restore to 10:00'])]),
          ],
        },
      ],
    },
  },

  'interrupt-redirect': {
    compare: {
      bad: {
        caption: 'Wait it out, or lose everything',
        blocks: [steps([['Research 12 competitors', 'active']]), buttons(['-Cancel'], { pin: 'Cancel deletes all progress' })],
      },
      good: {
        caption: 'Pause, correct, continue',
        blocks: [
          steps([['Found 5 of 12 competitors', 'done'], ['Paused', 'todo']]),
          input('Only include companies in India', { pin: 'Correct mid-task' }),
          buttons(['!Resume with this change']),
        ],
      },
    },
    lab: {
      goal: 'An AI agent is doing research, but it is going the wrong way.',
      frame: [steps([['Found 5 of 12 competitors', 'done'], ['Searching more…', 'active']]), slot('stop'), slot('correct'), slot('resume')],
      decisions: [
        {
          id: 'stop',
          label: 'The stop button',
          options: [
            opt('Cancel (deletes progress)', false, 'People lose all the work for steering it. Ouch.', [buttons(['-Cancel'])]),
            opt('Pause (keeps progress)', true, 'People can stop without losing anything.', [buttons(['Pause'])]),
          ],
        },
        {
          id: 'correct',
          label: 'While paused',
          options: [
            opt('Nothing to do', false, 'People can pause, but can’t fix the direction.', []),
            opt('Type a correction', true, 'People can stop it and point it the right way.', [input('Only include companies in India')]),
          ],
        },
        {
          id: 'resume',
          label: 'After the correction',
          options: [
            opt('Start over', false, 'The 5 good results are thrown away.', [note('Restarting from step 1…', { tone: 'warn' })]),
            opt('Resume from here', true, 'Keeps the good work and uses the fix from now on.', [buttons(['!Resume with this change'])]),
          ],
        },
      ],
    },
  },

  'agent-handoff': {
    compare: {
      bad: {
        caption: 'Who did what? Nobody knows',
        blocks: [user('Write a market report on AI note apps'), spinner('AI is working… (8 agents)', { pin: 'A black box' }), ai('Done. The market will grow 300%.')],
      },
      good: {
        caption: 'A visible team with one lead',
        blocks: [
          user('Write a market report on AI note apps'),
          steps([['Research agent · read 24 sources', 'done'], ['Writer agent · drafting section 3', 'active'], ['Checker agent · verify numbers', 'todo']], { pin: 'Each agent and its job' }),
          note('Lead agent reports back to you and owns the final report.'),
        ],
      },
    },
    lab: {
      goal: 'Three AI agents write one report together. Show people who does what.',
      frame: [user('Write a market report on AI note apps'), slot('show'), slot('handoff'), slot('owner')],
      decisions: [
        {
          id: 'show',
          label: 'While they work, show…',
          options: [
            opt('“AI is working…”', false, 'Hides the team. People can’t tell what’s happening or where it’s stuck.', [spinner('AI is working…')]),
            opt('Each agent, its job and status', true, 'People see the work move from agent to agent.', [steps([['Research · done', 'done'], ['Writing · now', 'active'], ['Checking', 'todo']])]),
            opt('Every agent’s raw log', false, 'Too much. People drown in detail they didn’t ask for.', [note('[researcher] fetch… [writer] token… [checker] wait…')]),
          ],
        },
        {
          id: 'handoff',
          label: 'When one agent hands off to another…',
          options: [
            opt('Say what was passed on', true, 'Mistakes sneak in at handoffs. Showing them lets people check.', [note('Research → Writer: 24 sources, 6 key numbers')]),
            opt('Hand off silently', false, 'If a number is wrong, nobody can tell which agent changed it.', []),
          ],
        },
        {
          id: 'owner',
          label: 'Who answers for the final report?',
          options: [
            opt('“The research agent said so”', false, 'Passing the blame breaks trust fast.', [ai('The research agent said the market grows 300%.')]),
            opt('One lead agent owns it', true, 'One voice reports back, explains, and fixes.', [note('Lead agent: I checked all 6 numbers. One is an estimate.')]),
          ],
        },
      ],
    },
  },
  'screen-control': {
    compare: {
      bad: {
        caption: 'An invisible hand on your computer',
        blocks: [user('Order more printer paper'), note('Agent is using your browser…', { pin: 'Can’t watch, can’t stop' }), toast('Paid ₹4,200 with saved card')],
      },
      good: {
        caption: 'Visible, limited, and you can take over',
        blocks: [
          user('Order more printer paper'),
          banner('info', 'Agent is in control of officesupply.com', 'Only this site · you can watch', { pin: 'Clear scope' }),
          buttons(['!Take over']),
          modal('Ready to pay ₹4,200?', 'I stopped at checkout. You pay.', ['Cancel', '!Pay myself']),
        ],
      },
    },
    lab: {
      goal: 'An AI agent uses a shop website for you to order office supplies.',
      frame: [user('Order more printer paper'), slot('access'), slot('while'), slot('pay')],
      decisions: [
        {
          id: 'access',
          label: 'Ask for access to…',
          options: [
            opt('Your whole computer, once', false, 'Far more access than the task needs. People can’t judge the risk.', [modal('Allow full computer control?', '', ['No', '!Allow'])]),
            opt('Just this one site', true, 'Asking for a little is easy to say yes to.', [modal('Let the agent use officesupply.com?', 'Only this site, until the order is done.', ['No', '!Allow'])]),
          ],
        },
        {
          id: 'while',
          label: 'While it clicks and types…',
          options: [
            opt('Work in a hidden window', false, 'People lose track and can’t step in.', [note('Working in the background…')]),
            opt('Show it, with a Take over button', true, 'People can watch and grab control at any moment.', [banner('info', 'Agent is in control', 'officesupply.com'), buttons(['!Take over'])]),
          ],
        },
        {
          id: 'pay',
          label: 'At checkout…',
          options: [
            opt('Pay with the saved card', false, 'Money can’t be un-spent. This needs a person.', [toast('Paid ₹4,200')]),
            opt('Stop and hand back control', true, 'People pay themselves, after seeing the cart.', [modal('Ready to pay ₹4,200?', 'I stopped at checkout.', ['Cancel', '!Pay myself'])]),
            opt('Type in your password to log in', false, 'Passwords are too risky for agents. Let the person log in.', [note('Entering password…')]),
          ],
        },
      ],
    },
  },
  'connected-apps': {
    compare: {
      bad: {
        caption: 'Connected to… what, exactly?',
        blocks: [note('7 apps connected', { pin: 'No details' }), ai('I emailed the client and moved the meeting.')],
      },
      good: {
        caption: 'Clear access, one tap to turn off',
        blocks: [
          rows([{ label: 'Gmail', value: 'Read only', action: 'Remove' }, { label: 'Calendar', value: 'Read + act', tag: 'Asks first', tone: 'warn', action: 'Remove' }], { pin: 'Read vs. act, in plain words' }),
          ai('You’re free after 3 pm. (from Calendar)'),
        ],
      },
    },
    lab: {
      goal: 'An AI helper wants to use your email and calendar. Keep it safe.',
      frame: [slot('ask'), slot('list'), slot('answer')],
      decisions: [
        {
          id: 'ask',
          label: 'When connecting Gmail, ask for…',
          options: [
            opt('Full access: read, send, delete', false, 'Asking for more than you need scares people, and raises the risk.', [modal('Allow full Gmail access?', 'Read, send and delete email.', ['No', '!Allow'])]),
            opt('Read only, for now', true, 'Start small. Ask for more when a task really needs it.', [modal('Let the assistant read your Gmail?', 'It can’t send or delete.', ['No', '!Allow'])]),
          ],
        },
        {
          id: 'list',
          label: 'In settings, show…',
          options: [
            opt('“7 apps connected”', false, 'People can’t see what each app allows.', [note('7 apps connected')]),
            opt('Each app, its access, and Remove', true, 'One glance tells people what the AI can reach.', [rows([{ label: 'Gmail', value: 'Read only', action: 'Remove' }, { label: 'Calendar', value: 'Read + act', action: 'Remove' }])]),
          ],
        },
        {
          id: 'answer',
          label: 'When an answer uses an app…',
          options: [
            opt('Just answer', false, 'People can’t tell if it came from their data or a guess.', [ai('You’re free after 3 pm.')]),
            opt('Name the app it used', true, 'Showing the source builds trust and reminds people what’s connected.', [ai('You’re free after 3 pm. (from Calendar)')]),
          ],
        },
      ],
    },
  },
  'cost-estimate': {
    compare: {
      bad: {
        caption: 'The bill is the surprise',
        blocks: [buttons(['!Generate video']), toast('Used 480 credits. 20 left this month.', '', { pin: 'Cost shown too late' })],
      },
      good: {
        caption: 'Know before you go',
        blocks: [
          rows([{ label: 'Video, 30 sec', value: '~120 credits' }, { label: 'Draft preview', value: '~10 credits' }], { pin: 'Estimate up front' }),
          buttons(['Draft preview', '!Generate · ~120 credits']),
          note('500 credits left this month'),
        ],
      },
    },
    lab: {
      goal: 'Making a 30-second AI video costs a lot of credits. Show the cost.',
      frame: [slot('when'), slot('cheaper'), slot('limit')],
      decisions: [
        {
          id: 'when',
          label: 'Show the cost…',
          options: [
            opt('After it is done', false, 'Surprise costs feel like a trick.', [toast('Used 480 credits.')]),
            opt('On the start button', true, 'People see the price before they press go.', [buttons(['!Generate · ~120 credits'])]),
          ],
        },
        {
          id: 'cheaper',
          label: 'Offer a cheaper option?',
          options: [
            opt('No', false, 'People pay full price only to play around.', []),
            opt('Draft preview first', true, 'Cheap drafts let people explore before they spend.', [buttons(['Draft preview · ~10 credits'])]),
          ],
        },
        {
          id: 'limit',
          label: 'Almost out of credits',
          options: [
            opt('Fail when it runs out', false, 'It stops halfway. Time and credits gone.', [banner('bad', 'Out of credits', 'Task stopped at 80%.')]),
            opt('Warn before starting', true, 'People can plan instead of being cut off.', [banner('warn', 'This uses most of your remaining credits', '120 of 140 left.')]),
          ],
        },
      ],
    },
  },
  /* ================= NEW: VOICE & VISION ================= */
  'voice-turn-taking': {
    compare: {
      bad: {
        caption: 'Silence, then talking over each other',
        blocks: [{ type: 'voice', state: 'idle', label: '…' , pin: 'Is it listening?' }, note('AI keeps talking while you speak', { tone: 'warn' })],
      },
      good: {
        caption: 'Clear turns, easy to interrupt',
        blocks: [
          { type: 'voice', state: 'speaking', label: 'Speaking', text: 'Your next meeting is at 3 pm…', pin: 'Clear state' },
          note('Start talking to interrupt'),
          { type: 'voice', state: 'listening', label: 'Listening', text: 'Move it to 4' },
        ],
      },
    },
    lab: {
      goal: 'Design a talking AI helper. People must know who is talking.',
      frame: [slot('listen'), slot('speak'), slot('barge')],
      decisions: [
        {
          id: 'listen',
          label: 'While it listens',
          options: [
            opt('No signal', false, 'People wonder if it heard them, so they say it again. And again.', [{ type: 'voice', state: 'idle', label: '…' }]),
            opt('Listening state + live words', true, 'People can see it is hearing them, and what it heard.', [{ type: 'voice', state: 'listening', label: 'Listening', text: 'What is on my calendar…' }]),
          ],
        },
        {
          id: 'speak',
          label: 'While it speaks',
          options: [
            opt('Same look as listening', false, 'People cannot tell whose turn it is.', [{ type: 'voice', state: 'listening', label: 'Listening' }]),
            opt('A different look for speaking', true, 'Listening and speaking look different, so people know whose turn it is.', [{ type: 'voice', state: 'speaking', label: 'Speaking', text: 'You have 3 meetings today…' }]),
          ],
        },
        {
          id: 'barge',
          label: 'When people talk over it',
          options: [
            opt('It keeps talking', false, 'People are stuck hearing what they don’t need.', [note('Please wait until I finish.', { tone: 'warn' })]),
            opt('It stops and listens', true, 'People cut in for a reason. Let them.', [note('Stopped. Listening…')]),
          ],
        },
      ],
    },
  },

  'read-back': {
    compare: {
      bad: {
        caption: 'Acts on what it thinks it heard',
        blocks: [user('Send forty dollars to Priya'), toast('Sent $14 to Pria K.', '', { pin: 'Misheard, already sent' })],
      },
      good: {
        caption: 'One short read-back, then act',
        blocks: [
          user('Send forty dollars to Priya'),
          { type: 'voice', state: 'speaking', label: 'Speaking', text: 'Send $40 to Priya Shah. Right?', pin: 'Key details only' },
          buttons(['!Yes, send', 'Change']),
        ],
      },
    },
    lab: {
      goal: 'You can ask a voice helper to send money to friends. Make it safe.',
      frame: [user('Send forty dollars to Priya'), slot('confirm'), slot('detail'), slot('no')],
      decisions: [
        {
          id: 'confirm',
          label: 'Before sending',
          options: [
            opt('Send right away', false, 'A misheard amount or name sends money to the wrong place.', [toast('Sent $14 to Pria K.')]),
            opt('Repeat it, wait for “yes”', true, 'People catch mistakes before money moves.', [{ type: 'voice', state: 'speaking', label: 'Speaking', text: 'Send $40 to Priya Shah. Right?' }]),
          ],
        },
        {
          id: 'detail',
          label: 'What does it repeat?',
          options: [
            opt('Every detail', false, 'Long read-backs are hard to follow. People stop listening.', [note('Sending forty point zero zero US dollars from checking account ending 4821 to Priya Shah, phone ending…')]),
            opt('Amount + person', true, 'Only the details that are easy to mishear and costly to get wrong.', [note('$40 to Priya Shah')]),
          ],
        },
        {
          id: 'no',
          label: 'If it is wrong',
          options: [
            opt('Start over', false, 'Saying it all again is tiring.', [note('Cancelled. What would you like to do?')]),
            opt('“Change the amount”', true, 'People fix just the wrong part in natural words.', [buttons(['!Yes, send', 'Change amount', 'Change person'])]),
          ],
        },
      ],
    },
  },

  'point-to-edit': {
    compare: {
      bad: {
        caption: 'Describe the spot in words',
        blocks: [{ type: 'image' }, input('Remove the second cup from the left, not the one near the plate', { pin: 'Hard to describe' })],
      },
      good: {
        caption: 'Circle it, then say what to do',
        blocks: [
          { type: 'image', sel: [40, 22, 24, 52], selLabel: 'Selected', pin: 'Point, don’t describe' },
          input('Remove this'),
        ],
      },
    },
    lab: {
      goal: 'People want to remove one object from a photo.',
      frame: [slot('pick'), slot('ask'), slot('scope')],
      decisions: [
        {
          id: 'pick',
          label: 'How do people choose the object?',
          options: [
            opt('Describe it in words', false, '“Where” is hard to say in words, and easy to get wrong.', [{ type: 'image' }]),
            opt('Brush or circle it', true, 'Pointing is fast and exact.', [{ type: 'image', sel: [40, 22, 24, 52], selLabel: 'Selected' }]),
          ],
        },
        {
          id: 'ask',
          label: 'Then they…',
          options: [
            opt('Write a long request', false, 'A paragraph for a tiny edit? People sigh.', [ph('Describe the whole image you want…')]),
            opt('Say a short action', true, 'The circle shows where. Words only need to say what.', [chips(['Remove', 'Replace with…', 'Make it blue'])]),
          ],
        },
        {
          id: 'scope',
          label: 'The AI changes…',
          options: [
            opt('The whole image', false, 'Parts people liked change too.', [note('Regenerated the full photo', { tone: 'warn' })]),
            opt('Only the selection', true, 'Everything outside the circle stays the same.', [note('Edited only the selected area · 3 variations')]),
          ],
        },
      ],
    },
  },

  'mode-switch': {
    compare: {
      bad: {
        caption: 'A long list, read out loud',
        blocks: [{ type: 'voice', state: 'speaking', label: 'Speaking', text: 'Option one, the 7:05 flight for $212 with one stop in… option two…', pin: 'Too much to remember' }],
      },
      good: {
        caption: 'Say the headline, show the details',
        blocks: [
          { type: 'voice', state: 'speaking', label: 'Speaking', text: 'I found 3 flights. The cheapest is $212.', pin: 'Short summary' },
          rows([
            { label: '7:05 · 1 stop', value: '$212' },
            { label: '9:40 · direct', value: '$268' },
            { label: '13:15 · direct', value: '$245' },
          ]),
          chips(['Book 7:05', 'More options']),
        ],
      },
    },
    lab: {
      goal: 'Someone asks a smart screen: “Find me a flight to Mumbai tomorrow.”',
      frame: [slot('speak'), slot('screen'), slot('next')],
      decisions: [
        {
          id: 'speak',
          label: 'What does it say out loud?',
          options: [
            opt('Reads all options', false, 'People forget the first option by the time the third is read.', [{ type: 'voice', state: 'speaking', label: 'Speaking', text: 'Option one, the 7:05 flight… option two… option three…' }]),
            opt('A one-line summary', true, 'Short to hear, easy to remember.', [{ type: 'voice', state: 'speaking', label: 'Speaking', text: 'I found 3 flights. The cheapest is $212.' }]),
          ],
        },
        {
          id: 'screen',
          label: 'On the screen',
          options: [
            opt('Just a voice animation', false, 'The screen sits empty while people try to remember.', [{ type: 'voice', state: 'idle', label: '' }]),
            opt('The options as a list', true, 'Details are easier to compare by eye.', [rows([{ label: '7:05 · 1 stop', value: '$212' }, { label: '9:40 · direct', value: '$268' }])]),
          ],
        },
        {
          id: 'next',
          label: 'How do people pick one?',
          options: [
            opt('Voice only', false, 'Tapping is faster when the option is right there.', [note('Say “book the first one”')]),
            opt('Tap or say it', true, 'People use whichever is easier in the moment.', [chips(['Book 7:05', 'More options']), note('Or say “book the first one”')]),
          ],
        },
      ],
    },
  },

  'bias-check': {
    compare: {
      bad: {
        caption: 'Stereotypes by default',
        blocks: [user('Show me a doctor and a nurse'), card('4 images', 'Every doctor is a man, every nurse is a woman.', { pin: 'Repeats a stereotype' })],
      },
      good: {
        caption: 'Varied by default, easy to report',
        blocks: [
          user('Show me a doctor and a nurse'),
          card('4 images', 'People of different genders, ages and skin tones in both roles.', { pin: 'Variety when not specified' }),
          buttons(['Report unfair result']),
        ],
      },
    },
    lab: {
      goal: 'Someone asks an image AI for “a CEO giving a talk”. Make it fair.',
      frame: [user('A CEO giving a talk'), slot('default'), slot('choose'), slot('report')],
      decisions: [
        {
          id: 'default',
          label: 'When the request doesn’t say who',
          options: [
            opt('Use whatever the model gives', false, 'AI copies unfair patterns from its data, like “CEO = older white man”.', [card('4 images', 'All four show the same kind of person.')]),
            opt('Show variety', true, 'Showing many kinds of people avoids unfair stereotypes.', [card('4 images', 'Different genders, ages and skin tones.')]),
          ],
        },
        {
          id: 'choose',
          label: 'If people want something specific',
          options: [
            opt('They must know special words', false, 'Only experts know the magic words.', []),
            opt('Simple filters people pick', true, 'People choose. The app does not guess who they mean.', [chips(['Any', 'Woman', 'Man', 'Older', 'Younger'], { on: 0 })]),
          ],
        },
        {
          id: 'report',
          label: 'When output is unfair',
          options: [
            opt('No way to report', false, 'The team never learns where the model is biased.', []),
            opt('One-click report', true, 'Reports find problems the team missed.', [buttons(['Report unfair result'])]),
          ],
        },
      ],
    },
  },
};
