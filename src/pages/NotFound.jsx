import { useTitle } from '../useTitle';
import { Link } from 'react-router-dom';

export default function NotFound() {
  useTitle('Page not found');
  return (
    <div className="page">
      <header className="page-head">
        <p className="label">404</p>
        <h1 className="display">Page not found</h1>
        <p className="lead">This page does not exist. It may have moved.</p>
        <div className="actions">
          <Link to="/" className="btn btn-primary">Go to overview</Link>
          <Link to="/patterns" className="btn btn-ghost">All patterns</Link>
        </div>
      </header>
    </div>
  );
}
