import { useTitle } from '../lib/useTitle';
import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { patterns } from '../data/patterns';

// A mistyped card link (/patterns/show-sorces): offer the closest card, if one is close,
// and a card search with the words from the link.
function slugWords(pathname) {
  const m = pathname.match(/^\/patterns\/([^/]+)/);
  if (!m) return null;
  let slug = m[1];
  try { slug = decodeURIComponent(slug); } catch { /* a broken % code: use it as typed */ }
  return slug.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 40).trim() || null;
}
// How many letters to change to turn one word into the other (edit distance).
function distance(a, b) {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++) next[j] = Math.min(row[j] + 1, next[j - 1] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    row = next;
  }
  return row[b.length];
}
function closestCard(words) {
  const typed = words.replace(/ /g, '-');
  let best = null;
  for (const p of patterns) {
    // Links use the card id ("citations"), but people type the title ("show-sources"): check both.
    const d = Math.min(distance(typed, p.id), distance(typed, p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')));
    if (!best || d < best.d) best = { p, d };
  }
  return best && best.d <= Math.max(2, Math.floor(typed.length / 4)) ? best.p : null;
}
// The Cards search looks for the whole text. If the full phrase finds nothing,
// use the word that finds the fewest cards (the most telling one).
function searchText(words) {
  const text = patterns.map((p) => [p.title, p.summary, p.problem, p.solution].join(' ').toLowerCase());
  const hits = (q) => text.filter((t) => t.includes(q)).length;
  if (hits(words)) return words;
  const best = words.split(' ').filter((w) => w.length > 2 && hits(w)).sort((a, b) => hits(a) - hits(b))[0];
  return best || words;
}

export default function NotFound() {
  useTitle('Page not found');
  const { pathname } = useLocation();
  const words = slugWords(pathname);
  const q = words && searchText(words);
  const near = words && closestCard(words);
  return (
    <div className="page">
      <header className="page-head">
        <p className="label">404</p>
        <h1 className="display">Page not found</h1>
        <p className="lead">
          {near ? 'No card by that name. Did you mean this one?' : q ? 'No card by that name. It may be hiding under another one.' : 'No bots here, good or bad. The link may be old or mistyped.'}
        </p>
        <div className="actions">
          {near && <Link to={`/patterns/${near.id}`} className="btn btn-primary">Open “{near.title}”</Link>}
          {q && (
            <Link to={`/patterns?q=${encodeURIComponent(q)}`} className={'btn ' + (near ? 'btn-ghost' : 'btn-primary')}>
              <Search size={16} strokeWidth={2} aria-hidden /> Search cards for “{q}”
            </Link>
          )}
          {/* One loud way forward. With a card to suggest, home is a quiet text link, not a third button. */}
          {q ? (
            <Link to="/" className="text-link nf-home">Back to home</Link>
          ) : (
            <>
              <Link to="/" className="btn btn-primary">Back to home</Link>
              <Link to="/patterns" className="btn btn-ghost">See all cards</Link>
            </>
          )}
        </div>
      </header>
    </div>
  );
}
