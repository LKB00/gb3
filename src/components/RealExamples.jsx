import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { realExamples } from '../data/examples';
import { teardowns } from '../data/teardowns';

// A product with a teardown page: "ChatGPT deep research" → the ChatGPT teardown.
const teardownFor = (product) => teardowns.find((t) => product === t.product || product.startsWith(t.product + ' '));

// "Seen in real products" cards for one pattern. Products we took apart link to their teardown.
export default function RealExamples({ id }) {
  const list = realExamples[id] || [];
  return (
    <>
      <div className="ex-grid">
        {list.map((e) => {
          const t = teardownFor(e.product);
          const body = (
            <>
              <div className="ex-head">
                <span className="ex-mark" aria-hidden>{e.product[0]}</span>
                <span className="ex-name">
                  <strong>{e.product}</strong>
                  <span>{e.company}</span>
                </span>
              </div>
              <p>{e.what}</p>
              {t && <span className="ex-more">See the {t.product} teardown <ArrowRight size={13} strokeWidth={1.75} aria-hidden /></span>}
            </>
          );
          return t ? (
            <Link key={e.product} to={`/teardowns/${t.id}`} className="ex-card ex-card-link">{body}</Link>
          ) : (
            <article key={e.product} className="ex-card">{body}</article>
          );
        })}
      </div>
      <p className="footnote">Short, simple takes on public features. Product names belong to their owners.</p>
    </>
  );
}
