import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { haxGuidelines, haxPhases, principleTypes, principles, patternsUsing } from '../data/principles';
import { getPattern } from '../data/patterns';
import { useTitle } from '../lib/useTitle';
import LibraryTabs from '../components/LibraryTabs';

// Card links open "Why it works" (?view=understand): this is a place to read, not to play.
// Long lists show the first few and a "+N more" button, so the rules stay louder than the links.
const SHOW = 4;
function CardLinks({ ids }) {
  const [all, setAll] = useState(false);
  const fold = !all && ids.length > SHOW + 1; // never hide just one
  const shown = fold ? ids.slice(0, SHOW) : ids;
  return (
    <>
      {shown.map((pid) => (
        <Link key={pid} to={`/patterns/${pid}?view=understand`} className="chip chip-sm">{getPattern(pid).title}</Link>
      ))}
      {fold && (
        <button type="button" className="chip chip-sm chip-more" onClick={() => setAll(true)} aria-label={`Show ${ids.length - SHOW} more cards`}>
          +{ids.length - SHOW} more
        </button>
      )}
    </>
  );
}

export default function Principles() {
  useTitle('Principles');
  const [params] = useSearchParams();
  const focus = params.get('focus');

  useEffect(() => {
    // Wait one frame: the app scrolls to the top on every page change first.
    if (!focus) return;
    const t = setTimeout(() => document.getElementById(`pr-${focus}`)?.scrollIntoView({ block: 'center' }), 50);
    return () => clearTimeout(t);
  }, [focus]);

  // HashRouter owns the # in the address, so scroll by hand instead of following the link.
  const jump = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ block: 'start' });
  };

  return (
    <div className="page page-wide page-lib-read">
      <LibraryTabs />
      <header className="page-head">
        <h1 className="display">Why the patterns work</h1>
        <p className="lead">Every pattern leans on how people think and feel. Here are the rules behind them, each linked to its cards.</p>
        {/* A quiet map of the page: four long sections, one tap to each */}
        <nav className="pr-jump" aria-label="On this page">
          {principleTypes.map((t) => <a key={t.id} href={`#pr-type-${t.id}`} onClick={(e) => jump(e, `pr-type-${t.id}`)}>{t.name}</a>)}
          <a href="#hax" onClick={(e) => jump(e, 'hax')}>Microsoft’s 18</a>
        </nav>
      </header>

      {principleTypes.map((t) => (
        <section key={t.id} id={`pr-type-${t.id}`} className="block pr-block">
          <div className="section-head">
            <h2>{t.name}</h2>
            <p className="section-sub">{t.blurb}</p>
          </div>
          <ul className="pr-index">
            {principles.filter((p) => p.type === t.id).map((p) => (
              <li key={p.id} id={`pr-${p.id}`} className={'pr-entry' + (focus === p.id ? ' pr-entry-focus' : '')}>
                <h3>{p.name}</h3>
                <p>{p.def}</p>
                <div className="row">
                  <span className="label">Used in</span>
                  <CardLinks ids={patternsUsing(p.id)} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="block" id="hax">
        <div className="section-head">
          <h2>Microsoft’s 18 guidelines for human-AI interaction</h2>
          <p className="section-sub">
            A famous checklist from Microsoft Research, Amershi et al., CHI 2019. Grouped by when each one matters, with the cards that put it to work.
          </p>
        </div>
        {haxPhases.map((phase) => (
          <div key={phase} className="hax-phase">
            <p className="label">{phase}</p>
            <ol className="hax-list">
              {haxGuidelines.filter((g) => g.phase === phase).map((g) => (
                <li key={g.n} className="hax-item">
                  <span className="index-num">{g.n}</span>
                  <span>
                    <span className="hax-name">{g.name}</span>
                    {g.plain && <span className="small muted hax-plain">{g.plain}</span>}
                  </span>
                  <span className="hax-links">
                    {g.patterns.length ? (
                      <CardLinks ids={g.patterns} />
                    ) : (
                      <span className="footnote">No card for this one yet. Test your AI with lots of different people.</span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ))}
        <p className="footnote">Guideline names come from Microsoft Research’s HAX Toolkit. The links to cards are our own pick.</p>
      </section>
    </div>
  );
}
