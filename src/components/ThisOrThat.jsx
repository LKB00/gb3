import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Flame, RotateCcw, Trophy, X } from 'lucide-react';
import { getCategory, patterns } from '../data/patterns';
import { visuals } from '../data/visuals';
import MockFrame, { MockBlock } from '../mock/Mock';
import { saveStreak, useGameStats, XP } from '../progress';
import Burst from './Burst';

// This or That: two versions of the same AI screen. Tap the better one.
// Quick rounds, instant answer, a streak to protect. No reading needed to start.
function makeDeck(n) {
  const ids = patterns.map((p) => p.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids.slice(0, n).map((id) => ({ id, goodFirst: Math.random() < 0.5 }));
}

const VERDICT = [
  [10, 'Flawless. You have real AI design sense.'],
  [8, 'Sharp eye. Just a couple got past you.'],
  [5, 'Not bad. A few tricky ones in there.'],
  [0, 'Warm-up round. Play again, it gets easier.'],
];

export default function ThisOrThat({ rounds = 10 }) {
  const [deck, setDeck] = useState(() => makeDeck(rounds));
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null); // 0 or 1
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [runBest, setRunBest] = useState(0);
  const [over, setOver] = useState(false);
  const [recordXp, setRecordXp] = useState(0);
  const stats = useGameStats();
  const nextRef = useRef(null);

  const round = deck[i];
  const p = patterns.find((x) => x.id === round.id);
  const v = visuals[round.id];
  const sides = round.goodFirst ? ['good', 'bad'] : ['bad', 'good'];
  const answered = pick !== null;
  const right = answered && sides[pick] === 'good';

  const choose = useCallback(
    (n) => {
      if (pick !== null || over) return;
      setPick(n);
      if (sides[n] === 'good') {
        setScore((s) => s + 1);
        const s = streak + 1;
        setStreak(s);
        setRunBest((b) => Math.max(b, s));
      } else {
        setStreak(0);
      }
    },
    [pick, over, sides, streak]
  );

  const next = useCallback(() => {
    if (pick === null) return;
    if (i < deck.length - 1) {
      setI(i + 1);
      setPick(null);
      return;
    }
    setRecordXp(Math.max(0, runBest - (stats.bestStreak || 0)) * XP.streak);
    saveStreak(runBest);
    setOver(true);
  }, [pick, i, deck.length, runBest, stats.bestStreak]);

  const again = () => {
    setDeck(makeDeck(rounds));
    setI(0);
    setPick(null);
    setScore(0);
    setStreak(0);
    setRunBest(0);
    setOver(false);
    setRecordXp(0);
  };

  // Move focus to "Next" for keyboard users, without jumping the page.
  useEffect(() => {
    if (pick !== null) nextRef.current?.focus({ preventScroll: true });
  }, [pick]);

  // Keyboard: ← / → (or A / B) to pick, Enter for the next round.
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest('input, textarea, [contenteditable]')) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') choose(0);
      if (e.key === 'ArrowRight' || e.key === 'b') choose(1);
      if (e.key === 'Enter' && pick !== null && !e.target.closest('button, a')) next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [choose, next, pick]);

  if (over) {
    const verdict = VERDICT.find(([min]) => score >= Math.round((min / 10) * deck.length))[1];
    return (
      <div className="tot tot-over">
        {score >= deck.length * 0.8 && <Burst count={24} />}
        <Trophy size={28} strokeWidth={1.5} aria-hidden />
        <p className="tot-big">{score}<span>/{deck.length}</span></p>
        <p className="tot-verdict">{verdict}</p>
        <div className="tot-stats">
          <span><Flame size={14} strokeWidth={1.75} aria-hidden /> Best streak this run: <strong>{runBest}</strong></span>
          {recordXp > 0 && <span className="pill-new">New record · +{recordXp} XP</span>}
        </div>
        <div className="row wrap center">
          <button type="button" className="btn btn-primary btn-lg" onClick={again}>
            <RotateCcw size={15} strokeWidth={1.75} aria-hidden /> Play again
          </button>
          <Link to="/patterns" className="btn btn-ghost btn-lg">Collect pattern cards</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="tot">
      <div className="tot-bar">
        <span className="tot-round">
          {deck.map((_, n) => (
            <span key={n} className={'tot-pip' + (n < i ? ' is-past' : '') + (n === i ? ' is-now' : '')} />
          ))}
        </span>
        <span className="tot-score"><Check size={14} strokeWidth={2.25} aria-hidden /> {score}</span>
        <span className={'tot-streak' + (streak >= 3 ? ' is-hot' : '')} key={streak}>
          <Flame size={14} strokeWidth={1.75} aria-hidden /> {streak}
        </span>
      </div>

      <div className="tot-q">
        <span className={`tag tag-${p.category}`}>{getCategory(p.category).name}</span>
        <h3>Which one is better?</h3>
        <p>{v.lab.goal}</p>
      </div>

      <div className="tot-options">
        {sides.map((side, n) => {
          const state = answered ? (side === 'good' ? 'good' : 'bad') : '';
          const mine = pick === n;
          return (
            <button
              key={n}
              type="button"
              className={'tot-option' + (state ? ` is-${state}` : '') + (mine ? ' is-mine' : '')}
              onClick={() => choose(n)}
              disabled={answered}
              aria-label={`Option ${n ? 'B' : 'A'}`}
            >
              <span className="tot-letter">
                {answered ? (side === 'good' ? <Check size={13} strokeWidth={2.5} aria-hidden /> : <X size={13} strokeWidth={2.5} aria-hidden />) : n ? 'B' : 'A'}
              </span>
              {answered && <span className="tot-caption">{v.compare[side].caption}</span>}
              <MockFrame>
                {v.compare[side].blocks.map((b, k) => (
                  <MockBlock key={k} b={b} pin={answered ? b.pin : undefined} state={answered && b.pin ? side : undefined} />
                ))}
              </MockFrame>
              {mine && right && <Burst />}
            </button>
          );
        })}
      </div>

      <div className={'tot-result' + (answered ? ' is-shown' : '')} aria-live="polite">
        {answered && (
          <>
            <p>
              <strong className={right ? 'txt-good' : 'txt-bad'}>{right ? (streak >= 3 ? `${streak} in a row!` : 'Nice pick.') : 'Not quite.'}</strong>{' '}
              The pattern is <Link to={`/patterns/${p.id}`}>{p.title}</Link>.
            </p>
            <button type="button" className="btn btn-primary" onClick={next} ref={nextRef}>
              {i < deck.length - 1 ? 'Next' : 'See score'} <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
            </button>
          </>
        )}
        {!answered && <p className="tot-keys">Tap a screen, or press ← / →</p>}
      </div>
    </div>
  );
}
