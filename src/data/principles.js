// UX principles and psychology behind the patterns.
// `type` groups them on the Principles page; `source` says where the idea comes from.

export const principleTypes = [
  { id: 'heuristic', name: 'Usability heuristics', blurb: 'From Jakob Nielsen’s 10 usability heuristics (1994), the best-known rules of thumb for interface design.' },
  { id: 'law', name: 'Laws of UX', blurb: 'Well-tested findings about how people perceive and decide.' },
  { id: 'psychology', name: 'Psychology & trust', blurb: 'How people think, feel and trust, especially with AI.' },
];

export const principles = [
  // Nielsen heuristics
  { id: 'visibility', type: 'heuristic', name: 'Visibility of system status', def: 'Keep people informed about what is happening, with timely feedback.' },
  { id: 'control', type: 'heuristic', name: 'User control and freedom', def: 'Give people a clear way out: stop, undo, cancel.' },
  { id: 'error-prevention', type: 'heuristic', name: 'Error prevention', def: 'Stop problems before they happen, for example by confirming risky actions.' },
  { id: 'recognition', type: 'heuristic', name: 'Recognition rather than recall', def: 'Show options so people do not have to remember or invent them.' },
  { id: 'minimalist', type: 'heuristic', name: 'Aesthetic and minimalist design', def: 'Show only what matters right now. Extra things compete for attention.' },
  { id: 'recover', type: 'heuristic', name: 'Help users recover from errors', def: 'Explain the problem in plain words and suggest a way forward.' },
  { id: 'match', type: 'heuristic', name: 'Match with the real world', def: 'Use words and ideas people already know, not system jargon.' },

  // Laws of UX
  { id: 'hicks', type: 'law', name: 'Hick’s law', def: 'The more choices there are, the longer it takes to decide.' },
  { id: 'choice-overload', type: 'law', name: 'Choice overload', def: 'Too many similar options make choosing harder and less satisfying.' },
  { id: 'doherty', type: 'law', name: 'Doherty threshold', def: 'People stay engaged when the system responds in under about 400 ms.' },
  { id: 'goal-gradient', type: 'law', name: 'Goal-gradient effect', def: 'People push on when they can see how close they are to the end.' },
  { id: 'jakobs', type: 'law', name: 'Jakob’s law', def: 'People expect your product to work like the products they already use.' },
  { id: 'teslers', type: 'law', name: 'Tesler’s law', def: 'Complexity cannot be removed, only moved. Let the system carry it.' },
  { id: 'peak-end', type: 'law', name: 'Peak-end rule', def: 'People judge an experience by its most intense moment and its end.' },
  { id: 'von-restorff', type: 'law', name: 'Von Restorff effect', def: 'The item that looks different is the one people notice and remember.' },

  // Psychology & trust
  { id: 'automation-bias', type: 'psychology', name: 'Automation bias', def: 'People tend to accept what an automated system says, even when it is wrong.' },
  { id: 'calibrated-trust', type: 'psychology', name: 'Calibrated trust', def: 'Good AI design makes trust match how reliable the system really is.' },
  { id: 'mental-model', type: 'psychology', name: 'Mental models', def: 'People act on what they believe a system can do, right or wrong.' },
  { id: 'transparency', type: 'psychology', name: 'Operational transparency', def: 'People value a result more when they can see the work behind it.' },
  { id: 'ikea', type: 'psychology', name: 'IKEA effect', def: 'People value things more when they helped make them.' },
  { id: 'loss-aversion', type: 'psychology', name: 'Loss aversion', def: 'Losing something feels worse than gaining the same thing feels good.' },
  { id: 'agency', type: 'psychology', name: 'Sense of agency', def: 'People need to feel that they, not the system, decide the outcome.' },
  { id: 'cognitive-load', type: 'psychology', name: 'Cognitive load', def: 'Every extra thing to read, type or remember costs mental effort.' },
  { id: 'habituation', type: 'psychology', name: 'Habituation', def: 'Warnings that appear too often stop being read.' },
  { id: 'stereotype', type: 'psychology', name: 'Stereotype reinforcement', def: 'Repeated images of who does what shape what people believe is normal.' },
  { id: 'working-memory', type: 'psychology', name: 'Working memory limits', def: 'People can hold only a few items in mind at once, especially when listening.' },
];

export const getPrinciple = (id) => principles.find((p) => p.id === id);

// Which principles each pattern uses, and how.
export const patternPrinciples = {
  'prompt-starters': [
    ['recognition', 'People pick an example instead of inventing a prompt from nothing.'],
    ['mental-model', 'Real examples teach what the AI is good at.'],
    ['hicks', 'Three to five examples keep the choice quick.'],
  ],
  'clarifying-questions': [
    ['error-prevention', 'One question up front prevents a wrong, wasted result.'],
    ['cognitive-load', 'Tap-to-answer chips are easier than typing an answer.'],
  ],
  'visible-context': [
    ['visibility', 'People can see which file the AI is reading.'],
    ['mental-model', 'Showing context corrects the belief that the AI “sees everything”.'],
    ['control', 'People can remove or add context.'],
  ],
  'structured-controls': [
    ['recognition', 'Tone and length are visible choices, not words to remember.'],
    ['teslers', 'The product writes the complex prompt, so people do not have to.'],
    ['hicks', 'Two or three common controls keep the screen simple.'],
  ],
  'streaming-response': [
    ['visibility', 'Live steps show the AI is working and what it is doing.'],
    ['doherty', 'The first words appear fast, so the wait feels short.'],
    ['transparency', 'Seeing the work makes people value the answer more.'],
  ],
  'multiple-variants': [
    ['recognition', 'Choosing between options is easier than describing what you want.'],
    ['choice-overload', 'Three different options, not ten similar ones.'],
  ],
  'regenerate-history': [
    ['loss-aversion', 'Keeping old versions removes the fear of losing a good answer.'],
    ['control', 'People can always go back.'],
  ],
  'editable-output': [
    ['ikea', 'People value a result more when they shaped it themselves.'],
    ['control', 'Editing directly keeps the person in charge of the final text.'],
  ],
  'inline-suggestions': [
    ['agency', 'Nothing changes until the person accepts it.'],
    ['von-restorff', 'Grey ghost text looks clearly different from real text.'],
    ['jakobs', 'Tab to accept works like code editors and email apps people already use.'],
  ],
  'stop-and-undo': [
    ['control', 'Stop and Undo are the clearest ways out.'],
    ['error-prevention', 'A confirm step before deleting prevents damage that cannot be undone.'],
  ],
  'preview-changes': [
    ['visibility', 'Every change is visible before it is applied.'],
    ['error-prevention', 'Bad changes are caught before they land.'],
  ],
  'set-expectations': [
    ['mental-model', 'An honest intro sets the right picture of what the AI can do.'],
    ['calibrated-trust', 'Saying “can make mistakes” keeps trust realistic.'],
    ['automation-bias', 'A visible reminder makes people check instead of copy.'],
  ],
  citations: [
    ['calibrated-trust', 'People can check a claim instead of trusting it blindly.'],
    ['automation-bias', 'Sources invite checking, the antidote to blind acceptance.'],
    ['transparency', 'Showing where facts came from makes the answer more valuable.'],
  ],
  'confidence-signals': [
    ['calibrated-trust', 'People trust sure fields and check unsure ones.'],
    ['automation-bias', 'Flagging doubt stops people from accepting every value.'],
    ['von-restorff', 'Unsure fields stand out, so they get looked at.'],
  ],
  'ai-disclosure': [
    ['calibrated-trust', 'Readers can decide how much to rely on AI-made content.'],
    ['mental-model', 'People read differently when they know who, or what, wrote it.'],
  ],
  'explain-why': [
    ['transparency', 'Reasons show the work behind a recommendation.'],
    ['calibrated-trust', 'People can judge if the reasons are right.'],
    ['match', 'Plain reasons, not model scores.'],
  ],
  'memory-controls': [
    ['visibility', 'People see when something is saved, and what.'],
    ['control', 'People can edit, delete or turn memory off.'],
  ],
  'feedback-loop': [
    ['cognitive-load', 'One click is easy enough that people actually do it.'],
    ['peak-end', 'Fixing a bad answer right away improves how the whole session is remembered.'],
    ['minimalist', 'Feedback buttons stay quieter than the answer.'],
  ],
  'graceful-errors': [
    ['recover', 'Plain words and a next step get people moving again.'],
    ['loss-aversion', 'Keeping the person’s text avoids the pain of losing work.'],
    ['peak-end', 'A good recovery turns a low point into a good ending.'],
  ],
  'plan-first': [
    ['error-prevention', 'Fixing a plan is cheaper than fixing finished work.'],
    ['agency', 'People approve the plan, so they stay in charge.'],
    ['goal-gradient', 'A short plan shows how close the work is to done.'],
  ],
  'action-approval': [
    ['error-prevention', 'Risky actions pause for a check.'],
    ['habituation', 'Asking only when it matters keeps people reading the question.'],
    ['control', 'Cancel is as easy as Approve.'],
  ],
  'task-status': [
    ['visibility', 'A clear status shows what is running, done or waiting.'],
    ['control', 'People can leave, come back, or ask for a person.'],
    ['peak-end', 'A smooth handoff to a human ends a bad moment well.'],
  ],
  'contextual-nudge': [
    ['habituation', 'Offering help only at the right moment keeps it noticed.'],
    ['minimalist', 'One small chip instead of a pop-up.'],
    ['agency', 'Skipping is respected, so the person stays in charge.'],
  ],
  'reply-to-part': [
    ['cognitive-load', 'Pointing at text is easier than describing it.'],
    ['recognition', 'The quoted part stays visible, nothing to remember.'],
    ['control', 'Only the chosen part changes.'],
  ],
  'show-understanding': [
    ['visibility', 'A live transcript shows what was heard.'],
    ['error-prevention', 'Misreadings are caught before the AI acts.'],
    ['mental-model', 'People learn how the AI hears and sees.'],
  ],
  'autonomy-dial': [
    ['agency', 'People choose how much the agent may do.'],
    ['calibrated-trust', 'Freedom grows as the agent earns trust.'],
    ['error-prevention', 'Risky tasks stay supervised by default.'],
  ],
  'action-log': [
    ['transparency', 'A readable record shows the work behind the result.'],
    ['control', 'Undo and restore points give a way back.'],
    ['loss-aversion', 'Restore points remove the fear of losing work.'],
  ],
  'interrupt-redirect': [
    ['control', 'Pause is a clear way to step in.'],
    ['loss-aversion', 'Progress is kept, so stopping costs nothing.'],
    ['agency', 'People steer the task while it runs.'],
  ],
  'agent-handoff': [
    ['visibility', 'People can see which agent is doing which step right now.'],
    ['mental-model', 'A visible team of agents matches how the work really happens.'],
    ['calibrated-trust', 'Knowing which agent made a claim helps people judge it.'],
  ],
  'screen-control': [
    ['control', 'A big Take over button keeps the person in charge.'],
    ['error-prevention', 'Pausing at logins and payments stops costly mistakes.'],
    ['agency', 'People choose what the agent may touch, site by site.'],
  ],
  'connected-apps': [
    ['visibility', 'One list shows everything the AI can reach.'],
    ['transparency', 'Showing the source app next to an answer explains where it came from.'],
    ['control', 'One-tap disconnect makes it easy to say no.'],
  ],
  'cost-estimate': [
    ['visibility', 'The cost is visible before the action.'],
    ['loss-aversion', 'Surprise charges feel like a loss; estimates prevent them.'],
    ['error-prevention', 'A warning before the limit prevents half-finished tasks.'],
  ],
  'voice-turn-taking': [
    ['visibility', 'Listening, thinking and speaking each look different.'],
    ['match', 'Turn-taking and interrupting work like a real conversation.'],
    ['control', 'Talking over the AI takes the turn back.'],
  ],
  'read-back': [
    ['error-prevention', 'Misheard names and numbers are caught before acting.'],
    ['cognitive-load', 'Only the key details are read back, so it stays short.'],
  ],
  'point-to-edit': [
    ['cognitive-load', 'Pointing replaces describing a location in words.'],
    ['control', 'Only the selected area changes.'],
    ['agency', 'People decide exactly what the AI touches.'],
  ],
  'mode-switch': [
    ['working-memory', 'Spoken lists overload memory; a screen holds the details.'],
    ['recognition', 'Seeing options beats remembering them.'],
  ],
  'bias-check': [
    ['stereotype', 'Varied defaults avoid teaching narrow pictures of who does what.'],
    ['automation-bias', 'People tend to accept AI defaults as neutral, even when they are not.'],
    ['agency', 'Filters let people choose instead of the model assuming.'],
  ],
};

export const patternsUsing = (principleId) =>
  Object.entries(patternPrinciples)
    .filter(([, list]) => list.some(([id]) => id === principleId))
    .map(([patternId]) => patternId);

// Microsoft's 18 Guidelines for Human-AI Interaction (Amershi et al., CHI 2019),
// grouped by phase, with the patterns on this site that put each one into practice.
export const haxPhases = ['Initially', 'During interaction', 'When wrong', 'Over time'];

export const haxGuidelines = [
  { n: 1, phase: 'Initially', name: 'Make clear what the system can do', patterns: ['set-expectations', 'prompt-starters'] },
  { n: 2, phase: 'Initially', name: 'Make clear how well the system can do what it can do', patterns: ['set-expectations', 'confidence-signals'] },
  { n: 3, phase: 'During interaction', name: 'Time services based on context', patterns: ['contextual-nudge', 'inline-suggestions'] },
  { n: 4, phase: 'During interaction', name: 'Show contextually relevant information', patterns: ['visible-context', 'citations'] },
  { n: 5, phase: 'During interaction', name: 'Match relevant social norms', patterns: ['structured-controls', 'voice-turn-taking'] },
  { n: 6, phase: 'During interaction', name: 'Mitigate social biases', patterns: ['bias-check'] },
  { n: 7, phase: 'When wrong', name: 'Support efficient invocation', patterns: ['prompt-starters', 'reply-to-part'] },
  { n: 8, phase: 'When wrong', name: 'Support efficient dismissal', patterns: ['inline-suggestions', 'contextual-nudge'] },
  { n: 9, phase: 'When wrong', name: 'Support efficient correction', patterns: ['editable-output', 'reply-to-part', 'show-understanding'] },
  { n: 10, phase: 'When wrong', name: 'Scope services when in doubt', patterns: ['clarifying-questions', 'confidence-signals'] },
  { n: 11, phase: 'When wrong', name: 'Make clear why the system did what it did', patterns: ['explain-why', 'citations'] },
  { n: 12, phase: 'Over time', name: 'Remember recent interactions', patterns: ['memory-controls', 'regenerate-history'] },
  { n: 13, phase: 'Over time', name: 'Learn from user behavior', patterns: ['feedback-loop', 'memory-controls'] },
  { n: 14, phase: 'Over time', name: 'Update and adapt cautiously', patterns: ['autonomy-dial', 'preview-changes'] },
  { n: 15, phase: 'Over time', name: 'Encourage granular feedback', patterns: ['feedback-loop'] },
  { n: 16, phase: 'Over time', name: 'Convey the consequences of user actions', patterns: ['action-approval', 'cost-estimate', 'preview-changes', 'read-back'] },
  { n: 17, phase: 'Over time', name: 'Provide global controls', patterns: ['memory-controls', 'autonomy-dial'] },
  { n: 18, phase: 'Over time', name: 'Notify users about changes', patterns: ['memory-controls', 'task-status'] },
];
