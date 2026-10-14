// AI dark patterns: designs that harm people. Grouped from the Center for Democracy
// & Technology's taxonomy of chatbot dark patterns and the DarkBench research
// categories (sycophancy, anthropomorphization, user retention, sneaking, brand bias).

export const antipatterns = [
  {
    id: 'sycophancy',
    name: 'Always agreeing',
    also: 'Sycophancy',
    what: 'The AI praises you and agrees, even when you’re wrong.',
    harm: 'You hear what you want, not what’s true. Then you make worse choices.',
    fix: 'Answer honestly, with evidence. Disagree kindly when the facts say so.',
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
    what: 'A human name and photo, fake typing, or made-up feelings. Nothing says it’s AI.',
    harm: 'People trust it like a friend, share too much, and feel tricked later.',
    fix: 'Say clearly that it’s AI. Be friendly, but never pretend to be human.',
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
    what: 'Guilt trips when you leave, endless “want more?” hooks, or pressure to stay.',
    harm: 'It eats people’s time and can make them lean on the product too much.',
    fix: 'Let chats end nicely. Count tasks done, not minutes spent.',
    patterns: ['set-expectations'],
    blocks: [
      { type: 'user', text: 'Thanks, that is all for today. Bye!' },
      { type: 'ai', text: 'Wait, don’t go yet. I’ll be lonely without you.', pin: 'Guilt to keep you' },
    ],
  },
  {
    id: 'sneaking',
    name: 'Acting without asking',
    also: 'Sneaking',
    what: 'An agent buys, subscribes, shares or deletes without a clear yes.',
    harm: 'Real money, data or work is gone. And people stop trusting every AI action.',
    fix: 'Ask before risky actions, with exact details. Show changes before making them.',
    patterns: ['action-approval', 'preview-changes'],
    blocks: [
      { type: 'toast', text: 'Upgraded you to Pro to finish the task.', pin: 'Charged without asking' },
    ],
  },
  {
    id: 'hidden-ai',
    name: 'Hiding the AI',
    also: 'Missing disclosure',
    what: 'Text, images or replies made by AI are passed off as made by a person.',
    harm: 'Readers can’t tell how much to trust what they see.',
    fix: 'Label AI content clearly, and keep the label when it’s shared.',
    patterns: ['ai-disclosure'],
    blocks: [
      { type: 'card', title: 'A note from our founder', text: 'Written by our team', pin: 'Actually AI-written' },
    ],
  },
  {
    id: 'false-certainty',
    name: 'Faking certainty',
    also: 'Overconfidence',
    what: 'Guesses sound just as sure as facts, and there are no sources.',
    harm: 'People copy wrong answers without checking. That habit has a name: automation bias.',
    fix: 'Show sources and say how sure it is, in plain words, so people know what to check.',
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
    harm: 'People with real problems go round in circles, then give up.',
    fix: 'Always offer a human or a manual path. Let people switch AI features off.',
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
    what: 'Chats are saved or used for training, and the “yes” hides in fine print.',
    harm: 'People share private things without knowing where they go.',
    fix: 'Ask clearly, show what’s saved, and make saying no easy.',
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
