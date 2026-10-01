// Tiny "fake app screen" renderer.
// Screens are described as data (see src/data/visuals.js) and drawn here,
// so comparisons, Design Labs and the Mistake Hunt all share one look.

// Turns "[1]" into citation pills and "**x**" into bold text.
function rich(text = '') {
  return text.split(/(\[\d+\]|\*\*[^*]+\*\*)/g).map((part, i) => {
    if (/^\[\d+\]$/.test(part)) return <span key={i} className="m-cite">{part.slice(1, -1)}</span>;
    if (/^\*\*.+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
    return part;
  });
}

// Button labels: "!Send" = primary, "-Stop" = danger, anything else = plain.
function Btn({ label }) {
  const kind = label[0] === '!' ? 'primary' : label[0] === '-' ? 'danger' : 'plain';
  return <span className={`m-btn m-btn-${kind}`}>{kind === 'plain' ? label : label.slice(1)}</span>;
}

function Block({ b }) {
  switch (b.type) {
    case 'user':
      return <div className="m-bubble m-user">{b.text}</div>;
    case 'ai':
      return (
        <div className="m-bubble m-ai">
          {rich(b.text)}
          {b.caret && <span className="caret" />}
        </div>
      );
    case 'note':
      return <p className={`m-note m-tone-${b.tone || 'plain'}`}>{rich(b.text)}</p>;
    case 'text':
      return <p className="m-text">{b.text}</p>;
    case 'chips':
      return (
        <div className="m-chips">
          {b.items.map((c, i) => (
            <span key={i} className={'m-chip' + (b.on === i ? ' m-chip-on' : '')}>{c}</span>
          ))}
        </div>
      );
    case 'buttons':
      return (
        <div className="m-buttons">
          {b.items.map((l, i) => <Btn key={i} label={l} />)}
        </div>
      );
    case 'input':
      return (
        <div className="m-input">
          <span className={b.value ? '' : 'm-ph'}>{b.value || b.placeholder || 'Ask anything…'}</span>
          <span className="m-send" aria-hidden>↑</span>
        </div>
      );
    case 'ghost':
      return (
        <div className="m-input">
          <span>
            {b.value}
            <span className={b.solid ? '' : 'm-ghost'}>{b.ghost}</span>
          </span>
        </div>
      );
    case 'edit': {
      const [before, after] = b.sel ? b.text.split(b.sel) : [b.text];
      return (
        <div className="m-edit">
          {before}
          {b.sel && <mark>{b.sel}</mark>}
          {after}
          <span className="m-edit-icon" aria-hidden>✎</span>
        </div>
      );
    }
    case 'steps':
      return (
        <ul className="m-steps">
          {b.items.map((s, i) => (
            <li key={i} className={`m-step-${s.state || 'todo'}`}>
              <span className="m-step-dot" aria-hidden />
              {s.label}
            </li>
          ))}
        </ul>
      );
    case 'spinner':
      return (
        <div className="m-spinner">
          <span className="m-spin" aria-hidden />
          {b.text}
        </div>
      );
    case 'banner':
      return (
        <div className={`m-banner m-tone-${b.tone || 'info'}`}>
          {b.title && <strong>{b.title}</strong>}
          {b.text && <span>{b.text}</span>}
        </div>
      );
    case 'toast':
      return (
        <div className="m-toast">
          <span>{b.text}</span>
          {b.action && <span className="m-toast-act">{b.action}</span>}
        </div>
      );
    case 'variants':
      return (
        <div className={'m-variants' + (b.items.length > 4 ? ' m-variants-many' : '')}>
          {b.items.map((t, i) => (
            <div key={i} className={'m-variant' + (b.on === i ? ' m-variant-on' : '')}>
              <span className="m-vtag">{String.fromCharCode(65 + i)}</span>
              {t}
            </div>
          ))}
        </div>
      );
    case 'rows':
      return (
        <div className="m-rows">
          {b.items.map((r, i) => (
            <div key={i} className="m-row">
              <span className="m-row-label">{r.label}</span>
              <span className="m-row-value">{r.value}</span>
              {r.tag && <span className={`m-tag m-tone-${r.tone || 'plain'}`}>{r.tag}</span>}
              {r.action && <span className="m-row-act">{r.action}</span>}
            </div>
          ))}
        </div>
      );
    case 'card':
      return (
        <div className="m-card">
          {b.tag && <span className="m-card-tag">{b.tag}</span>}
          <strong>{b.title}</strong>
          {b.text && <span className="m-card-text">{rich(b.text)}</span>}
        </div>
      );
    case 'list':
      return (
        <ul className="m-list">
          {b.items.map((t, i) => {
            const tone = t.startsWith('✓') ? 'ok' : t.startsWith('✕') ? 'bad' : 'plain';
            return <li key={i} className={`m-tone-${tone}`}>{t}</li>;
          })}
        </ul>
      );
    case 'check':
      return (
        <ul className="m-check">
          {b.items.map((t, i) => (
            <li key={i}>
              <span className="m-box" aria-hidden>✓</span>
              {t}
            </li>
          ))}
        </ul>
      );
    case 'diff':
      return (
        <div className="m-diff">
          {b.items.map(([del, add], i) => (
            <div key={i} className="m-diff-row">
              <del>{del}</del>
              <span aria-hidden>→</span>
              <ins>{add}</ins>
            </div>
          ))}
        </div>
      );
    case 'modal':
      return (
        <div className="m-modal">
          <strong>{b.title}</strong>
          {b.text && <span className="m-card-text">{b.text}</span>}
          <div className="m-buttons">{(b.buttons || []).map((l, i) => <Btn key={i} label={l} />)}</div>
        </div>
      );
    case 'slider':
      return (
        <div className="m-slider">
          {b.label && <span className="m-slider-label">{b.label}</span>}
          <span className="m-slider-end">{b.left}</span>
          <span className="m-track">
            <span className="m-knob" style={{ left: `${b.value}%` }} />
          </span>
          <span className="m-slider-end">{b.right}</span>
        </div>
      );
    case 'toggle':
      return (
        <div className="m-toggle">
          <span>{b.label}</span>
          <span className={'m-switch' + (b.on ? ' m-switch-on' : '')} aria-hidden />
        </div>
      );
    case 'avatar':
      return (
        <div className="m-avatar-row">
          <span className="m-avatar" aria-hidden>{b.name.split(' ').map((w) => w[0]).join('')}</span>
          <span className="m-avatar-name">
            <strong>{b.name}</strong>
            <small>{b.role}</small>
          </span>
          {b.badge && <span className="m-badge">✨ {b.badge}</span>}
        </div>
      );
    case 'blank':
      return <div className="m-blank" style={{ height: b.height || 56 }}>{b.text}</div>;
    case 'empty':
      return <div className="m-empty">nothing shown</div>;
    default:
      return null;
  }
}

// One block, with optional state outline (bad/good/found/missed), a pin label,
// a number marker, and click handling (for the Mistake Hunt).
export function MockBlock({ b, state, pin, marker, onClick, label }) {
  const cls = ['mb', state && `mb-${state}`, onClick && 'mb-click'].filter(Boolean).join(' ');
  const interactive = onClick
    ? {
        role: 'button',
        tabIndex: 0,
        'aria-label': label,
        onClick,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        },
      }
    : {};
  return (
    <div className={cls} {...interactive}>
      <Block b={b} />
      {marker != null && <span className="mb-marker" aria-hidden>{marker}</span>}
      {pin && <span className="mb-pin">{pin}</span>}
    </div>
  );
}

// A group of blocks that belongs to one Design Lab decision.
export function MockSlot({ blocks, state, marker, placeholder }) {
  if (!blocks) return <div className="m-slot-empty">{placeholder}</div>;
  return (
    <div className={'m-slot' + (state ? ` m-slot-${state}` : '')}>
      {(blocks.length ? blocks : [{ type: 'empty' }]).map((b, i) => <Block key={i} b={b} />)}
      {marker != null && <span className="mb-marker" aria-hidden>{marker}</span>}
    </div>
  );
}

// The device frame around a screen.
export default function MockFrame({ title = 'AI assistant', mini, children }) {
  return (
    <div className={'m-frame' + (mini ? ' m-mini' : '')}>
      <div className="m-top">
        <span className="m-dots" aria-hidden><i /><i /><i /></span>
        <span className="m-title">{title}</span>
      </div>
      <div className="m-body">{children}</div>
    </div>
  );
}
