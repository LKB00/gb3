import { useEffect, useRef, useState } from 'react';
import { Coffee, Croissant, Mic, RotateCcw } from 'lucide-react';

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
      {state === 'interrupted' && <p className="demo-ok">It went quiet the moment you spoke.</p>}
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
      <p className="demo-note">No microphone needed. Press Talk, then Interrupt while it speaks.</p>
    </div>
  );
}

// A small voice state pill, reused by the demos below.
function Orb({ state, label }) {
  return (
    <div className={`voice-orb dm-vo-orb voice-${state}`} aria-live="polite">
      <span className="voice-bars" aria-hidden>
        {Array.from({ length: 7 }).map((_, i) => <i key={i} style={{ animationDelay: `${i * 0.1}s` }} />)}
      </span>
      <strong>{label}</strong>
    </div>
  );
}

// Show what it understood: the transcript appears, the unsure word is marked,
// and one tap fixes it before anything is booked.
export function ShowUnderstanding() {
  const [step, setStep] = useState('idle'); // idle | listening | heard | booked
  const [people, setPeople] = useState('14');
  const [fixing, setFixing] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const say = () => {
    setStep('listening');
    timer.current = setTimeout(() => setStep('heard'), 900);
  };
  const pick = (n) => {
    setPeople(n);
    setFixing(false);
  };

  return (
    <div className="demo-stack">
      {step === 'idle' && (
        <button className="btn btn-primary dm-vo-start" onClick={say}>
          <Mic size={14} strokeWidth={1.75} aria-hidden /> Say: “Book a table for four at seven”
        </button>
      )}
      {step === 'listening' && <Orb state="listening" label="Listening" />}
      {(step === 'heard' || step === 'booked') && (
        <>
          <span className="label">Heard</span>
          <p className="bubble bubble-user">
            Book a table for{' '}
            <button
              className={`dm-vo-word${people === '14' ? ' dm-vo-unsure' : ''}`}
              onClick={() => setFixing((f) => !f)}
              disabled={step === 'booked'}
              aria-label={`${people} people. Tap to fix`}
            >
              {people}
            </button>{' '}
            people at 7 pm
          </p>
          {fixing && (
            <div className="chips">
              {['4', '14', '40'].map((n) => (
                <button key={n} className={`chip${n === people ? ' chip-on' : ''}`} onClick={() => pick(n)}>
                  {n} people
                </button>
              ))}
            </div>
          )}
          {step === 'heard' ? (
            <button className="btn btn-primary dm-vo-start" onClick={() => setStep('booked')}>
              Book it
            </button>
          ) : (
            <p className="demo-ok">Booked a table for {people} at 7 pm.</p>
          )}
        </>
      )}
      <p className="demo-note">Press Say. It heard “14”. Tap the marked word to fix it before you book.</p>
    </div>
  );
}

// Read it back: the AI repeats the key details and waits. "Yes" sends,
// a natural "no, make it fifty" changes it.
export function ReadBack() {
  const [step, setStep] = useState('idle'); // idle | asking | sent
  const [amount, setAmount] = useState(40);

  return (
    <div className="demo-stack">
      {step === 'idle' && (
        <button className="btn btn-primary dm-vo-start" onClick={() => setStep('asking')}>
          <Mic size={14} strokeWidth={1.75} aria-hidden /> Say: “Send forty dollars to Priya”
        </button>
      )}
      {step !== 'idle' && <p className="bubble bubble-user">Send forty dollars to Priya</p>}
      {step === 'asking' && (
        <>
          <Orb state="speaking" label={`Send $${amount} to Priya Shah. Right?`} />
          <div className="dm-vo-card" aria-label="Details to check">
            <span className="dm-vo-big">${amount}</span>
            <span className="demo-muted">to Priya Shah</span>
          </div>
          <div className="row">
            <button className="btn btn-primary" onClick={() => setStep('sent')}>
              <Mic size={14} strokeWidth={1.75} aria-hidden /> Say: “Yes”
            </button>
            {amount === 40 && (
              <button className="btn btn-ghost" onClick={() => setAmount(50)}>
                <Mic size={14} strokeWidth={1.75} aria-hidden /> Say: “No, make it fifty”
              </button>
            )}
          </div>
        </>
      )}
      {step === 'sent' && <p className="demo-ok">Sent ${amount} to Priya Shah. Nothing moved until you said yes.</p>}
      <p className="demo-note">Press Say. Then answer yes, or change the amount in your own words.</p>
    </div>
  );
}

// Point at what to change: tap one cup in the photo, then say "Remove this".
// Only the picked cup goes. Everything else stays.
const photoItems = [
  { id: 'c1', label: 'Left cup', Icon: Coffee },
  { id: 'c2', label: 'Middle cup', Icon: Coffee },
  { id: 'p', label: 'Croissant', Icon: Croissant },
  { id: 'c3', label: 'Right cup', Icon: Coffee },
];

export function PointToEdit() {
  const [picked, setPicked] = useState(null);
  const [gone, setGone] = useState([]);
  const left = photoItems.filter((it) => !gone.includes(it.id));
  const pickedItem = photoItems.find((it) => it.id === picked);

  const remove = () => {
    setGone((g) => [...g, picked]);
    setPicked(null);
  };

  return (
    <div className="demo-stack">
      <div className="dm-vo-photo" role="group" aria-label="Photo of a table. Tap a thing to select it">
        {left.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`dm-vo-thing${picked === id ? ' dm-vo-picked' : ''}`}
            onClick={() => setPicked(picked === id ? null : id)}
            aria-pressed={picked === id}
            aria-label={label}
          >
            <Icon size={28} strokeWidth={1.75} aria-hidden />
            {picked === id && <span className="dm-vo-tag">Selected</span>}
          </button>
        ))}
      </div>
      <div className="row">
        <button className="btn btn-primary" onClick={remove} disabled={!picked}>
          <Mic size={14} strokeWidth={1.75} aria-hidden /> Say: “Remove this”
        </button>
        {gone.length > 0 && (
          <button className="btn btn-ghost" onClick={() => setGone([])}>
            <RotateCcw size={14} strokeWidth={1.75} aria-hidden /> Put it all back
          </button>
        )}
      </div>
      {pickedItem && <p className="demo-muted small">Ready to change: {pickedItem.label.toLowerCase()} only.</p>}
      {gone.length > 0 && !picked && <p className="demo-ok">Gone. Nothing else in the photo moved.</p>}
      <p className="demo-note">Tap one cup in the photo, then press Say. No words like “second from the left”.</p>
    </div>
  );
}

// Show it on screen: a short spoken headline, the details as a list.
// Pick a flight by voice or by touch, whichever is faster.
const flights = [
  { id: '705', time: '7:05', note: '1 stop', price: 212 },
  { id: '940', time: '9:40', note: 'direct', price: 268 },
  { id: '1315', time: '13:15', note: 'direct', price: 245 },
];

export function ModeSwitch() {
  const [asked, setAsked] = useState(false);
  const [chosen, setChosen] = useState(null); // { id, by }
  const pick = (id, by) => setChosen({ id, by });
  const flight = chosen && flights.find((f) => f.id === chosen.id);

  return (
    <div className="demo-stack">
      {!asked ? (
        <button className="btn btn-primary dm-vo-start" onClick={() => setAsked(true)}>
          <Mic size={14} strokeWidth={1.75} aria-hidden /> Say: “Find a flight to Mumbai tomorrow”
        </button>
      ) : (
        <>
          <Orb state={chosen ? 'done' : 'speaking'} label="I found 3 flights. The cheapest is $212." />
          <div className="dm-vo-list">
            {flights.map((f) => (
              <button
                key={f.id}
                className={`dm-vo-flight${chosen?.id === f.id ? ' dm-vo-picked' : ''}`}
                onClick={() => pick(f.id, 'touch')}
                aria-pressed={chosen?.id === f.id}
              >
                <span>
                  {f.time} · {f.note}
                </span>
                <strong>${f.price}</strong>
              </button>
            ))}
          </div>
          {!chosen && (
            <button className="btn btn-ghost dm-vo-start" onClick={() => pick('705', 'voice')}>
              <Mic size={14} strokeWidth={1.75} aria-hidden /> Say: “The cheapest one”
            </button>
          )}
          {flight && (
            <p className="demo-ok">
              Picked the {flight.time} flight by {chosen.by}. ${flight.price}.
            </p>
          )}
        </>
      )}
      <p className="demo-note">Press Say. Then pick a flight: tap the list, or say it. Both work.</p>
    </div>
  );
}
