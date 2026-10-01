import { NavLink } from 'react-router-dom';
import { EXPLORE_TABS } from '../config/nav';

// One header for every Explore page, so the deeper material feels like one place.
export default function LibraryTabs() {
  return (
    <div className="lib-head">
      <p className="label">Explore</p>
      <nav className="tabs" aria-label="Explore sections">
        {EXPLORE_TABS.map((t) => (
          <NavLink key={t.to} to={t.to} className="tab">{t.label}</NavLink>
        ))}
      </nav>
    </div>
  );
}
