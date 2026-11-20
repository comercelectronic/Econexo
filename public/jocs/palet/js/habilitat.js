/* Palet · capa d'habilitat (1/2): propietats físiques dels productes, infraestructura de les escenes i manipulació manual amb dues mans (Matter.js). */
(function () {
  const D = window.PD;
  const PH = window.PH = {};
  const esc = (t) => String(t == null ? '' : t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  PH.esc = esc;

  /* ================= Propietats físiques ================= */
  // Per tipus d'envàs. mida: [amplada, alçada] en cm (vista lateral d'un bult).
  // impacte: velocitat d'impacte (m/s) que el fa malbé · pressio: kg màxims a sobre · estab: estabilitat de l'embalatge (0-1)
  // inclinacio: graus màxims d'inclinació (null = indiferent) · dreta: s'ha de deixar dret («aquest costat amunt»)
  const PER_ENVAS = {
    ampolla: { mida: [36, 30], impacte: 2.6, pressio: 60, estab: 0.75, dreta: true },
    brik:    { mida: [32, 26], impacte: 2.4, pressio: 45, estab: 0.8, dreta: true },
    paquet:  { mida: [40, 26], impacte: 3.5, pressio: 18, estab: 0.85 },
    llauna:  { mida: [34, 14], impacte: 4.0, pressio: 80, estab: 0.9 },
    sac:     { mida: [60, 14], impacte: 2.2, pressio: 400, estab: 0.95 },
    pot:     { mida: [30, 18], impacte: 1.4, pressio: 30, estab: 0.7, dreta: true },
    ous:     { mida: [30, 30], impacte: 0.9, pressio: 6, estab: 0.6, inclinacio: 40, dreta: true },
    iogurt:  { mida: [30, 16], impacte: 2.0, pressio: 12, estab: 0.7, inclinacio: 60, dreta: true },
    formatge:{ mida: [30, 14], impacte: 2.2, pressio: 10, estab: 0.75, dreta: true },
    embotit: { mida: [36, 14], impacte: 3.5, pressio: 30, estab: 0.85 },
    gelat:   { mida: [36, 22], impacte: 2.4, pressio: 15, estab: 0.8 },
    bossa:   { mida: [36, 12], impacte: 3.5, pressio: 25, estab: 0.9 },
    safata:  { mida: [30, 10], impacte: 2.4, pressio: 8, estab: 0.65, inclinacio: 45, dreta: true },
    garrafa: { mida: [36, 32], impacte: 3.0, pressio: 70, estab: 0.7, inclinacio: 75, dreta: true },
    caixa:   { mida: [36, 24], impacte: 3.0, pressio: 30, estab: 0.85 },
    roba:    { mida: [36, 20], impacte: 6.0, pressio: 40, estab: 0.95 },
    llibre:  { mida: [26, 8], impacte: 5.0, pressio: 60, estab: 0.95 },
    tub:     { mida: [120, 10], impacte: 4.0, pressio: 200, estab: 0.6 },
    bobina:  { mida: [44, 44], impacte: 5.0, pressio: 300, estab: 0.5 }
  };
  // Objectes de la prova de validació (un bult solt de cada)
  PH.PROVES = {
    p_caixa:   { nom: 'Caixa normal', pes: 5, envas: 'caixa', color: '#c98b4a', mida: [40, 30], impacte: 3.2, pressio: 30, estab: 0.9 },
    p_ampolla: { nom: 'Ampolla de vidre', pes: 1.3, envas: 'ampolla', color: '#3f8f5a', mida: [8, 32], impacte: 1.1, pressio: 25, estab: 0.5, fragil: 1, dreta: true },
    p_ous:     { nom: 'Capsa d\'ous', pes: 0.8, envas: 'ous', color: '#f5deb3', mida: [30, 7], impacte: 0.8, pressio: 1.5, estab: 0.6, fragil: 1, inclinacio: 35, dreta: true },
    p_llauna:  { nom: 'Pot de conserva', pes: 0.6, envas: 'llauna', color: '#e0614a', mida: [8, 11], impacte: 4, pressio: 60, estab: 0.9 },
    p_vi:      { nom: 'Ampolla de vi', pes: 1.3, envas: 'ampolla', color: '#7a1f3d', mida: [8, 32], impacte: 1.1, pressio: 25, estab: 0.5, fragil: 1, dreta: true },
    p_sac:     { nom: 'Sac de sucre 25 kg', pes: 25, envas: 'sac', color: '#f2f2f2', mida: [60, 14], impacte: 2.4, pressio: 400, estab: 0.95 }
  };
  // Propietats d'un producte del joc o d'un objecte de prova
  PH.prop = (id) => {
    const p = (D.productes && D.productes[id]) || PH.PROVES[id];
    if (!p) return null;
    const env = p.envas || p.icona || 'caixa', b = PER_ENVAS[env] || PER_ENVAS.caixa;
    const fragil = !!p.fragil;
    const out = {
      id, nom: p.nom, pes: p.pes, color: p.color || '#c98b4a', envas: env,
      mida: p.mida || (p.llarg ? [120, 10] : b.mida),
      fragil,
      impacte: p.impacte || (fragil ? Math.min(b.impacte, 1.4) : b.impacte),
      pressio: p.pressio || (fragil ? Math.min(b.pressio, 20) : b.pressio),
      estab: p.estab || b.estab,
      inclinacio: p.inclinacio != null ? p.inclinacio : (b.inclinacio || null),
      dreta: p.dreta != null ? !!p.dreta : !!b.dreta,
      fred: p.fred || null,
      perill: p.perill || null
    };
    out.mans = out.pes > D.PES_MANUAL ? 0 : out.pes > 8 || out.mida[0] > 70 ? 2 : 1;   // 0 = cal un mitjà mecànic
    return out;
  };
  PH.fragilitatTxt = (pr) => pr.impacte < 1.5 ? 'molt fràgil' : pr.impacte < 2.6 ? 'delicat' : 'resistent';

  /* ================= Infraestructura de les escenes ================= */
  // Obre una escena a pantalla completa amb un canvas de mida lògica W × H
  PH.obre = function (o) {
    const el = document.createElement('div');
    el.className = 'hab';
    el.innerHTML = `<header class="hab-cap"><div class="hab-tit"><b>${esc(o.titol)}</b><span class="small muted">${o.consigna || ''}</span></div>
      <div class="hab-hud" id="hHud"></div><button class="btn small ghost" id="hAjuda" title="Controls">⌨ Controls</button><button class="btn small ghost" id="hSurt">✕ Surt</button></header>
      <div class="hab-c"><canvas id="hCv"></canvas><div class="hab-avis" id="hAvis" aria-live="polite"></div></div>
      <footer class="hab-peu"><div class="hab-tactil" id="hTac">${o.tactil || ''}</div><div class="row"><button class="btn small" id="hReinicia">↺ Torna a començar</button>${o.senseFet ? '' : '<button class="btn small prim" id="hFet">He acabat ✓</button>'}</div></footer>`;
    document.body.appendChild(el);
    document.body.classList.add('hab-obert');
    const cv = el.querySelector('#hCv'), ctx = cv.getContext('2d');
    const W = o.W || 1000, H = o.H || 560;
    let k = 1, ox = 0, oy = 0;
    function mida() {
      const c = el.querySelector('.hab-c'), r = c.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      k = Math.min(r.width / W, r.height / H);
      cv.style.width = W * k + 'px'; cv.style.height = H * k + 'px';
      cv.width = Math.round(W * k * dpr); cv.height = Math.round(H * k * dpr);
      ctx.setTransform(k * dpr, 0, 0, k * dpr, 0, 0);
      const rc = cv.getBoundingClientRect(); ox = rc.left; oy = rc.top;
    }
    const ro = new ResizeObserver(mida); ro.observe(el.querySelector('.hab-c')); mida();
    const tecles = new Set();
    const kd = (e) => { if (e.target.tagName === 'INPUT') return; const t = e.key.toLowerCase(); if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(t)) e.preventDefault(); if (!tecles.has(t)) { tecles.add(t); s.onTecla && s.onTecla(t); } };
    const ku = (e) => tecles.delete(e.key.toLowerCase());
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    const blur = () => tecles.clear(); window.addEventListener('blur', blur);
    // Botons tàctils: data-k="tecla" mantinguts premuts
    el.querySelectorAll('[data-k]').forEach(b => {
      const t = b.dataset.k;
      b.addEventListener('pointerdown', (e) => { e.preventDefault(); b.setPointerCapture(e.pointerId); tecles.add(t); b.classList.add('on'); s.onTecla && s.onTecla(t); });
      const fi = () => { tecles.delete(t); b.classList.remove('on'); };
      b.addEventListener('pointerup', fi); b.addEventListener('pointercancel', fi);
    });
    let raf = 0, acc = 0, t0 = performance.now(), viu = true, pausa = false;
    const s = {
      el, cv, ctx, W, H, tecles, temps: 0,
      // Coordenades del punter en unitats del món
      mon: (e) => { const rc = cv.getBoundingClientRect(); ox = rc.left; oy = rc.top; return { x: (e.clientX - ox) / k, y: (e.clientY - oy) / k }; },
      hud: (h) => { const r = o.rellotge; el.querySelector('#hHud').innerHTML = (r ? `<span class="chip rell" title="Rellotge del torn">🕗 ${r.hora(r.inici + s.temps * r.ritme)}</span>` : '') + h; },
      avis: (txt, cls, ms) => {
        const a = el.querySelector('#hAvis'), d = document.createElement('div'); d.className = 'hab-msg ' + (cls || ''); d.innerHTML = txt; a.appendChild(d);
        while (a.children.length > 3) a.firstChild.remove();
        setTimeout(() => d.remove(), ms || 2600);
      },
      pausa: (v) => { pausa = v; },
      tanca: () => {
        if (!viu) return; viu = false; cancelAnimationFrame(raf); ro.disconnect();
        window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); window.removeEventListener('blur', blur);
        el.remove(); if (!document.querySelector('.hab')) document.body.classList.remove('hab-obert');
      },
      // Finestra de resultat dins l'escena
      resultat: (r, botons) => {
        pausa = true;
        const m = document.createElement('div'); m.className = 'hab-res';
        const est = r.nota >= 85 ? '★★★' : r.nota >= 65 ? '★★☆' : r.nota >= 40 ? '★☆☆' : '☆☆☆';
        m.innerHTML = `<div class="hab-res-box"><h2>${r.nota >= 65 ? '👍' : '⚠️'} ${esc(r.titol || 'Resultat')}</h2>
          <p class="hab-nota"><b>${r.nota}</b><span>/100</span> <span class="hab-est">${est}</span></p>
          <div class="hab-kpi">${(r.kpi || []).map(([n, v, c]) => `<div class="${c || ''}"><span>${esc(n)}</span><b>${v}</b></div>`).join('')}</div>
          ${r.mal && r.mal.length ? `<h3 class="h3">Què ha anat malament</h3><ul class="hab-llista neg">${r.mal.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
          ${r.be && r.be.length ? `<h3 class="h3">Ben fet</h3><ul class="hab-llista pos">${r.be.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
          ${r.consell ? `<p class="small muted">💡 ${esc(r.consell)}</p>` : ''}
          <div class="row">${botons.map((b, i) => `<button class="btn ${i === 0 ? 'prim' : ''}" data-rb="${i}">${esc(b[0])}</button>`).join('')}</div></div>`;
        el.appendChild(m);
        m.querySelectorAll('[data-rb]').forEach(b => b.onclick = () => { m.remove(); botons[+b.dataset.rb][1](); });
        const f = m.querySelector('[data-rb="0"]'); f && f.focus();
      }
    };
    el.querySelector('#hSurt').onclick = () => { s.tanca(); o.onSurt && o.onSurt(); };
    el.querySelector('#hReinicia').onclick = () => { o.onReinicia && o.onReinicia(); };
    const fet = el.querySelector('#hFet'); if (fet) fet.onclick = () => { o.onFet && o.onFet(); };
    el.querySelector('#hAjuda').onclick = () => s.avis(o.controls || '', 'info', 7000);
    const PAS = 1000 / 60;
    function bucle(t) {
      if (!viu) return;
      raf = requestAnimationFrame(bucle);
      acc += Math.min(100, t - t0); t0 = t;
      while (acc >= PAS) { acc -= PAS; if (!pausa) { s.temps += PAS / 1000; o.pas && o.pas(PAS / 1000); } }
      o.dibuixa && o.dibuixa(ctx);
    }
    s.arrenca = () => { t0 = performance.now(); raf = requestAnimationFrame(bucle); if (!(window.matchMedia && matchMedia('(pointer: coarse)').matches)) setTimeout(() => s.avis(o.controls || '', 'info', 6000), 300); };
    return s;
  };

  /* ================= Dibuix comú ================= */
  PH.rrect = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  PH.fosc = (hex, f) => { const n = parseInt(hex.slice(1), 16); const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255; return `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`; };
  // Dibuixa un bult (centrat a l'origen, w × h) segons l'envàs
  PH.dibuixaBult = function (c, pr, w, h, estat) {
    const col = estat === 'trencat' ? '#7a7a7a' : pr.color, vora = PH.fosc(pr.color.length === 7 ? pr.color : '#888888', 0.6);
    c.lineWidth = 1.5; c.strokeStyle = vora;
    if (pr.envas === 'ampolla' && w < h * 0.5) { // ampolla sola
      c.fillStyle = col; c.beginPath();
      c.moveTo(-w / 2, h / 2); c.lineTo(-w / 2, -h * 0.12); c.quadraticCurveTo(-w / 2, -h * 0.28, -w * 0.2, -h * 0.32); c.lineTo(-w * 0.2, -h / 2); c.lineTo(w * 0.2, -h / 2); c.lineTo(w * 0.2, -h * 0.32); c.quadraticCurveTo(w / 2, -h * 0.28, w / 2, -h * 0.12); c.lineTo(w / 2, h / 2); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(-w * 0.3, -h * 0.1, w * 0.18, h * 0.5);
      c.fillStyle = '#f3e7c9'; c.fillRect(-w / 2 + 1, h * 0.02, w - 2, h * 0.22);
    } else if (pr.envas === 'ous' && h < w * 0.5) { // capsa d'ous
      c.fillStyle = '#d9c7a0'; PH.rrect(c, -w / 2, -h / 2, w, h, 3); c.fill(); c.stroke();
      c.fillStyle = estat === 'trencat' ? '#f2c230' : '#fbf3e4';
      for (let i = 0; i < 6; i++) { c.beginPath(); c.ellipse(-w / 2 + w / 12 + i * w / 6, -h * 0.15, w / 16, h * 0.42, 0, Math.PI, 0); c.fill(); }
    } else if (pr.envas === 'llauna' && w < 30) {
      c.fillStyle = col; PH.rrect(c, -w / 2, -h / 2, w, h, 2); c.fill(); c.stroke(); c.fillStyle = '#ddd'; c.fillRect(-w / 2, -h / 2, w, 2); c.fillRect(-w / 2, h / 2 - 2, w, 2);
    } else if (pr.envas === 'sac') {
      c.fillStyle = col; c.beginPath(); c.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2); c.fill(); c.stroke();
    } else { // caixa de cartró amb el color del producte
      c.fillStyle = estat === 'trencat' ? '#9a8a7a' : '#c98b4a'; PH.rrect(c, -w / 2, -h / 2, w, h, 2); c.fill(); c.stroke();
      c.fillStyle = col; c.fillRect(-w * 0.3, -h * 0.25, w * 0.6, h * 0.5);
      c.strokeStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.moveTo(-w / 2, -h * 0.35); c.lineTo(w / 2, -h * 0.35); c.stroke();
    }
    if (pr.fragil && estat !== 'trencat' && w >= 18 && h >= 10) { c.fillStyle = '#d33'; c.font = 'bold 9px sans-serif'; c.textAlign = 'center'; c.fillText(pr.envas === 'ous' && h < 20 ? '' : '🍷', 0, -h / 2 + 10); }
    if (estat === 'trencat') { c.strokeStyle = '#b00'; c.lineWidth = 2; c.beginPath(); c.moveTo(-w * 0.3, -h * 0.3); c.lineTo(w * 0.3, h * 0.3); c.moveTo(w * 0.3, -h * 0.3); c.lineTo(-w * 0.3, h * 0.3); c.stroke(); }
    else if (estat === 'colpejat') { c.strokeStyle = 'rgba(160,40,20,.7)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-w * 0.2, -h * 0.4); c.lineTo(-w * 0.05, -h * 0.1); c.lineTo(-w * 0.18, h * 0.15); c.stroke(); }
  };

  /* ================= Manipulació manual (vista lateral, dues mans) ================= */
  // 1 px = 0,5 cm. Gravetat real. Força de cada mà limitada: el que pesa necessita les dues mans.
  const ESC = 2;                      // px per cm
  const MA_KG = 13.5;                 // kg que pot sostenir una mà
  const PAS2 = (1000 / 60) * (1000 / 60);
  const GS = 0.00196;                 // escala de gravetat perquè 1 px = 0,5 cm caigui a 9,8 m/s²
  const vMS = (vpx) => vpx * 60 / 100 / ESC;   // px/pas → m/s

  PH.manual = function (cfg, onFi) {
    const M = window.Matter, B = M.Bodies, Bo = M.Body;
    let eng, objs, estatics, mans, punter, angle, t0, cops, events, acabat;
    const s = PH.obre({
      titol: cfg.titol, consigna: cfg.consigna, W: 1000, H: 560, rellotge: cfg.rellotge,
      controls: '<b>Ratolí</b>: mou les mans · <b>botó esquerre</b> (o Z): mà esquerra · <b>botó dret</b> (o X): mà dreta · <b>Espai</b>: les dues mans · <b>roda</b> o <b>Q/E</b>: gira el canell. Els objectes de més de 8 kg necessiten les dues mans; més de 25 kg, un mitjà mecànic.',
      tactil: `<span class="small muted">Arrossega per moure les mans</span><button class="btn small" data-k="z">✋ Esquerra</button><button class="btn small" data-k="x">Dreta ✋</button><button class="btn small" data-k=" ">🙌 Les dues</button><button class="btn small" data-k="q">↺</button><button class="btn small" data-k="e">↻</button>`,
      onReinicia: () => munta(), onFet: () => avalua(true), onSurt: () => onFi && onFi(null, s.temps),
      pas, dibuixa
    });
    // Ratolí
    s.cv.addEventListener('contextmenu', e => e.preventDefault());
    s.cv.addEventListener('pointermove', e => { punter = s.mon(e); });
    s.cv.addEventListener('pointerdown', e => {
      punter = s.mon(e); if (e.pointerType === 'touch') return;
      s.cv.setPointerCapture(e.pointerId);
      if (e.button === 0) agafa('L'); else if (e.button === 2) agafa('R');
    });
    s.cv.addEventListener('pointerup', e => { if (e.pointerType === 'touch') return; if (e.button === 0) deixa('L'); else if (e.button === 2) deixa('R'); });
    s.cv.addEventListener('wheel', e => { e.preventDefault(); angle += Math.sign(e.deltaY) * 0.12; }, { passive: false });
    s.onTecla = (t) => {
      if (t === 'z') mans.L.agafat ? deixa('L') : agafa('L');
      if (t === 'x') mans.R.agafat ? deixa('R') : agafa('R');
      if (t === ' ') { if (mans.L.agafat || mans.R.agafat) { deixa('L'); deixa('R'); } else { agafa('L'); agafa('R'); } }
    };

    function munta() {
      if (eng) { M.World.clear(eng.world); M.Engine.clear(eng); }
      eng = M.Engine.create({ positionIterations: 10, velocityIterations: 8 });
      eng.gravity.y = 1; eng.gravity.scale = GS;
      objs = []; estatics = []; cops = 0; events = []; acabat = false; t0 = s.temps; angle = 0;
      punter = { x: 500, y: 300 };
      mans = { L: { x: 470, y: 320, agafat: null }, R: { x: 530, y: 320, agafat: null } };
      // Estàtics: terra, taula i caixes/prestatges de l'exercici
      const est = (x, y, w, h, tipus, nom) => { const b = B.rectangle(x + w / 2, y + h / 2, w, h, { isStatic: true, friction: 0.8, label: tipus }); b.tipus = tipus; b.nom = nom; estatics.push(b); return b; };
      est(0, 540, 1000, 40, 'terra'); est(-40, 0, 40, 560, 'paret'); est(1000, 0, 40, 560, 'paret');
      (cfg.estatics || []).forEach(r => est(r.x, r.y, r.w, r.h, r.tipus || 'taula', r.nom));
      // Objectes
      cfg.objectes.forEach((o, i) => {
        const pr = PH.prop(o.id), w = pr.mida[0] * ESC, h = pr.mida[1] * ESC;
        const b = B.rectangle(o.x, o.y, w, h, { friction: 0.7, frictionStatic: 0.9, restitution: 0.05, chamfer: { radius: Math.min(4, w / 4) }, label: 'obj' + i });
        Bo.setMass(b, pr.pes); Bo.setAngle(b, o.angle || 0);
        b.pr = pr; b.w = w; b.h = h; b.estat = 'be'; b.desti = o.desti; b.carrega = 0; b.tPressio = 0; b.tInclina = 0; b.nom = pr.nom; b.mogut = false; b.vAnt = { x: 0, y: 0 };
        objs.push(b);
      });
      M.Composite.add(eng.world, estatics.concat(objs));
      M.Events.on(eng, 'collisionStart', xocs);
      // Deixa reposar la pila abans de començar
      for (let i = 0; i < 40; i++) M.Engine.update(eng, 1000 / 60);
      objs.forEach(b => { b.vAnt = { x: 0, y: 0 }; });
    }
    function dany(b, estat, motiu) {
      if (b.estat === 'trencat' || (b.estat === 'colpejat' && estat === 'colpejat')) return;
      b.estat = estat; events.push({ tipus: estat, nom: b.nom, motiu });
      s.avis((estat === 'trencat' ? '💥 ' : '⚠️ ') + esc(b.nom) + ': ' + esc(motiu), 'neg');
      if (estat === 'trencat' && b.pr.envas === 'ampolla') { // vidres i líquid
        const n = 5; for (let i = 0; i < n; i++) { const v = B.polygon(b.position.x + (i - 2) * 4, b.position.y, 3, 4, { friction: 0.9, label: 'vidre' }); Bo.setMass(v, 0.05); v.vidre = true; v.color = b.pr.color; M.Composite.add(eng.world, v); }
        b.toll = { x: b.position.x, y: b.position.y }; M.Composite.remove(eng.world, b); b.fora = true;
        ['L', 'R'].forEach(m => { if (mans[m].agafat && mans[m].agafat.b === b) mans[m].agafat = null; });
      }
    }
    // Cops: velocitat relativa normal abans del xoc
    function xocs(ev) {
      ev.pairs.forEach(p => {
        const a = p.bodyA.parent, b = p.bodyB.parent, n = p.collision.normal;
        if (a.vidre || b.vidre) return;
        const va = a.isStatic ? { x: 0, y: 0 } : a.vAnt, vb = b.isStatic ? { x: 0, y: 0 } : b.vAnt;
        const vrel = Math.abs((va.x - vb.x) * n.x + (va.y - vb.y) * n.y), ms = vMS(vrel);
        if (ms < 0.35) return;
        [[a, b], [b, a]].forEach(([x, y]) => {
          if (!x.pr || x.fora) return;
          const f = y.isStatic ? 1 : Math.min(1.6, 2 * y.mass / (x.mass + y.mass));
          const ef = ms * f;
          if (ef > x.pr.impacte) dany(x, x.pr.fragil ? 'trencat' : 'colpejat', `cop de ${ef.toFixed(1)} m/s contra ${y.pr ? y.nom.toLowerCase() : y.tipus === 'terra' ? 'el terra' : 'la ' + (y.tipus || 'taula')} (aguanta ${x.pr.impacte} m/s)`);
          else if (ef > x.pr.impacte * 0.45 && ef > 0.5) { cops++; if (x.pr.fragil) s.avis('Compte! Cop a ' + esc(x.nom.toLowerCase()), 'warn', 1400); }
        });
      });
    }
    function cosA(pt) {
      const cands = M.Query.point(objs.filter(b => !b.fora), pt);
      if (cands.length) return cands[0].parent;
      // marge de 10 px
      let best = null, bd = 12;
      objs.filter(b => !b.fora).forEach(b => { const d = Math.hypot(b.position.x - pt.x, b.position.y - pt.y) - Math.max(b.w, b.h) / 2; if (d < bd) { bd = d; best = b; } });
      return best && M.Query.point([best], { x: pt.x + Math.sign(best.position.x - pt.x) * Math.min(bd + 2, 12), y: pt.y + Math.sign(best.position.y - pt.y) * Math.min(bd + 2, 12) }).length ? best : null;
    }
    function agafa(m) {
      if (acabat) return;
      const h = mans[m], b = cosA(h); if (!b) return;
      if (b.pr.mans === 0) return s.avis(`${esc(b.nom)}: ${b.pr.pes} kg. Més de ${D.PES_MANUAL} kg no es manipula a mà: cal un mitjà mecànic.`, 'neg', 3500);
      const dx = h.x - b.position.x, dy = h.y - b.position.y, c = Math.cos(-b.angle), sn = Math.sin(-b.angle);
      h.agafat = { b, lx: dx * c - dy * sn, ly: dx * sn + dy * c, da: b.angle - angle, tTens: 0 };
      b.mogut = true; b.frictionAir = 0.04;
      const altra = mans[m === 'L' ? 'R' : 'L'];
      if (b.pr.mans === 2 && !(altra.agafat && altra.agafat.b === b)) s.avis(`${esc(b.nom)} pesa ${b.pr.pes} kg: agafa-ho amb les dues mans.`, 'warn', 2200);
    }
    function deixa(m) { const h = mans[m]; if (!h.agafat) return; const b = h.agafat.b; h.agafat = null; if (!['L', 'R'].some(x => mans[x].agafat && mans[x].agafat.b === b)) b.frictionAir = 0.01; }

    function pas() {
      if (acabat) return;
      const T = s.tecles;
      if (T.has('q')) angle -= 0.035; if (T.has('e')) angle += 0.035;
      // Les mans segueixen el punter amb velocitat màxima (més lentes amb pes)
      const ca = Math.cos(angle), sa = Math.sin(angle);
      let esp = 30;
      const bAmbDues = mans.L.agafat && mans.R.agafat && mans.L.agafat.b === mans.R.agafat.b ? mans.L.agafat.b : null;
      if (bAmbDues) { const p = (m) => { const a = mans[m].agafat, c = Math.cos(a.b.angle), sn = Math.sin(a.b.angle); return { x: a.lx * c - a.ly * sn, y: a.lx * sn + a.ly * c }; }; const pl = p('L'), pr = p('R'); esp = Math.max(14, Math.hypot(pr.x - pl.x, pr.y - pl.y)); }
      const pes = ['L', 'R'].reduce((a, m) => a + (mans[m].agafat ? mans[m].agafat.b.mass / (bAmbDues ? 2 : 1) : 0), 0);
      const vmax = 8.5 / (1 + pes / 12);
      ['L', 'R'].forEach((m, i) => {
        const h = mans[m], sg = i ? 1 : -1;
        let tx = punter.x + sg * ca * esp / 2, ty = punter.y + sg * sa * esp / 2;
        // abast dels braços (espatlles a baix al mig)
        const sx = 500 + sg * 40, sy = 600, dx0 = tx - sx, dy0 = ty - sy, dl = Math.hypot(dx0, dy0), AB = 520;
        if (dl > AB) { tx = sx + dx0 / dl * AB; ty = sy + dy0 / dl * AB; }
        const dx = tx - h.x, dy = ty - h.y, d = Math.hypot(dx, dy), st = Math.min(d * 0.2 + Math.min(d, 0.5), vmax);
        h.vx = d ? dx / d * st : 0; h.vy = d ? dy / d * st : 0; h.x += h.vx; h.y += h.vy;
      });
      // Força de cada mà sobre el que agafa: PD limitat per la força de la mà
      ['L', 'R'].forEach(m => {
        const h = mans[m], a = h.agafat; if (!a) return;
        const b = a.b; if (b.fora) { h.agafat = null; return; }
        const c = Math.cos(b.angle), sn = Math.sin(b.angle), rx = a.lx * c - a.ly * sn, ry = a.lx * sn + a.ly * c;
        const px = b.position.x + rx, py = b.position.y + ry;
        const vpx = b.velocity.x - b.angularVelocity * ry, vpy = b.velocity.y + b.angularVelocity * rx;
        const ex = h.x - px, ey = h.y - py, dist = Math.hypot(ex, ey);
        const nM = bAmbDues === b ? 2 : 1, mm = b.mass / nM;
        const kp = 0.14 / (1 + b.mass / 20), kd = 0.55;
        let fx = mm * (kp * ex + kd * (h.vx - vpx)) / PAS2, fy = mm * (kp * ey + kd * (h.vy - vpy)) / PAS2;
        fy -= mm * GS * 0.85;   // compensa gran part del pes (els braços aguanten)
        const fmax = MA_KG * GS * 1.0, fm = Math.hypot(fx, fy);
        if (fm > fmax) { fx *= fmax / fm; fy *= fmax / fm; }
        Bo.applyForce(b, { x: px, y: py }, { x: fx, y: fy });
        // Canell: orienta l'objecte cap a l'angle de les mans
        let err = (angle + a.da) - b.angle; err = Math.atan2(Math.sin(err), Math.cos(err));
        const I = b.inertia, tq = I * (0.08 * err - 0.4 * b.angularVelocity) / PAS2 / nM;
        const tmax = MA_KG * GS * 30 * (nM === 2 ? 1.6 : 1) / (1 + b.mass / 6);
        b.torque += Math.max(-tmax, Math.min(tmax, tq));
        // Se t'escapa si l'estires massa
        if (dist > 42) { a.tTens++; if (a.tTens > 12) { s.avis(`Se t'ha escapat ${esc(b.nom.toLowerCase())}: ${b.pr.mans === 2 && nM === 1 ? 'pesa massa per a una mà' : 'l\'has estirat massa'}.`, 'warn'); deixa(m); } } else a.tTens = 0;
      });
      objs.forEach(b => { if (!b.fora) b.vAnt = { x: b.velocity.x, y: b.velocity.y }; });
      M.Engine.update(eng, 1000 / 60);
      // Pressió (pes a sobre) i inclinació
      const sobre = new Map();
      eng.pairs.list.forEach(p => {
        if (!p.isActive) return;
        const a = p.bodyA.parent, b = p.bodyB.parent;
        [[a, b], [b, a]].forEach(([x, y]) => { if (x.pr && y.pr && !y.fora && y.position.y < x.position.y - x.h * 0.3) { (sobre.get(x) || sobre.set(x, []).get(x)).push(y); } });
      });
      const carrega = (b, prof) => prof > 4 ? 0 : (sobre.get(b) || []).reduce((acc, y) => acc + y.mass + carrega(y, prof + 1), 0);
      objs.forEach(b => {
        if (b.fora) return;
        b.carrega = carrega(b, 0);
        const agafatPer = ['L', 'R'].some(m => mans[m].agafat && mans[m].agafat.b === b);
        if (b.carrega > b.pr.pressio && b.estat !== 'trencat') { b.tPressio++; if (b.tPressio > 30) dany(b, b.pr.fragil ? 'trencat' : 'colpejat', `aixafat: té ${b.carrega.toFixed(1)} kg a sobre i n'aguanta ${b.pr.pressio}`); } else b.tPressio = 0;
        if (b.pr.inclinacio && b.mogut && b.estat !== 'trencat') {
          const deg = Math.abs(Math.atan2(Math.sin(b.angle), Math.cos(b.angle))) * 180 / Math.PI;
          if (deg > b.pr.inclinacio) { b.tInclina++; if (b.tInclina > (agafatPer ? 25 : 10)) dany(b, 'trencat', `l'has inclinat ${Math.round(deg)}° (màxim ${b.pr.inclinacio}°): s'ha bolcat el contingut`); } else b.tInclina = 0;
        }
        if (b.position.y > 600 || b.position.x < -50 || b.position.x > 1050) { b.fora = true; M.Composite.remove(eng.world, b); events.push({ tipus: 'perdut', nom: b.nom }); }
      });
      const ag = ['L', 'R'].map(m => mans[m].agafat ? mans[m].agafat.b.nom : '—');
      s.hud(`<span class="chip">⏱ ${Math.floor(s.temps - t0)} s</span><span class="chip">✋ ${esc(ag[0])} · ${esc(ag[1])} ✋</span><span class="chip ${cops ? 'warn' : ''}">Cops ${cops}</span><span class="chip ${events.some(e => e.tipus === 'trencat' || e.tipus === 'colpejat') ? 'neg' : ''}">Malmesos ${objs.filter(b => b.estat !== 'be').length}</span>`);
      if (cfg.autoFi !== false && s.temps - t0 > 2 && compleix().tot && objs.every(b => b.fora || b.speed < 0.15) && !mans.L.agafat && !mans.R.agafat) avalua(false);
    }
    const dins = (b, z) => b.position.x > z.x && b.position.x < z.x + z.w && b.position.y > z.y && b.position.y < z.y + z.h;
    function compleix() {
      const zones = cfg.zones || {}, res = [];
      objs.forEach(b => {
        if (!b.desti) return;
        const z = zones[b.desti];
        const ok = !b.fora && b.estat !== 'trencat' && dins(b, z);
        const deg = Math.abs(Math.atan2(Math.sin(b.angle), Math.cos(b.angle))) * 180 / Math.PI;
        const dret = !b.pr.dreta || deg < 15;
        res.push({ b, ok, dret, z });
      });
      return { res, tot: res.every(r => r.ok && r.dret) };
    }
    function avalua(manual) {
      if (acabat) return; acabat = true;
      const c = compleix(), mal = [], be = [];
      let nota = 100;
      const temps = Math.round(s.temps - t0);
      c.res.forEach(r => {
        if (r.b.fora && r.b.estat !== 'trencat') { nota -= 30; mal.push(`${r.b.nom}: ha caigut i s'ha perdut.`); }
        else if (r.b.estat === 'trencat') { nota -= 30; }
        else if (!r.ok) { nota -= 20; mal.push(`${r.b.nom}: no és ${r.z.nom}.`); }
        else if (!r.dret) { nota -= 12; mal.push(`${r.b.nom}: l'has deixat ajagut o de cap per avall. Ha d'anar dret («aquest costat amunt»).`); }
        else if (r.b.estat === 'colpejat') { nota -= 12; }
        else be.push(`${r.b.nom}: ${r.z.nom}, ${r.b.pr.dreta ? 'dret i ' : ''}sense danys.`);
        if (r.ok && r.b.pr.pressio < 5 && r.b.carrega > 0.2) { nota -= 10; mal.push(`${r.b.nom}: té coses a sobre i no aguanta pes. Els productes delicats, a dalt de tot.`); }
      });
      objs.filter(b => !b.desti && b.estat !== 'be').forEach(b => { nota -= 15; });
      events.filter(e => e.tipus === 'trencat' || e.tipus === 'colpejat').forEach(e => mal.push(`${e.nom}: ${e.tipus === 'trencat' ? 'trencat' : 'colpejat'} (${e.motiu}).`));
      nota -= Math.min(20, cops * 3);
      if (cops) mal.push(`${cops} cops lleus durant la manipulació. Moviments més suaus, sobretot amb el que és fràgil.`); else if (!objs.some(b => b.estat !== 'be')) be.push('Cap cop: manipulació molt acurada.');
      nota = Math.max(0, Math.min(100, Math.round(nota)));
      const r = { titol: cfg.titol, nota, temps, tempsTotal: s.temps, cops, malmesos: objs.filter(b => b.estat !== 'be').map(b => ({ nom: b.nom, prod: b.pr.id, estat: b.estat })), perduts: objs.filter(b => b.fora && b.estat !== 'trencat').length,
        kpi: [['Temps', temps + ' s'], ['Cops lleus', cops, cops ? 'warn' : 'pos'], ['Productes malmesos', objs.filter(b => b.estat !== 'be').length, objs.some(b => b.estat !== 'be') ? 'neg' : 'pos'], ['Col·locació', c.res.filter(x => x.ok && x.dret).length + ' / ' + c.res.length]],
        mal, be, consell: cfg.consell };
      s.resultat(r, [[cfg.botoSeguent || 'Continua', () => { s.tanca(); onFi && onFi(r); }], ['Torna-ho a provar', () => { s.pausa(false); munta(); }]]);
    }
    function dibuixa(c) {
      c.fillStyle = '#e9edf2'; c.fillRect(0, 0, 1000, 560);
      // paret de fons
      c.fillStyle = '#dde3ea'; c.fillRect(0, 0, 1000, 300); c.strokeStyle = '#cfd6df'; c.lineWidth = 1; for (let x = 0; x < 1000; x += 80) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 300); c.stroke(); }
      // zones objectiu
      Object.values(cfg.zones || {}).forEach(z => { c.fillStyle = 'rgba(54,179,126,.12)'; c.strokeStyle = 'rgba(54,179,126,.7)'; c.setLineDash([6, 5]); c.strokeRect(z.x, z.y, z.w, z.h); c.fillRect(z.x, z.y, z.w, z.h); c.setLineDash([]); c.fillStyle = '#1e7a52'; c.font = '600 13px Inter, sans-serif'; c.textAlign = 'left'; c.fillText(z.etiqueta || z.nom, z.x + 4, z.y + 15); });
      estatics.forEach(b => {
        if (b.tipus === 'paret') return;
        const v = b.vertices; c.beginPath(); c.moveTo(v[0].x, v[0].y); v.slice(1).forEach(p => c.lineTo(p.x, p.y)); c.closePath();
        c.fillStyle = b.tipus === 'terra' ? '#9aa5b1' : b.tipus === 'caixa' ? '#b07a3f' : b.tipus === 'prestatge' ? '#3a6ea5' : '#8d6e4f'; c.fill();
      });
      // potes de la taula
      (cfg.estatics || []).filter(r => r.tipus === 'taula').forEach(r => { c.fillStyle = '#6d5440'; c.fillRect(r.x + 10, r.y + r.h, 12, 540 - r.y - r.h); c.fillRect(r.x + r.w - 22, r.y + r.h, 12, 540 - r.y - r.h); });
      objs.forEach(b => {
        if (b.toll) { c.fillStyle = 'rgba(122,31,61,.35)'; c.beginPath(); c.ellipse(b.toll.x, Math.min(538, b.toll.y + 20), 40, 5, 0, 0, Math.PI * 2); c.fill(); }
        if (b.fora) return;
        c.save(); c.translate(b.position.x, b.position.y); c.rotate(b.angle); PH.dibuixaBult(c, b.pr, b.w, b.h, b.estat); c.restore();
        if (b.desti && cfg.zones && cfg.zones[b.desti] && !dins(b, cfg.zones[b.desti]) && b.estat !== 'trencat') { c.save(); c.translate(b.position.x, b.position.y); c.rotate(b.angle); c.strokeStyle = '#1e9e66'; c.lineWidth = 2.5; c.setLineDash([5, 4]); c.strokeRect(-b.w / 2 - 4, -b.h / 2 - 4, b.w + 8, b.h + 8); c.setLineDash([]); c.restore(); c.fillStyle = '#1e9e66'; c.font = 'bold 14px sans-serif'; c.textAlign = 'center'; c.fillText('⬆', b.position.x, b.position.y - b.h / 2 - 10); }
        if (b.carrega > b.pr.pressio * 0.6 && b.estat !== 'trencat') { c.fillStyle = '#d33'; c.font = 'bold 12px sans-serif'; c.textAlign = 'center'; c.fillText('⬇ ' + b.carrega.toFixed(1) + ' kg', b.position.x, b.position.y - b.h / 2 - 4); }
      });
      M.Composite.allBodies(eng.world).filter(b => b.vidre).forEach(v => { c.fillStyle = 'rgba(80,140,100,.8)'; const p = v.vertices; c.beginPath(); c.moveTo(p[0].x, p[0].y); p.slice(1).forEach(q => c.lineTo(q.x, q.y)); c.fill(); });
      // braços i mans
      ['L', 'R'].forEach((m, i) => {
        const h = mans[m], sg = i ? 1 : -1;
        c.strokeStyle = cfg.avatar ? cfg.avatar.samarreta : (i ? '#e07b39' : '#3d7fd9'); c.lineWidth = 14; c.lineCap = 'round'; c.globalAlpha = cfg.avatar ? 0.6 : 0.35;
        c.beginPath(); c.moveTo(500 + sg * 40, 600); c.quadraticCurveTo(500 + sg * 120, (600 + h.y) / 2 + 40, h.x, h.y + 8); c.stroke(); c.globalAlpha = 1;
        c.fillStyle = h.agafat ? (i ? '#e07b39' : '#3d7fd9') : '#fff'; c.strokeStyle = i ? '#e07b39' : '#3d7fd9'; c.lineWidth = 3;
        c.beginPath(); c.arc(h.x, h.y, h.agafat ? 8 : 10, 0, Math.PI * 2); c.fill(); c.stroke();
        c.fillStyle = h.agafat ? '#fff' : (i ? '#e07b39' : '#3d7fd9'); c.font = 'bold 10px sans-serif'; c.textAlign = 'center'; c.fillText(i ? 'D' : 'E', h.x, h.y + 3.5);
      });
      // indicador de l'angle del canell
      c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 2; c.beginPath(); c.moveTo(punter.x - Math.cos(angle) * 22, punter.y - Math.sin(angle) * 22); c.lineTo(punter.x + Math.cos(angle) * 22, punter.y + Math.sin(angle) * 22); c.stroke();
    }
    munta(); s.arrenca();
    s.dbg = () => ({ objs, mans, cops, events, acabat, angle });
    PH._s = s;
    return s;
  };
})();
