'use client';
// Formulari de subscripció. Netlify Forms el recull (vegeu public/__forms.html); més endavant es pot connectar a Brevo o Mailchimp.
import { useState } from 'react';

export function Newsletter() {
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
      <p className="text-xs font-bold uppercase tracking-widest text-teal">Newsletter</p>
      <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">Lo importante, sin perder el tiempo.</h2>
      <p className="mt-2 max-w-2xl text-white/75">Una selección semanal de actualidad, guías y herramientas sobre economía, marketing, tecnología e IA. Gratis y sin spam.</p>
      {state === 'ok' ? (
        <p className="mt-6 rounded-lg bg-white/10 p-4 font-semibold">¡Gracias! Te has suscrito correctamente. Recibirás la próxima newsletter en tu correo.</p>
      ) : (
        <form name="newsletter" onSubmit={submit} className="mt-6 grid gap-3 md:max-w-xl">
          <input type="hidden" name="form-name" value="newsletter" />
          <p hidden><label>No rellenar: <input name="bot-field" /></label></p>
          <label className="sr-only" htmlFor="nl-email">Correo electrónico</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input id="nl-email" name="email" type="email" required placeholder="tu@correo.com" className="flex-1 rounded-lg px-4 py-3 text-ink" />
            <button disabled={state === 'sending'} className="rounded-lg bg-teal px-5 py-3 font-semibold hover:bg-teal-dark disabled:opacity-60">{state === 'sending' ? 'Enviando…' : 'Suscribirme'}</button>
          </div>
          <label className="flex items-start gap-2 text-sm text-white/75">
            <input type="checkbox" name="consentimiento" value="si" required className="mt-1" />
            <span>Acepto recibir la newsletter y he leído la <a className="underline" href="/privacidad/">política de privacidad</a>. Puedo darme de baja en cualquier momento.</span>
          </label>
          {state === 'error' && <p className="text-sm text-amber-300">No se ha podido enviar. Inténtalo de nuevo en unos minutos.</p>}
        </form>
      )}
    </section>
  );
}
