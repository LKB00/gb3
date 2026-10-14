import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import TopBar from './components/TopBar';
import ErrorBoundary from './components/ErrorBoundary';
import BottomNav from './components/BottomNav';
import Me from './pages/Me';
import Footer from './components/Footer';
import Home from './pages/Home';
import Patterns from './pages/Patterns';
import PatternDetail from './pages/PatternDetail';
import Learn from './pages/Learn';
import Lesson from './pages/Lesson';
import Play from './pages/Play';
import ThisOrThatPage from './pages/ThisOrThatPage';
import SpotTheFlaw from './pages/SpotTheFlaw';
import Daily from './pages/Daily';
import Story from './pages/Story';
import PlayerCard from './pages/PlayerCard';
import Speed from './pages/Speed';
import Build from './pages/Build';
import Power from './pages/Power';
import Autonomy from './pages/Autonomy';
import Principles from './pages/Principles';
import AntiPatterns from './pages/AntiPatterns';
import Glossary from './pages/Glossary';
import { TeardownDetail, TeardownList } from './pages/Teardowns';
import NotFound from './pages/NotFound';
import { trackPage } from './game/track';

export default function App() {
  const location = useLocation();
  const { pathname, key } = location;
  const navType = useNavigationType();
  const scrolls = useRef(new Map()); // history entry key -> how far down the page was
  // New page: start at the top. Back/Forward (POP): go back to where you were on that page.
  useEffect(() => {
    if (navType !== 'POP') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }
    const y = scrolls.current.get(key) || 0;
    let frame = 0;
    let tries = 0;
    // Wait (a few frames at most) until the page is tall enough to scroll that far.
    const restore = () => {
      const room = document.documentElement.scrollHeight - window.innerHeight;
      if (room >= y || tries++ > 30) window.scrollTo({ top: y, left: 0, behavior: 'instant' });
      else frame = requestAnimationFrame(restore);
    };
    restore();
    return () => cancelAnimationFrame(frame);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps -- only a path change moves the page; filter changes keep it
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'; // we do it ourselves, above
  }, []);
  // Remember the scroll spot of the history entry on screen.
  useEffect(() => {
    if (!scrolls.current.has(key)) scrolls.current.set(key, window.scrollY);
    const save = () => scrolls.current.set(key, window.scrollY);
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, [key]);
  useEffect(() => {
    trackPage(pathname);
  }, [pathname]);
  // Where this history entry was opened from, so the top-bar Back can say "‹ ChatGPT teardown"
  // and step back in history (scroll spot kept) instead of opening a fresh copy of the page.
  // Kept for this visit only; after a reload Back falls back to the parent page.
  const trail = useRef({ from: new Map(), last: null }); // entry key -> { path, search, title } it came from
  const [from, setFrom] = useState(null);
  useLayoutEffect(() => {
    const t = trail.current;
    if (t.last && t.last.loc !== location) {
      if (navType === 'PUSH') t.from.set(key, t.last);
      else if (navType === 'REPLACE' && t.from.has(t.last.key)) t.from.set(key, t.from.get(t.last.key));
    }
    setFrom((key !== 'default' && t.from.get(key)) || null); // "default" = an entry opened by typing or pasting a link: no record
    // Runs as this entry is left, before the next page sets its own tab title.
    return () => { t.last = { loc: location, key, path: pathname, search: location.search, title: document.title }; };
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps -- one record per visit to a history entry

  return (
    <div className="shell">
      {/* With HashRouter, "#main" would be read as a page path, so move focus by hand */}
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>Skip to content</a>
      <TopBar from={from} />
      <main id="main" className="main" tabIndex={-1}>
        <ErrorBoundary key={pathname}>
        <div className="route">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patterns" element={<Patterns />} />
          <Route path="/patterns/:id" element={<PatternDetail />} />
          <Route path="/me" element={<Me />} />
          <Route path="/play" element={<Play />} />
          <Route path="/play/this-or-that" element={<ThisOrThatPage />} />
          <Route path="/play/spot-the-flaw" element={<SpotTheFlaw />} />
          <Route path="/play/daily" element={<Daily />} />
          <Route path="/play/story" element={<Story />} />
          <Route path="/play/story/:id" element={<Story />} />
          <Route path="/play/card" element={<PlayerCard />} />
          <Route path="/play/speed" element={<Speed />} />
          <Route path="/play/build" element={<Build />} />
          <Route path="/play/power" element={<Power />} />
          <Route path="/autonomy" element={<Autonomy />} />
          <Route path="/practice" element={<Navigate to="/play" replace />} />
          <Route path="/principles" element={<Principles />} />
          <Route path="/anti-patterns" element={<AntiPatterns />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/teardowns" element={<TeardownList />} />
          <Route path="/teardowns/:id" element={<TeardownDetail />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:id" element={<Lesson />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </div>
        </ErrorBoundary>
        <Footer />
      </main>
      <BottomNav />
    </div>
  );
}
