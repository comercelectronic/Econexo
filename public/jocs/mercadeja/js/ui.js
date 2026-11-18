/* Mercadeja · interfície: portada, planificació (les quatre P), botiga oberta, resultats, final, repte de classe i rànquing */
(function () {
  const MD = window.MD, ME = window.ME, I = window.MI.icon;
  const KEY = 'mercadeja-partida-v1', PREF = 'mercadeja-pref-v1';
  const app = document.getElementById('app');
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = (t) => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const eur = ME.eur, eur2 = ME.eur2;
  const pct = (v) => (Math.round(v * 10) / 10).toLocaleString('ca-ES') + ' %';
  const nf = (v) => Math.round(v).toLocaleString('ca-ES');
  let S = null, tm = null;
  const ui = { tab: 'prod', auto: false, empVista: 0, vista: 'tauler', mobil: 'tauler', tutDone: {} };
  let pref = { redueix: false, privat: false };
  try { pref = Object.assign(pref, JSON.parse(localStorage.getItem(PREF) || '{}')); } catch (e) { }
  const desaPref = () => { try { localStorage.setItem(PREF, JSON.stringify(pref)); } catch (e) { } document.body.classList.toggle('redueix', !!pref.redueix); };
  const desa = () => { try { if (S) localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } };
  const carrega = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } };
  const vel = (ms) => pref.redueix ? Math.min(ms, 120) : ms;
  const uid = () => 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const sec = () => MD.sectors[S.config.sector];
  const fitxaDef = (id) => MD.fitxes.find(f => f.id === id) || MD.fitxes[0];
  const fitxa = (e, cls) => { const f = fitxaDef(e.fitxa); return `<span class="fitxa ${cls || ''}" style="background:${f.color}" aria-hidden="true">${I(f.id)}</span>`; };
  const colorE = (e) => fitxaDef(e.fitxa).color;
  desaPref();

  /* ---------- Logotip i il·lustracions ---------- */
  function logoSVG() {
    return `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="2" y="2" width="60" height="60" rx="16" fill="#1D293B" stroke="#3b4c68" stroke-width="2"/>
      <rect x="12" y="34" width="8" height="18" rx="3" fill="#F29D49"/><rect x="24" y="26" width="8" height="26" rx="3" fill="#4EA5F5"/>
      <rect x="36" y="18" width="8" height="34" rx="3" fill="#E879B9"/><rect x="48" y="10" width="6" height="42" rx="3" fill="#9B7AE8"/>
      <path d="M10 30 L26 18 L36 24 L54 8" fill="none" stroke="#F5C542" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <g opacity=".9"><rect x="44" y="54" width="14" height="2" fill="#F5C542"/><rect x="44" y="56.5" width="14" height="1.4" fill="#DA121A"/><rect x="44" y="58.6" width="14" height="1.4" fill="#F5C542"/></g></svg>`;
  }
  const logo = (sub) => `<div class="logo">${logoSVG()}<div><span class="nom">MERCADEJA</span>${sub ? '<span class="sub">LA BOTIGA DEL BARRI</span>' : ''}</div></div>`;
  function skylineSVG() {
    // Ciutat empresarial il·lustrada: torres, naus, grues del port, una cooperativa i muntanyes al fons
    return `<svg class="skyline" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <path d="M0 260 L120 170 L220 230 L330 140 L440 220 L560 150 L700 230 L820 160 L950 220 L1080 150 L1200 210 V400 H0Z" fill="#17223a"/>
      <path d="M300 170 L330 140 L360 168Z M540 168 L560 150 L585 170Z M800 175 L820 160 L842 176Z" fill="#2a3a58"/>
      <g fill="#1d2b45">
        <rect x="40" y="250" width="70" height="150"/><rect x="120" y="210" width="50" height="190"/><rect x="180" y="280" width="90" height="120"/>
        <rect x="290" y="180" width="40" height="220"/><path d="M340 400V230l40-30 40 30v170z"/><rect x="440" y="260" width="120" height="140"/>
        <rect x="580" y="200" width="46" height="200"/><rect x="636" y="240" width="60" height="160"/><rect x="710" y="290" width="140" height="110"/>
        <rect x="870" y="220" width="54" height="180"/><rect x="934" y="260" width="80" height="140"/><rect x="1030" y="200" width="44" height="200"/><rect x="1084" y="270" width="116" height="130"/>
      </g>
      <g fill="none" stroke="#33476b" stroke-width="4"><path d="M720 290 L760 230 L840 230"/><path d="M760 230 V290"/><path d="M1100 270 L1140 220 L1190 220"/></g>
      <g fill="#F5C542" opacity=".55">
        ${Array.from({ length: 70 }, (_, k) => { const x = 50 + (k * 97) % 1120, y = 230 + (k * 53) % 150; return `<rect x="${x}" y="${y}" width="6" height="8" rx="1"/>`; }).join('')}
      </g>
      <path d="M0 360 H1200" stroke="#2a3a58" stroke-width="3"/></svg>`;
  }
  // Catalunya estilitzada (no és un mapa exacte): zones econòmiques i connexions comercials
  /* ---------- Avisos ---------- */
  function toast(t, cls) {
    let w = $('.toasts'); if (!w) { w = document.createElement('div'); w.className = 'toasts'; w.setAttribute('role', 'status'); document.body.appendChild(w); }
    const d = document.createElement('div'); d.className = 'toast ' + (cls || ''); d.textContent = t; w.appendChild(d);
    while (w.children.length > 3) w.firstChild.remove();
    setTimeout(() => d.remove(), 3800);
  }
  function animaDiners(antic, nou, x, y) {
    const d = nou - antic; if (!d || pref.redueix) return;
    const el = document.createElement('div'); el.className = 'diners-anim ' + (d > 0 ? 'pos' : 'neg');
    el.textContent = (d > 0 ? '+' : '') + eur(d); el.style.left = (x || innerWidth - 300) + 'px'; el.style.top = (y || 120) + 'px';
    document.body.appendChild(el); setTimeout(() => el.remove(), 1300);
  }
  function modal(html, onOpen, opts) {
    tancaModal();
    const m = document.createElement('div'); m.className = 'modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
    m.innerHTML = `<div class="modal-box">${html}</div>`; document.body.appendChild(m);
    if (opts && opts.tancable) m.addEventListener('click', (e) => { if (e.target === m) tancaModal(); });
    if (onOpen) onOpen(m);
    const f = m.querySelector('[data-focus]') || m.querySelector('button'); if (f) f.focus();
    return m;
  }
  function tancaModal() { $$('.modal').forEach(m => m.remove()); }
  function confirma(text, ok) {
    modal(`<h2>Confirmació</h2><p>${text}</p><div class="row"><button class="btn prim" data-focus id="si">Sí, endavant</button><button class="btn ghost" id="no">Cancel·lar</button></div>`, (m) => {
      m.querySelector('#si').onclick = () => { tancaModal(); ok(); }; m.querySelector('#no').onclick = tancaModal;
    }, { tancable: true });
  }

  /* ---------- Gràfics SVG ---------- */
  function linia(series, labels, fmt) {
    const W = 520, H = 220, L = 58, R = 12, T = 12, B = 28;
    const vals = series.flatMap(s => s.v); if (!vals.length) return '<p class="muted small">Encara no hi ha dades.</p>';
    let mn = Math.min(0, ...vals), mx = Math.max(...vals); if (mx === mn) mx = mn + 1;
    const x = (i) => L + (labels.length > 1 ? i * (W - L - R) / (labels.length - 1) : (W - L - R) / 2), y = (v) => T + (mx - v) * (H - T - B) / (mx - mn);
    const ticks = [mn, (mn + mx) / 2, mx];
    return `<svg viewBox="0 0 ${W} ${H}" role="img">${ticks.map(t => `<line x1="${L}" x2="${W - R}" y1="${y(t)}" y2="${y(t)}" stroke="#2c3b55"/><text x="${L - 6}" y="${y(t) + 4}" text-anchor="end">${fmt(t)}</text>`).join('')}
      ${mn < 0 ? `<line x1="${L}" x2="${W - R}" y1="${y(0)}" y2="${y(0)}" stroke="#6b7d98" stroke-dasharray="4 3"/>` : ''}
      ${labels.map((l, i) => `<text x="${x(i)}" y="${H - 8}" text-anchor="middle">${l}</text>`).join('')}
      ${series.map(s => `<polyline fill="none" stroke="${s.c}" stroke-width="2.5" points="${s.v.map((v, i) => x(i) + ',' + y(v)).join(' ')}"/>${s.v.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="3.5" fill="${s.c}"><title>${esc(s.n)} · ${labels[i]}: ${fmt(v)}</title></circle>`).join('')}`).join('')}</svg>`;
  }
  function barres(items, fmt) {
    const W = 520, rowH = 30, H = items.length * rowH + 8, L = 130, R = 70;
    const mx = Math.max(1, ...items.map(i => Math.abs(i.v)));
    return `<svg viewBox="0 0 ${W} ${H}" role="img">${items.map((it, k) => { const w = Math.abs(it.v) / mx * (W - L - R), yy = 4 + k * rowH;
      return `<text x="${L - 8}" y="${yy + 18}" text-anchor="end">${esc(it.n.length > 18 ? it.n.slice(0, 17) + '…' : it.n)}</text><rect x="${L}" y="${yy + 4}" width="${Math.max(2, w)}" height="${rowH - 10}" rx="5" fill="${it.v < 0 ? 'var(--vermell)' : it.c}"><title>${esc(it.n)}: ${fmt(it.v)}</title></rect><text x="${L + w + 6}" y="${yy + 18}">${fmt(it.v)}</text>`; }).join('')}</svg>`;
  }
  function donut(items) {
    const tot = items.reduce((a, b) => a + Math.max(0, b.v), 0); if (!tot) return '<p class="muted small">Encara no hi ha dades.</p>';
    let a0 = -Math.PI / 2; const R = 70, r = 42, cx = 90, cy = 90;
    const arcs = items.filter(i => i.v > 0).map(it => { const a1 = a0 + it.v / tot * Math.PI * 2, big = a1 - a0 > Math.PI ? 1 : 0;
      const p = `M${cx + R * Math.cos(a0)} ${cy + R * Math.sin(a0)} A${R} ${R} 0 ${big} 1 ${cx + R * Math.cos(a1)} ${cy + R * Math.sin(a1)} L${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} A${r} ${r} 0 ${big} 0 ${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)}Z`;
      a0 = a1; return `<path d="${p}" fill="${it.c}"><title>${esc(it.n)}: ${eur(it.v)} (${Math.round(it.v / tot * 100)} %)</title></path>`; });
    return `<div class="row" style="align-items:center;flex-wrap:nowrap"><svg viewBox="0 0 180 180" style="max-width:170px" role="img">${arcs.join('')}</svg>
      <div class="llegenda" style="flex-direction:column">${items.filter(i => i.v > 0).map(i => `<span><i style="background:${i.c}"></i>${esc(i.n)}: ${eur(i.v)} (${Math.round(i.v / tot * 100)} %)</span>`).join('')}</div></div>`;
  }
  function dispersio(punts, xl, yl) {
    const W = 520, H = 260, L = 46, R = 16, T = 14, B = 36;
    const xs = punts.map(p => p.x), ys = punts.map(p => p.y); let x0 = Math.min(...xs) * 0.9, x1 = Math.max(...xs) * 1.1, y0 = 0, y1 = 100; if (x1 === x0) x1 = x0 + 1;
    const X = (v) => L + (v - x0) / (x1 - x0) * (W - L - R), Y = (v) => T + (y1 - v) / (y1 - y0) * (H - T - B);
    return `<svg viewBox="0 0 ${W} ${H}" role="img"><rect x="${L}" y="${T}" width="${W - L - R}" height="${H - T - B}" fill="none" stroke="#2c3b55"/>
      <text x="${(W + L) / 2}" y="${H - 6}" text-anchor="middle">${esc(xl)}</text><text x="12" y="${(H - B) / 2}" transform="rotate(-90 12 ${(H - B) / 2})" text-anchor="middle">${esc(yl)}</text>
      <text x="${L + 6}" y="${T + 14}">Bon preu, alta qualitat</text><text x="${W - R - 6}" y="${H - B - 8}" text-anchor="end">Car i poca qualitat</text>
      ${punts.map(p => `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="9" fill="${p.c}" stroke="#fff" stroke-width="1.5"><title>${esc(p.n)}: ${eur(p.x)} · qualitat ${Math.round(p.y)}</title></circle><text x="${X(p.x) + 12}" y="${Y(p.y) + 4}" style="fill:var(--text)">${esc(p.n)}</text>`).join('')}</svg>`;
  }

  /* ---------- Portada ---------- */
  const primerHuma = () => 0;
  function portada() {
    clearTimeout(tm); aturaDia(); S = null;
    const desat = carrega(), pot = desat && desat.v === 2 && desat.fase !== 'final';
    app.innerHTML = `<main class="portada">${skylineSVG()}
      <div class="portada-box">
        ${logo(true)}
        <p class="lema">Porta la teva botiga de barri: tria què vens i a quin preu, fes-te conèixer i atén els clients abans que marxin a la competència.</p>
        <nav class="menu" aria-label="Menú principal">
          ${pot ? `<button class="btn prim big" data-a="continua">${I('play')} Continua <small>${esc(desat.empreses[0].nom)} · dia ${desat.ronda}${desat.config.rondes ? ' de ' + desat.config.rondes : ''} · ${esc(MD.FASES[(desat.empreses[0].fase || 1) - 1].nom)}</small></button>` : ''}
          <button class="btn ${pot ? '' : 'prim'} big" data-a="juga">${I('botiga')} Juga <small>la teva botiga</small></button>
          <button class="btn big" data-a="repte">${I('equip')} Repte de classe <small>amb codi del professor</small></button>
          <button class="btn big" data-a="docent">${I('escut')} Mode docent <small>reptes i rànquing</small></button>
          <button class="btn big" data-a="ajuda">${I('ajuda')} Com es juga</button>
        </nav>
        <p class="peu">Joc educatiu de màrqueting · botigues i productes fictius.<br>
          <label><input type="checkbox" id="redu" ${pref.redueix ? 'checked' : ''}> Redueix les animacions</label></p>
      </div></main>`;
    $('#redu').onchange = (e) => { pref.redueix = e.target.checked; desaPref(); };
    $$('[data-a]').forEach(b => b.onclick = () => {
      const a = b.dataset.a;
      if (a === 'continua') { S = desat; joc(); }
      else if (a === 'juga') configurar();
      else if (a === 'repte') repte();
      else if (a === 'docent') docent();
      else if (a === 'ajuda') ajuda();
    });
  }
  function configurar() {
    const cfg = { nom: '', rondes: 16, dificultat: 'mitja' };
    const draw = () => {
      app.innerHTML = `<main class="config" style="max-width:760px">
        <button class="btn ghost small" id="enrere">← Tornar</button>
        <h1>${I('botiga')} La teva botiga</h1>
        <p class="muted">Obres un petit rebost d'alimentació en un carrer on ja hi ha tres botigues més. Si ho fas bé, el pots fer créixer: botiga gran, supermercat, cadena de botigues i, finalment, una gran empresa. Guanya qui té més valor d'empresa al final.</p>
        <label class="f" style="max-width:420px">Nom de la botiga<input class="inp" id="nomB" value="${esc(cfg.nom)}" maxlength="30" placeholder="Ex.: El Rebost del Barri"></label>
        <h2>Durada i dificultat</h2>
        <div class="row"><div class="seg" role="group" aria-label="Dies">${[12, 16, 20, 0].map(r => `<button data-rondes="${r}" class="${cfg.rondes === r ? 'on' : ''}">${r ? r + ' dies' : 'Lliure'}</button>`).join('')}</div>
          <div class="seg" role="group" aria-label="Dificultat">${[['facil', 'Rivals fàcils'], ['mitja', 'Rivals normals'], ['dificil', 'Rivals difícils']].map(([k, n]) => `<button data-dif="${k}" class="${cfg.dificultat === k ? 'on' : ''}">${n}</button>`).join('')}</div></div>
        <p class="small muted">Amb 16 o 20 dies hi ha temps per arribar a gran empresa. En mode lliure, jugues tants dies com vulguis i acabes quan decideixes.</p>
        <div class="barra"><button class="btn ghost" id="enrere2">Cancel·lar</button><button class="btn prim big" id="go">${I('play')} Obrir la botiga</button></div></main>`;
      const llegeix = () => { cfg.nom = $('#nomB').value.trim().slice(0, 30); };
      $('#enrere').onclick = $('#enrere2').onclick = portada;
      $$('[data-rondes]').forEach(b => b.onclick = () => { llegeix(); cfg.rondes = +b.dataset.rondes; draw(); });
      $$('[data-dif]').forEach(b => b.onclick = () => { llegeix(); cfg.dificultat = b.dataset.dif; draw(); });
      $('#go').onclick = () => {
        llegeix(); const nom = cfg.nom || 'El Rebost del Barri';
        if (MD.RIVALS.some(r => r.nom.toLowerCase() === nom.toLowerCase())) return toast('Aquest nom ja el fa servir una botiga rival.', 'neg');
        comencar({ nom: 'Partida', rondes: cfg.rondes, dificultat: cfg.dificultat, sector: 'alimentacio', empreses: [{ nom, humana: true, membres: [] }] });
      };
    };
    draw();
  }
  function comencar(cfg) {
    S = ME.crearPartida(Object.assign({}, cfg, { llavor: ((Date.now() % 2000000000) | 1) }));
    S.reg = []; S.regOk = true; fia('I'); ui.tab = 'prod';
    desa(); joc();
  }

  /* ---------- Pantalla de joc ---------- */
  let dia = null;   // controlador de la botiga oberta
  const aturaDia = () => { if (dia) { dia.destrueix(); dia = null; } };
  function joc() {
    aturaDia();
    if (!S) return portada();
    if (S.fase === 'final') return final();
    if (S.fase === 'botiga') return pantallaBotiga();
    if (S.fase === 'resultats') return pantallaResultats();
    return pantallaPlan();
  }
  const render = () => joc();
  const tick = () => { };
  function capcalera(extra) {
    const e = ME.jugador(S), p = llProgres(e), pend = llPendents(e).length;
    return `<header class="top">${logo(false)}<div class="info">
        <span class="chip">${I('rellotge')} Dia ${S.ronda}${S.config.rondes ? ' de ' + S.config.rondes : ''}</span>
        <span class="chip fase-emp" title="Fase de l'empresa">${I(ME.faseDe(e).icona)} <span class="amaga-mobil">${esc(ME.faseDe(e).nom)}</span><span class="nomes-mobil">F${e.fase}</span></span>
        <span class="chip fase">${esc(ME.NOM_FASE[S.fase])}</span>
        <span class="chip"><b>${esc(e.nom)}</b></span>
        <span class="chip diners">${I('moneda')} ${eur(e.diners)}</span>
        ${S.config.repte ? `<span class="chip amaga-mobil">${I('equip')} ${esc(S.config.repte.nom || S.config.repte.codi)}</span>` : ''}${extra || ''}</div>
      <div class="acc"><button class="btn small ghost" id="bLl" aria-label="Lliçons">${I('llibre')} <span class="amaga-mobil">Lliçons</span> <b class="nll">${p.n}/${LL.length}</b>${pend ? '<i class="punt"></i>' : ''}</button>
        ${S.config.repte ? `<button class="btn small ghost" id="bEnvia" aria-label="Envia el resultat">${I('descarrega')}</button>` : ''}
        <button class="btn small ghost" id="bAjuda" aria-label="Com es juga">${I('ajuda')}</button><button class="btn small ghost" id="bMenu" aria-label="Menú">${I('tauler')}</button></div></header>`;
  }
  function lligaCapcalera() {
    $('#bMenu').onclick = () => { desa(); portada(); };
    $('#bAjuda').onclick = ajuda;
    $('#bLl').onclick = modalLlicons;
    if ($('#bEnvia')) $('#bEnvia').onclick = modalCodi;
  }
  function modalLlicons() {
    const e = ME.jugador(S), p = llProgres(e);
    modal(`<h2>${I('llibre')} Lliçons</h2><p class="small muted">Surten quan a la botiga passa alguna cosa que té a veure amb el mòdul de màrqueting. ${p.des.length} de ${LL.length} descobertes · ${p.n} respostes · ${p.enc} encerts.</p>${graellaLlicons(e)}<div class="row" style="margin-top:12px"><button class="btn" id="tc" data-focus>Tancar</button></div>`, (m) => {
      $('#tc', m).onclick = () => { tancaModal(); render(); };
      $$('[data-ll]', m).forEach(b => b.onclick = () => mostraLlico(LL.find(l => l.id === b.dataset.ll), e, () => modalLlicons()));
    }, { tancable: true });
    $('.modal-box').classList.add('ample');
  }

  /* ---------- Lliçons: quan surten ---------- */
  const llVist = {};
  function llPausa(clau, max, fet) {
    const e = ME.jugador(S), k = S.ronda + '-' + clau;
    if (llVist[k] || !llPendents(e).length) return fet ? fet() : null;
    llVist[k] = 1; mostraLlicons(e, max, fet);
  }

  /* ---------- Matí: planificació de les quatre P ---------- */
  const PESTANYES = [['prod', 'paquet', 'Producte i preu', 'pc-producte'], ['estoc', 'magatzem', 'Estoc', 'pc-dist'], ['dist', 'camio', 'Distribució', 'pc-dist'], ['promo', 'megafon', 'Promoció', 'pc-promo'], ['mercat', 'lupa', 'Mercat', 'pc-fin'], ['empresa', 'edifici', 'Empresa', 'pc-fin']];
  function pantallaPlan() {
    const e = ME.jugador(S), ev = ME.esdeveniment(S.esdeveniment);
    app.innerHTML = `<div class="joc2">${capcalera()}
      <div class="plan"><section class="plan-esc"><div class="ev-card"><span class="muted small">${I('rellotge')} Avui al barri</span><b>${esc(ev.titol)}</b><span>${esc(ev.text)}</span></div><div id="escena"></div>
        <p class="pista">Toca una prestatgeria per canviar-ne el producte i el preu.</p></section>
        <aside class="plan-panel"><nav class="tabs ptabs" role="tablist">${PESTANYES.map(([k, ic, n]) => `<button role="tab" aria-selected="${ui.tab === k}" class="${ui.tab === k ? 'on' : ''}" data-tab="${k}">${I(ic)} ${n}</button>`).join('')}</nav>
          <div id="pcont"></div>
          <div class="obrir"><div class="small muted" id="resum"></div><button class="btn prim big" id="obrir">${I('play')} Obrir la botiga</button></div></aside></div></div>`;
    lligaCapcalera();
    MBOT.estatica($('#escena'), S, { onPrestatge: (i) => editaPrestatge(i), onNou: () => compraPrestatge(), onTauleta: () => { ui.tab = 'dist'; pantallaPlan(); }, onTaulell: () => { ui.tab = 'dist'; pantallaPlan(); }, onMagatzem: () => { ui.tab = 'estoc'; pantallaPlan(); }, onAparador: () => { ui.tab = 'promo'; pantallaPlan(); } });
    $$('[data-tab]').forEach(b => b.onclick = () => { ui.tab = b.dataset.tab; pantallaPlan(); });
    const cont = $('#pcont');
    ({ prod: tabProd, estoc: tabEstoc, dist: tabDist, promo: tabPromo, mercat: tabMercat, empresa: tabEmpresa })[ui.tab](cont, e);
    const despesa = S.log.filter(l => l.ronda === S.ronda && l.emp === 0 && l.import < 0).reduce((a, l) => a - l.import, 0);
    $('#resum').innerHTML = `Despeses d'avui fins ara: <b>${eur(despesa)}</b>${e.aparador ? ' + aparador ' + eur(MD.aparadors[e.aparador].cost) : ''}. Cada dia, lloguer i llum: ${eur(MD.FIXOS + ME.faseDe(e).fixos)}${serveisDia(e) ? ' · serveis: ' + eur(serveisDia(e)) : ''}${personalDia(e) ? ' · personal: ' + eur(personalDia(e)) : ''}${e.botigues.length ? ' · ' + e.botigues.length + ' botigues més a la cadena' : ''}.`;
    $('#obrir').onclick = obrirBotiga;
    tutorial('plan', () => llPausa('p', 1));
  }
  const serveisDia = (e) => Object.keys(e.serveis).filter(k => e.serveis[k] && MD.serveis[k]).reduce((a, k) => a + MD.serveis[k].cost, 0);
  const personalDia = (e) => Object.keys(MD.PERSONAL).reduce((a, k) => a + (e.personal[k] || 0) * MD.PERSONAL[k].cost, 0);
  function accio(a, desa2) { const r = fa(Object.assign({ id: uid() }, a)); if (!r.ok) toast(r.err, 'neg'); if (desa2 !== false) desa(); return r; }

  // Qui compraria aquest producte a aquest preu?
  function quiCompra(p, preu) {
    const P = MD.productes[p], ratio = preu / P.ref;
    return MD.SEG.map(k => { const sg = MD.segments[k], a = ME.encaix(k, p); const est = a < sg.min ? 'no' : ratio > sg.maxPreu ? 'car' : 'si';
      return `<span class="qc ${est}" title="${esc(sg.nom)}: ${est === 'si' ? 'li interessa a aquest preu' : est === 'car' ? 'li interessa, però el troba massa car' : 'no és el que busca'}" style="--c:${sg.color}">${I(sg.icona)}<i>${est === 'si' ? '✓' : est === 'car' ? '€' : '–'}</i></span>`; }).join('');
  }
  function tabProd(cont, e) {
    cont.innerHTML = `<p class="small muted">Producte i preu: què hi ha a cada prestatgeria i quant costa. Les icones indiquen quins clients el comprarien (✓), el troben car (€) o no el volen (–).</p>
      <div class="pcards">${e.prestatges.slice(0, e.nPrest).map((x, i) => {
        if (!x || !x.prod) return `<div class="pcard buida"><b>Prestatgeria ${i + 1}</b><button class="btn small" data-tria="${i}">${I('mes')} Tria un producte</button></div>`;
        const P = MD.productes[x.prod], m = x.preu - ME.costUnit(e, x.prod);
        return `<div class="pcard"><div class="pc-cap">${MBOT.iconaProd(x.prod, 34)}<div><b>${esc(P.nom)}</b>${P.marca ? ' <span class="tag">marca pròpia</span>' : ''}<span class="small muted">Cost ${eur2(ME.costUnit(e, x.prod))} · preu de mercat ${eur2(P.ref)}${P.perible ? ' · perible' : ''}</span></div><button class="btn small ghost" data-tria="${i}">Canviar</button></div>
          <div class="preu-ctl"><button class="btn small" data-menys="${i}" aria-label="Abaixar el preu">−</button><span class="preu-v">${eur2(x.preu)}</span><button class="btn small" data-mes="${i}" aria-label="Apujar el preu">+</button>
            <span class="marge ${m <= 0 ? 'neg' : ''}">marge ${eur2(m)} (${Math.round(m / x.preu * 100)} %)</span></div>
          <div class="qcs">${quiCompra(x.prod, x.preu * (e.promosDia.includes('descompte') ? 0.9 : 1))}</div></div>`;
      }).join('')}</div>
      ${e.nPrest < ME.faseDe(e).slots ? `<button class="btn small" id="novaP">${I('mes')} Prestatgeria nova (${eur(MD.PRESTATGE_COST)}): més varietat</button>` : e.fase < MD.FASES.length ? `<p class="small muted">${I('edifici')} No hi caben més prestatgeries. Per tenir-ne més, fes créixer la botiga a la pestanya «Empresa».</p>` : ''}`;
    $$('[data-tria]', cont).forEach(b => b.onclick = () => triaProducte(+b.dataset.tria));
    const canvia = (i, d) => { const x = e.prestatges[i], ref = MD.productes[x.prod].ref; const v = Math.round((x.preu + d) * 20) / 20; if (v < ref * MD.PREU_MIN || v > ref * MD.PREU_MAX) return toast('El preu ha d\'estar entre ' + eur2(ref * MD.PREU_MIN) + ' i ' + eur2(ref * MD.PREU_MAX) + '.', 'neg'); accio({ tipus: 'preu', slot: i, valor: v }); pantallaPlan(); };
    $$('[data-menys]', cont).forEach(b => b.onclick = () => canvia(+b.dataset.menys, -(MD.productes[e.prestatges[+b.dataset.menys].prod].ref >= 4 ? 0.25 : 0.05)));
    $$('[data-mes]', cont).forEach(b => b.onclick = () => canvia(+b.dataset.mes, MD.productes[e.prestatges[+b.dataset.mes].prod].ref >= 4 ? 0.25 : 0.05));
    if ($('#novaP', cont)) $('#novaP', cont).onclick = compraPrestatge;
  }
  function compraPrestatge() {
    confirma(`Comprar una prestatgeria nova per <b>${eur(MD.PRESTATGE_COST)}</b>? Podràs vendre un producte més. Conserva part del valor (és una inversió).`, () => { const r = accio({ tipus: 'prestatge' }); if (r.ok) { ui.tab = 'prod'; pantallaPlan(); triaProducte(ME.jugador(S).nPrest - 1); } });
  }
  function editaPrestatge(i) { if (ui.tab !== 'prod') { ui.tab = 'prod'; pantallaPlan(); } triaProducte(i); }
  function triaProducte(i) {
    const e = ME.jugador(S), actual = e.prestatges[i] && e.prestatges[i].prod;
    const bar = (v, c) => `<span class="bar"><i style="width:${v}%;background:${c}"></i></span>`;
    modal(`<h2>${I('paquet')} Prestatgeria ${i + 1}: tria el producte</h2><p class="small muted">Cada producte agrada a uns clients diferents. Bàsic i barat → estalviadors · Qualitat → exigents · Novetat → moderns · Eco → responsables.</p>
      <div class="cataleg">${MD.PROD.filter(p => !MD.productes[p].marca || e.millores.marca).map(p => { const P = MD.productes[p], altre = e.prestatges.some((x, k) => k !== i && x && x.prod === p);
        return `<button class="prod ${p === actual ? 'on' : ''}" data-p="${p}" ${altre ? 'disabled' : ''}>${MBOT.iconaProd(p, 38)}<b>${esc(P.nom)}</b><span class="small muted">${esc(P.desc)}</span>
          <span class="attrs"><span>Bàsic</span>${bar(P.bas, '#F5C542')}<span>Qualitat</span>${bar(P.q, '#4EA5F5')}<span>Eco</span>${bar(P.eco, '#36B37E')}<span>Novetat</span>${bar(P.nou, '#E879B9')}</span>
          <span class="small">${P.marca ? '<span class="tag">marca pròpia</span> ' : ''}Cost ${eur2(ME.costUnit(e, p))} · es ven a ${eur2(P.ref)}${P.perible ? ' · <span class="neg">perible</span>' : ''}${(e.estoc[p] || 0) ? ' · ' + e.estoc[p] + ' u. al magatzem' : ''}</span>
          <span class="qcs">${quiCompra(p, P.ref)}</span>${altre ? '<span class="small muted">Ja és en una altra prestatgeria</span>' : ''}</button>`; }).join('')}</div>
      ${e.fase >= 3 && !e.millores.marca ? `<p class="small muted">${I('etiqueta')} Amb la millora «Marca pròpia» (pestanya Empresa) podràs vendre productes amb el teu nom.</p>` : ''}
      <div class="row" style="margin-top:12px">${actual ? '<button class="btn ghost" id="buida">Deixar-la buida</button>' : ''}<button class="btn" id="tc">Tancar</button></div>`, (m) => {
      $$('[data-p]', m).forEach(b => b.onclick = () => { const r = accio({ tipus: 'producte', slot: i, prod: b.dataset.p }); if (r.ok) { tancaModal(); if (!(ME.jugador(S).estoc[b.dataset.p] > 0)) toast('No en tens estoc: demana\'n a la pestanya «Estoc».', ''); ui.tab = (ME.jugador(S).estoc[b.dataset.p] > 0) ? 'prod' : 'estoc'; pantallaPlan(); } });
      if ($('#buida', m)) $('#buida', m).onclick = () => { accio({ tipus: 'producte', slot: i, prod: null }); tancaModal(); pantallaPlan(); };
      $('#tc', m).onclick = tancaModal;
    }, { tancable: true });
    $('.modal-box').classList.add('ample');
  }
  function tabEstoc(cont, e) {
    const ahir = e.darrer ? e.darrer.venuts || {} : {};
    const prods = e.prestatges.slice(0, e.nPrest).filter(x => x && x.prod).map(x => x.prod);
    Object.keys(e.estoc).forEach(p => { if (e.estoc[p] > 0 && !prods.includes(p)) prods.push(p); });
    cont.innerHTML = `<p class="small muted">Estoc (distribució): compra caixes de ${MD.CAIXA} unitats al proveïdor. Si en falta, les prestatgeries es buiden i els clients marxen. Si en sobra, el producte perible es fa malbé en un ${Math.round(MD.MERMA * 100 * (e.millores.nevera ? 0.3 : 1))} % cada nit${e.millores.nevera ? ' (gràcies a la nevera)' : ''}.${e.millores.central ? ' El magatzem central compra un ' + Math.round((1 - MD.CENTRAL) * 100) + ' % més barat.' : ''}</p>
      <div class="pcards">${prods.map(p => { const P = MD.productes[p], u = e.estoc[p] || 0, v = ahir[p] || 0, sugg = Math.max(0, Math.ceil(((v || 25) * 1.15 - u) / MD.CAIXA)), aLaBotiga = e.prestatges.slice(0, e.nPrest).some(x => x && x.prod === p);
        return `<div class="pcard"><div class="pc-cap">${MBOT.iconaProd(p, 30)}<div><b>${esc(P.nom)}</b><span class="small muted">${u} unitats al magatzem${e.darrer ? ' · ahir en vas vendre ' + v : ''}${P.perible ? ' · <span class="neg">perible</span>' : ''}${aLaBotiga ? '' : ' · <span class="neg">no és a cap prestatgeria</span>'}</span></div></div>
          <div class="row">${(e.fase >= 3 ? [1, 3, 6] : [1, 3]).map(n => `<button class="btn small" data-c="${p}" data-n="${n}">+${n} caixa${n > 1 ? 'es' : ''} · ${eur2(n * MD.CAIXA * ME.costUnit(e, p))}</button>`).join('')}${sugg && aLaBotiga ? `<span class="small muted">Suggeriment: ${sugg} caixa${sugg > 1 ? 'es' : ''}</span>` : ''}</div></div>`; }).join('') || '<p class="muted">Primer posa productes a les prestatgeries.</p>'}</div>`;
    $$('[data-c]', cont).forEach(b => b.onclick = () => { const r = accio({ tipus: 'comanda', prod: b.dataset.c, caixes: +b.dataset.n }); if (r.ok) { toast('Comprat! Arriba al magatzem.', 'pos'); pantallaPlan(); } });
  }
  function tabDist(cont, e) {
    const sv = MD.serveis, F = ME.faseDe(e);
    const personal = Object.keys(MD.PERSONAL).map(k => { const x = MD.PERSONAL[k], max = k === 'caixera' ? F.caixes : F.reposadors, n = e.personal[k] || 0;
      return `<div class="pcard ${n ? 'actiu' : ''}"><div class="pc-cap"><span class="ic-gran">${I(x.icona)}</span><div><b>${esc(x.nom)}</b><span class="small muted">${esc(x.desc)}</span>
        <span class="small">${eur(x.cost)} per persona i dia · ${max ? 'fins a ' + max + ' en aquesta fase' : 'cal una botiga més gran'}</span></div></div>
        ${max ? `<div class="seg" role="group" aria-label="${esc(x.nom)}">${Array.from({ length: max + 1 }, (_, v) => `<button data-pers="${k}" data-n="${v}" class="${n === v ? 'on' : ''}">${v}</button>`).join('')}</div>` : ''}</div>`; }).join('');
    cont.innerHTML = `<p class="small muted">Distribució: com arriba el producte al client. La botiga és venda tradicional amb taulell; ${e.fase >= 3 ? 'el supermercat és autoservei: el client agafa el producte i paga a la caixa; ' : ''}la botiga en línia és venda sense establiment, amb repartiment.</p>
      <h3 class="h3">Personal</h3><div class="pcards">${personal}</div>
      <h3 class="h3">Serveis</h3><div class="pcards">${Object.keys(sv).map(k => { const x = sv[k], on = e.serveis[k];
        return `<div class="pcard ${on ? 'actiu' : ''}"><div class="pc-cap"><span class="ic-gran">${I(x.icona)}</span><div><b>${esc(x.nom)}</b><span class="small muted">${esc(x.desc)}</span>
          <span class="small">${eur(x.cost)} cada dia${k === 'online' ? (e.onlineActivat ? ' · ja creada' : ' · crear-la: ' + eur(x.activar)) + ' · ' + eur2(x.perComanda) + ' per comanda' : ''}</span></div></div>
          <button class="btn small ${on ? 'verd' : ''}" data-sv="${k}">${on ? I('ok') + ' Activat · desactivar' : k === 'online' && !e.onlineActivat ? 'Crear la botiga en línia · ' + eur(x.activar) : 'Activar'}</button></div>`; }).join('')}</div>`;
    $$('[data-sv]', cont).forEach(b => b.onclick = () => { const k = b.dataset.sv; accio({ tipus: 'servei', servei: k, actiu: !e.serveis[k] }); pantallaPlan(); });
    $$('[data-pers]', cont).forEach(b => b.onclick = () => { accio({ tipus: 'personal', rol: b.dataset.pers, n: +b.dataset.n }); pantallaPlan(); });
  }
  function tabPromo(cont, e) {
    cont.innerHTML = `<p class="small muted">Promoció: fes-te conèixer. La notorietat (${Math.round(e.not)}/100) baixa cada dia si no comuniques. Cada acció arriba més a uns clients que a uns altres.</p>
      <h3 class="h3">Aparador (marxandatge) · ${eur(MD.aparadors.oferta.cost)} el dia</h3><div class="seg aparadors">${[['', 'Sense tema']].concat(Object.entries(MD.aparadors).map(([k, a]) => [k, a.nom])).map(([k, n]) => `<button data-ap="${k}" class="${(e.aparador || '') === k ? 'on' : ''}">${k ? I(MD.segments[MD.aparadors[k].seg].icona) + ' ' : ''}${esc(n)}</button>`).join('')}</div>
      <h3 class="h3">Accions d'avui</h3><div class="pcards">${MD.PROMO.filter(k => !MD.promos[k].fase || e.fase >= MD.promos[k].fase - 1).map(k => { const p = MD.promos[k], on = e.promosDia.includes(k), tancat = p.fase && e.fase < p.fase;
        return `<div class="pcard ${on ? 'actiu' : ''}"><div class="pc-cap"><span class="ic-gran">${I(p.icona)}</span><div><b>${esc(p.nom)}</b> <span class="tag">${esc(p.tipus)}</span><span class="small muted">${esc(p.desc)}</span>
          <span class="qcs">${p.seg.map(s2 => `<span class="qc si" style="--c:${MD.segments[s2].color}" title="${esc(MD.segments[s2].nom)}">${I(MD.segments[s2].icona)}</span>`).join('')}</span></div></div>
          <button class="btn small ${on ? 'verd' : ''}" data-pr="${k}" ${on || tancat ? 'disabled' : ''}>${tancat ? 'Quan siguis ' + esc(MD.FASES[p.fase - 1].nom.toLowerCase()) : on ? I('ok') + ' Contractada' : (p.cost ? 'Contractar · ' + eur(p.cost) : 'Aplicar avui')}</button></div>`; }).join('')}</div>`;
    $$('[data-ap]', cont).forEach(b => b.onclick = () => { accio({ tipus: 'aparador', tema: b.dataset.ap || null }); pantallaPlan(); });
    $$('[data-pr]', cont).forEach(b => b.onclick = () => { const r = accio({ tipus: 'promo', promo: b.dataset.pr }); if (r.ok) pantallaPlan(); });
  }
  function tabMercat(cont, e) {
    const ev = ME.esdeveniment(S.esdeveniment), enq = e.enquesta;
    cont.innerHTML = `<div class="caixa groc"><b>${esc(ev.titol)}</b><p class="small" style="margin:4px 0">${esc(ev.text)}</p><p class="small muted" style="margin:0">${I('bombeta')} ${esc(ev.aprenem)}</p></div>
      <h3 class="h3">Les botigues del carrer</h3><div class="pcards">${S.empreses.slice(1).map((r, i) => { const d = r.darrer, def = MD.RIVALS[i];
        return `<div class="pcard"><div class="pc-cap"><span class="ic-gran" style="color:${def.color}">${I('botiga')}</span><div><b>${esc(r.nom)}</b><span class="small muted">${esc(def.desc)} Ven: ${def.prods.map(p => MD.productes[p].nom.toLowerCase()).join(', ')}.</span>
          <span class="small">${d ? `Ahir: ${Math.round(d.clients)} clients · preus al ${Math.round(d.preuMitja * 100)} % del mercat · ` : ''}notorietat ${Math.round(r.not)}</span></div></div></div>`; }).join('')}</div>
      <h3 class="h3">Enquesta als clients del barri (investigació comercial)</h3>
      ${enq ? `<div class="taula-w"><table class="t"><thead><tr><th>Client</th><th class="n">Passen pel carrer</th><th class="n">Vindrien a tu</th><th>Més els atrau</th><th>Productes que busquen</th></tr></thead><tbody>
        ${MD.SEG.map(k => `<tr><td>${I(MD.segments[k].icona)} ${esc(MD.segments[k].nom)}</td><td class="n">${enq[k].gent}</td><td class="n">${enq[k].teus}</td><td class="small">${esc(enq[k].millorRival.nom)} (${enq[k].millorRival.n})</td><td class="small">${enq[k].prefs.map(p => esc(MD.productes[p].nom)).join(', ')}</td></tr>`).join('')}</tbody></table></div>`
        : `<p class="small">Pregunta als veïns què busquen i on compren avui. Cost: ${eur(MD.ENQUESTA_COST)}.</p><button class="btn small" id="enq">${I('lupa')} Fer l'enquesta</button>`}
      <h3 class="h3">Objectiu de vendes d'avui</h3><p class="small muted">Fixa un objectiu i al vespre compara'l amb el resultat (control del pla).</p>
      <div class="row"><input class="inp" type="number" id="obj" min="0" step="50" value="${e.objectiu || ''}" placeholder="${e.darrer ? Math.round(e.darrer.ingressos / 50) * 50 : 500}" style="max-width:160px" aria-label="Objectiu de vendes en euros"><span>€</span><button class="btn small" id="objOk">Desar</button></div>`;
    if ($('#enq', cont)) $('#enq', cont).onclick = () => { const r = accio({ tipus: 'enquesta' }); if (r.ok) pantallaPlan(); };
    $('#objOk', cont).onclick = () => { accio({ tipus: 'objectiu', valor: +$('#obj', cont).value || 0 }); toast('Objectiu desat.', 'pos'); pantallaPlan(); };
  }
  function tabEmpresa(cont, e) {
    const F = ME.faseDe(e), sf = ME.seguentFase(S, e), v = ME.valorEmpresa(S, e), h = e.darrer;
    const escala = MD.FASES.map(x => `<li class="${x.n < e.fase ? 'fet' : x.n === e.fase ? 'ara' : ''}"><span class="ic">${I(x.icona)}</span><div><b>${x.n}. ${esc(x.nom)}</b><span class="small muted">${esc(x.desc)}</span>${x.n > 1 ? `<span class="small">Valor d'empresa ${eur(x.valor)} · inversió ${eur(x.cost)}${x.minBotigues ? ' · ' + x.minBotigues + ' botigues a la cadena' : ''}${x.fixos ? ' · lloguer +' + eur(x.fixos) + '/dia' : ''}</span>` : ''}</div></li>`).join('');
    const millores = Object.keys(MD.MILLORES).filter(k => e.fase >= MD.MILLORES[k].fase - 1).map(k => { const M = MD.MILLORES[k], te = e.millores[k], tancat = e.fase < M.fase;
      return `<div class="pcard ${te ? 'actiu' : ''}"><div class="pc-cap"><span class="ic-gran">${I(M.icona)}</span><div><b>${esc(M.nom)}</b><span class="small muted">${esc(M.desc)}</span><span class="small">Inversió ${eur(M.cost)}${M.dia ? ' · ' + eur(M.dia) + ' cada dia' : ''}</span></div></div>
        <button class="btn small ${te ? 'verd' : ''}" data-mill="${k}" ${te || tancat ? 'disabled' : ''}>${te ? I('ok') + ' Feta' : tancat ? 'Fase ' + M.fase + ': ' + esc(MD.FASES[M.fase - 1].nom.toLowerCase()) : 'Invertir · ' + eur(M.cost)}</button></div>`; }).join('');
    const ultimaCad = h && h.cadena ? Object.fromEntries(h.cadena.map(b => [b.lloc, b])) : {};
    const llocs = e.fase >= 3 ? MD.LLOCS.map(L => { const te = e.botigues.find(b => b.lloc === L.id), d = ultimaCad[L.id];
      return `<div class="pcard ${te ? 'actiu' : ''}"><div class="pc-cap"><span class="ic-gran">${I('botiga')}</span><div><b>${esc(L.nom)}</b><span class="small muted">Hi passen uns ${L.transit} clients al dia · lloguer ${eur(L.lloguer)}/dia + gerent ${eur(MD.GERENT.cost)}/dia</span>
        ${d ? `<span class="small">Ahir: ${d.clients} clients · vendes ${eur(d.ingressos)} · resultat <b class="${d.resultat >= 0 ? 'pos' : 'neg'}">${eur(d.resultat)}</b></span>` : ''}</div></div>
        <button class="btn small ${te ? 'verd' : ''}" data-lloc="${L.id}" ${te || e.fase < 4 ? 'disabled' : ''}>${te ? I('ok') + ' Oberta des del dia ' + te.des : e.fase < 4 ? 'Quan siguis una cadena' : 'Obrir-hi una botiga · ' + eur(L.obrir)}</button></div>`; }).join('') : '';
    const prodsB2B = MD.PROD.filter(p => !MD.productes[p].perible && (!MD.productes[p].marca || e.millores.marca));
    const b2b = e.fase >= 4 ? `<h3 class="h3">${I('camio')} Venda a altres empreses (B2B)</h3>
      <p class="small muted">Bars, restaurants i botigues petites et compren a l'engròs cada dia: a un ${Math.round(MD.B2B.preu * 100)} % del preu de mercat, però en grans volums.${e.fase < 5 ? ' Disponible quan siguis una gran empresa.' : ''}</p>
      ${e.fase >= 5 ? `<div class="row"><select class="inp" id="b2bP" style="max-width:220px" aria-label="Producte per a empreses">${prodsB2B.map(p => `<option value="${p}" ${e.b2b.prod === p ? 'selected' : ''}>${esc(MD.productes[p].nom)} (${eur2(MD.productes[p].ref * MD.B2B.preu)} · cost ${eur2(ME.costUnit(e, p))})</option>`).join('')}</select>
        <div class="seg" role="group" aria-label="Unitats al dia">${MD.B2B.volums.map(n => `<button data-b2b="${n}" class="${(e.b2b.volum || 0) === n ? 'on' : ''}">${n ? n + ' u./dia' : 'No'}</button>`).join('')}</div></div>
        ${h && h.b2b ? `<p class="small">Ahir: ${h.b2b.volum} u. de ${esc(MD.productes[h.b2b.prod].nom.toLowerCase())} · vendes ${eur(h.b2b.ingressos)} · marge <b class="pos">${eur(h.b2b.resultat)}</b></p>` : ''}` : ''}` : '';
    const maxP = MD.PRESTEC.max[e.fase - 1], potDemanar = Math.max(0, maxP - (e.deute || 0));
    cont.innerHTML = `<p class="small muted">Créixer és invertir: un local més gran, personal i noves botigues costen diners, però multipliquen els clients. Cal que la botiga ja funcioni bé (valor d'empresa) i tenir diners per a la inversió.</p>
      <div class="kpis-mini"><div><span>Valor de l'empresa</span><b>${eur(v.total)}</b></div><div><span>Diners</span><b>${eur(e.diners)}</b></div><div><span>Deute</span><b class="${e.deute ? 'neg' : ''}">${eur(e.deute || 0)}</b></div></div>
      ${sf ? `<div class="caixa ${sf.pot ? 'verd' : 'groc'}" style="margin:10px 0"><b>Fase següent: ${esc(sf.F.nom)}</b><p class="small" style="margin:4px 0">${esc(sf.F.desc)}</p>
        ${sf.pot ? `<button class="btn prim" id="creix">${I('edifici')} Fer créixer l'empresa · ${eur(sf.F.cost)}</button>` : `<p class="small" style="margin:0">Encara et falta: ${sf.falta.map(esc).join('; ')}.</p>`}</div>` : `<div class="caixa verd" style="margin:10px 0"><b>${I('trofeu')} Ja sou una gran empresa!</b><p class="small" style="margin:4px 0 0">Ara es tracta de fer créixer el valor: més botigues, venda a empreses, botiga en línia i campanyes.</p></div>`}
      <ol class="escala">${escala}</ol>
      ${millores ? `<h3 class="h3">Millores</h3><div class="pcards">${millores}</div>` : ''}
      ${llocs ? `<h3 class="h3">${I('equip')} Botigues de la cadena</h3><p class="small muted">Cada botiga té un gerent i ven els mateixos productes i preus que la teva. Si la teva botiga atrau poc, les altres també.</p><div class="pcards">${llocs}</div>` : ''}
      ${b2b}
      <h3 class="h3">${I('banc')} Préstec bancari</h3><p class="small muted">Finançament aliè: el banc et deixa diners per invertir, però cada dia pagues un ${Math.round(MD.PRESTEC.interes * 100)} % d'interès sobre el que deus. Com més gran és l'empresa, més et deixa (ara fins a ${eur(maxP)}).</p>
      <div class="row">${[500, 1000, 2500].filter(x => x <= potDemanar).map(x => `<button class="btn small" data-prest="${x}">Demanar ${eur(x)}</button>`).join('') || '<span class="small muted">Has arribat al límit d\'aquesta fase.</span>'}
        ${e.deute ? `<button class="btn small ghost" data-ret="${Math.min(e.deute, Math.floor(e.diners))}" ${e.diners < 1 ? 'disabled' : ''}>Retornar ${eur(Math.min(e.deute, Math.floor(e.diners)))}</button>` : ''}</div>`;
    if ($('#creix', cont)) $('#creix', cont).onclick = () => confirma(`Fer créixer l'empresa a <b>${esc(sf.F.nom)}</b>? Inverteixes ${eur(sf.F.cost)} i el lloguer diari puja ${eur(sf.F.fixos - F.fixos)}. A canvi, més clients i més capacitat.`, () => {
      const r = accio({ tipus: 'creixer' }); if (!r.ok) return;
      const N = ME.faseDe(ME.jugador(S)); modal(`<div style="text-align:center">${I(N.icona, 'trofeu')}<h2>Ara sou: ${esc(N.nom)}!</h2><p>${esc(N.desc)}</p><p class="small muted">Recorda: més prestatgeries (${N.slots}), ${N.caixes} caixes${N.reposadors ? ', fins a ' + N.reposadors + ' reposadors' : ''}. Revisa el personal a «Distribució».</p><button class="btn prim" id="tc" data-focus>Som-hi!</button></div>`, (m) => { $('#tc', m).onclick = () => { tancaModal(); pantallaPlan(); }; });
    });
    $$('[data-mill]', cont).forEach(b => b.onclick = () => { const r = accio({ tipus: 'millora', k: b.dataset.mill }); if (r.ok) { toast(MD.MILLORES[b.dataset.mill].nom + ': fet!', 'pos'); pantallaPlan(); } });
    $$('[data-lloc]', cont).forEach(b => b.onclick = () => { const L = MD.LLOCS.find(x => x.id === b.dataset.lloc); confirma(`Obrir una botiga a <b>${esc(L.nom)}</b> per ${eur(L.obrir)}? Cada dia costarà ${eur(L.lloguer + MD.GERENT.cost)} (lloguer i gerent).`, () => { const r = accio({ tipus: 'obrirBotiga', lloc: L.id }); if (r.ok) { toast('Botiga oberta a ' + L.nom + '!', 'pos'); pantallaPlan(); } }); });
    $$('[data-b2b]', cont).forEach(b => b.onclick = () => { const r = accio({ tipus: 'b2b', prod: $('#b2bP', cont).value, volum: +b.dataset.b2b }); if (r.ok) pantallaPlan(); });
    if ($('#b2bP', cont)) $('#b2bP', cont).onchange = () => { if (e.b2b.volum) { accio({ tipus: 'b2b', prod: $('#b2bP', cont).value, volum: e.b2b.volum }); pantallaPlan(); } };
    $$('[data-prest]', cont).forEach(b => b.onclick = () => confirma(`Demanar un préstec de <b>${eur(+b.dataset.prest)}</b>? Pagaràs ${eur(+b.dataset.prest * MD.PRESTEC.interes)} d'interessos cada dia fins que el retornis.`, () => { const r = accio({ tipus: 'prestec', import: +b.dataset.prest }); if (r.ok) pantallaPlan(); }));
    $$('[data-ret]', cont).forEach(b => b.onclick = () => { const r = accio({ tipus: 'retornar', import: +b.dataset.ret }); if (r.ok) { toast('Préstec retornat.', 'pos'); pantallaPlan(); } });
  }
  function obrirBotiga() {
    const e = ME.jugador(S), sense = e.prestatges.slice(0, e.nPrest).filter(x => x && x.prod && !(e.estoc[x.prod] > 0));
    const fes = () => { const r = accio({ tipus: 'obrir' }); if (r.ok) { desa(); pantallaBotiga(); } };
    if (sense.length) confirma(`No tens estoc de: <b>${sense.map(x => esc(MD.productes[x.prod].nom)).join(', ')}</b>. Els clients que el busquin marxaran. Vols obrir igualment?`, fes); else fes();
  }

  /* ---------- Dia: la botiga oberta ---------- */
  function pantallaBotiga() {
    aturaDia();
    const e = ME.jugador(S);
    app.innerHTML = `<div class="joc2">${capcalera()}
      <div class="hud"><span class="hora" id="hora">${I('rellotge')} 09:00</span>
        <div class="seg vel" role="group" aria-label="Velocitat"><button data-v="0" aria-label="Pausa">${I('pausa')}</button><button data-v="1" class="on" aria-label="Velocitat normal">${I('play')}</button><button data-v="2" aria-label="Velocitat doble">▶▶</button><button data-v="3" aria-label="Velocitat triple">▶▶▶</button></div>
        <label class="auto"><input type="checkbox" id="auto" ${ui.auto ? 'checked' : ''}> Ninot automàtic</label>
        <span class="kpi-d" title="Vendes d'avui">${I('moneda')} <b id="kV">0 €</b></span><span class="kpi-d pos" title="Clients atesos">😊 <b id="kA">0</b></span><span class="kpi-d neg" title="Clients perduts">😞 <b id="kP">0</b></span><span class="kpi-d" title="Cua al taulell">${I('equip')} <b id="kC">0</b></span>
        <div class="dia-barra"><i id="kT"></i></div></div>
      <p class="gira">${I('mobil')} Gira el mòbil per veure la botiga més gran.</p>
      <div id="escena" class="escena-dia"></div>
      <p class="pista">Toca una <b>prestatgeria</b> perquè el ninot la reposi${e.personal.caixera >= ME.faseDe(e).caixes ? '' : ' · toca el <b>taulell</b> perquè cobri'}${e.serveis.online && !e.millores.online ? ' · toca la <b>tauleta</b> per preparar les comandes en línia' : ''}${e.personal.reposador ? ' · els reposadors omplen sols les prestatgeries buides' : ''}.</p></div>`;
    lligaCapcalera();
    const primer = !(pref.tut && pref.tut.dia);
    dia = MBOT.dia($('#escena'), S, {
      auto: ui.auto, pausa: primer,
      avis: (t) => toast(t),
      onEstat: (st) => { $('#hora').innerHTML = I('rellotge') + ' ' + st.hora; $('#kV').textContent = eur(st.vendes); $('#kA').textContent = st.atesos; $('#kP').textContent = st.perduts; $('#kC').textContent = st.cua; $('#kT').style.width = Math.min(100, st.fr / 0.9 * 100) + '%'; },
      onFi: (res) => { dia = null; const r = fa({ tipus: 'tancar', res }); if (!r.ok) { toast(r.err, 'neg'); return; } desa(); if (S.config.repte) enviaServidor(); pantallaResultats(); }
    });
    $$('[data-v]').forEach(b => b.onclick = () => { const v = +b.dataset.v; $$('[data-v]').forEach(x => x.classList.toggle('on', x === b)); if (!dia) return; if (v === 0) dia.pausa(true); else { dia.pausa(false); dia.velocitat(v); } });
    $('#auto').onchange = (ev) => { ui.auto = ev.target.checked; if (dia) dia.auto(ui.auto); };
    if (primer) tutorial('dia', () => { if (dia) dia.pausa(false); });
  }

  /* ---------- Vespre: resultats del dia ---------- */
  function pantallaResultats() {
    const e = ME.jugador(S), h = e.darrer, ev = ME.esdeveniment(h.esdeveniment), P = h.perduts;
    const motius = [['Han comprat', h.servits, 'var(--verd)', '😊'], ['Massa car', P.preu, '#F29D49', '💸'], ['No hi havia res per a ells', P.assortiment, '#9B7AE8', '🤷'], ['Prestatgeria buida', P.esgotat, 'var(--vermell)', '📦'], ['Massa cua', P.cua, '#EF6262', '⏳']];
    const max = Math.max(1, ...motius.map(m => m[1]));
    const cl = ME.classificacio(S), pos = cl.findIndex(x => x.e.humana) + 1, dies = e.hist.map(x => 'D' + x.ronda);
    const desv = h.objectiu ? h.ingressos - h.objectiu : null;
    app.innerHTML = `<div class="joc2">${capcalera()}<main class="res">
      <div class="res-cap"><div><span class="muted small">${esc(ev.titol)}</span><h1>Dia ${h.ronda}: ${h.resultat >= 0 ? 'has guanyat ' + eur(h.resultat) : 'has perdut ' + eur(-h.resultat)}</h1></div>
        <div class="row">${S.config.rondes ? '' : `<button class="btn ghost" id="acaba">${I('bandera')} Acabar la partida</button>`}<button class="btn prim big" id="seg">${S.config.rondes && S.ronda >= S.config.rondes ? 'Veure el final' : 'Dia següent'} ${I('fletxa')}</button></div></div>
      <div class="kpis5">
        <div class="kpi"><span>Vendes${h.vendesTotal > h.ingressos ? ' de l\'empresa' : ''}</span><b>${eur(h.vendesTotal || h.ingressos)}</b><em>${h.vendesTotal > h.ingressos ? eur(h.ingressos) + ' a la botiga principal' : h.unitats + ' unitats'}</em></div>
        <div class="kpi"><span>Resultat</span><b class="${h.resultat >= 0 ? 'pos' : 'neg'}">${eur(h.resultat)}</b><em>${h.xp ? '+' + h.xp + ' XP' : ''}</em></div>
        <div class="kpi"><span>Clients atesos</span><b>${h.servits} / ${h.clients}</b><em>${h.online ? h.online + ' en línia' : ''}</em></div>
        <div class="kpi"><span>Quota del carrer</span><b>${pct(h.quota)}</b><em>${pos}a de ${S.empreses.length} botigues</em></div>
        ${desv != null ? `<div class="kpi"><span>Objectiu de vendes</span><b class="${desv >= 0 ? 'pos' : 'neg'}">${desv >= 0 ? '+' : ''}${eur(desv)}</b><em>objectiu ${eur(h.objectiu)} · ${Math.round(desv / h.objectiu * 100)} %</em></div>` : `<div class="kpi"><span>Satisfacció</span><b>${h.satisfaccio}/100</b><em>reputació ${h.reputacio}</em></div>`}
      </div>
      <div class="res-g">
        <section class="seccio"><h2>Què han fet els clients que han entrat?</h2>
          <div class="motius">${motius.map(([n, v, c, ic]) => `<div class="mot"><span class="mic">${ic}</span><span class="mn">${esc(n)}</span><span class="mb"><i style="width:${v / max * 100}%;background:${c}"></i></span><b>${v}</b></div>`).join('')}</div>
          <div class="taula-w" style="margin-top:10px"><table class="t"><thead><tr><th>Tipus de client</th><th class="n">Entren</th><th class="n">Compren</th><th class="n">Car</th><th class="n">Res per a ells</th><th class="n">Buida</th><th class="n">Cua</th></tr></thead><tbody>
            ${MD.SEG.map(k => { const x = h.perSeg[k]; return `<tr><td>${I(MD.segments[k].icona)} ${esc(MD.segments[k].nom)}</td><td class="n">${x.entren}</td><td class="n">${x.compren}</td><td class="n">${x.perduts.preu}</td><td class="n">${x.perduts.assortiment}</td><td class="n">${x.perduts.esgotat}</td><td class="n">${x.perduts.cua}</td></tr>`; }).join('')}</tbody></table></div></section>
        <section class="seccio"><h2>Per què?</h2><ul class="explica">${h.explicacio.map(([s2, t]) => `<li data-s="${s2}">${esc(t)}</li>`).join('')}</ul></section>
        <section class="seccio"><h2>Compte de resultats del dia</h2><table class="t"><tbody>
          <tr><td>Vendes</td><td class="n">${eur2(h.ingressos)}</td></tr><tr><td>− Cost de la mercaderia venuda</td><td class="n">${eur2(-h.cogs)}</td></tr>
          ${h.merma ? `<tr><td>− Producte fet malbé (merma: ${h.mermaU} u.)</td><td class="n">${eur2(-h.merma)}</td></tr>` : ''}
          <tr><td>− Lloguer, llum i assegurances</td><td class="n">${eur2(-h.fixos)}</td></tr>
          ${h.personal ? `<tr><td>− Personal (sous)</td><td class="n">${eur2(-h.personal)}</td></tr>` : ''}${h.milloresDia ? `<tr><td>− Manteniment de les millores</td><td class="n">${eur2(-h.milloresDia)}</td></tr>` : ''}${h.punts ? `<tr><td>− Punts de la targeta de fidelització</td><td class="n">${eur2(-h.punts)}</td></tr>` : ''}
          ${h.serveis ? `<tr><td>− Serveis (web, horari)</td><td class="n">${eur2(-h.serveis)}</td></tr>` : ''}${h.comissions ? `<tr><td>− Embalatge i repartiment</td><td class="n">${eur2(-h.comissions)}</td></tr>` : ''}
          ${h.promocio ? `<tr><td>− Promoció</td><td class="n">${eur2(-h.promocio)}</td></tr>` : ''}${h.estudi ? `<tr><td>− Enquesta</td><td class="n">${eur2(-h.estudi)}</td></tr>` : ''}${h.interessos ? `<tr><td>− Interessos del préstec</td><td class="n">${eur2(-h.interessos)}</td></tr>` : ''}
          ${(h.cadena && h.cadena.length) || h.b2b ? `<tr class="sub"><td>= Resultat de la botiga principal</td><td class="n">${eur2(h.resultatBotiga)}</td></tr>
            ${(h.cadena || []).map(b => `<tr><td>${b.resultat >= 0 ? '+' : '−'} Botiga de ${esc(b.nom)} <small class="muted">(${eur(b.ingressos)} de vendes)</small></td><td class="n ${b.resultat >= 0 ? '' : 'neg'}">${eur2(b.resultat)}</td></tr>`).join('')}
            ${h.b2b ? `<tr><td>+ Venda a empreses <small class="muted">(${h.b2b.volum} u. · ${eur(h.b2b.ingressos)})</small></td><td class="n">${eur2(h.b2b.resultat)}</td></tr>` : ''}` : ''}
          <tr class="total"><td>= Resultat</td><td class="n ${h.resultat >= 0 ? 'pos' : 'neg'}">${eur2(h.resultat)}</td></tr></tbody></table>
          <p class="small muted" style="margin:8px 0 0">Les compres al proveïdor no són despesa fins que el producte es ven: mentrestant és estoc (val diners).</p></section>
        <section class="seccio"><h2>El carrer avui</h2><table class="t"><thead><tr><th>#</th><th>Botiga</th><th class="n">Clients</th><th class="n">Resultat</th><th class="n">Valor</th></tr></thead><tbody>
          ${cl.map((x, k) => `<tr class="${x.e.humana ? 'primer' : ''}"><td>${k + 1}</td><td><span class="punt-c" style="background:${x.e.color}"></span>${esc(x.e.nom)}${x.e.humana ? ' <small class="muted">(tu)</small>' : ''}</td><td class="n">${Math.round(x.e.darrer.clients)}</td><td class="n ${x.e.darrer.resultat >= 0 ? 'pos' : 'neg'}">${eur(x.e.darrer.resultat)}</td><td class="n"><b>${eur(x.v.total)}</b></td></tr>`).join('')}</tbody></table></section>
      </div>
      ${e.hist.length >= 2 ? `<div class="grafs"><div class="graf"><h3>Resultat de cada dia</h3><p>Guanys i pèrdues de la teva botiga.</p>${linia([{ n: 'Resultat', c: 'var(--verd)', v: e.hist.map(x => x.resultat) }], dies, eur)}</div>
        <div class="graf"><h3>Valor de les botigues</h3><p>Diners, estoc, inversions i marca.</p>${linia(S.empreses.map(x => ({ n: x.nom, c: x.color, v: x.hist.map(y => y.valor) })), dies, eur)}<div class="llegenda">${S.empreses.map(x => `<span><i style="background:${x.color}"></i>${esc(x.nom)}</span>`).join('')}</div></div></div>` : ''}
      <div class="row" style="justify-content:center;margin:18px 0 30px"><button class="btn prim big" id="seg2">${S.config.rondes && S.ronda >= S.config.rondes ? 'Veure el final' : 'Dia següent'} ${I('fletxa')}</button></div></main></div>`;
    lligaCapcalera();
    const seguent = () => llPausa('r', 2, () => { const r = fa({ tipus: 'continuar' }); desa(); if (r.final) return final(); ui.tab = 'prod'; pantallaPlan(); });
    $('#seg').onclick = $('#seg2').onclick = seguent;
    if ($('#acaba')) $('#acaba').onclick = () => confirma('Voleu acabar la partida ara? Es compararà el valor de l\'empresa que heu aconseguit.', () => { const r = fa({ tipus: 'acabar' }); desa(); if (r.ok) final(); });
    tutorial('res');
  }

  /* ---------- Final ---------- */
  function final() {
    clearTimeout(tm); aturaDia(); document.querySelectorAll('.toasts, .pas-tutorial').forEach(x => x.remove());
    const e = ME.jugador(S), cl = ME.classificacio(S), pos = cl.findIndex(x => x.e.humana) + 1, rec = ME.reconeixements(S), dies = e.hist.map(x => 'D' + x.ronda);
    const sum = (k) => e.hist.reduce((a, x) => a + (x[k] || 0), 0);
    app.innerHTML = `<main class="final"><div class="podi" id="podi">${I('trofeu', 'trofeu')}<p class="muted" style="margin:0">${esc(e.nom)} · ${e.hist.length} dies · ${I(ME.faseDe(e).icona)} ${esc(ME.faseDe(e).nom)}</p>
        <h1>${pos === 1 ? (e.fase >= 5 ? 'Heu creat una gran empresa!' : 'La teva botiga és la millor del carrer!') : 'Quedeu en ' + pos + 'a posició de ' + cl.length}</h1>
        <ol class="escala mini">${MD.FASES.map(x => `<li class="${x.n < e.fase ? 'fet' : x.n === e.fase ? 'ara' : ''}" title="${esc(x.nom)}"><span class="ic">${I(x.icona)}</span><b>${esc(x.nom)}</b></li>`).join('')}</ol><p>Valor de l'empresa: <b>${eur(cl[pos - 1].v.total)}</b>${pos > 1 ? ' · guanya ' + esc(cl[0].e.nom) + ' (' + eur(cl[0].v.total) + ')' : ''}</p></div>
      <div class="kpis5"><div class="kpi"><span>Vendes totals</span><b>${eur(e.hist.reduce((a, x) => a + (x.vendesTotal || x.ingressos), 0))}</b></div><div class="kpi"><span>Resultat acumulat</span><b class="${sum('resultat') >= 0 ? 'pos' : 'neg'}">${eur(sum('resultat'))}</b></div>
        <div class="kpi"><span>Clients atesos</span><b>${sum('servits')} / ${sum('clients')}</b></div><div class="kpi"><span>Reputació</span><b>${e.rep}/100</b></div><div class="kpi"><span>XP</span><b>${e.xp}</b></div></div>
      ${rec.length ? `<div class="seccio"><h2>Reconeixements</h2><div class="insignies">${rec.map(k => `<div class="insignia"><span class="ic">${I(MD.insignies[k].icona)}</span><div><b>${esc(MD.insignies[k].nom)}</b></div></div>`).join('')}</div></div>` : ''}
      <div class="seccio"><h2>Classificació del carrer</h2><table class="t"><thead><tr><th>#</th><th>Botiga</th><th class="n">Valor</th><th class="n">Resultat acumulat</th><th class="n">Reputació</th></tr></thead><tbody>
        ${cl.map((x, k) => `<tr class="${x.e.humana ? 'primer' : ''}"><td><b>${k + 1}</b></td><td><span class="punt-c" style="background:${x.e.color}"></span>${esc(x.e.nom)}</td><td class="n"><b>${eur(x.v.total)}</b></td><td class="n">${eur(x.e.hist.reduce((a, y) => a + y.resultat, 0))}</td><td class="n">${Math.round(x.e.rep)}</td></tr>`).join('')}</tbody></table></div>
      <div class="grafs"><div class="graf"><h3>Valor de les botigues</h3><p>Evolució dia a dia.</p>${linia(S.empreses.map(x => ({ n: x.nom, c: x.color, v: x.hist.map(y => y.valor) })), dies, eur)}<div class="llegenda">${S.empreses.map(x => `<span><i style="background:${x.color}"></i>${esc(x.nom)}</span>`).join('')}</div></div>
        <div class="graf"><h3>Clients perduts per motiu</h3><p>Al llarg de tota la partida.</p>${barres([['Massa car', 'preu', '#F29D49'], ['Res per a ells', 'assortiment', '#9B7AE8'], ['Prestatgeria buida', 'esgotat', '#EF6262'], ['Massa cua', 'cua', '#E05252']].map(([n, k, c]) => ({ n, v: e.hist.reduce((a, x) => a + x.perduts[k], 0), c })), (v) => String(Math.round(v)))}</div></div>
      <div class="seccio" style="margin-top:14px"><h2>Les vostres quatre P al final</h2><p class="small"><b>Producte:</b> ${e.prestatges.slice(0, e.nPrest).filter(x => x && x.prod).map(x => esc(MD.productes[x.prod].nom) + ' (' + eur2(x.preu) + ')').join(', ')}<br>
        <b>Distribució:</b> ${esc(ME.faseDe(e).nom.toLowerCase())}${e.botigues.length ? ' + ' + e.botigues.length + ' botigues (' + e.botigues.map(b => esc(MD.LLOCS.find(L => L.id === b.lloc).nom)).join(', ') + ')' : ''}${e.serveis.online ? ', botiga en línia' : ''}${e.serveis.horari ? ', horari ampliat' : ''}${e.b2b && e.b2b.volum ? ', venda a empreses' : ''} · ${e.nPrest} prestatgeries<br><b>Promoció:</b> ${eur(e.inversio.promocio)} invertits · notorietat ${Math.round(e.not)}/100</p></div>
      <div class="seccio"><h2>${I('llibre')} Lliçons</h2>${graellaLlicons(e)}</div>
      <div class="seccio"><h2>${I('bombeta')} Reflexió</h2><p><b>Quina de les quatre P us ha funcionat millor i quina canviaríeu? Per què?</b></p>
        <textarea class="inp" data-refl="0" rows="4">${esc((S.reflexions || {})[0] || '')}</textarea></div>
      ${S.config.repte ? `<div class="seccio envia"><h2>${I('descarrega')} Resultat del repte</h2><p>El resultat s'envia sol al rànquing de la classe, i la reflexió també quan l'escriviu.</p><div id="rkFinal"></div><div class="row" style="margin-top:10px"><button class="btn" id="envia">${I('descarrega')} Codi de resultat (si no hi ha connexió)</button></div></div>` : ''}
      <div class="row" style="justify-content:center"><button class="btn" id="baixa">${I('descarrega')} Resultats (CSV)</button><button class="btn" id="json">${I('descarrega')} Partida (JSON)</button><button class="btn prim big" id="menu">${I('tauler')} Tornar al menú</button></div></main>`;
    $$('[data-refl]').forEach(t => t.oninput = () => { S.reflexions = S.reflexions || {}; S.reflexions[0] = t.value; desa(); if (S.config.repte) enviaAviat(); });
    if (S.config.repte && !(S.enviat && S.enviat.final && S.enviat.ok)) enviaServidor();
    $('#baixa').onclick = () => baixaFitxer('mercadeja-resultats.csv', '﻿' + ME.csvResultats(S), 'text/csv');
    $('#json').onclick = () => baixaFitxer('mercadeja-partida.json', JSON.stringify(S), 'application/json');
    $('#menu').onclick = portada;
    if ($('#envia')) $('#envia').onclick = modalCodi;
    if ($('#rkFinal')) (enviant || Promise.resolve()).then(() => rankingRepte($('#rkFinal')));
    $$('[data-ll]').forEach(b => b.onclick = () => mostraLlico(LL.find(l => l.id === b.dataset.ll), e, () => final()));
    if (!pref.redueix && pos === 1) { const p = $('#podi'), cols = ['#F5C542', '#36B37E', '#4EA5F5', '#E879B9', '#9B7AE8', '#F29D49']; for (let k = 0; k < 60; k++) { const c = document.createElement('span'); c.className = 'confeti'; c.style.left = Math.random() * 100 + '%'; c.style.background = cols[k % 6]; c.style.animationDelay = Math.random() * 1.2 + 's'; p.appendChild(c); } }
    desa();
  }

  /* ---------- Tutorial (una vegada per navegador) ---------- */
  const TUT = {
    plan: ['Bon dia! Prepara la botiga', 'Al matí decideixes les quatre P: què vens i a quin preu (Producte i preu), quant estoc demanes i quins serveis tens (Estoc i Distribució) i com et fas conèixer (Promoció). Quan ho tinguis, prem «Obrir la botiga».'],
    dia: ['La botiga és oberta!', 'Els clients agafen el producte i fan cua al taulell. Toca el taulell perquè el ninot cobri. Quan una prestatgeria es buidi, toca-la i el ninot la reposarà des del magatzem. Si un client espera massa o no troba el producte, marxa. Si et costa, activa el «Ninot automàtic».'],
    res: ['Al vespre, mira què ha passat', 'Fixa\'t en els clients que han marxat i per què. Demà pots canviar preus, productes, estoc, serveis i promoció per corregir-ho. Quan la botiga funcioni, a la pestanya «Empresa» la podràs fer créixer.']
  };
  function tutorial(k, fet) {
    pref.tut = pref.tut || {};
    $$('.pas-tutorial').forEach(x => x.remove());
    if (pref.tut[k]) { if (fet) fet(); return; }
    const d = document.createElement('div'); d.className = 'pas-tutorial'; d.setAttribute('role', 'note');
    d.innerHTML = `<h3>${esc(TUT[k][0])}</h3><p>${esc(TUT[k][1])}</p><div class="row"><button class="btn small prim" id="tutOk">Entesos</button></div>`;
    document.body.appendChild(d);
    $('#tutOk', d).onclick = () => { pref.tut[k] = 1; desaPref(); d.remove(); if (fet) fet(); };
  }

  /* ---------- Ajuda ---------- */
  function ajuda() {
    const pausat = dia; if (pausat) pausat.pausa(true);
    modal(`<h2>${I('ajuda')} Com es juga</h2>
      <p>Portes una botiga d'alimentació en un carrer amb tres botigues rivals. Cada dia té tres moments:</p>
      <ol class="small" style="padding-left:18px;display:grid;gap:6px">
        <li><b>Matí (planificació):</b> decideixes les quatre P. <span style="color:var(--p-producte)">Producte</span> i <span style="color:var(--p-preu)">preu</span> de cada prestatgeria, <span style="color:var(--p-dist)">distribució</span> (estoc, dependenta, botiga en línia, horari) i <span style="color:var(--p-promo)">promoció</span> (aparador, cartells, xarxes...). A la pestanya <b>Empresa</b> fas créixer el negoci: botiga gran, supermercat, cadena i gran empresa.</li>
        <li><b>Dia (botiga oberta):</b> la gent del carrer tria a quina botiga entra. A dins, el teu ninot ha de reposar les prestatgeries, cobrar al taulell i preparar les comandes en línia. Si un client no troba el que vol, el troba car o espera massa, marxa.</li>
        <li><b>Vespre (resultats):</b> vendes, costos, resultat i, sobretot, per què han marxat els clients.</li></ol>
      <p class="small">Hi ha quatre tipus de client: ${MD.SEG.map(k => I(MD.segments[k].icona) + ' <b>' + esc(MD.segments[k].nom) + '</b> (' + esc(MD.segments[k].desc.toLowerCase()) + ')').join(' · ')}</p>
      <p class="small muted">Guanya la botiga amb més valor al final: diners + estoc + inversions + marca (notorietat i reputació).</p>
      <label class="row small"><input type="checkbox" id="redu2" ${pref.redueix ? 'checked' : ''}> Redueix les animacions</label>
      <div class="row" style="margin-top:12px"><button class="btn prim" id="ok" data-focus>Entesos</button></div>`, (m) => {
      m.querySelector('#ok').onclick = () => { tancaModal(); if (pausat && dia === pausat) pausat.pausa(false); };
      m.querySelector('#redu2').onchange = (ev) => { pref.redueix = ev.target.checked; desaPref(); };
    }, { tancable: true });
  }

  /* ---------- Registre d'accions: permet comprovar i recuperar la partida a partir d'un codi ---------- */
  function fa(a) { const r = ME.accio(S, a); if (!r.repetida && (r.ok || r.muta)) { const c = Object.assign({}, a); delete c.id; (S.reg = S.reg || []).push(c); } return r; }
  function fia(t, emp) { (S.reg = S.reg || []).push({ ia: t, emp: emp == null ? null : emp }); return ME.aplica(S, { ia: t, emp }); }

  /* ---------- Lliçons ---------- */
  const LL = window.MLL.llicons;
  const respLl = (e, id) => ((S.llicons || {})[e.id] || {})[id];
  const llDesbloquejades = (s, e) => LL.filter(l => { try { return l.quan(s, e); } catch (x) { return false; } });
  const llPendents = (e) => llDesbloquejades(S, e).filter(l => !respLl(e, l.id));
  const md = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  function ordreOpcions(l, e) { // ordre estable per a cada equip i lliçó (la correcta no surt sempre al mateix lloc)
    let h = (2166136261 ^ (S.config.llavor || 1)) >>> 0;
    (l.id + '|' + e.nom).split('').forEach(c => { h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0; });
    const idx = l.pregunta.o.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) { h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0; const j = h % (i + 1); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    return idx;
  }
  const exempleLl = (l, e) => { try { return l.exemple(S, e, ME, MD) || ''; } catch (x) { return ''; } };
  function mostraLlico(l, e, fet) {
    const ja = respLl(e, l.id), ex = exempleLl(l, e), ordre = ordreOpcions(l, e);
    modal(`<div class="llico"><span class="ll-ra">${I('llibre')} Lliçó · ${esc(l.ra)}</span><h2>${esc(l.titol)}</h2>
      ${l.cos.map(p => `<p>${md(p)}</p>`).join('')}
      ${ex ? `<div class="ll-ex"><b>${I('lupa')} A la vostra partida</b><p>${esc(ex)}</p></div>` : ''}
      <div class="ll-q"><b>Comprova-ho</b><p>${esc(l.pregunta.p)}</p><div class="ll-ops">${ordre.map(i => `<button class="ll-op" data-op="${i}">${esc(l.pregunta.o[i])}</button>`).join('')}</div><p class="ll-fb" aria-live="polite"></p></div>
      <div class="row" style="margin-top:12px;justify-content:flex-end"><button class="btn ghost" id="llDes">${ja ? 'Tancar' : 'Ho miro després'}</button><button class="btn prim" id="llOk" ${ja ? '' : 'hidden'}>Continuar</button></div></div>`, (m) => {
      const marca = (r) => $$('.ll-op', m).forEach(b => { const i = +b.dataset.op; b.disabled = true; if (i === l.pregunta.c) b.classList.add('ok'); else if (i === r) b.classList.add('ko'); });
      if (ja) { marca(ja.r); $('.ll-fb', m).innerHTML = (ja.ok ? '<span class="pos">✔ Ho vau encertar.</span> ' : '<span class="neg">✘ No ho vau encertar.</span> ') + esc(l.pregunta.per); }
      $$('.ll-op', m).forEach(b => b.onclick = () => {
        const r = fa({ tipus: 'llico', emp: e.id, llico: l.id, resposta: +b.dataset.op }); if (!r.ok) return toast(r.err, 'neg');
        marca(+b.dataset.op); desa();
        $('.ll-fb', m).innerHTML = (r.encert ? '<span class="pos">✔ Correcte! +10 XP.</span> ' : '<span class="neg">✘ No és correcta (+3 XP per intentar-ho).</span> ') + esc(l.pregunta.per);
        $('#llOk', m).hidden = false; $('#llDes', m).hidden = true; $('#llOk', m).focus();
      });
      $('#llOk', m).onclick = $('#llDes', m).onclick = () => { tancaModal(); if (fet) fet(); else render(); };
    });
  }
  function mostraLlicons(e, max, fet) {
    const cua = llPendents(e).slice(0, max);
    const seg = () => { const l = cua.shift(); if (!l) { if (fet) fet(); else render(); return; } mostraLlico(l, e, seg); };
    seg();
  }
  function llProgres(e) {
    const des = llDesbloquejades(S, e), resp = (S.llicons || {})[e.id] || {};
    return { des, resp, n: Object.keys(resp).length, enc: Object.values(resp).filter(x => x.ok).length };
  }
  function graellaLlicons(e) {
    const { des, resp } = llProgres(e), ids = new Set(des.map(l => l.id));
    return `<div class="ll-grid">${LL.map(l => { const r = resp[l.id], on = ids.has(l.id); return `<button class="llc ${on ? '' : 'tancada'} ${r ? (r.ok ? 'ok' : 'ko') : ''}" ${on ? `data-ll="${l.id}" data-e="${e.id}"` : 'disabled'}>
        <span class="ll-ra">${esc(l.ra)}</span><b>${on ? '' : I('cadenat') + ' '}${esc(l.titol)}</b>
        <span class="small">${!on ? 'Encara no l\'heu descoberta: continueu jugant.' : r ? (r.ok ? '✔ Resposta correcta' : '✘ Resposta incorrecta') : 'Pendent de respondre'}</span></button>`; }).join('')}</div>`;
  }
  /* ---------- Servidor (Netlify, el mateix d'Agència Digital): rànquing en directe dels reptes ----------
     Si no hi ha connexió, tot continua funcionant amb els codis de resultat. */
  const FN = location.pathname.replace(/[^/]*$/, '') + '.netlify/functions/mercadeja';
  async function crida(body) {
    const r = await fetch(FN, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    let d = null; try { d = await r.json(); } catch (e) { }
    if (!r.ok || !d) throw new Error((d && d.error) || 'Sense connexió amb el servidor.');
    return d;
  }
  let enviant = null;
  async function enviaServidor() {
    if (!S || !S.config.repte || !S.regOk) return null;
    const s0 = S;
    try {
      const codi = await codiDe(s0);
      enviant = crida({ action: 'enviar', repte: s0.config.repte.codi, codi });
      const d = await enviant;
      s0.enviat = { ronda: s0.ronda, final: s0.fase === 'final', ok: true, t: Date.now() };
      if (s0 === S) desa();
      return d;
    } catch (e) { s0.enviat = Object.assign({}, s0.enviat || {}, { ok: false, err: e.message }); return null; }
    finally { enviant = null; }
  }
  let tmRefl = null;
  const enviaAviat = () => { clearTimeout(tmRefl); tmRefl = setTimeout(enviaServidor, 2500); };
  async function rankingRepte(el) {
    el.innerHTML = '<p class="muted small">Carregant el rànquing de la classe…</p>';
    try {
      const d = await crida({ action: 'ranking', repte: S.config.repte.codi }), jo = (S.empreses.find(x => x.humana) || {}).nom;
      el.innerHTML = d.files.length ? `<div class="taula-w"><table class="t"><thead><tr><th>#</th><th>Equip</th><th class="n">Valor de l'empresa</th><th>Fase</th><th class="n">Dia</th><th class="n">Lliçons (encerts)</th></tr></thead><tbody>
        ${d.files.map((x, k) => `<tr class="${x.equip === jo ? 'primer' : ''}"><td><b>${k + 1}</b></td><td>${esc(x.equip)}${x.equip === jo ? ' <small class="muted">(vosaltres)</small>' : ''}${x.verificat ? '' : ' <small class="neg">⚠</small>'}</td><td class="n"><b>${eur(x.valor)}</b></td><td class="small">${nomFase(x.fase)}</td><td class="n">${x.acabada ? 'Acabada' : x.ronda + (x.rondes ? ' / ' + x.rondes : '')}</td><td class="n">${x.llDesc} (${x.llEnc})</td></tr>`).join('')}</tbody></table></div>`
        : '<p class="muted small">Encara no hi ha cap equip al rànquing. El vostre resultat s\'hi envia sol en acabar cada dia.</p>';
    } catch (e) { el.innerHTML = '<p class="muted small">No s\'ha pogut carregar el rànquing de la classe (sense connexió). Podeu continuar jugant: el resultat s\'enviarà quan torni la connexió, o amb «Envia el resultat».</p>'; }
  }

  /* ---------- Codis de partida ----------
     El codi conté la configuració i el registre d'accions comprimits. Qui el rep torna a jugar la partida
     amb el mateix motor i obté exactament el mateix resultat: així es comprova que és vàlid. */
  const b64u = (bytes) => { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  const unb64u = (t) => { const s = atob(t.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((t.length + 3) % 4)); const b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i); return b; };
  async function comprimeix(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    if (window.CompressionStream) { try { const st = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw')); return 'MJ1Z' + b64u(new Uint8Array(await new Response(st).arrayBuffer())); } catch (e) { } }
    return 'MJ1J' + b64u(bytes);
  }
  async function descomprimeix(codi) {
    const t = String(codi || '').replace(/\s+/g, ''), pre = t.slice(0, 4); let bytes = unb64u(t.slice(4));
    if (pre === 'MJ1Z') { const st = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw')); bytes = new Uint8Array(await new Response(st).arrayBuffer()); }
    else if (pre !== 'MJ1J') throw new Error('codi');
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  async function codiDe(s) {
    const cfg = Object.assign({}, s.config); delete cfg.pin; delete cfg.tutorial;
    return comprimeix({ v: 1, cfg, reg: ME.compacta(s.reg || []), refl: s.reflexions || {}, t: Date.now() });
  }
  async function deCodi(codi) {
    const p = await descomprimeix(codi);
    if (!p || p.v !== 1 || !p.cfg || !Array.isArray(p.reg)) throw new Error('codi');
    // En un repte, la configuració es reconstrueix a partir del codi del repte (no es confia en la del codi de resultat)
    const rep = p.cfg.repte && ME.llegirRepte(p.cfg.repte.codi), h = (p.cfg.empreses || [])[0] || {};
    const cfg = rep ? ME.cfgRepte(rep, { nom: String(h.nom || '').slice(0, 30), membres: (Array.isArray(h.membres) ? h.membres : []).slice(0, 4), repteNom: String(p.cfg.repte.nom || '').slice(0, 40) }) : p.cfg;
    const { s, errors } = ME.repetir(cfg, ME.descompacta(p.reg));
    s.reflexions = p.refl || {}; s.regOk = true;
    return { s, errors, p };
  }
  const slug = (t) => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const nomFase = (f) => f && MD.FASES[f - 1] ? I(MD.FASES[f - 1].icona) + ' ' + esc(MD.FASES[f - 1].nom) : '—';
  function baixaFitxer(nom, txt, tipus) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: tipus })); a.download = nom; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }
  function copia(t, camp) {
    const alt = () => { if (camp) { camp.select(); try { document.execCommand('copy'); toast('Copiat!', 'pos'); } catch (e) { toast('Seleccioneu el text i copieu-lo.', 'neg'); } } };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(t).then(() => toast('Copiat!', 'pos')).catch(alt); else alt();
  }
  async function modalCodi() {
    if (!S.regOk) return toast('Aquesta partida es va començar amb una versió anterior del joc i no té codi.', 'neg');
    const codi = await codiDe(S), e = S.empreses.find(x => x.humana), rep = S.config.repte;
    const env = rep ? await enviaServidor() : null;
    modal(`<h2>${I('descarrega')} ${rep ? 'Envia el resultat al professor' : 'Codi de la partida'}</h2>
      ${rep ? (env ? `<p class="caixa small" style="border-color:#2f7a57">✔ Resultat enviat al rànquing de la classe (ronda ${S.ronda}). No cal fer res més: el codi de sota és una còpia de seguretat.</p>` : '<p class="caixa groc small">No s\'ha pogut connectar amb el servidor. Copieu el codi i feu-lo arribar al professor.</p>') : ''}
      <p>Aquest codi conté tota la vostra partida (${S.fase === 'final' ? 'acabada' : 'fins al dia ' + S.ronda + (S.config.rondes ? ' de ' + S.config.rondes : '')}). ${rep ? 'El professor l\'afegirà al rànquing de la classe i el joc tornarà a calcular la partida per comprovar-la.' : ''}</p>
      ${S.fase === 'final' && e && !(S.reflexions || {})[e.id] ? '<p class="caixa groc small">Abans d\'enviar-lo, escriviu la reflexió final: també va dins del codi.</p>' : ''}
      <textarea class="inp codi-res" readonly rows="5" aria-label="Codi de la partida">${esc(codi)}</textarea>
      <div class="row" style="margin-top:10px"><button class="btn prim" id="cp" data-focus>${I('ok')} Copiar el codi</button><button class="btn" id="dl">${I('descarrega')} Descarregar el fitxer</button><button class="btn ghost" id="tc">Tancar</button></div>
      <p class="small muted">Envieu-lo per on digui el professor (Classroom, Moodle, correu...). També serveix per continuar en un altre dispositiu: «Repte de classe» → «Continuar amb un codi».</p>`, (m) => {
      $('#cp', m).onclick = () => copia(codi, $('.codi-res', m));
      $('#dl', m).onclick = () => baixaFitxer('mercadeja-' + slug((e ? e.nom : 'partida') + (rep ? '-' + rep.codi : '')) + '.txt', codi, 'text/plain');
      $('#tc', m).onclick = () => { tancaModal(); tick(); };
    }, { tancable: true });
  }

  /* ---------- Repte de classe (alumnes) ---------- */
  const NOM_DIF = { facil: 'fàcil', mitja: 'mitjana', dificil: 'difícil' };
  function repte(prefill) {
    clearTimeout(tm);
    const q = new URLSearchParams(location.search), codi0 = prefill || q.get('repte') || '', nomR = (q.get('nom') || '').slice(0, 40);
    app.innerHTML = `<main class="config" style="max-width:760px">
      <button class="btn ghost small" id="enrere">← Tornar</button>
      <h1>${I('equip')} Repte de classe</h1>
      <p class="muted">Cada equip juga el mateix carrer al seu dispositiu: els mateixos esdeveniments, la mateixa gent i les mateixes tres botigues rivals. Només canvien les vostres decisions i com atengueu la botiga. Al final envieu el codi de resultat al professor per entrar al rànquing.</p>
      <div class="seccio"><h2>Entrar al repte</h2>
        <label class="f">Codi del repte<input class="inp codi-in" id="rc" value="${esc(codi0)}" placeholder="Ex.: A8M-K3X9QZ" autocomplete="off" autocapitalize="characters" spellcheck="false"></label>
        <p class="small" id="rcInfo" style="margin:6px 0 12px"></p>
        <label class="f">Nom de la vostra botiga<input class="inp" id="rn" maxlength="30" placeholder="Ex.: El Rebost del Barri"></label>
        <label class="f" style="margin-top:10px">Membres de l'equip (separats per comes)<input class="inp" id="rm" maxlength="140" placeholder="Nom i cognom de cada membre"></label>
        <div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn prim big" id="rgo">${I('play')} Començar el repte</button></div></div>
      <div class="seccio"><h2>Continuar amb un codi</h2><p class="small">Si vau començar en un altre dispositiu, enganxeu-hi el codi que vau copiar amb «Envia el resultat».</p>
        <textarea class="inp" id="rcod" rows="3" placeholder="MJ1…" spellcheck="false"></textarea><div class="row" style="margin-top:8px"><button class="btn" id="rcont">Recuperar la partida</button></div></div></main>`;
    const info = () => { const v = $('#rc').value.trim(), r = ME.llegirRepte(v); $('#rcInfo').innerHTML = !v ? '' : r ? `<span class="pos">✔ ${esc(MD.sectors[r.sector].nom)} · ${r.rondes} dies · rivals ${esc(NOM_DIF[r.dificultat])}${nomR ? ' · ' + esc(nomR) : ''}</span>` : '<span class="neg">Aquest codi no és vàlid. Ha de tenir aquesta forma: A8M-K3X9QZ.</span>'; };
    $('#rc').oninput = info; info();
    $('#enrere').onclick = portada;
    $('#rgo').onclick = () => {
      const r = ME.llegirRepte($('#rc').value), nom = $('#rn').value.trim().slice(0, 30), membres = $('#rm').value.split(',').map(x => x.trim()).filter(Boolean).slice(0, 4);
      if (!r) return toast('Escriviu un codi de repte vàlid.', 'neg');
      if (!nom) return toast('Poseu nom a la vostra botiga.', 'neg');
      if (MD.empresesSuggerides[r.sector].slice(1, 4).some(x => x.toLowerCase() === nom.toLowerCase())) return toast('Aquest nom ja el fa servir una botiga rival. Trieu-ne un altre.', 'neg');
      const d = carrega(), mateix = d && d.config.repte && d.config.repte.codi === r.codi;
      if (mateix && d.empreses[0].nom.toLowerCase() === nom.toLowerCase() && d.fase !== 'final') { S = d; ui.empVista = 0; toast('Continueu la partida que teníeu començada.'); return joc(); }
      const comenca = () => { S = ME.crearPartida(ME.cfgRepte(r, { nom, membres, repteNom: nomR })); S.reg = []; S.regOk = true; fia('I'); ui.empVista = 0; ui.vista = 'tauler'; ui.mobil = 'tauler'; ui.tutDone = {}; desa(); joc(); };
      if (d && d.fase !== 'final' && d.ronda > 0) confirma('En aquest navegador hi ha una altra partida a mitges («' + esc(d.empreses.find(x => x.humana) ? d.empreses.find(x => x.humana).nom : d.config.nom) + '»). Si comenceu ara, se substituirà. Voleu continuar?', comenca); else comenca();
    };
    $('#rcont').onclick = async () => {
      try { const { s, errors } = await deCodi($('#rcod').value); S = s; ui.empVista = primerHuma(); ui.vista = 'tauler'; ui.mobil = 'tauler'; toast(errors ? 'Partida recuperada (amb ' + errors + ' accions no vàlides).' : 'Partida recuperada.', errors ? 'neg' : 'pos'); desa(); joc(); }
      catch (x) { toast('Aquest codi no és vàlid o està incomplet.', 'neg'); }
    };
  }

  /* ---------- Mode docent: crear reptes i rànquing ---------- */
  function docent() {
    clearTimeout(tm);
    app.innerHTML = `<main class="config"><button class="btn ghost small" id="enrere">← Tornar</button>
      <h1>${I('escut')} Mode docent</h1>
      <p class="muted">El repte és un codi. Els equips envien el resultat sols en acabar cada dia i el servidor torna a jugar cada partida per comprovar-la abans de posar-la al rànquing. Si no hi ha connexió, també funciona amb codis de resultat.</p>
      <div class="cards">
        <button class="opcio" data-h="crear"><b>${I('mes')} Crear un repte de classe</b><span>Genera un codi i un enllaç. Cada equip juga al seu dispositiu la mateixa partida.</span></button>
        <button class="opcio" data-h="ranking"><b>${I('trofeu')} Rànquing de la classe</b><span>Enganxeu els codis de resultat: classificació, lliçons apreses i decisions de cada equip.</span></button>
      </div></main>`;
    $('#enrere').onclick = portada;
    $$('[data-h]').forEach(b => b.onclick = () => ({ crear: crearRepte, ranking: () => ranking() })[b.dataset.h]());
  }
  function crearRepte() {
    const c = { nom: '', sector: 'alimentacio', rondes: 16, dificultat: 'mitja' };
    const draw = () => {
      app.innerHTML = `<main class="config" style="max-width:900px"><button class="btn ghost small" id="enrere">← Mode docent</button>
        <h1>Crear un repte de classe</h1>
        <label class="f" style="max-width:420px">Nom del repte (opcional)<input class="inp" id="cn" maxlength="40" value="${esc(c.nom)}" placeholder="Ex.: CM10-2A · Repte 1"></label>
        <h2>Durada i dificultat</h2><div class="row"><div class="seg" role="group" aria-label="Rondes">${[8, 12, 16, 20].map(r => `<button data-rondes="${r}" class="${c.rondes === r ? 'on' : ''}">${r} dies</button>`).join('')}</div>
          <div class="seg" role="group" aria-label="Dificultat">${[['facil', 'Rivals fàcils'], ['mitja', 'Rivals normals'], ['dificil', 'Rivals difícils']].map(([k, n]) => `<button data-dif="${k}" class="${c.dificultat === k ? 'on' : ''}">${n}</button>`).join('')}</div></div>
        <p class="small muted">Orientació: cada dia de joc dura uns 5 minuts (matí, botiga oberta i vespre). Amb 16 o 20 dies, els equips que ho facin bé poden arribar a gran empresa; el rànquing mostra fins a quina fase ha arribat cada equip. Cada equip té la partida desada al seu dispositiu i la pot continuar un altre dia.</p>
        <div class="barra"><button class="btn prim big" id="gen">${I('ok')} Generar el repte</button></div></main>`;
      const llegeix = () => { c.nom = $('#cn').value.trim(); };
      $('#enrere').onclick = docent;
      $$('[data-sector]').forEach(b => b.onclick = () => { llegeix(); c.sector = b.dataset.sector; draw(); });
      $$('[data-rondes]').forEach(b => b.onclick = () => { llegeix(); c.rondes = +b.dataset.rondes; draw(); });
      $$('[data-dif]').forEach(b => b.onclick = () => { llegeix(); c.dificultat = b.dataset.dif; draw(); });
      $('#gen').onclick = () => { llegeix(); const llavor = 1 + Math.floor(Math.random() * 2e9); mostraRepte(ME.codiRepte(c.sector, c.rondes, c.dificultat, llavor), c.nom); };
    };
    draw();
  }
  function enllacRepte(codi, nom) { const u = new URL(location.href); u.search = ''; u.hash = ''; u.searchParams.set('repte', codi); if (nom) u.searchParams.set('nom', nom); return u.href; }
  function carregaQR(cb) { // generador de QR (només per al docent; si no carrega, queda l'enllaç i el codi)
    if (window.qrcode) return cb();
    const s = document.createElement('script'); s.src = 'js/vendor/qrcode.js'; /* qrcode-generator 1.4.4 (MIT, Kazuhiko Arase) */ s.onload = cb; s.onerror = () => { }; document.head.appendChild(s);
  }
  function mostraRepte(codi, nom) {
    const r = ME.llegirRepte(codi), link = enllacRepte(codi, nom);
    desaClasse(codi, nom);
    app.innerHTML = `<main class="config" style="max-width:900px"><button class="btn ghost small" id="enrere">← Mode docent</button>
      <h1>${esc(nom || 'Repte de classe')}</h1>
      <div class="repte-box"><span class="muted">Codi del repte</span><div class="codi-repte">${esc(r.codi)}</div>
        <span class="muted">${esc(MD.sectors[r.sector].nom)} · ${r.rondes} dies · rivals ${esc(NOM_DIF[r.dificultat])}</span>
        <div id="qr" class="qr" aria-label="Codi QR de l'enllaç"></div>
        <input class="inp" readonly value="${esc(link)}" id="lk" aria-label="Enllaç del repte">
        <div class="row" style="justify-content:center;margin-top:10px"><button class="btn prim" id="cpl">${I('ok')} Copiar l'enllaç</button><button class="btn" id="rk">${I('trofeu')} Obrir el rànquing</button></div></div>
      <div class="seccio"><h2>Com funciona</h2><ol class="small" style="padding-left:18px;display:grid;gap:6px">
        <li>Projecteu aquesta pantalla o compartiu l'enllaç. També poden obrir Mercadeja, entrar a «Repte de classe» i escriure el codi.</li>
        <li>Cada equip escriu el nom de la seva empresa i els membres, i porta la botiga al mateix carrer, amb les mateixes tres botigues rivals.</li>
        <li>En acabar cada dia, el resultat s'envia sol al rànquing de la classe, que els equips veuen en directe a «Classificació».</li>
        <li>A «Rànquing de la classe» carregueu els resultats amb la contrasenya del professorat: hi veureu el detall de cada equip, les lliçons i la reflexió. Si algun equip no té connexió, us pot enviar el codi a mà.</li></ol>
        <p class="small muted">Deseu el codi del repte: si el torneu a generar, serà una partida diferent.</p></div></main>`;
    $('#enrere').onclick = docent;
    $('#cpl').onclick = () => copia(link, $('#lk'));
    $('#rk').onclick = () => ranking(r.codi);
    carregaQR(() => { try { const q = window.qrcode(0, 'M'); q.addData(link); q.make(); $('#qr').innerHTML = q.createSvgTag({ cellSize: 5, margin: 3, scalable: true }); } catch (e) { } });
  }
  const pwDocent = () => { try { return sessionStorage.getItem('mercadeja-pw') || ''; } catch (e) { return ''; } };
  const KCL = 'mercadeja-classes-v1';
  const classes = () => { try { return JSON.parse(localStorage.getItem(KCL) || '{}'); } catch (e) { return {}; } };
  const desaClasses = (c) => { try { localStorage.setItem(KCL, JSON.stringify(c)); return true; } catch (e) { toast('No s\'ha pogut desar el rànquing: el navegador no té espai.', 'neg'); return false; } };
  function desaClasse(codi, nom) { const c = classes(); c[codi] = c[codi] || { nom: nom || '', equips: {}, creat: Date.now() }; if (nom) c[codi].nom = nom; desaClasses(c); }
  function fitxaEquip(s, e, errors) {
    const h = e.hist, cl = ME.classificacio(s), resp = (s.llicons || {})[e.id] || {};
    return { equip: e.nom, membres: e.membres || [], ronda: s.ronda, rondes: s.config.rondes, acabada: s.fase === 'final', valor: ME.valorEmpresa(s, e).total, fase: e.fase || 1,
      resultat: h.reduce((a, x) => a + x.resultat, 0), quota: h.length ? h.reduce((a, x) => a + x.quota, 0) / h.length : 0, rep: Math.round(e.rep), xp: e.xp,
      posJoc: cl.findIndex(x => x.e.id === e.id) + 1, nJoc: s.empreses.length,
      llDesc: llDesbloquejades(s, e).length, llResp: Object.keys(resp).length, llEnc: Object.values(resp).filter(x => x.ok).length,
      p4: h.map(x => (x.us4P || []).length), refl: (s.reflexions || {})[e.id] || '', errors, t: Date.now() };
  }
  async function afegeixCodis(text) {
    const codis = String(text || '').match(/MJ1[ZJ][A-Za-z0-9_-]{8,}/g) || [];
    const c = classes(); let ok = 0, ko = 0, darrera = null;
    for (const k of codis) {
      try {
        const { s, errors } = await deCodi(k);
        const rc = (s.config.repte && s.config.repte.codi) || ('PARTIDA-' + s.config.llavor);
        c[rc] = c[rc] || { nom: (s.config.repte && s.config.repte.nom) || (s.config.repte ? '' : s.config.nom) || '', equips: {}, creat: Date.now() };
        s.empreses.filter(e => e.humana).forEach(e => {
          const f = fitxaEquip(s, e, errors); f.codi = k; f.empId = e.id;
          const key = e.nom.toLowerCase(), ant = c[rc].equips[key];
          if (!ant || f.ronda >= ant.ronda) c[rc].equips[key] = f; // es queda amb el codi més avançat
        });
        darrera = rc; ok++;
      } catch (x) { ko++; }
    }
    if (ok) desaClasses(c);
    toast(ok ? ok + ' codi' + (ok > 1 ? 's afegits' : ' afegit') + ' al rànquing' + (ko ? ' · ' + ko + ' no vàlid' + (ko > 1 ? 's' : '') : '') + '.' : 'No s\'ha trobat cap codi vàlid.', ok ? 'pos' : 'neg');
    return darrera;
  }
  function ordenaEquips(cl) { return Object.values(cl.equips).sort((a, b) => b.valor - a.valor); }
  function ranking(sel) {
    clearTimeout(tm);
    const c = classes(), keys = Object.keys(c).sort((a, b) => (c[b].creat || 0) - (c[a].creat || 0));
    sel = sel && c[sel] ? sel : keys[0];
    const cl = sel ? c[sel] : null, eq = cl ? ordenaEquips(cl) : [], rep = sel && ME.llegirRepte(sel);
    app.innerHTML = `<main class="config" style="max-width:1180px"><button class="btn ghost small" id="enrere">← Mode docent</button>
      <h1>${I('trofeu')} Rànquing de la classe</h1>
      ${keys.length > 1 ? `<label class="f" style="max-width:480px">Repte<select class="inp" id="selC">${keys.map(k => `<option value="${esc(k)}" ${k === sel ? 'selected' : ''}>${esc((c[k].nom ? c[k].nom + ' · ' : '') + k)} (${Object.keys(c[k].equips).length} equips)</option>`).join('')}</select></label>` : ''}
      <div class="seccio"><h2>${I('banc')} Resultats del servidor</h2><p class="small">Els equips envien el resultat sols en acabar cada ronda. Entreu la contrasenya del professorat (la mateixa del panell d'Agència Digital) per carregar-los i comprovar-los.</p>
        <div class="row"><input class="inp" type="password" id="pwS" style="max-width:240px" placeholder="Contrasenya" value="${esc(pwDocent())}" aria-label="Contrasenya del professorat"><button class="btn prim" id="carregaS">${I('descarrega')} Carregar ${sel ? 'aquest repte' : 'tots els reptes'}</button>${sel ? '<button class="btn" id="carregaTots">Tots els reptes</button>' : ''}</div><p class="small" id="estatS"></p></div>
      <div class="seccio"><h2>Afegir codis a mà</h2><p class="small">Si algun equip no ha tingut connexió, enganxeu aquí els codis que us han enviat els equips (un o molts alhora) o carregueu els fitxers .txt. Si un equip envia un codi més avançat, substitueix l'anterior.</p>
        <textarea class="inp" id="codis" rows="4" placeholder="MJ1…" spellcheck="false"></textarea>
        <div class="row" style="margin-top:8px"><button class="btn prim" id="afg">${I('mes')} Afegir al rànquing</button><label class="btn">${I('document')} Carregar fitxers<input type="file" id="fit" accept=".txt,text/plain" multiple hidden></label></div></div>
      ${cl ? `<div class="seccio"><h2>${esc(cl.nom || 'Repte')} <span class="muted small">· ${esc(sel)}${rep ? ' · ' + rep.rondes + ' dies' : ''}</span></h2>
        ${eq.length ? `<div class="taula-w"><table class="t"><thead><tr><th>#</th><th>Equip</th><th class="n">Valor de l'empresa</th><th>Fase</th><th class="n">Dia</th><th class="n">Resultat acumulat</th><th class="n">Quota mitjana</th><th class="n">Posició al carrer</th><th class="n">Lliçons</th><th class="n">Encerts</th><th>Comprovació</th></tr></thead><tbody>
          ${eq.map((x, k) => `<tr class="${k === 0 ? 'primer' : ''} clicable" data-eq="${esc(x.equip.toLowerCase())}" tabindex="0"><td><b>${k + 1}</b></td><td><b>${esc(x.equip)}</b>${x.membres.length ? '<br><small class="muted">' + esc(x.membres.join(', ')) + '</small>' : ''}</td><td class="n"><b>${eur(x.valor)}</b></td><td class="small">${nomFase(x.fase)}</td><td class="n">${x.acabada ? 'Acabada' : x.ronda + (x.rondes ? ' / ' + x.rondes : '')}</td><td class="n ${x.resultat >= 0 ? 'pos' : 'neg'}">${eur(x.resultat)}</td><td class="n">${pct(x.quota)}</td><td class="n">${x.posJoc}a de ${x.nJoc}</td><td class="n">${x.llDesc} / ${LL.length}</td><td class="n">${x.llEnc} / ${x.llResp}</td><td>${x.errors ? '<span class="neg">⚠ ' + x.errors + ' accions no vàlides</span>' : '<span class="pos">✔ Verificat</span>'}</td></tr>`).join('')}</tbody></table></div>
          <p class="small muted">Feu clic a un equip per veure'n el detall (dies, quatre P, lliçons i reflexió). Si un equip no ha acabat, surt amb el valor del dia on és.</p>
          <div class="row"><button class="btn" id="csv">${I('descarrega')} Descarregar (CSV)</button><button class="btn" id="comp">${I('equip')} Compartir el rànquing amb la classe</button><button class="btn perill" id="esb">Esborrar aquest rànquing</button></div>` : '<p class="muted">Encara no hi ha resultats d\'aquest repte. Enganxeu-hi els codis dels equips.</p>'}</div>` : '<p class="muted">Encara no hi ha cap repte. Creeu-ne un des del mode docent o enganxeu-hi codis de resultat.</p>'}</main>`;
    $('#enrere').onclick = docent;
    const sc = $('#selC'); if (sc) sc.onchange = () => ranking(sc.value);
    $('#afg').onclick = async () => { const d = await afegeixCodis($('#codis').value); if (d) ranking(d); };
    const carrega = async (nomes) => {
      const pw = $('#pwS').value; $('#estatS').textContent = 'Carregant…';
      try {
        const reptes = nomes ? [nomes] : (await crida({ action: 'docent', password: pw })).reptes.map(r => r.repte);
        let codis = [];
        for (const r of reptes) { const d = await crida({ action: 'docent', password: pw, repte: r }); codis = codis.concat(d.files.map(f => f.codi)); }
        try { sessionStorage.setItem('mercadeja-pw', pw); } catch (e) { }
        if (!codis.length) { $('#estatS').textContent = 'Encara no hi ha resultats al servidor' + (nomes ? ' per a aquest repte.' : '.'); return; }
        const d = await afegeixCodis(codis.join('\n')); ranking(nomes || d);
      } catch (e) { $('#estatS').textContent = e.message; }
    };
    $('#carregaS').onclick = () => carrega(sel || null);
    if ($('#carregaTots')) $('#carregaTots').onclick = () => carrega(null);
    $('#fit').onchange = async (ev) => { let t = ''; for (const f of ev.target.files) t += '\n' + await f.text(); const d = await afegeixCodis(t); if (d) ranking(d); };
    if (!cl || !eq.length) return;
    $$('[data-eq]').forEach(tr => { tr.onclick = () => detallEquip(cl.equips[tr.dataset.eq]); tr.onkeydown = (ev) => { if (ev.key === 'Enter') tr.onclick(); }; });
    $('#csv').onclick = () => {
      const rows = [['Posició', 'Equip', 'Membres', 'Valor de la botiga', 'Dia', 'Acabada', 'Resultat acumulat', 'Quota mitjana %', 'Reputació', 'XP', 'Posició al carrer', 'Lliçons descobertes', 'Lliçons respostes', 'Encerts', 'Comprovació', 'Reflexió']];
      eq.forEach((x, k) => rows.push([k + 1, x.equip, x.membres.join(', '), x.valor, x.ronda, x.acabada ? 'sí' : 'no', x.resultat, Math.round(x.quota * 10) / 10, x.rep, x.xp, x.posJoc, x.llDesc, x.llResp, x.llEnc, x.errors ? 'amb errors' : 'verificat', x.refl]));
      baixaFitxer('mercadeja-ranquing-' + slug((cl.nom || '') + '-' + sel) + '.csv', '﻿' + rows.map(r => r.map(v => /[;"\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : v).join(';')).join('\n'), 'text/csv');
    };
    $('#comp').onclick = async () => {
      const codi = await comprimeix({ n: cl.nom || '', c: sel, r: eq.map(x => [x.equip, x.valor, x.acabada ? 0 : x.ronda, x.llEnc, x.llDesc, x.fase || 0]) });
      const u = new URL(location.href); u.search = ''; u.hash = 'rk=' + codi;
      modal(`<h2>${I('equip')} Compartir el rànquing</h2><p>Qui obri aquest enllaç veurà la classificació (nom de la botiga, valor, dia i lliçons), sense noms dels membres ni detalls.</p>
        <textarea class="inp codi-res" readonly rows="4">${esc(u.href)}</textarea><div class="row" style="margin-top:10px"><button class="btn prim" id="cp" data-focus>Copiar l'enllaç</button><button class="btn ghost" id="tc">Tancar</button></div>`, (m) => {
        $('#cp', m).onclick = () => copia(u.href, $('.codi-res', m)); $('#tc', m).onclick = tancaModal; }, { tancable: true });
    };
    $('#esb').onclick = () => confirma('Voleu esborrar el rànquing «' + esc(cl.nom || sel) + '» d\'aquest navegador? Els codis dels equips continuaran sent vàlids.', () => { const c2 = classes(); delete c2[sel]; desaClasses(c2); ranking(); });
  }
  async function detallEquip(x) {
    let s; try { s = (await deCodi(x.codi)).s; } catch (e) { return toast('No s\'ha pogut obrir aquest codi.', 'neg'); }
    const e = s.empreses[0], resp = (s.llicons || {})[0] || {}, ids = new Set(llDesbloquejades(s, e).map(l => l.id));
    const nomP = { producte: 'Producte', preu: 'Preu', distribucio: 'Distribució', promocio: 'Promoció' };
    modal(`<h2>${esc(e.nom)}</h2><p class="muted small">${esc((e.membres || []).join(', ') || 'Sense membres indicats')} · ${s.fase === 'final' ? 'partida acabada' : 'dia ' + s.ronda + (s.config.rondes ? ' de ' + s.config.rondes : '')}</p>
      <div class="taula-w"><table class="t"><thead><tr><th>Dia</th><th class="n">Clients</th><th class="n">Atesos</th><th class="n">Vendes</th><th class="n">Resultat</th><th class="n">Perduts (car · res · buida · cua)</th><th>Quatre P treballades</th></tr></thead><tbody>
        ${e.hist.map(h => `<tr><td>${h.ronda}</td><td class="n">${h.clients}</td><td class="n">${h.servits}</td><td class="n">${eur(h.ingressos)}</td><td class="n ${h.resultat >= 0 ? 'pos' : 'neg'}">${eur(h.resultat)}</td><td class="n">${h.perduts.preu} · ${h.perduts.assortiment} · ${h.perduts.esgotat} · ${h.perduts.cua}</td><td class="small">${(h.us4P || []).map(k => nomP[k]).join(', ') || '—'}</td></tr>`).join('')}</tbody></table></div>
      <h3 style="margin-top:14px">Les quatre P al final</h3>
      <p class="small"><b>Producte i preu:</b> ${e.prestatges.slice(0, e.nPrest).filter(y => y && y.prod).map(y => esc(MD.productes[y.prod].nom) + ' ' + eur2(y.preu)).join(', ')}<br><b>Empresa:</b> ${esc(MD.FASES[(e.fase || 1) - 1].nom)}${(e.botigues || []).length ? ' + ' + e.botigues.length + ' botigues' : ''}<br><b>Distribució:</b> ${e.nPrest} prestatgeries${e.serveis.online ? ', botiga en línia' : ''}${e.serveis.horari ? ', horari ampliat' : ''}<br><b>Promoció:</b> ${eur(e.inversio.promocio)} · notorietat ${Math.round(e.not)} · reputació ${Math.round(e.rep)}</p>
      <h3>Lliçons</h3><ul class="ll-llista">${LL.map(l => { const r = resp[l.id]; return `<li class="${r ? (r.ok ? 'ok' : 'ko') : ids.has(l.id) ? '' : 'tancada'}"><span>${r ? (r.ok ? '✔' : '✘') : ids.has(l.id) ? '·' : '🔒'}</span><b>${esc(l.titol)}</b> <small class="muted">${esc(l.ra)}${r ? ' · dia ' + r.ronda : ids.has(l.id) ? ' · sense respondre' : ' · no descoberta'}</small></li>`; }).join('')}</ul>
      <h3>Reflexió final</h3><p class="small">${x.refl ? esc(x.refl) : '<span class="muted">Encara no l\'han escrita.</span>'}</p>
      <div class="row" style="margin-top:12px"><button class="btn ghost" id="tc" data-focus>Tancar</button></div>`, (m) => { $('#tc', m).onclick = tancaModal; }, { tancable: true });
    $('.modal-box').classList.add('ample');
  }
  async function rankingCompartit(codi) {
    let d; try { d = await descomprimeix(codi); } catch (e) { return portada(); }
    app.innerHTML = `<main class="config" style="max-width:900px">${logo(true)}
      <h1>${I('trofeu')} Rànquing${d.n ? ': ' + esc(d.n) : ''}</h1><p class="muted">Repte ${esc(d.c || '')} · classificació per valor empresarial.</p>
      <div class="taula-w"><table class="t"><thead><tr><th>#</th><th>Equip</th><th class="n">Valor de l'empresa</th><th>Fase</th><th class="n">Dia</th><th class="n">Lliçons (encerts)</th></tr></thead><tbody>
        ${(d.r || []).map((x, k) => `<tr class="${k === 0 ? 'primer' : ''}"><td><b>${k + 1}</b></td><td><b>${esc(x[0])}</b></td><td class="n"><b>${eur(x[1])}</b></td><td class="small">${nomFase(x[5])}</td><td class="n">${x[2] ? x[2] : 'Acabada'}</td><td class="n">${x[4]} (${x[3]})</td></tr>`).join('')}</tbody></table></div>
      <div class="row" style="margin-top:14px"><button class="btn prim" id="menu">${I('play')} Anar a Mercadeja</button></div></main>`;
    $('#menu').onclick = () => { history.replaceState(null, '', location.pathname + location.search); portada(); };
  }

  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && $('.modal') && !$('.modal #si')) { tancaModal(); } });
  // Arrencada: rànquing compartit (#rk=), enllaç d'un repte (?repte=) o portada
  (function inici() {
    if (location.hash.startsWith('#rk=')) return rankingCompartit(location.hash.slice(4));
    const codi = new URLSearchParams(location.search).get('repte'), r = codi && ME.llegirRepte(codi), d = carrega();
    if (r && !(d && d.v === 2 && d.config.repte && d.config.repte.codi === r.codi && d.fase !== 'final')) return repte(r.codi);
    portada();
  })();
  window.MERCADEJA = { get S() { return S; }, get dia() { return dia; }, deCodi, codiDe };
})();
