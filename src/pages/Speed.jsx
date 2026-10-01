import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, RotateCcw, Timer, Zap } from 'lucide-react';
import { makeDeck } from '../game/decks';
import { fx } from '../game/fx';
import { markPlayed, saveSpeed, useGameStats, XP } from '../progress';
import MockFrame, { MockBlock } from '../mock/Mock';
import Breadcrumbs from '../components/Breadcrumbs';
import Burst, { XpPop } from '../components/Burst';
import { useTitle } from '../useTitle';

// Speed round: 60 seconds, as many "which is better?" picks as you can.
// 3 right in a row turns on a ×2 combo; a wrong pick costs 1 point. No explanations mid-round, just pace;
// the patterns are linked on the score screen.
const SECONDS = 60;

function freshDeck() {
  const all = [...makeDeck('classic', 34), ...makeDeck('hard', 20)];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
}

export default function Speed() {
  useTitle('Speed round');
  const stats = useGameStats();
  const [phase, setPhase] = useState('ready'); // ready | count | play | over
  const [count, setCount] = useState(3);
  const [deck, setDeck] = useState(freshDeck);
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

  const start = () => {
    setDeck(freshDeck());
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

  // 3 · 2 · 1 countdown
  useEffect(() => {
    if (phase !== 'count') return;
    if (count === 0) {
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
        if (final > best && final > 0) fx('win');
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
      const ok = sides[n] === 'good';
      markPlayed();
      fx(ok ? 'right' : 'wrong');
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
    [phase, flash, sides, combo]
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
    const text = `⚡ I scored ${points} in the AI Patterns speed round (${right}/${answered} right in 60s). Can you beat it? ${window.location.origin}${window.location.pathname}#/play/speed`;
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
          <button type="button" className="btn btn-primary btn-lg" onClick={start}>
            <Zap size={15} strokeWidth={2} aria-hidden /> Start
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
          <p className="tot-big">{points}<span> pts</span>{result.gain > 0 && <XpPop amount={result.gain} />}</p>
          <p className="tot-verdict">
            {right} right out of {answered} · {answered ? Math.round((right / answered) * 100) : 0}% accuracy
          </p>
          <div className="tot-stats">
            {result.record && points > 0 ? <span className="pill-new">New best!</span> : <span>Best: {stats.speedBest || 0} pts</span>}
          </div>
          <div className="row wrap center">
            <button type="button" className="btn btn-primary btn-lg" onClick={start}>
              <RotateCcw size={15} strokeWidth={1.75} aria-hidden /> Play again
            </button>
            <button type="button" className="btn btn-ghost btn-lg" onClick={share}>
              <Copy size={15} strokeWidth={1.75} aria-hidden /> {copied ? 'Copied!' : 'Copy score'}
            </button>
            <Link to="/play/this-or-that" className="btn btn-ghost btn-lg">Learn them slowly</Link>
          </div>
        </div>
      )}
    </div>
  );
}
