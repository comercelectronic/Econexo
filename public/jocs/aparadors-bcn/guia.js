/* Guia constant d'Aparadors BCN.
   - Objectiu actual sempre visible (panell sota el minimapa), amb llista de progrés i botó «Porta-m'hi».
   - Columna de llum al carrer 3D i estrella al minimapa sobre el lloc on cal anar.
   - Si la Lia està quieta una estona, recorda l'objectiu.
   - Pròleg de la història i escenes d'inici de capítol que expliquen què passa i per què.
   Llegeix l'estat del joc (story, saved, actors, S, stores…) i no el modifica, excepte els indicadors de les escenes vistes. */
window.Guia = (() => {
  const tx = o => window.Talleres ? Talleres.tx(o) : (o && o.es) || o;
  const $ = id => document.getElementById(id);
  const ST = () => (typeof story !== 'undefined' ? story : null);
  const nm = id => neighbours[id][0];
  const shopName = i => stores[i][0];
  const zoneOf = i => zones[Math.floor((window.Barcelona3D ? Barcelona3D.SLOT[i] : i) / 6)];
  const hasJob = i => Object.values(saved.jobs || {}).some(j => j.design && j.design.i === i);
  const done = id => !!(window.Talleres && Talleres.byNpc[id]?.done());
  const firmable = [4, 2, 3, 5];     // Núria primer: la seva promoció és la base de l'informe

  /* ---------------------------------------------------------------- objectiu actual */
  function objective() {
    const st = ST(), mode = saved.modeChosen;
    if (!st || mode === 'free' || mode === 'solo') {
      if (mode === 'solo') return {t: {es: 'Misión suelta: abre el menú «RA» y elige un resultado de aprendizaje.', ca: 'Missió solta: obre el menú «RA» i tria un resultat d\'aprenentatge.'}, act: () => Missions.menu()};
      const i = S.map(s => s.i).filter(i => !saved.seen.includes(i)).sort((a, b) => dist(player, entry(S[a])) - dist(player, entry(S[b])))[0];
      return i == null ? {t: {es: 'Paseo libre: completa encargos en las tiendas que más te gusten.', ca: 'Passeig lliure: completa encàrrecs a les botigues que més t\'agradin.'}}
        : {t: {es: 'Paseo libre: visita ' + shopName(i) + ' (' + zoneOf(i) + ').', ca: 'Passeig lliure: visita ' + shopName(i) + ' (' + zoneOf(i) + ').'}, shop: i};
    }
    if (st.fase === 0) return {t: {es: 'Habla con Joan: Prisma le ha dejado una carta bajo la persiana.', ca: 'Parla amb en Joan: Prisma li ha deixat una carta sota la persiana.'}, npc: 0, chap: 0};
    if (st.fase === 1) {
      const sub = [4, 9].map(i => [!!st.pruebas[i], {es: 'Ensayo en ' + shopName(i), ca: 'Assaig a ' + shopName(i)}]);
      if (!(saved.ra && saved.ra.estudio) && !hasJob(4) && !hasJob(9)) return {t: {es: 'Recomendado: pasea con Joan para aprender a mirar escaparates (RA4).', ca: 'Recomanat: passeja amb en Joan per aprendre a mirar aparadors (RA4).'}, npc: 0, act: () => Missions.storyTaller ? Talleres.estudio(storyPanel) : null, sub, chap: 1};
      for (const i of [4, 9]) {
        if (!hasJob(i)) return {t: {es: 'Monta el escaparate de ' + shopName(i) + ' (' + zoneOf(i) + '): entra en la tienda y elige un encargo.', ca: 'Munta l\'aparador de ' + shopName(i) + ' (' + zoneOf(i) + '): entra a la botiga i tria un encàrrec.'}, shop: i, sub, chap: 1};
        if (!st.pruebas[i]) return {t: {es: 'Registra el ensayo de ' + shopName(i) + ' en el panel «Historia». Si no supera a la pantalla (16 paradas), mejora el escaparate.', ca: 'Registra l\'assaig de ' + shopName(i) + ' al panell «Història». Si no supera la pantalla (16 aturades), millora l\'aparador.'}, act: storyPanel, sub, chap: 1};
      }
    }
    if (st.fase === 2) {
      const sub = [...[2, 3, 4, 5].map(id => [!!st.apoyos[id] && done(id), {es: nm(id) + (st.apoyos[id] ? (done(id) ? ': firme' : ': convencido, falta su taller') : ': indeciso'), ca: nm(id) + (st.apoyos[id] ? (done(id) ? ': ferm' : ': convençut, falta el seu taller') : ': indecís')}]),
        [!!st.debate, {es: 'Debate con Ada', ca: 'Debat amb l\'Ada'}], [!!(saved.ra && saved.ra.informe), {es: 'Informe de ratios (RA5 + RA6)', ca: 'Informe de ràtios (RA5 + RA6)'}]];
      const day = {es: 'Día ' + Math.min(st.dia || 1, 5) + ' de 5 · ', ca: 'Dia ' + Math.min(st.dia || 1, 5) + ' de 5 · '};
      const pre = o => ({...o, t: {es: day.es + o.t.es, ca: day.ca + o.t.ca}, sub, chap: 2});
      const undecided = [2, 3, 4, 5].filter(id => !st.apoyos[id]).sort((a, b) => dist(player, actors[a]) - dist(player, actors[b]));
      if (undecided.length) { const id = undecided[0]; return pre({t: {es: (st.perduts || {})[id] ? 'Prisma ha recuperado a ' + nm(id) + ': vuelve a convencerle.' : 'Convence a ' + nm(id) + ' (' + neighbours[id][1].toLowerCase() + ') con argumentos de escaparatismo.', ca: (st.perduts || {})[id] ? 'Prisma ha recuperat ' + nm(id) + ': torna a convèncer-lo.' : 'Convenç ' + nm(id) + ' (' + neighbours[id][1].toLowerCase() + ') amb arguments d\'aparadorisme.'}, npc: id}) }
      if (!st.debate) return pre({t: {es: 'Escucha a Ada, la analista de Prisma, y responde a sus tres preguntas.', ca: 'Escolta l\'Ada, l\'analista de Prisma, i respon les seves tres preguntes.'}, npc: 1});
      const weak = firmable.filter(id => st.apoyos[id] && !done(id));
      if (!(saved.ra && saved.ra.promo) && weak.includes(4)) return pre({t: {es: 'Ayuda a Núria con una promoción (RA5): sus resultados serán la base del informe.', ca: 'Ajuda la Núria amb una promoció (RA5): els seus resultats seran la base de l\'informe.'}, npc: 4});
      if (!(saved.ra && saved.ra.informe)) return pre({t: {es: 'Lleva los datos de la promoción a Ada y calcula las ratios (RA6).', ca: 'Porta les dades de la promoció a l\'Ada i calcula les ràtios (RA6).'}, npc: 1});
      if (weak.length) { const id = weak[0]; return pre({t: {es: 'Haz firme a ' + nm(id) + ': mejora su tienda antes de que Prisma contraataque.', ca: 'Fes ferm ' + nm(id) + ': millora la seva botiga abans que Prisma contraataqui.'}, npc: id}) }
      return pre({t: {es: '¡Todo listo! Habla con Joan para convocar la asamblea.', ca: 'Tot a punt! Parla amb en Joan per convocar l\'assemblea.'}, npc: 0});
    }
    if (st.fase === 3) return {t: {es: 'Asamblea en la Plaça de Catalunya: responde a Ada qué demuestran tus ensayos.', ca: 'Assemblea a la Plaça de Catalunya: respon a l\'Ada què demostren els teus assajos.'}, npc: 1, chap: 3};
    return {t: {es: 'Historia completada. Mejora tus estrellas en el menú «RA» o completa más encargos.', ca: 'Història completada. Millora les estrelles al menú «RA» o completa més encàrrecs.'}, act: () => Missions.menu()};
  }
  function target(o = objective()) {
    if (o.npc != null) { const a = actors[o.npc]; return {x: a.x, y: a.y, go: () => go(a.x, a.y, -a.id - 1)} }
    if (o.shop != null) { const e = entry(S[o.shop]); return {x: e.x, y: e.y, go: () => target_(o.shop)} }
    return null;
  }
  const target_ = i => window.target(S[i]);

  /* ---------------------------------------------------------------- panell d'objectiu */
  const hud = document.createElement('aside'); hud.id = 'guia'; hud.setAttribute('aria-live', 'polite'); document.body.append(hud);
  let last = '', open = true;
  try { open = localStorage.getItem('guia-open') !== '0' } catch {}
  function render() {
    if (typeof saved === 'undefined' || !saved.modeChosen && !ST()?.presentada) { hud.hidden = true; return }
    const o = objective(), key = JSON.stringify([tx(o.t), (o.sub || []).map(s => s[0]), open, saved.lang]);
    hud.hidden = !!window.cineLock || (typeof mode !== 'undefined' && mode !== 'street'); if (key === last) return; last = key;
    const tg = target(o);
    hud.innerHTML = '<button class="g-toggle" aria-expanded="' + open + '">' + tx({es: 'Objetivo', ca: 'Objectiu'}) + ' ' + (open ? '▾' : '▸') + '</button>' +
      (open ? '<p>' + tx(o.t) + '</p>' + (o.sub ? '<ul>' + o.sub.map(([ok, t]) => '<li class="' + (ok ? 'ok' : '') + '">' + (ok ? '✓' : '○') + ' ' + tx(t) + '</li>').join('') + '</ul>' : '') +
      '<div class="g-row">' + (tg ? '<button class="primary" data-g="go">' + tx({es: 'Llévame', ca: 'Porta-m\'hi'}) + '</button>' : o.act ? '<button class="primary" data-g="act">' + tx({es: 'Abrir', ca: 'Obrir'}) + '</button>' : '') +
      (ST() && ST().fase < 4 && saved.modeChosen !== 'solo' ? '<button data-g="story">' + tx({es: 'Historia', ca: 'Història'}) + '</button>' : '') + '</div>' : '');
    hud.querySelector('.g-toggle').onclick = () => { open = !open; try { localStorage.setItem('guia-open', open ? '1' : '0') } catch {} last = ''; render() };
    hud.querySelector('[data-g="go"]')?.addEventListener('click', () => target(objective())?.go());
    hud.querySelector('[data-g="act"]')?.addEventListener('click', () => objective().act?.());
    hud.querySelector('[data-g="story"]')?.addEventListener('click', () => storyPanel());
    chapterCheck(o);
  }
  setInterval(render, 500);

  /* ---------------------------------------------------------------- recordatori si la Lia està quieta */
  let idleSince = performance.now(), lastPos = '', lastHint = 0;
  const toast = document.createElement('div'); toast.id = 'guia-toast'; toast.hidden = true; document.body.append(toast);
  setInterval(() => {
    if (typeof player === 'undefined' || typeof mode === 'undefined') return;
    const p = Math.round(player.x) + ',' + Math.round(player.y);
    if (p !== lastPos || mode !== 'street' || window.cineLock) { lastPos = p; idleSince = performance.now(); return }
    if (performance.now() - idleSince > 40000 && performance.now() - lastHint > 90000 && ST()) {
      lastHint = performance.now(); const o = objective();
      toast.innerHTML = '<img src="' + (portraits.lia || '') + '" alt=""><p><b>Lia</b> ' + tx({es: '«Veamos… ', ca: '«A veure… '}) + tx(o.t) + '»</p>';
      toast.hidden = false; setTimeout(() => toast.hidden = true, 9000);
    }
  }, 1000);

  /* ---------------------------------------------------------------- 3D: columna de llum sobre l'objectiu */
  function build3D({T, sc}) {
    const g = new T.Group(); sc.add(g);
    const beam = new T.Mesh(new T.CylinderGeometry(7, 7, 220, 20, 1, true), new T.MeshBasicMaterial({color: '#ffc96e', transparent: true, opacity: .22, depthWrite: false, side: T.DoubleSide}));
    beam.position.y = 110; g.add(beam);
    const arrow = new T.Mesh(new T.ConeGeometry(8, 16, 4), new T.MeshBasicMaterial({color: '#ffb43a'})); arrow.rotation.x = Math.PI; g.add(arrow);
    const ring = new T.Mesh(new T.RingGeometry(13, 17, 32), new T.MeshBasicMaterial({color: '#ffc96e', transparent: true, opacity: .7, side: T.DoubleSide})); ring.rotation.x = -Math.PI / 2; ring.position.y = 1.5; g.add(ring);
    return {update(t) {
      const st = ST(); const tg = saved.modeChosen && (st || saved.modeChosen === 'free') ? target() : null;
      g.visible = !!tg && !window.cineLock && dist(player, tg) > 55; if (!g.visible) return;
      g.position.set(tg.x, 0, tg.y); arrow.position.y = 78 + Math.sin(t / 260) * 5; arrow.rotation.y = t / 600; ring.scale.setScalar(1 + (t / 900 % 1) * .5); ring.material.opacity = .7 * (1 - t / 900 % 1);
    }};
  }
  function minimapMark(g, Wd, Hd) {
    const tg = saved.modeChosen ? target() : null; if (!tg) return;
    const x = tg.x / Wd * 146, y = tg.y / Hd * 105, r = 5;
    g.fillStyle = '#ffb43a'; g.strokeStyle = '#183e3a'; g.lineWidth = 1; g.beginPath();
    for (let k = 0; k < 10; k++) { const a = k * Math.PI / 5 - Math.PI / 2, rr = k % 2 ? r * .45 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) } g.closePath(); g.fill(); g.stroke();
  }

  /* ---------------------------------------------------------------- pròleg i capítols */
  const spot = i => ({x: S[i].x + 122, y: S[i].y + 225});
  function prologue(cb) {
    const st = ST(); if (st) { st.prolegVist = true; save() }
    const plaza = {x: W / 2, y: (window.Barcelona3D ? Barcelona3D.roadZ(2) : 900)};
    Missions.play([
      {who: null, focus: plaza, dz: 300, h: 190, text: {es: '<b>Barcelona, otoño.</b> Del Passeig de Gràcia al mar, cada tienda cuenta su historia a través de su escaparate.', ca: '<b>Barcelona, tardor.</b> Del Passeig de Gràcia al mar, cada botiga explica la seva història a través del seu aparador.'}},
      {who: 'lia', focus: player, text: {es: 'Soy Lia. Acabo de terminar Actividades Comerciales y quiero ser escaparatista. Conozco estas calles desde pequeña.', ca: 'Soc la Lia. Acabo d\'acabar Activitats Comercials i vull ser aparadorista. Conec aquests carrers des de petita.'}},
      {who: 'prisma', focus: spot(window.Barcelona3D ? Barcelona3D.AT[13] : 8), dz: 200, text: {es: '<b>Prisma Exterior</b> es una empresa de publicidad: paga una renta a las tiendas a cambio de tapar sus escaparates con pantallas idénticas.', ca: '<b>Prisma Exterior</b> és una empresa de publicitat: paga una renda a les botigues a canvi de tapar els seus aparadors amb pantalles idèntiques.'}},
      {who: null, focus: spot(27), dz: 120, h: 95, text: {es: 'Si todos aceptan, la calle perderá su identidad: ya no se verán los productos reales ni el trabajo de cada comercio.', ca: 'Si tothom accepta, el carrer perdrà la seva identitat: ja no es veuran els productes reals ni la feina de cada comerç.'}},
      {who: 'joan', npc: 0, focus: actors[0], gesture: 'hablar', text: {es: 'Soy Joan, de la Cereria Subirà. El domingo los comerciantes votan la oferta de Prisma… y necesito pruebas, no nostalgia.', ca: 'Soc en Joan, de la Cereria Subirà. Diumenge els comerciants votem l\'oferta de Prisma… i necessito proves, no nostàlgia.'}},
      {who: 'ada', npc: 1, focus: actors[1], gesture: 'hablar', text: {es: 'Soy Ada, analista de Prisma. No tengo nada contra los escaparates: solo creo en lo que se puede medir.', ca: 'Soc l\'Ada, analista de Prisma. No tinc res contra els aparadors: només crec en el que es pot mesurar.'}},
      {who: 'lia', focus: player, lia: 'senalar', text: {es: 'Mi plan: demostrar con técnicas profesionales —y con números— que un buen escaparate atrae más que una pantalla.', ca: 'El meu pla: demostrar amb tècniques professionals —i amb números— que un bon aparador atreu més que una pantalla.'}},
      {who: null, focus: player, text: {es: '<b>Cómo se juega:</b> camina con WASD o tocando el suelo, habla con los vecinos (E) y entra en las tiendas. Arriba a la derecha tienes siempre tu <b>objetivo</b>; la columna de luz te marca adónde ir.', ca: '<b>Com es juga:</b> camina amb WASD o tocant el terra, parla amb els veïns (E) i entra a les botigues. A dalt a la dreta tens sempre el teu <b>objectiu</b>; la columna de llum et marca on anar.'}}
    ], cb);
  }
  const CHAPTERS = {
    1: [{who: 'joan', npc: 0, gesture: 'hablar', text: {es: 'Haremos un ensayo justo: el mismo número de peatones delante de tu escaparate y delante de una pantalla de Prisma.', ca: 'Farem un assaig just: el mateix nombre de vianants davant del teu aparador i davant d\'una pantalla de Prisma.'}},
        {who: null, shop: 4, text: () => tx({es: 'Primero, la <b>Cereria Subirà</b> (Portal de l\'Àngel). Después, <b>Discos Volta</b> (Plaça de Catalunya). Monta un encargo en cada tienda.', ca: 'Primer, la <b>Cereria Subirà</b> (Portal de l\'Àngel). Després, <b>Discos Volta</b> (Plaça de Catalunya). Munta un encàrrec a cada botiga.'})},
        {who: 'lia', text: {es: 'Si mi escaparate consigue más de 16 paradas de cada 40 peatones, superaré a la pantalla. Luego lo registro en «Historia».', ca: 'Si el meu aparador aconsegueix més de 16 aturades de cada 40 vianants, superaré la pantalla. Després ho registro a «Història».'}}],
    2: [{who: null, text: {es: '<b>Capítulo 3 · Reunir apoyos.</b> Tienes 5 días hasta la asamblea. Para ganarla necesitas: 3 vecinos a favor, escuchar a Ada y un informe con ratios.', ca: '<b>Capítol 3 · Reunir suports.</b> Tens 5 dies fins a l\'assemblea. Per guanyar-la necessites: 3 veïns a favor, escoltar l\'Ada i un informe amb ràtios.'}},
        {who: 'lia', text: {es: 'Hablar es gratis, pero cada taller ocupa un día. Un vecino convencido solo es <b>firme</b> cuando su tienda ha mejorado: si no, Prisma puede recuperarlo los días 3 y 5.', ca: 'Parlar és gratis, però cada taller ocupa un dia. Un veí convençut només és <b>ferm</b> quan la seva botiga ha millorat: si no, Prisma el pot recuperar els dies 3 i 5.'}}]
  };
  function chapterCheck(o) {
    const st = ST(); if (!st || o.chap == null || window.cineLock || typeof mode === 'undefined' || mode !== 'street') return;
    st.capVist ||= {}; if (st.capVist[o.chap]) return;
    if (o.chap === 0 && !st.prolegVist) { st.capVist[0] = true; return prologue(() => {}) }
    if (!CHAPTERS[o.chap]) { st.capVist[o.chap] = true; return }
    st.capVist[o.chap] = true; save();
    Missions.play(CHAPTERS[o.chap].map(l => ({...l, focus: l.npc != null ? actors[l.npc] : l.shop != null ? spot(l.shop) : player, dz: l.shop != null ? 150 : undefined})), () => {});
  }

  /* ---------------------------------------------------------------- resum per al panell «Història» */
  function panel() {
    const st = ST(); if (!st) return '';
    const sum = [{es: 'Prisma Exterior quiere tapar los escaparates de la calle con pantallas a cambio de una renta. Joan te ha pedido pruebas antes de la votación.', ca: 'Prisma Exterior vol tapar els aparadors del carrer amb pantalles a canvi d\'una renda. En Joan t\'ha demanat proves abans de la votació.'}];
    if (st.fase >= 2) sum.push({es: 'Tus dos ensayos superaron a la pantalla. Prisma ha respondido instalando pantallas y ofreciendo dinero a los vecinos.', ca: 'Els teus dos assajos van superar la pantalla. Prisma ha respost instal·lant pantalles i oferint diners als veïns.'});
    if (st.fase >= 3) sum.push({es: 'Has reunido apoyos y un informe con datos. La calle vota en la Plaça de Catalunya.', ca: 'Has reunit suports i un informe amb dades. El carrer vota a la Plaça de Catalunya.'});
    const o = objective(), cast = [['joan', {es: 'Artesano de la Cereria Subirà. Quiere pruebas antes de votar.', ca: 'Artesà de la Cereria Subirà. Vol proves abans de votar.'}], ['ada', {es: 'Analista de Prisma. Rival, pero honesta: solo cree en los datos.', ca: 'Analista de Prisma. Rival, però honesta: només creu en les dades.'}],
      ['laia', {es: 'Fotógrafa (Càmera Fosca). RA3: cartelería.', ca: 'Fotògrafa (Càmera Fosca). RA3: cartellisme.'}], ['jan', {es: 'Diseñador (Estudi Llum). RA1: superficie comercial.', ca: 'Dissenyador (Estudi Llum). RA1: superfície comercial.'}],
      ['nuria', {es: 'Estilista (La Bicoca). RA5: promociones.', ca: 'Estilista (La Bicoca). RA5: promocions.'}], ['nil', {es: 'Barista (Casa Cafè). RA2: lineal.', ca: 'Barista (Casa Cafè). RA2: lineal.'}]];
    return '<details class="card g-sum" open><summary><b>' + tx({es: 'Lo que ha pasado', ca: 'El que ha passat'}) + '</b></summary>' + sum.map(s => '<p>' + tx(s) + '</p>').join('') + '</details>' +
      '<div class="card"><b>' + tx({es: 'Qué tienes que hacer ahora', ca: 'Què has de fer ara'}) + '</b><p>' + tx(o.t) + '</p>' + (o.sub ? '<ul class="g-list">' + o.sub.map(([ok, t]) => '<li class="' + (ok ? 'ok' : '') + '">' + (ok ? '✓' : '○') + ' ' + tx(t) + '</li>').join('') + '</ul>' : '') + '</div>' +
      '<details class="card"><summary><b>' + tx({es: 'Personajes', ca: 'Personatges'}) + '</b></summary><div class="g-cast">' + cast.map(([k, d]) => '<div><img src="' + (portraits[k] || '') + '" alt=""><span><b>' + ({joan: 'Joan', ada: 'Ada', laia: 'Laia', jan: 'Jan', nuria: 'Núria', nil: 'Nil'})[k] + '</b> ' + tx(d) + '</span></div>').join('') + '</div></details>' +
      '<p><button id="gProleg">' + tx({es: 'Ver de nuevo la introducción', ca: 'Tornar a veure la introducció'}) + '</button></p>';
  }
  document.addEventListener('click', e => { if (e.target && e.target.id === 'gProleg') prologue(storyPanel) });

  return {objective, target, build3D, minimapMark, prologue, panel};
})();
