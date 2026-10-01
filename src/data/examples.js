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
  'contextual-nudge': [
    { product: 'Gmail Smart Reply', company: 'Google', what: 'Offers short reply suggestions at the bottom of an email, right where you reply.' },
    { product: 'Grammarly', company: 'Grammarly', what: 'Underlines text as you write and offers a fix only where it applies.' },
  ],
  'reply-to-part': [
    { product: 'ChatGPT', company: 'OpenAI', what: 'Select text in an answer and ask about just that part; it is quoted in your next message.' },
    { product: 'Notion AI', company: 'Notion', what: 'Select text and choose “Ask AI” to work on only that selection.' },
  ],
  'show-understanding': [
    { product: 'Google Lens', company: 'Google', what: 'Highlights the text and objects it found in a photo, so you can pick what you mean.' },
    { product: 'Google Assistant', company: 'Google', what: 'Shows your words on screen as you speak, so you can see what it heard.' },
  ],
  'autonomy-dial': [
    { product: 'Claude Code', company: 'Anthropic', what: 'Permission modes range from asking before every edit to auto-accepting edits, plus a plan-only mode.' },
    { product: 'SAE driving levels', company: 'SAE International', what: 'Cars describe automation as levels 0 to 5, a well-known model for “how much the machine does”.' },
  ],
  'action-log': [
    { product: 'Claude Code', company: 'Anthropic', what: 'Shows each command and file edit as it happens, with checkpoints you can rewind to.' },
    { product: 'Copilot coding agent', company: 'GitHub', what: 'Works in a pull request with a session log of what it did, so changes can be reviewed.' },
  ],
  'interrupt-redirect': [
    { product: 'ChatGPT agent', company: 'OpenAI', what: 'You can interrupt at any time, take over the browser, then hand control back.' },
    { product: 'Claude Code', company: 'Anthropic', what: 'Press Esc to stop mid-task, add a new instruction, and continue.' },
  ],
  'cost-estimate': [
    { product: 'Replit Agent', company: 'Replit', what: 'Shows what each agent checkpoint cost, so you can see where credits go.' },
    { product: 'Firefly', company: 'Adobe', what: 'Shows the generative credits a premium action will use before you run it.' },
  ],
  'voice-turn-taking': [
    { product: 'ChatGPT voice', company: 'OpenAI', what: 'Shows when it is listening or speaking, and you can interrupt it mid-answer.' },
    { product: 'Gemini Live', company: 'Google', what: 'A voice conversation you can interrupt at any time to change direction.' },
  ],
  'read-back': [
    { product: 'Alexa', company: 'Amazon', what: 'Confirms before placing a voice order, and you can require a voice code for purchases.' },
    { product: 'Google Assistant', company: 'Google', what: 'Reads a dictated message back and asks before sending it.' },
  ],
  'point-to-edit': [
    { product: 'Generative Fill', company: 'Adobe Photoshop', what: 'Select an area, describe the change, and only that area is regenerated.' },
    { product: 'Magic Editor', company: 'Google Photos', what: 'Tap or circle an object to move, resize or erase just that object.' },
  ],
  'mode-switch': [
    { product: 'Echo Show', company: 'Amazon', what: 'Speaks a short answer and shows lists, recipes and details on its screen.' },
    { product: 'Nest Hub', company: 'Google', what: 'Pairs spoken answers with on-screen cards you can tap.' },
  ],
  'bias-check': [
    { product: 'Monk Skin Tone Scale', company: 'Google', what: 'A 10-shade scale Google uses to make skin tones better represented in products like Search and Photos.' },
    { product: 'Skin tone ranges', company: 'Pinterest', what: 'Lets people narrow beauty searches by skin tone range, instead of one default.' },
  ],
};
