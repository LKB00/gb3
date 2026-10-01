import { realExamples } from '../data/examples';

// "Seen in real products" cards for one pattern.
export default function RealExamples({ id }) {
  const list = realExamples[id] || [];
  return (
    <>
      <div className="ex-grid">
        {list.map((e) => (
          <article key={e.product} className="ex-card">
            <div className="ex-head">
              <span className="ex-mark" aria-hidden>{e.product[0]}</span>
              <span className="ex-name">
                <strong>{e.product}</strong>
                <span>{e.company}</span>
              </span>
            </div>
            <p>{e.what}</p>
          </article>
        ))}
      </div>
      <p className="footnote">Simplified descriptions of public features. Product names belong to their owners.</p>
    </>
  );
}
