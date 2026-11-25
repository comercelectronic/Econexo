/* Missions d'Aparadors BCN: cada RA del mòdul 1231 es pot jugar dins la història o com a missió solta.
   - Mode solt (?ra=1…6 o menú «RA»): introducció amb escena, taller, estrelles i informe d'evidències.
   - Història: compte enrere de 5 dies, contraatacs de Prisma, escenes amb càmera i finals segons el resultat.
   - Pols del carrer: l'atractiu de cada botiga canvia el comportament dels vianants; Prisma tapa aparadors.
   Fa servir globals del joc: show, sheet, saved, save, street, storyPanel, story, actors, S, stores, portraits,
   NPC_MODELS, npcGesture, heroGesture, supporters, NEEDED, hasReport, readyForAssembly, edit, player. */
window.Missions = (() => {
  const ST = () => (typeof story !== 'undefined' ? story : null);
  const tx = o => window.Talleres ? Talleres.tx(o) : (o && o.es) || o;
  const $ = id => document.getElementById(id);
  const NPC_SHOP = {0: 4, 2: 12, 3: 32, 4: 27, 5: 20};          // Joan: Cereria Subirà · Laia: Càmera Fosca · Jan: Estudi Llum · Núria: La Bicoca · Nil: Casa Cafè
  const PRISMA_EXTRA = [8, 15, 23, 29, 34];
  const CAN = {1: 8, 2: 8, 3: 7, 4: 8, 5: 5, 6: 5};
  const DAYS = 5;
  const NAMES = {lia: 'Lia', joan: 'Joan', ada: 'Ada', laia: 'Laia', jan: 'Jan', nuria: 'Núria', nil: 'Nil', prisma: 'Prisma Exterior'};

  const RA = {
    1: {npc: 3, say: {es: 'Lia, la gente mira desde fuera y pasa de largo. ¿Qué hago mal?', ca: 'Lia, la gent mira des de fora i passa de llarg. Què faig malament?'}, t: {es: 'Organizar la superficie comercial', ca: 'Organitzar la superfície comercial'}, open: cb => Talleres.tienda(cb),
        intro: {es: 'La gente mira las lámparas del Estudi Llum desde fuera pero no entra, y Prisma ya le ha ofrecido tapar el escaparate. Reorganiza la tienda para que la gente entre y la recorra entera.',
                ca: 'La gent mira els llums de l\'Estudi Llum des de fora però no entra, i Prisma ja li ha ofert tapar l\'aparador. Reorganitza la botiga perquè la gent entri i la recorri sencera.'}},
    2: {npc: 5, say: {es: 'El viernes me quedé sin bombones… y Prisma lo vio.', ca: 'Divendres em vaig quedar sense bombons… i Prisma ho va veure.'}, t: {es: 'Colocar y reponer productos en el lineal', ca: 'Col·locar i reposar productes al lineal'}, open: cb => Talleres.lineal(cb),
        intro: {es: 'Cada viernes la Casa Cafè se queda sin bombones y el café que más vende está en el suelo. Prisma va diciendo que la tienda es un caos: demuestra que no.',
                ca: 'Cada divendres la Casa Cafè es queda sense bombons i el cafè que més ven és a terra. Prisma va dient que la botiga és un caos: demostra que no.'}},
    3: {npc: 2, say: {es: 'Sant Jordi es mi gran día. Necesito un cartel que se lea desde la otra acera.', ca: 'Sant Jordi és el meu gran dia. Necessito un cartell que es llegeixi des de l\'altra vorera.'}, t: {es: 'Decoración, rotulación y cartelería', ca: 'Decoració, retolació i cartellisme'}, open: cb => Talleres.carteles(cb),
        intro: {es: 'Falta poco para Sant Jordi y el estudio Càmera Fosca no tiene campaña. Haz el cartel que la gente leerá desde la otra acera.',
                ca: 'Falta poc per Sant Jordi i l\'estudi Càmera Fosca no té campanya. Fes el cartell que la gent llegirà des de l\'altra vorera.'}},
    4: {npc: 0, say: {es: 'Ven, paseemos. Antes de montar un escaparate hay que saber mirarlos.', ca: 'Vine, passegem. Abans de muntar un aparador, s\'han de saber mirar.'}, t: {es: 'Montar escaparates', ca: 'Muntar aparadors'}, open: cb => estudioIEncarrec(cb),
        intro: {es: 'Antes de plantar cara a Prisma, Joan te lleva a pasear para mirar escaparates con ojos de profesional. Después montarás el escaparate de la Cereria Subirà.',
                ca: 'Abans de plantar cara a Prisma, en Joan et porta a passejar per mirar aparadors amb ulls de professional. Després muntaràs l\'aparador de la Cereria Subirà.'}},
    5: {npc: 4, say: {es: 'Ciento veinte abrigos esperando la primavera… Ayúdame a moverlos sin regalarlos.', ca: 'Cent vint abrics esperant la primavera… Ajuda\'m a moure\'ls sense regalar-los.'}, t: {es: 'Acciones promocionales', ca: 'Accions promocionals'}, open: cb => Talleres.promo(cb),
        intro: {es: 'En La Bicoca hay 120 abrigos que no se venden y la primavera está a la vuelta. Diseña una promoción y mira cómo reacciona la calle durante una semana.',
                ca: 'A La Bicoca hi ha 120 abrics que no es venen i la primavera és a tocar. Dissenya una promoció i mira com reacciona el carrer durant una setmana.'}},
    6: {npc: 1, say: {es: 'Palabras no. Números. Enséñame las ratios.', ca: 'Paraules no. Números. Ensenya\'m les ràtios.'}, t: {es: 'Control de las acciones', ca: 'Control de les accions'}, open: cb => { Talleres.presetPromo(); Talleres.control(cb) },
        intro: {es: 'Ada, la analista de Prisma, no se cree nada sin números. Calcula las ratios de la promoción de Núria y presenta un informe que aguante la asamblea.',
                ca: 'L\'Ada, l\'analista de Prisma, no es creu res sense números. Calcula les ràtios de la promoció de la Núria i presenta un informe que aguanti l\'assemblea.'}}
  };
  const raOfNpc = id => +Object.keys(RA).find(n => RA[n].npc === +id && n !== '4' && n !== '6');

  /* ---------------------------------------------------------------- comptador d'errors */
  let session = null;
  document.addEventListener('click', e => {
    if (!session) return;
    const b = e.target.closest && e.target.closest('#sheet button');
    if (!b || b.classList.contains('close') || b.closest('.brush') || b.closest('.shelf') || b.closest('.floorplan')) return;
    setTimeout(() => {
      const bad = document.querySelector('#sheet .reply.bad, #sheet .ratio.ko');
      if (bad) { session.misses++; const h = document.querySelector('#sheet h3'); if (h) session.log.push(h.textContent.slice(0, 90)) }
    }, 30);
  }, true);

  function stars(n) { return '<span class="stars">' + '★'.repeat(n) + '<i>' + '★'.repeat(3 - n) + '</i></span>' }

  function finish(n, onDone) {
    const s = session; session = null; if (!s) return onDone && onDone();
    const st = s.misses <= 1 ? 3 : s.misses <= 4 ? 2 : 1, ca = Talleres.ra().ca;
    const all = Array.from({length: CAN[n]}, (_, k) => n + '.' + (k + 1));
    const ev = {stars: st, misses: s.misses, secs: Math.round((Date.now() - s.start) / 1000), date: new Date().toISOString().slice(0, 10), got: all.filter(c => ca[c]), log: [...new Set(s.log)].slice(0, 10)};
    const R = Talleres.ra(); R.evid ||= {}; if (!R.evid[n] || st >= R.evid[n].stars) R.evid[n] = ev; save();
    if (window.Sons) { if (st >= 2) { Sons.play('fanfare'); Sons.confetti() } else Sons.play('win') }
    if (s.story) return onDone && onDone(ev);
    evidence(n, ev, true);
  }

  function evidence(n, ev, fresh) {
    ev ||= (Talleres.ra().evid || {})[n]; if (!ev) return menu();
    const all = Array.from({length: CAN[n]}, (_, k) => n + '.' + (k + 1));
    show(tx({es: 'Informe de evidencias', ca: 'Informe d\'evidències'}), 'RA' + n + ' · ' + tx(RA[n].t),
      '<div class="informe">' + (fresh ? '<p class="reply">' + tx({es: '¡Misión completada!', ca: 'Missió completada!'}) + '</p>' : '') +
      '<p style="font-size:30px;margin:4px 0">' + stars(ev.stars) + '</p>' +
      '<table class="datos"><tr><td>' + tx({es: 'Fecha', ca: 'Data'}) + '</td><td>' + ev.date + '</td></tr><tr><td>' + tx({es: 'Tiempo', ca: 'Temps'}) + '</td><td>' + Math.floor(ev.secs / 60) + ' min ' + ev.secs % 60 + ' s</td></tr>' +
      '<tr><td>' + tx({es: 'Respuestas a revisar', ca: 'Respostes a revisar'}) + '</td><td>' + ev.misses + '</td></tr></table>' +
      '<p><b>' + tx({es: 'Criterios de evaluación conseguidos', ca: 'Criteris d\'avaluació assolits'}) + '</b></p><div class="cas">' + all.map(c => '<span class="' + (ev.got.includes(c) ? 'on' : '') + '">' + c + '</span>').join('') + '</div>' +
      (ev.log.length ? '<details><summary>' + tx({es: 'Dónde hubo dudas', ca: 'On hi va haver dubtes'}) + '</summary><ul>' + ev.log.map(l => '<li>' + l + '</li>').join('') + '</ul></details>' : '') + '</div>' +
      '<button class="primary" id="mBack">' + tx({es: 'Volver a las misiones', ca: 'Tornar a les missions'}) + '</button> <button id="mAgain">' + tx({es: 'Repetir', ca: 'Repetir'}) + '</button> <button id="mPrint">' + tx({es: 'Imprimir', ca: 'Imprimir'}) + '</button> <button id="mStreet">' + tx({es: 'Pasear por Barcelona', ca: 'Passejar per Barcelona'}) + '</button>');
    $('mBack').onclick = menu; $('mAgain').onclick = () => start(n); $('mPrint').onclick = () => window.print(); $('mStreet').onclick = street;
  }

  /* ---------------------------------------------------------------- missions soltes */
  function start(n, opts = {}) {
    n = +n; if (!RA[n]) return menu();
    const npc = RA[n].npc, who = NPC_MODELS[npc], a = actors[npc];
    const run = () => { session = {ra: n, start: Date.now(), misses: 0, log: [], story: false}; RA[n].open(() => finish(n)) };
    if (opts.noIntro) return run();
    player.x = a.x + 46; player.y = a.y + 30;   // la Lia apareix al costat del veí
    play([
      {who: null, focus: a, text: () => '<b>RA' + n + ' · ' + tx(RA[n].t) + '</b><br>' + tx(RA[n].intro)},
      {who, npc, focus: a, gesture: 'hablar', text: RA[n].say}
    ], run);
  }

  function estudioIEncarrec(cb) {
    Talleres.estudio(() => {
      const before = JSON.stringify(saved.jobs['4-0'] || null);
      show(tx({es: 'El encargo de la Cereria Subirà', ca: 'L\'encàrrec de la Cereria Subirà'}), 'RA4 · ' + tx(RA[4].t),
        '<p>' + tx({es: 'Joan: «Ahora te toca a ti. Monta el escaparate de la cerería: elige productos, soporte, luz y mensaje, y entrégalo antes de que se acabe el turno».', ca: 'Joan: «Ara et toca a tu. Munta l\'aparador de la cereria: tria productes, suport, llum i missatge, i lliura\'l abans que s\'acabi el torn».'}) + '</p><button class="primary" id="go">' + tx({es: 'Abrir el taller', ca: 'Obrir el taller'}) + '</button>');
      $('go').onclick = () => Aparador3D.open(4, () => setTimeout(cb, 300));
    });
  }

  function menu() {
    const R = Talleres.ra(), ca = R.ca, ev = R.evid || {};
    show(tx({es: 'Misiones', ca: 'Missions'}), tx({es: 'Dinamización del punto de venta · Módulo 1231', ca: 'Dinamització del punt de venda · Mòdul 1231'}),
      '<p>' + tx({es: 'Cada misión trabaja un resultado de aprendizaje y se puede jugar sola. Para enlazar una directamente en clase usa ', ca: 'Cada missió treballa un resultat d\'aprenentatge i es pot jugar sola. Per enllaçar-ne una directament a classe fes servir '}) + '<code>?ra=1</code> … <code>?ra=6</code>.</p><div class="ras">' +
      Object.keys(RA).map(n => {
        const all = Array.from({length: CAN[n]}, (_, k) => n + '.' + (k + 1)), got = all.filter(c => ca[c]).length;
        return '<div class="card mission"><img src="' + (portraits[NPC_MODELS[RA[n].npc]] || '') + '" alt=""><div><b>RA' + n + ' · ' + tx(RA[n].t) + '</b> ' + (ev[n] ? stars(ev[n].stars) : '') +
          '<div class="cas">' + all.map(c => '<span class="' + (ca[c] ? 'on' : '') + '">' + c + '</span>').join('') + '</div><small>' + got + ' / ' + all.length + ' CA</small> ' +
          '<button class="primary" data-go="' + n + '">' + tx({es: 'Jugar la misión', ca: 'Jugar la missió'}) + '</button>' + (ev[n] ? ' <button data-ev="' + n + '">' + tx({es: 'Informe', ca: 'Informe'}) + '</button>' : '') + '</div></div>';
      }).join('') + '</div><p><button id="toStory">' + tx({es: 'Jugar la historia completa', ca: 'Jugar la història completa'}) + '</button></p>');
    sheet.querySelectorAll('[data-go]').forEach(b => b.onclick = () => start(b.dataset.go));
    sheet.querySelectorAll('[data-ev]').forEach(b => b.onclick = () => evidence(+b.dataset.ev));
    $('toStory').onclick = storyPanel;
  }

  function chooser() {
    show(tx({es: '¿Cómo quieres jugar?', ca: 'Com vols jugar?'}), 'Aparadors BCN',
      '<div class="choose"><button id="cStory" class="primary"><b>' + tx({es: 'Historia completa', ca: 'Història completa'}) + '</b><br>' + tx({es: 'Prisma quiere tapar los escaparates de Barcelona con pantallas. Tienes cinco días para convencer a la calle.', ca: 'Prisma vol tapar els aparadors de Barcelona amb pantalles. Tens cinc dies per convèncer el carrer.'}) + '</button>' +
      '<button id="cSolo"><b>' + tx({es: 'Misión suelta', ca: 'Missió solta'}) + '</b><br>' + tx({es: 'Elige un resultado de aprendizaje (RA1–RA6) y juégalo solo, con su informe de evidencias.', ca: 'Tria un resultat d\'aprenentatge (RA1–RA6) i juga\'l sol, amb el seu informe d\'evidències.'}) + '</button>' +
      '<button id="cFree"><b>' + tx({es: 'Pasear libremente', ca: 'Passejar lliurement'}) + '</b><br>' + tx({es: 'Del Passeig de Gràcia al mar, con los 36 comercios y sus encargos.', ca: 'Del Passeig de Gràcia al mar, amb els 36 comerços i els seus encàrrecs.'}) + '</button></div>');
    const pick = m => { saved.modeChosen = m; save() };
    $('cStory').onclick = () => { pick('story'); window.Guia ? Guia.prologue(storyPanel) : storyPanel() };
    $('cSolo').onclick = () => { pick('solo'); menu() };
    $('cFree').onclick = () => { pick('free'); street() };
  }

  /* ---------------------------------------------------------------- escenes (càmera + subtítols) */
  let cine = null;
  const box = document.createElement('div'); box.id = 'cine'; box.hidden = true; document.body.append(box);
  box.onclick = () => next();
  window.addEventListener('keydown', e => { if (cine && [' ', 'enter', 'e'].includes(e.key.toLowerCase())) { e.preventDefault(); e.stopImmediatePropagation(); next() } }, true);
  function face(who) { return who === 'prisma' ? '<div class="cine-logo">P</div>' : '<img src="' + (portraits[who] || (window.Personajes3D ? Personajes3D.portrait(who) : '')) + '" alt="">' }
  function play(lines, onEnd) {
    street(); window.cineLock = true; cine = {lines, i: -1, onEnd}; box.hidden = false; next();
  }
  function next() {
    if (!cine) return; clearTimeout(cine.timer); cine.i++;
    const L = cine.lines[cine.i];
    if (!L) { const f = cine.onEnd; cine = null; box.hidden = true; window.cineLock = false; window.cineView = null; if (f) f(); return }
    const f = L.focus; window.cineView = f ? {x: f.x, z: f.y, dx: L.dx ?? 70, dz: Math.min(L.dz ?? 130, roomSouth(f)), h: L.h ?? 78} : null;
    if (f && f !== player && Math.hypot(player.x - f.x, player.y - f.y) > 450) { player.x = f.x - 50; player.y = f.y + 40 }  // la Lia acompanya l'escena
    if (L.npc != null && L.gesture) npcGesture(L.npc, L.gesture); if (L.lia) heroGesture(L.lia);
    if (L.onShow) L.onShow();
    const text = typeof L.text === 'function' ? L.text() : tx(L.text);
    box.innerHTML = (L.who ? face(L.who) : '') + '<div><b>' + (L.who ? NAMES[L.who] || L.who : '') + '</b><p>' + text + '</p></div><span class="cine-next">' + (L.auto ? '' : '▶') + '</span>';
    if (L.auto) cine.timer = setTimeout(next, L.auto);
  }
  const shopSpot = i => ({x: S[i].x + 122, y: S[i].y + 225});
  // Espai lliure cap al sud abans de topar amb la façana del darrere (la càmera no ha d'entrar als edificis).
  function roomSouth(f) { for (let d = 20; d < 400; d += 10) if (!walkable(f.x, f.y + d)) return Math.max(60, d - 25); return 400 }

  /* ---------------------------------------------------------------- pols del carrer i Prisma */
  function isPrisma(i) {
    const st = ST(); if (!st || st.fase < 1 || st.fase >= 4) return false;
    if (PRISMA_EXTRA.includes(i)) return true;
    const owner = Object.keys(NPC_SHOP).find(k => NPC_SHOP[k] === i && k !== '0');
    return owner != null && st.fase >= 2 && !(st.apoyos || {})[owner];
  }
  function appeal(i) {
    let a = .16;
    for (let j = 0; j < 3; j++) { const job = saved.jobs[i + '-' + j]; if (job) a += .1 + Math.min(1, (job.rating || 0) / 7) * .1 }
    const owner = Object.keys(NPC_SHOP).find(k => NPC_SHOP[k] === i);
    if (owner != null && Talleres.byNpc[owner]?.done()) a += .3;
    if (i === 12 && Talleres.ra().cartel) a += .1;
    return Math.min(.95, a);
  }

  function build3D({T, sc}) {
    // Pantalles de Prisma: un rètol lluminós animat que tapa l'aparador.
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 80; const g = cv.getContext('2d');
    const tex = new T.CanvasTexture(cv); tex.encoding = T.sRGBEncoding;
    const mat = new T.MeshBasicMaterial({map: tex}), geo = new T.PlaneGeometry(166, 52);
    const screens = S.map(s => { const m = new T.Mesh(geo, mat); m.position.set(s.x + 102, 30, s.y + 194 + 15); m.visible = false; sc.add(m); return m });
    const frame = new T.MeshBasicMaterial({color: '#15161c'}), fgeo = new T.BoxGeometry(174, 60, 3);
    const frames = S.map(s => { const m = new T.Mesh(fgeo, frame); m.position.set(s.x + 102, 30, s.y + 194 + 13.2); m.visible = false; sc.add(m); return m });
    let lastDraw = 0, poster = null, posterKey = '';
    function drawAd(t) {
      const k = Math.floor(t / 2600) % 3, hue = (t / 30) % 360;
      const gr = g.createLinearGradient(0, 0, 256, 80); gr.addColorStop(0, 'hsl(' + hue + ',80%,45%)'); gr.addColorStop(1, 'hsl(' + (hue + 80) + ',80%,30%)');
      g.fillStyle = gr; g.fillRect(0, 0, 256, 80); g.fillStyle = '#fff'; g.textAlign = 'center';
      g.font = 'bold 28px Arial'; g.fillText(['PRISMA', '-50% ARA', 'COMPRA JA'][k], 128 + Math.sin(t / 300) * 6, 46);
      g.font = '12px Arial'; g.fillText('prisma exterior · 12.000 impactes/dia', 128, 68); tex.needsUpdate = true;
    }
    function posterUpdate() {
      const c = Talleres.ra().cartel, key = JSON.stringify(c || null); if (key === posterKey) return; posterKey = key;
      if (poster) { sc.remove(poster); poster.material.map.dispose(); poster = null } if (!c) return;
      const pc = document.createElement('canvas'); pc.width = 300; pc.height = 400; const q = pc.getContext('2d');
      q.fillStyle = c.bg; q.fillRect(0, 0, 300, 400); q.fillStyle = c.fg;
      const ff = {serif: 'Georgia, serif', sans: 'Helvetica, Arial, sans-serif', script: 'italic 1px "Segoe Script", cursive', display: 'Impact, sans-serif'}[c.font] || 'Arial';
      const words = (c.titular || '').split(' '); let line = '', y = 70; q.font = (c.font === 'script' ? 'italic ' : 'bold ') + Math.round(c.size * 1.2) + 'px ' + ff.replace('italic 1px ', '');
      for (const w of words) { if (q.measureText(line + w).width > 260 && line) { q.fillText(line, 20, y); y += c.size * 1.25; line = '' } line += w + ' ' } q.fillText(line, 20, y);
      q.fillStyle = c.accent; q.font = 'bold 52px Arial'; q.fillText(c.precio || '', 20, 320); q.fillStyle = c.fg; q.font = '18px Arial'; q.fillText((c.beneficio || '').slice(0, 30), 20, 370);
      const tt = new T.CanvasTexture(pc); tt.encoding = T.sRGBEncoding;
      poster = new T.Mesh(new T.PlaneGeometry(36, 48), new T.MeshBasicMaterial({map: tt})); const s = S[12]; poster.position.set(s.x + 40, 30, s.y + 194 - 20); sc.add(poster);
    }
    return {update(t) {
      let any = false;
      S.forEach((s, i) => { const v = isPrisma(i) && Math.abs(s.y - player.y) < 700; screens[i].visible = frames[i].visible = v; any ||= v });
      if (any && t - lastDraw > 90) { lastDraw = t; drawAd(t) }
      posterUpdate(); pulseHud(t);
    }};
  }

  // Petit panell amb el pols de la botiga més propera.
  const hud = document.createElement('div'); hud.id = 'pols'; hud.hidden = true; document.body.append(hud);
  let hudT = 0;
  function pulseHud(t) {
    if (t - hudT < 400) return; hudT = t;
    const s = S.find(s => Math.hypot(player.x - (s.x + 186), player.y - (s.y + 213)) < 130);
    if (!s || window.cineLock || (typeof inPerspective === 'undefined' || !inPerspective)) { hud.hidden = true; return }
    const st = Vianants.stats[s.i], p = isPrisma(s.i);
    hud.hidden = false;
    hud.innerHTML = '<b>' + stores[s.i][0] + '</b>' + (p ? ' <span class="pr">' + tx({es: 'Pantalla de Prisma', ca: 'Pantalla de Prisma'}) + '</span>' : '') +
      '<div><span>' + st.pas + '<small>' + tx({es: 'pasan', ca: 'passen'}) + '</small></span><span>' + st.par + '<small>' + tx({es: 'se paran', ca: 's\'aturen'}) + '</small></span><span>' + st.ent + '<small>' + tx({es: 'entran', ca: 'entren'}) + '</small></span><span>' + st.tic + '<small>' + tx({es: 'compran', ca: 'compren'}) + '</small></span></div>' +
      '<small>' + tx({es: 'Atracción: ', ca: 'Atracció: '}) + (st.pas ? Math.round(st.par / st.pas * 100) : 0) + ' %</small>';
  }

  /* ---------------------------------------------------------------- història: 5 dies, contraatacs i assemblea */
  const firm = id => !!Talleres.byNpc[id]?.done();
  function dayBadge() {
    const st = ST(); if (!st || st.fase !== 2) return '';
    const d = Math.min(st.dia || 1, DAYS), names = {es: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'], ca: ['dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres']};
    return '<div class="days">' + Array.from({length: DAYS}, (_, k) => '<span class="' + (k + 1 < d ? 'past' : k + 1 === d ? 'now' : '') + '">' + (names[saved.lang === 'ca' ? 'ca' : 'es'][k]) + '</span>').join('') +
      '</div><p class="hint">' + tx({es: 'Día ', ca: 'Dia '}) + d + ' / ' + DAYS + ' · ' + tx({es: 'La asamblea es el viernes por la tarde. Cada taller ocupa un día. Un vecino solo es firme cuando su tienda ha mejorado de verdad.', ca: 'L\'assemblea és divendres a la tarda. Cada taller ocupa un dia. Un veí només és ferm quan la seva botiga ha millorat de debò.'}) + '</p>';
  }
  function storyStart() {
    ST().dia = 1; ST().perduts = {}; save();
    play([
      {who: 'joan', npc: 0, focus: actors[0], gesture: 'hablar', text: {es: '¡Los dos ensayos superan a la pantalla! Pero Prisma no se rinde: ha dejado su carta en todas las tiendas.', ca: 'Els dos assajos superen la pantalla! Però Prisma no es rendeix: ha deixat la seva carta a totes les botigues.'}},
      {who: 'prisma', focus: shopSpot(8), text: {es: 'Prisma Exterior instala sus primeras pantallas. La votación será el viernes.', ca: 'Prisma Exterior instal·la les primeres pantalles. La votació serà divendres.'}},
      {who: 'lia', focus: player, lia: 'senalar', text: {es: 'Cinco días. Convencer a los vecinos con argumentos no basta: hay que mejorar sus tiendas.', ca: 'Cinc dies. Convèncer els veïns amb arguments no n\'hi ha prou: cal millorar les seves botigues.'}}
    ], storyPanel);
  }
  function storyTaller(id) {
    const n = raOfNpc(id); if (!n) return Talleres.byNpc[id]?.open(storyPanel);
    session = {ra: n, start: Date.now(), misses: 0, log: [], story: true};
    RA[n].open(() => finish(n, ev => afterTaller(id, n, ev)));
  }
  function storyReport() {
    if (!Talleres.ra().promo) return storyTaller(4);
    session = {ra: 6, start: Date.now(), misses: 0, log: [], story: true};
    if (Talleres.ra().informe) return Talleres.report(storyPanel);
    Talleres.control(() => finish(6, ev => afterTaller(1, 6, ev)));
  }
  const THANKS = {
    2: {es: '¡Mira! La gente se para a leer el cartel desde la otra acera.', ca: 'Mira! La gent s\'atura a llegir el cartell des de l\'altra vorera.'},
    3: {es: 'Ahora la gente entra, da la vuelta entera y descubre las lámparas del fondo.', ca: 'Ara la gent entra, fa la volta sencera i descobreix els llums del fons.'},
    4: {es: 'Tenía cola en la puerta. Esto no lo consigue ninguna pantalla.', ca: 'Tenia cua a la porta. Això no ho aconsegueix cap pantalla.'},
    5: {es: 'El viernes no me quedé sin bombones. Y el café que más vendo, por fin a la vista.', ca: 'Divendres no em vaig quedar sense bombons. I el cafè que més venc, per fi a la vista.'},
    1: {es: 'Tus números se sostienen. Los presentaré en la asamblea tal como están.', ca: 'Els teus números s\'aguanten. Els presentaré a l\'assemblea tal com són.'}
  };
  function afterTaller(id, n, ev) {
    if (ST().fase !== 2) return storyPanel();
    const shop = NPC_SHOP[id] ?? 12, who = NPC_MODELS[id];
    ST().dia = (ST().dia || 1) + 1; save();
    const lines = [
      {who, npc: +id, focus: id === 1 ? actors[1] : shopSpot(shop), gesture: 'saludar', text: THANKS[id] || {es: '¡Gracias, Lia!', ca: 'Gràcies, Lia!'}},
      {who: null, focus: shopSpot(shop), auto: 1600, dz: 200, h: 110, text: () => stars(ev.stars) + ' · ' + tx({es: 'Fin del día ', ca: 'Fi del dia '}) + (ST().dia - 1) + ' / ' + DAYS}
    ];
    play(lines, () => counterAttack(() => {
      if (ST().dia > DAYS) return assemblyForced();
      storyPanel();
    }));
  }
  function counterAttack(cont) {
    if (![3, 5].includes(ST().dia)) return cont();
    const weak = [2, 3, 4, 5].filter(id => ST().apoyos[id] && !firm(id));
    if (!weak.length) {
      const strong = [2, 3, 4, 5].find(id => ST().apoyos[id]);
      if (strong == null) return play([{who: 'prisma', focus: shopSpot(23), text: {es: 'Prisma instala dos pantallas más en el Portal de l\'Àngel. Se acaba el tiempo.', ca: 'Prisma instal·la dues pantalles més al Portal de l\'Àngel. S\'acaba el temps.'}}], cont);
      return play([{who: 'prisma', focus: shopSpot(NPC_SHOP[strong]), text: {es: 'Prisma llama a ' + NAMES[NPC_MODELS[strong]] + ' con una oferta mejor…', ca: 'Prisma truca a ' + NAMES[NPC_MODELS[strong]] + ' amb una oferta millor…'}},
        {who: NPC_MODELS[strong], npc: strong, focus: actors[strong], gesture: 'hablar', text: {es: 'No, gracias. Mi tienda ya funciona mejor que vuestra pantalla.', ca: 'No, gràcies. La meva botiga ja funciona millor que la vostra pantalla.'}}], cont);
    }
    const id = weak[0], who = NPC_MODELS[id]; window.Sons?.play('alarm');
    ST().apoyos[id] = false; (ST().perduts ||= {})[id] = true; save();
    play([
      {who: 'prisma', focus: shopSpot(NPC_SHOP[id]), dz: 170, text: {es: 'Contraataque: Prisma ofrece a ' + NAMES[who] + ' el doble de renta. La pantalla vuelve a su escaparate.', ca: 'Contraatac: Prisma ofereix a ' + NAMES[who] + ' el doble de renda. La pantalla torna al seu aparador.'}},
      {who, npc: id, focus: actors[id], gesture: 'hablar', text: {es: 'Lia, me convenciste… pero sin un cambio real en mi tienda no puedo decir que no a 600 euros al mes.', ca: 'Lia, em vas convèncer… però sense un canvi real a la meva botiga no puc dir que no a 600 euros al mes.'}},
      {who: 'lia', focus: player, lia: 'senalar', text: {es: 'Todavía hay tiempo: mejora su tienda y vuelve a hablarle.', ca: 'Encara hi som a temps: millora la seva botiga i torna-hi a parlar.'}}
    ], cont);
  }
  function assemblyForced() {
    if (readyForAssembly()) return assembly(() => { ST().fase = 3; save(); storyPanel() });
    play([
      {who: 'joan', npc: 0, focus: actors[0], text: {es: 'Es viernes. Votamos ahora, con lo que tenemos…', ca: 'És divendres. Votem ara, amb el que tenim…'}},
      {who: 'ada', npc: 1, focus: actors[1], text: {es: 'Sin apoyos suficientes y sin un informe con ratios, gana Prisma. Pero os propongo repetir la votación dentro de un mes, con datos.', ca: 'Sense prou suports i sense un informe amb ràtios, guanya Prisma. Però us proposo repetir la votació d\'aquí a un mes, amb dades.'}},
      {who: 'lia', focus: player, text: {es: 'Otra oportunidad. Esta vez, primero las tiendas y los números.', ca: 'Una altra oportunitat. Aquest cop, primer les botigues i els números.'}}
    ], () => { ST().dia = 1; ST().intents = (ST().intents || 0) + 1; save(); storyPanel() });
  }
  function gather(on) {
    const c = {x: W / 2, y: (window.Barcelona3D ? Barcelona3D.roadZ(2) : 900) - 40};
    actors.forEach((a, i) => { a.gather = on ? {x: c.x - 110 + i * 44, y: c.y + (i % 2) * 24} : null; if (on) { a.x = a.gather.x; a.y = a.gather.y } else a.y = ROWY[i] + 220 });
    if (on) { player.x = c.x; player.y = c.y + 90 }
  }
  function assembly(cont) {
    gather(true); const c = actors[0];
    const votes = 1 + supporters(), firmN = [2, 3, 4, 5].filter(id => ST().apoyos[id] && firm(id)).length;
    play([
      {who: null, focus: {x: c.x + 110, y: c.y}, dz: 220, h: 120, auto: 2200, text: {es: 'Plaça de Catalunya. Los comerciantes se reúnen para votar.', ca: 'Plaça de Catalunya. Els comerciants es reuneixen per votar.'}},
      ...[2, 3, 4, 5].filter(id => ST().apoyos[id]).map(id => ({who: NPC_MODELS[id], npc: id, focus: actors[id], gesture: 'saludar', dz: 90,
        text: firm(id) ? {es: 'Mi tienda ha cambiado y los números lo demuestran. Voto por los escaparates.', ca: 'La meva botiga ha canviat i els números ho demostren. Voto pels aparadors.'}
                       : {es: 'Me convencieron los argumentos de Lia. Voto por los escaparates… aunque todavía tengo dudas.', ca: 'Em van convèncer els arguments de la Lia. Voto pels aparadors… encara que tinc dubtes.'}})),
      {who: 'ada', npc: 1, focus: actors[1], gesture: 'hablar', text: {es: votes + ' votos a favor de los escaparates; ' + firmN + (firmN === 1 ? ' tienda ya ha medido' : ' tiendas ya han medido') + ' su mejora. Antes de decidir, quiero oír a Lia.', ca: votes + ' vots a favor dels aparadors; ' + firmN + (firmN === 1 ? ' botiga ja ha mesurat' : ' botigues ja han mesurat') + ' la seva millora. Abans de decidir, vull escoltar la Lia.'}}
    ], cont);
  }
  function ending() {
    const firmN = [2, 3, 4, 5].filter(id => ST().apoyos[id] && firm(id)).length, inf = Talleres.ra().informe;
    const ev = Talleres.ra().evid || {}, avg = Object.values(ev).reduce((a, e) => a + e.stars, 0) / Math.max(1, Object.keys(ev).length);
    const tier = firmN === 4 && inf?.eficaz && avg >= 2.5 ? 3 : firmN >= 2 && inf ? 2 : 1;
    ST().final = tier; save(); if (window.Sons) { Sons.play('fanfare'); Sons.confetti(260) }
    const txt = {3: {es: 'Barcelona conserva todos sus escaparates. Prisma retira las pantallas y propone colaborar con las tiendas en lugar de taparlas.', ca: 'Barcelona conserva tots els aparadors. Prisma retira les pantalles i proposa col·laborar amb les botigues en lloc de tapar-les.'},
                 2: {es: 'Los escaparates se quedan. Algunas pantallas siguen en la calle, pero cada mes se medirá quién atrae más.', ca: 'Els aparadors es queden. Algunes pantalles continuen al carrer, però cada mes es mesurarà qui atreu més.'},
                 1: {es: 'Los escaparates se quedan por muy poco. Los vecinos piden ver resultados reales el mes que viene.', ca: 'Els aparadors es queden per molt poc. Els veïns demanen veure resultats reals el mes que ve.'}}[tier];
    play([
      {who: 'ada', npc: 1, focus: actors[1], gesture: 'saludar', text: txt},
      {who: 'joan', npc: 0, focus: actors[0], gesture: 'saludar', text: {es: 'Lia… gracias. Guardo el contrato sin firmar, de recuerdo.', ca: 'Lia… gràcies. Guardo el contracte sense signar, de record.'}},
      {who: null, focus: {x: actors[0].x + 100, y: actors[0].y}, dz: 260, h: 150, auto: 3000, text: () => stars(tier) + ' ' + tx({es: 'Final de la historia', ca: 'Final de la història'})}
    ], () => { gather(false); storyPanel() });
  }

  /* ---------------------------------------------------------------- RA3 i RA5 al carrer */
  function posterView(cont) {
    play([{who: 'laia', npc: 2, focus: shopSpot(12), dz: 230, h: 70, gesture: 'saludar', text: {es: 'Mira el cartel desde la otra acera. ¿Se lee el titular? ¿Destaca el precio?', ca: 'Mira el cartell des de l\'altra vorera. Es llegeix el titular? Destaca el preu?'}}], cont);
  }
  function promoWeek(r, cont) {
    const shop = 27, days = {es: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'], ca: ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte', 'Diumenge']}[saved.lang === 'ca' ? 'ca' : 'es'];
    Vianants.rush(shop, 7 * 1500); player.x = shopSpot(shop).x - 70; player.y = shopSpot(shop).y + 50;
    play(days.map((d, k) => ({who: k ? null : 'nuria', npc: 4, focus: shopSpot(shop), dz: 190, h: 95, gesture: k ? null : 'saludar', auto: 1500,
      text: () => '<b>' + d + '</b> · ' + Math.round(r.sem.entradas * (k + 1) / 7) + ' ' + tx({es: 'entradas', ca: 'entrades'}) + ' · ' + Math.round(r.sem.tickets * (k + 1) / 7) + ' ' + tx({es: 'tickets', ca: 'tiquets'})})), cont);
  }

  function boot() {
    Vianants.setAppeal(appeal); Vianants.setPrisma(isPrisma);
    const vista = new URLSearchParams(location.search).get('vista');   // captures i enllaços directes a una zona
    if (vista) {
      const V = {rambla: [W / 2 + 120, 4, 20, .7], placa: [W / 2 + 40, 2, 70, -.5], pg: [S[1].x + 150, 0, 0, .55], portal: [W * .3, 3, 0, .4], port: [W / 2 - 60, 5, 40, 2.6]}[vista] || [W / 2, 4, 20, .7];
      saved.modeChosen ||= 'free'; player.x = V[0]; player.y = (window.Barcelona3D ? Barcelona3D.roadZ(V[1]) : 300) + V[2]; camYaw = V[3]; camDist = 210;
      document.body.classList.add('vista'); return true;
    }
    const q = new URLSearchParams(location.search).get('ra');
    if (q && RA[q]) { setTimeout(() => start(q), 400); return true }
    if (!saved.modeChosen) { setTimeout(chooser, 200); return true }
    return false;
  }
  return {start, menu, chooser, evidence, boot, play, next, build3D, isPrisma, appeal, dayBadge, storyStart, storyTaller, storyReport, assembly, assemblyForced, ending, posterView, promoWeek, NPC_SHOP, get active() { return !!cine }};
})();
