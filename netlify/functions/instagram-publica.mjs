// Publica sola a Instagram els posts de instagram/calendario.json, el dia i l'hora (de Madrid) de cada post.
// S'executa cada hora en punt: publica el post quan n'ha arribat l'hora (per defecte, les 18:00).
//
// Accepta els dos tipus de testimoni que dona Meta:
//   - d'inici de sessió d'Instagram (comença per «IG», graph.instagram.com, dura 60 dies: la funció el renova sola);
//   - d'inici de sessió unificat o de Facebook (usuari del sistema, graph.facebook.com, no caduca).
// Variables d'entorn a Netlify:
//   IG_TOKEN    testimoni d'accés.
//   IG_USER_ID  identificador del compte d'Instagram (obligatori amb el testimoni de Facebook; opcional amb el d'Instagram).
//   IG_PROVA=1  (opcional) mode de prova: ho escriu al registre però no publica res.
// Les imatges es serveixen des de la mateixa web: <URL>/ig/<id>/<n>.jpg (es generen amb scripts/instagram/genera.mjs).
// Netlify Blobs, magatzem 'instagram': 'publicats' (posts ja fets) i 'token' (testimoni renovat).
import { getStore } from '@netlify/blobs';
import CAL from '../../instagram/calendario.json' with { type: 'json' };

const VERSIO = 'v22.0';
const esIG = (t) => /^IG/.test(t || '');
export const hostDe = (t) => esIG(t) ? 'https://graph.instagram.com/' + VERSIO : 'https://graph.facebook.com/' + VERSIO;
const RENOVA_DIES = 20;  // el testimoni dura 60 dies: es renova cada 20

// Data d'avui a Madrid (AAAA-MM-DD)
export const avuiMadrid = (d = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
// Hora de Madrid (HH:MM)
export const horaMadrid = (d = new Date()) => new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d);
const ahirDe = (dia) => { const d = new Date(dia + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() - 1); return d.toISOString().slice(0, 10); };

// Quin post toca: el d'avui si ja n'és l'hora, o el d'ahir si la publicació va fallar. Els més antics es marquen com a saltats.
export function triaPost(cal, fets, avui, hora = '23:59') {
  const ahir = ahirDe(avui);
  const pendents = cal.posts.filter(p => (p.fecha < avui || (p.fecha === avui && (p.hora || '18:00') <= hora)) && !fets[p.id]).sort((a, b) => (a.fecha + (a.hora || '18:00')).localeCompare(b.fecha + (b.hora || '18:00')));
  const saltats = pendents.filter(p => p.fecha < ahir);
  return { post: pendents.find(p => p.fecha >= ahir) || null, saltats };
}

export function crearClient({ fetch, token }) {
  const API = hostDe(token);
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
  if (esIG(t.token) && ara - (t.renovat || 0) > RENOVA_DIES * 86400000) {
    try {
      const r = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(t.token)}`);
      const d = await r.json();
      if (d.access_token) { t = { token: d.access_token, origen, renovat: ara }; await store.setJSON('token', t); }
      else console.warn('No s\'ha pogut renovar el testimoni d\'Instagram:', JSON.stringify(d.error || d));
    } catch (e) { console.warn('No s\'ha pogut renovar el testimoni d\'Instagram:', e.message); }
  }
  return t.token;
}

export async function executa({ cal = CAL, store, env, fetch, avui, hora, ara = Date.now(), espera = (ms) => new Promise(r => setTimeout(r, ms)) }) {
  const fets = (await store.get('publicats', { type: 'json' }).catch(() => null)) || {};
  const { post, saltats } = triaPost(cal, fets, avui, hora);
  if (saltats.length) { saltats.forEach(p => { fets[p.id] = { saltat: true, at: new Date(ara).toISOString() }; console.warn('Post saltat (la data ja ha passat):', p.id); }); await store.setJSON('publicats', fets); }
  const prova = env.IG_PROVA === '1';
  if (!post && !prova) return { fet: false, motiu: 'Ara no toca cap post.' };
  const token = await testimoni({ store, env, fetch, ara });
  const api = crearClient({ fetch, token });
  if (!env.IG_USER_ID && !esIG(token)) throw new Error('Amb un testimoni de Facebook cal la variable IG_USER_ID (l\'identificador del compte d\'Instagram).');
  const usuari = env.IG_USER_ID || (await api.crida('GET', '/me', { fields: 'user_id,username' })).user_id;
  if (prova) { // Mode de prova: comprova la connexió (només llegeix) i diu què publicaria
    const compte = await api.crida('GET', '/' + usuari, { fields: 'username' });
    const seg = post || cal.posts.filter(p => (p.fecha > avui || (p.fecha === avui && hora && (p.hora || '18:00') > hora)) && !fets[p.id]).sort((x, y) => x.fecha.localeCompare(y.fecha))[0];
    console.log('[prova] Connexió correcta amb @' + compte.username + '. ' + (post ? 'Avui publicaria ' + post.id : 'Avui no toca cap post' + (seg ? '; el següent és ' + seg.id : '')) + '.');
    return { fet: false, prova: true, compte: compte.username, post: post ? post.id : null, seguent: seg ? seg.id : null };
  }
  const base = (env.URL || 'https://ecoynexo.com').replace(/\/$/, '');
  const media = await publicaPost({ api, usuari, post, base, espera });
  fets[post.id] = { media, at: new Date(ara).toISOString() };
  await store.setJSON('publicats', fets);
  console.log('Publicat a Instagram:', post.id, media);
  return { fet: true, post: post.id, media };
}

export default async () => {
  try {
    const ara = new Date();
    const r = await executa({ store: getStore('instagram'), env: process.env, fetch, avui: avuiMadrid(ara), hora: horaMadrid(ara) });
    console.log(JSON.stringify(r));
  } catch (e) { console.error('Error publicant a Instagram:', e.message); }
  return new Response('ok');
};

// Cada hora en punt (l'hora de cada post és la de Madrid)
export const config = { schedule: '0 * * * *' };
