import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Patterns from './pages/Patterns';
import PatternDetail from './pages/PatternDetail';
import Learn from './pages/Learn';
import Lesson from './pages/Lesson';
import Play, { SpotTheFlaw, ThisOrThatPage } from './pages/Play';
import Daily from './pages/Daily';
import Story from './pages/Story';
import PlayerCard from './pages/PlayerCard';
import Speed from './pages/Speed';
import Principles from './pages/Principles';
import AntiPatterns from './pages/AntiPatterns';
import Glossary from './pages/Glossary';
import { TeardownDetail, TeardownList } from './pages/Teardowns';
import NotFound from './pages/NotFound';

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);

  return (
    <div className="shell">
      <a href="#main" className="skip-link">Skip to content</a>
      <TopBar />
      <main id="main" className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patterns" element={<Patterns />} />
          <Route path="/patterns/:id" element={<PatternDetail />} />
          <Route path="/play" element={<Play />} />
          <Route path="/play/this-or-that" element={<ThisOrThatPage />} />
          <Route path="/play/spot-the-flaw" element={<SpotTheFlaw />} />
          <Route path="/play/daily" element={<Daily />} />
          <Route path="/play/story" element={<Story />} />
          <Route path="/play/card" element={<PlayerCard />} />
          <Route path="/play/speed" element={<Speed />} />
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
        <Footer />
      </main>
    </div>
  );
}
