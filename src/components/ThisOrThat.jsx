import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Eye, Flame, RotateCcw, Sparkles, Trophy, X } from 'lucide-react';
import { getCategory, getPattern } from '../data/patterns';
import { makeDeck } from '../game/decks';
import { missesDeck } from '../game/missesDeck';
import MockFrame, { MockBlock } from '../mock/Mock';
import { addGolden, addMiss, clearMiss, markPlayed, saveStreak, useGameStats, useMisses, XP } from '../progress';
import Burst, { XpPop } from './Burst';
import { fx } from '../game/fx';
import CountUp from './CountUp';
import { track } from '../game/track';
import { buddy } from '../game/buddy';
import { countThemeAnswer, leanDeck } from '../game/themeWeek';
import Disagree from './Disagree';
import { PeekLink } from './PatternPeek';

// This or That: two versions of the same AI screen. Tap the better one.
// Quick rounds, instant answer, a streak to protect. No reading needed to start.
//   mode:   'classic' (clear differences), 'hard' (one small detail differs) or 'misses' (rounds you got wrong)
//   deck:   a fixed list of rounds (used by the Daily challenge)
//   onDone: called with [true/false per round] instead of showing the score screen
//   next:   ({ missed, last }) => buttons for the score screen (pattern ids). "Play again" then goes quiet.
//   game:   the name for the "Game finished" event (default: 'daily' with onDone, else this-or-that-<mode>)
const VERDICT = [
  [1, 'Perfect round. Frame it!'],
  [0.8, 'Sharp eye! Only a couple got past you.'],
  [0.5, 'Good run. A few sneaky ones slipped by.'],
  [0, 'Tough round. Every miss taught you a trick.'],
];
// A little variety for the moment right after a pick. Picked by round number, so it never jumps around.
const YES = ['Nailed it!', 'Sharp eye!', 'That’s the one!', 'Yes!'];
const NO = ['So close. The green one wins.', 'Easy to miss. The green one wins.', 'Not quite. The green one wins.'];

// Every wrong answer goes into "Your misses"; a right answer takes that round out again.
// A fresh run leans to this week's theme group, and about 1 round in 20 is golden (worth XP.golden if you get it right).
const GOLDEN = 1 / 20;
const buildDeck = (mode, n) =>
  (mode === 'misses' ? missesDeck(n) : leanDeck(makeDeck(mode, n), mode)).map((r) => ({ ...r, golden: Math.random() < GOLDEN }));

// `start` resumes a run (answers already given, e.g. a Daily after a refresh); `onAnswer` gets every answer so far.
export default function ThisOrThat({ rounds = 10, mode = 'classic', deck: fixedDeck, onDone, start, onAnswer, next: nextStep, game }) {
  const [deck, setDeck] = useState(() => fixedDeck || buildDeck(mode, rounds));
  const resumeAt = start && fixedDeck ? Math.min(start.length, fixedDeck.length - 1) : 0;
  const [i, setI] = useState(resumeAt);
  const [pick, setPick] = useState(null); // 0 or 1
  const [results, setResults] = useState(() => (start && fixedDeck ? start.slice(0, resumeAt) : []));
  const [streak, setStreak] = useState(0);
  const [runBest, setRunBest] = useState(0);
  const [over, setOver] = useState(false);
  const [recordXp, setRecordXp] = useState(0);
  const stats = useGameStats();
  const missesLeft = useMisses().length;
  const nextRef = useRef(null);

  // Switching mode (Classic ↔ Hard) starts a fresh run.
  useEffect(() => {
    if (fixedDeck) return;
    setDeck(buildDeck(mode, rounds));
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
      if (ok) {
        clearMiss(round.key);
        countThemeAnswer(round);
        if (round.golden) addGolden();
      } else addMiss(round.key);
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
        if (s === 3 || s === 5 || s === 10) buddy(`streak${s}`);
      } else {
        if (streak >= 3) buddy('lost');
        setStreak(0);
      }
    },
    [pick, over, round, streak, results, onAnswer]
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
    track('Game finished', { game: game || (onDone ? 'daily' : `this-or-that-${mode}`), score: results.filter(Boolean).length });
    if (onDone) onDone(results);
    else setOver(true);
  }, [pick, i, deck.length, runBest, stats.bestStreak, onDone, results, mode, game]);

  const again = () => {
    setDeck(buildDeck(mode, rounds));
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
    // Every pattern met this run, misses first, so a curious tap is right there.
    const met = deck.map((r, n) => ({ id: r.pattern, ok: results[n] }));
    const tricks = [...met.filter((m) => !m.ok), ...met.filter((m) => m.ok)].filter((m, n, all) => all.findIndex((x) => x.id === m.id) === n);
    const missed = tricks.filter((m) => !m.ok).map((m) => m.id);
    const cleared = mode === 'misses' && missesLeft === 0;
    const replay = cleared ? null : (
      <button type="button" className={nextStep ? 'text-link tot-again' : 'btn btn-primary btn-lg'} onClick={again}>
        <RotateCcw size={15} strokeWidth={1.75} aria-hidden /> Play again
      </button>
    );
    return (
      <div className="tot tot-over">
        {score >= deck.length * 0.8 && <Burst count={24} />}
        <Trophy size={28} strokeWidth={1.5} aria-hidden />
        <p className="tot-big"><CountUp value={score} /><span>/{deck.length}</span></p>
        <p className="tot-verdict">{cleared ? 'Misses deck cleared. Every one of them, fixed!' : verdict}</p>
        {mode === 'misses' && !cleared && <p className="small muted">{missesLeft} {missesLeft === 1 ? 'miss is' : 'misses are'} still in your deck.</p>}
        <div className="tot-stats">
          <span><Flame size={14} strokeWidth={1.75} aria-hidden /> Most right in a row: <strong>{runBest}</strong></span>
          {recordXp > 0 && <span className="pill-new">New best streak! +{recordXp} XP</span>}
        </div>
        {nextStep ? (
          <>
            <div className="row wrap center">{nextStep({ missed, last: deck[deck.length - 1].pattern })}</div>
            {replay}
          </>
        ) : (
          <div className="row wrap center">
            {replay}
            {mode === 'misses' ? (
              <Link to="/play" className={'btn btn-lg ' + (cleared ? 'btn-primary' : 'btn-ghost')}>Back to Play</Link>
            ) : mode === 'classic' ? (
              <Link to="/play/this-or-that?mode=hard" className="btn btn-ghost btn-lg"><Eye size={15} strokeWidth={1.75} aria-hidden /> Try Hard mode</Link>
            ) : (
              <Link to="/play/daily" className="btn btn-ghost btn-lg">Play today’s Daily</Link>
            )}
          </div>
        )}
        <div className="tot-tricks">
          <p className="small muted">Tricks you met. Tap one for a quick look:</p>
          <ul>
            {tricks.map((m) => (
              <li key={m.id} className={m.ok ? 'is-right' : 'is-wrong'}>
                {m.ok ? <Check size={12} strokeWidth={2.5} aria-label="Right" /> : <X size={12} strokeWidth={2.5} aria-label="Missed" />}
                <PeekLink id={m.id}>{getPattern(m.id).title}</PeekLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className={'tot' + (round.golden ? ' is-golden' : '')}>
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
          {round.golden && <span className="tag tag-golden"><Sparkles size={11} strokeWidth={2} aria-hidden /> Golden round · +{XP.golden} XP</span>}
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
              {mine && right && <Burst count={round.golden ? 30 : undefined} />}
              {mine && right && round.golden && <XpPop amount={XP.golden} />}
            </button>
          );
        })}
      </div>

      <div className={'tot-result' + (answered ? ' is-shown' : '')} aria-live="polite">
        {answered && (
          <>
            <p>
              <strong className={right ? 'txt-good' : 'txt-bad'}>{right ? (streak >= 3 ? `${streak} in a row. On fire!` : YES[i % YES.length]) : NO[i % NO.length]}</strong>{' '}
              The trick: <PeekLink id={p.id}>{p.title}</PeekLink>.{' '}
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
