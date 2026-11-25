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

  /* ------------------------------------------------------------ Cuaderno de RA */
  const RAS = [
    {n: 1, t: {es: 'Organizar la superficie comercial', ca: 'Organitzar la superfície comercial'}, ca: 8, who: 'Jan'},
    {n: 2, t: {es: 'Colocar y reponer productos en el lineal', ca: 'Col·locar i reposar productes al lineal'}, ca: 8, who: 'Nil'},
    {n: 3, t: {es: 'Decoración, rotulación y cartelería', ca: 'Decoració, retolació i cartellisme'}, ca: 7, who: 'Laia'},
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

  return {promo, control, report, menu, tx, ra};
})();
