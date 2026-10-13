// Ends the splash screen that index.html shows while the site loads.
// Full splash: the good answer "types" for a moment, turns into a check, then the splash fades away
// and the page rises in. Second load in the same visit (class sp-quick): it just gets out of the way.

const MIN_SHOW_MS = 950; // let the intro finish before the check, so it never looks cut off
const CHECK_MS = 480;
const FADE_MS = 450;

let started = false;

export function hideSplash() {
  const el = document.getElementById('splash');
  if (!el || started) return;
  started = true;

  const root = document.documentElement;
  const quick = root.classList.contains('sp-quick');
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const remove = () => el.remove();

  if (quick) {
    el.classList.add('is-out');
    setTimeout(remove, FADE_MS);
    return;
  }

  const wait = calm ? 0 : Math.max(0, MIN_SHOW_MS - performance.now());
  setTimeout(() => {
    el.classList.add('is-ready');
    setTimeout(() => {
      el.classList.add('is-out');
      root.classList.add('sp-reveal');
      setTimeout(remove, FADE_MS);
      setTimeout(() => root.classList.remove('sp-reveal'), FADE_MS + 700);
    }, calm ? 250 : CHECK_MS);
  }, wait);
}
