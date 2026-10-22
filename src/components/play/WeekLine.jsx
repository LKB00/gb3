import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Target } from 'lucide-react';
import { categories, getPattern } from '../../data/patterns';
import { subtle } from '../../data/subtle';
import { THEME_GOAL, themeWeek } from '../../game/themeWeek';
import { useGameStats, useMisses } from '../../progress';

// Play page: this week's theme group and how close you are to its week badge. One quiet line.
export function ThemeWeekLine() {
  const { key, group } = themeWeek();
  const n = Math.min(THEME_GOAL, useGameStats().themeWeeks?.[key] || 0);
  return (
    <p className="week-line">
      <Sparkles size={15} strokeWidth={1.75} aria-hidden />
      <strong>{group.name} week.</strong>
      <span>{n >= THEME_GOAL ? 'Week badge won. Nice!' : `Get ${THEME_GOAL} right to win its badge.`}</span>
      <span className="meter" aria-hidden><span style={{ width: `${(n / THEME_GOAL) * 100}%` }} /></span>
      <span className="small muted">{n}/{THEME_GOAL}</span>
    </p>
  );
}

// Play page: the group you miss most (from "Your misses"), with its boss as the next step.
// Shows only when one group clearly stands out (2 or more misses).
export function WeakSpot() {
  const misses = useMisses();
  const count = {};
  for (const key of misses) {
    // 'c:<pattern id>' for classic rounds, 'h:<hard pair id>' for hard ones (see game/decks.js).
    const id = key.startsWith('h:') ? subtle.find((x) => x.id === key.slice(2))?.pattern : key.slice(2);
    const g = getPattern(id)?.category;
    if (g) count[g] = (count[g] || 0) + 1;
  }
  const [top, n] = Object.entries(count).sort((a, b) => b[1] - a[1])[0] || [];
  if (!top || n < 2) return null;
  const group = categories.find((c) => c.id === top);
  return (
    <p className="week-line">
      <Target size={15} strokeWidth={1.75} aria-hidden />
      <span>You often miss <strong>{group.name}</strong> screens.</span>
      <Link to={`/play/boss/${group.id}`} className="text-link">Try the {group.name} boss <ArrowRight size={13} strokeWidth={1.75} aria-hidden /></Link>
    </p>
  );
}
