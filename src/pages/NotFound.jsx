import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page narrow empty">
      <h1>Page not found</h1>
      <p className="lead">This page does not exist. Maybe it moved?</p>
      <div className="row">
        <Link to="/" className="btn btn-primary">Go home</Link>
        <Link to="/patterns" className="btn btn-ghost">Browse patterns</Link>
      </div>
    </div>
  );
}
