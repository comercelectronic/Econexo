'use client';
// Anuncis automàtics de Google AdSense a tota la web (els jocs de public/jocs els carreguen pel seu compte: scripts/anuncis-jocs.sh).
// El consentiment de galetes el gestiona el missatge de privadesa certificat de Google (AdSense > Privacidad y mensajes).
import { useEffect } from 'react';
import { SITE } from '@/lib/site';

export function AdSense() {
  useEffect(() => {
    if (!SITE.adsenseAccount || document.querySelector('script[data-adsense]')) return;
    const s = document.createElement('script');
    s.async = true; s.dataset.adsense = '1'; s.crossOrigin = 'anonymous';
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adsenseAccount}`;
    document.head.appendChild(s);
  }, []);
  return null;
}
