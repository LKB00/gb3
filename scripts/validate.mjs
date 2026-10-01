// Content check: finds broken links between data files before visitors do.
// Examples it catches: a story choice pointing at a scene that doesn't exist, a build
// brief you can't score 3 stars on, a pattern id with a typo, an unknown screen block type.
// Run with `npm run validate` (also part of `npm run check`).
import fs from 'fs';
import { patterns, categories } from '../src/data/patterns.js';
import { visuals } from '../src/data/visuals.js';
import { realExamples } from '../src/data/examples.js';
import { principles, haxGuidelines, patternPrinciples } from '../src/data/principles.js';
import { lessons } from '../src/data/lessons.js';
import { teardowns } from '../src/data/teardowns.js';
import { subtle } from '../src/data/subtle.js';
import { hunts } from '../src/data/hunts.js';
import { stories } from '../src/data/story.js';
import { builds } from '../src/data/builds.js';
import { antipatterns } from '../src/data/antipatterns.js';
import { glossary, furtherReading } from '../src/data/glossary.js';
import { levels, tasks, questions, suggestLevel } from '../src/data/autonomy.js';

const problems = [];
const bad = (where, msg) => problems.push(`${where}: ${msg}`);
const dupes = (list) => list.filter((x, i) => list.indexOf(x) !== i);

const patternIds = new Set(patterns.map((p) => p.id));
const mustPattern = (where, id) => patternIds.has(id) || bad(where, `unknown pattern "${id}"`);

// Block types Mock.jsx can draw (every `case 'x':` in its switch).
const mock = fs.readFileSync(new URL('../src/mock/Mock.jsx', import.meta.url), 'utf8');
const blockTypes = new Set([...mock.matchAll(/case '(\w+)':/g)].map((m) => m[1]));
const checkBlocks = (where, blocks, { allowEmpty = false } = {}) => {
  if (!Array.isArray(blocks) || (blocks.length === 0 && !allowEmpty)) return bad(where, 'no blocks');
  blocks.forEach((b, i) => {
    if (b.slot) return;
    if (!blockTypes.has(b.type)) bad(`${where}[${i}]`, `unknown block type "${b.type}"`);
  });
};

// ---- Patterns, categories, demos ----
dupes(patterns.map((p) => p.id)).forEach((id) => bad('patterns', `duplicate id "${id}"`));
const catIds = new Set(categories.map((c) => c.id));
const demoSrc = fs.readFileSync(new URL('../src/demos/index.js', import.meta.url), 'utf8');
const demoKeys = new Set([...demoSrc.slice(demoSrc.indexOf('export const demos')).matchAll(/^\s+(\w+),?$/gm)].map((m) => m[1]));
for (const p of patterns) {
  const w = `pattern ${p.id}`;
  if (!catIds.has(p.category)) bad(w, `unknown category "${p.category}"`);
  for (const f of ['title', 'summary', 'problem', 'solution']) if (!p[f]?.trim()) bad(w, `empty ${f}`);
  for (const f of ['when', 'avoid', 'dos', 'donts']) if (!p[f]?.length) bad(w, `empty ${f}`);
  if (p.demo && !demoKeys.has(p.demo)) bad(w, `demo "${p.demo}" is not in demos/index.js`);
  if (!realExamples[p.id]?.length) bad(w, 'no real examples');
  if (!patternPrinciples[p.id]?.length) bad(w, 'no principles linked');

  const v = visuals[p.id];
  if (!v) { bad(w, 'no visuals entry'); continue; }
  checkBlocks(`${w} compare.good`, v.compare?.good?.blocks);
  checkBlocks(`${w} compare.bad`, v.compare?.bad?.blocks);
  const lab = v.lab;
  if (!lab?.goal) bad(w, 'lab has no goal');
  const ds = lab?.decisions || [];
  if (ds.length < 1) bad(w, 'lab has no decisions');
  dupes(ds.map((d) => d.id)).forEach((id) => bad(w, `lab duplicate decision "${id}"`));
  checkBlocks(`${w} lab.frame`, lab?.frame);
  for (const f of lab?.frame || []) if (f.slot && !ds.some((d) => d.id === f.slot)) bad(w, `frame slot "${f.slot}" has no decision`);
  for (const d of ds) {
    const dw = `${w} lab.${d.id}`;
    if ((d.options || []).length < 2) bad(dw, 'fewer than 2 options');
    const ok = (d.options || []).filter((o) => o.ok).length;
    if (ok !== 1) bad(dw, `needs exactly one right option, has ${ok}`);
    for (const [i, o] of (d.options || []).entries()) {
      if (!o.label?.trim()) bad(`${dw}[${i}]`, 'empty label');
      if (!o.ok && !o.why?.trim()) bad(`${dw}[${i}]`, 'wrong option without a "why"');
      checkBlocks(`${dw}[${i}]`, o.blocks, { allowEmpty: true }); // empty = the option adds nothing to the screen
    }
  }
}
for (const id of Object.keys(visuals)) if (!patternIds.has(id)) bad('visuals', `entry for unknown pattern "${id}"`);
for (const id of Object.keys(realExamples)) if (!patternIds.has(id)) bad('examples', `entry for unknown pattern "${id}"`);

// ---- Principles, HAX ----
const principleIds = new Set(principles.map((p) => p.id));
dupes(principles.map((p) => p.id)).forEach((id) => bad('principles', `duplicate id "${id}"`));
for (const [pid, list] of Object.entries(patternPrinciples)) {
  mustPattern('patternPrinciples', pid);
  for (const [id] of list) principleIds.has(id) || bad(`patternPrinciples.${pid}`, `unknown principle "${id}"`);
}
for (const g of haxGuidelines) g.patterns.forEach((id) => mustPattern(`HAX ${g.n}`, id));

// ---- Lessons, teardowns, dark patterns, glossary ----
dupes(lessons.map((l) => l.id)).forEach((id) => bad('lessons', `duplicate id "${id}"`));
for (const l of lessons) (l.patterns || []).forEach((id) => mustPattern(`lesson ${l.id}`, id));
dupes(teardowns.map((t) => t.id)).forEach((id) => bad('teardowns', `duplicate id "${id}"`));
for (const t of teardowns) {
  t.journey.forEach((j, i) => j.patterns.forEach((id) => mustPattern(`teardown ${t.id} stage ${i + 1}`, id)));
  t.better.forEach((b) => mustPattern(`teardown ${t.id} better`, b.pattern));
}
dupes(antipatterns.map((a) => a.id)).forEach((id) => bad('antipatterns', `duplicate id "${id}"`));
for (const a of antipatterns) {
  a.patterns.forEach((id) => mustPattern(`dark pattern ${a.id}`, id));
  checkBlocks(`dark pattern ${a.id}`, a.blocks);
}
dupes(glossary.map((g) => g.term)).forEach((t) => bad('glossary', `duplicate term "${t}"`));
for (const r of furtherReading) if (!/^https:\/\//.test(r.url)) bad('furtherReading', `link is not https: ${r.url}`);

// ---- Games: Spot the flaw, hard pairs ----
dupes(hunts.map((h) => h.id)).forEach((id) => bad('hunts', `duplicate id "${id}"`));
for (const h of hunts) {
  const w = `hunt ${h.id}`;
  checkBlocks(w, h.blocks);
  const wrong = h.blocks.filter((b) => b.mistake);
  if (wrong.length < 1) bad(w, 'has no mistakes to find');
  if (wrong.length === h.blocks.length) bad(w, 'every block is a mistake');
  wrong.forEach((b) => { mustPattern(w, b.mistake.pattern); b.mistake.text || bad(w, 'mistake without text'); });
}
dupes(subtle.map((s) => s.id)).forEach((id) => bad('subtle', `duplicate id "${id}"`));
for (const s of subtle) {
  const w = `hard pair ${s.id}`;
  mustPattern(w, s.pattern);
  checkBlocks(`${w} good`, s.good);
  checkBlocks(`${w} bad`, s.bad);
  if (JSON.stringify(s.good) === JSON.stringify(s.bad)) bad(w, 'good and bad are identical');
  if (!s.goodCaption || !s.badCaption) bad(w, 'missing caption');
}

// ---- Build mode: every brief must be winnable, and traps must be avoidable ----
dupes(builds.map((b) => b.id)).forEach((id) => bad('builds', `duplicate id "${id}"`));
for (const b of builds) {
  const w = `build ${b.id}`;
  checkBlocks(`${w} base`, b.base);
  dupes(b.pieces.map((p) => p.id)).forEach((id) => bad(w, `duplicate piece "${id}"`));
  if (!b.pieces.some((p) => p.kind === 'need')) bad(w, 'no needed pieces');
  if (!b.pieces.some((p) => p.kind === 'trap')) bad(w, 'no traps');
  for (const p of b.pieces) {
    if (!['need', 'nice', 'trap'].includes(p.kind)) bad(`${w} ${p.id}`, `bad kind "${p.kind}"`);
    mustPattern(`${w} ${p.id}`, p.pattern);
    checkBlocks(`${w} ${p.id}`, [p.block]);
    if (!p.why) bad(`${w} ${p.id}`, 'no explanation');
  }
}

// ---- Stories: every path must reach an ending ----
dupes(stories.map((s) => s.id)).forEach((id) => bad('stories', `duplicate id "${id}"`));
for (const st of stories) {
  const w = `story ${st.id}`;
  if (!st.scenes[st.start]) bad(w, `start scene "${st.start}" missing`);
  const nextOf = (sc, c) => (c.next !== undefined ? c.next : sc.next) || null;
  const seen = new Set();
  const walk = (id) => {
    if (seen.has(id)) return;
    seen.add(id);
    const sc = st.scenes[id];
    if (!sc) return bad(w, `a choice leads to missing scene "${id}"`);
    checkBlocks(`${w}.${id} screen`, sc.screen);
    if (!sc.choices?.length) bad(`${w}.${id}`, 'no choices');
    for (const [i, c] of (sc.choices || []).entries()) {
      if (typeof c.trust !== 'number') bad(`${w}.${id}[${i}]`, 'trust is not a number');
      if (c.pattern) mustPattern(`${w}.${id}[${i}]`, c.pattern);
      if (!c.reaction) bad(`${w}.${id}[${i}]`, 'no reaction text');
      c.ui && checkBlocks(`${w}.${id}[${i}] ui`, c.ui);
      const n = nextOf(sc, c);
      if (n) walk(n);
    }
  };
  walk(st.start);
  for (const id of Object.keys(st.scenes)) if (!seen.has(id)) bad(w, `scene "${id}" can never be reached`);
  // Loops: a scene that can lead back to itself would never end.
  const visiting = new Set();
  const loops = (id) => {
    if (visiting.has(id)) return bad(w, `scenes loop forever through "${id}"`);
    visiting.add(id);
    const sc = st.scenes[id];
    for (const c of sc?.choices || []) { const n = nextOf(sc, c); if (n && st.scenes[n]) loops(n); }
    visiting.delete(id);
  };
  loops(st.start);
  // Trust range over all paths, to check the endings cover every possible score.
  const range = (id) => {
    const sc = st.scenes[id];
    const outs = sc.choices.map((c) => { const n = nextOf(sc, c); const r = n ? range(n) : [0, 0]; return [c.trust + r[0], c.trust + r[1]]; });
    return [Math.min(...outs.map((o) => o[0])), Math.max(...outs.map((o) => o[1]))];
  };
  if (!problems.some((p) => p.startsWith(w))) {
    const [lo, hi] = range(st.start);
    const lowest = Math.max(0, Math.min(100, st.trustStart + lo));
    const mins = st.endings.map((e) => e.min);
    if (!mins.some((m) => m <= lowest)) bad(w, `no ending for a trust score of ${lowest}`);
    if (st.trustStart + hi < Math.max(...mins)) bad(w, `best ending (needs ${Math.max(...mins)}) can't be reached; best possible is ${st.trustStart + hi}`);
  }
}

// ---- How much power? ----
dupes(tasks.map((t) => t.id)).forEach((id) => bad('power tasks', `duplicate id "${id}"`));
for (const l of levels) {
  l.patterns.forEach((id) => mustPattern(`autonomy level ${l.n}`, id));
  checkBlocks(`autonomy level ${l.n} screen`, l.screen);
  if (tasks.filter((t) => t.level === l.n).length < 2) bad(`autonomy level ${l.n}`, 'fewer than 2 game tasks');
}
for (const t of tasks) {
  if (!levels.some((l) => l.n === t.level)) bad(`power task ${t.id}`, `level ${t.level} doesn't exist`);
  if (!t.why) bad(`power task ${t.id}`, 'no explanation');
}
if (tasks.length < 8) bad('power tasks', 'fewer than 8 tasks');
const combos = questions.reduce((acc, q) => acc.flatMap((a) => q.options.map(([v]) => ({ ...a, [q.id]: v }))), [{}]);
for (const a of combos) {
  const n = suggestLevel(a);
  if (!levels.some((l) => l.n === n)) bad('level finder', `answers ${JSON.stringify(a)} give level ${n}`);
}

// ---- Leftovers in any text ----
const strings = [];
(function collect(x) {
  if (typeof x === 'string') strings.push(x);
  else if (Array.isArray(x)) x.forEach(collect);
  else if (x && typeof x === 'object') Object.values(x).forEach(collect);
})([patterns, visuals, lessons, teardowns, subtle, hunts, stories, builds, tasks, antipatterns, glossary, levels, questions]);
for (const t of strings) {
  if (/\bundefined\b|\bTODO\b|\bFIXME\b|lorem ipsum|\[object|\bNaN\b/.test(t)) bad('text', `leftover in "${t.slice(0, 60)}"`);
}

if (problems.length) {
  console.error(`${problems.length} content problem(s):\n- ` + problems.join('\n- '));
  process.exit(1);
}
console.log(`Content OK: ${patterns.length} patterns, ${stories.length} stories, ${builds.length} briefs, ${hunts.length} flaw screens, ${subtle.length} hard pairs, ${tasks.length} power tasks.`);
