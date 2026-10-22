import { useEffect, useState } from 'react';
import LogoMark from './LogoMark';

// The bot buddy's speech bubble (see game/buddy.js). The app icon is its face.
export default function Buddy() {
  const [say, setSay] = useState(null);
  useEffect(() => {
    let t;
    const on = (e) => {
      setSay({ text: e.detail.text, id: Date.now() });
      clearTimeout(t);
      t = setTimeout(() => setSay(null), 3800);
    };
    window.addEventListener('gb3-buddy', on);
    return () => {
      window.removeEventListener('gb3-buddy', on);
      clearTimeout(t);
    };
  }, []);
  if (!say) return null;
  return (
    <div className="buddy" role="status" key={say.id}>
      <LogoMark className="buddy-face" />
      <button type="button" className="buddy-bubble" data-fx="off" onClick={() => setSay(null)} aria-label={`${say.text} (tap to close)`}>
        {say.text}
      </button>
    </div>
  );
}
