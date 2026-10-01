import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Patterns from './pages/Patterns';
import PatternDetail from './pages/PatternDetail';
import Learn from './pages/Learn';
import Lesson from './pages/Lesson';
import Practice from './pages/Practice';
import NotFound from './pages/NotFound';

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patterns" element={<Patterns />} />
          <Route path="/patterns/:id" element={<PatternDetail />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:id" element={<Lesson />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
