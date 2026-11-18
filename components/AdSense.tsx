'use client';
// Anuncis automàtics de Google AdSense a tota la web.
// No es carrega si el visitant arriba des dels jocs educatius (?des=joc), perquè els alumnes no vegin publicitat.
// El consentiment de galetes el gestiona el missatge de privadesa certificat de Google (AdSense > Privacidad y mensajes).
import { useEffect } from 'react';
import { SITE } from '@/lib/site';
import { useFromGame } from './AdSlot';

export function AdSense() {
  const fromGame = useFromGame();
  useEffect(() => {
    if (fromGame || !SITE.adsenseAccount || document.querySelector('script[data-adsense]')) return;
    const s = document.createElement('script');
    s.async = true; s.dataset.adsense = '1'; s.crossOrigin = 'anonymous';
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adsenseAccount}`;
    document.head.appendChild(s);
  }, [fromGame]);
  return null;
}
