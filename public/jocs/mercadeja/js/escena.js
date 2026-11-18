/* Mercadeja · l'escena de la botiga: el carrer, la botiga per dins, la gent i el ninot.
   - MBOT.estatica(el, s, opcions): la botiga tancada (planificació): es pot tocar una prestatgeria per editar-la.
   - MBOT.dia(el, s, opcions): la botiga oberta. La gent entra segons el que ha calculat el motor (s.dia.clients);
     el que passa a dins (si troben el producte a la prestatgeria, si se'ls atén a temps) depèn de com jugues.
     En acabar, crida opcions.onFi(res) amb [idClient, unitatsVenudes, motiu] per a cada client. */
(function () {
  const MD = window.MD, ME = window.ME, I = window.MI.icon;
  const W = 1000, H = 640;
  const esc = (t) => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const preuTxt = (v) => (Math.round(v * 100) / 100).toLocaleString('ca-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  /* ---------- Plànol ---------- */
  const SLOTS = [[320, 230], [500, 230], [680, 230], [320, 380], [500, 380], [680, 380]]; // centre-x i y superior de cada prestatgeria
  const PW = 150, PH = 70;
  const N = { // nodes per on es camina
    porta: [130, 168], dins: [130, 215], c1: [200, 215], cA: [200, 325], pq: [200, 395], cB: [200, 475], cC: [200, 565],
    sA0: [320, 325], sA1: [500, 325], sA2: [680, 325], rA: [790, 325], sB0: [320, 475], sB1: [500, 475], sB2: [680, 475], rB: [790, 475], rC: [790, 565],
    caixa: [105, 268], magatzem: [930, 565], paquets: [895, 345]
  };
  const ARESTES = [['porta', 'dins'], ['dins', 'c1'], ['dins', 'caixa'], ['c1', 'cA'], ['cA', 'pq'], ['pq', 'cB'], ['cB', 'cC'], ['cC', 'rC'], ['rC', 'magatzem'], ['rC', 'rB'], ['rB', 'rA'], ['rA', 'paquets'],
    ['cA', 'sA0'], ['sA0', 'sA1'], ['sA1', 'sA2'], ['sA2', 'rA'], ['cB', 'sB0'], ['sB0', 'sB1'], ['sB1', 'sB2'], ['sB2', 'rB']];
  const VEI = {}; Object.keys(N).forEach(k => { VEI[k] = []; });
  ARESTES.forEach(([a, b]) => { VEI[a].push(b); VEI[b].push(a); });
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  function cami(de, a) { // Dijkstra entre nodes
    const d = {}, prev = {}, q = new Set(Object.keys(N)); Object.keys(N).forEach(k => { d[k] = Infinity; }); d[de] = 0;
    while (q.size) { let u = null; q.forEach(k => { if (u == null || d[k] < d[u]) u = k; }); q.delete(u); if (u === a) break; VEI[u].forEach(v => { const nd = d[u] + dist(N[u], N[v]); if (nd < d[v]) { d[v] = nd; prev[v] = u; } }); }
    const out = []; let k = a; while (k) { out.unshift(k); k = prev[k]; } return out;
  }
  const nodeProper = (x, y) => Object.keys(N).filter(k => !['magatzem', 'paquets', 'caixa', 'porta'].includes(k)).sort((a, b) => dist(N[a], [x, y]) - dist(N[b], [x, y]))[0];
  const frontSlot = (i) => (i < 3 ? 'sA' : 'sB') + (i % 3);
  const CUA = [[105, 398], [105, 440], [105, 482], [105, 524], [150, 560], [150, 602], [105, 602], [60, 560], [60, 520]];

  /* ---------- Dibuixos ---------- */
  function iconaProd(p, mida) {
    const P = MD.productes[p], c = P.color, m = mida || 26;
    const fig = {
      pa: `<ellipse cx="13" cy="15" rx="11" ry="7" fill="${c}"/><path d="M7 12l2 4M12 11l2 5M17 12l2 4" stroke="#7a4b16" stroke-width="1.2"/>`,
      ampolla: `<rect x="9" y="3" width="8" height="5" rx="1.5" fill="#cfd8e3"/><rect x="7" y="7" width="12" height="17" rx="4" fill="${c}" stroke="#94a3b8"/><rect x="8" y="13" width="10" height="5" fill="#fff" opacity=".7"/>`,
      fruita: `<circle cx="13" cy="15" r="9" fill="${c}"/><path d="M13 6c0-3 3-4 5-3-1 2-3 3-5 3z" fill="#3c9a4a"/><circle cx="10" cy="12" r="2" fill="#fff" opacity=".35"/>`,
      formatge: `<path d="M3 20L23 9v11z" fill="${c}" stroke="#b7902a"/><circle cx="15" cy="16" r="1.6" fill="#b7902a"/><circle cx="19" cy="13.5" r="1.1" fill="#b7902a"/>`,
      embotit: `<rect x="3" y="10" width="20" height="9" rx="4.5" fill="${c}"/><circle cx="9" cy="14" r="1" fill="#f2d0c0"/><circle cx="15" cy="15" r="1" fill="#f2d0c0"/><path d="M3 14H1" stroke="#ccc"/>`,
      caixa: `<rect x="4" y="6" width="18" height="16" rx="2" fill="${c}"/><rect x="7" y="10" width="12" height="6" rx="1" fill="#fff" opacity=".75"/>`,
      pot: `<rect x="6" y="5" width="14" height="4" rx="1" fill="#9aa5b1"/><rect x="5" y="8" width="16" height="15" rx="4" fill="${c}"/><rect x="8" y="12" width="10" height="5" rx="1" fill="#fff" opacity=".7"/>`,
      sac: `<path d="M6 9q7-5 14 0l2 13H4z" fill="${c}"/><path d="M8 9q5-3 10 0" stroke="#7a5b2c" fill="none"/><circle cx="12" cy="16" r="1" fill="#7a5b2c"/><circle cx="15" cy="18" r="1" fill="#7a5b2c"/>`,
      pasta: `<path d="M3 17q10-14 20 0q-4-3-10-3T3 17z" fill="${c}"/><path d="M8 13l1 3M13 12v4M18 13l-1 3" stroke="#a8641c"/>`
    }[P.cat] || `<circle cx="13" cy="13" r="9" fill="${c}"/>`;
    return `<svg class="ip" width="${m}" height="${m}" viewBox="0 0 26 26" aria-hidden="true">${fig}</svg>`;
  }
  const PELL = ['#F1C7A5', '#D9A47E', '#A8704B', '#6E4A31'], CABELL = ['#2b1d14', '#6b3e1f', '#c98b3b', '#e4d3a6', '#8a8a8a'], PANTS = ['#2d3a55', '#3f4b3b', '#4a3b5c', '#1f2937'];
  function persona(tipus, look, seg) {
    const sk = PELL[look % 4], hc = CABELL[(look >> 2) % 5], pc = PANTS[(look >> 4) % 4], st = (look >> 6) % 3;
    let samarreta = seg ? MD.segments[seg].color : '#334155', davantal = '';
    if (tipus === 'ninot') { samarreta = '#334155'; davantal = '<rect x="13" y="30" width="14" height="17" rx="3" fill="#F5C542"/><circle cx="20" cy="37" r="2.5" fill="#1D293B"/>'; }
    if (tipus === 'dependenta') { samarreta = '#334155'; davantal = '<rect x="13" y="30" width="14" height="17" rx="3" fill="#4EA5F5"/>'; }
    if (tipus === 'repartidor') { samarreta = '#36B37E'; }
    const cabell = tipus === 'ninot' ? `<path d="M10 14q10-11 20 0v2H10z" fill="#F5C542"/><rect x="24" y="13" width="10" height="3" rx="1.5" fill="#F5C542"/>`
      : st === 0 ? `<path d="M11 15q9-12 18 0q-3-4-9-4t-9 4z" fill="${hc}"/>` : st === 1 ? `<path d="M10 17q10-14 20 0l1 10q-2-8-4-12q-6 2-13 0q-2 4-4 12z" fill="${hc}"/>` : `<circle cx="20" cy="9" r="5" fill="${hc}"/><path d="M11 15q9-10 18 0q-3-3-9-3t-9 3z" fill="${hc}"/>`;
    return `<svg class="pers" width="40" height="64" viewBox="0 0 40 64" aria-hidden="true">
      <ellipse cx="20" cy="61" rx="11" ry="3" fill="rgba(0,0,0,.25)"/>
      <g class="cames"><rect class="c1" x="14" y="45" width="5" height="15" rx="2.5" fill="${pc}"/><rect class="c2" x="21" y="45" width="5" height="15" rx="2.5" fill="${pc}"/></g>
      <rect x="11" y="26" width="18" height="22" rx="6" fill="${samarreta}"/>${davantal}
      <rect class="b1" x="7" y="28" width="5" height="15" rx="2.5" fill="${sk}"/><rect class="b2" x="28" y="28" width="5" height="15" rx="2.5" fill="${sk}"/>
      <circle cx="20" cy="17" r="9.5" fill="${sk}"/>${cabell}
      <circle cx="16.5" cy="18" r="1.2" fill="#1b1b1b"/><circle cx="23.5" cy="18" r="1.2" fill="#1b1b1b"/><path class="boca" d="M17 22q3 2 6 0" stroke="#7a3b2a" stroke-width="1.2" fill="none"/>
    </svg>`;
  }
  function facanaRival(e, i) {
    const def = MD.RIVALS[i];
    return `<div class="rival" style="left:${470 + i * 165}px" data-rival="${i}" title="${esc(e.nom)}: ${esc(def.desc)}">
      <svg viewBox="0 0 150 112" width="150" height="112" aria-hidden="true">
        <rect x="0" y="8" width="150" height="104" fill="#2a3954"/><rect x="0" y="8" width="150" height="104" fill="url(#maons)" opacity=".35"/>
        <rect x="8" y="14" width="134" height="20" rx="4" fill="#0f1724"/>
        <g>${[0, 1, 2, 3, 4, 5].map(k => `<path d="M${k * 25} 38h25l-4 12h-17z" fill="${k % 2 ? '#f8fafc' : def.color}"/>`).join('')}</g>
        <rect x="10" y="56" width="70" height="40" rx="3" fill="#9cc7e8" opacity=".55"/><rect x="92" y="54" width="44" height="58" rx="3" fill="#162033"/>
        <circle cx="128" cy="84" r="2" fill="#F5C542"/>
      </svg><span class="rnom" style="color:${def.color}">${esc(e.nom)}</span><span class="rcomp" hidden>0</span></div>`;
  }
  function prestatgeHTML(i, x, s, mode) {
    const [cx, y] = SLOTS[i];
    return `<button class="prest ${x && x.prod ? '' : 'buit'}" data-slot="${i}" style="left:${cx - PW / 2}px;top:${y}px;width:${PW}px;height:${PH}px" aria-label="Prestatgeria ${i + 1}"></button>`;
  }

  /* ---------- Construcció de l'escena ---------- */
  function construeix(el, s, mode) {
    const e = ME.jugador(s);
    el.innerHTML = `<div class="esc"><div class="esc-in" style="width:${W}px;height:${H}px">
      <svg width="0" height="0" style="position:absolute"><defs><pattern id="maons" width="20" height="10" patternUnits="userSpaceOnUse"><path d="M0 10h20M10 0v5M0 5h20M20 5v5" stroke="#0f1724" stroke-width="1"/></pattern></defs></svg>
      <div class="carrer"><div class="cel"></div>${s.empreses.slice(1).map((r, i) => facanaRival(r, i)).join('')}<div class="vorera"></div>
        <div class="arbre" style="left:20px"></div><div class="arbre" style="left:400px"></div><div class="fanal" style="left:455px"></div></div>
      <div class="paret"><div class="porta-b"></div><div class="aparador ${e.aparador ? 'tema-' + e.aparador : ''}">${aparadorHTML(e)}</div><div class="rotol">${esc(e.nom)}</div></div>
      <div class="terra"></div>
      ${SLOTS.map((_, i) => i < e.nPrest ? prestatgeHTML(i, e.prestatges[i], s, mode) : (mode === 'plan' ? `<button class="prest nou" data-nou="${i}" style="left:${SLOTS[i][0] - PW / 2}px;top:${SLOTS[i][1]}px;width:${PW}px;height:${PH}px">${I('mes')}<span>Prestatgeria nova<br>${MD.PRESTATGE_COST} €</span></button>` : '')).join('')}
      <button class="taulell" aria-label="Taulell: cobrar els clients"><svg viewBox="0 0 130 64" width="130" height="64" aria-hidden="true"><rect x="0" y="8" width="130" height="50" rx="8" fill="#8a5a33"/><rect x="0" y="4" width="130" height="14" rx="6" fill="#b07a4a"/><rect x="74" y="-10" width="40" height="22" rx="4" fill="#1f2937"/><rect x="80" y="-6" width="28" height="8" rx="2" fill="#36B37E"/></svg><span class="lbl">Taulell</span></button>
      <button class="tauleta ${e.serveis.online ? '' : 'off'}" aria-label="Comandes en línia"><svg viewBox="0 0 130 70" width="130" height="70" aria-hidden="true"><rect x="0" y="12" width="130" height="50" rx="6" fill="#6b7a90"/><rect x="0" y="8" width="130" height="12" rx="5" fill="#8b9bb2"/><rect x="12" y="-6" width="40" height="28" rx="4" fill="#0f1724"/><rect x="16" y="-2" width="32" height="20" rx="2" fill="#4EA5F5"/><rect x="70" y="0" width="22" height="18" rx="2" fill="#c9a66b"/><rect x="96" y="4" width="22" height="16" rx="2" fill="#b98f55"/></svg><span class="lbl">Comandes en línia</span><span class="badge" hidden>0</span></button>
      <button class="magatzem" aria-label="Magatzem"><span>MAGATZEM</span></button>
      <div class="ags"></div><div class="fx"></div>
    </div></div>`;
    const inn = el.querySelector('.esc-in'), cont = el.querySelector('.esc');
    // Escala per encaixar a l'amplada (i, si cal, a l'alçada de la finestra). Només reacciona a canvis d'amplada.
    let ultW = 0, ultH = 0;
    const ajusta = () => {
      const w = cont.clientWidth, hv = window.innerHeight; if (!w || (Math.abs(w - ultW) < 1 && hv === ultH)) return; ultW = w; ultH = hv;
      const maxH = Math.max(260, hv - Math.max(0, cont.getBoundingClientRect().top + window.scrollY) - 40);
      const k = Math.min(w / W, maxH / H); inn.style.transform = `scale(${k})`; cont.style.height = Math.round(H * k) + 'px'; inn.style.left = Math.round((w - W * k) / 2) + 'px';
    };
    ajusta(); const ro = new ResizeObserver(ajusta); ro.observe(cont); window.addEventListener('resize', ajusta);
    return { inn, ro: { disconnect: () => { ro.disconnect(); window.removeEventListener('resize', ajusta); } } };
  }
  function aparadorHTML(e) {
    if (!e.aparador) return '<span class="buit">Aparador buit</span>';
    const a = MD.aparadors[e.aparador];
    return `<span style="color:${a.color}">${I(MD.segments[a.seg].icona)} ${esc(a.nom)}</span>`;
  }
  // Contingut d'una prestatgeria: productes a la vista, preu, estoc
  function pintaPrest(btn, x, unitats, magatzem, mode) {
    if (!x || !x.prod) { btn.innerHTML = `<span class="buida">${mode === 'plan' ? 'Tria un producte' : 'Buida'}</span>`; btn.classList.add('buit'); return; }
    const P = MD.productes[x.prod], n = Math.min(MD.PRESTATGE_MAX, unitats);
    btn.classList.remove('buit');
    btn.classList.toggle('esgotat', mode !== 'plan' && unitats <= 0);
    btn.classList.toggle('baix', mode !== 'plan' && unitats > 0 && unitats <= 2);
    btn.innerHTML = `<svg class="fusta" viewBox="0 0 150 70" width="150" height="70" aria-hidden="true"><rect x="0" y="0" width="150" height="70" rx="6" fill="#6d4a2b"/><rect x="4" y="30" width="142" height="5" fill="#8a5f38"/><rect x="4" y="62" width="142" height="5" fill="#8a5f38"/></svg>
      <span class="items">${Array.from({ length: n }, (_, k) => `<i style="left:${8 + (k % 4) * 34}px;top:${k < 4 ? 4 : 36}px">${iconaProd(x.prod, 26)}</i>`).join('')}</span>
      <span class="nomp">${esc(P.nom)}</span><span class="preu">${preuTxt(x.preu)}</span>
      ${mode === 'plan' ? `<span class="estoc">${magatzem} u.</span>` : `<span class="estoc" title="Al magatzem">${I('paquet')} ${magatzem}</span>`}
      ${mode !== 'plan' && unitats <= 0 ? `<span class="segell">${magatzem > 0 ? 'Toca per reposar' : 'ESGOTAT'}</span>` : ''}`;
    btn.setAttribute('aria-label', `${P.nom}, ${preuTxt(x.preu)}, ${unitats} a la prestatgeria, ${magatzem} al magatzem`);
  }

  /* ---------- Botiga tancada (planificació) ---------- */
  function estatica(el, s, op) {
    const e = ME.jugador(s), { ro } = construeix(el, s, 'plan');
    el.querySelectorAll('.prest[data-slot]').forEach(b => { const i = +b.dataset.slot, x = e.prestatges[i]; pintaPrest(b, x, x && x.prod ? Math.min(MD.PRESTATGE_MAX, e.estoc[x.prod] || 0) : 0, x && x.prod ? (e.estoc[x.prod] || 0) : 0, 'plan'); b.onclick = () => op.onPrestatge && op.onPrestatge(i); });
    el.querySelectorAll('[data-nou]').forEach(b => { b.onclick = () => op.onNou && op.onNou(); });
    el.querySelector('.taulell').onclick = () => op.onTaulell && op.onTaulell();
    el.querySelector('.tauleta').onclick = () => op.onTauleta && op.onTauleta();
    el.querySelector('.magatzem').onclick = () => op.onMagatzem && op.onMagatzem();
    el.querySelector('.aparador').onclick = () => op.onAparador && op.onAparador();
    // Ninot quiet darrere el taulell i, si n'hi ha, la dependenta
    const ags = el.querySelector('.ags');
    ags.innerHTML = `<div class="ag ninot" style="transform:translate(${N.caixa[0] + 40}px,${N.caixa[1] - 64}px)">${persona('ninot', 0)}</div>` + (e.serveis.dependent ? `<div class="ag" style="transform:translate(${N.caixa[0] - 20}px,${N.caixa[1] - 64}px)">${persona('dependenta', 5)}</div>` : '');
    return { destrueix: () => ro.disconnect() };
  }

  /* ---------- Botiga oberta ---------- */
  function dia(el, s, op) {
    const e = ME.jugador(s), d = s.dia, { inn, ro } = construeix(el, s, 'dia');
    const ags = inn.querySelector('.ags'), fx = inn.querySelector('.fx');
    const DUR = 120;                         // segons de joc que dura la jornada (a velocitat 1)
    let temps = 0, vel = 1, pausa = !!op.pausa, auto = !!op.auto, acabat = false, raf = 0, darrerT = 0;
    // Estoc: a la prestatgeria (com a molt 8) i al magatzem
    const prest = [], mag = Object.assign({}, d.estocInici);
    for (let i = 0; i < e.nPrest; i++) { const x = e.prestatges[i]; const u = x && x.prod ? Math.min(MD.PRESTATGE_MAX, mag[x.prod] || 0) : 0; if (x && x.prod) mag[x.prod] -= u; prest.push(u); }
    const slotDe = (p) => e.prestatges.slice(0, e.nPrest).findIndex(x => x && x.prod === p);
    const btnPrest = [...inn.querySelectorAll('.prest[data-slot]')];
    const pinta = (i) => { const x = e.prestatges[i]; pintaPrest(btnPrest[i], x, prest[i], x && x.prod ? mag[x.prod] || 0 : 0, 'dia'); };
    btnPrest.forEach((_, i) => pinta(i));
    const res = {}; const registra = (c, v, m) => { if (res[c.id]) return; res[c.id] = [c.id, v, m]; stats.atesos += v > 0 ? 1 : 0; stats.perduts += v > 0 ? 0 : 1; if (v > 0) stats.vendes += v * preuDe(c.prod); stats.motius[m]++; };
    const desc = e.promosDia.includes('descompte') ? 0.9 : 1, preuDe = (p) => (e.prestatges.find(x => x && x.prod === p) || { preu: 0 }).preu * desc;
    const stats = { vendes: 0, atesos: 0, perduts: 0, motius: [0, 0, 0, 0, 0], total: d.clients.length };

    // Agents
    const agents = [];
    function nouAgent(tipus, look, seg, x, y) {
      const div = document.createElement('div'); div.className = 'ag ' + tipus; div.innerHTML = persona(tipus, look, seg) + (seg ? `<span class="xapa" style="background:${MD.segments[seg].color}">${I(MD.segments[seg].icona)}</span><span class="pac"><i></i></span>` : '') + '<span class="carrega"></span><span class="bomb" hidden></span>';
      ags.appendChild(div);
      const a = { tipus, x, y, path: [], div, v: tipus === 'ninot' ? 250 : tipus === 'repartidor' ? 220 : 150, timer: 0, estat: 'quiet', bombT: 0 };
      agents.push(a); posa(a); return a;
    }
    function posa(a) { a.div.style.transform = `translate(${a.x - 20}px,${a.y - 64}px)`; a.div.style.zIndex = Math.round(a.y); }
    function bombolla(a, t, cls) { const b = a.div.querySelector('.bomb'); b.textContent = t; b.className = 'bomb ' + (cls || ''); b.hidden = false; a.bombT = 2.2; }
    function vesA(a, punts) { a.path = punts.slice(); a.div.classList.add('camina'); }
    function viaNodes(a, desti, final) { const de = nodeProper(a.x, a.y), p = cami(de, desti).map(k => N[k]); if (final) p.push(final); vesA(a, p); }
    function mou(a, dt) {
      if (!a.path.length) { a.div.classList.remove('camina'); return true; }
      const [tx, ty] = a.path[0], dx = tx - a.x, dy = ty - a.y, dd = Math.hypot(dx, dy), pas = a.v * dt;
      if (dd <= pas) { a.x = tx; a.y = ty; a.path.shift(); } else { a.x += dx / dd * pas; a.y += dy / dd * pas; a.div.classList.toggle('esq', dx < -1); }
      posa(a); return !a.path.length;
    }
    const treu = (a) => { a.div.remove(); agents.splice(agents.indexOf(a), 1); };
    function monedes(x, y, t, cls) { const m = document.createElement('div'); m.className = 'fxm ' + (cls || ''); m.style.left = x + 'px'; m.style.top = y + 'px'; m.textContent = t; fx.appendChild(m); setTimeout(() => m.remove(), 1200); }

    // Ninot i dependenta
    const ninot = nouAgent('ninot', 0, null, N.caixa[0], N.caixa[1]);
    ninot.tasca = { tipus: 'cobrar' }; ninot.fase = 'anar'; ninot.persist = 'cobrar';
    let dependenta = null; if (e.serveis.dependent) { dependenta = nouAgent('dependenta', 5, null, N.caixa[0] - 40, N.caixa[1]); ninot.tasca = null; ninot.persist = null; ninot.x = N.dins[0] + 30; ninot.y = N.dins[1] + 30; posa(ninot); }
    const cua = [];  // agents a la cua del taulell
    let cobrant = null, cobrarT = 0;
    const online = []; // comandes pendents
    let empaquetant = null, empT = 0;
    const tauleta = inn.querySelector('.tauleta'), badge = tauleta.querySelector('.badge');

    // Ordres del jugador
    function ordena(t) {
      if (acabat) return;
      if (t.tipus === 'cobrar' && dependenta) { op.avis && op.avis('La dependenta ja cobra al taulell. Tu pots reposar i preparar comandes.'); return; }
      if (t.tipus === 'reposar') { const x = e.prestatges[t.slot]; if (!x || !x.prod) return; if ((mag[x.prod] || 0) <= 0) { op.avis && op.avis('No queda ' + MD.productes[x.prod].nom.toLowerCase() + ' al magatzem. Demà en pots demanar més.'); return; } if (prest[t.slot] >= MD.PRESTATGE_MAX) { op.avis && op.avis('Aquesta prestatgeria ja és plena.'); return; } }
      if (t.tipus === 'empaquetar' && !e.serveis.online) { op.avis && op.avis('No tens botiga en línia. La pots activar a la planificació (Distribució).'); return; }
      if (ninot.porta) { mag[ninot.porta.prod] += ninot.porta.n; ninot.porta = null; ninot.div.querySelector('.carrega').innerHTML = ''; }
      if (t.tipus !== 'reposar') ninot.persist = t.tipus;
      ninot.tasca = t; ninot.fase = 'anar';
      const desti = t.tipus === 'cobrar' ? ['caixa'] : t.tipus === 'empaquetar' ? ['paquets'] : ['magatzem'];
      viaNodes(ninot, desti[0]);
      marcaSeleccio();
    }
    function marcaSeleccio() {
      inn.querySelectorAll('.sel').forEach(x => x.classList.remove('sel'));
      const t = ninot.tasca; if (!t) return;
      if (t.tipus === 'cobrar') inn.querySelector('.taulell').classList.add('sel');
      if (t.tipus === 'empaquetar') tauleta.classList.add('sel');
      if (t.tipus === 'reposar') btnPrest[t.slot].classList.add('sel');
    }
    btnPrest.forEach((b, i) => { b.onclick = () => ordena({ tipus: 'reposar', slot: i }); });
    inn.querySelector('.taulell').onclick = () => ordena({ tipus: 'cobrar' });
    tauleta.onclick = () => ordena({ tipus: 'empaquetar' });
    inn.querySelector('.magatzem').onclick = () => op.avis && op.avis('Toca una prestatgeria i el ninot hi anirà a buscar una caixa del magatzem.');
    marcaSeleccio();

    function tascaNinot(dt) {
      const t = ninot.tasca;
      if (!t) return autoDecideix();
      const arribat = mou(ninot, dt);
      if (!arribat) return;
      if (t.tipus === 'reposar') {
        const x = e.prestatges[t.slot];
        if (ninot.fase === 'anar') { ninot.fase = 'agafa'; ninot.timer = 0.45; return; }
        if (ninot.fase === 'agafa') { ninot.timer -= dt; if (ninot.timer > 0) return; const n = Math.min(mag[x.prod] || 0, MD.PRESTATGE_MAX); if (!n) { ninot.tasca = null; return; } mag[x.prod] -= n; ninot.porta = { prod: x.prod, n }; ninot.div.querySelector('.carrega').innerHTML = `<svg viewBox="0 0 24 18" width="24" height="18"><rect width="24" height="18" rx="2" fill="#c9a66b"/></svg>`; ninot.fase = 'porta'; viaNodes(ninot, frontSlot(t.slot)); pinta(t.slot); return; }
        if (ninot.fase === 'porta') { ninot.fase = 'omple'; ninot.timer = 0.45; return; }
        if (ninot.fase === 'omple') { ninot.timer -= dt; if (ninot.timer > 0) return; const cap = MD.PRESTATGE_MAX - prest[t.slot], n = Math.min(cap, ninot.porta.n); prest[t.slot] += n; mag[x.prod] += ninot.porta.n - n; ninot.porta = null; ninot.div.querySelector('.carrega').innerHTML = ''; pinta(t.slot); monedes(SLOTS[t.slot][0], SLOTS[t.slot][1], '+' + n, 'repos');
          const seg = ninot.persist && !(ninot.persist === 'cobrar' && dependenta) ? ninot.persist : null; ninot.tasca = null; if (seg) ordena({ tipus: seg }); else marcaSeleccio(); return; }
      }
      // cobrar i empaquetar: quan hi és, s'hi queda
    }
    const aLaCaixa = () => ninot.tasca && ninot.tasca.tipus === 'cobrar' && !ninot.path.length;
    const aPaquets = () => ninot.tasca && ninot.tasca.tipus === 'empaquetar' && !ninot.path.length;
    let autoT = 0;
    function autoDecideix() {
      if (!auto) return;
      autoT -= 0.016; if (autoT > 0) return; autoT = 0.3;
      const necessitat = btnPrest.map((_, i) => ({ i, x: e.prestatges[i] })).filter(o => o.x && o.x.prod && prest[o.i] <= 2 && (mag[o.x.prod] || 0) > 0).sort((a, b) => prest[a.i] - prest[b.i])[0];
      if (!dependenta && cua.length >= 3) return ordena({ tipus: 'cobrar' });
      if (necessitat) return ordena({ tipus: 'reposar', slot: necessitat.i });
      if (online.length && e.serveis.online) return ordena({ tipus: 'empaquetar' });
      if (!dependenta) return ordena({ tipus: 'cobrar' });
    }

    // Clients
    let seguent = 0;
    const clients = d.clients.filter(c => !c.online), comandes = d.clients.filter(c => c.online);
    let segC = 0;
    const visites = [];  // gent que passa cap a les rivals (només visual)
    s.empreses.slice(1).forEach((r, i) => { const n = Math.round(MD.SEG.reduce((a, k) => a + d.demanda[k] * d.quotes[i + 1][k], 0) / 2); for (let k = 0; k < n; k++) visites.push({ t: Math.random() * 0.88, i }); });
    visites.sort((a, b) => a.t - b.t); let segV = 0;
    const compRival = [0, 0, 0];

    function arribaClient(c) {
      const dreta = (c.look % 2) === 0, x0 = dreta ? W + 30 : -30;
      const a = nouAgent('client', c.look, c.seg, x0, 136); a.c = c; a.estat = 'carrer'; a.paciencia = c.pac;
      vesA(a, [[130, 136], N.porta, N.dins]);
    }
    function frasePerdut(c, m) {
      if (m === 1) return ['Massa car!', 'Uf, quin preu...', 'Això ho tinc més barat a una altra botiga'][c.look % 3];
      if (m === 2) return ({ preu: 'No hi ha res barat', qualitat: 'No hi ha res de qualitat', innovadors: 'No hi ha cap novetat', responsables: 'No hi ha res ecològic' })[c.seg];
      if (m === 3) return 'S\'ha acabat!';
      return 'Massa cua!';
    }
    function actualitzaClient(a, dt) {
      const c = a.c;
      if (a.estat === 'carrer') { if (mou(a, dt)) { if (c.motiu) { const i = Math.floor((c.look >> 3) % Math.max(1, e.nPrest)); const sl = e.prestatges[i] && e.prestatges[i].prod ? i : slotDe(e.prestatges.find(x => x && x.prod).prod); a.estat = 'mira'; a.slot = sl; viaNodes(a, frontSlot(sl), [SLOTS[sl][0] + ((c.look % 5) - 2) * 10, N[frontSlot(sl)][1]]); } else { a.slot = slotDe(c.prod); a.estat = 'vaPrest'; viaNodes(a, frontSlot(a.slot), [SLOTS[a.slot][0] + ((c.look % 5) - 2) * 10, N[frontSlot(a.slot)][1]]); } } return; }
      if (a.estat === 'mira') { if (mou(a, dt)) { a.estat = 'pensa'; a.timer = 1.1; } return; }
      if (a.estat === 'pensa') { a.timer -= dt; if (a.timer <= 0) { bombolla(a, frasePerdut(c, c.motiu), 'neg'); registra(c, 0, c.motiu); surt(a); } return; }
      if (a.estat === 'vaPrest') { if (mou(a, dt)) { a.estat = 'agafa'; a.timer = 0.6; a.espera = 0; } return; }
      if (a.estat === 'agafa') {
        a.timer -= dt; if (a.timer > 0) return;
        const n = Math.min(c.qty, prest[a.slot]);
        if (n <= 0) { a.espera += dt; if (a.espera === dt) bombolla(a, '...', ''); if (a.espera > 3) { bombolla(a, frasePerdut(c, 3), 'neg'); registra(c, 0, 3); surt(a); } return; }
        prest[a.slot] -= n; a.items = n; pinta(a.slot);
        a.div.querySelector('.carrega').innerHTML = iconaProd(c.prod, 18) + (n > 1 ? `<b>×${n}</b>` : '');
        a.estat = 'cua'; a.paciencia = c.pac; cua.push(a); viaNodes(a, 'pq', CUA[Math.min(cua.length - 1, CUA.length - 1)]);
        return;
      }
      if (a.estat === 'cua') {
        const pos = cua.indexOf(a), lloc = CUA[Math.min(pos, CUA.length - 1)];
        if (!a.path.length && dist([a.x, a.y], lloc) > 3) vesA(a, [lloc]);
        mou(a, dt);
        if (cobrant !== a) {
          a.paciencia -= dt;
          const f = Math.max(0, a.paciencia / c.pac); a.div.querySelector('.pac i').style.width = (f * 100) + '%'; a.div.classList.toggle('impacient', f < 0.35); a.div.classList.add('mostraPac');
          if (a.paciencia <= 0) { cua.splice(pos, 1); prest[a.slot] += a.items; pinta(a.slot); a.items = 0; a.div.querySelector('.carrega').innerHTML = ''; bombolla(a, frasePerdut(c, 4), 'neg'); registra(c, 0, 4); surt(a); }
        }
        return;
      }
      if (a.estat === 'surt') { if (mou(a, dt)) treu(a); }
    }
    function surt(a) {
      a.estat = 'surt'; a.div.classList.remove('mostraPac', 'impacient');
      const de = nodeProper(a.x, a.y), p = cami(de, 'porta').map(k => N[k]);
      const dreta = (a.c.look >> 1) % 2 === 0; p.push([130, 136], [dreta ? W + 40 : -40, 136]);
      vesA(a, p);
    }
    function cobra(dt) {
      const caixer = dependenta ? 'dependenta' : aLaCaixa() ? 'ninot' : null;
      const cap = cua[0];
      if (!caixer || !cap || dist([cap.x, cap.y], CUA[0]) > 4) { cobrant = null; return; }
      if (cobrant !== cap) { cobrant = cap; cobrarT = (0.75 + 0.15 * cap.items) * (caixer === 'dependenta' ? 1.4 : 1); cap.div.classList.add('cobrant'); }
      cobrarT -= dt;
      if (cobrarT <= 0) {
        cua.shift(); cap.div.classList.remove('cobrant', 'mostraPac', 'impacient');
        const v = cap.items * preuDe(cap.c.prod); registra(cap.c, cap.items, 0); monedes(N.caixa[0] + 40, N.caixa[1] - 30, '+' + preuTxt(v), 'diners');
        cap.div.querySelector('.carrega').innerHTML = '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M3 7h14l-2 11H5z" fill="#f8fafc"/><path d="M7 7a3 3 0 0 1 6 0" stroke="#f8fafc" fill="none" stroke-width="2"/></svg>';
        bombolla(cap, ['Gràcies!', 'Fins demà!', 'Molt bé!', 'Tornaré!'][cap.c.look % 4], 'pos'); cobrant = null; surt(cap);
      }
    }
    function empaqueta(dt) {
      if (!aPaquets() || !online.length) { empaquetant = null; return; }
      if (!empaquetant) { empaquetant = online[0]; empT = 1.4; }
      empT -= dt;
      if (empT <= 0) {
        online.shift(); const c = empaquetant.c, i = slotDe(c.prod);
        let n = Math.min(c.qty, mag[c.prod] || 0); mag[c.prod] -= n;
        if (n < c.qty && i >= 0) { const m = Math.min(c.qty - n, prest[i]); prest[i] -= m; n += m; }
        if (i >= 0) pinta(i);
        if (n > 0) { registra(c, n, 0); monedes(895, 250, '+' + preuTxt(n * preuDe(c.prod)), 'diners'); repartidor(); } else { registra(c, 0, 3); op.avis && op.avis('Comanda en línia sense estoc de ' + MD.productes[c.prod].nom.toLowerCase() + '.'); }
        empaquetant = null; pintaTauleta();
      }
    }
    function repartidor() { const a = nouAgent('repartidor', 9, null, W + 30, 300); a.estat = 'rep'; vesA(a, [[975, 300], [W + 40, 300]]); }
    function pintaTauleta() { badge.hidden = !online.length; badge.textContent = online.length; tauleta.classList.toggle('avisa', online.length > 0); }
    function arribaComanda(c) { online.push({ c, t0: temps }); pintaTauleta(); op.so && op.so('comanda'); }
    function visitaRival(v) {
      const look = Math.floor(Math.random() * 1000), seg = MD.SEG[Math.floor(Math.random() * 4)], xd = 470 + v.i * 165 + 114;
      const a = nouAgent('client', look, seg, look % 2 ? W + 30 : -30, 132); a.estat = 'rival'; a.div.classList.add('lluny');
      vesA(a, [[xd, 132], [xd, 112]]); a.rival = v.i;
    }

    function pas(dt) {
      temps += dt;
      const fr = temps / DUR;
      while (segC < clients.length && clients[segC].t <= fr) arribaClient(clients[segC++]);
      while (seguent < comandes.length && comandes[seguent].t <= fr) arribaComanda(comandes[seguent++]);
      while (segV < visites.length && visites[segV].t <= fr) visitaRival(visites[segV++]);
      // comandes caducades
      for (let k = online.length - 1; k >= 0; k--) { if (online[k] !== empaquetant && temps - online[k].t0 > online[k].c.pac) { registra(online[k].c, 0, 4); online.splice(k, 1); pintaTauleta(); op.avis && op.avis('Una comanda en línia ha caducat: el client l\'ha anul·lada.'); } }
      tascaNinot(dt); cobra(dt); empaqueta(dt);
      agents.slice().forEach(a => {
        if (a.bombT > 0) { a.bombT -= dt; if (a.bombT <= 0) a.div.querySelector('.bomb').hidden = true; }
        if (a.c) actualitzaClient(a, dt);
        else if (a.estat === 'rep' || a.estat === 'rival') { if (mou(a, dt)) { if (a.estat === 'rival') { compRival[a.rival]++; const r = inn.querySelectorAll('.rcomp')[a.rival]; r.hidden = false; r.textContent = compRival[a.rival]; } treu(a); } }
      });
      // Final del dia
      const queden = agents.some(a => a.c) || online.length || segC < clients.length || seguent < comandes.length;
      if ((fr >= 0.9 && !queden) || fr >= 1.4) acaba();
    }
    function acaba() {
      if (acabat) return; acabat = true; cancelAnimationFrame(raf);
      d.clients.forEach(c => { if (!res[c.id]) registra(c, 0, c.motiu || 4); });
      op.onFi && op.onFi(d.clients.map(c => res[c.id]), stats);
    }
    let estatT = 0;
    function bucle(t) {
      raf = requestAnimationFrame(bucle);
      const dt = Math.min(0.05, (t - (darrerT || t)) / 1000); darrerT = t;
      if (pausa || acabat) return;
      const passos = vel; for (let k = 0; k < passos; k++) pas(dt);
      estatT -= dt; if (estatT <= 0) { estatT = 0.25; op.onEstat && op.onEstat({ hora: horaDe(temps / DUR), fr: temps / DUR, vendes: stats.vendes, atesos: stats.atesos, perduts: stats.perduts, cua: cua.length, online: online.length, motius: stats.motius }); }
    }
    raf = requestAnimationFrame(bucle);
    return {
      pausa: (b) => { pausa = b; darrerT = 0; }, velocitat: (n) => { vel = n; }, auto: (b) => { auto = b; },
      destrueix: () => { acabat = true; cancelAnimationFrame(raf); ro.disconnect(); },
      acabaAra: () => { acaba(); }, get stats() { return stats; }
    };
  }
  function horaDe(fr) { const m = Math.round(9 * 60 + Math.min(1, fr / 0.9) * 11 * 60); return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }

  window.MBOT = { estatica, dia, iconaProd, persona, horaDe };
})();
