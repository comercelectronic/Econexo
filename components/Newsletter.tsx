'use client';
// Formulari de subscripció. Netlify Forms el recull (vegeu public/__forms.html); més endavant es pot connectar a Brevo o Mailchimp.
import { useState } from 'react';
import { useLang, useT } from './LangProvider';
import { l } from '@/lib/i18n';

export function Newsletter({ variant }: { variant?: 'nexo' }) {
  const t = useT(), lang = useLang();
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    const data = new URLSearchParams(new FormData(e.currentTarget) as unknown as Record<string, string>);
    try {
      const r = await fetch('/__forms.html', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: data.toString() });
      setState(r.ok ? 'ok' : 'error');
    } catch { setState('error'); }
  }
  return (
    <section id="newsletter" className="rounded-2xl bg-navy p-6 text-white md:p-10">
      <p className="text-xs font-bold uppercase tracking-widest text-teal">{t('Newsletter')}</p>
      {variant === 'nexo' ? (
        <div className="mt-2 flex items-center gap-4">
          <img src="/media/personajes/nexo-neutral.webp" alt="" className="h-16 w-16 rounded-full ring-2 ring-white" />
          <div><h2 className="text-2xl font-extrabold md:text-3xl">{t('El consejo semanal de NEXO')}</h2>
            <p className="mt-1 max-w-2xl text-white/75">{t('Cada semana, un concepto de marketing, economía o tecnología explicado en dos minutos (y el último desastre de ECO). Gratis y sin spam.')}</p></div>
        </div>
      ) : (
        <>
          <img src="/media/personajes/eco-y-nexo.webp" alt="" className="float-right ml-4 hidden h-32 w-auto rounded-xl bg-white p-2 sm:block" loading="lazy" />
          <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">{t('Lo importante para tu ciclo, sin perder el tiempo.')}</h2>
          <p className="mt-2 max-w-2xl text-white/75">{t('Cada semana: lecciones nuevas, noticias relacionadas con lo que estudias, una herramienta para practicar y el consejo de NEXO. Gratis y sin spam.')}</p>
        </>
      )}
      {state === 'ok' ? (
        <p className="mt-6 rounded-lg bg-white/10 p-4 font-semibold">{t('¡Gracias! Te has suscrito correctamente. Recibirás la próxima newsletter en tu correo.')}</p>
      ) : (
        <form name="newsletter" onSubmit={submit} className="mt-6 grid gap-3 md:max-w-xl">
          <input type="hidden" name="form-name" value="newsletter" />
          <p hidden><label>No rellenar: <input name="bot-field" /></label></p>
          <label className="sr-only" htmlFor="nl-email">{t('Correo electrónico')}</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input id="nl-email" name="email" type="email" required placeholder={t('tu@correo.com')} className="flex-1 rounded-lg bg-white px-4 py-3 text-ink" />
            <button disabled={state === 'sending'} className="rounded-lg bg-teal px-5 py-3 font-semibold hover:bg-teal-dark disabled:opacity-60">{state === 'sending' ? t('Enviando…') : t('Suscribirme')}</button>
          </div>
          <label className="flex items-start gap-2 text-sm text-white/75">
            <input type="checkbox" name="consentimiento" value="si" required className="mt-1" />
            <span>{t('Acepto recibir la newsletter y he leído la')} <a className="underline" href={l(lang, '/privacidad/')}>{t('política de privacidad')}</a>. {t('Puedo darme de baja en cualquier momento.')}</span>
          </label>
          {state === 'error' && <p className="text-sm text-amber-300">{t('No se ha podido enviar. Inténtalo de nuevo en unos minutos.')}</p>}
        </form>
      )}
    </section>
  );
}
