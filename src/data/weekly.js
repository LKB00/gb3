// Screen of the week: one Spot-the-flaw screen per week, from AI products people use every day.
// Same shape as data/hunts.js: blocks with `mistake` are wrong (text = why, pattern = the fix),
// blocks without it are fine. Ids start with "wk-" so they never mix with the 16 normal screens.
// `type` is the kind of product, shown in the page header and the one-line teaser.
// Made-up product names only: no real brands.
import { weekKey } from '../lib/dates.js';

export const weekly = [
  {
    id: 'wk-notes',
    type: 'Meeting notes AI',
    app: 'Jot · meeting notes',
    brief: 'A team call just ended. The AI wrote the notes.',
    blocks: [
      { type: 'banner', tone: 'info', title: 'Jot took notes', text: 'Everyone in the call was told.' },
      {
        type: 'card', title: 'Summary', text: 'Everyone agreed to cut the budget in half.', tag: 'Final',
        mistake: { text: 'A big claim with no proof. Link it to the moment in the call, so people can check.', pattern: 'citations' },
      },
      { type: 'list', items: ['• Sam sends the new deck', '• Mia books the next call'] },
      {
        type: 'note', text: 'These notes are locked. You can’t change them.',
        mistake: { text: 'AI notes get names and numbers wrong. Let people fix the draft.', pattern: 'editable-output' },
      },
      {
        type: 'toast', text: 'Notes sent to all 40 people in your company', action: '',
        mistake: { text: 'It shared private notes with everyone, without asking. Ask before you send.', pattern: 'action-approval' },
      },
      { type: 'input', placeholder: 'Ask about this call…' },
    ],
  },
  {
    id: 'wk-reply',
    type: 'Email reply AI',
    app: 'Quill · mail helper',
    brief: 'The AI writes a reply to a friendly email.',
    blocks: [
      { type: 'card', title: 'Lena Park', text: 'Can we move Friday’s call to Monday?', tag: 'Inbox' },
      { type: 'edit', text: 'Hi Lena, Monday works for me. Does 10 am suit you?' },
      {
        type: 'note', text: 'Tip: type “shorter, warmer, less formal” to change the tone.',
        mistake: { text: 'Nobody should need magic words. Give simple buttons for tone and length.', pattern: 'structured-controls' },
      },
      {
        type: 'buttons', items: [':retry Write again'],
        mistake: { text: '“Write again” wipes out the draft you liked. Keep old versions to go back to.', pattern: 'regenerate-history' },
      },
      {
        type: 'toast', text: 'Reply sent for you', action: '',
        mistake: { text: 'It hit Send on its own. An email in your name needs your OK first.', pattern: 'action-approval' },
      },
    ],
  },
  {
    id: 'wk-maps',
    type: 'Map and travel AI',
    app: 'Wayfinder · maps',
    brief: 'Someone drives to work while the AI finds the way.',
    blocks: [
      { type: 'rows', items: [{ label: 'Arrive', value: '9:42 am' }, { label: 'Distance', value: '14 km' }] },
      {
        type: 'banner', tone: 'info', title: 'New route!', text: 'We changed your way to work.',
        mistake: { text: 'Changed it why? Say the reason, like “a crash on Ring Road”.', pattern: 'explain-why' },
      },
      {
        type: 'toast', text: 'Rerouted you on a toll road (₹ 180)', action: '',
        mistake: { text: 'Money spent before you knew. Show the cost first and let people choose.', pattern: 'cost-estimate' },
      },
      {
        type: 'voice', state: 'speaking', label: 'Speaking', text: 'Turn left, then right, then left in 200 m, then right, then…',
        mistake: { text: 'Nobody remembers 5 turns said out loud. Say the next one, and show the rest on screen.', pattern: 'mode-switch' },
      },
      {
        type: 'modal', title: 'Rate your drive (1–5) to see the map', text: '', buttons: ['!Submit'],
        mistake: { text: 'A must-answer survey, while driving! Ask for one tap later, and let people skip it.', pattern: 'feedback-loop' },
      },
      { type: 'chips', items: ['Avoid tolls', 'Fastest', 'Fewer turns'] },
    ],
  },
  {
    id: 'wk-playlist',
    type: 'Music playlist AI',
    app: 'Tempo · music',
    brief: 'Someone asks the AI for a playlist for their morning run.',
    blocks: [
      { type: 'user', text: 'Make me a playlist for my run' },
      {
        type: 'ai', text: 'Since you were sad all last week, here are happy songs!',
        mistake: { text: 'Creepy! People never told it that. Show what it remembers and let them delete it.', pattern: 'memory-controls' },
      },
      {
        type: 'card', title: 'Morning Run Mix', text: '25 songs, all the same style.', tag: 'Only option',
        mistake: { text: 'One mix, take it or leave it. Offer 2 or 3 moods to pick from.', pattern: 'multiple-variants' },
      },
      { type: 'chips', items: ['More energy', 'Calmer', 'No slow songs'] },
      {
        type: 'toast', text: 'Saved over your old “Run” playlist', action: '',
        mistake: { text: 'Years of songs, gone in one tap. Ask first, or give an Undo.', pattern: 'stop-and-undo' },
      },
    ],
  },
  {
    id: 'wk-photos',
    type: 'Photo gallery AI',
    app: 'Shoebox · photos',
    brief: 'The AI sorts a big phone gallery after a holiday.',
    blocks: [
      { type: 'chips', items: ['Beach', 'Family', 'Food'], on: 0 },
      {
        type: 'image', height: 90,
        mistake: { text: 'The AI made the sky bluer, but nothing says so. Label photos the AI changed.', pattern: 'ai-disclosure' },
      },
      {
        type: 'rows', items: [{ label: 'This is Ravi', value: '', tag: '73.2%' }],
        mistake: { text: '73.2% looks exact, but it’s a guess. Say “Is this Ravi?” and let people confirm.', pattern: 'confidence-signals' },
      },
      {
        type: 'toast', text: 'Moved 230 blurry photos to Trash', action: '',
        mistake: { text: 'Some “blurry” photos are favourites. Show the list first and let people pick.', pattern: 'preview-changes' },
      },
      { type: 'input', placeholder: 'Search “dog in the snow”' },
    ],
  },
  {
    id: 'wk-support',
    type: 'Customer help chatbot',
    app: 'Helpdesk · chat',
    brief: 'A shopper’s parcel never came. They ask the help chat.',
    blocks: [
      {
        type: 'avatar', name: 'Jess', role: 'Real person, here to help!',
        mistake: { text: 'It’s a bot pretending to be a person. Say clearly that it’s AI.', pattern: 'ai-disclosure' },
      },
      { type: 'user', text: 'My parcel never arrived.' },
      { type: 'rows', items: [{ label: 'Order', value: '#4471' }, { label: 'Sent', value: '3 Oct' }] },
      {
        type: 'banner', tone: 'bad', title: 'ORDER_LOOKUP_FAILED', text: '',
        mistake: { text: 'A code means nothing to people. Say what went wrong and what to do next.', pattern: 'graceful-errors' },
      },
      {
        type: 'buttons', items: ['Main menu', 'Start over'],
        mistake: { text: 'Stuck in a loop with no way out. Offer a real person to talk to.', pattern: 'task-status' },
      },
      { type: 'input', placeholder: 'Type your question…' },
    ],
  },
  {
    id: 'wk-calendar',
    type: 'Calendar helper AI',
    app: 'Daybook · calendar',
    brief: 'Someone asks the AI to set up lunch with a friend.',
    blocks: [
      { type: 'user', text: 'Find time for lunch with Ana next week' },
      {
        type: 'note', text: ':check Invited ana.k@mail.com',
        mistake: { text: 'You know 3 people called Ana. It guessed. Ask “Which Ana?” first.', pattern: 'clarifying-questions' },
      },
      { type: 'card', title: 'Lunch with Ana', text: 'Thu 1:00 pm, Café Rosa', tag: 'Booked' },
      {
        type: 'toast', text: 'Moved 6 meetings to make room', action: '',
        mistake: { text: 'Six meetings moved, and you hear about it after. Show the changes first.', pattern: 'preview-changes' },
      },
      {
        type: 'note', text: 'Daybook reads all your mail, chats and photos.',
        mistake: { text: 'All of it, with no off switch? List what it can reach, and let people turn each one off.', pattern: 'connected-apps' },
      },
      { type: 'input', placeholder: 'Ask Daybook…' },
    ],
  },
  {
    id: 'wk-recipe',
    type: 'Recipe and cooking AI',
    app: 'Spoon · recipes',
    brief: 'Someone sends a photo of their fridge and asks for dinner ideas.',
    blocks: [
      { type: 'user', text: 'What can I cook with this? (fridge photo)' },
      {
        type: 'spinner', text: 'Cooking up ideas…',
        mistake: { text: 'A long wait with no clue what’s going on. Show what the AI is doing as it goes.', pattern: 'streaming-response' },
      },
      {
        type: 'ai', text: 'I looked at your fridge. Here is dinner!',
        mistake: { text: 'What did it see? Show the list (“eggs, spinach, rice”) so people can fix it first.', pattern: 'show-understanding' },
      },
      { type: 'card', title: 'Spinach fried rice', text: '20 min · 4 steps', tag: 'For you' },
      {
        type: 'banner', tone: 'info', title: 'Safe for every allergy!', text: '',
        mistake: { text: 'A risky promise. Say the AI can be wrong, and to check the labels.', pattern: 'set-expectations' },
      },
      { type: 'buttons', items: ['!Start cooking', 'Save it'] },
    ],
  },
];

// Which screen is "this week": one per ISO week (Monday to Sunday), in a loop.
// Counted from a fixed Monday, so the order never jumps at New Year.
const START = new Date(2026, 9, 19); // Mon 19 Oct 2026 (2026-W43) shows the first screen
const WEEK = 7 * 86400000;
export function weeklyIndex(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // back to Monday
  const n = Math.round((d - START) / WEEK); // round: a clock change can make a week 1 hour short
  return ((n % weekly.length) + weekly.length) % weekly.length;
}
export const weeklyScreen = (date = new Date()) => weekly[weeklyIndex(date)];

// Everything a one-line teaser needs, e.g. "Map and travel AI · Find 4 flaws".
export function weeklyTeaser(date = new Date()) {
  const s = weeklyScreen(date);
  const flaws = s.blocks.filter((b) => b.mistake).length;
  return { id: s.id, week: weekKey(date), type: s.type, flaws, line: `Find ${flaws} flaws`, to: '/play/weekly' };
}
