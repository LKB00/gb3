import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Circle, FlaskConical } from 'lucide-react';
import { getLesson, lessons } from '../data/lessons';
import { getPattern } from '../data/patterns';
import { visuals } from '../data/visuals';
import Compare from '../components/Compare';
import { useTitle } from '../lib/useTitle';
import { usePassed } from '../progress';
import NotFound from './NotFound';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Lesson() {
  const { id } = useParams();
  const lesson = getLesson(id);
  useTitle(lesson?.title);
  const passed = usePassed();
  if (!lesson) return <NotFound />;

  const idx = lessons.indexOf(lesson);
  const prev = lessons[idx - 1];
  const next = lessons[idx + 1];

  return (
    <article className="page">
      <Breadcrumbs items={[{ label: 'Explore', to: '/teardowns' }, { label: 'Deep dives', to: '/learn' }, { label: lesson.title }]} />
      <header className="page-head page-head-tight">
        <p className="label">Deep dive · {lesson.minutes} min read</p>
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
              <Link to={`/patterns/${s.visual}`} className="text-link">
                Play the {getPattern(s.visual).title} card <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
              </Link>
            </div>
          )}
        </section>
      ))}

      <section className="block">
        <h2>Remember this</h2>
        <ul className="rule-list rule-do">
          {lesson.takeaways.map((t) => <li key={t}><Check size={14} strokeWidth={2} aria-hidden />{t}</li>)}
        </ul>
      </section>

      <section className="block">
        <h2>Try it at work</h2>
        <p className="prose">{lesson.exercise}</p>
      </section>

      {lesson.patterns.length > 0 && (
        <section className="block do-it">
          <div className="section-head">
            <p className="label"><FlaskConical size={12} strokeWidth={2} aria-hidden /> Your turn</p>
            <h2>Play the cards from this read</h2>
            <p className="section-sub">
              {lesson.patterns.filter((pid) => passed.includes(pid)).length} of {lesson.patterns.length} collected. About a minute each.
            </p>
          </div>
          <span className="meter" aria-hidden>
            <span style={{ width: `${(lesson.patterns.filter((pid) => passed.includes(pid)).length / lesson.patterns.length) * 100}%` }} />
          </span>
          <ul className="index-list">
            {lesson.patterns.map((pid) => (
              <li key={pid}>
                <Link to={`/patterns/${pid}`} className={'index-row index-row-icon' + (passed.includes(pid) ? ' index-done' : '')}>
                  {passed.includes(pid) ? (
                    <Check size={16} strokeWidth={2} className="index-check-on" aria-label="Collected" />
                  ) : (
                    <Circle size={16} strokeWidth={1.5} className="index-check-off" aria-label="Not done yet" />
                  )}
                  <span className="index-title">{getPattern(pid).title}</span>
                  <span className="index-sum">{passed.includes(pid) ? 'Collected' : 'Play to collect'}</span>
                  <ArrowRight size={16} strokeWidth={1.75} className="index-chev" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="pager" aria-label="More deep dives">
        {prev ? (
          <Link to={`/learn/${prev.id}`} className="pager-link">
            <span className="label">Previous</span>
            <span><ArrowLeft size={14} strokeWidth={1.75} aria-hidden /> {prev.title}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`/learn/${next.id}`} className="pager-link pager-next">
            <span className="label">Next deep dive</span>
            <span>{next.title} <ArrowRight size={14} strokeWidth={1.75} aria-hidden /></span>
          </Link>
        ) : (
          <Link to="/play" className="pager-link pager-next">
            <span className="label">Next</span>
            <span>Play a game <ArrowRight size={14} strokeWidth={1.75} aria-hidden /></span>
          </Link>
        )}
      </nav>
    </article>
  );
}
