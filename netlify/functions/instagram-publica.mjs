// Publica sola a Instagram els posts de instagram/calendario.json, el dia i l'hora (de Madrid) de cada post.
// S'executa cada 15 minuts: publica el post quan n'ha arribat l'hora (per defecte, les 18:00).
// Netlify talla les funcions programades als 30 s: la publicació es fa per etapes (imatges → carrusel → publicar)
// i, si Instagram encara processa les imatges, l'estat es desa i la propera execució continua on s'havia quedat.
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
// Un post està acabat quan ja és a Instagram o s'ha saltat; si està a mitges (fase/publicant), encara toca
const acabat = (x) => !!x && !x.fase && !x.publicant;
export function triaPost(cal, fets, avui, hora = '23:59') {
  const ahir = ahirDe(avui);
  const pendents = cal.posts.filter(p => (p.fecha < avui || (p.fecha === avui && (p.hora || '18:00') <= hora)) && !acabat(fets[p.id])).sort((a, b) => (a.fecha + (a.hora || '18:00')).localeCompare(b.fecha + (b.hora || '18:00')));
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

// Compara el text d'un post amb el que hi ha a Instagram (sense espais ni salts de línia)
const norm = (t) => String(t || '').replace(/\s+/g, ' ').trim().slice(0, 120);
const mateixText = (a, b) => !!a && norm(a) === norm(b);

export async function executa({ cal = CAL, store, env, fetch, avui, hora, ara = Date.now(), espera = (ms) => new Promise(r => setTimeout(r, ms)), pressupost = 22000, rellotge = () => Date.now() }) {
  const t0 = rellotge(), resta = () => pressupost - (rellotge() - t0);
  // L'estat es desa a Netlify Blobs; si falla, la comprovació a Instagram (més avall) evita igualment els duplicats
  const desa = async () => { try { await store.setJSON('publicats', fets); } catch (e) { console.warn('No s\'ha pogut desar l\'estat a Netlify Blobs:', e.message); } };
  let fets = {};
  try { fets = (await store.get('publicats', { type: 'json' })) || {}; } catch (e) { console.warn('No s\'ha pogut llegir l\'estat de Netlify Blobs:', e.message); }
  const { post, saltats } = triaPost(cal, fets, avui, hora);
  if (saltats.length) { saltats.forEach(p => { fets[p.id] = { saltat: true, at: new Date(ara).toISOString() }; console.warn('Post saltat (la data ja ha passat):', p.id); }); await desa(); }
  const prova = env.IG_PROVA === '1';
  if (!post && !prova) return { fet: false, motiu: 'Ara no toca cap post.' };
  const token = await testimoni({ store, env, fetch, ara });
  const api = crearClient({ fetch, token });
  if (!env.IG_USER_ID && !esIG(token)) throw new Error('Amb un testimoni de Facebook cal la variable IG_USER_ID (l\'identificador del compte d\'Instagram).');
  const usuari = env.IG_USER_ID || (await api.crida('GET', '/me', { fields: 'user_id,username' })).user_id;
  if (prova) { // Mode de prova: comprova la connexió (només llegeix) i diu què publicaria
    const compte = await api.crida('GET', '/' + usuari, { fields: 'username' });
    const seg = post || cal.posts.filter(p => (p.fecha > avui || (p.fecha === avui && hora && (p.hora || '18:00') > hora)) && !acabat(fets[p.id])).sort((x, y) => x.fecha.localeCompare(y.fecha))[0];
    console.log('[prova] Connexió correcta amb @' + compte.username + '. ' + (post ? 'Avui publicaria ' + post.id : 'Avui no toca cap post' + (seg ? '; el següent és ' + seg.id : '')) + '.');
    return { fet: false, prova: true, compte: compte.username, post: post ? post.id : null, seguent: seg ? seg.id : null };
  }
  const base = (env.URL || 'https://ecoynexo.com').replace(/\/$/, '');
  const iso = () => new Date(ara).toISOString();
  let st = fets[post.id];
  // Inici (o reinici d'una publicació antiga o tallada): primer comprova que no sigui ja a Instagram
  if (!st || !st.fase || ara - Date.parse(st.at || 0) > 20 * 3600000) {
    const recents = (await api.crida('GET', `/${usuari}/media`, { fields: 'id,caption,timestamp', limit: '15' })).data || [];
    const ja = recents.find(m => mateixText(m.caption, post.texto));
    if (ja) { fets[post.id] = { media: ja.id, at: ja.timestamp || iso(), trobat: true }; await desa(); console.log('Ja era a Instagram, no es torna a publicar:', post.id); return { fet: false, jaHiEra: true, post: post.id }; }
    const imgs = post.slides.map((_, k) => `${base}/ig/${post.id}/${k + 1}.jpg`);
    if (imgs.length === 1) st = { fase: 'contenidor', contenidor: (await api.crida('POST', `/${usuari}/media`, { image_url: imgs[0], caption: post.texto })).id, at: iso() };
    else st = { fase: 'fills', fills: (await Promise.all(imgs.map(u => api.crida('POST', `/${usuari}/media`, { image_url: u, is_carousel_item: 'true' })))).map(x => x.id), at: iso() };
    fets[post.id] = st; await desa();
  }
  const falla = async (msg) => { delete fets[post.id]; await desa(); throw new Error(msg); };
  for (;;) {
    if (st.fase === 'fills') {
      const est = await Promise.all(st.fills.map(id => api.crida('GET', '/' + id, { fields: 'status_code' })));
      const mal = est.find(e => e.status_code === 'ERROR' || e.status_code === 'EXPIRED');
      if (mal) await falla('Instagram no ha pogut processar la imatge (' + mal.status_code + ').');
      if (est.every(e => e.status_code === 'FINISHED')) {
        st = { fase: 'contenidor', contenidor: (await api.crida('POST', `/${usuari}/media`, { media_type: 'CAROUSEL', children: st.fills.join(','), caption: post.texto })).id, at: st.at };
        fets[post.id] = st; await desa(); continue;
      }
    } else {
      const e = await api.crida('GET', '/' + st.contenidor, { fields: 'status_code' });
      if (e.status_code === 'ERROR' || e.status_code === 'EXPIRED') await falla('Instagram no ha pogut processar la imatge (' + e.status_code + ').');
      if (e.status_code === 'PUBLISHED') { fets[post.id] = { media: st.contenidor, at: iso() }; await desa(); console.log('Ja estava publicat a Instagram:', post.id); return { fet: true, post: post.id, media: st.contenidor }; }
      if (e.status_code === 'FINISHED') {
        const media = (await api.crida('POST', `/${usuari}/media_publish`, { creation_id: st.contenidor })).id;
        fets[post.id] = { media, at: iso() }; await desa();
        console.log('Publicat a Instagram:', post.id, media);
        return { fet: true, post: post.id, media };
      }
    }
    if (resta() < 5000) { console.log('Instagram encara processa les imatges de', post.id, '(' + st.fase + '): continuarà a la propera execució.'); return { fet: false, enCurs: true, post: post.id, fase: st.fase }; }
    await espera(1500);
  }
}

export default async () => {
  try {
    const ara = new Date();
    const r = await executa({ store: getStore('instagram'), env: process.env, fetch, avui: avuiMadrid(ara), hora: horaMadrid(ara) });
    console.log(JSON.stringify(r));
  } catch (e) { console.error('Error publicant a Instagram:', e.message); }
  return new Response('ok');
};

// Cada 15 minuts (l'hora de cada post és la de Madrid)
export const config = { schedule: '*/15 * * * *' };
