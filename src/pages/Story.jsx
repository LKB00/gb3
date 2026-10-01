import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Angry, ArrowRight, Frown, Meh, RotateCcw, Smile } from 'lucide-react';
import { story } from '../data/story';
import { getPattern } from '../data/patterns';
import { markPlayed, saveStory, useGameStats } from '../progress';
import MockFrame, { MockBlock } from '../mock/Mock';
import Breadcrumbs from '../components/Breadcrumbs';
import Burst, { XpPop } from '../components/Burst';
import { useTitle } from '../useTitle';

// Story mode: design an AI agent through one short story. Every choice changes
// how much Priya trusts it, and the ending depends on that trust.
// Why: choices with visible consequences are more gripping than single questions.
const clamp = (n) => Math.max(0, Math.min(100, n));
const mood = (t) => (t >= 75 ? Smile : t >= 50 ? Meh : t >= 25 ? Frown : Angry);
const tone = (t) => (t >= 75 ? 'good' : t >= 50 ? 'ok' : t >= 25 ? 'warn' : 'bad');

function TrustMeter({ trust, delta }) {
  const Face = mood(trust);
  return (
    <div className={`trust trust-${tone(trust)}`}>
      <Face size={22} strokeWidth={1.75} aria-hidden />
      <div className="trust-body">
        <div className="trust-top">
          <span>Priya’s trust</span>
          <strong>{trust}</strong>
          {delta != null && (
            <span key={`${trust}-${delta}`} className={'trust-delta ' + (delta >= 0 ? 'is-up' : 'is-down')}>
              {delta >= 0 ? `+${delta}` : delta}
            </span>
          )}
        </div>
        <span className="trust-bar" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={trust} aria-label="Priya’s trust">
          <span style={{ width: `${trust}%` }} />
        </span>
      </div>
    </div>
  );
}

export default function Story() {
  useTitle(story.title);
  const stats = useGameStats();
  const [sceneId, setSceneId] = useState(story.start);
  const [trust, setTrust] = useState(story.trustStart);
  const [picked, setPicked] = useState(null);
  const [history, setHistory] = useState([]);
  const [ended, setEnded] = useState(false);
  const [gain, setGain] = useState(0);

  const scene = story.scenes[sceneId];
  const choice = picked !== null ? scene.choices[picked] : null;
  const sceneNo = history.length + (picked === null ? 1 : 0);

  const pick = (i) => {
    if (picked !== null) return;
    const c = scene.choices[i];
    setPicked(i);
    markPlayed();
    setTrust((t) => clamp(t + c.trust));
    setHistory((h) => [...h, { scene: sceneId, choice: i }]);
  };

  const next = () => {
    const to = choice.next !== undefined ? choice.next : scene.next;
    if (to) {
      setSceneId(to);
      setPicked(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setGain(Math.max(0, Math.round(trust / 2) - Math.round(Math.max(0, stats.storyBest ?? 0) / 2)));
    saveStory(trust);
    setEnded(true);
  };

  const restart = () => {
    setSceneId(story.start);
    setTrust(story.trustStart);
    setPicked(null);
    setHistory([]);
    setEnded(false);
    setGain(0);
  };

  if (ended) {
    const ending = story.endings.find((e) => trust >= e.min);
    const Face = mood(trust);
    return (
      <div className="page page-wide">
        <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: story.title }]} />
        <div className={`story-end story-end-${ending.tone}`}>
          {ending.tone === 'good' && <Burst count={28} />}
          <Face size={40} strokeWidth={1.5} aria-hidden />
          <p className="label">Ending · trust {trust}/100</p>
          <h1 className="display">{ending.title}{gain > 0 && <XpPop amount={gain} />}</h1>
          <p className="lead">{ending.text}</p>
          <ol className="story-recap">
            {history.map((h, n) => {
              const sc = story.scenes[h.scene];
              const c = sc.choices[h.choice];
              return (
                <li key={n}>
                  <span className={'trust-delta ' + (c.trust >= 0 ? 'is-up' : 'is-down')}>{c.trust >= 0 ? `+${c.trust}` : c.trust}</span>
                  <span>
                    <span className="story-recap-scene">{sc.title}</span>
                    <strong>{c.label}</strong>
                    <Link to={`/patterns/${c.pattern}`} className="story-recap-pattern">{getPattern(c.pattern).title}</Link>
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="row wrap center">
            <button type="button" className="btn btn-primary btn-lg" onClick={restart}>
              <RotateCcw size={15} strokeWidth={1.75} aria-hidden /> Play again
            </button>
            <Link to="/play" className="btn btn-ghost btn-lg">More games</Link>
          </div>
          {stats.storyBest != null && <p className="small muted">Your best ending so far: trust {Math.max(stats.storyBest, trust)}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="page page-wide">
      <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: story.title }]} />
      <header className="story-head">
        <div>
          <p className="label">Scene {sceneNo} · {scene.title}</p>
          <h1 className="display">{story.title}</h1>
        </div>
        <TrustMeter trust={trust} delta={choice ? choice.trust : null} />
      </header>

      <div className="story">
        <div className="story-panel">
          <p className="story-setup">{scene.setup}</p>
          <h2 className="story-q">{scene.question}</h2>
          <div className="story-choices">
            {scene.choices.map((c, i) => {
              const on = picked === i;
              return (
                <button
                  key={i}
                  type="button"
                  className={'story-choice' + (on ? ` is-picked is-${c.trust >= 0 ? 'up' : 'down'}` : '') + (picked !== null && !on ? ' is-dim' : '')}
                  onClick={() => pick(i)}
                  disabled={picked !== null}
                >
                  <span className="story-choice-key">{String.fromCharCode(65 + i)}</span>
                  {c.label}
                </button>
              );
            })}
          </div>

          {choice && (
            <div className={'story-outcome ' + (choice.trust >= 0 ? 'is-up' : 'is-down')} aria-live="polite">
              <span className="story-avatar" aria-hidden>P</span>
              <div>
                <p>{choice.reaction}</p>
                <p className="small">
                  Pattern: <Link to={`/patterns/${choice.pattern}`}>{getPattern(choice.pattern).title}</Link>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="story-screen">
          <p className="label">What Priya sees</p>
          <MockFrame title={story.app}>
            {scene.screen.map((b, k) => <MockBlock key={k} b={b} />)}
            {choice ? (
              choice.ui.map((b, k) => <MockBlock key={`u${k}`} b={b} state={choice.trust >= 0 ? 'good' : 'bad'} />)
            ) : (
              <div className="m-slot-empty m-slot-focus">Your choice shows here</div>
            )}
          </MockFrame>
        </div>

        {choice && (
          <div className="lab-nav story-nav">
            <button type="button" className="btn btn-primary" onClick={next}>
              {(choice.next !== undefined ? choice.next : scene.next) ? 'Next scene' : 'See the ending'} <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
