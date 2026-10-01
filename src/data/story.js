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

export const story = {
  title: 'Agent on duty',
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
          ui: [steps([['Archive old files', 'done'], ['Group into folders', 'now'], ['Write summary', 'todo']]), buttons(['Pause', 'Notify me when done'])],
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
