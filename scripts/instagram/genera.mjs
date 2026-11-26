// Genera les imatges dels posts d'Instagram (JPEG 1080×1350) a partir de instagram/calendario.json.
// Ús: node scripts/instagram/genera.mjs [id-del-post]
// Les imatges es desen a public/ig/<id>/<n>.jpg; la funció programada les publica des de ecoynexo.com/ig/...
// Necessita Playwright (només per generar-les, no a Netlify).
import { createRequire } from 'module';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
const fileURL = (f) => pathToFileURL(f).href;   // file:///… també a Windows

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ARREL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CAL = JSON.parse(fs.readFileSync(path.join(ARREL, 'instagram/calendario.json'), 'utf8'));
const PERS = fileURL(path.join(ARREL, 'public/media/personajes')) + '/';
const FONTS = fileURL(path.join(ARREL, 'instagram/fonts')) + '/';
const LOGO = fileURL(path.join(ARREL, 'public/logo.png'));

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const md = (t) => esc(t).replace(/ (%|€)/g, '\u00a0$1').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
// Color de cada tipus de post
const TEMA = { presentacion: ['#12A6A0', 'Hola'], concepto: ['#12A6A0', 'Concepto'], caso: ['#e8644a', 'Caso real'], profes: ['#3478C5', 'Para profes'], test: ['#e8644a', 'Test'] };

const CSS = `
@font-face { font-family: Manrope; src: url(${FONTS}manrope.woff2); font-weight: 200 800; }
@font-face { font-family: Inter; src: url(${FONTS}inter.woff2); font-weight: 100 900; }
@font-face { font-family: Comic; src: url(${FONTS}comic-a.woff2); font-weight: 400; }
@font-face { font-family: Comic; src: url(${FONTS}comic-b.woff2); font-weight: 700; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 1080px; height: 100%; }
body { font-family: Inter, sans-serif; color: #1d2733; background: #fff; position: relative; overflow: hidden; --c: #12A6A0; }
.s { position: absolute; inset: 0; padding: 96px 88px 150px; display: flex; flex-direction: column; }
h1, h2, .fm { font-family: Manrope, sans-serif; color: #10243D; letter-spacing: -0.02em; }
b { color: var(--c); font-weight: 700; }
.peu { position: absolute; left: 88px; right: 88px; bottom: 52px; height: 60px; display: flex; align-items: center; justify-content: space-between; }
.peu img { height: 72px; }
.peu .pag { font: 600 26px Manrope; color: #5b6878; display: flex; gap: 10px; align-items: center; }
.peu .pag i { width: 14px; height: 14px; border-radius: 50%; background: #dde4ec; }
.peu .pag i.on { background: var(--c); width: 36px; border-radius: 7px; }
.etq { align-self: flex-start; font: 800 30px Manrope; text-transform: uppercase; letter-spacing: .08em; color: #fff; background: var(--c); padding: 12px 26px; border-radius: 999px; }
.pers { position: absolute; right: 60px; bottom: 140px; mix-blend-mode: multiply; }
.pers.flux { position: static; align-self: flex-end; margin: auto -20px 0 0; flex: 0 1 var(--h); min-height: 150px; width: auto; height: auto; max-width: 520px; object-fit: contain; }
/* Portada */
.portada { background: linear-gradient(160deg, #fff 0%, #fff 45%, color-mix(in srgb, var(--c) 14%, #fff) 100%); }
.portada::before { content: ''; position: absolute; width: 900px; height: 900px; border-radius: 50%; right: -330px; bottom: -260px; background: color-mix(in srgb, var(--c) 16%, #fff); }
.portada h1 { position: relative; font-size: 92px; line-height: 1.02; font-weight: 800; margin-top: 46px; max-width: 900px; }
.portada .sub { position: relative; font-size: 40px; line-height: 1.3; color: #5b6878; margin-top: 30px; max-width: 760px; }
.portada .pers { z-index: 1; }
/* Text */
.titol { font-size: 80px; line-height: 1.06; font-weight: 800; margin: 10px 0 46px; max-width: 900px; }
.titol::after { content: ''; display: block; width: 110px; height: 12px; border-radius: 6px; background: var(--c); margin-top: 26px; }
.p { font-size: 50px; line-height: 1.38; margin-bottom: 36px; max-width: 900px; }

ul { list-style: none; }
li { font-size: 48px; line-height: 1.32; margin-bottom: 38px; padding-left: 62px; position: relative; max-width: 900px; }
li::before { content: ''; position: absolute; left: 0; top: 16px; width: 32px; height: 32px; border-radius: 9px; background: var(--c); opacity: .9; }
/* Fórmules */
.form { background: #F2F5F8; border-radius: 28px; padding: 40px 44px; margin-bottom: 30px; border-left: 14px solid var(--c); }
.form span { display: block; font: 700 30px Manrope; color: #5b6878; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 12px; }
.form .fm { font-size: 62px; font-weight: 700; line-height: 1.2; }
.nota { font-size: 42px; line-height: 1.4; color: #5b6878; margin-top: 18px; max-width: 640px; }
/* Diàleg */
.dial { display: flex; flex-direction: column; gap: 80px; margin: auto 0; }
.lin { display: flex; gap: 34px; align-items: flex-start; }
.lin.nexo { flex-direction: row-reverse; }
.cara { width: 260px; height: 260px; flex: none; border-radius: 50%; border: 8px solid var(--q); background: #fff; overflow: hidden; display: grid; place-items: center; }
.cara img { width: 100%; }
.bafarada { position: relative; flex: 1; font: 700 54px/1.3 Comic, sans-serif; color: #10243D; background: #fff; border: 6px solid var(--q); border-radius: 40px; padding: 36px 44px; box-shadow: 10px 10px 0 color-mix(in srgb, var(--q) 25%, #fff); }
.bafarada em { display: block; font: 800 28px Manrope; font-style: normal; text-transform: uppercase; letter-spacing: .1em; color: var(--q); margin-bottom: 8px; }
/* Test */
.preg { font-size: 60px; line-height: 1.2; font-weight: 800; margin: 40px 0 44px; max-width: 900px; }
.ops { display: grid; gap: 24px; max-width: 600px; }
.op { display: flex; align-items: center; gap: 28px; font: 700 46px Manrope; color: #10243D; background: #F2F5F8; border-radius: 26px; padding: 26px 32px; }
.op i { font-style: normal; width: 74px; height: 74px; flex: none; border-radius: 50%; background: var(--c); color: #fff; display: grid; place-items: center; font-size: 40px; }
.llisca { max-width: 560px; margin-top: 36px; font: 700 34px Manrope; color: var(--c); }
.ok { width: 120px; height: 120px; border-radius: 50%; background: #2e9d6a; color: #fff; display: grid; place-items: center; font: 800 76px Manrope; margin-bottom: 26px; }
/* Captura d'un simulador */
.shot { width: 100%; border-radius: 28px; box-shadow: 0 24px 60px rgba(16,36,61,.25); border: 8px solid #fff; outline: 4px solid var(--c); margin: 10px 0 40px; }
/* Història (1080×1920): Instagram tapa uns 250 px a dalt i a baix */
.historia .s { padding: 250px 88px 420px; justify-content: center; }
.historia .shot { margin-bottom: 50px; }
.historia.portada .s { justify-content: flex-start; padding-top: 330px; }
.historia .peu { bottom: 290px; }
.historia .pers { bottom: 400px; }
.historia.cta .targeta { position: static; margin-top: 70px; }
/* Crida final */
.cta { background: #10243D; color: #fff; }
.cta h2 { color: #fff; font-size: 84px; line-height: 1.05; font-weight: 800; margin-top: 30px; max-width: 900px; }
.cta .p { color: rgba(255,255,255,.8); margin-top: 30px; }
.cta .boto { align-self: flex-start; margin-top: 30px; font: 800 44px Manrope; background: var(--c); color: #fff; padding: 26px 46px; border-radius: 999px; }
.cta .targeta { position: absolute; right: 88px; bottom: 180px; width: 640px; height: 480px; background: #fff; border-radius: 40px; display: grid; place-items: center; }
.cta .targeta img { width: 540px; }
.cta .peu .pag { color: rgba(255,255,255,.7); }
.cta .peu .pag i { background: rgba(255,255,255,.25); }
.cta .peu .marca { font: 800 34px Manrope; color: #fff; }
.cta .peu .marca span { color: #e8644a; }
.cta .peu .marca em { font-style: normal; color: #2fd0c8; }
`;

function slideHTML(post, sl, i, n) {
  const [c] = TEMA[post.tema] || TEMA.concepto;
  const pag = `<div class="pag">${n > 1 ? Array.from({ length: n }, (_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('') : ''}</div>`;
  const peu = sl.tipo === 'cta'
    ? `<div class="peu"><div class="marca"><span>ECO</span>y<em>NEXO</em></div>${pag}</div>`
    : `<div class="peu"><img src="${LOGO}">${pag}</div>`;
  const pers = (nom, h) => nom ? `<img class="pers" src="${PERS}${nom}.webp" style="height:${h}px">` : '';
  const persF = (nom, h) => nom ? `<img class="pers flux" src="${PERS}${nom}.webp" style="--h:${h}px">` : '';
  let cos = '', cls = '';
  if (sl.tipo === 'portada') {
    cls = 'portada';
    cos = `<span class="etq">${esc(sl.etiqueta)}</span><h1>${md(sl.titulo)}</h1>${sl.sub ? `<p class="sub">${md(sl.sub)}</p>` : ''}${pers(sl.imagen, sl.imagen === 'eco-y-nexo' ? 470 : 560)}`;
  } else if (sl.tipo === 'texto' || sl.tipo === 'respuesta') {
    cls = sl.personaje ? 'amb-pers' : '';
    cos = (sl.tipo === 'respuesta' ? '<div class="ok">✓</div>' : '') + `<h2 class="titol">${md(sl.titulo)}</h2>`
      + (sl.parrafos || []).map(p => `<p class="p">${md(p)}</p>`).join('')
      + (sl.puntos ? `<ul>${sl.puntos.map(p => `<li>${md(p)}</li>`).join('')}</ul>` : '') + persF(sl.personaje, 400);
  } else if (sl.tipo === 'formula') {
    cos = `<h2 class="titol">${md(sl.titulo)}</h2>${sl.formulas.map(([e, f]) => `<div class="form"><span>${esc(e)}</span><div class="fm">${md(f)}</div></div>`).join('')}${sl.nota ? `<p class="nota">${md(sl.nota)}</p>` : ''}${persF(sl.personaje || 'nexo-explicando', 360)}`;
  } else if (sl.tipo === 'dialogo') {
    cos = `<div class="dial">${sl.lineas.map(l => { const q = l.quien === 'eco' ? '#e8644a' : '#12A6A0';
      return `<div class="lin ${l.quien}" style="--q:${q}"><div class="cara"><img src="${PERS}cara-${l.quien}-${l.gesto}.webp"></div><div class="bafarada"><em>${l.quien.toUpperCase()}</em>${md(l.texto)}</div></div>`; }).join('')}</div>`;
  } else if (sl.tipo === 'quiz') {
    cos = `<span class="etq">${esc(sl.etiqueta)}</span><h1 class="fm preg">${md(sl.pregunta)}</h1><div class="ops">${sl.opciones.map((o, k) => `<div class="op"><i>${'ABCD'[k]}</i>${md(o)}</div>`).join('')}</div><p class="llisca">${esc(sl.llisca || 'Piénsalo y desliza para ver la respuesta →')}</p>${pers(sl.imagen, 400)}`;
  } else if (sl.tipo === 'captura') { // captura d'un simulador (public/media/...)
    cos = (sl.etiqueta ? `<span class="etq">${esc(sl.etiqueta)}</span>` : '') + `<h2 class="titol">${md(sl.titulo)}</h2><img class="shot" src="${fileURL(path.join(ARREL, 'public', sl.imagen))}">`
      + (sl.texto ? `<p class="p">${md(sl.texto)}</p>` : '');
  } else if (sl.tipo === 'cta') {
    cls = 'cta';
    cos = `<h2>${md(sl.titulo)}</h2><p class="p">${md(sl.texto)}</p><span class="boto">${esc(sl.boton)}</span><div class="targeta"><img src="${PERS}eco-y-nexo.webp"></div>`;
  } else throw new Error('Tipus de diapositiva desconegut: ' + sl.tipo);
  const H = post.historia ? 1920 : 1350;
  return `<!doctype html><html style="height:${H}px"><head><meta charset="utf-8"><style>${CSS}</style></head><body style="--c:${c}" class="${cls}${post.historia ? ' historia' : ''}"><div class="s">${cos}</div>${peu}</body></html>`;
}

const TMP = path.join(os.tmpdir(), 'ecoynexo-ig.html');
const nomes = process.argv[2];
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
for (const post of CAL.posts) {
  if (nomes && post.id !== nomes) continue;
  if (post.reel) continue; // els reels es generen amb scripts/instagram/reel.mjs
  if (post.slides.length > 10) throw new Error(post.id + ': com a molt 10 imatges per carrusel');
  if (post.historia && post.slides.length !== 1) throw new Error(post.id + ': una història és una sola imatge');
  await pg.setViewportSize({ width: 1080, height: post.historia ? 1920 : 1350 });
  const dir = path.join(ARREL, 'public/ig', post.id); fs.mkdirSync(dir, { recursive: true });
  for (let i = 0; i < post.slides.length; i++) {
    fs.writeFileSync(TMP, slideHTML(post, post.slides[i], i, post.slides.length)); await pg.goto(fileURL(TMP), { waitUntil: 'load' });
    await pg.evaluate(() => document.fonts.ready);
    // Avís si el text no hi cap (es menja el peu)
    const desborda = await pg.evaluate(() => { const s = document.querySelector('.s'), peu = document.querySelector('.peu'); const ult = [...s.querySelectorAll('h1,h2,p,li,.form,.op,.dial,.boto')].pop(); return ult ? ult.getBoundingClientRect().bottom > peu.getBoundingClientRect().top - 10 : false; });
    if (desborda) console.warn('⚠ ' + post.id + ' diapositiva ' + (i + 1) + ': el text arriba al peu');
    const tapa = await pg.evaluate(() => { const p = document.querySelector('.pers'); if (!p) return false; const r = p.getBoundingClientRect(), m = 30; return [...document.querySelectorAll('h1,h2,p,li,.op,.boto')].some(t => { const q = t.getBoundingClientRect(); const rng = document.createRange(); rng.selectNodeContents(t); return [...rng.getClientRects()].some(c => c.right > r.left + m && c.left < r.right - m && c.bottom > r.top + m && c.top < r.bottom - m); }); });
    if (tapa) console.warn('⚠ ' + post.id + ' diapositiva ' + (i + 1) + ': el personatge tapa text');
    await pg.screenshot({ path: path.join(dir, (i + 1) + '.jpg'), type: 'jpeg', quality: 88 });
  }
  console.log('✔ ' + post.id + ' (' + post.slides.length + ' imatges)');
}
await b.close();
