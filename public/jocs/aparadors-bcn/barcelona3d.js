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

  function build({T, solid, S, stores, B, E, shape, floor, road, W, H}) {
    const rnd = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x) };
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
      // Fachada trasera de las plantas bajas: portal de finca y ventanas con reja.
      const back = zb - .5;
      B(solid, st, x, h / 2, zb - 1, 236, h, 2);
      B(solid, STONE, x - 70, 26, back - 1, 38, 52, 2); B(solid, '#5a3b2a', x - 70, 24, back - 2, 30, 46, 2);
      for (const j of [0, 1]) { const wx = x + 10 + j * 70; B(solid, GLASS, wx, 34, back - 1.5, 26, 24, 1); for (let k = -3; k <= 3; k++) B(solid, IRON, wx + k * 4, 34, back - 3, .8, 26, .8) }
      if (h > 90) for (const j of [-1, 0, 1]) windowBay(x + j * 65, h - 42, zb, -1, i * 31 + j, sh);
    }

    // Calles: bordillos, plátanos de sombra, farolas y bancos.
    for (let row = 0; row < 6; row++) {
      const rz = 26 + row * 335 + 262, zN = rz - 31, zS = rz + 31;
      B(solid, '#a8a49b', W / 2, 1.6, rz - 25.5, W, 3.2, 3); B(solid, '#a8a49b', W / 2, 1.6, rz + 25.5, W, 3.2, 3);
      for (let c = 0; c < 6; c++) {
        const bx = 36 + c * 360;
        for (const [tx, tz] of [[bx + 14, zN], [bx + 230, zN], [bx + 40, zS], [bx + 122, zS], [bx + 204, zS]]) plane(tx, tz, row * 31 + c * 7 + tx);
        for (const fx of [bx + 81, bx + 163]) lamp(fx, zS + 4);
        bench(bx + 150, zS + 10);
      }
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
  return {build, glowMat};
})();
