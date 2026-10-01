import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Check, FlaskConical, House, LayoutGrid, Menu, Moon, Sun, X } from 'lucide-react';
import { categories, patterns } from '../data/patterns';
import { usePassed } from '../progress';
import { useTheme } from '../theme';

const ICON = { size: 16, strokeWidth: 1.75, 'aria-hidden': true };

function Logo() {
  return (
    <Link to="/" className="logo">
      <span className="logo-mark" aria-hidden />
      AI Patterns
    </Link>
  );
}

// Docs-style navigation: main links, then every pattern grouped by category.
// On small screens it becomes a drawer opened from the top bar.
export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const passed = usePassed();
  const [isDark, toggleTheme] = useTheme();

  const groupsRef = useRef(null);

  useEffect(() => setOpen(false), [pathname]);

  // Keep the current pattern visible in the long list, so people never lose their place.
  useEffect(() => {
    const active = groupsRef.current?.querySelector('.sb-row.active');
    if (active) active.scrollIntoView({ block: 'nearest' });
    else if (groupsRef.current) groupsRef.current.scrollTop = 0;
  }, [pathname]);

  return (
    <>
      <div className="topbar">
        <Logo />
        <button className="icon-btn" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>
          <Menu {...ICON} />
        </button>
      </div>

      <aside className={'sidebar' + (open ? ' sidebar-open' : '')} aria-label="Site">
        <div className="sb-head">
          <Logo />
          <button className="icon-btn sb-close" onClick={() => setOpen(false)} aria-label="Close menu">
            <X {...ICON} />
          </button>
        </div>

        <nav className="sb-nav" aria-label="Main">
          <NavLink to="/" end className="sb-link"><House {...ICON} />Overview</NavLink>
          <NavLink to="/patterns" end className="sb-link"><LayoutGrid {...ICON} />All patterns</NavLink>
          <NavLink to="/practice" className="sb-link"><FlaskConical {...ICON} />Practice</NavLink>
          <NavLink to="/learn" className="sb-link"><BookOpen {...ICON} />Learn</NavLink>
        </nav>

        <nav className="sb-groups" aria-label="Patterns" ref={groupsRef}>
          {categories.map((c) => (
            <div key={c.id} className="sb-group">
              <p className="label sb-label">{c.name}</p>
              {patterns
                .filter((p) => p.category === c.id)
                .map((p) => (
                  <NavLink key={p.id} to={`/patterns/${p.id}`} className="sb-row">
                    <span className={`sb-dot dot-${c.id}`} aria-hidden />
                    <span className="sb-row-text">{p.title}</span>
                    {passed.includes(p.id) && <Check size={13} strokeWidth={2} className="sb-done" aria-label="Lab passed" />}
                  </NavLink>
                ))}
            </div>
          ))}
        </nav>

        <div className="sb-foot">
          <button className="sb-link" onClick={toggleTheme}>
            {isDark ? <Sun {...ICON} /> : <Moon {...ICON} />}
            {isDark ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </aside>

      {open && <div className="scrim" onClick={() => setOpen(false)} aria-hidden />}
    </>
  );
}
