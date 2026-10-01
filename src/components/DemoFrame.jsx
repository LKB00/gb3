import { useState } from 'react';
import { demos } from '../demos';

// Wraps a live demo in a "browser-like" frame with a reset button.
export default function DemoFrame({ name }) {
  const Demo = demos[name];
  const [key, setKey] = useState(0);
  if (!Demo) return null;

  return (
    <div className="demo-frame">
      <div className="demo-bar">
        <span className="demo-dots" aria-hidden><i /><i /><i /></span>
        <span className="demo-title">Live demo</span>
        <button className="btn btn-ghost btn-sm" onClick={() => setKey((k) => k + 1)}>↺ Reset</button>
      </div>
      <div className="demo-body">
        <Demo key={key} />
      </div>
    </div>
  );
}
