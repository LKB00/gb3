// Hard mode ("spot the difference"): two screens that look almost the same.
// Only one small detail differs, and that detail is a real AI design pattern.
// Each pair is built from shared blocks plus the one block that changes.
//   bad / good: the changed block, with a short pin shown after answering.

const user = (text) => ({ type: 'user', text });
const ai = (text, x) => ({ type: 'ai', text, ...x });
const note = (text, x) => ({ type: 'note', text, ...x });
const buttons = (items, x) => ({ type: 'buttons', items, ...x });
const chips = (items, x) => ({ type: 'chips', items, ...x });
const ph = (placeholder, x) => ({ type: 'input', placeholder, ...x });
const toast = (text, action, x) => ({ type: 'toast', text, action, ...x });
const banner = (tone, title, text, x) => ({ type: 'banner', tone, title, text, ...x });
const modal = (title, text, btns, x) => ({ type: 'modal', title, text, buttons: btns, ...x });
const rows = (items, x) => ({ type: 'rows', items, ...x });
const steps = (items, x) => ({ type: 'steps', items: items.map(([label, state]) => ({ label, state })), ...x });
const card = (title, text, x) => ({ type: 'card', title, text, ...x });

// pair(id, pattern, brief, before[], bad, good, after[])
const pair = (id, pattern, brief, before, bad, good, after = []) => ({
  id,
  pattern,
  brief,
  bad: [...before, bad, ...after],
  good: [...before, good, ...after],
  badCaption: bad.pin,
  goodCaption: good.pin,
});

export const subtle = [
  pair(
    'undo-toast',
    'stop-and-undo',
    'The AI just rewrote a paragraph in your doc.',
    [card('Intro paragraph', 'Our app helps teams plan launches in one place.')],
    toast('Paragraph rewritten', null, { pin: 'No way back' }),
    toast('Paragraph rewritten', 'Undo', { pin: 'One-tap undo' })
  ),
  pair(
    'source-link',
    'citations',
    'The AI answers a question about churn.',
    [user('Why did churn go up in May?')],
    ai('Churn rose 4% because the new pricing confused small teams.', { pin: 'A claim with no source' }),
    ai('Churn rose 4% because the new pricing confused small teams [1].', { pin: 'Claim links to a source' }),
    [note(':file [1] May churn survey, 212 replies')]
  ),
  pair(
    'stop-button',
    'stop-and-undo',
    'The AI is writing a long report.',
    [user('Write a 10-page market report.'), steps([['Collecting data', 'done'], ['Writing sections', 'now']])],
    note('Writing… 2 of 10 pages', { pin: 'Can’t stop it' }),
    note('Writing… 2 of 10 pages · ■ Stop', { pin: 'Stop any time' })
  ),
  pair(
    'confirm-specific',
    'action-approval',
    'An agent is about to send emails for you.',
    [ai('Your follow-up emails are ready.')],
    modal('Are you sure?', 'This action cannot be undone.', ['Cancel', '!OK'], { pin: 'Vague: sure about what?' }),
    modal('Send 48 emails to clients?', 'They go out now from you@studio.com. You can’t unsend.', ['Cancel', '!Send 48 emails'], { pin: 'Says exactly what happens' })
  ),
  pair(
    'error-next-step',
    'graceful-errors',
    'The AI could not read a file.',
    [user('Summarize budget.xlsx')],
    banner('bad', 'Something went wrong.', 'Error 500.', { pin: 'No next step' }),
    banner('bad', 'I couldn’t open budget.xlsx', 'It’s password protected. Upload an unlocked copy?', { pin: 'Says why, and what to do' })
  ),
  pair(
    'ai-label',
    'ai-disclosure',
    'A support chat on a shopping site.',
    [{ type: 'avatar', name: 'Sam', role: 'Support' }],
    ai('Hi! I can help with your order.', { pin: 'Looks like a human' }),
    ai('Hi! I’m Sam, an AI assistant. A person can step in any time.', { pin: 'Says it’s an AI' })
  ),
  pair(
    'confidence',
    'confidence-signals',
    'The AI reads a blurry receipt.',
    [card('Receipt scan', 'Coffee Corner · 14 Sep')],
    rows([{ label: 'Total', value: '$48.00' }, { label: 'Tax', value: '$3.80' }], { pin: 'Guess looks certain' }),
    rows([{ label: 'Total', value: '$48.00' }, { label: 'Tax', value: '$3.80', tag: 'Check', tone: 'warn' }], { pin: 'Flags the unsure part' })
  ),
  pair(
    'starters',
    'prompt-starters',
    'The first screen of a new AI notes app.',
    [note('Hi! What can I help with?')],
    chips(['Ask me anything', 'Get started', 'Help'], { pin: 'Vague examples' }),
    chips([':file Summarize my last meeting', ':pen Draft a follow-up email'], { pin: 'Specific, real examples' }),
    [ph('Ask anything…')]
  ),
  pair(
    'plan-first',
    'plan-first',
    'An agent will clean up your files.',
    [user('Clean up my project folder.')],
    note('Starting now…', { pin: 'Acts without a plan' }),
    steps([['Archive 214 old files', 'todo'], ['Delete 0 files', 'todo']], { pin: 'Shows the plan first' }),
    [buttons(['Edit plan', '!Start'])]
  ),
  pair(
    'cost',
    'cost-estimate',
    'An agent offers to research 50 companies.',
    [ai('I can research all 50 companies for you.')],
    buttons(['!Start research'], { pin: 'No idea what it costs' }),
    buttons(['!Start · ~12 min · 40 credits'], { pin: 'Time and cost up front' })
  ),
  pair(
    'feedback-why',
    'feedback-loop',
    'You rated an AI answer thumbs down.',
    [ai('Here are 3 headline ideas for your page.')],
    toast('Thanks for your feedback!', null, { pin: 'Nothing to learn from' }),
    chips(['Too long', 'Wrong tone', 'Not accurate', 'Other'], { pin: 'Asks what was wrong, in one tap' })
  ),
  pair(
    'variants-label',
    'multiple-variants',
    'The AI made 3 logo ideas.',
    [user('Logo ideas for a bakery')],
    { type: 'variants', items: ['Idea', 'Idea', 'Idea'], pin: 'Hard to tell apart' },
    { type: 'variants', items: ['Hand-drawn', 'Minimal', 'Retro'], pin: 'Each option has a name' }
  ),
  pair(
    'memory',
    'memory-controls',
    'The AI remembers things about you.',
    [ai('Welcome back! Planning another trip to Goa?')],
    note('Memory is on.', { pin: 'Can’t see or edit it' }),
    note('I remember: Goa trip, vegetarian · Manage memory', { pin: 'Shows what it remembers' })
  ),
  pair(
    'context-chip',
    'visible-context',
    'You ask the AI about “this file”.',
    [user('Summarize this file.')],
    ph('Ask about this file…', { pin: 'Which file?' }),
    chips([':file Q3-report.pdf  ✕'], { pin: 'Shows what it’s looking at' })
  ),
  pair(
    'expectations',
    'set-expectations',
    'An AI that writes meeting notes.',
    [note('Meeting notes AI')],
    note('Perfect notes for every meeting.', { pin: 'Overpromises' }),
    note('Good at decisions and to-dos. May miss names. Check before sharing.', { pin: 'Honest about limits' })
  ),
  pair(
    'explain',
    'explain-why',
    'An AI suggests a song for you.',
    [card('For you', 'Sunset Drive · Neon Lake')],
    note('Recommended', { pin: 'No reason given' }),
    note('Because you played Neon Lake 12 times this week', { pin: 'Explains why' })
  ),
  pair(
    'status',
    'task-status',
    'An agent is booking 3 flights in the background.',
    [user('Book flights for the team offsite.')],
    note('Working on it…', { pin: 'Can’t tell how far along' }),
    steps([['Alex · booked', 'done'], ['Priya · booked', 'done'], ['Sam · waiting for seat choice', 'now']], { pin: 'Clear status for each task' })
  ),
  pair(
    'redirect',
    'interrupt-redirect',
    'An agent is halfway through a big edit.',
    [steps([['Rename layers', 'done'], ['Rebuild components', 'now']])],
    buttons(['-Cancel all'], { pin: 'Only all-or-nothing' }),
    buttons(['Pause', 'Change instructions', '-Stop'], { pin: 'Pause and steer it' })
  ),
  pair(
    'read-back',
    'read-back',
    'A voice assistant sets a transfer.',
    [{ type: 'voice', state: 'listening', label: 'You', text: 'Send fifteen hundred to Ravi' }],
    { type: 'voice', state: 'speaking', label: 'Assistant', text: 'Done. Money sent.', pin: 'Didn’t check what it heard' },
    { type: 'voice', state: 'speaking', label: 'Assistant', text: 'Send ₹1,500 to Ravi Kumar? Say yes to confirm.', pin: 'Reads it back first' }
  ),
  pair(
    'preview',
    'preview-changes',
    'The AI will fix spelling in your whole doc.',
    [ai('I found 9 spelling fixes.')],
    buttons(['!Apply all'], { pin: 'Changes without a look' }),
    { type: 'diff', items: [['recieve', 'receive'], ['seperate', 'separate']], pin: 'Preview before applying' },
    [buttons(['Review all 9', '!Apply'])]
  ),
];

export const getSubtle = (id) => subtle.find((s) => s.id === id);
