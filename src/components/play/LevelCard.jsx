import { patterns } from '../../data/patterns';
import { hunts } from '../../data/hunts';
import { useGameStats, useHuntsDone, usePassed, useXP } from '../../progress';

// Level, XP bar and a few totals, at the top of the Me page.
// No box and no stat tiles: the Today card below is the one thing to act on, so this stays quiet.
// XP itself is in the top bar, so it isn't repeated here. Totals show only once they're above 0:
// a new player sees their level and one next step, not a row of zeros.
export default function LevelCard() {
  const { xp, level, levelNum, nextLevel, toNext, starTotal } = useXP();
  const passed = usePassed();
  const huntsDone = useHuntsDone();
  const stats = useGameStats();
  const floor = level.xp;
  const facts = [
    passed.length > 0 && [`${passed.length}/${patterns.length}`, 'cards'],
    starTotal > 0 && [starTotal, 'stars'],
    huntsDone.length > 0 && [`${huntsDone.length}/${hunts.length}`, 'flaw screens'],
    stats.bestStreak > 0 && [stats.bestStreak, 'best streak'],
  ].filter(Boolean);
  const pct = nextLevel ? ((xp - floor) / (nextLevel.xp - floor)) * 100 : 100;
  return (
    <div className="me-level">
      <div className="level-top">
        <span className="level-badge">{levelNum}</span>
        <div>
          <p className="label">Level {levelNum}</p>
          <p className="level-name">{level.name}</p>
        </div>
      </div>
      <span className="meter meter-xp" aria-hidden><span style={{ width: `${pct}%` }} /></span>
      <p className="small muted">{nextLevel ? `${toNext} XP until ${nextLevel.name}` : 'Top level. You’re a Legend!'}</p>
      {facts.length > 0 && (
        <ul className="me-facts">
          {facts.map(([n, label]) => <li key={label}><strong>{n}</strong> {label}</li>)}
        </ul>
      )}
    </div>
  );
}
