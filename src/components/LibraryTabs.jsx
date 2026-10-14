import { useLayoutEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { EXPLORE_TABS } from '../config/nav';

// Slide a tab row sideways so the lit tab is in view, clear of the faded right edge on phones.
// Only the row moves, never the page (scrollIntoView would also scroll the page up or down).
export function showActiveTab(row) {
  const tab = row?.querySelector('.active, [aria-selected="true"]');
  if (!tab) return;
  const fade = 32;
  const r = row.getBoundingClientRect();
  const t = tab.getBoundingClientRect();
  if (t.right > r.right - fade) row.scrollLeft += t.right - (r.right - fade);
  else if (t.left < r.left) row.scrollLeft -= r.left - t.left;
}

// One header for every Explore page, so the deeper material feels like one place.
// On phones the tabs sit in a 3 x 2 grid (phone.css), so none hide off the edge.
export default function LibraryTabs() {
  const { pathname } = useLocation();
  const row = useRef(null);
  useLayoutEffect(() => showActiveTab(row.current), [pathname]);
  return (
    <div className="lib-head">
      <p className="label">Explore</p>
      <nav className="tabs lib-tabs" aria-label="Explore sections" ref={row}>
        {EXPLORE_TABS.map((t) => (
          <NavLink key={t.to} to={t.to} className="tab" aria-label={t.short ? t.label : undefined}>
            {t.short ? (
              <>
                <span className="tab-long">{t.label}</span>
                <span className="tab-short">{t.short}</span>
              </>
            ) : t.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
