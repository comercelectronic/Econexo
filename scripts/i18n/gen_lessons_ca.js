// Genera content-ca/modulos/comercio-electronico/*.md (lliçons en català) a partir de les dades del joc Agència Digital
// (js/data-*.js, on el text original és català) i de les tires traduïdes (scripts/i18n/tiras_ca.py → tiras_ca.json).
// Ús: node scripts/i18n/gen_lessons_ca.js <carpeta-del-joc>
const fs = require('fs'), path = require('path');
const game = path.resolve(process.argv[2] || '../agenciadigital') + '/js/';
globalThis.window = globalThis; globalThis.T = (s, a) => (a ? String(s).replace(/\{(\d+)\}/g, (m, i) => a[i]) : s);
globalThis.ART = new Proxy({}, { get: () => () => '' });
for (const f of ['data-lessons', 'data-story1', 'data-story2', 'data-story3', 'data-temari']) { try { require(game + f + '.js'); } catch (e) { } }
const G = globalThis.GD;
const root = path.join(__dirname, '..', '..');
const esDir = path.join(root, 'content/modulos/comercio-electronico/'), caDir = path.join(root, 'content-ca/modulos/comercio-electronico/');
const tiras = JSON.parse(fs.readFileSync(path.join(__dirname, 'tiras_ca.json'), 'utf8'));
fs.mkdirSync(caDir, { recursive: true });
const q = (s) => JSON.stringify(s);
let n = 0;
for (const f of fs.readdirSync(esDir).filter((x) => x.endsWith('.md'))) {
  const src = fs.readFileSync(esDir + f, 'utf8'), fm = src.split('---')[1];
  const get = (k) => (fm.match(new RegExp('^' + k + ': (.*)$', 'm')) || [])[1];
  const id = get('id'), L = G.lessons[id];
  if (!L) throw new Error('Falta la lliçó ' + id);
  const esTira = fm.match(/^tira:\n((?:  - .*\n)+)/m)[1].trim().split('\n').map((l) => JSON.parse(l.trim().slice(2)));
  const cat = tiras[id];
  if (!cat || cat.length !== esTira.length || cat.some((p, i) => p.length !== esTira[i].length)) throw new Error('Tira no coincideix: ' + id);
  const tira = esTira.map((p, i) => p.map((b, k) => ({ quien: b.quien, gesto: b.gesto, texto: cat[i][k] })));
  const cap = JSON.parse(get('capitulo') || 'null');
  const capTitle = cap && G.chapters[cap] ? G.chapters[cap].title : '';
  const out = ['---',
    `id: ${id}`, `titulo: ${q(L.title)}`, `objetivo: ${q(L.goal)}`, `orden: ${get('orden')}`, `codigos: ${get('codigos')}`, `area: ${q(G.areas[L.area])}`,
    ...(cap ? [`capitulo: ${get('capitulo')}`, `capitulo_titulo: ${q(capTitle)}`] : []),
    `estado: ${get('estado')}`, 'tira:', ...tira.map((p) => '  - ' + JSON.stringify(p)),
    `ejemplo: ${q(L.example)}`, `errores: ${JSON.stringify(L.errors)}`, 'test:',
    ...L.quiz.map((x) => '  - ' + JSON.stringify({ p: x.q, o: x.o, c: x.c, por: x.why })), '---', L.body.join('\n\n'), ''].join('\n');
  fs.writeFileSync(caDir + f, out); n++;
  // comprovació d'estructura respecte al castellà
  const esTest = (fm.match(/^  - \{"p"/gm) || []).length, esBody = src.split('---').slice(2).join('---').trim().split(/\n\n+/).length;
  if (esTest !== L.quiz.length || esBody !== L.body.length) console.warn('AVÍS estructura diferent', id, { esTest, caTest: L.quiz.length, esBody, caBody: L.body.length });
}
console.log(n, 'lliçons generades');
