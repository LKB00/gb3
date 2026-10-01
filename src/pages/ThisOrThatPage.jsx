import { useSearchParams } from 'react-router-dom';
import { Eye, Shuffle } from 'lucide-react';
import ThisOrThat from '../components/ThisOrThat';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTitle } from '../lib/useTitle';

// This or That, with Classic / Hard tabs (?mode=hard).
export default function ThisOrThatPage() {
  useTitle('This or That');
  const [params, setParams] = useSearchParams();
  const mode = params.get('mode') === 'hard' ? 'hard' : 'classic';
  return (
    <div className="page page-wide">
      <Breadcrumbs items={[{ label: 'Play', to: '/play' }, { label: 'This or That' }]} />
      <h1 className="sr-only">This or That</h1>
      <div className="tabs tot-modes" role="tablist" aria-label="Mode">
        <button role="tab" aria-selected={mode === 'classic'} className="tab" onClick={() => setParams({}, { replace: true })}>
          <Shuffle size={15} strokeWidth={1.75} aria-hidden /> Classic
        </button>
        <button role="tab" aria-selected={mode === 'hard'} className="tab" onClick={() => setParams({ mode: 'hard' }, { replace: true })}>
          <Eye size={15} strokeWidth={1.75} aria-hidden /> Hard <span className="tab-count">one detail differs</span>
        </button>
      </div>
      <div className="view">
        <ThisOrThat rounds={10} mode={mode} />
      </div>
    </div>
  );
}
