/* Mercadeja · interfície */
(function () {
  const MD = window.MD, ME = window.ME, I = window.MI.icon;
  const KEY = 'mercadeja-partida-v1', PREF = 'mercadeja-pref-v1';
  const app = document.getElementById('app');
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = (t) => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const eur = ME.eur;
  const pct = (v) => (Math.round(v * 10) / 10).toLocaleString('ca-ES') + ' %';
  const nf = (v) => Math.round(v).toLocaleString('ca-ES');
  let S = null, tm = null;
  const ui = { vista: 'tauler', empVista: 0, confirm: null, animant: false, tutDone: {}, mobil: 'tauler' };
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
  const logo = (sub) => `<div class="logo">${logoSVG()}<div><span class="nom">MERCADEJA</span>${sub ? '<span class="sub">CATALUNYA · EL GRAN JOC DE LES EMPRESES</span>' : ''}</div></div>`;
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
  const ZONES = [['Pirineus', 98, 30], ['Girona', 160, 52], ['Osona', 128, 66], ['Lleida', 52, 92], ['Vallès', 126, 94], ['Barcelona', 140, 110], ['Penedès', 108, 122], ['Tarragona', 92, 146], ['Ebre', 58, 178]];
  function mapaSVG() {
    const own = {}; if (S) Object.keys(S.propietaris).forEach(id => { const p = ME.propDef(id); own[p.zona] = colorE(S.empreses[S.propietaris[id]]); });
    const linies = [[5, 4], [5, 1], [5, 6], [6, 7], [7, 8], [4, 3], [4, 2], [2, 0], [1, 0], [3, 7]];
    return `<svg class="mapa" viewBox="0 0 200 200" aria-hidden="true">
      <path d="M36 22 L62 12 L96 18 L130 12 L162 20 L186 34 L182 58 L170 82 L156 104 L134 126 L112 146 L92 166 L74 186 L56 196 L44 184 L38 156 L28 128 L22 98 L18 66 L26 40Z" fill="rgba(78,165,245,.06)" stroke="rgba(170,183,200,.25)" stroke-width="1.2"/>
      ${linies.map(([a, b]) => `<line x1="${ZONES[a][1]}" y1="${ZONES[a][2]}" x2="${ZONES[b][1]}" y2="${ZONES[b][2]}" stroke="rgba(245,197,66,.22)" stroke-width="1" stroke-dasharray="3 3"/>`).join('')}
      ${ZONES.map(([n, x, y]) => `<circle cx="${x}" cy="${y}" r="${own[n] ? 4.5 : 3}" fill="${own[n] || 'rgba(170,183,200,.6)'}"/><text x="${x + 6}" y="${y + 3}" font-size="7" fill="rgba(170,183,200,.75)">${n}</text>`).join('')}
    </svg>`;
  }

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

  /* ---------- Portada ---------- */
  function portada() {
    clearTimeout(tm); S = null;
    const desat = carrega();
    app.innerHTML = `<main class="portada">${skylineSVG()}
      <div class="portada-box">
        ${logo(true)}
        <p class="lema">Dirigeix una empresa catalana, competeix amb les altres i fes-la créixer amb les quatre P del màrqueting: producte, preu, distribució i promoció.</p>
        <nav class="menu" aria-label="Menú principal">
          ${desat && desat.fase !== 'final' ? `<button class="btn prim big" data-a="continua">${I('play')} Continua la partida <small>${esc((desat.config.repte ? (desat.empreses.find(x => x.humana) || {}).nom : '') || desat.config.nom)} · ronda ${desat.ronda} de ${desat.config.rondes}</small></button>` : ''}
          <button class="btn ${desat && desat.fase !== 'final' ? '' : 'prim'} big" data-a="repte">${I('equip')} Repte de classe <small>cada equip al seu dispositiu</small></button>
          <button class="btn big" data-a="ia">${I('robot')} Juga contra la IA <small>1 equip</small></button>
          <button class="btn big" data-a="nova">${I('tauler')} Partida en un sol dispositiu <small>2–6 empreses per torns</small></button>
          <button class="btn big" data-a="tutorial">${I('llibre')} Tutorial <small>partida guiada</small></button>
          <button class="btn big" data-a="docent">${I('escut')} Mode docent <small>reptes i rànquing</small></button>
          <button class="btn big" data-a="ajuda">${I('ajuda')} Com es juga</button>
        </nav>
        <p class="peu">Joc educatiu de simulació empresarial · empreses fictícies · els referents reals només s'esmenten com a casos d'estudi.<br>
          <label><input type="checkbox" id="redu" ${pref.redueix ? 'checked' : ''}> Redueix les animacions</label></p>
      </div></main>`;
    $('#redu').onchange = (e) => { pref.redueix = e.target.checked; desaPref(); };
    $$('[data-a]').forEach(b => b.onclick = () => {
      const a = b.dataset.a;
      if (a === 'continua') { S = desat; ui.empVista = primerHuma(); ui.vista = 'tauler'; ui.mobil = 'tauler'; joc(); }
      else if (a === 'nova') configurar('nova');
      else if (a === 'ia') configurar('ia');
      else if (a === 'tutorial') comencar(cfgRapida(true));
      else if (a === 'docent') docent();
      else if (a === 'repte') repte();
      else if (a === 'ajuda') ajuda();
    });
  }
  function cfgRapida(tut) {
    const noms = MD.empresesSuggerides.alimentacio;
    return { nom: tut ? 'Tutorial' : 'Partida contra la IA', sector: 'alimentacio', rondes: tut ? 4 : 8, capital: 100000, dificultat: tut ? 'facil' : 'mitja', tutorial: !!tut,
      empreses: [{ nom: noms[0], fitxa: 'coet', humana: true, membres: [] }, { nom: noms[1], fitxa: 'diamant', perfil: 'premium' }, { nom: noms[2], fitxa: 'llamp', perfil: 'agressiva' }, { nom: noms[3], fitxa: 'corona', perfil: 'innovadora' }] };
  }
  const primerHuma = () => { const h = S.empreses.find(e => e.humana); return h ? h.id : 0; };

  /* ---------- Configuració de la partida ---------- */
  function configurar(mode) {
    const cfg = { nom: mode === 'ia' ? 'Partida contra la IA' : 'Partida de classe', sector: 'alimentacio', rondes: 8, capital: 100000, dificultat: 'mitja', pin: '',
      empreses: mode === 'ia' ? cfgRapida(false).empreses : [0, 1, 2, 3].map(i => ({ nom: MD.empresesSuggerides.alimentacio[i], fitxa: MD.fitxes[i].id, humana: true, perfil: MD.PERFILS[i % 4], membres: [] })) };
    const draw = () => {
      app.innerHTML = `<main class="config">
        <button class="btn ghost small" id="enrere">← Tornar</button>
        <h1>${mode === 'docent' ? 'Mode docent: nova partida de classe' : mode === 'ia' ? 'Partida contra la IA' : 'Nova partida'}</h1>
        <p class="muted">${mode === 'docent' ? 'Configura el mercat, les empreses i la durada. Durant la partida, el panell docent (amb PIN) mostra totes les decisions i permet descarregar els informes.' : 'Totes les empreses competeixen en el mateix mercat català. Guanya l\'empresa amb més valor empresarial al final.'}</p>
        <label class="f" style="max-width:420px">Nom de la partida<input class="inp" id="nomP" value="${esc(cfg.nom)}" maxlength="60"></label>
        <h2>1. Sector del mercat</h2>
        <div class="cards">${Object.entries(MD.sectors).map(([k, s]) => `<button class="opcio ${cfg.sector === k ? 'on' : ''}" data-sector="${k}"><b>${I(s.icona)} ${esc(s.nom)}</b><span>${esc(s.producte)}</span><span>Preu de referència ${eur(s.preuRef)} · cost ${eur(s.costBase)} per ${esc(s.unitat)}</span></button>`).join('')}</div>
        <h2>2. Durada i dificultat</h2>
        <div class="row">
          <div class="seg" role="group" aria-label="Rondes">${[4, 8, 12].map(r => `<button data-rondes="${r}" class="${cfg.rondes === r ? 'on' : ''}">${r} rondes${r === 4 ? ' · curta' : r === 8 ? ' · estàndard' : ' · ampliada'}</button>`).join('')}</div>
          <div class="seg" role="group" aria-label="Dificultat de la IA">${[['facil', 'IA fàcil'], ['mitja', 'IA mitjana'], ['dificil', 'IA difícil']].map(([k, n]) => `<button data-dif="${k}" class="${cfg.dificultat === k ? 'on' : ''}">${n}</button>`).join('')}</div>
        </div>
        <div class="row" style="margin-top:12px"><label class="f" style="width:220px">Capital inicial (€)<input class="inp" id="capital" type="number" min="20000" max="500000" step="10000" value="${cfg.capital}"></label>
          ${mode !== 'ia' ? `<label class="f" style="width:220px">PIN del panell docent (opcional)<input class="inp" id="pin" inputmode="numeric" maxlength="8" value="${esc(cfg.pin)}" placeholder="Sense PIN"></label>` : ''}</div>
        <h2>3. Empreses (${cfg.empreses.length} de 6)</h2>
        <p class="muted small">Cada empresa pot ser un equip de 1 a 4 alumnes o una empresa controlada per la IA. Els noms són fictisis: canvieu-los si voleu.</p>
        <div class="equips">${cfg.empreses.map((e, i) => `<div class="equip">
            <button class="fitxa" style="background:${fitxaDef(e.fitxa).color};width:44px;height:44px;cursor:pointer" data-fitxa="${i}" aria-label="Canviar la fitxa (${esc(fitxaDef(e.fitxa).nom)})">${I(e.fitxa)}</button>
            <input class="inp" data-nom="${i}" value="${esc(e.nom)}" maxlength="30" aria-label="Nom de l'empresa ${i + 1}">
            <select class="inp" data-tipus="${i}" aria-label="Qui la dirigeix">${['huma', ...MD.PERFILS].map(k => `<option value="${k}" ${(e.humana ? 'huma' : e.perfil) === k ? 'selected' : ''}>${k === 'huma' ? 'Equip d\'alumnes' : 'IA ' + MD.perfilsIA[k].nom.toLowerCase()}</option>`).join('')}</select>
            ${e.humana ? `<input class="inp" data-membres="${i}" value="${esc(e.membres.join(', '))}" placeholder="Membres (opcional, separats per comes)" aria-label="Membres de l'equip">` : `<span class="muted small">${esc(MD.perfilsIA[e.perfil].desc)}</span>`}
            <button class="btn ghost small" data-treu="${i}" ${cfg.empreses.length <= 2 ? 'disabled' : ''} aria-label="Treure l'empresa">${I('tancar')}</button>
          </div>`).join('')}</div>
        <div class="row" style="margin-top:10px"><button class="btn small" id="afegeix" ${cfg.empreses.length >= 6 ? 'disabled' : ''}>${I('mes')} Afegir empresa</button>
          <label class="row small muted"><input type="checkbox" id="privat" ${pref.privat ? 'checked' : ''}> Torns privats: abans de cada equip surt una pantalla per passar-se el dispositiu</label></div>
        <div class="barra"><button class="btn ghost" id="enrere2">Cancel·lar</button><button class="btn prim big" id="go">${I('play')} Començar la partida</button></div>
      </main>`;
      const llegeix = () => {
        cfg.nom = $('#nomP').value.trim() || 'Partida'; cfg.capital = Math.max(20000, Math.min(500000, +$('#capital').value || 100000)); if ($('#pin')) cfg.pin = $('#pin').value.trim();
        $$('[data-nom]').forEach(inp => { cfg.empreses[+inp.dataset.nom].nom = inp.value.trim().slice(0, 30); });
        $$('[data-membres]').forEach(inp => { cfg.empreses[+inp.dataset.membres].membres = inp.value.split(',').map(x => x.trim()).filter(Boolean).slice(0, 4); });
      };
      $('#enrere').onclick = $('#enrere2').onclick = portada;
      $$('[data-sector]').forEach(b => b.onclick = () => { llegeix(); const ant = cfg.sector; cfg.sector = b.dataset.sector; cfg.empreses.forEach((e, i) => { if (e.nom === MD.empresesSuggerides[ant][i]) e.nom = MD.empresesSuggerides[cfg.sector][i]; }); draw(); });
      $$('[data-rondes]').forEach(b => b.onclick = () => { llegeix(); cfg.rondes = +b.dataset.rondes; draw(); });
      $$('[data-dif]').forEach(b => b.onclick = () => { llegeix(); cfg.dificultat = b.dataset.dif; draw(); });
      $$('[data-fitxa]').forEach(b => b.onclick = () => { llegeix(); const e = cfg.empreses[+b.dataset.fitxa]; const usades = cfg.empreses.map(x => x.fitxa); let k = MD.fitxes.findIndex(f => f.id === e.fitxa); for (let n = 0; n < 6; n++) { k = (k + 1) % 6; if (!usades.includes(MD.fitxes[k].id)) break; } e.fitxa = MD.fitxes[k].id; draw(); });
      $$('[data-tipus]').forEach(sel => sel.onchange = () => { llegeix(); const e = cfg.empreses[+sel.dataset.tipus]; if (sel.value === 'huma') e.humana = true; else { e.humana = false; e.perfil = sel.value; } draw(); });
      $$('[data-treu]').forEach(b => b.onclick = () => { llegeix(); cfg.empreses.splice(+b.dataset.treu, 1); draw(); });
      $('#afegeix').onclick = () => { llegeix(); const i = cfg.empreses.length, usades = cfg.empreses.map(x => x.fitxa); cfg.empreses.push({ nom: MD.empresesSuggerides[cfg.sector][i] || 'Empresa ' + (i + 1), fitxa: (MD.fitxes.find(f => !usades.includes(f.id)) || MD.fitxes[i]).id, humana: mode !== 'ia', perfil: MD.PERFILS[i % 4], membres: [] }); draw(); };
      $('#privat').onchange = (e) => { pref.privat = e.target.checked; desaPref(); };
      $('#go').onclick = () => {
        llegeix();
        if (cfg.empreses.some(e => !e.nom)) return toast('Totes les empreses han de tenir nom.', 'neg');
        if (new Set(cfg.empreses.map(e => e.nom.toLowerCase())).size < cfg.empreses.length) return toast('Hi ha dues empreses amb el mateix nom.', 'neg');
        comencar(cfg);
      };
    };
    draw();
  }
  function comencar(cfg) {
    S = ME.crearPartida(Object.assign({}, cfg, { llavor: (Date.now() % 2147483647) | 1 }));
    S.config.tutorial = !!cfg.tutorial; S.config.pin = cfg.pin || '';
    S.reg = []; S.regOk = true; fia('I');
    ui.empVista = primerHuma(); ui.vista = 'tauler'; ui.tutDone = {}; ui.mobil = 'tauler';
    desa(); joc();
  }

  /* ---------- Pantalla de joc ---------- */
  function joc() {
    if (S.fase === 'final') return final();
    app.innerHTML = `<div class="joc">
      <header class="top"></header>
      <div class="cos"><main class="main" id="main"></main><aside class="lateral" id="lateral" aria-label="Panell de l'empresa"></aside></div>
      <nav class="nav-mobil" aria-label="Seccions"></nav></div>`;
    render();
  }
  const VISTES_TOTES = [['tauler', 'tauler', 'Tauler'], ['empresa', 'paquet', 'Quatre P'], ['finances', 'finances', 'Finances'], ['mercat', 'pastis', 'Mercat'], ['classificacio', 'trofeu', 'Classificació'], ['llicons', 'llibre', 'Lliçons'], ['docent', 'escut', 'Docent']];
  const vistes = () => VISTES_TOTES.filter(([k]) => !(k === 'docent' && S.config.repte) && !(k === 'llicons' && !S.empreses.some(e => e.humana)));
  function render() {
    if (!S) return;
    if (S.fase === 'final') return final();
    const top = $('.top'); if (!top) return joc();
    if (!vistes().some(([k]) => k === ui.vista)) ui.vista = 'tauler';
    const torn = S.empreses[S.torn];
    top.innerHTML = `${logo(false)}<div class="info">
        <span class="chip">${I('rellotge')} Ronda ${S.ronda} de ${S.config.rondes}</span>
        <span class="chip fase">${esc(ME.NOM_FASE[S.fase])}${['decisions', 'moviment'].includes(S.fase) ? ' · ' + esc(torn.nom) : ''}</span>
        <span class="chip sector">${I(sec().icona)} ${esc(sec().nom)}</span>${S.config.repte ? `<span class="chip">${I('equip')} Repte ${esc(S.config.repte.nom || S.config.repte.codi)}</span>` : ''}</div>
      <div class="acc">${S.config.repte ? `<button class="btn small" id="bEnvia">${I('descarrega')} <span class="amaga-mobil">Envia el resultat</span></button>` : ''}<button class="btn small ghost" id="bAjuda" aria-label="Com es juga">${I('ajuda')}</button><button class="btn small ghost" id="bMenu">${I('tauler')} <span class="amaga-mobil">Menú</span></button></div>`;
    if ($('#bEnvia')) $('#bEnvia').onclick = modalCodi;
    $('#bMenu').onclick = () => { desa(); portada(); };
    $('#bAjuda').onclick = ajuda;
    // Vista visible: a l'ordinador, el panell lateral sempre; al mòbil, una sola secció
    const main = $('#main'), lat = $('#lateral');
    main.innerHTML = `<div class="tabs" role="tablist">${vistes().map(([k, ic, n]) => `<button role="tab" aria-selected="${ui.vista === k}" class="${ui.vista === k ? 'on' : ''}" data-vista="${k}">${I(ic)} ${n}</button>`).join('')}</div><div id="vista"></div>`;
    $$('[data-vista]', main).forEach(b => b.onclick = () => obreVista(b.dataset.vista));
    pintaVista($('#vista'));
    lat.innerHTML = lateral();
    lligaLateral(lat);
    $('.nav-mobil').innerHTML = [['tauler', 'tauler', 'Tauler'], ['panell', 'edifici', 'Torn'], ['empresa', 'paquet', '4P'], ['mercat', 'pastis', 'Mercat'], ['llicons', 'llibre', 'Lliçons'], ['classificacio', 'trofeu', 'Rànquing']]
      .map(([k, ic, n]) => `<button class="${ui.mobil === k ? 'on' : ''}" data-mob="${k}">${I(ic)}<span>${n}</span></button>`).join('');
    $$('[data-mob]').forEach(b => b.onclick = () => { ui.mobil = b.dataset.mob; if (ui.mobil !== 'panell') ui.vista = ui.mobil; render(); });
    main.classList.toggle('amaga', ui.mobil === 'panell'); lat.classList.toggle('vista', ui.mobil === 'panell');
    tutorial();
    tick();
  }
  function obreVista(v) { ui.vista = v; ui.mobil = v; render(); const m = $('#main'); if (m) m.scrollTop = 0; }
  function pintaVista(el) {
    ({ tauler: vTauler, empresa: vEmpresa, finances: vFinances, mercat: vMercat, classificacio: vClassificacio, llicons: vLlicons, docent: vDocent })[ui.vista](el);
  }

  /* ---------- Tauler ---------- */
  function posGrid(i) { // recorregut horari començant a dalt a l'esquerra
    if (i <= 6) return [0, i]; if (i <= 12) return [i - 6, 6]; if (i <= 18) return [6, 6 - (i - 12)]; return [6 - (i - 18), 0];
  }
  function vTauler(el) {
    const ev = S.esdeveniment && ME.carta(S.esdeveniment);
    el.innerHTML = `<div class="tauler-wrap"><div class="tauler" id="tauler">
      ${MD.tauler.map((c, i) => {
        const [r, k] = posGrid(i), amo = c.t === 'prop' && S.propietaris[c.id] != null ? S.empreses[S.propietaris[c.id]] : null;
        return `<button class="cas ${c.t} ${amo ? 'te-amo' : ''}" style="grid-row:${r + 1};grid-column:${k + 1};${amo ? '--amo:' + colorE(amo) : ''}" data-cas="${i}" aria-label="${esc(c.nom)}${amo ? ', propietat de ' + esc(amo.nom) : ''}">
          ${I(iconaCasella(c), 'ci')}<span class="cn">${esc(c.nom)}</span>
          ${c.t === 'prop' ? `<span class="cp">${amo ? esc(amo.nom) : eur(c.preu)}</span>` : ''}
          ${S.millores[c.id] ? `<span class="millora" title="Millorat">${I('estrella')}</span>` : ''}<span class="cnum">${c.n}</span></button>`;
      }).join('')}
      <div class="centre">${mapaSVG()}
        <div class="cap">${logo(false)}<div class="estat"><span class="muted">Ronda</span><b>${S.ronda} / ${S.config.rondes}</b><span class="muted">${esc(ME.NOM_FASE[S.fase])}</span></div></div>
        <div></div>
        <div class="baix">${ev ? `<div class="mini-carta" style="border-left-color:${ev.tipus === 'competitiva' ? 'var(--p-producte)' : 'var(--blau)'}"><span class="muted small">Esdeveniment de la ronda</span><b>${esc(ev.titol)}</b>${esc(ev.text)}</div>` : '<span></span>'}
          <div class="daus" aria-live="polite">${S.dau ? S.dau.map(d => `<span class="dau-cub" aria-label="Dau: ${d}">${d}</span>`).join('') : `<span class="dau-cub">${I('dau')}</span><span class="dau-cub">${I('dau')}</span>`}</div></div>
      </div>
      <div class="fitxes" id="fitxes">${S.empreses.map(e => `<span class="token ${S.torn === e.id && ['decisions', 'moviment'].includes(S.fase) ? 'actiu' : ''}" id="tok${e.id}" style="background:${colorE(e)}" title="${esc(e.nom)}">${I(e.fitxa)}</span>`).join('')}</div>
    </div></div>`;
    S.empreses.forEach(e => colocaFitxa(e.id, e.pos));
    $$('[data-cas]', el).forEach(b => b.onclick = () => infoCasella(+b.dataset.cas));
  }
  function iconaCasella(c) { return c.icona || ({ sortida: 'bandera', oport: 'bombeta', empresa: 'malet', mercat: 'grafic', imposts: 'document', consultoria: 'lupa', promo: 'megafon', fira: 'tenda', auditoria: 'escut' })[c.t] || 'estrella'; }
  function colocaFitxa(id, pos) {
    const t = $('#tok' + id); if (!t) return;
    const [r, k] = posGrid(pos), mateixa = S.empreses.filter(e => e.pos === pos), j = mateixa.findIndex(e => e.id === id), n = mateixa.length;
    const off = n > 1 ? (j - (n - 1) / 2) * 3.2 : 0;
    t.style.left = `calc(${(k + 0.5) / 7 * 100}% + ${off}%)`; t.style.top = `calc(${(r + 0.5) / 7 * 100}% + ${n > 1 ? (j % 2 ? 4.2 : 1.6) : 3}%)`;
  }
  function infoCasella(i) {
    const c = MD.tauler[i], amo = c.t === 'prop' && S.propietaris[c.id] != null ? S.empreses[S.propietaris[c.id]] : null;
    modal(`<h2>${I(iconaCasella(c))} ${esc(c.nom)}</h2>
      ${c.t === 'prop' ? `<dl class="dades"><dt>Zona</dt><dd>${esc(c.zona)}</dd><dt>Preu de compra</dt><dd>${eur(c.preu)}</dd><dt>Taxa d'ús</dt><dd>${eur(c.taxa * (S.millores[c.id] ? 2 : 1))}</dd><dt>Manteniment per ronda</dt><dd>${eur(c.mant)}</dd><dt>Propietari</dt><dd>${amo ? esc(amo.nom) + (S.millores[c.id] ? ' (millorat)' : '') : 'Disponible'}</dd></dl>
        <p><b>Avantatge:</b> ${esc(c.txt)}${S.millores[c.id] ? ' (×1,5 perquè està millorat)' : ''}.</p><p class="muted small">Comprar un actiu del tauler és una inversió: surt de la tresoreria, però conserva el 90 % del valor a l'empresa i cobra una taxa a qui hi caigui.</p>`
      : `<p>${esc(c.desc)}</p>`}
      <button class="btn" data-focus id="ok">Tancar</button>`, (m) => { m.querySelector('#ok').onclick = tancaModal; }, { tancable: true });
  }
  // Mou la fitxa casella a casella
  function animaMoviment(id, desde, fins, fet) {
    const passos = []; let p = desde; while (p !== fins) { p = (p + 1) % MD.tauler.length; passos.push(p); }
    if (pref.redueix || !$('#tok' + id) || ui.vista !== 'tauler') return fet();
    let k = 0;
    const pas = () => {
      if (k >= passos.length) return setTimeout(fet, 180);
      colocaFitxa(id, passos[k++]); setTimeout(pas, 170);
    };
    pas();
  }

  /* ---------- Panell lateral: empresa i acció del moment ---------- */
  function lateral() {
    const viewing = ['decisions', 'moviment'].includes(S.fase) ? S.torn : ui.empVista;
    const e = S.empreses[viewing], v = ME.valorEmpresa(S, e), d = e.darrer;
    return `<div class="emp-cap">${fitxa(e)}<div><h2>${esc(e.nom)}</h2><small>${e.humana ? (e.membres.length ? esc(e.membres.join(', ')) : 'Equip d\'alumnes') : 'IA ' + esc(MD.perfilsIA[e.perfil].nom.toLowerCase())}</small></div>
        ${['decisions', 'moviment'].includes(S.fase) ? '' : `<select class="inp sel-emp" id="selEmp" aria-label="Veure una altra empresa" style="width:auto;min-height:38px">${S.empreses.map(x => `<option value="${x.id}" ${x.id === e.id ? 'selected' : ''}>${esc(x.nom)}</option>`).join('')}</select>`}</div>
      <div class="kpis">
        <div class="kpi"><span>Tresoreria</span><b class="${e.diners < 0 ? 'neg' : ''}">${eur(e.diners)}</b></div>
        <div class="kpi"><span>Valor empresarial</span><b>${eur(v.total)}</b></div>
        <div class="kpi"><span>Vendes (última ronda)</span><b>${d ? eur(d.ingressos) : '—'}</b>${d ? `<em class="muted">${nf(d.unitats)} ${esc(sec().unitats)}</em>` : ''}</div>
        <div class="kpi"><span>Resultat (última ronda)</span><b class="${d ? (d.resultat >= 0 ? 'pos' : 'neg') : ''}">${d ? eur(d.resultat) : '—'}</b></div>
        <div class="kpi"><span>Quota de mercat</span><b>${d ? pct(d.quota) : '—'}</b></div>
        <div class="kpi"><span>Reputació · Notorietat</span><b>${Math.round(e.rep)} · ${Math.round(e.not)}</b></div>
        ${e.deute + e.deuteEmerg ? `<div class="kpi gran"><span>Deute</span><b class="neg">${eur(e.deute + e.deuteEmerg)}</b>${e.dificultat ? '<em class="neg">Dificultat financera: retorna el préstec d\'emergència com abans millor.</em>' : ''}</div>` : ''}
      </div>
      <div class="accio">${accioFase()}</div>`;
  }
  function accioFase() {
    const e = S.empreses[S.torn];
    if (S.fase === 'esdeveniment') {
      const c = ME.carta(S.esdeveniment);
      return `<h3>Fase 1 · Esdeveniment</h3><div class="caixa groc"><b>${esc(c.titol)}</b><p class="small" style="margin:6px 0 0">${esc(c.text)}</p><p class="small muted" style="margin:6px 0 0">${esc(efecteText(c))}</p></div>
        <button class="btn prim big" data-acc="continuar">Passar a les decisions ${I('fletxa')}</button>`;
    }
    if (S.fase === 'decisions') {
      return `<h3>Fase 2 · Decisions de les quatre P</h3>${ordreList()}
        ${e.humana ? `<div class="caixa"><p class="small" style="margin:0 0 10px">Torn de <b>${esc(e.nom)}</b>: decidiu producte, preu, distribució i promoció. Totes les empreses decideixen abans de moure.</p>
          <div class="row"><button class="btn" data-acc="4p">${I('paquet')} Obrir les quatre P</button><button class="btn prim" data-acc="confirmar">${I('ok')} Decisions preses</button></div></div>` : `<div class="caixa">${I('robot')} <b>${esc(e.nom)}</b> està decidint…</div>`}`;
    }
    if (S.fase === 'moviment') {
      return `<h3>Fase 3 · Tauler</h3>${ordreList()}
        ${e.humana ? (S.pendent ? `<button class="btn prim big" data-acc="pendent">Resoldre la casella</button>` : `<button class="btn prim big" data-acc="tirar">${I('dau')} Tirar els daus</button>`) : `<div class="caixa">${I('robot')} <b>${esc(e.nom)}</b> tira els daus…</div>`}`;
    }
    if (S.fase === 'mercat') return `<h3>Fase 4 · Resolució del mercat</h3><p class="small">El mercat ha repartit la demanda segons l'atractiu de cada empresa per a cada segment de clients.</p><button class="btn prim big" data-acc="continuar">Veure els resultats ${I('fletxa')}</button>`;
    if (S.fase === 'resultats') return `<h3>Fase 5 · Resultats de la ronda ${S.ronda}</h3><p class="small">Mireu què ha passat a cada empresa i per què abans de continuar.</p>
      <button class="btn" data-acc="veure">${I('pastis')} Veure el resum de la ronda</button>
      <button class="btn prim big" data-acc="continuar">${S.ronda >= S.config.rondes ? 'Veure el final' : 'Començar la ronda ' + (S.ronda + 1)} ${I('fletxa')}</button>`;
    return '';
  }
  function ordreList() {
    return `<div class="ordre">${S.empreses.map((x, i) => `<div class="it ${i === S.torn ? 'on' : i < S.torn ? 'fet' : ''}"><span class="fitxa" style="width:24px;height:24px;background:${colorE(x)}">${I(x.fitxa)}</span> ${esc(x.nom)} ${x.humana ? '' : '<span class="muted small">(IA)</span>'}</div>`).join('')}</div>`;
  }
  function lligaLateral(lat) {
    const sel = $('#selEmp', lat); if (sel) sel.onchange = () => { ui.empVista = +sel.value; render(); };
    $$('[data-acc]', lat).forEach(b => b.onclick = () => {
      const a = b.dataset.acc;
      if (a === 'continuar') llAbansDeContinuar(() => { const acabaRonda = S.fase === 'resultats'; const r = fa({ tipus: 'continuar' }); if (acabaRonda) enviaServidor(); if (S.fase === 'mercat' || S.fase === 'resultats') obreVista('mercat'); if (r.final) { desa(); return final(); } if (S.fase === 'esdeveniment') { obreVista('tauler'); mostraCarta(ME.carta(S.esdeveniment), 'Esdeveniment de la ronda ' + S.ronda, true); } desa(); render(); });
      else if (a === '4p') obreVista('empresa');
      else if (a === 'confirmar') { const e = S.empreses[S.torn]; confirma(`<b>${esc(e.nom)}</b> confirma les decisions d'aquesta ronda? Després ja no les podreu canviar.`, () => { fa({ id: uid(), tipus: 'confirmar', emp: e.id }); ui.vista = 'tauler'; ui.mobil = 'tauler'; desa(); render(); }); }
      else if (a === 'tirar') tirar();
      else if (a === 'pendent') mostraPendent();
      else if (a === 'veure') obreVista('mercat');
    });
  }

  /* ---------- Motor de torns (IA, daus i caselles) ---------- */
  let cobertorVist = {};
  function tick() {
    clearTimeout(tm);
    if (!S || ui.animant || $('.modal') || $('.cobertor')) return;
    if (llPausaDecisions()) return;
    const e = S.empreses[S.torn];
    if (S.fase === 'decisions') {
      if (!e.humana) tm = setTimeout(() => { fia('D', e.id); toast(e.nom + ' ha pres les decisions de la ronda.'); desa(); render(); }, vel(650));
      else if (pref.privat && S.empreses.filter(x => x.humana).length > 1 && !cobertorVist[S.ronda + '-' + e.id]) cobertor(e);
    } else if (S.fase === 'moviment') {
      if (!e.humana) { if (!S.pendent) tm = setTimeout(tirar, vel(700)); else tm = setTimeout(() => { iaCasella(e); }, vel(500)); }
    }
  }
  function cobertor(e) {
    const d = document.createElement('div'); d.className = 'cobertor';
    d.innerHTML = `<div>${fitxa(e)}<h2>Torn de ${esc(e.nom)}</h2><p class="muted">Passeu el dispositiu a l'equip. Les decisions de cada equip són privades.</p><button class="btn prim big" id="som">Som ${esc(e.nom)}: comencem</button></div>`;
    document.body.appendChild(d); $('#som', d).focus();
    $('#som', d).onclick = () => { cobertorVist[S.ronda + '-' + e.id] = 1; d.remove(); obreVista('empresa'); };
  }
  function tirar() {
    const e = S.empreses[S.torn], abans = e.diners;
    const r = fa({ id: uid(), tipus: 'tirar', emp: e.id });
    if (!r.ok) return toast(r.err, 'neg');
    ui.animant = true;
    if (ui.vista !== 'tauler' && e.humana) { ui.vista = 'tauler'; ui.mobil = 'tauler'; }
    render();
    $$('.dau-cub').forEach(d => d.classList.add('roda'));
    colocaFitxa(e.id, r.desde);
    setTimeout(() => animaMoviment(e.id, r.desde, e.pos, () => {
      ui.animant = false; desa();
      if (e.diners !== abans) animaDiners(abans, e.diners);
      if (e.pos < r.desde || (e.pos === 0 && r.desde !== 0)) toast(e.nom + ' passa per l\'inici de negoci: +' + eur(MD.INGRES_SORTIDA), 'pos');
      render();
      if (e.humana) mostraPendent(); else tick();
    }), vel(520));
  }
  function iaCasella(e) {
    const pe = S.pendent, c = MD.tauler[pe.casella], abans = e.diners;
    fia('R', e.id);
    let t = e.nom + ' cau a «' + c.nom + '»';
    if (pe.tipus === 'compra') t += S.propietaris[pe.prop] === e.id ? ' i la compra per ' + eur(ME.propDef(pe.prop).preu) + '.' : ' i no la compra.';
    else if (pe.tipus === 'propia') t += S.millores[pe.prop] ? ' i la millora.' : '.';
    else if (pe.tipus === 'carta') { const k = ME.carta(pe.carta); t += ': carta «' + k.titol + '».'; if (pe.mercat) mostraCarta(k, 'Carta de mercat (afecta tothom)', false); }
    else t += '. ' + pe.text;
    toast(t, e.diners < abans ? 'neg' : e.diners > abans ? 'pos' : ''); desa(); render();
  }
  function mostraPendent() {
    const pe = S.pendent; if (!pe) return;
    const e = S.empreses[pe.emp], c = MD.tauler[pe.casella];
    const fer = (tipus) => { const abans = e.diners; const r = fa({ id: uid(), tipus, emp: e.id }); if (!r.ok) return toast(r.err, 'neg'); tancaModal(); animaDiners(abans, e.diners); desa(); render(); };
    if (pe.tipus === 'carta') { const k = ME.carta(pe.carta); return mostraCarta(k, pe.mercat ? 'Carta de mercat · afecta tothom aquesta ronda' : 'Carta per a ' + e.nom, false, () => fer('passar')); }
    if (pe.tipus === 'compra') {
      const p = ME.propDef(pe.prop), pot = e.diners >= p.preu;
      return modal(`<h2>${I(iconaCasella(p))} ${esc(p.nom)}</h2><p>Està disponible. ${esc(e.nom)} la pot comprar.</p>
        <dl class="dades"><dt>Preu de compra</dt><dd>${eur(p.preu)}</dd><dt>Taxa per a qui hi caigui</dt><dd>${eur(p.taxa)}</dd><dt>Manteniment per ronda</dt><dd>${eur(p.mant)}</dd><dt>Tresoreria després</dt><dd class="${pot ? '' : 'neg'}">${eur(e.diners - p.preu)}</dd></dl>
        <p><b>Avantatge:</b> ${esc(p.txt)}.</p>
        <div class="row"><button class="btn prim" id="si" ${pot ? '' : 'disabled'} data-focus>${I('edifici')} Comprar per ${eur(p.preu)}</button><button class="btn ghost" id="no">No, gràcies</button></div>
        ${pot ? '' : '<p class="neg small">No hi ha prou tresoreria.</p>'}`, (m) => { m.querySelector('#si').onclick = () => fer('comprar'); m.querySelector('#no').onclick = () => fer('passar'); });
    }
    if (pe.tipus === 'propia') {
      const p = ME.propDef(pe.prop), cost = Math.round(p.preu * MD.MILLORA_PROP.cost);
      return modal(`<h2>${I('estrella')} ${esc(p.nom)} és vostre</h2><p>El podeu millorar: la taxa es duplica i l'avantatge es multiplica per 1,5.</p>
        <dl class="dades"><dt>Cost de la millora</dt><dd>${eur(cost)}</dd><dt>Tresoreria després</dt><dd>${eur(e.diners - cost)}</dd></dl>
        <div class="row"><button class="btn prim" id="si" ${e.diners >= cost ? '' : 'disabled'} data-focus>Millorar</button><button class="btn ghost" id="no">Ara no</button></div>`, (m) => { m.querySelector('#si').onclick = () => fer('millorarProp'); m.querySelector('#no').onclick = () => fer('passar'); });
    }
    if (pe.tipus === 'promo' || pe.tipus === 'fira') {
      const cost = pe.tipus === 'promo' ? 2000 : 4000;
      return modal(`<h2>${I(pe.tipus === 'promo' ? 'megafon' : 'tenda')} ${esc(c.nom)}</h2><p>${esc(c.desc)}</p><p class="muted small">Tresoreria després: ${eur(e.diners - cost)}</p>
        <div class="row"><button class="btn prim" id="si" ${e.diners >= cost ? '' : 'disabled'} data-focus>Sí, per ${eur(cost)}</button><button class="btn ghost" id="no">No</button></div>`, (m) => { m.querySelector('#si').onclick = () => fer('acceptar'); m.querySelector('#no').onclick = () => fer('passar'); });
    }
    if (pe.tipus === 'estudi') {
      const at = S.estudi.atr;
      return modal(`<h2>${I('lupa')} Estudi de mercat</h2><p class="small">Atractiu de cada empresa per a cada segment (0–100) amb les decisions d'aquesta ronda. Com més alt, més clients d'aquell segment l'escolliran.</p>
        <div class="taula-w"><table class="t"><thead><tr><th>Empresa</th>${MD.SEG.map(k => `<th class="n">${esc(MD.segments[k].curt)}</th>`).join('')}</tr></thead><tbody>
        ${S.empreses.map((x, i) => `<tr><td>${esc(x.nom)}</td>${MD.SEG.map(k => `<td class="n">${Math.round(at[i][k].A)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
        <button class="btn prim" id="ok" data-focus>Continuar</button>`, (m) => { m.querySelector('#ok').onclick = () => fer('passar'); });
    }
    return modal(`<h2>${I(iconaCasella(c))} ${esc(c.nom)}</h2><p>${esc(pe.text)}</p><button class="btn prim" id="ok" data-focus>Continuar</button>`, (m) => { m.querySelector('#ok').onclick = () => fer('passar'); });
  }
  function efecteText(c) {
    const e = c.e, out = [];
    if (e.diners) out.push((e.diners > 0 ? '+' : '') + eur(e.diners));
    if (e.not) out.push((e.not > 0 ? '+' : '') + e.not + ' notorietat');
    if (e.notTots) out.push(e.notTots + ' notorietat a totes les empreses');
    if (e.rep) out.push((e.rep > 0 ? '+' : '') + e.rep + ' reputació');
    if (e.atr) Object.entries(e.atr).forEach(([k, v]) => out.push((v > 0 ? '+' : '') + v + ' ' + MD.atributs[k].nom.toLowerCase()));
    if (e.atrTots) Object.entries(e.atrTots).forEach(([k, v]) => out.push(v + ' ' + MD.atributs[k].nom.toLowerCase() + ' a tothom'));
    if (e.costMult) out.push('cost unitari ' + (e.costMult > 1 ? '+' : '') + Math.round((e.costMult - 1) * 100) + ' %');
    if (e.cap) out.push('+' + Math.round(e.cap * 100) + ' % de capacitat');
    if (e.capProd) out.push('producció −' + Math.round((1 - e.capProd) * 100) + ' %');
    if (e.capDist) out.push('distribució −' + Math.round((1 - e.capDist) * 100) + ' %');
    if (e.cobSeg) Object.entries(e.cobSeg).forEach(([k, v]) => out.push('+' + v + ' cobertura ' + MD.segments[k].curt.toLowerCase()));
    if (e.demanda) Object.entries(e.demanda).forEach(([k, v]) => out.push('demanda ' + (k === 'tots' ? 'total' : MD.segments[k].curt.toLowerCase()) + ' ' + (v > 1 ? '+' : '') + Math.round((v - 1) * 100) + ' %'));
    if (e.elasticitat) out.push('clients més sensibles al preu');
    if (e.fora) out.push('més competència: es perd part de la demanda');
    if (e.premiCanal) out.push('+15 cobertura per a qui té ' + MD.canals[e.premiCanal].nom.toLowerCase() + (e.premiCanal2 ? ' o ' + MD.canals[e.premiCanal2].nom.toLowerCase() : ''));
    if (e.pesQ) out.push('la qualitat pesa més');
    const r = e.rondes && e.rondes > 1 ? ' · dura ' + e.rondes + ' rondes' : '';
    return (out.join(' · ') || 'Sense efecte directe') + r;
  }
  function mostraCarta(c, titol, esdeveniment, fet) {
    const col = MD.COLOR_CARTA[c.tipus] || 'blau', nomTipus = { oportunitat: 'Oportunitat', crisi: 'Crisi', calendari: 'Calendari', territori: 'Territori', competitiva: 'Competència' }[c.tipus];
    modal(`<p class="muted small" style="margin:0 0 8px">${esc(titol)}</p><div class="carta-gran cc-${col}">
        <span class="tipus">${I({ oportunitat: 'bombeta', crisi: 'llamp', competitiva: 'diana' }[c.tipus] || 'rellotge')} ${nomTipus}</span>
        <h2>${esc(c.titol)}</h2><p>${esc(c.text)}</p>
        <div class="apren"><b>Què aprenem:</b> ${esc(c.aprenem)}</div>
        <div class="efecte">${esc(efecteText(c))}</div>
        <svg class="marca" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5"><path d="${window.MI.P[{ oportunitat: 'bombeta', crisi: 'llamp', competitiva: 'diana' }[c.tipus] || 'rellotge']}"/></svg></div>
      <div class="row" style="margin-top:14px"><button class="btn prim" id="ok" data-focus>${esdeveniment ? 'Entesos' : 'Continuar'}</button></div>`, (m) => { m.querySelector('#ok').onclick = () => { tancaModal(); if (fet) fet(); else render(); }; });
  }

  /* ---------- Quatre P ---------- */
  function vEmpresa(el) {
    const potEditar = S.fase === 'decisions' && S.empreses[S.torn].humana;
    const e = potEditar ? S.empreses[S.torn] : S.empreses[ui.empVista];
    const edit = potEditar;
    const cu = ME.costUnitari(S, e), cap = ME.capacitats(S, e), cob = ME.cobertura(S, e), d = e.darrer, sc = sec();
    const pubs = S.resultats.length ? S.resultats[S.resultats.length - 1].empreses : [];
    const btn = (key, label, cost, extra) => {
      const conf = ui.confirm === key;
      return `<button class="btn small ${conf ? 'confirma' : ''}" data-op="${key}" ${!edit || e.diners < cost ? 'disabled' : ''} ${extra || ''}>${conf ? 'Confirmar ' + eur(cost) : label}</button>`;
    };
    el.innerHTML = `${!edit ? `<div class="caixa" style="margin-bottom:12px">${S.fase === 'decisions' ? 'Ara decideix <b>' + esc(S.empreses[S.torn].nom) + '</b> (IA).' : 'Les quatre P es decideixen a la fase de decisions.'} Aquí veus l'estratègia de <b>${esc(e.nom)}</b>.</div>` : `<div class="caixa groc" style="margin-bottom:12px"><span class="fitxa" style="width:28px;height:28px;display:inline-grid;vertical-align:middle;background:${colorE(e)}">${I(e.fitxa)}</span> Decisions de <b>${esc(e.nom)}</b> · tresoreria <b>${eur(e.diners)}</b>. Cada inversió es confirma amb un segon clic.</div>`}
      <div class="p4">
        <section class="pcard pc-producte"><h3>${I('paquet')} Producte</h3><p class="lead">${esc(sc.producte)}. Cada millora suma ${MD.MILLORA_PASSOS} punts i encareix una mica el cost unitari.</p>
          ${MD.ATR.map(k => `<div class="atr"><label>${I(MD.atributs[k].icona)} ${MD.atributs[k].nom} <span class="muted">${e.atr[k]}</span></label>${btn('m-' + k, '+' + MD.MILLORA_PASSOS + ' · ' + eur(MD.millorarCost(e.atr[k])), MD.millorarCost(e.atr[k]), e.atr[k] >= 100 ? 'disabled' : '')}<div class="barra-v"><i style="width:${e.atr[k]}%"></i></div></div>`).join('')}
          <dl class="dades"><dt>Qualitat percebuda</dt><dd>${Math.round(ME.qualitatPercebuda(e))} / 100</dd><dt>Cost unitari</dt><dd>${cu.toLocaleString('ca-ES')} €</dd></dl></section>

        <section class="pcard pc-preu"><h3>${I('etiqueta')} Preu</h3><p class="lead">Preu de referència del mercat: ${eur(sc.preuRef)}. Permès entre ${eur(sc.preuRef * MD.PREU_MIN)} i ${eur(sc.preuRef * MD.PREU_MAX)}.</p>
          <div class="preu-in"><input type="range" id="preuR" min="${sc.preuRef * MD.PREU_MIN}" max="${sc.preuRef * MD.PREU_MAX}" step="${sc.preuRef >= 50 ? 1 : 0.1}" value="${e.preu}" ${edit ? '' : 'disabled'} aria-label="Preu de venda">
            <input class="inp" type="number" id="preuN" min="${sc.preuRef * MD.PREU_MIN}" max="${sc.preuRef * MD.PREU_MAX}" step="${sc.preuRef >= 50 ? 1 : 0.1}" value="${e.preu}" ${edit ? '' : 'disabled'} aria-label="Preu en euros"></div>
          <dl class="dades" id="preuDades"></dl>
          ${pubs.length ? `<p class="small muted" style="margin:0">Preus publicats l'última ronda: ${pubs.map(x => esc(S.empreses[x.emp].nom) + ' ' + eur(x.preu)).join(' · ')}</p>` : ''}</section>

        <section class="pcard pc-dist"><h3>${I('camio')} Distribució</h3><p class="lead">Els canals decideixen quins clients arriben al producte i quantes unitats pots servir.</p>
          <dl class="dades"><dt>Capacitat de producció</dt><dd>${nf(cap.prod)} ${esc(sc.unitats)}</dd><dt>Capacitat de distribució</dt><dd>${nf(cap.dist)} ${esc(sc.unitats)}</dd><dt>Pots vendre com a màxim</dt><dd>${nf(cap.total)}</dd>${d ? `<dt>Demanda de l'última ronda</dt><dd class="${d.perdudes ? 'neg' : ''}">${nf(d.assignat)}${d.perdudes ? ' (' + nf(d.perdudes) + ' perdudes)' : ''}</dd>` : ''}</dl>
          ${MD.CAN.map(k => { const c = MD.canals[k], on = !!e.canals[k]; return `<div class="canal">${I(c.icona)}<b>${esc(c.nom)}</b>
            ${on ? `<button class="btn small ghost" data-op="t-${k}" ${edit ? '' : 'disabled'}>${ui.confirm === 't-' + k ? 'Confirmar tancar' : 'Actiu · tancar'}</button>` : btn('c-' + k, 'Activar · ' + eur(c.activar), c.activar)}
            <small>${esc(c.desc)} Fix ${eur(c.fix)}/ronda · capacitat ${nf(c.cap * sc.bd)}${c.comissio ? ' · comissió ' + Math.round(c.comissio * 100) + ' %' : ''}</small></div>`; }).join('')}
          <div class="canal">${I('fabrica')}<b>Ampliar la producció</b>${btn('cap', '+' + nf(MD.CAPACITAT_AMPLIAR.cap * sc.bd) + ' · ' + eur(MD.CAPACITAT_AMPLIAR.cost), MD.CAPACITAT_AMPLIAR.cost)}<small>Més capacitat per fabricar o preparar el producte.</small></div>
          <p class="small muted">Cobertura per segment: ${MD.SEG.map(k => esc(MD.segments[k].curt) + ' ' + cob[k]).join(' · ')}</p></section>

        <section class="pcard pc-promo"><h3>${I('megafon')} Promoció</h3><p class="lead">Notorietat actual: <b>${Math.round(e.not)}</b> / 100. Cada ronda se n'oblida un 12 %. Les campanyes duren una ronda.</p>
          <div class="camps">${MD.CAMP.map(k => { const c = MD.campanyes[k], on = e.campRonda.includes(k), conf = ui.confirm === 'p-' + k;
            return `<button class="camp ${on ? 'on' : ''} ${conf ? 'confirma' : ''}" data-op="p-${k}" ${!edit || on || e.diners < c.cost ? 'disabled' : ''}><b>${I(c.icona)} ${esc(c.nom)}</b><span>${conf ? 'Confirmar ' + eur(c.cost) : on ? 'Contractada' : eur(c.cost) + ' · +' + c.not + ' notorietat'}</span><span>${esc(c.desc)}</span></button>`; }).join('')}</div></section>

        <section class="pcard pc-fin"><h3>${I('banc')} Finançament</h3><p class="lead">Préstecs fins a ${eur(MD.PRESTEC.maxim)} al ${Math.round(MD.PRESTEC.interes * 100)} % d'interès per ronda. El deute resta valor a l'empresa.</p>
          <dl class="dades"><dt>Deute bancari</dt><dd>${eur(e.deute)}</dd><dt>Préstec d'emergència (6 %)</dt><dd>${eur(e.deuteEmerg)}</dd></dl>
          <div class="row"><input class="inp" type="number" id="impP" min="1000" step="1000" value="10000" style="width:140px" ${edit ? '' : 'disabled'} aria-label="Import"><button class="btn small" data-op="prestec" ${edit ? '' : 'disabled'}>Demanar</button><button class="btn small" data-op="retornar" ${edit && (e.deute + e.deuteEmerg) ? '' : 'disabled'}>Retornar</button></div></section>

        <section class="pcard pc-neg"><h3>${I('encaixada')} Negociació</h3><p class="lead">Ofereix diners a una altra empresa per un dels seus actius del tauler. L'altra part ha d'acceptar.</p>
          ${(() => { const altres = Object.keys(S.propietaris).filter(id => S.propietaris[id] !== e.id); if (!altres.length) return '<p class="small muted">Encara no hi ha actius d\'altres empreses.</p>';
            return `<div class="row"><select class="inp" id="negProp" style="flex:1;min-width:180px" ${edit ? '' : 'disabled'} aria-label="Actiu">${altres.map(id => `<option value="${id}">${esc(ME.propDef(id).nom)} (${esc(S.empreses[S.propietaris[id]].nom)}, val ${eur(ME.propDef(id).preu)})</option>`).join('')}</select>
              <input class="inp" type="number" id="negImp" min="1000" step="500" value="${ME.propDef(altres[0]).preu}" style="width:130px" ${edit ? '' : 'disabled'} aria-label="Oferta"><button class="btn small" data-op="oferta" ${edit ? '' : 'disabled'}>Fer l'oferta</button></div>`; })()}</section>
      </div>
      ${edit ? `<div class="row" style="margin-top:16px;justify-content:flex-end"><button class="btn prim big" id="conf4p">${I('ok')} Decisions preses</button></div>` : ''}`;
    const pinta = () => {
      const p = +$('#preuN', el).value, cu2 = ME.costUnitari(S, e), m = p - cu2, com = ME.comissioMitjana(e);
      const mitja = pubs.length ? pubs.reduce((a, x) => a + x.preu, 0) / pubs.length : sc.preuRef;
      const posic = p < mitja * 0.93 ? 'econòmic (per sota de la mitjana)' : p > mitja * 1.07 ? 'prèmium (per sobre de la mitjana)' : 'mitjà';
      $('#preuDades', el).innerHTML = `<dt>Cost unitari</dt><dd>${cu2.toLocaleString('ca-ES')} €</dd><dt>Marge unitari</dt><dd class="${m <= 0 ? 'neg' : ''}">${m.toLocaleString('ca-ES', { maximumFractionDigits: 2 })} € (${Math.round(m / p * 100)} %)</dd>
        <dt>Comissions dels canals</dt><dd>${Math.round(com * 100)} % de les vendes</dd><dt>Posicionament</dt><dd>${posic}</dd>
        <dt>Efecte esperat</dt><dd>${p < e.preu ? 'més demanda, menys marge' : p > e.preu ? 'menys demanda, més marge' : 'sense canvi'}</dd>`;
    };
    pinta();
    if (!edit) return;
    const setPreu = (v) => { const r = fa({ tipus: 'preu', emp: e.id, valor: v }); if (!r.ok) toast(r.err, 'neg'); desa(); };
    $('#preuR', el).oninput = () => { $('#preuN', el).value = $('#preuR', el).value; pinta(); };
    $('#preuR', el).onchange = () => setPreu(+$('#preuR', el).value);
    $('#preuN', el).onchange = () => { $('#preuR', el).value = $('#preuN', el).value; pinta(); setPreu(+$('#preuN', el).value); render(); };
    $$('[data-op]', el).forEach(b => b.onclick = () => {
      const op = b.dataset.op;
      const executa = (a) => { const abans = e.diners; const r = fa(Object.assign({ id: uid(), emp: e.id }, a)); ui.confirm = null; if (!r.ok) toast(r.err, 'neg'); else { const rect = b.getBoundingClientRect(); animaDiners(abans, e.diners, rect.left, rect.top); } desa(); render(); };
      const dosClics = (a) => { if (ui.confirm === op) executa(a); else { ui.confirm = op; render(); } };
      if (op.startsWith('m-')) dosClics({ tipus: 'millorar', atr: op.slice(2) });
      else if (op.startsWith('c-')) dosClics({ tipus: 'canal', canal: op.slice(2), actiu: true });
      else if (op.startsWith('t-')) dosClics({ tipus: 'canal', canal: op.slice(2), actiu: false });
      else if (op === 'cap') dosClics({ tipus: 'capacitat' });
      else if (op.startsWith('p-')) dosClics({ tipus: 'campanya', camp: op.slice(2) });
      else if (op === 'prestec') executa({ tipus: 'prestec', import: +$('#impP', el).value });
      else if (op === 'retornar') executa({ tipus: 'retornar', import: +$('#impP', el).value });
      else if (op === 'oferta') ferOferta(e, $('#negProp', el).value, +$('#negImp', el).value);
    });
    const ng = $('#negProp', el); if (ng) ng.onchange = () => { $('#negImp', el).value = ME.propDef(ng.value).preu; };
    $('#conf4p', el).onclick = () => confirma(`<b>${esc(e.nom)}</b> confirma les decisions d'aquesta ronda? Després ja no les podreu canviar.`, () => { fa({ id: uid(), tipus: 'confirmar', emp: e.id }); ui.vista = 'tauler'; ui.mobil = 'tauler'; desa(); render(); });
  }
  function ferOferta(e, prop, imp) {
    const r = fa({ id: uid(), tipus: 'oferta', emp: e.id, prop, import: imp });
    if (!r.ok) return toast(r.err, 'neg');
    const of = r.oferta, ven = S.empreses[of.a], p = ME.propDef(prop);
    if (!ven.humana) {
      const accepta = ME.respostaIA(S, of); const rr = fa({ id: uid(), tipus: 'respondre', oferta: of.id, accepta });
      toast(accepta && rr.ok ? ven.nom + ' accepta: ' + p.nom + ' ara és vostre.' : ven.nom + ' rebutja l\'oferta (demana com a mínim un 30 % més que el valor).', accepta ? 'pos' : 'neg'); desa(); render(); return;
    }
    modal(`<h2>${I('encaixada')} Oferta per a ${esc(ven.nom)}</h2><p><b>${esc(e.nom)}</b> ofereix <b>${eur(imp)}</b> per <b>${esc(p.nom)}</b> (valor de compra ${eur(p.preu)}).</p><p class="muted small">Ha de respondre l'equip de ${esc(ven.nom)}.</p>
      <div class="row"><button class="btn verd" id="si" data-focus>${esc(ven.nom)} accepta</button><button class="btn perill" id="no">Rebutja</button></div>`, (m) => {
      m.querySelector('#si').onclick = () => { const rr = fa({ id: uid(), tipus: 'respondre', oferta: of.id, accepta: true }); tancaModal(); toast(rr.ok ? 'Tracte fet!' : rr.err, rr.ok ? 'pos' : 'neg'); desa(); render(); };
      m.querySelector('#no').onclick = () => { fa({ id: uid(), tipus: 'respondre', oferta: of.id, accepta: false }); tancaModal(); toast('Oferta rebutjada.'); desa(); render(); };
    });
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

  /* ---------- Finances ---------- */
  function vFinances(el) {
    const e = S.empreses[['decisions', 'moviment'].includes(S.fase) && S.empreses[S.torn].humana ? S.torn : ui.empVista], h = e.hist, d = e.darrer, v = ME.valorEmpresa(S, e);
    const labels = h.map(x => 'R' + x.ronda);
    el.innerHTML = `<div class="seccio"><h2>${I('finances')} Finances de ${esc(e.nom)}</h2><p>Compte de resultats de cada ronda. Les inversions (actius, canals, millores) surten de la tresoreria però no són despeses: queden com a actius al valor empresarial.</p>
      ${h.length ? `<div class="taula-w"><table class="t"><thead><tr><th>Concepte</th>${h.map(x => `<th class="n">R${x.ronda}</th>`).join('')}</tr></thead><tbody>
        ${[['Ingressos per vendes', 'ingressos'], ['− Cost variable', 'costVariable', -1], ['− Comissions', 'comissions', -1], ['= Marge brut', 'margeBrut', 1, 1], ['− Costos fixos', 'costosFixos', -1], ['− Promoció', 'promocio', -1], ['= Benefici operatiu', 'beneficiOperatiu', 1, 1], ['− Interessos', 'interessos', -1], ['± Altres (tauler i cartes)', 'altres'], ['= Resultat de la ronda', 'resultat', 1, 1]]
          .map(([n, k, sg, tot]) => `<tr class="${tot ? 'total' : ''}"><td>${n}</td>${h.map(x => `<td class="n ${tot ? (x[k] >= 0 ? 'pos' : 'neg') : ''}">${eur(sg === -1 ? -x[k] : x[k])}</td>`).join('')}</tr>`).join('')}
        </tbody></table></div>` : '<p class="muted">Les finances apareixen després de la primera resolució del mercat.</p>'}</div>
      <div class="grafs">
        <div class="graf"><h3>Evolució del resultat</h3><p>Resultat de cada ronda (€).</p>${linia([{ n: 'Resultat', c: 'var(--verd)', v: h.map(x => x.resultat) }], labels, eur)}</div>
        <div class="graf"><h3>Distribució de costos${d ? ' · ronda ' + d.ronda : ''}</h3><p>On van els diners de l'última ronda.</p>${d ? donut([{ n: 'Cost variable', v: d.costVariable, c: '#9B7AE8' }, { n: 'Comissions', v: d.comissions, c: '#F29D49' }, { n: 'Costos fixos', v: d.costosFixos, c: '#4EA5F5' }, { n: 'Promoció', v: d.promocio, c: '#E879B9' }, { n: 'Interessos', v: d.interessos, c: '#EF6262' }]) : '<p class="muted small">Encara no hi ha dades.</p>'}</div>
        <div class="graf"><h3>Ingressos i despeses</h3><p>Ingressos per vendes i total de costos de cada ronda.</p>${linia([{ n: 'Ingressos', c: 'var(--verd)', v: h.map(x => x.ingressos) }, { n: 'Costos', c: 'var(--vermell)', v: h.map(x => x.costVariable + x.comissions + x.costosFixos + x.promocio + x.interessos) }], labels, eur)}<div class="llegenda"><span><i style="background:var(--verd)"></i>Ingressos</span><span><i style="background:var(--vermell)"></i>Costos</span></div></div>
      </div>
      <div class="seccio" style="margin-top:14px"><h2>${I('edifici')} Valor empresarial: ${eur(v.total)}</h2><p>Valor = tresoreria + actius − deute. Els actius es valoren de manera prudent per no comptar dues vegades els ingressos futurs.</p>
        <table class="t"><tbody><tr><td>Tresoreria</td><td class="n">${eur(v.tresoreria)}</td></tr><tr><td>Propietats del tauler (90 % del preu) i millores (60 %)</td><td class="n">${eur(v.propietats)}</td></tr>
        <tr><td>Altres actius: capacitat (60 %), canals (40 %) i millores de producte (40 %)</td><td class="n">${eur(v.altresActius)}</td></tr><tr><td>Valor de marca: (notorietat + reputació) × ${MD.VALORACIO.marca} €</td><td class="n">${eur(v.marca)}</td></tr>
        <tr><td>− Deute</td><td class="n neg">${eur(-v.deute)}</td></tr><tr class="total"><td>Valor empresarial</td><td class="n">${eur(v.total)}</td></tr></tbody></table></div>`;
  }

  /* ---------- Mercat i resum de la ronda ---------- */
  function vMercat(el) {
    const dem = ME.demandaSegments(S), last = S.empreses[0].darrer ? S.empreses.map(e => e.darrer) : null, ev = S.esdeveniment && ME.carta(S.esdeveniment);
    el.innerHTML = `${last && ['mercat', 'resultats'].includes(S.fase) ? resumRonda(last) : ''}
      <div class="seccio"><h2>${I('pastis')} El mercat de ${esc(sec().nom.toLowerCase())}</h2><p>${S.empreses.length} empreses competeixen per quatre segments de clients. ${ev ? 'Aquesta ronda: <b>' + esc(ev.titol) + '</b>.' : ''}</p>
        <div class="taula-w"><table class="t"><thead><tr><th>Segment</th><th>Què valora</th><th class="n">Demanda aquesta ronda</th></tr></thead><tbody>
          ${MD.SEG.map(k => `<tr><td><b>${esc(MD.segments[k].nom)}</b></td><td class="small">${esc(MD.segments[k].desc)}</td><td class="n">${nf(dem[k])} ${esc(sec().unitats)}</td></tr>`).join('')}
          <tr class="total"><td>Total</td><td></td><td class="n">${nf(Object.values(dem).reduce((a, b) => a + b, 0))}</td></tr></tbody></table></div></div>
      ${last ? `<div class="grafs">
        <div class="graf"><h3>Quota de mercat · ronda ${last[0].ronda}</h3><p>Percentatge de les unitats venudes per totes les empreses.</p>${barres(last.map((r, i) => ({ n: S.empreses[i].nom, v: r.quota, c: colorE(S.empreses[i]) })).sort((a, b) => b.v - a.v), (v) => pct(v))}</div>
        <div class="graf"><h3>Mapa de posicionament</h3><p>Preu de venda i qualitat percebuda de cada empresa.</p>${dispersio(S.empreses.map(e => ({ n: e.nom, x: e.preu, y: ME.qualitatPercebuda(e), c: colorE(e) })), 'Preu (€)', 'Qualitat percebuda')}</div>
        <div class="graf"><h3>Evolució de la quota</h3><p>Quota de mercat de cada empresa per ronda (%).</p>${linia(S.empreses.map(e => ({ n: e.nom, c: colorE(e), v: e.hist.map(h => h.quota) })), S.empreses[0].hist.map(h => 'R' + h.ronda), (v) => Math.round(v) + ' %')}<div class="llegenda">${S.empreses.map(e => `<span><i style="background:${colorE(e)}"></i>${esc(e.nom)}</span>`).join('')}</div></div>
      </div>
      <div class="seccio" style="margin-top:14px"><h2>Vendes per segment i satisfacció</h2><p>Unitats venudes a cada segment l'última ronda, satisfacció dels clients i reputació.</p>
        <div class="taula-w"><table class="t"><thead><tr><th>Empresa</th>${MD.SEG.map(k => `<th class="n">${esc(MD.segments[k].curt)}</th>`).join('')}<th class="n">Satisfacció</th><th class="n">Reputació</th></tr></thead><tbody>
        ${last.map((r, i) => `<tr><td>${esc(S.empreses[i].nom)}</td>${MD.SEG.map(k => `<td class="n">${nf(r.segVenut[k])}</td>`).join('')}<td class="n">${r.satisfaccio}</td><td class="n">${r.reputacio}</td></tr>`).join('')}</tbody></table></div></div>` : '<p class="muted">Els gràfics de mercat apareixen després de la primera ronda.</p>'}`;
    const b = $('#seg', el); if (b) b.onclick = () => $('[data-acc="continuar"]') && $('[data-acc="continuar"]').click();
  }
  function resumRonda(last) {
    return `<div class="seccio" style="border-color:#6d5a1f"><h2>${I('trofeu')} Resultats de la ronda ${last[0].ronda}</h2><p>Què ha passat i per què. Les explicacions comparen cada empresa amb la mitjana del mercat.</p>
      <div class="taula-w"><table class="t"><thead><tr><th>#</th><th>Empresa</th><th class="n">Preu</th><th class="n">Unitats</th><th class="n">Ingressos</th><th class="n">Resultat</th><th class="n">Quota</th><th class="n">Valor</th></tr></thead><tbody>
        ${last.slice().sort((a, b) => a.posicio - b.posicio).map(r => { const e = S.empreses[r.emp]; return `<tr class="${r.posicio === 1 ? 'primer' : ''}"><td>${r.posicio}${r.canviPosicio > 0 ? ' <span class="pos">▲</span>' : r.canviPosicio < 0 ? ' <span class="neg">▼</span>' : ''}</td><td>${esc(e.nom)}</td><td class="n">${eur(r.preu)}</td><td class="n">${nf(r.unitats)}</td><td class="n">${eur(r.ingressos)}</td><td class="n ${r.resultat >= 0 ? 'pos' : 'neg'}">${eur(r.resultat)}</td><td class="n">${pct(r.quota)}</td><td class="n">${eur(r.valor)}</td></tr>`; }).join('')}</tbody></table></div>
      ${last.map(r => { const e = S.empreses[r.emp]; return `<div class="res-emp"><h3><span class="fitxa" style="width:26px;height:26px;background:${colorE(e)}">${I(e.fitxa)}</span>${esc(e.nom)} <span class="muted small">· quatre P treballades: ${r.us4P.length ? r.us4P.map(x => ({ producte: 'producte', preu: 'preu', distribucio: 'distribució', promocio: 'promoció' })[x]).join(', ') : 'cap'} · +${r.xp} XP</span></h3>
        <ul class="explica">${r.explicacio.map(([sg, t]) => `<li data-s="${sg}">${esc(t)}</li>`).join('') || '<li data-s="=">Sense canvis destacables respecte al mercat.</li>'}</ul></div>`; }).join('')}
      ${S.fase === 'resultats' ? `<div class="row" style="margin-top:10px;justify-content:flex-end"><button class="btn prim" id="seg">${S.ronda >= S.config.rondes ? 'Veure el final' : 'Començar la ronda ' + (S.ronda + 1)} ${I('fletxa')}</button></div>` : ''}</div>`;
  }

  /* ---------- Classificació ---------- */
  function vClassificacio(el) {
    const cl = ME.classificacio(S);
    setTimeout(() => { const k = $('#rkClasse'); if (k) { rankingRepte(k); $('#rkRefresca').onclick = () => rankingRepte(k); } });
    el.innerHTML = `${S.config.repte ? `<div class="seccio"><h2>${I('equip')} Rànquing de la classe · repte ${esc(S.config.repte.nom || S.config.repte.codi)}</h2><p>Tots els equips juguen la mateixa partida. Es classifiquen pel valor empresarial i el vostre resultat s'hi actualitza en acabar cada ronda.</p><div id="rkClasse"></div><button class="btn small" id="rkRefresca" style="margin-top:8px">Actualitzar</button></div>` : ''}<div class="seccio"><h2>${I('trofeu')} Classificació</h2><p>Guanya l'empresa amb més valor empresarial al final de la ronda ${S.config.rondes}.</p>
      <div class="taula-w"><table class="t"><thead><tr><th>#</th><th>Empresa</th><th class="n">Valor empresarial</th><th class="n">Resultat acumulat</th><th class="n">Quota (última)</th><th class="n">XP</th><th class="n">Evolució</th></tr></thead><tbody>
        ${cl.map((x, k) => { const e = x.e, d = e.darrer; return `<tr class="${k === 0 ? 'primer' : ''}"><td><b>${k + 1}</b></td><td><span class="fitxa" style="width:24px;height:24px;display:inline-grid;vertical-align:middle;background:${colorE(e)}">${I(e.fitxa)}</span> ${esc(e.nom)}</td>
          <td class="n"><b>${eur(x.v.total)}</b></td><td class="n">${eur(e.hist.reduce((a, h) => a + h.resultat, 0))}</td><td class="n">${d ? pct(d.quota) : '—'}</td><td class="n">${e.xp}</td><td class="n">${d && d.canviPosicio > 0 ? '<span class="pos">▲ ' + d.canviPosicio + '</span>' : d && d.canviPosicio < 0 ? '<span class="neg">▼ ' + (-d.canviPosicio) + '</span>' : '='}</td></tr>`; }).join('')}</tbody></table></div></div>
      <div class="graf"><h3>Evolució del valor empresarial</h3><p>Valor al final de cada ronda (€).</p>${linia(S.empreses.map(e => ({ n: e.nom, c: colorE(e), v: e.hist.map(h => h.valor) })), S.empreses[0].hist.map(h => 'R' + h.ronda), eur)}<div class="llegenda">${S.empreses.map(e => `<span><i style="background:${colorE(e)}"></i>${esc(e.nom)}</span>`).join('')}</div></div>`;
  }

  /* ---------- Panell docent ---------- */
  let docentObert = false;
  function vDocent(el) {
    if (S.config.pin && !docentObert) {
      el.innerHTML = `<div class="seccio" style="max-width:420px"><h2>${I('cadenat')} Panell docent</h2><p>Introdueix el PIN que vas posar en crear la partida.</p><div class="row"><input class="inp" id="pinIn" type="password" inputmode="numeric" style="width:160px" aria-label="PIN"><button class="btn prim" id="pinOk">Entrar</button></div></div>`;
      $('#pinOk', el).onclick = () => { if ($('#pinIn', el).value === S.config.pin) { docentObert = true; render(); } else toast('PIN incorrecte.', 'neg'); };
      return;
    }
    const filtre = ui.filtreLog == null ? 'tots' : ui.filtreLog;
    const log = S.log.filter(l => filtre === 'tots' || String(l.emp) === filtre).slice(-300).reverse();
    el.innerHTML = `<div class="seccio"><h2>${I('escut')} Panell docent · ${esc(S.config.nom)}</h2><p>${esc(sec().nom)} · ronda ${S.ronda} de ${S.config.rondes} · IA ${esc({ facil: 'fàcil', mitja: 'mitjana', dificil: 'difícil' }[S.config.dificultat])} · llavor ${S.config.llavor}</p>
        <div class="row"><button class="btn small" id="csvR">${I('descarrega')} Resultats per ronda (CSV)</button><button class="btn small" id="csvL">${I('descarrega')} Registre econòmic (CSV)</button><button class="btn small" id="json">${I('descarrega')} Partida completa (JSON)</button>
          <label class="btn small">${I('document')} Carregar partida<input type="file" id="imp" accept=".json" hidden></label><button class="btn small perill" id="fi">Finalitzar la partida ara</button></div></div>
      <div class="seccio"><h2>Les quatre P de cada empresa</h2><p>Estat actual de les decisions. Una empresa pot perdre la competició i haver fet una bona estratègia de màrqueting.</p>
        <div class="taula-w"><table class="t"><thead><tr><th>Empresa</th><th>Producte (Q·D·I·S·SV)</th><th class="n">Preu</th><th>Distribució</th><th class="n">Promoció total</th><th class="n">Notor.</th><th class="n">Reput.</th><th class="n">Valor</th></tr></thead><tbody>
        ${S.empreses.map(e => `<tr><td>${esc(e.nom)}${e.humana ? (e.membres.length ? '<br><small class="muted">' + esc(e.membres.join(', ')) + '</small>' : '') : ' <small class="muted">(IA ' + esc(MD.perfilsIA[e.perfil].nom.toLowerCase()) + ')</small>'}</td>
          <td class="small">${MD.ATR.map(k => e.atr[k]).join(' · ')}</td><td class="n">${eur(e.preu)}</td><td class="small">${MD.CAN.filter(k => e.canals[k]).map(k => MD.canals[k].nom).join(', ')}${e.ampliacions ? ' · +' + e.ampliacions + ' ampl.' : ''}</td>
          <td class="n">${eur(e.inversio.promocio)}</td><td class="n">${Math.round(e.not)}</td><td class="n">${Math.round(e.rep)}</td><td class="n">${eur(ME.valorEmpresa(S, e).total)}</td></tr>`).join('')}</tbody></table></div></div>
      <div class="seccio"><h2>Ús de les quatre P per ronda</h2><p>Quines variables ha treballat cada empresa a cada ronda (P = producte, € = preu, D = distribució, M = promoció).</p>
        <div class="taula-w"><table class="t"><thead><tr><th>Empresa</th>${S.empreses[0].hist.map(h => `<th class="n">R${h.ronda}</th>`).join('')}</tr></thead><tbody>
        ${S.empreses.map(e => `<tr><td>${esc(e.nom)}</td>${e.hist.map(h => `<td class="n">${['producte', 'preu', 'distribucio', 'promocio'].map((k, i) => (h.us4P || []).includes(k) ? ['P', '€', 'D', 'M'][i] : '·').join(' ')}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>
      <div class="seccio"><h2>Registre d'operacions</h2><p>Totes les operacions econòmiques, amb ronda, empresa, concepte i import (últimes 300).</p>
        <select class="inp" id="filt" style="width:auto;margin-bottom:10px" aria-label="Filtrar per empresa"><option value="tots">Totes les empreses</option>${S.empreses.map(e => `<option value="${e.id}" ${filtre === String(e.id) ? 'selected' : ''}>${esc(e.nom)}</option>`).join('')}<option value="-1" ${filtre === '-1' ? 'selected' : ''}>Mercat</option></select>
        <div class="taula-w"><table class="t"><thead><tr><th>R</th><th>Fase</th><th>Empresa</th><th>Concepte</th><th class="n">Import</th><th class="n">Saldo</th></tr></thead><tbody>
        ${log.map(l => `<tr><td>${l.ronda}</td><td class="small muted">${esc(ME.NOM_FASE[l.fase] || l.fase)}</td><td>${esc(l.empresa)}</td><td class="small">${esc(l.concepte)}</td><td class="n ${l.import > 0 ? 'pos' : l.import < 0 ? 'neg' : ''}">${l.import ? eur(l.import) : ''}</td><td class="n">${l.saldo == null ? '' : eur(l.saldo)}</td></tr>`).join('')}</tbody></table></div></div>`;
    const baixa = (nom, txt, tipus) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + txt], { type: tipus })); a.download = nom; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); };
    const base = (S.config.nom || 'partida').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-');
    $('#csvR', el).onclick = () => baixa('mercadeja-' + base + '-resultats.csv', ME.csvResultats(S), 'text/csv');
    $('#csvL', el).onclick = () => baixa('mercadeja-' + base + '-registre.csv', ME.csvRegistre(S), 'text/csv');
    $('#json', el).onclick = () => baixa('mercadeja-' + base + '.json', JSON.stringify(S), 'application/json');
    $('#imp', el).onchange = (ev) => { const f = ev.target.files[0]; if (!f) return; f.text().then(t => { try { const n = JSON.parse(t); if (!n.empreses || !n.config) throw 0; S = n; desa(); toast('Partida carregada.', 'pos'); joc(); } catch (e) { toast('Aquest fitxer no és una partida de Mercadeja.', 'neg'); } }); };
    $('#fi', el).onclick = () => confirma('Vols acabar la partida ara? La classificació serà la d\'aquest moment.', () => { fia('F'); desa(); final(); });
    $('#filt', el).onchange = (ev) => { ui.filtreLog = ev.target.value; render(); };
  }

  /* ---------- Final ---------- */
  function final() {
    clearTimeout(tm); document.querySelectorAll('.toasts, .pas-tutorial').forEach(x => x.remove());
    const cl = ME.classificacio(S), g = cl[0].e, rec = ME.reconeixements(S);
    app.innerHTML = `<main class="final"><div class="podi" id="podi">${I('trofeu', 'trofeu')}<p class="muted" style="margin:0">${esc(S.config.nom)} · ${esc(sec().nom)}</p><h1>${esc(g.nom)} guanya Mercadeja!</h1>
        <p>Valor empresarial final: <b>${eur(cl[0].v.total)}</b></p></div>
      <div class="seccio"><h2>Classificació final</h2><div class="taula-w"><table class="t"><thead><tr><th>#</th><th>Empresa</th><th class="n">Valor empresarial</th><th class="n">Resultat acumulat</th><th class="n">Quota mitjana</th><th class="n">Reputació</th><th class="n">XP</th></tr></thead><tbody>
        ${cl.map((x, k) => { const e = x.e; return `<tr class="${k === 0 ? 'primer' : ''}"><td><b>${k + 1}</b></td><td>${esc(e.nom)}${e.humana ? '' : ' <small class="muted">(IA)</small>'}</td><td class="n"><b>${eur(x.v.total)}</b></td><td class="n">${eur(e.hist.reduce((a, h) => a + h.resultat, 0))}</td><td class="n">${pct(e.hist.length ? e.hist.reduce((a, h) => a + h.quota, 0) / e.hist.length : 0)}</td><td class="n">${Math.round(e.rep)}</td><td class="n">${e.xp}</td></tr>`; }).join('')}</tbody></table></div></div>
      <div class="seccio"><h2>Reconeixements</h2><p>Hi ha més d'una manera de fer bé les coses: aquests reconeixements valoren estratègies diferents.</p>
        <div class="insignies">${Object.entries(rec).filter(([, id]) => id != null).map(([k, id]) => `<div class="insignia"><span class="ic">${I(MD.insignies[k].icona)}</span><div><b>${esc(MD.insignies[k].nom)}</b><span>${esc(S.empreses[id].nom)}</span></div></div>`).join('')}</div></div>
      <div class="grafs"><div class="graf"><h3>Evolució del valor empresarial</h3><p>Valor de cada empresa al final de cada ronda.</p>${linia(S.empreses.map(e => ({ n: e.nom, c: colorE(e), v: e.hist.map(h => h.valor) })), S.empreses[0].hist.map(h => 'R' + h.ronda), eur)}<div class="llegenda">${S.empreses.map(e => `<span><i style="background:${colorE(e)}"></i>${esc(e.nom)}</span>`).join('')}</div></div>
        <div class="graf"><h3>Mapa de posicionament final</h3><p>Preu i qualitat percebuda.</p>${dispersio(S.empreses.map(e => ({ n: e.nom, x: e.preu, y: ME.qualitatPercebuda(e), c: colorE(e) })), 'Preu (€)', 'Qualitat percebuda')}</div></div>
      <div class="seccio" style="margin-top:14px"><h2>Resum de les decisions</h2><div class="taula-w"><table class="t"><thead><tr><th>Empresa</th><th>Producte</th><th class="n">Preu final</th><th>Canals</th><th class="n">Inversió en promoció</th><th class="n">Actius del tauler</th></tr></thead><tbody>
        ${S.empreses.map(e => `<tr><td>${esc(e.nom)}</td><td class="small">${MD.ATR.map(k => MD.atributs[k].nom + ' ' + e.atr[k]).join(' · ')}</td><td class="n">${eur(e.preu)}</td><td class="small">${MD.CAN.filter(k => e.canals[k]).map(k => MD.canals[k].nom).join(', ')}</td><td class="n">${eur(e.inversio.promocio)}</td><td class="n">${ME.propsDe(S, e).length}</td></tr>`).join('')}</tbody></table></div></div>
      <div class="seccio"><h2>${I('bombeta')} Reflexió</h2><p><b>Quina empresa ha aplicat millor les quatre P? Per què?</b> Escriviu la resposta de cada equip: queda desada a la partida i al fitxer que descarregueu.</p>
        ${S.empreses.filter(e => e.humana).map(e => `<label class="f" style="margin-bottom:10px">${esc(e.nom)}<textarea class="inp" data-refl="${e.id}" rows="3">${esc((S.reflexions || {})[e.id] || '')}</textarea></label>`).join('') || '<p class="muted">No hi ha equips humans en aquesta partida.</p>'}</div>
      ${S.empreses.filter(e => e.humana).map(e => { const p = llProgres(e); return `<div class="seccio"><h2>${I('llibre')} Lliçons de ${esc(e.nom)}</h2><p>${p.des.length} de ${LL.length} lliçons descobertes · ${p.n} respostes · <b>${p.enc} encerts</b>. Encara podeu respondre les que teniu pendents.</p>${graellaLlicons(e)}</div>`; }).join('')}
      ${S.config.repte ? `<div class="seccio envia"><h2>${I('descarrega')} Envia el resultat al professor</h2><p>El resultat final s'envia sol al rànquing de la classe, i la reflexió també quan l'escriviu. Si no hi ha connexió, genereu el codi i feu-lo arribar al professor.</p><div id="rkFinal"></div><div class="row" style="margin-top:10px"><button class="btn" id="envia">${I('descarrega')} Codi de resultat (si no hi ha connexió)</button></div></div>` : ''}
      <div class="row" style="justify-content:center"><button class="btn" id="baixa">${I('descarrega')} Descarregar els resultats (CSV)</button><button class="btn" id="json">${I('descarrega')} Partida completa (JSON)</button><button class="btn prim big" id="menu">${I('tauler')} Tornar al menú</button></div></main>`;
    $$('[data-refl]').forEach(t => t.oninput = () => { S.reflexions = S.reflexions || {}; S.reflexions[t.dataset.refl] = t.value; desa(); if (S.config.repte) enviaAviat(); });
    if (S.config.repte && !(S.enviat && S.enviat.final && S.enviat.ok)) enviaServidor();
    const baixa = (nom, txt, tipus) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + txt], { type: tipus })); a.download = nom; a.click(); };
    $('#baixa').onclick = () => baixa('mercadeja-resultats.csv', ME.csvResultats(S), 'text/csv');
    $('#json').onclick = () => baixa('mercadeja-partida.json', JSON.stringify(S), 'application/json');
    $('#menu').onclick = portada;
    if ($('#envia')) $('#envia').onclick = modalCodi;
    if ($('#rkFinal')) (enviant || Promise.resolve()).then(() => rankingRepte($('#rkFinal')));
    $$('[data-ll]').forEach(b => b.onclick = () => mostraLlico(LL.find(l => l.id === b.dataset.ll), S.empreses[+b.dataset.e], () => final()));
    if (!pref.redueix) { const p = $('#podi'), cols = ['#F5C542', '#36B37E', '#4EA5F5', '#E879B9', '#9B7AE8', '#F29D49']; for (let k = 0; k < 60; k++) { const c = document.createElement('span'); c.className = 'confeti'; c.style.left = Math.random() * 100 + '%'; c.style.background = cols[k % 6]; c.style.animationDelay = Math.random() * 1.2 + 's'; p.appendChild(c); } }
    desa();
  }

  /* ---------- Tutorial ---------- */
  const PASSOS = [
    { id: 'tauler', cond: () => S.ronda === 1 && S.fase === 'esdeveniment', t: '1. Coneix el tauler de Catalunya', p: 'Les caselles són actius de diferents territoris (Barcelona, el Vallès, Girona, Lleida...), cartes i oportunitats. Cada ronda comença amb un esdeveniment que canvia la demanda: llegeix-lo al panell i continua.' },
    { id: 'quatrep', cond: () => S.fase === 'decisions' && S.empreses[S.torn].humana, t: '2. Decideix les quatre P', p: 'Obre «Quatre P»: millora el producte, fixa el preu (mira el marge unitari), activa canals de distribució i tria campanyes. Quan acabis, prem «Decisions preses».' },
    { id: 'moure', cond: () => S.fase === 'moviment' && S.empreses[S.torn].humana && !S.pendent, t: '3. Mou la teva empresa', p: 'Tira els daus. La casella on caiguis pot ser un actiu per comprar, una carta o una oportunitat.' },
    { id: 'comprar', cond: () => S.pendent && S.pendent.tipus === 'compra' && S.empreses[S.pendent.emp].humana, t: '4. Compra el primer actiu', p: 'Un actiu et dona avantatges (cobertura, capacitat o menys costos) i cobra una taxa a qui hi caigui. És una inversió: conserva gran part del valor.' },
    { id: 'resultats', cond: () => S.fase === 'resultats', t: '5. Consulta els resultats del mercat', p: 'El resum explica per què cada empresa ha venut el que ha venut. Mira també «Finances» i «Mercat» abans de començar la ronda següent.' }
  ];
  function tutorial() {
    $$('.pas-tutorial').forEach(x => x.remove());
    if (!S || !S.config.tutorial) return;
    const p = PASSOS.find(x => !ui.tutDone[x.id] && x.cond()); if (!p) return;
    const d = document.createElement('div'); d.className = 'pas-tutorial'; d.setAttribute('role', 'note');
    d.innerHTML = `<h3>${esc(p.t)}</h3><p>${esc(p.p)}</p><div class="row"><button class="btn small prim" id="tutOk">Entesos</button><button class="btn small ghost" id="tutSalta">Saltar el tutorial</button></div>`;
    document.body.appendChild(d);
    $('#tutOk', d).onclick = () => { ui.tutDone[p.id] = 1; d.remove(); };
    $('#tutSalta', d).onclick = () => { S.config.tutorial = false; desa(); d.remove(); };
  }

  /* ---------- Ajuda ---------- */
  function ajuda() {
    modal(`<h2>${I('ajuda')} Com es juga</h2>
      <p>Cada empresa comença amb ${eur(100000)} i un producte bàsic. Guanya qui té més <b>valor empresarial</b> al final: tresoreria + actius − deute.</p>
      <ol class="small" style="padding-left:18px;display:grid;gap:6px">
        <li><b>Esdeveniment:</b> una carta de mercat canvia la demanda de la ronda (Nadal, Sant Jordi, rebaixes, una guerra de preus...).</li>
        <li><b>Decisions:</b> cada empresa decideix les quatre P: <span style="color:var(--p-producte)">producte</span>, <span style="color:var(--p-preu)">preu</span>, <span style="color:var(--p-dist)">distribució</span> i <span style="color:var(--p-promo)">promoció</span>. També pot demanar préstecs i negociar actius.</li>
        <li><b>Tauler:</b> tireu els daus. Podeu comprar actius territorials, pagar taxes, robar cartes o aprofitar oportunitats.</li>
        <li><b>Mercat:</b> quatre segments de clients (preu, qualitat, innovadors i responsables) trien segons l'atractiu de cada empresa: preu, qualitat percebuda, notorietat, distribució i adequació al segment. No es pot vendre més del que permet la capacitat.</li>
        <li><b>Resultats:</b> ingressos, costos, benefici, quota de mercat i, sobretot, <b>per què</b> ha passat.</li></ol>
      <p class="small muted">Abaixar el preu no sempre és la millor decisió: guanyes clients sensibles al preu, però perds marge per unitat. La clau és una estratègia coherent entre les quatre P.</p>
      <label class="row small"><input type="checkbox" id="redu2" ${pref.redueix ? 'checked' : ''}> Redueix les animacions</label>
      <div class="row" style="margin-top:12px"><button class="btn prim" id="ok" data-focus>Entesos</button></div>`, (m) => {
      m.querySelector('#ok').onclick = () => { tancaModal(); tick(); };
      m.querySelector('#redu2').onchange = (e) => { pref.redueix = e.target.checked; desaPref(); };
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
  // Moments de pausa: a l'inici del torn de decisions de cada equip i (si només hi ha un equip) abans de la ronda següent
  const llVist = {};
  function llPausaDecisions() {
    const humans = S.empreses.filter(x => x.humana), e = S.empreses[S.torn];
    if (S.fase !== 'decisions' || !e.humana) return false;
    if (pref.privat && humans.length > 1 && !cobertorVist[S.ronda + '-' + e.id]) return false;
    const k = S.ronda + '-d-' + e.id; if (llVist[k]) return false; llVist[k] = 1;
    if (!llPendents(e).length) return false;
    mostraLlicons(e, humans.length > 1 ? 2 : 1, () => render()); return true;
  }
  function llAbansDeContinuar(fet) {
    const humans = S.empreses.filter(x => x.humana);
    if (S.fase !== 'resultats' || humans.length !== 1) return fet();
    const e = humans[0], k = S.ronda + '-r-' + e.id; if (llVist[k] || !llPendents(e).length) return fet();
    llVist[k] = 1; mostraLlicons(e, 2, fet);
  }
  function empLlicons() {
    const h = S.empreses.filter(x => x.humana); if (!h.length) return null;
    const t = S.empreses[S.torn]; if (['decisions', 'moviment'].includes(S.fase) && t.humana) return t;
    const v = S.empreses[ui.empVista]; return v && v.humana ? v : h[0];
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
  function vLlicons(el) {
    const e = empLlicons(); if (!e) { el.innerHTML = '<p class="muted">Les lliçons són per als equips d\'alumnes.</p>'; return; }
    const p = llProgres(e);
    el.innerHTML = `<div class="seccio"><h2>${I('llibre')} Lliçons de ${esc(e.nom)}</h2><p>Cada lliçó apareix quan la partida arriba a una situació on es fa servir aquell contingut del mòdul de màrqueting. Llegiu-la, mireu l'exemple amb les vostres dades i responeu la pregunta.</p>
      <div class="ll-prog"><div><b>${p.des.length}</b><span>de ${LL.length} descobertes</span></div><div><b>${p.n}</b><span>respostes</span></div><div><b>${p.enc}</b><span>encerts</span></div></div>
      <div class="barra-v" style="margin-top:10px"><i style="width:${p.des.length / LL.length * 100}%"></i></div></div>${graellaLlicons(e)}`;
    $$('[data-ll]', el).forEach(b => b.onclick = () => mostraLlico(LL.find(l => l.id === b.dataset.ll), e));
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
      el.innerHTML = d.files.length ? `<div class="taula-w"><table class="t"><thead><tr><th>#</th><th>Equip</th><th class="n">Valor empresarial</th><th class="n">Ronda</th><th class="n">Lliçons (encerts)</th></tr></thead><tbody>
        ${d.files.map((x, k) => `<tr class="${x.equip === jo ? 'primer' : ''}"><td><b>${k + 1}</b></td><td>${esc(x.equip)}${x.equip === jo ? ' <small class="muted">(vosaltres)</small>' : ''}${x.verificat ? '' : ' <small class="neg">⚠</small>'}</td><td class="n"><b>${eur(x.valor)}</b></td><td class="n">${x.acabada ? 'Acabada' : x.ronda + ' / ' + x.rondes}</td><td class="n">${x.llDesc} (${x.llEnc})</td></tr>`).join('')}</tbody></table></div>`
        : '<p class="muted small">Encara no hi ha cap equip al rànquing. El vostre resultat s\'hi envia sol en acabar cada ronda.</p>';
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
      <p>Aquest codi conté tota la vostra partida (${S.fase === 'final' ? 'acabada' : 'fins a la ronda ' + S.ronda + ' de ' + S.config.rondes}). ${rep ? 'El professor l\'afegirà al rànquing de la classe i el joc tornarà a calcular la partida per comprovar-la.' : ''}</p>
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
      <p class="muted">Cada equip juga la mateixa partida al seu dispositiu: el mateix mercat, els mateixos esdeveniments, els mateixos daus i les mateixes tres empreses rivals de la IA. Només canvien les vostres decisions. Al final envieu el codi de resultat al professor per entrar al rànquing.</p>
      <div class="seccio"><h2>Entrar al repte</h2>
        <label class="f">Codi del repte<input class="inp codi-in" id="rc" value="${esc(codi0)}" placeholder="Ex.: A8M-K3X9QZ" autocomplete="off" autocapitalize="characters" spellcheck="false"></label>
        <p class="small" id="rcInfo" style="margin:6px 0 12px"></p>
        <label class="f">Nom de la vostra empresa<input class="inp" id="rn" maxlength="30" placeholder="Ex.: Formatges del Montseny"></label>
        <label class="f" style="margin-top:10px">Membres de l'equip (separats per comes)<input class="inp" id="rm" maxlength="140" placeholder="Nom i cognom de cada membre"></label>
        <div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn prim big" id="rgo">${I('play')} Començar el repte</button></div></div>
      <div class="seccio"><h2>Continuar amb un codi</h2><p class="small">Si vau començar en un altre dispositiu, enganxeu-hi el codi que vau copiar amb «Envia el resultat».</p>
        <textarea class="inp" id="rcod" rows="3" placeholder="MJ1…" spellcheck="false"></textarea><div class="row" style="margin-top:8px"><button class="btn" id="rcont">Recuperar la partida</button></div></div></main>`;
    const info = () => { const v = $('#rc').value.trim(), r = ME.llegirRepte(v); $('#rcInfo').innerHTML = !v ? '' : r ? `<span class="pos">✔ ${esc(MD.sectors[r.sector].nom)} · ${r.rondes} rondes · IA ${esc(NOM_DIF[r.dificultat])}${nomR ? ' · ' + esc(nomR) : ''}</span>` : '<span class="neg">Aquest codi no és vàlid. Ha de tenir aquesta forma: A8M-K3X9QZ.</span>'; };
    $('#rc').oninput = info; info();
    $('#enrere').onclick = portada;
    $('#rgo').onclick = () => {
      const r = ME.llegirRepte($('#rc').value), nom = $('#rn').value.trim().slice(0, 30), membres = $('#rm').value.split(',').map(x => x.trim()).filter(Boolean).slice(0, 4);
      if (!r) return toast('Escriviu un codi de repte vàlid.', 'neg');
      if (!nom) return toast('Poseu nom a la vostra empresa.', 'neg');
      if (MD.empresesSuggerides[r.sector].slice(1, 4).some(x => x.toLowerCase() === nom.toLowerCase())) return toast('Aquest nom ja el fa servir una empresa rival. Trieu-ne un altre.', 'neg');
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
      <p class="muted">El repte és un codi. Els equips envien el resultat sols en acabar cada ronda i el servidor torna a jugar cada partida per comprovar-la abans de posar-la al rànquing. Si no hi ha connexió, també funciona amb codis de resultat.</p>
      <div class="cards">
        <button class="opcio" data-h="crear"><b>${I('mes')} Crear un repte de classe</b><span>Genera un codi i un enllaç. Cada equip juga al seu dispositiu la mateixa partida.</span></button>
        <button class="opcio" data-h="ranking"><b>${I('trofeu')} Rànquing de la classe</b><span>Enganxeu els codis de resultat: classificació, lliçons apreses i decisions de cada equip.</span></button>
        <button class="opcio" data-h="local"><b>${I('tauler')} Partida en un sol dispositiu</b><span>Tots els equips a la mateixa pantalla (pissarra digital), per torns.</span></button>
      </div></main>`;
    $('#enrere').onclick = portada;
    $$('[data-h]').forEach(b => b.onclick = () => ({ crear: crearRepte, ranking: () => ranking(), local: () => configurar('docent') })[b.dataset.h]());
  }
  function crearRepte() {
    const c = { nom: '', sector: 'alimentacio', rondes: 8, dificultat: 'mitja' };
    const draw = () => {
      app.innerHTML = `<main class="config" style="max-width:900px"><button class="btn ghost small" id="enrere">← Mode docent</button>
        <h1>Crear un repte de classe</h1>
        <label class="f" style="max-width:420px">Nom del repte (opcional)<input class="inp" id="cn" maxlength="40" value="${esc(c.nom)}" placeholder="Ex.: CM10-2A · Repte 1"></label>
        <h2>1. Sector</h2><div class="cards">${Object.entries(MD.sectors).map(([k, s]) => `<button class="opcio ${c.sector === k ? 'on' : ''}" data-sector="${k}"><b>${I(s.icona)} ${esc(s.nom)}</b><span>${esc(s.producte)}</span></button>`).join('')}</div>
        <h2>2. Durada i dificultat</h2><div class="row"><div class="seg" role="group" aria-label="Rondes">${[4, 8, 12].map(r => `<button data-rondes="${r}" class="${c.rondes === r ? 'on' : ''}">${r} rondes</button>`).join('')}</div>
          <div class="seg" role="group" aria-label="Dificultat">${[['facil', 'IA fàcil'], ['mitja', 'IA mitjana'], ['dificil', 'IA difícil']].map(([k, n]) => `<button data-dif="${k}" class="${c.dificultat === k ? 'on' : ''}">${n}</button>`).join('')}</div></div>
        <p class="small muted">Orientació: unes 4 rondes per sessió de classe. Cada equip té la partida desada al seu dispositiu i la pot continuar un altre dia.</p>
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
        <span class="muted">${esc(MD.sectors[r.sector].nom)} · ${r.rondes} rondes · IA ${esc(NOM_DIF[r.dificultat])}</span>
        <div id="qr" class="qr" aria-label="Codi QR de l'enllaç"></div>
        <input class="inp" readonly value="${esc(link)}" id="lk" aria-label="Enllaç del repte">
        <div class="row" style="justify-content:center;margin-top:10px"><button class="btn prim" id="cpl">${I('ok')} Copiar l'enllaç</button><button class="btn" id="rk">${I('trofeu')} Obrir el rànquing</button></div></div>
      <div class="seccio"><h2>Com funciona</h2><ol class="small" style="padding-left:18px;display:grid;gap:6px">
        <li>Projecteu aquesta pantalla o compartiu l'enllaç. També poden obrir Mercadeja, entrar a «Repte de classe» i escriure el codi.</li>
        <li>Cada equip escriu el nom de la seva empresa i els membres, i juga contra les mateixes tres empreses de la IA.</li>
        <li>En acabar cada ronda, el resultat s'envia sol al rànquing de la classe, que els equips veuen en directe a «Classificació».</li>
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
    return { equip: e.nom, membres: e.membres || [], ronda: s.ronda, rondes: s.config.rondes, acabada: s.fase === 'final', valor: ME.valorEmpresa(s, e).total,
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
      ${cl ? `<div class="seccio"><h2>${esc(cl.nom || 'Repte')} <span class="muted small">· ${esc(sel)}${rep ? ' · ' + esc(MD.sectors[rep.sector].nom) + ' · ' + rep.rondes + ' rondes' : ''}</span></h2>
        ${eq.length ? `<div class="taula-w"><table class="t"><thead><tr><th>#</th><th>Equip</th><th class="n">Valor empresarial</th><th class="n">Ronda</th><th class="n">Resultat acumulat</th><th class="n">Quota mitjana</th><th class="n">Posició a la seva partida</th><th class="n">Lliçons</th><th class="n">Encerts</th><th>Comprovació</th></tr></thead><tbody>
          ${eq.map((x, k) => `<tr class="${k === 0 ? 'primer' : ''} clicable" data-eq="${esc(x.equip.toLowerCase())}" tabindex="0"><td><b>${k + 1}</b></td><td><b>${esc(x.equip)}</b>${x.membres.length ? '<br><small class="muted">' + esc(x.membres.join(', ')) + '</small>' : ''}</td><td class="n"><b>${eur(x.valor)}</b></td><td class="n">${x.acabada ? 'Acabada' : x.ronda + ' / ' + x.rondes}</td><td class="n ${x.resultat >= 0 ? 'pos' : 'neg'}">${eur(x.resultat)}</td><td class="n">${pct(x.quota)}</td><td class="n">${x.posJoc}a de ${x.nJoc}</td><td class="n">${x.llDesc} / ${LL.length}</td><td class="n">${x.llEnc} / ${x.llResp}</td><td>${x.errors ? '<span class="neg">⚠ ' + x.errors + ' accions no vàlides</span>' : '<span class="pos">✔ Verificat</span>'}</td></tr>`).join('')}</tbody></table></div>
          <p class="small muted">Feu clic a un equip per veure'n el detall (rondes, quatre P, lliçons i reflexió). Si un equip no ha acabat, surt amb el valor de la ronda on és.</p>
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
      const rows = [['Posició', 'Equip', 'Membres', 'Valor empresarial', 'Ronda', 'Acabada', 'Resultat acumulat', 'Quota mitjana %', 'Reputació', 'XP', 'Posició a la seva partida', 'Lliçons descobertes', 'Lliçons respostes', 'Encerts', 'Comprovació', 'Reflexió']];
      eq.forEach((x, k) => rows.push([k + 1, x.equip, x.membres.join(', '), x.valor, x.ronda, x.acabada ? 'sí' : 'no', x.resultat, Math.round(x.quota * 10) / 10, x.rep, x.xp, x.posJoc, x.llDesc, x.llResp, x.llEnc, x.errors ? 'amb errors' : 'verificat', x.refl]));
      baixaFitxer('mercadeja-ranquing-' + slug((cl.nom || '') + '-' + sel) + '.csv', '﻿' + rows.map(r => r.map(v => /[;"\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : v).join(';')).join('\n'), 'text/csv');
    };
    $('#comp').onclick = async () => {
      const codi = await comprimeix({ n: cl.nom || '', c: sel, r: eq.map(x => [x.equip, x.valor, x.acabada ? 0 : x.ronda, x.llEnc, x.llDesc]) });
      const u = new URL(location.href); u.search = ''; u.hash = 'rk=' + codi;
      modal(`<h2>${I('equip')} Compartir el rànquing</h2><p>Qui obri aquest enllaç veurà la classificació (nom de l'equip, valor, ronda i lliçons), sense noms dels membres ni detalls.</p>
        <textarea class="inp codi-res" readonly rows="4">${esc(u.href)}</textarea><div class="row" style="margin-top:10px"><button class="btn prim" id="cp" data-focus>Copiar l'enllaç</button><button class="btn ghost" id="tc">Tancar</button></div>`, (m) => {
        $('#cp', m).onclick = () => copia(u.href, $('.codi-res', m)); $('#tc', m).onclick = tancaModal; }, { tancable: true });
    };
    $('#esb').onclick = () => confirma('Voleu esborrar el rànquing «' + esc(cl.nom || sel) + '» d\'aquest navegador? Els codis dels equips continuaran sent vàlids.', () => { const c2 = classes(); delete c2[sel]; desaClasses(c2); ranking(); });
  }
  async function detallEquip(x) {
    let s; try { s = (await deCodi(x.codi)).s; } catch (e) { return toast('No s\'ha pogut obrir aquest codi.', 'neg'); }
    const e = s.empreses[x.empId] || s.empreses.find(k => k.humana), resp = (s.llicons || {})[e.id] || {}, ids = new Set(llDesbloquejades(s, e).map(l => l.id));
    const nomP = { producte: 'Producte', preu: 'Preu', distribucio: 'Distribució', promocio: 'Promoció' };
    modal(`<h2>${esc(e.nom)}</h2><p class="muted small">${esc((e.membres || []).join(', ') || 'Sense membres indicats')} · ${s.fase === 'final' ? 'partida acabada' : 'ronda ' + s.ronda + ' de ' + s.config.rondes}</p>
      <div class="taula-w"><table class="t"><thead><tr><th>Ronda</th><th class="n">Preu</th><th class="n">Unitats</th><th class="n">Quota</th><th class="n">Resultat</th><th class="n">Valor</th><th>Quatre P treballades</th></tr></thead><tbody>
        ${e.hist.map(h => `<tr><td>${h.ronda}</td><td class="n">${eur(h.preu)}</td><td class="n">${nf(h.unitats)}</td><td class="n">${pct(h.quota)}</td><td class="n ${h.resultat >= 0 ? 'pos' : 'neg'}">${eur(h.resultat)}</td><td class="n">${eur(h.valor)}</td><td class="small">${(h.us4P || []).map(k => nomP[k]).join(', ') || '—'}</td></tr>`).join('')}</tbody></table></div>
      <h3 style="margin-top:14px">Estat final de les quatre P</h3>
      <p class="small">Producte: ${MD.ATR.map(k => MD.atributs[k].nom + ' ' + e.atr[k]).join(' · ')}<br>Preu: ${eur(e.preu)} · Canals: ${MD.CAN.filter(k => e.canals[k]).map(k => MD.canals[k].nom).join(', ')} · Promoció total: ${eur(e.inversio.promocio)} · Notorietat ${Math.round(e.not)} · Reputació ${Math.round(e.rep)}</p>
      <h3>Lliçons</h3><ul class="ll-llista">${LL.map(l => { const r = resp[l.id]; return `<li class="${r ? (r.ok ? 'ok' : 'ko') : ids.has(l.id) ? '' : 'tancada'}"><span>${r ? (r.ok ? '✔' : '✘') : ids.has(l.id) ? '·' : '🔒'}</span><b>${esc(l.titol)}</b> <small class="muted">${esc(l.ra)}${r ? ' · ronda ' + r.ronda : ids.has(l.id) ? ' · sense respondre' : ' · no descoberta'}</small></li>`; }).join('')}</ul>
      <h3>Reflexió final</h3><p class="small">${x.refl ? esc(x.refl) : '<span class="muted">Encara no l\'han escrita.</span>'}</p>
      <div class="row" style="margin-top:12px"><button class="btn ghost" id="tc" data-focus>Tancar</button></div>`, (m) => { $('#tc', m).onclick = tancaModal; }, { tancable: true });
  }
  async function rankingCompartit(codi) {
    let d; try { d = await descomprimeix(codi); } catch (e) { return portada(); }
    app.innerHTML = `<main class="config" style="max-width:900px">${logo(true)}
      <h1>${I('trofeu')} Rànquing${d.n ? ': ' + esc(d.n) : ''}</h1><p class="muted">Repte ${esc(d.c || '')} · classificació per valor empresarial.</p>
      <div class="taula-w"><table class="t"><thead><tr><th>#</th><th>Equip</th><th class="n">Valor empresarial</th><th class="n">Ronda</th><th class="n">Lliçons (encerts)</th></tr></thead><tbody>
        ${(d.r || []).map((x, k) => `<tr class="${k === 0 ? 'primer' : ''}"><td><b>${k + 1}</b></td><td><b>${esc(x[0])}</b></td><td class="n"><b>${eur(x[1])}</b></td><td class="n">${x[2] ? x[2] : 'Acabada'}</td><td class="n">${x[4]} (${x[3]})</td></tr>`).join('')}</tbody></table></div>
      <div class="row" style="margin-top:14px"><button class="btn prim" id="menu">${I('play')} Anar a Mercadeja</button></div></main>`;
    $('#menu').onclick = () => { history.replaceState(null, '', location.pathname + location.search); portada(); };
  }

  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && $('.modal') && !$('.modal #si')) { tancaModal(); if (S && S.fase !== 'final') tick(); } });
  // Arrencada: rànquing compartit (#rk=), enllaç d'un repte (?repte=) o portada
  (function inici() {
    if (location.hash.startsWith('#rk=')) return rankingCompartit(location.hash.slice(4));
    const codi = new URLSearchParams(location.search).get('repte'), r = codi && ME.llegirRepte(codi), d = carrega();
    if (r && !(d && d.config.repte && d.config.repte.codi === r.codi && d.fase !== 'final')) return repte(r.codi);
    portada();
  })();
  window.MERCADEJA = { get S() { return S; }, render, tirar, deCodi, codiDe };
})();
