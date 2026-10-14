import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Eye, Flame, RotateCcw, Trophy, X } from 'lucide-react';
import { getCategory, getPattern } from '../data/patterns';
import { makeDeck } from '../game/decks';
import MockFrame, { MockBlock } from '../mock/Mock';
import { markPlayed, saveStreak, useGameStats, XP } from '../progress';
import Burst from './Burst';
import { fx } from '../game/fx';
import CountUp from './CountUp';
import { track } from '../game/track';
import Disagree from './Disagree';

// This or That: two versions of the same AI screen. Tap the better one.
// Quick rounds, instant answer, a streak to protect. No reading needed to start.
//   mode:   'classic' (clear differences) or 'hard' (one small detail differs)
//   deck:   a fixed list of rounds (used by the Daily challenge)
//   onDone: called with [true/false per round] instead of showing the score screen
const VERDICT = [
  [1, 'Perfect round. Frame it!'],
  [0.8, 'Sharp eye! Only a couple got past you.'],
  [0.5, 'Good run. A few sneaky ones slipped by.'],
  [0, 'Tough round. Every miss taught you a trick.'],
];
// A little variety for the moment right after a pick. Picked by round number, so it never jumps around.
const YES = ['Nailed it!', 'Sharp eye!', 'That’s the one!', 'Yes!'];
const NO = ['So close. The green one wins.', 'Easy to miss. The green one wins.', 'Not quite. The green one wins.'];

// `start` resumes a run (answers already given, e.g. a Daily after a refresh); `onAnswer` gets every answer so far.
export default function ThisOrThat({ rounds = 10, mode = 'classic', deck: fixedDeck, onDone, start, onAnswer }) {
  const [deck, setDeck] = useState(() => fixedDeck || makeDeck(mode, rounds));
  const resumeAt = start && fixedDeck ? Math.min(start.length, fixedDeck.length - 1) : 0;
  const [i, setI] = useState(resumeAt);
  const [pick, setPick] = useState(null); // 0 or 1
  const [results, setResults] = useState(() => (start && fixedDeck ? start.slice(0, resumeAt) : []));
  const [streak, setStreak] = useState(0);
  const [runBest, setRunBest] = useState(0);
  const [over, setOver] = useState(false);
  const [recordXp, setRecordXp] = useState(0);
  const stats = useGameStats();
  const nextRef = useRef(null);

  // Switching mode (Classic ↔ Hard) starts a fresh run.
  useEffect(() => {
    if (fixedDeck) return;
    setDeck(makeDeck(mode, rounds));
    setI(0);
    setPick(null);
    setResults([]);
    setStreak(0);
    setRunBest(0);
    setOver(false);
    setRecordXp(0);
  }, [mode, rounds, fixedDeck]);

  const round = deck[i];
  const p = getPattern(round.pattern);
  const sides = round.goodFirst ? ['good', 'bad'] : ['bad', 'good'];
  const answered = pick !== null;
  const right = answered && sides[pick] === 'good';
  const score = results.filter(Boolean).length;

  const choose = useCallback(
    (n) => {
      if (pick !== null || over) return;
      setPick(n);
      markPlayed();
      const ok = (n === 0) === round.goodFirst;
      if (!ok) fx('wrong');
      else if (streak + 1 >= 3) fx('combo', { streak: streak + 1 });
      else fx('right', { streak });
      const all = [...results, ok];
      setResults(all);
      onAnswer?.(all);
      if (ok) {
        const s = streak + 1;
        setStreak(s);
        setRunBest((b) => Math.max(b, s));
      } else {
        setStreak(0);
      }
    },
    [pick, over, round.goodFirst, streak, results, onAnswer]
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
    track('Game finished', { game: onDone ? 'daily' : `this-or-that-${mode}`, score: results.filter(Boolean).length });
    if (onDone) onDone(results);
    else setOver(true);
  }, [pick, i, deck.length, runBest, stats.bestStreak, onDone, results, mode]);

  const again = () => {
    setDeck(makeDeck(mode, rounds));
    setI(0);
    setPick(null);
    setResults([]);
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
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return; // browser shortcuts, held keys
      const key = e.key.toLowerCase();
      if (key === 'arrowleft' || key === 'a') choose(0);
      if (key === 'arrowright' || key === 'b') choose(1);
      if (e.key === 'Enter' && pick !== null && !e.target.closest('button, a')) next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [choose, next, pick]);

  if (over) {
    const verdict = VERDICT.find(([min]) => score >= min * deck.length)[1];
    return (
      <div className="tot tot-over">
        {score >= deck.length * 0.8 && <Burst count={24} />}
        <Trophy size={28} strokeWidth={1.5} aria-hidden />
        <p className="tot-big"><CountUp value={score} /><span>/{deck.length}</span></p>
        <p className="tot-verdict">{verdict}</p>
        <div className="tot-stats">
          <span><Flame size={14} strokeWidth={1.75} aria-hidden /> Most right in a row: <strong>{runBest}</strong></span>
          {recordXp > 0 && <span className="pill-new">New best streak! +{recordXp} XP</span>}
        </div>
        <div className="row wrap center">
          <button type="button" className="btn btn-primary btn-lg" onClick={again}>
            <RotateCcw size={15} strokeWidth={1.75} aria-hidden /> Play again
          </button>
          {mode === 'classic' ? (
            <Link to="/play/this-or-that?mode=hard" className="btn btn-ghost btn-lg"><Eye size={15} strokeWidth={1.75} aria-hidden /> Try Hard mode</Link>
          ) : (
            <Link to="/play/daily" className="btn btn-ghost btn-lg">Play today’s Daily</Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="tot">
      <div className="tot-bar">
        <span className="tot-round">
          {deck.map((_, n) => (
            <span key={n} className={'tot-pip' + (n < i ? (results[n] ? ' is-right' : ' is-wrong') : '') + (n === i ? ' is-now' : '')} />
          ))}
        </span>
        <span className="tot-score"><Check size={14} strokeWidth={2.25} aria-hidden /> {score} right</span>
        <span className={'tot-streak' + (streak >= 3 ? ' is-hot' : '')} key={streak}>
          <Flame size={14} strokeWidth={1.75} aria-hidden /> {streak} in a row
        </span>
      </div>

      <div className="tot-q">
        <div className="row">
          <span className={`tag tag-${p.category}`}>{getCategory(p.category).name}</span>
          {round.hard && <span className="tag tag-hard"><Eye size={11} strokeWidth={2} aria-hidden /> Hard · find the 1 small difference</span>}
        </div>
        <h3 aria-level="2">Tap the better AI screen</h3>
        <p>{round.brief}</p>
      </div>

      <div className="tot-options">
        {sides.map((side, n) => {
          const state = answered ? side : '';
          const mine = pick === n;
          return (
            <button
              key={`${round.key}-${n}`}
              type="button"
              className={'tot-option' + (state ? ` is-${state}` : '') + (mine ? ' is-mine' : '')}
              onClick={() => choose(n)}
              disabled={answered}
              aria-label={`Option ${n ? 'B' : 'A'}`}
            >
              <span className="tot-letter">
                {answered ? (side === 'good' ? <Check size={13} strokeWidth={2.5} aria-hidden /> : <X size={13} strokeWidth={2.5} aria-hidden />) : n ? 'B' : 'A'}
              </span>
              {answered && <span className="tot-caption">{round[side].caption}</span>}
              <MockFrame>
                {round[side].blocks.map((b, k) => (
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
              <strong className={right ? 'txt-good' : 'txt-bad'}>{right ? (streak >= 3 ? `${streak} in a row. On fire!` : YES[i % YES.length]) : NO[i % NO.length]}</strong>{' '}
              The trick: <Link to={`/patterns/${p.id}`}>{p.title}</Link>.{' '}
              <Disagree where={`This or That · ${round.brief}`} detail={`Better: “${round.good.caption}”. Worse: “${round.bad.caption}”.`} />
            </p>
            <button type="button" className="btn btn-primary" onClick={next} ref={nextRef}>
              {i < deck.length - 1 ? 'Next round' : onDone ? 'See my result' : 'See my score'} <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
            </button>
          </>
        )}
        {!answered && <p className="tot-keys">Click the better screen, or press ← / →</p>}
      </div>
    </div>
  );
}
