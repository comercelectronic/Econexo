// Publica sola a Instagram els posts de instagram/calendario.json (cada dia a les 18:00 de Madrid a l'hivern).
//
// Fa servir l'API d'Instagram amb inici de sessió d'Instagram (compte professional, sense pàgina de Facebook).
// Variables d'entorn a Netlify:
//   IG_TOKEN    testimoni d'accés de llarga durada (60 dies). La funció el renova sola i el desa a Netlify Blobs.
//   IG_USER_ID  (opcional) identificador del compte; si no hi és, es demana a l'API.
//   IG_PROVA=1  (opcional) mode de prova: ho escriu al registre però no publica res.
// Les imatges es serveixen des de la mateixa web: <URL>/ig/<id>/<n>.jpg (es generen amb scripts/instagram/genera.mjs).
// Netlify Blobs, magatzem 'instagram': 'publicats' (posts ja fets) i 'token' (testimoni renovat).
import { getStore } from '@netlify/blobs';
import CAL from '../../instagram/calendario.json' with { type: 'json' };

const API = 'https://graph.instagram.com/v22.0';
const RENOVA_DIES = 20;  // el testimoni dura 60 dies: es renova cada 20

// Data d'avui a Madrid (AAAA-MM-DD)
export const avuiMadrid = (d = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
const ahirDe = (dia) => { const d = new Date(dia + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() - 1); return d.toISOString().slice(0, 10); };

// Quin post toca: el d'avui, o el d'ahir si la publicació va fallar. Els més antics es marquen com a saltats.
export function triaPost(cal, fets, avui) {
  const ahir = ahirDe(avui);
  const pendents = cal.posts.filter(p => p.fecha <= avui && !fets[p.id]).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const saltats = pendents.filter(p => p.fecha < ahir);
  return { post: pendents.find(p => p.fecha >= ahir) || null, saltats };
}

export function crearClient({ fetch, token }) {
  async function crida(metode, ruta, params) {
    const q = new URLSearchParams(Object.assign({}, params, { access_token: token }));
    const r = metode === 'GET' ? await fetch(`${API}${ruta}?${q}`) : await fetch(`${API}${ruta}`, { method: 'POST', body: q });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || d.error) throw new Error(`Instagram ${ruta}: ${(d.error && d.error.message) || r.status}`);
    return d;
  }
  return { crida };
}

async function esperaContenidor(api, id, espera) {
  for (let k = 0; k < 20; k++) {
    const d = await api.crida('GET', '/' + id, { fields: 'status_code' });
    if (d.status_code === 'FINISHED') return;
    if (d.status_code === 'ERROR' || d.status_code === 'EXPIRED') throw new Error('Instagram no ha pogut processar la imatge (' + d.status_code + ').');
    await espera(1500);
  }
  throw new Error('Instagram triga massa a processar les imatges.');
}

// Publica un post (una imatge o un carrusel) i torna l'identificador del contingut publicat
export async function publicaPost({ api, usuari, post, base, espera }) {
  const imgs = post.slides.map((_, k) => `${base}/ig/${post.id}/${k + 1}.jpg`);
  let contenidor;
  if (imgs.length === 1) contenidor = (await api.crida('POST', `/${usuari}/media`, { image_url: imgs[0], caption: post.texto })).id;
  else {
    const fills = [];
    for (const u of imgs) fills.push((await api.crida('POST', `/${usuari}/media`, { image_url: u, is_carousel_item: 'true' })).id);
    for (const f of fills) await esperaContenidor(api, f, espera);
    contenidor = (await api.crida('POST', `/${usuari}/media`, { media_type: 'CAROUSEL', children: fills.join(','), caption: post.texto })).id;
  }
  await esperaContenidor(api, contenidor, espera);
  return (await api.crida('POST', `/${usuari}/media_publish`, { creation_id: contenidor })).id;
}

// Testimoni vigent: el renovat que hi ha a Blobs, si encara correspon al de les variables d'entorn
async function testimoni({ store, env, fetch, ara }) {
  const desat = await store.get('token', { type: 'json' }).catch(() => null);
  const origen = (env.IG_TOKEN || '').slice(-12);
  let t = desat && desat.origen === origen ? desat : { token: env.IG_TOKEN, origen, renovat: 0 };
  if (!t.token) throw new Error('Falta la variable IG_TOKEN a Netlify.');
  if (ara - (t.renovat || 0) > RENOVA_DIES * 86400000) {
    try {
      const r = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(t.token)}`);
      const d = await r.json();
      if (d.access_token) { t = { token: d.access_token, origen, renovat: ara }; await store.setJSON('token', t); }
      else console.warn('No s\'ha pogut renovar el testimoni d\'Instagram:', JSON.stringify(d.error || d));
    } catch (e) { console.warn('No s\'ha pogut renovar el testimoni d\'Instagram:', e.message); }
  }
  return t.token;
}

export async function executa({ cal = CAL, store, env, fetch, avui, ara = Date.now(), espera = (ms) => new Promise(r => setTimeout(r, ms)) }) {
  const fets = (await store.get('publicats', { type: 'json' }).catch(() => null)) || {};
  const { post, saltats } = triaPost(cal, fets, avui);
  if (saltats.length) { saltats.forEach(p => { fets[p.id] = { saltat: true, at: new Date(ara).toISOString() }; console.warn('Post saltat (la data ja ha passat):', p.id); }); await store.setJSON('publicats', fets); }
  if (!post) return { fet: false, motiu: 'Avui no toca cap post.' };
  if (env.IG_PROVA === '1') { console.log('[prova] Publicaria', post.id, post.slides.length + ' imatges'); return { fet: false, prova: true, post: post.id }; }
  const token = await testimoni({ store, env, fetch, ara });
  const api = crearClient({ fetch, token });
  const usuari = env.IG_USER_ID || (await api.crida('GET', '/me', { fields: 'user_id,username' })).user_id;
  const base = (env.URL || 'https://ecoynexo.com').replace(/\/$/, '');
  const media = await publicaPost({ api, usuari, post, base, espera });
  fets[post.id] = { media, at: new Date(ara).toISOString() };
  await store.setJSON('publicats', fets);
  console.log('Publicat a Instagram:', post.id, media);
  return { fet: true, post: post.id, media };
}

export default async () => {
  try {
    const r = await executa({ store: getStore('instagram'), env: process.env, fetch, avui: avuiMadrid() });
    console.log(JSON.stringify(r));
  } catch (e) { console.error('Error publicant a Instagram:', e.message); }
  return new Response('ok');
};

// Cada dia a les 17:00 UTC (18:00 a Madrid a l'hivern, 19:00 a l'estiu)
export const config = { schedule: '0 17 * * *' };
