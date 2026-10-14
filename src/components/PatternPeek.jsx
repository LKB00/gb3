import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { categories, getPattern } from '../data/patterns';

// A quick look at a card without leaving the game: a sheet slides up over the page.
// Use <PeekLink id="citations">Show sources</PeekLink> wherever a game links to a card,
// so a curious tap never throws away the run. "Open the full card" is still one tap away.
export function PeekLink({ id, children, className = '' }) {
  const [open, setOpen] = useState(false);
  const p = getPattern(id);
  if (!p) return children;
  return (
    <>
      <button type="button" className={'peek-link ' + className} onClick={() => setOpen(true)} aria-haspopup="dialog">
        {children}
      </button>
      {open && <PatternPeek pattern={p} onClose={() => setOpen(false)} />}
    </>
  );
}

export default function PatternPeek({ pattern: p, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const back = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      back?.focus?.({ preventScroll: true });
    };
  }, [onClose]);
  const group = categories.find((c) => c.id === p.category);

  return createPortal(
    <div className="peek-backdrop" onClick={onClose}>
      <div className="peek" role="dialog" aria-modal="true" aria-labelledby="peek-title" onClick={(e) => e.stopPropagation()}>
        <div className="peek-head">
          {group && <span className={`tag tag-${p.category}`}>{group.name}</span>}
          <button ref={closeRef} type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} strokeWidth={1.75} aria-hidden />
          </button>
        </div>
        <h2 id="peek-title" className="peek-title">{p.title}</h2>
        <p className="peek-summary">{p.summary}</p>
        <p className="label">What to do</p>
        <p className="peek-text">{p.solution}</p>
        {p.dos?.length > 0 && (
          <ul className="peek-dos">
            {p.dos.slice(0, 3).map((d) => <li key={d}>{d}</li>)}
          </ul>
        )}
        <div className="peek-actions">
          <button type="button" className="btn btn-primary" onClick={onClose}>Back to the game</button>
          <Link to={`/patterns/${p.id}`} className="btn btn-ghost" onClick={onClose}>
            Open the full card <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
