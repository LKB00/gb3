import { Link } from 'react-router-dom';
import { lessons } from '../data/lessons';

const levels = ['Basics', 'Core', 'Advanced'];

export default function Learn() {
  let n = 0;
  return (
    <div className="container page narrow">
      <h1>Learning path</h1>
      <p className="lead">
        Go from “what is different about AI?” to designing trustworthy AI features. Each lesson is short and links to patterns with live demos.
      </p>

      {levels.map((level) => (
        <section key={level} className="level">
          <h2>{level}</h2>
          <ol className="lesson-list">
            {lessons.filter((l) => l.level === level).map((l) => {
              n += 1;
              return (
                <li key={l.id}>
                  <Link to={`/learn/${l.id}`} className="card lesson-card">
                    <span className="path-num">{n}</span>
                    <span className="lesson-card-body">
                      <strong>{l.title}</strong>
                      <span className="demo-muted">{l.intro}</span>
                      <span className="small demo-muted">{l.minutes} min read{l.patterns.length ? ` · ${l.patterns.length} patterns` : ''}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
