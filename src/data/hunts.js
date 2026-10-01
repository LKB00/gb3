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
];
