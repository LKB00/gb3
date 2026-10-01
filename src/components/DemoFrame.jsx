import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { demos } from '../demos';

// A live demo inside a simple app frame, with a reset button.
export default function DemoFrame({ name }) {
  const Demo = demos[name];
  const [key, setKey] = useState(0);
  if (!Demo) return null;

  return (
    <div className="demo-frame">
      <div className="demo-bar">
        <span className="label">Live demo</span>
        <button className="btn btn-ghost btn-sm" onClick={() => setKey((k) => k + 1)}>
          <RotateCcw size={13} strokeWidth={1.75} aria-hidden /> Reset
        </button>
      </div>
      <div className="demo-body">
        <Demo key={key} />
      </div>
    </div>
  );
}
