import { Check, X } from 'lucide-react';
import MockFrame, { MockBlock } from '../mock/Mock';

// Side-by-side "Avoid" vs "Better" screens, with short pins on the parts that matter.
export default function Compare({ data, title }) {
  return (
    <div className="compare">
      {['bad', 'good'].map((side) => (
        <figure key={side} className={`compare-side compare-${side}`}>
          <figcaption>
            <span className="compare-label">
              {side === 'bad' ? <X size={12} strokeWidth={2.25} aria-hidden /> : <Check size={12} strokeWidth={2.25} aria-hidden />}
              {side === 'bad' ? 'Avoid' : 'Better'}
            </span>
            <span className="compare-caption">{data[side].caption}</span>
          </figcaption>
          <MockFrame title={title}>
            {data[side].blocks.map((b, i) => (
              <MockBlock key={i} b={b} pin={b.pin} state={b.pin ? side : undefined} />
            ))}
          </MockFrame>
        </figure>
      ))}
    </div>
  );
}
