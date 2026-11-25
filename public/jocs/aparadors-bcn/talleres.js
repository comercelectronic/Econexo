/* Talleres de Dinamització del punt de venda (módulo 1231) dentro de Aparadors BCN.
   RA5: acción promocional (Núria) · RA6: control de resultados e informe (Ada).
   Usa las funciones globales del juego: show, sheet, saved, save, street, storyPanel.
   Todos los textos son {es, ca}; tx() elige el idioma guardado en saved.lang. */
window.Talleres = (() => {
  const lang = () => (typeof saved !== 'undefined' && saved.lang) || 'es';
  const tx = o => o == null ? '' : typeof o === 'string' ? o : (o[lang()] || o.es);
  const $ = id => document.getElementById(id);
  const eur = n => n.toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' €';
  const num = (n, d = 0) => n.toLocaleString('es-ES', {minimumFractionDigits: d, maximumFractionDigits: d});
  const ra = () => (saved.ra ||= {ca: {}});
  const pass = codes => { codes.forEach(c => ra().ca[c] = true); save() };

  /* ------------------------------------------------------------ RA5 · Acción promocional */
  const SCEN = {
    temporada: {t: {es: 'Fin de temporada', ca: 'Final de temporada'},
      d: {es: 'Quedan 120 abrigos y faltan cuatro semanas para la colección de primavera. Se venden 10 por semana.', ca: 'Queden 120 abrics i falten quatre setmanes per a la col·lecció de primavera. Se\'n venen 10 per setmana.'},
      prod: {es: 'abrigo', ca: 'abric'}, pv: 89, pc: 49, stock: 120, goal: 'liquidar', base: {paradas: 150, entradas: 55, tickets: 10, upt: 1}},
    captar: {t: {es: 'Pocos clientes nuevos', ca: 'Pocs clients nous'},
      d: {es: 'El 85 % de las compras son de clientas habituales. El barrio se renueva, pero los vecinos nuevos no entran.', ca: 'El 85 % de les compres són de clientes habituals. El barri es renova, però els veïns nous no hi entren.'},
      prod: {es: 'vestido', ca: 'vestit'}, pv: 65, pc: 31, stock: 90, goal: 'captar'},
    ticket: {t: {es: 'Ticket medio bajo', ca: 'Tiquet mitjà baix'},
      d: {es: 'Casi todas las clientas compran una sola prenda; los complementos apenas se venden.', ca: 'Gairebé totes les clientes compren una sola peça; els complements gairebé no es venen.'},
      prod: {es: 'look', ca: 'look'}, pv: 54, pc: 27, stock: 150, goal: 'ticket'}
  };
  const GOALS = {liquidar: {es: 'Liquidar stock y aumentar la rotación', ca: 'Liquidar estoc i augmentar la rotació'},
    captar: {es: 'Captar clientes nuevos', ca: 'Captar clients nous'},
    ticket: {es: 'Aumentar el ticket medio', ca: 'Augmentar el tiquet mitjà'},
    fidelizar: {es: 'Fidelizar a las clientas habituales', ca: 'Fidelitzar les clientes habituals'}};
  // fit: adecuación de cada técnica a cada objetivo (0-1); price: factor de precio; upt: unidades por ticket; cost: € por ticket
  const TECH = {
    descuento: {t: {es: 'Descuento directo (%)', ca: 'Descompte directe (%)'}, k: {es: 'Promoción de distribuidor al consumidor', ca: 'Promoció de distribuïdor al consumidor'}, fit: {liquidar: 1, captar: .4, ticket: .2, fidelizar: .2}, depth: true, upt: 1.05},
    segunda: {t: {es: '2.ª unidad al 50 %', ca: '2a unitat al 50 %'}, k: {es: 'Venta en lote', ca: 'Venda en lot'}, fit: {liquidar: .85, captar: .2, ticket: .8, fidelizar: .2}, price: .85, upt: 1.6},
    cupon: {t: {es: 'Cupón de bienvenida (-15 %)', ca: 'Cupó de benvinguda (-15 %)'}, k: {es: 'Cupón para primera compra', ca: 'Cupó per a la primera compra'}, fit: {liquidar: .3, captar: 1, ticket: .2, fidelizar: .3}, price: .93, upt: 1.05, fixed: 25},
    evento: {t: {es: 'Tarde de estilismo gratuita', ca: 'Tarda d\'estilisme gratuïta'}, k: {es: 'Relaciones públicas / animación', ca: 'Relacions públiques / animació'}, fit: {liquidar: .3, captar: .85, ticket: .5, fidelizar: .7}, price: 1, upt: 1.2, fixed: 120},
    pack: {t: {es: 'Pack look completo (-15 %)', ca: 'Pack look complet (-15 %)'}, k: {es: 'Venta cruzada', ca: 'Venda creuada'}, fit: {liquidar: .4, captar: .2, ticket: 1, fidelizar: .3}, price: .9, upt: 1.6, fixed: 20},
    regalo: {t: {es: 'Regalo a partir de 80 €', ca: 'Regal a partir de 80 €'}, k: {es: 'Regalo directo condicionado', ca: 'Regal directe condicionat'}, fit: {liquidar: .4, captar: .3, ticket: .85, fidelizar: .5}, price: 1, upt: 1.5, cost: 4},
    tarjeta: {t: {es: 'Tarjeta de fidelización', ca: 'Targeta de fidelització'}, k: {es: 'Programa de fidelización', ca: 'Programa de fidelització'}, fit: {liquidar: .1, captar: .3, ticket: .3, fidelizar: 1}, price: .97, upt: 1.05, fixed: 60}
  };
  const PSY = {
    psicologico: {t: {es: 'Precio psicológico (49,99 €)', ca: 'Preu psicològic (49,99 €)'}, fit: {liquidar: 1, captar: .6, ticket: .5}},
    escasez: {t: {es: 'Escasez y urgencia («solo hasta el domingo»)', ca: 'Escassetat i urgència («només fins diumenge»)'}, fit: {liquidar: 1, captar: .5, ticket: .4}},
    anclaje: {t: {es: 'Anclaje (precio anterior tachado)', ca: 'Ancoratge (preu anterior ratllat)'}, fit: {liquidar: .9, captar: .4, ticket: .6}},
    reciprocidad: {t: {es: 'Reciprocidad (un detalle de regalo)', ca: 'Reciprocitat (un detall de regal)'}, fit: {liquidar: .3, captar: 1, ticket: .8}},
    social: {t: {es: 'Prueba social («lo más vendido»)', ca: 'Prova social («el més venut»)'}, fit: {liquidar: .5, captar: .9, ticket: .9}}
  };
  const MEDIA = {
    cartel: {t: {es: 'Cartel PLV en tienda', ca: 'Cartell PLV a la botiga'}, c: 30, att: .05, ent: .02, conv: .08},
    vinilo: {t: {es: 'Vinilo en el escaparate', ca: 'Vinil a l\'aparador'}, c: 60, att: .25, ent: .08, conv: 0},
    redes: {t: {es: 'Redes sociales del barrio', ca: 'Xarxes socials del barri'}, c: 50, att: .12, ent: .05, conv: 0, pas: .06},
    flyers: {t: {es: 'Flyers en el barrio', ca: 'Flyers al barri'}, c: 80, att: .08, ent: .06, conv: 0, pas: .1},
    email: {t: {es: 'Email a clientas', ca: 'Correu a clientes'}, c: 10, att: .02, ent: .07, conv: .03},
    stopper: {t: {es: 'Stopper en el lineal', ca: 'Stopper al lineal'}, c: 25, att: 0, ent: 0, conv: .1}
  };
  const BUDGET = 250;

  function simulate(p) {
    const s = SCEN[p.scen], g = s.goal, tech = TECH[p.tech];
    const fitT = tech.fit[g] ?? .2, fitP = p.psy.length ? p.psy.reduce((v, k) => v + (PSY[k].fit[g] ?? .3), 0) / p.psy.length : .3;
    const med = p.media.map(k => MEDIA[k]), mcost = med.reduce((v, m) => v + m.c, 0);
    const base = {pasantes: 2600, paradas: 190, entradas: 88, tickets: 30, upt: 1.1, ...(s.base || {}), pv: s.pv, pc: s.pc};
    const depth = tech.depth ? p.depth / 100 : 0, price = tech.depth ? 1 - depth : tech.price;
    const quality = .55 * fitT + .25 * fitP + .2 * Math.min(1, med.length / 3);
    const sum = k => med.reduce((v, m) => v + (m[k] || 0), 0);
    const pasantes = Math.round(base.pasantes * (1 + sum('pas')));
    const liq = g === 'liquidar';
    const paradas = Math.round(pasantes * base.paradas / base.pasantes * (1 + sum('att') * (liq ? .6 : .4) + .15 * quality));
    const entradas = Math.round(paradas * base.entradas / base.paradas * (1 + sum('ent') * (liq ? .6 : .4) + .15 * quality * (g === 'captar' ? 1.2 : 1) * (fitT > .7 ? 1 : .4)));
    const convBoost = sum('conv') * (liq ? .6 : .3) + quality * (liq ? .3 : .12) + depth * (liq ? 1.6 : .6) - (depth > .4 ? (depth - .4) * 2 : 0);
    let tickets = Math.round(entradas * base.tickets / base.entradas * (1 + convBoost));
    let units = Math.round(tickets * (tech.upt || 1));
    units = Math.min(units, s.stock); tickets = Math.min(tickets, units);
    const pvE = +(s.pv * price).toFixed(2), ventas = +(units * pvE).toFixed(2), coste = units * s.pc;
    const promo = mcost + (tech.fixed || 0) + (tech.cost || 0) * tickets;
    const bUnits = Math.round(base.tickets * base.upt), bVentas = +(bUnits * s.pv * (g === 'ticket' ? .8 : 1)).toFixed(2);
    return {scen: p.scen, tech: p.tech, depth: p.depth, psy: p.psy, media: p.media, quality: +quality.toFixed(2), fitT,
      base: {pasantes: base.pasantes, paradas: base.paradas, entradas: base.entradas, tickets: base.tickets, unidades: bUnits, ventas: bVentas, margen: bVentas - bUnits * s.pc},
      sem: {pasantes, paradas, entradas, tickets, unidades: units, pv: pvE, pc: s.pc, ventas, coste, margen: +(ventas - coste).toFixed(2), promo, stockIni: s.stock, stockFin: s.stock - units}};
  }

  function promo(onDone) {
    const p = {scen: null, goal: null, tech: null, psy: [], media: [], depth: 25, weeks: 1};
    const head = '<p class="taller-ra">RA5 · ' + tx({es: 'Acciones promocionales', ca: 'Accions promocionals'}) + '</p>';
    const title = tx({es: 'Taller de promoción con Núria', ca: 'Taller de promoció amb la Núria'});
    const sub = tx({es: 'Boutique de Núria · Estilista', ca: 'Botiga de la Núria · Estilista'});
    function step1() {
      show(title, sub, head + '<h3>' + tx({es: '1. ¿Qué situación quieres resolver?', ca: '1. Quina situació vols resoldre?'}) + '</h3><div class="choices">' +
        Object.entries(SCEN).map(([k, s]) => '<button data-s="' + k + '"><b>' + tx(s.t) + '</b><br>' + tx(s.d) + '</button>').join('') + '</div>');
      sheet.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { p.scen = b.dataset.s; step2() });
    }
    function step2(msg) {
      const s = SCEN[p.scen];
      show(title, sub, head + '<p class="reply">' + tx(s.d) + '</p>' + (msg ? '<p class="reply bad">' + msg + '</p>' : '') + '<h3>' + tx({es: '2. ¿Qué objetivo comercial tiene la acción?', ca: '2. Quin objectiu comercial té l\'acció?'}) + '</h3><div class="choices">' +
        Object.entries(GOALS).map(([k, g]) => '<button data-g="' + k + '">' + tx(g) + '</button>').join('') + '</div>');
      sheet.querySelectorAll('[data-g]').forEach(b => b.onclick = () => {
        if (b.dataset.g !== s.goal) return step2(tx({es: 'Núria: «Eso estaría bien, pero no es lo que más me urge con estos datos. Vuelve a leer la situación».', ca: 'Núria: «Estaria bé, però no és el que més m\'urgeix amb aquestes dades. Torna a llegir la situació».'}));
        p.goal = s.goal; pass(['5.3']); step3();
      });
    }
    function step3() {
      show(title, sub, head + '<h3>' + tx({es: '3. Elige la técnica promocional', ca: '3. Tria la tècnica promocional'}) + '</h3><p>' + tx({es: 'Objetivo: ', ca: 'Objectiu: '}) + '<b>' + tx(GOALS[p.goal]) + '</b></p><div class="choices">' +
        Object.entries(TECH).map(([k, t]) => '<button data-t="' + k + '"><b>' + tx(t.t) + '</b> · <small>' + tx(t.k) + '</small></button>').join('') + '</div>');
      sheet.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { p.tech = b.dataset.t; pass(['5.1']); step4() });
    }
    function step4(msg) {
      const t = TECH[p.tech], cost = p.media.reduce((v, k) => v + MEDIA[k].c, 0) + (t.fixed || 0);
      show(title, sub, head + (msg ? '<p class="reply bad">' + msg + '</p>' : '') +
        '<h3>' + tx({es: '4. Técnicas psicológicas (elige dos)', ca: '4. Tècniques psicològiques (tria\'n dues)'}) + '</h3><div class="checks">' +
        Object.entries(PSY).map(([k, v]) => '<label><input type="checkbox" data-p="' + k + '"' + (p.psy.includes(k) ? ' checked' : '') + '> ' + tx(v.t) + '</label>').join('') + '</div>' +
        '<h3>' + tx({es: '5. Medios y presupuesto', ca: '5. Mitjans i pressupost'}) + ' (' + BUDGET + ' €)</h3><div class="checks">' +
        Object.entries(MEDIA).map(([k, m]) => '<label><input type="checkbox" data-m="' + k + '"' + (p.media.includes(k) ? ' checked' : '') + '> ' + tx(m.t) + ' · ' + m.c + ' €</label>').join('') + '</div>' +
        (t.fixed ? '<p><small>' + tx({es: 'Coste fijo de la técnica: ', ca: 'Cost fix de la tècnica: '}) + t.fixed + ' €</small></p>' : '') +
        (t.depth ? '<label class="field">' + tx({es: 'Descuento', ca: 'Descompte'}) + ' <input type="range" id="depth" min="5" max="60" step="5" value="' + p.depth + '"> <b id="dv">' + p.depth + ' %</b></label>' : '') +
        '<p id="cost"><b>' + tx({es: 'Coste', ca: 'Cost'}) + ': ' + cost + ' / ' + BUDGET + ' €</b></p><button class="primary" id="run">' + tx({es: 'Lanzar la promoción una semana', ca: 'Llançar la promoció una setmana'}) + '</button> <button id="back">' + tx({es: 'Cambiar técnica', ca: 'Canviar tècnica'}) + '</button>');
      const upd = () => { const c = p.media.reduce((v, k) => v + MEDIA[k].c, 0) + (t.fixed || 0); $('cost').innerHTML = '<b>' + tx({es: 'Coste', ca: 'Cost'}) + ': ' + c + ' / ' + BUDGET + ' €</b>'; $('cost').className = c > BUDGET ? 'bad' : '' };
      sheet.querySelectorAll('[data-p]').forEach(b => b.onchange = () => { p.psy = [...sheet.querySelectorAll('[data-p]:checked')].map(x => x.dataset.p) });
      sheet.querySelectorAll('[data-m]').forEach(b => b.onchange = () => { p.media = [...sheet.querySelectorAll('[data-m]:checked')].map(x => x.dataset.m); upd() });
      if ($('depth')) $('depth').oninput = e => { p.depth = +e.target.value; $('dv').textContent = p.depth + ' %' };
      $('back').onclick = step3;
      $('run').onclick = () => {
        const c = p.media.reduce((v, k) => v + MEDIA[k].c, 0) + (t.fixed || 0);
        if (p.psy.length !== 2) return step4(tx({es: 'Elige exactamente dos técnicas psicológicas.', ca: 'Tria exactament dues tècniques psicològiques.'}));
        if (!p.media.length) return step4(tx({es: 'Sin medios nadie se enterará de la promoción.', ca: 'Sense mitjans ningú no s\'assabentarà de la promoció.'}));
        if (c > BUDGET) return step4(tx({es: 'Te has pasado del presupuesto.', ca: 'T\'has passat del pressupost.'}));
        pass(['5.2', '5.4']); result(simulate(p));
      };
    }
    function result(r) {
      const s = SCEN[r.scen], good = r.fitT >= .8;
      if (good) pass(['5.5']);
      ra().promo = r; save();
      const row = (l, a, b) => '<tr><td>' + l + '</td><td>' + a + '</td><td><b>' + b + '</b></td></tr>';
      show(title, sub, head + '<h3>' + tx({es: 'Resultado de la semana', ca: 'Resultat de la setmana'}) + '</h3>' +
        '<table class="datos"><tr><th></th><th>' + tx({es: 'Semana normal', ca: 'Setmana normal'}) + '</th><th>' + tx({es: 'Con promoción', ca: 'Amb promoció'}) + '</th></tr>' +
        row(tx({es: 'Personas que pasan', ca: 'Persones que passen'}), num(r.base.pasantes), num(r.sem.pasantes)) +
        row(tx({es: 'Se paran ante el escaparate', ca: 'S\'aturen davant l\'aparador'}), num(r.base.paradas), num(r.sem.paradas)) +
        row(tx({es: 'Entran en la tienda', ca: 'Entren a la botiga'}), num(r.base.entradas), num(r.sem.entradas)) +
        row(tx({es: 'Tickets', ca: 'Tiquets'}), num(r.base.tickets), num(r.sem.tickets)) +
        row(tx({es: 'Unidades vendidas', ca: 'Unitats venudes'}), num(r.base.unidades), num(r.sem.unidades)) +
        row(tx({es: 'Ventas (sin IVA)', ca: 'Vendes (sense IVA)'}), eur(r.base.ventas), eur(r.sem.ventas)) +
        row(tx({es: 'Coste de la promoción', ca: 'Cost de la promoció'}), '—', eur(r.sem.promo)) + '</table>' +
        '<p class="reply' + (good ? '' : ' bad') + '">' + (good ? tx({es: 'Núria: «¡La técnica encaja con el objetivo! Ahora Ada querrá ver si ha sido rentable.»', ca: 'Núria: «La tècnica encaixa amb l\'objectiu! Ara l\'Ada voldrà veure si ha estat rendible.»'})
          : tx({es: 'Núria: «Ha venido gente, pero esta técnica no era la más adecuada para ', ca: 'Núria: «Ha vingut gent, però aquesta tècnica no era la més adequada per '}) + tx(GOALS[r.scen === 'temporada' ? 'liquidar' : SCEN[r.scen].goal]).toLowerCase() + '. ' + tx({es: 'Puedes repetir el taller.»', ca: 'Pots repetir el taller.»'})) + '</p>' +
        '<button class="primary" id="next">' + tx({es: 'Continuar', ca: 'Continuar'}) + '</button> <button id="again">' + tx({es: 'Repetir', ca: 'Repetir'}) + '</button>');
      $('again').onclick = () => promo(onDone);
      $('next').onclick = () => onDone ? onDone(r) : menu();
    }
    step1();
  }

  /* ------------------------------------------------------------ RA6 · Control e informe */
  function ratios(r) {
    const s = r.sem, b = r.base, mb = s.ventas - s.coste, stockMedio = (s.stockIni + s.stockFin) / 2;
    return [
      {k: 'atraccion', t: {es: 'Ratio de atracción', ca: 'Ràtio d\'atracció'}, f: {es: 'paradas ÷ personas que pasan × 100', ca: 'aturades ÷ persones que passen × 100'}, v: s.paradas / s.pasantes * 100, u: '%', ca: '6.1'},
      {k: 'entrada', t: {es: 'Ratio de entrada', ca: 'Ràtio d\'entrada'}, f: {es: 'entradas ÷ paradas × 100', ca: 'entrades ÷ aturades × 100'}, v: s.entradas / s.paradas * 100, u: '%', ca: '6.1'},
      {k: 'conversion', t: {es: 'Ratio de conversión', ca: 'Ràtio de conversió'}, f: {es: 'tickets ÷ entradas × 100', ca: 'tiquets ÷ entrades × 100'}, v: s.tickets / s.entradas * 100, u: '%', ca: '6.3'},
      {k: 'ticket', t: {es: 'Ticket medio', ca: 'Tiquet mitjà'}, f: {es: 'ventas ÷ tickets', ca: 'vendes ÷ tiquets'}, v: s.ventas / s.tickets, u: '€', ca: '6.3'},
      {k: 'margen', t: {es: 'Margen bruto', ca: 'Marge brut'}, f: {es: 'ventas − coste de las unidades vendidas', ca: 'vendes − cost de les unitats venudes'}, v: mb, u: '€', ca: '6.3'},
      {k: 'marca', t: {es: 'Tasa de marca', ca: 'Taxa de marca'}, f: {es: '(PV − PC) ÷ PV × 100, con el precio promocional', ca: '(PV − PC) ÷ PV × 100, amb el preu promocional'}, v: (s.pv - s.pc) / s.pv * 100, u: '%', ca: '6.3'},
      {k: 'stock', t: {es: 'Stock medio (unidades)', ca: 'Estoc mitjà (unitats)'}, f: {es: '(stock inicial + stock final) ÷ 2', ca: '(estoc inicial + estoc final) ÷ 2'}, v: stockMedio, u: 'u', ca: '6.3'},
      {k: 'rotacion', t: {es: 'Rotación del stock (semana)', ca: 'Rotació de l\'estoc (setmana)'}, f: {es: 'unidades vendidas ÷ stock medio', ca: 'unitats venudes ÷ estoc mitjà'}, v: s.unidades / stockMedio, u: '', ca: '6.3'},
      {k: 'rentab', t: {es: 'Rentabilidad bruta', ca: 'Rendibilitat bruta'}, f: {es: 'margen bruto ÷ (stock medio × PC) × 100', ca: 'marge brut ÷ (estoc mitjà × PC) × 100'}, v: mb / (stockMedio * s.pc) * 100, u: '%', ca: '6.3'},
      {k: 'roi', t: {es: 'ROI de la promoción', ca: 'ROI de la promoció'}, f: {es: '(margen bruto − margen semana normal − coste promoción) ÷ coste promoción × 100', ca: '(marge brut − marge setmana normal − cost promoció) ÷ cost promoció × 100'}, v: (mb - b.margen - s.promo) / s.promo * 100, u: '%', ca: '6.2'}
    ];
  }

  function control(onDone) {
    const r = ra().promo;
    const title = tx({es: 'Cuadro de mando con Ada', ca: 'Quadre de comandament amb l\'Ada'}), sub = tx({es: 'Ada · Analista de Prisma', ca: 'Ada · Analista de Prisma'});
    const head = '<p class="taller-ra">RA6 · ' + tx({es: 'Control de las acciones de marketing', ca: 'Control de les accions de marxandatge'}) + '</p>';
    if (!r) { show(title, sub, head + '<p>' + tx({es: 'Ada: «Sin datos no hay informe. Primero lanza una promoción con Núria y mide una semana.»', ca: 'Ada: «Sense dades no hi ha informe. Primer llança una promoció amb la Núria i mesura una setmana.»'}) + '</p><button class="primary" id="go">' + tx({es: 'Ir al taller de promoción', ca: 'Anar al taller de promoció'}) + '</button>'); $('go').onclick = () => promo(() => control(onDone)); return }
    const R = ratios(r), s = r.sem, answers = {};
    const datos = '<table class="datos"><tr><td>' + tx({es: 'Personas que pasan', ca: 'Persones que passen'}) + '</td><td>' + num(s.pasantes) + '</td><td>' + tx({es: 'Paradas', ca: 'Aturades'}) + '</td><td>' + num(s.paradas) + '</td></tr>' +
      '<tr><td>' + tx({es: 'Entradas', ca: 'Entrades'}) + '</td><td>' + num(s.entradas) + '</td><td>' + tx({es: 'Tickets', ca: 'Tiquets'}) + '</td><td>' + num(s.tickets) + '</td></tr>' +
      '<tr><td>' + tx({es: 'Unidades vendidas', ca: 'Unitats venudes'}) + '</td><td>' + num(s.unidades) + '</td><td>' + tx({es: 'Ventas', ca: 'Vendes'}) + '</td><td>' + eur(s.ventas) + '</td></tr>' +
      '<tr><td>PV ' + tx({es: 'promocional', ca: 'promocional'}) + '</td><td>' + eur(s.pv) + '</td><td>PC</td><td>' + eur(s.pc) + '</td></tr>' +
      '<tr><td>' + tx({es: 'Stock inicial', ca: 'Estoc inicial'}) + '</td><td>' + num(s.stockIni) + '</td><td>' + tx({es: 'Stock final', ca: 'Estoc final'}) + '</td><td>' + num(s.stockFin) + '</td></tr>' +
      '<tr><td>' + tx({es: 'Margen semana normal', ca: 'Marge setmana normal'}) + '</td><td>' + eur(r.base.margen) + '</td><td>' + tx({es: 'Coste promoción', ca: 'Cost promoció'}) + '</td><td>' + eur(s.promo) + '</td></tr></table>';
    function calc() {
      show(title, sub, head + '<p>' + tx({es: 'Ada: «Calcula tú misma los indicadores. Si los números cuadran, los presentaré en la asamblea.»', ca: 'Ada: «Calcula tu mateixa els indicadors. Si els números quadren, els presentaré a l\'assemblea.»'}) + '</p>' + datos +
        '<div class="ratios">' + R.map((x, i) => '<label class="ratio" data-i="' + i + '"><span><b>' + tx(x.t) + '</b><small>' + tx(x.f) + '</small></span><input inputmode="decimal" data-i="' + i + '" value="' + (answers[i] ?? '') + '" placeholder="' + (x.u || '×') + '"><em></em></label>').join('') + '</div>' +
        '<p><small>' + tx({es: 'Redondea a dos decimales. Se acepta un margen de error del 2 %.', ca: 'Arrodoneix a dos decimals. S\'accepta un marge d\'error del 2 %.'}) + '</small></p><button class="primary" id="check">' + tx({es: 'Comprobar', ca: 'Comprovar'}) + '</button>');
      $('check').onclick = () => {
        let ok = 0;
        sheet.querySelectorAll('.ratio input').forEach(inp => {
          const i = +inp.dataset.i, v = parseFloat(String(inp.value).replace(/\s|€|%/g, '').replace(',', '.')); answers[i] = inp.value;
          const real = R[i].v, good = isFinite(v) && Math.abs(v - real) <= Math.max(.02, Math.abs(real) * .02);
          inp.parentNode.classList.toggle('ok', good); inp.parentNode.classList.toggle('ko', !good && inp.value !== '');
          inp.nextElementSibling.textContent = good ? '✓' : inp.value === '' ? '' : '✗'; if (good) ok++;
        });
        if (ok === R.length) { pass(['6.1', '6.2', '6.3']); verdict(); }
        else if (!$('hint')) $('check').insertAdjacentHTML('afterend', '<p id="hint" class="reply">' + tx({es: 'Revisa las que están en rojo. Fíjate en qué dato va en el numerador y cuál en el denominador.', ca: 'Revisa les que estan en vermell. Fixa\'t en quina dada va al numerador i quina al denominador.'}) + '</p>');
      };
    }
    // La eficacia se mide contra el objetivo de la acción; el ROI indica a qué precio se ha conseguido.
    function objective() {
      const g = SCEN[r.scen].goal, b = r.base;
      if (g === 'liquidar') return {g, label: {es: 'Stock vendido en la semana', ca: 'Estoc venut en la setmana'}, v: s.unidades / s.stockIni * 100, target: 25,
        why: {es: 'Para vaciar 120 abrigos en cuatro semanas hay que vender al menos un 25 % cada semana.', ca: 'Per buidar 120 abrics en quatre setmanes cal vendre almenys un 25 % cada setmana.'}};
      if (g === 'captar') return {g, label: {es: 'Aumento de entradas', ca: 'Augment d\'entrades'}, v: (s.entradas / b.entradas - 1) * 100, target: 40,
        why: {es: 'Núria quería al menos un 40 % más de personas dentro de la tienda.', ca: 'La Núria volia almenys un 40 % més de persones dins la botiga.'}};
      return {g, label: {es: 'Aumento del ticket medio', ca: 'Augment del tiquet mitjà'}, v: (s.ventas / s.tickets / (b.ventas / b.tickets) - 1) * 100, target: 20,
        why: {es: 'Núria quería subir el ticket medio al menos un 20 %.', ca: 'La Núria volia pujar el tiquet mitjà almenys un 20 %.'}};
    }
    function verdict(msg) {
      const o = objective(), roi = R[9].v, effective = o.v >= o.target;
      show(title, sub, head + (msg ? '<p class="reply bad">' + msg + '</p>' : '') + '<h3>' + tx({es: '¿Ha sido eficaz la promoción?', ca: 'Ha estat eficaç la promoció?'}) + '</h3>' +
        '<p>' + tx({es: 'Objetivo: ', ca: 'Objectiu: '}) + '<b>' + tx(GOALS[o.g]) + '</b>. ' + tx(o.why) + '</p>' +
        '<table class="datos"><tr><td>' + tx(o.label) + '</td><td><b>' + num(o.v, 1) + ' %</b></td><td>' + tx({es: 'meta', ca: 'fita'}) + ' ≥ ' + o.target + ' %</td></tr>' +
        '<tr><td>ROI</td><td><b>' + num(roi, 1) + ' %</b></td><td></td></tr><tr><td>' + tx({es: 'Rotación', ca: 'Rotació'}) + '</td><td><b>' + num(R[7].v, 2) + '</b></td><td></td></tr></table><div class="choices">' +
        '<button data-v="1">' + tx({es: 'Eficaz: el indicador del objetivo supera la meta.', ca: 'Eficaç: l\'indicador de l\'objectiu supera la fita.'}) + '</button>' +
        '<button data-v="0">' + tx({es: 'No eficaz: el indicador del objetivo no llega a la meta.', ca: 'No eficaç: l\'indicador de l\'objectiu no arriba a la fita.'}) + '</button>' +
        '<button data-v="2">' + tx({es: 'Eficaz, porque se han parado más personas ante el escaparate.', ca: 'Eficaç, perquè s\'han aturat més persones davant l\'aparador.'}) + '</button></div>');
      sheet.querySelectorAll('[data-v]').forEach(b => b.onclick = () => {
        const v = b.dataset.v;
        if (v === '2') return verdict(tx({es: 'Ada: «Las paradas miden atención, no el objetivo de esta acción. ¿Qué indicador lo mide?»', ca: 'Ada: «Les aturades mesuren atenció, no l\'objectiu d\'aquesta acció. Quin indicador el mesura?»'}));
        if ((v === '1') !== effective) return verdict(tx({es: 'Ada: «Compara el indicador con la meta otra vez.»', ca: 'Ada: «Compara l\'indicador amb la fita una altra vegada.»'}));
        pass(['6.4']); corrective(effective, roi);
      });
    }
    function corrective(effective, roi) {
      const opts = effective
        ? [{t: roi < 0 ? {es: 'Mantener la acción hasta cumplir el objetivo, pero reducir los medios más caros porque el ROI es negativo, y volver a medir.', ca: 'Mantenir l\'acció fins a complir l\'objectiu, però reduir els mitjans més cars perquè el ROI és negatiu, i tornar a mesurar.'}
             : {es: 'Repetir la acción en el próximo cambio de temporada y medir cada mes con las mismas ratios.', ca: 'Repetir l\'acció al proper canvi de temporada i mesurar cada mes amb les mateixes ràtios.'}, ok: true},
           {t: {es: 'Dejar de medir: ya sabemos que funciona.', ca: 'Deixar de mesurar: ja sabem que funciona.'}, ok: false},
           {t: {es: 'Duplicar el descuento la próxima vez.', ca: 'Duplicar el descompte la propera vegada.'}, ok: false}]
        : [{t: {es: 'Reducir medios caros, ajustar la técnica al objetivo y volver a medir.', ca: 'Reduir mitjans cars, ajustar la tècnica a l\'objectiu i tornar a mesurar.'}, ok: true},
           {t: {es: 'Subir el descuento hasta el 60 %.', ca: 'Pujar el descompte fins al 60 %.'}, ok: false},
           {t: {es: 'No hacer nunca más promociones.', ca: 'No fer mai més promocions.'}, ok: false}];
      show(title, sub, head + '<h3>' + tx({es: '¿Qué medida propones?', ca: 'Quina mesura proposes?'}) + '</h3><div class="choices">' + opts.map((o, i) => '<button data-o="' + i + '">' + tx(o.t) + '</button>').join('') + '</div><p id="r" class="reply" hidden></p>');
      sheet.querySelectorAll('[data-o]').forEach(b => b.onclick = () => {
        const o = opts[+b.dataset.o];
        if (!o.ok) { $('r').hidden = false; $('r').textContent = tx({es: 'Ada: «Eso no se apoya en los datos que has calculado.»', ca: 'Ada: «Això no es recolza en les dades que has calculat.»'}); return }
        pass(['6.5']); ra().informe = {fecha: new Date().toISOString().slice(0, 10), ratios: Object.fromEntries(R.map(x => [x.k, +x.v.toFixed(2)])), eficaz: effective, medida: tx(o.t), escenario: r.scen, tecnica: r.tech}; save();
        report(onDone);
      });
    }
    calc();
  }

  function report(onDone) {
    const inf = ra().informe; if (!inf) return control(onDone);
    const R = ratios(ra().promo);
    show(tx({es: 'Informe de la promoción', ca: 'Informe de la promoció'}), 'RA6 · ' + inf.fecha,
      '<div class="informe"><p><b>' + tx(SCEN[inf.escenario].t) + '</b> · ' + tx(TECH[inf.tecnica].t) + '</p><table class="datos">' +
      R.map(x => '<tr><td>' + tx(x.t) + '</td><td><b>' + num(x.v, 2) + ' ' + x.u + '</b></td></tr>').join('') + '</table>' +
      '<p>' + tx({es: 'Conclusión: ', ca: 'Conclusió: '}) + '<b>' + (inf.eficaz ? tx({es: 'promoción eficaz', ca: 'promoció eficaç'}) : tx({es: 'la promoción no alcanza su objetivo', ca: 'la promoció no assoleix el seu objectiu'})) + '</b>. ' + inf.medida + '</p></div>' +
      '<button class="primary" id="next">' + tx({es: 'Continuar', ca: 'Continuar'}) + '</button> <button id="print">' + tx({es: 'Imprimir', ca: 'Imprimir'}) + '</button>');
    $('print').onclick = () => window.print();
    $('next').onclick = () => onDone ? onDone(inf) : menu();
  }

  /* ------------------------------------------------------------ RA2 · Lineal y planograma (Nil) */
  const PROD = [
    {k: 'A', n: {es: 'Café en grano de la casa 250 g', ca: 'Cafè en gra de la casa 250 g'}, v: 40, m: 3.2, fam: 'cafe', peso: 1, c: '#7b4a2e'},
    {k: 'B', n: {es: 'Café molido 250 g', ca: 'Cafè mòlt 250 g'}, v: 30, m: 2.5, fam: 'cafe', peso: 1, c: '#9a6a44'},
    {k: 'C', n: {es: 'Descafeinado 250 g', ca: 'Descafeïnat 250 g'}, v: 8, m: 2.4, fam: 'cafe', peso: 1, c: '#c49a6c'},
    {k: 'D', n: {es: 'Saco de café 1 kg', ca: 'Sac de cafè 1 kg'}, v: 12, m: 6, fam: 'cafe', peso: 4, c: '#5b3a24'},
    {k: 'E', n: {es: 'Cafetera italiana', ca: 'Cafetera italiana'}, v: 4, m: 9, fam: 'acc', peso: 2, c: '#8d9aa6'},
    {k: 'F', n: {es: 'Filtros de papel', ca: 'Filtres de paper'}, v: 18, m: .9, fam: 'acc', peso: 1, c: '#e8dcc0'},
    {k: 'G', n: {es: 'Bombones de café', ca: 'Bombons de cafè'}, v: 22, m: 1.8, fam: 'dulce', peso: 1, c: '#b0413e'},
    {k: 'H', n: {es: 'Taza edición barrio', ca: 'Tassa edició barri'}, v: 1, m: 4, fam: 'acc', peso: 2, c: '#3f7f8c'}
  ];
  const FAM = {cafe: {es: 'Café', ca: 'Cafè'}, acc: {es: 'Accesorios', ca: 'Accessoris'}, dulce: {es: 'Dulces (impulso)', ca: 'Dolços (impuls)'}};
  const LEVELS = [{n: {es: 'Cabeza', ca: 'Cap'}, f: .55}, {n: {es: 'Ojos', ca: 'Ulls'}, f: 1}, {n: {es: 'Manos', ca: 'Mans'}, f: .85}, {n: {es: 'Suelo', ca: 'Terra'}, f: .45}];
  const COLS = 6, PER_FACING = 8;

  function lineal(onDone) {
    const title = tx({es: 'El lineal de Nil', ca: 'El lineal d\'en Nil'}), sub = tx({es: 'Cafetería y tienda de café · Nil', ca: 'Cafeteria i botiga de cafè · Nil'});
    const head = '<p class="taller-ra">RA2 · ' + tx({es: 'Colocar, exponer y reponer productos', ca: 'Col·locar, exposar i reposar productes'}) + '</p>';
    const P = k => PROD.find(p => p.k === k);
    const table = list => '<table class="datos"><tr><th></th><th>' + tx({es: 'Producto', ca: 'Producte'}) + '</th><th>' + tx({es: 'Ventas/semana', ca: 'Vendes/setmana'}) + '</th><th>' + tx({es: 'Margen/u', ca: 'Marge/u'}) + '</th><th>' + tx({es: 'Peso', ca: 'Pes'}) + '</th></tr>' +
      list.map(p => '<tr><td><span class="sw" style="background:' + p.c + '">' + p.k + '</span></td><td>' + tx(p.n) + '</td><td>' + p.v + '</td><td>' + eur(p.m) + '</td><td>' + (p.peso >= 4 ? tx({es: 'pesado', ca: 'pesant'}) : p.peso + ' kg') + '</td></tr>').join('') + '</table>';
    function s1(msg) { // 2.1 dimensiones del surtido
      show(title, sub, head + '<p>' + tx({es: 'Nil: «Prisma dice que mi estantería es un caos. Ayúdame a ordenarla antes de que vengan a hacer fotos.»', ca: 'Nil: «Prisma diu que la meva prestatgeria és un caos. Ajuda\'m a endreçar-la abans que vinguin a fer fotos.»'}) + '</p>' + table(PROD) + (msg ? '<p class="reply bad">' + msg + '</p>' : '') +
        '<h3>' + tx({es: '1. El surtido tiene tres familias y la de café, cuatro referencias. ¿Cómo se describe?', ca: '1. L\'assortiment té tres famílies i la de cafè, quatre referències. Com es descriu?'}) + '</h3><div class="choices">' +
        [[0, {es: 'Amplitud 3 (familias) y profundidad 4 en café (referencias de esa familia).', ca: 'Amplitud 3 (famílies) i profunditat 4 en cafè (referències d\'aquesta família).'}],
         [1, {es: 'Amplitud 8 (referencias) y profundidad 3 (familias).', ca: 'Amplitud 8 (referències) i profunditat 3 (famílies).'}],
         [2, {es: 'Profundidad 3 y amplitud 4.', ca: 'Profunditat 3 i amplitud 4.'}]].map(([i, t]) => '<button data-a="' + i + '">' + tx(t) + '</button>').join('') + '</div>');
      sheet.querySelectorAll('[data-a]').forEach(b => b.onclick = () => b.dataset.a === '0' ? (pass(['2.1']), s2()) : s1(tx({es: 'La amplitud cuenta familias o líneas; la profundidad, referencias dentro de cada una.', ca: 'L\'amplitud compta famílies o línies; la profunditat, referències dins de cadascuna.'})));
    }
    function s2(msg) { // 2.2 umbral de supresión
      show(title, sub, head + table(PROD) + (msg ? '<p class="reply bad">' + msg + '</p>' : '') + '<h3>' + tx({es: '2. El lineal solo tiene 24 frontales. Nil fija el umbral de supresión en 2 ventas por semana. ¿Qué referencia retiras?', ca: '2. El lineal només té 24 frontals. En Nil fixa el llindar de supressió en 2 vendes per setmana. Quina referència retires?'}) + '</h3><div class="choices">' +
        PROD.map(p => '<button data-p="' + p.k + '">' + p.k + ' · ' + tx(p.n) + '</button>').join('') + '</div>');
      sheet.querySelectorAll('[data-p]').forEach(b => b.onclick = () => b.dataset.p === 'H' ? (pass(['2.2']), s3()) : s2(b.dataset.p === 'E'
        ? tx({es: 'La cafetera vende poco pero supera el umbral y deja mucho margen.', ca: 'La cafetera ven poc però supera el llindar i deixa molt de marge.'})
        : tx({es: 'Esa referencia supera el umbral de 2 ventas semanales.', ca: 'Aquesta referència supera el llindar de 2 vendes setmanals.'})));
    }
    function s3(msg) { // 2.5 familias
      const list = PROD.filter(p => p.k !== 'H');
      show(title, sub, head + (msg ? '<p class="reply bad">' + msg + '</p>' : '') + '<h3>' + tx({es: '3. Clasifica cada referencia en su familia', ca: '3. Classifica cada referència en la seva família'}) + '</h3><div class="ratios">' +
        list.map(p => '<label class="ratio"><span><span class="sw" style="background:' + p.c + '">' + p.k + '</span> ' + tx(p.n) + '</span><select data-f="' + p.k + '"><option value="">—</option>' + Object.entries(FAM).map(([k, f]) => '<option value="' + k + '">' + tx(f) + '</option>').join('') + '</select><em></em></label>').join('') + '</div><button class="primary" id="ok">' + tx({es: 'Comprobar', ca: 'Comprovar'}) + '</button>');
      $('ok').onclick = () => {
        let bad = 0; sheet.querySelectorAll('[data-f]').forEach(s => { const good = s.value === P(s.dataset.f).fam; s.parentNode.classList.toggle('ok', good); s.parentNode.classList.toggle('ko', !good); if (!good) bad++ });
        if (!bad) { pass(['2.5']); setTimeout(s4, 400) } else if (!$('hint')) $('ok').insertAdjacentHTML('afterend', '<p id="hint" class="reply">' + tx({es: 'Los bombones se compran por impulso: no son café ni accesorio.', ca: 'Els bombons es compren per impuls: no són cafè ni accessori.'}) + '</p>');
      };
    }
    const grid = Array.from({length: 4}, () => Array(COLS).fill(''));
    let brush = 'A';
    function evaluate() {
      const facings = {}, levels = {};
      grid.forEach((row, l) => row.forEach(k => { if (!k) return; facings[k] = (facings[k] || 0) + 1; (levels[k] ||= []).push(l) }));
      let sales = 0, profit = 0, lost = 0; const rows = [];
      for (const p of PROD.filter(p => p.k !== 'H')) {
        const f = facings[p.k] || 0, lv = levels[p.k] || [];
        const vis = f ? lv.reduce((v, l) => v + LEVELS[l].f, 0) / lv.length : 0;
        const demand = p.v * vis * (1 + Math.min(.15, (f - 1) * .03));
        const cap = f * PER_FACING, sold = Math.min(demand, cap); lost += demand - sold;
        sales += sold; profit += sold * p.m; rows.push({p, f, sold: Math.round(sold), cap, rupt: demand > cap});
      }
      const tot = PROD.filter(p => p.k !== 'H').reduce((v, p) => v + p.v, 0), used = Object.values(facings).reduce((a, b) => a + b, 0);
      const checks = [
        [PROD.filter(p => p.k !== 'H').every(p => facings[p.k] >= 1), tx({es: 'Lineal mínimo: todas las referencias con al menos un frontal', ca: 'Lineal mínim: totes les referències amb almenys un frontal'})],
        [!facings.H, tx({es: 'La referencia suprimida no ocupa espacio', ca: 'La referència suprimida no ocupa espai'})],
        [(levels.D || []).every(l => l === 3) && !!levels.D, tx({es: 'Productos pesados en el nivel suelo', ca: 'Productes pesants al nivell terra'})],
        [(levels.A || []).includes(1), tx({es: 'El más vendido y rentable a la altura de los ojos', ca: 'El més venut i rendible a l\'altura dels ulls'})],
        [(levels.G || []).some(l => l === 1 || l === 2), tx({es: 'Producto de impulso al alcance (ojos o manos)', ca: 'Producte d\'impuls a l\'abast (ulls o mans)'})],
        [rows.every(r => !r.rupt), tx({es: 'Sin roturas de stock: frontales proporcionales a las ventas', ca: 'Sense trencaments d\'estoc: frontals proporcionals a les vendes'})]
      ];
      return {rows, sales, profit, lost, used, tot, checks};
    }
    function s4(sim) { // 2.3, 2.4, 2.6, 2.8 editor del lineal
      const r = sim ? evaluate() : null;
      show(title, sub, head + '<h3>' + tx({es: '4. Monta el lineal (4 niveles × 6 frontales)', ca: '4. Munta el lineal (4 nivells × 6 frontals)'}) + '</h3><p><small>' + tx({es: 'Elige un producto y toca los huecos. Cada frontal guarda 8 unidades y Nil repone una vez por semana.', ca: 'Tria un producte i toca els buits. Cada frontal guarda 8 unitats i en Nil reposa una vegada per setmana.'}) + '</small></p>' +
        '<div class="brush">' + PROD.map(p => '<button data-b="' + p.k + '" class="' + (brush === p.k ? 'on' : '') + '" title="' + tx(p.n) + '"><span class="sw" style="background:' + p.c + '">' + p.k + '</span> ' + p.v + '/s</button>').join('') + '<button data-b="" class="' + (brush === '' ? 'on' : '') + '">' + tx({es: 'Vaciar', ca: 'Buidar'}) + '</button></div>' +
        '<div class="shelf">' + grid.map((row, l) => '<div class="lvl"><b>' + tx(LEVELS[l].n) + '</b>' + row.map((k, c) => '<button data-c="' + l + ',' + c + '" style="' + (k ? 'background:' + P(k).c + ';color:#fff' : '') + '">' + (k || '') + '</button>').join('') + '</div>').join('') + '</div>' +
        (r ? '<table class="datos">' + r.rows.map(x => '<tr><td>' + x.p.k + ' · ' + tx(x.p.n) + '</td><td>' + x.f + ' ' + tx({es: 'frontales', ca: 'frontals'}) + '</td><td>' + x.sold + ' u</td><td>' + (x.rupt ? '<b class="bad">' + tx({es: 'Rotura de stock', ca: 'Trencament d\'estoc'}) + '</b>' : '✓') + '</td></tr>').join('') +
          '<tr><td><b>' + tx({es: 'Beneficio bruto semanal', ca: 'Benefici brut setmanal'}) + '</b></td><td></td><td colspan="2"><b>' + eur(r.profit) + '</b> · ' + tx({es: 'ventas perdidas', ca: 'vendes perdudes'}) + ': ' + Math.round(r.lost) + ' u</td></tr></table>' +
          '<div class="checklist">' + r.checks.map(([ok, t]) => '<p class="' + (ok ? '' : 'bad') + '">' + (ok ? '✓ ' : '✗ ') + t + '</p>').join('') + '</div>' : '') +
        '<button class="primary" id="sim">' + tx({es: 'Simular una semana', ca: 'Simular una setmana'}) + '</button>' + (r && r.checks.every(c => c[0]) ? ' <button class="primary" id="next">' + tx({es: 'Continuar', ca: 'Continuar'}) + '</button>' : ''));
      sheet.querySelectorAll('[data-b]').forEach(b => b.onclick = () => { brush = b.dataset.b; s4(sim) });
      sheet.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { const [l, c] = b.dataset.c.split(',').map(Number); grid[l][c] = brush; s4(false) });
      $('sim').onclick = () => { pass(['2.3', '2.4']); s4(true) };
      if ($('next')) $('next').onclick = () => { pass(['2.6', '2.8']); s5() };
    }
    function s5(msg) { // 2.7 interpretar un planograma
      const plan = [['C', 'C', 'F', 'F', 'D', 'D'], ['E', 'B', 'B', 'G', 'G', 'C'], ['A', 'A', 'B', 'B', 'F', 'F'], ['A', 'A', 'A', 'E', 'D', 'D']];
      show(title, sub, head + '<h3>' + tx({es: '5. Prisma ha enviado este planograma para otra tienda. ¿Cuál es su error más grave?', ca: '5. Prisma ha enviat aquest planograma per a una altra botiga. Quin és l\'error més greu?'}) + '</h3>' +
        '<div class="shelf small">' + plan.map((row, l) => '<div class="lvl"><b>' + tx(LEVELS[l].n) + '</b>' + row.map(k => '<span style="background:' + P(k).c + '">' + k + '</span>').join('') + '</div>').join('') + '</div>' + (msg ? '<p class="reply bad">' + msg + '</p>' : '') + '<div class="choices">' +
        [[0, {es: 'Los sacos de 1 kg (D) están en el nivel cabeza: es peligroso y difícil de coger.', ca: 'Els sacs d\'1 kg (D) són al nivell cap: és perillós i difícil d\'agafar.'}],
         [1, {es: 'Los filtros (F) deberían estar en el nivel ojos.', ca: 'Els filtres (F) haurien de ser al nivell ulls.'}],
         [2, {es: 'Hay demasiados frontales de café molido (B).', ca: 'Hi ha massa frontals de cafè mòlt (B).'}]].map(([i, t]) => '<button data-x="' + i + '">' + tx(t) + '</button>').join('') + '</div>');
      sheet.querySelectorAll('[data-x]').forEach(b => b.onclick = () => {
        if (b.dataset.x !== '0') return s5(tx({es: 'Fíjate en la seguridad y en el peso de cada referencia según el nivel.', ca: 'Fixa\'t en la seguretat i en el pes de cada referència segons el nivell.'}));
        pass(['2.7']); ra().lineal = {fecha: new Date().toISOString().slice(0, 10), profit: +evaluate().profit.toFixed(2)}; save();
        show(title, sub, head + '<p class="reply">' + tx({es: 'Nil: «Ahora el café que más vendo está donde la gente mira, y no me quedo sin bombones el viernes. Prisma no podrá decir que esto es un caos.»', ca: 'Nil: «Ara el cafè que més venc és on la gent mira, i no em quedo sense bombons el divendres. Prisma no podrà dir que això és un caos.»'}) + '</p><button class="primary" id="next">' + tx({es: 'Continuar', ca: 'Continuar'}) + '</button>');
        $('next').onclick = () => onDone ? onDone() : menu();
      });
    }
    s1();
  }

  /* ------------------------------------------------------------ RA1 · Superficie comercial (Jan) */
  const GW = 8, GH = 6, DOOR = [5, 5], EXIT = [0, 0], EXT = [7, 0];
  const ITEMS = {
    C: {n: {es: 'Caja', ca: 'Caixa'}, c: '#183e3a', max: 1},
    G: {n: {es: 'Góndola de lámparas', ca: 'Góndola de llums'}, c: '#9a6a44', max: 10},
    N: {n: {es: 'Bombillas (compra habitual)', ca: 'Bombetes (compra habitual)'}, c: '#e0a53a', max: 1},
    X: {n: {es: 'Expositor de novedades', ca: 'Expositor de novetats'}, c: '#9667bc', max: 2},
    L: {n: {es: 'Foco de acento', ca: 'Focus d\'accent'}, c: '#ffd36b', max: 3}
  };
  function tienda(onDone) {
    const title = tx({es: 'La tienda de Jan', ca: 'La botiga d\'en Jan'}), sub = tx({es: 'Lámparas y diseño · Jan', ca: 'Llums i disseny · Jan'});
    const head = '<p class="taller-ra">RA1 · ' + tx({es: 'Organizar la superficie comercial', ca: 'Organitzar la superfície comercial'}) + '</p>';
    const quiz = (q, opts, okIdx, wrong, ca, next) => {
      const draw = msg => {
        show(title, sub, head + (msg ? '<p class="reply bad">' + msg + '</p>' : '') + '<h3>' + tx(q) + '</h3><div class="choices">' + opts.map((t, i) => '<button data-q="' + i + '">' + tx(t) + '</button>').join('') + '</div>');
        sheet.querySelectorAll('[data-q]').forEach(b => b.onclick = () => +b.dataset.q === okIdx ? (pass(ca), next()) : draw(tx(wrong)));
      }; draw();
    };
    function s1() { // 1.5 barreras
      const B = [{t: {es: 'Escalón de 15 cm en la entrada', ca: 'Graó de 15 cm a l\'entrada'}, fix: {es: 'Rampa con poca pendiente', ca: 'Rampa amb poc pendent'}},
                 {t: {es: 'Puerta de cristal pesada y cerrada', ca: 'Porta de vidre pesada i tancada'}, fix: {es: 'Puerta abierta o automática', ca: 'Porta oberta o automàtica'}},
                 {t: {es: 'Escaparate tapado que no deja ver el interior', ca: 'Aparador tapat que no deixa veure l\'interior'}, fix: {es: 'Interior visible e iluminado desde la calle', ca: 'Interior visible i il·luminat des del carrer'}},
                 {t: {es: 'Vendedor esperando en la puerta', ca: 'Venedor esperant a la porta'}, fix: {es: 'Saludar desde dentro y dejar mirar con calma', ca: 'Saludar des de dins i deixar mirar amb calma'}}];
      show(title, sub, head + '<p>' + tx({es: 'Jan: «La gente mira mis lámparas desde fuera pero no entra.» Elige una solución para cada barrera física o psicológica.', ca: 'Jan: «La gent mira els meus llums des de fora però no entra.» Tria una solució per a cada barrera física o psicològica.'}) + '</p><div class="ratios">' +
        B.map((b, i) => '<label class="ratio"><span>' + tx(b.t) + '</span><select data-i="' + i + '"><option value="">—</option>' + B.map((x, j) => '<option value="' + j + '">' + tx(x.fix) + '</option>').join('') + '</select><em></em></label>').join('') + '</div><button class="primary" id="ok">' + tx({es: 'Comprobar', ca: 'Comprovar'}) + '</button>');
      $('ok').onclick = () => { let bad = 0; sheet.querySelectorAll('[data-i]').forEach(s => { const g = s.value === s.dataset.i; s.parentNode.classList.toggle('ok', g); s.parentNode.classList.toggle('ko', !g); bad += !g }); if (!bad) { pass(['1.5']); setTimeout(s2, 400) } };
    }
    const plan = Array.from({length: GH}, () => Array(GW).fill(''));
    let brush = 'G';
    const fixed = (x, y) => (x === DOOR[0] && y === DOOR[1]) ? '⇩' : (x === EXIT[0] && y === EXIT[1]) ? '⇧' : (x === EXT[0] && y === EXT[1]) ? '🧯' : '';
    function heat() {
      const H = plan.map((row, y) => row.map((k, x) => {
        if (k || fixed(x, y)) return null;
        let h = .95 - .55 * Math.hypot(x - DOOR[0], y - DOOR[1]) / 6 + (x >= 4 ? .1 : -.18);
        plan.forEach((r, yy) => r.forEach((it, xx) => { const d = Math.hypot(x - xx, y - yy);
          if (it === 'N' && d <= 2.3) h += .45 * (1 - d / 3); if (it === 'L' && d <= 1.6) h += .28; if (it === 'X' && d <= 1.6) h += .18; if (it === 'C' && d <= 1.2) h += .12 }));
        return Math.max(0, Math.min(1, h));
      }));
      return H;
    }
    function reach() {
      const seen = new Set(), q = [DOOR.join(',')]; seen.add(q[0]);
      while (q.length) { const [x, y] = q.shift().split(',').map(Number);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy, key = nx + ',' + ny;
          if (nx < 0 || ny < 0 || nx >= GW || ny >= GH || seen.has(key) || plan[ny][nx]) continue; seen.add(key); q.push(key) } }
      return seen;
    }
    function checks() {
      const H = heat(), R = reach(), cells = [];
      plan.forEach((r, y) => r.forEach((k, x) => k && cells.push({k, x, y})));
      const near = (c, set) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => set.has((c.x + dx) + ',' + (c.y + dy)));
      const count = k => cells.filter(c => c.k === k).length, C = cells.find(c => c.k === 'C'), N = cells.find(c => c.k === 'N');
      const free = []; H.forEach((r, y) => r.forEach((h, x) => h !== null && free.push(h)));
      return [
        [count('G') >= 4 && count('C') === 1 && count('N') === 1, tx({es: 'Mobiliario completo: caja, bombillas y al menos 4 góndolas', ca: 'Mobiliari complet: caixa, bombetes i almenys 4 góndoles'}), '1.2'],
        [!!C && Math.hypot(C.x - DOOR[0], C.y - DOOR[1]) <= 2.3, tx({es: 'Caja junto a la salida', ca: 'Caixa al costat de la sortida'}), '1.2'],
        [!!N && N.y <= 1, tx({es: 'Producto de compra habitual al fondo: obliga a recorrer la tienda', ca: 'Producte de compra habitual al fons: obliga a recórrer la botiga'}), '1.6'],
        [free.length && Math.min(...free) >= .3, tx({es: 'Ninguna zona fría sin calentar (mapa de calor)', ca: 'Cap zona freda sense escalfar (mapa de calor)'}), '1.4'],
        [cells.every(c => near(c, R)) && [...R].filter(k => { const [x, y] = k.split(',').map(Number); return !fixed(x, y) }).length === free.length, tx({es: 'Circulación fluida: todos los pasillos y muebles accesibles desde la entrada', ca: 'Circulació fluida: tots els passadissos i mobles accessibles des de l\'entrada'}), '1.6'],
        [R.has('1,0') || R.has('0,1'), tx({es: 'Salida de emergencia despejada', ca: 'Sortida d\'emergència lliure'}), '1.8'],
        [R.has('6,0') || R.has('7,1'), tx({es: 'Extintor accesible', ca: 'Extintor accessible'}), '1.8']
      ];
    }
    function s2(sim) {
      const H = sim ? heat() : null, ck = sim ? checks() : null;
      const color = h => 'hsl(' + Math.round(220 - 220 * h) + ',70%,' + (62 - 10 * h) + '%)';
      show(title, sub, head + '<h3>' + tx({es: 'Plano de la tienda', ca: 'Plànol de la botiga'}) + '</h3><p><small>' + tx({es: 'Cada casilla mide 1,20 m. ⇩ entrada · ⇧ salida de emergencia · 🧯 extintor. Elige un elemento y toca el plano; simula para ver el mapa de calor de 30 clientes.', ca: 'Cada casella fa 1,20 m. ⇩ entrada · ⇧ sortida d\'emergència · 🧯 extintor. Tria un element i toca el plànol; simula per veure el mapa de calor de 30 clients.'}) + '</small></p>' +
        '<div class="brush">' + Object.entries(ITEMS).map(([k, it]) => '<button data-b="' + k + '" class="' + (brush === k ? 'on' : '') + '"><span class="sw" style="background:' + it.c + '">' + k + '</span> ' + tx(it.n) + '</button>').join('') + '<button data-b="" class="' + (brush === '' ? 'on' : '') + '">' + tx({es: 'Borrar', ca: 'Esborrar'}) + '</button></div>' +
        '<div class="floorplan">' + plan.map((row, y) => row.map((k, x) => { const f = fixed(x, y);
          return '<button data-c="' + x + ',' + y + '"' + (f ? ' disabled' : '') + ' style="' + (k ? 'background:' + ITEMS[k].c + ';color:#fff' : H && H[y][x] !== null ? 'background:' + color(H[y][x]) : '') + '">' + (f || k) + '</button>' }).join('')).join('') + '</div>' +
        (ck ? '<div class="checklist">' + ck.map(([ok, t]) => '<p class="' + (ok ? '' : 'bad') + '">' + (ok ? '✓ ' : '✗ ') + t + '</p>').join('') + '</div>' : '') +
        '<button class="primary" id="sim">' + tx({es: 'Simular 30 clientes', ca: 'Simular 30 clients'}) + '</button>' + (ck && ck.every(c => c[0]) ? ' <button class="primary" id="next">' + tx({es: 'Continuar', ca: 'Continuar'}) + '</button>' : ''));
      sheet.querySelectorAll('[data-b]').forEach(b => b.onclick = () => { brush = b.dataset.b; s2(sim) });
      sheet.querySelectorAll('[data-c]').forEach(b => b.onclick = () => {
        const [x, y] = b.dataset.c.split(',').map(Number);
        if (brush && plan.flat().filter(k => k === brush).length >= ITEMS[brush].max && plan[y][x] !== brush) return;
        plan[y][x] = brush; s2(false);
      });
      $('sim').onclick = () => s2(true);
      if ($('next')) $('next').onclick = () => { pass(['1.2', '1.4', '1.6', '1.8']); s3() };
    }
    const s3 = () => quiz({es: 'Has puesto las bombillas al fondo y focos en la zona fría. ¿Qué técnica de merchandising es?', ca: 'Has posat les bombetes al fons i focus a la zona freda. Quina tècnica de marxandatge és?'},
      [{es: 'Calentar puntos fríos con productos imán y animación', ca: 'Escalfar punts freds amb productes imant i animació'}, {es: 'Cross merchandising', ca: 'Cross merchandising'}, {es: 'Venta a granel', ca: 'Venda a granel'}], 0,
      {es: 'Piensa en para qué sirve el mapa de calor.', ca: 'Pensa per a què serveix el mapa de calor.'}, ['1.3'], s4);
    const s4 = () => quiz({es: 'Jan agrupa el suelo por familias (sobremesa, techo, pie). ¿Qué ventaja e inconveniente tiene?', ca: 'En Jan agrupa el terra per famílies (sobretaula, sostre, peu). Quin avantatge i inconvenient té?'},
      [{es: 'El cliente encuentra antes lo que busca, pero recorre menos tienda y compra menos por impulso.', ca: 'El client troba abans el que busca, però recorre menys botiga i compra menys per impuls.'},
       {es: 'No tiene inconvenientes.', ca: 'No té inconvenients.'}, {es: 'Obliga a duplicar el stock de cada familia.', ca: 'Obliga a duplicar l\'estoc de cada família.'}], 0,
      {es: 'Toda distribución tiene ventajas e inconvenientes para la circulación.', ca: 'Tota distribució té avantatges i inconvenients per a la circulació.'}, ['1.7'], s5);
    const s5 = () => quiz({es: 'Jan quiere sacar un expositor y un toldo a la acera. ¿Qué necesita?', ca: 'En Jan vol treure un expositor i un tendal a la vorera. Què necessita?'},
      [{es: 'Nada, si es pequeño y lo retira por la noche.', ca: 'Res, si és petit i el retira a la nit.'},
       {es: 'Pedir al Ayuntamiento la autorización de ocupación de la vía pública y pagar la tasa; el toldo, además, según la normativa municipal.', ca: 'Demanar a l\'Ajuntament l\'autorització d\'ocupació de la via pública i pagar la taxa; el tendal, a més, segons la normativa municipal.'},
       {es: 'Solo el permiso de la comunidad de vecinos.', ca: 'Només el permís de la comunitat de veïns.'}], 1,
      {es: 'La acera es espacio público: lo regula el Ayuntamiento.', ca: 'La vorera és espai públic: ho regula l\'Ajuntament.'}, ['1.1'], () => {
        ra().tienda = {fecha: new Date().toISOString().slice(0, 10)}; save();
        show(title, sub, head + '<p class="reply">' + tx({es: 'Jan: «Ahora la gente entra, da la vuelta entera y descubre las lámparas del fondo. Esto una pantalla no lo hace.»', ca: 'Jan: «Ara la gent entra, fa la volta sencera i descobreix els llums del fons. Això una pantalla no ho fa.»'}) + '</p><button class="primary" id="next">' + tx({es: 'Continuar', ca: 'Continuar'}) + '</button>');
        $('next').onclick = () => onDone ? onDone() : menu();
      });
    s1();
  }

  /* ------------------------------------------------------------ RA3 · Cartelería y PLV (Laia) */
  const MONTHS = {es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
                  ca: ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre']};
  const CAMP = [[{es: 'Reyes y rebajas de invierno', ca: 'Reis i rebaixes d\'hivern'}, 0], [{es: 'San Valentín', ca: 'Sant Valentí'}, 1], [{es: 'Sant Jordi', ca: 'Sant Jordi'}, 3],
                [{es: 'Día de la Madre', ca: 'Dia de la Mare'}, 4], [{es: 'Vuelta al cole', ca: 'Tornada a l\'escola'}, 8], [{es: 'Black Friday', ca: 'Black Friday'}, 10], [{es: 'Navidad', ca: 'Nadal'}, 11]];
  const FONTS = {serif: {f: 'Georgia, serif', n: {es: 'Serif (Georgia)', ca: 'Serif (Georgia)'}}, sans: {f: 'Helvetica, Arial, sans-serif', n: {es: 'Sans serif (Helvetica)', ca: 'Sans serif (Helvetica)'}},
                 script: {f: '"Brush Script MT", "Segoe Script", cursive', n: {es: 'Manuscrita (script)', ca: 'Manuscrita (script)'}}, display: {f: 'Impact, "Arial Black", sans-serif', n: {es: 'Display (Impact)', ca: 'Display (Impact)'}}};
  const STYLE = {'#111111': {es: 'Negro', ca: 'Negre'}, '#fbf7ef': {es: 'Blanco roto', ca: 'Blanc trencat'}, '#b3262d': {es: 'Rojo rosa', ca: 'Vermell rosa'}, '#e9d8b8': {es: 'Arena', ca: 'Sorra'}};
  function lum(hex) { const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2] }
  const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05) };

  function carteles(onDone) {
    const title = tx({es: 'El estudio de Laia', ca: 'L\'estudi de la Laia'}), sub = tx({es: 'Fotografía · Laia', ca: 'Fotografia · Laia'});
    const head = '<p class="taller-ra">RA3 · ' + tx({es: 'Decoración, rotulación y cartelería', ca: 'Decoració, retolació i cartellisme'}) + '</p>';
    const L = lang(), M = MONTHS[L] || MONTHS.es;
    function s1() { // 3.1 planificación anual
      show(title, sub, head + '<p>' + tx({es: 'Laia: «Prisma cambia la pantalla cada día. Yo quiero un calendario: decorar la tienda en el momento justo de cada campaña.»', ca: 'Laia: «Prisma canvia la pantalla cada dia. Jo vull un calendari: decorar la botiga en el moment just de cada campanya.»'}) + '</p><h3>' + tx({es: '1. ¿En qué mes empieza cada campaña?', ca: '1. En quin mes comença cada campanya?'}) + '</h3><div class="ratios">' +
        CAMP.map(([n], i) => '<label class="ratio"><span>' + tx(n) + '</span><select data-m="' + i + '"><option value="">—</option>' + M.map((m, j) => '<option value="' + j + '">' + m + '</option>').join('') + '</select><em></em></label>').join('') + '</div><button class="primary" id="ok">' + tx({es: 'Comprobar', ca: 'Comprovar'}) + '</button>');
      $('ok').onclick = () => { let bad = 0; sheet.querySelectorAll('[data-m]').forEach(s => { const g = +s.value === CAMP[+s.dataset.m][1] && s.value !== ''; s.parentNode.classList.toggle('ok', g); s.parentNode.classList.toggle('ko', !g); bad += !g }); if (!bad) { pass(['3.1']); setTimeout(s2, 400) } };
    }
    function s2() { // 3.3 tipografías
      const eff = [['serif', {es: 'Tradición, calidad, confianza', ca: 'Tradició, qualitat, confiança'}], ['sans', {es: 'Modernidad, claridad, legibilidad', ca: 'Modernitat, claredat, llegibilitat'}],
                   ['script', {es: 'Emoción, cercanía, regalo', ca: 'Emoció, proximitat, regal'}], ['display', {es: 'Impacto, urgencia, oferta', ca: 'Impacte, urgència, oferta'}]];
      show(title, sub, head + '<h3>' + tx({es: '2. ¿Qué efecto produce cada tipografía en el cliente?', ca: '2. Quin efecte produeix cada tipografia en el client?'}) + '</h3><div class="ratios">' +
        eff.map(([k]) => '<label class="ratio"><span style="font-family:' + FONTS[k].f + ';font-size:22px">' + tx(FONTS[k].n) + '</span><select data-t="' + k + '"><option value="">—</option>' + eff.map(([kk, e]) => '<option value="' + kk + '">' + tx(e) + '</option>').join('') + '</select><em></em></label>').join('') + '</div><button class="primary" id="ok">' + tx({es: 'Comprobar', ca: 'Comprovar'}) + '</button>');
      $('ok').onclick = () => { let bad = 0; sheet.querySelectorAll('[data-t]').forEach(s => { const g = s.value === s.dataset.t; s.parentNode.classList.toggle('ok', g); s.parentNode.classList.toggle('ko', !g); bad += !g }); if (!bad) { pass(['3.3']); setTimeout(s3, 400) } };
    }
    const c = {titular: '', precio: '', beneficio: '', font: 'sans', bg: '#fbf7ef', fg: '#111111', accent: '#b3262d', size: 44, plv: ''};
    function s3() { // 3.2, 3.4, 3.5, 3.6 editor de carteles
      const words = c.titular.trim().split(/\s+/).filter(Boolean).length;
      const ck = [
        [words >= 2 && words <= 6, tx({es: 'Titular breve (de 2 a 6 palabras)', ca: 'Titular breu (de 2 a 6 paraules)'})],
        [/\d/.test(c.precio), tx({es: 'Precio visible', ca: 'Preu visible'})],
        [c.beneficio.trim().length >= 8, tx({es: 'Beneficio para el cliente', ca: 'Benefici per al client'})],
        [contrast(c.bg, c.fg) >= 4.5, tx({es: 'Contraste suficiente entre fondo y texto', ca: 'Contrast suficient entre fons i text'}) + ' (' + num(contrast(c.bg, c.fg), 1) + ':1)'],
        [c.size >= 40, tx({es: 'Jerarquía: el titular domina el cartel', ca: 'Jerarquia: el titular domina el cartell'})],
        [['script', 'serif'].includes(c.font), tx({es: 'Tipografía coherente con una campaña emocional (Sant Jordi)', ca: 'Tipografia coherent amb una campanya emocional (Sant Jordi)'})],
        [c.plv === 'escaparate', tx({es: 'Soporte adecuado: cartel para el escaparate de la calle', ca: 'Suport adequat: cartell per a l\'aparador del carrer'})]
      ];
      const opt = (id, obj, val) => '<select id="' + id + '">' + Object.entries(obj).map(([k, v]) => '<option value="' + k + '"' + (k === val ? ' selected' : '') + '>' + tx(v.n || v) + '</option>').join('') + '</select>';
      show(title, sub, head + '<h3>' + tx({es: '3. Cartel de Sant Jordi: «Retrato con rosa, sesión de 15 minutos, 25 €»', ca: '3. Cartell de Sant Jordi: «Retrat amb rosa, sessió de 15 minuts, 25 €»'}) + '</h3><p><small>' + tx({es: 'Libro de estilo de Laia: negro, blanco roto, rojo rosa y arena.', ca: 'Llibre d\'estil de la Laia: negre, blanc trencat, vermell rosa i sorra.'}) + '</small></p>' +
        '<div class="poster-wrap"><div class="poster" style="background:' + c.bg + ';color:' + c.fg + ';font-family:' + FONTS[c.font].f + (c.font === 'script' ? ';font-style:italic' : '') + '"><div style="font-size:' + c.size + 'px;line-height:1.05">' + (c.titular || '…').replace(/</g, '&lt;') + '</div><div class="pr" style="color:' + c.accent + '">' + c.precio.replace(/</g, '&lt;') + '</div><div class="bf">' + c.beneficio.replace(/</g, '&lt;') + '</div></div>' +
        '<div class="poster-form"><label class="field">' + tx({es: 'Titular', ca: 'Titular'}) + ' <input id="titular" value="' + c.titular.replace(/"/g, '&quot;') + '"></label><label class="field">' + tx({es: 'Precio', ca: 'Preu'}) + ' <input id="precio" value="' + c.precio.replace(/"/g, '&quot;') + '"></label><label class="field">' + tx({es: 'Beneficio', ca: 'Benefici'}) + ' <input id="beneficio" value="' + c.beneficio.replace(/"/g, '&quot;') + '"></label>' +
        '<label class="field">' + tx({es: 'Tipografía', ca: 'Tipografia'}) + ' ' + opt('font', FONTS, c.font) + '</label><label class="field">' + tx({es: 'Fondo', ca: 'Fons'}) + ' ' + opt('bg', STYLE, c.bg) + '</label><label class="field">' + tx({es: 'Texto', ca: 'Text'}) + ' ' + opt('fg', STYLE, c.fg) + '</label><label class="field">' + tx({es: 'Precio en', ca: 'Preu en'}) + ' ' + opt('accent', STYLE, c.accent) + '</label>' +
        '<label class="field">' + tx({es: 'Tamaño del titular', ca: 'Mida del titular'}) + ' <input type="range" id="size" min="20" max="64" value="' + c.size + '"></label>' +
        '<label class="field">' + tx({es: 'Dónde irá', ca: 'On anirà'}) + ' ' + opt('plv', {'': {es: '—', ca: '—'}, escaparate: {es: 'Cartel en el escaparate', ca: 'Cartell a l\'aparador'}, stopper: {es: 'Stopper en el lineal', ca: 'Stopper al lineal'}, colgante: {es: 'Colgante del techo', ca: 'Penjoll del sostre'}, display: {es: 'Display de mostrador', ca: 'Display de taulell'}}, c.plv) + '</label></div></div>' +
        '<div class="checklist">' + ck.map(([ok, t]) => '<p class="' + (ok ? '' : 'bad') + '">' + (ok ? '✓ ' : '✗ ') + t + '</p>').join('') + '</div>' + (ck.every(x => x[0]) ? '<button class="primary" id="next">' + tx({es: 'Imprimir y colgar', ca: 'Imprimir i penjar'}) + '</button>' : ''));
      ['titular', 'precio', 'beneficio'].forEach(k => $(k).onchange = e => { c[k] = e.target.value; s3() });
      ['font', 'bg', 'fg', 'accent', 'plv'].forEach(k => $(k).onchange = e => { c[k] = e.target.value; s3() });
      $('size').onchange = e => { c.size = +e.target.value; s3() };
      if ($('next')) $('next').onclick = () => { pass(['3.2', '3.4', '3.5', '3.6']); ra().cartel = {...c}; save(); s4() };
    }
    function s4(msg) { // 3.7 montaje seguro
      show(title, sub, head + (msg ? '<p class="reply bad">' + msg + '</p>' : '') + '<h3>' + tx({es: '4. Hay que colgar la guirnalda de rosas a 2,8 m de altura. ¿Cómo lo hacéis?', ca: '4. Cal penjar la garlanda de roses a 2,8 m d\'alçada. Com ho feu?'}) + '</h3><div class="choices">' +
        [[0, {es: 'Con una silla del estudio, que es más rápido.', ca: 'Amb una cadira de l\'estudi, que és més ràpid.'}],
         [1, {es: 'Con escalera de tijera homologada, abierta del todo, otra persona sujetándola y anclajes adecuados al techo.', ca: 'Amb escala de tisora homologada, oberta del tot, una altra persona aguantant-la i ancoratges adequats al sostre.'}],
         [2, {es: 'Desde el mostrador, con cinta adhesiva.', ca: 'Des del taulell, amb cinta adhesiva.'}]].map(([i, t]) => '<button data-s="' + i + '">' + tx(t) + '</button>').join('') + '</div>');
      sheet.querySelectorAll('[data-s]').forEach(b => b.onclick = () => b.dataset.s === '1' ? (pass(['3.7']), done()) : s4(tx({es: 'Laia: «¡Ni hablar! La prevención de riesgos laborales también va con la decoración.»', ca: 'Laia: «Ni parlar-ne! La prevenció de riscos laborals també va amb la decoració.»'})));
    }
    function done() {
      show(title, sub, head + '<p class="reply">' + tx({es: 'Laia: «El cartel se lee desde la otra acera y la guirnalda está bien sujeta. El domingo vendrá todo el barrio a hacerse fotos.»', ca: 'Laia: «El cartell es llegeix des de l\'altra vorera i la garlanda està ben subjecta. Diumenge vindrà tot el barri a fer-se fotos.»'}) + '</p><button class="primary" id="next">' + tx({es: 'Continuar', ca: 'Continuar'}) + '</button>');
      $('next').onclick = () => onDone ? onDone() : menu();
    }
    s1();
  }

  /* ------------------------------------------------------------ Cuaderno de RA */
  const RAS = [
    {n: 1, t: {es: 'Organizar la superficie comercial', ca: 'Organitzar la superfície comercial'}, ca: 8, who: 'Jan', open: () => tienda()},
    {n: 2, t: {es: 'Colocar y reponer productos en el lineal', ca: 'Col·locar i reposar productes al lineal'}, ca: 8, who: 'Nil', open: () => lineal()},
    {n: 3, t: {es: 'Decoración, rotulación y cartelería', ca: 'Decoració, retolació i cartellisme'}, ca: 7, who: 'Laia', open: () => carteles()},
    {n: 4, t: {es: 'Montar escaparates', ca: 'Muntar aparadors'}, ca: 8, who: tx({es: 'Encargos', ca: 'Encàrrecs'})},
    {n: 5, t: {es: 'Acciones promocionales', ca: 'Accions promocionals'}, ca: 5, who: 'Núria', open: () => promo()},
    {n: 6, t: {es: 'Control de las acciones', ca: 'Control de les accions'}, ca: 5, who: 'Ada', open: () => ra().informe ? report() : control()}
  ];
  // Los CA del RA4 (y parte del RA3) se obtienen de los encargos de escaparates y de la historia.
  function derive() {
    const jobs = Object.values(saved.jobs || {}), c = ra().ca, st = saved.campanya || {};
    if (jobs.length) ['4.5', '4.6', '4.7', '3.4'].forEach(k => c[k] = true);
    if (new Set(jobs.map(j => j.design && j.design.j)).size >= 3) c['4.8'] = true;
    if (new Set(jobs.map(j => j.design && j.design.i)).size >= 5) c['4.1'] = true;
    if (Object.keys(st.pruebas || {}).length) c['4.4'] = true;
    if (Object.keys(st.apoyos || {}).length >= 2) { c['4.2'] = true; c['4.3'] = true }
    if (jobs.some(j => (j.design?.pieces || []).some(p => p.k === 'cartel' && p.text && p.text !== 'Campaña'))) c['3.5'] = true;
  }
  function menu() {
    derive(); const got = ra().ca;
    show(tx({es: 'Cuaderno de RA', ca: 'Quadern de RA'}), tx({es: 'Dinamización del punto de venta · Módulo 1231', ca: 'Dinamització del punt de venda · Mòdul 1231'}),
      '<div class="ras">' + RAS.map(x => {
        const done = Array.from({length: x.ca}, (_, k) => x.n + '.' + (k + 1)).filter(c => got[c]);
        const live = x.open || x.n === 4;
        return '<div class="card"><b>RA' + x.n + ' · ' + tx(x.t) + '</b> <small>(' + x.who + ')</small><div class="cas">' +
          Array.from({length: x.ca}, (_, k) => '<span class="' + (got[x.n + '.' + (k + 1)] ? 'on' : '') + '">' + x.n + '.' + (k + 1) + '</span>').join('') + '</div>' +
          (x.open ? '<button data-ra="' + x.n + '">' + tx({es: 'Abrir taller', ca: 'Obrir taller'}) + '</button>' : live ? '<small>' + tx({es: 'Se trabaja con los encargos de escaparates.', ca: 'Es treballa amb els encàrrecs d\'aparadors.'}) + '</small>' : '<small>' + tx({es: 'Próximamente', ca: 'Properament'}) + '</small>') +
          ' <small>' + done.length + ' / ' + x.ca + ' CA</small></div>';
      }).join('') + '</div>');
    sheet.querySelectorAll('[data-ra]').forEach(b => b.onclick = () => RAS.find(x => x.n === +b.dataset.ra).open());
  }

  // Taller que cada vecino ofrece tras convencerle en la historia.
  const byNpc = {4: {label: {es: 'Ayudar a Núria con una promoción (RA5)', ca: 'Ajudar la Núria amb una promoció (RA5)'}, open: promo, done: () => !!ra().promo},
                 2: {label: {es: 'Preparar la campaña de Sant Jordi de Laia (RA3)', ca: 'Preparar la campanya de Sant Jordi de la Laia (RA3)'}, open: carteles, done: () => !!ra().cartel},
                 3: {label: {es: 'Reorganizar la tienda de Jan (RA1)', ca: 'Reorganitzar la botiga d\'en Jan (RA1)'}, open: tienda, done: () => !!ra().tienda},
                 5: {label: {es: 'Ordenar el lineal de Nil (RA2)', ca: 'Endreçar el lineal d\'en Nil (RA2)'}, open: lineal, done: () => !!ra().lineal}};
  return {promo, control, report, lineal, tienda, carteles, menu, tx, ra, byNpc};
})();
