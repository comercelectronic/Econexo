/* Aparador en directe: munta l'aparador en 3D arrossegant peces dins la vitrina i després mira com
   reacciona el carrer en una hora punta de 40 vianants (es compara amb la pantalla de Prisma: 16/40).
   Aparador3D.open(i, onDone) — i: índex de la botiga. Desa el resultat com a encàrrec (saved.jobs[i-0])
   i, si la botiga és d'un assaig de la història, l'hora punta compta com a assaig. */
window.Aparador3D = (() => {
  const T = THREE, tx = o => window.Talleres ? Talleres.tx(o) : (o && o.es) || o, $ = id => document.getElementById(id);
  const WW = 240, WD = 90, WH = 160;                         // vitrina: amplada, fons, alçada (cm)
  const BG = ['#f4e3c3', '#1d2340', '#c2378a', '#1f7ae0', '#2e8a5e', '#f08a24', '#ffffff', '#5a2e1e'];
  const PIECES = {
    pedestal: {n: {es: 'Peana', ca: 'Peanya'}, icon: '▉', cost: 12, kind: 'est'},
    caja: {n: {es: 'Caja', ca: 'Caixa'}, icon: '▣', cost: 8, kind: 'est'},
    tarima: {n: {es: 'Tarima', ca: 'Tarima'}, icon: '▭', cost: 14, kind: 'est'},
    planta: {n: {es: 'Planta', ca: 'Planta'}, icon: '🪴', cost: 6, kind: 'atr'},
    flores: {n: {es: 'Flores', ca: 'Flors'}, icon: '💐', cost: 6, kind: 'atr'},
    cartel: {n: {es: 'Cartel', ca: 'Cartell'}, icon: '🪧', cost: 7, kind: 'atr'},
    esfera: {n: {es: 'Esfera', ca: 'Esfera'}, icon: '●', cost: 5, kind: 'atr'}
  };
  const SPOTS = [-75, 0, 75];
  let R = null;

  /* ------------------------------------------------------------ escena */
  function build(host, i) {
    const renderer = new T.WebGLRenderer({antialias: true}); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
    renderer.outputEncoding = T.sRGBEncoding; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap; host.append(renderer.domElement);
    const sc = new T.Scene(), lin = c => new T.Color(c).convertSRGBToLinear(); sc.background = lin('#9fd3f2');
    const mat = (c, o = {}) => new T.MeshStandardMaterial({color: lin(c), roughness: .75, ...o});
    const box = (c, x, y, z, w, h, d, m) => { const o = new T.Mesh(new T.BoxGeometry(w, h, d), m || mat(c)); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; sc.add(o); return o };
    sc.add(new T.HemisphereLight(lin('#eef6ff'), lin('#8a7a66'), .55));
    const sun = new T.DirectionalLight(lin('#ffe8c8'), .5); sun.position.set(-200, 400, 400); sc.add(sun);
    // carrer i façana
    box('#c9c3b8', 0, -3, 160, 1400, 6, 420); box('#a8a49b', 0, 1, 340, 1400, 4, 6);
    const s = stores[i], paint = DistrictArt.paint[i % 6], trim = DistrictArt.trim[i % 6];
    box(paint, -260, 130, -10, 280, 300, 40); box(paint, 260, 130, -10, 280, 300, 40); box(paint, 0, 250, -10, 240, 140, 40);
    box(trim, 0, 175, WD / 2 + 4, WW + 30, 18, 8);
    const sign = document.createElement('canvas'); sign.width = 512; sign.height = 64; const sg = sign.getContext('2d');
    sg.fillStyle = trim; sg.fillRect(0, 0, 512, 64); sg.fillStyle = '#fff5dc'; sg.font = 'bold 38px Georgia'; sg.textAlign = 'center'; sg.fillText(s[0], 256, 46, 490);
    const st = new T.CanvasTexture(sign); st.encoding = T.sRGBEncoding;
    const sm = new T.Mesh(new T.PlaneGeometry(WW + 26, 16), new T.MeshBasicMaterial({map: st})); sm.position.set(0, 175, WD / 2 + 8.2); sc.add(sm);
    // vitrina
    const back = box('#f4e3c3', 0, WH / 2, -WD / 2 - 2, WW, WH, 4); const floor = box('#d8c3a0', 0, -2, 0, WW, 4, WD);
    box('#3a3f45', -WW / 2 - 3, WH / 2, 0, 6, WH, WD + 6); box('#3a3f45', WW / 2 + 3, WH / 2, 0, 6, WH, WD + 6); box('#3a3f45', 0, WH + 3, 0, WW + 12, 6, WD + 6);
    const glass = new T.Mesh(new T.PlaneGeometry(WW, WH), new T.MeshStandardMaterial({color: lin('#cfe8f5'), transparent: true, opacity: .08, roughness: .05, metalness: .2, depthWrite: false}));
    glass.position.set(0, WH / 2, WD / 2); sc.add(glass);
    // focus (3 posicions) amb llum real i con visible
    const spots = SPOTS.map(x => {
      const l = new T.SpotLight(lin('#ffd9a0'), 0, 320, .5, .55, 1.2); l.position.set(x, WH - 4, WD / 2 - 8); l.target.position.set(x, 0, -10); l.castShadow = true; l.shadow.mapSize.set(512, 512);
      const head = box('#22252a', x, WH - 6, WD / 2 - 10, 10, 8, 12); const beam = new T.Mesh(new T.ConeGeometry(28, WH - 10, 20, 1, true), new T.MeshBasicMaterial({color: lin('#ffe6a8'), transparent: true, opacity: 0, depthWrite: false}));
      beam.position.set(x, WH / 2, 0); sc.add(l, l.target, beam); return {x, l, head, beam, on: false};
    });
    const cam = new T.PerspectiveCamera(38, 1.6, 1, 4000);
    const pieces = new T.Group(); sc.add(pieces);
    return {renderer, sc, cam, back, floor, spots, pieces, lin, mat, box, i, yaw: 0, camMode: 'build', walkers: [], bubbles: [], temp: 'warm', bg: '#f4e3c3'};
  }

  /* Peça 3D segons el tipus. Els productes són els models del barri (DistrictArt.merch). */
  function makePiece(k, color) {
    const g = new T.Group(), lin = R.lin, m = c => R.mat(c);
    const add = (geo, c, y, x = 0, z = 0) => { const o = new T.Mesh(geo, m(c)); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; g.add(o); return o };
    let h = 30;
    if (k === 'pedestal') { add(new T.BoxGeometry(44, 40, 40), '#f6efe2', 20); h = 40 }
    else if (k === 'caja') { add(new T.BoxGeometry(30, 30, 30), '#c99a6a', 15); h = 30 }
    else if (k === 'tarima') { add(new T.BoxGeometry(110, 10, 60), '#8b6a4a', 5); h = 10 }
    else if (k === 'planta') { add(new T.CylinderGeometry(9, 7, 16, 14), '#c0603a', 8); for (let j = 0; j < 5; j++) add(new T.SphereGeometry(11, 10, 8), ['#3f7d2c', '#5a9a38', '#2e6b25'][j % 3], 26 + (j % 2) * 8, Math.cos(j * 1.3) * 8, Math.sin(j * 1.3) * 6); h = 40 }
    else if (k === 'flores') { add(new T.CylinderGeometry(6, 5, 18, 12), '#e8e2d3', 9); for (let j = 0; j < 7; j++) add(new T.SphereGeometry(4.5, 8, 6), ['#e0303f', '#ff6fa3', '#ffd23f', '#ffffff'][j % 4], 24 + (j % 3) * 4, Math.cos(j) * 6, Math.sin(j) * 5); h = 32 }
    else if (k === 'esfera') { add(new T.SphereGeometry(13, 20, 14), color || '#f8b62d', 13); h = 26 }
    else if (k === 'cartel') {
      const cv = document.createElement('canvas'); cv.width = 256; cv.height = 160; const q = cv.getContext('2d');
      q.fillStyle = '#fffaf0'; q.fillRect(0, 0, 256, 160); q.strokeStyle = '#1d2340'; q.lineWidth = 8; q.strokeRect(4, 4, 248, 152);
      q.fillStyle = '#e5483a'; q.font = 'bold 34px Georgia'; q.textAlign = 'center'; const t = R.claim || tx({es: '¡Novedad!', ca: 'Novetat!'}); q.fillText(t.slice(0, 14), 128, 70); q.fillStyle = '#1d2340'; q.font = '22px Georgia'; q.fillText(stores[R.i][0].slice(0, 18), 128, 112);
      const tt = new T.CanvasTexture(cv); tt.encoding = T.sRGBEncoding; const o = new T.Mesh(new T.PlaneGeometry(40, 25), new T.MeshBasicMaterial({map: tt})); o.position.y = 22; g.add(o);
      add(new T.BoxGeometry(2, 22, 2), '#3a3f45', 10, 0, -1); h = 35;
    } else {
      const p = DistrictArt.merch(k, color); p.scale.setScalar(40); p.traverse(o => { if (o.isMesh) { o.castShadow = true; o.material = o.material.clone(); o.material.color.convertSRGBToLinear() } }); g.add(p); h = 36;
    }
    g.userData = {k, h, scale: 1, color};
    return g;
  }

  /* ------------------------------------------------------------ puntuació en directe */
  function lum(hex) { const c = new T.Color(hex); return .2126 * c.r + .7152 * c.g + .0722 * c.b }
  function evaluate() {
    const s = stores[R.i], hero = s[6], side = s[7], P = R.pieces.children.map(o => ({o, k: o.userData.k, x: o.position.x, y: o.position.y, z: o.position.z, sc: o.userData.scale, h: o.userData.h}));
    const H = P.filter(p => p.k === hero).sort((a, b) => b.sc - a.sc)[0], C = P.find(p => p.k === side);
    const tips = [], parts = [];
    const add = (ok, pts, tip) => { parts.push(ok ? pts : 0); if (!ok) tips.push(tip) };
    add(!!H, 20, {es: 'Coloca el producto protagonista: ' + hero, ca: 'Col·loca el producte protagonista: ' + hero});
    const hidden = H && P.some(p => p !== H && p.z > H.z + 8 && Math.abs(p.x - H.x) < 25 && p.y + p.h * p.sc > H.y + 10 && !['tarima'].includes(p.k));
    add(H && !hidden, 10, {es: 'Algo tapa al protagonista desde la acera', ca: 'Alguna cosa tapa el protagonista des de la vorera'});
    add(H && H.y >= 25 && H.y <= 110, 12, {es: 'Eleva el protagonista a la altura de los ojos (sobre una peana)', ca: 'Eleva el protagonista a l\'altura dels ulls (sobre una peanya)'});
    const others = P.filter(p => p !== H && !PIECES[p.k]);
    add(H && others.every(p => H.sc >= p.sc * 1.15), 10, {es: 'Haz el protagonista más grande que el resto', ca: 'Fes el protagonista més gran que la resta'});
    add(C && H && Math.hypot(C.x - H.x, C.z - H.z) < 80, 12, {es: 'Pon el complemento (' + side + ') cerca del protagonista', ca: 'Posa el complement (' + side + ') a prop del protagonista'});
    const lit = R.spots.filter(sp => sp.on), onHero = H && lit.some(sp => Math.abs(sp.x - H.x) < 45);
    add(onHero, 12, {es: 'Encuadra un foco sobre el protagonista', ca: 'Encara un focus sobre el protagonista'});
    add(P.length >= 3 && P.length <= 8, 8, P.length > 8 ? {es: 'Demasiadas piezas: deja aire', ca: 'Massa peces: deixa aire'} : {es: 'Añade algunas piezas más', ca: 'Afegeix-hi alguna peça més'});
    add(P.some(p => PIECES[p.k]?.kind === 'est'), 6, {es: 'Usa una estructura (peana, caja o tarima)', ca: 'Fes servir una estructura (peanya, caixa o tarima)'});
    add(P.some(p => p.k === 'cartel'), 5, {es: 'Añade un cartel con mensaje', ca: 'Afegeix-hi un cartell amb missatge'});
    add(H && Math.abs(lum(R.bg) - lum(H.o.userData.color || '#ca7053')) > .25, 5, {es: 'Cambia el fondo para que el protagonista contraste', ca: 'Canvia el fons perquè el protagonista contrasti'});
    const score = Math.min(100, parts.reduce((a, b) => a + b, 0));
    return {score, tips: tips.slice(0, 2), stars: score >= 80 ? 3 : score >= 60 ? 2 : score >= 40 ? 1 : 0, H, P, lit};
  }

  /* ------------------------------------------------------------ interfície */
  function open(i, onDone) {
    close(); const s = stores[i], color = DistrictArt.paint[(i + 2) % 6];
    const ov = document.createElement('div'); ov.id = 'ap3d';
    ov.innerHTML = '<div class="ap-top"><div><small>' + tx({es: 'Escaparate en directo', ca: 'Aparador en directe'}) + ' · ' + s[1] + '</small><b>' + s[0] + '</b></div>' +
      '<div class="ap-goal">🎯 <span>' + tx({es: 'Protagonista', ca: 'Protagonista'}) + ': <b>' + s[6] + '</b></span> <span>➕ ' + s[7] + '</span> <span>💡 ' + tx({es: 'luz', ca: 'llum'}) + '</span></div>' +
      '<div class="ap-score"><div class="ap-bar"><i id="apBar"></i></div><span id="apStars">☆☆☆</span><span id="apTime">1:30</span></div><button id="apClose" title="Tancar">×</button></div>' +
      '<div id="apView"></div><div id="apTip" class="ap-tip"></div><div id="apSel" class="ap-sel" hidden><button data-s="up">➕</button><button data-s="down">➖</button><button data-s="rot">⟳</button><button data-s="del">🗑️</button></div>' +
      '<div class="ap-bottom"><div class="ap-tray" id="apTray"></div><div class="ap-side"><div>' + tx({es: 'Focos', ca: 'Focus'}) + ' ' + SPOTS.map((x, k) => '<button data-spot="' + k + '">' + ['◀', '●', '▶'][k] + '</button>').join('') + '</div><div>' + tx({es: 'Fondo', ca: 'Fons'}) + ' ' + BG.map(c => '<button data-bg="' + c + '" style="background:' + c + '"></button>').join('') + '</div>' +
      '<button class="ap-go" id="apGo">🚶 ' + tx({es: '¡Abre al público!', ca: 'Obre al públic!'}) + '</button></div></div>';
    document.body.append(ov);
    R = build($('apView'), i); R.onDone = onDone; R.claim = '';
    const prods = [s[6], s[6], s[7], ...Object.keys(catalog).filter(k => catalog[k].group === 'Producto' && k !== s[6] && k !== s[7]).slice(i % 9, i % 9 + 2)];
    const tray = [...prods.map((k, n) => ({k, label: k, icon: catalog[k]?.icon || '🎁', color: n < 2 ? color : DistrictArt.paint[(i + n) % 6], product: true})), ...Object.entries(PIECES).map(([k, p]) => ({k, label: tx(p.n), icon: p.icon}))];
    $('apTray').innerHTML = tray.map((t, n) => '<button class="ap-card' + (t.product ? ' prod' : '') + '" data-n="' + n + '"><span>' + t.icon + '</span>' + t.label + '</button>').join('');
    R.tray = tray; R.time = 90; R.started = performance.now(); R.phase = 'build';
    wire(); loop(); Sons.play('whoosh');
    tip({es: 'Arrastra piezas desde abajo hasta la vitrina. Pulsa una pieza para moverla, agrandarla o girarla.', ca: 'Arrossega peces des de baix fins a la vitrina. Toca una peça per moure-la, fer-la més gran o girar-la.'});
  }
  function close() { if (!R) return; cancelAnimationFrame(R.raf); R.renderer.dispose(); R.renderer.forceContextLoss(); R = null; $('ap3d')?.remove() }
  let tipTimer = 0;
  function tip(t, ms = 5000) { const el = $('apTip'); if (!el) return; el.textContent = tx(t); el.classList.add('on'); clearTimeout(tipTimer); tipTimer = setTimeout(() => el.classList.remove('on'), ms) }

  function wire() {
    const el = R.renderer.domElement, ray = new T.Raycaster(), ndc = e => { const r = el.getBoundingClientRect(); return {x: (e.clientX - r.left) / r.width * 2 - 1, y: 1 - (e.clientY - r.top) / r.height * 2} };
    const surfaceAt = e => { ray.setFromCamera(ndc(e), R.cam);
      const supports = R.pieces.children.filter(o => PIECES[o.userData.k]?.kind === 'est' && o !== R.drag), hits = ray.intersectObjects([R.floor, R.back, ...supports], true);
      const h = hits.find(x => x.face && x.face.normal.y > .5) || hits[0]; if (!h) return null;
      if (h.object === R.back) return {x: Math.max(-WW / 2 + 15, Math.min(WW / 2 - 15, h.point.x)), y: 0, z: -WD / 2 + 14};   // deixada a la paret: al terra, al fons
      return {x: Math.max(-WW / 2 + 15, Math.min(WW / 2 - 15, h.point.x)), y: Math.max(0, h.point.y), z: Math.max(-WD / 2 + 12, Math.min(WD / 2 - 12, h.point.z))} };
    const pickPiece = e => { ray.setFromCamera(ndc(e), R.cam); const h = ray.intersectObjects(R.pieces.children, true)[0]; if (!h) return null; let o = h.object; while (o.parent !== R.pieces) o = o.parent; return o };
    // arrossegar des de la safata
    document.querySelectorAll('#apTray .ap-card').forEach(b => b.onpointerdown = e => {
      if (R.phase !== 'build') return; e.preventDefault(); const t = R.tray[+b.dataset.n];
      if (R.pieces.children.length >= 12) return tip({es: 'Máximo 12 piezas: un escaparate saturado no se lee.', ca: 'Màxim 12 peces: un aparador saturat no es llegeix.'});
      const o = makePiece(t.k, t.color); o.visible = false; R.pieces.add(o); R.drag = o; R.fromTray = true; Sons.play('pop');
      const mv = ev => { const p = surfaceAt(ev); if (p) { o.visible = true; o.position.set(p.x, p.y, p.z) } };
      const up = ev => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); R.drag = null;
        if (!o.visible) { R.pieces.remove(o); return } Sons.play('drop'); select(o); refresh() };
      addEventListener('pointermove', mv); addEventListener('pointerup', up);
    });
    // moure peces i orbitar
    let orbit = null;
    el.onpointerdown = e => {
      if (R.phase !== 'build') return; const o = pickPiece(e);
      if (o) { select(o); R.drag = o; const mv = ev => { const p = surfaceAt(ev); if (p) o.position.set(p.x, p.y, p.z) }; const up = () => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); R.drag = null; Sons.play('drop'); refresh() }; addEventListener('pointermove', mv); addEventListener('pointerup', up); return }
      select(null); orbit = e.clientX; const mv = ev => { R.yaw = Math.max(-.5, Math.min(.5, R.yaw - (ev.clientX - orbit) * .004)); orbit = ev.clientX }; const up = () => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up) };
      addEventListener('pointermove', mv); addEventListener('pointerup', up);
    };
    $('apSel').onclick = e => { const b = e.target.closest('[data-s]'), o = R.sel; if (!b || !o) return; const a = b.dataset.s;
      if (a === 'up') o.userData.scale = Math.min(1.7, o.userData.scale + .15); if (a === 'down') o.userData.scale = Math.max(.6, o.userData.scale - .15);
      if (a === 'rot') o.rotation.y += Math.PI / 6; if (a === 'del') { R.pieces.remove(o); select(null) } else o.scale.setScalar(o.userData.scale);
      Sons.play(a === 'del' ? 'drop' : 'pop'); refresh() };
    document.querySelectorAll('[data-spot]').forEach(b => b.onclick = () => { const sp = R.spots[+b.dataset.spot]; sp.on = !sp.on; b.classList.toggle('on', sp.on); Sons.play(sp.on ? 'ding' : 'tic'); refresh() });
    document.querySelectorAll('[data-bg]').forEach(b => b.onclick = () => { R.bg = b.dataset.bg; R.back.material.color.copy(R.lin(R.bg)); Sons.play('pop'); refresh() });
    $('apGo').onclick = () => rush();
    $('apClose').onclick = () => { close(); R?.onDone?.() };
  }
  function select(o) {
    R.pieces.children.forEach(p => p.traverse(m => { if (m.isMesh && m.material.emissive) m.material.emissive.setHex(p === o ? 0x332200 : 0) }));
    R.sel = o; const s = $('apSel'); if (s) s.hidden = !o;
  }
  let lastStars = 0;
  function refresh() {
    const ev = evaluate(); $('apBar').style.width = ev.score + '%'; $('apBar').style.background = ev.score >= 80 ? '#1f9d6b' : ev.score >= 60 ? '#f8b62d' : '#e5483a';
    $('apStars').textContent = '★'.repeat(ev.stars) + '☆'.repeat(3 - ev.stars);
    if (ev.stars > lastStars) Sons.play('star'); lastStars = ev.stars;
    if (ev.tips[0]) tip(ev.tips[0], 4000); else tip({es: '¡Escaparate redondo! Ábrelo al público.', ca: 'Aparador rodó! Obre\'l al públic.'}, 4000);
    R.spots.forEach(sp => { sp.l.intensity = sp.on ? 2.2 : 0; sp.beam.material.opacity = sp.on ? .12 : 0; sp.head.material.color.copy(R.lin(sp.on ? '#ffd27a' : '#22252a')) });
    return ev;
  }

  /* ------------------------------------------------------------ hora punta */
  const MODELS = ['avi_barca', 'forner', 'music', 'llibreter', 'florista', 'taxista', 'vermut', 'avia_mercat', 'pescador', 'music_jove', 'jove_barca', 'skater', 'merce', 'casteller'];
  function rush() {
    if (R.phase !== 'build') return; const ev = refresh(); select(null);
    if (!ev.H) return tip({es: 'Primero coloca el producto protagonista.', ca: 'Primer col·loca el producte protagonista.'});
    R.phase = 'rush'; R.ev = ev; R.camMode = 'street'; $('apTime').style.visibility = 'hidden'; R.rush = {n: 0, stops: 0, enters: 0, t: 0, total: 40};
    document.querySelector('#ap3d .ap-bottom').innerHTML = '<div class="ap-rush"><div><b id="apPass">0</b><small>' + tx({es: 'pasan', ca: 'passen'}) + '</small></div><div><b id="apStop">0</b><small>' + tx({es: 'se paran', ca: 's\'aturen'}) + '</small></div><div><b id="apIn">0</b><small>' + tx({es: 'entran', ca: 'entren'}) + '</small></div><div class="ap-vs">' + tx({es: 'Pantalla de Prisma: 16 de 40', ca: 'Pantalla de Prisma: 16 de 40'}) + '</div></div>';
    Sons.play('whoosh'); tip({es: '¡Hora punta! Mira cómo reacciona la calle…', ca: 'Hora punta! Mira com reacciona el carrer…'}, 3000);
    if (window.Personajes3D) for (let k = 0; k < 10; k++) { const a = Personajes3D.actor(R.sc, MODELS[(k + R.i) % MODELS.length], null, 0); R.walkers.push({a, busy: false}) }
  }
  function bubble(x, y, z, text) {
    const cv = document.createElement('canvas'); cv.width = 128; cv.height = 128; const g = cv.getContext('2d');
    g.fillStyle = '#fff'; g.beginPath(); g.arc(64, 56, 46, 0, 7); g.fill(); g.beginPath(); g.moveTo(50, 96); g.lineTo(64, 122); g.lineTo(76, 96); g.fill();
    g.font = '52px "Segoe UI Emoji",sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 64, 58);
    const tt = new T.CanvasTexture(cv), sp = new T.Sprite(new T.SpriteMaterial({map: tt, depthTest: false})); sp.scale.set(28, 28, 1); sp.position.set(x, y, z); sp.renderOrder = 9; R.sc.add(sp);
    R.bubbles.push({sp, life: 2.2});
  }
  function rushStep(dt) {
    const r = R.rush; r.t += dt;
    if (r.n < r.total && r.t > r.n * .9) {
      const w = R.walkers.find(w => !w.busy); if (w) {
        const dir = r.n % 2 ? 1 : -1, p = .05 + Math.pow(R.ev.score / 100, 1.5) * .8;   // 50 punts ≈ 13/40 (guanya la pantalla), 70 ≈ 21, 90 ≈ 29
        Object.assign(w, {busy: true, x: -dir * 520, z: 150 + (r.n % 3) * 28, dir, stop: Math.random() < p, done: false, wait: 0, enter: false}); w.enter = w.stop && Math.random() < .25 + R.ev.score / 250; r.n++; $('apPass').textContent = r.n;
      }
    }
    for (const w of R.walkers) {
      if (!w.busy) { w.a.g.visible = false; continue }
      w.a.g.visible = true;
      if (w.wait > 0) { w.wait -= dt; w.a.pose(w.x, w.z, Math.PI, 0, false); if (w.wait <= 0) { w.done = true; if (w.enter) { r.enters++; $('apIn').textContent = r.enters; Sons.play('coin'); bubble(w.x, 90, w.z, '💶') } } continue }
      w.x += w.dir * 120 * dt;
      if (w.stop && !w.done && Math.abs(w.x) < 60) { w.wait = 1.6; r.stops++; $('apStop').textContent = r.stops; Sons.play('ding'); bubble(w.x, 85, w.z, R.ev.score >= 80 ? '😍' : R.ev.score >= 55 ? '😊' : '🤔'); w.a.gesture?.('senalar', 1.4) }
      w.a.pose(w.x, w.z, w.dir > 0 ? Math.PI / 2 : -Math.PI / 2, 0, true);
      if (Math.abs(w.x) > 560) w.busy = false;
    }
    if (r.n >= r.total && R.walkers.every(w => !w.busy)) finish();
  }
  function finish() {
    R.phase = 'end'; const r = R.rush, ev = R.ev, won = r.stops > 16, i = R.i;
    // Desa com a encàrrec (format del taller 2D) perquè el barri, el quadern i els assajos el reconeguin.
    const design = {i, j: 0, bg: R.bg, floor: '#d8c3a0', material: 'Liso', temp: 'Cálida', finish: 'Mate', power: 70, caption: R.claim, intent: 'Escaparate 3D', d3: true,
      lighting: ev.lit.length >= 3 ? 'Difusa' : ev.lit.length === 2 ? 'Doble' : ev.lit[0]?.x === 0 ? 'Central' : 'Lateral',
      pieces: ev.P.map(p => ({k: catalog[p.k] ? p.k : p.k === 'flores' ? 'flor' : p.k === 'planta' ? 'hojas' : p.k === 'tarima' ? 'escalón' : 'esfera', x: .5 + p.x / WW, y: .95 - p.y / WH, scale: p.sc, rot: 0, color: p.o.userData.color || '#bd765b', text: p.k === 'cartel' ? (R.claim || 'Novetat') : 'Campaña'}))};
    const rating = Math.round(ev.score / 100 * 8);
    const prev = saved.jobs[i + '-0']; if (!prev || (prev.rating || 0) <= rating) saved.jobs[i + '-0'] = {rating, seconds: Math.round((performance.now() - R.started) / 1000), design};
    let trial = '';
    if (typeof story !== 'undefined' && story.fase === 1 && [4, 9].includes(i)) {
      if (won) { story.pruebas[i] = {pasantes: 40, pantalla: 16, vitrina: r.stops}; trial = tx({es: 'Ensayo registrado para la asamblea.', ca: 'Assaig registrat per a l\'assemblea.'}) }
      else trial = tx({es: 'La pantalla gana este ensayo. Mejora el escaparate y vuelve a abrir.', ca: 'La pantalla guanya aquest assaig. Millora l\'aparador i torna a obrir.'});
    }
    if (window.Talleres) { const c = Talleres.ra().ca; ['4.6', '4.7', '4.8', '4.5'].forEach(k => c[k] = true) }
    save();
    if (won) { Sons.play('fanfare'); Sons.confetti() } else Sons.play('error');
    const stars = r.stops >= 28 ? 3 : r.stops >= 22 ? 2 : r.stops > 16 ? 1 : 0;
    const box = document.createElement('div'); box.className = 'ap-result';
    box.innerHTML = '<h2>' + (won ? tx({es: '¡Tu escaparate gana a la pantalla!', ca: 'El teu aparador guanya la pantalla!'}) : tx({es: 'La pantalla de Prisma ha atraído más', ca: 'La pantalla de Prisma ha atret més'})) + '</h2>' +
      '<p class="ap-big">' + '★'.repeat(stars) + '<i>' + '★'.repeat(3 - stars) + '</i></p>' +
      '<div class="ap-cmp"><div><b>' + r.stops + '</b>/40<small>' + tx({es: 'tu escaparate', ca: 'el teu aparador'}) + '</small></div><div class="vs">VS</div><div><b>16</b>/40<small>' + tx({es: 'pantalla', ca: 'pantalla'}) + '</small></div></div>' +
      '<p>' + r.enters + ' ' + tx({es: 'personas han entrado en la tienda.', ca: 'persones han entrat a la botiga.'}) + ' ' + trial + '</p>' +
      (ev.tips.length ? '<p class="ap-hint">💡 ' + tx(ev.tips[0]) + '</p>' : '') +
      '<div><button class="ap-go" id="apAgain">↺ ' + tx({es: 'Mejorar y repetir', ca: 'Millorar i repetir'}) + '</button> <button id="apExit">' + tx({es: 'Volver a la calle', ca: 'Tornar al carrer'}) + '</button></div>';
    $('ap3d').append(box);
    $('apAgain').onclick = () => { const keep = R.pieces.children.map(o => ({k: o.userData.k, c: o.userData.color, p: o.position.clone(), s: o.userData.scale, r: o.rotation.y})), sp = R.spots.map(s => s.on), bg = R.bg, i2 = R.i, cb = R.onDone;
      open(i2, cb); keep.forEach(q => { const o = makePiece(q.k, q.c); o.position.copy(q.p); o.userData.scale = q.s; o.scale.setScalar(q.s); o.rotation.y = q.r; R.pieces.add(o) });
      sp.forEach((on, k) => { R.spots[k].on = on; document.querySelector('[data-spot="' + k + '"]').classList.toggle('on', on) }); R.bg = bg; R.back.material.color.copy(R.lin(bg)); refresh() };
    $('apExit').onclick = () => { const cb = R.onDone; close(); if (typeof story !== 'undefined' && story.fase === 1 && [4, 9].every(k => story.pruebas[k])) { story.fase = 2; save(); window.Missions ? Missions.storyStart() : storyPanel() } else if (cb) cb(); else if (typeof street === 'function') street() };
  }

  /* ------------------------------------------------------------ bucle */
  function loop() {
    if (!R) return; R.raf = requestAnimationFrame(loop);
    const el = R.renderer.domElement, host = el.parentNode, w = host.clientWidth, h = host.clientHeight;
    if (el.width !== Math.round(w * R.renderer.getPixelRatio()) || el.height !== Math.round(h * R.renderer.getPixelRatio())) { R.renderer.setSize(w, h, false); el.style.width = w + 'px'; el.style.height = h + 'px'; R.cam.aspect = w / h; R.cam.updateProjectionMatrix() }
    const now = performance.now(), dt = Math.min(.05, (now - (R.last || now)) / 1000); R.last = now;
    if (R.phase === 'build') {
      R.time -= dt; const t = Math.max(0, R.time); $('apTime').textContent = Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0');
      $('apTime').classList.toggle('urgent', t < 15); if (t <= 0) rush();
    } else if (R.phase === 'rush') rushStep(dt);
    R.bubbles = R.bubbles.filter(b => { b.life -= dt; b.sp.position.y += dt * 12; b.sp.material.opacity = Math.min(1, b.life); if (b.life <= 0) { R.sc.remove(b.sp); return false } return true });
    const street = R.camMode === 'street', target = new T.Vector3(0, street ? 70 : 62, street ? 40 : 0);
    const dist = (street ? 560 : 330) * Math.max(1, 1.6 / R.cam.aspect), yaw = street ? .35 + Math.sin(now / 4000) * .05 : R.yaw;
    const goal = new T.Vector3(Math.sin(yaw) * dist, street ? 190 : 95, Math.cos(yaw) * dist);
    R.cam.position.lerp(goal, street ? .03 : .2); R.cam.lookAt(target);
    R.renderer.render(R.sc, R.cam);
  }

  // Botó «Munta l'aparador en 3D» als panells de botiga.
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-ap3d]'); if (b) { e.preventDefault(); if (typeof modal !== 'undefined' && modal.open) modal.close(); open(+b.dataset.ap3d) } });
  return {open, close};
})();
