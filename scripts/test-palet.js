// Proves del motor de Palet (joc del magatzem). node scripts/test-palet.js
const path = require('path');
const D = require(path.join(__dirname, '../public/jocs/palet/js/data.js'));
const E = require(path.join(__dirname, '../public/jocs/palet/js/engine.js'));
let ok = 0, ko = 0;
const t = (c, nom) => { if (c) ok++; else { ko++; console.log('✘', nom); } };

// Tria una ubicació correcta per a un producte (nivells amb ubicació lliure)
function ubicacioCorrecta(s, prod, usades) {
  const N = E.nivell(s);
  if (!E.lliure(s)) return D.UBICACIO[prod];
  const modDe = (u) => u.slice(0, 4);
  const u = E.totesUbicacions().find(u => !E.problemesUbicacio(prod, u, { nivellsRack: N.nivellsRack }).length && !(s.stock[u] || []).some(x => x.prod !== prod && x.q > 0) && !E.mescla(s.stock, prod, u) && (!usades[u] || usades[u] === prod) && (!usades[modDe(u)] || usades[modDe(u)] === prod));
  usades[u] = prod; if (E.tipusU(E.parse(u)) === 'compacte') usades[modDe(u)] = prod; return u;
}
// Juga un torn: perfecte o amb errors
function jugaTorn(s, mode) {
  const M = E.mag(s), usades = {}, t = s.dia, res = { recepcio: {}, ubicacions: {}, picking: [], palets: [], carrega: {}, incidents: [], inventari: { recomptes: {}, comandes: {} }, cross: {}, fred: {}, fi: 13 * 60 };
  t.recepcions.forEach(rc => rc.carregues.forEach(c => {
    if (mode === 'bo') res.recepcio[c.id] = c.problema || 'accepta'; else res.recepcio[c.id] = 'accepta';
    if (res.recepcio[c.id] !== 'accepta') return;
    if (M.mode === 'cross') { const cam = t.camions.find(cm => cm.ruta.includes(c.desti)); res.cross[c.id] = { moll: mode === 'bo' ? cam.moll : 5 - cam.moll, minut: cam.sortida - 20 }; return; }
    res.ubicacions[c.id] = mode === 'bo' ? ubicacioCorrecta(s, c.prod, usades) : 'A-02-2-B';
    res.fred[c.id] = mode === 'bo' ? 10 : 90;
  }));
  // Les ubicacions s'apliquen a l'estoc dins de puntua; el picking es fa sobre l'estoc d'abans
  t.comandes.forEach(o => {
    const pila = [];
    o.linies.forEach(l => {
      let falta = l.q;
      const lots = [];
      Object.keys(s.stock).forEach(slot => s.stock[slot].forEach(x => { if (x.prod === l.prod && x.q > 0) lots.push({ slot, x }); }));
      lots.sort((a, b) => mode === 'bo' ? a.x.cad - b.x.cad : b.x.cad - a.x.cad);
      lots.forEach(({ slot, x }) => { if (falta <= 0) return; const q = Math.min(falta, x.q); falta -= q; res.picking.push({ comanda: o.id, prod: l.prod, slot, lot: x.lot, q }); });
      for (let i = 0; i < l.q; i++) pila.push(l.prod);
    });
    if (mode === 'bo') pila.sort((a, b) => (E.P(a).fragil ? 1 : 0) - (E.P(b).fragil ? 1 : 0) || E.P(b).pes - E.P(a).pes);
    else pila.sort((a, b) => (E.P(b).fragil ? 1 : 0) - (E.P(a).fragil ? 1 : 0));
    const cam = t.camions.find(c => c.id === o.camio);
    const vol = pila.reduce((a, x) => a + (E.P(x).vol || 1), 0);
    res.palets.push({ comanda: o.id, pila, moll: cam.moll, minut: mode === 'bo' ? cam.sortida - 30 : cam.sortida + 20, caixa: mode === 'bo' ? Object.keys(D.CAIXES).find(b => D.CAIXES[b].vol >= vol) : 'L' });
  });
  if (M.mode === 'estoc') t.camions.forEach(cam => { const ids = cam.ruta.map(cl => t.comandes.find(o => o.client === cl && o.camio === cam.id).id); res.carrega[cam.id] = mode === 'bo' ? ids.slice().reverse() : ids; });
  if (t.inventari) {
    t.inventari.recomptes.forEach(rc => { res.inventari.recomptes[rc.slot] = mode === 'bo' ? rc.real : rc.teoric; });
    t.inventari.puntComanda.forEach(pc => { const punt = pc.consumDia * pc.termini + pc.seguretat; if (mode === 'bo' && E.estocDe(s, pc.prod) <= punt) res.inventari.comandes[pc.prod] = 10; });
  }
  if (mode === 'dolent') res.incidents.push({ tipus: 'xoc', minut: 600 });
  return E.puntua(s, res);
}

function jugaTornAmb(s, hab) { const orig = E.puntua; let h; E.puntua = (ss, res) => { res.habilitat = hab; return orig(ss, res); }; try { h = jugaTorn(s, 'bo'); } finally { E.puntua = orig; } return h; }
{ // Un bon treballador puja de mosso a cap de magatzem
  const s = E.crearPartida({ nom: 'Prova', llavor: 7 });
  t(s.nivell === 1 && s.dia.recepcions.length === 2 && !s.dia.comandes.length, 'el mosso comença amb dos camions de proveïdor i sense comandes');
  t(E.totesUbicacions().includes('A-01-1-A') && E.parse('B-03-2-A').niv === 2, 'codis d\'ubicació');
  t(E.problemesUbicacio('iogurt', 'A-02-1-A').some(x => /fred/.test(x)), 'els refrigerats van a la cambra de fred');
  t(E.problemesUbicacio('lleixiu', 'B-01-1-A').some(x => /perillos/.test(x)), 'els perillosos van a la seva zona');
  t(E.problemesUbicacio('sucre', 'A-02-2-A').some(x => /terra/.test(x)), 'el pesat va a terra');
  t(!E.problemesUbicacio('oli', 'A-01-1-B', { fixa: true }).length, 'la ubicació fixa del sistema és correcta');
  const notes = [];
  for (let i = 0; i < 20 && s.nivell < 5; i++) { const h = jugaTorn(s, 'bo'); notes.push(h.nota); if (h.errors.length + h.greus.length) console.log('  errors en un torn perfecte:', h.errors.concat(h.greus).map(e => e[1]).slice(0, 3)); E.continuar(s); }
  console.log('Torn perfecte · notes:', notes.join(', '), '· nivell final', s.nivell, E.nivell(s).nom);
  t(s.nivell === 5, 'un bon treballador arriba a cap de magatzem');
  t(notes.every(n => n >= D.NOTA_BONA), 'els torns perfectes tenen bona nota');
  const h = jugaTorn(s, 'bo');
  t(s.dia.inventari && h.bons.length > 0, 'el cap de magatzem fa recomptes i comandes al proveïdor');
  t(s.dia.camions.length === 2, 'el cap d\'equip i el de magatzem tenen dos camions');
}
{ // Un treballador descuidat rep broncas i l'acomiaden
  const s = E.crearPartida({ nom: 'Prova', llavor: 11, nivell: 2 });
  let h, n = 0;
  do { h = jugaTorn(s, 'dolent'); n++; if (!s.final) E.continuar(s); } while (!s.final && n < 10);
  t(h.veredicte === 'bronca', 'els errors greus porten bronca');
  t(s.final && s.final.tipus === 'acomiadament' && n === D.AVISOS_ACOMIADAMENT, 'tres broncas seguides: acomiadament');
  const tipus = new Set(h.errors.concat(h.greus).map(e => e[0]));
  t(['recepcio', 'ubicacio', 'expedicio', 'seguretat'].every(x => tipus.has(x)), 'l\'informe explica els errors de cada tasca (' + [...tipus].join(', ') + ')');
  t(s.historial.some(x => x.errors.some(e => e[0] === 'fefo')), 'agafar el lot que caduca més tard és un error de FEFO');
  E.continuar(s); t(s.fase === 'final', 'després de l\'acomiadament, final');
  E.reintentar(s); t(!s.final && s.fase === 'briefing' && s.avisos === 0, 'es pot tornar a provar el nivell');
}
{ // Determinisme: la mateixa llavor genera el mateix torn
  const a = E.crearPartida({ llavor: 99 }), b = E.crearPartida({ llavor: 99 });
  t(JSON.stringify(a.dia) === JSON.stringify(b.dia) && JSON.stringify(a.stock) === JSON.stringify(b.stock), 'mateixa llavor, mateix torn');
}
{ // Cada tipus de magatzem: un bon treballador hi fa carrera, i les normes de cada estanteria
  for (const mg of Object.keys(D.MAGATZEMS)) {
    const s = E.crearPartida({ llavor: 21, magatzem: mg }), notes = [];
    t(E.mag(s) === D.MAGATZEMS[mg] && (D.MAG.mode === 'cross' || Object.keys(s.stock).length >= D.PROD.length), mg + ': estoc inicial ubicat');
    t(Object.keys(s.stock).every(u => !E.problemesUbicacio(s.stock[u][0].prod, u, {}).length), mg + ': l\'estoc inicial compleix les normes');
    for (let i = 0; i < 20 && s.nivell < 5; i++) { const h = jugaTorn(s, 'bo'); notes.push(h.nota); if (h.errors.length + h.greus.length) console.log('  ' + mg + ' errors en un torn perfecte:', h.errors.concat(h.greus).map(e => e[1]).slice(0, 2)); E.continuar(s); }
    console.log(D.MAGATZEMS[mg].nom + ' · notes:', notes.join(', '));
    t(s.nivell === 5 && notes.every(n => n >= D.NOTA_BONA), mg + ': un bon treballador arriba a cap de magatzem');
    const d = E.crearPartida({ llavor: 22, magatzem: mg }); const hd = jugaTorn(d, 'dolent');
    t(hd.veredicte === 'bronca', mg + ': el treballador descuidat rep bronca');
    if (mg === 'cross') t(hd.errors.concat(hd.greus).some(e => e[0] === 'cross') && !d.dia.comandes.length, 'cross-docking: la mercaderia va al moll del seu destí, sense ubicar-la');
    if (mg === 'fred') t(hd.errors.some(e => e[0] === 'fred'), 'frigorífic: massa temps fora del fred trenca la cadena de fred');
  }
  D.usa('fred');
  t(E.problemesUbicacio('iogurt', 'C-01-1-A').some(x => /congelaria/.test(x)) && E.problemesUbicacio('gelat', 'B-01-1-A').some(x => /descongelaria/.test(x)), 'refrigerats i congelats, cadascun a la seva cambra');
  t(!E.totesUbicacions().includes('A-01-3-A') && E.nivellsDe('A', 1) === 2, 'l\'estanteria dinàmica només té dos nivells');
  D.usa('recanvis');
  t(E.problemesUbicacio('tubs', 'A-01-1-A').some(x => /cantilever/.test(x)) && !E.problemesUbicacio('tubs', 'B-02-2-A').length, 'les càrregues llargues van al cantilever');
  t(E.problemesUbicacio('cargols', 'C-01-1-A').length > 0 && !E.problemesUbicacio('ciment', 'C-01-2-A').length, 'l\'estanteria compacta és per a sacs, no per a peces petites');
  t(E.problemesUbicacio('cargols', 'A-03-3-B').length === 0 && E.problemesUbicacio('cable', 'A-01-1-A').some(x => /picking/.test(x)), 'les peces petites a picking; el que pesa, no');
  D.usa('aliment');
}
{ // Habilitat física: els danys i accidents de les maniobres entren a l'informe de la cap
  const s = E.crearPartida({ llavor: 31, nivell: 3, habilitat: 'totes' });
  const sense = jugaTornAmb(s, []);
  const s2 = E.crearPartida({ llavor: 31, nivell: 3, habilitat: 'totes' });
  const amb = jugaTornAmb(s2, [{ tipus: 'picking', prod: 'vi', nota: 40, malmesos: [{ nom: 'Vi negre 6 ampolles', estat: 'trencat' }], caiguts: 0, copsForts: 0 }, { tipus: 'ubicar', prod: 'aigua', nota: 0, malmesos: [], caiguts: 2, copsForts: 1, greu: 'bolcada' }]);
  t(amb.errors.some(e => e[0] === 'manipulacio' && /trencat/.test(e[1])), 'un producte trencat en una maniobra és una merma');
  t(amb.greus.some(e => e[0] === 'seguretat' && /bolcat/.test(e[1])) && amb.veredicte === 'bronca', 'bolcar el toro és un incident greu');
  t(amb.kpi.habilitat === 20 && amb.seguretat < sense.seguretat, 'la nota d\'habilitat i la seguretat reflecteixen les maniobres');
  const s3 = E.crearPartida({ llavor: 31, nivell: 3, habilitat: 'totes' });
  const be = jugaTornAmb(s3, [{ tipus: 'ubicar', prod: 'aigua', nota: 95, malmesos: [], caiguts: 0, copsForts: 0 }]);
  t(be.bons.some(b => /habilitat 95/.test(b)) && !be.errors.some(e => e[0] === 'manipulacio'), 'les maniobres netes es reconeixen');
}
console.log(ko ? '✘ ' + ko + ' errors · ' + ok + ' correctes' : '✔ ' + ok + ' comprovacions del motor de Palet');
process.exit(ko ? 1 : 0);
