/* Palet · el magatzem en temps real: plànol, treballador, transpalet o toro, camions i rellotge del torn.
   L'escena guarda el que fa el jugador i, en acabar el torn, ho torna al motor (PE.puntua) amb onFi(res).
   Les finestres (inspecció, prestatgeria, lots) les obre la interfície amb les funcions de «op». */
(function (root) {
  const D = root.PD, E = root.PE;
  const PS = {};
  const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- Plànol: nodes i camins ---------- */
  const N = {}, VEI = {};
  const modX = (m) => D.PASSADISSOS[0].x0 + D.MODUL_W * (m - 1) + D.MODUL_W / 2;
  const front = { A: 225, B: 375, C: 525 };
  (function () {
    const add = (k, x, y) => { N[k] = [x, y]; VEI[k] = []; };
    const uneix = (a, b) => { VEI[a].push(b); VEI[b].push(a); };
    add('moll1', 70, 150); add('rec', 160, 160); add('park', 175, 330); add('exp', 190, 560); add('moll2', 70, 505); add('moll3', 70, 605);
    [['L0', 160], ['L1', 225], ['L2', 375], ['L3', 525], ['L4', 650]].forEach(([k, y]) => add(k, 290, y));
    [['R1', 225], ['R2', 375], ['R3', 525], ['R4', 650]].forEach(([k, y]) => add(k, 905, y));
    add('Fd', 935, 225); add('fA', 1005, 225); add('Pd', 935, 525); add('pA', 1005, 545); add('Sx', 1060, 375);
    ['A', 'B', 'C'].forEach(p => { for (let m = 1; m <= 6; m++) add(p.toLowerCase() + m, modX(m), front[p]); });
    uneix('moll1', 'rec'); uneix('rec', 'L0'); uneix('L0', 'L1'); uneix('L1', 'L2'); uneix('L2', 'L3'); uneix('L3', 'L4'); uneix('L4', 'R4');
    uneix('R1', 'R2'); uneix('R2', 'R3'); uneix('R3', 'R4'); uneix('park', 'L2'); uneix('exp', 'L3'); uneix('exp', 'moll2'); uneix('exp', 'moll3');
    uneix('R1', 'Fd'); uneix('Fd', 'fA'); uneix('R3', 'Pd'); uneix('Pd', 'pA'); uneix('R2', 'Sx');
    [['A', 'L1', 'R1'], ['B', 'L2', 'R2'], ['C', 'L3', 'R3']].forEach(([p, l, r]) => { const k = p.toLowerCase(); uneix(l, k + 1); for (let m = 1; m < 6; m++) uneix(k + m, k + (m + 1)); uneix(k + 6, r); });
  })();
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  function cami(de, a) {
    const d = {}, prev = {}, q = new Set(Object.keys(N)); Object.keys(N).forEach(k => { d[k] = Infinity; }); d[de] = 0;
    while (q.size) { let u = null; q.forEach(k => { if (u == null || d[k] < d[u]) u = k; }); q.delete(u); if (u === a || d[u] === Infinity) break; VEI[u].forEach(v => { const nd = d[u] + dist(N[u], N[v]); if (nd < d[v]) { d[v] = nd; prev[v] = u; } }); }
    const out = []; let k = a; while (k) { out.unshift(k); k = prev[k]; } return out;
  }
  const nodeModul = (pas, mod) => pas === 'F' ? 'fA' : pas === 'P' ? 'pA' : pas.toLowerCase() + mod;
  PS.nodeModul = nodeModul;

  /* ---------- Dibuix ---------- */
  // Personatge: pell, cabells (color i pentinat), samarreta i armilla d'alta visibilitat
  function persona(av, mida) {
    av = Object.assign({}, D.AVATAR_DEFECTE, av || {});
    const c = av.cabell, m = mida || 1;
    const darrere = av.pentinat === 'llarg' ? `<path d="M11.5 13a8.5 8.5 0 0 1 17 0v11h-3.5v-6h-10v6h-3.5z" fill="${c}"/>` : av.pentinat === 'cua' ? `<path d="M27 12c5 2 5 10 2 13-1-4-2-7-4-9z" fill="${c}"/>` : '';
    const dalt = { curt: `<path d="M12 12a8 8 0 0 1 16 0c-3-2-5-2.5-8-2.5S15 10 12 12z" fill="${c}"/>`, llarg: `<path d="M12 12a8 8 0 0 1 16 0c-3-2-5-2.5-8-2.5S15 10 12 12z" fill="${c}"/>`, cua: `<path d="M12 12a8 8 0 0 1 16 0c-3-2-5-2.5-8-2.5S15 10 12 12z" fill="${c}"/>`,
      monyo: `<circle cx="20" cy="4.5" r="3.6" fill="${c}"/><path d="M12 12a8 8 0 0 1 16 0c-3-2-5-2.5-8-2.5S15 10 12 12z" fill="${c}"/>`, rapat: `<path d="M12.5 11a7.6 7.6 0 0 1 15 0c-3-1.4-5-1.8-7.5-1.8s-4.5.4-7.5 1.8z" fill="${c}" opacity=".75"/>` }[av.pentinat] || '';
    const armilla = av.armilla ? `<path d="M11 25h5.5v15H11zM23.5 25H29v15h-5.5z" fill="${av.armilla}"/><rect x="11" y="33" width="18" height="2.4" fill="#f1f5f9" opacity=".95"/>` : '';
    return `<svg viewBox="0 0 40 52" width="${34 * m}" height="${44 * m}" aria-hidden="true"><ellipse cx="20" cy="49" rx="11" ry="3" fill="rgba(0,0,0,.18)"/>${darrere}
      <rect x="11" y="22" width="18" height="20" rx="6" fill="${av.samarreta}"/>${armilla}
      <rect x="13" y="40" width="5" height="9" rx="2" fill="#334155"/><rect x="22" y="40" width="5" height="9" rx="2" fill="#334155"/>
      <circle cx="20" cy="14" r="8" fill="${av.pell}"/>${dalt}<circle cx="17" cy="15" r=".9" fill="#222"/><circle cx="23" cy="15" r=".9" fill="#222"/></svg>`;
  }
  PS.persona = persona;
  function vehicle(eq) {
    if (eq === 'toro') return `<svg class="veh" viewBox="0 0 60 40" width="60" height="40" aria-hidden="true"><rect x="16" y="6" width="30" height="28" rx="5" fill="#F5C542" stroke="#8a6d00"/><rect x="40" y="4" width="10" height="32" rx="3" fill="#555"/><rect x="2" y="9" width="16" height="4" fill="#777"/><rect x="2" y="27" width="16" height="4" fill="#777"/><circle cx="22" cy="36" r="4" fill="#222"/><circle cx="40" cy="36" r="4" fill="#222"/></svg>`;
    return `<svg class="veh" viewBox="0 0 60 40" width="60" height="40" aria-hidden="true"><rect x="2" y="9" width="34" height="5" rx="1" fill="#E05A47"/><rect x="2" y="26" width="34" height="5" rx="1" fill="#E05A47"/><rect x="34" y="8" width="8" height="24" rx="2" fill="#c0392b"/><path d="M42 20h12" stroke="#333" stroke-width="3"/><circle cx="56" cy="20" r="3" fill="#333"/></svg>`;
  }
  const caixa = (prod, mida) => { const p = D.productes[prod]; return `<span class="cx" style="--c:${p.color};width:${mida}px;height:${mida}px" title="${esc(p.nom)}">${p.fragil ? '<i class="ic-fragil">⚠</i>' : ''}${p.fred ? '<i class="ic-fred">❄</i>' : ''}${p.perill ? '<i class="ic-perill">◆</i>' : ''}</span>`; };
  PS.caixa = caixa;

  function plano(nivell, retol, boira) {
    const Z = D.ZONES;
    const TEMP = { refri: 'Cambra de refrigerats · 0-4 °C', conge: 'Cambra de congelats · −18 °C' };
    const racks = D.PASSADISSOS.map(p => {
      let h = p.temp ? `<div class="banda ${p.temp}" style="left:300px;top:${p.y - 45}px;width:590px;height:145px"><span>${TEMP[p.temp]}</span></div>` : '';
      for (let m = 1; m <= p.moduls; m++) {
        const tp = D.tipusDe(p.id, m); if (tp === 'cap') continue;
        const x = p.x0 + D.MODUL_W * (m - 1);
        h += `<button class="rack t-${tp}" data-pas="${p.id}" data-mod="${m}" style="left:${x + 3}px;top:${p.y - 26}px;width:${D.MODUL_W - 6}px" aria-label="Prestatgeria ${p.id}-${String(m).padStart(2, '0')} (${esc(D.ESTANTERIES[tp].nom)})"><span class="cod">${p.id}-${String(m).padStart(2, '0')}</span><span class="tp">${D.ESTANTERIES[tp].curt}</span><span class="omple" data-omple="${p.id}${m}"></span></button>`;
      }
      return h + (D.MAG.mode === 'cross' ? '' : `<span class="pas-lbl" style="left:${p.x0 - 26}px;top:${p.y - 12}px">${p.id}</span>`);
    }).join('') + (D.MAG.mode === 'cross' ? `<div class="zona z-cross" style="left:320px;top:120px;width:560px;height:420px"><span class="zona-lbl">Plataforma de classificació</span><p>Sense estoc: la mercaderia passa del moll 1 als molls 2 i 3 el mateix dia, classificada per destinació.</p><div class="carrils"><span>→ Moll 2</span><span>→ Moll 3</span></div></div>` : '');
    const zona = (z, cls, ext) => `<div class="zona ${cls}" style="left:${z.x}px;top:${z.y}px;width:${z.w}px;height:${z.h}px"><span class="zona-lbl">${esc(z.nom)}</span>${ext || ''}</div>`;
    const fred = `<button class="rack petit" data-pas="F" data-mod="1" style="left:15px;top:30px"><span class="cod">F-01</span><span class="omple" data-omple="F1"></span></button><button class="rack petit" data-pas="F" data-mod="2" style="left:80px;top:30px"><span class="cod">F-02</span><span class="omple" data-omple="F2"></span></button><span class="termo">❄ <b id="tempF">3 °C</b></span>`;
    const perill = `<button class="rack petit" data-pas="P" data-mod="1" style="left:15px;top:105px"><span class="cod">P-01</span><span class="omple" data-omple="P1"></span></button><button class="rack petit" data-pas="P" data-mod="2" style="left:80px;top:105px"><span class="cod">P-02</span><span class="omple" data-omple="P2"></span></button><span class="pictos">◆ ◆</span>`;
    return `<div class="mg" style="width:${D.W}px;height:${D.H}px">
      <div class="terra"></div>
      <div class="linia h" style="top:225px;left:290px;width:615px"></div><div class="linia h" style="top:375px;left:290px;width:615px"></div><div class="linia h" style="top:525px;left:290px;width:615px"></div>
      <div class="linia v" style="left:290px;top:160px;height:490px"></div><div class="linia v" style="left:905px;top:225px;height:425px"></div><div class="linia h" style="top:650px;left:290px;width:615px"></div>
      ${zona(Z.recepcio, 'z-rec', '<div class="moll" style="left:-6px;top:50px">MOLL 1</div><div class="mollz" id="mollRec"></div>')}
      ${zona(Object.assign({}, Z.expedicio, D.MAG.mode === 'ecom' ? { nom: 'Embalatge i expedició' } : {}), 'z-exp', '<div class="moll" style="left:-6px;top:30px">MOLL 2</div><div class="moll" style="left:-6px;top:130px">MOLL 3</div><button class="moll-btn" data-moll="2" style="top:28px">Deixar al moll 2</button><button class="moll-btn" data-moll="3" style="top:128px">Deixar al moll 3</button><div class="palets-moll" id="pm2" style="top:62px"></div><div class="palets-moll" id="pm3" style="top:162px"></div>')}
      ${D.MAG.zones.includes('fred') ? zona(Z.fred, 'z-fred', fred) : ''}${D.MAG.zones.includes('perill') ? zona(Z.perill, 'z-perill', perill) : ''}
      <div class="park" style="left:140px;top:300px">P</div>
      ${retol ? `<div class="retol-emp">🏭 ${esc(retol)}</div>` : ''}${boira ? '<div class="boira" aria-hidden="true"></div>' : ''}
      <div class="sortida" style="left:${Z.sortida.x - 14}px;top:${Z.sortida.y - 40}px" title="Sortida d'emergència">🚪<span>SORTIDA</span></div>
      <div class="extintor" style="left:1060px;top:420px" title="Extintor">🧯</div>
      ${racks}
      <div class="camions" id="camions"></div>
      <div class="ags" id="ags"></div>
      <div class="fx" id="fx"></div>
    </div>`;
  }

  /* ---------- El torn ---------- */
  PS.torn = function (el, s, op) {
    const t = s.dia, NIV = E.nivell(s), EQ = D.EQUIPS[NIV.equip];
    const r = E.rngDe(s.config.llavor, 'escena' + s.torn);
    el.innerHTML = `<div class="esc"><div class="esc-in">${plano(s.nivell, s.config.empresa ? s.config.empresa + (s.config.lloc && D.POBLES[s.config.lloc] ? ' · ' + D.POBLES[s.config.lloc].nom : '') : '', s.dia && s.dia.boira)}</div></div>`;
    const inEl = el.querySelector('.esc-in'), mg = el.querySelector('.mg'), ags = el.querySelector('#ags'), fx = el.querySelector('#fx');
    // Escalat a l'amplada disponible
    let escala = 1;
    function ajusta() { const w = el.clientWidth || D.W; escala = Math.max(0.62, Math.min(1, w / D.W)); inEl.style.transform = `scale(${escala})`; inEl.style.height = (D.H * escala) + 'px'; inEl.style.width = (D.W * escala) + 'px'; }
    ajusta(); let ultW = el.clientWidth; const ro = new ResizeObserver(() => { if (el.clientWidth !== ultW) { ultW = el.clientWidth; ajusta(); } }); ro.observe(el);

    // Estat de la simulació
    const res = { recepcio: {}, ubicacions: {}, picking: [], palets: [], carrega: {}, incidents: [], inventari: { recomptes: {}, comandes: {} }, cross: {}, fred: {}, habilitat: [], fi: D.TORN_FI };
    const stock = JSON.parse(JSON.stringify(s.stock));        // còpia de treball (el motor aplica els canvis definitius)
    // Recompte d'inventari: a les prestatgeries hi ha el que hi ha de debò (pot ser menys del que diu el sistema)
    if (t.inventari) t.inventari.recomptes.forEach(rc => { let falta = rc.teoric - rc.real; (stock[rc.slot] || []).slice().reverse().forEach(x => { const m = Math.min(falta, x.q); x.q -= m; falta -= m; }); });
    const carregues = [];                                       // càrregues del moll de recepció
    let minut = D.TORN_INICI, pausa = !!op.pausa, vel = 1, pressa = false, acabat = false;
    const SEG_TORN = D.TORN_SEGONS * ((D.DURADA_HAB || {})[s.config.habilitat] || 1);   // amb habilitat física el torn dura més
    const arribades = new Set();
    function arribaCamio(rc) {
      if (arribades.has(rc.id)) return; arribades.add(rc.id);
      rc.carregues.forEach(c => carregues.push({ c, rc, estat: 'moll', arribada: minut }));
      op.avis && op.avis(`🚚 Ha arribat el camió de ${rc.proveidor} al moll 1 (${rc.carregues.length} càrregues).`);
      pintaMoll(); pintaCamions(); op.canvi && op.canvi();
    }
    // Treballador
    const ag = document.createElement('div'); ag.className = 'treb'; ag.innerHTML = vehicle(NIV.equip) + `<span class="persona">${persona(s.config.avatar)}</span><span class="carrega"></span><span class="bomb" hidden></span>`; ags.appendChild(ag);
    const w = { x: N.park[0], y: N.park[1], node: 'park', path: [], porta: null, ocupat: null, pila: [], comanda: null, ona: [], piles: {}, dir: 1 };
    const ECOM = D.MAG.mode === 'ecom', CROSS = D.MAG.mode === 'cross';
    let obert = null;   // passadís mòbil obert
    // Cap (la Montse) que passa de tant en tant
    const cap = document.createElement('div'); cap.className = 'cap-ag'; cap.innerHTML = persona({ pell: '#f0c7a0', cabell: '#5a3825', pentinat: 'llarg', samarreta: '#9B7AE8', armilla: '' }) + '<span class="nom">Montse</span>'; cap.style.transform = `translate(${N.L2[0] - 17}px,${N.L2[1] - 60}px)`; ags.appendChild(cap);
    function posa() { ag.style.transform = `translate(${w.x - 30}px,${w.y - 34}px) scaleX(${w.dir})`; }
    posa();
    function bombolla(t, cls) { const b = ag.querySelector('.bomb'); b.hidden = false; b.className = 'bomb ' + (cls || ''); b.textContent = t; clearTimeout(b._t); b._t = setTimeout(() => { b.hidden = true; }, 2200); }
    function fxText(x, y, t, cls) { const d = document.createElement('div'); d.className = 'fxt ' + (cls || ''); d.style.left = x + 'px'; d.style.top = y + 'px'; d.textContent = t; fx.appendChild(d); setTimeout(() => d.remove(), 1600); }
    function pintaCarrega() { ag.querySelector('.carrega').innerHTML = w.porta ? caixa(w.porta.c.prod, 22) : w.pila.length ? `<span class="pila">${w.pila.slice(-4).map(p => caixa(p, 14)).join('')}</span><b class="n">${w.pila.length}</b>` : w.comanda ? '<span class="pal-buit"></span>' : ''; }

    function pintaMoll() {
      const m = mg.querySelector('#mollRec');
      m.innerHTML = carregues.filter(x => x.estat === 'moll' || x.estat === 'acceptada').map(x => `<button class="cm ${x.estat}" data-c="${x.c.id}" title="${esc(D.productes[x.c.prod].nom)}">${caixa(x.c.prod, 24)}${x.estat === 'acceptada' ? '<i class="ok">✓</i>' : '<i class="q">?</i>'}</button>`).join('');
      m.querySelectorAll('[data-c]').forEach(b => b.onclick = (ev) => { ev.stopPropagation(); PS_ACC.carrega(b.dataset.c); });
    }
    function pintaRacks() {
      mg.querySelectorAll('[data-omple]').forEach(sp => {
        const k = sp.dataset.omple, pas = k[0], mod = +k.slice(1);
        const cont = Object.keys(stock).filter(c => { const u = E.parse(c); return u && u.pas === pas && u.mod === mod; }).reduce((a, c) => a + stock[c].reduce((b, x) => b + x.q, 0), 0);
        sp.style.width = Math.min(100, cont * 9) + '%';
      });
    }
    function pintaCamions() {
      const c = mg.querySelector('#camions'); let h = '';
      t.recepcions.forEach(rc => { if (arribades.has(rc.id) && carregues.some(x => x.rc === rc && x.estat === 'moll')) h += `<div class="camio rec" style="top:105px">🚚<span>${esc(rc.proveidor)}</span></div>`; });
      t.camions.forEach(cam => { const fora = minut > cam.sortida; if (!fora) h += `<div class="camio exp" style="top:${cam.moll === 2 ? 470 : 570}px">🚛<span>${E.hora(cam.sortida)} · ${cam.transportista ? esc(cam.transportista) : cam.ruta.map(x => D.CLIENTS.find(c => c.id === x).nom.replace('Botiga de ', '')).join(' → ')}</span></div>`; });
      c.innerHTML = h;
      [2, 3].forEach(m => { const el2 = mg.querySelector('#pm' + m); el2.innerHTML = res.palets.filter(p => p.moll === m).map(p => `<span class="palet-d" title="${esc(((o) => o.num ? 'Comanda web #' + o.num : (D.CLIENTS.find(c => c.id === o.client) || {}).nom || '')(t.comandes.find(o => o.id === p.comanda)))}">${p.pila.slice(-3).map(x => caixa(x, 10)).join('')}</span>`).join(''); });
    }
    pintaRacks(); pintaCamions(); pintaCarrega();

    /* ---------- Moviment ---------- */
    let enArribar = null;
    function vesA(node, fet) {
      const p = cami(w.node, node); p.shift();
      w.path = p.map(k => ({ k, x: N[k][0], y: N[k][1] })); enArribar = fet; w.ocupat = 'camina';
      if (pressa && (w.porta || w.pila.length)) {
        // Anar de pressa carregat: risc d'accident
        const fragil = (w.porta && D.productes[w.porta.c.prod].fragil) || w.pila.some(x => D.productes[x].fragil);
        const u = r();
        if (u < 0.07) w.accident = 'xoc'; else if (fragil && u < 0.25) w.accident = 'caiguda';
      }
      if (!w.path.length) { w.ocupat = null; const f = enArribar; enArribar = null; f && f(); }
    }
    function mou(dt) {
      if (!w.path.length) return;
      const carregat = !!(w.porta || w.pila.length);
      const v = (carregat ? EQ.velCarregat : EQ.vel) * (pressa ? D.VEL_PRESSA : 1);
      let pas = v * dt;
      while (pas > 0 && w.path.length) {
        const o = w.path[0], dx = o.x - w.x, dy = o.y - w.y, d = Math.hypot(dx, dy);
        if (Math.abs(dx) > 1) w.dir = dx < 0 ? -1 : 1;
        if (d <= pas) { w.x = o.x; w.y = o.y; w.node = o.k; w.path.shift(); pas -= d; }
        else { w.x += dx / d * pas; w.y += dy / d * pas; pas = 0; }
      }
      // Accident a mig camí
      if (w.accident && w.path.length && r() < 0.03) {
        const tipus = w.accident; w.accident = null;
        res.incidents.push({ tipus, minut: Math.round(minut) });
        if (tipus === 'caiguda') { const p = w.porta ? w.porta.c.prod : w.pila.find(x => D.productes[x].fragil); bombolla('Ui! S\'ha trencat…', 'neg'); fxText(w.x, w.y - 40, '💥 ' + (p ? D.productes[p].nom : ''), 'neg'); }
        else { bombolla('Pam! Un cop!', 'neg'); fxText(w.x, w.y - 40, '💥 Xoc', 'neg'); mg.classList.add('tremola'); setTimeout(() => mg.classList.remove('tremola'), 400); }
        op.bronca && op.bronca(tipus === 'xoc' ? 'Para! Has xocat amb la prestatgeria. Amb càrrega i amb pressa no. Això és un incident de seguretat.' : 'Se t\'ha caigut una càrrega fràgil per anar de pressa. Trencament.');
      }
      posa();
      if (!w.path.length) { w.accident = null; w.ocupat = null; const f = enArribar; enArribar = null; f && f(); }
    }
    // Una acció que dura uns segons (de rellotge de joc)
    function treballa(minuts, fet) { w.ocupat = 'treballa'; w.treball = { resta: minuts, fet }; ag.classList.add('treballant'); }

    /* ---------- Accions ---------- */
    const PS_ACC = {
      // Clic a una càrrega del moll: inspeccionar-la (si està pendent) o agafar-la (si està acceptada)
      carrega(id) {
        if (acabat || w.ocupat) return op.avis && op.avis('Espera que el treballador acabi el que fa.');
        const x = carregues.find(y => y.c.id === id); if (!x) return;
        if (x.estat === 'acceptada') {
          if (w.porta) return op.avis('Ja portes una càrrega. Deixa-la primer a la seva ubicació.');
          if (w.comanda) return op.avis('Estàs preparant una comanda. Deixa-la al moll o acaba-la abans.');
          return vesA('rec', () => treballa(1.5, () => { x.estat = 'portant'; w.porta = x; pintaCarrega(); pintaMoll(); bombolla(D.productes[x.c.prod].nom + (CROSS ? ' → ' + (D.CLIENTS.find(c => c.id === x.c.desti) || {}).nom : E.lliure(s) ? '' : ' → ' + D.UBICACIO[x.c.prod])); }));
        }
        vesA('rec', () => op.inspecciona(x.c, x.rc, (dec) => {
          treballa(2, () => {
            res.recepcio[x.c.id] = dec;
            x.estat = dec === 'accepta' ? 'acceptada' : 'rebutjada'; x.arribada = minut; // el rellotge del fred compta des que l'acceptes
            fxText(N.rec[0], N.rec[1] - 50, dec === 'accepta' ? '✓ Acceptada' : '✗ Rebutjada', dec === 'accepta' ? 'pos' : 'neg');
            pintaMoll(); pintaCamions(); op.canvi && op.canvi();
          });
        }));
      },
      // Clic a una prestatgeria
      modul(pas, mod) {
        if (acabat || w.ocupat) return op.avis && op.avis('Espera que el treballador acabi el que fa.');
        if (!w.porta && !w.comanda) return op.mostraModul({ pas, mod, stock, mode: 'veure', nivellsRack: NIV.nivellsRack });
        if (CROSS) return;
        const tp = D.tipusDe(pas, mod);
        const arriba = (fet) => () => { if (tp === 'mobil' && obert !== pas) { bombolla('Obrint el passadís mòbil…'); treballa(1.5, () => { obert = pas; fet(); }); } else fet(); };
        vesA(nodeModul(pas, mod), arriba(() => {
          if (w.porta) {
            op.mostraModul({ pas, mod, stock, mode: 'ubicar', prod: w.porta.c.prod, nivellsRack: NIV.nivellsRack, fixa: !E.lliure(s) }, (codi) => {
              if (!codi) return;
              const u = E.parse(codi), p = D.productes[w.porta.c.prod];
              if (u.niv > NIV.nivellsRack) return op.avis(`Amb el ${EQ.nom.toLowerCase()} no arribes al nivell ${u.niv}.`);
              const temps = u.niv <= 2 ? 1.5 : 2.5;
              const c0 = w.porta.c;
              const fes = (tm) => treballa(tm != null ? tm : temps, () => {
                if (NIV.equip === 'transpalet' && u.niv >= 2 && p.pes >= 15) { res.incidents.push({ tipus: 'sobreesforc', minut: Math.round(minut), prod: w.porta.c.prod }); bombolla('Ai, l\'esquena!', 'neg'); op.bronca && op.bronca(`Has pujat a mà ${p.nom.toLowerCase()} (${p.pes} kg) al nivell ${u.niv}. El que pesa, a terra. Sobreesforç.`); }
                res.ubicacions[w.porta.c.id] = codi;
                if (p.fred) res.fred[w.porta.c.id] = Math.round(minut - w.porta.arribada);
                (stock[codi] = stock[codi] || []).push({ prod: w.porta.c.prod, lot: w.porta.c.lot, cad: w.porta.c.cad || 9999, q: 1 });
                w.porta.estat = 'ubicada'; w.porta.slot = codi;
                fxText(w.x, w.y - 50, '📦 ' + codi, 'pos'); w.porta = null; pintaCarrega(); pintaRacks(); op.canvi && op.canvi();
              });
              // Mode habilitat: la maniobra física de col·locar-la (transpalet, toro o a mà)
              if (op.habilitat) op.habilitat({ tipus: 'ubicar', prod: c0.prod, cid: c0.id, codi, niv: u.niv, equip: NIV.equip, stock, minut: Math.round(minut) }, (tm) => fes(tm)); else fes();
            });
          } else if (w.comanda) {
            op.mostraModul({ pas, mod, stock, mode: 'picking', comanda: w.comanda, nivellsRack: NIV.nivellsRack }, (sel) => {
              if (!sel) return;
              const { codi, lot, q } = sel, x = stock[codi].find(y => y.lot === lot);
              if (!x || x.q < q) return;
              const vius = stock[codi].filter(y => y.prod === x.prod && y.q > 0);
              if (tp === 'dinamic' && vius[0] !== x) return op.avis('En una estanteria dinàmica només pots agafar el palet del davant: el primer que va entrar.');
              if (tp === 'compacte' && vius[vius.length - 1] !== x) return op.avis('En una estanteria compacta només pots agafar l\'últim palet que ha entrat (LIFO).');
              const u = E.parse(codi);
              if (u.niv > NIV.nivellsRack) return op.avis(`Amb el ${EQ.nom.toLowerCase()} no arribes al nivell ${u.niv}.`);
              const fes = (tm) => treballa(tm != null ? tm : 0.8 + q * 0.5, () => {
                // En una onada, cada unitat va a la primera comanda que la necessita
                let oid = w.comanda.id;
                if (ECOM) { const o = w.ona.find(o => { const l = o.linies.find(l => l.prod === x.prod); return l && w.piles[o.id].filter(p => p === x.prod).length < l.q; }) || w.ona.find(o => o.linies.some(l => l.prod === x.prod)) || w.ona[0]; oid = o.id; }
                x.q -= q; res.picking.push({ comanda: oid, prod: x.prod, slot: codi, lot, q });
                for (let i = 0; i < q; i++) { w.pila.push(x.prod); if (ECOM) w.piles[oid].push(x.prod); }
                fxText(w.x, w.y - 50, '+' + q + ' ' + D.productes[x.prod].nom, 'pos'); pintaCarrega(); pintaRacks(); op.canvi && op.canvi();
              });
              // Mode habilitat: agafar les caixes i posar-les al palet de la comanda, a mà
              if (op.habilitat) op.habilitat({ tipus: 'picking', prod: x.prod, q, codi, niv: u.niv, pila: ECOM ? [] : w.pila.slice(), equip: NIV.equip, minut: Math.round(minut) }, (tm) => fes(tm)); else fes();
            });
          }
        }));
      },
      // Començar a preparar una comanda (agafa un palet buit)
      comanda(oid) {
        if (acabat || w.ocupat) return op.avis('Espera que el treballador acabi el que fa.');
        if (w.porta) return op.avis('Primer deixa la càrrega que portes a la seva ubicació.');
        if (w.comanda && w.comanda.id !== oid) return op.avis('Ja estàs preparant una altra comanda: deixa-la al moll primer.');
        if (res.palets.some(p => p.comanda === oid)) return op.avis('Aquesta comanda ja és al moll.');
        if (w.comanda) return;
        vesA('exp', () => treballa(1, () => {
          w.comanda = t.comandes.find(o => o.id === oid); w.pila = [];
          if (ECOM) { // Onada: fins a 3 comandes del mateix transportista que encara no han sortit
            w.ona = [w.comanda].concat(t.comandes.filter(o => o.id !== oid && o.camio === w.comanda.camio && !res.palets.some(p => p.comanda === o.id))).slice(0, 3);
            w.piles = {}; w.ona.forEach(o => { w.piles[o.id] = []; });
          }
          pintaCarrega(); op.canvi && op.canvi(); bombolla(ECOM ? 'Carro amb ' + w.ona.length + ' comandes' : 'Palet buit a punt');
        }));
      },
      // Deixar el palet de la comanda en un moll d'expedició
      moll(n) {
        if (acabat || w.ocupat) return op.avis('Espera que el treballador acabi el que fa.');
        if (CROSS && w.porta) return vesA('moll' + n, () => treballa(1.5, () => {
          res.cross[w.porta.c.id] = { moll: n, minut: Math.round(minut) }; w.porta.estat = 'expedida'; w.porta.moll = n;
          fxText(N['moll' + n][0] + 40, N['moll' + n][1] - 30, '✓ Al moll ' + n, 'pos'); w.porta = null; pintaCarrega(); pintaCamions(); op.canvi && op.canvi();
        }));
        if (!w.comanda) return op.avis(CROSS ? 'Primer agafa una càrrega revisada del moll 1.' : 'No portes cap comanda.');
        if (!w.pila.length) return op.avis('El palet és buit: primer fes el picking de la comanda.');
        if (ECOM) return vesA('moll' + n, () => op.caixes(w.ona.filter(o => w.piles[o.id].length).map(o => ({ o, pila: w.piles[o.id] })), (caixes) => treballa(1 + w.ona.length, () => {
          w.ona.forEach(o => { if (w.piles[o.id].length) res.palets.push({ comanda: o.id, pila: w.piles[o.id].slice(), moll: n, minut: Math.round(minut), caixa: caixes[o.id] }); });
          fxText(N['moll' + n][0] + 40, N['moll' + n][1] - 30, '📦 ' + Object.keys(caixes).length + ' caixes al moll ' + n, 'pos');
          w.comanda = null; w.ona = []; w.piles = {}; w.pila = []; pintaCarrega(); pintaCamions(); op.canvi && op.canvi();
        })));
        vesA('moll' + n, () => treballa(2, () => {
          res.palets.push({ comanda: w.comanda.id, pila: w.pila.slice(), moll: n, minut: Math.round(minut) });
          const cam = t.camions.find(c => c.moll === n); if (cam) (res.carrega[cam.id] = res.carrega[cam.id] || []).push(w.comanda.id);
          fxText(N['moll' + n][0] + 40, N['moll' + n][1] - 30, '✓ Palet al moll ' + n, 'pos');
          w.comanda = null; w.pila = []; pintaCarrega(); pintaCamions(); op.canvi && op.canvi();
        }));
      },
      // Inventari (cap de magatzem): comptar una ubicació
      recompte(slot, n) { res.inventari.recomptes[slot] = n; op.canvi && op.canvi(); },
      demana(prod, n) { if (n > 0) res.inventari.comandes[prod] = n; else delete res.inventari.comandes[prod]; op.canvi && op.canvi(); },
      // Deixar la càrrega a terra on sigui (pot bloquejar el pas)
      deixaATerra() {
        if (!w.porta || w.ocupat) return;
        const zonaSortida = dist([w.x, w.y], N.Sx) < 140, passadis = !['rec', 'park', 'exp', 'moll1', 'moll2', 'moll3'].includes(w.node);
        if (zonaSortida || passadis) { res.incidents.push({ tipus: 'bloqueig', minut: Math.round(minut) }); op.bronca && op.bronca(zonaSortida ? 'Has deixat mercaderia davant de la sortida d\'emergència! Això no es fa mai.' : 'No deixis mercaderia al mig del passadís: algú s\'hi entrebancarà.'); }
        w.porta.estat = 'acceptada'; carregues.splice(carregues.indexOf(w.porta), 1); carregues.push(w.porta); w.porta = null; pintaCarrega(); pintaMoll();
      },
      pressa(v) { pressa = !!v; },
      // El temps de la maniobra física (minuts de joc) avança el rellotge del torn
      avanca(m) { minut = Math.min(D.TORN_FI, minut + m); op.rellotge && op.rellotge(minut); },
      habilitat(r) { (res.habilitat = res.habilitat || []).push(r); op.canvi && op.canvi(); },
      pausa(v) { pausa = !!v; },
      velocitat(v) { vel = v; },
      acaba() { if (!acabat) fi(); },
      estat() {
        return { minut, pressa, porta: w.porta && w.porta.c, comanda: w.comanda, pila: w.pila.slice(), ocupat: !!w.ocupat,
          carregues: carregues.map(x => ({ id: x.c.id, prod: x.c.prod, estat: x.estat, slot: x.slot, proveidor: x.rc.proveidor, desti: x.c.desti, moll: x.moll, fora: D.productes[x.c.prod].fred && ['acceptada', 'portant'].includes(x.estat) ? Math.round(minut - x.arribada) : null })), ona: w.ona.map(o => o.id),
          pendentsArribar: t.recepcions.filter(rc => !arribades.has(rc.id)).map(rc => ({ proveidor: rc.proveidor, arribada: rc.arribada })),
          palets: res.palets.slice(), res, stock };
      }
    };
    mg.querySelectorAll('.rack').forEach(b => b.onclick = () => PS_ACC.modul(b.dataset.pas, +b.dataset.mod));
    mg.querySelectorAll('.moll-btn').forEach(b => b.onclick = () => PS_ACC.moll(+b.dataset.moll));

    /* ---------- Bucle ---------- */
    let ultim = performance.now(), raf = 0, capT = 0;
    function bucle(ara) {
      const dt = Math.min(0.1, (ara - ultim) / 1000); ultim = ara;
      if (!pausa && !acabat) {
        const dj = dt * vel;
        minut += dj * (D.TORN_FI - D.TORN_INICI) / SEG_TORN;
        t.recepcions.forEach(rc => { if (minut >= rc.arribada) arribaCamio(rc); });
        if (w.ocupat === 'treballa') { w.treball.resta -= dj * (D.TORN_FI - D.TORN_INICI) / SEG_TORN; if (w.treball.resta <= 0) { const f = w.treball.fet; w.ocupat = null; w.treball = null; ag.classList.remove('treballant'); f && f(); } }
        else for (let k = 0; k < Math.round(vel); k++) mou(dt);
        // La cap fa la ronda
        capT += dj; if (capT > 25) { capT = 0; const nodes = ['rec', 'L2', 'b3', 'R2', 'exp']; const n2 = N[nodes[Math.floor(r() * nodes.length)]]; cap.style.transform = `translate(${n2[0] - 17}px,${n2[1] - 60}px)`; }
        if (minut >= D.TORN_FI) fi();
        op.rellotge && op.rellotge(minut);
      }
      raf = requestAnimationFrame(bucle);
    }
    raf = requestAnimationFrame(bucle);
    let tmEstat = setInterval(() => { pintaCamions(); op.canvi && op.canvi(true); }, 1500);

    function fi() {
      if (acabat) return; acabat = true;
      res.fi = Math.round(Math.min(D.TORN_FI, minut));
      // Mercaderia deixada al moll sense ubicar o abandonada: queda registrada tal com està
      op.onFi && op.onFi(res);
    }
    function destrueix() { cancelAnimationFrame(raf); clearInterval(tmEstat); ro.disconnect(); }
    return Object.assign(PS_ACC, { destrueix });
  };

  /* ---------- Vista estàtica (portada i briefing) ---------- */
  PS.estatica = function (el, s) {
    el.innerHTML = `<div class="esc estatica"><div class="esc-in">${plano(s ? s.nivell : 1)}</div></div>`;
    const inEl = el.querySelector('.esc-in'); const w = el.clientWidth || D.W, e = Math.min(1, w / D.W);
    inEl.style.transform = `scale(${e})`; inEl.style.height = (D.H * e) + 'px'; inEl.style.width = (D.W * e) + 'px';
    el.querySelectorAll('button').forEach(b => { b.tabIndex = -1; b.disabled = true; });
  };

  root.PS = PS;
})(typeof window !== 'undefined' ? window : globalThis);
