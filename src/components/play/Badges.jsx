import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { categories, patterns } from '../../data/patterns';
import { usePassed, useStars } from '../../progress';
import { isMissing, needsStars } from '../../game/useRandomChallenge';

// One badge per pattern group: collect every card to win it, all 3 stars for gold.
// Each badge opens the card that moves it forward: the first one to collect,
// then the first one under 3 stars. A gold badge opens its group.
// `row` = one compact row that scrolls sideways on phones (the Play page).
export default function Badges({ row = false }) {
  const passed = usePassed();
  const stars = useStars();
  return (
    <ul className={'badges' + (row ? ' badges-row' : '')}>
      {categories.map((c) => {
        const list = patterns.filter((p) => p.category === c.id);
        const got = list.filter((p) => passed.includes(p.id)).length;
        const missing = list.find((p) => isMissing(p.id, passed));
        const low = list.filter((p) => needsStars(p.id, passed, stars));
        const won = got === list.length;
        const gold = won && low.length === 0;
        const to = missing ? `/patterns/${missing.id}` : low.length ? `/patterns/${low[0].id}` : `/patterns?category=${c.id}`;
        const sub = gold
          ? 'Gold! All 3 stars'
          : won
            ? `${low.length} ${low.length === 1 ? 'card needs' : 'cards need'} 3 stars for gold`
            : `${list.length - got} ${list.length - got === 1 ? 'card' : 'cards'} to go`;
        return (
          <li key={c.id} className={'badge' + (won ? ' is-won' : '') + (gold ? ' is-gold' : '')}>
            <Link to={to}>
              <span className={`badge-icon badge-${c.id}`} aria-hidden>{won ? <Check size={18} strokeWidth={2.25} /> : `${got}/${list.length}`}</span>
              <span className="badge-name">{c.name}</span>
              <span className="badge-sub">{sub}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
