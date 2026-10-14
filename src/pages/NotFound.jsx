import { useTitle } from '../lib/useTitle';
import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { patterns } from '../data/patterns';

// A mistyped card link (/patterns/show-sorces): offer a card search with the words from the link.
// The Cards search looks for the whole text, so if the full phrase finds nothing, try its longest word that does.
function cardSearch(pathname) {
  const m = pathname.match(/^\/patterns\/([^/]+)/);
  if (!m) return null;
  let slug = m[1];
  try { slug = decodeURIComponent(slug); } catch { /* a broken % code: use it as typed */ }
  const words = slug.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 40).trim();
  if (!words) return null;
  const text = patterns.map((p) => [p.title, p.summary, p.problem, p.solution].join(' ').toLowerCase());
  const finds = (q) => text.some((t) => t.includes(q));
  if (finds(words)) return words;
  const word = words.split(' ').filter((w) => w.length > 2).sort((a, b) => b.length - a.length).find(finds);
  return word || words;
}

export default function NotFound() {
  useTitle('Page not found');
  const { pathname } = useLocation();
  const q = cardSearch(pathname);
  return (
    <div className="page">
      <header className="page-head">
        <p className="label">404</p>
        <h1 className="display">Page not found</h1>
        <p className="lead">
          {q ? 'No card by that name. It may be hiding under another one.' : 'No bots here, good or bad. The link may be old or mistyped.'}
        </p>
        <div className="actions">
          {q && (
            <Link to={`/patterns?q=${encodeURIComponent(q)}`} className="btn btn-primary">
              <Search size={16} strokeWidth={2} aria-hidden /> Search cards for “{q}”
            </Link>
          )}
          <Link to="/" className={'btn ' + (q ? 'btn-ghost' : 'btn-primary')}>Back to home</Link>
          <Link to="/patterns" className="btn btn-ghost">See all cards</Link>
        </div>
      </header>
    </div>
  );
}
