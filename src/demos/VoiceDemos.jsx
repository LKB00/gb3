import { useEffect, useRef, useState } from 'react';
import { Mic, RotateCcw } from 'lucide-react';

// A simulated voice conversation (no microphone needed): it shows the three
// turn states and lets people interrupt the AI while it is speaking.
const question = 'What does my afternoon look like?';
const answer =
  'You have three things this afternoon. At 2 pm, design review with Priya. At 3:30, a call with the Acme team. At 5, a one-on-one with Sam. You also have two tasks due today.';

export function VoiceTurns() {
  const [state, setState] = useState('idle'); // idle | listening | thinking | speaking | interrupted | done
  const [heard, setHeard] = useState('');
  const [said, setSaid] = useState('');
  const timer = useRef(null);

  const stopAll = () => clearInterval(timer.current);

  const type = (text, set, ms, onDone) => {
    const words = text.split(' ');
    let i = 0;
    timer.current = setInterval(() => {
      i += 1;
      set(words.slice(0, i).join(' '));
      if (i >= words.length) {
        clearInterval(timer.current);
        onDone();
      }
    }, ms);
  };

  const talk = () => {
    stopAll();
    setHeard('');
    setSaid('');
    setState('listening');
    type(question, setHeard, 160, () => {
      setState('thinking');
      timer.current = setTimeout(() => {
        setState('speaking');
        type(answer, setSaid, 260, () => setState('done'));
      }, 900);
    });
  };

  const interrupt = () => {
    stopAll();
    setState('interrupted');
    setHeard('Just the first one.');
  };

  useEffect(() => () => clearInterval(timer.current), []);

  const label = {
    idle: 'Tap to talk',
    listening: 'Listening',
    thinking: 'Thinking',
    speaking: 'Speaking',
    interrupted: 'Listening',
    done: 'Done',
  }[state];

  return (
    <div className="demo-stack">
      <div className={`voice-orb voice-${state}`} aria-live="polite">
        <span className="voice-bars" aria-hidden>
          {Array.from({ length: 7 }).map((_, i) => <i key={i} style={{ animationDelay: `${i * 0.1}s` }} />)}
        </span>
        <strong>{label}</strong>
      </div>
      {heard && <p className="bubble bubble-user">{heard}</p>}
      {said && (
        <p className="bubble bubble-ai">
          {said}
          {state === 'speaking' && <span className="caret" />}
        </p>
      )}
      {state === 'interrupted' && <p className="demo-ok">Stopped speaking the moment you talked.</p>}
      <div className="row">
        {(state === 'idle' || state === 'done' || state === 'interrupted') && (
          <button className="btn btn-primary" onClick={talk}>
            {state === 'idle' ? <Mic size={14} strokeWidth={1.75} aria-hidden /> : <RotateCcw size={14} strokeWidth={1.75} aria-hidden />}
            {state === 'idle' ? 'Talk' : 'Try again'}
          </button>
        )}
        {state === 'speaking' && (
          <button className="btn btn-ghost" onClick={interrupt}>
            <Mic size={14} strokeWidth={1.75} aria-hidden /> Interrupt
          </button>
        )}
      </div>
      <p className="demo-note">Simulated, no microphone used. Press Talk, then Interrupt while it is speaking.</p>
    </div>
  );
}
