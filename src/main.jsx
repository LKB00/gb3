import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/index.css';
import { listenForInstall } from './game/install';
import { startTracking } from './game/track';
import { listenForTaps } from './game/fx';

// HashRouter so the site works on static hosting (GitHub Pages) without server rules.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <App />
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

// Offline support + "install as app". Only in the built site, not during development.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
listenForInstall();
startTracking();
listenForTaps();
