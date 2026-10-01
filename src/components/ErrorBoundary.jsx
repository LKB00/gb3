import { Component } from 'react';

// If a page crashes, show a friendly screen instead of a blank page.
// Wrapped around the routes (nav stays usable) and around the whole app (last resort).
// Re-mount it with a new `key` (the page path) and it resets itself on navigation.
export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    // Nobody is collecting these; the console is where a developer will see it.
    console.error('Page crashed:', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="page crash" role="alert">
        <h1 className="display">Oops, that page broke</h1>
        <p className="lead">Sorry! Your progress is safe. Try again, or go back to the start.</p>
        <div className="row wrap">
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>Try again</button>
          <a className="btn btn-ghost" href="./#/">Go home</a>
        </div>
        <p className="small muted crash-note">
          Still broken after a reload? Saved data on this device may be damaged.{' '}
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              if (!window.confirm('This clears your XP, cards and streak on this device. Continue?')) return;
              try {
                localStorage.clear();
              } catch {
                /* storage blocked */
              }
              window.location.replace('./#/');
              window.location.reload();
            }}
          >
            Clear saved data
          </button>
        </p>
      </div>
    );
  }
}
