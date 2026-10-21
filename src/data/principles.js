// UX principles and psychology behind the patterns.
// `type` groups them on the Principles page; `source` says where the idea comes from.

export const principleTypes = [
  { id: 'heuristic', name: 'Usability rules', blurb: 'Jakob Nielsen’s 10 usability rules from 1994. Designers still lean on them every day.' },
  { id: 'law', name: 'Laws of UX', blurb: 'Tested findings about how people see, choose and decide.' },
  { id: 'psychology', name: 'Psychology & trust', blurb: 'How people think, feel and decide who to trust, especially with AI.' },
];

export const principles = [
  // Nielsen heuristics
  { id: 'visibility', type: 'heuristic', name: 'Visibility of system status', def: 'Always show what’s going on. Nobody likes staring at a frozen screen.' },
  { id: 'control', type: 'heuristic', name: 'User control and freedom', def: 'Give people an easy way out: stop, undo, cancel.' },
  { id: 'error-prevention', type: 'heuristic', name: 'Error prevention', def: 'Stop mistakes before they happen, like asking before a risky action.' },
  { id: 'recognition', type: 'heuristic', name: 'Recognition rather than recall', def: 'Show the options. Picking is easier than remembering.' },
  { id: 'minimalist', type: 'heuristic', name: 'Aesthetic and minimalist design', def: 'Show only what matters right now. Everything extra fights for attention.' },
  { id: 'recover', type: 'heuristic', name: 'Help users recover from errors', def: 'When something breaks, say what happened in plain words and offer a way forward.' },
  { id: 'match', type: 'heuristic', name: 'Match with the real world', def: 'Use words people already know, not system talk.' },

  // Laws of UX
  { id: 'hicks', type: 'law', name: 'Hick’s law', def: 'More choices, slower decisions.' },
  { id: 'choice-overload', type: 'law', name: 'Choice overload', def: 'Too many similar options make choosing harder and less fun.' },
  { id: 'doherty', type: 'law', name: 'Doherty threshold', def: 'Reply in under about 0.4 seconds and people stay in the flow.' },
  { id: 'goal-gradient', type: 'law', name: 'Goal-gradient effect', def: 'The closer the finish line looks, the harder people push.' },
  { id: 'jakobs', type: 'law', name: 'Jakob’s law', def: 'People expect your product to work like the products they already use.' },
  { id: 'teslers', type: 'law', name: 'Tesler’s law', def: 'Some hard stuff never goes away. Let the product carry it, not the person.' },
  { id: 'peak-end', type: 'law', name: 'Peak-end rule', def: 'People remember the strongest moment, and the ending.' },
  { id: 'von-restorff', type: 'law', name: 'Von Restorff effect', def: 'The thing that looks different is the thing people notice and remember.' },

  // Psychology & trust
  { id: 'automation-bias', type: 'psychology', name: 'Automation bias', def: 'People tend to believe a machine, even when it’s wrong.' },
  { id: 'calibrated-trust', type: 'psychology', name: 'Calibrated trust', def: 'People should trust the AI exactly as much as it deserves. No more, no less.' },
  { id: 'mental-model', type: 'psychology', name: 'Mental models', def: 'What people believe a system can do. They act on that belief, right or wrong.' },
  { id: 'transparency', type: 'psychology', name: 'Operational transparency', def: 'People value a result more when they can see the work behind it.' },
  { id: 'ikea', type: 'psychology', name: 'IKEA effect', def: 'People love things more when they helped make them. Like that wobbly shelf you built.' },
  { id: 'loss-aversion', type: 'psychology', name: 'Loss aversion', def: 'Losing something hurts more than winning the same thing feels good.' },
  { id: 'agency', type: 'psychology', name: 'Sense of agency', def: 'People need to feel they’re in charge, not the machine.' },
  { id: 'cognitive-load', type: 'psychology', name: 'Cognitive load', def: 'Every extra thing to read, type or remember tires the brain a little.' },
  { id: 'habituation', type: 'psychology', name: 'Habituation', def: 'See a warning too often and you stop reading it.' },
  { id: 'stereotype', type: 'psychology', name: 'Stereotype reinforcement', def: 'Show the same people in the same jobs again and again, and people start to think it’s normal.' },
  { id: 'working-memory', type: 'psychology', name: 'Working memory limits', def: 'People can hold only a few things in their head at once, even fewer when listening.' },
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
    ['cognitive-load', 'Tapping a chip is easier than typing an answer.'],
  ],
  'visible-context': [
    ['visibility', 'People can see which file the AI is reading.'],
    ['mental-model', 'Showing what it reads clears up the idea that the AI “sees everything”.'],
    ['control', 'People can remove or add context.'],
  ],
  'structured-controls': [
    ['recognition', 'Tone and length are visible choices, not words to remember.'],
    ['teslers', 'The product writes the tricky prompt, so people don’t have to.'],
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
    ['calibrated-trust', '“Can make mistakes” keeps trust realistic.'],
    ['automation-bias', 'A visible reminder makes people check instead of copy.'],
  ],
  citations: [
    ['calibrated-trust', 'People can check a claim instead of trusting it blindly.'],
    ['automation-bias', 'Sources invite people to check, not just accept.'],
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
    ['match', 'Reasons in plain words, not model scores.'],
  ],
  'memory-controls': [
    ['visibility', 'People see when something is saved, and what.'],
    ['control', 'People can edit, delete or turn memory off.'],
  ],
  'feedback-loop': [
    ['cognitive-load', 'One click is easy enough that people actually do it.'],
    ['peak-end', 'Fixing a bad answer fast makes the whole chat feel better looking back.'],
    ['minimalist', 'Feedback buttons stay quieter than the answer.'],
  ],
  'graceful-errors': [
    ['recover', 'Plain words and a next step get people moving again.'],
    ['loss-aversion', 'Keeping the person’s text saves them the pain of lost work.'],
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
  'sandbox-preview': [
    ['error-prevention', 'Mistakes show up in the practice run, before they reach anyone.'],
    ['automation-bias', 'Seeing the real result stops people from trusting the AI blindly.'],
    ['control', 'People make it real with one tap, or fix it and run again.'],
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
    ['mental-model', 'Seeing the team of agents matches how the work really happens.'],
    ['calibrated-trust', 'Knowing which agent made a claim helps people judge it.'],
  ],
  'screen-control': [
    ['control', 'A big Take over button keeps the person in charge.'],
    ['error-prevention', 'Pausing at logins and payments stops costly mistakes.'],
    ['agency', 'People choose what the agent may touch, site by site.'],
  ],
  'connected-apps': [
    ['visibility', 'One list shows everything the AI can reach.'],
    ['transparency', 'The source app next to an answer shows where it came from.'],
    ['control', 'One-tap disconnect makes it easy to say no.'],
  ],
  'cost-estimate': [
    ['visibility', 'The cost is visible before the action.'],
    ['loss-aversion', 'Surprise charges sting. A price up front prevents them.'],
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
    ['cognitive-load', 'Pointing beats describing a spot in words.'],
    ['control', 'Only the selected area changes.'],
    ['agency', 'People decide exactly what the AI touches.'],
  ],
  'mode-switch': [
    ['working-memory', 'Long spoken lists are hard to hold in your head. A screen holds the details.'],
    ['recognition', 'Seeing options beats remembering them.'],
  ],
  'bias-check': [
    ['stereotype', 'Mixed defaults don’t teach a narrow picture of who does what.'],
    ['automation-bias', 'People take AI defaults as neutral, even when they aren’t.'],
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
  { n: 1, phase: 'Initially', name: 'Make clear what the system can do', plain: 'Say what the AI can help with, right from the start.', patterns: ['set-expectations', 'prompt-starters'] },
  { n: 2, phase: 'Initially', name: 'Make clear how well the system can do what it can do', plain: 'Be honest about how often it gets things wrong.', patterns: ['set-expectations', 'confidence-signals'] },
  { n: 3, phase: 'During interaction', name: 'Time services based on context', plain: 'Offer help when it’s useful, not in the middle of something.', patterns: ['contextual-nudge', 'inline-suggestions'] },
  { n: 4, phase: 'During interaction', name: 'Show contextually relevant information', plain: 'Show what fits the moment, like the file the person has open.', patterns: ['visible-context', 'citations'] },
  { n: 5, phase: 'During interaction', name: 'Match relevant social norms', plain: 'Talk and behave the way people expect from a polite helper.', patterns: ['structured-controls', 'voice-turn-taking'] },
  { n: 6, phase: 'During interaction', name: 'Mitigate social biases', plain: 'Don’t repeat unfair stereotypes about people.', patterns: ['bias-check'] },
  { n: 7, phase: 'When wrong', name: 'Support efficient invocation', plain: 'Make it quick to call the AI when you need it.', patterns: ['prompt-starters', 'reply-to-part'] },
  { n: 8, phase: 'When wrong', name: 'Support efficient dismissal', plain: 'Make it easy to ignore or close what you don’t want.', patterns: ['inline-suggestions', 'contextual-nudge'] },
  { n: 9, phase: 'When wrong', name: 'Support efficient correction', plain: 'Make it easy to fix or edit what the AI got wrong.', patterns: ['editable-output', 'reply-to-part', 'show-understanding'] },
  { n: 10, phase: 'When wrong', name: 'Scope services when in doubt', plain: 'When it’s not sure, ask or do less instead of guessing big.', patterns: ['clarifying-questions', 'confidence-signals'] },
  { n: 11, phase: 'When wrong', name: 'Make clear why the system did what it did', plain: 'Let people see why it gave that answer.', patterns: ['explain-why', 'citations'] },
  { n: 12, phase: 'Over time', name: 'Remember recent interactions', plain: 'Remember recent chats, so people don’t repeat themselves.', patterns: ['memory-controls', 'regenerate-history'] },
  { n: 13, phase: 'Over time', name: 'Learn from user behavior', plain: 'Get better from how each person uses it.', patterns: ['feedback-loop', 'memory-controls'] },
  { n: 14, phase: 'Over time', name: 'Update and adapt cautiously', plain: 'Change slowly, so the product never feels like a stranger.', patterns: ['autonomy-dial', 'preview-changes'] },
  { n: 15, phase: 'Over time', name: 'Encourage granular feedback', plain: 'Let people say exactly what they liked or didn’t.', patterns: ['feedback-loop'] },
  { n: 16, phase: 'Over time', name: 'Convey the consequences of user actions', plain: 'Show what will happen before the person acts.', patterns: ['action-approval', 'cost-estimate', 'preview-changes', 'read-back', 'sandbox-preview'] },
  { n: 17, phase: 'Over time', name: 'Provide global controls', plain: 'Give people settings that change how the AI behaves everywhere.', patterns: ['memory-controls', 'autonomy-dial'] },
  { n: 18, phase: 'Over time', name: 'Notify users about changes', plain: 'Tell people when the AI changes or learns something new.', patterns: ['memory-controls', 'task-status'] },
];
