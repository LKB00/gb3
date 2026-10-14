import { useTitle } from '../lib/useTitle';
import { Link } from 'react-router-dom';

export default function NotFound() {
  useTitle('Page not found');
  return (
    <div className="page">
      <header className="page-head">
        <p className="label">404</p>
        <h1 className="display">Page not found</h1>
        <p className="lead">No bots here, good or bad. The link may be old or mistyped.</p>
        <div className="actions">
          <Link to="/" className="btn btn-primary">Back to home</Link>
          <Link to="/patterns" className="btn btn-ghost">See all cards</Link>
        </div>
      </header>
    </div>
  );
}
