import { useEffect, useRef, useState } from 'react';
import { Lock, Sparkles, Trophy } from 'lucide-react';
import { achievements } from '../data/achievements';
import { stories } from '../data/story';
import { readAchievements, readProgress, saveDayStreak, storyBests, streakInfo, unlockAchievement, useAchievements } from '../progress';
import { CHANGE, writeJSON } from '../lib/storage';
import { fx } from '../game/fx';
import { bossBeaten } from '../game/decks';
import Burst from './Burst';

// What the achievement rules look at (see data/achievements.js), read fresh from storage.
function context() {
  const p = readProgress();
  const { streak } = streakInfo(p.days);
  if (streak > p.stats.bestDayStreak) saveDayStreak(streak);
  const bests = storyBests(p.stats);
  return {
    ...p,
    bestDayStreak: Math.max(p.stats.bestDayStreak, streak),
    storyTop: stories.some((st) => (bests[st.id] ?? -1) >= st.endings[0].min),
    bossBeaten: Object.entries(p.stats.boss).filter(([g, n]) => bossBeaten(g, n)).length,
  };
}

const hasSaved = () => {
  try {
    return localStorage.getItem('achievements') !== null;
  } catch {
    return true;
  }
};

// Watches progress and pops a toast when an achievement is earned, wherever you are.
// The very first check (a player from before achievements existed) unlocks quietly, so nobody gets 6 toasts at once.
export function AchievementToast() {
  const [queue, setQueue] = useState([]);
  const busy = useRef(false);

  useEffect(() => {
    const quiet = !hasSaved();
    const earn = (list) => {
      const got = list.filter((a) => unlockAchievement(a.id));
      if (got.length) setQueue((q) => [...q, ...got]);
    };
    const check = () => {
      if (busy.current) return; // unlocking saves, which fires CHANGE again
      busy.current = true;
      try {
        const done = readAchievements();
        const p = context();
        earn(achievements.filter((a) => !done[a.id] && a.test?.(p)));
      } finally {
        busy.current = false;
      }
    };
    if (quiet) {
      const p = context();
      const now = Object.fromEntries(achievements.filter((a) => a.test?.(p)).map((a) => [a.id, new Date().toISOString().slice(0, 10)]));
      writeJSON('achievements', now);
    } else check();
    const onEvent = (e) => {
      const done = readAchievements();
      earn(achievements.filter((a) => !done[a.id] && a.event?.(e.detail || {})));
    };
    window.addEventListener(CHANGE, check);
    window.addEventListener('storage', check);
    window.addEventListener('gb3-event', onEvent);
    return () => {
      window.removeEventListener(CHANGE, check);
      window.removeEventListener('storage', check);
      window.removeEventListener('gb3-event', onEvent);
    };
  }, []);

  const now = queue[0];
  useEffect(() => {
    if (!now) return;
    fx('star', { n: 3 });
    const t = setTimeout(() => setQueue((q) => q.slice(1)), 4200);
    return () => clearTimeout(t);
  }, [now]);

  if (!now) return null;
  return (
    <div className="goal-toast achieve-toast" role="status" key={now.id}>
      <Burst count={18} />
      <Trophy size={18} strokeWidth={1.75} aria-hidden />
      <span>
        <strong>{now.name}</strong> {now.reward || now.how.replace(/\.$/, '') + '. Nice!'}
      </span>
    </div>
  );
}

// Me page: every achievement. Earned ones first; secret ones stay a mystery until earned.
export function AchievementList() {
  const earned = useAchievements();
  const got = achievements.filter((a) => earned[a.id]);
  const left = achievements.filter((a) => !earned[a.id]);
  return (
    <>
      <p className="section-sub">{got.length} of {achievements.length} earned. A few are secret.</p>
      <ul className="achievements">
        {[...got, ...left].map((a) => {
          const has = !!earned[a.id];
          const hidden = a.secret && !has;
          return (
            <li key={a.id} className={'achievement' + (has ? ' is-earned' : '')}>
              <span className="achievement-icon" aria-hidden>
                {has ? <Trophy size={16} strokeWidth={1.75} /> : hidden ? <Sparkles size={16} strokeWidth={1.75} /> : <Lock size={15} strokeWidth={1.75} />}
              </span>
              <span className="achievement-text">
                <strong>{hidden ? 'Secret' : a.name}</strong>
                <span className="small muted">{hidden ? 'Keep playing to find it.' : a.how}{has && a.reward ? ` ${a.reward}` : ''}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
