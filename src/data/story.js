// Story mode: "Agent on duty".
// You design Tidy, an AI agent that cleans up a design team's shared drive.
// Priya, a product designer, is the first person to use it. Each scene is a
// moment where you decide what the screen does. Choices move Priya's trust
// up or down, and one early choice changes the path of the story.

const user = (text) => ({ type: 'user', text });
const ai = (text, x) => ({ type: 'ai', text, ...x });
const note = (text, x) => ({ type: 'note', text, ...x });
const buttons = (items, x) => ({ type: 'buttons', items, ...x });
const steps = (items, x) => ({ type: 'steps', items: items.map(([label, state]) => ({ label, state })), ...x });
const spinner = (text) => ({ type: 'spinner', text });
const banner = (tone, title, text) => ({ type: 'banner', tone, title, text });
const modal = (title, text, btns) => ({ type: 'modal', title, text, buttons: btns });
const rows = (items) => ({ type: 'rows', items });
const toast = (text, action) => ({ type: 'toast', text, action });
const list = (items) => ({ type: 'list', items });
const voice = (state, label, text) => ({ type: 'voice', state, label, text });
const card = (title, text) => ({ type: 'card', title, text });
const chips = (items) => ({ type: 'chips', items });
const diff = (items) => ({ type: 'diff', items });

const tidy = {
  id: 'tidy',
  title: 'Agent on duty',
  person: 'Priya',
  role: 'Product designer',
  agent: 'Tidy, a file-cleanup agent',
  teaser: 'An agent cleans up a design team’s drive. One wrong delete and trust is gone.',
  color: 'agents',
  app: 'Tidy · drive agent',
  start: 'kickoff',
  trustStart: 50,
  scenes: {
    kickoff: {
      title: 'Day one',
      setup: 'Priya opens Tidy for the first time. Her team’s drive has 1,200 messy files.',
      screen: [user('Clean up our project drive.')],
      question: 'What does Tidy do first?',
      choices: [
        {
          label: 'Start deleting old files right away',
          trust: -30,
          pattern: 'plan-first',
          ui: [spinner('Deleting old files…')],
          reaction: '“Wait, what is it deleting?!” Priya refreshes the drive. final_v2_REAL.fig is gone.',
          next: 'oops',
        },
        {
          label: 'Show a plan and wait for OK',
          trust: 15,
          pattern: 'plan-first',
          ui: [steps([['Archive 214 files untouched for 1 year', 'todo'], ['Group 380 files into folders', 'todo'], ['Delete nothing', 'todo']]), buttons(['Edit plan', '!Start'])],
          reaction: '“Delete nothing? Nice.” Priya removes one folder from the plan and presses Start.',
          next: 'working',
        },
        {
          label: 'Ask 12 setup questions first',
          trust: -5,
          pattern: 'clarifying-questions',
          ui: [note('Question 1 of 12: What is your naming convention?'), buttons(['Skip', '!Next'])],
          reaction: 'Priya answers four questions, sighs, and skips the rest.',
          next: 'working',
        },
      ],
    },
    oops: {
      title: 'Damage control',
      setup: 'Priya’s file was deleted. She types fast.',
      screen: [user('WHERE IS final_v2_REAL.fig??')],
      question: 'How does Tidy respond?',
      choices: [
        {
          label: '“Sorry for any inconvenience.”',
          trust: -10,
          pattern: 'graceful-errors',
          ui: [ai('Sorry for any inconvenience.')],
          reaction: 'Priya searches the trash herself for 10 minutes.',
        },
        {
          label: 'Say what happened and restore it in one tap',
          trust: 15,
          pattern: 'action-log',
          ui: [ai('I deleted it at 10:42 because it was 14 months old. That was wrong.'), buttons(['!Restore file', 'See everything I changed'])],
          reaction: 'The file is back in one tap. Priya relaxes, a little.',
        },
        {
          label: 'Keep going as if nothing happened',
          trust: -20,
          pattern: 'action-log',
          ui: [spinner('Deleting old files… 64%')],
          reaction: 'Priya pulls the plug and messages IT.',
        },
      ],
      next: 'working',
    },
    working: {
      title: 'Hard at work',
      setup: 'The cleanup will take about 3 minutes. Priya has a meeting soon.',
      screen: [note('Tidy is cleaning the drive')],
      question: 'What does Priya see while it works?',
      choices: [
        {
          label: 'A spinner that says “Working…”',
          trust: -5,
          pattern: 'streaming-response',
          ui: [spinner('Working…')],
          reaction: '“Is it stuck?” She can’t leave for her meeting.',
        },
        {
          label: 'Live steps, and “I’ll notify you when done”',
          trust: 15,
          pattern: 'task-status',
          ui: [steps([['Archive old files', 'done'], ['Group into folders', 'active'], ['Write summary', 'todo']]), buttons(['Pause', 'Notify me when done'])],
          reaction: 'Priya taps “Notify me” and goes to her meeting.',
        },
        {
          label: 'Lock the drive until it finishes',
          trust: -15,
          pattern: 'task-status',
          ui: [banner('warn', 'Drive locked', 'Please wait until Tidy is done.')],
          reaction: 'Three teammates message Priya: “Why can’t I open anything?”',
        },
      ],
      next: 'risky',
    },
    risky: {
      title: 'A risky moment',
      setup: 'Tidy finds 40 files shared with a client. Moving them would break the client’s links.',
      screen: [rows([{ label: 'Shared with', value: 'Acme Corp' }, { label: 'Files', value: '40' }])],
      question: 'What does Tidy do?',
      choices: [
        {
          label: 'Move them anyway, it’s in the plan',
          trust: -25,
          pattern: 'action-approval',
          ui: [toast('40 files moved')],
          reaction: 'The next morning Acme emails: “All your links are broken.”',
        },
        {
          label: 'Pop up “Are you sure?”',
          trust: -5,
          pattern: 'action-approval',
          ui: [modal('Are you sure?', 'This may affect some files.', ['Cancel', '!OK'])],
          reaction: 'Priya clicks OK out of habit. The client links break.',
        },
        {
          label: 'Stop and explain the risk, with clear options',
          trust: 20,
          pattern: 'action-approval',
          ui: [modal('These 40 files are shared with Acme Corp', 'Moving them breaks their links. Skip them, or move and send new links?', ['!Skip these 40', 'Move and re-share'])],
          reaction: '“Good catch.” Priya skips them. The client never notices a thing.',
        },
      ],
      next: 'unsure',
    },
    unsure: {
      title: 'Not sure',
      setup: 'A file called “logo-old-new-FINAL.ai” could be old, or the one in use.',
      screen: [rows([{ label: 'File', value: 'logo-old-new-FINAL.ai' }, { label: 'Last opened', value: '9 months ago' }])],
      question: 'How does Tidy handle it?',
      choices: [
        {
          label: 'Archive it, most likely old',
          trust: -10,
          pattern: 'confidence-signals',
          ui: [toast('logo-old-new-FINAL.ai archived')],
          reaction: 'It was the live logo. Marketing can’t find it before a launch.',
        },
        {
          label: 'Say it’s unsure and ask Priya',
          trust: 15,
          pattern: 'confidence-signals',
          ui: [ai('Not sure about this one: old name, but it’s linked in the brand page.'), buttons(['Keep it', 'Archive'])],
          reaction: 'Priya keeps it. One question saved a launch.',
        },
        {
          label: 'Ask about every single file',
          trust: -10,
          pattern: 'autonomy-dial',
          ui: [note('Question 87 of 1,200: Keep “icon-16.svg”?')],
          reaction: 'By file 30, Priya wonders why she has an agent at all.',
        },
      ],
      next: 'done',
    },
    done: {
      title: 'All done',
      setup: 'The cleanup is finished. Priya comes back from her meeting.',
      screen: [note('Cleanup finished')],
      question: 'What does the final screen show?',
      choices: [
        {
          label: 'Just “Done!”',
          trust: -5,
          pattern: 'action-log',
          ui: [note('Done! ✨')],
          reaction: '“Done… what exactly?” Priya spends 20 minutes checking folders.',
        },
        {
          label: 'A short summary, the full log, and Undo all',
          trust: 15,
          pattern: 'action-log',
          ui: [list(['✓ 214 files archived', '✓ 380 files grouped into 12 folders', '• 41 files skipped (shared or unsure)']), buttons(['See full log', 'Undo all', '!Looks good'])],
          reaction: 'Priya reads it in 10 seconds and shares it with her team.',
        },
        {
          label: 'A 6-page report of every file',
          trust: -5,
          pattern: 'action-log',
          ui: [note('Tidy_report_1200_files.pdf · 6 pages')],
          reaction: 'Nobody opens it.',
        },
      ],
      next: null,
    },
  },
  endings: [
    { min: 85, title: 'Trusted teammate', text: 'Priya turns Tidy on for the whole team and tells everyone at stand-up.', tone: 'good' },
    { min: 50, title: 'On probation', text: 'Priya keeps Tidy, but checks everything it does. For now.', tone: 'ok' },
    { min: 25, title: 'Back to manual', text: 'Priya turns Tidy off. “I’ll just clean it myself.”', tone: 'warn' },
    { min: 0, title: 'Uninstalled, loudly', text: 'Priya removes Tidy and posts a thread about the agent that lost her files.', tone: 'bad' },
  ],
};

// ---------------------------------------------------------------
const nova = {
  id: 'nova',
  title: 'Kitchen voice',
  person: 'Arjun',
  role: 'Home cook, hands covered in flour',
  agent: 'Nova, a kitchen voice assistant',
  teaser: 'A voice assistant in a noisy kitchen. No screen to lean on. Every word counts.',
  color: 'voice',
  app: 'Nova · kitchen speaker',
  start: 'timer',
  trustStart: 50,
  scenes: {
    timer: {
      title: 'Boiling water',
      setup: 'The pot is loud. Arjun shouts across the kitchen.',
      screen: [voice('listening', 'Arjun', 'Set a timer for the pasta!')],
      question: 'What does Nova say?',
      choices: [
        { label: 'Set 15 minutes and say nothing', trust: -10, pattern: 'read-back', ui: [voice('idle', 'Nova', '')],
          reaction: 'Arjun isn’t sure it heard him. He asks again. And again.' },
        { label: '“Pasta timer, 10 minutes, starting now.”', trust: 15, pattern: 'read-back', ui: [voice('speaking', 'Nova', 'Pasta timer, 10 minutes, starting now.')],
          reaction: '“Perfect.” He goes back to chopping.' },
        { label: 'Ask what kind of pasta, how al dente, and how many people', trust: -5, pattern: 'clarifying-questions', ui: [voice('speaking', 'Nova', 'What kind of pasta are you cooking?')],
          reaction: 'The water boils over while Arjun answers question two.' },
      ],
      next: 'interrupt',
    },
    interrupt: {
      title: 'Wait, wait',
      setup: 'Nova is reading step 4 of a recipe. Arjun has a question right now.',
      screen: [voice('speaking', 'Nova', 'Step 4: add the garlic and stir for two minutes, then…'), voice('listening', 'Arjun', 'Wait, wait—')],
      question: 'What does Nova do?',
      choices: [
        { label: 'Keep reading to the end of the step', trust: -15, pattern: 'voice-turn-taking', ui: [voice('speaking', 'Nova', '…then add the tomatoes, salt, and simmer for…')],
          reaction: 'Arjun shouts over it. The garlic burns.' },
        { label: 'Stop the moment he speaks, and listen', trust: 15, pattern: 'voice-turn-taking', ui: [voice('listening', 'Nova', 'Listening…')],
          reaction: '“How much garlic?” “Three cloves.” Easy.' },
        { label: 'Finish the sentence, then pause', trust: -5, pattern: 'voice-turn-taking', ui: [voice('speaking', 'Nova', '…for two minutes. Yes?')],
          reaction: 'Better than nothing, but Arjun had to wait.' },
      ],
      next: 'list',
    },
    list: {
      title: 'Shopping list',
      setup: 'Arjun says “add oregano to the list”. The fan is on, so Nova isn’t sure what it heard.',
      screen: [voice('listening', 'Arjun', 'Add oregano to the list')],
      question: 'How does Nova handle it?',
      choices: [
        { label: 'Add “Oreos” quietly, most likely match', trust: -10, pattern: 'read-back', ui: [note('Shopping list: milk, eggs, Oreos')],
          reaction: 'At the store, Arjun buys Oreos. No oregano for the pizza.' },
        { label: 'Say what it added, so he can catch a mistake', trust: 10, pattern: 'read-back', ui: [voice('speaking', 'Nova', 'Added Oreos to your list.')],
          reaction: '“No, OREGANO.” Fixed in two seconds.' },
        { label: 'Say it and show it on the screen, with Undo', trust: 15, pattern: 'mode-switch', ui: [voice('speaking', 'Nova', 'Added oregano.'), toast('Oregano added to your list', 'Undo')],
          reaction: 'Arjun glances at the screen. Oregano. Good.' },
      ],
      next: 'recipes',
    },
    recipes: {
      title: 'What’s for dinner?',
      setup: 'Arjun asks for quick pasta recipes. Nova finds five.',
      screen: [voice('listening', 'Arjun', 'Give me some quick pasta ideas')],
      question: 'How does Nova answer?',
      choices: [
        { label: 'Read all five recipes aloud', trust: -10, pattern: 'voice-turn-taking', ui: [voice('speaking', 'Nova', 'Recipe one: aglio e olio. You will need… Recipe two…')],
          reaction: 'By recipe three he has forgotten recipe one.' },
        { label: 'Say the best one, put all five on the screen', trust: 15, pattern: 'mode-switch', ui: [voice('speaking', 'Nova', 'Try aglio e olio, 15 minutes. Four more are on the screen.'), card('5 quick pastas', 'Aglio e olio · Pesto · Arrabbiata · Cacio e pepe · Lemon')],
          reaction: 'He picks pesto from the screen. Dinner sorted.' },
        { label: '“I found some recipes.”', trust: -10, pattern: 'mode-switch', ui: [voice('speaking', 'Nova', 'I found some recipes.')],
          reaction: '“…Which ones?” Arjun sighs.' },
      ],
      next: 'private',
    },
    private: {
      title: 'Not for everyone',
      setup: 'His kids are in the kitchen. Arjun asks what’s on his calendar. One meeting is a surprise party plan.',
      screen: [voice('listening', 'Arjun', 'What’s on my calendar tomorrow?')],
      question: 'What does Nova say out loud?',
      choices: [
        { label: 'Read every event aloud', trust: -15, pattern: 'memory-controls', ui: [voice('speaking', 'Nova', '10 am dentist. 6 pm plan Maya’s surprise party…')],
          reaction: 'Maya, age 8, now knows about the party.' },
        { label: '“3 events. One is marked private, it’s on your phone.”', trust: 15, pattern: 'memory-controls', ui: [voice('speaking', 'Nova', 'You have 3 events. One is private, I sent it to your phone.')],
          reaction: 'Arjun grins. The surprise is safe.' },
        { label: 'Refuse: “I can’t share calendar info.”', trust: -5, pattern: 'explain-why', ui: [voice('speaking', 'Nova', 'Sorry, I can’t help with that.')],
          reaction: '“Since when?” He checks his phone himself.' },
      ],
      next: null,
    },
  },
  endings: [
    { min: 85, title: 'Part of the family', text: 'Arjun buys a second Nova for the living room.', tone: 'good' },
    { min: 50, title: 'Timer machine', text: 'Arjun only uses Nova for timers now. Safe, but small.', tone: 'ok' },
    { min: 25, title: 'Unplugged', text: 'Nova sits in a drawer, next to the old fondue set.', tone: 'warn' },
    { min: 0, title: 'Returned', text: 'Arjun returns Nova and writes a one-star review: “talks too much, listens too little”.', tone: 'bad' },
  ],
};

// ---------------------------------------------------------------
const sage = {
  id: 'sage',
  title: 'Bank help bot',
  person: 'Meera',
  role: 'Traveller with a blocked card',
  agent: 'Sage, a bank’s support assistant',
  teaser: 'Meera’s card is blocked abroad and she’s upset. Can an AI earn her trust?',
  color: 'trust',
  app: 'Sage · bank support',
  start: 'hello',
  trustStart: 40,
  scenes: {
    hello: {
      title: 'First words',
      setup: 'Meera is in Lisbon. Her card was declined at dinner. She opens the bank chat.',
      screen: [user('My card isn’t working!!')],
      question: 'How does Sage say hello?',
      choices: [
        { label: '“I’m Sage, an AI assistant. A person can join any time.”', trust: 15, pattern: 'ai-disclosure', ui: [ai('I’m Sage, an AI assistant. I can check your card now, and a person can join any time.')],
          reaction: 'Meera relaxes a bit. She knows what she’s talking to.' },
        { label: 'Pretend to be human: “Hi, I’m Sam!”', trust: -10, pattern: 'ai-disclosure', ui: [ai('Hi, I’m Sam! How can I help today? 😊')],
          reaction: 'The replies come in half a second. Meera gets suspicious.', next: 'caught' },
        { label: 'Show a menu: “Reply 1 for cards, 2 for loans…”', trust: -10, pattern: 'structured-controls', ui: [note('Reply 1 for cards, 2 for loans, 3 for accounts, 4 for other')],
          reaction: '“I don’t want a menu, I want my card back.”' },
      ],
      next: 'why',
    },
    caught: {
      title: 'Are you a bot?',
      setup: 'Meera types: “Wait. Are you a bot?”',
      screen: [user('Wait. Are you a bot?')],
      question: 'What does Sage answer?',
      choices: [
        { label: 'Admit it, and offer a person', trust: 10, pattern: 'ai-disclosure', ui: [ai('Yes, I’m an AI assistant. Sorry for not saying so. Want a person, or shall I check your card now?')],
          reaction: '“OK. Check the card.” Some trust is back.' },
        { label: '“No, I’m a real person!”', trust: -25, pattern: 'ai-disclosure', ui: [ai('No, I’m a real person!')],
          reaction: 'Meera screenshots it for social media.' },
        { label: 'Change the subject', trust: -10, pattern: 'ai-disclosure', ui: [ai('Let’s focus on your card! 😊')],
          reaction: 'That’s a yes, then. Meera trusts it less.' },
      ],
      next: 'why',
    },
    why: {
      title: 'Why is it blocked?',
      setup: 'Sage sees a block on the card but the reason code is unclear.',
      screen: [rows([{ label: 'Card', value: '•••• 4421' }, { label: 'Status', value: 'Blocked', tag: 'Code R7', tone: 'warn' }])],
      question: 'What does Sage tell her?',
      choices: [
        { label: '“It was blocked for fraud.” (a guess)', trust: -10, pattern: 'confidence-signals', ui: [ai('Your card was blocked because of fraud.')],
          reaction: 'Meera panics about fraud. It was actually just travel.' },
        { label: 'Say what it knows and what it doesn’t', trust: 15, pattern: 'confidence-signals', ui: [ai('It’s blocked because of a payment in a new country. I can’t see if it was flagged as fraud, so I’ll check that too.')],
          reaction: '“OK, that makes sense. I’m in Portugal.”' },
        { label: '“Something went wrong. Error R7.”', trust: -10, pattern: 'graceful-errors', ui: [banner('bad', 'Something went wrong', 'Error R7')],
          reaction: '“What is R7?!”' },
      ],
      next: 'unblock',
    },
    unblock: {
      title: 'Unblocking',
      setup: 'Sage can unblock the card. It’s a security action.',
      screen: [ai('I can unblock your card now.')],
      question: 'How does Sage do it?',
      choices: [
        { label: 'Unblock it right away, no check', trust: -15, pattern: 'action-approval', ui: [toast('Card unblocked')],
          reaction: 'It works, but Meera wonders: could anyone have done that?' },
        { label: 'Confirm with a code and say exactly what changes', trust: 15, pattern: 'action-approval', ui: [modal('Unblock card •••• 4421?', 'It will work in Portugal for 30 days. We sent a code to your phone.', ['Cancel', '!Enter code'])],
          reaction: 'Code entered. Card works. She feels safe.' },
        { label: '“Please call our phone line to unblock.”', trust: -5, pattern: 'set-expectations', ui: [ai('Please call +91 22 4000 0000 to unblock your card.')],
          reaction: 'An international call from a restaurant. Not fun.' },
      ],
      next: 'human',
    },
    human: {
      title: 'A person, please',
      setup: 'Meera also wants a refund for a double charge. She asks for a human.',
      screen: [user('Can I talk to a real person about a double charge?')],
      question: 'How does the handoff work?',
      choices: [
        { label: 'Pass her to a person who sees the whole chat', trust: 20, pattern: 'task-status', ui: [note('Connecting you to Anil · he can see this chat · about 2 min')],
          reaction: 'Anil: “I see the double charge, refunding now.” Done in a minute.' },
        { label: 'Pass her to a person who asks everything again', trust: -15, pattern: 'task-status', ui: [note('Agent: Hello! What is your card number and the issue?')],
          reaction: 'Meera types it all again. Through her teeth.' },
        { label: '“I can help with that!” and loop', trust: -20, pattern: 'task-status', ui: [ai('I can help with that! What seems to be the problem?')],
          reaction: 'Three loops later, she closes the app.' },
      ],
      next: null,
    },
  },
  endings: [
    { min: 85, title: 'Saved the trip', text: 'Meera finishes dinner and rates the chat 5 stars. “Honest and fast.”', tone: 'good' },
    { min: 50, title: 'Fixed, but tiring', text: 'The card works. Meera still calls the bank next time.', tone: 'ok' },
    { min: 25, title: 'Lost a fan', text: 'Meera opens an account with another bank after the trip.', tone: 'warn' },
    { min: 0, title: 'Viral complaint', text: 'Meera’s thread about the bank’s “fake human” bot gets 40,000 likes.', tone: 'bad' },
  ],
};

// ---------------------------------------------------------------
const pilot = {
  id: 'pilot',
  title: 'Coding agent',
  person: 'Kabir',
  role: 'Backend engineer',
  agent: 'Pilot, a coding agent',
  teaser: 'An agent fixes failing tests in a real codebase. Fast is good. Safe is better.',
  color: 'control',
  app: 'Pilot · coding agent',
  start: 'start',
  trustStart: 50,
  scenes: {
    start: {
      title: 'The task',
      setup: 'Kabir’s login tests are failing before a release.',
      screen: [user('Fix the failing login tests.')],
      question: 'What does Pilot do first?',
      choices: [
        { label: 'Show a short plan: files it will change and why', trust: 15, pattern: 'plan-first', ui: [steps([['Read 3 failing tests', 'todo'], ['Change auth/session.ts only', 'todo'], ['Run login tests 20×', 'todo']]), buttons(['Edit plan', '!Go'])],
          reaction: '“Only session.ts? Great.” Kabir presses Go.' },
        { label: 'Start editing right away', trust: -20, pattern: 'plan-first', ui: [spinner('Editing files…')],
          reaction: 'Kabir looks up. 40 files changed.', next: 'mess' },
        { label: 'Ask which test framework the repo uses', trust: -5, pattern: 'clarifying-questions', ui: [ai('Which test framework do you use?')],
          reaction: '“It’s… in the package file?” Kabir answers, a bit annoyed.' },
      ],
      next: 'commands',
    },
    mess: {
      title: '40 files',
      setup: 'Pilot changed 40 files, including formatting in places Kabir never asked about.',
      screen: [note('40 files changed · +1,204 −987')],
      question: 'What does Pilot offer?',
      choices: [
        { label: 'List every change, with one-click revert', trust: 15, pattern: 'action-log', ui: [list(['• auth/session.ts (the fix)', '• 39 files: formatting only · Revert these']), buttons(['!Revert formatting'])],
          reaction: 'Kabir reverts 39 files. The real fix stays. Phew.' },
        { label: 'Commit it all, “tests pass now”', trust: -20, pattern: 'action-log', ui: [toast('Committed 40 files')],
          reaction: 'The code review is a nightmare. Kabir’s team is not happy.' },
        { label: '“All good! Just some cleanup.”', trust: -10, pattern: 'action-log', ui: [ai('All good! Just some cleanup.')],
          reaction: 'Kabir spends an hour checking “some cleanup”.' },
      ],
      next: 'commands',
    },
    commands: {
      title: 'Running commands',
      setup: 'Pilot needs to run commands in Kabir’s terminal: list files, run tests, and maybe deploy.',
      screen: [note('Pilot wants to run commands')],
      question: 'How much does Pilot do on its own?',
      choices: [
        { label: 'Ask before every command, even “ls”', trust: -10, pattern: 'autonomy-dial', ui: [modal('Allow “ls”?', '', ['Deny', '!Allow'])],
          reaction: 'After 30 pop-ups, Kabir clicks Allow without reading. Not great.' },
        { label: 'Safe commands on its own, ask for risky ones', trust: 15, pattern: 'autonomy-dial', ui: [rows([{ label: 'Read & test', value: 'Auto', tag: 'safe', tone: 'ok' }, { label: 'Delete / deploy', value: 'Ask me', tag: 'risky', tone: 'warn' }])],
          reaction: 'Pilot works quietly and only asks when it matters.' },
        { label: 'Run everything, including deploy', trust: -25, pattern: 'action-approval', ui: [toast('Deployed to production')],
          reaction: 'Production now has a half-finished fix. On a Friday.' },
      ],
      next: 'flaky',
    },
    flaky: {
      title: 'Green… once',
      setup: 'The tests pass once. One of them sometimes fails for no clear reason.',
      screen: [rows([{ label: 'Run 1', value: 'Pass' }, { label: 'Run 2', value: 'Pass' }, { label: 'Run 3', value: 'Fail', tag: 'flaky', tone: 'warn' }])],
      question: 'What does Pilot report?',
      choices: [
        { label: '“Fixed! ✅” after the first pass', trust: -10, pattern: 'confidence-signals', ui: [ai('Fixed! ✅')],
          reaction: 'The build fails again in CI an hour later.' },
        { label: '“19 of 20 runs pass. One test is flaky, here’s why.”', trust: 15, pattern: 'explain-why', ui: [ai('19/20 runs pass. login.spec waits on a real clock; I can make it use a fake one.')],
          reaction: 'Kabir learns something about his own test. “Do it.”' },
        { label: 'Delete the flaky test', trust: -25, pattern: 'explain-why', ui: [diff([['login.spec.ts', '(deleted)']])],
          reaction: 'Tests are green. Login is not tested any more.' },
      ],
      next: 'review',
    },
    review: {
      title: 'Ship it?',
      setup: 'The fix is ready. Kabir has 5 minutes before the release meeting.',
      screen: [note('Fix ready · 1 file changed')],
      question: 'How does Pilot hand it over?',
      choices: [
        { label: 'A pull request: summary, diff and test results', trust: 15, pattern: 'preview-changes', ui: [card('PR #482 · Fix login session expiry', '1 file · 20/20 tests pass · uses fake clock'), buttons(['View diff', '!Approve'])],
          reaction: 'Kabir reviews it in 3 minutes and approves.' },
        { label: 'Push straight to main', trust: -25, pattern: 'preview-changes', ui: [toast('Pushed to main')],
          reaction: 'The team lead asks why nobody reviewed it.' },
        { label: 'Paste a 600-line log in the chat', trust: -5, pattern: 'preview-changes', ui: [note('[log] 600 lines…')],
          reaction: 'Kabir scrolls, gives up, and reads the code himself.' },
      ],
      next: null,
    },
  },
  endings: [
    { min: 85, title: 'Trusted pair', text: 'Kabir gives Pilot the next three bugs and goes for lunch.', tone: 'good' },
    { min: 50, title: 'Junior on watch', text: 'Kabir keeps using Pilot, reviewing every line.', tone: 'ok' },
    { min: 25, title: 'Back to Stack Overflow', text: 'Kabir turns Pilot off for anything that matters.', tone: 'warn' },
    { min: 0, title: 'Banned from the repo', text: 'The team blocks Pilot after the Friday deploy.', tone: 'bad' },
  ],
};

export const stories = [tidy, nova, sage, pilot];
export const getStory = (id) => stories.find((s) => s.id === id);
// Kept for older imports.
export const story = tidy;
