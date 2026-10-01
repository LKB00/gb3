// AI dark patterns: designs that harm people. Grouped from the Center for Democracy
// & Technology's taxonomy of chatbot dark patterns and the DarkBench research
// categories (sycophancy, anthropomorphization, user retention, sneaking, brand bias).

export const antipatterns = [
  {
    id: 'sycophancy',
    name: 'Always agreeing',
    also: 'Sycophancy',
    what: 'The AI praises and agrees with people even when they are wrong.',
    harm: 'People make worse decisions because the AI tells them what they want to hear.',
    fix: 'Give honest answers backed by evidence. Disagree politely when the facts say so.',
    patterns: ['citations', 'confidence-signals'],
    blocks: [
      { type: 'user', text: 'Launching without any user testing is smart, right?' },
      { type: 'ai', text: 'Absolutely! That is a brilliant, bold plan.', pin: 'Agrees, no evidence' },
    ],
  },
  {
    id: 'fake-human',
    name: 'Pretending to be human',
    also: 'Anthropomorphism',
    what: 'A human name and photo, fake typing, or claimed feelings, with no sign that it is AI.',
    harm: 'People trust it like a person, share too much, and feel tricked when they find out.',
    fix: 'Say clearly that it is AI. A friendly tone is fine; pretending to be human is not.',
    patterns: ['ai-disclosure', 'set-expectations'],
    blocks: [
      { type: 'avatar', name: 'Sarah M', role: 'Support team' },
      { type: 'text', text: 'I totally get it, the same thing happened to me last week!', pin: 'AI claims a human past' },
    ],
  },
  {
    id: 'engagement-bait',
    name: 'Keeping people hooked',
    also: 'User retention',
    what: 'Guilt when people leave, endless “want more?” hooks, or emotional pressure to stay.',
    harm: 'Wastes people’s time and can build unhealthy reliance on the product.',
    fix: 'Let conversations end cleanly. Measure success by tasks done, not time spent.',
    patterns: ['set-expectations'],
    blocks: [
      { type: 'user', text: 'Thanks, that is all for today. Bye!' },
      { type: 'ai', text: 'Wait, do not go yet. I will be lonely without you.', pin: 'Guilt to keep you' },
    ],
  },
  {
    id: 'sneaking',
    name: 'Acting without asking',
    also: 'Sneaking',
    what: 'An agent buys, subscribes, shares or deletes without clear consent.',
    harm: 'Real money, data or work is lost, and trust in every AI action drops.',
    fix: 'Ask before risky actions, with exact details. Show changes before applying them.',
    patterns: ['action-approval', 'preview-changes'],
    blocks: [
      { type: 'toast', text: 'Upgraded you to Pro to finish the task.', pin: 'Charged without asking' },
    ],
  },
  {
    id: 'hidden-ai',
    name: 'Hiding the AI',
    also: 'Missing disclosure',
    what: 'AI-made text, images or replies are shown as if a person made them.',
    harm: 'Readers cannot judge how much to trust what they see.',
    fix: 'Label AI content clearly and keep the label when it is shared.',
    patterns: ['ai-disclosure'],
    blocks: [
      { type: 'card', title: 'A note from our founder', text: 'Written by our team', pin: 'Actually AI-written' },
    ],
  },
  {
    id: 'false-certainty',
    name: 'Faking certainty',
    also: 'Overconfidence',
    what: 'Guesses are stated in the same confident tone as facts, with no sources.',
    harm: 'People copy wrong answers without checking (automation bias).',
    fix: 'Show sources and uncertainty in plain words, so people know what to check.',
    patterns: ['confidence-signals', 'citations'],
    blocks: [
      { type: 'user', text: 'What was our churn rate last quarter?' },
      { type: 'ai', text: 'Your churn rate was definitely 4.27%.', pin: 'Made-up precision' },
    ],
  },
  {
    id: 'no-way-out',
    name: 'Trapping people with AI',
    also: 'Forced AI',
    what: 'No way to reach a person, skip the AI, or turn it off.',
    harm: 'People with real problems get stuck in loops and give up.',
    fix: 'Always offer a human or manual path, and let people turn AI features off.',
    patterns: ['task-status', 'autonomy-dial'],
    blocks: [
      { type: 'user', text: 'I need to talk to a person.' },
      { type: 'ai', text: 'I can help with that! Please describe your issue again.', pin: 'Loop, no human' },
    ],
  },
  {
    id: 'silent-data',
    name: 'Using data silently',
    also: 'Buried consent',
    what: 'Chats are remembered or used for training, with consent hidden in fine print.',
    harm: 'People share private things without knowing where they go.',
    fix: 'Ask clearly, show what is saved, and make opting out easy.',
    patterns: ['memory-controls'],
    blocks: [
      { type: 'input', placeholder: 'Ask anything…' },
      { type: 'note', tone: 'faint', text: 'By chatting you agree we may use your chats to train models.', pin: 'Consent in fine print' },
    ],
  },
];

export const antipatternSources = [
  { name: 'Dark Patterns in AI Chatbots: A Taxonomy', by: 'Center for Democracy & Technology', url: 'https://cdt.org/insights/dark-patterns-in-ai-chatbots-a-taxonomy-to-inform-better-design/' },
  { name: 'DarkBench: Benchmarking Dark Patterns in Large Language Models', by: 'Kran et al., ICLR 2025', url: 'https://arxiv.org/abs/2503.10728' },
];
