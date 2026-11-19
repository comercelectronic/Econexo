// Proves del motor de Palet (joc del magatzem). node scripts/test-palet.js
const path = require('path');
const D = require(path.join(__dirname, '../public/jocs/palet/js/data.js'));
const E = require(path.join(__dirname, '../public/jocs/palet/js/engine.js'));
let ok = 0, ko = 0;
const t = (c, nom) => { if (c) ok++; else { ko++; console.log('✘', nom); } };

// Tria una ubicació correcta per a un producte (nivells amb ubicació lliure)
function ubicacioCorrecta(s, prod, usades) {
  const N = E.nivell(s);
  if (!N.lliure) return D.UBICACIO[prod];
  const u = E.totesUbicacions().find(u => !E.problemesUbicacio(prod, u, { nivellsRack: N.nivellsRack }).length && !(s.stock[u] || []).some(x => x.prod !== prod && x.q > 0) && (!usades[u] || usades[u] === prod));
  usades[u] = prod; return u;
}
// Juga un torn: perfecte o amb errors
function jugaTorn(s, mode) {
  const usades = {}, t = s.dia, res = { recepcio: {}, ubicacions: {}, picking: [], palets: [], carrega: {}, incidents: [], inventari: { recomptes: {}, comandes: {} }, fi: 13 * 60 };
  t.recepcions.forEach(rc => rc.carregues.forEach(c => {
    if (mode === 'bo') res.recepcio[c.id] = c.problema || 'accepta'; else res.recepcio[c.id] = 'accepta';
    if (res.recepcio[c.id] === 'accepta') res.ubicacions[c.id] = mode === 'bo' ? ubicacioCorrecta(s, c.prod, usades) : 'A-06-2-B';
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
    res.palets.push({ comanda: o.id, pila, moll: cam.moll, minut: mode === 'bo' ? cam.sortida - 30 : cam.sortida + 20 });
  });
  t.camions.forEach(cam => { const ids = cam.ruta.map(cl => t.comandes.find(o => o.client === cl && o.camio === cam.id).id); res.carrega[cam.id] = mode === 'bo' ? ids.slice().reverse() : ids; });
  if (t.inventari) {
    t.inventari.recomptes.forEach(rc => { res.inventari.recomptes[rc.slot] = mode === 'bo' ? rc.real : rc.teoric; });
    t.inventari.puntComanda.forEach(pc => { const punt = pc.consumDia * pc.termini + pc.seguretat; if (mode === 'bo' && E.estocDe(s, pc.prod) <= punt) res.inventari.comandes[pc.prod] = 10; });
  }
  if (mode === 'dolent') res.incidents.push({ tipus: 'xoc', minut: 600 });
  return E.puntua(s, res);
}

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
console.log(ko ? '✘ ' + ko + ' errors · ' + ok + ' correctes' : '✔ ' + ok + ' comprovacions del motor de Palet');
process.exit(ko ? 1 : 0);
