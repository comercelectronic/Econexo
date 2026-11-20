/* Palet · capa d'habilitat (2/2): conducció del transpalet i del toro (vista des de dalt + vista lateral de les forquilles),
   introducció de forquilles, elevació, inclinació del pal, estabilitat de la càrrega, cops i col·locació a la prestatgeria.
   Unitats: 1 px = 2 cm al pla; alçades en cm; velocitats internes en px/s. */
(function () {
  const D = window.PD, PH = window.PH, esc = PH.esc;
  const G = 9.81, CM = 2;                     // cm per px
  const ms = (pxs) => pxs * CM / 100;         // px/s → m/s
  const NIVELLS_CM = [0, 130, 260, 390];      // alçada de la biga (part de dalt) de cada nivell
  const BIGA = 12, PAL_H = 15, OBERT = 10, FORQ = 4;   // gruix de biga, alçada del palet, obertura, gruix de forquilla
  const PL = 60, PW = 40;                     // palet 120 × 80 cm
  const BAY_W = 52, BAY_D = 56, MARC = 5;

  /* ---------- Geometria: rectangles orientats ---------- */
  function obb(x, y, w, h, a) { const c = Math.cos(a || 0), s = Math.sin(a || 0); return { x, y, w, h, a: a || 0, c, s }; }
  function cantons(o) { const r = []; [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([i, j]) => r.push([o.x + o.c * i * o.w / 2 - o.s * j * o.h / 2, o.y + o.s * i * o.w / 2 + o.c * j * o.h / 2])); return r; }
  function xoca(A, B) {
    const pa = cantons(A), pb = cantons(B); let min = 1e9, eix = null;
    for (const [ax, ay] of [[A.c, A.s], [-A.s, A.c], [B.c, B.s], [-B.s, B.c]]) {
      let a0 = 1e9, a1 = -1e9, b0 = 1e9, b1 = -1e9;
      pa.forEach(([x, y]) => { const p = x * ax + y * ay; a0 = Math.min(a0, p); a1 = Math.max(a1, p); });
      pb.forEach(([x, y]) => { const p = x * ax + y * ay; b0 = Math.min(b0, p); b1 = Math.max(b1, p); });
      const o = Math.min(a1, b1) - Math.max(a0, b0); if (o <= 0) return null;
      if (o < min) { min = o; eix = [ax, ay]; }
    }
    const d = [(B.x - A.x), (B.y - A.y)]; if (d[0] * eix[0] + d[1] * eix[1] < 0) eix = [-eix[0], -eix[1]];
    return { pen: min, n: eix };
  }
  const local = (px, py, x, y, a) => { const c = Math.cos(-a), s = Math.sin(-a), dx = px - x, dy = py - y; return [dx * c - dy * s, dx * s + dy * c]; };
  const mon = (lx, ly, x, y, a) => { const c = Math.cos(a), s = Math.sin(a); return [x + lx * c - ly * s, y + lx * s + ly * c]; };
  const angDif = (a, b) => { let d = a - b; d = Math.atan2(Math.sin(d), Math.cos(d)); return d; };
  const modPi = (d) => { d = angDif(d, 0); if (d > Math.PI / 2) d -= Math.PI; if (d < -Math.PI / 2) d += Math.PI; return d; };

  /* ---------- Vehicles ---------- */
  const V = {
    transpalet: {
      nom: 'Transpalet manual', L: 56, dMax: 1.35, dVel: 3, acc: 50, m0: 500, vMax: 65, vRev: 45, fre: 80, freEm: 110, frec: 30,
      fMin: 8, fMax: 20, massa: 80,
      // forquilles cap enrere (−x); referència = rodets de càrrega
      forq: { arrel: 50, dir: -1, llarg: 58 },
      parts: [{ x: 58, y: 0, w: 16, h: 30, tipus: 'xassis' }, { x: 102, y: 0, w: 16, h: 16, tipus: 'operari' }],
      puntes: [-11, 11]
    },
    toro: {
      nom: 'Carretó elevador (toro)', L: 64, dMax: 1.2, dVel: 2.4, acc: 75, m0: 3000, vMax: 125, vRev: 90, fre: 150, freEm: 225, frec: 50,
      fMin: 4, fMax: 450, massa: 3200,
      forq: { arrel: 14, dir: 1, llarg: 58 },
      parts: [{ x: -39, y: 0, w: 90, h: 56, tipus: 'xassis' }, { x: 10, y: 0, w: 8, h: 44, tipus: 'pal' }],
      puntes: [-10.5, 10.5]
    }
  };

  /* ---------- Càrrega del palet ---------- */
  // Blocs en capes de 2 × 2 (cada bloc: 60 × 40 cm de planta, una columna de caixes del mateix producte)
  function muntaCarrega(prods, n) {
    const blocs = [];
    prods.forEach((id, i) => {
      const pr = PH.prop(id), capa = Math.floor(i / 4), k = i % 4;
      const zBase = blocs.filter(b => b.capa < capa && b.k === k).reduce((a, b) => a + b.h, 0);
      blocs.push({ pr, capa, k, lx: (k % 2 ? 15 : -15), ly: (k < 2 ? -10 : 10), h: Math.max(18, Math.min(30, pr.mida[1])), m: pr.pes * (n || 6), z: zBase, sx: 0, sy: 0, estat: 'be', caigut: false, n: n || 6 });
    });
    return blocs;
  }
  const massaCarrega = (p) => p.carrega.filter(b => !b.caigut).reduce((a, b) => a + b.m, 0);
  const alcadaCarrega = (p) => p.carrega.filter(b => !b.caigut).reduce((a, b) => Math.max(a, b.z + b.h), 0);

  PH.vehicle = function (cfg, onFi) {
    const TV = V[cfg.vehicle];
    let ve, palets, deixalles, estatics, bays, incid, cops, t0, acabat, recorregut, recCorrecte, estabMax, tEstab, bolcat, fiAuto, darrerAv;
    const toro = cfg.vehicle === 'toro';
    const s = PH.obre({
      titol: cfg.titol, consigna: cfg.consigna, W: 1000, H: 560, rellotge: cfg.rellotge,
      controls: toro
        ? '<b>W/S</b> o <b>↑/↓</b>: endavant / enrere (frenen si vas en sentit contrari) · <b>A/D</b> o <b>←/→</b>: direcció (roda del darrere: la cua gira) · <b>Espai</b>: fre · <b>R/F</b>: puja / baixa les forquilles · <b>T/G</b>: inclina el pal endavant / enrere.'
        : '<b>W/S</b> o <b>↑/↓</b>: estira (endavant) / empeny (enrere) · <b>A/D</b> o <b>←/→</b>: gira la llança · <b>Espai</b>: frena · <b>E</b>: bomba (cada cop puja les forquilles) · <b>Q</b>: palanca per baixar.',
      tactil: `<div class="pad"><button class="btn small" data-k="a">◀</button><div class="pad-v"><button class="btn small" data-k="w">▲</button><button class="btn small" data-k="s">▼</button></div><button class="btn small" data-k="d">▶</button></div><button class="btn small" data-k=" ">Fre</button>`
        + (toro ? `<button class="btn small" data-k="r">Forquilles ⬆</button><button class="btn small" data-k="f">Forquilles ⬇</button><button class="btn small" data-k="t">Pal ⤼</button><button class="btn small" data-k="g">Pal ⤽</button>` : `<button class="btn small" data-k="e">Bomba ⬆</button><button class="btn small" data-k="q">Baixa ⬇</button>`),
      onReinicia: () => munta(), onFet: () => avalua('manual'), onSurt: () => onFi && onFi(null, s.temps), pas, dibuixa
    });
    s.onTecla = (t) => { if (!toro && t === 'e' && !acabat) bomba(); };

    function munta() {
      acabat = false; bolcat = false; fiAuto = 0; incid = []; cops = []; t0 = s.temps; recorregut = 0; recCorrecte = 0; estabMax = 0; tEstab = 0; darrerAv = {};
      const m = cfg.mapa;
      ve = { x: m.inici.x, y: m.inici.y, a: m.inici.a, v: 0, d: 0, f: TV.fMin, tilt: 0, carrega: null, om: 0, aLong: 0 };
      estatics = []; bays = [];
      const est = (x, y, w, h, tipus, nom) => estatics.push(Object.assign(obb(x + w / 2, y + h / 2, w, h, 0), { tipus, nom }));
      est(0, -20, 1000, 20, 'paret'); est(0, 560, 1000, 20, 'paret'); est(-20, 0, 20, 560, 'paret'); est(1000, 0, 20, 560, 'paret');
      (m.parets || []).forEach(r => est(r.x, r.y, r.w, r.h, r.tipus || 'paret', r.nom));
      // Files de prestatgeries: cara = +1 si la part de davant mira cap avall (y creixent)
      (m.files || []).forEach(F => {
        const yBack = F.cara > 0 ? F.y : F.y + BAY_D, yFront = F.cara > 0 ? F.y + BAY_D : F.y;
        est(F.x0, F.cara > 0 ? F.y - 6 : F.y + BAY_D, F.n * (BAY_W + MARC) + MARC, 6, 'prestatgeria', 'fons de la prestatgeria');
        for (let i = 0; i <= F.n; i++) est(F.x0 + i * (BAY_W + MARC), F.y, MARC, BAY_D, 'prestatgeria', 'muntant de la prestatgeria');
        for (let i = 0; i < F.n; i++) bays.push({ id: F.ids ? F.ids[i] : F.pas + '-' + String(i + 1).padStart(2, '0'), x: F.x0 + MARC + i * (BAY_W + MARC), y: F.y, w: BAY_W, d: BAY_D, cara: F.cara, yFront, yBack, nivells: F.nivells || NIVELLS_CM, pas: F.pas });
      });
      palets = (m.palets || []).map((p, i) => {
        const bay = p.bay ? bays.find(b => b.id === p.bay) : null;
        const x = bay ? bay.x + bay.w / 2 : p.x, y = bay ? bay.y + bay.d / 2 : p.y, a = bay ? Math.PI / 2 : (p.a || 0);
        return { id: 'p' + i, forq0: !!p.forq, filmat: !!p.filmat, x, y, a, z: bay ? (bay.nivells[(p.nivell || 1) - 1]) : 0, carrega: muntaCarrega(p.prods, p.n), objectiu: !!p.objectiu, bay: bay ? bay.id : null, nivell: p.nivell || 1, carregat: false, dx: 0, dy: 0, da: 0, malPosat: false, mogut: false };
      });
      deixalles = [];
      // Palet que ja es porta a les forquilles
      const pf = palets.find(p => p.forq0);
      if (pf) { ve.f = toro ? 22 : 14; pf.carregat = true; pf.dx = 29; pf.dy = 0; pf.da = 0; pf.z = ve.f - OBERT; pf.mogut = true; ve.carrega = pf; ve.fAnt = ve.f; seguir(pf); }
    }

    /* ----- Forquilles i palets ----- */
    function forqFrame(x, y, a) { // origen a l'arrel de les forquilles, eix x cap a les puntes
      const dir = TV.forq.dir, ang = dir > 0 ? a : a + Math.PI;
      const [ox, oy] = mon(TV.forq.arrel, 0, x, y, a);
      return { x: ox, y: oy, a: ang };
    }
    function pues(x, y, a) {
      const F = forqFrame(x, y, a);
      return TV.puntes.map(py => { const [cx, cy] = mon(TV.forq.llarg / 2, py, F.x, F.y, F.a); return obb(cx, cy, TV.forq.llarg, 7, F.a); });
    }
    function partsVe(x, y, a) {
      return TV.parts.map(p => { const [cx, cy] = mon(p.x, p.y, x, y, a); return Object.assign(obb(cx, cy, p.w, p.h, a), { tipus: p.tipus }); });
    }
    const obbPalet = (p) => obb(p.x, p.y, PL, PW, p.a);
    // Relació forquilles-palet: alineació, profunditat i alçada
    function relacio(p, x, y, a, f) {
      const F = forqFrame(x, y, a), [px, py] = local(p.x, p.y, F.x, F.y, F.a), da = modPi(p.a - F.a);
      const prof = Math.max(0, Math.min(TV.forq.llarg, px + PL / 2) - Math.max(0, px - PL / 2));
      const alcadaOk = f - FORQ >= p.z - 1 && f <= p.z + OBERT + 1;
      const alineat = Math.abs(da) < 0.17 && Math.abs(py) < 7.5;
      return { px, py, da, prof, alcadaOk, alineat, ok: alineat && alcadaOk };
    }
    function bomba() {
      if (ve.f >= TV.fMax) return;
      ve.f = Math.min(TV.fMax, ve.f + 3);
    }
    // Suport sota el palet en baixar: terra o bigues d'una ubicació
    function suport(p) {
      const O = obbPalet(p);
      for (const b of bays) {
        const bo = obb(b.x + b.w / 2, b.y + b.d / 2, b.w, b.d, 0), x = xoca(O, bo);
        if (!x || x.pen < 6) continue;
        const niv = b.nivells.filter(h => h <= p.z + 0.5 && h > 0);
        if (!niv.length) continue;
        const h = Math.max(...niv), [lx, ly] = local(p.x, p.y, b.x + b.w / 2, b.y + b.d / 2, 0);
        const bo2 = Math.abs(ly) <= 6 && Math.abs(lx) <= 5 && Math.abs(modPi(p.a - Math.PI / 2)) < 0.15;
        return { h, bay: b, nivell: b.nivells.indexOf(h) + 1, be: bo2, lx, ly };
      }
      // A terra (també dins d'una ubicació de nivell 1)
      const b = bays.find(b => p.x > b.x && p.x < b.x + b.w && p.y > b.y && p.y < b.y + b.d);
      return { h: 0, bay: b || null, nivell: 1, be: true };
    }

    /* ----- Bucle ----- */
    function pas(dt) {
      if (acabat) return;
      const T = s.tecles, up = T.has('w') || T.has('arrowup'), dn = T.has('s') || T.has('arrowdown'), lf = T.has('a') || T.has('arrowleft'), rt = T.has('d') || T.has('arrowright'), fre = T.has(' ');
      const mC = ve.carrega ? massaCarrega(ve.carrega) : 0;
      // Velocitat
      const v0 = ve.v, kM = 1 + mC / TV.m0;
      let vMax = (up ? TV.vMax : TV.vRev) / (toro ? 1 : 1 + mC / 1500);
      if (fre) ve.v = Math.sign(ve.v) * Math.max(0, Math.abs(ve.v) - TV.freEm / (toro ? 1 : kM) * dt);
      else if (up && ve.v < -1) ve.v = Math.min(0, ve.v + TV.fre / (toro ? 1 : kM) * dt);
      else if (dn && ve.v > 1) ve.v = Math.max(0, ve.v - TV.fre / (toro ? 1 : kM) * dt);
      else if (up) ve.v = Math.min(vMax, ve.v + TV.acc / kM * dt);
      else if (dn) ve.v = Math.max(-vMax, ve.v - TV.acc / kM * dt);
      else ve.v = Math.sign(ve.v) * Math.max(0, Math.abs(ve.v) - TV.frec / (toro ? 1 : kM) * dt);
      // Direcció
      const dObj = lf ? TV.dMax : rt ? -TV.dMax : 0;
      ve.d += Math.max(-TV.dVel * dt, Math.min(TV.dVel * dt, dObj - ve.d));
      // Forquilles i pal
      if (toro) {
        let fv = 0; if (T.has('r')) fv = 45; if (T.has('f')) fv = -55;
        if (fv > 0 && ve.carrega) { const cap = D.EQUIPS.toro.diagrama[ve.f < 120 ? 1 : ve.f < 250 ? 2 : ve.f < 380 ? 3 : 4]; if (mC > cap) { fv = 0; avis('sobre', `Sobrecàrrega: ${Math.round(mC)} kg i el diagrama de càrrega permet ${cap} kg a aquesta alçada.`, 'neg'); } }
        ve.f = Math.max(TV.fMin, Math.min(TV.fMax, ve.f + fv * dt));
        if (T.has('t')) ve.tilt = Math.max(-5, ve.tilt - 6 * dt); if (T.has('g')) ve.tilt = Math.min(8, ve.tilt + 6 * dt);
      } else if (T.has('q')) ve.f = Math.max(TV.fMin, ve.f - 20 * dt);
      // Cinemàtica (bicicleta)
      const om = -ve.v * Math.tan(ve.d) / TV.L;
      const nx = ve.x + Math.cos(ve.a) * ve.v * dt, ny = ve.y + Math.sin(ve.a) * ve.v * dt, na = ve.a + om * dt;
      // Palets: lligar el que es carrega, comprovar alineacions
      actualitzaPalets(dt);
      let xc = colisions(nx, ny, na);
      // Si ja estava encallat (tocant alguna cosa), deixa'l sortir si el moviment l'allunya
      if (xc) { const ara = colisions(ve.x, ve.y, ve.a); if (ara && xc.r && ara.r && xc.r.pen < ara.r.pen - 0.01) xc = null; }
      if (xc && xc.suau && Math.abs(ms(ve.v)) < 0.5) ve.v = 0;
      if (xc) {
        const vImp = Math.abs(ms(ve.v));
        if (vImp > 0.12) cop(xc, vImp);
        ve.v = -ve.v * 0.15;
      } else {
        recorregut += Math.abs(ve.v * dt);
        if (ve.carrega && usCorrecte()) recCorrecte += Math.abs(ve.v * dt);
        ve.x = nx; ve.y = ny; ve.a = na;
      }
      ve.om = xc ? 0 : om;
      // Acceleracions per a la càrrega (m/s²)
      ve.aLong = xc ? 0 : ms(ve.v - v0) / dt;   // el cop ja sacseja la càrrega pel seu compte
      if (ve.carrega) seguir(ve.carrega);
      estabilitat(dt);
      if (!toro && ve.carrega && ms(-ve.v) > 0.5) avis('empeny', 'Amb el transpalet carregat, millor estirar-lo (endavant) que empènyer-lo: veus el camí i no t\'atrapa els peus.', 'warn', 8000);
      if (toro && ve.carrega && ve.f > 60 && Math.abs(ms(ve.v)) > 0.7) avis('alt', 'No circulis amb la càrrega elevada: baixa les forquilles a 15-20 cm per desplaçar-te.', 'warn', 6000);
      if (toro && ve.carrega && ve.tilt < -0.5 && Math.abs(ve.v) > 10) avis('tilt', 'Per circular amb càrrega, inclina el pal enrere (G): la càrrega queda recolzada.', 'warn', 6000);
      ve.fAnt = ve.f;
      hud(mC);
      guia();
      comprovaFi(dt);
    }
    function avis(clau, txt, cls, cada) { const t = s.temps; if (darrerAv[clau] && t - darrerAv[clau] < (cada || 3000) / 1000) return; darrerAv[clau] = t; s.avis(txt, cls, 3200); }
    function usCorrecte() { return toro ? (ve.f <= 30 && ve.tilt >= 0) || Math.abs(ms(ve.v)) <= 0.5 : ve.v >= 0 || ms(-ve.v) <= 0.5; }
    function actualitzaPalets() {
      palets.forEach(p => {
        if (p.carregat) return;
        const r = relacio(p, ve.x, ve.y, ve.a, ve.f);
        p.rel = r;
        // Carregar: forquilles dins i pugen fins al tauler de dalt
        if (r.alineat && r.prof > 8 && ve.f >= p.z + OBERT && ve.f > (ve.fAnt || 0) + 1e-4 && (ve.fAnt || 0) <= p.z + OBERT + 1.01 && !ve.carrega) {   // les forquilles eren dins l'obertura i pugen
          p.carregat = true; p.dx = r.px; p.dy = r.py; p.da = r.da; p.malIntro = r.prof < 46; p.mogut = true; p.bay = null;
          ve.carrega = p; p.z = ve.f - OBERT;
          if (p.malIntro) s.avis('Les forquilles no estan introduïdes del tot: la càrrega va desequilibrada.', 'warn', 3000);
        }
      });
      ve.dinsDe = palets.find(p => !p.carregat && p.rel && p.rel.alineat && p.rel.prof > 8) || null;
      if (ve.carrega) {
        const p = ve.carrega;
        const zNova = ve.f - OBERT;
        if (zNova < p.z - 0.01) { // baixant: es recolza?
          const su = suport(Object.assign({}, p, { z: p.z }));
          if (zNova <= su.h) { deixaPalet(p, su); return; }
        }
        p.z = Math.max(0, zNova);
      }
    }
    function seguir(p) { const F = forqFrame(ve.x, ve.y, ve.a); const [x, y] = mon(p.dx, p.dy, F.x, F.y, F.a); p.x = x; p.y = y; p.a = F.a + p.da; }
    function deixaPalet(p, su) {
      p.carregat = false; ve.carrega = null; p.z = su.h; p.bay = su.bay ? su.bay.id : null; p.nivell = su.nivell;
      if (su.h > 0 && !su.be) { // mal recolzat a les bigues: cau
        incid.push({ greu: true, txt: `El palet ha quedat mal recolzat a les bigues de ${su.bay.id} (nivell ${su.nivell}) i ha caigut.` });
        s.avis('💥 El palet no estava ben centrat a les bigues i ha caigut!', 'neg', 4000);
        p.carrega.forEach(b => { if (!b.caigut) cau(p, b, su.h + b.z + PAL_H); });
        p.z = 0; p.bay = null; p.caigut = true; p.y += su.bay.cara > 0 ? 40 : -40;
      } else if (su.h > 0) s.avis(`Palet recolzat a ${su.bay.id}, nivell ${su.nivell}.`, 'pos', 1800);
    }
    // Cau un bloc de la càrrega: dany segons l'alçada de caiguda
    function cau(p, b, hCm) {
      b.caigut = true;
      const vFall = Math.sqrt(2 * G * hCm / 100);
      b.estat = vFall > b.pr.impacte * 1.5 || b.pr.fragil && vFall > b.pr.impacte ? 'trencat' : vFall > b.pr.impacte ? 'colpejat' : b.estat;
      const dirx = b.sx || b.lx, diry = b.sy || b.ly, n = Math.hypot(dirx, diry) || 1;
      const [x, y] = mon((b.lx + dirx / n * 30) / CM, (b.ly + diry / n * 30) / CM, p.x, p.y, p.a);
      deixalles.push({ x, y, a: p.a + (Math.random() - 0.5), pr: b.pr, estat: b.estat, n: b.n });
      // el que hi ha a sobre també cau
      p.carrega.filter(o => !o.caigut && o.k === b.k && o.capa > b.capa).forEach(o => cau(p, o, hCm + o.z - b.z));
      s.avis(`${b.estat === 'trencat' ? '💥' : '📦'} Ha caigut ${esc(b.pr.nom.toLowerCase())}${b.estat === 'trencat' ? ' i s\'ha trencat' : b.estat === 'colpejat' ? ' i s\'ha colpejat' : ''}.`, b.estat === 'be' ? 'warn' : 'neg', 2600);
    }
    // Col·lisions de la nova posició
    function colisions(x, y, a) {
      const cos = partsVe(x, y, a), forq = pues(x, y, a), F = forqFrame(x, y, a), P = ve.carrega;
      const PO = P ? (() => { const [px, py] = mon(P.dx, P.dy, F.x, F.y, F.a); return obb(px, py, PL, PW, F.a + P.da); })() : null;
      const alcPal = P ? [P.z, P.z + PAL_H + alcadaCarrega(P)] : null;
      for (const o of estatics) {
        for (const c of cos) { const r = xoca(c, o); if (r) return { amb: o, part: c.tipus, r }; }
        for (const c of forq) { const r = xoca(c, o); if (r) return { amb: o, part: 'forquilles', r }; }
        if (PO) { const r = xoca(PO, o); if (r) return { amb: o, part: 'palet', r }; }
      }
      // Bigues (depenen de l'alçada)
      for (const b of bays) {
        for (const yb of [b.yFront, b.yBack]) {
          const strip = obb(b.x + b.w / 2, yb + (yb === b.yFront ? -b.cara : b.cara) * 2.5, b.w, 5, 0);
          for (const h of b.nivells.filter(h => h > 0)) {
            const bandB = [h - BIGA, h];
            if (yb === b.yBack) continue;   // la del darrere només aguanta
            const solapa = (r) => r[0] < bandB[1] - 0.5 && r[1] > bandB[0] + 0.5;
            for (const c of forq) if (solapa([ve.f - FORQ, ve.f]) && xoca(c, strip)) return { amb: { tipus: 'biga', nom: `la biga del nivell ${b.nivells.indexOf(h) + 1} de ${b.id}` }, part: 'forquilles', r: xoca(c, strip) };
            if (PO && solapa(alcPal) && xoca(PO, strip)) return { amb: { tipus: 'biga', nom: `la biga del nivell ${b.nivells.indexOf(h) + 1} de ${b.id}` }, part: 'palet', r: xoca(PO, strip) };
          }
        }
      }
      // Altres palets
      for (const p of palets) {
        if (p.carregat) continue;
        const O = obbPalet(p), alc = [p.z, p.z + PAL_H + alcadaCarrega(p)];
        for (const c of cos) { if (toro && c.tipus === 'pal' && ve.f > alc[1]) continue; const r = xoca(c, O); if (r && (!toro || alc[0] < 220)) return { amb: { tipus: 'palet', nom: 'un palet', palet: p }, part: c.tipus, r, suau: rel0(p, x, y, a).ok }; }
        const rel = relacio(p, x, y, a, ve.f);
        const fBand = [ve.f - FORQ, ve.f];
        const fSolapa = fBand[0] < alc[1] && fBand[1] > alc[0];
        if (fSolapa && !rel.ok && !(rel.alineat && rel.prof > 8 && p === (ve.dinsDe || null))) for (const c of forq) { const r = xoca(c, O); if (r) return { amb: { tipus: 'palet', nom: rel.alcadaOk ? 'el palet (forquilles mal alineades)' : 'el palet (forquilles a una alçada que no és la de l\'obertura)', palet: p }, part: 'forquilles', r }; }
        if (PO && alcPal[0] < alc[1] && alcPal[1] > alc[0]) { const r = xoca(PO, O); if (r) return { amb: { tipus: 'palet', nom: 'un altre palet', palet: p }, part: 'palet', r }; }
      }
      // Deixalles (productes per terra): s'empenyen
      deixalles.forEach(dd => {
        const O = obb(dd.x, dd.y, 30, 20, dd.a);
        for (const c of cos.concat(forq)) { const r = xoca(c, O); if (r) { dd.x += r.n[0] * r.pen; dd.y += r.n[1] * r.pen; if (Math.abs(ms(ve.v)) > 0.5 && dd.estat === 'be') { dd.estat = 'colpejat'; incid.push({ txt: `Has atropellat ${dd.pr.nom.toLowerCase()} que era a terra.` }); } } }
      });
      return null;
    }
    const rel0 = (p, x, y, a) => relacio(p, x, y, a, ve.f);
    function cop(xc, v) {
      if (xc.suau && v < 0.5) return;   // encaix suau del palet contra el xassís
      if (s.temps - (ve.tCop || -9) < 0.7 && v < 0.6) return;   // mateix contacte (empènyer contra l'obstacle)
      ve.tCop = s.temps;
      const fort = v > 0.8, o = xc.amb;
      const qui = xc.part === 'operari' ? 'operari' : xc.part;
      cops.push({ v, amb: o.tipus, nom: o.nom || o.tipus, part: qui });
      if (qui === 'operari') { incid.push({ greu: v > 0.4, txt: `T'has atrapat entre el transpalet i ${o.nom || o.tipus} (${v.toFixed(1)} m/s).` }); s.avis('⚠️ Compte! T\'has atrapat el cos o els peus.', 'neg', 2500); }
      else s.avis(`${fort ? '💥 Cop fort' : '⚠️ Cop'} (${v.toFixed(1)} m/s): ${qui === 'palet' ? 'la càrrega' : 'el ' + (qui === 'forquilles' ? 'forquilles' : toro ? 'toro' : 'transpalet')} contra ${esc(o.nom || o.tipus)}.`, fort ? 'neg' : 'warn', 2200);
      // Sacseig de la càrrega pròpia i de la del palet colpejat
      const sacseja = (p, dir, vv) => p && p.carrega.forEach(b => {
        if (b.caigut) return;
        const thr = llindar(b, p);
        const ef = vv / 0.08;           // desacceleració del cop
        if (ef > thr) { const dd = (ef - thr) * 0.5 / b.pr.estab; b.sx += dir[0] * dd; b.sy += dir[1] * dd; }
        if (vv > b.pr.impacte * 0.7 && b.estat === 'be') { b.estat = b.pr.fragil ? 'trencat' : 'colpejat'; s.avis(`💥 ${esc(b.pr.nom)}: ${b.estat === 'trencat' ? 'trencat' : 'colpejat'} pel cop.`, 'neg', 2400); }
      });
      if (ve.carrega) { const p = ve.carrega, dirW = [Math.cos(ve.a) * Math.sign(ve.v), Math.sin(ve.a) * Math.sign(ve.v)], [lx, ly] = local(p.x + dirW[0], p.y + dirW[1], p.x, p.y, p.a); sacseja(p, [lx, ly], v); }
      if (o.palet) { const p = o.palet, dirW = [Math.cos(ve.a) * Math.sign(ve.v), Math.sin(ve.a) * Math.sign(ve.v)], [lx, ly] = local(p.x + dirW[0], p.y + dirW[1], p.x, p.y, p.a); sacseja(p, [lx, ly], v * 0.7); }
      revisaCaigudes();
    }
    // Llindar d'acceleració (m/s²) a partir del qual un bloc rellisca
    function llindar(b, p) {
      let t = G * 0.5 * b.pr.estab / (1 + 0.5 * (b.z / 100));
      if (p.filmat) t *= 1.7;
      if (p.malIntro) t *= 0.55;
      return t;
    }
    function estabilitat(dt) {
      let ratio = 0;
      const P = ve.carrega;
      if (P) {
        // acceleració del vehicle: longitudinal + centrípeta; la càrrega sent la contrària
        const h = [Math.cos(ve.a), Math.sin(ve.a)], n90 = [-Math.sin(ve.a), Math.cos(ve.a)];
        const aLat = ms(ve.v) * ve.om;
        let ax = -(ve.aLong * h[0] + aLat * n90[0]), ay = -(ve.aLong * h[1] + aLat * n90[1]);
        // inclinació del pal: endavant empeny la càrrega cap a les puntes
        if (toro) { const F = forqFrame(ve.x, ve.y, ve.a); ax += -Math.sin(ve.tilt * Math.PI / 180) * G * Math.cos(F.a) * 0.6; ay += -Math.sin(ve.tilt * Math.PI / 180) * G * Math.sin(F.a) * 0.6; }
        const [lx, ly] = local(P.x + ax, P.y + ay, P.x, P.y, P.a), aM = Math.hypot(lx, ly);
        P.carrega.forEach(b => {
          if (b.caigut) return;
          const thr = llindar(b, P); ratio = Math.max(ratio, aM / thr);
          if (aM > thr) { const k = (aM - thr) * 14 * (1 + b.z / 60) * dt; b.sx += lx / aM * k; b.sy += ly / aM * k; }
        });
        revisaCaigudes();
        // Bolcada del toro: estabilitat lateral segons l'alçada del centre de gravetat
        if (toro) {
          const mC = massaCarrega(P), hC = (P.z + PAL_H + alcadaCarrega(P) / 2) / 100;
          const hcg = (TV.massa * 0.65 + mC * hC) / (TV.massa + mC);
          const thrLat = G * 0.5 / hcg, thrLon = G * 1.1 / hcg * (1 - mC / 3500) * (1 + Math.max(0, ve.tilt) * 0.03) * (1 - Math.max(0, -ve.tilt) * 0.08);
          const rLat = Math.abs(ms(ve.v) * ve.om) / thrLat, rLon = Math.max(0, -ve.aLong * Math.sign(ve.v)) / thrLon;
          const rT = Math.max(rLat, rLon); ratio = Math.max(ratio, rT);
          if (rT > 0.85) avis('bolc', '⚠️ Risc de bolcada! Redueix la velocitat i baixa la càrrega.', 'neg', 2000);
          if (rT > 1) { tEstab += dt; if (tEstab > 0.25) bolca(rLat > rLon ? 'lateral' : 'endavant'); } else tEstab = Math.max(0, tEstab - dt);
        }
      } else if (toro) tEstab = 0;
      ve.estab = ratio; estabMax = Math.max(estabMax, ratio);
    }
    function revisaCaigudes() {
      const P = ve.carrega || null;
      palets.forEach(p => p.carrega.forEach(b => {
        if (b.caigut) return;
        const sota = p.carrega.filter(o => !o.caigut && o.k === b.k && o.capa < b.capa).reduce((a, o) => [a[0] + o.sx, a[1] + o.sy], [0, 0]);
        const tx = b.sx + sota[0], ty = b.sy + sota[1], lim = b.capa ? 15 : 24;
        if (Math.hypot(b.sx, b.sy) > lim || Math.abs(b.lx + tx) > 60 + 8 || Math.abs(b.ly + ty) > 40 + 8) cau(p, b, (p.z || 0) + PAL_H + b.z);
      }));
      void P;
    }
    function bolca(tipus) {
      bolcat = true;
      incid.push({ greu: true, txt: `El toro ha bolcat (${tipus}): massa velocitat o un gir brusc amb la càrrega ${ve.f > 50 ? 'elevada' : 'pesant'}.` });
      ve.carrega && ve.carrega.carrega.forEach(b => { if (!b.caigut) cau(ve.carrega, b, ve.carrega.z + PAL_H + b.z); });
      s.avis('🚨 El toro ha bolcat! En un magatzem real, això pot ser mortal.', 'neg', 5000);
      avalua('bolc');
    }
    function comprovaFi(dt) {
      const p = palets.find(x => x.objectiu);
      if (!p || p.carregat || !cfg.desti) { fiAuto = 0; return; }
      const ok = p.bay === cfg.desti.bay && p.nivell === cfg.desti.nivell && !p.caigut;
      const lliure = !relacio(p, ve.x, ve.y, ve.a, ve.f).prof && Math.abs(ve.v) < 2 && (!toro || ve.f < 40);
      if (ok && lliure) { fiAuto += dt; if (fiAuto > 0.8) avalua('auto'); } else fiAuto = 0;
    }
    function hud(mC) {
      const e = Math.min(1.2, ve.estab || 0), col = e < 0.6 ? 'var(--verd)' : e < 0.9 ? 'var(--groc)' : 'var(--vermell)';
      const mal = palets.reduce((a, p) => a + p.carrega.filter(b => b.estat !== 'be').length, 0) + deixalles.filter(d => d.estat !== 'be').length;
      s.hud(`<span class="chip">⏱ ${Math.floor(s.temps - t0)} s</span><span class="chip">${(Math.abs(ms(ve.v)) * 3.6).toFixed(1)} km/h ${ve.v < -1 ? '◀' : ''}</span>`
        + `<span class="chip">Forquilles ${Math.round(ve.f)} cm</span>${toro ? `<span class="chip">Pal ${ve.tilt >= 0 ? '⤽ ' : '⤼ '}${Math.abs(ve.tilt).toFixed(0)}°</span>` : ''}`
        + `<span class="chip">${mC ? Math.round(mC) + ' kg' : 'Buit'}</span><span class="chip estab">Estabilitat <span class="barra"><i style="width:${Math.max(4, 100 - e / 1.2 * 100)}%;background:${col}"></i></span></span>`
        + `<span class="chip ${cops.length ? 'warn' : ''}">Cops ${cops.length}</span><span class="chip ${mal ? 'neg' : ''}">Malmesos ${mal}</span>`);
    }

    /* ----- Avaluació ----- */
    function avalua(com) {
      if (acabat) return; acabat = true;
      const mal = [], be = [], p = palets.find(x => x.objectiu);
      let nota = 100;
      const temps = Math.round(s.temps - t0);
      // Col·locació
      let colOk = false, prec = null;
      if (cfg.desti && p) {
        if (p.carregat) { nota -= 40; mal.push('No has deixat el palet: encara és a les forquilles.'); }
        else if (p.bay !== cfg.desti.bay || p.nivell !== cfg.desti.nivell) { nota -= 40; mal.push(`El palet havia d'anar a ${cfg.desti.bay}, nivell ${cfg.desti.nivell}${p.bay ? ` i és a ${p.bay}, nivell ${p.nivell}` : ''}.`); }
        else {
          colOk = true;
          const b = bays.find(x => x.id === p.bay), [lx, ly] = local(p.x, p.y, b.x + b.w / 2, b.y + b.d / 2, 0), ang = Math.abs(modPi(p.a - Math.PI / 2)) * 180 / Math.PI;
          const lat = Math.abs(lx) * CM, sobresurt = (PL / 2 - BAY_D / 2 + ly * b.cara) * CM;
          prec = Math.max(0, Math.round(100 - lat * 2.5 - Math.max(0, Math.abs(sobresurt - 4) - 4) * 2.5 - ang * 4));
          nota -= Math.round((100 - prec) * 0.25);
          if (prec >= 80) be.push(`Palet ben centrat a ${p.bay}${cfg.desti.nivell > 1 ? ', nivell ' + cfg.desti.nivell : ''} (precisió ${prec} %).`);
          else { const qq = []; if (lat > 6) qq.push(`desplaçat ${Math.round(lat)} cm de costat`); if (Math.abs(sobresurt - 4) > 8) qq.push(sobresurt > 4 ? `sobresurt ${Math.round(sobresurt)} cm cap al passadís` : 'massa endins'); if (ang > 3) qq.push(`tort ${Math.round(ang)}°`); mal.push(`Col·locació millorable (precisió ${prec} %): ${qq.join(', ') || 'poc centrat'}.`); }
        }
      }
      // Cops
      const forts = cops.filter(c => c.v > 0.8 && c.part !== 'operari'), lleus = cops.filter(c => c.v <= 0.8 && c.part !== 'operari');
      nota -= Math.min(30, forts.length * 12 + lleus.length * 4);
      if (forts.length) mal.push(`${forts.length} cop${forts.length > 1 ? 's' : ''} fort${forts.length > 1 ? 's' : ''} (més de 0,8 m/s): ${[...new Set(forts.map(c => c.nom))].slice(0, 3).join(', ')}. ${forts.some(c => c.amb === 'prestatgeria' || c.amb === 'biga') ? 'Un cop a la prestatgeria s\'ha de comunicar: pot quedar danyada i caure.' : ''}`);
      if (lleus.length) mal.push(`${lleus.length} cop${lleus.length > 1 ? 's' : ''} lleu${lleus.length > 1 ? 's' : ''}.`);
      if (!cops.length) be.push('Cap cop contra prestatgeries, palets ni parets.');
      // Danys a la mercaderia
      const tots = palets.flatMap(x => x.carrega);
      const malmesos = tots.filter(b => b.estat !== 'be'), caiguts = tots.filter(b => b.caigut && b.estat === 'be');
      nota -= Math.min(45, malmesos.length * 15 + caiguts.length * 6);
      malmesos.forEach(b => mal.push(`${b.pr.nom}: ${b.estat === 'trencat' ? 'trencat' : 'colpejat'}${b.caigut ? ' en caure' : ''}.`));
      if (caiguts.length) mal.push(`${caiguts.length} bloc${caiguts.length > 1 ? 's' : ''} de caixes ${caiguts.length > 1 ? 'han' : 'ha'} caigut a terra (sense trencar-se, però cal tornar-los a apilar i revisar).`);
      if (!malmesos.length && !caiguts.length) be.push('Tota la mercaderia ha arribat sencera.');
      // Seguretat i ús correcte
      incid.forEach(i => { mal.push(i.txt); nota -= i.greu ? 30 : 8; });
      const pctUs = recorregut > 50 && palets.some(x => x.mogut) ? Math.round(recCorrecte / Math.max(1, recorregut) * 100) : 100;
      if (pctUs < 70) { nota -= Math.round((70 - pctUs) * 0.25); mal.push(toro ? `Només el ${pctUs} % del recorregut amb càrrega l'has fet com toca: forquilles baixes (≤ 30 cm) i pal enrere per circular, i a poc a poc (≤ 0,5 m/s) si la càrrega és elevada.` : `Has empès el transpalet carregat i de pressa el ${100 - pctUs} % del recorregut. Per desplaçar-te, estira'l; empeny-lo només per maniobrar, a poc a poc.`); }
      else if (palets.some(x => x.mogut)) be.push(toro ? 'Has circulat amb la càrrega baixa i el pal enrere.' : 'Has estirat el transpalet en els desplaçaments.');
      if (estabMax > 0.9 && !bolcat) mal.push('Has portat la càrrega al límit de l\'estabilitat (girs o frenades bruscos).');
      if (bolcat) nota = Math.min(nota, 10);
      if (com === 'manual' && !colOk && cfg.desti) mal.unshift('Has acabat abans de deixar el palet al seu lloc.');
      nota = Math.max(0, Math.min(100, Math.round(nota)));
      const r = { titol: cfg.titol, nota, temps, tempsTotal: s.temps, cops: cops.length, copsForts: forts.length, malmesos: malmesos.map(b => ({ nom: b.pr.nom, prod: b.pr.id, estat: b.estat })), caiguts: caiguts.length, precisio: prec, colocat: colOk, bolcat, incidents: incid.map(i => i.txt), usCorrecte: pctUs,
        kpi: [['Temps', temps + ' s'], ['Cops', cops.length, cops.length ? 'warn' : 'pos'], ['Malmesos / caiguts', malmesos.length + ' / ' + caiguts.length, malmesos.length + caiguts.length ? 'neg' : 'pos'], ['Precisió', prec == null ? '—' : prec + ' %'], ['Estabilitat màx.', Math.round(Math.min(1.5, estabMax) * 100) + ' %', estabMax > 0.9 ? 'neg' : estabMax > 0.6 ? 'warn' : 'pos'], ['Ús correcte', pctUs + ' %']],
        mal, be, consell: cfg.consell };
      s.resultat(r, [[cfg.botoSeguent || 'Continua', () => { s.tanca(); onFi && onFi(r); }], ['Torna-ho a provar', () => { s.pausa(false); munta(); }]]);
    }

    /* ----- Dibuix ----- */
    function dibuixa(c) {
      c.fillStyle = '#cfd5dc'; c.fillRect(0, 0, 1000, 560);
      c.strokeStyle = 'rgba(0,0,0,.05)'; c.lineWidth = 1; for (let x = 0; x < 1000; x += 50) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 560); c.stroke(); } for (let y = 0; y < 560; y += 50) { c.beginPath(); c.moveTo(0, y); c.lineTo(1000, y); c.stroke(); }
      const m = cfg.mapa;
      (m.zones || []).forEach(z => { c.fillStyle = z.color || 'rgba(245,197,66,.18)'; c.fillRect(z.x, z.y, z.w, z.h); c.strokeStyle = 'rgba(180,140,20,.7)'; c.setLineDash([8, 6]); c.strokeRect(z.x, z.y, z.w, z.h); c.setLineDash([]); c.fillStyle = '#6b5410'; c.font = '600 13px Inter, sans-serif'; c.textAlign = 'left'; c.fillText(z.nom, z.x + 6, z.y + 16); });
      (m.linies || []).forEach(l => { c.strokeStyle = '#f5c542'; c.lineWidth = 4; c.beginPath(); c.moveTo(l[0], l[1]); c.lineTo(l[2], l[3]); c.stroke(); });
      // Ubicacions
      bays.forEach(b => {
        const obj = cfg.desti && cfg.desti.bay === b.id;
        c.fillStyle = obj ? 'rgba(54,179,126,.28)' : 'rgba(255,255,255,.35)'; c.fillRect(b.x, b.y, b.w, b.d);
        if (obj) { c.strokeStyle = '#1e9e66'; c.lineWidth = 2; c.setLineDash([5, 4]); c.strokeRect(b.x + 1, b.y + 1, b.w - 2, b.d - 2); c.setLineDash([]); }
        c.fillStyle = '#f08a24'; c.fillRect(b.x, b.yFront + (b.cara > 0 ? -4 : 0), b.w, 4); c.fillRect(b.x, b.yBack + (b.cara > 0 ? 0 : -4), b.w, 4);
      });
      estatics.forEach(o => { if (o.tipus === 'paret' && (o.x < 0 || o.x > 1000 || o.y < 0 || o.y > 560)) return; c.fillStyle = o.tipus === 'prestatgeria' ? '#2f5f9e' : o.tipus === 'columna' ? '#7b8794' : o.tipus === 'caixes' ? '#b07a3f' : '#596474'; const p = cantons(o); c.beginPath(); p.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.fill(); if (o.tipus === 'columna') { c.strokeStyle = '#f5c542'; c.lineWidth = 2; c.stroke(); } });
      deixalles.forEach(d => { c.save(); c.translate(d.x, d.y); c.rotate(d.a); PH.dibuixaBult(c, d.pr, 30, 20, d.estat); c.restore(); });
      palets.filter(p => !p.carregat).sort((a, b) => a.z - b.z).forEach(p => dibuixaPalet(c, p));
      // etiquetes de les ubicacions (per sobre dels palets)
      bays.forEach(b => {
        const obj = cfg.desti && cfg.desti.bay === b.id, ty = b.cara > 0 ? b.y + b.d + 13 : b.y - 5;
        c.font = '600 11px Inter, sans-serif'; c.textAlign = 'center';
        const t = b.id + (obj ? ' · N' + cfg.desti.nivell : ''), w = c.measureText(t).width + 8;
        c.fillStyle = obj ? '#1e9e66' : 'rgba(255,255,255,.75)'; PH.rrect(c, b.x + b.w / 2 - w / 2, ty - 10, w, 13, 4); c.fill();
        c.fillStyle = obj ? '#fff' : '#4a5563'; c.fillText(t, b.x + b.w / 2, ty);
      });
      dibuixaVehicle(c);
      if (ve.carrega) dibuixaPalet(c, ve.carrega);
      // Guia d'alineació quan les forquilles s'acosten a un palet
      palets.forEach(p => { if (p.carregat || !p.rel) return; const r = p.rel; if (r.prof > 0 || Math.abs(r.px) < 90) { if (Math.abs(r.px) < 110 && Math.abs(r.py) < 40) { c.fillStyle = r.ok ? 'rgba(54,179,126,.9)' : 'rgba(239,98,98,.9)'; c.font = 'bold 12px Inter, sans-serif'; c.textAlign = 'center'; c.fillText(r.ok ? (r.prof > 45 ? '✓ Forquilles dins' : '✓ Alineat') : !r.alcadaOk ? '✗ Alçada' : '✗ Alinea', p.x, p.y - 30); } } });
      dibuixaGuia(c);
      if (toro) dibuixaLateral(c);
      if (bolcat) { c.fillStyle = 'rgba(200,0,0,.15)'; c.fillRect(0, 0, 1000, 560); }
    }
    function dibuixaPalet(c, p) {
      const sh = Math.min(14, p.z / 25);
      c.save(); c.translate(p.x + sh, p.y + sh); c.rotate(p.a);
      if (p.z > 2) { c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(-PL / 2, -PW / 2, PL, PW); }
      c.restore();
      c.save(); c.translate(p.x, p.y); c.rotate(p.a);
      const k = 1 + Math.min(0.25, p.z / 1600);
      c.scale(k, k);
      c.fillStyle = '#c99a5b'; c.fillRect(-PL / 2, -PW / 2, PL, PW);
      c.strokeStyle = '#8a6532'; c.lineWidth = 1; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(-PL / 2, i * PW / 5); c.lineTo(PL / 2, i * PW / 5); c.stroke(); }
      // blocs de càrrega: es dibuixa la columna de cada quadrant (el de més amunt)
      [0, 1, 2, 3].forEach(k2 => {
        const col = p.carrega.filter(b => b.k === k2 && !b.caigut); if (!col.length) return;
        col.forEach((b, i) => {
          const sota = col.filter(o => o.capa < b.capa).reduce((a, o) => [a[0] + o.sx, a[1] + o.sy], [0, 0]);
          const x = (b.lx + b.sx + sota[0]) / CM, y = (b.ly + b.sy + sota[1]) / CM;
          c.save(); c.translate(x, y); c.globalAlpha = i === col.length - 1 ? 1 : 0.5;
          PH.dibuixaBult(c, b.pr, 28, 18, b.estat); c.restore();
        });
        const top = col[col.length - 1]; c.fillStyle = 'rgba(0,0,0,.55)'; c.font = '9px sans-serif'; c.textAlign = 'center'; c.fillText(col.length + 'c', (top.lx + top.sx) / CM + 9, (top.ly + top.sy) / CM + 8);
      });
      c.restore();
      if (p.z > 20 && !p.carregat) { c.fillStyle = 'rgba(17,24,39,.8)'; c.font = 'bold 10px Inter, sans-serif'; c.textAlign = 'center'; const n = p.nivell || 1; PH.rrect(c, p.x - 11, p.y - 7, 22, 14, 4); c.fill(); c.fillStyle = '#fff'; c.fillText('N' + n, p.x, p.y + 3.5); }
    }
    function dibuixaVehicle(c) {
      c.save(); c.translate(ve.x, ve.y); c.rotate(ve.a);
      if (bolcat) c.globalAlpha = 0.6;
      const F = TV.forq, fx0 = F.dir > 0 ? F.arrel : F.arrel - F.llarg;
      const elev = toro ? Math.min(1, ve.f / 400) : (ve.f - TV.fMin) / 12;
      c.fillStyle = toro ? `rgb(${120 + elev * 80},${120 + elev * 80},${130 + elev * 70})` : '#6b7280';
      TV.puntes.forEach(py => c.fillRect(fx0, py - 3.5, F.llarg, 7));
      if (toro) {
        c.fillStyle = '#f5c542'; PH.rrect(c, -84, -28, 90, 56, 8); c.fill(); c.strokeStyle = '#8a6d12'; c.lineWidth = 2; c.stroke();
        c.fillStyle = '#3b3b3b'; PH.rrect(c, -84, -26, 22, 52, 6); c.fill();                  // contrapès
        c.fillStyle = 'rgba(30,30,30,.25)'; c.fillRect(-56, -22, 46, 44);                         // sostre protector
        c.strokeStyle = '#222'; c.lineWidth = 2; c.strokeRect(-56, -22, 46, 44);
        c.fillStyle = '#4b5563'; c.fillRect(6, -22, 8, 44);                                    // pal
        c.fillStyle = '#111'; c.fillRect(-10, -31, 14, 6); c.fillRect(-10, 25, 14, 6);             // rodes davant
        c.save(); c.translate(-64, 0); c.rotate(ve.d * -1); c.fillRect(-7, -31, 14, 6); c.fillRect(-7, 25, 14, 6); c.restore();
        c.fillStyle = '#e07b39'; c.beginPath(); c.arc(-34, 0, 9, 0, Math.PI * 2); c.fill();     // conductor
      } else {
        c.fillStyle = '#e07b39'; PH.rrect(c, 50, -15, 16, 30, 4); c.fill();
        c.save(); c.translate(58, 0); c.rotate(ve.d * -1);
        c.strokeStyle = '#333'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(36, 0); c.stroke(); c.fillStyle = '#333'; c.fillRect(34, -8, 4, 16);
        c.fillStyle = '#3d7fd9'; c.beginPath(); c.arc(44, 0, 9, 0, Math.PI * 2); c.fill(); c.fillStyle = '#f0c7a0'; c.beginPath(); c.arc(44, 0, 5, 0, Math.PI * 2); c.fill();
        c.restore();
      }
      c.restore();
    }
    // Vista lateral (toro): alçada de forquilles, inclinació del pal i nivells de la prestatgeria del davant
    /* ----- Guia pas a pas ----- */
    let guiaIdx = -1, guiaObj = null;
    function guia() {
      const p = palets.find(x => x.objectiu);
      if (!p || !cfg.desti) return;
      const bay = bays.find(b => b.id === cfg.desti.bay); if (!bay) return;
      const niv = cfg.desti.nivell, hB = bay.nivells[niv - 1] || 0;
      const PASSOS = toro ? [
        ['Baixa les forquilles a 5-10 cm', 'Tecla <kbd>F</kbd>. Després apunta les forquilles (davant del toro) cap al palet.'],
        ['Fica les forquilles fins al fons', 'Avança a poc a poc amb <kbd>W</kbd>, recte cap al palet. Si surt «✗ Alinea», recula (<kbd>S</kbd>) i corregeix amb <kbd>A</kbd>/<kbd>D</kbd>.'],
        ['Aixeca el palet i inclina el pal enrere', 'Puja a 15-20 cm amb <kbd>R</kbd> i inclina el pal enrere amb <kbd>G</kbd>.'],
        [`Porta'l davant de ${bay.id}`, `Recula amb <kbd>S</kbd>, gira amb <kbd>A</kbd>/<kbd>D</kbd> i posa't davant de la ubicació amb les forquilles mirant la prestatgeria. A poc a poc: la cua gira molt.`],
        [`Atura't i puja les forquilles a ${hB + 12}-${hB + 30} cm`, niv > 1 ? `Tecla <kbd>R</kbd>. La biga del nivell ${niv} és a ${hB} cm: el palet ha de passar per sobre (mira la vista lateral).` : 'A terra no cal pujar: deixa les forquilles a 15-20 cm.'],
        ['Entra a poc a poc fins que el palet sigui dins', 'Avança amb <kbd>W</kbd>, recte. Atura\'t abans de tocar el fons.'],
        [niv > 1 ? `Baixa fins que el palet reposi a la biga (${hB} cm)` : 'Baixa el palet fins a terra', 'Tecla <kbd>F</kbd>, a poc a poc. Quan el palet es recolza, s\'avisa.'],
        ['Surt marxa enrere i baixa les forquilles', 'Recula recte amb <kbd>S</kbd> i baixa les forquilles amb <kbd>F</kbd> fins a 15-20 cm.']
      ] : [
        ['Posa\'t d\'esquena al palet', 'Les forquilles (grises) són al darrere; tu ets el cercle blau de la llança. Gira amb <kbd>A</kbd>/<kbd>D</kbd> fins que les forquilles apuntin al palet.'],
        ['Recula per ficar les forquilles fins al fons', 'Empeny amb <kbd>S</kbd>, a poc a poc i recte. Si surt «✗ Alinea», estira (<kbd>W</kbd>) i torna-hi.'],
        ['Aixeca el palet amb la bomba', 'Prem <kbd>E</kbd> un o dos cops.'],
        [`Estira'l fins davant de ${bay.id}`, 'Camina endavant amb <kbd>W</kbd> i gira amb <kbd>A</kbd>/<kbd>D</kbd>. Sense girs bruscos: la càrrega pot caure.'],
        [`Entra d'esquena a ${bay.id}, ben recte`, 'Posa les forquilles mirant la ubicació i recula amb <kbd>S</kbd> a poc a poc.'],
        ['Baixa el palet', 'Mantén premuda <kbd>Q</kbd> fins que el palet toqui a terra.'],
        ['Treu les forquilles', 'Estira amb <kbd>W</kbd>, recte, fins que les forquilles surtin del palet.']
      ];
      const F = forqFrame(ve.x, ve.y, ve.a), dirRack = bay.cara > 0 ? -Math.PI / 2 : Math.PI / 2;
      const ax = bay.x + bay.w / 2, ay = bay.yFront + bay.cara * 45;
      const rel = relacio(p, ve.x, ve.y, ve.a, ve.f);
      const aLaUbic = p.bay === cfg.desti.bay && p.nivell === niv && !p.carregat;
      let idx;
      if (aLaUbic) idx = rel.prof > 0 || (toro && ve.f > 40) ? PASSOS.length - 1 : PASSOS.length;
      else if (!p.carregat) {
        if (rel.prof >= 46) idx = toro ? 2 : 2;
        else if (rel.prof > 0 || (rel.alineat && Math.abs(rel.px) < 120)) idx = toro && !rel.alcadaOk ? 0 : 1;
        else idx = toro && ve.f > 11 ? 0 : (toro ? 1 : 0);
        if (toro && idx === 1 && !rel.alineat) idx = rel.alcadaOk ? 1 : 0;
      } else {
        const dins = Math.abs(p.x - ax) < 30 && p.y > bay.y - 12 && p.y < bay.y + bay.d + 12;
        const davant = Math.hypot(p.x - ax, p.y - ay) < 110 && Math.abs(angDif(F.a, dirRack)) < 0.35;
        if (dins) idx = toro ? 6 : 5;
        else if (toro && (ve.f < 12 || ve.tilt < 2) && !davant && Math.hypot(p.x - ax, p.y - ay) > 160) idx = 2;
        else if (davant) idx = toro ? (p.z < hB + 2 ? 4 : 5) : 4;
        else idx = 3;
      }
      guiaObj = idx <= 1 || (idx === 2 && !p.carregat) ? { x: p.x, y: p.y, txt: 'Palet' } : idx < PASSOS.length - (toro ? 2 : 2) ? { x: ax, y: idx >= (toro ? 5 : 4) ? bay.y + bay.d / 2 : ay, txt: bay.id } : null;
      if (idx === guiaIdx) return;
      guiaIdx = idx;
      let g = s.el.querySelector('#hGuia');
      if (!g) { g = document.createElement('div'); g.id = 'hGuia'; g.className = 'hab-guia'; s.el.querySelector('.hab-c').appendChild(g); }
      g.innerHTML = `<b>Passos</b><ol>${PASSOS.map(([t, d], i) => `<li class="${i < idx ? 'fet' : i === idx ? 'ara' : ''}"><span>${t}</span>${i === idx ? `<small>${d}</small>` : ''}</li>`).join('')}</ol>${idx >= PASSOS.length ? '<p class="pos small">✓ Fet! Ja pots prémer «He acabat».</p>' : ''}`;
    }
    function dibuixaGuia(c) {
      // Rètols del vehicle durant els primers segons
      if (s.temps - t0 < 8) {
        const F = forqFrame(ve.x, ve.y, ve.a), [fx, fy] = mon(TV.forq.llarg + 14, 0, F.x, F.y, F.a);
        c.font = 'bold 12px Inter, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#111827';
        c.fillText('forquilles', fx, fy - 18 < 10 ? fy + 24 : fy - 18);
      }
      if (!guiaObj || acabat) return;
      const t = (s.temps * 3) % (Math.PI * 2), r = 26 + Math.sin(t) * 5;
      c.strokeStyle = 'rgba(155,122,232,.9)'; c.lineWidth = 3; c.setLineDash([6, 5]);
      c.beginPath(); c.arc(guiaObj.x, guiaObj.y, r, 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
      c.fillStyle = '#6b4fc8'; c.font = 'bold 12px Inter, sans-serif'; c.textAlign = 'center'; c.fillText('➜ ' + guiaObj.txt, guiaObj.x, guiaObj.y - r - 6);
    }
    function dibuixaLateral(c) {
      const X = 14, Y = 398, W = 270, H = 150;
      c.save(); c.fillStyle = 'rgba(17,24,39,.85)'; PH.rrect(c, X, Y, W, H, 10); c.fill();
      c.fillStyle = '#aab7c8'; c.font = '600 11px Inter, sans-serif'; c.textAlign = 'left'; c.fillText('Vista lateral', X + 10, Y + 16);
      const esc2 = (H - 40) / 470, base = Y + H - 14, xr = X + 150;
      c.strokeStyle = '#6b7280'; c.lineWidth = 1; c.beginPath(); c.moveTo(X + 8, base); c.lineTo(X + W - 8, base); c.stroke();
      // prestatgeria més propera davant de les forquilles
      const F = forqFrame(ve.x, ve.y, ve.a); let bay = null, dist = 1e9;
      bays.forEach(b => { const [lx, ly] = local(b.x + b.w / 2, b.yFront, F.x, F.y, F.a); if (lx > -20 && Math.abs(ly) < 30 && lx < dist) { dist = lx; bay = b; } });
      if (bay) {
        c.fillStyle = '#2f5f9e'; c.fillRect(xr + 40, base - 450 * esc2, 4, 450 * esc2);
        bay.nivells.filter(h => h > 0).forEach((h, i) => { c.fillStyle = '#f08a24'; c.fillRect(xr, base - h * esc2, 44, BIGA * esc2 + 1); c.fillStyle = '#e5e7eb'; c.font = '10px Inter, sans-serif'; c.fillText('N' + (i + 2) + ' · ' + h, xr + 48, base - h * esc2 + 4); });
        c.fillStyle = '#e5e7eb'; c.fillText(bay.id + ' · ' + Math.max(0, Math.round(dist * CM)) + ' cm', xr - 4, Y + 16);
      }
      // pal i forquilles
      const xm = X + 60;
      c.save(); c.translate(xm, base); c.rotate(-ve.tilt * Math.PI / 180);
      c.fillStyle = '#4b5563'; c.fillRect(-4, -460 * esc2, 6, 460 * esc2);
      const fy = -ve.f * esc2;
      c.fillStyle = '#d1d5db'; c.fillRect(2, fy - 2, 58, 3); c.fillRect(0, fy - 16, 3, 16);
      if (ve.carrega) {
        const P = ve.carrega, hc = alcadaCarrega(P);
        c.fillStyle = '#c99a5b'; c.fillRect(2, fy - PAL_H * esc2, 58, PAL_H * esc2 - 2);
        c.fillStyle = '#b07a3f'; c.fillRect(4, fy - (PAL_H + hc) * esc2, 54, hc * esc2);
      }
      c.restore();
      c.fillStyle = '#f5c542'; c.fillRect(X + 10, base - 22, 50, 14);
      c.fillStyle = '#fff'; c.font = '600 11px Inter, sans-serif'; c.textAlign = 'left';
      c.fillText(Math.round(ve.f) + ' cm', X + 10, Y + 34); c.fillText('Pal ' + (ve.tilt >= 0 ? 'enrere ' : 'endavant ') + Math.abs(ve.tilt).toFixed(0) + '°', X + 10, Y + 48);
      c.restore();
    }
    munta(); s.arrenca();
    s.dbg = () => ({ ve, palets, deixalles, cops, incid, acabat });
    PH._s = s;
    return s;
  };
  PH.NIVELLS_CM = NIVELLS_CM;
})();
