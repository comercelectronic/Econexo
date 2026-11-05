// Idiomes de la web: català (per defecte) i castellà. Les adreces porten el prefix /ca/ o /es/.
// Els textos del codi estan escrits en castellà i es tradueixen al català amb el diccionari de lib/ca.ts
// (la clau és el text castellà). Els continguts llargs (lliçons, articles, pàgines legals) tenen un fitxer per idioma.
import { CA } from './ca';

export const LANGS = ['ca', 'es'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'ca';
export const LANG_NAMES: Record<Lang, string> = { ca: 'Català', es: 'Castellano' };
export const isLang = (s: string): s is Lang => (LANGS as readonly string[]).includes(s);
export const LOCALES: Record<Lang, string> = { ca: 'ca-ES', es: 'es-ES' };

// Adreça d'una pàgina en un idioma: l('ca', '/aprender/') → /ca/aprender/
export const l = (lang: Lang, path = '/') => `/${lang}${path.startsWith('/') ? path : '/' + path}`;

export type TFn = (s: string, ...a: (string | number)[]) => string;
export function tr(lang: Lang): TFn {
  return (s, ...a) => {
    let r = s;
    if (lang === 'ca') {
      const v = CA[s];
      if (v === undefined) { if (process.env.I18N_REPORT && /[a-záéíóúñ]{3}/i.test(s)) console.warn('[i18n-missing] ' + JSON.stringify(s)); } else r = v;
    }
    return a.length ? r.replace(/\{(\d+)\}/g, (_, i) => String(a[+i])) : r;
  };
}
