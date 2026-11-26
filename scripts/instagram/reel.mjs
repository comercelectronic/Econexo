// Genera els reels d'Instagram (vídeo MP4 1080×1920) dels posts de instagram/calendario.json que tenen «reel».
// Ús: node scripts/instagram/reel.mjs [id-del-post]
// Per a cada reel: juga el simulador amb el guió de scripts/instagram/guions/<guio>.json (Playwright, captura de pantalla
// a 1080 px d'amplada), retalla les escenes, hi posa el text de dalt, la marca i la targeta final, i desa
//   public/ig/<id>/reel.mp4   (el vídeo que publica la funció programada)
//   public/ig/<id>/portada.jpg (la portada del reel)
// Necessita Playwright i ffmpeg (només per generar-los, no a Netlify).
//
// Guió: { "url": "/jocs/palet/", "passos": [...] }. Passos: "wait:ms", "click:text", "css:selector", "down:tecla", "up:tecla",
// "key:tecla", "eval:codi", "scroll:px" i "mark:nom" (marca de temps per triar les escenes).
// Al calendari, «reel»: { "guio", "ganxo" (text dels primers segons), "escenes": [{ "de": marca, "a": marca, "text", "vel" }],
// "final": { "titol", "boto" } }.
import { createRequire } from 'module';
import fs from 'fs';
import os from 'os';
import path from 'path';
import http from 'http';
import { execFileSync } from 'child_process';
import { fileURLToPath, pathToFileURL } from 'url';
const fileURL = (f) => pathToFileURL(f).href;   // file:///… també a Windows

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ARREL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CAL = JSON.parse(fs.readFileSync(path.join(ARREL, 'instagram/calendario.json'), 'utf8'));
const FONTS = fileURL(path.join(ARREL, 'instagram/fonts')) + '/';
const LOGO = fileURL(path.join(ARREL, 'public/logo.png'));
const PERS = fileURL(path.join(ARREL, 'public/media/personajes')) + '/';
const W = 1080, H = 1920, VX = 24, VY = 600, VW = 1032, VH = 774, GANXO = 2.6, FINAL = 3.2;
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const md = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
const ff = (args) => execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...args], { stdio: ['ignore', 'inherit', 'inherit'] });

// Servidor local de public/ (els jocs es graven des d'aquí; les funcions de Netlify se simulen)
function servidor() {
  const tipus = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json', '.mp3': 'audio/mpeg' };
  const s = http.createServer((req, res) => {
    let f = path.join(ARREL, 'public', decodeURIComponent(req.url.split('?')[0]));
    if (!f.startsWith(path.join(ARREL, 'public'))) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': tipus[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => s.listen(0, '127.0.0.1', () => r(s)));
}

// Juga el guió i el grava (1080×810) amb les marques de temps
async function grava(b, base, guio, sortida) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'reel-'));
  const ctx = await b.newContext({ viewport: { width: 960, height: 720 }, deviceScaleFactor: 1.125, locale: 'es-ES' });
  const p = await ctx.newPage(); const marques = {}; const frames = []; let t0 = 0;
  p.on('pageerror', e => console.warn('  error del joc:', e.message));
  // Compte de demostració per als jocs amb inici de sessió; la resta de funcions responen buit
  await p.route('**/.netlify/functions/**', r => { const u = r.request().url();
    const body = u.includes('joc-compte') ? { token: 'demo', at: 1, compte: { usuari: 'laia.puig', nom: 'Laia Puig', classe: 'DEMO', id: 'u-demo' } } : {};
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) }); });
  await p.route(/googletagmanager|googlesyndication|google-analytics|analytics\.js/, r => r.fulfill({ status: 200, body: '' }));
  await p.addInitScript(() => { try { localStorage.clear(); } catch (e) { }
    window.__tap = (x, y) => { const d = document.createElement('div'); d.style.cssText = `position:fixed;left:${x - 26}px;top:${y - 26}px;width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.5);border:4px solid rgba(255,196,0,.95);z-index:2147483647;pointer-events:none;transition:transform .5s ease-out,opacity .5s ease-out;transform:scale(.4)`; document.documentElement.appendChild(d); requestAnimationFrame(() => { d.style.transform = 'scale(1.35)'; d.style.opacity = '0'; }); setTimeout(() => d.remove(), 650); }; });
  const cdp = await ctx.newCDPSession(p);
  cdp.on('Page.screencastFrame', (f) => { fs.writeFileSync(path.join(dir, 'f' + String(frames.length).padStart(5, '0') + '.jpg'), Buffer.from(f.data, 'base64')); frames.push(f.metadata.timestamp); cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => { }); });
  await p.goto(base + guio.url);
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 1080, maxHeight: 810, everyNthFrame: 1 }); t0 = Date.now() / 1000;
  const toca = async (loc) => { const bb = await loc.boundingBox({ timeout: 12000 }).catch(() => null);
    if (bb) { const x = bb.x + bb.width / 2, y = bb.y + bb.height / 2; await p.mouse.move(x, y, { steps: 8 }); await p.evaluate(([a, c]) => window.__tap(a, c), [x, y]); await p.waitForTimeout(250); }
    if (bb) await loc.click({ timeout: 12000 }).catch(() => console.warn('  no s\'ha pogut clicar', String(loc))); else console.warn('  no hi és:', String(loc)); };
  for (const s of guio.passos) { const i = s.indexOf(':'), k = s.slice(0, i), a = s.slice(i + 1);
    if (k === 'mark') marques[a] = Date.now() / 1000 - t0;
    else if (k === 'click') await toca(p.getByText(a, { exact: false }).locator('visible=true').first());
    else if (k === 'css') await toca(p.locator(a).locator('visible=true').first());
    else if (k === 'wait') await p.waitForTimeout(+a);
    else if (k === 'down') await p.keyboard.down(a); else if (k === 'up') await p.keyboard.up(a); else if (k === 'key') await p.keyboard.press(a);
    else if (k === 'eval') { const r = await p.evaluate(a).catch(e => console.warn('  eval:', e.message)); if (r !== undefined) console.log('  eval →', JSON.stringify(r)); }
    else if (k === 'scroll') await p.mouse.wheel(0, +a);
    else if (k === 'drag') { // "drag:selector|x,y": arrossega l'element fins al punt (x, y) de la pantalla de 960×720
      const [sel, xy] = a.split('|'), [x, y] = xy.split(',').map(Number);
      const bb = await p.locator(sel).locator('visible=true').first().boundingBox({ timeout: 12000 }).catch(() => null);
      if (!bb) { console.warn('  no hi és:', sel); continue; }
      const x0 = bb.x + bb.width / 2, y0 = bb.y + bb.height / 2;
      await p.mouse.move(x0, y0, { steps: 6 }); await p.evaluate(([u, v]) => window.__tap(u, v), [x0, y0]); await p.mouse.down();
      await p.mouse.move(x, y, { steps: 24 }); await p.waitForTimeout(120); await p.mouse.up();
    }
  }
  marques.fi = Date.now() / 1000 - t0;
  await cdp.send('Page.stopScreencast'); await ctx.close();
  // Vídeo a 30 fps respectant el temps real de cada fotograma
  const fi = frames[frames.length - 1] + 0.4; let llista = '';
  frames.forEach((t, i) => { llista += `file 'f${String(i).padStart(5, '0')}.jpg'\nduration ${Math.max(0.001, (i + 1 < frames.length ? frames[i + 1] : fi) - t).toFixed(4)}\n`; });
  llista += `file 'f${String(frames.length - 1).padStart(5, '0')}.jpg'\n`; fs.writeFileSync(path.join(dir, 'llista.txt'), llista);
  ff(['-f', 'concat', '-safe', '0', '-i', path.join(dir, 'llista.txt'), '-vf', 'scale=1080:810,fps=30,format=yuv420p', '-c:v', 'libx264', '-crf', '16', '-preset', 'fast', sortida]);
  const desf = frames[0] - t0; Object.keys(marques).forEach(k => { marques[k] = +(marques[k] - desf).toFixed(2); });
  fs.rmSync(dir, { recursive: true, force: true });
  return marques;
}

const CSS = `
@font-face { font-family: Manrope; src: url(${FONTS}manrope.woff2); font-weight: 200 800; }
@font-face { font-family: Inter; src: url(${FONTS}inter.woff2); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: ${W}px; height: ${H}px; background: transparent; }
body { font-family: Inter, sans-serif; color: #10243D; position: relative; overflow: hidden; --c: #3478C5; }
b { color: var(--c); }
.fons { position: absolute; inset: 0; background: linear-gradient(180deg, #ffffff 0%, #f4f8fc 60%, #e6f0fa 100%); }
.fons::before { content: ''; position: absolute; width: 760px; height: 760px; border-radius: 50%; right: -300px; top: -360px; background: #e3eefa; }
.ombra { position: absolute; left: ${VX}px; top: ${VY}px; width: ${VW}px; height: ${VH}px; border-radius: 34px; box-shadow: 0 30px 70px rgba(16,36,61,.28); background: #10243D; }
.peu { position: absolute; left: 70px; right: 70px; top: 1420px; display: flex; align-items: center; gap: 26px; }
.peu img.logo { height: 66px; }
.peu { flex-direction: column; align-items: flex-start; gap: 14px; }
.peu span { font: 700 34px Manrope; color: #5b6878; }
.pers { position: absolute; right: 50px; top: 1395px; height: 250px; mix-blend-mode: multiply; }
.etq { position: absolute; left: 70px; top: 150px; font: 800 30px Manrope; text-transform: uppercase; letter-spacing: .08em; color: #fff; background: var(--c); padding: 12px 26px; border-radius: 999px; }
.txt { position: absolute; left: 70px; right: 70px; top: 232px; height: 350px; display: flex; align-items: center; }
.txt h1 { font: 800 70px/1.08 Manrope; letter-spacing: -0.02em; }
.txt h1.gran { font-size: 82px; }
.final { position: absolute; inset: 0; background: #10243D; color: #fff; display: flex; flex-direction: column; justify-content: center; padding: 0 80px 240px; }
.final h2 { font: 800 88px/1.05 Manrope; letter-spacing: -0.02em; color: #fff; margin: 34px 0 40px; }
.final .boto { align-self: flex-start; font: 800 46px Manrope; background: #12A6A0; color: #fff; padding: 26px 40px; border-radius: 22px; }
.final p { font-size: 40px; line-height: 1.4; color: rgba(255,255,255,.82); margin-top: 40px; max-width: 880px; }
.final .cercle { position: absolute; right: 70px; bottom: 330px; width: 400px; height: 400px; border-radius: 50%; background: #fff; display: grid; place-items: center; overflow: hidden; }
.final .cercle img { width: 88%; }
.final .etq { position: static; align-self: flex-start; background: #12A6A0; }
.marc { position: absolute; inset: 0; }
`;
const pagina = (cos) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${cos}</body></html>`;
async function png(b, html, fitxer, transparent = true, tipus = 'png') {
  // Des d'un fitxer local perquè carreguin les fonts, el logotip i els personatges (file://)
  const tmp = fitxer.replace(/\.\w+$/, '.html'); fs.writeFileSync(tmp, html);
  const pg = await b.newPage({ viewport: { width: W, height: H } }); await pg.goto(fileURL(tmp), { waitUntil: 'load' }); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(150);
  await pg.screenshot({ path: fitxer, omitBackground: transparent, type: tipus, ...(tipus === 'jpeg' ? { quality: 90 } : {}) }); await pg.close();
}
// Marc de cantonades arrodonides que tapa les puntes del vídeo
const marcSvg = `<svg class="marc" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><defs><mask id="m"><rect width="${W}" height="${H}" fill="#fff"/><rect x="${VX}" y="${VY}" width="${VW}" height="${VH}" rx="34" fill="#000"/></mask></defs>
  <rect x="${VX - 2}" y="${VY - 2}" width="${VW + 4}" height="${VH + 4}" fill="#f4f8fc" mask="url(#m)"/></svg>`;

async function fesReel(b, base, post) {
  const R = post.reel, guio = JSON.parse(fs.readFileSync(path.join(ARREL, 'scripts/instagram/guions', R.guio + '.json'), 'utf8'));
  const dir = path.join(ARREL, 'public/ig', post.id); fs.mkdirSync(dir, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'reelc-'));
  console.log(post.id, '· gravant', guio.url);
  const brut = path.join(tmp, 'brut.mp4'), m = await grava(b, base, guio, brut);
  console.log('  marques', JSON.stringify(m));
  // Escenes retallades (amb velocitat opcional) i durades
  const sc = R.escenes.map((e) => { const de = typeof e.de === 'number' ? e.de : m[e.de], a = typeof e.a === 'number' ? e.a : (m[e.a] != null ? m[e.a] : m.fi);
    if (de == null || a == null || a <= de) throw new Error(`Escena mal definida a ${post.id}: ${e.de} → ${e.a}`); return { ...e, ini: de, dur: (a - de) / (e.vel || 1) }; });
  // Capes: fons, marc, textos i targeta final
  const pers = R.personatge || 'eco-senalando';
  await png(b, pagina(`<div class="fons"></div><div class="ombra"></div><div class="peu"><img class="logo" src="${LOGO}"><span>Gratis · en el navegador</span></div><img class="pers" src="${PERS}${pers}.webp">`), path.join(tmp, 'fons.png'), false);
  await png(b, pagina(marcSvg), path.join(tmp, 'marc.png'));
  const etq = R.etiqueta || 'Para profes de FP';
  const textos = [{ t: R.ganxo, gran: true }, ...sc.map(e => ({ t: e.text }))];
  for (let i = 0; i < textos.length; i++) await png(b, pagina(`<div class="etq">${esc(etq)}</div><div class="txt"><h1 class="${textos[i].gran ? 'gran' : ''}">${md(textos[i].t)}</h1></div>`), path.join(tmp, `t${i}.png`));
  await png(b, pagina(`<div class="final"><div class="etq">${esc(R.final.etiqueta || 'Para tu clase')}</div><h2>${md(R.final.titol)}</h2><div class="boto">${esc(R.final.boto)}</div>${R.final.text ? `<p>${md(R.final.text)}</p>` : ''}<div class="cercle"><img src="${PERS}${R.final.personatge || 'eco-y-nexo'}.webp"></div></div>`), path.join(tmp, 'final.png'), false);
  // Temps: el ganxo ocupa els primers segons de la primera escena
  const total = sc.reduce((s, e) => s + e.dur, 0);
  let t = 0; const finestres = [[0, GANXO]];
  sc.forEach((e, i) => { finestres.push([i === 0 ? GANXO : t, t + e.dur]); t += e.dur; });
  // Filtre: escenes → vídeo de joc; fons + joc + marc + textos; després la targeta final
  const parts = sc.map((e, i) => `[0:v]trim=start=${e.ini.toFixed(2)}:duration=${(e.dur * (e.vel || 1)).toFixed(2)},setpts=(PTS-STARTPTS)/${e.vel || 1},fps=30,scale=${VW}:${VH}[e${i}]`).join(';');
  let f = `${parts};${sc.map((_, i) => `[e${i}]`).join('')}concat=n=${sc.length}:v=1:a=0[joc];[1:v]loop=-1:1:0,trim=duration=${total.toFixed(2)},setpts=PTS-STARTPTS,fps=30[fons];[fons][joc]overlay=${VX}:${VY}[v0];[v0][2:v]overlay=0:0[v1]`;
  let ult = 'v1';
  textos.forEach((_, i) => { const [a, z] = finestres[i]; if (z - a < 0.2) return; f += `;[${ult}][${3 + i}:v]overlay=0:0:enable='between(t,${a.toFixed(2)},${(z - 0.01).toFixed(2)})'[x${i}]`; ult = `x${i}`; });
  const ni = 3 + textos.length;
  f += `;[${ni}:v]loop=-1:1:0,trim=duration=${FINAL},setpts=PTS-STARTPTS,fps=30,format=yuv420p,fade=t=in:st=0:d=0.35[fi];[${ult}]format=yuv420p[vv];[vv][fi]concat=n=2:v=1:a=0[out]`;
  const ent = ['-i', brut, '-i', path.join(tmp, 'fons.png'), '-i', path.join(tmp, 'marc.png'), ...textos.flatMap((_, i) => ['-i', path.join(tmp, `t${i}.png`)]), '-i', path.join(tmp, 'final.png')];
  const durada = total + FINAL;
  ff([...ent, '-f', 'lavfi', '-t', durada.toFixed(2), '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000', '-filter_complex', f, '-map', '[out]', '-map', `${ni + 1}:a`,
    '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-r', '30', '-crf', '21', '-preset', 'slow', '-maxrate', '8M', '-bufsize', '16M', '-c:a', 'aac', '-b:a', '128k', '-ar', '48000', '-shortest', '-movflags', '+faststart', path.join(dir, 'reel.mp4')]);
  // Portada: el ganxo amb un fotograma del joc
  ff(['-ss', String(Math.min(GANXO - 0.3, durada / 3)), '-i', path.join(dir, 'reel.mp4'), '-frames:v', '1', '-q:v', '3', path.join(dir, 'portada.jpg')]);
  fs.rmSync(tmp, { recursive: true, force: true });
  const mida = fs.statSync(path.join(dir, 'reel.mp4')).size;
  console.log(`  public/ig/${post.id}/reel.mp4 · ${durada.toFixed(1)} s · ${(mida / 1048576).toFixed(1)} MB`);
  if (durada < 5 || durada > 90) console.warn('  ⚠ Un reel ha de durar entre 5 i 90 segons.');
}

const nomes = process.argv[2];
const reels = CAL.posts.filter(p => p.reel && (!nomes || p.id === nomes));
if (!reels.length) { console.log('No hi ha cap reel' + (nomes ? ' amb aquest id' : '') + ' al calendari.'); process.exit(0); }
const srv = await servidor(); const base = 'http://127.0.0.1:' + srv.address().port;
// A Windows, el WebGL per programari (SwiftShader) va a 1 fps i fa inservibles els jocs 3D: es fa servir la GPU
const b = await chromium.launch({ args: process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [] });
try { for (const post of reels) await fesReel(b, base, post); } finally { await b.close(); srv.close(); }
