'use client';
// Espai publicitari fix d'AdSense (el script el carrega <AdSense /> al layout). No es mostra mai:
//  - si el bloc no té l'identificador numèric d'un bloc d'anuncis creat a AdSense (mentrestant, Google col·loca anuncis automàtics),
//  - si el visitant arriba des del joc educatiu «Agència Digital» (?des=joc), perquè els alumnes no vegin publicitat.
// El consentiment de galetes el gestiona el missatge de privadesa certificat de Google (AdSense > Privacidad y mensajes).
import { useEffect, useState } from 'react';
import { useT } from './LangProvider';
import { SITE } from '@/lib/site';

const CLIENT = SITE.adsenseAccount;

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
  const real = /^\d+$/.test(slot);
  useEffect(() => {
    if (!CLIENT || fromGame || !real) return;
    try { ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle ||= []).push({}); } catch { /* sense anuncis */ }
  }, [fromGame, real]);
  if (!CLIENT || fromGame || !real) return null;
  return (
    <aside className="my-8 text-center" aria-label={t(label)}>
      <span className="mb-1 block text-[10px] uppercase tracking-widest text-muted">{t(label)}</span>
      <ins className="adsbygoogle block" data-ad-client={CLIENT} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
    </aside>
  );
}
