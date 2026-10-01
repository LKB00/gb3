import { useNavigate } from 'react-router-dom';
import { patterns } from '../data/patterns';
import { usePassed } from '../progress';

// Picks a challenge you haven't collected yet (or any, once you have them all).
export function useRandomChallenge() {
  const passed = usePassed();
  const navigate = useNavigate();
  return () => {
    const left = patterns.filter((p) => !passed.includes(p.id));
    const pool = left.length ? left : patterns;
    navigate(`/patterns/${pool[Math.floor(Math.random() * pool.length)].id}`);
  };
}
