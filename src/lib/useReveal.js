import { useEffect, useRef } from 'react';

// After a tap, the answer feedback can land below the fold on a phone (or behind the bottom bar).
// useReveal(key) returns a ref; whenever `key` changes, the element scrolls just enough to be seen.
// It never moves the page when the element is already in view.
export function revealEl(el) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  // Anything pinned to the bottom (the phone tab bar, sticky "Next" bars) hides what is behind it.
  let bottomLimit = window.innerHeight;
  for (const bar of document.querySelectorAll('.bottomnav, .story-nav, .lab-nav, .power-nav, .tot-result')) {
    const pos = getComputedStyle(bar).position;
    if ((pos !== 'fixed' && pos !== 'sticky') || bar.contains(el) || el.contains(bar)) continue;
    const b = bar.getBoundingClientRect();
    if (b.height && b.top > window.innerHeight / 2 && b.top < bottomLimit) bottomLimit = b.top;
  }
  bottomLimit -= 12;
  const topLimit = (document.querySelector('.topnav')?.getBoundingClientRect().bottom || 0) + 8;
  if (r.bottom <= bottomLimit && r.top >= topLimit) return;
  // Bring the bottom into view, but never push the top of the element out of view.
  const by = Math.min(r.bottom - bottomLimit, r.top - topLimit);
  if (Math.abs(by) < 4) return;
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollBy({ top: by, behavior: calm ? 'instant' : 'smooth' });
}

export function useReveal(key) {
  const ref = useRef(null);
  useEffect(() => {
    if (key === null || key === undefined || key === false) return;
    // Wait one frame so the new feedback has its final size.
    const id = requestAnimationFrame(() => revealEl(ref.current));
    return () => cancelAnimationFrame(id);
  }, [key]);
  return ref;
}
