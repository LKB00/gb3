import { Component } from 'react';

// If a page crashes, show a friendly screen instead of a blank page.
// Wrapped around the routes (nav stays usable) and around the whole app (last resort).
// Re-mount it with a new `key` (the page path) and it resets itself on navigation.
export default class ErrorBoundary extends Component {
  state = { failed: false, detail: '' };

  static getDerivedStateFromError(error) {
    const stack = String(error?.stack || '').split('\n').slice(0, 4).join('\n');
    return { failed: true, detail: `${error?.name || 'Error'}: ${error?.message || error}\n${stack}`.slice(0, 600) };
  }

  componentDidCatch(error) {
    // Nobody is collecting these; the console is where a developer will see it.
    console.error('Page crashed:', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="page crash" role="alert">
        <h1 className="display">Oops, this page tripped</h1>
        <p className="lead">That’s on us, not you. Your progress is safe. Try again, or head home.</p>
        <div className="row wrap">
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>Try again</button>
          <a className="btn btn-ghost" href="./#/">Go home</a>
        </div>
        <pre className="small muted crash-detail">{this.state.detail}</pre>
        <p className="small muted crash-note">
          Still broken after you try again? Your saved data may be damaged.{' '}
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              if (!window.confirm('This wipes your XP, cards and streak on this device for good. Clear it all?')) return;
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
