import { useState } from 'react';
import { Copy, Download, Smartphone, Upload } from 'lucide-react';
import { useInstall } from '../../game/install';
import { exportProgress, importProgress } from '../../progress';

// Install as an app + move progress to another device.
export default function AppAndBackup() {
  const install = useInstall();
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState(null);
  const [open, setOpen] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(exportProgress());
      setMsg({ ok: true, text: 'Backup code copied. Paste it on your other device.' });
    } catch {
      setCode(exportProgress());
      setOpen(true);
      setMsg({ ok: true, text: 'Copy the code below.' });
    }
  };
  const restore = () => {
    const r = importProgress(code);
    setMsg(r.ok ? { ok: true, text: 'Progress restored and merged. Nothing was lost.' } : { ok: false, text: r.error });
    if (r.ok) setCode('');
  };

  return (
    <div className="tools">
      <div className="tool">
        <Smartphone size={20} strokeWidth={1.75} aria-hidden />
        <div>
          <strong>Play it like an app</strong>
          <p className="small muted">
            {install.installed
              ? 'Installed. Open AI Patterns from your home screen.'
              : install.iosHint
                ? 'On iPhone: tap Share, then “Add to Home Screen”.'
                : 'Add it to your home screen or dock. Works offline too.'}
          </p>
        </div>
        {install.canPrompt && (
          <button type="button" className="btn btn-primary" onClick={install.prompt}>
            <Download size={14} strokeWidth={1.75} aria-hidden /> Install
          </button>
        )}
      </div>
      <div className="tool">
        <Upload size={20} strokeWidth={1.75} aria-hidden />
        <div>
          <strong>Move your progress</strong>
          <p className="small muted">Your XP, cards and streak live in this browser. A backup code moves them to another device. No account.</p>
        </div>
        <div className="row">
          <button type="button" className="btn btn-ghost" onClick={copy}>
            <Copy size={14} strokeWidth={1.75} aria-hidden /> Copy backup code
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setOpen((o) => !o)} aria-expanded={open}>Restore</button>
        </div>
        {open && (
          <div className="tool-restore">
            <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste a backup code (starts with AIP1.)" rows={3} aria-label="Backup code" />
            <button type="button" className="btn btn-primary" onClick={restore} disabled={!code.trim()}>Restore progress</button>
          </div>
        )}
        {msg && <p className={'small tool-msg ' + (msg.ok ? 'txt-good' : 'txt-bad')} role="status">{msg.text}</p>}
      </div>
    </div>
  );
}
