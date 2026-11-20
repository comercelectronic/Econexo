// Proves de la publicació automàtica a Instagram (API simulada). node scripts/test-instagram.mjs
import assert from 'assert';
import fs from 'fs';
import { executa, triaPost, avuiMadrid, horaMadrid } from '../netlify/functions/instagram-publica.mjs';

const CAL = JSON.parse(fs.readFileSync(new URL('../instagram/calendario.json', import.meta.url)));
let ok = 0; const t = (c, nom) => { assert.ok(c, nom); ok++; };

// Calendari: dates vàlides i úniques, imatges generades, textos dins dels límits d'Instagram
const ids = new Set();
for (const p of CAL.posts) {
  t(/^\d{4}-\d{2}-\d{2}$/.test(p.fecha) && p.id.startsWith(p.fecha) && !ids.has(p.id), 'id i data: ' + p.id); ids.add(p.id);
  t(p.slides.length >= 1 && p.slides.length <= 10, 'entre 1 i 10 imatges: ' + p.id);
  t(p.slides.every((_, k) => fs.existsSync(new URL(`../public/ig/${p.id}/${k + 1}.jpg`, import.meta.url))), 'imatges generades: ' + p.id);
  t(p.texto.length <= 2200 && (p.texto.match(/#\w/g) || []).length <= 30, 'text i etiquetes dins del límit: ' + p.id);
}
t(new Set(CAL.posts.map(p => p.fecha)).size === CAL.posts.length, 'com a molt un post per dia');

// Data de Madrid
t(avuiMadrid(new Date('2026-11-23T23:30:00Z')) === '2026-11-24', 'la data es calcula a l\'hora de Madrid');
t(horaMadrid(new Date('2026-11-19T11:00:00Z')) === '12:00' && horaMadrid(new Date('2026-07-01T10:00:00Z')) === '12:00', 'l\'hora de Madrid té en compte l\'horari d\'estiu');
t(CAL.posts.every(p => /^(0\d|1\d|2[0-3]):[0-5]\d$/.test(p.hora || '18:00')), 'hores vàlides al calendari');
{ const c = { posts: [{ id: '2026-11-19-x', fecha: '2026-11-19', hora: '12:00', slides: [{}], texto: 'X' }] };
  t(triaPost(c, {}, '2026-11-19', '11:00').post === null && triaPost(c, {}, '2026-11-19', '12:00').post.id === '2026-11-19-x', 'es publica quan arriba l\'hora del post, no abans');
  t(triaPost(c, {}, '2026-11-20', '00:00').post.id === '2026-11-19-x', 'si a l\'hora del post va fallar, es torna a provar fins l\'endemà'); }

// Quin post toca
const cal = { posts: [{ id: '2026-11-23-a', fecha: '2026-11-23', slides: [{}], texto: 'A' }, { id: '2026-11-25-b', fecha: '2026-11-25', slides: [{}, {}, {}], texto: 'B' }, { id: '2026-11-27-c', fecha: '2026-11-27', slides: [{}], texto: 'C' }] };
t(triaPost(cal, {}, '2026-11-24').post.id === '2026-11-23-a', 'si ahir va fallar, es publica avui');
t(triaPost(cal, {}, '2026-11-26').post.id === '2026-11-25-b' && triaPost(cal, {}, '2026-11-26').saltats[0].id === '2026-11-23-a', 'els posts massa antics se salten');
t(triaPost(cal, { '2026-11-25-b': {} }, '2026-11-25').post === null, 'no es repeteix un post ja publicat');

// API d'Instagram simulada
function simula({ falla, publicats = [] } = {}) {
  const crides = []; let n = 0; const captions = {};
  const fetch = async (url, o = {}) => {
    const u = new URL(url), p = o.body ? Object.fromEntries(o.body) : Object.fromEntries(u.searchParams);
    crides.push({ host: u.host, ruta: u.pathname, metode: o.method || 'GET', p });
    const resp = (d, st = 200) => ({ ok: st < 400, status: st, json: async () => d });
    if (u.pathname === '/refresh_access_token') return resp({ access_token: 'IGTOKEN-NOU', expires_in: 5184000 });
    if (u.pathname.endsWith('/me')) return resp({ user_id: '1789', username: 'ecoynexo' });
    if (u.pathname.endsWith('/media') && (o.method || 'GET') === 'GET') return resp({ data: publicats.map((c, k) => ({ id: 'P' + k, caption: c, timestamp: '2026-11-19T11:00:00+0000' })) });
    if (u.pathname.endsWith('/media_publish')) publicats.push(captions[p.creation_id]);
    if (u.pathname.endsWith('/media') && p.caption) captions['C' + (n + 1)] = p.caption;
    if (u.pathname.endsWith('/media') && falla) return resp({ error: { message: 'Invalid image' } }, 400);
    if (u.pathname.endsWith('/media')) return resp({ id: 'C' + (++n) });
    if (u.pathname.endsWith('/media_publish')) return resp({ id: 'M-' + p.creation_id });
    if (p.fields === 'username') return resp({ username: 'ecoynexo', id: u.pathname.split('/').pop() });
    return resp({ status_code: 'FINISHED' });
  };
  return { fetch, crides, publicats };
}
const magatzem = () => { const d = {}; return { d, get: async (k) => d[k] ? JSON.parse(d[k]) : null, setJSON: async (k, v) => { d[k] = JSON.stringify(v); } }; };
const env = { IG_TOKEN: 'IGTOKEN-INICIAL-1234567890', URL: 'https://ecoynexo.com' }, espera = async () => { };

{ // Carrusel
  const s = magatzem(), api = simula();
  const r = await executa({ cal, store: s, env, fetch: api.fetch, avui: '2026-11-25', espera, ara: Date.parse('2026-11-25T17:00:00Z') });
  t(r.fet && r.post === '2026-11-25-b', 'publica el post del dia');
  const fills = api.crides.filter(c => c.metode === 'POST' && c.ruta === '/v22.0/1789/media' && c.p.is_carousel_item === 'true');
  t(fills.length === 3 && fills[0].p.image_url === 'https://ecoynexo.com/ig/2026-11-25-b/1.jpg', 'una imatge del carrusel per diapositiva, servida des de la web');
  const car = api.crides.find(c => c.p.media_type === 'CAROUSEL');
  t(car && car.p.children === 'C1,C2,C3' && car.p.caption === 'B', 'carrusel amb el text del post');
  t(api.crides.some(c => c.ruta === '/v22.0/1789/media_publish' && c.p.creation_id === 'C4'), 'publica el contenidor');
  t(api.crides.every(c => c.ruta === '/refresh_access_token' || c.host === 'graph.instagram.com' && c.p.access_token === 'IGTOKEN-NOU'), 'renova el testimoni i fa servir el nou');
  t(s.d.token && JSON.parse(s.d.token).token === 'IGTOKEN-NOU', 'desa el testimoni renovat');
  t(JSON.parse(s.d.publicats)['2026-11-23-a'].saltat && JSON.parse(s.d.publicats)['2026-11-25-b'].media === 'M-C4', 'registra què s\'ha publicat i què s\'ha saltat');
  const api2 = simula(); const r2 = await executa({ cal, store: s, env, fetch: api2.fetch, avui: '2026-11-25', espera, ara: Date.parse('2026-11-25T18:00:00Z') });
  t(!r2.fet && api2.crides.length === 0, 'no publica dues vegades el mateix dia');
  const api3 = simula(); await executa({ cal, store: s, env, fetch: api3.fetch, avui: '2026-11-27', espera, ara: Date.parse('2026-11-27T17:00:00Z') });
  t(!api3.crides.some(c => c.ruta === '/refresh_access_token'), 'no renova el testimoni cada dia');
  t(api3.crides.some(c => c.p.caption === 'C' && !c.p.media_type), 'una sola imatge es publica sense carrusel');
}
{ // Si el testimoni de Netlify canvia, es fa servir el nou
  const s = magatzem(); await s.setJSON('token', { token: 'VELL', origen: 'altra-cosa', renovat: Date.parse('2026-11-24T00:00:00Z') });
  const api = simula(); await executa({ cal, store: s, env: Object.assign({ IG_USER_ID: '55' }, env), fetch: api.fetch, avui: '2026-11-23', espera, ara: Date.parse('2026-11-23T17:00:00Z') });
  t(!api.crides.some(c => c.p.access_token === 'VELL') && api.crides.some(c => c.ruta === '/v22.0/55/media'), 'un IG_TOKEN nou substitueix el desat; IG_USER_ID evita consultar /me');
}
{ // Testimoni d'inici de sessió unificat o de Facebook (usuari del sistema): graph.facebook.com, sense renovar
  const api = simula(), fb = { IG_TOKEN: 'EAAsistema123', IG_USER_ID: '17841474376146863', URL: 'https://ecoynexo.com' };
  const r = await executa({ cal, store: magatzem(), env: fb, fetch: api.fetch, avui: '2026-11-25', espera, ara: Date.parse('2026-11-25T17:00:00Z') });
  t(r.fet && api.crides.every(c => c.host === 'graph.facebook.com') && api.crides.some(c => c.ruta === '/v22.0/17841474376146863/media_publish'), 'amb testimoni de Facebook publica a graph.facebook.com');
  t(!api.crides.some(c => c.ruta === '/refresh_access_token'), 'el testimoni de Facebook no es renova');
  await assert.rejects(executa({ cal, store: magatzem(), env: { IG_TOKEN: 'EAAsistema123' }, fetch: simula().fetch, avui: '2026-11-25', espera }), /IG_USER_ID/); ok++;
}
{ // No es repeteix mai un post (encara que l'estat desat falli)
  const api = simula({ publicats: ['B'] }), s = magatzem();
  const r = await executa({ cal, store: s, env, fetch: api.fetch, avui: '2026-11-25', espera });
  t(r.jaHiEra && !api.crides.some(c => c.ruta.endsWith('/media_publish')), 'si el post ja és a Instagram no es torna a publicar');
  t(JSON.parse(s.d.publicats)['2026-11-25-b'].trobat, 'i queda anotat com a publicat');
  const trencat = { get: async () => { throw new Error('Blobs no disponible'); }, setJSON: async () => { throw new Error('Blobs no disponible'); } };
  // Netlify Blobs no funciona: es publica igualment, però només una vegada
  const api2 = simula();
  for (let h = 0; h < 4; h++) await executa({ cal, store: trencat, env: Object.assign({ IG_USER_ID: '9' }, env), fetch: api2.fetch, avui: '2026-11-25', espera });
  t(api2.publicats.length === 1, 'sense Netlify Blobs, quatre execucions seguides publiquen el post una sola vegada');
  // Una segona execució després de publicar troba el post a Instagram encara que l'estat s'hagi perdut
  const api4 = simula(); await executa({ cal, store: magatzem(), env, fetch: api4.fetch, avui: '2026-11-25', espera });
  const r5 = await executa({ cal, store: magatzem(), env, fetch: api4.fetch, avui: '2026-11-25', espera });
  t(r5.jaHiEra && api4.publicats.length === 1, 'amb l\'estat perdut, el post tampoc es duplica');
}
{ // Errors i mode de prova
  const s = magatzem(), api = simula({ falla: true });
  await assert.rejects(executa({ cal, store: s, env, fetch: api.fetch, avui: '2026-11-25', espera }), /Invalid image/); ok++;
  t(!(s.d.publicats && JSON.parse(s.d.publicats)['2026-11-25-b']), 'si falla, no es marca com a publicat (es torna a provar l\'endemà)');
  const s2 = magatzem(), api2 = simula();
  const r = await executa({ cal, store: s2, env: Object.assign({ IG_PROVA: '1' }, env), fetch: api2.fetch, avui: '2026-11-25', espera });
  t(r.prova && r.compte === 'ecoynexo' && r.post === '2026-11-25-b' && !api2.crides.some(c => c.metode === 'POST'), 'el mode de prova comprova la connexió i no publica res');
  const r3 = await executa({ cal, store: magatzem(), env: Object.assign({ IG_PROVA: '1' }, env), fetch: simula().fetch, avui: '2026-11-19', espera });
  t(r3.prova && r3.post === null && r3.seguent === '2026-11-23-a', 'en mode de prova, un dia sense post diu quin és el següent');
  await assert.rejects(executa({ cal, store: magatzem(), env: {}, fetch: simula().fetch, avui: '2026-11-25', espera }), /IG_TOKEN/); ok++;
}
// Publicació per etapes (Netlify talla les funcions programades als 30 s)
{ const calE = { posts: [{ id: '2026-11-20-m', fecha: '2026-11-20', hora: '12:00', slides: [{}, {}, {}, {}, {}, {}], texto: 'Marge comercial' }] };
  function lent({ estat = () => 'FINISHED', publicats = [] } = {}) {
    let n = 0; const crides = [], captions = {};
    const fetch = async (url, o = {}) => {
      const u = new URL(url), p = o.body ? Object.fromEntries(o.body) : Object.fromEntries(u.searchParams);
      crides.push({ ruta: u.pathname, metode: o.method || 'GET', p });
      const resp = (d) => ({ ok: true, status: 200, json: async () => d });
      if (u.pathname.endsWith('/media') && (o.method || 'GET') === 'GET') return resp({ data: publicats.map((c, k) => ({ id: 'P' + k, caption: c })) });
      if (u.pathname.endsWith('/media_publish')) { publicats.push(captions[p.creation_id]); return resp({ id: 'M-' + p.creation_id }); }
      if (u.pathname.endsWith('/media')) { const id = 'C' + (++n); if (p.caption) captions[id] = p.caption; return resp({ id }); }
      return resp({ status_code: estat(u.pathname.split('/').pop()) });
    };
    return { fetch, crides, publicats };
  }
  const envE = Object.assign({ IG_USER_ID: '9' }, env);
  // 1a execució: Instagram encara processa les imatges i s'acaba el temps → es desa l'estat
  const s = magatzem(); let rell = 0;
  const a1 = lent({ estat: () => 'IN_PROGRESS' });
  const r1 = await executa({ cal: calE, store: s, env: envE, fetch: a1.fetch, avui: '2026-11-20', hora: '12:00', espera, pressupost: 10000, rellotge: () => (rell += 3000), ara: Date.parse('2026-11-20T11:00:00Z') });
  const st = JSON.parse(s.d.publicats)['2026-11-20-m'];
  t(r1.enCurs && st.fase === 'fills' && st.fills.length === 6, 'si s\'acaba el temps, l\'estat queda desat a mitges (6 imatges pujades)');
  t(a1.crides.filter(c => c.p.is_carousel_item === 'true').length === 6, 'les 6 imatges es pugen alhora, un sol cop');
  // 2a execució: continua on s'havia quedat, sense tornar a pujar les imatges
  const a2 = lent();
  const r2 = await executa({ cal: calE, store: s, env: envE, fetch: a2.fetch, avui: '2026-11-20', hora: '12:15', espera, ara: Date.parse('2026-11-20T11:15:00Z') });
  t(r2.fet && !a2.crides.some(c => c.p.is_carousel_item === 'true') && a2.crides.filter(c => c.ruta.endsWith('/media_publish')).length === 1, 'la següent execució continua i publica una sola vegada');
  t(triaPost(calE, JSON.parse(s.d.publicats), '2026-11-20', '12:30').post === null, 'un cop publicat ja no es torna a provar');
  // Un post encallat amb l'estat antic «publicant» es torna a provar, i si ja és a Instagram no es duplica
  const s3 = magatzem(); await s3.setJSON('publicats', { '2026-11-20-m': { publicant: true, at: '2026-11-20T11:00:00Z' } });
  t(triaPost(calE, { '2026-11-20-m': { publicant: true } }, '2026-11-20', '21:00').post.id === '2026-11-20-m', 'un post encallat «publicant» es torna a provar');
  const a3 = lent({ publicats: ['Marge comercial'] });
  const r3 = await executa({ cal: calE, store: s3, env: envE, fetch: a3.fetch, avui: '2026-11-20', hora: '21:00', espera, ara: Date.parse('2026-11-20T20:00:00Z') });
  t(r3.jaHiEra && !a3.crides.some(c => c.metode === 'POST'), 'si ja era a Instagram, no es torna a publicar');
  const a4 = lent();
  const r4 = await executa({ cal: calE, store: magatzem(), env: envE, fetch: a4.fetch, avui: '2026-11-20', hora: '21:00', espera, ara: Date.parse('2026-11-20T20:00:00Z') });
  t(r4.fet && a4.publicats.length === 1, 'i si no hi era, es publica');
  // Si la funció es va tallar just després de publicar, el contenidor surt PUBLISHED: no es torna a publicar
  const s5 = magatzem(); await s5.setJSON('publicats', { '2026-11-20-m': { fase: 'contenidor', contenidor: 'C7', at: '2026-11-20T11:00:00Z' } });
  const a5 = lent({ estat: () => 'PUBLISHED' });
  const r5 = await executa({ cal: calE, store: s5, env: envE, fetch: a5.fetch, avui: '2026-11-20', hora: '12:15', espera, ara: Date.parse('2026-11-20T11:15:00Z') });
  t(r5.fet && !a5.crides.some(c => c.ruta.endsWith('/media_publish')), 'un contenidor ja publicat no es torna a publicar');
}
console.log('✔ ' + ok + ' comprovacions de la publicació a Instagram');
