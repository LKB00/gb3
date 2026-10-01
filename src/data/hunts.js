// Mistake Hunt scenarios: realistic AI screens with hidden mistakes.
// Blocks with `mistake` are wrong (text = why, pattern = the fix).
// Blocks without it are fine — clicking them says so.

export const hunts = [
  {
    id: 'chat',
    title: 'Research chat assistant',
    app: 'Max · research AI',
    brief: 'A team uses this AI to ask questions about their user research.',
    blocks: [
      {
        type: 'banner', tone: 'info', title: 'Meet Max', text: 'The AI that knows everything!',
        mistake: { text: 'Over-promise. Say what it is good at, and that it can be wrong.', pattern: 'set-expectations' },
      },
      { type: 'user', text: 'What did users say about the new checkout?' },
      {
        type: 'ai', text: 'Users love the new checkout, and conversion went up 40%.',
        mistake: { text: 'A big claim with no source. Add citations next to claims.', pattern: 'citations' },
      },
      {
        type: 'buttons', items: [':retry Regenerate'],
        mistake: { text: 'Regenerate throws the old answer away. Keep versions ‹ 1/2 ›.', pattern: 'regenerate-history' },
      },
      {
        type: 'modal', title: 'Rate this chat (1–10) to continue', text: '', buttons: ['!Submit'],
        mistake: { text: 'A forced survey blocks the task. Use one-click thumbs up / down instead.', pattern: 'feedback-loop' },
      },
      { type: 'input', placeholder: 'Ask Max…' },
    ],
  },
  {
    id: 'agent',
    title: 'Design-file cleanup agent',
    app: 'Tidy · AI agent',
    brief: 'An AI agent cleans up a big design file for a designer.',
    blocks: [
      { type: 'user', text: 'Tidy up my design file' },
      {
        type: 'steps', items: [{ label: 'Step 3 of 38: Deleting unused components', state: 'active' }],
        mistake: { text: 'A 38-step task started with no plan to review first.', pattern: 'plan-first' },
      },
      {
        type: 'spinner', text: 'Please keep this tab open (12 min)',
        mistake: { text: 'Locks the person in. Run it in the background with a status.', pattern: 'task-status' },
      },
      { type: 'rows', items: [{ label: 'Layers renamed', value: '24' }, { label: 'Styles created', value: '6' }] },
      {
        type: 'toast', text: 'Deleted 112 components', action: '',
        mistake: { text: 'Deleted with no confirm and no undo.', pattern: 'stop-and-undo' },
      },
      {
        type: 'note', text: 'Your file was improved.',
        mistake: { text: 'Improved how? Show what changed (before → after).', pattern: 'preview-changes' },
      },
    ],
  },
  {
    id: 'invoice',
    title: 'Invoice scanner',
    app: 'Ledger · AI scan',
    brief: 'A finance app reads invoices with AI and pays them.',
    blocks: [
      { type: 'card', title: 'invoice-0912.pdf', text: 'Uploaded 2 min ago', tag: 'Scanned' },
      {
        type: 'rows',
        items: [
          { label: 'Vendor', value: 'Pixel Studio', tag: '98.7%' },
          { label: 'Total', value: '₹ 48,500', tag: '61.4%' },
        ],
        mistake: { text: 'Exact percents are fake precision. Use "Sure / Check this" words.', pattern: 'confidence-signals' },
      },
      {
        type: 'banner', tone: 'bad', title: 'Error 422', text: 'Tax ID invalid.',
        mistake: { text: 'An error code with no next step. Say what to do.', pattern: 'graceful-errors' },
      },
      {
        type: 'toast', text: 'Auto-approved and paid ₹ 48,500', action: '',
        mistake: { text: 'Paid money without asking, even though the total was unsure.', pattern: 'action-approval' },
      },
      { type: 'buttons', items: ['Download PDF', 'Share'] },
    ],
  },
  {
    id: 'feed',
    title: 'Team social feed',
    app: 'Teamspace',
    brief: 'A team app with AI-written posts and AI recommendations.',
    blocks: [
      {
        type: 'avatar', name: 'Ravi M', role: 'Design lead',
        mistake: { text: 'This post was written by AI, but there is no label.', pattern: 'ai-disclosure' },
      },
      { type: 'text', text: 'Thrilled to share our Q3 design wins — synergy, innovation and impact!' },
      { type: 'buttons', items: [':up 12', 'Comment'] },
      {
        type: 'ai', text: 'Since your divorce last year, here are some solo events nearby…',
        mistake: { text: 'Uses a private memory the person never knew was saved.', pattern: 'memory-controls' },
      },
      {
        type: 'card', title: 'Recommended: Leadership 101', text: 'Match score: 0.92', tag: 'For you',
        mistake: { text: 'A score is not a reason. Show 2 plain reasons.', pattern: 'explain-why' },
      },
    ],
  },
  {
    id: 'image',
    title: 'AI image generator',
    app: 'Pixa · image AI',
    brief: 'A tool where marketers create images with AI.',
    blocks: [
      {
        type: 'note', text: 'Ask me anything!',
        mistake: { text: 'Vague. Show 3 specific example prompts instead.', pattern: 'prompt-starters' },
      },
      {
        type: 'input', value: 'photo, 4k, ultra detailed, soft light, 16:9, --style raw --v 6 --no text',
        mistake: { text: '"Prompt magic". Offer style and size controls instead.', pattern: 'structured-controls' },
      },
      { type: 'chips', items: [':file brand-guide.pdf'], on: null },
      {
        type: 'variants', items: ['Red mug', 'Red mug.', 'A red mug', 'Red mug 2', 'Mug, red', 'Red cup'],
        mistake: { text: 'Six near-copies. Show 3 truly different options.', pattern: 'multiple-variants' },
      },
      { type: 'buttons', items: ['!Use A', 'More like A'] },
    ],
  },
  {
    id: 'coding-agent',
    title: 'AI coding agent',
    app: 'Forge · coding agent',
    brief: 'A developer asks an agent to upgrade a project’s libraries.',
    blocks: [
      { type: 'user', text: 'Upgrade all our libraries to the latest versions.' },
      {
        type: 'toggle', label: 'Agent mode: Full auto (all projects)', on: true,
        mistake: { text: 'One “full auto” switch for everything. Let people set freedom per task, starting low.', pattern: 'autonomy-dial' },
      },
      {
        type: 'buttons', items: ['-Cancel (discards work)'],
        mistake: { text: 'The only way to stop throws work away. Offer Pause that keeps progress.', pattern: 'interrupt-redirect' },
      },
      { type: 'steps', items: [{ label: 'Updated 14 of 40 packages', state: 'done' }, { label: 'Running tests', state: 'active' }] },
      {
        type: 'toast', text: 'Used 2,400 credits. 100 left this month.', action: '',
        mistake: { text: 'The cost appears only afterwards. Show an estimate before starting.', pattern: 'cost-estimate' },
      },
      {
        type: 'note', text: 'Task complete. 212 actions taken.',
        mistake: { text: 'No record of what changed and no undo. Keep a readable log with restore points.', pattern: 'action-log' },
      },
    ],
  },
  {
    id: 'voice-assistant',
    title: 'Voice shopping assistant',
    app: 'Homey · voice assistant',
    brief: 'A smart display where people shop and manage their home by voice.',
    blocks: [
      {
        type: 'voice', state: 'idle', label: '…',
        mistake: { text: 'No listening state. People cannot tell if they are being heard. Show who is talking.', pattern: 'voice-turn-taking' },
      },
      { type: 'user', text: 'Order more of the oat milk I usually get' },
      {
        type: 'voice', state: 'speaking', label: 'Speaking', text: 'I found nine options. Option one, Oatly Barista, one litre, three ninety-nine. Option two…',
        mistake: { text: 'A long list read aloud. Say a short summary and show the options on screen.', pattern: 'mode-switch' },
      },
      {
        type: 'toast', text: 'Ordered 12 × Oat milk 1L for $47.88', action: '',
        mistake: { text: 'Ordered without reading back the item, quantity and price. Read it back and wait for a yes.', pattern: 'read-back' },
      },
      { type: 'chips', items: ['Track order', 'Reorder'] },
      {
        type: 'note', text: 'Please wait until I finish speaking.', tone: 'warn',
        mistake: { text: 'People cannot interrupt. Stop speaking the moment the person talks.', pattern: 'voice-turn-taking' },
      },
    ],
  },
  {
    id: 'meeting-notes',
    title: 'AI meeting notes',
    app: 'Notely · meeting AI',
    brief: 'An AI joins video calls and writes the notes for the team.',
    blocks: [
      {
        type: 'note', text: 'Recording and taking notes',
        mistake: { text: 'Other people in the call aren’t told an AI is listening. Say it to everyone, clearly.', pattern: 'ai-disclosure' },
      },
      { type: 'card', title: 'Decisions', text: 'Launch moves to 14 Nov. Priya owns the beta.' },
      {
        type: 'list', items: ['• Ravi will fix the pricing page', '• Budget approved: ₹40 lakh'],
        mistake: { text: 'A big number, stated as fact. Flag what the AI isn’t sure it heard right.', pattern: 'confidence-signals' },
      },
      {
        type: 'toast', text: 'Notes sent to all 48 attendees',
        mistake: { text: 'Shared automatically, before anyone could check. Ask first.', pattern: 'action-approval' },
      },
      { type: 'buttons', items: ['Edit notes', 'Copy'] },
      {
        type: 'note', text: 'Notely remembers everything said in your meetings.',
        mistake: { text: 'Memory with no controls. Show what it keeps and let people delete it.', pattern: 'memory-controls' },
      },
    ],
  },
  {
    id: 'browser-agent',
    title: 'Browser shopping agent',
    app: 'Runner · browser agent',
    brief: 'An AI agent buys things online by using the browser for you.',
    blocks: [
      { type: 'user', text: 'Buy a birthday gift for my sister, under ₹3,000' },
      {
        type: 'modal', title: 'Allow Runner to control your computer?', text: 'All apps and sites.', buttons: ['No', '!Allow'],
        mistake: { text: 'Asks for everything at once. Ask per site, for this task only.', pattern: 'screen-control' },
      },
      { type: 'steps', items: [{ label: 'Searching 3 shops', state: 'done' }, { label: 'Comparing 12 gifts', state: 'active' }] },
      {
        type: 'note', text: 'Typing your saved password for shop.com…',
        mistake: { text: 'Agents shouldn’t handle passwords. Hand control back for logins.', pattern: 'screen-control' },
      },
      {
        type: 'toast', text: 'Bought: smart mug, ₹2,950',
        mistake: { text: 'Paid without a final check. Stop at checkout and let the person decide.', pattern: 'action-approval' },
      },
      { type: 'rows', items: [{ label: 'Delivery', value: 'Fri, 14 Nov' }] },
    ],
  },
  {
    id: 'photo-editor',
    title: 'AI photo editor',
    app: 'Lumo · photo AI',
    brief: 'A phone app that edits photos when you describe the change.',
    blocks: [
      { type: 'image', height: 90, sel: [55, 20, 30, 45], selLabel: 'Selected' },
      {
        type: 'input', value: 'make it better',
        mistake: { text: 'A blank box with no ideas. Offer quick edit chips people can tap.', pattern: 'prompt-starters' },
      },
      {
        type: 'note', text: 'Edit applied to your original photo',
        mistake: { text: 'Overwrote the original. Keep it and show before → after.', pattern: 'preview-changes' },
      },
      {
        type: 'buttons', items: [':retry Try again'],
        mistake: { text: 'Each try replaces the last. Keep versions people can flip between.', pattern: 'regenerate-history' },
      },
      { type: 'chips', items: ['Brighter', 'Remove background', 'Warmer'] },
      {
        type: 'buttons', items: ['!Share'],
        mistake: { text: 'Shared AI-edited photos carry no label. Mark AI edits.', pattern: 'ai-disclosure' },
      },
    ],
  },
];
