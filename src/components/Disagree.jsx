import { MessageSquareWarning } from 'lucide-react';

// "I disagree": opens a ready-to-send GitHub issue, so players can flag an answer
// they think is wrong. Design is rarely black and white; we want to hear it.
const REPO = 'https://github.com/LKB00/gb3/issues/new';

export default function Disagree({ where, detail }) {
  const title = `I disagree: ${where}`;
  const body = `**Where:** ${where}\n**What the game said:** ${detail || '(fill in)'}\n\n**Why I disagree:**\n\n\n---\nPage: ${window.location.href}`;
  const href = `${REPO}?${new URLSearchParams({ title, body, labels: 'feedback' }).toString()}`;
  return (
    <a className="disagree" href={href} target="_blank" rel="noreferrer" title="Think this answer is wrong? Tell us on GitHub.">
      <MessageSquareWarning size={13} strokeWidth={1.75} aria-hidden /> I disagree
    </a>
  );
}
