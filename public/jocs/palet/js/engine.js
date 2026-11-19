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
  E.totesUbicacions = () => {
    const out = [];
    D.PASSADISSOS.forEach(p => { for (let m = 1; m <= p.moduls; m++) for (let n = 1; n <= D.NIVELLS_RACK; n++) D.POSICIONS.forEach(pos => out.push(E.codi(p.id, m, n, pos))); });
    ['fred', 'perill'].forEach(z => { const Z = D.ZONES[z]; for (let m = 1; m <= Z.moduls; m++) for (let n = 1; n <= 2; n++) D.POSICIONS.forEach(pos => out.push(E.codi(Z.id, m, n, pos))); });
    return out;
  };
  const zonaDe = (u) => u.pas === 'F' ? 'fred' : u.pas === 'P' ? 'perill' : (u.pas === 'C' && u.mod >= 5 ? 'neteja' : 'sec');

  // Per què una ubicació no és adequada per a un producte (llista buida = correcta). nivellsRack: nivells als quals arriba l'equip.
  E.problemesUbicacio = function (prod, codi, opts) {
    const u = E.parse(codi), p = P(prod), out = [];
    if (!u) return ['ubicació desconeguda'];
    const z = zonaDe(u);
    if (opts && opts.fixa && D.UBICACIO[prod] !== codi) out.push('no és la ubicació que indicava el sistema (' + D.UBICACIO[prod] + ')');
    if (p.fred && z !== 'fred') out.push('és un producte ' + (p.fred === 'conge' ? 'congelat' : 'refrigerat') + ' i ha d\'anar a la cambra de fred');
    if (!p.fred && z === 'fred') out.push('ocupa espai a la cambra de fred sense necessitar-ho');
    if (p.perill && z !== 'perill') out.push('és una mercaderia perillosa (' + D.PERILLS[p.perill].toLowerCase() + ') i ha d\'anar a la zona de perillosos');
    if (!p.perill && !p.quimic && z === 'perill') out.push('és un aliment i no pot anar a la zona de perillosos');
    if (p.quimic && !p.perill && z !== 'neteja' && z !== 'perill') out.push('és un producte químic de neteja i ha d\'anar separat dels aliments (passadís C, mòduls 5-6)');
    if (!p.quimic && !p.perill && z === 'neteja') out.push('és un aliment i és a la zona de productes de neteja');
    if (p.pes >= 15 && u.niv > 1) out.push('pesa ' + p.pes + ' kg: el que pesa va a terra (nivell 1)');
    if (p.fragil && u.niv > 2) out.push('és fràgil: no l\'ubiquis als nivells alts');
    if (opts && opts.nivellsRack && u.niv > opts.nivellsRack) out.push('amb el teu equip no arribes al nivell ' + u.niv);
    return out;
  };

  /* ---------- Partida ---------- */
  E.crearPartida = function (cfg) {
    const config = Object.assign({ nom: 'Treballador', llavor: 1, nivell: 1 }, cfg);
    const s = { v: 1, config, nivell: config.nivell, torn: 0, avisos: 0, tornsBons: 0, fase: 'briefing', historial: [], llicons: {}, stock: {}, xp: 0, final: null };
    // Estoc inicial: cada producte a la seva ubicació, amb dos lots de dates diferents (per practicar FEFO)
    const r = E.rngDe(config.llavor, 'estoc');
    D.PROD.forEach(id => {
      const p = P(id), slot = D.UBICACIO[id];
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
  E.estocDe = (s, prod) => Object.values(s.stock).reduce((a, l) => a + l.filter(x => x.prod === prod).reduce((b, x) => b + x.q, 0), 0);

  // Data del joc (dia 1 = dilluns 2 de novembre)
  E.data = (dia) => { const d = new Date(Date.UTC(2026, 10, 1 + dia)); return d.getUTCDate() + '/' + (d.getUTCMonth() + 1); };
  E.hora = (min) => String(Math.floor(min / 60)).padStart(2, '0') + ':' + String(Math.floor(min % 60)).padStart(2, '0');

  /* ---------- Generació d'un torn ---------- */
  E.nouTorn = function (s) {
    s.torn++;
    const N = E.nivell(s), r = E.rngDe(s.config.llavor, 'torn' + s.torn), dia = s.torn;
    const t = { torn: dia, dia, nivell: s.nivell, recepcions: [], comandes: [], camions: [], inventari: null };
    // Recepcions: camions de proveïdor amb càrregues; algunes tenen problemes
    const nRec = s.nivell >= 3 ? 2 : 1, pProb = Math.min(0.35, 0.18 + s.torn * 0.02);
    let idc = 0;
    for (let k = 0; k < nRec; k++) {
      const prods = barreja(r, D.PROD.filter(id => s.nivell >= 3 || (!P(id).perill && !P(id).quimic || id === 'detergent'))).slice(0, 4 + Math.min(3, s.nivell));
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
      t.recepcions.push({ id: 'r' + (k + 1), proveidor: tria(r, D.PROVEIDORS), arribada: D.TORN_INICI + (k ? 120 + Math.floor(r() * 60) : 0), moll: 1, carregues });
    }
    // Comandes de botigues (des de preparador)
    if (N.tasques.includes('picking')) {
      const nCam = N.tasques.includes('carrega') ? 2 : 1;
      const clients = barreja(r, D.CLIENTS);
      let ci = 0;
      for (let k = 0; k < nCam; k++) {
        const nCli = N.tasques.includes('carrega') ? 3 : 1 + (s.nivell >= 3 ? 1 : 0);
        const ruta = clients.slice(ci, ci + nCli); ci += nCli;
        const cam = { id: 'k' + (k + 1), moll: 2 + k, sortida: D.TORN_INICI + 210 + k * 90 + (s.nivell <= 2 ? 60 : 0), ruta: ruta.map(c => c.id) };
        t.camions.push(cam);
        ruta.forEach(cl => {
          const prods = barreja(r, D.PROD.filter(id => E.estocDe(s, id) >= 2 && (s.nivell >= 3 || !P(id).perill))).slice(0, 3 + Math.min(2, s.nivell - 1));
          t.comandes.push({ id: 'o' + (t.comandes.length + 1), client: cl.id, camio: cam.id, linies: prods.map(prod => ({ prod, q: 1 + (r() < 0.35 ? 1 : 0) })) });
        });
      }
    }
    // Inventari (cap de magatzem): recompte de 3 ubicacions; una pot tenir una diferència
    if (N.tasques.includes('inventari')) {
      const slots = barreja(r, Object.keys(s.stock).filter(k => s.stock[k].length)).slice(0, 3);
      t.inventari = { recomptes: slots.map((slot, i) => { const teoric = s.stock[slot].reduce((a, x) => a + x.q, 0); const real = i === 0 ? Math.max(0, teoric - 1 - Math.floor(r() * 2)) : teoric; return { slot, teoric, real }; }),
        puntComanda: D.PROD.filter(id => P(id).rot === 'A').map(id => ({ prod: id, consumDia: 3 + Math.floor(r() * 3), termini: 2 + Math.floor(r() * 3), seguretat: 2 })) };
    }
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
    const t = s.dia, N = E.nivell(s), err = [], bons = [], greus = [];
    res = Object.assign({ recepcio: {}, ubicacions: {}, picking: [], palets: [], carrega: {}, incidents: [], inventari: { recomptes: {}, comandes: {} }, fi: D.TORN_FI }, res || {});
    const k = { carregues: 0, recOk: 0, ubiOk: 0, ubicades: 0, linies: 0, liniesOk: 0, comandes: t.comandes.length, aTemps: 0, trencaments: 0, fefo: 0, incidents: res.incidents.length };
    // Recepció
    t.recepcions.forEach(rc => rc.carregues.forEach(c => {
      k.carregues++;
      const dec = res.recepcio[c.id], p = P(c.prod);
      if (!dec) { err.push(['recepcio', `No has revisat la càrrega ${p.nom} (${rc.proveidor}): s'ha quedat al moll.`]); return; }
      if (c.problema && dec === 'accepta') {
        const greu = c.problema === 'temperatura' || c.problema === 'dany';
        (greu ? greus : err).push(['recepcio', `Has acceptat ${p.nom} amb un problema: ${D.MOTIUS[c.problema].toLowerCase()}. ${c.problema === 'temperatura' ? 'S\'ha trencat la cadena de fred: s\'ha de llençar.' : c.problema === 'referencia' ? 'L\'albarà deia ' + P(c.albara).nom + '.' : ''}`]);
      } else if (!c.problema && dec !== 'accepta') err.push(['recepcio', `Has rebutjat ${p.nom}, que estava bé (${D.MOTIUS[dec] ? D.MOTIUS[dec].toLowerCase() : dec}). Ara en faltarà a l'estoc.`]);
      else if (c.problema && dec !== c.problema) { k.recOk += 0.5; err.push(['recepcio', `Has rebutjat bé ${p.nom}, però el motiu era «${D.MOTIUS[c.problema]}», no «${D.MOTIUS[dec] || dec}».`]); }
      else k.recOk++;
      // Ubicació de les acceptades
      if (dec === 'accepta') {
        const u = res.ubicacions[c.id];
        if (!u) { err.push(['ubicacio', `${p.nom}: l'has acceptat però no l'has ubicat. Per al sistema no és enlloc.`]); return; }
        k.ubicades++;
        const pr = E.problemesUbicacio(c.prod, u, { fixa: !N.lliure, nivellsRack: N.nivellsRack });
        const altre = (s.stock[u] || []).find(x => x.prod !== c.prod && x.q > 0);
        if (N.lliure && altre) pr.push('en aquesta ubicació ja hi ha ' + min(P(altre.prod).nom) + ': no barregis referències');
        if (pr.length) err.push(['ubicacio', `${p.nom} a ${u}: ${pr.join('; ')}.`]); else k.ubiOk++;
        if (!c.problema || c.problema === 'sobrant') { s.stock[u] = s.stock[u] || []; s.stock[u].push({ prod: c.prod, lot: c.lot, cad: c.cad || 9999, q: 1 }); }
      }
    }));
    // Picking i palets
    const perComanda = {};
    res.picking.forEach(pk => { (perComanda[pk.comanda] = perComanda[pk.comanda] || []).push(pk); });
    t.comandes.forEach(o => {
      const picks = perComanda[o.id] || [], cl = D.CLIENTS.find(c => c.id === o.client).nom, cam = t.camions.find(c => c.id === o.camio);
      o.linies.forEach(l => {
        k.linies++;
        const fets = picks.filter(x => x.prod === l.prod), q = fets.reduce((a, x) => a + x.q, 0);
        if (q === l.q) k.liniesOk++;
        else err.push(['picking', `${cl}: demanava ${l.q} de ${P(l.prod).nom} i n'has preparat ${q}.`]);
      });
      picks.filter(x => !o.linies.some(l => l.prod === x.prod)).forEach(x => err.push(['picking', `${cl}: has posat ${P(x.prod).nom}, que no era a la comanda.`]));
      // FEFO: el lot triat ha de ser el que caduca abans dels que hi havia
      picks.forEach(pk => {
        const lots = (s.stock[pk.slot] || []).filter(x => x.prod === pk.prod && x.q > 0).sort((a, b) => a.cad - b.cad);
        const triat = lots.find(x => x.lot === pk.lot);
        if (triat && lots[0] && triat.cad > lots[0].cad && P(pk.prod).cad) { k.fefo++; err.push(['fefo', `${P(pk.prod).nom}: has agafat el lot que caduca el ${E.data(triat.cad)} i hi havia el del ${E.data(lots[0].cad)}. Amb FEFO surt primer el que caduca abans.`]); }
        if (triat) triat.q = Math.max(0, triat.q - pk.q);
      });
      // Palet: muntatge i lliurament
      const pal = res.palets.find(x => x.comanda === o.id);
      if (!pal) { if (picks.length) err.push(['expedicio', `${cl}: has preparat la comanda però no l'has portada al moll.`]); else err.push(['expedicio', `${cl}: la comanda no s'ha preparat.`]); return; }
      const pila = pal.pila || [];
      for (let i = 0; i < pila.length; i++) {
        if (!P(pila[i]).fragil) continue;
        const aSobre = pila.slice(i + 1).find(x => P(x).pes >= 8 && !P(x).fragil);
        if (aSobre) { k.trencaments++; err.push(['trencament', `${cl}: has posat ${min(P(aSobre).nom)} a sobre de ${min(P(pila[i]).nom)}. El fràgil va a dalt: s'ha trencat.`]); break; }
      }
      if (pal.moll !== cam.moll) err.push(['expedicio', `${cl}: has deixat el palet al moll ${pal.moll} i el camió era al moll ${cam.moll}.`]);
      else if (pal.minut > cam.sortida) greus.push(['expedicio', `${cl}: el palet ha arribat al moll a les ${E.hora(pal.minut)} i el camió sortia a les ${E.hora(cam.sortida)}. La botiga no el rebrà fins demà.`]);
      else k.aTemps++;
    });
    // Ordre de càrrega (cap d'equip)
    if (N.tasques.includes('carrega')) t.camions.forEach(cam => {
      const ordre = res.carrega[cam.id] || [], esperat = cam.ruta.slice().reverse().map(cl => (t.comandes.find(o => o.client === cl && o.camio === cam.id) || {}).id).filter(Boolean);
      if (ordre.length && ordre.join() !== esperat.filter(id => ordre.includes(id)).join()) err.push(['carrega', `Camió del moll ${cam.moll}: l'ordre de càrrega no és l'invers del repartiment (${cam.ruta.map(c => D.CLIENTS.find(x => x.id === c).nom.replace('Botiga de ', '')).join(' → ')}). El primer que es descarrega ha d'anar a prop de la porta.`]);
    });
    // Incidents de seguretat
    const TXT = { xoc: 'Has xocat amb el transpalet o el toro anant de pressa.', caiguda: 'Se t\'ha caigut una càrrega anant de pressa: trencament.', sobreesforc: 'Has col·locat a mà una càrrega molt pesant en un nivell alt: risc de lesió.', bloqueig: 'Has deixat mercaderia davant de la sortida d\'emergència o al mig del passadís.', diagrama: 'Has intentat elevar més pes del que permet el diagrama de càrrega del toro: risc de bolcada.' };
    res.incidents.forEach(i => { (i.tipus === 'xoc' || i.tipus === 'diagrama' || i.tipus === 'bloqueig' ? greus : err).push(['seguretat', TXT[i.tipus] || i.tipus]); if (i.tipus === 'caiguda') k.trencaments++; });
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
    // Caducats a l'estoc (mermes)
    let caducats = 0;
    Object.keys(s.stock).forEach(slot => s.stock[slot].forEach(x => { if (x.q > 0 && P(x.prod).cad && x.cad <= t.dia) { caducats += x.q; x.q = 0; } }));
    if (caducats) err.push(['merma', `S'han fet malbé ${caducats} càrregues que han caducat a les prestatgeries. Amb FEFO no hauria passat.`]);
    Object.keys(s.stock).forEach(slot => { s.stock[slot] = s.stock[slot].filter(x => x.q > 0); });

    // Notes
    const tasques = k.carregues * 2 + k.linies + k.comandes + (t.inventari ? t.inventari.recomptes.length : 0);
    const fetes = k.recOk + k.ubiOk + k.liniesOk + k.aTemps + (t.inventari ? t.inventari.recomptes.filter(rc => res.inventari.recomptes[rc.slot] != null).length : 0);
    const marge = Math.max(0, (D.TORN_FI - (res.fi || D.TORN_FI)) / 60);
    const productivitat = Math.round(Math.min(100, fetes / Math.max(1, tasques) * 100 + marge * 4));
    const errQualitat = err.filter(e => e[0] !== 'seguretat').length + greus.filter(e => e[0] !== 'seguretat').length * 2;
    const qualitat = Math.max(0, 100 - errQualitat * 9);
    const seguretat = Math.max(0, 100 - res.incidents.reduce((a, i) => a + (['xoc', 'diagrama', 'bloqueig'].includes(i.tipus) ? 40 : 20), 0));
    const nota = Math.round(productivitat * D.PESOS_NOTA.productivitat + qualitat * D.PESOS_NOTA.qualitat + seguretat * D.PESOS_NOTA.seguretat);
    // La cap
    const bo = nota >= D.NOTA_BONA && !greus.length;
    let veredicte = 'regular';
    if (greus.length || nota < 55) { veredicte = 'bronca'; s.avisos++; s.tornsBons = 0; }
    else if (bo) { veredicte = 'bo'; s.tornsBons++; s.avisos = Math.max(0, s.avisos - 1); }
    else s.tornsBons = 0;
    let canvi = null;
    if (s.avisos >= D.AVISOS_ACOMIADAMENT) { canvi = 'acomiadament'; }
    else if (veredicte === 'bo' && s.tornsBons >= D.TORNS_ASCENS && s.nivell < D.NIVELLS.length) { canvi = 'ascens'; }
    const r = E.rngDe(s.config.llavor, 'frase' + s.torn);
    const h = { torn: s.torn, dia: t.dia, nivell: s.nivell, nota, productivitat, qualitat, seguretat, veredicte, canvi, frase: tria(r, D.FRASES[canvi === 'ascens' ? 'ascens' : canvi === 'acomiadament' ? 'acomiadament' : veredicte]).replace('{0}', canvi === 'ascens' ? D.NIVELLS[s.nivell].nom.toLowerCase() : ''),
      errors: err, greus, bons, kpi: Object.assign({}, k, { caducats, fi: res.fi, comandesATemps: k.comandes ? Math.round(k.aTemps / k.comandes * 100) : null, errorsPicking: k.linies ? Math.round((k.linies - k.liniesOk) / k.linies * 100) : null }), avisos: s.avisos };
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
