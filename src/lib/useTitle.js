import { useEffect } from 'react';

// Gives every page its own browser-tab title, so tabs and history are easy to tell apart.
export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · AI Patterns` : 'AI Patterns · A playground for AI interaction design';
  }, [title]);
}
