import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, Swords, Timer, X, Zap } from 'lucide-react';
import { makeDeck } from '../game/decks';
import { seeded, shuffle } from '../lib/random';
import { challengeLink, useChallenge, verdict } from '../game/challenge';
import { fx } from '../game/fx';
import { track } from '../game/track';
import { markPlayed, saveSpeed, useGameStats, XP } from '../progress';
import MockFrame, { MockBlock } from '../mock/Mock';
import Breadcrumbs from '../components/Breadcrumbs';
import CountUp from '../components/CountUp';
import Burst, { XpPop } from '../components/Burst';
import { useTitle } from '../lib/useTitle';

// Speed round: 60 seconds, as many "which is better?" picks as you can.
// 3 right in a row turns on a ×2 combo; a wrong pick costs 1 point. No explanations mid-round, just pace;
// the patterns are linked on the score screen.
const SECONDS = 60;

// Same seed = same rounds in the same order, so a friend can play your exact run.
const newSeed = () => Math.random().toString(36).slice(2, 10);
function freshDeck(seed) {
  const rng = seeded(`speed:${seed}`);
  return shuffle([...makeDeck('classic', 999, rng), ...makeDeck('hard', 999, rng)], rng);
}

export default function Speed() {
  useTitle('Speed round');
  const stats = useGameStats();
  const challenge = useChallenge();
  const [seed, setSeed] = useState(() => challenge?.seed || newSeed());
  const [phase, setPhase] = useState('ready'); // ready | count | play | over
  const [count, setCount] = useState(3);
  const [deck, setDeck] = useState(() => freshDeck(seed));
  const [i, setI] = useState(0);
  const [left, setLeft] = useState(SECONDS * 1000);
  const [points, setPoints] = useState(0);
  const [right, setRight] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [combo, setCombo] = useState(0);
  const [flash, setFlash] = useState(null); // { n, ok }
  const [result, setResult] = useState(null);
  const endAt = useRef(0);
  const lastTick = useRef(SECONDS);
  const pointsRef = useRef(0);

  // The first run of a challenge uses the friend's seed; "Play again" gets a new one.
  const start = (sameSeed = false) => {
    const s = sameSeed ? seed : newSeed();
    setSeed(s);
    setDeck(freshDeck(s));
    setI(0);
    setPoints(0);
    pointsRef.current = 0;
    setRight(0);
    setAnswered(0);
    setCombo(0);
    setFlash(null);
    setResult(null);
    setLeft(SECONDS * 1000);
    setCount(3);
    setPhase('count');
  };

  // Focus mode: on phones the top and bottom bars hide while the clock runs.
  useEffect(() => {
    const on = phase === 'play' || phase === 'count';
    document.body.classList.toggle('focus-mode', on);
    return () => document.body.classList.remove('focus-mode');
  }, [phase]);

  // 3 · 2 · 1 countdown
  useEffect(() => {
    if (phase !== 'count') return;
    if (count === 0) {
      fx('go');
      endAt.current = Date.now() + SECONDS * 1000;
      lastTick.current = SECONDS;
      setPhase('play');
      return;
    }
    fx('tick');
    const t = setTimeout(() => setCount((c) => c - 1), 700);
    return () => clearTimeout(t);
  }, [phase, count]);

  // The clock
  useEffect(() => {
    if (phase !== 'play') return;
    const t = setInterval(() => {
      const ms = Math.max(0, endAt.current - Date.now());
      setLeft(ms);
      const s = Math.ceil(ms / 1000);
      if (s <= 5 && s < lastTick.current && s > 0) fx('tick');
      lastTick.current = s;
      if (ms === 0) {
        clearInterval(t);
        const best = stats.speedBest || 0;
        const final = pointsRef.current;
        setResult({ record: final > best, gain: Math.max(0, final - best) * XP.speed });
        saveSpeed(final);
        track('Game finished', { game: 'speed', score: final });
        fx(final > best && final > 0 ? 'win' : 'timeup');
        setPhase('over');
      }
    }, 100);
    return () => clearInterval(t);
  }, [phase, stats.speedBest]);

  const round = deck[i % deck.length];
  const sides = round.goodFirst ? ['good', 'bad'] : ['bad', 'good'];

  const choose = useCallback(
    (n) => {
      if (phase !== 'play' || flash) return;
      const ok = (n === 0) === round.goodFirst;
      markPlayed();
      if (!ok) fx('wrong');
      else if (combo + 1 >= 3) fx('combo', { streak: combo + 1 });
      else fx('right', { streak: combo });
      setAnswered((a) => a + 1);
      if (ok) {
        const gain = combo + 1 >= 3 ? 2 : 1;
        pointsRef.current += gain;
        setPoints(pointsRef.current);
        setRight((r) => r + 1);
        setCombo((c) => c + 1);
      } else {
        // A wrong pick costs a point, so random tapping doesn't pay.
        pointsRef.current = Math.max(0, pointsRef.current - 1);
        setPoints(pointsRef.current);
        setCombo(0);
      }
      setFlash({ n, ok });
      setTimeout(() => {
        setFlash(null);
        setI((x) => x + 1);
      }, ok ? 320 : 650);
    },
    [phase, flash, round.goodFirst, combo]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') choose(0);
      if (e.key === 'ArrowRight' || e.key === 'b') choose(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [choose]);

  const [copied, setCopied] = useState(false);
  const share = async () => {
    const link = challengeLink('/play/speed', { seed, vs: points });
    const text = `⚡ I scored ${points} in the AI Patterns speed round. Same screens, same order. Can you beat me? ${link}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* blocked */
    }
  };

  const secs = Math.ceil(left / 1000);

  return (
    <div className="page page-wide">
      <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: 'Speed round' }]} />

      {phase === 'ready' && (
        <div className="speed-intro">
          <Timer size={36} strokeWidth={1.5} aria-hidden />
          <h1 className="display">Speed round</h1>
          <p className="lead">60 seconds. Tap the better AI screen, as fast as you can. 3 in a row = ×2 points. A wrong tap costs 1 point.</p>
          {challenge && (
            <p className="challenge-banner">
              <Swords size={16} strokeWidth={1.75} aria-hidden /> <strong>{challenge.from}</strong> scored <strong>{challenge.score}</strong>. Same screens, same order. Beat it!
            </p>
          )}
          <button type="button" className="btn btn-primary btn-lg" onClick={() => start(!!challenge)}>
            <Zap size={15} strokeWidth={2} aria-hidden /> {challenge ? 'Accept challenge' : 'Start'}
          </button>
          <p className="small muted">Best: {stats.speedBest || 0} points · Keys: ← / →</p>
        </div>
      )}

      {phase === 'count' && (
        <div className="speed-count" aria-live="assertive">
          <span key={count}>{count || 'Go!'}</span>
        </div>
      )}

      {phase === 'play' && (
        <div className="speed">
          <div className="speed-bar">
            <button type="button" className="speed-quit" onClick={() => setPhase('ready')} aria-label="Quit this round">
              <X size={18} strokeWidth={2} aria-hidden />
            </button>
            <span className={'speed-time' + (secs <= 10 ? ' is-low' : '')}><Timer size={16} strokeWidth={2} aria-hidden /> {secs}s</span>
            <span className="speed-track" aria-hidden><span style={{ width: `${(left / (SECONDS * 1000)) * 100}%` }} /></span>
            <span className="speed-points" key={points}>{points}</span>
            {combo >= 3 && <span className="speed-combo" key={`c${combo}`}>×2</span>}
          </div>
          <p className="speed-brief">{round.brief}</p>
          <div className="speed-options">
            {sides.map((side, n) => (
              <button
                key={`${round.key}-${i}-${n}`}
                type="button"
                className={'tot-option speed-option' + (flash ? (side === 'good' ? ' is-good' : flash.n === n ? ' is-bad' : '') : '')}
                onClick={() => choose(n)}
                aria-label={`Option ${n ? 'B' : 'A'}`}
              >
                <span className="tot-letter">{n ? 'B' : 'A'}</span>
                <MockFrame>
                  {round[side].blocks.map((b, k) => <MockBlock key={k} b={b} />)}
                </MockFrame>
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'over' && result && (
        <div className="tot tot-over speed-over">
          {result.record && points > 0 && <Burst count={28} />}
          <p className="label">Time’s up</p>
          <p className="tot-big"><CountUp value={points} /><span> pts</span>{result.gain > 0 && <XpPop amount={result.gain} />}</p>
          <p className="tot-verdict">
            {right} right out of {answered} · {answered ? Math.round((right / answered) * 100) : 0}% accuracy
          </p>
          {challenge && seed === challenge.seed && (
            <p className={'challenge-result is-' + verdict(points, challenge.score, challenge.from).tone}>
              <Swords size={16} strokeWidth={1.75} aria-hidden /> {verdict(points, challenge.score, challenge.from).text}
            </p>
          )}
          <div className="tot-stats">
            {result.record && points > 0 ? <span className="pill-new">New best!</span> : <span>Best: {stats.speedBest || 0} pts</span>}
          </div>
          <div className="row wrap center">
            <button type="button" className="btn btn-primary btn-lg" onClick={() => start(false)}>
              <RotateCcw size={15} strokeWidth={1.75} aria-hidden /> Play again
            </button>
            <button type="button" className="btn btn-ghost btn-lg" onClick={share}>
              <Swords size={15} strokeWidth={1.75} aria-hidden /> {copied ? 'Link copied!' : 'Challenge a friend'}
            </button>
            <Link to="/play/this-or-that" className="btn btn-ghost btn-lg">Learn them slowly</Link>
          </div>
        </div>
      )}
    </div>
  );
}
