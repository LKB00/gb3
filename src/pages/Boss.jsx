import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Crown, RotateCcw, Swords, X } from 'lucide-react';
import { categories, getCategory, getPattern } from '../data/patterns';
import { bossBeaten, bossDeck, bossGoal, bossSize } from '../game/decks';
import { fx } from '../game/fx';
import { saveBoss, useGameStats, XP } from '../progress';
import { buddy } from '../game/buddy';
import ThisOrThat from '../components/ThisOrThat';
import Breadcrumbs from '../components/Breadcrumbs';
import CountUp from '../components/CountUp';
import Burst, { XpPop } from '../components/Burst';
import { PeekLink } from '../components/PatternPeek';
import NotFound from './NotFound';
import { useTitle } from '../lib/useTitle';

// Boss rounds: one tough final per pattern group. Hard pairs first, then classic rounds.
// Miss at most one to beat the boss (7 of 8; a smaller group has fewer rounds, see game/decks.js).
// The best number right per group is saved (saveBoss) and gives XP once per new best.

// The picker: one calm row per group, your best only once you have played it.
function Picker() {
  useTitle('Boss rounds');
  const stats = useGameStats();
  return (
    <div className="page page-wide">
      <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: 'Boss rounds' }]} />
      <header className="page-head page-head-tight">
        <h1 className="display">Boss rounds</h1>
        <p className="lead">Each boss is up to 8 tough rounds from one group. Get all but one right, and the boss is yours.</p>
      </header>
      <ul className="gl-list boss-list">
        {categories.map((c) => {
          const best = stats.boss?.[c.id];
          const beaten = bossBeaten(c.id, best);
          return (
            <li key={c.id}>
              <Link to={`/play/boss/${c.id}`} className="gl-row">
                <span className={`gl-icon boss-icon tag-${c.id}`} aria-hidden>
                  {beaten ? <Crown size={20} strokeWidth={1.75} /> : <Swords size={20} strokeWidth={1.75} />}
                </span>
                <span className="gl-text">
                  <strong>{c.name} boss</strong>
                  <span className="gl-blurb">{c.blurb}</span>
                  {best != null && (
                    <span className={'game-meta' + (beaten ? ' boss-won' : '')}>
                      {beaten ? <><Crown size={13} strokeWidth={1.75} aria-hidden /> Beaten · {best}/{bossSize(c.id)}</> : `Best: ${best}/${bossSize(c.id)}`}
                    </span>
                  )}
                </span>
                <ChevronRight className="gl-go" size={18} strokeWidth={1.75} aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Result({ group, deck, results, gain, onAgain }) {
  const c = getCategory(group);
  const right = results.filter(Boolean).length;
  const goal = bossGoal(group);
  const won = right >= goal;
  const verdict = won
    ? right === deck.length
      ? 'Boss beaten! Not a single miss.'
      : `Boss beaten! The ${c.name} boss is yours.`
    : right === goal - 1
      ? `So close. ${right} of ${deck.length}. Again?`
      : `The boss wins this time. ${right} of ${deck.length}. Again?`;
  // The tricks that got past you, each a quick card peek.
  const missed = deck.filter((r, n) => !results[n]).map((r) => r.pattern).filter((id, n, all) => all.indexOf(id) === n);
  return (
    <div className="tot tot-over boss-over">
      {won && <Burst count={28} />}
      {won ? <Crown className="boss-crown-big" size={32} strokeWidth={1.5} aria-hidden /> : <Swords size={28} strokeWidth={1.5} aria-hidden />}
      <p className="tot-big"><CountUp value={right} /><span>/{deck.length}</span>{gain > 0 && <XpPop amount={gain} />}</p>
      <p className="tot-verdict">{verdict}</p>
      {!won && <p className="small muted">Get {goal} right to win.</p>}
      <div className="row wrap center">
        <button type="button" className={'btn btn-lg ' + (won ? 'btn-ghost' : 'btn-primary')} onClick={onAgain}>
          <RotateCcw size={15} strokeWidth={1.75} aria-hidden /> Play again
        </button>
        <Link to="/play/boss" className={'btn btn-lg ' + (won ? 'btn-primary' : 'btn-ghost')}>Back to bosses</Link>
      </div>
      {missed.length > 0 && (
        <div className="tot-tricks">
          <p className="small muted">Got past you. Tap one for a quick look:</p>
          <ul>
            {missed.map((id) => (
              <li key={id} className="is-wrong">
                <X size={12} strokeWidth={2.5} aria-label="Missed" />
                <PeekLink id={id}>{getPattern(id).title}</PeekLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Fight({ group }) {
  const c = getCategory(group);
  useTitle(`${c.name} boss`);
  const stats = useGameStats();
  const [run, setRun] = useState(0); // a new number = a new deck and a fresh board
  const [deck, setDeck] = useState(() => bossDeck(group));
  const [done, setDone] = useState(null); // { results, gain }
  const size = deck.length;
  const goal = bossGoal(group);

  const finish = (results) => {
    const right = results.filter(Boolean).length;
    const gain = Math.max(0, right - (stats.boss?.[group] || 0)) * XP.boss;
    saveBoss(group, right);
    if (right >= goal) {
      fx('win');
      buddy('win');
    }
    setDone({ results, gain });
  };
  const again = () => {
    setDeck(bossDeck(group));
    setRun((n) => n + 1);
    setDone(null);
  };

  return (
    <div className="page page-wide">
      <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: 'Boss rounds', to: '/play/boss' }, { label: `${c.name} boss` }]} />
      <header className="page-head page-head-tight">
        <h1 className="display">{c.name} boss</h1>
        {!done && <p className="lead">{size} tough rounds on {c.name.toLowerCase()}. Get {goal} right to win.</p>}
      </header>
      <div className="view">
        {done ? (
          <Result group={group} deck={deck} results={done.results} gain={done.gain} onAgain={again} />
        ) : (
          <ThisOrThat key={run} deck={deck} game={`boss-${group}`} onDone={finish} />
        )}
      </div>
    </div>
  );
}

export default function Boss() {
  const { group } = useParams();
  if (!group) return <Picker />;
  if (!getCategory(group)) return <NotFound />;
  return <Fight key={group} group={group} />;
}
