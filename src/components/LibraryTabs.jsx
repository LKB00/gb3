import { NavLink } from 'react-router-dom';

// One header for every Library page, so reference material feels like one place.
const tabs = [
  { to: '/patterns', label: 'Patterns' },
  { to: '/teardowns', label: 'Teardowns' },
  { to: '/anti-patterns', label: 'Anti-patterns' },
  { to: '/principles', label: 'Principles' },
  { to: '/glossary', label: 'Glossary' },
];

export default function LibraryTabs() {
  return (
    <div className="lib-head">
      <p className="label">Library</p>
      <nav className="tabs" aria-label="Library sections">
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} className="tab">{t.label}</NavLink>
        ))}
      </nav>
    </div>
  );
}
