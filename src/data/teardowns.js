// Product teardowns: how real AI products use the patterns, stage by stage.
// Based on well-known public features; products change often. "Could be better"
// items are our own suggestions, not claims about the companies' plans.

export const teardowns = [
  {
    id: 'chatgpt',
    product: 'ChatGPT',
    company: 'OpenAI',
    type: 'Chat assistant',
    summary: 'The everyday AI helper for writing, research and random questions.',
    journey: [
      { stage: 'Start', what: 'A new chat shows ideas to try. A small note under the box says it can make mistakes.', patterns: ['prompt-starters', 'set-expectations'] },
      { stage: 'Ask', what: 'Add files, or highlight part of an answer to ask about just that bit.', patterns: ['visible-context', 'reply-to-part'] },
      { stage: 'Wait', what: 'The answer appears word by word. A Stop button is there the whole time.', patterns: ['streaming-response', 'stop-and-undo'] },
      { stage: 'Refine', what: 'Ask again and old answers stay as ‹ 1 / 2 › versions. Canvas lets you edit the text yourself.', patterns: ['regenerate-history', 'editable-output'] },
      { stage: 'Remember', what: 'A “Memory updated” note shows when it saves something. You can manage memory, or use Temporary Chat to keep a chat off the record.', patterns: ['memory-controls'] },
      { stage: 'Feedback', what: 'Thumbs up or down on every answer.', patterns: ['feedback-loop'] },
      { stage: 'Agents', what: 'Deep research asks a few questions first, then works in the background. Agent mode asks before big actions and lets you take over.', patterns: ['clarifying-questions', 'task-status', 'action-approval', 'interrupt-redirect'] },
    ],
    works: [
      'Lots of small trust signals add up: Stop, versions, the mistakes note, memory notes.',
      'Long jobs like deep research run in the background, so you can keep working.',
    ],
    better: [
      { text: 'When memory shapes an answer, it could say which memory it used. Easier to trust, easier to fix.', pattern: 'explain-why' },
      { text: 'People stop seeing a note that never changes. Showing doubt or sources on risky answers would help more.', pattern: 'confidence-signals' },
    ],
  },
  {
    id: 'perplexity',
    product: 'Perplexity',
    company: 'Perplexity',
    type: 'AI search',
    summary: 'A search engine that writes the answer for you, with sources.',
    journey: [
      { stage: 'Start', what: 'One search box with suggested questions. It feels like the search you already know.', patterns: ['prompt-starters'] },
      { stage: 'Narrow', what: 'Pro Search may ask one follow-up question to narrow a broad request.', patterns: ['clarifying-questions'] },
      { stage: 'Wait', what: 'It shows its steps, like searching and reading, before the answer appears.', patterns: ['streaming-response'] },
      { stage: 'Answer', what: 'Small numbers after each claim link to the sources, listed right beside the answer.', patterns: ['citations'] },
      { stage: 'Continue', what: 'Related questions under each answer keep you going.', patterns: ['contextual-nudge'] },
    ],
    works: [
      'Sources sit right next to claims, so checking feels normal, not like homework.',
      'Seeing the search steps makes the wait feel shorter and shows where answers come from.',
    ],
    better: [
      { text: 'A source number proves a source exists, not that it says that exact thing. A quote preview on hover would make checking quick.', pattern: 'citations' },
      { text: 'Answers sound just as sure when sources disagree. A small “sources disagree” flag would help.', pattern: 'confidence-signals' },
    ],
  },
  {
    id: 'github-copilot',
    product: 'GitHub Copilot',
    company: 'GitHub',
    type: 'Coding assistant',
    summary: 'An AI coding buddy inside the code editor, plus an agent that takes on whole tasks.',
    journey: [
      { stage: 'Write', what: 'Suggestions show up as grey text. Press Tab to accept, or keep typing to ignore.', patterns: ['inline-suggestions'] },
      { stage: 'Ask', what: 'Copilot Chat lists the files it looked at for each answer.', patterns: ['visible-context'] },
      { stage: 'Edit', what: 'Changes show as before-and-after code you can keep or undo.', patterns: ['preview-changes'] },
      { stage: 'Delegate', what: 'The coding agent works in a pull request and keeps a log of what it did.', patterns: ['action-log', 'task-status'] },
    ],
    works: [
      'Grey text is easy to ignore and quick to accept, so the coder stays in charge.',
      'Pull requests are a review step teams already trust. That’s Jakob’s law at work.',
    ],
    better: [
      { text: 'Suggestions can break your focus. An easy “pause for a while” switch would help.', pattern: 'contextual-nudge' },
      { text: 'Saying why it suggested something, like which files it used, would help people trust it the right amount.', pattern: 'explain-why' },
    ],
  },
  {
    id: 'claude-code',
    product: 'Claude Code',
    company: 'Anthropic',
    type: 'Coding agent',
    summary: 'An agent in your terminal that reads, edits and runs code in your project.',
    journey: [
      { stage: 'Plan', what: 'Plan mode shows a plan to review before any file changes.', patterns: ['plan-first'] },
      { stage: 'Permission', what: 'It asks before running commands or editing files. Permission modes set how much it can do alone.', patterns: ['action-approval', 'autonomy-dial'] },
      { stage: 'Watch', what: 'Every command and file edit shows up as it happens.', patterns: ['action-log', 'streaming-response'] },
      { stage: 'Redirect', what: 'Press Esc to stop it mid-task, add an instruction, and carry on.', patterns: ['interrupt-redirect'] },
      { stage: 'Undo', what: 'Checkpoints let you rewind to an earlier point.', patterns: ['action-log', 'stop-and-undo'] },
    ],
    works: [
      'You pick how much power it has, from plan-only to auto-accepting edits.',
      'You see every step as it happens, so mistakes get caught early.',
    ],
    better: [
      { text: 'Long runs mean long transcripts. A short “what changed” recap at the end would speed up review.', pattern: 'action-log' },
      { text: 'Too many permission asks and people stop reading. Grouping safe actions saves attention for risky ones.', pattern: 'action-approval' },
    ],
  },
];

export const getTeardown = (id) => teardowns.find((t) => t.id === id);
