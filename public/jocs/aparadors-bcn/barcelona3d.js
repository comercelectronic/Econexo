/* Rasgos del Eixample para el paseo 3D: fincas de varias plantas con balcones de forja y persianas
   de librillo, acera de panot de flor, asfalto, plátanos de sombra, farolas y bancos.
   Todo se añade al grupo «solid», que index.html agrupa después en InstancedMesh. */
window.Barcelona3D = (() => {
  const stucco = ['#dcc6a2', '#cfa77f', '#e6d6ba', '#c08e6e', '#d9b98d', '#cdbfa8', '#e2c9a6', '#b9a08a'];
  const shutters = ['#4f7556', '#3f6a5e', '#6d7f55', '#5b6f4f', '#7a5a3a'];
  const IRON = '#2b3034', GLASS = '#3b5566', STONE = '#efe2c8', BARK = '#a39a82';
  const LEAVES = ['#4a7329', '#5a8531', '#416825', '#638f37'];

  function canvasTexture(draw, size = 256) {
    const c = document.createElement('canvas'); c.width = c.height = size; draw(c.getContext('2d'), size);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.encoding = THREE.sRGBEncoding; t.anisotropy = 8;
    return t;
  }
  // Panot de flor: baldosa hidráulica gris de 4 pastillas con una flor de cuatro pétalos.
  function panot() {
    return canvasTexture((g, s) => {
      const q = s / 2;
      g.fillStyle = '#cbc6bc'; g.fillRect(0, 0, s, s);
      const petals = (cx, cy, r, w, rot = 0) => {
        for (let k = 0; k < 4; k++) { g.save(); g.translate(cx, cy); g.rotate(rot + k * Math.PI / 2); g.beginPath(); g.ellipse(0, -r, w, r * .85, 0, 0, 7); g.fill(); g.restore() }
      };
      for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
        const x = i * q, y = j * q;
        g.save(); g.beginPath(); g.rect(x, y, q, q); g.clip();
        g.fillStyle = '#b4aea3'; petals(x + q / 2, y + q / 2, q * .2, q * .085);
        g.beginPath(); g.arc(x + q / 2, y + q / 2, q * .05, 0, 7); g.fill();
        for (const [a, b] of [[x, y], [x + q, y], [x, y + q], [x + q, y + q]]) petals(a, b, q * .12, q * .05, Math.PI / 4);
        g.restore();
        g.strokeStyle = '#a7a196'; g.lineWidth = 3; g.strokeRect(x + 1.5, y + 1.5, q - 3, q - 3);
      }
      for (let n = 0; n < 1400; n++) { g.fillStyle = 'rgba(70,60,50,' + (Math.random() * .07) + ')'; g.fillRect(Math.random() * s, Math.random() * s, 2, 2) }
    });
  }
  function asphalt() {
    return canvasTexture((g, s) => {
      g.fillStyle = '#5b5e61'; g.fillRect(0, 0, s, s);
      for (let n = 0; n < 6000; n++) { const v = 60 + Math.random() * 70 | 0; g.fillStyle = 'rgba(' + v + ',' + v + ',' + (v + 4) + ',.35)'; g.fillRect(Math.random() * s, Math.random() * s, 1.6, 1.6) }
    });
  }

  // Posició de cada fila d'illes (eix z). Després de la fila 2 hi ha la Plaça de Catalunya, un espai obert.
  const ROWY = [26, 361, 696, 1331, 1666, 2001], H = 2350;
  // Lloc de cada botiga al mapa (fila per fila). La llista de botigues no canvia d'ordre, així les partides guardades es mantenen.
  const AT = [1, 5, 10, 15, 32, 23,      // Passeig de Gràcia: moda, disseny, òptica, joieria, il·luminació, ceràmica
              3, 2, 11, 28, 30, 33,      // Passeig de Gràcia · Gran Via: Barça Store, Loewe, papereria, parament, muntanya, cosmètica
              6, 9, 12, 17, 20, 21,      // Plaça de Catalunya: Fnac, discos, fotografia, joguines, cafè, electrònica
              4, 14, 18, 19, 29, 7,      // Portal de l'Àngel: cereria, luthier, merceria, llibreria, enquadernació, pastisseria
              0, 8, 16, 24, 25, 27,      // La Rambla: Escribà, flors, calçat, viatges, fleca, segona mà
              13, 22, 26, 31, 35, 34];   // Port Vell: bicis, perfumeria, running, patinatge, nàutica, jocs
  const SLOT = []; AT.forEach((store, slot) => SLOT[store] = slot);
  const roadZ = r => ROWY[r] + (r === 2 ? 412 : 262);
  // De nord a sud, com a la ciutat. road: si la fila té calçada central per a cotxes.
  const ZONES = [
    {k: 'pg', name: 'Passeig de Gràcia', road: true, lanes: [[-40, -33], [38, 70]], people: 4},
    {k: 'pg', name: 'Passeig de Gràcia · Gran Via', road: true, lanes: [[-40, -33], [38, 70]], people: 4},
    {k: 'placa', name: 'Plaça de Catalunya', road: false, lanes: [[-190, -60], [40, 230]], people: 8},
    {k: 'portal', name: 'Portal de l\'Àngel', road: false, lanes: [[-55, -15], [15, 100]], people: 7},
    {k: 'rambla', name: 'La Rambla', road: false, lanes: [[-30, -8], [8, 30]], people: 6},
    {k: 'port', name: 'Port Vell · Colom', road: true, lanes: [[-40, -33], [38, 100]], people: 4}
  ];
  // Panot de Gaudí: rajola hexagonal amb motius marins en relleu (estrella, cargol, alga).
  const hexTex = () => canvasTexture((g, s) => {
    g.fillStyle = '#a8aca2'; g.fillRect(0, 0, s, s); const r = s / 4, hgt = r * Math.sqrt(3);
    const hex = (cx, cy, k) => { g.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i; g.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)) } g.closePath();
      g.fillStyle = '#b9bdb2'; g.fill(); g.strokeStyle = '#8f9389'; g.lineWidth = 3; g.stroke();
      g.strokeStyle = '#9da196'; g.lineWidth = 4; g.beginPath();
      if (k % 3 === 0) for (let i = 0; i < 5; i++) { const a = i * 1.2566; g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * r * .6, cy + Math.sin(a) * r * .6) }
      else if (k % 3 === 1) for (let a = 0; a < 12; a += .2) { const rr = a * r * .05; g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) }
      else { g.arc(cx, cy, r * .5, .3, 2.8); g.moveTo(cx - r * .4, cy + r * .2); g.quadraticCurveTo(cx, cy - r * .5, cx + r * .4, cy + r * .2) }
      g.stroke() };
    let k = 0; for (let y = -hgt; y < s + hgt; y += hgt) for (let x = 0, c = 0; x < s + 2 * r; x += r * 1.5, c++) hex(x, y + (c % 2 ? hgt / 2 : 0), k++);
  });
  const granitTex = () => canvasTexture((g, s) => {
    g.fillStyle = '#c9c6bf'; g.fillRect(0, 0, s, s);
    for (let y = 0; y < s; y += 64) for (let x = (y / 64) % 2 * 64; x < s + 128; x += 128) { g.strokeStyle = '#a9a69f'; g.lineWidth = 2; g.strokeRect(x - 64, y, 128, 64) }
    for (let n = 0; n < 5000; n++) { const v = Math.random() * 120 + 90 | 0; g.fillStyle = 'rgba(' + v + ',' + v + ',' + v + ',.35)'; g.fillRect(Math.random() * s, Math.random() * s, 1.5, 1.5) }
  });
  const ramblaTex = () => canvasTexture((g, s) => {   // rajoles de la Rambla: onades
    g.fillStyle = '#d6cdb9'; g.fillRect(0, 0, s, s); g.strokeStyle = '#a99f8b'; g.lineWidth = 9;
    for (let y = -s; y < 2 * s; y += 40) { g.beginPath(); for (let x = 0; x <= s; x += 4) g.lineTo(x, y + Math.sin(x / s * Math.PI * 2) * 18 + x * .0); g.stroke() }
  });
  const rosaTex = () => canvasTexture((g, s) => {     // rosa dels vents de la Plaça de Catalunya
    const c = s / 2; g.fillStyle = '#e8e1d0'; g.fillRect(0, 0, s, s); g.fillStyle = '#d8cfb8'; g.beginPath(); g.arc(c, c, c * .98, 0, 7); g.fill();
    for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, L = i % 4 === 0 ? c * .95 : i % 2 ? c * .45 : c * .7; g.fillStyle = i % 2 ? '#6b6457' : '#3d5d74';
      g.beginPath(); g.moveTo(c, c); g.lineTo(c + Math.cos(a - .12) * L * .3, c + Math.sin(a - .12) * L * .3); g.lineTo(c + Math.cos(a) * L, c + Math.sin(a) * L); g.lineTo(c + Math.cos(a + .12) * L * .3, c + Math.sin(a + .12) * L * .3); g.fill() }
    g.strokeStyle = '#8a7a5c'; g.lineWidth = 6; g.beginPath(); g.arc(c, c, c * .96, 0, 7); g.stroke();
  }, 512);
  const miroTex = () => canvasTexture((g, s) => {     // mosaic circular de colors primaris al terra de la Rambla
    const c = s / 2; g.fillStyle = '#ece4d2'; g.beginPath(); g.arc(c, c, c, 0, 7); g.fill();
    g.fillStyle = '#d22d2d'; g.beginPath(); g.arc(c * .8, c * .9, c * .28, 0, 7); g.fill(); g.fillStyle = '#f0c419'; g.beginPath(); g.ellipse(c * 1.3, c * .7, c * .22, c * .14, .5, 0, 7); g.fill();
    g.fillStyle = '#1f4fa0'; g.beginPath(); g.moveTo(c * 1.1, c * 1.2); g.lineTo(c * 1.6, c * 1.35); g.lineTo(c * 1.2, c * 1.6); g.fill(); g.strokeStyle = '#151515'; g.lineWidth = 8; g.beginPath(); g.arc(c * .8, c * .9, c * .3, 0, 7); g.moveTo(c * .5, c * 1.5); g.quadraticCurveTo(c, c * 1.9, c * 1.5, c * 1.45); g.stroke();
  });
  const marTex = () => canvasTexture((g, s) => { g.fillStyle = '#3f7f92'; g.fillRect(0, 0, s, s); for (let n = 0; n < 260; n++) { g.fillStyle = 'rgba(220,240,240,' + (Math.random() * .35) + ')'; g.fillRect(Math.random() * s, Math.random() * s, 8 + Math.random() * 20, 2) } });
  const fustaTex = () => canvasTexture((g, s) => { g.fillStyle = '#a9835e'; g.fillRect(0, 0, s, s); for (let y = 0; y < s; y += 16) { g.fillStyle = y % 32 ? '#9c7853' : '#b08b64'; g.fillRect(0, y, s, 14) } });
  const trencadisTex = () => canvasTexture((g, s) => {
    g.fillStyle = '#efeae0'; g.fillRect(0, 0, s, s);
    for (let n = 0; n < 160; n++) { g.fillStyle = ['#f4f1ea', '#3a7bbf', '#e6c34a', '#5aa36b', '#d9583f', '#ffffff'][n % 6]; g.beginPath(); const x = Math.random() * s, y = Math.random() * s; g.moveTo(x, y); for (let k = 0; k < 4; k++) g.lineTo(x + Math.random() * 26 - 13, y + Math.random() * 26 - 13); g.fill() }
  });
  let TEX = null, trencadisMat, waterMat, jetMat, glowMat2;
  const boxGeo = new THREE.BoxGeometry(1, 1, 1), glowGeo = new THREE.SphereGeometry(2.6, 10, 8), jetGeo = new THREE.CylinderGeometry(1.2, 3, 22, 8, 1, true);
  const jets = [], pigeons = [];

  function build({T, solid, S, stores, B, E, shape, floor, road, W, H}) {
    const rnd = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x) };
    TEX = {hex: hexTex(), granit: granitTex(), rambla: ramblaTex(), rosa: rosaTex(), miro: miroTex(), mar: marTex(), fusta: fustaTex()};
    TEX.rosa.wrapS = TEX.rosa.wrapT = TEX.miro.wrapS = TEX.miro.wrapT = T.ClampToEdgeWrapping; TEX.mar.repeat.set(8, 3);
    trencadisMat = new T.MeshLambertMaterial({map: trencadisTex()}); waterMat = new T.MeshLambertMaterial({color: '#5aa3b8', emissive: '#16323a'});
    jetMat = new T.MeshLambertMaterial({color: '#dff3f7', transparent: true, opacity: .55}); glowMat2 = new T.MeshBasicMaterial({color: '#ff9f7a'});
    const live = solid.parent;  // fonts i coloms es mouen: van fora del grup que s'agrupa en InstancedMesh
    const jetsGroup = new T.Group(); live.add(jetsGroup);
    // Pavimentos
    const pt = panot(); pt.repeat.set((W + 600) / 26, (H + 600) / 26);
    floor.material = new T.MeshLambertMaterial({map: pt});
    const at = asphalt(); at.repeat.set(W / 60, 1); road.map = at; road.color.set('#ffffff'); road.needsUpdate = true;

    function windowBay(wx, y0, zf, dir, seed, sh) {
      const closed = rnd(seed, 1) < .25, plant = rnd(seed, 2) < .3, open = rnd(seed, 3);
      B(solid, GLASS, wx, y0 + 18, zf + dir * 1, 24, 30, 2);
      B(solid, STONE, wx, y0 + 34.5, zf + dir * 1.6, 31, 3, 3);                 // dintel
      if (closed) B(solid, sh, wx, y0 + 18, zf + dir * 2.2, 24, 30, 1.2);         // persiana cerrada
      else for (const s of [-1, 1]) B(solid, sh, wx + s * (16 + open * 2), y0 + 18, zf + dir * 2.2, 9, 30, 1.2);
      if (closed) for (let k = 0; k < 6; k++) B(solid, '#2f4a38', wx, y0 + 6 + k * 4.8, zf + dir * 3, 24, .6, .4); // lamas del librillo
      B(solid, STONE, wx, y0 + 2, zf + dir * 7, 38, 3, 14);                       // losa del balcón
      B(solid, IRON, wx, y0 + 13, zf + dir * 13.6, 38, 1.2, 1.2);               // pasamanos
      for (const s of [-1, 1]) B(solid, IRON, wx + s * 18.6, y0 + 8.5, zf + dir * 7.6, 1, 10, 12);
      for (let k = -4; k <= 4; k++) B(solid, IRON, wx + k * 4.2, y0 + 8.5, zf + dir * 13.6, .7, 10, .7);
      if (plant) { B(solid, '#a8603f', wx + 12, y0 + 6, zf + dir * 9, 5, 5, 5); shape(solid, 'rock', LEAVES[seed % 4], wx + 12, y0 + 11, zf + dir * 9, 8, 7, 8) }
    }

    for (const s of S) {
      const i = s.i, x = s.x + 122, zc = s.y + 114, zf = s.y + 169, zb = s.y + 59;
      const h = 124 + (i * 13) % 39, floors = 3 + (i * 7) % 3, fh = 40, top = h + floors * fh;
      const st = stucco[i % stucco.length], sh = shutters[(i * 3) % shutters.length];
      B(solid, st, x, h + floors * fh / 2, zc, 236, floors * fh, 110);           // plantas superiores
      for (let f = 0; f <= floors; f++) B(solid, STONE, x, h + f * fh, zc, 239, 2.5, 113); // impostas
      B(solid, STONE, x, top + 4, zc, 246, 7, 120);                               // cornisa
      B(solid, st, x, top + 12, zc, 236, 9, 4); B(solid, st, x, top + 12, zc - 108, 236, 9, 4); // barandilla de la azotea
      for (const k of [-1, 1]) B(solid, '#a77a62', x + k * 78, top + 18, zc + rnd(i, 9) * 40 - 20, 9, 22, 9); // chimeneas
      for (let f = 0; f < floors; f++) for (const j of [-1, 0, 1]) {
        windowBay(x + j * 65, h + f * fh + 3, zf, 1, i * 97 + f * 7 + j, sh);
        windowBay(x + j * 65, h + f * fh + 3, zb, -1, i * 53 + f * 11 + j, sh);
      }
      if (ZONES[Math.floor(SLOT[i] / 6)].k === 'pg') {   // tribuna modernista i coronament ondulat
        B(solid, STONE, x, h + 22, zf + 9, 120, 40, 18); B(solid, GLASS, x, h + 22, zf + 18.5, 108, 30, 1); for (let k = -2; k <= 2; k++) B(solid, STONE, x + k * 27, h + 22, zf + 19, 3, 34, 2);
        for (let k = -3; k <= 3; k++) E(solid, STONE, x + k * 33, top + 14, zc + 55, 30, 16, 6);
      }
      // Fachada trasera de las plantas bajas: portal de finca y ventanas con reja.
      const back = zb - .5;
      B(solid, st, x, h / 2, zb - 1, 236, h, 2);
      B(solid, STONE, x - 70, 26, back - 1, 38, 52, 2); B(solid, '#5a3b2a', x - 70, 24, back - 2, 30, 46, 2);
      for (const j of [0, 1]) { const wx = x + 10 + j * 70; B(solid, GLASS, wx, 34, back - 1.5, 26, 24, 1); for (let k = -3; k <= 3; k++) B(solid, IRON, wx + k * 4, 34, back - 3, .8, 26, .8) }
      if (h > 90) for (const j of [-1, 0, 1]) windowBay(x + j * 65, h - 42, zb, -1, i * 31 + j, sh);
    }

    // Zones reals de nord a sud: Passeig de Gràcia, Plaça de Catalunya, Portal de l'Àngel, la Rambla i el Port Vell.
    const zoneGround = (row, tex, z0, z1, rep, y = .25) => {
      const s = ROWY[row], tt = tex.clone(); tt.needsUpdate = true; tt.repeat.set(W / rep, (z1 - z0) / rep);
      const m = new T.Mesh(new T.PlaneGeometry(W, z1 - z0), new T.MeshLambertMaterial({map: tt})); m.rotation.x = -Math.PI / 2; m.position.set(W / 2, y, s + (z0 + z1) / 2); solid.add(m);
    };
    const roadMat = new T.MeshLambertMaterial({map: at});
    for (let row = 0; row < 6; row++) {
      const Z = ZONES[row], s0 = ROWY[row], rz = roadZ(row), zN = rz - 31, zS = rz + 31;
      if (Z.k === 'pg') {                                   // Passeig de Gràcia: panot hexagonal de Gaudí i fanals-banc
        zoneGround(row, TEX.hex, 196, 236, 30); zoneGround(row, TEX.hex, 288, 392, 30);
        B(solid, '#a8a49b', W / 2, 1.6, rz - 25.5, W, 3.2, 3); B(solid, '#a8a49b', W / 2, 1.6, rz + 25.5, W, 3.2, 3);
        for (let c = 0; c < 6; c++) { const bx = 36 + c * 360;
          for (const [tx, tz] of [[bx + 14, zN], [bx + 230, zN], [bx + 40, zS], [bx + 204, zS]]) plane(tx, tz, row * 31 + c * 7 + tx);
          fanalBanc(bx + 122, zS + 14); lamp(bx + 81, zN + 1); }
      } else if (Z.k === 'placa') {                         // Plaça de Catalunya: rosa dels vents, fonts, gespa i coloms
        zoneGround(row, TEX.granit, 196, 692, 40);
        rosa(W / 2, rz + 10);
        for (const fx of [W * .27, W * .73]) font(fx, rz + 10);
        for (const gx of [W * .1, W * .42, W * .58, W * .9]) for (const gz of [-120, 150]) { gespa(gx, rz + gz, 170, 90); for (const d of [-60, 60]) plane(gx + d, rz + gz, gx + d + gz | 0) }
        for (let k = 0; k < 6; k++) { bench(220 + k * 350, rz - 50); bench(220 + k * 350 + 60, rz + 70) }
        estatua(W * .42 - 140, rz + 20); estatua(W * .58 + 140, rz + 20);
        coloms(W * .35, rz - 10); coloms(W * .66, rz + 40); coloms(W * .15, rz - 30);
      } else if (Z.k === 'portal') {                        // Portal de l'Àngel: carrer de vianants de granit amb garlandes
        zoneGround(row, TEX.granit, 196, 392, 34);
        for (let c = 0; c < 6; c++) { const bx = 36 + c * 360; lampParet(bx + 30, s0 + 196); lampParet(bx + 214, s0 + 196); fanalBanc(bx + 300, rz + 40) }
        for (let x = 80; x < W; x += 150) garlanda(x, s0 + 196, s0 + 393);
      } else if (Z.k === 'rambla') {                        // La Rambla: passeig central amb onades, plàtans, quioscos i el Miró
        zoneGround(row, TEX.rambla, 222, 302, 26, .3);
        for (const zz of [210, 314]) { const m = new T.Mesh(new T.PlaneGeometry(W, 16), roadMat); m.rotation.x = -Math.PI / 2; m.position.set(W / 2, .2, s0 + zz); solid.add(m) }
        for (const zz of [201, 222, 302, 323]) B(solid, '#a8a49b', W / 2, 1.6, s0 + zz, W, 3.2, 3);
        for (let x = 40; x < W; x += 95) { plane(x, s0 + 228, x * 3 + row); plane(x + 40, s0 + 296, x * 5 + row) }
        for (let c = 0; c < 6; c++) { const bx = 36 + c * 360; quiosc(bx + 100, s0 + 262, c % 2 ? 'flors' : 'premsa'); bench(bx + 190, s0 + 278) }
        miro(W / 2 + 180, s0 + 262);
      } else {                                              // Port Vell: palmeres, el mar i el monument a Colom
        zoneGround(row, TEX.hex, 196, 236, 30); zoneGround(row, TEX.fusta, 288, 392, 40);
        B(solid, '#a8a49b', W / 2, 1.6, rz - 25.5, W, 3.2, 3); B(solid, '#a8a49b', W / 2, 1.6, rz + 25.5, W, 3.2, 3);
        for (let x = 60; x < W; x += 140) palmera(x, zS + 40, x);
        for (let c = 0; c < 6; c++) bench(36 + c * 360 + 150, zS + 70);
        mar(); colom(W / 2, H + 170);
      }
    }
    makePigeons(live);
    function fanalBanc(x, z) {   // banc de trencadís amb fanal de ferro (inspirat en el Passeig de Gràcia)
      for (let k = -3; k <= 3; k++) { const a = k * .32, m = new T.Mesh(boxGeo, trencadisMat); m.scale.set(13, 9, 9); m.position.set(x + Math.sin(a) * 26, 5, z + Math.cos(a) * 26 - 26); m.rotation.y = a; solid.add(m) }
      shape(solid, 'round', IRON, x, 45, z - 4, 2.6, 90, 2.6);
      for (const a of [0, 2.1, 4.2]) { B(solid, IRON, x + Math.cos(a) * 6, 84, z - 4 + Math.sin(a) * 6, 2, 1.5, 2); shape(solid, 'taper', IRON, x + Math.cos(a) * 10, 82, z - 4 + Math.sin(a) * 10, 5, 6, 5);
        const g = new T.Mesh(glowGeo, glowMat); g.position.set(x + Math.cos(a) * 10, 78, z - 4 + Math.sin(a) * 10); solid.add(g) }
    }
    function rosa(x, z) { const m = new T.Mesh(new T.CircleGeometry(70, 48), new T.MeshLambertMaterial({map: TEX.rosa})); m.rotation.x = -Math.PI / 2; m.position.set(x, .45, z); solid.add(m) }
    function font(x, z) {
      shape(solid, 'round', '#d9d0bf', x, 3, z, 110, 6, 110); const w = new T.Mesh(new T.CircleGeometry(50, 40), waterMat); w.rotation.x = -Math.PI / 2; w.position.set(x, 6.2, z); solid.add(w);
      for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, j = new T.Mesh(jetGeo, jetMat); j.position.set(x + Math.cos(a) * 32, 16, z + Math.sin(a) * 32); jetsGroup.add(j); jets.push(j) }
      const c = new T.Mesh(jetGeo, jetMat); c.scale.set(1.6, 2.4, 1.6); c.position.set(x, 30, z); jetsGroup.add(c); jets.push(c);
    }
    function gespa(x, z, w, d) { B(solid, '#6f9b47', x, .8, z, w, 1.4, d); B(solid, '#d9d0bf', x, 1.2, z - d / 2, w + 6, 2.4, 3); B(solid, '#d9d0bf', x, 1.2, z + d / 2, w + 6, 2.4, 3) }
    function estatua(x, z) { B(solid, '#cfc6b4', x, 15, z, 22, 30, 22); shape(solid, 'taper', '#8d8a80', x, 42, z, 9, 24, 7); E(solid, '#8d8a80', x, 58, z, 8, 9, 8); B(solid, '#8d8a80', x + 6, 48, z, 10, 3, 3, 0, 0, -.6) }
    function coloms(x, z) { for (let k = 0; k < 7; k++) pigeons.push({x: x + Math.cos(k * 2.3) * 22, z: z + Math.sin(k * 1.7) * 14, k}) }
    function lampParet(x, z) { B(solid, IRON, x, 70, z + 4, 2, 2, 9); shape(solid, 'taper', IRON, x, 66, z + 9, 6, 8, 6); const g = new T.Mesh(glowGeo, glowMat); g.position.set(x, 62, z + 9); solid.add(g) }
    function garlanda(x, z0, z1) {
      const n = 14; for (let k = 0; k <= n; k++) { const f = k / n, z = z0 + (z1 - z0) * f, y = 108 - Math.sin(f * Math.PI) * 18;
        B(solid, IRON, x, y, z, .5, .5, (z1 - z0) / n + .5); if (k % 2 === 0) { const g = new T.Mesh(glowGeo, k % 4 ? glowMat : glowMat2); g.scale.setScalar(.55); g.position.set(x, y - 2, z); solid.add(g) } }
    }
    function quiosc(x, z, kind) {
      B(solid, '#2f5b45', x, 18, z, 34, 36, 22); B(solid, '#2f5b45', x, 39, z, 42, 3, 30); shape(solid, 'cone', '#2f5b45', x, 46, z, 30, 12, 24);
      if (kind === 'flors') for (let k = 0; k < 12; k++) { const px = x - 22 + (k % 6) * 9, pz = z + 14 + (k / 6 | 0) * 6; B(solid, '#7a5236', px, 4 + (k / 6 | 0) * 6, pz, 7, 6, 5); E(solid, ['#e04a5c', '#f3c63f', '#f6f0e2', '#c45ab3', '#ef7f3a'][k % 5], px, 9 + (k / 6 | 0) * 6, pz, 8, 6, 7) }
      else { B(solid, '#e8e2d3', x, 24, z + 11.5, 30, 14, 1); for (let k = 0; k < 6; k++) B(solid, ['#c43c3c', '#2e5e9e', '#f0c43c', '#3e8a5a'][k % 4], x - 12 + k * 5, 24, z + 12.2, 4, 11, .5) }
    }
    function miro(x, z) { const m = new T.Mesh(new T.CircleGeometry(26, 40), new T.MeshLambertMaterial({map: TEX.miro})); m.rotation.x = -Math.PI / 2; m.position.set(x, .5, z); solid.add(m) }
    function palmera(x, z, seed) {
      for (let k = 0; k < 7; k++) shape(solid, 'taper', '#8d7458', x + Math.sin(k * .3) * k * .8, 6 + k * 13, z, 6 - k * .25, 14, 6 - k * .25);
      for (let k = 0; k < 9; k++) { const a = k * .7 + seed; B(solid, LEAVES[(k + seed) % 4], x + Math.cos(a) * 16, 92 - (k % 3) * 3, z + Math.sin(a) * 16, 36, 1.4, 7, 0, -a, -.35) }
    }
    function mar() {
      const m = new T.Mesh(new T.PlaneGeometry(W + 1600, 700), new T.MeshLambertMaterial({map: TEX.mar})); m.rotation.x = -Math.PI / 2; m.position.set(W / 2, -1.5, H + 300); solid.add(m);
      B(solid, '#bfb39c', W / 2, -1, H - 55, W + 600, 6, 10);   // moll
      for (const [bx, bz] of [[W * .2, H + 140], [W * .62, H + 230], [W * .85, H + 120]]) { B(solid, '#f4f1ea', bx, 3, bz, 60, 8, 18); B(solid, '#2e5e9e', bx, 8, bz, 61, 2, 19); shape(solid, 'round', '#d8d2c4', bx, 30, bz, 1.5, 46, 1.5); B(solid, '#f4f1ea', bx + 10, 30, bz, 18, 36, .5) }
    }
    function colom(x, z) {   // columna monumental al final de la Rambla
      shape(solid, 'round', '#cfc6b4', x, 10, z, 90, 20, 90); shape(solid, 'round', '#bfb39c', x, 34, z, 46, 28, 46);
      shape(solid, 'round', '#8a7a5c', x, 150, z, 14, 210, 14); shape(solid, 'round', '#cbb37a', x, 258, z, 22, 10, 22);
      E(solid, '#5b5040', x, 270, z, 9, 12, 9); shape(solid, 'taper', '#5b5040', x, 286, z, 7, 22, 7); B(solid, '#5b5040', x + 9, 296, z - 4, 14, 2.5, 2.5, 0, .6, .4);
    }
    function plane(x, z, seed) {
      B(solid, '#3d3f41', x, .7, z, 15, 1.2, 15);                                  // alcorque
      // Plàtan alt, com els de l'Eixample: la copa queda per sobre de la línia de visió de la càmera.
      shape(solid, 'taper', BARK, x, 50, z, 5.5, 100, 5.5);
      shape(solid, 'taper', '#c9c2a8', x + 1.2, 22, z + 1.6, 3, 18, 3);             // escorça clapejada
      for (const s of [-1, 1]) shape(solid, 'taper', BARK, x + s * 7, 96, z, 2.5, 26, 2.5, 0, 0, s * .5); // branques
      for (let k = 0; k < 6; k++) {
        const a = k * 1.05 + seed, r = 15 + rnd(seed, k) * 7;
        shape(solid, 'ball', LEAVES[(seed + k) % 4], x + Math.cos(a) * r, 108 + rnd(seed, k + 9) * 14, z + Math.sin(a) * r * .8, 32, 22, 30);
      }
      shape(solid, 'ball', LEAVES[seed % 4], x, 124, z, 36, 24, 34);
    }
    function lamp(x, z) {
      shape(solid, 'round', IRON, x, 2, z, 6, 4, 6);
      shape(solid, 'round', IRON, x, 38, z, 2.4, 72, 2.4);
      B(solid, IRON, x, 73, z - 7, 2, 2, 14);
      shape(solid, 'taper', IRON, x, 70, z - 13, 7, 7, 7);
      const glow = new T.Mesh(new T.SphereGeometry(2.6, 10, 8), glowMat); glow.position.set(x, 66, z - 13); solid.add(glow);
    }
    function bench(x, z) {
      B(solid, '#8b5a3c', x, 10, z, 28, 1.8, 7); B(solid, '#8b5a3c', x, 16, z + 3.6, 28, 7, 1.4);
      for (const s of [-1, 1]) { B(solid, IRON, x + s * 12, 5, z, 1.5, 10, 7); B(solid, IRON, x + s * 12, 14, z + 3.6, 1.5, 10, 1.5) }
    }
  }
  const glowMat = new THREE.MeshBasicMaterial({color: '#ffd78a'});
  let pigeonMeshes = [];
  function makePigeons(live) {
    const body = new THREE.SphereGeometry(1, 8, 6), mat = new THREE.MeshLambertMaterial({color: '#8a8d93'}), head = new THREE.MeshLambertMaterial({color: '#5d6a78'});
    pigeonMeshes = pigeons.map(p => { const g = new THREE.Group(); const b = new THREE.Mesh(body, mat); b.scale.set(2.2, 1.8, 3.2); b.position.y = 2.2; const h = new THREE.Mesh(body, head); h.scale.setScalar(1.3); h.position.set(0, 4.2, 2.4); g.add(b, h); g.position.set(p.x, 0, p.z); p.hx = p.x; p.hz = p.z; p.fly = 0; live.add(g); return g });
  }
  // Animacions: brolladors i coloms que volen quan la Lia s'hi acosta i tornen a terra.
  function update(t, player) {
    jets.forEach((j, k) => { j.scale.y = 1 + Math.sin(t * .006 + k) * .15 });
    pigeons.forEach((p, k) => { const m = pigeonMeshes[k]; if (!m) return; const d = Math.hypot(player.x - p.x, player.y - p.z);
      if (d < 45 && p.fly <= 0) p.fly = 1;
      if (p.fly > 0) { p.fly += .016; const a = k * 1.3; m.position.set(p.hx + Math.cos(a) * p.fly * 120, Math.sin(Math.min(p.fly, 3) / 3 * Math.PI) * 90, p.hz + Math.sin(a) * p.fly * 120); m.rotation.y = -a + Math.PI / 2; if (p.fly > 3) { p.fly = -4 } }
      else { if (p.fly < 0) p.fly = Math.min(0, p.fly + .016); m.position.set(p.hx, 0, p.hz); m.rotation.y = Math.sin(t * .001 + k) * 2; m.children[1].position.y = 4.2 - (Math.sin(t * .01 + k * 3) > .7 ? 1.6 : 0); m.visible = p.fly === 0 || d > 60 } });
  }
  return {build, glowMat, ZONES, ROWY, H, roadZ, AT, SLOT, update, hasRoad: r => ZONES[r].road};
})();
