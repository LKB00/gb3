import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <span>AI Patterns — a free place to learn AI interaction design.</span>
        <nav className="footer-nav" aria-label="Footer">
          <Link to="/patterns">Patterns</Link>
          <Link to="/practice">Practice</Link>
          <Link to="/learn">Learning path</Link>
        </nav>
      </div>
    </footer>
  );
}
