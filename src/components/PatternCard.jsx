import { Link } from 'react-router-dom';
import { getCategory } from '../data/patterns';

export default function PatternCard({ pattern }) {
  return (
    <Link to={`/patterns/${pattern.id}`} className="card pattern-card">
      <span className={`tag tag-${pattern.category}`}>{getCategory(pattern.category).name}</span>
      <h3>{pattern.title}</h3>
      <p>{pattern.summary}</p>
      <span className="card-more">See live demo →</span>
    </Link>
  );
}
