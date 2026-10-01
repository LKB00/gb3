import { useEffect, useState } from 'react';

// Remembers which Design Labs this visitor passed (only in their own browser).
const KEY = 'labs-passed';
const EVENT = 'labs-change';

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function markPassed(id) {
  const list = read();
  if (list.includes(id)) return;
  try {
    localStorage.setItem(KEY, JSON.stringify([...list, id]));
  } catch {
    /* storage blocked — progress just isn't saved */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function usePassed() {
  const [list, setList] = useState(read);
  useEffect(() => {
    const update = () => setList(read());
    window.addEventListener(EVENT, update);
    return () => window.removeEventListener(EVENT, update);
  }, []);
  return list;
}
