import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Lightbulb, ThumbsUp } from 'lucide-react';
import { getTeardown, teardowns } from '../data/teardowns';
import { getPattern } from '../data/patterns';
import { useTitle } from '../useTitle';
import NotFound from './NotFound';
import LibraryTabs from '../components/LibraryTabs';
import Breadcrumbs from '../components/Breadcrumbs';

const NOTE = 'Based on well-known public features; products change often. Not affiliated with these companies. Product names belong to their owners.';

export function TeardownList() {
  useTitle('Teardowns');
  return (
    <div className="page page-wide page-lib-read">
      <LibraryTabs />
      <header className="page-head">
        <h1 className="display">How real AI products use the patterns</h1>
        <p className="lead">Step-by-step breakdowns of well-known AI products: which patterns they use at each stage, what works, and what could be better.</p>
      </header>
      <div className="block">
        <ul className="index-list">
          {teardowns.map((t) => (
            <li key={t.id}>
              <Link to={`/teardowns/${t.id}`} className="index-row index-row-icon">
                <span className="ex-mark td-mark" aria-hidden>{t.product[0]}</span>
                <span className="index-title">{t.product}</span>
                <span className="index-sum">{t.type} · {t.journey.length} stages · {new Set(t.journey.flatMap((j) => j.patterns)).size} patterns</span>
                <ChevronRight size={16} strokeWidth={1.75} className="index-chev" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        <p className="footnote">{NOTE}</p>
      </div>
    </div>
  );
}

export function TeardownDetail() {
  const { id } = useParams();
  const t = getTeardown(id);
  useTitle(t ? `${t.product} teardown` : null);
  if (!t) return <NotFound />;
  const used = [...new Set(t.journey.flatMap((j) => j.patterns))];

  return (
    <article className="page">
      <Breadcrumbs items={[{ label: 'Explore', to: '/teardowns' }, { label: 'Teardowns', to: '/teardowns' }, { label: t.product }]} />
      <header className="page-head">
        <div className="td-head">
          <span className="ex-mark td-mark-lg" aria-hidden>{t.product[0]}</span>
          <div>
            <p className="label">{t.type} · {t.company}</p>
            <h1 className="display">{t.product}</h1>
          </div>
        </div>
        <p className="lead">{t.summary}</p>
      </header>

      <section className="block">
        <div className="section-head">
          <h2>The journey, stage by stage</h2>
          <p className="section-sub">What happens at each moment, and the pattern behind it.</p>
        </div>
        <ol className="td-journey">
          {t.journey.map((j, i) => (
            <li key={j.stage} className="td-step">
              <span className="td-num">{i + 1}</span>
              <div className="td-body">
                <p className="label">{j.stage}</p>
                <p>{j.what}</p>
                <div className="row">
                  {j.patterns.map((pid) => (
                    <Link key={pid} to={`/patterns/${pid}`} className={`tag tag-${getPattern(pid).category}`}>{getPattern(pid).title}</Link>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="block">
        <h2>What works</h2>
        <ul className="rule-list rule-do">
          {t.works.map((w) => <li key={w}><ThumbsUp size={14} strokeWidth={2} aria-hidden />{w}</li>)}
        </ul>
      </section>

      <section className="block">
        <div className="section-head">
          <h2>What could be better</h2>
          <p className="section-sub">Our suggestions, using patterns from this site.</p>
        </div>
        <ul className="rule-list td-better">
          {t.better.map((b) => (
            <li key={b.text}>
              <Lightbulb size={14} strokeWidth={2} aria-hidden />
              <span>
                {b.text}{' '}
                <Link to={`/patterns/${b.pattern}`} className="text-link">{getPattern(b.pattern).title}</Link>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="block">
        <h2>Patterns used ({used.length})</h2>
        <div className="row wrap">
          {used.map((pid) => <Link key={pid} to={`/patterns/${pid}`} className="chip">{getPattern(pid).title}</Link>)}
        </div>
        <p className="footnote">{NOTE}</p>
      </section>
    </article>
  );
}
