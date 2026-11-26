// Rànquing dels reptes de classe d'Aparadors BCN (ecoynexo.com/jocs/aparadors-bcn/).
// POST /.netlify/functions/aparadors amb JSON {action, ...}:
//   crear   {classe}                         → {codi, clau}   el professorat crea un repte (clau: per tancar-lo)
//   enviar  {codi, alumne, rep, nivell, estrelles, ca}  → {ok}  l'alumne envia el seu progrés (es queda el millor)
//   ranking {codi}                           → {classe, alumnes:[…]}
//   tancar  {codi, clau}                     → {ok}           el repte deixa d'acceptar enviaments
// Netlify Blobs, magatzem 'aparadors-reptes': una entrada per codi. No es desen dades personals més enllà del
// nom que escriu l'alumne (es recomana nom de pila o àlies).
import { getStore } from '@netlify/blobs';

const json = (d, status = 200) => new Response(JSON.stringify(d), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const net = (s, n) => String(s || '').replace(/[<>"'`\\]/g, '').replace(/\s+/g, ' ').trim().slice(0, n);
const num = (v, max) => Math.max(0, Math.min(max, Math.round(Number(v) || 0)));
const LLETRES = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const nouCodi = () => 'AP' + Array.from({ length: 5 }, () => LLETRES[Math.floor(Math.random() * LLETRES.length)]).join('');

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Només POST' }, 405);
  let b; try { b = await req.json() } catch { return json({ error: 'JSON no vàlid' }, 400) }
  const store = getStore('aparadors-reptes');
  const codi = net(b.codi, 8).toUpperCase();

  if (b.action === 'crear') {
    const classe = net(b.classe, 40); if (!classe) return json({ error: 'Cal el nom de la classe' }, 400);
    let c = nouCodi(); for (let k = 0; k < 5 && await store.get(c); k++) c = nouCodi();
    const clau = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
    await store.setJSON(c, { classe, clau, creat: Date.now(), obert: true, alumnes: {} });
    return json({ codi: c, clau });
  }
  if (!/^AP[A-Z0-9]{5}$/.test(codi)) return json({ error: 'Codi de repte no vàlid' }, 400);
  const r = await store.get(codi, { type: 'json' });
  if (!r) return json({ error: 'Aquest repte no existeix' }, 404);

  if (b.action === 'enviar') {
    if (!r.obert) return json({ error: 'El repte està tancat' }, 403);
    const alumne = net(b.alumne, 30); if (!alumne) return json({ error: 'Cal un nom' }, 400);
    const key = alumne.toLowerCase();
    if (!r.alumnes[key] && Object.keys(r.alumnes).length >= 120) return json({ error: 'El repte és ple' }, 403);
    const prev = r.alumnes[key] || {}, rep = num(b.rep, 100000);
    r.alumnes[key] = { alumne, rep: Math.max(rep, prev.rep || 0), nivell: num(b.nivell, 10), estrelles: num(b.estrelles, 100), ca: num(b.ca, 50), t: Date.now() };
    await store.setJSON(codi, r);
    return json({ ok: true });
  }
  if (b.action === 'ranking') {
    const alumnes = Object.values(r.alumnes).sort((a, z) => z.rep - a.rep).slice(0, 120);
    return json({ classe: r.classe, obert: r.obert, alumnes });
  }
  if (b.action === 'tancar') {
    if (b.clau !== r.clau) return json({ error: 'Clau incorrecta' }, 403);
    r.obert = false; await store.setJSON(codi, r); return json({ ok: true });
  }
  return json({ error: 'Acció desconeguda' }, 400);
};
