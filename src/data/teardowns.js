// Product teardowns: how real AI products use the patterns, stage by stage.
// Based on well-known public features; products change often. "Could be better"
// items are our own suggestions, not claims about the companies' plans.

export const teardowns = [
  {
    id: 'chatgpt',
    product: 'ChatGPT',
    company: 'OpenAI',
    type: 'Chat assistant',
    summary: 'A general-purpose AI assistant for writing, research and everyday questions.',
    journey: [
      { stage: 'Start', what: 'A new chat offers suggested prompts, and a note under the box says it can make mistakes.', patterns: ['prompt-starters', 'set-expectations'] },
      { stage: 'Ask', what: 'You can attach files, and select text in an answer to ask about just that part.', patterns: ['visible-context', 'reply-to-part'] },
      { stage: 'Wait', what: 'Answers stream word by word, with a Stop button while it writes.', patterns: ['streaming-response', 'stop-and-undo'] },
      { stage: 'Refine', what: 'Regenerated answers keep ‹ 1 / 2 › versions; Canvas lets you edit output directly.', patterns: ['regenerate-history', 'editable-output'] },
      { stage: 'Remember', what: '“Memory updated” notes, a memory manager, and Temporary Chat for chats you don’t want remembered.', patterns: ['memory-controls'] },
      { stage: 'Feedback', what: 'Thumbs up and down on every answer.', patterns: ['feedback-loop'] },
      { stage: 'Agents', what: 'Deep research asks clarifying questions and runs in the background; agent mode asks before important actions and lets you take over.', patterns: ['clarifying-questions', 'task-status', 'action-approval', 'interrupt-redirect'] },
    ],
    works: [
      'Many small control and trust signals add up: Stop, versions, the mistakes note, memory notes.',
      'Long tasks like deep research run in the background, so they never block you.',
    ],
    better: [
      { text: 'When memory shapes an answer, saying which memory was used would make it easier to trust and correct.', pattern: 'explain-why' },
      { text: 'A permanent “can make mistakes” note is easy to stop seeing; adding uncertainty or sources on risky answers would help.', pattern: 'confidence-signals' },
    ],
  },
  {
    id: 'perplexity',
    product: 'Perplexity',
    company: 'Perplexity',
    type: 'AI search',
    summary: 'An answer engine that searches the web and writes an answer with sources.',
    journey: [
      { stage: 'Start', what: 'One search-style box with suggested questions, so it feels familiar.', patterns: ['prompt-starters'] },
      { stage: 'Narrow', what: 'Pro Search can ask a follow-up question to narrow a broad request.', patterns: ['clarifying-questions'] },
      { stage: 'Wait', what: 'Shows its steps, like searching and reading sources, before the answer appears.', patterns: ['streaming-response'] },
      { stage: 'Answer', what: 'Numbered citations sit right after claims, with the sources listed alongside.', patterns: ['citations'] },
      { stage: 'Continue', what: 'Suggests related follow-up questions under each answer.', patterns: ['contextual-nudge'] },
    ],
    works: [
      'Citations next to claims make checking a normal habit, not extra work.',
      'Visible search steps make the wait feel shorter and explain where answers come from.',
    ],
    better: [
      { text: 'A citation shows that a source exists, not that it supports the exact sentence; a quote preview on hover would make checking faster.', pattern: 'citations' },
      { text: 'Answers read equally sure whether sources agree or not; flagging disagreement between sources would help.', pattern: 'confidence-signals' },
    ],
  },
  {
    id: 'github-copilot',
    product: 'GitHub Copilot',
    company: 'GitHub',
    type: 'Coding assistant',
    summary: 'An AI pair programmer inside the code editor, plus a coding agent for whole tasks.',
    journey: [
      { stage: 'Write', what: 'Suggestions appear as grey ghost text; Tab accepts, typing ignores.', patterns: ['inline-suggestions'] },
      { stage: 'Ask', what: 'Copilot Chat lists the files it used as references for an answer.', patterns: ['visible-context'] },
      { stage: 'Edit', what: 'Proposed edits appear as diffs you can keep or undo.', patterns: ['preview-changes'] },
      { stage: 'Delegate', what: 'The coding agent works in a pull request with a session log of what it did.', patterns: ['action-log', 'task-status'] },
    ],
    works: [
      'Ghost text is easy to ignore and fast to accept, so people stay in control.',
      'Working through pull requests reuses a review process teams already trust (Jakob’s law).',
    ],
    better: [
      { text: 'Suggestions can interrupt thinking; an easy way to pause them for a while respects focus.', pattern: 'contextual-nudge' },
      { text: 'Showing why a suggestion was made, such as which files it drew on, would build calibrated trust.', pattern: 'explain-why' },
    ],
  },
  {
    id: 'claude-code',
    product: 'Claude Code',
    company: 'Anthropic',
    type: 'Coding agent',
    summary: 'An agent that reads, edits and runs code in your project from the terminal.',
    journey: [
      { stage: 'Plan', what: 'Plan mode proposes a plan for review before any file is edited.', patterns: ['plan-first'] },
      { stage: 'Permission', what: 'Asks before running commands or editing files; permission modes set how much it may do alone.', patterns: ['action-approval', 'autonomy-dial'] },
      { stage: 'Watch', what: 'Shows each command and file edit as it happens.', patterns: ['action-log', 'streaming-response'] },
      { stage: 'Redirect', what: 'Press Esc to stop mid-task, add an instruction, and continue.', patterns: ['interrupt-redirect'] },
      { stage: 'Undo', what: 'Checkpoints let you rewind to an earlier state.', patterns: ['action-log', 'stop-and-undo'] },
    ],
    works: [
      'Autonomy is adjustable, from plan-only to auto-accepting edits.',
      'Everything the agent does is visible as it happens, so mistakes are caught early.',
    ],
    better: [
      { text: 'Long runs make long transcripts; a short “what changed” summary at the end would speed up review.', pattern: 'action-log' },
      { text: 'Frequent permission prompts can cause approval fatigue; grouping safe actions keeps attention for risky ones.', pattern: 'action-approval' },
    ],
  },
];

export const getTeardown = (id) => teardowns.find((t) => t.id === id);
