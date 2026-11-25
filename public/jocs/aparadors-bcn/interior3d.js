/* Interiors 3D dels tallers: la botiga d'en Jan (RA1) i el lineal d'en Nil (RA2).
   Un sol renderitzador que es reaprofita entre redibuixos del panell i s'allibera sol quan el panell
   desapareix. Els clients són els personatges GLB del joc (Personajes3D), a la mateixa escala. */
window.Interior3D = (() => {
  const T = THREE, CELL = 32;
  let R = null;

  function dispose() {
    if (!R) return; cancelAnimationFrame(R.raf); R.renderer.dispose(); R.renderer.forceContextLoss();
    R.renderer.domElement.remove(); R = null;
  }
  function base(mode) {
    if (R && R.mode === mode) return R; dispose();
    let renderer; try { renderer = new T.WebGLRenderer({antialias: true}) } catch { return null }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6)); renderer.outputEncoding = T.sRGBEncoding; renderer.shadowMap.enabled = true;
    const scene = new T.Scene(); scene.background = new T.Color('#2b3433');
    scene.add(new T.HemisphereLight('#fff6e6', '#8a8070', .75));
    const sun = new T.DirectionalLight('#ffe9c8', .55); sun.position.set(-120, 300, 240); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, {left: -260, right: 260, top: 260, bottom: -260}); scene.add(sun);
    const cam = new T.PerspectiveCamera(40, 1.6, 1, 3000);
    R = {mode, renderer, scene, cam, yaw: .5, pitch: .75, dist: 430, center: new T.Vector3(), items: new T.Group(), dyn: new T.Group(), customers: [], onPick: null, picks: [], last: performance.now()};
    scene.add(R.items, R.dyn);
    const el = renderer.domElement; el.className = 'int3d-canvas';
    let drag = null;
    el.onpointerdown = e => { drag = {x: e.clientX, y: e.clientY, moved: false}; el.setPointerCapture?.(e.pointerId) };
    el.onpointermove = e => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
      if (drag.moved) { R.yaw -= dx * .008; R.pitch = Math.min(1.35, Math.max(.25, R.pitch + dy * .005)); drag.x = e.clientX; drag.y = e.clientY } };
    el.onpointerup = e => { const d = drag; drag = null; if (d && !d.moved) pick(e) };
    el.addEventListener('wheel', e => { e.preventDefault(); R.dist = Math.min(800, Math.max(200, R.dist + e.deltaY * .4)) }, {passive: false});
    const loop = () => {
      if (!R) return; R.raf = requestAnimationFrame(loop);
      if (!el.isConnected) { if (performance.now() - R.lostAt > 400) dispose(); return }   // el panell ha canviat: allibera la GPU
      R.lostAt = performance.now();
      const now = performance.now(), dt = Math.min(.1, (now - R.last) / 1000); R.last = now;
      const w = el.parentNode.clientWidth || 600, h = Math.round(Math.min(380, Math.max(240, w * .55)));
      if (el.width !== Math.round(w * renderer.getPixelRatio())) renderer.setSize(w, h, false), cam.aspect = w / h, cam.updateProjectionMatrix(), el.style.width = '100%', el.style.height = h + 'px';
      cam.position.set(R.center.x + Math.sin(R.yaw) * Math.cos(R.pitch) * R.dist, R.center.y + Math.sin(R.pitch) * R.dist, R.center.z + Math.cos(R.yaw) * Math.cos(R.pitch) * R.dist);
      cam.lookAt(R.center); R.customers.forEach(c => c.step(dt)); R.tick?.(dt, now); renderer.render(scene, cam);
    };
    R.lostAt = performance.now(); loop();
    return R;
  }
  function pick(e) {
    if (!R.onPick) return; const rc = R.renderer.domElement.getBoundingClientRect(), ray = new T.Raycaster();
    ray.setFromCamera({x: (e.clientX - rc.left) / rc.width * 2 - 1, y: 1 - (e.clientY - rc.top) / rc.height * 2}, R.cam);
    const hit = ray.intersectObjects(R.picks)[0]; if (hit) R.onPick(hit.object.userData.pick);
  }
  const mat = c => new T.MeshStandardMaterial({color: c, roughness: .8});
  function box(g, c, x, y, z, w, h, d) { const m = new T.Mesh(new T.BoxGeometry(w, h, d), typeof c === 'string' ? mat(c) : c); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; g.add(m); return m }
  function attach(host) { if (host && R && R.renderer.domElement.parentNode !== host) host.append(R.renderer.domElement) }

  /* Clients que caminen per una llista de punts [{x,z}] i fan un gest al final de cada tram. */
  function customer(model, path, loopPath = true) {
    if (!window.Personajes3D) return;
    const a = Personajes3D.actor(R.dyn, model, null, 0); let k = 0, x = path[0].x, z = path[0].z, wait = 0, yaw = 0;
    R.customers.push({step(dt) {
      if (wait > 0) { wait -= dt; a.pose(x, z, yaw, 0, false); return }
      const p = path[k], dx = p.x - x, dz = p.z - z, d = Math.hypot(dx, dz), v = 38 * dt;
      if (d < v) { x = p.x; z = p.z; if (p.stop) { wait = p.stop; a.gesture?.(p.gesture || 'senalar', p.stop) } k++; if (k >= path.length) { if (!loopPath) { wait = 1e9; return } k = 0; x = path[0].x; z = path[0].z } }
      else { x += dx / d * v; z += dz / d * v; yaw = Math.atan2(dx, dz) }
      a.pose(x, z, yaw, 0, true);
    }});
  }
  function clearCustomers() { R.customers = []; while (R.dyn.children.length) R.dyn.remove(R.dyn.children[0]) }

  /* ------------------------------------------------------------ RA1: la botiga d'en Jan */
  function tienda(host, o) {
    const fresh = !R || R.mode !== 'tienda'; if (!base('tienda')) return; attach(host);
    const GW = o.plan[0].length, GH = o.plan.length, cx = x => (x - GW / 2 + .5) * CELL, cz = y => (y - GH / 2 + .5) * CELL;
    if (fresh) {
      R.center.set(0, 10, 10); const room = new T.Group(); R.scene.add(room); R.tiles = [];
      for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
        const t = new T.Mesh(new T.BoxGeometry(CELL - 1.5, 2, CELL - 1.5), new T.MeshStandardMaterial({color: '#e8dcc3', roughness: .9}));
        t.position.set(cx(x), -1, cz(y)); t.receiveShadow = true; t.userData.pick = [x, y]; room.add(t); R.tiles.push(t); R.picks.push(t);
      }
      const W2 = GW * CELL / 2, H2 = GH * CELL / 2;
      box(room, '#d9c9a8', 0, 45, -H2 - 3, GW * CELL + 12, 90, 6); box(room, '#d2c19e', -W2 - 3, 45, 0, 6, 90, GH * CELL);
      box(room, '#d2c19e', W2 + 3, 45, 0, 6, 90, GH * CELL);
      const glass = new T.MeshStandardMaterial({color: '#9fc6d6', transparent: true, opacity: .25, roughness: .1});
      const door = o.door[0];
      for (let x = 0; x < GW; x++) if (x !== door) box(room, glass, cx(x), 45, H2 + 2, CELL, 90, 2);
      box(room, '#2f5b45', 0, 92, H2 + 2, GW * CELL, 8, 4);
      box(room, '#3aa36b', cx(o.exit[0]), 70, cz(o.exit[1]) - CELL / 2 + 4, 24, 10, 2);           // rètol de sortida
      const ext = box(room, '#c4302b', cx(o.ext[0]) + 10, 12, cz(o.ext[1]) - 10, 8, 24, 8);          // extintor
      const arrow = box(room, '#ffc96e', cx(door), 1, H2 + 22, 14, 2, 26);
    }
    // Mobles
    R.items.clear?.(); while (R.items.children.length) R.items.remove(R.items.children[0]);
    const lights = R.items;
    o.plan.forEach((row, y) => row.forEach((k, x) => {
      const X = cx(x), Z = cz(y);
      if (k === 'C') { box(lights, '#183e3a', X, 15, Z, 28, 30, 20); box(lights, '#c9c3b8', X, 32, Z, 12, 6, 10) }
      if (k === 'G') { box(lights, '#9a6a44', X, 22, Z, 26, 44, 12); for (let l = 0; l < 3; l++) for (let s of [-1, 1]) { box(lights, '#f3d48a', X + s * 7, 12 + l * 14, Z + 7, 6, 6, 4) } }
      if (k === 'N') { for (let l = 0; l < 3; l++) box(lights, '#e0a53a', X + (l - 1) * 7, 6 + l * 10, Z, 18, 10, 18) }
      if (k === 'X') { box(lights, '#9667bc', X, 14, Z, 20, 28, 20); const c = new T.Mesh(new T.ConeGeometry(9, 12, 16), mat('#fff0b8')); c.position.set(X, 34, Z); lights.add(c) }
      if (k === 'L') {
        const beam = new T.Mesh(new T.ConeGeometry(16, 88, 20, 1, true), new T.MeshBasicMaterial({color: '#ffe9a0', transparent: true, opacity: .18, depthWrite: false}));
        beam.position.set(X, 46, Z); lights.add(beam); box(lights, '#2b3034', X, 90, Z, 8, 6, 8);
        const s = new T.PointLight('#ffd27a', .7, 90); s.position.set(X, 60, Z); lights.add(s);
      }
    }));
    // Mapa de calor sobre les rajoles
    R.tiles.forEach(t => { const [x, y] = t.userData.pick, h = o.heat && o.heat[y][x];
      t.material.color.set(h == null ? '#e8dcc3' : new T.Color().setHSL((220 - 220 * h) / 360, .65, .58)) });
    R.onPick = p => o.onCell(p[0], p[1]);
    // Clients: recorren les cel·les accessibles més calentes i surten per la porta.
    clearCustomers();
    if (o.heat && o.path) {
      const models = ['avia_mercat', 'taxista', 'florista', 'llibreter', 'merce'];
      for (let n = 0; n < 5; n++) { const pts = o.path(n); if (pts.length > 1) customer(models[n], pts.map(([x, y], i) => ({x: cx(x), z: cz(y), stop: i && i % 3 === 0 ? 1.2 : 0}))) }
    }
  }

  /* ------------------------------------------------------------ RA2: el lineal d'en Nil */
  function lineal(host, o) {
    const fresh = !R || R.mode !== 'lineal'; if (!base('lineal')) return; attach(host);
    const COLS = o.grid[0].length, LV = o.grid.length, SW = 30, LH = 26, x0 = -(COLS * SW) / 2 + SW / 2, ly = l => 20 + (LV - 1 - l) * LH;
    if (fresh) {
      R.center.set(0, 55, 0); R.dist = 250; R.pitch = .28; R.yaw = .3;
      const room = new T.Group(); R.scene.add(room);
      box(room, '#cbb99a', 0, -1, 40, 400, 2, 220); box(room, '#d9c9a8', 0, 60, -24, 400, 120, 4);
      box(room, '#6b4a30', 0, 55, -14, COLS * SW + 10, 116, 4);
      for (let l = 0; l < LV; l++) box(room, '#8b6a4a', 0, ly(l) - 2, -4, COLS * SW + 8, 3, 22);
      for (const s of [-1, 1]) box(room, '#6b4a30', s * (COLS * SW / 2 + 4), 55, -4, 4, 116, 22);
      R.slots = [];
      for (let l = 0; l < LV; l++) for (let c = 0; c < COLS; c++) {
        const p = new T.Mesh(new T.BoxGeometry(SW - 2, LH - 4, 20), new T.MeshBasicMaterial({visible: false}));
        p.position.set(x0 + c * SW, ly(l) + LH / 2 - 2, -4); p.userData.pick = [l, c]; room.add(p); R.picks.push(p);
      }
      // Etiquetes de nivell
      ['Cap', 'Ulls', 'Mans', 'Terra'].forEach((n, l) => { const cv = document.createElement('canvas'); cv.width = 128; cv.height = 32; const g = cv.getContext('2d'); g.fillStyle = '#183e3a'; g.fillRect(0, 0, 128, 32); g.fillStyle = '#fff3da'; g.font = 'bold 20px Georgia'; g.textAlign = 'center'; g.fillText(o.levels?.[l] || n, 64, 23);
        const s = new T.Sprite(new T.SpriteMaterial({map: new T.CanvasTexture(cv)})); s.scale.set(34, 8.5, 1); s.position.set(-(COLS * SW) / 2 - 26, ly(l) + 10, 8); room.add(s) });
    }
    while (R.items.children.length) R.items.remove(R.items.children[0]);
    // Productes: piles de caixes; després de simular es veu l'estoc que queda i les ruptures
    o.grid.forEach((row, l) => row.forEach((k, c) => {
      if (!k) return; const col = o.colors[k], left = o.left ? o.left(l, c) : 1, n = Math.round(4 * left);
      for (let i = 0; i < 4; i++) {
        if (i >= n) continue; const heavy = k === 'D';
        box(R.items, col, x0 + c * SW + (i % 2 ? 6 : -6), ly(l) + (heavy ? 9 : 7) + Math.floor(i / 2) * (heavy ? 0 : 13), -4 + (i < 2 ? 4 : -4), heavy ? 12 : 10, heavy ? 16 : 12, 8);
      }
      if (o.left && n === 0) { const m = box(R.items, new T.MeshBasicMaterial({color: '#e0453a', transparent: true, opacity: .45}), x0 + c * SW, ly(l) + 8, 4, SW - 4, 14, 2); m.userData.flash = true }
    }));
    R.tick = (dt, now) => R.items.children.forEach(m => { if (m.userData.flash) m.material.opacity = .25 + .25 * Math.sin(now / 160) });
    R.onPick = p => o.onSlot(p[0], p[1]);
    clearCustomers();
    if (o.left) ['avia_mercat', 'music_jove', 'vermut'].forEach((m, k) => customer(m, [{x: -170 + k * 30, z: 140}, {x: -50 + k * 50, z: 30, stop: 1.6, gesture: 'senalar'}, {x: 40 + k * 30, z: 34, stop: 1.2, gesture: 'senalar'}, {x: 190, z: 140}]));
  }

  return {tienda, lineal, dispose};
})();
