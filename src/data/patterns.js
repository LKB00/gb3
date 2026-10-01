// All AI design patterns shown on the site.
// Each pattern has a matching live demo in src/demos (see `demo` key).

export const categories = [
  { id: 'input', name: 'Input', blurb: 'Help people ask the AI for the right thing.' },
  { id: 'output', name: 'Output', blurb: 'Show AI results in a clear, useful way.' },
  { id: 'control', name: 'Control', blurb: 'Keep the person in charge, not the AI.' },
  { id: 'trust', name: 'Trust', blurb: 'Be honest about what the AI knows and does.' },
  { id: 'feedback', name: 'Feedback', blurb: 'Learn from people and recover from mistakes.' },
];

export const patterns = [
  {
    id: 'prompt-starters',
    title: 'Prompt starters',
    category: 'input',
    summary: 'Show example prompts so people know what the AI can do.',
    problem:
      'An empty text box is scary. People do not know what to type, or what the AI is good at. Many leave without trying.',
    solution:
      'Show 3–5 short, clickable example prompts near the input. Pick examples that show the range of what the AI can do. One click fills the box.',
    when: [
      'First-time use, or an empty state',
      'The AI can do many different things',
      'Users are not experts at writing prompts',
    ],
    avoid: ['Expert tools where people already know what to ask', 'When examples would push everyone to the same answer'],
    dos: [
      'Make examples specific and real ("Summarize this PDF in 5 bullets")',
      'Show different kinds of tasks',
      'Let people edit the prompt after clicking',
    ],
    donts: [
      'Show 10+ starters — it becomes noise',
      'Use vague text like "Ask me anything"',
      'Auto-send the prompt without the user seeing it',
    ],
    examples: ['Chat assistants on their welcome screen', 'Design tools with "Try: make a landing page…"'],
    demo: 'PromptStarters',
  },
  {
    id: 'clarifying-questions',
    title: 'Ask before acting',
    category: 'input',
    summary: 'When the request is unclear, the AI asks a short question first.',
    problem:
      'Requests are often vague. If the AI guesses, it can waste time and produce the wrong thing, and the person must start over.',
    solution:
      'When key details are missing, the AI asks one short question with quick-pick answers. It only asks when the answer really changes the result.',
    when: ['The task is long or costly to redo', 'One missing detail changes the whole output'],
    avoid: ['Simple tasks — just do it', 'Asking many questions in a row (feels like a form)'],
    dos: [
      'Offer quick-pick chips plus a "something else" option',
      'Explain why you are asking, in a few words',
      'Allow "just guess" to skip',
    ],
    donts: ['Ask about things the AI could reasonably assume', 'Hide the question inside a long reply'],
    examples: ['Research agents that confirm scope before a long search', 'Image tools asking for style or size'],
    demo: 'ClarifyingQuestion',
  },
  {
    id: 'streaming-response',
    title: 'Show progress',
    category: 'output',
    summary: 'Stream the answer and show what the AI is doing while people wait.',
    problem:
      'AI can take many seconds. A blank screen or a plain spinner makes people think the app is broken.',
    solution:
      'Show the answer word by word as it is created. For long tasks, show the steps ("Reading files… Writing summary…"). Always allow stop.',
    when: ['Any answer that takes more than ~1 second', 'Multi-step tasks like search or agents'],
    avoid: ['When the half-finished result could be misleading (e.g. a number that changes)'],
    dos: [
      'Show steps in plain words',
      'Keep a Stop button visible while it runs',
      'Keep the page from jumping while text arrives',
    ],
    donts: ['Show a spinner with no words for a long task', 'Fake progress bars that do not match real work'],
    examples: ['Chat assistants typing their answer', 'Coding agents listing each step they take'],
    demo: 'StreamingResponse',
  },
  {
    id: 'multiple-variants',
    title: 'Offer options',
    category: 'output',
    summary: 'Give a few different results and let the person choose.',
    problem:
      'AI output is not one "right answer". A single result can feel like a take-it-or-leave-it guess.',
    solution:
      'Generate 2–4 different versions. Let people compare, pick one, or ask for more. Make the differences easy to see.',
    when: ['Creative work: titles, images, copy, layouts', 'Taste matters more than correctness'],
    avoid: ['Factual questions — different answers reduce trust', 'Slow or costly generations'],
    dos: ['Make versions truly different', 'Label them (A, B, C) so people can talk about them', 'Offer "more like this"'],
    donts: ['Show 10 near-identical options', 'Force people to pick before they can continue'],
    examples: ['Image generators showing a grid of 4', 'Writing tools with "shorter / friendlier / formal"'],
    demo: 'MultipleVariants',
  },
  {
    id: 'editable-output',
    title: 'Editable output',
    category: 'control',
    summary: 'Treat AI output as a draft that people can change.',
    problem:
      'AI is often 80% right. If people can only accept or regenerate, they lose the good parts to fix a small part.',
    solution:
      'Put the result in an editable place. Let people change it directly, or select a part and ask the AI to change only that part.',
    when: ['Text, code, designs, emails — anything people will use', 'Output is close but not perfect'],
    avoid: ['Read-only answers like quick facts'],
    dos: ['Make it clear the output is a draft', 'Allow "rewrite only this part"', 'Keep version history'],
    donts: ['Regenerate everything to fix one word', 'Lose user edits when AI updates'],
    examples: ['Docs tools with "rewrite selection"', 'Email drafts you can edit before sending'],
    demo: 'EditableOutput',
  },
  {
    id: 'inline-suggestions',
    title: 'Suggest, don\'t force',
    category: 'control',
    summary: 'Show AI ideas as light suggestions that people accept on purpose.',
    problem:
      'If AI changes things on its own, people feel they lost control and do not trust the result.',
    solution:
      'Show suggestions in a light, "ghost" style. People press a key or click to accept. Ignoring it is the default.',
    when: ['While people type or edit', 'Small, frequent helps (next word, next line, a fix)'],
    avoid: ['Big changes — use a review step instead'],
    dos: ['Make suggestion style clearly different from real content', 'Use a simple accept key (Tab)', 'Easy to ignore'],
    donts: ['Auto-apply suggestions', 'Block typing while a suggestion loads'],
    examples: ['Code editors with ghost text', 'Email apps with smart compose'],
    demo: 'InlineSuggestion',
  },
  {
    id: 'stop-and-undo',
    title: 'Stop & undo',
    category: 'control',
    summary: 'People can stop the AI at any time and undo what it did.',
    problem:
      'AI can go in the wrong direction or make a change people did not want. Without a way out, it feels risky to use.',
    solution:
      'Always show a Stop button while the AI works. After it acts, offer a clear Undo. For risky actions, ask for a confirm first.',
    when: ['Any AI that changes data, files or sends things', 'Long-running tasks'],
    avoid: ['Rarely — this fits almost every AI feature'],
    dos: ['Keep partial work when stopped', 'Show exactly what will be undone', 'Confirm before actions that cannot be undone'],
    donts: ['Hide Stop in a menu', 'Make Undo disappear too fast'],
    examples: ['Chat apps with a Stop button', 'Agents asking "Apply these 3 changes?"'],
    demo: 'StopAndUndo',
  },
  {
    id: 'citations',
    title: 'Show sources',
    category: 'trust',
    summary: 'Link each claim to where it came from, so people can check.',
    problem: 'AI can sound confident and still be wrong. People cannot tell what is true.',
    solution:
      'Add small numbered citations next to claims. Hover or tap to see the source text. Make it easy to open the original.',
    when: ['Answers built on documents, web pages or data', 'Facts that matter (health, money, work)'],
    avoid: ['Pure creative writing with no source'],
    dos: ['Place the citation right next to the claim', 'Show a quote preview from the source', 'Say when there is no source'],
    donts: ['Put one long source list at the bottom only', 'Cite sources that do not support the claim'],
    examples: ['AI search engines', 'Assistants that answer from your company docs'],
    demo: 'Citations',
  },
  {
    id: 'confidence-signals',
    title: 'Show uncertainty',
    category: 'trust',
    summary: 'Tell people how sure the AI is, in plain words.',
    problem:
      'When every answer looks equally sure, people either trust everything or nothing.',
    solution:
      'Show confidence in simple language ("Likely", "Not sure") and highlight the parts that need a human check.',
    when: ['Data extraction, classification, predictions', 'People need to decide what to review'],
    avoid: ['Showing exact percentages that people will over-read (e.g. "87.3%")'],
    dos: ['Use words + color, not color only', 'Point to what to check', 'Let people filter to "needs review"'],
    donts: ['Show confidence that is not real or not calibrated', 'Use red for everything'],
    examples: ['Invoice scanners marking unclear fields', 'Transcripts that mark unclear words'],
    demo: 'ConfidenceSignals',
  },
  {
    id: 'ai-disclosure',
    title: 'Label AI content',
    category: 'trust',
    summary: 'Make it clear what was made by AI and what was made by a person.',
    problem:
      'If people cannot tell AI content from human content, they may be misled, and trust drops when they find out.',
    solution:
      'Add a small, consistent label or icon to AI-made content. Keep it visible after copy, share or export when possible.',
    when: ['Content seen by others (posts, emails, images)', 'Mixed human + AI documents'],
    avoid: ['Huge warnings that block the content'],
    dos: ['Use one consistent icon across the product', 'Show "AI draft — edited by you" when people change it', 'Explain on hover'],
    donts: ['Hide the label in small grey text', 'Remove the label quietly when shared'],
    examples: ['Social platforms with "AI generated" tags', 'Docs with an AI sparkle icon on generated blocks'],
    demo: 'AiDisclosure',
  },
  {
    id: 'feedback-loop',
    title: 'Ask for feedback',
    category: 'feedback',
    summary: 'Let people rate results quickly and say what was wrong.',
    problem:
      'The team does not know when the AI fails. Users have no way to say "this is wrong" without leaving.',
    solution:
      'Add thumbs up / down on each result. On "down", show a few quick reasons and an optional text box. Thank people and, when possible, fix it right away.',
    when: ['Any AI output', 'You want to improve the model or the prompt over time'],
    avoid: ['Pop-up surveys that interrupt the task'],
    dos: ['Keep it one click', 'Offer quick reasons as chips', 'Offer "try again" after negative feedback'],
    donts: ['Ask for a long form', 'Show feedback buttons louder than the result'],
    examples: ['Chat assistants with thumbs on each answer', 'Search results with "Was this helpful?"'],
    demo: 'FeedbackLoop',
  },
  {
    id: 'graceful-errors',
    title: 'Helpful errors',
    category: 'feedback',
    summary: 'When the AI cannot help, say why and show a next step.',
    problem:
      'AI fails in new ways: it refuses, times out, or does not know. "Something went wrong" leaves people stuck.',
    solution:
      'Explain the problem in plain words, keep the user\'s input, and offer a clear next step: retry, rephrase, or do it by hand.',
    when: ['Timeouts, limits, blocked topics, missing data'],
    avoid: ['Pretending to succeed when the AI did not'],
    dos: ['Keep the user\'s text so they do not retype', 'Offer 1–2 concrete next steps', 'Use a calm, human tone'],
    donts: ['Show raw error codes', 'Blame the user'],
    examples: ['"I couldn\'t read that file — try a PDF under 20 MB"', 'Fallback to manual mode when AI is down'],
    demo: 'GracefulErrors',
  },
];

export const getPattern = (id) => patterns.find((p) => p.id === id);
export const getCategory = (id) => categories.find((c) => c.id === id);
