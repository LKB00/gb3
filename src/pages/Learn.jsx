import { useTitle } from '../useTitle';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { lessons } from '../data/lessons';
import { usePassed } from '../progress';
import LibraryTabs from '../components/LibraryTabs';

const levels = ['Basics', 'Core', 'Advanced'];

export default function Learn() {
  useTitle('Deep dives');
  const passed = usePassed();
  return (
    <div className="page page-wide page-lib-read">
      <LibraryTabs />
      <header className="page-head">
        <h1 className="display">Deep dives</h1>
        <p className="lead">Short reads for when you want the full story behind the cards. Each one ends with cards to play.</p>
      </header>

      {levels.map((level) => (
        <section key={level} className="block">
          <p className="label">{level}</p>
          <ul className="index-list">
            {lessons.filter((l) => l.level === level).map((l) => (
              <li key={l.id}>
                <Link to={`/learn/${l.id}`} className="index-row index-row-num">
                  <span className="index-num">{lessons.indexOf(l) + 1}</span>
                  <span className="index-title">{l.title}</span>
                  <span className="index-sum">{l.intro}</span>
                  <span className="index-meta">{l.minutes} min read{l.patterns.length > 0 && ` · ${l.patterns.filter((pid) => passed.includes(pid)).length}/${l.patterns.length} cards`}</span>
                  <ChevronRight size={16} strokeWidth={1.75} className="index-chev" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
