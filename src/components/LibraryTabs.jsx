import { NavLink } from 'react-router-dom';

// One header for every Explore page, so the deeper material feels like one place.
const tabs = [
  { to: '/autonomy', label: 'Autonomy ladder' },
  { to: '/teardowns', label: 'Teardowns' },
  { to: '/anti-patterns', label: 'Dark patterns' },
  { to: '/principles', label: 'Principles' },
  { to: '/glossary', label: 'Glossary' },
  { to: '/learn', label: 'Deep dives' },
];

export default function LibraryTabs() {
  return (
    <div className="lib-head">
      <p className="label">Explore</p>
      <nav className="tabs" aria-label="Explore sections">
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} className="tab">{t.label}</NavLink>
        ))}
      </nav>
    </div>
  );
}
