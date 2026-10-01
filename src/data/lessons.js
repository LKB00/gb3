// The learning path: short lessons, from basics to advanced.
// `sections` is a list of { heading, text } blocks. `patterns` links to the library.

export const lessons = [
  {
    id: 'why-ai-is-different',
    level: 'Basics',
    minutes: 5,
    title: 'Why AI design is different',
    intro: 'Normal software does the same thing every time. AI does not. This changes how we design.',
    sections: [
      {
        heading: 'Normal software is predictable',
        text: 'When you press "Save", the file is saved. Same input, same output, every time. Designers can plan every screen and every state.',
      },
      {
        heading: 'AI is probabilistic', visual: 'confidence-signals',
        text: 'AI makes a best guess. The same question can give different answers. Sometimes the answer is great, sometimes it is wrong — and it can look confident either way.',
      },
      {
        heading: 'What this means for designers', visual: 'stop-and-undo',
        text: 'We cannot design only the "happy path". We must design for: waiting, uncertainty, wrong answers, and people changing the result. The patterns on this site exist to handle exactly these moments.',
      },
    ],
    takeaways: [
      'AI output is a guess, not a fact',
      'Design for waiting, mistakes and edits — not only success',
      'The person should stay in control',
    ],
    exercise: 'Open any AI app you use. Write down 3 moments where it could be wrong. How does the design help you notice?',
    patterns: [],
  },
  {
    id: 'mental-models',
    level: 'Basics',
    minutes: 6,
    title: 'Setting the right expectations',
    intro: 'People come with ideas about AI from movies and news. Good design shows what this AI can and cannot do.',
    sections: [
      {
        heading: 'Mental model', visual: 'set-expectations',
        text: 'A mental model is what a person believes about how something works. If they think the AI "knows everything", they will trust wrong answers. If they think it is "dumb", they will not try.',
      },
      {
        heading: 'Show, don\'t tell', visual: 'prompt-starters',
        text: 'Examples teach faster than text. Prompt starters show the kind of tasks the AI does well. A short note like "Can make mistakes. Check important info." sets honest limits.',
      },
      {
        heading: 'Name the AI\'s role',
        text: 'Is it an assistant, a co-pilot, an agent that acts alone? The name and tone tell people how much to rely on it.',
      },
    ],
    takeaways: ['Show real examples of what the AI can do', 'Say the limits early and simply', 'Role and tone shape trust'],
    exercise: 'Write the empty-state screen for an AI feature in your product: one sentence of purpose, 3 prompt starters, one honest limit.',
    patterns: ['set-expectations', 'prompt-starters', 'ai-disclosure'],
  },
  {
    id: 'designing-input',
    level: 'Core',
    minutes: 7,
    title: 'Designing the input',
    intro: 'A good result starts with a good request. Help people ask well, without making them prompt experts.',
    sections: [
      {
        heading: 'The blank box problem', visual: 'structured-controls',
        text: 'Free text is powerful but hard. Mix it with structure: chips, examples, file upload, and settings for things like tone or length.',
      },
      {
        heading: 'Ask when it matters', visual: 'clarifying-questions',
        text: 'If a missing detail would change the whole result, the AI should ask one quick question. If not, it should make a sensible guess and say what it assumed.',
      },
      {
        heading: 'Use context', visual: 'visible-context',
        text: 'The best input is the one people do not have to type. Use the selected text, open file or current page as context — and show that you are using it.',
      },
    ],
    takeaways: ['Mix free text with simple structure', 'Ask one clarifying question only when needed', 'Use and show context'],
    exercise: 'Take one AI feature. List what context it could use automatically, so the user types less.',
    patterns: ['prompt-starters', 'clarifying-questions', 'visible-context', 'structured-controls'],
  },
  {
    id: 'designing-output',
    level: 'Core',
    minutes: 7,
    title: 'Designing the output',
    intro: 'The answer is not the end. It is a draft people will read, compare and change.',
    sections: [
      {
        heading: 'Make waiting feel short', visual: 'streaming-response',
        text: 'Stream text as it is written. For longer tasks, show the steps in plain words. People wait more calmly when they see progress.',
      },
      {
        heading: 'Options, not one answer', visual: 'multiple-variants',
        text: 'For creative work, show a few different versions. Choosing is easier than describing what you want.',
      },
      {
        heading: 'Output is a draft', visual: 'editable-output',
        text: 'Let people edit directly, and let them ask the AI to change only one part. Never throw away their edits.',
      },
    ],
    takeaways: ['Stream and show steps', 'Offer variants for creative tasks', 'Make output editable'],
    exercise: 'Sketch the result screen for an "AI write my bio" feature. Where can people edit? How do they get another version?',
    patterns: ['streaming-response', 'multiple-variants', 'regenerate-history', 'editable-output'],
  },
  {
    id: 'building-trust',
    level: 'Advanced',
    minutes: 8,
    title: 'Building the right amount of trust',
    intro: 'The goal is not "maximum trust". It is the right trust: people believe the AI when it is right and check it when it may be wrong.',
    sections: [
      {
        heading: 'Over-trust and under-trust', visual: 'explain-why',
        text: 'Over-trust: people copy wrong answers without checking. Under-trust: people ignore a useful tool. Both are design problems.',
      },
      {
        heading: 'Show your work', visual: 'citations',
        text: 'Citations let people verify claims. Confidence labels tell them where to look. Both turn "trust me" into "check me".',
      },
      {
        heading: 'Be honest about AI', visual: 'ai-disclosure',
        text: 'Label AI-made content. People feel tricked when they find out later — and that hurts trust in the whole product.',
      },
    ],
    takeaways: ['Aim for calibrated trust', 'Cite sources next to claims', 'Show uncertainty in plain words', 'Always label AI content'],
    exercise: 'Find one AI answer that was wrong. Redesign it so a user would have noticed the problem.',
    patterns: ['citations', 'confidence-signals', 'ai-disclosure', 'explain-why', 'memory-controls'],
  },
  {
    id: 'control-and-recovery',
    level: 'Advanced',
    minutes: 8,
    title: 'Control, errors and feedback',
    intro: 'AI will make mistakes. Great AI products make mistakes cheap and easy to fix.',
    sections: [
      {
        heading: 'Human in control', visual: 'inline-suggestions',
        text: 'Suggestions should be easy to accept and easy to ignore. Actions should be easy to stop and to undo. Risky actions need a confirm.',
      },
      {
        heading: 'Helpful failure', visual: 'graceful-errors',
        text: 'Say what happened in plain words, keep the user\'s input, and give a next step. A good error message keeps people moving.',
      },
      {
        heading: 'Close the loop', visual: 'feedback-loop',
        text: 'Quick feedback (thumbs + reason) tells your team where the AI fails. Use it to improve prompts, data and design.',
      },
    ],
    takeaways: ['Suggest, don\'t force', 'Always allow stop and undo', 'Errors need a next step', 'Collect feedback in one click'],
    exercise: 'List every action your AI feature can take. Mark which ones can be undone. Add a confirm or undo to the rest.',
    patterns: ['inline-suggestions', 'stop-and-undo', 'preview-changes', 'graceful-errors', 'feedback-loop'],
  },
  {
    id: 'designing-agents',
    level: 'Advanced',
    minutes: 7,
    title: 'Designing AI agents',
    intro: 'Agents do work on their own: many steps, real actions. The design job is to keep people in charge without slowing everything down.',
    sections: [
      {
        heading: 'Plan before acting', visual: 'plan-first',
        text: 'Show a short plan first. Fixing a plan costs seconds. Fixing finished work costs hours.',
      },
      {
        heading: 'Ask only when it matters', visual: 'action-approval',
        text: 'Safe actions (drafts, searches): just do them. Risky actions (send, pay, delete): stop and show exactly what will happen.',
      },
      {
        heading: 'Let people walk away', visual: 'task-status',
        text: 'Long tasks run in the background with a clear status. Tell people when they are needed, and always offer a human.',
      },
    ],
    takeaways: ['Show the plan, then start', 'Ask before risky actions, not every action', 'Background + status for long tasks'],
    exercise: 'List what an AI agent in your product could do. Sort each action into "just do it" or "ask first".',
    patterns: ['plan-first', 'action-approval', 'task-status'],
  },
];

export const getLesson = (id) => lessons.find((l) => l.id === id);
