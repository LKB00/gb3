// Copy text to the clipboard. Some browsers block the modern clipboard (older phones,
// in-app browsers, pages not on https), so there are two fallbacks:
//   1. the old copy command, and
//   2. a small box with the text, so people can copy it by hand.
// Returns true when it was copied for them, false when they have to copy by hand.
// Pass { prompt: false } when the page shows its own box for the text.
export async function copyText(text, { prompt = true } = {}) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* blocked: try the next way */
  }
  try {
    const box = document.createElement('textarea');
    box.value = text;
    box.setAttribute('readonly', '');
    box.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0';
    document.body.appendChild(box);
    box.select();
    box.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    box.remove();
    if (ok) return true;
  } catch {
    /* blocked: show it instead */
  }
  if (prompt) window.prompt('Copy this:', text);
  return false;
}
