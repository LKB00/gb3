// Real products that use each pattern. Descriptions are simplified and
// kept to well-known, public behavior. Names belong to their owners.

export const realExamples = {
  'prompt-starters': [
    { product: 'ChatGPT', company: 'OpenAI', what: 'A new chat shows suggested prompts you can tap to get started.' },
    { product: 'Gemini', company: 'Google', what: 'The start screen offers suggestion chips for common tasks.' },
  ],
  'clarifying-questions': [
    { product: 'ChatGPT deep research', company: 'OpenAI', what: 'Asks a few questions about scope before starting a long research task.' },
    { product: 'Perplexity Pro Search', company: 'Perplexity', what: 'Can ask a follow-up question to narrow a broad search.' },
  ],
  'visible-context': [
    { product: 'GitHub Copilot Chat', company: 'GitHub', what: 'Lists the files it used as references for an answer.' },
    { product: 'Cursor', company: 'Anysphere', what: 'Shows attached files as chips in the chat box, added with @.' },
  ],
  'structured-controls': [
    { product: 'Notion AI', company: 'Notion', what: 'Offers “Make shorter”, “Make longer” and “Change tone” on selected text.' },
    { product: 'Help me write', company: 'Google', what: 'In Gmail and Docs, one tap to formalize, elaborate or shorten a draft.' },
  ],
  'streaming-response': [
    { product: 'ChatGPT', company: 'OpenAI', what: 'Streams the answer word by word, with a Stop button while it writes.' },
    { product: 'Perplexity', company: 'Perplexity', what: 'Shows its steps, like searching and reading sources, before answering.' },
  ],
  'multiple-variants': [
    { product: 'Midjourney', company: 'Midjourney', what: 'Returns a grid of four images, each with buttons to vary or upscale it.' },
    { product: 'Firefly', company: 'Adobe', what: 'Generates several image options at once to choose from.' },
  ],
  'regenerate-history': [
    { product: 'ChatGPT', company: 'OpenAI', what: 'Regenerated answers keep “‹ 2 / 2 ›” arrows to switch between versions.' },
    { product: 'Midjourney', company: 'Midjourney', what: '“Vary (Subtle)” and “Vary (Strong)” steer a retry instead of starting over.' },
  ],
  'editable-output': [
    { product: 'ChatGPT Canvas', company: 'OpenAI', what: 'Opens writing in an editor you can change directly, or ask to edit just a selection.' },
    { product: 'Notion AI', company: 'Notion', what: 'Writes into the page itself, where it is normal editable text.' },
  ],
  'inline-suggestions': [
    { product: 'GitHub Copilot', company: 'GitHub', what: 'Shows code suggestions as grey ghost text; press Tab to accept.' },
    { product: 'Gmail Smart Compose', company: 'Google', what: 'Suggests the end of your sentence in grey; press Tab to accept.' },
  ],
  'stop-and-undo': [
    { product: 'ChatGPT and Claude', company: 'OpenAI · Anthropic', what: 'Show a Stop button while a reply is being written.' },
    { product: 'Gmail', company: 'Google', what: '“Undo send” gives you a few seconds to take an email back.' },
  ],
  'preview-changes': [
    { product: 'GitHub Copilot edits', company: 'GitHub', what: 'Shows proposed code changes as a diff you can keep or undo.' },
    { product: 'Google Docs', company: 'Google', what: 'Suggesting mode shows edits that can be accepted or rejected one by one.' },
  ],
  'set-expectations': [
    { product: 'ChatGPT', company: 'OpenAI', what: '“ChatGPT can make mistakes. Check important info.” under the chat box.' },
    { product: 'Claude', company: 'Anthropic', what: '“Claude can make mistakes. Please double-check responses.” stays visible.' },
  ],
  citations: [
    { product: 'Perplexity', company: 'Perplexity', what: 'Puts numbered citations right after claims, linked to the sources.' },
    { product: 'AI Overviews', company: 'Google', what: 'Shows the web pages behind an AI summary as links next to it.' },
  ],
  'confidence-signals': [
    { product: 'Google Docs and Word', company: 'Google · Microsoft', what: 'Underline only the words that may be wrong, so you check just those.' },
    { product: 'Google Translate', company: 'Google', what: 'Shows alternatives when a translation is ambiguous, like gender-specific words.' },
  ],
  'ai-disclosure': [
    { product: 'Instagram and Facebook', company: 'Meta', what: 'Add an “AI info” label to content made or edited with AI.' },
    { product: 'YouTube', company: 'Google', what: 'Labels videos that creators mark as altered or synthetic content.' },
  ],
  'explain-why': [
    { product: 'Netflix', company: 'Netflix', what: 'Rows like “Because you watched…” say why titles are recommended.' },
    { product: 'Amazon', company: 'Amazon', what: '“Inspired by your browsing history” explains where suggestions come from.' },
  ],
  'memory-controls': [
    { product: 'ChatGPT memory', company: 'OpenAI', what: 'Shows “Memory updated”, lets you manage memories, and offers Temporary Chat.' },
    { product: 'Gemini saved info', company: 'Google', what: 'Lets you see and delete the info Gemini keeps about you.' },
  ],
  'feedback-loop': [
    { product: 'ChatGPT', company: 'OpenAI', what: 'Thumbs up and down on every answer, with optional reasons.' },
    { product: 'AI Overviews', company: 'Google', what: 'A thumbs up or down right under the AI summary.' },
  ],
  'graceful-errors': [
    { product: 'Gmail', company: 'Google', what: 'Warns “Did you mean to attach files?” when you mention an attachment but forgot it.' },
    { product: 'Google Search', company: 'Google', what: '“Did you mean…” turns a typo into a one-tap fix.' },
  ],
  'plan-first': [
    { product: 'Claude Code', company: 'Anthropic', what: 'Plan mode proposes a plan for you to review before it edits any files.' },
    { product: 'Cursor', company: 'Anysphere', what: 'Plan mode drafts a step-by-step plan you can edit before it writes code.' },
  ],
  'action-approval': [
    { product: 'ChatGPT agent', company: 'OpenAI', what: 'Asks you to confirm before important actions like buying or sending.' },
    { product: 'Claude Code', company: 'Anthropic', what: 'Asks permission before running commands or editing files, unless you allow them.' },
  ],
  'task-status': [
    { product: 'ChatGPT deep research', company: 'OpenAI', what: 'Works for several minutes in the background, so you can come back to the report.' },
    { product: 'Fin', company: 'Intercom', what: 'An AI support agent that hands the chat to a human when it cannot help.' },
  ],
};
