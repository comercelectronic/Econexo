// Extreu els fragments de text en castellà d'Aparadors BCN que encara no tenen traducció a i18n.js / ca-joc.json.
// Ús: node scripts/aparadors/i18n/extreu.js  → escriu pendents.json (llista de textos en castellà)
const fs = require('fs'), path = require('path');
const G = path.join(__dirname, '..', '..', '..', 'public', 'jocs', 'aparadors-bcn');
const src = fs.readFileSync(path.join(G, 'index.html'), 'utf8').split('\n').filter(l => l.length < 150000 && !l.startsWith('const A={')).join('\n');
const i18 = fs.readFileSync(path.join(G, 'i18n.js'), 'utf8');
let extra = {}; try { extra = JSON.parse(fs.readFileSync(path.join(G, 'ca-joc.json'), 'utf8')) } catch {}
const have = new Set(Object.keys(extra));
for (const m of i18.matchAll(/\['((?:[^'\\]|\\.)*)',/g)) have.add(m[1].replace(/\\'/g, "'"));
const out = new Set();
for (const m of src.matchAll(/'((?:[^'\\\n]|\\.)*)'/g)) {
  const s = m[1].replace(/\\'/g, "'");
  for (const p of s.split(/<[^>]*>|^[^<]*>|<[^>]*$/)) {
    const t = p.trim();
    if (t.length < 2 || !/[a-záéíóúñ]{2,}/i.test(t)) continue;
    if (/^[a-z]+$/.test(t) && t.length < 4) continue;
    if (/[{};=]|=>|\(\)|\.(js|png|webp|glb)|^#|\bpx\b|^(class|id|data|style|src|href|type|aria)[- =]|\$\{|^\w+\.\w+$/.test(t)) continue;
    if (have.has(t)) continue;
    out.add(t);
  }
}
const arr = [...out];
fs.writeFileSync(path.join(__dirname, 'pendents.json'), JSON.stringify(arr, null, 1));
console.log(arr.length + ' textos, ' + arr.reduce((a, s) => a + s.length, 0) + ' caràcters');
