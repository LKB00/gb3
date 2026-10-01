import { useEffect, useState } from 'react';

// "Install as an app": keeps the browser's install prompt so we can show our own
// button at a good moment, instead of the browser's banner at a random one.
let deferred = null;
const EVENT = 'install-change';

export function listenForInstall() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e;
    window.dispatchEvent(new Event(EVENT));
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    window.dispatchEvent(new Event(EVENT));
  });
}

const standalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

export function useInstall() {
  const [, force] = useState(0);
  useEffect(() => {
    const u = () => force((n) => n + 1);
    window.addEventListener(EVENT, u);
    return () => window.removeEventListener(EVENT, u);
  }, []);
  return {
    installed: standalone(),
    canPrompt: !!deferred,
    iosHint: !standalone() && !deferred && isIOS(),
    prompt: async () => {
      if (!deferred) return;
      deferred.prompt();
      await deferred.userChoice.catch(() => {});
      deferred = null;
      window.dispatchEvent(new Event(EVENT));
    },
  };
}
