import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { getLesson, lessons } from '../data/lessons';
import { getPattern } from '../data/patterns';
import { visuals } from '../data/visuals';
import Compare from '../components/Compare';
import NotFound from './NotFound';

export default function Lesson() {
  const { id } = useParams();
  const lesson = getLesson(id);
  if (!lesson) return <NotFound />;

  const idx = lessons.indexOf(lesson);
  const prev = lessons[idx - 1];
  const next = lessons[idx + 1];

  return (
    <article className="page">
      <header className="page-head">
        <p className="label">Lesson {idx + 1} of {lessons.length} · {lesson.level} · {lesson.minutes} min</p>
        <h1 className="display">{lesson.title}</h1>
        <p className="lead">{lesson.intro}</p>
      </header>

      {lesson.sections.map((s) => (
        <section key={s.heading} className="block">
          <h2>{s.heading}</h2>
          <p className="prose">{s.text}</p>
          {s.visual && (
            <div className="lesson-visual">
              <Compare data={visuals[s.visual].compare} />
              <Link to={`/patterns/${s.visual}#lab`} className="text-link">
                Try {getPattern(s.visual).title} in the Design Lab <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
              </Link>
            </div>
          )}
        </section>
      ))}

      <section className="block">
        <h2>Key takeaways</h2>
        <ul className="rule-list rule-do">
          {lesson.takeaways.map((t) => <li key={t}><Check size={14} strokeWidth={2} aria-hidden />{t}</li>)}
        </ul>
      </section>

      <section className="block">
        <h2>Try this</h2>
        <p className="prose">{lesson.exercise}</p>
      </section>

      {lesson.patterns.length > 0 && (
        <section className="block">
          <h2>Patterns in this lesson</h2>
          <div className="row wrap">
            {lesson.patterns.map((pid) => (
              <Link key={pid} to={`/patterns/${pid}`} className="chip">{getPattern(pid).title}</Link>
            ))}
          </div>
        </section>
      )}

      <nav className="pager" aria-label="More lessons">
        {prev ? (
          <Link to={`/learn/${prev.id}`} className="pager-link">
            <span className="label">Previous</span>
            <span><ArrowLeft size={14} strokeWidth={1.75} aria-hidden /> {prev.title}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`/learn/${next.id}`} className="pager-link pager-next">
            <span className="label">Next lesson</span>
            <span>{next.title} <ArrowRight size={14} strokeWidth={1.75} aria-hidden /></span>
          </Link>
        ) : (
          <Link to="/practice" className="pager-link pager-next">
            <span className="label">Next</span>
            <span>Practice <ArrowRight size={14} strokeWidth={1.75} aria-hidden /></span>
          </Link>
        )}
      </nav>
    </article>
  );
}
