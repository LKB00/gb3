import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// "You are here": every inner page shows its path back to a main place.
export default function Breadcrumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i} className="crumb">
          {i > 0 && <ChevronRight size={12} strokeWidth={1.75} aria-hidden />}
          {it.to ? <Link to={it.to}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}
