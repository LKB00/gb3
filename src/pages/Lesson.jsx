import { Link, useParams } from 'react-router-dom';
import { getLesson, lessons } from '../data/lessons';
import { getPattern } from '../data/patterns';
import PatternCard from '../components/PatternCard';
import NotFound from './NotFound';

export default function Lesson() {
  const { id } = useParams();
  const lesson = getLesson(id);
  if (!lesson) return <NotFound />;

  const idx = lessons.indexOf(lesson);
  const prev = lessons[idx - 1];
  const next = lessons[idx + 1];

  return (
    <article className="container page narrow">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/learn">Learning path</Link> / Lesson {idx + 1} of {lessons.length}
      </nav>
      <p className="eyebrow">{lesson.level} · {lesson.minutes} min</p>
      <h1>{lesson.title}</h1>
      <p className="lead">{lesson.intro}</p>

      <div className="progress" aria-hidden>
        <span style={{ width: `${((idx + 1) / lessons.length) * 100}%` }} />
      </div>

      {lesson.sections.map((s) => (
        <section key={s.heading} className="lesson-section">
          <h2>{s.heading}</h2>
          <p>{s.text}</p>
        </section>
      ))}

      <aside className="panel panel-accent">
        <h2>Key takeaways</h2>
        <ul className="list list-check">{lesson.takeaways.map((t) => <li key={t}>{t}</li>)}</ul>
      </aside>

      <aside className="panel exercise">
        <h2>✏️ Try this</h2>
        <p>{lesson.exercise}</p>
      </aside>

      {lesson.patterns.length > 0 && (
        <section>
          <h2>Patterns in this lesson</h2>
          <div className="card-grid">
            {lesson.patterns.map((pid) => <PatternCard key={pid} pattern={getPattern(pid)} />)}
          </div>
        </section>
      )}

      <nav className="pager" aria-label="More lessons">
        {prev ? <Link to={`/learn/${prev.id}`}>← {prev.title}</Link> : <span />}
        {next ? <Link to={`/learn/${next.id}`}>Next: {next.title} →</Link> : <Link to="/patterns">Explore all patterns →</Link>}
      </nav>
    </article>
  );
}
