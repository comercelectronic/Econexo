'use client';
// Espai publicitari d'AdSense. No es mostra mai:
//  - si encara no hi ha client d'AdSense configurat (NEXT_PUBLIC_ADSENSE_CLIENT),
//  - si el visitant arriba des del joc educatiu «Agència Digital» (?des=joc), perquè els alumnes no vegin publicitat.
// El consentiment de galetes el gestiona el missatge de privadesa certificat de Google (AdSense > Privacidad y mensajes).
import { useEffect, useState } from 'react';
import { useT } from './LangProvider';

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export function useFromGame() {
  const [fromGame, setFromGame] = useState(true);
  useEffect(() => {
    try {
      if (new URLSearchParams(location.search).get('des') === 'joc') sessionStorage.setItem('econexo-joc', '1');
      setFromGame(sessionStorage.getItem('econexo-joc') === '1');
    } catch { setFromGame(false); }
  }, []);
  return fromGame;
}

export function AdSlot({ slot, label = 'Publicidad' }: { slot: string; label?: string }) {
  const t = useT();
  const fromGame = useFromGame();
  useEffect(() => {
    if (!CLIENT || fromGame) return;
    if (!document.querySelector('script[data-adsense]')) {
      const s = document.createElement('script');
      s.async = true; s.dataset.adsense = '1'; s.crossOrigin = 'anonymous';
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;
      document.head.appendChild(s);
    }
    try { ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle ||= []).push({}); } catch { /* sense anuncis */ }
  }, [fromGame]);
  if (!CLIENT || fromGame) return null;
  return (
    <aside className="my-8 text-center" aria-label={t(label)}>
      <span className="mb-1 block text-[10px] uppercase tracking-widest text-muted">{t(label)}</span>
      <ins className="adsbygoogle block" data-ad-client={CLIENT} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
    </aside>
  );
}
