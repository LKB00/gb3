import { useTitle } from '../useTitle';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { lessons } from '../data/lessons';

const levels = ['Basics', 'Core', 'Advanced'];

export default function Learn() {
  useTitle('Learning path');
  return (
    <div className="page">
      <header className="page-head">
        <p className="label">Learning path</p>
        <h1 className="display">From basics to AI agents</h1>
        <p className="lead">{lessons.length} short lessons, about {lessons.reduce((n, l) => n + l.minutes, 0)} minutes in total. Each one links to patterns you can try.</p>
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
                  <span className="index-meta">{l.minutes} min</span>
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
