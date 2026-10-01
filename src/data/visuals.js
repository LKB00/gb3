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
      goal: 'Design the first screen of an AI writing assistant.',
      frame: [slot('message'), slot('examples'), slot('click')],
      decisions: [
        {
          id: 'message',
          label: 'Welcome message',
          options: [
            opt('"Hello! I am an AI."', false, 'Says nothing useful. Tell people what the AI is for.', [note('Hello! I am an AI.')]),
            opt('"Write, summarize or brainstorm"', true, 'States the purpose in a few words.', [note('Write, summarize or brainstorm. Try one:')]),
          ],
        },
        {
          id: 'examples',
          label: 'Examples',
          options: [
            opt('None', false, 'The "blank box" problem: new users do not know what to type, and leave.', []),
            opt('12 generic ones', false, 'Too many, too vague. People skim past all of them.', [
              chips(['Ask me', 'Help', 'Write', 'Ideas', 'Fix', 'Explain', 'Plan', 'Chat', 'Code', 'Learn', 'Create', 'More…']),
            ]),
            opt('3 specific ones', true, 'Specific examples show the range in one look.', [
              chips([':pen Write onboarding copy', ':file Summarize research', ':palette Suggest palettes']),
            ]),
          ],
        },
        {
          id: 'click',
          label: 'Clicking an example…',
          options: [
            opt('Sends it right away', false, 'People lose the chance to adjust it, and get a result they did not quite want.', [
              user('Write onboarding copy'),
              { type: 'spinner', text: 'Writing…' },
            ]),
            opt('Fills the box to edit', true, 'People can change it before sending.', [input('Write onboarding copy for a budgeting app▍')]),
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
      goal: 'The request is vague: "Make a launch post". What should the AI do?',
      frame: [user('Make a launch post for the new dashboard.'), slot('first'), slot('answer'), slot('skip')],
      decisions: [
        {
          id: 'first',
          label: 'The AI first…',
          options: [
            opt('Guesses and writes it all', false, 'If the guess is wrong, the person must start over.', [ai('Big news, everyone! Our dashboard…')]),
            opt('Asks 5 questions', false, 'Feels like filling a form. People give up.', [
              ai('Who is the audience? What tone? How long? Which channel? Emoji or not?'),
            ]),
            opt('Asks 1 key question', true, 'Only ask what really changes the result.', [ai('Quick check: **who is this for?**')]),
          ],
        },
        {
          id: 'answer',
          label: 'People answer by…',
          options: [
            opt('Typing a reply', false, 'Typing is slow, especially on phones.', [ph('Type your answer…')]),
            opt('Tapping a chip', true, 'One tap is fastest.', [chips(['Customers', 'Team', 'Investors'])]),
          ],
        },
        {
          id: 'skip',
          label: 'Can they skip?',
          options: [
            opt('No, they must answer', false, 'Forcing answers blocks people who just want a quick draft.', []),
            opt('"Just guess" option', true, 'Respect people who want speed over precision.', [chips(['Just guess'])]),
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
      goal: 'Design an AI sidebar inside a docs app.',
      frame: [slot('show'), slot('change'), input('Summarize this.'), slot('limit')],
      decisions: [
        {
          id: 'show',
          label: 'Show what the AI will use?',
          options: [
            opt('No, the AI decides', false, 'People cannot catch the AI using the wrong file.', []),
            opt('Context chips', true, 'People can see the AI is using the right file.', [chips([':file Q3-report.pdf'])]),
          ],
        },
        {
          id: 'change',
          label: 'Can people change it?',
          options: [
            opt('No', false, 'If the AI picked wrong, people are stuck.', []),
            opt('Remove or add', true, 'People stay in charge of what the AI reads.', [buttons([':x Remove', ':plus Add file'])]),
          ],
        },
        {
          id: 'limit',
          label: 'The file is too long…',
          options: [
            opt('Cut it silently', false, 'The AI answers from half the file and nobody knows.', []),
            opt('Say what was used', true, 'Honest about limits, so people can check the rest.', [note('Used the first 50 of 80 pages.', { tone: 'warn' })]),
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
      goal: 'Help people adjust an AI-written reply.',
      frame: [ai('Hi Sam, thanks for the update! Friday works for me…'), slot('how'), slot('count')],
      decisions: [
        {
          id: 'how',
          label: 'To change tone or length, people…',
          options: [
            opt('Type it in the prompt', false, 'Most people do not know what to type.', [ph('e.g. "make it formal, under 80 words"')]),
            opt('Tap chips + slider', true, 'Simple controls do the prompt work for them.', [
              chips(['Friendly', 'Formal', 'Short'], { on: 1 }),
              slider('Length', 35, 'Short', 'Long'),
            ]),
          ],
        },
        {
          id: 'count',
          label: 'How many settings?',
          options: [
            opt('15 up front', false, 'A wall of controls is harder than the prompt.', [
              rows([
                { label: 'Tone', value: 'Formal' },
                { label: 'Length', value: '80 words' },
                { label: 'Format', value: 'Bullets' },
                { label: 'Emoji', value: 'Off' },
                { label: 'Spelling', value: 'UK' },
                { label: '+ 10 more…', value: '' },
              ]),
            ]),
            opt('2–3 + "More"', true, 'Show the common ones. Hide the rest.', [buttons([':more More options'])]),
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
      goal: 'An AI task takes 20 seconds. Design the waiting state.',
      frame: [user('Summarize my 3 interview notes.'), slot('progress'), slot('text'), slot('stop')],
      decisions: [
        {
          id: 'progress',
          label: 'While it works, show…',
          options: [
            opt('Nothing', false, 'A frozen screen looks broken. People click again or leave.', [blank('')]),
            opt('A spinner only', false, 'The most common mistake: a spinner says "wait", but not what or how long.', [spinner('Loading…')]),
            opt('Live steps', true, 'People see real progress in plain words.', [
              steps([['Reading 3 notes', 'done'], ['Finding themes', 'done'], ['Writing summary', 'active']]),
            ]),
          ],
        },
        {
          id: 'text',
          label: 'The answer appears…',
          options: [
            opt('All at the end', false, 'A long wait with nothing to read.', [note('The answer will appear when it is finished.')]),
            opt('Word by word', true, 'People can start reading early.', [ai('Top themes: (1) People cannot find saved items…', { caret: true })]),
          ],
        },
        {
          id: 'stop',
          label: 'Can people stop it?',
          options: [
            opt('No', false, 'If it goes the wrong way, people must wait it out.', []),
            opt('Stop button', true, 'People stay in control.', [buttons(['-:stop Stop'])]),
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
      goal: 'Generate a headline for a landing page.',
      frame: [user('Write a headline for our project app.'), slot('count'), slot('next')],
      decisions: [
        {
          id: 'count',
          label: 'How many results?',
          options: [
            opt('1', false, 'One option feels like a guess. Choosing is easier than describing.', [ai('Track every project in one place.')]),
            opt('3 different', true, 'A few real choices, easy to compare.', [
              variants(['Track every project in one place.', 'Your projects, finally organized.', 'Stop chasing updates.']),
            ]),
            opt('10 similar', false, 'Choice overload: near-copies are tiring to compare.', [
              variants(['Track projects.', 'Track your projects.', 'Track all projects.', 'Projects, tracked.', 'Track projects here.', 'Track projects easily.']),
            ]),
          ],
        },
        {
          id: 'next',
          label: 'After choosing…',
          options: [
            opt('Nothing', false, 'Dead end: people cannot build on what they like.', []),
            opt('"Use" + "More like this"', true, 'People can refine the one they like.', [buttons(['!Use B', 'More like B'])]),
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
      goal: 'Design the "try again" control.',
      frame: [user('Tagline for a coffee shop'), ai('Fresh beans, warm hearts.'), slot('regen'), slot('steer')],
      decisions: [
        {
          id: 'regen',
          label: 'When people retry…',
          options: [
            opt('Replace the answer', false, 'If the new one is worse, the better one is gone forever.', [buttons([':retry Regenerate'])]),
            opt('Keep versions ‹ 2/3 ›', true, 'People can go back and compare.', [buttons([':left', '2 / 3', ':right', ':retry Retry'])]),
          ],
        },
        {
          id: 'steer',
          label: 'Can they guide the retry?',
          options: [
            opt('No, random retry', false, 'Random retries waste time.', []),
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
      goal: 'AI wrote an email. It is 80% right.',
      frame: [slot('label'), slot('edit'), slot('part')],
      decisions: [
        {
          id: 'edit',
          label: 'How can people change it?',
          options: [
            opt('Copy or regenerate', false, 'People lose the good 80% to fix the bad 20%.', [ai(email)]),
            opt('Edit text directly', true, 'Output is a draft. Let people shape it.', [edit(email)]),
          ],
        },
        {
          id: 'part',
          label: 'AI help for one part',
          options: [
            opt('Regenerate all', false, 'Everything changes, even the parts people liked.', [buttons([':retry Regenerate all'])]),
            opt('Rewrite selection', true, 'Change only what needs fixing.', [buttons([':sparkle Rewrite selection'])]),
          ],
        },
        {
          id: 'label',
          label: 'Mark it as a draft?',
          options: [
            opt('No', false, 'People may send AI text without reading it.', []),
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
      goal: 'Add AI autocomplete to a message box.',
      frame: [slot('style'), slot('accept'), slot('typing')],
      decisions: [
        {
          id: 'style',
          label: 'The suggestion looks…',
          options: [
            opt('Like typed text', false, 'People cannot tell their words from the AI\'s.', [ghost('Thanks for the fe', 'edback, I will update the design today.', { solid: true })]),
            opt('Light grey', true, 'Clearly an idea, not real content.', [ghost('Thanks for the fe', 'edback, I will update the design today.')]),
          ],
        },
        {
          id: 'accept',
          label: 'It is accepted…',
          options: [
            opt('Automatically', false, 'Takes control away. People must undo what they never asked for.', [note('Applied automatically')]),
            opt('By a pop-up each time', false, 'Interrupts typing every few seconds.', [modal('Use the AI suggestion?', '', ['Yes', 'No'])]),
            opt('With Tab', true, 'Easy to take, easy to ignore.', [note('Tab accept · Esc ignore')]),
          ],
        },
        {
          id: 'typing',
          label: 'While a suggestion loads…',
          options: [
            opt('Typing waits', false, 'Never make people wait to type their own words.', [spinner('Please wait…')]),
            opt('Typing never waits', true, 'The AI works around the person, not the other way.', []),
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
      goal: 'An AI agent renames and cleans up layers in a design file.',
      frame: [slot('stop'), slot('after'), slot('risky')],
      decisions: [
        {
          id: 'stop',
          label: 'While it runs',
          options: [
            opt('No controls', false, 'If it goes wrong, people can only watch.', [steps([['Renaming 24 layers', 'active']])]),
            opt('Stop button', true, 'People can stop it the moment it goes wrong.', [steps([['Renaming 24 layers', 'active']]), buttons(['-:stop Stop'])]),
          ],
        },
        {
          id: 'after',
          label: 'When it finishes',
          options: [
            opt('"Done!"', false, 'No way back means people fear using the AI.', [toast('Done! 24 layers renamed.')]),
            opt('Summary + Undo', true, 'Mistakes become cheap to fix.', [toast('Renamed 24 layers', 'Undo')]),
          ],
        },
        {
          id: 'risky',
          label: 'Before deleting layers',
          options: [
            opt('Just delete', false, 'Actions that cannot be undone need a check first.', [toast('Deleted 12 layers')]),
            opt('Confirm with details', true, 'People see exactly what will go.', [modal('Delete 12 unused layers?', 'They are hidden and not used anywhere.', ['Cancel', '-Delete 12'])]),
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
      goal: 'AI improves the wording of a 3-page document.',
      frame: [slot('show'), slot('choose'), slot('count')],
      decisions: [
        {
          id: 'show',
          label: 'Show the changes as…',
          options: [
            opt('The new version', false, 'People cannot see what changed, so they cannot check it.', [edit('We use this tool to plan work and share it with the team.')]),
            opt('Before → after', true, 'Every change is easy to see.', [diff([['utilize', 'use'], ['in order to', 'to']])]),
          ],
        },
        {
          id: 'choose',
          label: 'People can…',
          options: [
            opt('Accept all or nothing', false, 'One bad change forces people to reject the good ones too.', [buttons(['!Accept all', 'Reject all'])]),
            opt('Accept each change', true, 'Keep the good, drop the bad.', [buttons([':check Accept', ':x Reject', 'Next'])]),
          ],
        },
        {
          id: 'count',
          label: 'Show progress?',
          options: [
            opt('No', false, 'People do not know if they reviewed everything.', []),
            opt('"12 changes · 3 reviewed"', true, 'People know how much is left.', [note('12 changes · 3 reviewed')]),
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
      goal: 'Write the welcome card for a new AI research assistant.',
      frame: [slot('promise'), slot('can'), slot('mistakes')],
      decisions: [
        {
          id: 'promise',
          label: 'Headline',
          options: [
            opt('"Knows everything!"', false, 'Over-promising leads to blind trust, then disappointment.', [banner('info', 'Meet Max', 'The AI that knows everything!')]),
            opt('"Your research assistant"', true, 'Names a clear, honest role.', [card('Your research assistant', 'Works with your uploaded notes.')]),
          ],
        },
        {
          id: 'can',
          label: 'What it can do',
          options: [
            opt('A 10-item feature list', false, 'Nobody reads 10 bullets.', [
              list(['• Summaries', '• Themes', '• Quotes', '• Personas', '• Journeys', '• Charts', '• Tags', '• + 3 more']),
            ]),
            opt('2 strengths + 1 limit', true, 'Short, and honest about the limit.', [list(['✓ Summarize interviews', '✓ Find themes', '✕ Can\'t see Figma files'])]),
          ],
        },
        {
          id: 'mistakes',
          label: 'Mention mistakes?',
          options: [
            opt('No', false, 'People will copy wrong answers without checking.', []),
            opt('"Can make mistakes"', true, 'A small, always-visible reminder.', [note('Can make mistakes. Check important info.')]),
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
      goal: 'Answer "Why do users struggle with export?" from company docs.',
      frame: [user('Why do users struggle with export?'), slot('place'), slot('preview'), slot('gap')],
      decisions: [
        {
          id: 'place',
          label: 'Where do sources go?',
          options: [
            opt('No sources', false, 'Wrong answers look as true as right ones.', [ai('Most users cannot find it. It is a top support topic.')]),
            opt('A list at the end', false, 'People cannot tell which source backs which claim.', [
              ai('Most users cannot find it. It is a top support topic.'),
              note('Sources: report.pdf · tickets.csv'),
            ]),
            opt('Next to each claim', true, 'Every claim can be checked right where it is.', [ai('Most users cannot find it [1]. It is a top support topic [2].')]),
          ],
        },
        {
          id: 'preview',
          label: 'Tapping a source…',
          options: [
            opt('Opens a new tab', false, 'Leaves the flow, so most people never check.', [note('Opens report.pdf in a new tab')]),
            opt('Shows the quote here', true, 'Checking takes one second.', [card('[1] Q3 research report', '"7 of 10 could not find export."')]),
          ],
        },
        {
          id: 'gap',
          label: 'No source for a point',
          options: [
            opt('Say nothing', false, 'Unsupported claims look supported.', []),
            opt('Say it clearly', true, 'Honest gaps build trust.', [note('No source about export speed, so I left it out.', { tone: 'warn' })]),
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
      goal: 'AI read an invoice. Some fields are unclear.',
      frame: [slot('show'), slot('hint'), slot('filter')],
      decisions: [
        {
          id: 'show',
          label: 'Show confidence as…',
          options: [
            opt('Nothing', false, 'Everything looks equally sure, so people trust the mistakes too.', [invoiceRows([{}, {}, {}, {}])]),
            opt('Exact percent', false, 'False precision. People over-read numbers like 61.4%.', [invoiceRows([{ tag: '98.7%' }, { tag: '97.2%' }, { tag: '61.4%' }, { tag: '43.0%' }])]),
            opt('Words + icon + color', true, 'Clear, and not color-only (works for color-blind people too).', [invoiceRows([sure, sure, checkIt, notSure])]),
          ],
        },
        {
          id: 'hint',
          label: 'Say why it is unsure?',
          options: [
            opt('No', false, 'People do not know what to check.', []),
            opt('Short hint', true, 'Points to exactly what to check.', [note('Total: blurry digit, may be 46,500', { tone: 'warn' })]),
          ],
        },
        {
          id: 'filter',
          label: 'Help review',
          options: [
            opt('Nothing', false, 'Reviewers must re-check every field.', []),
            opt('"Show only check (2)"', true, 'People spend time where it matters.', [buttons(['Show only "check this" (2)'])]),
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
      goal: 'People can post AI-written updates in your team app.',
      frame: [slot('label'), text('Our new onboarding cuts setup time in half. Try it today!'), slot('edited')],
      decisions: [
        {
          id: 'label',
          label: 'Label the post?',
          options: [
            opt('No label', false, 'Readers feel tricked when they find out later.', [avatar('Asha K', 'Product designer')]),
            opt('Tiny grey "ai" at the end', false, 'Hidden labels do not count. Almost nobody sees them.', [
              avatar('Asha K', 'Product designer'),
              note('ai', { tone: 'faint' }),
            ]),
            opt('Badge by the name', true, 'Seen at the same moment as the author.', [avatar('Asha K', 'Product designer', 'AI-assisted')]),
          ],
        },
        {
          id: 'edited',
          label: 'After the person edits it',
          options: [
            opt('Remove the label', false, 'Quietly removing it misleads readers.', []),
            opt('"Written with AI, edited by Asha"', true, 'Tells the true story.', [note('Written with AI, edited by Asha')]),
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
      goal: 'An app recommends a course to a learner.',
      frame: [card('Advanced Prototyping', '', { tag: 'Recommended' }), slot('why'), slot('fix')],
      decisions: [
        {
          id: 'why',
          label: 'Explain it with…',
          options: [
            opt('Nothing', false, 'People cannot judge it, so they ignore it or follow blindly.', []),
            opt('Score "0.92"', false, 'Jargon. A number with no meaning is not an explanation.', [note('Match score: 0.92')]),
            opt('2 plain reasons', true, 'People can judge if the reasons are right.', [list(['✓ You finished "Figma Basics"', '✓ You opened 4 prototyping lessons'])]),
          ],
        },
        {
          id: 'fix',
          label: 'If a reason is wrong',
          options: [
            opt('Nothing to do', false, 'Wrong reasons keep producing bad results.', []),
            opt('"This is wrong"', true, 'People can correct the AI.', [buttons(['This is wrong', 'Show less like this'])]),
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
      goal: 'Your assistant can remember things about people.',
      frame: [slot('notice'), slot('manage'), slot('off')],
      decisions: [
        {
          id: 'notice',
          label: 'When it saves something',
          options: [
            opt('Save silently', false, 'People feel watched when the AI "knows" things.', []),
            opt('Small "Memory updated" note', true, 'No surprises later.', [note(':save Memory updated: "Prefers short answers"', { tone: 'accent' })]),
          ],
        },
        {
          id: 'manage',
          label: 'Where can people see it?',
          options: [
            opt('Nowhere', false, 'No control at all.', []),
            opt('Deep in Settings', false, 'Hard to find means no real control.', [note('Settings › Advanced › Data › Export')]),
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
          label: 'Private option?',
          options: [
            opt('No', false, 'Some chats should never be remembered.', []),
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
      goal: 'Find out when your AI answers are bad.',
      frame: [ai('Here are 4 ideas for your empty state…'), slot('ask'), slot('reason'), slot('after')],
      decisions: [
        {
          id: 'ask',
          label: 'How do people give feedback?',
          options: [
            opt('No way', false, 'Your team never learns where the AI fails.', []),
            opt('Pop-up survey', false, 'Interrupts the task. Most people close it.', [modal('Rate your experience (1–10)', '', ['!Submit'])]),
            opt('Thumbs up / down', true, 'One click, right where the answer is.', [buttons([':up', ':down'])]),
          ],
        },
        {
          id: 'reason',
          label: 'After thumbs down',
          options: [
            opt('Required text box', false, 'Required typing kills most feedback.', [ph('Describe the problem (required)')]),
            opt('Optional quick reasons', true, 'Fast for people, useful for your team.', [chips(['Not accurate', 'Too long', 'Wrong tone'])]),
          ],
        },
        {
          id: 'after',
          label: 'After sending',
          options: [
            opt('Nothing happens', false, 'Feels like talking to a wall.', []),
            opt('Thanks + a fix', true, 'Feedback leads to a better answer right away.', [toast('Thanks! Want a shorter version?', 'Shorten')]),
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
      goal: 'An upload failed: the file is too big for the AI.',
      frame: [slot('input'), slot('msg'), slot('next')],
      decisions: [
        {
          id: 'msg',
          label: 'The message',
          options: [
            opt('"Error 413"', false, 'Codes mean nothing to most people.', [banner('bad', 'Error 413', 'Request failed.')]),
            opt('"Something went wrong"', false, 'Too vague. People do not know what to fix.', [banner('bad', 'Something went wrong', '')]),
            opt('What happened + why', true, 'Plain words, real numbers.', [banner('warn', 'That file is too big', 'Limit is 20 MB, yours is 45 MB.')]),
          ],
        },
        {
          id: 'input',
          label: 'The person\'s message',
          options: [
            opt('Clear it', false, 'Making people retype is the most annoying mistake.', [ph('Ask anything…')]),
            opt('Keep it', true, 'Nothing is lost.', [input('Make a mood board from brand-guide.pdf')]),
          ],
        },
        {
          id: 'next',
          label: 'Next step',
          options: [
            opt('None', false, 'A dead end. People give up.', []),
            opt('1–2 concrete actions', true, 'People know exactly what to do.', [buttons(['!Use first 30 pages', 'Upload smaller file'])]),
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
      goal: 'Someone asks an agent: "Clean up our design system file".',
      frame: [user('Clean up our design system file'), slot('start'), slot('size'), slot('edit')],
      decisions: [
        {
          id: 'start',
          label: 'Before working',
          options: [
            opt('Start right away', false, 'If the agent misunderstood, you find out after the damage is done.', [steps([['Deleting unused components', 'active']])]),
            opt('Show a plan, wait', true, 'Mistakes are caught before they cost anything.', [
              check(['Find unused components', 'Rename layers', 'Group colors', 'Ask before deleting']),
              buttons(['!Start']),
            ]),
          ],
        },
        {
          id: 'size',
          label: 'Plan detail',
          options: [
            opt('38 technical steps', false, 'Nobody reviews a 38-step plan.', [note('Step 1/38: resolve node tree… Step 2/38: …')]),
            opt('4 steps + time', true, 'Short enough to actually read.', [note('4 steps · about 5 minutes')]),
          ],
        },
        {
          id: 'edit',
          label: 'Can people change it?',
          options: [
            opt('Only approve / cancel', false, 'One wrong step means rejecting the whole plan.', [buttons(['Approve', 'Cancel'])]),
            opt('Edit, add, remove steps', true, 'People fix just the wrong part.', [buttons([':edit Edit steps', ':plus Add step'])]),
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
      goal: 'Your agent wants to email 240 customers.',
      frame: [slot('ask'), slot('level'), slot('settings')],
      decisions: [
        {
          id: 'ask',
          label: 'Before sending',
          options: [
            opt('Just send', false, 'Sending to 240 people cannot be undone.', [toast('Sent to 240 customers')]),
            opt('Ask "Proceed?"', false, 'Vague questions get blind "OK" clicks.', [modal('Proceed?', '', ['!OK'])]),
            opt('Show who, what, how many', true, 'People can really check before it happens.', [
              modal('Send email to 240 customers?', 'Subject: "Price update in October"', ['Cancel', 'Review', '!Send to 240']),
            ]),
          ],
        },
        {
          id: 'level',
          label: 'Small actions (drafts)',
          options: [
            opt('Ask every time', false, 'Approval fatigue: people stop reading and click Yes to everything.', [modal('Create a draft?', '', ['!Yes'])]),
            opt('Just do them', true, 'Drafts are safe. Save "asks" for risky moments.', [note('Drafted 3 replies (not sent)')]),
          ],
        },
        {
          id: 'settings',
          label: 'Autonomy setting',
          options: [
            opt('None', false, 'People have different comfort levels.', []),
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
      goal: 'A 15-minute AI research task, and a support bot.',
      frame: [slot('wait'), slot('done'), slot('human')],
      decisions: [
        {
          id: 'wait',
          label: 'During the 15 minutes',
          options: [
            opt('Lock the screen', false, 'People cannot do any other work.', [spinner('Please keep this window open (15 min)')]),
            opt('Background + status', true, 'People keep working and can check anytime.', [
              rows([{ label: 'Competitor research', value: '60%', tag: 'Running', tone: 'accent' }]),
            ]),
          ],
        },
        {
          id: 'done',
          label: 'When done or stuck',
          options: [
            opt('Nothing', false, 'Stuck tasks stay stuck forever.', []),
            opt('Notify', true, 'People come back at the right moment.', [toast('Research needs your input', 'Open')]),
          ],
        },
        {
          id: 'human',
          label: 'The bot can\'t help',
          options: [
            opt('"Please rephrase"', false, 'The bot loop: people get angry and leave.', [ai('Sorry, I didn\'t get that. Please rephrase.')]),
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
      goal: 'Help people discover AI summaries in an email app.',
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
            opt('On every email', false, 'Constant offers turn into noise people ignore.', [note('Shown on all 214 emails')]),
            opt('Only on long threads', true, 'Shown when it clearly saves time.', [note('Shown on threads with 10+ replies')]),
          ],
        },
        {
          id: 'after',
          label: 'After people skip it',
          options: [
            opt('Keep asking', false, 'Repeating a “no” feels pushy and erodes trust.', [note('Asks again tomorrow', { tone: 'warn' })]),
            opt('Back off', true, 'Respecting the choice keeps the feature welcome.', [note('Hidden for this thread · Turn off in Settings')]),
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
      goal: 'People want to change one step in a long AI answer.',
      frame: [slot('select'), slot('quote'), slot('scope')],
      decisions: [
        {
          id: 'select',
          label: 'When people select text…',
          options: [
            opt('Nothing happens', false, 'People must copy, paste and describe the part themselves.', [edit('Plan: 1) Interview 5 users. 2) Run a survey with 200 people. 3) Build a prototype.')]),
            opt('Show quick actions', true, 'The selection becomes the starting point.', [
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
            opt('No signal', false, 'People do not know if they are being heard.', [blank('')]),
            opt('Clear listening state', true, 'People know when to talk and when to stop.', [spinner('Listening… tap to stop')]),
          ],
        },
        {
          id: 'show',
          label: 'Show what it understood?',
          options: [
            opt('No, just act', false, 'A misheard number becomes a wrong booking.', []),
            opt('Live transcript', true, 'Mistakes are visible before anything happens.', [edit('Book a table for 4 people at 7 pm', { sel: '4' })]),
          ],
        },
        {
          id: 'confirm',
          label: 'Before booking',
          options: [
            opt('Book right away', false, 'No chance to catch a mistake in the reading.', [toast('Booked for 14 people at 7 pm')]),
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
      goal: 'Set up how much freedom an email agent gets.',
      frame: [slot('levels'), slot('default'), slot('change')],
      decisions: [
        {
          id: 'levels',
          label: 'How are levels set?',
          options: [
            opt('One on/off switch', false, 'Safe and risky tasks get the same freedom.', [toggle('AI agent', true)]),
            opt('Per task, in plain words', true, 'Risk differs by task, so freedom should too.', [
              rows([
                { label: 'Draft replies', value: '', tag: 'Act on its own', tone: 'ok' },
                { label: 'Send emails', value: '', tag: 'Ask first', tone: 'warn' },
              ]),
            ]),
          ],
        },
        {
          id: 'default',
          label: 'Default for new tasks',
          options: [
            opt('Act on its own', false, 'A risky default makes the first mistake a big one.', [note('New tasks: Act on its own', { tone: 'warn' })]),
            opt('Ask first', true, 'Start safe, let people loosen it as trust grows.', [note('New tasks: Ask first')]),
          ],
        },
        {
          id: 'change',
          label: 'Changing the level later',
          options: [
            opt('Deep in Settings', false, 'Hard-to-reach controls feel like no control.', [note('Settings › Advanced › Agents › Permissions')]),
            opt('Right where the agent works', true, 'People adjust in the moment they need it.', [buttons([':more Ask first'])]),
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
      goal: 'An agent tidied a design file while you were away.',
      frame: [slot('record'), slot('words'), slot('undo')],
      decisions: [
        {
          id: 'record',
          label: 'After the run, show…',
          options: [
            opt('“Done” only', false, 'People cannot check or fix what they cannot see.', [toast('Agent finished. 37 actions completed.')]),
            opt('A step-by-step log', true, 'Every change can be checked.', [
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
            opt('As raw system logs', false, 'Technical logs are unreadable for most people.', [note('PATCH /nodes/4:12 {"name":"Card"} 200 OK')]),
            opt('In plain words', true, 'Anyone can understand what happened.', [note('Renamed “Rectangle 42” to “Card”')]),
          ],
        },
        {
          id: 'undo',
          label: 'Reversing changes',
          options: [
            opt('Not possible', false, 'Without undo, people stop letting the agent act.', []),
            opt('Undo each step or restore', true, 'Mistakes are cheap, so people trust the agent more.', [buttons(['Undo step', ':retry Restore to 10:00'])]),
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
      goal: 'An agent is researching competitors and is going the wrong way.',
      frame: [steps([['Found 5 of 12 competitors', 'done'], ['Searching more…', 'active']]), slot('stop'), slot('correct'), slot('resume')],
      decisions: [
        {
          id: 'stop',
          label: 'The control to stop',
          options: [
            opt('Cancel (deletes progress)', false, 'Losing all work punishes people for correcting the agent.', [buttons(['-Cancel'])]),
            opt('Pause (keeps progress)', true, 'People can stop without losing anything.', [buttons(['Pause'])]),
          ],
        },
        {
          id: 'correct',
          label: 'While paused',
          options: [
            opt('Nothing to do', false, 'Pausing is useless if you cannot change direction.', []),
            opt('Type a correction', true, 'Turns a stop into a steer.', [input('Only include companies in India')]),
          ],
        },
        {
          id: 'resume',
          label: 'After the correction',
          options: [
            opt('Start over', false, 'Throws away the 5 good results.', [note('Restarting from step 1…', { tone: 'warn' })]),
            opt('Resume from here', true, 'Keeps good work, applies the change going forward.', [buttons(['!Resume with this change'])]),
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
      goal: 'Three AI agents team up to write a market report.',
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
            opt('Say what was passed on', true, 'Hand-offs are where mistakes slip in. Making them visible helps people check.', [note('Research → Writer: 24 sources, 6 key numbers')]),
            opt('Hand off silently', false, 'If a number is wrong, nobody can tell which agent changed it.', []),
          ],
        },
        {
          id: 'owner',
          label: 'Who answers for the final report?',
          options: [
            opt('“The research agent said so”', false, 'Passing blame between agents breaks trust.', [ai('The research agent said the market grows 300%.')]),
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
      goal: 'An agent orders office supplies by using a website for you.',
      frame: [user('Order more printer paper'), slot('access'), slot('while'), slot('pay')],
      decisions: [
        {
          id: 'access',
          label: 'Ask for access to…',
          options: [
            opt('Your whole computer, once', false, 'Far more access than the task needs. People can’t judge the risk.', [modal('Allow full computer control?', '', ['No', '!Allow'])]),
            opt('Just this one site', true, 'A small, clear scope is easy to say yes to.', [modal('Let the agent use officesupply.com?', 'Only this site, until the order is done.', ['No', '!Allow'])]),
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
            opt('Type in your password to log in', false, 'Agents should never handle passwords. Hand over for logins.', [note('Entering password…')]),
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
      goal: 'An assistant connects to someone’s mail and calendar.',
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
      goal: 'A 30-second AI video uses a lot of credits.',
      frame: [slot('when'), slot('cheaper'), slot('limit')],
      decisions: [
        {
          id: 'when',
          label: 'Show the cost…',
          options: [
            opt('After it is done', false, 'Surprise costs feel like a trick.', [toast('Used 480 credits.')]),
            opt('On the start button', true, 'People decide with the cost in view.', [buttons(['!Generate · ~120 credits'])]),
          ],
        },
        {
          id: 'cheaper',
          label: 'Offer a cheaper option?',
          options: [
            opt('No', false, 'People who just want to explore pay full price.', []),
            opt('Draft preview first', true, 'Cheap drafts let people explore before they spend.', [buttons(['Draft preview · ~10 credits'])]),
          ],
        },
        {
          id: 'limit',
          label: 'Near the monthly limit',
          options: [
            opt('Fail when it runs out', false, 'A task stopping halfway wastes time and credits.', [banner('bad', 'Out of credits', 'Task stopped at 80%.')]),
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
      goal: 'Design the voice mode of an assistant app.',
      frame: [slot('listen'), slot('speak'), slot('barge')],
      decisions: [
        {
          id: 'listen',
          label: 'While it listens',
          options: [
            opt('No signal', false, 'People do not know if they are being heard, so they repeat themselves.', [{ type: 'voice', state: 'idle', label: '…' }]),
            opt('Listening state + live words', true, 'People can see it is hearing them, and what it heard.', [{ type: 'voice', state: 'listening', label: 'Listening', text: 'What is on my calendar…' }]),
          ],
        },
        {
          id: 'speak',
          label: 'While it speaks',
          options: [
            opt('Same look as listening', false, 'People cannot tell whose turn it is.', [{ type: 'voice', state: 'listening', label: 'Listening' }]),
            opt('Distinct speaking state', true, 'Each turn looks different, so turn-taking feels natural.', [{ type: 'voice', state: 'speaking', label: 'Speaking', text: 'You have 3 meetings today…' }]),
          ],
        },
        {
          id: 'barge',
          label: 'When people talk over it',
          options: [
            opt('It keeps talking', false, 'People must wait for long answers they do not need.', [note('Please wait until I finish.', { tone: 'warn' })]),
            opt('It stops and listens', true, 'Interrupting is how people talk; the AI should allow it.', [note('Stopped. Listening…')]),
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
      goal: 'A voice assistant can send money to contacts.',
      frame: [user('Send forty dollars to Priya'), slot('confirm'), slot('detail'), slot('no')],
      decisions: [
        {
          id: 'confirm',
          label: 'Before sending',
          options: [
            opt('Send right away', false, 'A misheard amount or name sends money to the wrong place.', [toast('Sent $14 to Pria K.')]),
            opt('Read back, wait for yes', true, 'People catch mistakes before money moves.', [{ type: 'voice', state: 'speaking', label: 'Speaking', text: 'Send $40 to Priya Shah. Right?' }]),
          ],
        },
        {
          id: 'detail',
          label: 'What it reads back',
          options: [
            opt('Every detail', false, 'Long read-backs are hard to follow and get skipped.', [note('Sending forty point zero zero US dollars from checking account ending 4821 to Priya Shah, phone ending…')]),
            opt('Amount + person', true, 'Only the details that are easy to mishear and costly to get wrong.', [note('$40 to Priya Shah')]),
          ],
        },
        {
          id: 'no',
          label: 'If it is wrong',
          options: [
            opt('Start over', false, 'Repeating the whole request is tiring.', [note('Cancelled. What would you like to do?')]),
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
            opt('Describe it in words', false, 'Locations are hard to describe and easy to misread.', [{ type: 'image' }]),
            opt('Brush or circle it', true, 'Pointing is fast and exact.', [{ type: 'image', sel: [40, 22, 24, 52], selLabel: 'Selected' }]),
          ],
        },
        {
          id: 'ask',
          label: 'Then they…',
          options: [
            opt('Write a full prompt', false, 'Long prompts for a simple edit slow people down.', [ph('Describe the whole image you want…')]),
            opt('Say a short action', true, 'The selection carries the “where”; words only need the “what”.', [chips(['Remove', 'Replace with…', 'Make it blue'])]),
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
      goal: 'Someone asks a smart display: “Find me a flight to Mumbai tomorrow.”',
      frame: [slot('speak'), slot('screen'), slot('next')],
      decisions: [
        {
          id: 'speak',
          label: 'What it says',
          options: [
            opt('Reads all options', false, 'People forget the first option by the time the third is read.', [{ type: 'voice', state: 'speaking', label: 'Speaking', text: 'Option one, the 7:05 flight… option two… option three…' }]),
            opt('A one-line summary', true, 'Short to hear, easy to remember.', [{ type: 'voice', state: 'speaking', label: 'Speaking', text: 'I found 3 flights. The cheapest is $212.' }]),
          ],
        },
        {
          id: 'screen',
          label: 'On the screen',
          options: [
            opt('Just a voice animation', false, 'The screen is wasted while people strain to remember.', [{ type: 'voice', state: 'idle', label: '' }]),
            opt('The options as a list', true, 'Details are easier to compare by eye.', [rows([{ label: '7:05 · 1 stop', value: '$212' }, { label: '9:40 · direct', value: '$268' }])]),
          ],
        },
        {
          id: 'next',
          label: 'To choose',
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
      goal: 'An image generator gets a prompt about people: “a CEO giving a talk”.',
      frame: [user('A CEO giving a talk'), slot('default'), slot('choose'), slot('report')],
      decisions: [
        {
          id: 'default',
          label: 'When the prompt does not say who',
          options: [
            opt('Use whatever the model gives', false, 'Models repeat the biases in their data, like “CEO = older white man”.', [card('4 images', 'All four show the same kind of person.')]),
            opt('Show variety', true, 'Varied defaults avoid teaching stereotypes.', [card('4 images', 'Different genders, ages and skin tones.')]),
          ],
        },
        {
          id: 'choose',
          label: 'If people want something specific',
          options: [
            opt('They must know prompt tricks', false, 'Only expert users get fair control.', []),
            opt('Simple filters they choose', true, 'People choose, the product does not assume.', [chips(['Any', 'Woman', 'Man', 'Older', 'Younger'], { on: 0 })]),
          ],
        },
        {
          id: 'report',
          label: 'When output is unfair',
          options: [
            opt('No way to report', false, 'The team never learns where the model is biased.', []),
            opt('One-click report', true, 'Reports find problems tests missed.', [buttons(['Report unfair result'])]),
          ],
        },
      ],
    },
  },
};
