import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Copy, Eye, Flame, Share2, Shuffle } from 'lucide-react';
import { dailyDeck, dailyNumber, todayKey } from '../game/decks';
import { dailyStreak, saveDaily, useDaily, XP } from '../progress';
import ThisOrThat from '../components/ThisOrThat';
import Breadcrumbs from '../components/Breadcrumbs';
import Burst, { XpPop } from '../components/Burst';
import { useTitle } from '../useTitle';

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
  return `AI Patterns Daily #${num} · ${results.filter(Boolean).length}/${results.length}\n${grid}${streak > 1 ? `\n🔥 ${streak} days in a row` : ''}\nCan you spot good AI design? ${url}`;
}

function Result({ num, results, streak, fresh }) {
  const left = useCountdown();
  const [copied, setCopied] = useState(false);
  const score = results.filter(Boolean).length;
  const text = shareText(num, results, streak);
  const url = `${window.location.origin}${window.location.pathname}#/play/daily`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the text is still visible to copy by hand */
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
      <p className="tot-big">{score}<span>/{results.length}</span>{fresh && score > 0 && <XpPop amount={score * XP.daily} />}</p>
      <div className="daily-grid" aria-label={`${score} of ${results.length} right`}>
        {results.map((r, i) => <span key={i} className={r ? 'is-right' : 'is-wrong'} />)}
      </div>
      <p className="tot-verdict">
        {score === results.length ? 'Perfect day.' : score >= 3 ? 'Solid. Can your team beat it?' : 'Tough one today. Tomorrow’s a new set.'}
      </p>
      <div className="tot-stats">
        {streak > 0 && <span className="pill-streak"><Flame size={14} strokeWidth={1.75} aria-hidden /> {streak} day{streak > 1 ? 's' : ''} in a row</span>}
        <span><CalendarDays size={14} strokeWidth={1.75} aria-hidden /> Next Daily in {left}</span>
      </div>
      <pre className="share-preview">{text}</pre>
      <div className="row wrap center">
        <button type="button" className="btn btn-primary btn-lg" onClick={copy}>
          <Copy size={15} strokeWidth={1.75} aria-hidden /> {copied ? 'Copied!' : 'Copy result'}
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
        <span className="muted small">Want more today?</span>
        <Link to="/play/this-or-that" className="text-link"><Shuffle size={14} strokeWidth={1.75} aria-hidden /> Classic</Link>
        <Link to="/play/this-or-that?mode=hard" className="text-link"><Eye size={14} strokeWidth={1.75} aria-hidden /> Hard mode</Link>
        <Link to="/play/story" className="text-link">Agent on duty</Link>
      </div>
    </div>
  );
}

export default function Daily() {
  useTitle('Daily challenge');
  const key = todayKey();
  const num = dailyNumber(key);
  const deck = useMemo(() => dailyDeck(key), [key]);
  const daily = useDaily();
  const [fresh, setFresh] = useState(false);
  const today = daily[key];

  return (
    <div className="page page-wide">
      <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: `Daily #${num}` }]} />
      <header className="page-head page-head-tight">
        <h1 className="display">Daily #{num}</h1>
        <p className="lead">5 rounds, the same for everyone today. One try. The last two are hard.</p>
      </header>
      <div className="view">
        {today ? (
          <Result num={num} results={today} streak={dailyStreak(daily)} fresh={fresh} />
        ) : (
          <ThisOrThat
            deck={deck}
            onDone={(r) => {
              setFresh(true);
              saveDaily(key, r);
            }}
          />
        )}
      </div>
    </div>
  );
}
