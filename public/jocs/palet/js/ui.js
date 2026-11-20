/* Palet · interfície: portada, encàrrec del matí, torn (escena + panell), finestres d'inspecció i de prestatgeria, informe del vespre i final. */
(function () {
  const D = window.PD, E = window.PE, PS = window.PS, LL = window.PLL;
  const KEY = 'palet-partida-v1';
  const app = document.getElementById('app');
  const $ = (q, el) => (el || document).querySelector(q), $$ = (q, el) => [...(el || document).querySelectorAll(q)];
  const esc = (t) => String(t == null ? '' : t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const P = (id) => D.productes[id];
  let S = null, ctrl = null;
  const desa = () => { try { if (S) localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } };
  /* ---------- Compte d'alumne i servidor ---------- */
  const FN = location.pathname.replace(/[^/]*$/, '') + '.netlify/functions/palet';
  async function crida(body) {
    const r = await fetch(FN, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    let d = null; try { d = await r.json(); } catch (e) { }
    if (!r.ok || !d) throw new Error((d && d.error) || 'Sense connexió amb el servidor.');
    return d;
  }
  const KC = 'palet-compte-v1';
  let compte = (() => { try { return JSON.parse(localStorage.getItem(KC) || 'null'); } catch (e) { return null; } })();
  const desaCompte = (c) => { compte = c; try { if (c) localStorage.setItem(KC, JSON.stringify(c)); else localStorage.removeItem(KC); } catch (e) { } };
  async function desaNuvol() {
    if (!compte || !S) return;
    try { await crida({ action: 'desar', token: compte.token, partida: S }); }
    catch (e) { if (/sessió/i.test(e.message)) { desaCompte(null); toast('La sessió ha caducat: torna a entrar amb el teu usuari perquè es desi la partida.', 'neg'); } }
  }
  function modalCompte(mode) {
    const reg = mode === 'registre';
    modal(`<h2>👤 ${reg ? 'Crear un compte' : 'Entrar'}</h2>
      <div class="seg" style="margin-bottom:12px"><button data-m="entrar" class="${reg ? '' : 'on'}">Ja tinc compte</button><button data-m="registre" class="${reg ? 'on' : ''}">Crear un compte</button></div>
      <form id="fc" class="fcompte">${reg ? `<label class="f">Nom i cognom<input class="inp" id="cN" maxlength="60" required></label><label class="f">Codi de grup <small class="muted">(te'l dona el professor)</small><input class="inp" id="cG" maxlength="32" required></label>` : ''}
        <label class="f">Nom d'usuari<input class="inp" id="cU" maxlength="24" autocomplete="username" autocapitalize="none" required></label>
        <label class="f">Contrasenya<input class="inp" id="cP" type="password" maxlength="100" autocomplete="${reg ? 'new-password' : 'current-password'}" required></label>
        <p class="small neg" id="cE"></p><div class="row"><button class="btn prim" id="cOk" type="submit">${reg ? 'Crear el compte' : 'Entrar'}</button><button class="btn ghost" type="button" id="tc">Cancel·lar</button></div>
        ${reg ? '' : '<p class="small muted">Si no recordes la contrasenya, demana al professor que te la canviï.</p>'}</form>`, (m) => {
      $$('[data-m]', m).forEach(b => b.onclick = () => modalCompte(b.dataset.m));
      $('#tc', m).onclick = tancaModal;
      $('#fc', m).onsubmit = async (ev) => {
        ev.preventDefault(); $('#cOk', m).disabled = true; $('#cE', m).textContent = '';
        try {
          const d = await crida(reg ? { action: 'registre', usuari: $('#cU', m).value, contrasenya: $('#cP', m).value, nom: $('#cN', m).value, classe: $('#cG', m).value } : { action: 'entrar', usuari: $('#cU', m).value, contrasenya: $('#cP', m).value });
          desaCompte(Object.assign({ token: d.token }, d.compte));
          const local = carrega(), nuvol = d.partida;
          // Es queda la partida més avançada (la del núvol o la d'aquest navegador)
          if (nuvol && (!local || nuvol.config.llavor !== local.config.llavor || (nuvol.historial || []).length >= (local.historial || []).length)) { try { localStorage.setItem(KEY, JSON.stringify(nuvol)); } catch (e) { } }
          else if (local) { S = local; await desaNuvol(); S = null; }
          tancaModal(); toast(reg ? 'Compte creat! La partida es desarà al teu compte.' : 'Hola, ' + esc(d.compte.nom) + '!', 'pos'); portada();
        } catch (e) { $('#cE', m).textContent = e.message; $('#cOk', m).disabled = false; }
      };
      $('#cU', m).focus();
    }, { tancable: true });
  }
  const carrega = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } };
  const nomClient = (id) => (D.CLIENTS.find(c => c.id === id) || {}).nom || id;
  const nomComanda = (o) => o.client === 'web' ? 'Comanda web #' + o.num : nomClient(o.client);

  /* ---------- Peces comunes ---------- */
  function montse(cls) { return `<span class="montse ${cls || ''}" aria-hidden="true"><svg viewBox="0 0 60 60" width="56" height="56"><circle cx="30" cy="30" r="29" fill="#2d2350"/><circle cx="30" cy="25" r="12" fill="#f0c7a0"/><path d="M17 23c0-10 8-15 13-15s14 4 13 16c-3-5-8-8-13-8s-10 3-13 7z" fill="#5a3825"/><path d="M12 56c2-12 9-17 18-17s16 5 18 17" fill="#9B7AE8"/><circle cx="25" cy="25" r="1.6" fill="#222"/><circle cx="35" cy="25" r="1.6" fill="#222"/><path d="M26 31q4 3 8 0" stroke="#7a3b2e" stroke-width="1.6" fill="none"/></svg></span>`; }
  function diu(text, cls) { return `<div class="diu ${cls || ''}">${montse()}<div class="bafarada"><b>Montse</b><span>${text}</span></div></div>`; }
  function toast(t, cls, ms) {
    let w = $('.toasts'); if (!w) { w = document.createElement('div'); w.className = 'toasts'; w.setAttribute('aria-live', 'polite'); document.body.appendChild(w); }
    const d = document.createElement('div'); d.className = 'toast ' + (cls || ''); d.innerHTML = t; w.appendChild(d);
    while (w.children.length > 3) w.firstChild.remove();
    setTimeout(() => d.remove(), ms || 4200);
  }
  function modal(html, onOpen, opts) {
    tancaModal();
    const m = document.createElement('div'); m.className = 'modal'; m.innerHTML = `<div class="modal-box ${opts && opts.ample ? 'ample' : ''}" role="dialog" aria-modal="true">${html}</div>`;
    document.body.appendChild(m);
    if (opts && opts.tancable) { m.onclick = (e) => { if (e.target === m) { tancaModal(); opts.onTanca && opts.onTanca(); } }; }
    onOpen && onOpen(m);
    const f = $('[data-focus]', m) || $('button', m); f && f.focus();
    return m;
  }
  function tancaModal() { $$('.modal').forEach(m => m.remove()); }
  const logo = () => `<div class="logo"><svg viewBox="0 0 64 64" width="52" height="52" aria-hidden="true"><rect x="4" y="40" width="56" height="8" rx="2" fill="#c98b4a"/><rect x="8" y="48" width="8" height="8" fill="#a36b35"/><rect x="28" y="48" width="8" height="8" fill="#a36b35"/><rect x="48" y="48" width="8" height="8" fill="#a36b35"/><rect x="10" y="22" width="20" height="18" rx="2" fill="#F5C542"/><rect x="34" y="22" width="20" height="18" rx="2" fill="#4EA5F5"/><rect x="22" y="6" width="20" height="16" rx="2" fill="#36B37E"/></svg><div><b>PALET</b><span>El joc del magatzem</span></div></div>`;
  const barra = (v, c) => `<span class="barra"><i style="width:${Math.max(0, Math.min(100, v))}%;background:${c}"></i></span>`;
  const avisos = () => `<span class="avisos" title="Avisos de la cap">${Array.from({ length: D.AVISOS_ACOMIADAMENT }, (_, i) => `<i class="${i < S.avisos ? 'on' : ''}">!</i>`).join('')}</span>`;

  /* ---------- Portada ---------- */
  function portada() {
    aturaTorn(); S = null;
    const desat = carrega(), pot = desat && desat.v === 1;
    app.innerHTML = `<main class="portada"><div class="portada-box">${logo()}
      <p class="lema">Fes de mosso de magatzem: rep la mercaderia, ubica-la on toca, prepara les comandes i que el camió no surti sense el palet. La cap t'ho valorarà cada dia.</p>
      <div class="compte-box">${compte ? `👤 <span><b>${esc(compte.nom)}</b> <small class="muted">${esc(compte.usuari)} · grup ${esc(compte.classe)}</small></span><button class="btn small ghost" data-a="surt">Tancar la sessió</button>` : `<span class="small">Entra amb el teu usuari perquè la partida es desi i el professor en vegi el progrés.</span><button class="btn small prim" data-a="compte">👤 Entrar o crear compte</button>`}</div>
      <nav class="menu">
        ${pot ? `<button class="btn prim big" data-a="continua">▶ Continua <small>${esc(desat.config.nom)} · ${(D.MAGATZEMS[desat.config.magatzem] || D.MAGATZEMS.aliment).icona} ${esc(D.NIVELLS[desat.nivell - 1].nom)} · torn ${desat.torn}</small></button>` : ''}
        <button class="btn ${pot ? '' : 'prim'} big" data-a="juga">📦 Juga <small>comença de mosso</small></button>
        <button class="btn big" data-a="taller">🎯 Taller d'habilitat <small>mans, transpalet i toro</small></button>
        <button class="btn big" data-a="ajuda">❓ Com es juga</button>
        <button class="btn big" data-a="docent">🧑‍🏫 Mode docent <small>progrés dels alumnes</small></button>
        <a class="btn big" href="https://ecoynexo.com/ca/aprender/actividades-comerciales/tecnicas-de-almacen/" target="_blank" rel="noopener">📚 Lliçons del mòdul <small>Tècniques de magatzem</small></a>
      </nav>
      <p class="peu">Simulador del mòdul Tècniques de magatzem (CFGM Activitats Comercials) · ECOyNEXO</p></div></main>`;
    $$('[data-a]').forEach(b => b.onclick = () => ({ continua: () => { S = desat; joc(); }, juga: configurar, ajuda, docent, taller: () => window.PH.taller(app, portada), compte: () => modalCompte('entrar'), surt: () => { desaCompte(null); portada(); } })[b.dataset.a]());
  }
  function configurar() {
    let nivell = 1, mag = D.MAGATZEM_PER_DEFECTE, hab = 'delicades';
    const draw = () => {
      app.innerHTML = `<main class="config"><button class="btn ghost small" id="enr">← Tornar</button><h1>Primer dia a la feina</h1>
        <label class="f">El teu nom<input class="inp" id="nom" maxlength="30" placeholder="Ex.: Laia"></label>
        <h2>A quin magatzem treballes?</h2>
        <div class="mags">${Object.entries(D.MAGATZEMS).map(([k, M]) => `<button class="niv ${k === mag ? 'on' : ''}" data-mag="${k}"><b>${M.icona} ${esc(M.nom)}</b><span class="small muted">${esc(M.desc)}</span><span class="small">${[...new Set(Object.values(M.passadissos).flatMap(p => [p.tipus].concat(Object.values(p.mods || {}))))].filter(x => x !== 'cap').map(x => D.ESTANTERIES[x].nom).join(' · ') || 'Sense estanteries'}</span></button>`).join('')}</div>
        <h2>On comences?</h2><p class="muted small">Normalment es comença de mosso i la cap t'ascendeix. Per practicar una part concreta, pots començar en un altre nivell.</p>
        <div class="nivells">${D.NIVELLS.map(N => `<button class="niv ${N.n === nivell ? 'on' : ''}" data-n="${N.n}"><b>${N.n}. ${esc(N.nom)}</b><span class="small muted">${esc(N.desc)}</span></button>`).join('')}</div>
        <h2>Habilitat física</h2><p class="muted small">Manipular les caixes amb les mans i conduir el transpalet i el toro de veritat: els cops, les caigudes i els aixafaments fan malbé la mercaderia.</p>
        <div class="seg hab-seg">${HAB_MODES.map(([k, n]) => `<button data-hab="${k}" class="${k === hab ? 'on' : ''}">${esc(n)}</button>`).join('')}</div><p class="small muted">${esc(HAB_MODES.find(x => x[0] === hab)[2])}</p>
        <div class="row" style="margin-top:18px"><button class="btn prim big" id="go">Entrar al magatzem →</button></div></main>`;
      $('#enr').onclick = portada;
      $$('[data-n]').forEach(b => b.onclick = () => { nivell = +b.dataset.n; const v = $('#nom').value; draw(); $('#nom').value = v; });
      $$('[data-mag]').forEach(b => b.onclick = () => { mag = b.dataset.mag; const v = $('#nom').value; draw(); $('#nom').value = v; });
      $$('[data-hab]').forEach(b => b.onclick = () => { hab = b.dataset.hab; const v = $('#nom').value; draw(); $('#nom').value = v; });
      if (compte) $('#nom').value = compte.nom.split(' ')[0];
      $('#go').onclick = () => { const nom = $('#nom').value.trim().slice(0, 30) || 'Treballador'; S = E.crearPartida({ nom, nivell, magatzem: mag, habilitat: hab, llavor: (Date.now() % 2e9) | 1 }); desa(); joc(); };
    };
    draw();
  }
  function ajuda() {
    modal(`<h2>Com es juga</h2><ul class="ajuda">
      <li><b>Al matí</b>, la Montse (la cap) t'explica la feina del torn: camions que arriben, comandes de les botigues i hora de sortida dels camions.</li>
      <li><b>Recepció</b>: toca una càrrega del moll 1 per revisar-la. Compara l'etiqueta amb l'albarà i accepta-la o rebutja-la amb el motiu.</li>
      <li><b>Ubicació</b>: toca una càrrega acceptada per agafar-la i després la prestatgeria on va. Tria el nivell i la posició. Al principi el sistema et diu la ubicació; quan siguis carretoner, la tries tu.</li>
      <li><b>Comandes</b> (des de preparador): comença una comanda, toca les prestatgeries, tria el lot (FEFO!) i la quantitat, i deixa el palet al moll del seu camió abans que surti. El que agafes primer queda a baix del palet.</li>
      <li><b>Habilitat física</b> (si l'actives en començar): les tasques delicades es fan de veritat. A mà, amb dues mans independents (agafar, aixecar, girar, deixar), i amb el transpalet o el toro conduint, introduint les forquilles i pujant la càrrega. Els cops, les caigudes, els aixafaments i les frenades brusques fan malbé la mercaderia. Practica-ho al <b>Taller d'habilitat</b>.</li>
      <li><b>Seguretat</b>: el botó «Pressa» et fa anar més ràpid, però amb càrrega pots tenir un accident. No deixis res al passadís ni davant de la sortida.</li>
      <li><b>Al vespre</b>, l'informe i la nota de la cap. Bons torns seguits: <b>ascens</b>. Tres avisos: <b>acomiadament</b>.</li></ul>
      <div class="row"><button class="btn prim" id="tc" data-focus>Entesos</button></div>`, (m) => { $('#tc', m).onclick = tancaModal; }, { tancable: true });
  }

  /* ---------- Router ---------- */
  function joc() {
    aturaTorn();
    if (!S) return portada();
    E.mag(S); desa();
    if (S.fase === 'final') return final();
    if (S.fase === 'resultat') return resultat();
    if (S.fase === 'torn') S.fase = 'briefing';   // un torn a mitges es torna a començar
    return briefing();
  }
  function capcalera(extra) {
    const N = E.nivell(S);
    return `<header class="top">${logo()}<div class="info"><span class="chip">📅 ${E.data(S.dia.dia)} · torn ${S.torn}</span><span class="chip" title="${esc(D.MAG.nom)}">${D.MAG.icona} <span class="amaga-mobil">${esc(D.MAG.nom)}</span></span><span class="chip niv-chip">${esc(N.nom)}</span><span class="chip">${esc(S.config.nom)}</span>${avisos()}${extra || ''}</div>
      <div class="acc"><button class="btn small ghost" id="bAj" aria-label="Com es juga">❓</button><button class="btn small ghost" id="bMenu" aria-label="Menú">☰</button></div></header>`;
  }
  function lligaCap() { $('#bAj').onclick = ajuda; $('#bMenu').onclick = () => { desa(); portada(); }; }

  /* ---------- Encàrrec del matí ---------- */
  function briefing() {
    const t = S.dia, N = E.nivell(S);
    const primer = S.historial.filter(h => h.nivell === S.nivell).length === 0;
    const rec = t.recepcions.map(rc => `<li>🚚 <b>${E.hora(rc.arribada)}</b> · camió de <b>${esc(rc.proveidor)}</b> al moll 1 (${rc.carregues.length} càrregues)</li>`).join('');
    const cam = t.camions.map(c => `<li>🚛 Surt a les <b>${E.hora(c.sortida)}</b> del <b>moll ${c.moll}</b>: ${c.transportista ? esc(c.transportista) : c.ruta.map(nomClient).join(' → ')}</li>`).join('');
    const tipus = [...new Set(D.PASSADISSOS.flatMap(p => [p.tipus].concat(Object.values(p.mods))))].filter(x => x !== 'cap');
    const frase = primer && S.torn === 1 ? D.FRASES.benvinguda[0] : primer ? `Avui comences de ${N.nom.toLowerCase()}. ${N.desc}` : S.darrer && S.darrer.veredicte === 'bronca' ? 'Espero que avui vagi millor que ahir. Vigila el que et vaig dir.' : 'Bon dia! Aquí tens la feina d\'avui.';
    app.innerHTML = `<div class="pant">${capcalera()}<main class="brief">
      ${diu(esc(frase))}
      <section class="sec mag-card"><h2>${D.MAG.icona} ${esc(D.MAG.nom)}</h2><p class="small">${esc(D.MAG.desc)}</p>
        ${tipus.length ? `<div class="estants">${tipus.map(x => `<div class="estant t-${x}"><b>${esc(D.ESTANTERIES[x].nom)}</b><span class="small muted">${esc(D.ESTANTERIES[x].desc)}</span><span class="small">Passadís ${D.PASSADISSOS.filter(p => p.tipus === x || Object.values(p.mods).includes(x)).map(p => p.id).join(', ')}</span></div>`).join('')}</div>` : ''}</section>
      <section class="sec"><h2>Feina d'avui</h2><ul class="llista">${rec}${cam}${D.MAG.mode === 'cross' ? '<li>🔀 Classifica cada càrrega pel seu destí i porta-la al moll del camió que hi va abans que surti</li>' : ''}${t.comandes.length ? `<li>📋 ${t.comandes.length} comandes ${D.MAG.mode === 'ecom' ? 'web per preparar per onades i embalar' : 'de botigues per preparar'}</li>` : ''}${t.inventari ? `<li>🔢 Recompte de ${t.inventari.recomptes.length} ubicacions i revisió del punt de comanda</li>` : ''}</ul>
        <p class="small muted">El torn és de 8:00 a 14:00. Equip: ${esc(D.EQUIPS[N.equip].nom)}. ${D.MAG.mode === 'cross' ? 'Aquí no s\'ubica res: tot surt el mateix dia.' : E.lliure(S) ? 'Ubicació lliure (caòtica): tries tu on va cada càrrega i el sistema la registra.' : 'Ubicació fixa: el sistema et diu on va cada càrrega.'}${D.MAG.prods.some(id => P(id).fred) ? ` Des que acceptes un producte de fred fins que és a la cambra, els refrigerats poden estar com a molt ${D.FRED_MAX.refri} minuts fora del fred, i els congelats ${D.FRED_MAX.conge}.` : ''}</p></section>
      ${primer ? `<section class="sec"><h2>Abans de començar</h2><div class="ll-cards">${LL.deNivell(S.nivell, D.MAG_ID).map(l => `<button class="ll-card" data-ll="${l.id}"><b>${esc(l.titol)}</b><span class="small muted">${esc(l.text.slice(0, 90))}…</span></button>`).join('')}</div></section>` : ''}
      <div class="row" style="justify-content:center;margin:20px 0"><button class="btn prim big" id="go">Començar el torn ▶</button></div></main></div>`;
    lligaCap();
    $$('[data-ll]').forEach(b => b.onclick = () => llico(LL.per(b.dataset.ll)));
    $('#go').onclick = torn;
  }

  /* ---------- El torn ---------- */
  let panellTab = 'rec';
  function aturaTorn() { if (ctrl) { ctrl.destrueix(); ctrl = null; } }
  function torn() {
    aturaTorn(); S.fase = 'torn';
    const N = E.nivell(S), t = S.dia;
    const tabs = [['rec', '📥 Recepció'], ['com', D.MAG.mode === 'cross' ? '🚛 Camions' : '📋 Comandes'], ['inv', '🔢 Inventari'], ['sgm', '🔎 SGM']].filter(([k]) => k !== 'com' || t.comandes.length || D.MAG.mode === 'cross').filter(([k]) => k !== 'inv' || t.inventari).filter(([k]) => k !== 'sgm' || D.MAG.mode !== 'cross');
    if (!tabs.some(x => x[0] === panellTab)) panellTab = 'rec';
    app.innerHTML = `<div class="pant torn">${capcalera(`<span class="chip rellotge" id="hora">🕗 08:00</span>`)}
      <div class="hud"><div class="seg" role="group" aria-label="Velocitat"><button data-v="0" aria-label="Pausa">⏸</button><button data-v="1" class="on">▶</button><button data-v="2">▶▶</button><button data-v="3">▶▶▶</button></div>
        <label class="pressa"><input type="checkbox" id="pressa"> 🏃 Pressa</label><span class="dia-barra"><i id="barra"></i></span>
        <button class="btn small" id="terra" hidden>Deixar a terra</button><button class="btn small perill" id="acaba">Acabar el torn</button></div>
      <p class="gira">📱 Gira el mòbil per veure més magatzem. Pots arrossegar el plànol de costat.</p>
      <div class="torn-g"><div id="escena"></div>
        <aside class="panell"><nav class="tabs">${tabs.map(([k, n]) => `<button data-tab="${k}" class="${panellTab === k ? 'on' : ''}">${n}</button>`).join('')}</nav><div id="pcont"></div><div class="porta" id="porta"></div></aside></div></div>`;
    lligaCap();
    $$('[data-tab]').forEach(b => b.onclick = () => { panellTab = b.dataset.tab; $$('[data-tab]').forEach(x => x.classList.toggle('on', x === b)); pintaPanell(); });
    ctrl = PS.torn($('#escena'), S, {
      avis: (txt) => toast(txt),
      bronca: (txt) => toast(`${montse('petita')} <span><b>Montse:</b> ${esc(txt)}</span>`, 'bronca', 6000),
      inspecciona, mostraModul, caixes: triaCaixes, habilitat: S.config.habilitat && S.config.habilitat !== 'off' && window.PH ? fesHabilitat : null,
      canvi: (tic) => { if (!tic || panellTab !== 'sgm') pintaPanell(); pintaPorta(); },
      rellotge: (m) => { const h = $('#hora'); if (h) h.textContent = '🕗 ' + E.hora(m); const b = $('#barra'); if (b) b.style.width = ((m - D.TORN_INICI) / (D.TORN_FI - D.TORN_INICI) * 100) + '%'; },
      onFi: (res) => { const h = E.puntua(S, res); ctrl && ctrl.destrueix(); ctrl = null; desa(); desaNuvol(); resultat(h); }
    });
    $$('[data-v]').forEach(b => b.onclick = () => { $$('[data-v]').forEach(x => x.classList.toggle('on', x === b)); const v = +b.dataset.v; ctrl.pausa(v === 0); if (v) ctrl.velocitat(v); });
    $('#pressa').onchange = (e) => ctrl.pressa(e.target.checked);
    $('#terra').onclick = () => ctrl.deixaATerra();
    $('#acaba').onclick = () => {
      const st = ctrl.estat(), pend = st.carregues.filter(x => x.estat === 'moll' || x.estat === 'acceptada').length + (st.porta ? 1 : 0), com = t.comandes.filter(o => !st.palets.some(p => p.comanda === o.id)).length;
      const txt = pend || com || st.pendentsArribar.length ? `Encara tens feina: ${[pend ? pend + ' càrregues per revisar o ubicar' : '', com ? com + ' comandes per portar al moll' : '', st.pendentsArribar.length ? st.pendentsArribar.length + ' camió per arribar' : ''].filter(Boolean).join(', ')}. Vols acabar igualment?` : 'Has acabat la feina. Vols tancar el torn ara? Acabar abans suma productivitat.';
      confirma(txt, () => ctrl.acaba());
    };
    pintaPanell(); pintaPorta();
  }
  function pintaPorta() {
    if (!ctrl) return; const st = ctrl.estat(), el = $('#porta'); if (!el) return;
    $('#terra').hidden = !st.porta;
    const portant = st.carregues.find(x => x.estat === 'portant') || {}, crossD = portant.desti, fora = st.porta && P(st.porta.prod).fred ? portant.fora : null;
    el.innerHTML = st.porta ? `<b>Portes:</b> ${PS.caixa(st.porta.prod, 16)} ${esc(P(st.porta.prod).nom)}${D.MAG.mode === 'cross' ? ` → <b>${esc(nomClient(crossD))}</b><br><span class="small muted">Porta-la al moll del camió que va a aquesta botiga (pestanya Camions).</span>` : (E.lliure(S) ? '' : ` → <b class="cod">${D.UBICACIO[st.porta.prod]}</b>`) + '<br><span class="small muted">Toca la prestatgeria on va.</span>'}${fora != null ? `<br><span class="${fora > D.FRED_MAX[P(st.porta.prod).fred] * 0.7 ? 'neg' : 'small'}">❄ ${fora} min fora del fred (màx. ${D.FRED_MAX[P(st.porta.prod).fred]})</span>` : ''}`
      : st.comanda ? (st.ona.length ? `<b>Onada:</b> ${st.ona.length} comandes al carro · ${st.pila.length} unitats<br><span class="small muted">Recull totes les línies i, al final, «Deixar al moll ${S.dia.camions.find(c => c.id === st.comanda.camio).moll}» per embalar-les.</span>` : `<b>Comanda:</b> ${esc(nomComanda(st.comanda))} · palet amb ${st.pila.length} càrregues<br><span class="small muted">Toca les prestatgeries i, al final, «Deixar al moll ${S.dia.camions.find(c => c.id === st.comanda.camio).moll}».</span>`)
      : `<span class="small muted">Mans lliures. Toca una càrrega del moll o comença una comanda.</span>`;
  }
  function pintaPanell() {
    if (!ctrl) return; const st = ctrl.estat(), c = $('#pcont'), t = S.dia, N = E.nivell(S); if (!c) return;
    if (panellTab === 'rec') {
      const txt = { moll: '<span class="tag">Per revisar</span>', acceptada: `<span class="tag groc">${D.MAG.mode === 'cross' ? 'Per classificar' : 'Per ubicar'}</span>`, portant: '<span class="tag blau">La portes</span>', ubicada: '<span class="tag verd">Ubicada</span>', rebutjada: '<span class="tag vermell">Rebutjada</span>', expedida: '<span class="tag verd">Al moll</span>' };
      c.innerHTML = `<p class="small muted">Toca una càrrega per revisar-la; si ja està acceptada, per agafar-la.</p>
        <ul class="tasques">${st.carregues.map(x => `<li><button class="tasca" data-c="${x.id}" ${['ubicada', 'rebutjada', 'portant', 'expedida'].includes(x.estat) ? 'disabled' : ''}>${PS.caixa(x.prod, 18)}<span>${esc(P(x.prod).nom)}${x.slot ? ` <b class="cod">${x.slot}</b>` : ''}${x.desti && x.estat !== 'moll' ? `<br><small class="muted">→ ${esc(nomClient(x.desti))}${x.moll ? ' · moll ' + x.moll : ''}</small>` : ''}${x.fora != null && x.estat !== 'moll' ? `<br><small class="${x.fora > D.FRED_MAX[P(x.prod).fred] * 0.7 ? 'neg' : 'muted'}">❄ ${x.fora} min fora del fred</small>` : P(x.prod).fred && x.estat === 'moll' ? '<br><small class="muted">❄ Fred: un cop acceptat, a la cambra</small>' : ''}</span>${txt[x.estat]}</button></li>`).join('') || '<li class="muted small">Encara no ha arribat cap camió.</li>'}</ul>
        ${st.pendentsArribar.map(p => `<p class="small muted">🚚 ${esc(p.proveidor)} arribarà a les ${E.hora(p.arribada)}.</p>`).join('')}`;
      $$('[data-c]', c).forEach(b => b.onclick = () => ctrl.carrega(b.dataset.c));
    } else if (panellTab === 'com' && D.MAG.mode === 'cross') {
      c.innerHTML = `<p class="small muted">Cada camió va a unes botigues. Porta cada càrrega al moll del camió que va a la seva botiga, abans que surti.</p>` + t.camions.map(cam => `<div class="cam-card"><b>🚛 Moll ${cam.moll} · surt a les ${E.hora(cam.sortida)}</b><span>${cam.ruta.map(nomClient).join(' · ')}</span>
        <span class="small muted">${Object.values(st.res.cross).filter(x => x.moll === cam.moll).length} càrregues al moll</span></div>`).join('');
    } else if (panellTab === 'com') {
      c.innerHTML = (D.MAG.mode === 'ecom' ? '<p class="small muted">Comença una onada: el carro agafa fins a 3 comandes del mateix transportista. Al moll, tria la caixa de cada comanda: la més petita on hi càpiga tot.</p>' : '') + t.camions.map(cam => `<div class="cam-card"><b>🚛 Moll ${cam.moll} · ${cam.transportista ? esc(cam.transportista) + ' · recull' : 'surt'} a les ${E.hora(cam.sortida)}</b>${cam.transportista ? '' : `<span class="small muted">Repartiment: ${cam.ruta.map(nomClient).map(x => x.replace('Botiga de ', '')).join(' → ')}</span>`}
        ${t.comandes.filter(o => o.camio === cam.id).map(o => { const fet = st.palets.find(p => p.comanda === o.id), actiu = (st.comanda && st.comanda.id === o.id) || st.ona.includes(o.id), picks = st.res.picking.filter(p => p.comanda === o.id);
          return `<div class="com ${fet ? 'feta' : ''} ${actiu ? 'activa' : ''}"><div class="row" style="justify-content:space-between"><b>${esc(nomComanda(o))}</b>${fet ? `<span class="tag verd">Al moll ${fet.moll} · ${E.hora(fet.minut)}</span>` : actiu ? '<span class="tag blau">Preparant</span>' : `<button class="btn small" data-o="${o.id}">${D.MAG.mode === 'ecom' ? 'Començar onada' : 'Començar'}</button>`}</div>
            <ul class="linies">${o.linies.map(l => { const q = picks.filter(p => p.prod === l.prod).reduce((a, p) => a + p.q, 0); return `<li class="${q >= l.q ? 'ok' : ''}">${PS.caixa(l.prod, 14)} ${l.q} × ${esc(P(l.prod).nom)} ${E.lliure(S) ? '' : `<b class="cod">${D.UBICACIO[l.prod]}</b>`} ${q ? `<span class="small">(${q})</span>` : ''}</li>`; }).join('')}</ul></div>`; }).join('')}</div>`).join('');
      $$('[data-o]', c).forEach(b => b.onclick = () => ctrl.comanda(b.dataset.o));
    } else if (panellTab === 'inv') {
      const inv = t.inventari, res = st.res.inventari;
      c.innerHTML = `<h3 class="h3">Recompte</h3><p class="small muted">Toca la prestatgeria per veure què hi ha i escriu quantes càrregues hi has comptat.</p>
        ${inv.recomptes.map(rc => `<label class="f-inline">${rc.slot} <span class="small muted">(sistema: ${rc.teoric})</span><input class="inp" type="number" min="0" data-rc="${rc.slot}" value="${res.recomptes[rc.slot] != null ? res.recomptes[rc.slot] : ''}"></label>`).join('')}
        <h3 class="h3">Comandes al proveïdor</h3><p class="small muted">Punt de comanda = consum diari × termini + seguretat. Demana només el que toqui.</p>
        ${inv.puntComanda.map(pc => `<label class="f-inline">${esc(P(pc.prod).nom)} <span class="small muted">estoc ${E.estocDe({ stock: ctrl ? ctrl.estat().stock : S.stock }, pc.prod)} · consum ${pc.consumDia}/dia · termini ${pc.termini} dies · seguretat ${pc.seguretat}</span><input class="inp" type="number" min="0" data-pc="${pc.prod}" value="${res.comandes[pc.prod] || ''}" placeholder="0"></label>`).join('')}`;
      $$('[data-rc]', c).forEach(i => i.onchange = () => ctrl.recompte(i.dataset.rc, i.value === '' ? null : +i.value));
      $$('[data-pc]', c).forEach(i => i.onchange = () => ctrl.demana(i.dataset.pc, +i.value || 0));
    } else if (panellTab === 'sgm') {
      c.innerHTML = `<p class="small muted">Sistema de gestió del magatzem: on és cada producte i quant n'hi ha.</p><input class="inp" id="cerca" placeholder="Cerca un producte…">
        <ul class="sgm">${D.PROD.map(id => { const ubis = Object.keys(st.stock).filter(k => st.stock[k].some(x => x.prod === id && x.q > 0)); return `<li data-nom="${esc(P(id).nom.toLowerCase())}">${PS.caixa(id, 16)} <span>${esc(P(id).nom)}</span><span class="small muted">${ubis.join(', ') || '—'}</span></li>`; }).join('')}</ul>`;
      $('#cerca', c).oninput = (e) => { const q = e.target.value.toLowerCase(); $$('.sgm li', c).forEach(li => { li.hidden = !li.dataset.nom.includes(q); }); };
    }
  }

  /* ---------- Finestra: inspecció d'una càrrega ---------- */
  function inspecciona(c, rc, cb) {
    ctrl && ctrl.pausa(true);
    const p = P(c.prod), alb = P(c.albara), dia = S.dia.dia;
    const vida = c.cad ? c.cad - dia : null, total = p.cad || null;
    const temp = c.temp != null ? `<div class="dada ${p.fred === 'refri' ? (c.temp > 5 ? 'mal' : '') : (c.temp > -15 ? 'mal' : '')}"><span>Temperatura</span><b>${c.temp} °C</b><em>${p.fred === 'refri' ? 'refrigerat: 0 a 4-5 °C' : 'congelat: −18 °C o menys'}</em></div>` : '';
    modal(`<h2>📥 Revisió de la càrrega</h2>
      <div class="insp"><div class="alb"><h3>Albarà · ${esc(rc.proveidor)}</h3><p><b>1 × ${esc(alb.nom)}</b><br><span class="small muted">EAN ${alb.ean}</span></p><p class="small">${c.enComanda ? 'És a la nostra comanda de compra.' : '<b class="neg">No apareix a la nostra comanda de compra.</b>'}</p></div>
        <div class="etiq"><h3>Etiqueta de la càrrega</h3><div class="caixa-gran ${c.estat === 'dany' ? 'danyada' : ''}" style="--c:${p.color}">${c.estat === 'dany' ? '<i>💥</i>' : ''}${p.fragil ? '<em class="f">FRÀGIL</em>' : ''}${p.perill ? '<em class="pe">◆ ' + esc(D.PERILLS[p.perill]) + '</em>' : ''}</div>
          <div class="dada"><span>Producte</span><b>${esc(p.nom)}</b><em>EAN ${p.ean}</em></div><div class="dada"><span>Lot</span><b>${c.lot}</b></div>
          ${c.cad ? `<div class="dada ${vida < total * D.CAD_MINIMA ? 'mal' : ''}"><span>Caducitat</span><b>${E.data(c.cad)}</b><em>queden ${vida} dies de ${total}</em></div>` : ''}${temp}
          <div class="dada"><span>Estat de l'embalatge</span><b>${c.estat === 'dany' ? 'Caixes aixafades' : 'Correcte'}</b></div><div class="dada"><span>Pes</span><b>${p.pes} kg</b></div></div></div>
      <p class="small muted">Si ho acceptes, signes l'albarà conforme. Si hi ha un problema, rebutja-ho amb el motiu.</p>
      <div class="row"><button class="btn verd big" id="acc" data-focus>✓ Acceptar</button><select class="inp" id="mot"><option value="">Rebutjar per…</option>${Object.entries(D.MOTIUS).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('')}</select><button class="btn perill" id="reb">✗ Rebutjar</button></div>`, (m) => {
      const fi = (d) => { tancaModal(); ctrl && ctrl.pausa(false); cb(d); };
      $('#acc', m).onclick = () => fi('accepta');
      $('#reb', m).onclick = () => { const v = $('#mot', m).value; if (!v) return toast('Tria el motiu del rebuig.', 'neg'); fi(v); };
    }, { ample: true });
  }

  /* ---------- Finestra: prestatgeria (vista frontal) ---------- */
  function mostraModul(o, cb) {
    ctrl && ctrl.pausa(true);
    const niv = E.nivellsDe(o.pas, o.mod), tp = (o.pas === 'F' || o.pas === 'P') ? 'convencional' : D.tipusDe(o.pas, o.mod), ES = D.ESTANTERIES[tp];
    const cel = (n, pos) => {
      const codi = E.codi(o.pas, o.mod, n, pos), cont = (o.stock[codi] || []).filter(x => x.q > 0), q = cont.reduce((a, x) => a + x.q, 0), noArriba = n > o.nivellsRack;
      const prods = [...new Set(cont.map(x => x.prod))];
      const interes = o.mode === 'picking' && o.comanda.linies.some(l => prods.includes(l.prod));
      const objectiu = o.mode === 'ubicar' && o.fixa && D.UBICACIO[o.prod] === codi;
      return `<button class="cel ${noArriba ? 'alta' : ''} ${interes ? 'interes' : ''} ${objectiu ? 'objectiu' : ''}" data-codi="${codi}" ${o.mode === 'veure' ? 'tabindex="-1"' : ''}>
        <span class="cod">${codi}</span>${prods.map(pr => `<span class="cont">${PS.caixa(pr, 18)}<b>${cont.filter(x => x.prod === pr).reduce((a, x) => a + x.q, 0)}</b></span>`).join('')}${!q ? '<span class="buit">buit</span>' : ''}${noArriba ? '<em>cal el toro</em>' : ''}</button>`;
    };
    let files = ''; for (let n = niv; n >= 1; n--) files += `<div class="fila"><span class="nlbl">Nivell ${n}</span>${D.POSICIONS.map(pos => cel(n, pos)).join('')}</div>`;
    const tit = o.mode === 'ubicar' ? `On deixes ${esc(P(o.prod).nom)}?` : o.mode === 'picking' ? 'Agafa el que demana la comanda' : 'Prestatgeria';
    modal(`<h2>🗄️ ${o.pas}-${String(o.mod).padStart(2, '0')} · ${tit}</h2><p class="small"><span class="tag t-${tp}">${esc(ES.nom)}</span> <span class="muted">${esc(ES.desc)}</span></p>
      ${o.mode === 'ubicar' && o.fixa ? `<p class="small">El sistema indica: <b class="cod">${D.UBICACIO[o.prod]}</b></p>` : o.mode === 'ubicar' ? `<p class="small muted">Ubicació lliure. Recorda: pes ${P(o.prod).pes} kg${P(o.prod).fragil ? ', fràgil' : ''}${P(o.prod).fred ? ', ' + (P(o.prod).fred === 'conge' ? 'congelat' : 'refrigerat') : ''}${P(o.prod).perill ? ', perillós' : ''}${P(o.prod).quimic ? ', químic de neteja' : ''}.</p>` : ''}
      <div class="rack-front">${files}<div class="terra-r"></div></div><div id="lots"></div>
      <div class="row" style="margin-top:12px"><button class="btn ghost" id="tc">Tancar</button></div>`, (m) => {
      const tanca = (v) => { tancaModal(); ctrl && ctrl.pausa(false); cb && cb(v); };
      $('#tc', m).onclick = () => tanca(null);
      $$('.cel', m).forEach(b => b.onclick = () => {
        const codi = b.dataset.codi;
        if (o.mode === 'veure') return;
        if (b.classList.contains('alta')) return toast('Amb el teu equip no hi arribes: cal el toro.', 'neg');
        if (o.mode === 'ubicar') return tanca(codi);
        // Picking: triar lot i quantitat
        const lots = (o.stock[codi] || []).filter(x => x.q > 0);
        if (!lots.length) return toast('Aquesta ubicació és buida.', 'neg');
        $('#lots', m).innerHTML = `<h3 class="h3">Lots a ${codi}</h3><table class="t"><thead><tr><th>Producte</th><th>Lot</th><th>Caducitat</th><th class="n">Hi ha</th><th></th></tr></thead><tbody>
          ${lots.map((x, i) => { const vius = lots.filter(y => y.prod === x.prod), bloq = (tp === 'dinamic' && vius[0] !== x) || (tp === 'compacte' && vius[vius.length - 1] !== x); return `<tr class="${bloq ? 'bloq' : ''}"><td>${PS.caixa(x.prod, 14)} ${esc(P(x.prod).nom)}</td><td>${x.lot}</td><td>${x.cad < 9000 && P(x.prod).cad ? E.data(x.cad) : '—'}</td><td class="n">${x.q}</td><td><div class="row" style="flex-wrap:nowrap"><input class="inp q" type="number" min="1" max="${x.q}" value="1" data-qi="${i}" aria-label="Quantitat">${bloq ? `<span class="small muted">${tp === 'dinamic' ? 'Darrere: surt quan surti el del davant' : 'Tapat per l\'últim palet'}</span>` : `<button class="btn small prim" data-li="${i}">Agafar</button>`}</div></td></tr>`; }).join('')}</tbody></table>`;
        $$('[data-li]', m).forEach(bb => bb.onclick = () => { const x = lots[+bb.dataset.li], q = Math.max(1, Math.min(x.q, +$(`[data-qi="${bb.dataset.li}"]`, m).value || 1)); tanca({ codi, lot: x.lot, q }); });
      });
    }, { ample: true, tancable: true, onTanca: () => { ctrl && ctrl.pausa(false); cb && cb(null); } });
  }
  function triaCaixes(llista, cb) {
    ctrl && ctrl.pausa(true);
    const tria = {};
    modal(`<h2>📦 Embalatge</h2><p class="small muted">Tria per a cada comanda la caixa més petita on hi càpiga tot. ${Object.entries(D.CAIXES).map(([k, c]) => `<b>${c.nom}</b>: volum fins a ${c.vol}`).join(' · ')}.</p>
      ${llista.map(({ o, pila }) => `<div class="emb"><b>${esc(nomComanda(o))}</b><span class="small">${pila.map(p => `${PS.caixa(p, 14)} ${esc(P(p).nom)} <small class="muted">(volum ${P(p).vol || 1}${P(p).fragil ? ', fràgil' : ''})</small>`).join('<br>')}</span>
        <div class="seg">${Object.entries(D.CAIXES).map(([k, c]) => `<button data-oc="${o.id}" data-k="${k}">${c.nom}</button>`).join('')}</div></div>`).join('')}
      <div class="row"><button class="btn prim" id="ok" data-focus>Embalar i deixar al moll</button></div>`, (m) => {
      $$('[data-oc]', m).forEach(b => b.onclick = () => { tria[b.dataset.oc] = b.dataset.k; $$(`[data-oc="${b.dataset.oc}"]`, m).forEach(x => x.classList.toggle('on', x === b)); });
      $('#ok', m).onclick = () => { if (llista.some(({ o }) => !tria[o.id])) return toast('Tria la caixa de totes les comandes.', 'neg'); tancaModal(); ctrl && ctrl.pausa(false); cb(tria); };
    });
  }
  const nomMag = (id) => { const m = D.MAGATZEMS[id] || D.MAGATZEMS.aliment; return m.icona + ' ' + esc(m.nom); };
  /* ---------- Habilitat física dins del torn ---------- */
  const HAB_MODES = [
    ['delicades', 'Tasques delicades', 'Fas la maniobra física quan el producte és fràgil, pesant o delicat, o quan s\'ha de pujar en alçada amb el toro.'],
    ['totes', 'Totes les tasques', 'Cada ubicació i cada línia de picking es fa a mà o amb el vehicle. Més realista i més llarg.'],
    ['off', 'Clàssic', 'Sense maniobres físiques: les tasques es fan amb un clic.']
  ];
  function fesHabilitat(info, continua) {
    const PH = window.PH, pr = PH.prop(info.prod);
    const fragilPila = (info.pila || []).some(id => { const q = PH.prop(id); return q.fragil || q.pressio < 10; });
    const delicat = pr.fragil || pr.pes >= 12 || pr.pressio < 10 || (info.tipus === 'ubicar' && info.niv >= 3) || (info.tipus === 'picking' && fragilPila);
    if (S.config.habilitat === 'delicades' && !delicat) return continua();
    const ambVehicle = info.tipus === 'ubicar' && (info.equip === 'toro' || info.niv === 1);
    if (pr.mans === 0 && !ambVehicle) return continua();   // més de 25 kg: no es fa a mà
    ctrl && ctrl.pausa(true);
    const fi = (r) => {
      const reg = r ? { tipus: info.tipus, prod: info.prod, minut: info.minut, nota: r.nota, malmesos: (r.malmesos || []).map(m => ({ nom: m.nom, estat: m.estat })), caiguts: (r.caiguts || 0) + (r.perduts || 0), copsForts: r.copsForts || 0, greu: r.bolcat ? 'bolcada' : (r.incidents || []).some(t => /bigues/.test(t)) ? 'palet' : null }
        : { tipus: info.tipus, prod: info.prod, minut: info.minut, nota: 0, abandonat: true };
      ctrl && ctrl.habilitat(reg);
      if (r && (reg.malmesos.length || reg.greu)) toast(`${montse('petita')} <span><b>Montse:</b> ${reg.greu === 'bolcada' ? 'Has bolcat el toro! Això és gravíssim.' : reg.greu ? 'Un palet a terra des de les bigues… Revisa com el deixes.' : 'Compte amb la mercaderia: el que es trenca és una merma.'}</span>`, 'bronca', 5000);
      ctrl && ctrl.pausa(false); continua();
    };
    const u = E.parse(info.codi);
    if (ambVehicle) return PH.vehicle(cfgUbicaVehicle(info, u), fi);
    if (info.tipus === 'ubicar') return PH.manual(cfgUbicaMa(info, u, pr), fi);
    return PH.manual(cfgPicking(info, pr), fi);
  }
  // Maniobra amb transpalet o toro davant del passadís real (amb els palets que hi ha a l'estoc)
  function cfgUbicaVehicle(info, u) {
    const ids = [];
    const nMod = (D.PASSADISSOS.find(x => x.id === u.pas) || { moduls: 2 }).moduls;
    for (let m = 1; m <= nMod; m++) D.POSICIONS.forEach(pos => ids.push(`${u.pas}-${String(m).padStart(2, '0')}-${pos}`));
    const palets = [];
    Object.keys(info.stock).forEach(k => {
      const v = E.parse(k); if (!v || v.pas !== u.pas || v.niv > 4 || k === info.codi) return;
      const viu = info.stock[k].filter(x => x.q > 0); if (!viu.length) return;
      palets.push({ bay: `${v.pas}-${String(v.mod).padStart(2, '0')}-${v.pos}`, nivell: v.niv, prods: Array(4).fill(viu[0].prod) });
    });
    const toro = info.equip === 'toro';
    palets.push({ forq: true, objectiu: true, prods: Array(8).fill(info.prod) });
    const bay = `${u.pas}-${String(u.mod).padStart(2, '0')}-${u.pos}`;
    return {
      vehicle: toro ? 'toro' : 'transpalet', titol: `Ubica ${P(info.prod).nom.toLowerCase()} a ${info.codi}`,
      consigna: `Deixa el palet a <b>${bay}</b>${u.niv > 1 ? `, <b>nivell ${u.niv}</b>` : ', a terra'}. ${toro ? 'Puja les forquilles davant de la prestatgeria, entra, baixa i surt.' : 'Entra empenyent, ben alineat, i baixa amb Q.'}`,
      mapa: { zones: [], linies: [[60, 130, 960, 130]], files: [{ pas: u.pas, x0: 150, y: 60, n: ids.length, cara: 1, ids, nivells: window.PH.NIVELLS_CM.slice(0, Math.max(...ids.map((x, i) => E.nivellsDe(u.pas, Math.floor(i / D.POSICIONS.length) + 1)))) }], parets: [{ x: 0, y: 500, w: 1000, h: 60, nom: 'la paret' }],
        inici: toro ? { x: 470, y: 320, a: 0 } : { x: 500, y: 320, a: 0 }, palets },   // al mig del passadís
      desti: { bay, nivell: u.niv }, botoSeguent: 'Torna al torn',
      consell: toro ? 'Circula amb la càrrega baixa i el pal enrere; puja-la només davant de la ubicació i aturat.' : 'Estira per desplaçar-te; empeny a poc a poc i alineat per entrar a la ubicació.'
    };
  }
  // Ubicar a mà (transpalet, nivell 2): pujar les caixes al prestatge
  function cfgUbicaMa(info, u, pr) {
    const w = pr.mida[0] * 2, h = pr.mida[1] * 2, objs = [];
    for (let i = 0; i < 3; i++) objs.push({ id: info.prod, x: 80 + w / 2 + i * (w + 4), y: 380 - h / 2 - 1, desti: 'prest' });
    return {
      titol: `Col·loca ${pr.nom.toLowerCase()} a ${info.codi}`, consigna: `Puja les caixes al <b>nivell ${u.niv}</b> de la prestatgeria. ${pr.mans === 2 ? 'Pesen: agafa-les amb les <b>dues mans</b>.' : ''}`,
      estatics: [{ x: 60, y: 380, w: 380, h: 18, tipus: 'taula' }, { x: 560, y: 250, w: 380, h: 12, tipus: 'prestatge' }, { x: 930, y: 120, w: 10, h: 130, tipus: 'prestatge' }],
      zones: { prest: { x: 560, y: 110, w: 370, h: 140, nom: 'al prestatge', etiqueta: info.codi } }, objectes: objs, botoSeguent: 'Torna al torn',
      consell: 'Aixeca amb les cames, apropa la càrrega al cos i no giris el tronc carregat. Més de 25 kg, mai a mà.'
    };
  }
  // Picking a mà: treure les caixes de la ubicació i posar-les al palet de la comanda (amb el que ja hi ha)
  function cfgPicking(info, pr) {
    const objs = [], W = (id) => window.PH.prop(id).mida[0] * 2, H = (id) => window.PH.prop(id).mida[1] * 2;
    // Origen: dues caixes que es queden i les q que cal agafar, apilades
    const orig = [null, null].concat(Array(info.q).fill('comanda'));
    let x = 70, fila = 0;
    orig.forEach(d => { const w = W(info.prod), h = H(info.prod); if (x + w > 415) { x = 70; fila++; } objs.push({ id: info.prod, x: x + w / 2, y: 380 - h / 2 - fila * (h + 1) - 1, desti: d }); x += w + 3; });
    // Destí: el que ja hi ha al palet de la comanda (els darrers 6, en l'ordre en què s'hi van posar)
    const pila = (info.pila || []).slice(-6); let base = 400, maxH = 0; x = 570;
    pila.forEach(id => { const w = W(id), h = H(id); if (x + w > 930) { x = 570; base -= maxH + 1; maxH = 0; } objs.push({ id, x: x + w / 2, y: base - h / 2 - 1 }); x += w + 3; maxH = Math.max(maxH, h); });
    return {
      titol: `Picking: ${info.q} × ${pr.nom.toLowerCase()}`,
      consigna: `Passa <b>${info.q} caix${info.q > 1 ? 'es' : 'a'}</b> al <b>palet de la comanda</b>. Pesat a baix i fràgil a dalt: ${pr.fragil ? 'això és fràgil!' : pr.pes >= 8 ? 'això pesa, no ho posis sobre res delicat.' : 'compte amb el que ja hi ha.'}`,
      estatics: [{ x: 60, y: 380, w: 360, h: 18, tipus: 'taula' }, { x: 560, y: 400, w: 380, h: 18, tipus: 'taula' }],
      zones: { comanda: { x: 560, y: 90, w: 380, h: 310, nom: 'al palet de la comanda', etiqueta: 'Palet de la comanda' } }, objectes: objs, botoSeguent: 'Torna al torn',
      consell: 'El palet de la comanda es munta amb el pesat a baix i el fràgil a dalt. Si després d\'una cosa fràgil n\'has de posar una de pesant, posa-la al costat, no a sobre.'
    };
  }
  function confirma(text, ok) {
    ctrl && ctrl.pausa(true);
    modal(`<p>${esc(text)}</p><div class="row"><button class="btn prim" id="si" data-focus>Sí</button><button class="btn ghost" id="no">No</button></div>`, (m) => {
      $('#si', m).onclick = () => { tancaModal(); ctrl && ctrl.pausa(false); ok(); };
      $('#no', m).onclick = () => { tancaModal(); ctrl && ctrl.pausa(false); };
    });
  }

  /* ---------- Lliçons ---------- */
  function llico(l, fet) {
    const resp = S.llicons[l.id];
    const ordre = [0, 1, 2, 3].sort((a, b) => ((l.id.charCodeAt(0) * 7 + a * 13) % 5) - ((l.id.charCodeAt(0) * 7 + b * 13) % 5));
    modal(`<h2>📘 ${esc(l.titol)}</h2><p>${esc(l.text)}</p>
      <div class="preg"><b>${esc(l.p)}</b>${ordre.map(i => `<button class="opc" data-i="${i}" ${resp ? 'disabled' : ''}>${esc(l.o[i])}</button>`).join('')}<p class="small" id="per">${resp ? (resp.ok ? '✓ ' : '✗ ') + esc(l.per) : ''}</p></div>
      <div class="row"><a class="btn small ghost" href="${l.url}" target="_blank" rel="noopener">Lliçó completa d'ECO i NEXO ↗</a><button class="btn prim" id="tc" data-focus>${resp ? 'Tancar' : 'Més tard'}</button></div>`, (m) => {
      $$('.opc', m).forEach(b => b.onclick = () => {
        const i = +b.dataset.i, ok = i === l.c; S.llicons[l.id] = { ok, torn: S.torn }; desa();
        $$('.opc', m).forEach(x => { x.disabled = true; if (+x.dataset.i === l.c) x.classList.add('ok'); else if (x === b) x.classList.add('ko'); });
        $('#per', m).textContent = (ok ? '✓ Correcte. ' : '✗ No és aquesta. ') + l.per; $('#tc', m).textContent = 'Tancar';
      });
      $('#tc', m).onclick = () => { tancaModal(); fet && fet(); };
    }, { tancable: true });
  }

  /* ---------- Informe del vespre ---------- */
  const CAT = { recepcio: '📥 Recepció', ubicacio: '🗄️ Ubicació', picking: '📋 Picking', fefo: '📅 FEFO', trencament: '💥 Trencament', expedicio: '🚛 Expedició', carrega: '🚛 Càrrega', seguretat: '⛑️ Seguretat', inventari: '🔢 Inventari', merma: '🗑️ Merma', cross: '🔀 Classificació', caixa: '📦 Embalatge', fred: '❄️ Cadena de fred' };
  function resultat(h) {
    h = h || S.darrer; const k = h.kpi;
    const lls = LL.perErrors(h, S.llicons, D.MAG_ID);
    const cls = h.veredicte === 'bo' ? 'bo' : h.veredicte === 'bronca' ? 'bronca' : '';
    app.innerHTML = `<div class="pant">${capcalera()}<main class="res">
      ${diu(esc(h.frase), cls)}
      <section class="sec notes"><div class="nota ${h.nota >= D.NOTA_BONA ? 'pos' : h.nota < 55 ? 'neg' : ''}"><span>Nota del torn</span><b>${h.nota}</b></div>
        <div class="bars"><div><span>Productivitat</span>${barra(h.productivitat, 'var(--blau)')}<b>${h.productivitat}</b></div><div><span>Qualitat</span>${barra(h.qualitat, 'var(--verd)')}<b>${h.qualitat}</b></div><div><span>Seguretat</span>${barra(h.seguretat, 'var(--groc)')}<b>${h.seguretat}</b></div></div></section>
      <section class="sec kpis"><div><span>Càrregues revisades bé</span><b>${Math.round(k.recOk)} / ${k.carregues}</b></div>${k.cross ? '' : `<div><span>Ubicades bé</span><b>${k.ubiOk} / ${k.ubicades}</b></div>`}
        ${k.comandes ? `<div><span>Comandes a temps</span><b>${k.aTemps} / ${k.comandes}</b></div><div><span>Errors de picking</span><b>${k.errorsPicking} %</b></div>` : ''}
        ${k.cross ? `<div><span>Classificades bé</span><b>${k.crossOk} / ${k.cross}</b></div>` : ''}${k.caixesOk ? `<div><span>Caixes ben triades</span><b>${k.caixesOk} / ${k.comandes}</b></div>` : ''}${k.fred ? `<div><span>Trencaments de la cadena de fred</span><b>${k.fred}</b></div>` : ''}
        <div><span>Trencaments i mermes</span><b>${k.trencaments + k.caducats}</b></div><div><span>Incidents de seguretat</span><b>${k.incidents}</b></div>${k.habilitat != null ? `<div><span>Habilitat (manipulació i conducció)</span><b>${k.habilitat} / 100</b></div>` : ''}<div><span>Fi del torn</span><b>${E.hora(k.fi)}</b></div></section>
      ${h.greus.length + h.errors.length ? `<section class="sec"><h2>Què ha fallat</h2><ul class="errs">${h.greus.map(e => `<li class="greu"><span>${CAT[e[0]] || e[0]}</span>${esc(e[1])}</li>`).join('')}${h.errors.map(e => `<li><span>${CAT[e[0]] || e[0]}</span>${esc(e[1])}</li>`).join('')}</ul></section>` : `<section class="sec"><h2>Torn perfecte!</h2><p>Cap error. Així es treballa.</p></section>`}
      ${h.bons.length ? `<section class="sec"><ul class="bons">${h.bons.map(b => `<li>✓ ${esc(b)}</li>`).join('')}</ul></section>` : ''}
      ${lls.length ? `<section class="sec"><h2>Per repassar</h2><div class="ll-cards">${lls.map(l => `<button class="ll-card" data-ll="${l.id}"><b>📘 ${esc(l.titol)}</b><span class="small muted">Lliçó i pregunta</span></button>`).join('')}</div></section>` : ''}
      <section class="sec small muted">Avisos: ${S.avisos} de ${D.AVISOS_ACOMIADAMENT} · torns bons seguits: ${S.tornsBons} (cal ${D.TORNS_ASCENS} per ascendir)</section>
      <div class="row" style="justify-content:center;margin:20px 0 40px"><button class="btn prim big" id="seg">${h.canvi === 'acomiadament' ? 'Continuar' : 'Següent torn →'}</button></div></main></div>`;
    lligaCap();
    $$('[data-ll]').forEach(b => b.onclick = () => llico(LL.per(b.dataset.ll), () => { desaNuvol(); resultat(h); }));
    $('#seg').onclick = () => {
      if (h.canvi === 'ascens') return ascens(() => { E.continuar(S); desa(); joc(); });
      E.continuar(S); desa(); joc();
    };
    if (h.canvi === 'ascens' || h.canvi === 'acomiadament') setTimeout(() => toast(h.canvi === 'ascens' ? '🎉 Ascens!' : '📄 La Montse vol parlar amb tu…', h.canvi === 'ascens' ? 'pos' : 'neg'), 400);
  }
  function ascens(fet) {
    const N = E.nivell(S);
    modal(`<div class="ascens">${montse()}<h2>🎉 Ascens: ara ets ${esc(N.nom.toLowerCase())}!</h2><p>${esc(N.desc)}</p>${N.equip === 'toro' && S.historial.filter(h => h.nivell >= 3).length === 0 ? '<p>Has fet la formació de carretoner: a partir d\'ara condueixes el toro i arribes als nivells 3 i 4.</p>' : ''}
      <button class="btn prim big" id="tc" data-focus>Som-hi!</button></div>`, (m) => { $('#tc', m).onclick = () => { tancaModal(); fet(); }; });
    const box = $('.modal-box'); const cols = ['#F5C542', '#36B37E', '#4EA5F5', '#E879B9']; for (let i = 0; i < 40; i++) { const c = document.createElement('span'); c.className = 'confeti'; c.style.left = Math.random() * 100 + '%'; c.style.background = cols[i % 4]; c.style.animationDelay = Math.random() + 's'; box.appendChild(c); }
  }

  /* ---------- Final (acomiadament) ---------- */
  function final() {
    const tot = S.historial.length, mitja = tot ? Math.round(S.historial.reduce((a, h) => a + h.nota, 0) / tot) : 0;
    app.innerHTML = `<div class="pant">${capcalera()}<main class="res">${diu(esc(D.FRASES.acomiadament[0]), 'bronca')}
      <section class="sec"><h2>📄 Carta d'acomiadament</h2><p>Has treballat ${tot} torns. Nota mitjana: <b>${mitja}</b>. Has arribat a <b>${esc(E.nivell(S).nom.toLowerCase())}</b>.</p>
        <p class="small muted">Repassa els errors que més t'han repetit i torna-ho a provar: conserves el nivell, però amb els avisos a zero.</p></section>
      <div class="row" style="justify-content:center;margin:20px 0"><button class="btn prim big" id="re">Tornar a provar el nivell</button><button class="btn ghost" id="nou">Començar de zero</button></div></main></div>`;
    lligaCap();
    $('#re').onclick = () => { E.reintentar(S); desa(); joc(); };
    $('#nou').onclick = configurar;
  }

  /* ---------- Mode docent ---------- */
  const NOM_TEMA = { recepcio: 'Recepció', ubicacio: 'Ubicació', picking: 'Picking', fefo: 'FEFO', trencament: 'Paletització', expedicio: 'Expedició', carrega: 'Ordre de càrrega', seguretat: 'Seguretat', inventari: 'Inventari', merma: 'Mermes', cross: 'Cross-docking', fred: 'Cadena de fred', caixa: 'Embalatge', manipulacio: 'Manipulació' };
  const pwDocent = () => { try { return sessionStorage.getItem('palet-pw') || ''; } catch (e) { return ''; } };
  function docent(grup) {
    app.innerHTML = `<main class="config" style="max-width:1200px"><button class="btn ghost small" id="enr">← Tornar</button><h1>🧑‍🏫 Alumnes</h1>
      <p class="muted">Cada alumne crea el compte des de la portada del joc amb el codi de grup que li doneu (per exemple, CM10-2A). La partida es desa al servidor en acabar cada torn.</p>
      <div class="row"><input class="inp" type="password" id="pw" style="max-width:240px" placeholder="Contrasenya del professorat" value="${esc(pwDocent())}"><button class="btn prim" id="car">Carregar</button><span id="gr"></span></div>
      <p class="small" id="est"></p><div id="ta"></div></main>`;
    $('#enr').onclick = portada;
    const carrega2 = async () => {
      const pw = $('#pw').value; $('#est').textContent = 'Carregant…';
      try {
        const d = await crida({ action: 'alumnes', password: pw }); try { sessionStorage.setItem('palet-pw', pw); } catch (e) { }
        const g = grup && d.grups.includes(grup) ? grup : '';
        $('#gr').innerHTML = d.grups.length ? `<select class="inp" id="selG"><option value="">Tots els grups (${d.alumnes.length})</option>${d.grups.map(x => `<option ${x === g ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select>` : '';
        if ($('#selG')) $('#selG').onchange = () => { grup = $('#selG').value; carrega2(); };
        const ll = d.alumnes.filter(a => !g || a.classe === g);
        $('#est').textContent = ll.length ? '' : 'Encara no hi ha cap alumne amb compte.';
        const data = (t) => t ? new Date(t).toLocaleString('ca', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';
        $('#ta').innerHTML = ll.length ? `<div class="taula-w"><table class="t"><thead><tr><th>Alumne</th><th>Grup</th><th>Magatzem</th><th>Nivell</th><th class="n">Torns</th><th class="n">Nota mitjana</th><th class="n">Avisos</th><th>Errors més freqüents</th><th class="n">Lliçons</th><th>Darrer desat</th><th></th></tr></thead><tbody>
          ${ll.map(a => { const p = a.partida; return `<tr><td><b>${esc(a.nom)}</b><br><small class="muted">${esc(a.usuari)}</small></td><td>${esc(a.classe)}</td>
            <td>${p ? nomMag(p.magatzem) : ''}</td><td>${p ? esc(p.nivellNom) + (p.acomiadat ? ' <span class="tag vermell">acomiadat</span>' : '') : '<span class="muted">Sense partida</span>'}</td><td class="n">${p ? p.torns : ''}</td><td class="n">${p && p.notaMitja != null ? '<b>' + p.notaMitja + '</b>' : ''}</td><td class="n">${p ? p.avisos + ' / 3' : ''}</td>
            <td class="small">${p ? p.errorsFreq.map(([t, n]) => esc(NOM_TEMA[t] || t) + ' (' + n + ')').join(', ') || '—' : ''}</td><td class="n">${p ? p.llEnc + ' / ' + p.llResp : ''}</td><td class="small">${data(p ? p.at : a.darrer)}</td>
            <td><div class="row" style="flex-wrap:nowrap">${p ? `<button class="btn small" data-veu="${esc(a.usuari)}">Veure</button>` : ''}<button class="btn small ghost" data-pwu="${esc(a.usuari)}" title="Canviar la contrasenya">🔑</button></div></td></tr>`; }).join('')}</tbody></table></div>
          <div class="row" style="margin-top:10px"><button class="btn" id="csv">⬇ Descarregar (CSV)</button></div>` : '';
        $$('[data-veu]').forEach(b => b.onclick = async () => {
          try { const x = await crida({ action: 'alumne', password: pw, usuari: b.dataset.veu }); const r = x.resum;
            modal(`<h2>${esc(x.compte.nom)} <small class="muted">${esc(x.compte.usuari)} · ${esc(x.compte.classe)}</small></h2>
              <p>${nomMag(r.magatzem)} · ${esc(r.nivellNom)} · ${r.torns} torns · nota mitjana <b>${r.notaMitja == null ? '—' : r.notaMitja}</b> · ${r.ascensos} ascensos · ${r.broncas} broncas${r.acomiadaments ? ' · ' + r.acomiadaments + ' acomiadaments' : ''}</p>
              <div class="taula-w"><table class="t"><thead><tr><th>Torn</th><th>Nivell</th><th class="n">Nota</th><th class="n">Prod.</th><th class="n">Qualitat</th><th class="n">Seguretat</th><th class="n">Errors</th><th>Cap</th></tr></thead><tbody>
              ${r.historial.map(h => `<tr><td>${h.torn}</td><td>${h.nivell}</td><td class="n"><b>${h.nota}</b></td><td class="n">${h.productivitat}</td><td class="n">${h.qualitat}</td><td class="n">${h.seguretat}</td><td class="n">${h.errors}</td><td>${h.canvi === 'ascens' ? '🎉 ascens' : h.canvi === 'acomiadament' ? '📄 acomiadament' : h.veredicte === 'bronca' ? '⚠ bronca' : h.veredicte === 'bo' ? '✓' : ''}</td></tr>`).join('')}</tbody></table></div>
              ${x.partides.length ? `<p class="small muted">Partides anteriors: ${x.partides.map(p => nomMag(p.magatzem) + ' · ' + esc(p.nivellNom) + ' (' + p.torns + ' torns, nota ' + (p.notaMitja == null ? '—' : p.notaMitja) + ')').join(' · ')}</p>` : ''}
              <div class="row"><button class="btn" id="tc" data-focus>Tancar</button></div>`, (m) => { $('#tc', m).onclick = tancaModal; }, { ample: true, tancable: true });
          } catch (e) { toast(esc(e.message), 'neg'); }
        });
        $$('[data-pwu]').forEach(b => b.onclick = () => modal(`<h2>Nova contrasenya per a ${esc(b.dataset.pwu)}</h2><input class="inp" id="npw" placeholder="mínim 6 caràcters"><p class="small neg" id="npE"></p><div class="row"><button class="btn prim" id="ok">Canviar</button><button class="btn ghost" id="tc">Cancel·lar</button></div>`, (m) => {
          $('#tc', m).onclick = tancaModal;
          $('#ok', m).onclick = async () => { try { await crida({ action: 'alumne-contrasenya', password: pw, usuari: b.dataset.pwu, nova: $('#npw', m).value }); tancaModal(); toast('Contrasenya canviada.', 'pos'); } catch (e) { $('#npE', m).textContent = e.message; } };
        }, { tancable: true }));
        if ($('#csv')) $('#csv').onclick = () => { const q = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
          const txt = '\ufeff' + [['Alumne', 'Usuari', 'Grup', 'Magatzem', 'Nivell', 'Torns', 'Nota mitjana', 'Avisos', 'Broncas', 'Ascensos', 'Errors freqüents', 'Lliçons encertades', 'Lliçons respostes'].map(q).join(';')]
            .concat(ll.map(a => { const p = a.partida || {}; return [a.nom, a.usuari, a.classe, p.magatzem ? (D.MAGATZEMS[p.magatzem] || {}).nom : '', p.nivellNom, p.torns, p.notaMitja, p.avisos, p.broncas, p.ascensos, (p.errorsFreq || []).map(([t, n]) => (NOM_TEMA[t] || t) + ' ' + n).join(', '), p.llEnc, p.llResp].map(q).join(';'); })).join('\n');
          const el = document.createElement('a'); el.href = URL.createObjectURL(new Blob([txt], { type: 'text/csv' })); el.download = 'palet-alumnes.csv'; document.body.appendChild(el); el.click(); el.remove(); };
      } catch (e) { $('#est').textContent = e.message; }
    };
    $('#car').onclick = carrega2; if (pwDocent()) carrega2();
  }

  window.PALET = { get S() { return S; }, get ctrl() { return ctrl; } };
  portada();
})();
