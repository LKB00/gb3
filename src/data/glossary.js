// Plain-English AI terms for designers: one easy sentence, an everyday example, and why it matters for design.
// `patterns` (optional): ids of the cards that put the word into practice (shown as chips, checked by `npm run validate`).
export const glossary = [
  { term: 'Agent', def: 'An AI that does a job in several steps on its own. Ask it to book dinner, and it finds, picks and books a table.', design: 'It needs plans, approvals, a log and undo, not just a chat box.', patterns: ['plan-first', 'action-log', 'interrupt-redirect'] },
  { term: 'Autonomy level', def: 'How much the AI does without asking you. From “here’s an idea” to “already done”.', design: 'Start low, and let people pick the level for each task.', patterns: ['autonomy-dial', 'action-approval'] },
  { term: 'Calibration', def: 'How well the AI’s confidence matches how often it’s right. If an app says “70% sure”, it should be right about 7 times in 10.', design: 'Only show confidence if it’s calibrated. If not, it misleads.', patterns: ['confidence-signals'] },
  { term: 'Context window', def: 'How much the AI can read at once: the chat, files and instructions. Think of a desk: only so much fits on it.', design: 'Tell people when their input was too long and got cut.', patterns: ['visible-context'] },
  { term: 'Evals', def: 'Tests that check how well an AI feature does on real examples. A driving test, but for a feature.', design: 'Designers can write the examples that define “good”.' },
  { term: 'Fine-tuning', def: 'Extra training that teaches a model one task or style. Like a chef who learns one cuisine really well.', design: 'It shapes tone and behavior, so design should help pick the examples.' },
  { term: 'Grounding', def: 'Making the AI answer from real sources, like your documents, not only its memory. An open-book test instead of a closed one.', design: 'It makes sources possible. Show which ones were used.', patterns: ['citations'] },
  { term: 'Guardrails', def: 'Rules that stop the AI from doing harmful or off-topic things. Like the bumpers in a bowling lane.', design: 'When a guardrail blocks something, say why in plain words.', patterns: ['graceful-errors', 'set-expectations'] },
  { term: 'Hallucination', def: 'When the AI says something made-up as if it were true. Like a confident friend who invents a movie quote.', design: 'Design for checking: sources, shown doubt and easy fixes.', patterns: ['citations', 'confidence-signals'] },
  { term: 'Human in the loop', def: 'A person checks or approves the AI’s work at key moments. Like a manager who signs off before money goes out.', design: 'Put the check where the risk is, not on every step.', patterns: ['action-approval', 'preview-changes'] },
  { term: 'Latency', def: 'How long the AI takes to answer. The quiet gap between asking and seeing anything.', design: 'Stream the answer and show steps, so the wait feels shorter.', patterns: ['streaming-response', 'task-status'] },
  { term: 'Memory', def: 'Things the AI remembers about you between chats. Like a barista who knows your usual order.', design: 'Show what’s saved and let people delete it.', patterns: ['memory-controls'] },
  { term: 'Model', def: 'The trained AI behind a product. The engine under the hood.', design: 'Models trade off speed, cost and quality.' },
  { term: 'Multimodal', def: 'An AI that handles more than text: pictures, voice, files or video. Show it your fridge and ask what to cook.', design: 'Show what it saw or heard before it acts.', patterns: ['show-understanding', 'point-to-edit'] },
  { term: 'Practice run', def: 'The AI tries a task in a safe test mode first, so nothing real happens yet. Like a fire drill before a real fire.', design: 'Show what would happen, flag anything odd, then let people make it real in one tap.', patterns: ['sandbox-preview', 'preview-changes'] },
  { term: 'Prompt', def: 'What you type or say to the AI: your question or instruction.', design: 'Most people aren’t prompt experts. Give examples and simple controls.', patterns: ['prompt-starters', 'structured-controls'] },
  { term: 'RAG', def: 'Short for retrieval-augmented generation. The AI looks things up first, then answers, like checking the manual before replying.', design: 'It powers “answers from your docs”, with sources.', patterns: ['citations'] },
  { term: 'Streaming', def: 'Showing the answer bit by bit as it’s written, like watching someone type.', design: 'Long answers feel faster. Keep a Stop button in view.', patterns: ['streaming-response', 'stop-and-undo'] },
  { term: 'Sycophancy', def: 'When the AI flatters you or agrees to please you, instead of being right. A yes-man in a chat box.', design: 'Avoid it. Reward honest answers backed by evidence.', patterns: ['citations', 'bias-check'] },
  { term: 'System prompt', def: 'Hidden instructions from the product team that shape how the AI acts. Like a job brief the user never sees.', design: 'This is where tone, limits and safety rules get set.', patterns: ['set-expectations'] },
  { term: 'Temperature', def: 'A setting for how wild or careful the AI’s answers are. Turn it up for brainstorming, down for facts.', design: 'Pick it per feature. A name generator and a tax helper need different settings.', patterns: ['multiple-variants'] },
  { term: 'Token', def: 'A small chunk of text the AI reads or writes, often part of a word. Use is often priced per token.', design: 'Long inputs and answers cost more. Show the cost before big tasks.', patterns: ['cost-estimate', 'visible-context'] },
  { term: 'Tool use', def: 'When the AI uses other software, like search, a calendar or code, to get a job done.', design: 'Show which tools it used, and ask before risky ones.', patterns: ['connected-apps', 'action-approval'] },
];

export const furtherReading = [
  { name: 'Guidelines for Human-AI Interaction', by: 'Microsoft Research (HAX Toolkit)', url: 'https://www.microsoft.com/en-us/haxtoolkit/' },
  { name: 'People + AI Guidebook', by: 'Google PAIR', url: 'https://pair.withgoogle.com/guidebook/' },
  { name: 'The Shape of AI', by: 'Emily Campbell', url: 'https://www.shapeof.ai/' },
  { name: 'Accordion Editing and Apple Picking', by: 'Nielsen Norman Group', url: 'https://www.nngroup.com/articles/accordion-editing-apple-picking/' },
  { name: 'Carbon for AI', by: 'IBM Carbon Design System', url: 'https://carbondesignsystem.com/guidelines/carbon-for-ai/' },
  { name: 'Designing for Agentic AI', by: 'Smashing Magazine', url: 'https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/' },
  { name: 'Dark Patterns in AI Chatbots', by: 'Center for Democracy & Technology', url: 'https://cdt.org/insights/dark-patterns-in-ai-chatbots-a-taxonomy-to-inform-better-design/' },
  { name: 'AI UX Playground', by: 'Pattern library with demos', url: 'https://aiuxplayground.com/' },
  { name: 'aiverse', by: 'Library of AI interactions', url: 'https://www.aiverse.design/' },
];
