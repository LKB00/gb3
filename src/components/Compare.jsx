import MockFrame, { MockBlock } from '../mock/Mock';

// Side-by-side "✕ Avoid" vs "✓ Better" screens with pins on the important parts.
export default function Compare({ data, title }) {
  return (
    <div className="compare">
      {['bad', 'good'].map((side) => (
        <figure key={side} className={`compare-side compare-${side}`}>
          <figcaption>
            <span className="compare-label">{side === 'bad' ? '✕ Avoid' : '✓ Better'}</span>
            {data[side].caption}
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
