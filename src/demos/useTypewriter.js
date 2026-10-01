import { useEffect, useRef, useState } from 'react';

// Fake "AI streaming": reveals `text` word by word.
// Call start(text) to begin, stop() to halt. Partial text is kept on stop.
export function useTypewriter(speed = 45) {
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const timer = useRef(null);

  const stop = () => {
    clearInterval(timer.current);
    setRunning(false);
  };

  const start = (text, onDone) => {
    clearInterval(timer.current);
    const words = text.split(' ');
    let i = 0;
    setOutput('');
    setRunning(true);
    timer.current = setInterval(() => {
      i += 1;
      setOutput(words.slice(0, i).join(' '));
      if (i >= words.length) {
        clearInterval(timer.current);
        setRunning(false);
        onDone?.();
      }
    }, speed);
  };

  useEffect(() => () => clearInterval(timer.current), []);

  return { output, running, start, stop, setOutput };
}

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));
