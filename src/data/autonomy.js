// The autonomy ladder: how much power an AI should have for a task.
// Idea: power is a product choice, not a model skill. Just because the AI *can*
// do something doesn't mean the product should *let* it. Match power to risk.

import { user, ai, buttons, chips, modal, card, rows, toast, note } from '../mock/blocks.js';

export const levels = [
  {
    n: 1,
    id: 'suggest',
    name: 'Suggest',
    short: 'AI suggests, you do it',
    line: 'The AI only gives ideas. You decide, and you do the work.',
    decides: 'You',
    acts: 'You',
    use: ['Big choices about people, health or money', 'Things that need your taste or voice', 'Cases where the AI is often wrong'],
    risk: 'Too many suggestions feel like noise. Keep them quiet and easy to ignore.',
    patterns: ['inline-suggestions', 'multiple-variants', 'prompt-starters', 'contextual-nudge'],
    app: 'Mail',
    screen: [{ type: 'ghost', value: 'Hi Sam, thanks for the quick ', ghost: 'reply yesterday.' }, chips(['Tab to accept', 'Keep typing to ignore'])],
  },
  {
    n: 2,
    id: 'draft',
    name: 'Draft',
    short: 'AI drafts, you edit and send',
    line: 'The AI makes a first version. You check it, change it and send it.',
    decides: 'You',
    acts: 'You (with the AI’s draft)',
    use: ['Writing that goes out under your name', 'Work where a first version saves time', 'Anything people will read and judge you on'],
    risk: 'People stop reading drafts and just hit send. Make editing easy and visible.',
    patterns: ['editable-output', 'regenerate-history', 'preview-changes', 'explain-why'],
    app: 'Support desk',
    screen: [card('Draft reply', 'Sorry your order arrived late, Priya. I’ve refunded the delivery fee…'), buttons([':edit Edit', ':retry Try again', '!Send'])],
  },
  {
    n: 3,
    id: 'confirm',
    name: 'Confirm',
    short: 'AI gets it ready, you say go',
    line: 'The AI does the prep and shows exactly what will happen. Nothing happens until you say yes.',
    decides: 'You',
    acts: 'AI, after your yes',
    use: ['Spending money', 'Things that are hard to undo', 'Actions other people will see'],
    risk: 'Too many “Are you sure?” popups and people click yes without reading. Ask only when it matters, and say exactly what will happen.',
    patterns: ['plan-first', 'action-approval', 'cost-estimate', 'read-back', 'preview-changes'],
    app: 'Pay agent',
    screen: [user('Send fifteen hundred to Ravi'), modal('Send ₹1,500 to Ravi Kumar?', 'From your savings account. This can’t be undone.', ['Cancel', '!Send ₹1,500'])],
  },
  {
    n: 4,
    id: 'act-tell',
    name: 'Act & tell',
    short: 'AI does it, then tells you',
    line: 'The AI acts on its own, then tells you what it did. You can undo it.',
    decides: 'AI',
    acts: 'AI',
    use: ['Low-risk tasks that are easy to undo', 'Things that happen often', 'Cases where waiting for you would be slower than fixing a rare mistake'],
    risk: 'A wrong action goes unnoticed if the “I did this” message is easy to miss. Make undo one tap.',
    patterns: ['action-log', 'stop-and-undo', 'task-status', 'agent-handoff'],
    app: 'Inbox agent',
    screen: [ai('Done while you were away:'), rows([{ label: 'Moved to Receipts', value: '12 emails' }, { label: 'Unsubscribed', value: '3 lists' }]), toast('Moved 12 emails to Receipts', 'Undo')],
  },
  {
    n: 5,
    id: 'act-alone',
    name: 'Act alone',
    short: 'AI handles it quietly',
    line: 'The AI just handles it. You check a summary now and then, and you can turn it off.',
    decides: 'AI',
    acts: 'AI',
    use: ['Tiny, safe, repeated tasks', 'Things nobody wants to think about', 'Mistakes that cost almost nothing'],
    risk: 'People forget it’s on. Show what it’s doing somewhere, and keep an off switch close.',
    patterns: ['autonomy-dial', 'action-log', 'connected-apps', 'memory-controls'],
    app: 'Settings',
    screen: [rows([{ label: 'Spam blocked this week', value: '48' }, { label: 'Auto-filter', value: 'On', tag: 'Change', tone: 'ok' }]), note('Last check: today, 9:14 · See what was blocked')],
  },
];

export const getLevel = (n) => levels.find((l) => l.n === n);

// Four quick questions → a starting level. A rule of thumb, not a law.
export const questions = [
  { id: 'impact', q: 'If the AI gets it wrong, how bad is it?', options: [['low', 'A small annoyance'], ['mid', 'Costs time or looks bad'], ['high', 'Costs money, health or trust']] },
  { id: 'undo', q: 'Can it be undone?', options: [['easy', 'Yes, in one tap'], ['hard', 'Not easily']] },
  { id: 'often', q: 'How often does it happen?', options: [['often', 'Many times a day or week'], ['rare', 'Once in a while']] },
  { id: 'taste', q: 'Does it need the person’s taste or voice?', options: [['no', 'No, there’s a right answer'], ['yes', 'Yes, it’s personal']] },
];

export function suggestLevel({ impact = 'mid', undo = 'easy', often = 'often', taste = 'no' }) {
  let lvl = impact === 'high' ? 3 : impact === 'mid' ? 4 : 5;
  if (undo === 'hard' && impact !== 'high') lvl -= 1;
  if (often === 'rare' && lvl >= 4) lvl -= 1;
  if (taste === 'yes') lvl = impact === 'high' ? 1 : Math.min(lvl, 2);
  return lvl;
}

// The game: "How much power?" Pick the right level for each task.
// tags show the risk clues: money, people, hard (to undo), easy (to undo), often, taste.
const task = (id, text, detail, level, tags, why) => ({ id, text, detail, level, tags, why });

export const tasks = [
  task('autocomplete', 'Finish the sentence someone is typing', 'In an email to a client.', 1, ['taste', 'often'],
    'It’s their words and their voice. Grey ghost text they can accept or ignore is enough.'),
  task('hiring', 'Choose which job applicants get an interview', 'A hiring tool with 400 CVs.', 1, ['people', 'hard'],
    'It changes people’s lives and can hide bias. The AI can point things out, but a person decides.'),
  task('gift', 'Pick a birthday gift for your mum', 'A shopping assistant.', 1, ['taste', 'money'],
    'It’s personal. Show a few ideas and let the person choose.'),
  task('treatment', 'Choose a treatment for a patient', 'An AI tool used by doctors.', 1, ['people', 'hard'],
    'Health is too important to hand over. The AI suggests options with sources, the doctor decides.'),
  task('complaint', 'Reply to an angry customer', 'A support inbox.', 2, ['people', 'taste'],
    'The reply speaks for the company. A draft saves time, but a person reads and sends it.'),
  task('cover', 'Write a cover letter for a job', 'A writing assistant.', 2, ['taste', 'people'],
    'It goes out under the person’s name. A good draft to edit beats a finished letter they didn’t check.'),
  task('notes', 'Turn meeting notes into a summary for the team', 'A notes app.', 2, ['people'],
    'Others will read it and act on it. A quick check catches a wrong name or number before it spreads.'),
  task('pay', 'Send ₹1,500 to a friend, by voice', 'A banking assistant.', 3, ['money', 'hard'],
    'Money, hard to undo, and voice can mishear. Read it back and wait for a clear yes.'),
  task('flights', 'Book flights for a team trip', 'A travel agent for 6 people.', 3, ['money', 'people'],
    'Big spend and many people. Show the plan and the price, then book after a yes.'),
  task('delete', 'Delete 3,000 old files to free up space', 'A cleanup agent on your laptop.', 3, ['hard'],
    'Deleting is hard to undo. Show what will go and ask first.'),
  task('newsletter', 'Send an email to 500 customers', 'A marketing agent.', 3, ['people', 'hard'],
    'Once sent, it can’t be taken back, and everyone sees mistakes. Preview it and confirm.'),
  task('meeting', 'Move a meeting with your boss to Friday', 'A calendar agent.', 3, ['people'],
    'It affects someone else’s day. Show the new time and send after a yes.'),
  task('cancel-sub', 'Cancel a subscription you haven’t used in 3 months', 'A money app.', 3, ['money', 'hard'],
    'Spotting it is great, but some people want to keep it. Suggest it and cancel on a yes.'),
  task('sort-mail', 'Sort new emails into folders', 'An inbox agent.', 4, ['often', 'easy'],
    'Happens all day, low risk, easy to move back. Do it and keep a clear log with undo.'),
  task('reroute', 'Change the driving route around a traffic jam', 'A navigation app.', 4, ['often', 'easy'],
    'Waiting for the driver to tap is unsafe. Switch to the faster road and say so out loud.'),
  task('calendar-add', 'Add a flight from your booking email to your calendar', 'A mail app.', 4, ['easy', 'often'],
    'Helpful, low risk and easy to delete. Add it and show a small “Added” note.'),
  task('tidy-files', 'Rename and tidy files in your Downloads folder', 'A file agent.', 4, ['easy'],
    'Low risk if every change is logged and can be reversed in one tap.'),
  task('spam', 'Block spam emails', 'An email app.', 5, ['often', 'easy'],
    'Hundreds a week, almost no risk, nobody wants to approve each one. A spam folder to check is enough.'),
  task('noise', 'Remove background noise on a video call', 'A calling app.', 5, ['often', 'easy'],
    'Tiny and constant. Asking would be annoying. Just keep a switch to turn it off.'),
  task('backup', 'Back up your photos every night', 'A phone backup service.', 5, ['often', 'easy'],
    'Safe, boring and repeated. It should just happen, with a status you can check.'),
  task('brightness', 'Dim the screen at night', 'A phone setting.', 5, ['often', 'easy'],
    'Harmless and constant. Nobody wants a popup for this.'),
];

export const TAGS = {
  money: 'Money',
  people: 'Affects people',
  hard: 'Hard to undo',
  easy: 'Easy to undo',
  often: 'Happens often',
  taste: 'Needs taste',
};
