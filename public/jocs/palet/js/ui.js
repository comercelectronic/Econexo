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
  const carrega = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } };
  const nomClient = (id) => D.CLIENTS.find(c => c.id === id).nom;

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
      <nav class="menu">
        ${pot ? `<button class="btn prim big" data-a="continua">▶ Continua <small>${esc(desat.config.nom)} · ${esc(D.NIVELLS[desat.nivell - 1].nom)} · torn ${desat.torn}</small></button>` : ''}
        <button class="btn ${pot ? '' : 'prim'} big" data-a="juga">📦 Juga <small>comença de mosso</small></button>
        <button class="btn big" data-a="ajuda">❓ Com es juga</button>
        <a class="btn big" href="https://ecoynexo.com/ca/aprender/actividades-comerciales/tecnicas-de-almacen/" target="_blank" rel="noopener">📚 Lliçons del mòdul <small>Tècniques de magatzem</small></a>
      </nav>
      <p class="peu">Simulador del mòdul Tècniques de magatzem (CFGM Activitats Comercials) · ECOyNEXO</p></div></main>`;
    $$('[data-a]').forEach(b => b.onclick = () => ({ continua: () => { S = desat; joc(); }, juga: configurar, ajuda })[b.dataset.a]());
  }
  function configurar() {
    let nivell = 1;
    const draw = () => {
      app.innerHTML = `<main class="config"><button class="btn ghost small" id="enr">← Tornar</button><h1>Primer dia a la feina</h1>
        <label class="f">El teu nom<input class="inp" id="nom" maxlength="30" placeholder="Ex.: Laia"></label>
        <h2>On comences?</h2><p class="muted small">Normalment es comença de mosso i la cap t'ascendeix. Per practicar una part concreta, pots començar en un altre nivell.</p>
        <div class="nivells">${D.NIVELLS.map(N => `<button class="niv ${N.n === nivell ? 'on' : ''}" data-n="${N.n}"><b>${N.n}. ${esc(N.nom)}</b><span class="small muted">${esc(N.desc)}</span></button>`).join('')}</div>
        <div class="row" style="margin-top:18px"><button class="btn prim big" id="go">Entrar al magatzem →</button></div></main>`;
      $('#enr').onclick = portada;
      $$('[data-n]').forEach(b => b.onclick = () => { nivell = +b.dataset.n; const v = $('#nom').value; draw(); $('#nom').value = v; });
      $('#go').onclick = () => { const nom = $('#nom').value.trim().slice(0, 30) || 'Treballador'; S = E.crearPartida({ nom, nivell, llavor: (Date.now() % 2e9) | 1 }); desa(); joc(); };
    };
    draw();
  }
  function ajuda() {
    modal(`<h2>Com es juga</h2><ul class="ajuda">
      <li><b>Al matí</b>, la Montse (la cap) t'explica la feina del torn: camions que arriben, comandes de les botigues i hora de sortida dels camions.</li>
      <li><b>Recepció</b>: toca una càrrega del moll 1 per revisar-la. Compara l'etiqueta amb l'albarà i accepta-la o rebutja-la amb el motiu.</li>
      <li><b>Ubicació</b>: toca una càrrega acceptada per agafar-la i després la prestatgeria on va. Tria el nivell i la posició. Al principi el sistema et diu la ubicació; quan siguis carretoner, la tries tu.</li>
      <li><b>Comandes</b> (des de preparador): comença una comanda, toca les prestatgeries, tria el lot (FEFO!) i la quantitat, i deixa el palet al moll del seu camió abans que surti. El que agafes primer queda a baix del palet.</li>
      <li><b>Seguretat</b>: el botó «Pressa» et fa anar més ràpid, però amb càrrega pots tenir un accident. No deixis res al passadís ni davant de la sortida.</li>
      <li><b>Al vespre</b>, l'informe i la nota de la cap. Bons torns seguits: <b>ascens</b>. Tres avisos: <b>acomiadament</b>.</li></ul>
      <div class="row"><button class="btn prim" id="tc" data-focus>Entesos</button></div>`, (m) => { $('#tc', m).onclick = tancaModal; }, { tancable: true });
  }

  /* ---------- Router ---------- */
  function joc() {
    aturaTorn();
    if (!S) return portada();
    desa();
    if (S.fase === 'final') return final();
    if (S.fase === 'resultat') return resultat();
    if (S.fase === 'torn') S.fase = 'briefing';   // un torn a mitges es torna a començar
    return briefing();
  }
  function capcalera(extra) {
    const N = E.nivell(S);
    return `<header class="top">${logo()}<div class="info"><span class="chip">📅 ${E.data(S.dia.dia)} · torn ${S.torn}</span><span class="chip niv-chip">${esc(N.nom)}</span><span class="chip">${esc(S.config.nom)}</span>${avisos()}${extra || ''}</div>
      <div class="acc"><button class="btn small ghost" id="bAj" aria-label="Com es juga">❓</button><button class="btn small ghost" id="bMenu" aria-label="Menú">☰</button></div></header>`;
  }
  function lligaCap() { $('#bAj').onclick = ajuda; $('#bMenu').onclick = () => { desa(); portada(); }; }

  /* ---------- Encàrrec del matí ---------- */
  function briefing() {
    const t = S.dia, N = E.nivell(S);
    const primer = S.historial.filter(h => h.nivell === S.nivell).length === 0;
    const rec = t.recepcions.map(rc => `<li>🚚 <b>${E.hora(rc.arribada)}</b> · camió de <b>${esc(rc.proveidor)}</b> al moll 1 (${rc.carregues.length} càrregues)</li>`).join('');
    const cam = t.camions.map(c => `<li>🚛 Surt a les <b>${E.hora(c.sortida)}</b> del <b>moll ${c.moll}</b>: ${c.ruta.map(nomClient).join(' → ')}</li>`).join('');
    const frase = primer && S.torn === 1 ? D.FRASES.benvinguda[0] : primer ? `Avui comences de ${N.nom.toLowerCase()}. ${N.desc}` : S.darrer && S.darrer.veredicte === 'bronca' ? 'Espero que avui vagi millor que ahir. Vigila el que et vaig dir.' : 'Bon dia! Aquí tens la feina d\'avui.';
    app.innerHTML = `<div class="pant">${capcalera()}<main class="brief">
      ${diu(esc(frase))}
      <section class="sec"><h2>Feina d'avui</h2><ul class="llista">${rec}${cam}${t.comandes.length ? `<li>📋 ${t.comandes.length} comandes de botigues per preparar</li>` : ''}${t.inventari ? `<li>🔢 Recompte de ${t.inventari.recomptes.length} ubicacions i revisió del punt de comanda</li>` : ''}</ul>
        <p class="small muted">El torn és de 8:00 a 14:00. Equip: ${esc(D.EQUIPS[N.equip].nom)}. ${N.lliure ? 'Ubicació lliure: tries tu on va cada càrrega.' : 'Ubicació fixa: el sistema et diu on va cada càrrega.'}</p></section>
      ${primer ? `<section class="sec"><h2>Abans de començar</h2><div class="ll-cards">${LL.deNivell(S.nivell).map(l => `<button class="ll-card" data-ll="${l.id}"><b>${esc(l.titol)}</b><span class="small muted">${esc(l.text.slice(0, 90))}…</span></button>`).join('')}</div></section>` : ''}
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
    const tabs = [['rec', '📥 Recepció'], ['com', '📋 Comandes'], ['inv', '🔢 Inventari'], ['sgm', '🔎 SGM']].filter(([k]) => k !== 'com' || t.comandes.length).filter(([k]) => k !== 'inv' || t.inventari);
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
      inspecciona, mostraModul,
      canvi: (tic) => { if (!tic || panellTab !== 'sgm') pintaPanell(); pintaPorta(); },
      rellotge: (m) => { const h = $('#hora'); if (h) h.textContent = '🕗 ' + E.hora(m); const b = $('#barra'); if (b) b.style.width = ((m - D.TORN_INICI) / (D.TORN_FI - D.TORN_INICI) * 100) + '%'; },
      onFi: (res) => { const h = E.puntua(S, res); ctrl && ctrl.destrueix(); ctrl = null; desa(); resultat(h); }
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
    el.innerHTML = st.porta ? `<b>Portes:</b> ${PS.caixa(st.porta.prod, 16)} ${esc(P(st.porta.prod).nom)}${E.nivell(S).lliure ? '' : ` → <b class="cod">${D.UBICACIO[st.porta.prod]}</b>`}<br><span class="small muted">Toca la prestatgeria on va.</span>`
      : st.comanda ? `<b>Comanda:</b> ${esc(nomClient(st.comanda.client))} · palet amb ${st.pila.length} càrregues<br><span class="small muted">Toca les prestatgeries i, al final, «Deixar al moll ${S.dia.camions.find(c => c.id === st.comanda.camio).moll}».</span>`
      : `<span class="small muted">Mans lliures. Toca una càrrega del moll o comença una comanda.</span>`;
  }
  function pintaPanell() {
    if (!ctrl) return; const st = ctrl.estat(), c = $('#pcont'), t = S.dia, N = E.nivell(S); if (!c) return;
    if (panellTab === 'rec') {
      const txt = { moll: '<span class="tag">Per revisar</span>', acceptada: '<span class="tag groc">Per ubicar</span>', portant: '<span class="tag blau">La portes</span>', ubicada: '<span class="tag verd">Ubicada</span>', rebutjada: '<span class="tag vermell">Rebutjada</span>' };
      c.innerHTML = `<p class="small muted">Toca una càrrega per revisar-la; si ja està acceptada, per agafar-la.</p>
        <ul class="tasques">${st.carregues.map(x => `<li><button class="tasca" data-c="${x.id}" ${['ubicada', 'rebutjada', 'portant'].includes(x.estat) ? 'disabled' : ''}>${PS.caixa(x.prod, 18)}<span>${esc(P(x.prod).nom)}${x.slot ? ` <b class="cod">${x.slot}</b>` : ''}</span>${txt[x.estat]}</button></li>`).join('') || '<li class="muted small">Encara no ha arribat cap camió.</li>'}</ul>
        ${st.pendentsArribar.map(p => `<p class="small muted">🚚 ${esc(p.proveidor)} arribarà a les ${E.hora(p.arribada)}.</p>`).join('')}`;
      $$('[data-c]', c).forEach(b => b.onclick = () => ctrl.carrega(b.dataset.c));
    } else if (panellTab === 'com') {
      c.innerHTML = t.camions.map(cam => `<div class="cam-card"><b>🚛 Moll ${cam.moll} · surt a les ${E.hora(cam.sortida)}</b><span class="small muted">Repartiment: ${cam.ruta.map(nomClient).map(x => x.replace('Botiga de ', '')).join(' → ')}</span>
        ${t.comandes.filter(o => o.camio === cam.id).map(o => { const fet = st.palets.find(p => p.comanda === o.id), actiu = st.comanda && st.comanda.id === o.id, picks = st.res.picking.filter(p => p.comanda === o.id);
          return `<div class="com ${fet ? 'feta' : ''} ${actiu ? 'activa' : ''}"><div class="row" style="justify-content:space-between"><b>${esc(nomClient(o.client))}</b>${fet ? `<span class="tag verd">Al moll ${fet.moll} · ${E.hora(fet.minut)}</span>` : actiu ? '<span class="tag blau">Preparant</span>' : `<button class="btn small" data-o="${o.id}">Començar</button>`}</div>
            <ul class="linies">${o.linies.map(l => { const q = picks.filter(p => p.prod === l.prod).reduce((a, p) => a + p.q, 0); return `<li class="${q >= l.q ? 'ok' : ''}">${PS.caixa(l.prod, 14)} ${l.q} × ${esc(P(l.prod).nom)} ${N.lliure ? '' : `<b class="cod">${D.UBICACIO[l.prod]}</b>`} ${q ? `<span class="small">(${q})</span>` : ''}</li>`; }).join('')}</ul></div>`; }).join('')}</div>`).join('');
      $$('[data-o]', c).forEach(b => b.onclick = () => ctrl.comanda(b.dataset.o));
    } else if (panellTab === 'inv') {
      const inv = t.inventari, res = st.res.inventari;
      c.innerHTML = `<h3 class="h3">Recompte</h3><p class="small muted">Toca la prestatgeria per veure què hi ha i escriu quantes càrregues hi has comptat.</p>
        ${inv.recomptes.map(rc => `<label class="f-inline">${rc.slot} <span class="small muted">(sistema: ${rc.teoric})</span><input class="inp" type="number" min="0" data-rc="${rc.slot}" value="${res.recomptes[rc.slot] != null ? res.recomptes[rc.slot] : ''}"></label>`).join('')}
        <h3 class="h3">Comandes al proveïdor</h3><p class="small muted">Punt de comanda = consum diari × termini + seguretat. Demana només el que toqui.</p>
        ${inv.puntComanda.map(pc => `<label class="f-inline">${esc(P(pc.prod).nom)} <span class="small muted">estoc ${E.estocDe(S, pc.prod)} · consum ${pc.consumDia}/dia · termini ${pc.termini} dies · seguretat ${pc.seguretat}</span><input class="inp" type="number" min="0" data-pc="${pc.prod}" value="${res.comandes[pc.prod] || ''}" placeholder="0"></label>`).join('')}`;
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
    const niv = o.pas === 'F' || o.pas === 'P' ? 2 : D.NIVELLS_RACK;
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
    modal(`<h2>🗄️ ${o.pas}-${String(o.mod).padStart(2, '0')} · ${tit}</h2>
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
          ${lots.map((x, i) => `<tr><td>${PS.caixa(x.prod, 14)} ${esc(P(x.prod).nom)}</td><td>${x.lot}</td><td>${x.cad < 9000 && P(x.prod).cad ? E.data(x.cad) : '—'}</td><td class="n">${x.q}</td><td><div class="row" style="flex-wrap:nowrap"><input class="inp q" type="number" min="1" max="${x.q}" value="1" data-qi="${i}" aria-label="Quantitat"><button class="btn small prim" data-li="${i}">Agafar</button></div></td></tr>`).join('')}</tbody></table>`;
        $$('[data-li]', m).forEach(bb => bb.onclick = () => { const x = lots[+bb.dataset.li], q = Math.max(1, Math.min(x.q, +$(`[data-qi="${bb.dataset.li}"]`, m).value || 1)); tanca({ codi, lot: x.lot, q }); });
      });
    }, { ample: true, tancable: true, onTanca: () => { ctrl && ctrl.pausa(false); cb && cb(null); } });
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
  const CAT = { recepcio: '📥 Recepció', ubicacio: '🗄️ Ubicació', picking: '📋 Picking', fefo: '📅 FEFO', trencament: '💥 Trencament', expedicio: '🚛 Expedició', carrega: '🚛 Càrrega', seguretat: '⛑️ Seguretat', inventari: '🔢 Inventari', merma: '🗑️ Merma' };
  function resultat(h) {
    h = h || S.darrer; const k = h.kpi;
    const lls = LL.perErrors(h, S.llicons);
    const cls = h.veredicte === 'bo' ? 'bo' : h.veredicte === 'bronca' ? 'bronca' : '';
    app.innerHTML = `<div class="pant">${capcalera()}<main class="res">
      ${diu(esc(h.frase), cls)}
      <section class="sec notes"><div class="nota ${h.nota >= D.NOTA_BONA ? 'pos' : h.nota < 55 ? 'neg' : ''}"><span>Nota del torn</span><b>${h.nota}</b></div>
        <div class="bars"><div><span>Productivitat</span>${barra(h.productivitat, 'var(--blau)')}<b>${h.productivitat}</b></div><div><span>Qualitat</span>${barra(h.qualitat, 'var(--verd)')}<b>${h.qualitat}</b></div><div><span>Seguretat</span>${barra(h.seguretat, 'var(--groc)')}<b>${h.seguretat}</b></div></div></section>
      <section class="sec kpis"><div><span>Càrregues revisades bé</span><b>${Math.round(k.recOk)} / ${k.carregues}</b></div><div><span>Ubicades bé</span><b>${k.ubiOk} / ${k.ubicades}</b></div>
        ${k.comandes ? `<div><span>Comandes a temps</span><b>${k.aTemps} / ${k.comandes}</b></div><div><span>Errors de picking</span><b>${k.errorsPicking} %</b></div>` : ''}
        <div><span>Trencaments i mermes</span><b>${k.trencaments + k.caducats}</b></div><div><span>Incidents de seguretat</span><b>${k.incidents}</b></div><div><span>Fi del torn</span><b>${E.hora(k.fi)}</b></div></section>
      ${h.greus.length + h.errors.length ? `<section class="sec"><h2>Què ha fallat</h2><ul class="errs">${h.greus.map(e => `<li class="greu"><span>${CAT[e[0]] || e[0]}</span>${esc(e[1])}</li>`).join('')}${h.errors.map(e => `<li><span>${CAT[e[0]] || e[0]}</span>${esc(e[1])}</li>`).join('')}</ul></section>` : `<section class="sec"><h2>Torn perfecte!</h2><p>Cap error. Així es treballa.</p></section>`}
      ${h.bons.length ? `<section class="sec"><ul class="bons">${h.bons.map(b => `<li>✓ ${esc(b)}</li>`).join('')}</ul></section>` : ''}
      ${lls.length ? `<section class="sec"><h2>Per repassar</h2><div class="ll-cards">${lls.map(l => `<button class="ll-card" data-ll="${l.id}"><b>📘 ${esc(l.titol)}</b><span class="small muted">Lliçó i pregunta</span></button>`).join('')}</div></section>` : ''}
      <section class="sec small muted">Avisos: ${S.avisos} de ${D.AVISOS_ACOMIADAMENT} · torns bons seguits: ${S.tornsBons} (cal ${D.TORNS_ASCENS} per ascendir)</section>
      <div class="row" style="justify-content:center;margin:20px 0 40px"><button class="btn prim big" id="seg">${h.canvi === 'acomiadament' ? 'Continuar' : 'Següent torn →'}</button></div></main></div>`;
    lligaCap();
    $$('[data-ll]').forEach(b => b.onclick = () => llico(LL.per(b.dataset.ll), () => resultat(h)));
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

  window.PALET = { get S() { return S; }, get ctrl() { return ctrl; } };
  portada();
})();
