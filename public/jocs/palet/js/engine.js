/* Palet · motor del joc (sense DOM). Genera cada torn de manera determinista a partir de la llavor i puntua el que ha fet el jugador.
   La cap valora cada torn (productivitat, qualitat i seguretat) i decideix: bronca, ascens o acomiadament. */
(function (root) {
  const D = (typeof module !== 'undefined' && module.exports) ? require('./data.js') : root.PD;
  const E = {};

  /* ---------- Aleatori determinista ---------- */
  function hash(t) { let h = 2166136261; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  E.rngDe = (llavor, clau) => mulberry(hash(llavor + '/' + clau));
  const tria = (r, l) => l[Math.floor(r() * l.length)];
  const barreja = (r, l) => { const a = l.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const P = (id) => D.productes[id];
  E.P = P;
  const min = (t) => t.charAt(0).toLowerCase() + t.slice(1);   // nom de producte dins d'una frase
  E.min = min;

  /* ---------- Ubicacions ---------- */
  // Codi: passadís-mòdul-nivell-posició, p. ex. A-03-2-B
  E.parse = (codi) => { const m = /^([A-Z])-(\d\d)-(\d)-([AB])$/.exec(codi || ''); return m ? { pas: m[1], mod: +m[2], niv: +m[3], pos: m[4] } : null; };
  E.codi = (pas, mod, niv, pos) => `${pas}-${String(mod).padStart(2, '0')}-${niv}-${pos}`;
  E.nivellsDe = (pas, mod) => (pas === 'F' || pas === 'P') ? 2 : D.ESTANTERIES[D.tipusDe(pas, mod)] ? D.ESTANTERIES[D.tipusDe(pas, mod)].nivells : 0;
  E.totesUbicacions = () => {
    const out = [];
    D.PASSADISSOS.forEach(p => { for (let m = 1; m <= p.moduls; m++) { if (D.tipusDe(p.id, m) === 'cap') continue; for (let n = 1; n <= E.nivellsDe(p.id, m); n++) D.POSICIONS.forEach(pos => out.push(E.codi(p.id, m, n, pos))); } });
    D.MAG.zones.forEach(z => { const Z = D.ZONES[z]; for (let m = 1; m <= Z.moduls; m++) for (let n = 1; n <= 2; n++) D.POSICIONS.forEach(pos => out.push(E.codi(Z.id, m, n, pos))); });
    return out;
  };
  // Zona d'una ubicació: fred (cambra), refri / conge (passadís refrigerat o de congelats), perill, neteja o sec
  const zonaDe = (u) => { if (u.pas === 'F') return 'fred'; if (u.pas === 'P') return 'perill'; const p = D.PASSADISSOS.find(x => x.id === u.pas); if (!p) return 'sec'; if (p.neteja.includes(u.mod)) return 'neteja'; return p.temp || 'sec'; };
  E.zonaDe = zonaDe;
  const tipusU = (u) => (u.pas === 'F' || u.pas === 'P') ? 'convencional' : D.tipusDe(u.pas, u.mod);
  E.tipusU = tipusU;

  // Per què una ubicació no és adequada per a un producte (llista buida = correcta). nivellsRack: nivells als quals arriba l'equip.
  E.problemesUbicacio = function (prod, codi, opts) {
    const u = E.parse(codi), p = P(prod), out = [];
    if (!u) return ['ubicació desconeguda'];
    const z = zonaDe(u), tp = tipusU(u), ES = D.ESTANTERIES[tp];
    if (!ES || u.niv > ES.nivells || u.mod > 6) return ['aquesta ubicació no existeix en aquest magatzem'];
    if (opts && opts.fixa && D.UBICACIO[prod] && D.UBICACIO[prod] !== codi) out.push('no és la ubicació que indicava el sistema (' + D.UBICACIO[prod] + ')');
    const fredZ = z === 'fred' || z === 'refri' || z === 'conge';
    if (p.fred && !fredZ) out.push('és un producte ' + (p.fred === 'conge' ? 'congelat' : 'refrigerat') + ' i ha d\'anar a la cambra de fred');
    else if (p.fred === 'refri' && z === 'conge') out.push('és un producte refrigerat: a la cambra de congelats (−18 °C) es congelaria');
    else if (p.fred === 'conge' && z === 'refri') out.push('és un producte congelat: a la cambra de refrigerats (0-4 °C) es descongelaria');
    if (!p.fred && fredZ) out.push('ocupa espai al fred sense necessitar-ho');
    if (p.perill && z !== 'perill') out.push('és una mercaderia perillosa (' + D.PERILLS[p.perill].toLowerCase() + ') i ha d\'anar a la zona de perillosos');
    if (!p.perill && !p.quimic && z === 'perill') out.push('és un aliment i no pot anar a la zona de perillosos');
    if (p.quimic && !p.perill && z !== 'neteja' && z !== 'perill') out.push('és un producte químic de neteja i ha d\'anar separat dels aliments (zona de neteja)');
    if (!p.quimic && !p.perill && z === 'neteja') out.push('és un aliment i és a la zona de productes de neteja');
    // Tipus d'estanteria
    if (p.llarg && tp !== 'cantilever') out.push('és una càrrega llarga: va a l\'estanteria cantilever');
    if (!p.llarg && tp === 'cantilever') out.push('l\'estanteria cantilever és per a càrregues llargues (tubs, barres, perfils)');
    if (tp === 'compacte' && p.cad) out.push('és perible: en una estanteria compacta només pots treure l\'últim palet que ha entrat (LIFO) i els primers caducarien');
    if (tp === 'compacte' && (p.petit || p.fragil)) out.push('l\'estanteria compacta és per a molts palets d\'una sola referència, no per a ' + (p.petit ? 'peces petites' : 'productes fràgils'));
    if (tp === 'picking' && p.pes >= 15) out.push('la prestatgeria de picking és per a peces petites i lleugeres que es preparen a mà');
    if (p.petit && tp !== 'picking' && tp !== 'convencional') out.push('les peces petites van a la prestatgeria de picking');
    if (p.pes >= 15 && u.niv > 1 && tp !== 'cantilever' && tp !== 'compacte') out.push('pesa ' + p.pes + ' kg: el que pesa va a terra (nivell 1)');
    if (p.fragil && u.niv > 2) out.push('és fràgil: no l\'ubiquis als nivells alts');
    if (opts && opts.nivellsRack && u.niv > opts.nivellsRack) out.push('amb el teu equip no arribes al nivell ' + u.niv);
    return out;
  };

  /* ---------- Partida ---------- */
  E.crearPartida = function (cfg) {
    const config = Object.assign({ nom: 'Treballador', llavor: 1, nivell: 1, magatzem: D.MAGATZEM_PER_DEFECTE }, cfg);
    D.usa(config.magatzem);
    const s = { v: 1, config, nivell: config.nivell, torn: 0, avisos: 0, tornsBons: 0, fase: 'briefing', historial: [], llicons: {}, stock: {}, xp: 0, final: null };
    // Estoc inicial: cada producte a la seva ubicació, amb dos lots de dates diferents (per practicar FEFO)
    const r = E.rngDe(config.llavor, 'estoc');
    if (D.MAG.mode !== 'cross') D.PROD.forEach(id => {
      const p = P(id), slot = D.UBICACIO[id] || E.totesUbicacions().find(u => !E.problemesUbicacio(id, u, {}).length && !s.stock[u] && !mescla(s.stock, id, u));
      s.stock[slot] = [];
      const q1 = 2 + Math.floor(r() * 3), q2 = 2 + Math.floor(r() * 3);
      const vida = p.cad || 400;
      s.stock[slot].push({ prod: id, lot: 'L' + (1000 + Math.floor(r() * 9000)), cad: Math.max(3, Math.round(vida * (0.25 + r() * 0.2))), q: q1 });
      s.stock[slot].push({ prod: id, lot: 'L' + (1000 + Math.floor(r() * 9000)), cad: Math.round(vida * (0.7 + r() * 0.25)), q: q2 });
    });
    E.nouTorn(s);
    return s;
  };
  E.nivell = (s) => D.NIVELLS[s.nivell - 1];
  E.mag = (s) => D.usa(s.config.magatzem || D.MAGATZEM_PER_DEFECTE);
  // Tasques del nivell segons el tipus de magatzem
  E.tasques = (s) => { const M = E.mag(s), t = E.nivell(s).tasques; if (M.mode === 'cross') return ['recepcio', 'cross']; if (M.mode === 'ecom') return t.filter(x => x !== 'carrega'); return t; };
  E.lliure = (s) => !!(E.mag(s).lliure || E.nivell(s).lliure);
  // En una estanteria compacta, cada mòdul (carril) és d'una sola referència
  function mescla(stock, prod, codi) {
    const u = E.parse(codi); if (!u || tipusU(u) !== 'compacte') return null;
    const k = Object.keys(stock).find(c => { const v = E.parse(c); return v && v.pas === u.pas && v.mod === u.mod && stock[c].some(x => x.prod !== prod && x.q > 0); });
    return k ? stock[k].find(x => x.prod !== prod && x.q > 0).prod : null;
  }
  E.mescla = mescla;
  E.estocDe = (s, prod) => Object.values(s.stock).reduce((a, l) => a + l.filter(x => x.prod === prod).reduce((b, x) => b + x.q, 0), 0);

  // Data del joc (dia 1 = dilluns 2 de novembre)

  /* ---------- Continguts del mòdul treballats ---------- */
  // Continguts que es treballen en un torn (ok) i on hi ha hagut errors (err)
  E.contTorn = function (config, nivell, cats, hab, actiu) {
    config = config || {};
    const M = D.MAGATZEMS[config.magatzem] || D.MAGATZEMS.aliment, N = D.NIVELLS[(nivell || 1) - 1] || D.NIVELLS[0];
    let TQ = N.tasques.slice();
    if (M.mode === 'cross') TQ = ['recepcio', 'cross']; else if (M.mode === 'ecom') TQ = TQ.filter(x => x !== 'carrega');
    if (actiu) TQ = TQ.filter(x => actiu[x]);
    const c = {}, fet = (...k) => k.forEach(x => { if (!c[x]) c[x] = 'ok'; });
    if (actiu && !TQ.length && !(hab || []).length) return c;   // torn sense feina feta
    fet('1.1', '1.2', '3.5', '7.1', '7.4', '8.1', '8.4');
    if (TQ.includes('recepcio')) fet('2.1', '2.2', '2.3', '2.4', '2.5');
    if (TQ.includes('ubicacio')) fet('1.4', '1.5', '1.6');
    const tipus = new Set(Object.values(M.passadissos).flatMap(p => [p.tipus].concat(Object.values(p.mods || {}))));
    if (['dinamic', 'compacte', 'mobil', 'cantilever', 'picking'].some(x => tipus.has(x))) fet('1.3');
    const prods = M.prods.map(id => D.productes[id]).filter(Boolean);
    if (prods.some(p => p.fred) || M.zones.includes('fred')) fet('3.1', '3.2');
    if (prods.some(p => p.fragil)) fet('3.3');
    if (prods.some(p => p.perill) || M.zones.includes('perill')) fet('3.4');
    if (TQ.includes('picking')) fet('5.1', '5.2', '5.3', '5.4', '4.2', '8.2');
    if (TQ.includes('carrega') || TQ.includes('cross')) fet('5.6');
    if (TQ.includes('inventari')) fet('4.1', '4.4', '4.5');
    fet(N.equip === 'toro' ? '6.2' : '6.1', '6.4'); if (N.equip === 'toro') fet('6.3');
    (hab || []).forEach(x => { if (x.mitja === 'ma') fet('7.2'); if (x.mitja === 'toro') fet('6.2', '6.3'); if (x.mitja === 'transpalet') fet('6.1'); });
    if (config.avatar) { if (config.avatar.armilla) fet('7.3'); else c['7.3'] = 'err'; }
    (cats || []).forEach(k => (D.TEMARI.errors[k] || []).forEach(x => { if (c[x]) c[x] = 'err'; }));
    return c;
  };
  // Completa els torns antics (d'abans d'aquest registre)
  const actiuDeKpi = (k) => k ? { recepcio: k.recOk > 0 || k.carregues > 0 && k.recOk > 0, ubicacio: k.ubicades > 0, picking: k.liniesOk > 0, carrega: k.aTemps > 0, inventari: k.recomptesFets > 0, cross: k.crossOk > 0 } : null;
  E.migraCont = function (s) { (s.historial || []).forEach(h => { if (!h.cont) h.cont = E.contTorn(s.config, h.nivell, (h.errors || []).concat(h.greus || []).map(e => e[0]), [], actiuDeKpi(h.kpi)); }); };
  // Estat d'un contingut a partir dels torns, les lliçons i el taller
  E.estatCont = (x) => { if (!x || (!x.fets && x.teoria == null && x.taller == null)) return 'no'; const pct = x.fets ? x.ok / x.fets : 0; return (x.fets >= 3 && pct >= 0.75) || (x.fets >= 1 && x.taller >= 65 && pct >= 0.5) ? 'assolit' : 'treballat'; };
  // Cobertura del temari d'una partida: { codi: { fets, ok, teoria, taller } }
  E.cobertura = function (s) {
    const out = {};
    D.TEMARI.continguts.forEach(([k]) => { out[k] = { fets: 0, ok: 0, teoria: null, taller: null }; });
    (s.historial || []).forEach(h => { const c = h.cont || E.contTorn(s.config, h.nivell, (h.errors || []).concat(h.greus || []).map(e => e[0])); Object.keys(c).forEach(k => { if (!out[k]) return; out[k].fets++; if (c[k] === 'ok') out[k].ok++; }); });
    Object.entries(s.llicons || {}).forEach(([id, r]) => (D.TEMARI.llicons[id] || []).forEach(k => { if (out[k]) out[k].teoria = out[k].teoria || !!(r && r.ok); }));
    Object.entries(s.taller || {}).forEach(([id, n]) => (D.TEMARI.taller[id] || []).forEach(k => { if (out[k]) out[k].taller = Math.max(out[k].taller || 0, +n || 0); }));
    return out;
  };
  // Botigues clients segons el poble del magatzem
  E.clients = (s) => { const P = s.config && s.config.lloc && D.POBLES[s.config.lloc]; return P ? P.clients.map(id => D.CLIENTS.find(c => c.id === id)) : D.CLIENTS.slice(0, 5); };
  E.data = (dia) => { const d = new Date(Date.UTC(2026, 10, 1 + dia)); return d.getUTCDate() + '/' + (d.getUTCMonth() + 1); };
  E.hora = (min) => String(Math.floor(min / 60)).padStart(2, '0') + ':' + String(Math.floor(min % 60)).padStart(2, '0');

  /* ---------- Generació d'un torn ---------- */
  E.nouTorn = function (s) {
    s.torn++;
    const M = E.mag(s), TQ = E.tasques(s), N = E.nivell(s), r = E.rngDe(s.config.llavor, 'torn' + s.torn), dia = s.torn;
    const t = { torn: dia, dia, nivell: s.nivell, magatzem: D.MAG_ID, recepcions: [], comandes: [], camions: [], inventari: null };
    // Cross-docking: camions de sortida (per saber el destí de cada càrrega)
    if (M.mode === 'cross') {
      const cl = barreja(r, E.clients(s)), nCli = s.nivell >= 3 ? 3 : 2;
      [0, 1].forEach(k => t.camions.push({ id: 'k' + (k + 1), moll: 2 + k, sortida: D.TORN_INICI + 210 + k * 120, ruta: cl.slice(k * nCli, k * nCli + nCli).map(c => c.id) }));
    }
    // Recepcions: camions de proveïdor amb càrregues; algunes tenen problemes
    const nRec = M.mode === 'cross' ? 3 : M.mode === 'ecom' && s.nivell >= 2 ? 1 : 2, pProb = Math.min(0.35, 0.18 + s.torn * 0.02);
    let idc = 0;
    for (let k = 0; k < nRec; k++) {
      const prods = barreja(r, D.PROD.filter(id => s.nivell >= 3 || (!P(id).perill && !P(id).quimic || id === 'detergent'))).slice(0, (M.mode === 'cross' ? 4 : 5) + Math.min(2, s.nivell));
      const carregues = [];
      prods.forEach(prod => {
        const p = P(prod), vida = p.cad;
        const c = { id: 'c' + (++idc), prod, albara: prod, lot: 'L' + (1000 + Math.floor(r() * 9000)), cad: vida ? dia + Math.round(vida * (0.75 + r() * 0.2)) : null,
          temp: p.fred === 'refri' ? 3 : p.fred === 'conge' ? -20 : null, estat: 'ok', enComanda: true, problema: null };
        if (r() < pProb) {
          const opcions = ['dany'];
          if (vida) opcions.push('caducitat');
          if (p.fred) opcions.push('temperatura', 'temperatura');
          opcions.push('referencia');
          if (k === 0 && s.nivell >= 2) opcions.push('sobrant');
          c.problema = tria(r, opcions);
          if (c.problema === 'dany') c.estat = 'dany';
          if (c.problema === 'caducitat') c.cad = dia + Math.max(1, Math.round(vida * (0.08 + r() * 0.2)));
          if (c.problema === 'temperatura') c.temp = p.fred === 'refri' ? 9 + Math.floor(r() * 5) : -6 + Math.floor(r() * 4);
          if (c.problema === 'referencia') { c.prod = tria(r, D.PROD.filter(x => x !== prod && !!P(x).fred === !!p.fred)); }
          if (c.problema === 'sobrant') c.enComanda = false;
        }
        carregues.push(c);
      });
      const arribada = M.mode === 'cross' ? D.TORN_INICI + k * 80 : D.TORN_INICI + k * 150 + (k ? Math.floor(r() * 40) : 0);
      // Cross-docking: cada càrrega va a una botiga d'un camió que encara no hagi sortit
      if (M.mode === 'cross') carregues.forEach(c => { const cams = t.camions.filter(cm => cm.sortida > arribada + 60); const cm = tria(r, cams); c.desti = tria(r, cm.ruta); });
      t.recepcions.push({ id: 'r' + (k + 1), proveidor: tria(r, D.PROVEIDORS), arribada, moll: 1, carregues });
    }
    // Comandes de botigues (des de preparador)
    if (TQ.includes('picking') && M.mode === 'ecom') {
      // Comerç electrònic: moltes comandes petites (1-3 unitats) que recull el transportista
      const nCam = s.nivell >= 4 ? 2 : 1, nOrd = 4 + Math.min(4, (s.nivell - 2) * 2);
      for (let k = 0; k < nCam; k++) t.camions.push({ id: 'k' + (k + 1), moll: 2 + k, sortida: D.TORN_INICI + 270 + k * 75, ruta: [], transportista: k ? 'Transportista exprés' : 'Transportista estàndard' });
      const reserva = {}, queda = (id) => E.estocDe(s, id) - (reserva[id] || 0);
      for (let i = 0; i < nOrd; i++) {
        const nl = 1 + Math.floor(r() * (s.nivell >= 3 ? 3 : 2));
        const prods = barreja(r, D.PROD.filter(id => queda(id) >= 2 && (s.nivell >= 3 || !P(id).perill))).slice(0, nl);
        prods.forEach(id => { reserva[id] = (reserva[id] || 0) + 1; });
        t.comandes.push({ id: 'o' + (i + 1), client: 'web', num: 4100 + Math.floor(r() * 5800), camio: t.camions[i % nCam].id, linies: prods.map(prod => ({ prod, q: 1 })) });
      }
    } else if (TQ.includes('picking')) {
      const nCam = TQ.includes('carrega') ? 2 : 1;
      const clients = barreja(r, E.clients(s));
      let ci = 0;
      const reserva = {}, queda = (id) => E.estocDe(s, id) - (reserva[id] || 0);
      for (let k = 0; k < nCam; k++) {
        const nCli = TQ.includes('carrega') ? 2 : 1 + (s.nivell >= 3 ? 1 : 0);
        const ruta = clients.slice(ci, ci + nCli); ci += nCli;
        const cam = { id: 'k' + (k + 1), moll: 2 + k, sortida: D.TORN_INICI + 240 + k * 90 + (s.nivell <= 2 ? 60 : 0), ruta: ruta.map(c => c.id) };
        t.camions.push(cam);
        ruta.forEach(cl => {
          // Les botigues demanen sobretot el que caduca abans (el magatzem ho empeny cap a la venda)
          const cand = D.PROD.filter(id => queda(id) >= 2 && (s.nivell >= 3 || !P(id).perill));
          const urgent = cand.filter(id => P(id).cad && Math.min(...Object.values(s.stock).flat().filter(x => x.prod === id && x.q > 0).map(x => x.cad)) <= dia + 3);
          const prods = [...new Set(barreja(r, urgent).concat(barreja(r, cand)))].slice(0, 2 + Math.min(2, s.nivell - 1));
          t.comandes.push({ id: 'o' + (t.comandes.length + 1), client: cl.id, camio: cam.id, linies: prods.map(prod => { const q = 1 + (r() < 0.35 ? 1 : 0); reserva[prod] = (reserva[prod] || 0) + q; return { prod, q }; }) });
        });
      }
    }
    // Inventari (cap de magatzem): recompte de 3 ubicacions; una pot tenir una diferència
    if (TQ.includes('inventari')) {
      const slots = barreja(r, Object.keys(s.stock).filter(k => s.stock[k].length)).slice(0, 3);
      t.inventari = { recomptes: slots.map((slot, i) => { const teoric = s.stock[slot].reduce((a, x) => a + x.q, 0); const real = i === 0 ? Math.max(0, teoric - 1 - Math.floor(r() * 2)) : teoric; return { slot, teoric, real }; }),
        puntComanda: D.PROD.filter(id => P(id).rot === 'A').map(id => ({ prod: id, consumDia: 1 + Math.floor(r() * 2), termini: 1 + Math.floor(r() * 3), seguretat: 1 + Math.floor(r() * 2) })) };
    }
    // Boira a la Plana (de novembre a març): els camions dels proveïdors arriben tard
    const mes = new Date(Date.UTC(2026, 10, 1 + dia)).getUTCMonth(), rb = E.rngDe(s.config.llavor, 'boira' + dia);
    t.boira = (mes >= 10 || mes <= 2) && rb() < 0.3;
    if (t.boira && M.mode !== 'cross') t.recepcions.forEach(rc => { rc.arribada += 15 + Math.floor(rb() * 25); });
    s.dia = t; s.fase = 'briefing';
    return t;
  };

  /* ---------- Puntuació d'un torn ----------
     res (ho envia l'escena):
       recepcio: { idCarrega: 'accepta' | motiu }      ubicacions: { idCarrega: codi }
       picking: [{ comanda, prod, slot, lot, q }]       palets: [{ comanda, pila: [prod…] (de baix a dalt), moll, minut }]
       carrega: { idCamio: [idComanda…] } (ordre en què s'han carregat)
       incidents: [{ tipus: 'xoc' | 'caiguda' | 'sobreesforc' | 'bloqueig' | 'diagrama', minut, prod? }]
       inventari: { recomptes: { slot: n }, comandes: { prod: n } }      fi: minut en què s'ha acabat el torn */
  E.puntua = function (s, res) {
    const M = E.mag(s), TQ = E.tasques(s), N = E.nivell(s), t = s.dia, err = [], bons = [], greus = [], lliure = E.lliure(s);
    res = Object.assign({ recepcio: {}, ubicacions: {}, picking: [], palets: [], carrega: {}, incidents: [], inventari: { recomptes: {}, comandes: {} }, cross: {}, fred: {}, fi: D.TORN_FI }, res || {});
    const k = { carregues: 0, recOk: 0, ubiOk: 0, ubicades: 0, linies: 0, liniesOk: 0, comandes: t.comandes.length, aTemps: 0, trencaments: 0, fefo: 0, incidents: res.incidents.length, cross: 0, crossOk: 0, fred: 0, caixesOk: 0 };
    const nomClient = (id) => (D.CLIENTS.find(c => c.id === id) || {}).nom || id;
    // Recepció
    t.recepcions.forEach(rc => {
      const sense = rc.carregues.filter(c => !res.recepcio[c.id]).length;
      if (sense) err.push(['recepcio', rc.arribada > (res.fi || D.TORN_FI) ? `Has plegat abans que arribés el camió de ${rc.proveidor} (${E.hora(rc.arribada)}): ningú no ha rebut les ${sense} càrregues.` : `No has revisat ${sense === rc.carregues.length ? 'cap de les ' + sense : sense + ' de les ' + rc.carregues.length} càrregues del camió de ${rc.proveidor}: s'han quedat al moll.`]);
    });
    t.recepcions.forEach(rc => rc.carregues.forEach(c => {
      k.carregues++;
      const dec = res.recepcio[c.id], p = P(c.prod);
      if (!dec) return;
      if (c.problema && dec === 'accepta') {
        const greu = c.problema === 'temperatura' || c.problema === 'dany';
        (greu ? greus : err).push(['recepcio', `Has acceptat ${p.nom} amb un problema: ${D.MOTIUS[c.problema].toLowerCase()}. ${c.problema === 'temperatura' ? 'S\'ha trencat la cadena de fred: s\'ha de llençar.' : c.problema === 'referencia' ? 'L\'albarà deia ' + P(c.albara).nom + '.' : ''}`]);
      } else if (!c.problema && dec !== 'accepta') err.push(['recepcio', `Has rebutjat ${p.nom}, que estava bé (${D.MOTIUS[dec] ? D.MOTIUS[dec].toLowerCase() : dec}). Ara en faltarà a l'estoc.`]);
      else if (c.problema && dec !== c.problema) { k.recOk += 0.5; err.push(['recepcio', `Has rebutjat bé ${p.nom}, però el motiu era «${D.MOTIUS[c.problema]}», no «${D.MOTIUS[dec] || dec}».`]); }
      else k.recOk++;
      // Cross-docking: la càrrega acceptada va directa al moll del camió del seu destí
      if (dec === 'accepta' && M.mode === 'cross') {
        k.cross++;
        const cam = t.camions.find(cm => cm.ruta.includes(c.desti)), fet = res.cross[c.id];
        if (!fet) err.push(['cross', `${p.nom} per a ${nomClient(c.desti)}: s'ha quedat a la plataforma i no ha sortit.`]);
        else if (fet.moll !== cam.moll) err.push(['cross', `${p.nom} anava a ${nomClient(c.desti)} (camió del moll ${cam.moll}) i l'has deixada al moll ${fet.moll}: ha anat a una altra botiga.`]);
        else if (fet.minut > cam.sortida) greus.push(['cross', `${p.nom} per a ${nomClient(c.desti)}: ha arribat al moll a les ${E.hora(fet.minut)} i el camió ja havia sortit (${E.hora(cam.sortida)}).`]);
        else k.crossOk++;
        return;
      }
      // Ubicació de les acceptades
      if (dec === 'accepta') {
        const u = res.ubicacions[c.id];
        if (!u) { err.push(['ubicacio', `${p.nom}: l'has acceptat però no l'has ubicat. Per al sistema no és enlloc.`]); return; }
        k.ubicades++;
        const pr = E.problemesUbicacio(c.prod, u, { fixa: !lliure, nivellsRack: N.nivellsRack });
        const altre = (s.stock[u] || []).find(x => x.prod !== c.prod && x.q > 0), mc = mescla(s.stock, c.prod, u);
        if (lliure && altre) pr.push('en aquesta ubicació ja hi ha ' + min(P(altre.prod).nom) + ': no barregis referències');
        else if (mc) pr.push('en aquest carril de l\'estanteria compacta ja hi ha ' + min(P(mc).nom) + ': cada carril és d\'una sola referència');
        if (pr.length) err.push(['ubicacio', `${p.nom} a ${u}: ${pr.join('; ')}.`]); else k.ubiOk++;
        // Cadena de fred: temps fora del fred des que s'accepta al moll fins que és a la cambra
        const fora = res.fred[c.id];
        if (p.fred && fora != null && fora > D.FRED_MAX[p.fred]) { k.fred++; err.push(['fred', `${p.nom}: ha estat ${Math.round(fora)} minuts fora del fred (màxim ${D.FRED_MAX[p.fred]}). S'ha trencat la cadena de fred i s'ha de llençar. Els refrigerats i congelats, primer a la cambra.`]); return; }
        if (!c.problema || c.problema === 'sobrant') { s.stock[u] = s.stock[u] || []; s.stock[u].push({ prod: c.prod, lot: c.lot, cad: c.cad || 9999, q: 1 }); }
      }
    }));
    // FEFO: en l'ordre en què s'ha fet el picking, el lot triat ha de ser el que caduca abans dels que hi havia a la ubicació
    res.picking.forEach(pk => {
      const lots = (s.stock[pk.slot] || []).filter(x => x.prod === pk.prod && x.q > 0).sort((a, b) => a.cad - b.cad);
      const triat = lots.find(x => x.lot === pk.lot), u = E.parse(pk.slot), forcat = u && ['dinamic', 'compacte'].includes(tipusU(u));
      if (!forcat && triat && lots[0] && triat.cad > lots[0].cad && P(pk.prod).cad) { k.fefo++; err.push(['fefo', `${P(pk.prod).nom}: has agafat el lot que caduca el ${E.data(triat.cad)} i a la mateixa ubicació hi havia el del ${E.data(lots[0].cad)}. Amb FEFO surt primer el que caduca abans.`]); }
      if (triat) triat.q = Math.max(0, triat.q - pk.q);
    });
    // Picking i palets
    const perComanda = {};
    res.picking.forEach(pk => { (perComanda[pk.comanda] = perComanda[pk.comanda] || []).push(pk); });
    t.comandes.forEach(o => {
      const picks = perComanda[o.id] || [], cl = o.client === 'web' ? 'Comanda web #' + o.num : nomClient(o.client), cam = t.camions.find(c => c.id === o.camio);
      o.linies.forEach(l => {
        k.linies++;
        const fets = picks.filter(x => x.prod === l.prod), q = fets.reduce((a, x) => a + x.q, 0);
        if (q === l.q) k.liniesOk++;
        else err.push(['picking', `${cl}: demanava ${l.q} de ${P(l.prod).nom} i n'has preparat ${q}.`]);
      });
      picks.filter(x => !o.linies.some(l => l.prod === x.prod)).forEach(x => err.push(['picking', `${cl}: has posat ${P(x.prod).nom}, que no era a la comanda.`]));
      // Palet: muntatge i lliurament
      const pal = res.palets.find(x => x.comanda === o.id);
      if (!pal) { if (picks.length) err.push(['expedicio', `${cl}: has preparat la comanda però no l'has portada al moll.`]); else err.push(['expedicio', `${cl}: la comanda no s'ha preparat.`]); return; }
      const pila = pal.pila || [];
      // Comerç electrònic: la caixa ha de ser la més petita on hi cap tot
      if (M.mode === 'ecom') {
        const vol = pila.reduce((a, x) => a + (P(x).vol || 1), 0), bona = Object.keys(D.CAIXES).find(b => D.CAIXES[b].vol >= vol) || 'L', triada = pal.caixa;
        if (!triada) err.push(['caixa', `${cl}: no has triat la caixa.`]);
        else if (D.CAIXES[triada].vol < vol) err.push(['caixa', `${cl}: a la caixa ${D.CAIXES[triada].nom.toLowerCase()} no hi cap tot (volum ${vol}): s'ha hagut de refer l'embalatge.`]);
        else if (triada !== bona) err.push(['caixa', `${cl}: caixa ${D.CAIXES[triada].nom.toLowerCase()} per a un volum de ${vol}: n'hi havia prou amb la ${D.CAIXES[bona].nom.toLowerCase()}. Més cartró, més farciment i més cost de transport.`]);
        else k.caixesOk++;
      }
      for (let i = 0; i < pila.length && M.mode !== 'ecom'; i++) {
        if (!P(pila[i]).fragil) continue;
        const aSobre = pila.slice(i + 1).find(x => P(x).pes >= 8 && !P(x).fragil);
        if (aSobre) { k.trencaments++; err.push(['trencament', `${cl}: has posat ${min(P(aSobre).nom)} a sobre de ${min(P(pila[i]).nom)}. El fràgil va a dalt: s'ha trencat.`]); break; }
      }
      if (pal.moll !== cam.moll) err.push(['expedicio', `${cl}: l'has deixat al moll ${pal.moll} i ${M.mode === 'ecom' ? 'el transportista' : 'el camió'} era al moll ${cam.moll}.`]);
      else if (pal.minut > cam.sortida) greus.push(['expedicio', `${cl}: ha arribat al moll a les ${E.hora(pal.minut)} i ${M.mode === 'ecom' ? 'el transportista havia passat' : 'el camió sortia'} a les ${E.hora(cam.sortida)}. ${M.mode === 'ecom' ? 'El client la rebrà tard.' : 'La botiga no el rebrà fins demà.'}`]);
      else k.aTemps++;
    });
    // Ordre de càrrega (cap d'equip)
    if (TQ.includes('carrega')) t.camions.forEach(cam => {
      const ordre = res.carrega[cam.id] || [], esperat = cam.ruta.slice().reverse().map(cl => (t.comandes.find(o => o.client === cl && o.camio === cam.id) || {}).id).filter(Boolean);
      if (ordre.length && ordre.join() !== esperat.filter(id => ordre.includes(id)).join()) err.push(['carrega', `Camió del moll ${cam.moll}: l'ordre de càrrega no és l'invers del repartiment (${cam.ruta.map(c => D.CLIENTS.find(x => x.id === c).nom.replace('Botiga de ', '')).join(' → ')}). El primer que es descarrega ha d'anar a prop de la porta.`]);
    });
    // Habilitat (manipulació física i conducció): danys, cops i accidents de les maniobres
    const HB = res.habilitat || [];
    HB.forEach(hb => {
      const on = hb.tipus === 'picking' ? 'en preparar la comanda' : 'en ubicar-la', nom = P(hb.prod) ? P(hb.prod).nom.toLowerCase() : 'la càrrega';
      (hb.malmesos || []).forEach(m => { k.trencaments++; err.push(['manipulacio', `${m.nom}: ${m.estat === 'trencat' ? 's\'ha trencat' : 's\'ha colpejat'} ${on}. És una merma.`]); });
      if (hb.caiguts) err.push(['manipulacio', `${hb.caiguts === 1 ? 'Un bloc' : hb.caiguts + ' blocs'} de ${nom} ${hb.caiguts === 1 ? 'ha' : 'han'} caigut del palet ${on}: cal recollir-los i revisar-los.`]);
      if (hb.abandonat) err.push(['manipulacio', `Has deixat a mitges la maniobra de ${nom}.`]);
      if (hb.copsForts) res.incidents.push({ tipus: 'cop', minut: hb.minut });
      if (hb.greu) res.incidents.push({ tipus: hb.greu, minut: hb.minut });
    });
    k.incidents = res.incidents.length;
    const fets = HB.filter(x => x.nota != null);
    if (fets.length) { k.habilitat = Math.round(fets.reduce((a, x) => a + x.nota, 0) / fets.length); if (k.habilitat >= 85) bons.push(`Manipulació i conducció molt acurades (habilitat ${k.habilitat}/100).`); }
    // Incidents de seguretat
    const TXT = { cop: 'Cop fort contra una prestatgeria o un palet amb el transpalet o el toro: s\'ha de comunicar perquè la revisin.', bolcada: 'Has bolcat el toro: velocitat o girs bruscos amb la càrrega. Pot ser mortal.', palet: 'Has deixat un palet mal recolzat a les bigues i ha caigut.', xoc: 'Has xocat amb el transpalet o el toro anant de pressa.', caiguda: 'Se t\'ha caigut una càrrega anant de pressa: trencament.', sobreesforc: 'Has col·locat a mà una càrrega molt pesant en un nivell alt: risc de lesió.', bloqueig: 'Has deixat mercaderia davant de la sortida d\'emergència o al mig del passadís.', diagrama: 'Has intentat elevar més pes del que permet el diagrama de càrrega del toro: risc de bolcada.' };
    res.incidents.forEach(i => { (['xoc', 'diagrama', 'bloqueig', 'bolcada', 'palet'].includes(i.tipus) ? greus : err).push(['seguretat', TXT[i.tipus] || i.tipus]); if (i.tipus === 'caiguda') k.trencaments++; });
    // Inventari i punt de comanda
    if (t.inventari) {
      t.inventari.recomptes.forEach(rc => {
        const n = res.inventari.recomptes[rc.slot];
        if (n == null) err.push(['inventari', `No has comptat la ubicació ${rc.slot}.`]);
        else if (+n !== rc.real) err.push(['inventari', `A ${rc.slot} hi havia ${rc.real} càrregues i n'has comptat ${n}.`]);
        else bons.push(rc.real !== rc.teoric ? `Has trobat la diferència d'inventari a ${rc.slot}: el sistema deia ${rc.teoric} i n'hi ha ${rc.real}.` : `Recompte correcte a ${rc.slot}.`);
        if (n != null && +n === rc.real) (s.stock[rc.slot] || []).forEach((x, i, a) => { if (i === a.length - 1) x.q = Math.max(0, x.q - (rc.teoric - rc.real)); });
      });
      t.inventari.puntComanda.forEach(pc => {
        const estoc = E.estocDe(s, pc.prod), punt = pc.consumDia * pc.termini + pc.seguretat, dem = +(res.inventari.comandes[pc.prod] || 0);
        if (estoc <= punt && !dem) err.push(['inventari', `${P(pc.prod).nom}: queden ${estoc} càrregues i el punt de comanda és ${punt} (${pc.consumDia} × ${pc.termini} + ${pc.seguretat}). Calia demanar-ne.`]);
        else if (estoc > punt && dem) err.push(['inventari', `${P(pc.prod).nom}: n'has demanat i encara n'hi ha ${estoc} (punt de comanda ${punt}). Immobilitzes diners i espai.`]);
        else if (dem) bons.push(`Comanda al proveïdor de ${P(pc.prod).nom} a temps.`);
      });
    }
    // La resta de l'equip (els altres torns) també prepara comandes: cada producte perd una càrrega, sempre el lot que caduca abans
    if (M.mode !== 'cross') D.PROD.forEach(id => {
      if (E.estocDe(s, id) < 3) return;
      const lots = Object.values(s.stock).flat().filter(x => x.prod === id && x.q > 0).sort((a, b) => a.cad - b.cad);
      if (lots[0]) lots[0].q--;
    });
    // Caducats a l'estoc (mermes)
    let caducats = 0;
    Object.keys(s.stock).forEach(slot => s.stock[slot].forEach(x => { if (x.q > 0 && P(x.prod).cad && x.cad <= t.dia) { caducats += x.q; x.q = 0; } }));
    if (caducats) err.push(['merma', `S'han fet malbé ${caducats} càrregues que han caducat a les prestatgeries.${TQ.includes('picking') ? ' Amb FEFO no hauria passat.' : ' Avisa quan vegis lots a punt de caducar.'}`]);
    Object.keys(s.stock).forEach(slot => { s.stock[slot] = s.stock[slot].filter(x => x.q > 0); });

    // Notes
    const tasques = k.carregues * 2 + k.linies + k.comandes * (M.mode === 'ecom' ? 2 : 1) + (t.inventari ? t.inventari.recomptes.length : 0);
    const fetes = k.recOk + k.ubiOk + k.crossOk + (M.mode === 'cross' ? k.carregues - k.cross : 0) + k.liniesOk + k.aTemps + k.caixesOk + (t.inventari ? t.inventari.recomptes.filter(rc => res.inventari.recomptes[rc.slot] != null).length : 0);
    const marge = Math.max(0, (D.TORN_FI - (res.fi || D.TORN_FI)) / 60);
    const productivitat = Math.round(Math.min(100, fetes / Math.max(1, tasques) * (100 + marge * 4)));
    const errQualitat = err.filter(e => e[0] !== 'seguretat').length + greus.filter(e => e[0] !== 'seguretat').length * 2;
    const qualitat = Math.max(0, 100 - errQualitat * 9);
    const seguretat = Math.max(0, 100 - res.incidents.reduce((a, i) => a + (['xoc', 'diagrama', 'bloqueig', 'bolcada', 'palet'].includes(i.tipus) ? 40 : 20), 0));
    const nota = Math.round(productivitat * D.PESOS_NOTA.productivitat + qualitat * D.PESOS_NOTA.qualitat + seguretat * D.PESOS_NOTA.seguretat);
    // La cap
    const bo = nota >= D.NOTA_BONA && !greus.length;
    let veredicte = 'regular';
    if (greus.length || nota < 55 || productivitat < 35) { veredicte = 'bronca'; s.avisos++; s.tornsBons = 0; }
    else if (bo) { veredicte = 'bo'; s.tornsBons++; s.avisos = Math.max(0, s.avisos - 1); }
    else s.tornsBons = 0;
    let canvi = null;
    if (s.avisos >= D.AVISOS_ACOMIADAMENT) { canvi = 'acomiadament'; }
    else if (veredicte === 'bo' && s.tornsBons >= D.TORNS_ASCENS && s.nivell < D.NIVELLS.length) { canvi = 'ascens'; }
    const r = E.rngDe(s.config.llavor, 'frase' + s.torn);
    const h = { torn: s.torn, dia: t.dia, nivell: s.nivell, nota, productivitat, qualitat, seguretat, veredicte, canvi, frase: tria(r, D.FRASES[canvi === 'ascens' ? 'ascens' : canvi === 'acomiadament' ? 'acomiadament' : veredicte]).replace('{0}', canvi === 'ascens' ? D.NIVELLS[s.nivell].nom.toLowerCase() : ''),
      errors: err, greus, bons, kpi: Object.assign({}, k, { caducats, fi: res.fi, comandesATemps: k.comandes ? Math.round(k.aTemps / k.comandes * 100) : null, errorsPicking: k.linies ? Math.round((k.linies - k.liniesOk) / k.linies * 100) : null }), avisos: s.avisos };
    const recFets = t.inventari ? t.inventari.recomptes.filter(rc => res.inventari.recomptes[rc.slot] != null).length : 0;
    h.kpi.recomptesFets = recFets;
    h.cont = E.contTorn(s.config, s.nivell, err.concat(greus).map(e => e[0]), HB, {
      recepcio: Object.keys(res.recepcio).length > 0, ubicacio: Object.keys(res.ubicacions).length > 0, picking: res.picking.length > 0,
      carrega: Object.keys(res.carrega || {}).length > 0 || (res.palets || []).length > 0, inventari: recFets > 0 || Object.keys(res.inventari.comandes || {}).length > 0, cross: Object.keys(res.cross || {}).length > 0 });
    s.historial.push(h); s.darrer = h;
    s.xp += Math.max(0, nota);
    if (canvi === 'ascens') { s.nivell++; s.tornsBons = 0; s.avisos = 0; }
    if (canvi === 'acomiadament') { s.final = { tipus: 'acomiadament', nivell: s.nivell, torn: s.torn }; }
    if (canvi === 'ascens' && s.nivell === D.NIVELLS.length && false) s.final = { tipus: 'cap' };
    s.fase = 'resultat';
    return h;
  };

  // Continuar després del resultat
  E.continuar = function (s) {
    if (s.final && s.final.tipus === 'acomiadament') { s.fase = 'final'; return s; }
    E.nouTorn(s); return s;
  };
  // Tornar a començar el nivell després d'un acomiadament (es manté l'estoc i l'historial)
  E.reintentar = function (s) { s.final = null; s.avisos = 0; s.tornsBons = 0; E.nouTorn(s); return s; };

  if (typeof module !== 'undefined' && module.exports) module.exports = E; else root.PE = E;
})(typeof window !== 'undefined' ? window : globalThis);
