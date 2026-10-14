import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Copy, Eye, Flame, Share2, Shuffle, Swords } from 'lucide-react';
import { challengeLink, useChallenge, verdict } from '../game/challenge';
import { dailyDeck, dailyLabel, dailyNumber } from '../game/decks';
import { dayKey } from '../lib/dates';
import { dailyStreak, saveDaily, useDaily, XP } from '../progress';
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
  return `Good Bot, Bad Bot Daily #${num} · ${results.filter(Boolean).length}/${results.length}\n${grid}${streak > 1 ? `\n🔥 ${streak} days in a row` : ''}\nCan you spot good AI design? ${url}`;
}

function Result({ num, day, results, streak, fresh, challenge, replay }) {
  const left = useCountdown();
  const [copied, setCopied] = useState(false);
  const [dared, setDared] = useState(false);
  const score = results.filter(Boolean).length;
  const text = shareText(num, results, streak);
  const url = `${window.location.origin}${window.location.pathname}#/play/daily`;

  const copy = async () => {
    if (await copyText(text)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  const dare = async () => {
    const link = challengeLink('/play/daily', { d: day, vs: score, r: results.map((x) => (x ? 1 : 0)).join('') });
    if (await copyText(`I got ${score}/${results.length} on Good Bot, Bad Bot Daily #${num}. Can you beat me? ${link}`)) {
      setDared(true);
      setTimeout(() => setDared(false), 2000);
    }
  };
  const nativeShare = async () => {
    try {
      await navigator.share({ text });
    } catch {
      /* cancelled */
    }
  };

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
          <Swords size={16} strokeWidth={1.75} aria-hidden /> {verdict(score, challenge.score, challenge.from).text}
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
      <p className="small muted">Green = right, red = missed. Show it off:</p>
      <pre className="share-preview">{text}</pre>
      <div className="row wrap center">
        <button type="button" className="btn btn-primary btn-lg" onClick={dare}>
          <Swords size={15} strokeWidth={1.75} aria-hidden /> {dared ? 'Link copied!' : 'Challenge a friend'}
        </button>
        <button type="button" className="btn btn-ghost btn-lg" onClick={copy}>
          <Copy size={15} strokeWidth={1.75} aria-hidden /> {copied ? 'Copied!' : 'Copy my result'}
        </button>
        {typeof navigator !== 'undefined' && navigator.share && (
          <button type="button" className="btn btn-ghost btn-lg" onClick={nativeShare}>
            <Share2 size={15} strokeWidth={1.75} aria-hidden /> Share
          </button>
        )}
        <a className="btn btn-ghost btn-lg" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">Post on X</a>
        <a className="btn btn-ghost btn-lg" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
      <div className="daily-more">
        <span className="muted small">Play more:</span>
        <Link to="/play/this-or-that" className="text-link"><Shuffle size={14} strokeWidth={1.75} aria-hidden /> This or That</Link>
        <Link to="/play/this-or-that?mode=hard" className="text-link"><Eye size={14} strokeWidth={1.75} aria-hidden /> This or That: Hard</Link>
        <Link to="/play/story" className="text-link">Stories</Link>
        <Link to="/play/card" className="text-link">Your player card</Link>
      </div>
    </div>
  );
}

export default function Daily() {
  useTitle('Daily challenge');
  const challenge = useChallenge();
  const todayK = dayKey();
  // A challenge link for another day replays that day's rounds (not saved).
  const key = challenge?.day && challenge.day <= todayK && dailyNumber(challenge.day) >= 1 ? challenge.day : todayK;
  const replay = key !== todayK;
  const num = dailyLabel(key);
  const deck = useMemo(() => dailyDeck(key), [key]);
  const daily = useDaily();
  const [fresh, setFresh] = useState(false);
  const [replayResult, setReplayResult] = useState(null);
  const today = replay ? replayResult : daily[key];

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
          <Swords size={16} strokeWidth={1.75} aria-hidden /> <strong>{challenge.from}</strong> got <strong>{challenge.score}/5</strong> on Daily #{num}. Your turn to beat it!
        </p>
      )}
      <div className="view">
        {today ? (
          <Result num={num} day={key} results={today} streak={dailyStreak(daily)} fresh={fresh && !replay} challenge={challenge} replay={replay} />
        ) : (
          <ThisOrThat
            deck={deck}
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
