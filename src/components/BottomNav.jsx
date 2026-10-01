import { NavLink, useLocation } from 'react-router-dom';
import { Compass, Gamepad2, House, Layers, UserRound } from 'lucide-react';

// Phone only (hidden on bigger screens by CSS): the main places sit at the
// bottom, where thumbs can reach them, like in most mobile apps.
const EXPLORE = ['/autonomy', '/teardowns', '/anti-patterns', '/principles', '/glossary', '/learn'];
const tabs = [
  { to: '/', label: 'Home', icon: House, match: (p) => p === '/' },
  { to: '/play', label: 'Play', icon: Gamepad2, match: (p) => p.startsWith('/play') || p.startsWith('/practice') },
  { to: '/patterns', label: 'Cards', icon: Layers, match: (p) => p.startsWith('/patterns') },
  { to: '/teardowns', label: 'Explore', icon: Compass, match: (p) => EXPLORE.some((x) => p.startsWith(x)) },
  { to: '/me', label: 'Me', icon: UserRound, match: (p) => p.startsWith('/me') },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="bottomnav" aria-label="Main">
      {tabs.map(({ to, label, icon: Icon, match }) => {
        const on = match(pathname);
        return (
          <NavLink key={to} to={to} className={'bottomnav-tab' + (on ? ' is-on' : '')} aria-current={on ? 'page' : undefined}>
            <span className="bottomnav-icon"><Icon size={20} strokeWidth={on ? 2.25 : 1.75} aria-hidden /></span>
            <span>{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
