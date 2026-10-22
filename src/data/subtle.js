// Hard mode ("spot the difference"): two screens that look almost the same.
// Only one small detail differs, and that detail is a real AI design pattern.
// Each pair is built from shared blocks plus the one block that changes.
//   bad / good: the changed block, with a short pin shown after answering.

// pair(id, pattern, brief, before[], bad, good, after[])
import { user, ai, note, buttons, chips, ph, toast, banner, modal, rows, steps, card, ghost, voice } from '../mock/blocks.js';

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
    [user('Write a 10-page market report.'), steps([['Collecting data', 'done'], ['Writing sections', 'active']])],
    note('Writing… 2 of 10 pages', { pin: 'Can’t stop it' }),
    note('Writing… 2 of 10 pages · ■ Stop', { pin: 'Stop any time' })
  ),
  pair(
    'confirm-specific',
    'action-approval',
    'An agent is about to send emails for you.',
    [ai('Your follow-up emails are ready.')],
    modal('Are you sure?', 'This action cannot be undone.', ['Cancel', '!OK'], { pin: 'Sure about what?' }),
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
    rows([{ label: 'Total', value: '$48.00' }, { label: 'Tax', value: '$3.80' }], { pin: 'A guess that looks sure' }),
    rows([{ label: 'Total', value: '$48.00' }, { label: 'Tax', value: '$3.80', tag: 'Check', tone: 'warn' }], { pin: 'Flags the unsure part' })
  ),
  pair(
    'starters',
    'prompt-starters',
    'The first screen of a new AI notes app.',
    [note('Hi! What can I help with?')],
    chips(['Ask me anything', 'Get started', 'Help'], { pin: 'Too general to help' }),
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
    toast('Thanks for your feedback!', null, { pin: 'Doesn’t ask what was wrong' }),
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
    note('Perfect notes for every meeting.', { pin: 'Promises too much' }),
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
    note('Working on it…', { pin: 'Can’t see how far it got' }),
    steps([['Alex · booked', 'done'], ['Priya · booked', 'done'], ['Sam · waiting for seat choice', 'active']], { pin: 'Clear status for each task' })
  ),
  pair(
    'redirect',
    'interrupt-redirect',
    'An agent is halfway through a big edit.',
    [steps([['Rename layers', 'done'], ['Rebuild components', 'active']])],
    buttons(['-Cancel all'], { pin: 'Can only stop everything' }),
    buttons(['Pause', 'Change instructions', '-Stop'], { pin: 'Pause and steer it' })
  ),
  pair(
    'read-back',
    'read-back',
    'You ask a voice assistant to send money.',
    [{ type: 'voice', state: 'listening', label: 'You', text: 'Send fifteen hundred to Ravi' }],
    { type: 'voice', state: 'speaking', label: 'Assistant', text: 'Done. Money sent.', pin: 'Didn’t check what it heard' },
    { type: 'voice', state: 'speaking', label: 'Assistant', text: 'Send ₹1,500 to Ravi Kumar? Say yes to confirm.', pin: 'Reads it back first' }
  ),
  pair(
    'preview',
    'preview-changes',
    'The AI will fix spelling in your whole doc.',
    [ai('I found 9 spelling fixes.')],
    buttons(['!Apply all'], { pin: 'Changes things before you look' }),
    { type: 'diff', items: [['recieve', 'receive'], ['seperate', 'separate']], pin: 'Shows the changes first' },
    [buttons(['Review all 9', '!Apply'])]
  ),
  pair(
    'handoff',
    'agent-handoff',
    'Three agents write a report together.',
    [user('Write a report on AI note apps')],
    steps([['Agents working…', 'active']], { pin: 'Can’t see who does what' }),
    steps([['Research agent · done', 'done'], ['Writer agent · drafting', 'active'], ['Checker agent · next', 'todo']], { pin: 'Each agent and its job' })
  ),
  pair(
    'site-scope',
    'screen-control',
    'An agent wants to shop on a website for you.',
    [user('Order printer paper')],
    modal('Allow control of your computer?', 'All sites and apps.', ['No', '!Allow'], { pin: 'Asks for everything' }),
    modal('Let the agent use officesupply.com?', 'Only this site, until the order is done.', ['No', '!Allow'], { pin: 'Just what the task needs' })
  ),
  pair(
    'take-over',
    'screen-control',
    'An agent is clicking through a website for you.',
    [banner('info', 'Agent is in control', 'officesupply.com')],
    note('Please don’t touch the mouse.', { pin: 'You can’t step in' }),
    buttons(['!Take over'], { pin: 'Take back control any time' })
  ),
  pair(
    'app-source',
    'connected-apps',
    'An assistant connected to your calendar answers a question.',
    [user('When am I free tomorrow?')],
    ai('You’re free after 3 pm.', { pin: 'Where did that come from?' }),
    ai('You’re free after 3 pm. (from Google Calendar)', { pin: 'Names the source app' })
  ),
  pair(
    'read-only',
    'connected-apps',
    'You connect an AI to your email.',
    [note('Connect Gmail')],
    modal('Allow access to Gmail?', 'Read, send and delete email.', ['No', '!Allow'], { pin: 'More than needed' }),
    modal('Allow read-only access to Gmail?', 'It can’t send or delete.', ['No', '!Allow'], { pin: 'Asks only for what it needs' })
  ),
  pair(
    'thumbs-undo',
    'feedback-loop',
    'You tapped thumbs-down by mistake.',
    [ai('Here’s your summary.')],
    toast('Feedback sent', null, { pin: 'Can’t take it back' }),
    toast('Feedback sent', 'Undo', { pin: 'Easy to take back' })
  ),
  pair(
    'edit-inline',
    'editable-output',
    'The AI drafted a reply email.',
    [user('Reply yes to the meeting')],
    buttons(['Copy', ':retry Regenerate'], { pin: 'To fix it, start over' }),
    buttons(['Edit', 'Copy', ':retry Regenerate'], { pin: 'Edit in place' })
  ),
  pair(
    'nudge-timing',
    'contextual-nudge',
    'A writing app offers AI help.',
    [{ type: 'edit', text: 'Our Q3 results were', sel: '' }],
    banner('info', 'Try AI! ✨', 'Upgrade to write 10× faster', { pin: 'Interrupts with an ad' }),
    note('Stuck? Press Tab to continue the sentence.', { tone: 'faint', pin: 'Quiet help, right on time' })
  ),
  pair(
    'bias',
    'bias-check',
    'An AI makes images for a careers page.',
    [user('Images of engineers at work')],
    note('4 images · all men in their 30s', { pin: 'Shows only one kind of person' }),
    note('4 images · varied ages, genders and backgrounds', { pin: 'Shows real variety' })
  ),
  pair(
    'autonomy',
    'autonomy-dial',
    'Settings for an email agent.',
    [note('Email agent settings')],
    { type: 'toggle', label: 'Let the agent handle my email', on: true, pin: 'All or nothing' },
    rows([{ label: 'Sort and label', value: 'Auto' }, { label: 'Draft replies', value: 'Ask me' }, { label: 'Send', value: 'Never' }], { pin: 'Choose how much it does' })
  ),
  pair(
    'stream-words',
    'streaming-response',
    'The AI is writing a long answer.',
    [user('How do vaccines work?')],
    { type: 'spinner', text: 'Thinking… 0:25', pin: 'Nothing to read yet' },
    ai('Vaccines teach your body to spot a germ early, so', { caret: true, pin: 'Words show up as they come' })
  ),
  pair(
    'saw-photo',
    'show-understanding',
    'You show the AI a photo of your fridge.',
    [{ type: 'image', height: 70 }, user('What can I cook tonight?')],
    ai('Here are 3 dinner ideas!', { pin: 'What did it see?' }),
    ai('I see eggs, spinach and feta. Here are 3 dinner ideas!', { pin: 'Says what it saw first' })
  ),
  pair(
    'keep-versions',
    'regenerate-history',
    'You asked the AI for a new tagline.',
    [user('A tagline for our bakery'), ai('Warm bread, warmer mornings.')],
    buttons([':retry Regenerate'], { pin: 'The old one is lost' }),
    buttons([':left', '2 of 2', ':right', ':retry Regenerate'], { pin: 'Flip back to older ones' })
  ),
  pair(
    'reply-part',
    'reply-to-part',
    'You want to change one day of a trip plan.',
    [ai('Your 3 days in Rome:'), note('Day 1: Colosseum and Forum')],
    note('Day 2: Vatican, Sistine Chapel, St Peter’s', { pin: 'Can only reply to it all' }),
    note('Day 2: Vatican, Sistine Chapel, St Peter’s · Reply', { pin: 'Reply to just this day' }),
    [ph('Ask anything…')]
  ),
  pair(
    'practice-run',
    'sandbox-preview',
    'An agent will raise every price in your online shop.',
    [user('Raise all prices by 5%')],
    buttons(['!Update live shop'], { pin: 'Goes straight to the real shop' }),
    buttons(['Practice run first', '!Update live shop'], { pin: 'See the result before it’s real' })
  ),
  pair(
    'circle-spot',
    'point-to-edit',
    'You want to remove one car from a street photo.',
    [],
    { type: 'image', height: 70, pin: 'Which car?' },
    { type: 'image', height: 70, sel: [58, 35, 30, 45], selLabel: 'This car', pin: 'Point at the exact spot' },
    [user('Remove the car')]
  ),
  pair(
    'one-question',
    'clarifying-questions',
    'You ask the AI to plan a birthday party.',
    [user('Plan a party for my son')],
    ai('Here’s a plan for 50 guests in a hotel ballroom!', { pin: 'Guesses the big stuff' }),
    ai('Fun! How many kids are coming?', { pin: 'Asks the one thing it needs' })
  ),
  pair(
    'grey-hint',
    'inline-suggestions',
    'An email app offers to finish your sentence.',
    [note('New email to Maya')],
    ghost('Thanks for the update, ', 'I’ll send the files by Friday.', { solid: true, pin: 'Looks like you typed it' }),
    ghost('Thanks for the update, ', 'I’ll send the files by Friday.', { pin: 'A grey hint you can keep or skip' })
  ),
  pair(
    'change-list',
    'action-log',
    'An agent tidied your calendar overnight.',
    [note('Good morning! Your week is ready.')],
    toast('Done. 23 changes made', null, { pin: 'What did it change?' }),
    toast('Done. 23 changes made', 'See each one', { pin: 'Every change, in a list you can check' })
  ),
  pair(
    'say-less',
    'mode-switch',
    'You ask a smart display for cafés nearby.',
    [voice('listening', 'You', 'Find a café near me')],
    voice('speaking', 'Assistant', 'Café one, Bean There, 400 metres, 4.5 stars. Café two, Brew Lab, 600 metres…', { pin: 'Reads a long list out loud' }),
    voice('speaking', 'Assistant', 'I found 6. The closest is Bean There. The rest are on the screen.', { pin: 'Says the top pick, shows the rest' })
  ),
];

export const getSubtle = (id) => subtle.find((s) => s.id === id);
