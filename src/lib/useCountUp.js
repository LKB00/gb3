import { useEffect, useRef, useState } from 'react';

// A number that rolls up to its new value instead of jumping. Used for XP and scores.
// fromZero: also roll up from 0 the first time (for result screens and level cards).
// People who prefer reduced motion see the final number straight away.
export function useCountUp(value, { fromZero = false, ms = 700 } = {}) {
  const [shown, setShown] = useState(fromZero ? 0 : value);
  const current = useRef(shown);

  useEffect(() => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const from = current.current;
    if (calm || from === value) {
      current.current = value;
      setShown(value);
      return;
    }
    let raf;
    let t0;
    const tick = (now) => {
      // The first frame's time can be a little before this effect ran, so start the clock there.
      if (t0 === undefined) t0 = now;
      const p = Math.min(1, Math.max(0, (now - t0) / ms));
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(from + (value - from) * eased);
      current.current = v;
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);

  return shown;
}
