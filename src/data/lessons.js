// Deep dives: short reads, from basics to advanced.
// `sections` is a list of { heading, text } blocks. `patterns` links to the library.

export const lessons = [
  {
    id: 'why-ai-is-different',
    level: 'Basics',
    minutes: 5,
    title: 'Why AI design is different',
    intro: 'Normal apps do the same thing every time. AI doesn’t. That changes everything for designers.',
    sections: [
      {
        heading: 'Normal apps keep their promises',
        text: 'Press “Save” and the file is saved. Same input, same result, every time. So designers can plan every screen.',
      },
      {
        heading: 'AI makes its best guess', visual: 'confidence-signals',
        text: 'Ask the same question twice and you may get two answers. Some are great, some are wrong. And it can sound sure either way.',
      },
      {
        heading: 'So design for the messy moments', visual: 'stop-and-undo',
        text: 'The happy path is not enough. Plan for waiting, doubt, wrong answers and people changing the result. Every card on this site handles one of those moments.',
      },
    ],
    takeaways: [
      'AI gives a guess, not a fact',
      'Design for waits, mistakes and edits, not only success',
      'Keep the person in control',
    ],
    exercise: 'Open an AI app you use. Find 3 moments where it could be wrong. Does the design help you notice?',
    patterns: [],
  },
  {
    id: 'mental-models',
    level: 'Basics',
    minutes: 6,
    title: 'Setting the right expectations',
    intro: 'Movies taught people that AI knows everything, or nothing. Good design shows what this AI can really do.',
    sections: [
      {
        heading: 'What people think it can do', visual: 'set-expectations',
        text: 'People act on what they believe the AI can do. Think it knows everything, and you trust wrong answers. Think it’s dumb, and you never try.',
      },
      {
        heading: 'Show, don\'t tell', visual: 'prompt-starters',
        text: 'Examples teach faster than text. Prompt starters show the jobs it does well. A short note like “Can make mistakes. Check important info.” sets honest limits.',
      },
      {
        heading: 'Name the AI\'s role',
        text: 'Is it a helper, a co-pilot, or an agent that acts alone? The name and tone tell people how much to lean on it.',
      },
    ],
    takeaways: ['Show real examples of what it can do', 'Say the limits early and simply', 'Role and tone shape trust'],
    exercise: 'Write the first screen for an AI feature in your product: one line on what it does, 3 prompt starters, one honest limit.',
    patterns: ['set-expectations', 'prompt-starters', 'ai-disclosure'],
  },
  {
    id: 'designing-input',
    level: 'Core',
    minutes: 7,
    title: 'Helping people ask',
    intro: 'Great answers start with a good question. Help people ask well, without making them prompt experts.',
    sections: [
      {
        heading: 'The blank box problem', visual: 'structured-controls',
        text: 'An empty box is powerful, and a bit scary. Add some structure: chips, examples, file upload, and quick settings for tone or length.',
      },
      {
        heading: 'Ask when it matters', visual: 'clarifying-questions',
        text: 'If a missing detail would change everything, ask one quick question. If not, make a smart guess and say what you guessed.',
      },
      {
        heading: 'Use what’s already there', visual: 'visible-context',
        text: 'The best input is the one nobody has to type. Use the selected text, open file or current page, and show that you’re using it.',
      },
    ],
    takeaways: ['Mix free text with simple structure', 'Ask one question, only when it matters', 'Use context, and show it'],
    exercise: 'Pick one AI feature. List what it could pick up on its own, so people type less.',
    patterns: ['prompt-starters', 'clarifying-questions', 'visible-context', 'structured-controls'],
  },
  {
    id: 'designing-output',
    level: 'Core',
    minutes: 7,
    title: 'Designing the answer',
    intro: 'The answer isn’t the end. It’s a draft people will read, compare and change.',
    sections: [
      {
        heading: 'Make waiting feel short', visual: 'streaming-response',
        text: 'Show text as it’s written. For long tasks, show the steps in plain words. Seeing progress keeps people calm.',
      },
      {
        heading: 'Options, not one answer', visual: 'multiple-variants',
        text: 'For creative work, show a few different versions. Picking is easier than explaining what you want.',
      },
      {
        heading: 'Treat it as a draft', visual: 'editable-output',
        text: 'Let people edit directly, or ask the AI to change just one part. Never throw away their edits.',
      },
    ],
    takeaways: ['Stream it and show the steps', 'Offer a few versions for creative tasks', 'Make the answer easy to edit'],
    exercise: 'Sketch the result screen for an “AI, write my bio” feature. Where do people edit? How do they get another version?',
    patterns: ['streaming-response', 'multiple-variants', 'regenerate-history', 'editable-output'],
  },
  {
    id: 'building-trust',
    level: 'Advanced',
    minutes: 8,
    title: 'Building the right amount of trust',
    intro: 'The goal isn’t “trust it fully”. It’s the right trust: believe it when it’s right, check it when it might be wrong.',
    sections: [
      {
        heading: 'Too much trust, too little', visual: 'explain-why',
        text: 'Too much: people copy wrong answers without checking. Too little: people ignore a useful tool. Design can fix both.',
      },
      {
        heading: 'Show your work', visual: 'citations',
        text: 'Sources let people check claims. Confidence labels show where to look. Both turn “trust me” into “check me”.',
      },
      {
        heading: 'Be honest about AI', visual: 'ai-disclosure',
        text: 'Label what the AI made. People who find out later feel tricked, and stop trusting the whole product.',
      },
    ],
    takeaways: ['Aim for the right amount of trust', 'Put sources next to claims', 'Show doubt in plain words', 'Always label AI content'],
    exercise: 'Find one AI answer that was wrong. Redesign it so you would have spotted the problem.',
    patterns: ['citations', 'confidence-signals', 'ai-disclosure', 'explain-why', 'memory-controls'],
  },
  {
    id: 'control-and-recovery',
    level: 'Advanced',
    minutes: 8,
    title: 'Control, errors and feedback',
    intro: 'AI will make mistakes. Great AI products make them cheap and easy to fix.',
    sections: [
      {
        heading: 'Keep people in charge', visual: 'inline-suggestions',
        text: 'Suggestions should be easy to take and easy to ignore. Actions should be easy to stop and undo. Risky ones need a yes first.',
      },
      {
        heading: 'Fail kindly', visual: 'graceful-errors',
        text: 'Say what happened in plain words, keep what the person typed, and offer a next step. A good error keeps people moving.',
      },
      {
        heading: 'Close the loop', visual: 'feedback-loop',
        text: 'A quick thumbs up or down, plus a reason, shows your team where the AI fails. Use it to fix prompts, data and design.',
      },
    ],
    takeaways: ['Suggest, don’t force', 'Always allow stop and undo', 'Every error needs a next step', 'Make feedback one tap'],
    exercise: 'List every action your AI feature can take. Which ones can be undone? Add a confirm or an undo to the rest.',
    patterns: ['inline-suggestions', 'stop-and-undo', 'preview-changes', 'graceful-errors', 'feedback-loop'],
  },
  {
    id: 'designing-agents',
    level: 'Advanced',
    minutes: 9,
    title: 'Designing AI agents',
    intro: 'Agents do real work on their own, many steps at a time. Your job: keep people in charge without slowing it all down.',
    sections: [
      {
        heading: 'Plan before acting', visual: 'plan-first',
        text: 'Show a short plan first. Fixing a plan takes seconds. Fixing finished work takes hours.',
      },
      {
        heading: 'Ask only when it matters', visual: 'action-approval',
        text: 'Safe actions, like drafts and searches: go ahead. Risky ones, like send, pay or delete: stop and show exactly what will happen.',
      },
      {
        heading: 'Pick how much power it gets', visual: 'autonomy-dial',
        text: 'Power comes in levels. At level 1 you do the work and the AI helps. At level 5 the AI works alone and you check in. Start low, let people pick per task, and keep Pause, a log and Undo at every level.',
      },
      {
        heading: 'Let people walk away', visual: 'task-status',
        text: 'Long tasks run in the background with a clear status. Call people back only when you need them, and always offer a human.',
      },
    ],
    takeaways: ['Show the plan, then start', 'Let people pick the power level per task', 'Ask before risky actions, not every action', 'Keep Pause, a log and Undo', 'Show the cost before big tasks'],
    exercise: 'List what an AI agent could do in your product. Sort each action into “just do it” or “ask first”.',
    patterns: ['plan-first', 'autonomy-dial', 'action-approval', 'interrupt-redirect', 'action-log', 'cost-estimate', 'task-status'],
  },
  {
    id: 'avoiding-dark-patterns',
    level: 'Advanced',
    minutes: 6,
    title: 'Avoiding AI dark patterns',
    intro: 'Some AI designs shine in a demo but hurt the people using them. Research has named them, so you can spot them.',
    sections: [
      {
        heading: 'Honest beats pleasing', visual: 'confidence-signals',
        text: 'An AI that always agrees, or sounds sure about guesses, leads people into bad choices. Show doubt and sources, and let it disagree kindly.',
      },
      {
        heading: 'Never pretend to be human', visual: 'ai-disclosure',
        text: 'A human name, fake typing or made-up feelings make people trust too much and share too much. Say it’s AI. Friendly is fine.',
      },
      {
        heading: 'No sneaking', visual: 'action-approval',
        text: 'Agents must never buy, share, delete or subscribe without a clear yes. Ask first, with exact details, and always offer a human.',
      },
    ],
    takeaways: ['Reward honesty, not agreement', 'Always say it’s AI', 'Ask before acting', 'Let chats end nicely', 'Make data use clear and optional'],
    exercise: 'Open the Dark patterns page. Check an AI app you use against all eight. Which one is it closest to?',
    patterns: ['confidence-signals', 'ai-disclosure', 'action-approval', 'memory-controls'],
  },
  {
    id: 'voice-and-vision',
    level: 'Advanced',
    minutes: 7,
    title: 'Designing for voice and vision',
    intro: 'When people talk to AI or show it a photo, there’s less text on screen to help. These patterns keep things clear and safe.',
    sections: [
      {
        heading: 'Make turns obvious', visual: 'voice-turn-taking',
        text: 'Show clearly when the AI is listening, thinking and speaking. Let people cut in by talking, like in a real chat.',
      },
      {
        heading: 'Read back what matters', visual: 'read-back',
        text: 'Voice tools mishear names and numbers. Before sending money or messages, read the key details back in one short line. Then wait for a yes.',
      },
      {
        heading: 'Point, don’t describe', visual: 'point-to-edit',
        text: 'For images, let people circle the part they mean, then say what to do. Describing a spot in words is slow and easy to get wrong.',
      },
      {
        heading: 'Use the screen for details', visual: 'mode-switch',
        text: 'Say a short summary out loud. Put lists, prices and options on screen. Nobody can hold a long spoken list in their head.',
      },
    ],
    takeaways: ['Make listening and speaking look different', 'Let people interrupt', 'Read back names and numbers', 'Let people point at images', 'Say it short, show the details'],
    exercise: 'Ask a voice assistant to set a reminder with a time and a name. Did it read the details back? Could you cut in?',
    patterns: ['voice-turn-taking', 'read-back', 'point-to-edit', 'mode-switch', 'show-understanding'],
  },
];

export const getLesson = (id) => lessons.find((l) => l.id === id);
