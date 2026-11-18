// Proves del motor de Mercadeja (la botiga del barri): clients, comptes, determinisme, verificació i equilibri.
// Ús: node scripts/test-mercadeja.js
const path = require('path');
const MD = require(path.join(__dirname, '../public/jocs/mercadeja/js/data.js'));
const ME = require(path.join(__dirname, '../public/jocs/mercadeja/js/engine.js'));
const LL = require(path.join(__dirname, '../public/jocs/mercadeja/js/llicons.js'));

let ok = 0, ko = 0;
const t = (cond, nom) => { if (cond) ok++; else { ko++; console.log('✘', nom); } };
const near = (a, b, tol = 0.05) => Math.abs(a - b) <= tol;
const R = Math.round;

// Juga una partida com la interfície: registra les accions i simula el que passa a la botiga amb una «habilitat»
function juga(cfg, estrategia, habilitat = 0.9, rondes) {
  const s = ME.crearPartida(Object.assign({ llavor: 777, rondes: rondes || 8, dificultat: 'mitja', empreses: [{ nom: 'Jo', humana: true, membres: ['A'] }] }, cfg));
  s.reg = [];
  const fa = (a) => { const x = ME.accio(s, a); if (!x.repetida && (x.ok || x.muta)) { const c = Object.assign({}, a); delete c.id; s.reg.push(c); } return x; };
  const fia = (k) => { s.reg.push({ ia: k }); return ME.aplica(s, { ia: k }); };
  fia('I');
  const rnd = ME.rngDe(cfg && cfg.llavor || 777, 'proves');
  while (s.fase !== 'final') {
    if (s.fase === 'planificacio') {
      const e = ME.jugador(s);
      estrategia(s, e, fa);
      e.prestatges.slice(0, e.nPrest).filter(x => x && x.prod).forEach(x => {
        const n = e.prestatges.slice(0, e.nPrest).filter(y => y && y.prod).length, falta = Math.ceil(240 / n) - (e.estoc[x.prod] || 0);
        if (falta > 0) fa({ tipus: 'comanda', prod: x.prod, caixes: Math.min(20, Math.ceil(falta / 10)) });
      });
      LL.llicons.filter(l => l.quan(s, e) && !(s.llicons[0] || {})[l.id]).forEach((l, k) => fa({ tipus: 'llico', llico: l.id, resposta: k % 3 ? l.pregunta.c : 2 }));
      const r = fa({ tipus: 'obrir' }); if (!r.ok) throw new Error(r.err);
    } else if (s.fase === 'botiga') {
      const st = Object.assign({}, s.dia.estocInici), res = [];
      s.dia.clients.forEach(c => {
        if (c.motiu) return res.push([c.id, 0, c.motiu]);
        if (rnd() > habilitat) return res.push([c.id, 0, rnd() < 0.5 ? 4 : 3]);
        const v = Math.min(c.qty, st[c.prod] || 0); st[c.prod] -= v; res.push([c.id, v, v ? 0 : 3]);
      });
      const r = fa({ tipus: 'tancar', res }); if (!r.ok) throw new Error(r.err);
    } else fa({ tipus: 'continuar' });
  }
  return s;
}
const ESTR = {
  res: () => {},
  equilibrada: (s, e, fa) => {
    if (s.ronda === 1) { [['motlle', 0], ['pages', 1], ['fruita', 2], ['kombutxa', 3]].forEach(([p, k]) => fa({ tipus: 'producte', slot: k, prod: p })); fa({ tipus: 'prestatge' }); fa({ tipus: 'producte', slot: 4, prod: 'granel' }); fa({ tipus: 'servei', servei: 'online', actiu: true }); fa({ tipus: 'servei', servei: 'dependent', actiu: true }); }
    fa({ tipus: 'promo', promo: 'cartell' }); fa({ tipus: 'promo', promo: 'xarxes' }); fa({ tipus: 'aparador', tema: 'eco' }); fa({ tipus: 'objectiu', valor: 500 });
  },
  cara: (s, e, fa) => { e.prestatges.forEach((x, k) => x && x.prod && fa({ tipus: 'preu', slot: k, valor: MD.productes[x.prod].ref * 1.8 })); },
  radio: (s, e, fa) => { fa({ tipus: 'promo', promo: 'radio' }); fa({ tipus: 'promo', promo: 'fullets' }); fa({ tipus: 'promo', promo: 'tast' }); }
};

/* ---------- Dades ---------- */
t(MD.PROD.every(p => ['q', 'eco', 'nou', 'bas'].every(k => MD.productes[p][k] >= 0 && MD.productes[p][k] <= 100) && MD.productes[p].cost < MD.productes[p].ref), 'productes amb atributs vàlids i marge positiu');
t(Math.abs(MD.SEG.reduce((a, k) => a + MD.segments[k].pes, 0) - 1) < 1e-9, 'els pesos dels tipus de client sumen 1');
t(MD.SEG.every(k => Math.abs(Object.values(MD.segments[k].w).reduce((a, b) => a + b, 0) - 1) < 1e-9), 'els pesos de l\'atractiu sumen 1');
t(MD.SEG.every(k => MD.PROD.some(p => ME.encaix(k, p) >= MD.segments[k].min + 0.1)), 'cada tipus de client té productes que li agraden');
t(MD.SEG.every(k => MD.PROD.filter(p => ME.encaix(k, p) >= MD.segments[k].min).length < MD.PROD.length), 'cap tipus de client no vol tots els productes');

/* ---------- Un dia ---------- */
{
  const s = ME.crearPartida({ llavor: 99, empreses: [{ nom: 'Jo', humana: true }] }); ME.iniciarDia(s);
  const e = ME.jugador(s);
  t(s.fase === 'planificacio' && s.ronda === 1 && s.esdeveniment === 'normal', 'el primer dia és un dia normal');
  t(!ME.accio(s, { tipus: 'producte', slot: 1, prod: 'motlle' }).ok, 'un producte no pot estar en dues prestatgeries');
  t(!ME.accio(s, { tipus: 'preu', slot: 0, valor: 50 }).ok, 'el preu ha d\'estar dins de l\'interval');
  t(ME.accio(s, { tipus: 'preu', slot: 0, valor: 1.92 }).ok && e.prestatges[0].preu === 1.9, 'els preus s\'arrodoneixen a 5 cèntims');
  const d0 = e.diners; ME.accio(s, { tipus: 'comanda', prod: 'motlle', caixes: 2 });
  t(near(d0 - e.diners, 2 * MD.CAIXA * MD.productes.motlle.cost) && e.estoc.motlle === 40, 'comprar estoc paga el cost i omple el magatzem');
  t(!ME.accio(s, { tipus: 'tancar', res: [] }).ok, 'no es pot tancar si no s\'ha obert');
  const v0 = ME.valorEmpresa(s, e);
  t(ME.accio(s, { tipus: 'obrir' }).ok && s.fase === 'botiga' && s.dia.clients.length > 10, 'obrir la botiga genera els clients del dia');
  t(!ME.accio(s, { tipus: 'preu', slot: 0, valor: 2 }).ok, 'amb la botiga oberta no es poden canviar els preus');
  const cl = s.dia.clients;
  t(cl.every((c, i) => c.id === i && c.t >= 0 && c.t <= 1 && (c.motiu ? !c.prod : MD.productes[c.prod])), 'clients ben formats');
  t(cl.every(c => c.motiu || e.prestatges.some(x => x.prod === c.prod)), 'cada client vol un producte que hi ha a les prestatgeries');
  // Resultats incoherents
  const bo = cl.find(c => !c.motiu), dolent = cl.find(c => c.motiu);
  t(!ME.accio(s, { tipus: 'tancar', res: [[bo.id, bo.qty + 1, 0]] }).ok, 'no es pot vendre més del que vol un client');
  if (dolent) t(!ME.accio(s, { tipus: 'tancar', res: [[dolent.id, 1, 0]] }).ok, 'no es pot vendre a qui ha marxat per preu o assortiment');
  t(!ME.accio(s, { tipus: 'tancar', res: cl.filter(c => !c.motiu).map(c => [c.id, c.qty, 0]).concat([[bo.id, 9999, 0]]) }).ok, 'no es pot vendre més estoc del que hi ha');
  // Tancament correcte: tothom atès fins on arriba l'estoc
  const st = Object.assign({}, s.dia.estocInici), res = cl.map(c => { if (c.motiu) return [c.id, 0, c.motiu]; const v = Math.min(c.qty, st[c.prod] || 0); st[c.prod] -= v; return [c.id, v, v ? 0 : 3]; });
  const dAbans = e.diners, eAbans = ME.valorEmpresa(s, e).estoc;
  const r = ME.accio(s, { tipus: 'tancar', res }); t(r.ok && s.fase === 'resultats', 'tancar el dia');
  const h = r.h;
  t(h.servits + Object.values(h.perduts).reduce((a, b) => a + b, 0) === h.clients, 'cada client compta una vegada');
  t(near(h.ingressos, res.filter(x => x[1] > 0).reduce((a, x) => a + x[1] * e.prestatges.find(y => y.prod === cl[x[0]].prod).preu, 0), 0.05), 'les vendes són unitats × preu');
  t(near(h.resultat, h.ingressos - h.cogs - h.merma - h.fixos - h.serveis - h.comissions - h.promocio - h.estudi, 0.05), 'el resultat quadra');
  // Sense inversions, el resultat és la variació de (tresoreria + estoc a cost)
  t(near(h.resultat, (e.diners - dAbans) + (ME.valorEmpresa(s, e).estoc - eAbans) + (v0.estoc - v0.estoc), 2), 'resultat = variació de diners + estoc');
  t(Object.values(e.estoc).every(u => u >= 0), 'l\'estoc no és mai negatiu');
  t(s.empreses.every(x => x.darrer && x.darrer.posicio >= 1), 'totes les botigues tenen posició');
  t(ME.accio(s, { tipus: 'continuar' }).ok && s.ronda === 2 && s.fase === 'planificacio', 'passar al dia següent');
}

/* ---------- Reptes: mateix carrer per a tothom, reproducció i verificació ---------- */
{
  const codi = ME.codiRepte('alimentacio', 12, 'dificil', 987654321), r = ME.llegirRepte(codi);
  t(r && r.rondes === 12 && r.dificultat === 'dificil' && r.llavor === 987654321, 'codi de repte: anada i tornada');
  t(ME.llegirRepte(codi.toLowerCase()).codi === codi && ME.llegirRepte('X9Z-123') === null && ME.llegirRepte('') === null, 'codis de repte vàlids i no vàlids');
  const rep = ME.llegirRepte(ME.codiRepte('alimentacio', 8, 'mitja', 4242));
  const a = juga(ME.cfgRepte(rep, { nom: 'Alfa' }), ESTR.res), b = juga(ME.cfgRepte(rep, { nom: 'Beta' }), ESTR.equilibrada);
  t(a.fase === 'final' && b.fase === 'final', 'les partides arriben al final');
  t(JSON.stringify(a.log.filter(l => l.tipus === 'esdeveniment').map(l => l.concepte)) === JSON.stringify(b.log.filter(l => l.tipus === 'esdeveniment').map(l => l.concepte)), 'repte just: els mateixos esdeveniments per a tots els equips');
  t(ME.valorEmpresa(a, a.empreses[0]).total !== ME.valorEmpresa(b, b.empreses[0]).total, 'les decisions de l\'equip canvien el resultat');
  [a, b].forEach(s => {
    const json = JSON.stringify({ cfg: s.config, reg: ME.compacta(s.reg) }), p = JSON.parse(json), { s: s2, errors } = ME.repetir(p.cfg, ME.descompacta(p.reg));
    t(errors === 0, 'reproducció sense accions no vàlides');
    t(JSON.stringify(s2.empreses.map(e => [e.diners, e.xp, e.hist.length, ME.valorEmpresa(s2, e).total])) === JSON.stringify(s.empreses.map(e => [e.diners, e.xp, e.hist.length, ME.valorEmpresa(s, e).total])), 'reproducció exacta del resultat');
    t(JSON.stringify(s2.llicons) === JSON.stringify(s.llicons), 'reproducció de les respostes de les lliçons');
    t(json.length < 60000, 'registre prou petit per enviar-lo (' + json.length + ' caràcters sense comprimir)');
  });
  // Manipulació: vendre més del que hi ha a l'estoc
  const p = JSON.parse(JSON.stringify({ cfg: b.config, reg: ME.compacta(b.reg) }));
  const k = p.reg.findIndex(x => x[0] === 't'); p.reg[k][1] = p.reg[k][1].map(x => [x[0], 99, 0]);
  t(ME.repetir(p.cfg, ME.descompacta(p.reg)).errors > 0, 'uns resultats inventats es detecten');
}

/* ---------- Lliçons ---------- */
{
  const s = juga({ llavor: 31 }, ESTR.equilibrada), e = s.empreses[0], resp = s.llicons[0] || {};
  t(LL.llicons.length >= 15 && new Set(LL.llicons.map(l => l.id)).size === LL.llicons.length, 'lliçons amb identificador únic');
  t(LL.llicons.every(l => /RA\d/.test(l.ra) && l.cos.length && l.pregunta.o.length === 4), 'cada lliçó té RA, contingut i quatre opcions');
  t(LL.llicons.every(l => { try { return typeof l.exemple(s, e, ME, MD) === 'string'; } catch (x) { console.log(l.id, x.message); return false; } }), 'els exemples de les lliçons funcionen amb dades reals');
  t(Object.keys(resp).length === LL.llicons.length, 'en 8 dies es desbloquegen totes les lliçons (' + Object.keys(resp).length + ')');
  t(Object.values(resp).some(x => !x.ok) && Object.values(resp).some(x => x.ok), 'es registren encerts i errors');
}

/* ---------- Equilibri ---------- */
{
  const N = 24, mitj = (est, hab) => { let v = 0, pos = 0; for (let k = 1; k <= N; k++) { const s = juga({ llavor: k * 101 }, est, hab); v += ME.valorEmpresa(s, s.empreses[0]).total; pos += ME.classificacio(s).findIndex(x => x.e.humana) + 1; } return { v: R(v / N), pos: pos / N }; };
  const bona = mitj(ESTR.equilibrada, 0.95), normal = mitj(ESTR.equilibrada, 0.8), res = mitj(ESTR.res, 0.8), cara = mitj(ESTR.cara, 0.9), radio = mitj(ESTR.radio, 0.9);
  console.log('Valor i posició mitjana · bona estratègia i bona atenció:', bona.v, bona.pos.toFixed(2), '· bona estratègia i atenció normal:', normal.v, normal.pos.toFixed(2), '· no fer res:', res.v, res.pos.toFixed(2), '· preus molt cars:', cara.v, '· molta promoció:', radio.v);
  t(bona.v > normal.v && normal.v > res.v, 'jugar millor dona més valor');
  t(bona.pos <= 2, 'qui juga bé pot guanyar les rivals');
  t(res.pos >= 3, 'no fer res queda a la cua del carrer');
  t(cara.v < res.v && radio.v < normal.v, 'apujar molt els preus o gastar molt en promoció no és una drecera');
}

console.log(ko ? '✘ ' + ko + ' errors · ' + ok + ' correctes' : '✔ ' + ok + ' comprovacions del motor de Mercadeja');
process.exit(ko ? 1 : 0);
