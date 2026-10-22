// 'YYYY-MM-DD' in the visitor's own time zone. Used as the key for daily data.
export function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ISO week like '2026-W43' (weeks start on Monday), in the visitor's own time zone.
// Used for weekly things: Screen of the week, theme weeks, "beat your last week", the Monday recap.
export function weekKey(d = new Date()) {
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (t.getDay() + 6) % 7; // Monday = 0
  t.setDate(t.getDate() - day + 3); // the Thursday of this week decides the year
  const jan4 = new Date(t.getFullYear(), 0, 4);
  const week = 1 + Math.round(((t - jan4) / 86400000 - 3 + ((jan4.getDay() + 6) % 7)) / 7);
  return `${t.getFullYear()}-W${String(week).padStart(2, '0')}`;
}
