import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Copy, Eye, Flame, Shuffle, Swords, Target } from 'lucide-react';
import { challengeLink, dailyDareText, useChallenge, useDare, verdict } from '../game/challenge';
import { dailyDeck, dailyLabel, dailyNumber, goalRounds } from '../game/decks';
import { dayKey } from '../lib/dates';
import { DAILY_GOAL, readDailyRun, saveDaily, saveDailyRun, useDaily, useStreak, XP } from '../progress';
import ThisOrThat from '../components/ThisOrThat';
import Breadcrumbs from '../components/Breadcrumbs';
import CountUp from '../components/CountUp';
import { copyText } from '../lib/clipboard';
import Burst, { XpPop } from '../components/Burst';
import { useTitle } from '../lib/useTitle';

// Daily challenge: 5 rounds, the same for everyone today, one try.
// Why: a small reason to come back each day, and a result grid worth sharing.
function untilMidnight() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  const mins = Math.max(0, Math.round((next - now) / 60000));
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function useCountdown() {
  const [left, setLeft] = useState(untilMidnight);
  useEffect(() => {
    const t = setInterval(() => setLeft(untilMidnight()), 30000);
    return () => clearInterval(t);
  }, []);
  return left;
}

export function shareText(num, results, streak) {
  const grid = results.map((r) => (r ? '🟩' : '🟥')).join('');
  const url = `${window.location.origin}${window.location.pathname}#/play/daily`;
  return `Good Bot, Bad Bot Daily #${num} · ${results.filter(Boolean).length}/${results.length}\n${grid}${streak > 1 ? `\n🔥 ${streak}-day streak` : ''}\nCan you spot good AI design? ${url}`;
}

// After the Daily: the daily goal is the next step, so it comes before sharing.
function GoalStep() {
  const { todayMoves } = useStreak();
  const left = DAILY_GOAL - todayMoves;
  if (left <= 0) {
    return (
      <div className="daily-next is-done">
        <p><Target size={16} strokeWidth={1.75} aria-hidden /> <strong>Goal done. See you tomorrow!</strong></p>
      </div>
    );
  }
  const rounds = goalRounds(left);
  return (
    <div className="daily-next">
      <p><Target size={16} strokeWidth={1.75} aria-hidden /> {left} more {left === 1 ? 'answer' : 'answers'} to hit today’s goal.</p>
      <Link to={`/play/this-or-that?rounds=${rounds}`} className="btn btn-primary btn-lg">
        <Shuffle size={15} strokeWidth={1.75} aria-hidden /> Play {rounds} quick rounds
      </Link>
    </div>
  );
}

function Result({ num, day, results, streak, fresh, challenge, replay, goalDone }) {
  const left = useCountdown();
  const [copied, setCopied] = useState(false);
  const dare = useDare();
  const score = results.filter(Boolean).length;
  const text = shareText(num, results, streak);
  const url = `${window.location.origin}${window.location.pathname}#/play/daily`;

  const copy = async () => {
    if (await copyText(text)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  const sendDare = () =>
    dare.send(() => ({
      text: dailyDareText({ score, total: results.length, num, vs: challenge }),
      url: challengeLink('/play/daily', { d: day, vs: score, r: results.map((x) => (x ? 1 : 0)).join('') }),
    }));

  return (
    <div className="tot tot-over daily-result">
      {fresh && score >= 4 && <Burst count={26} />}
      <p className="label">Daily #{num}</p>
      <p className="tot-big"><CountUp value={score} /><span>/{results.length}</span>{fresh && score > 0 && <XpPop amount={score * XP.daily} />}</p>
      <div className="daily-grid" aria-label={`${score} of ${results.length} right`}>
        {results.map((r, i) => <span key={i} className={r ? 'is-right' : 'is-wrong'} />)}
      </div>
      {challenge ? (
        <p className={'challenge-result is-' + verdict(score, challenge.score, challenge.from).tone}>
          <Swords size={16} strokeWidth={1.75} aria-hidden /> <span>{verdict(score, challenge.score, challenge.from).text}</span>
        </p>
      ) : (
        <p className="tot-verdict">
          {score === results.length ? 'Perfect 5! Frame this one.' : score >= 3 ? 'Nice run! Dare a friend to beat it.' : 'Tough set today. Fresh rounds tomorrow!'}
        </p>
      )}
      {replay && <p className="small muted">A past Daily, just for fun. Your streak and today’s score stay safe.</p>}
      <div className="tot-stats">
        {streak > 0 && <span className="pill-streak"><Flame size={14} strokeWidth={1.75} aria-hidden /> {streak}-day streak</span>}
        <span><CalendarDays size={14} strokeWidth={1.75} aria-hidden /> New Daily in {left}</span>
      </div>
      <GoalStep />
      <div className="daily-share">
        {dare.askName && (
          <input
            className="dare-name"
            value={dare.name}
            onChange={(e) => dare.setName(e.target.value)}
            maxLength={24}
            placeholder="Your name (so friends know it’s you)"
            aria-label="Your name (so friends know it’s you)"
            autoComplete="nickname"
          />
        )}
        <div className="row wrap center">
          <button type="button" className={'btn btn-lg ' + (goalDone ? 'btn-primary' : 'btn-ghost')} onClick={sendDare}>
            <Swords size={15} strokeWidth={1.75} aria-hidden /> {dare.copied ? 'Link copied!' : challenge ? `Send it back to ${challenge.from}` : 'Challenge a friend'}
          </button>
          <button type="button" className="btn btn-ghost btn-lg" onClick={copy}>
            <Copy size={15} strokeWidth={1.75} aria-hidden /> {copied ? 'Copied!' : 'Copy my result'}
          </button>
        </div>
        <details className="daily-more-share">
          <summary>More ways to share</summary>
          <pre className="share-preview">{text}</pre>
          <div className="row wrap center">
            <a className="btn btn-ghost" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">Post on X</a>
            <a className="btn btn-ghost" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </details>
      </div>
      <div className="daily-more">
        <span className="muted small">Play more:</span>
        <Link to="/play/this-or-that?mode=hard" className="text-link"><Eye size={14} strokeWidth={1.75} aria-hidden /> This or That: Hard</Link>
        <Link to="/play/story" className="text-link">Stories</Link>
        <Link to="/play/card" className="text-link">Your player card</Link>
      </div>
    </div>
  );
}

export default function Daily() {
  useTitle('Daily challenge');
  const link = useChallenge();
  const todayK = dayKey();
  // A challenge link for another day replays that day's rounds (not saved).
  const key = link?.day && link.day <= todayK && dailyNumber(link.day) >= 1 ? link.day : todayK;
  const replay = key !== todayK;
  const num = dailyLabel(key);
  const deck = useMemo(() => dailyDeck(key), [key]);
  // A friend's score can't be more than the number of rounds.
  const challenge = link && link.score <= deck.length ? link : null;
  const daily = useDaily();
  const [fresh, setFresh] = useState(false);
  const [replayResult, setReplayResult] = useState(null);
  const today = replay ? replayResult : daily[key];
  const { streak, todayMoves } = useStreak(); // the day streak, same as the top bar flame

  return (
    <div className="page page-wide">
      <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: `Daily #${num}` }]} />
      <header className="page-head page-head-tight">
        <h1 className="display">Daily #{num}</h1>
        <p className="lead">
          {today && !replay
            ? 'Done for today! Here’s how you did.'
            : `Tap the better AI screen, 5 times. ${replay ? 'Everyone got the same rounds that day.' : 'Everyone gets the same rounds today. You get one shot.'} Rounds 3 and 5 are extra tricky.`}
        </p>
      </header>
      {challenge && !today && (
        <p className="challenge-banner">
          <Swords size={16} strokeWidth={1.75} aria-hidden /> <span><strong>{challenge.from}</strong> got <strong>{challenge.score}/5</strong> on Daily #{num}. Your turn to beat it!</span>
        </p>
      )}
      <div className="view">
        {today ? (
          <Result num={num} day={key} results={today} streak={streak} fresh={fresh && !replay} challenge={challenge} replay={replay} goalDone={todayMoves >= DAILY_GOAL} />
        ) : (
          <ThisOrThat
            key={key /* a new day (or another day's link) is a new board */}
            deck={deck}
            start={replay ? undefined : readDailyRun(key)}
            onAnswer={replay ? undefined : (r) => saveDailyRun(key, r)}
            onDone={(r) => {
              setFresh(true);
              if (replay) setReplayResult(r);
              else saveDaily(key, r);
            }}
          />
        )}
      </div>
    </div>
  );
}
