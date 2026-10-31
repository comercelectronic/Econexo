'use client';
// Calculadores interactives de /herramientas/. Tot es calcula al navegador: no s'envien dades enlloc.
import { useMemo, useState } from 'react';

const nf = (n: number, d = 2) => (Number.isFinite(n) ? new Intl.NumberFormat('es-ES', { maximumFractionDigits: d, minimumFractionDigits: 0 }).format(n) : '—');

function Field({ label, value, onChange, suffix, step = 'any', min = 0 }: { label: string; value: number; onChange: (n: number) => void; suffix?: string; step?: string; min?: number }) {
  return (
    <label className="block text-sm font-semibold text-navy">
      {label}
      <span className="mt-1 flex items-center rounded-lg border border-line bg-white focus-within:border-teal">
        <input type="number" inputMode="decimal" step={step} min={min} value={Number.isNaN(value) ? '' : value} onChange={(e) => onChange(parseFloat(e.target.value))} className="tabular w-full rounded-lg px-3 py-2.5 outline-none" />
        {suffix && <span className="px-3 text-muted">{suffix}</span>}
      </span>
    </label>
  );
}
const Result = ({ label, value, tone = 'navy' }: { label: string; value: string; tone?: 'navy' | 'teal' | 'warn' }) => (
  <div className="rounded-xl bg-mist p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
    <p className={`tabular mt-1 font-display text-2xl font-extrabold ${tone === 'teal' ? 'text-teal-dark' : tone === 'warn' ? 'text-warn' : 'text-navy'}`}>{value}</p>
  </div>
);
const Box = ({ children }: { children: React.ReactNode }) => <div className="grid gap-6 rounded-2xl border border-line p-5 md:grid-cols-2 md:p-8">{children}</div>;

export function RoasCalc() {
  const [spend, setSpend] = useState(500), [rev, setRev] = useState(2000), [margin, setMargin] = useState(30);
  const roas = rev / spend, be = 100 / margin, profit = rev * margin / 100 - spend;
  return (
    <Box>
      <div className="space-y-4">
        <Field label="Inversión publicitaria" value={spend} onChange={setSpend} suffix="€" />
        <Field label="Ingresos atribuidos a la campaña" value={rev} onChange={setRev} suffix="€" />
        <Field label="Margen bruto de lo que vendes" value={margin} onChange={setMargin} suffix="%" />
      </div>
      <div className="grid content-start gap-3">
        <Result label="ROAS" value={nf(roas)} tone={roas >= be ? 'teal' : 'warn'} />
        <Result label="ROAS de equilibrio" value={nf(be)} />
        <Result label="Beneficio bruto después de la publicidad" value={`${nf(profit)} €`} tone={profit >= 0 ? 'teal' : 'warn'} />
        <p className="text-sm text-muted">{roas >= be ? 'La campaña cubre el coste de la publicidad con tu margen.' : 'Con este margen, la campaña no cubre lo que cuesta la publicidad.'}</p>
      </div>
    </Box>
  );
}

export function RoiCalc() {
  const [inv, setInv] = useState(600), [gain, setGain] = useState(1500);
  const roi = (gain - inv) / inv * 100;
  return (
    <Box>
      <div className="space-y-4">
        <Field label="Inversión total" value={inv} onChange={setInv} suffix="€" />
        <Field label="Beneficio generado (margen)" value={gain} onChange={setGain} suffix="€" />
      </div>
      <div className="grid content-start gap-3">
        <Result label="ROI" value={`${nf(roi, 1)} %`} tone={roi >= 0 ? 'teal' : 'warn'} />
        <Result label="Beneficio neto" value={`${nf(gain - inv)} €`} tone={gain >= inv ? 'teal' : 'warn'} />
        <p className="text-sm text-muted">Por cada euro invertido recuperas {nf(gain / inv)} €.</p>
      </div>
    </Box>
  );
}

const clean = (s: string) => s.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9_\-.]/g, '');
export function UtmCalc() {
  const [v, setV] = useState({ url: 'https://tuweb.com/oferta/', source: 'newsletter', medium: 'email', campaign: 'noviembre', term: '', content: '' });
  const [copied, setCopied] = useState(false);
  const out = useMemo(() => {
    try {
      const u = new URL(v.url.trim());
      (['source', 'medium', 'campaign', 'term', 'content'] as const).forEach((k) => { const x = clean(v[k]); if (x) u.searchParams.set('utm_' + k, x); });
      return u.toString();
    } catch { return ''; }
  }, [v]);
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [k]: e.target.value });
  const fields: [keyof typeof v, string, string][] = [['url', 'URL de destino', 'https://…'], ['source', 'Fuente (utm_source) *', 'google, newsletter, instagram'], ['medium', 'Medio (utm_medium) *', 'cpc, email, social'], ['campaign', 'Campaña (utm_campaign) *', 'black-friday'], ['term', 'Término (utm_term)', 'palabra clave'], ['content', 'Contenido (utm_content)', 'banner-azul']];
  return (
    <Box>
      <div className="space-y-3">
        {fields.map(([k, l, ph]) => (
          <label key={k} className="block text-sm font-semibold text-navy">{l}
            <input value={v[k]} onChange={set(k)} placeholder={ph} className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 outline-none focus:border-teal" />
          </label>
        ))}
      </div>
      <div className="grid content-start gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Enlace etiquetado</p>
        <output className="block break-all rounded-xl bg-mist p-4 font-mono text-sm text-navy">{out || 'Escribe una URL válida que empiece por https://'}</output>
        <button disabled={!out} onClick={() => navigator.clipboard.writeText(out).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })} className="rounded-lg bg-teal px-4 py-2.5 font-semibold text-white hover:bg-teal-dark disabled:opacity-50">{copied ? '¡Copiado!' : 'Copiar enlace'}</button>
        <p className="text-sm text-muted">Los valores se pasan a minúsculas y sin espacios para que Analytics no cuente «Email» y «email» como medios distintos.</p>
      </div>
    </Box>
  );
}

export function CompoundCalc() {
  const [p0, setP0] = useState(10000), [pm, setPm] = useState(100), [rate, setRate] = useState(5), [years, setYears] = useState(20), [infl, setInfl] = useState(2.5);
  const rows = useMemo(() => {
    const r = rate / 100 / 12, out: { y: number; put: number; bal: number; real: number }[] = [];
    let bal = p0, put = p0;
    for (let m = 1; m <= Math.min(600, Math.round(years * 12)); m++) {
      bal = bal * (1 + r) + pm; put += pm;
      if (m % 12 === 0) out.push({ y: m / 12, put, bal, real: bal / Math.pow(1 + infl / 100, m / 12) });
    }
    return out;
  }, [p0, pm, rate, years, infl]);
  const last = rows[rows.length - 1];
  return (
    <div className="space-y-6">
      <Box>
        <div className="space-y-4">
          <Field label="Capital inicial" value={p0} onChange={setP0} suffix="€" />
          <Field label="Aportación mensual" value={pm} onChange={setPm} suffix="€" />
          <Field label="Rentabilidad anual supuesta" value={rate} onChange={setRate} suffix="%" min={-50} />
          <Field label="Años" value={years} onChange={setYears} step="1" />
          <Field label="Inflación anual supuesta" value={infl} onChange={setInfl} suffix="%" min={-10} />
        </div>
        <div className="grid content-start gap-3">
          <Result label="Total aportado" value={last ? `${nf(last.put, 0)} €` : '—'} />
          <Result label="Valor final (nominal)" value={last ? `${nf(last.bal, 0)} €` : '—'} tone="teal" />
          <Result label="Intereses generados" value={last ? `${nf(last.bal - last.put, 0)} €` : '—'} />
          <Result label="Valor final en euros de hoy" value={last ? `${nf(last.real, 0)} €` : '—'} />
        </div>
      </Box>
      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="tabular w-full text-sm">
            <thead className="bg-mist text-left text-navy"><tr><th className="p-2.5">Año</th><th className="p-2.5">Aportado</th><th className="p-2.5">Saldo</th><th className="p-2.5">Saldo en euros de hoy</th></tr></thead>
            <tbody>{rows.map((r) => <tr key={r.y} className="border-t border-line"><td className="p-2.5">{r.y}</td><td className="p-2.5">{nf(r.put, 0)} €</td><td className="p-2.5">{nf(r.bal, 0)} €</td><td className="p-2.5">{nf(r.real, 0)} €</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function EngagementCalc() {
  const [f, setF] = useState(10000), [posts, setPosts] = useState(10), [likes, setLikes] = useState(1000), [com, setCom] = useState(120), [sh, setSh] = useState(50), [sv, setSv] = useState(30), [reach, setReach] = useState(0);
  const total = likes + com + sh + sv, perPost = total / posts, rate = perPost / f * 100, rateReach = reach > 0 ? perPost / reach * 100 : NaN;
  return (
    <Box>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Field label="Seguidores" value={f} onChange={setF} step="1" /></div>
        <div className="col-span-2"><Field label="Publicaciones analizadas" value={posts} onChange={setPosts} step="1" /></div>
        <Field label="Me gusta (total)" value={likes} onChange={setLikes} step="1" />
        <Field label="Comentarios (total)" value={com} onChange={setCom} step="1" />
        <Field label="Compartidos (total)" value={sh} onChange={setSh} step="1" />
        <Field label="Guardados (total)" value={sv} onChange={setSv} step="1" />
        <div className="col-span-2"><Field label="Alcance medio por publicación (opcional)" value={reach} onChange={setReach} step="1" /></div>
      </div>
      <div className="grid content-start gap-3">
        <Result label="Interacciones por publicación" value={nf(perPost, 1)} />
        <Result label="Tasa de interacción por seguidores" value={`${nf(rate, 2)} %`} tone="teal" />
        {reach > 0 && <Result label="Tasa de interacción por alcance" value={`${nf(rateReach, 2)} %`} />}
        <p className="text-sm text-muted">De cada 100 seguidores, unos {nf(rate, 1)} interactúan con cada publicación. Compara la cifra con tus meses anteriores y con cuentas parecidas a la tuya.</p>
      </div>
    </Box>
  );
}

const CALCULATORS: Record<string, () => React.ReactElement> = {
  'calculadora-engagement': EngagementCalc, 'calculadora-roas': RoasCalc, 'calculadora-roi': RoiCalc, 'generador-utm': UtmCalc, 'interes-compuesto': CompoundCalc
};
export function Calculator({ slug }: { slug: string }) { const C = CALCULATORS[slug]; return C ? <C /> : null; }
