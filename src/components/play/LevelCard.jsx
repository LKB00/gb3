import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import CountUp from '../CountUp';
import { patterns } from '../../data/patterns';
import { hunts } from '../../data/hunts';
import { useGameStats, useHuntsDone, usePassed, useXP } from '../../progress';

// Level, XP bar and a few totals. On Play (desktop) and on Me.
export default function LevelCard() {
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
        <p className="level-xp"><Zap size={16} strokeWidth={2} aria-hidden /> <CountUp value={xp} /> XP</p>
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
