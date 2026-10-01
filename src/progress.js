import { useEffect, useState } from 'react';

// Learning-by-doing progress, kept only in this visitor's browser:
// which Design Labs they passed and which Mistake Hunt screens they finished.
const EVENT = 'progress-change';

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function add(key, id) {
  const list = read(key);
  if (list.includes(id)) return;
  try {
    localStorage.setItem(key, JSON.stringify([...list, id]));
  } catch {
    /* storage blocked — progress just isn't saved */
  }
  window.dispatchEvent(new Event(EVENT));
}

function useList(key) {
  const [list, setList] = useState(() => read(key));
  useEffect(() => {
    const update = () => setList(read(key));
    window.addEventListener(EVENT, update);
    return () => window.removeEventListener(EVENT, update);
  }, [key]);
  return list;
}

export const markPassed = (id) => add('labs-passed', id);
export const usePassed = () => useList('labs-passed');

export const markHuntDone = (id) => add('hunts-done', id);
export const useHuntsDone = () => useList('hunts-done');
