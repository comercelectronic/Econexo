'use client';
// Espai publicitari fix d'AdSense (el script el carrega <AdSense /> al layout).
// El consentiment de galetes el gestiona el missatge de privadesa certificat de Google (AdSense > Privacidad y mensajes).
import { useEffect } from 'react';
import { useT } from './LangProvider';
import { SITE } from '@/lib/site';

const CLIENT = SITE.adsenseAccount;

// multiplex: graella d'anuncis «autorelaxed», per al final de les pàgines, després del contingut relacionat
export function AdSlot({ slot, label = 'Publicidad', multiplex = false }: { slot: string; label?: string; multiplex?: boolean }) {
  const t = useT();
  const id = /^\d+$/.test(slot) ? slot : multiplex ? SITE.adSlotMultiplex : SITE.adSlot;  // els noms (p. ex. «articulo-final») fan servir el bloc general
  useEffect(() => {
    if (!CLIENT || !id) return;
    try { ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle ||= []).push({}); } catch { /* sense anuncis */ }
  }, [id]);
  if (!CLIENT || !id) return null;
  return (
    <aside className="my-8 text-center" aria-label={t(label)}>
      <span className="mb-1 block text-[10px] uppercase tracking-widest text-muted">{t(label)}</span>
      {multiplex
        ? <ins className="adsbygoogle block" data-ad-client={CLIENT} data-ad-slot={id} data-ad-format="autorelaxed" />
        : <ins className="adsbygoogle block" data-ad-client={CLIENT} data-ad-slot={id} data-ad-format="auto" data-full-width-responsive="true" />}
    </aside>
  );
}
