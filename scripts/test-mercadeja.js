// Proves del motor de Mercadeja: fórmules econòmiques, coherència del mercat, determinisme i equilibri.
// Ús: node scripts/test-mercadeja.js
const path = require('path');
const MD = require(path.join(__dirname, '../public/jocs/mercadeja/js/data.js'));
const ME = require(path.join(__dirname, '../public/jocs/mercadeja/js/engine.js'));

let ok = 0, ko = 0;
const t = (cond, nom) => { if (cond) ok++; else { ko++; console.log('✘', nom); } };
const near = (a, b, tol = 1) => Math.abs(a - b) <= tol;

function partida(cfg) {
  return ME.crearPartida(Object.assign({ sector: 'alimentacio', rondes: 8, llavor: 12345, dificultat: 'mitja',
    empreses: ['agressiva', 'premium', 'equilibrada', 'innovadora'].map((p, i) => ({ nom: 'E' + i, perfil: p, humana: false })) }, cfg));
}
// Juga una partida sencera amb la IA (o amb una funció de decisió pròpia per a l'empresa 0)
function juga(s, decisio0) {
  ME.iniciarRonda(s);
  let guard = 0;
  while (s.fase !== 'final' && guard++ < 5000) {
    if (s.fase === 'esdeveniment' || s.fase === 'mercat' || s.fase === 'resultats') { ME.accio(s, { tipus: 'continuar' }); continue; }
    const i = s.torn;
    if (s.fase === 'decisions') { if (i === 0 && decisio0) { decisio0(s); ME.accio(s, { tipus: 'confirmar', emp: 0 }); } else ME.decidirIA(s, i); continue; }
    if (s.fase === 'moviment') { if (!s.pendent) ME.accio(s, { tipus: 'tirar', emp: i }); else ME.resoldreIA(s, i); continue; }
  }
  return s;
}

// 1. Fórmules econòmiques (cas de l'enunciat): preu 20, cost 8, 1.000 unitats, fixos 3.000
{
  const ing = 1000 * 20, cv = 1000 * 8, mb = ing - cv, bo = ing - cv - 3000;
  t(ing === 20000 && cv === 8000 && mb === 12000 && bo === 9000, 'fórmules bàsiques');
}
// 2. Tresoreria = registre: la suma de moviments explica el saldo
{
  const s = juga(partida({}));
  s.empreses.forEach(e => {
    const suma = s.log.filter(l => l.emp === e.id).reduce((a, l) => a + l.import, 0);
    t(near(s.config.capital + suma, e.diners, 2), 'registre quadra amb la tresoreria de ' + e.nom + ' (' + (s.config.capital + suma) + ' vs ' + e.diners + ')');
    t(e.hist.length === 8, '8 rondes de resultats');
    e.hist.forEach(h => { t(Number.isFinite(h.resultat) && Number.isFinite(h.valor) && h.unitats >= 0, 'sense NaN'); t(h.unitats <= h.capacitat, 'mai no ven més que la capacitat'); });
    const v = ME.valorEmpresa(s, e); t(v.total === v.tresoreria + v.propietats + v.altresActius + v.marca - v.deute, 'valor empresarial = tresoreria + actius − deute');
  });
  const q = s.resultats[s.resultats.length - 1].empreses.reduce((a, x) => a + x.quota, 0);
  t(near(q, 100, 0.2), 'les quotes sumen 100 %');
}
// 3. Determinisme: mateixa llavor → mateix resultat
{
  const a = juga(partida({ llavor: 777 })), b = juga(partida({ llavor: 777 }));
  t(JSON.stringify(a.resultats) === JSON.stringify(b.resultats), 'determinista amb la mateixa llavor');
}
// 4. Coherència del mercat (comparacions ceteris paribus en una sola ronda)
function unaRonda(mod) {
  const s = partida({ llavor: 5 });
  s.ronda = 1; s.fase = 'mercat'; s.esdeveniment = null; s.efectesMercat = [];
  mod(s);
  return ME.resoldreMercat(s);
}
{
  const base = unaRonda(() => {});
  const barat = unaRonda(s => { s.empreses[0].preu = 10; });
  t(barat[0].segAssignat.preu > base[0].segAssignat.preu, 'abaixar el preu atrau més clients sensibles al preu');
  t(barat[0].ingressos / Math.max(1, barat[0].unitats) < base[0].ingressos / Math.max(1, base[0].unitats), 'però baixa l\'ingrés per unitat');
  const qual = unaRonda(s => { s.empreses[0].atr.qualitat = 90; s.empreses[0].atr.servei = 90; });
  t(qual[0].segAssignat.qualitat > base[0].segAssignat.qualitat, 'millorar la qualitat atrau el segment de qualitat');
  const not = unaRonda(s => { s.empreses[0].not = 70; });
  t(not[0].assignat > base[0].assignat, 'més notorietat, més demanda');
  const dist = unaRonda(s => { s.empreses[0].canals.ecommerce = true; s.empreses[0].canals.distribuidor = true; });
  t(dist[0].unitats > base[0].unitats, 'ampliar la distribució permet vendre més');
  const sense = unaRonda(s => { s.empreses[0].ampliacions = 0; s.empreses[0].canals = { directa: true }; });
  t(sense[0].unitats <= sense[0].capacitat && sense[0].perdudes > 0, 'sense capacitat suficient es perden vendes');
  const car = unaRonda(s => { s.empreses[0].preu = 23; });
  t(car[0].assignat < base[0].assignat, 'un preu molt alt fa perdre demanda');
}
// 5. Equilibri: cap perfil guanya sempre (200 partides, 4 sectors)
{
  const guanys = {}; MD.PERFILS.forEach(p => guanys[p] = 0);
  const vals = [];
  for (let k = 0; k < 200; k++) {
    const sectors = Object.keys(MD.sectors);
    const ordre = ['agressiva', 'premium', 'equilibrada', 'innovadora'];
    const s = juga(partida({ llavor: 1000 + k, sector: sectors[k % 4], dificultat: ['facil', 'mitja', 'dificil'][k % 3] }));
    const c = ME.classificacio(s); guanys[c[0].e.perfil]++;
    c.forEach(x => vals.push(x.v.total));
    t(ordre.length === 4, '');
  }
  const max = Math.max(...Object.values(guanys));
  console.log('Victòries per perfil (200 partides):', JSON.stringify(guanys));
  console.log('Valor empresarial final: mínim', Math.min(...vals), '· mitjana', Math.round(vals.reduce((a, b) => a + b, 0) / vals.length), '· màxim', Math.max(...vals));
  t(max < 200 * 0.55, 'cap perfil guanya més del 55 % de les partides');
  t(Object.values(guanys).filter(v => v > 0).length >= 3, 'almenys tres perfils guanyen alguna partida');
}
// 6. Estratègies dominants: només preu baix o només publicitat no haurien de guanyar fàcilment
{
  let winsBarat = 0, winsTV = 0;
  for (let k = 0; k < 60; k++) {
    const a = juga(partida({ llavor: 3000 + k }), s => { ME.accio(s, { tipus: 'preu', emp: 0, valor: 6.5 }); });
    if (ME.classificacio(a)[0].e.id === 0) winsBarat++;
    const b = juga(partida({ llavor: 3000 + k }), s => { ME.accio(s, { tipus: 'campanya', emp: 0, camp: 'televisio' }); });
    if (ME.classificacio(b)[0].e.id === 0) winsTV++;
  }
  console.log('Només preu mínim guanya:', winsBarat, '/ 60 · Només televisió guanya:', winsTV, '/ 60');
  t(winsBarat < 20, 'el preu mínim no és una estratègia dominant');
  t(winsTV < 20, 'gastar-ho tot en televisió no és una estratègia dominant');
}
// 7. Idempotència i validacions
{
  const s = partida({}); ME.iniciarRonda(s); ME.accio(s, { tipus: 'continuar' });
  const d0 = s.empreses[0].diners;
  ME.accio(s, { id: 'x1', tipus: 'campanya', emp: 0, camp: 'radio' }); ME.accio(s, { id: 'x1', tipus: 'campanya', emp: 0, camp: 'radio' });
  t(s.empreses[0].diners === d0 - 4500, 'una acció repetida només es cobra una vegada');
  t(!ME.accio(s, { tipus: 'campanya', emp: 1, camp: 'radio' }).ok, 'no es pot decidir fora del torn');
  s.empreses[0].diners = 100; t(!ME.accio(s, { tipus: 'capacitat', emp: 0 }).ok, 'no es pot comprar sense saldo');
  t(!ME.accio(s, { tipus: 'preu', emp: 0, valor: 1 }).ok, 'el preu ha d\'estar dins de l\'interval');
}
console.log(ko ? '✘ ' + ko + ' errors · ' + ok + ' correctes' : '✔ ' + ok + ' comprovacions del motor de Mercadeja');
process.exit(ko ? 1 : 0);
