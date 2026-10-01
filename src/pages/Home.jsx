import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Library, Target } from 'lucide-react';
import { patterns } from '../data/patterns';
import { lessons } from '../data/lessons';
import { hunts } from '../data/hunts';
import { useHuntsDone, usePassed } from '../progress';
import { useTitle } from '../useTitle';

const ARROW = { size: 15, strokeWidth: 1.75, 'aria-hidden': true };
const FIRST = 'streaming-response';

// Home has one job: get people started. One main button, then the three places.
export default function Home() {
  useTitle(null);
  const passed = usePassed();
  const huntsDone = useHuntsDone();
  const started = passed.length + huntsDone.length > 0;
  const next = passed.length === 0 ? patterns.find((p) => p.id === FIRST) : patterns.find((p) => !passed.includes(p.id));

  const places = [
    {
      to: '/learn',
      icon: BookOpen,
      title: 'Learn',
      text: 'Short lessons in order, from basics to AI agents.',
      meta: `${lessons.length} lessons`,
    },
    {
      to: '/practice',
      icon: Target,
      title: 'Practice',
      text: 'Build AI features in labs and find mistakes in real-looking screens.',
      meta: `${passed.length}/${patterns.length} labs · ${huntsDone.length}/${hunts.length} hunts`,
    },
    {
      to: '/patterns',
      icon: Library,
      title: 'Library',
      text: 'Look up any pattern, product teardown, principle or word.',
      meta: `${patterns.length} patterns`,
    },
  ];

  return (
    <div className="page">
      <header className="page-head home-hero">
        <p className="label">Learn AI interaction design by doing</p>
        <h1 className="display">Don’t just read about AI design. Practice it.</h1>
        <p className="lead">Make design decisions, see your mistakes right away, then learn why.</p>
        <div className="actions">
          {next ? (
            <Link to={`/patterns/${next.id}`} className="btn btn-primary btn-lg">
              {started ? `Continue: ${next.title}` : 'Start your first lab'} <ArrowRight {...ARROW} />
            </Link>
          ) : (
            <Link to="/practice" className="btn btn-primary btn-lg">Keep practicing <ArrowRight {...ARROW} /></Link>
          )}
        </div>
        <p className="small muted">{started ? 'Your progress is saved in this browser.' : 'About 1 minute. No sign-up.'}</p>
      </header>

      <nav className="places" aria-label="Where to go">
        {places.map(({ to, icon: Icon, title, text, meta }) => (
          <Link key={to} to={to} className="place">
            <Icon size={20} strokeWidth={1.5} aria-hidden />
            <strong>{title}</strong>
            <span>{text}</span>
            <span className="place-meta">{meta}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
