import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Angry, ArrowRight, ChefHat, CodeXml, FolderOpen, Frown, Landmark, Meh, RotateCcw, Smile } from 'lucide-react';
import { getStory, stories } from '../data/story';
import { getPattern } from '../data/patterns';
import { clearRun, markPlayed, readStoryRun, saveRun, saveStoryBest, storyBests, useGameStats } from '../progress';
import MockFrame, { MockBlock } from '../mock/Mock';
import Breadcrumbs from '../components/Breadcrumbs';
import Burst, { XpPop } from '../components/Burst';
import { useTitle } from '../lib/useTitle';
import { fx } from '../game/fx';
import { track } from '../game/track';
import Disagree from '../components/Disagree';
import { PeekLink } from '../components/PatternPeek';
import { useReveal } from '../lib/useReveal';

// Story mode: design an AI agent through one short story. Every choice changes
// how much the person trusts it, and the ending depends on that trust.
// Why: choices with visible consequences are more gripping than single questions.
const clamp = (n) => Math.max(0, Math.min(100, n));
const mood = (t) => (t >= 75 ? Smile : t >= 50 ? Meh : t >= 25 ? Frown : Angry);
const tone = (t) => (t >= 75 ? 'good' : t >= 50 ? 'ok' : t >= 25 ? 'warn' : 'bad');

const signed = (n) => (n > 0 ? `+${n}` : String(n));

// After an ending: the next story without its best ending yet, else simply the next one.
function nextStory(story, bests) {
  const k = stories.indexOf(story);
  const after = [...stories.slice(k + 1), ...stories.slice(0, k)];
  return after.find((s) => (bests[s.id] ?? -1) < s.endings[0].min) || after[0];
}

function TrustMeter({ trust, delta, person }) {
  const Face = mood(trust);
  return (
    <div className={`trust trust-${tone(trust)}`}>
      <Face size={22} strokeWidth={1.75} aria-hidden />
      <div className="trust-body">
        <div className="trust-top">
          <span>{person}’s trust</span>
          <strong>{trust}</strong>
          {delta != null && (
            <span key={`${trust}-${delta}`} className={'trust-delta ' + (delta >= 0 ? 'is-up' : 'is-down')}>
              {signed(delta)}
            </span>
          )}
        </div>
        <span className="trust-bar" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={trust} aria-label={`${person}’s trust`}>
          <span style={{ width: `${trust}%` }} />
        </span>
      </div>
    </div>
  );
}

// What each story's AI is about, shown on its picker card (a letter looked like an answer "A").
const STORY_ICONS = { tidy: FolderOpen, nova: ChefHat, sage: Landmark, pilot: CodeXml };

// Story picker: one card per story, with your best trust. One card is marked as the place to start:
// the first story without its best ending yet, so the page has one clear "play this".
function StoryPicker() {
  useTitle('Stories');
  const stats = useGameStats();
  const best = storyBests(stats);
  const fresh = !stories.some((st) => best[st.id] != null);
  const up = stories.find((st) => (best[st.id] ?? -1) < st.endings[0].min);
  return (
    <div className="page page-wide">
      <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: 'Stories' }]} />
      <header className="page-head page-head-tight">
        <h1 className="display">Stories</h1>
        <p className="lead">Design the AI in a short story. Every choice wins or loses a person’s trust, and their trust picks the ending.</p>
      </header>
      <div className="story-picks">
        {stories.map((st) => {
          const Icon = STORY_ICONS[st.id] || Smile;
          const isUp = st === up;
          return (
            <Link key={st.id} to={`/play/story/${st.id}`} className={'story-pick' + (isUp ? ' is-up' : '')} style={{ background: `var(--p-${st.color})` }}>
              <span className="story-pick-top">
                <span className="story-avatar story-icon" aria-hidden><Icon size={18} strokeWidth={1.75} /></span>
                <strong>{st.title}</strong>
                {isUp && <span className="story-pick-flag">{fresh ? 'Start here' : 'Up next'}</span>}
              </span>
              <span>{st.teaser}</span>
              <span className="game-meta">
                {st.person} · {st.role}
                {best[st.id] != null && <> · best trust: {best[st.id]}/100</>}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function StoryRoute() {
  const { id } = useParams();
  const story = id ? getStory(id) : null;
  if (!id) return <StoryPicker />;
  if (!story) return <StoryPicker />;
  return <Story key={story.id} story={story} />;
}

function Story({ story }) {
  useTitle(story.title);
  const stats = useGameStats();
  // A run in progress (this tab) picks up where it was: a link, Back or a refresh never restarts the story.
  const [saved] = useState(() => readStoryRun(story));
  const [sceneId, setSceneId] = useState(saved?.sceneId ?? story.start);
  const [trust, setTrust] = useState(saved?.trust ?? story.trustStart);
  const [picked, setPicked] = useState(saved?.picked ?? null);
  const [history, setHistory] = useState(saved?.history ?? []);
  const [ended, setEnded] = useState(false);
  const [gain, setGain] = useState(0);
  const runKey = 'story:' + story.id;
  useEffect(() => {
    if (ended) clearRun(runKey);
    else saveRun(runKey, { sceneId, trust, picked, history });
  }, [runKey, sceneId, trust, picked, history, ended]);

  const scene = story.scenes[sceneId];
  const choice = picked !== null ? scene.choices[picked] : null;
  const sceneNo = history.length + (picked === null ? 1 : 0);
  const outcomeRef = useReveal(choice ? `${sceneNo}-${picked}` : null);
  const lastDelta = choice ? history[history.length - 1]?.delta ?? choice.trust : 0;
  // Keyboard players: after a pick, the choices are disabled, so move focus to the Next button.
  const nextRef = useRef(null);
  useEffect(() => {
    if (picked !== null) nextRef.current?.focus({ preventScroll: true });
  }, [picked]);

  const pick = (i) => {
    if (picked !== null) return;
    const c = scene.choices[i];
    setPicked(i);
    markPlayed();
    fx(c.trust >= 0 ? 'trustUp' : 'trustDown');
    // The real change: trust stops at 0 and 100, so "-30" from 10 is really -10.
    const delta = clamp(trust + c.trust) - trust;
    setTrust(trust + delta);
    setHistory((h) => [...h, { scene: sceneId, choice: i, delta }]);
  };

  const next = () => {
    const to = choice.next !== undefined ? choice.next : scene.next;
    if (to) {
      setSceneId(to);
      setPicked(null);
      const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: calm ? 'instant' : 'smooth' });
      return;
    }
    const prev = storyBests(stats)[story.id];
    setGain(Math.max(0, Math.round(trust / 2) - Math.round(Math.max(0, prev ?? 0) / 2)));
    saveStoryBest(story.id, trust);
    track('Game finished', { game: `story-${story.id}`, score: trust });
    fx(trust >= 50 ? 'win' : 'wrong');
    setEnded(true);
  };

  const restart = () => {
    setSceneId(story.start);
    setTrust(story.trustStart);
    setPicked(null);
    setHistory([]);
    setEnded(false);
    setGain(0);
    window.scrollTo(0, 0);
  };

  if (ended) {
    const ending = story.endings.find((e) => trust >= e.min);
    const Face = mood(trust);
    const after = nextStory(story, { ...storyBests(stats), [story.id]: Math.max(storyBests(stats)[story.id] ?? 0, trust) });
    return (
      <div className="page page-wide">
        <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: 'Stories', to: '/play/story' }, { label: story.title }]} />
        <div className={`story-end story-end-${ending.tone}`}>
          {ending.tone === 'good' && <Burst count={28} />}
          <Face size={40} strokeWidth={1.5} aria-hidden />
          <p className="label">The end · final trust {trust}/100</p>
          <h1 className="display">{ending.title}{gain > 0 && <XpPop amount={gain} />}</h1>
          <p className="lead">{ending.text}</p>
          {ending !== story.endings[0] && <p className="small">The best ending needs trust {story.endings[0].min}. Play again and swap the choices that lost trust.</p>}
          {/* The next step comes right after the ending; the recap of choices is below it, for reading. */}
          <div className="row wrap center">
            <Link to={`/play/story/${after.id}`} className="btn btn-primary btn-lg">
              Next story: {after.title} <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
            </Link>
            <button type="button" className="btn btn-ghost btn-lg" onClick={restart}>
              <RotateCcw size={15} strokeWidth={1.75} aria-hidden /> Play again
            </button>
          </div>
          {storyBests(stats)[story.id] != null && <p className="small muted">Your best so far: trust {Math.max(storyBests(stats)[story.id], trust)}/100</p>}
          <p className="label story-recap-title">Your choices</p>
          <ol className="story-recap">
            {history.map((h, n) => {
              const sc = story.scenes[h.scene];
              const c = sc.choices[h.choice];
              return (
                <li key={n}>
                  <span className={'trust-delta ' + (c.trust >= 0 ? 'is-up' : 'is-down')}>{signed(h.delta ?? c.trust)}</span>
                  <span>
                    <span className="story-recap-scene">{sc.title}</span>
                    <strong>{c.label}</strong>
                    <PeekLink id={c.pattern} className="story-recap-pattern">{getPattern(c.pattern).title}</PeekLink>
                  </span>
                </li>
              );
            })}
          </ol>
          <Link to="/play" className="text-link">More games <ArrowRight size={14} strokeWidth={1.75} aria-hidden /></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-wide">
      <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: 'Stories', to: '/play/story' }, { label: story.title }]} />
      <header className="story-head">
        <div>
          <p className="label">Scene {sceneNo} · {scene.title}</p>
          <h1 className="display">{story.title}</h1>
          {/* The how-to line is needed once; after scene 1 the question and trust meter say it all. */}
          {history.length === 0 && <p className="small muted story-how">You design {story.agent}. Pick what it does. Keep {story.person} on your side.</p>}
        </div>
        <TrustMeter trust={trust} delta={choice ? lastDelta : null} person={story.person} />
      </header>

      <div className="story">
        <div className="story-panel" key={`panel-${sceneNo}`}>
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
            <div ref={outcomeRef} className={'story-outcome ' + (choice.trust >= 0 ? 'is-up' : 'is-down')} aria-live="polite">
              <span className="story-avatar" aria-hidden>{story.person[0]}</span>
              <div>
                <p>{choice.reaction}</p>
                <p className="small">
                  Trust {signed(lastDelta)} · The trick: <PeekLink id={choice.pattern}>{getPattern(choice.pattern).title}</PeekLink> · <Disagree where={`Story · ${story.title} · ${scene.title}`} detail={`“${choice.label}” changed trust by ${choice.trust}.`} />
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="story-screen" key={`screen-${sceneNo}`}>
          <p className="label">What {story.person} sees</p>
          <MockFrame title={story.app}>
            {scene.screen.map((b, k) => <MockBlock key={k} b={b} />)}
            {choice ? (
              choice.ui.map((b, k) => <MockBlock key={`u${k}`} b={b} state={choice.trust >= 0 ? 'good' : 'bad'} />)
            ) : (
              <div className="m-slot-empty m-slot-focus">Pick a choice. {story.person} sees it here.</div>
            )}
          </MockFrame>
        </div>

        {choice && (
          <div className="lab-nav story-nav">
            <button ref={nextRef} type="button" className="btn btn-primary" onClick={next}>
              {(choice.next !== undefined ? choice.next : scene.next) ? 'Next scene' : 'See how it ends'} <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
