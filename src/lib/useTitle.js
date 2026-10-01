import { useEffect } from 'react';

// Gives every page its own browser-tab title, so tabs and history are easy to tell apart.
export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Good Bot, Bad Bot` : 'Good Bot, Bad Bot · Can you spot good AI design?';
  }, [title]);
}
