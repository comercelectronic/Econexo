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

export function MargenCalc() {
  const [cost, setCost] = useState(10), [margin, setMargin] = useState(40), [iva, setIva] = useState(21);
  const price = margin < 100 ? cost / (1 - margin / 100) : NaN, markup = (price - cost) / cost * 100;
  return (
    <Box>
      <div className="space-y-4">
        <Field label="Coste de compra (sin IVA)" value={cost} onChange={setCost} suffix="€" />
        <Field label="Margen deseado sobre el precio de venta" value={margin} onChange={setMargin} suffix="%" />
        <Field label="IVA aplicable" value={iva} onChange={setIva} suffix="%" />
      </div>
      <div className="grid content-start gap-3">
        <Result label="Precio de venta sin IVA" value={`${nf(price)} €`} tone="teal" />
        <Result label="Precio de venta con IVA (PVP)" value={`${nf(price * (1 + iva / 100))} €`} />
        <Result label="Beneficio bruto por unidad" value={`${nf(price - cost)} €`} />
        <Result label="Markup sobre el coste" value={`${nf(markup, 1)} %`} />
      </div>
    </Box>
  );
}

export function IvaCalc() {
  const [amount, setAmount] = useState(100), [iva, setIva] = useState(21), [mode, setMode] = useState<'base' | 'total'>('base');
  const base = mode === 'base' ? amount : amount / (1 + iva / 100), total = mode === 'base' ? amount * (1 + iva / 100) : amount;
  return (
    <Box>
      <div className="space-y-4">
        <div role="group" aria-label="Qué importe tienes" className="flex gap-2 text-sm font-semibold">
          {([['base', 'Tengo la base (sin IVA)'], ['total', 'Tengo el total (con IVA)']] as const).map(([k, l]) => (
            <button key={k} onClick={() => setMode(k)} aria-pressed={mode === k} className={`flex-1 rounded-lg border px-3 py-2 ${mode === k ? 'border-teal bg-teal text-white' : 'border-line text-navy'}`}>{l}</button>
          ))}
        </div>
        <Field label={mode === 'base' ? 'Base imponible' : 'Precio con IVA'} value={amount} onChange={setAmount} suffix="€" />
        <div>
          <Field label="Tipo de IVA" value={iva} onChange={setIva} suffix="%" />
          <div className="mt-2 flex gap-2">{[21, 10, 4, 0].map((x) => <button key={x} onClick={() => setIva(x)} className="rounded-full border border-line px-3 py-1 text-sm font-semibold text-navy hover:border-teal">{x} %</button>)}</div>
        </div>
      </div>
      <div className="grid content-start gap-3">
        <Result label="Base imponible" value={`${nf(base)} €`} />
        <Result label="IVA" value={`${nf(total - base)} €`} />
        <Result label="Total con IVA" value={`${nf(total)} €`} tone="teal" />
      </div>
    </Box>
  );
}

export function EquilibrioCalc() {
  const [fixed, setFixed] = useState(800), [price, setPrice] = useState(40), [vc, setVc] = useState(25), [sold, setSold] = useState(80);
  const cm = price - vc, units = cm > 0 ? fixed / cm : NaN, profit = sold * cm - fixed;
  return (
    <Box>
      <div className="space-y-4">
        <Field label="Costes fijos del periodo" value={fixed} onChange={setFixed} suffix="€" />
        <Field label="Precio de venta por unidad" value={price} onChange={setPrice} suffix="€" />
        <Field label="Coste variable por unidad" value={vc} onChange={setVc} suffix="€" />
        <Field label="Unidades que esperas vender" value={sold} onChange={setSold} step="1" />
      </div>
      <div className="grid content-start gap-3">
        <Result label="Margen de contribución por unidad" value={`${nf(cm)} €`} tone={cm > 0 ? 'navy' : 'warn'} />
        <Result label="Unidades de equilibrio" value={cm > 0 ? nf(Math.ceil(units), 0) : '—'} tone="teal" />
        <Result label="Facturación de equilibrio" value={cm > 0 ? `${nf(Math.ceil(units) * price, 0)} €` : '—'} />
        <Result label="Beneficio con tus ventas previstas" value={`${nf(profit, 0)} €`} tone={profit >= 0 ? 'teal' : 'warn'} />
        <p className="text-sm text-muted">{cm <= 0 ? 'Con este precio y este coste variable, cada venta aumenta la pérdida: no hay punto de equilibrio.' : sold >= units ? 'Con esas ventas cubres los costes fijos.' : 'Con esas ventas no llegas al equilibrio.'}</p>
      </div>
    </Box>
  );
}

export function DescuentoCalc() {
  const [price, setPrice] = useState(100), [d1, setD1] = useState(30), [d2, setD2] = useState(20);
  const final = price * (1 - d1 / 100) * (1 - d2 / 100), total = (1 - final / price) * 100;
  return (
    <Box>
      <div className="space-y-4">
        <Field label="Precio original" value={price} onChange={setPrice} suffix="€" />
        <Field label="Primer descuento" value={d1} onChange={setD1} suffix="%" />
        <Field label="Segundo descuento (opcional, se aplica después)" value={d2} onChange={setD2} suffix="%" />
      </div>
      <div className="grid content-start gap-3">
        <Result label="Precio final" value={`${nf(final)} €`} tone="teal" />
        <Result label="Ahorro" value={`${nf(price - final)} €`} />
        <Result label="Descuento real total" value={`${nf(total, 1)} %`} />
        <p className="text-sm text-muted">Los dos descuentos no se suman: el segundo se aplica sobre el precio ya rebajado{d1 + d2 !== total && d2 > 0 ? ` (${nf(d1 + d2, 0)} % anunciado frente a ${nf(total, 1)} % real)` : ''}.</p>
      </div>
    </Box>
  );
}

export function AdMetricsCalc() {
  const [imp, setImp] = useState(20000), [clk, setClk] = useState(400), [cost, setCost] = useState(240), [conv, setConv] = useState(12);
  return (
    <Box>
      <div className="space-y-4">
        <Field label="Impresiones" value={imp} onChange={setImp} step="1" />
        <Field label="Clics" value={clk} onChange={setClk} step="1" />
        <Field label="Coste de la campaña" value={cost} onChange={setCost} suffix="€" />
        <Field label="Conversiones (ventas, contactos…)" value={conv} onChange={setConv} step="1" />
      </div>
      <div className="grid grid-cols-2 content-start gap-3">
        <Result label="CTR" value={`${nf(clk / imp * 100)} %`} tone="teal" />
        <Result label="CPC" value={`${nf(cost / clk)} €`} />
        <Result label="CPM" value={`${nf(cost / imp * 1000)} €`} />
        <Result label="Tasa de conversión" value={`${nf(conv / clk * 100)} %`} />
        <div className="col-span-2"><Result label="CPA (coste por conversión)" value={`${nf(cost / conv)} €`} tone="teal" /></div>
      </div>
    </Box>
  );
}

export function ConversionCalc() {
  const [visits, setVisits] = useState(5000), [orders, setOrders] = useState(40), [rev, setRev] = useState(2000), [up, setUp] = useState(25);
  const rate = orders / visits * 100, aov = rev / orders, newOrders = orders * (1 + up / 100);
  return (
    <Box>
      <div className="space-y-4">
        <Field label="Visitas al mes" value={visits} onChange={setVisits} step="1" />
        <Field label="Pedidos" value={orders} onChange={setOrders} step="1" />
        <Field label="Ingresos (sin IVA)" value={rev} onChange={setRev} suffix="€" />
        <Field label="Mejora relativa de la conversión que quieres simular" value={up} onChange={setUp} suffix="%" />
      </div>
      <div className="grid content-start gap-3">
        <Result label="Tasa de conversión" value={`${nf(rate)} %`} tone="teal" />
        <Result label="Ticket medio" value={`${nf(aov)} €`} />
        <Result label="Ingresos por visita" value={`${nf(rev / visits)} €`} />
        <Result label={`Con un ${nf(up, 0)} % más de conversión`} value={`${nf(newOrders, 0)} pedidos · ${nf(newOrders * aov, 0)} €`} tone="teal" />
      </div>
    </Box>
  );
}

export function LtvCalc() {
  const [aov, setAov] = useState(40), [freq, setFreq] = useState(3), [years, setYears] = useState(3), [margin, setMargin] = useState(30), [cac, setCac] = useState(36);
  const ltv = aov * freq * years * margin / 100, monthly = aov * freq / 12 * margin / 100;
  return (
    <Box>
      <div className="space-y-4">
        <Field label="Ticket medio por compra" value={aov} onChange={setAov} suffix="€" />
        <Field label="Compras por cliente y año" value={freq} onChange={setFreq} />
        <Field label="Años de relación con el cliente" value={years} onChange={setYears} />
        <Field label="Margen bruto" value={margin} onChange={setMargin} suffix="%" />
        <Field label="Coste de conseguir un cliente (CAC)" value={cac} onChange={setCac} suffix="€" />
      </div>
      <div className="grid content-start gap-3">
        <Result label="LTV (valor de vida del cliente)" value={`${nf(ltv)} €`} tone="teal" />
        <Result label="Ratio LTV / CAC" value={nf(ltv / cac)} tone={ltv / cac >= 3 ? 'teal' : ltv / cac >= 1 ? 'navy' : 'warn'} />
        <Result label="Meses para recuperar el CAC" value={nf(cac / monthly, 1)} />
        <p className="text-sm text-muted">{ltv / cac >= 3 ? 'Por encima de 3 se suele considerar saludable.' : ltv / cac >= 1 ? 'Ganas dinero con cada cliente, pero con poco margen de seguridad.' : 'Pierdes dinero con cada cliente nuevo: reduce el CAC o aumenta el valor del cliente.'}</p>
      </div>
    </Box>
  );
}

export function StockCalc() {
  const [daily, setDaily] = useState(8), [lead, setLead] = useState(10), [safety, setSafety] = useState(3), [cogs, setCogs] = useState(120000), [avg, setAvg] = useState(20000);
  const rop = daily * lead + daily * safety, rot = cogs / avg;
  return (
    <Box>
      <div className="space-y-4">
        <Field label="Unidades vendidas al día" value={daily} onChange={setDaily} />
        <Field label="Plazo de entrega del proveedor (días)" value={lead} onChange={setLead} step="1" />
        <Field label="Stock de seguridad (días de ventas)" value={safety} onChange={setSafety} step="1" />
        <Field label="Coste de las ventas del año" value={cogs} onChange={setCogs} suffix="€" />
        <Field label="Stock medio valorado a coste" value={avg} onChange={setAvg} suffix="€" />
      </div>
      <div className="grid content-start gap-3">
        <Result label="Punto de pedido (unidades)" value={nf(rop, 0)} tone="teal" />
        <Result label="Rotación del stock (veces al año)" value={nf(rot, 1)} />
        <Result label="Días de stock" value={nf(365 / rot, 0)} />
        <p className="text-sm text-muted">Cuando te queden {nf(rop, 0)} unidades, haz el pedido: llegarán justo cuando consumas el stock de seguridad.</p>
      </div>
    </Box>
  );
}

export function SeoCalc() {
  const [title, setTitle] = useState('Tienda de bicicletas en Vic · Reparación y venta'), [desc, setDesc] = useState('Compra y repara tu bicicleta en Vic. Asesoramiento personal, taller propio y entrega en 24 horas en Osona.');
  const bar = (n: number, max: number) => <span className={`tabular text-xs font-bold ${n > max ? 'text-warn' : n === 0 ? 'text-muted' : 'text-teal-dark'}`}>{n} / {max}</span>;
  return (
    <Box>
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-navy"><span className="flex justify-between">Título SEO {bar(title.length, 60)}</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5 outline-none focus:border-teal" /></label>
        <label className="block text-sm font-semibold text-navy"><span className="flex justify-between">Meta descripción {bar(desc.length, 155)}</span>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5 outline-none focus:border-teal" /></label>
      </div>
      <div className="grid content-start gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Así se vería en Google</p>
        <div className="rounded-xl bg-mist p-4 font-sans">
          <p className="text-xs text-muted">https://tuweb.com › tienda</p>
          <p className="mt-0.5 text-lg leading-snug text-[#1a0dab]">{title.slice(0, 60) || 'Título de la página'}{title.length > 60 ? '…' : ''}</p>
          <p className="mt-1 text-sm leading-snug text-ink">{desc.slice(0, 155) || 'Aquí aparecerá la descripción de la página.'}{desc.length > 155 ? '…' : ''}</p>
        </div>
        <p className="text-sm text-muted">{title.length > 60 || desc.length > 155 ? 'Recorta el texto: Google lo cortaría.' : 'La longitud es adecuada. Comprueba que el texto sea claro y atractivo para quien busca.'}</p>
      </div>
    </Box>
  );
}

const CALCULATORS: Record<string, () => React.ReactElement> = {
  'calculadora-engagement': EngagementCalc, 'calculadora-roas': RoasCalc, 'calculadora-roi': RoiCalc, 'generador-utm': UtmCalc, 'interes-compuesto': CompoundCalc,
  'calculadora-margen-precio': MargenCalc, 'calculadora-iva': IvaCalc, 'punto-de-equilibrio': EquilibrioCalc, 'calculadora-descuentos': DescuentoCalc, 'metricas-publicidad': AdMetricsCalc,
  'tasa-conversion-ticket-medio': ConversionCalc, 'calculadora-ltv-cac': LtvCalc, 'stock-y-punto-de-pedido': StockCalc, 'contador-seo-titulo-descripcion': SeoCalc
};
export function Calculator({ slug }: { slug: string }) { const C = CALCULATORS[slug]; return C ? <C /> : null; }
