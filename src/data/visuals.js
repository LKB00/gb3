// Visual content for every pattern:
//  - compare: a "bad" and a "good" mock screen with short pins (labels on the screen)
//  - lab: the Design Lab. People pick one option per decision; wrong options are
//         common mistakes, and `why` explains them after "Check my design".
// Blocks are drawn by src/mock/Mock.jsx.

// ---- block helpers (keep the data short) ----
const user = (text, x) => ({ type: 'user', text, ...x });
const ai = (text, x) => ({ type: 'ai', text, ...x });
const note = (text, x) => ({ type: 'note', text, ...x });
const text = (t, x) => ({ type: 'text', text: t, ...x });
const chips = (items, x) => ({ type: 'chips', items, ...x });
const buttons = (items, x) => ({ type: 'buttons', items, ...x });
const input = (value, x) => ({ type: 'input', value, ...x });
const ph = (placeholder, x) => ({ type: 'input', placeholder, ...x });
const ghost = (value, g, x) => ({ type: 'ghost', value, ghost: g, ...x });
const edit = (t, x) => ({ type: 'edit', text: t, ...x });
const steps = (items, x) => ({ type: 'steps', items: items.map(([label, state]) => ({ label, state })), ...x });
const spinner = (t, x) => ({ type: 'spinner', text: t, ...x });
const banner = (tone, title, t, x) => ({ type: 'banner', tone, title, text: t, ...x });
const toast = (t, action, x) => ({ type: 'toast', text: t, action, ...x });
const variants = (items, x) => ({ type: 'variants', items, ...x });
const rows = (items, x) => ({ type: 'rows', items, ...x });
const card = (title, t, x) => ({ type: 'card', title, text: t, ...x });
const list = (items, x) => ({ type: 'list', items, ...x });
const check = (items, x) => ({ type: 'check', items, ...x });
const diff = (items, x) => ({ type: 'diff', items, ...x });
const modal = (title, t, btns, x) => ({ type: 'modal', title, text: t, buttons: btns, ...x });
const slider = (label, value, left, right, x) => ({ type: 'slider', label, value, left, right, ...x });
const toggle = (label, on, x) => ({ type: 'toggle', label, on, ...x });
const avatar = (name, role, badge, x) => ({ type: 'avatar', name, role, badge, ...x });
const blank = (t, x) => ({ type: 'blank', text: t, ...x });

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
const sure = { tag: '● Sure', tone: 'ok' };
const checkIt = { tag: '◐ Check this', tone: 'warn' };
const notSure = { tag: '○ Not sure', tone: 'bad' };

export const visuals = {
  /* ================= INPUT ================= */
  'prompt-starters': {
    compare: {
      bad: { caption: 'People freeze at an empty box', blocks: [blank(''), ph('Ask anything…', { pin: 'No hint what to ask' })] },
      good: {
        caption: 'Examples teach what is possible',
        blocks: [
          note('Write, summarize or brainstorm. Try one:'),
          chips(['✍️ Write onboarding copy', '📄 Summarize research', '🎨 Suggest palettes'], { pin: 'Real, specific examples' }),
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
            opt('"Hello! I am an AI."', false, 'Says nothing useful. Tell people what the AI is for.', [note('Hello! I am an AI. 🤖')]),
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
              chips(['✍️ Write onboarding copy', '📄 Summarize research', '🎨 Suggest palettes']),
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
          ai('Big news, everyone! 🎉 Our dashboard just got better…', { pin: 'Guessed the audience' }),
          user('No… this is for investors.', { pin: 'Wasted round' }),
        ],
      },
      good: {
        caption: 'One quick question first',
        blocks: [
          user('Make a launch post for the dashboard.'),
          ai('Quick check: **who is this for?**'),
          chips(['Customers', 'Team', 'Investors', 'Just guess →'], { pin: 'Tap, don\'t type' }),
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
            opt('Guesses and writes it all', false, 'If the guess is wrong, the person must start over.', [ai('Big news, everyone! 🎉 Our dashboard…')]),
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
            opt('"Just guess" option', true, 'Respect people who want speed over precision.', [chips(['Just guess →'])]),
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
        blocks: [chips(['📄 Q3-report.pdf  ✕', '+ Add'], { pin: 'Visible + removable' }), input('Summarize this.')],
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
            opt('Context chips', true, 'People can see the AI is using the right file.', [chips(['📄 Q3-report.pdf'])]),
          ],
        },
        {
          id: 'change',
          label: 'Can people change it?',
          options: [
            opt('No', false, 'If the AI picked wrong, people are stuck.', []),
            opt('Remove ✕ / + Add', true, 'People stay in charge of what the AI reads.', [buttons(['✕ Remove', '+ Add file'])]),
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
                { label: 'Tone', value: 'Formal ▾' },
                { label: 'Length', value: '80 words ▾' },
                { label: 'Format', value: 'Bullets ▾' },
                { label: 'Emoji', value: 'Off ▾' },
                { label: 'Spelling', value: 'UK ▾' },
                { label: '+ 10 more…', value: '' },
              ]),
            ]),
            opt('2–3 + "More"', true, 'Show the common ones. Hide the rest.', [buttons(['More options ▾'])]),
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
          buttons(['-■ Stop']),
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
            opt('Stop button', true, 'People stay in control.', [buttons(['-■ Stop'])]),
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
        blocks: [ai('Fresh beans, warm hearts.'), buttons(['↻ Regenerate'], { pin: 'Old answer lost' })],
      },
      good: {
        caption: 'Every version is kept',
        blocks: [ai('Fresh beans, warm hearts.'), buttons(['‹', '2 / 3', '›', '↻ Retry'], { pin: 'Go back anytime' }), chips(['Shorter', 'Funnier', 'Formal'])],
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
            opt('Replace the answer', false, 'If the new one is worse, the better one is gone forever.', [buttons(['↻ Regenerate'])]),
            opt('Keep versions ‹ 2/3 ›', true, 'People can go back and compare.', [buttons(['‹', '2 / 3', '›', '↻ Retry'])]),
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
        blocks: [ai(email), buttons(['Copy', '↻ Regenerate all'], { pin: 'Only all-or-nothing' })],
      },
      good: {
        caption: 'A draft you can shape',
        blocks: [
          note('✨ AI draft · review before sending', { tone: 'accent' }),
          edit(email, { sel: 'Your notes on checkout helped a lot.', pin: 'Edit directly' }),
          buttons(['✨ Rewrite selection']),
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
            opt('Regenerate all', false, 'Everything changes, even the parts people liked.', [buttons(['↻ Regenerate all'])]),
            opt('Rewrite selection', true, 'Change only what needs fixing.', [buttons(['✨ Rewrite selection'])]),
          ],
        },
        {
          id: 'label',
          label: 'Mark it as a draft?',
          options: [
            opt('No', false, 'People may send AI text without reading it.', []),
            opt('"AI draft · review"', true, 'A gentle reminder to check before sending.', [note('✨ AI draft · review before sending', { tone: 'accent' })]),
          ],
        },
      ],
    },
  },

  'inline-suggestions': {
    compare: {
      bad: {
        caption: 'AI changes your words',
        blocks: [edit('Thanks for the feedback! I will update the design today. Kind regards, The Team'), note('✨ AI improved your text', { pin: 'Changed without asking' })],
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
            opt('Automatically', false, 'Takes control away. People must undo what they never asked for.', [note('✓ Applied automatically')]),
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
          buttons(['-■ Stop'], { pin: 'Stop anytime' }),
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
            opt('Stop button', true, 'People can stop it the moment it goes wrong.', [steps([['Renaming 24 layers', 'active']]), buttons(['-■ Stop'])]),
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
        blocks: [edit('We use this tool to plan work and share it with the team.'), toast('Document improved ✓', '', { pin: 'Changed silently' })],
      },
      good: {
        caption: 'Before → after, you decide',
        blocks: [
          diff([['utilize', 'use'], ['in order to', 'to'], ['a large number of', 'many']], { pin: 'See every change' }),
          buttons(['✓ Accept', '✕ Reject', 'Next ›']),
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
            opt('Accept each change', true, 'Keep the good, drop the bad.', [buttons(['✓ Accept', '✕ Reject', 'Next ›'])]),
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
        blocks: [banner('info', 'Meet Max 🚀', 'The AI that knows everything!', { pin: 'Not true' }), ph('Ask Max anything…')],
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
            opt('"Knows everything!"', false, 'Over-promising leads to blind trust, then disappointment.', [banner('info', 'Meet Max 🚀', 'The AI that knows everything!')]),
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
            opt('Opens a new tab', false, 'Leaves the flow, so most people never check.', [note('↗ Opens report.pdf in a new tab')]),
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
        blocks: [invoiceRows([sure, sure, checkIt, notSure]), buttons(['Show only "check" (2)'], { pin: 'Review faster' })],
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
            opt('"Show only check (2)"', true, 'People spend time where it matters.', [buttons(['Show only "check" (2)'])]),
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
            opt('✨ Badge by the name', true, 'Seen at the same moment as the author.', [avatar('Asha K', 'Product designer', 'AI-assisted')]),
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
          note('💾 Memory updated: "Prefers short answers"', { tone: 'accent', pin: 'Says when it saves' }),
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
            opt('Small "Memory updated" note', true, 'No surprises later.', [note('💾 Memory updated: "Prefers short answers"', { tone: 'accent' })]),
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
        blocks: [ai('Here are 4 ideas for your empty state…'), buttons(['👍', '👎'], { pin: 'One click' }), chips(['Not accurate', 'Too long', 'Wrong tone'])],
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
            opt('👍 👎 on each answer', true, 'One click, right where the answer is.', [buttons(['👍', '👎'])]),
          ],
        },
        {
          id: 'reason',
          label: 'After 👎',
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
          buttons(['✎ Edit', '!Start']),
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
            opt('Edit, add, remove steps', true, 'People fix just the wrong part.', [buttons(['✎ Edit steps', '+ Add step'])]),
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
            opt('Just send', false, 'Sending to 240 people cannot be undone.', [toast('Sent to 240 customers ✓')]),
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
};
