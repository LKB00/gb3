import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpenText, CalendarDays, Check, Eye, Flame, Puzzle, ScanSearch, Shuffle, Star, Timer, Zap } from 'lucide-react';
import { categories, patterns } from '../data/patterns';
import { hunts } from '../data/hunts';
import { dailyStreak, useDaily, useGameStats, useHuntsDone, usePassed, useStars, useXP } from '../progress';
import { dailyNumber, todayKey } from '../game/decks';
import Hunt from '../components/Hunt';
import ThisOrThat from '../components/ThisOrThat';
import { TodayCard } from '../components/Today';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTitle } from '../useTitle';

const ARROW = { size: 15, strokeWidth: 1.75, 'aria-hidden': true };

// Picks a challenge you haven't collected yet (or any, once you have them all).
export function useRandomChallenge() {
  const passed = usePassed();
  const navigate = useNavigate();
  return () => {
    const left = patterns.filter((p) => !passed.includes(p.id));
    const pool = left.length ? left : patterns;
    navigate(`/patterns/${pool[Math.floor(Math.random() * pool.length)].id}`);
  };
}

export function LevelCard() {
  const { xp, level, levelNum, nextLevel, toNext, starTotal } = useXP();
  const passed = usePassed();
  const huntsDone = useHuntsDone();
  const stats = useGameStats();
  const floor = level.xp;
  const pct = nextLevel ? ((xp - floor) / (nextLevel.xp - floor)) * 100 : 100;
  return (
    <div className="level-card">
      <div className="level-top">
        <span className="level-badge">{levelNum}</span>
        <div>
          <p className="label">Level {levelNum}</p>
          <p className="level-name">{level.name}</p>
        </div>
        <p className="level-xp"><Zap size={16} strokeWidth={2} aria-hidden /> {xp} XP</p>
      </div>
      <span className="meter meter-xp" aria-hidden><span style={{ width: `${pct}%` }} /></span>
      <p className="small muted">
        {nextLevel ? `${toNext} XP to ${nextLevel.name}` : 'Top level. Legendary.'} · <Link to="/play/card" className="level-card-link">Your player card</Link>
      </p>
      <ul className="level-stats">
        <li><strong>{passed.length}/{patterns.length}</strong> cards</li>
        <li><strong>{starTotal}</strong> stars</li>
        <li><strong>{huntsDone.length}/{hunts.length}</strong> flaws hunted</li>
        <li><strong>{stats.bestStreak || 0}</strong> best streak</li>
      </ul>
    </div>
  );
}

// The Daily challenge, as a wide banner: today's status and streak.
export function DailyBanner() {
  const daily = useDaily();
  const key = todayKey();
  const today = daily[key];
  const streak = dailyStreak(daily);
  return (
    <Link to="/play/daily" className={'daily-banner' + (today ? ' is-done' : '')}>
      <CalendarDays size={22} strokeWidth={1.75} aria-hidden />
      <span className="daily-banner-text">
        <strong>Daily #{dailyNumber(key)}</strong>
        <span>{today ? `Done today: ${today.filter(Boolean).length}/${today.length}. Share your result.` : '5 rounds, same for everyone today. One try.'}</span>
      </span>
      {streak > 0 && <span className="pill-streak"><Flame size={13} strokeWidth={1.75} aria-hidden /> {streak}</span>}
      <span className="btn btn-primary">{today ? 'See result' : 'Play today’s'} <ArrowRight size={14} strokeWidth={1.75} aria-hidden /></span>
    </Link>
  );
}

export function GameTiles() {
  const random = useRandomChallenge();
  const passed = usePassed();
  const huntsDone = useHuntsDone();
  const stats = useGameStats();
  return (
    <div className="games">
      <Link to="/play/speed" className="game game-e">
        <Timer size={22} strokeWidth={1.75} aria-hidden />
        <strong>Speed round</strong>
        <span>60 seconds. Tap the better screen, fast. 3 in a row = ×2 points.</span>
        <span className="game-meta"><Zap size={13} strokeWidth={1.75} aria-hidden /> Best {stats.speedBest || 0} pts</span>
      </Link>
      <Link to="/play/story" className="game game-d">
        <BookOpenText size={22} strokeWidth={1.75} aria-hidden />
        <strong>Agent on duty</strong>
        <span>A short story: design an AI agent and keep the user’s trust. 4 endings.</span>
        <span className="game-meta"><Star size={13} strokeWidth={1.75} aria-hidden /> {stats.storyBest != null ? `Best trust ${stats.storyBest}` : 'New'}</span>
      </Link>
      <Link to="/play/this-or-that" className="game game-a">
        <Shuffle size={22} strokeWidth={1.75} aria-hidden />
        <strong>This or That</strong>
        <span>Two AI screens. Tap the better one. Classic or Hard mode.</span>
        <span className="game-meta"><Flame size={13} strokeWidth={1.75} aria-hidden /> Best streak {stats.bestStreak || 0}</span>
      </Link>
      <button type="button" onClick={random} className="game game-b">
        <Puzzle size={22} strokeWidth={1.75} aria-hidden />
        <strong>Fix it</strong>
        <span>Build an AI feature step by step. Win a pattern card.</span>
        <span className="game-meta"><Star size={13} strokeWidth={1.75} aria-hidden /> {passed.length}/{patterns.length} cards</span>
      </button>
      <Link to="/play/spot-the-flaw" className="game game-c">
        <ScanSearch size={22} strokeWidth={1.75} aria-hidden />
        <strong>Spot the flaw</strong>
        <span>Real-looking AI screens with hidden mistakes. Find them all.</span>
        <span className="game-meta"><Check size={13} strokeWidth={2} aria-hidden /> {huntsDone.length}/{hunts.length} screens</span>
      </Link>
    </div>
  );
}

export function Badges() {
  const passed = usePassed();
  const stars = useStars();
  return (
    <ul className="badges">
      {categories.map((c) => {
        const list = patterns.filter((p) => p.category === c.id);
        const got = list.filter((p) => passed.includes(p.id)).length;
        const gold = got === list.length && list.every((p) => stars[p.id] === 3);
        const won = got === list.length;
        return (
          <li key={c.id} className={'badge' + (won ? ' is-won' : '') + (gold ? ' is-gold' : '')}>
            <Link to={`/patterns?category=${c.id}`}>
              <span className={`badge-icon badge-${c.id}`} aria-hidden>{won ? <Check size={18} strokeWidth={2.25} /> : `${got}/${list.length}`}</span>
              <span className="badge-name">{c.name}</span>
              <span className="badge-sub">{gold ? 'Gold · all 3 stars' : won ? 'Complete' : `${list.length - got} to go`}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function Play() {
  useTitle('Play');
  return (
    <div className="page page-wide">
      <header className="page-head page-head-tight">
        <h1 className="display">Play</h1>
        <p className="lead">Pick a game. Earn XP, collect pattern cards, level up.</p>
      </header>
      <div className="play-grid">
        <LevelCard />
        <TodayCard />
        <DailyBanner />
        <GameTiles />
      </div>
      <section className="block">
        <div className="section-head">
          <h2>Badges</h2>
          <p className="section-sub">Collect every card in a group to win its badge. All 3 stars on each makes it gold.</p>
        </div>
        <Badges />
      </section>
    </div>
  );
}

export function ThisOrThatPage() {
  useTitle('This or That');
  const [params, setParams] = useSearchParams();
  const mode = params.get('mode') === 'hard' ? 'hard' : 'classic';
  return (
    <div className="page page-wide">
      <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: 'This or That' }]} />
      <div className="tabs tot-modes" role="tablist" aria-label="Mode">
        <button role="tab" aria-selected={mode === 'classic'} className="tab" onClick={() => setParams({}, { replace: true })}>
          <Shuffle size={15} strokeWidth={1.75} aria-hidden /> Classic
        </button>
        <button role="tab" aria-selected={mode === 'hard'} className="tab" onClick={() => setParams({ mode: 'hard' }, { replace: true })}>
          <Eye size={15} strokeWidth={1.75} aria-hidden /> Hard <span className="tab-count">one detail differs</span>
        </button>
      </div>
      <div className="view">
        <ThisOrThat rounds={10} mode={mode} />
      </div>
    </div>
  );
}

export function SpotTheFlaw() {
  useTitle('Spot the flaw');
  const huntsDone = useHuntsDone();
  const firstOpen = Math.max(0, hunts.findIndex((h) => !huntsDone.includes(h.id)));
  const [idx, setIdx] = useState(firstOpen);
  const scenario = hunts[idx];
  return (
    <div className="page page-wide">
      <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: 'Spot the flaw' }]} />
      <header className="page-head page-head-tight">
        <h1 className="display">Spot the flaw</h1>
        <p className="lead">{scenario.brief}</p>
      </header>
      <div className="chips hunt-tabs" role="tablist" aria-label="Screens">
        {hunts.map((h, i) => (
          <button key={h.id} role="tab" aria-selected={i === idx} className={'chip' + (i === idx ? ' chip-on' : '')} onClick={() => setIdx(i)}>
            {huntsDone.includes(h.id) && <Check size={12} strokeWidth={2.5} aria-label="Done" />}
            {h.title}
          </button>
        ))}
      </div>
      <div className="view">
        <Hunt key={scenario.id} scenario={scenario} />
        {idx < hunts.length - 1 && (
          <div className="actions">
            <button className="btn btn-primary" onClick={() => setIdx(idx + 1)}>
              Next screen <ArrowRight {...ARROW} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
