/* Progrés d'Aparadors BCN: reputació, nivells, «Barcelona viva», desbloquejos, armari de la Lia i reptes de classe.
   La reputació es calcula sempre a partir de l'estat de la partida (no s'acumula), així no es pot inflar repetint. */
window.Progres = (() => {
  const tx = o => window.Talleres ? Talleres.tx(o) : (o && o.es) || o, $ = id => document.getElementById(id);
  const ST = () => (typeof story !== 'undefined' ? story : null);
  const LEVELS = [
    {min: 0, n: {es: 'Aprendiz', ca: 'Aprenent'}},
    {min: 150, n: {es: 'Escaparatista júnior', ca: 'Aparadorista júnior'}},
    {min: 400, n: {es: 'Escaparatista', ca: 'Aparadorista'}},
    {min: 800, n: {es: 'Escaparatista sénior', ca: 'Aparadorista sènior'}},
    {min: 1400, n: {es: 'Directora de arte', ca: 'Directora d\'art'}},
    {min: 2200, n: {es: 'Leyenda de Barcelona', ca: 'Llegenda de Barcelona'}}
  ];
  // Peces de l'aparador 3D i vestuari de la Lia que es desbloquegen per nivell
  const PIECE_LEVEL = {flores: 1, tarima: 1, arc: 2, garlanda: 2, neo: 3, maniqui: 4, mirall: 5};
  const OUTFITS = [
    {id: 'trencadis', lv: 0, n: {es: 'Trencadís', ca: 'Trencadís'}, t: {}},
    {id: 'mar', lv: 1, n: {es: 'Azul mar', ca: 'Blau mar'}, t: {prenda: '#eef5ff', pantalon: '#2b4a7a', bufanda0: '#1f7ae0', bufanda1: '#1f7ae0', armilla0: '#1f7ae0', armilla1: '#9fd3f2', armilla2: '#ffffff', armilla3: '#2b4a7a', armilla4: '#5fb3e0'}},
    {id: 'santjordi', lv: 2, n: {es: 'Sant Jordi', ca: 'Sant Jordi'}, t: {prenda: '#ffffff', pantalon: '#3d4a2a', bufanda0: '#c8102e', bufanda1: '#c8102e', armilla0: '#c8102e', armilla1: '#2e7d32', armilla2: '#ffffff', armilla3: '#e63950', armilla4: '#f8b62d'}},
    {id: 'gracia', lv: 3, n: {es: 'Fiesta de Gràcia', ca: 'Festa de Gràcia'}, t: {prenda: '#fff6e0', pantalon: '#5a2e6e', bufanda0: '#f08a24', bufanda1: '#f08a24', armilla0: '#e5483a', armilla1: '#f8b62d', armilla2: '#1f9d6b', armilla3: '#1f7ae0', armilla4: '#c2378a'}},
    {id: 'nit', lv: 4, n: {es: 'Noche en el Liceu', ca: 'Nit al Liceu'}, t: {prenda: '#1d2340', pantalon: '#141418', bufanda0: '#d4a640', bufanda1: '#d4a640', armilla0: '#14161c', armilla1: '#d4a640', armilla2: '#2a2f3c', armilla3: '#d4a640', armilla4: '#3b2b7a'}},
    {id: 'llegenda', lv: 5, n: {es: 'Leyenda', ca: 'Llegenda'}, t: {prenda: '#ffffff', pantalon: '#f2ece2', bufanda0: '#f8b62d', bufanda1: '#f8b62d', armilla0: '#f8b62d', armilla1: '#ffffff', armilla2: '#ffd36e', armilla3: '#e5b13a', armilla4: '#fff3c4'}}
  ];

  /* ---------------------------------------------------------------- reputació */
  function rep() {
    if (typeof saved === 'undefined') return 0;
    let r = (saved.seen || []).length * 5 + (saved.solved || []).length * 15;
    for (const j of Object.values(saved.jobs || {})) r += (j.rating || 0) * 12 + (j.stops || 0) * 3;
    const R = window.Talleres ? Talleres.ra() : {}, ev = R.evid || {};
    r += Object.values(ev).reduce((a, e) => a + e.stars * 60, 0) + Object.keys(R.ca || {}).length * 10;
    const st = ST(); if (st) { r += (st.fase || 0) * 100 + Object.keys(st.pruebas || {}).length * 40 + (st.final || 0) * 150;
      r += [2, 3, 4, 5].filter(id => (st.apoyos || {})[id] && Talleres.byNpc[id]?.done()).length * 50 }
    return r;
  }
  const level = r => LEVELS.reduce((l, L, k) => r >= L.min ? k : l, 0);
  function viva() {
    let alive = 0, screens = 0;
    for (let i = 0; i < 36; i++) { if (window.Missions?.isPrisma(i)) screens++; else if (Object.keys(saved.jobs || {}).some(k => k.startsWith(i + '-'))) alive++ }
    return {alive, screens};
  }
  const unlocked = k => level(rep()) >= (PIECE_LEVEL[k] || 0);
  const stars = () => Object.values((window.Talleres ? Talleres.ra().evid : null) || {}).reduce((a, e) => a + e.stars, 0);

  /* ---------------------------------------------------------------- marcador a la capçalera */
  const pill = document.createElement('button'); pill.id = 'progPill'; pill.title = tx({es: 'Tu progreso', ca: 'El teu progrés'});
  pill.onclick = () => panel();
  let lastKey = '';
  function tick() {
    if (typeof saved === 'undefined') return;
    const tools = document.querySelector('.tools'); if (tools && !pill.isConnected) tools.prepend(pill);
    const r = rep(), lv = level(r), v = viva(), next = LEVELS[lv + 1];
    if (saved.nivell == null) { saved.nivell = lv; save() }
    else if (lv > saved.nivell) { saved.nivell = lv; save(); levelUp(lv) }
    const key = r + '|' + v.alive + '|' + v.screens + '|' + saved.lang; if (key === lastKey) return; lastKey = key;
    pill.innerHTML = '<b>⭐ ' + r.toLocaleString('es-ES') + '</b><span>' + tx({es: 'Nv', ca: 'Nv'}) + ' ' + (lv + 1) + '</span><span class="viva">🏙️ ' + v.alive + '/36' + (v.screens ? ' · 📺 ' + v.screens : '') + '</span>' +
      '<i style="width:' + (next ? Math.round((r - LEVELS[lv].min) / (next.min - LEVELS[lv].min) * 100) : 100) + '%"></i>';
    sendSoon();
  }
  setInterval(tick, 1500);

  function levelUp(lv) {
    window.Sons?.play('fanfare'); window.Sons?.confetti(200);
    const pieces = Object.entries(PIECE_LEVEL).filter(([, l]) => l === lv).map(([k]) => k), outfit = OUTFITS.find(o => o.lv === lv);
    const t = document.createElement('div'); t.className = 'lvlup';
    t.innerHTML = '<small>' + tx({es: '¡Subes de nivel!', ca: 'Puges de nivell!'}) + '</small><b>' + tx(LEVELS[lv].n) + '</b>' +
      '<p>' + tx({es: 'Desbloqueado: ', ca: 'Desbloquejat: '}) + [...pieces.map(k => tx(PIECE_NAMES[k] || {es: k, ca: k})), outfit ? '👗 ' + tx(outfit.n) : ''].filter(Boolean).join(' · ') + '</p>';
    document.body.append(t); setTimeout(() => t.classList.add('on'), 30); setTimeout(() => { t.classList.remove('on'); setTimeout(() => t.remove(), 600) }, 5200);
  }
  const PIECE_NAMES = {flores: {es: 'Flores', ca: 'Flors'}, tarima: {es: 'Tarima', ca: 'Tarima'}, arc: {es: 'Arco', ca: 'Arc'}, garlanda: {es: 'Guirnalda de luces', ca: 'Garlanda de llums'},
    neo: {es: 'Rótulo de neón', ca: 'Rètol de neó'}, maniqui: {es: 'Maniquí', ca: 'Maniquí'}, mirall: {es: 'Espejo', ca: 'Mirall'}};

  /* ---------------------------------------------------------------- armari de la Lia */
  const outfitTint = () => (OUTFITS.find(o => o.id === saved.outfit) || OUTFITS[0]).t;
  function wear(id) { saved.outfit = id; save(); (typeof streetCast !== 'undefined' ? streetCast : null)?.hero?.retint?.(outfitTint()); window.Sons?.play('star') }

  /* ---------------------------------------------------------------- repte de classe */
  const FN = '/.netlify/functions/aparadors';
  async function call(body) {
    const r = await fetch(FN, {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify(body)});
    let d = null; try { d = await r.json() } catch {} if (!r.ok || !d) throw new Error((d && d.error) || tx({es: 'Sin conexión con el servidor', ca: 'Sense connexió amb el servidor'})); return d;
  }
  let sendTimer = 0, lastSent = '';
  function sendSoon() {
    const rp = saved.repte; if (!rp || !rp.codi || !rp.alumne) return;
    const body = {action: 'enviar', codi: rp.codi, alumne: rp.alumne, rep: rep(), nivell: level(rep()) + 1, estrelles: stars(), ca: Object.keys((window.Talleres ? Talleres.ra().ca : {}) || {}).length};
    const key = JSON.stringify(body); if (key === lastSent) return;
    clearTimeout(sendTimer); sendTimer = setTimeout(() => call(body).then(() => lastSent = key).catch(() => {}), 4000);
  }
  async function ranking(codi, host) {
    host.innerHTML = '<p>' + tx({es: 'Cargando…', ca: 'Carregant…'}) + '</p>';
    try {
      const d = await call({action: 'ranking', codi});
      host.innerHTML = '<p><b>' + d.classe + '</b> · ' + codi + (d.obert ? '' : ' · ' + tx({es: 'cerrado', ca: 'tancat'})) + '</p><table class="datos rank"><tr><th>#</th><th>' + tx({es: 'Alumno/a', ca: 'Alumne'}) + '</th><th>⭐</th><th>' + tx({es: 'Nivel', ca: 'Nivell'}) + '</th><th>★</th><th>CA</th></tr>' +
        d.alumnes.map((a, k) => '<tr class="' + (saved.repte && a.alumne.toLowerCase() === (saved.repte.alumne || '').toLowerCase() ? 'me' : '') + '"><td>' + (k < 3 ? ['🥇', '🥈', '🥉'][k] : k + 1) + '</td><td>' + a.alumne + '</td><td><b>' + a.rep + '</b></td><td>' + a.nivell + '</td><td>' + a.estrelles + '</td><td>' + a.ca + '</td></tr>').join('') + '</table>' +
        '<p class="hint">' + tx({es: 'Enlace para la clase: ', ca: 'Enllaç per a la classe: '}) + '<code>' + location.origin + location.pathname + '?repte=' + codi + '</code></p>';
    } catch (e) { host.innerHTML = '<p class="reply bad">' + e.message + '</p>' }
  }

  /* ---------------------------------------------------------------- panell */
  function panel(tab = 'prog') {
    const r = rep(), lv = level(r), v = viva(), next = LEVELS[lv + 1];
    const tabs = [['prog', {es: 'Progreso', ca: 'Progrés'}], ['armari', {es: 'Armario', ca: 'Armari'}], ['repte', {es: 'Reto de clase', ca: 'Repte de classe'}]];
    let body = '<div class="ptabs">' + tabs.map(([k, n]) => '<button data-tab="' + k + '" class="' + (k === tab ? 'on' : '') + '">' + tx(n) + '</button>').join('') + '</div>';
    if (tab === 'prog') {
      body += '<div class="plevel"><span class="pbig">⭐ ' + r.toLocaleString('es-ES') + '</span><div><b>' + tx({es: 'Nivel', ca: 'Nivell'}) + ' ' + (lv + 1) + ' · ' + tx(LEVELS[lv].n) + '</b><div class="pbar"><i style="width:' + (next ? Math.round((r - LEVELS[lv].min) / (next.min - LEVELS[lv].min) * 100) : 100) + '%"></i></div><small>' +
        (next ? tx({es: 'Faltan ', ca: 'En falten '}) + (next.min - r) + ' ⭐ ' + tx({es: 'para ', ca: 'per a '}) + tx(next.n) : tx({es: '¡Nivel máximo!', ca: 'Nivell màxim!'})) + '</small></div></div>' +
        '<div class="card"><b>🏙️ ' + tx({es: 'Barcelona viva', ca: 'Barcelona viva'}) + '</b><div class="vivabar"><i style="width:' + Math.round(v.alive / 36 * 100) + '%"></i><em style="width:' + Math.round(v.screens / 36 * 100) + '%"></em></div><small>' +
        v.alive + ' ' + tx({es: 'escaparates renovados por ti', ca: 'aparadors renovats per tu'}) + ' · ' + v.screens + ' ' + tx({es: 'pantallas de Prisma', ca: 'pantalles de Prisma'}) + '</small></div>' +
        '<div class="card"><b>' + tx({es: 'Cómo se gana reputación', ca: 'Com es guanya reputació'}) + '</b><ul class="g-list"><li>🛍️ ' + tx({es: 'Escaparates 3D: +3 por cada persona que se para', ca: 'Aparadors 3D: +3 per cada persona que s\'atura'}) + '</li><li>⭐ ' + tx({es: 'Misiones: +60 por estrella', ca: 'Missions: +60 per estrella'}) + '</li><li>📋 ' + tx({es: 'Criterios de evaluación: +10 cada uno', ca: 'Criteris d\'avaluació: +10 cadascun'}) + '</li><li>🤝 ' + tx({es: 'Vecinos firmes, ensayos y capítulos de la historia', ca: 'Veïns ferms, assajos i capítols de la història'}) + '</li><li>👀 ' + tx({es: 'Visitar tiendas y resolver sus observaciones', ca: 'Visitar botigues i resoldre\'n les observacions'}) + '</li></ul></div>' +
        '<div class="card"><b>' + tx({es: 'Desbloqueos', ca: 'Desbloquejos'}) + '</b><div class="unl">' + Object.entries(PIECE_LEVEL).map(([k, l]) => '<span class="' + (lv >= l ? 'on' : '') + '">' + (lv >= l ? '✓ ' : '🔒 ') + tx(PIECE_NAMES[k]) + ' <small>Nv ' + (l + 1) + '</small></span>').join('') +
        OUTFITS.slice(1).map(o => '<span class="' + (lv >= o.lv ? 'on' : '') + '">' + (lv >= o.lv ? '✓ ' : '🔒 ') + '👗 ' + tx(o.n) + ' <small>Nv ' + (o.lv + 1) + '</small></span>').join('') + '</div></div>';
    }
    if (tab === 'armari') {
      body += '<p>' + tx({es: 'Elige cómo viste Lia por Barcelona. Los nuevos conjuntos se desbloquean al subir de nivel.', ca: 'Tria com vesteix la Lia per Barcelona. Els conjunts nous es desbloquegen en pujar de nivell.'}) + '</p><div class="outfits">' +
        OUTFITS.map(o => { const ok = lv >= o.lv, c = o.t, sw = [c.armilla0 || '#f2c13a', c.armilla1 || '#2f5fb3', c.bufanda0 || '#a8352c', c.pantalon || '#8f8070'];
          return '<button data-out="' + o.id + '" class="outfit' + ((saved.outfit || 'trencadis') === o.id ? ' on' : '') + '"' + (ok ? '' : ' disabled') + '><span class="sws">' + sw.map(s => '<i style="background:' + s + '"></i>').join('') + '</span><b>' + tx(o.n) + '</b><small>' + (ok ? '' : '🔒 Nv ' + (o.lv + 1)) + '</small></button>' }).join('') + '</div>';
    }
    if (tab === 'repte') {
      const rp = saved.repte || {};
      body += '<div class="card"><b>' + tx({es: 'Unirme al reto de mi clase', ca: 'Unir-me al repte de la meva classe'}) + '</b><p class="hint">' + tx({es: 'Tu profesor o profesora te da un código. Usa tu nombre de pila o un alias.', ca: 'El teu professor o professora et dona un codi. Fes servir el teu nom de pila o un àlies.'}) + '</p>' +
        '<label class="field">' + tx({es: 'Código', ca: 'Codi'}) + ' <input id="rpCodi" value="' + (rp.codi || '') + '" placeholder="AP…" maxlength="7"></label><label class="field">' + tx({es: 'Nombre', ca: 'Nom'}) + ' <input id="rpNom" value="' + (rp.alumne || '') + '" maxlength="30"></label>' +
        '<button class="primary" id="rpJoin">' + tx({es: 'Unirme y enviar mi progreso', ca: 'Unir-me i enviar el meu progrés'}) + '</button></div><div id="rpRank"></div>' +
        '<details class="card"><summary><b>' + tx({es: 'Soy docente: crear un reto', ca: 'Soc docent: crear un repte'}) + '</b></summary><label class="field">' + tx({es: 'Nombre de la clase', ca: 'Nom de la classe'}) + ' <input id="rpClasse" maxlength="40" placeholder="1r CFGM Activitats Comercials"></label><button id="rpCrear">' + tx({es: 'Crear reto', ca: 'Crear repte'}) + '</button><div id="rpNou"></div></details>';
    }
    show(tx({es: 'Tu progreso', ca: 'El teu progrés'}), 'Aparadors BCN', body);
    sheet.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => panel(b.dataset.tab));
    sheet.querySelectorAll('[data-out]').forEach(b => b.onclick = () => { wear(b.dataset.out); panel('armari') });
    if ($('rpJoin')) {
      if (saved.repte?.codi) ranking(saved.repte.codi, $('rpRank'));
      $('rpJoin').onclick = () => { const codi = $('rpCodi').value.trim().toUpperCase(), alumne = $('rpNom').value.trim(); if (!codi || !alumne) return;
        saved.repte = {codi, alumne}; save(); lastSent = ''; call({action: 'enviar', codi, alumne, rep: rep(), nivell: level(rep()) + 1, estrelles: stars(), ca: Object.keys(Talleres.ra().ca || {}).length})
          .then(() => { window.Sons?.play('win'); ranking(codi, $('rpRank')) }).catch(e => $('rpRank').innerHTML = '<p class="reply bad">' + e.message + '</p>') };
      $('rpCrear').onclick = () => { const classe = $('rpClasse').value.trim(); if (!classe) return;
        call({action: 'crear', classe}).then(d => { $('rpNou').innerHTML = '<p class="reply">' + tx({es: 'Código del reto: ', ca: 'Codi del repte: '}) + '<b style="font-size:22px">' + d.codi + '</b><br>' + tx({es: 'Enlace: ', ca: 'Enllaç: '}) + '<code>' + location.origin + location.pathname + '?repte=' + d.codi + '</code><br><small>' + tx({es: 'Clave para cerrarlo (guárdala): ', ca: 'Clau per tancar-lo (desa-la): '}) + d.clau + '</small></p>'; $('rpCodi').value = d.codi })
          .catch(e => $('rpNou').innerHTML = '<p class="reply bad">' + e.message + '</p>') };
    }
  }

  // Enllaç ?repte=CODI: obre directament el repte amb el codi posat.
  setTimeout(() => { const c = new URLSearchParams(location.search).get('repte'); if (c && typeof saved !== 'undefined') { saved.repte = {...(saved.repte || {}), codi: c.toUpperCase()}; save(); panel('repte') } }, 1200);
  return {rep, level, unlocked, outfitTint, panel, PIECE_LEVEL, LEVELS};
})();
