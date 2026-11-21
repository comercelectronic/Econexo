// «Para profundizar»: material recomanat amb enllaços d'afiliat d'Amazon (marcats com a patrocinats).
import { RECOMENDADOS, amazonUrl } from '@/lib/afiliados';
import { tr, type Lang } from '@/lib/i18n';

export function PerAprofundir({ modulo, lang }: { modulo: string; lang: Lang }) {
  const t = tr(lang), rs = RECOMENDADOS[modulo];
  if (!rs || !rs.length) return null;
  return (
    <section className="mt-10 rounded-2xl border border-line p-5">
      <h2 className="text-xl font-extrabold text-navy">📚 {t('Para profundizar')}</h2>
      <ul className="mt-3 grid gap-3 md:grid-cols-2">
        {rs.map((r) => (
          <li key={r.titulo}>
            <a href={amazonUrl(r)} target="_blank" rel="sponsored nofollow noopener" className="block h-full rounded-xl bg-mist p-4 hover:ring-2 hover:ring-teal">
              <b className="text-navy">{t(r.titulo)}</b>
              <span className="mt-1 block text-sm text-muted">{t(r.desc)}</span>
              <span className="mt-2 block text-sm font-semibold text-teal">{t('Ver en Amazon →')}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">{t('Enlaces de afiliado: si compras a través de ellos, ECOyNEXO recibe una pequeña comisión sin que te cueste más.')}</p>
    </section>
  );
}
