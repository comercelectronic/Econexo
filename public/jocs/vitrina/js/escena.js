/* Vitrina · escena: dibuixa la façana de la botiga (segons el carrer de Barcelona) i l'aparador amb els objectes,
   la il·luminació (spots, temperatura de color, llum general), el vidre i la vorera.
   Coordenades de l'aparador en cm: x 0-300 d'esquerra a dreta, y = alçada sobre el terra de l'aparador (0-220).
   L'aparador és 40 cm per sobre de la vorera, de manera que el punt focal (ulls del vianant, ~160 cm) queda a y≈120. */
(function (root) {
  const A = root.VA || require('./art.js');
  const S = {};
  const W = 300, H = 220;                 // interior de l'aparador
  const SW = 520, SH = 410;               // façana sencera
  const FX = 110, FY = 96;                // cantonada superior esquerra de l'interior dins la façana
  const SOL = FY + H;                     // terra de l'aparador (y svg) = 316
  const VORERA = SOL + 40;                // nivell de la vorera = 356
  const TERRA_Y = 214;                    // on es recolzen els objectes de terra dins l'interior (perspectiva)
  S.W = W; S.H = H; S.SW = SW; S.SH = SH; S.FX = FX; S.FY = FY; S.SOL = SOL; S.VORERA = VORERA; S.TERRA_Y = TERRA_Y;
  S.TEMP = { calida: '#ffc978', neutra: '#fff0d2', freda: '#d6e4ff' };
  S.NOM_TEMP = { calida: 'Càlida (2.700 K)', neutra: 'Neutra (4.000 K)', freda: 'Freda (6.000 K)' };
  let comptador = 0; const nou = (p = 'v') => p + (++comptador).toString(36);
  const esc = A.esc;
  // de cm de l'aparador a coordenades de la façana (per als punts calents i l'editor)
  S.aFacana = (x, y) => [FX + x, FY + TERRA_Y - y];
  S.deFacana = (sx, sy) => [sx - FX, FY + TERRA_Y - sy];

  /* ---------- Objectes ---------- */
  S.objecte = (it, u) => {
    const d = A.cataleg[it.id]; if (!d) return '';
    const s = it.s || 1, c = it.c || d.c, t = it.t != null ? it.t : d.t;
    const ombra = (it.y || 0) < 2 && !d.penjat ? `<ellipse cx="${it.x}" cy="${TERRA_Y + 1}" rx="${(d.w * s * 0.55).toFixed(1)}" ry="2.6" fill="#000" opacity=".22"/>` : '';
    return `${ombra}<g transform="translate(${it.x} ${TERRA_Y - (it.y || 0)}) scale(${it.flip ? -s : s} ${s})">${d.draw({ c, u: u + 'o', t })}</g>`;
  };
  // capsa que ocupa un objecte en cm de l'aparador (x0,y0 a baix esquerra; x1,y1 a dalt dreta)
  S.caixa = (it) => { const d = A.cataleg[it.id], s = it.s || 1; return { x0: it.x - d.w * s / 2, x1: it.x + d.w * s / 2, y0: it.y || 0, y1: (it.y || 0) + d.h * s }; };

  /* ---------- Interior ---------- */
  function interior(ap, u, nit) {
    const fons = A.fons[ap.fons] || A.fons.llis, terra = A.terres[ap.terra] || A.terres.fusta;
    const items = (ap.items || []).map((it, i) => Object.assign({ _i: i }, it)).sort((a, b) => (a.z || 0) - (b.z || 0) || a._i - b._i);
    const general = ap.general == null ? 0.7 : ap.general;
    const temp = S.TEMP[ap.temp] || S.TEMP.neutra;
    const llums = ap.llums || [];
    // foscor: de nit l'aparador només es veu pel que il·luminen els llums
    const foscor = nit ? 0.82 * (1 - general * 0.75) : 0.5 * (1 - general);
    const mascara = llums.map((l, i) => { const ty = TERRA_Y - (l.ty == null ? 100 : l.ty), r = l.r || 45; return `<ellipse cx="${l.tx}" cy="${ty}" rx="${r * 1.25}" ry="${r * 1.4}" fill="url(#${u}mk)"/>`; }).join('');
    const feixos = llums.map((l, i) => {
      const ty = TERRA_Y - (l.ty == null ? 100 : l.ty), r = l.r || 45, col = S.TEMP[l.temp] || temp, intens = l.i == null ? 1 : l.i;
      return `<defs>${A.lg(u + 'f' + i, [[0, col, 0.38 * intens], [1, col, 0.02]])}${A.rg(u + 'g' + i, [[0, col, 0.62 * intens], [0.55, col, 0.22 * intens], [1, col, 0]])}</defs>
        <polygon points="${l.x - 3},6 ${l.x + 3},6 ${l.tx + r},${ty + r * 0.4} ${l.tx - r},${ty + r * 0.4}" fill="url(#${u}f${i})" style="mix-blend-mode:screen"/>
        <ellipse cx="${l.tx}" cy="${ty}" rx="${r * 1.2}" ry="${r * 1.3}" fill="url(#${u}g${i})" style="mix-blend-mode:screen"/>`;
    }).join('');
    const spots = llums.map((l) => { const ty = TERRA_Y - (l.ty == null ? 100 : l.ty), ang = Math.atan2(ty - 6, l.tx - l.x) * 180 / Math.PI - 90, col = S.TEMP[l.temp] || temp;
      return `<g transform="translate(${l.x} 5) rotate(${ang.toFixed(1)})"><rect x="-3.2" y="-1" width="6.4" height="11" rx="1.6" fill="#2a2c31"/><ellipse cx="0" cy="10" rx="3" ry="1.3" fill="${col}"/></g><rect x="${l.x - 1.5}" y="2" width="3" height="4" fill="#2a2c31"/>`; }).join('');
    return `<defs><clipPath id="${u}cl"><rect width="${W}" height="${H}"/></clipPath>
        ${A.rg(u + 'mk', [[0, '#000'], [0.6, '#000', 0.6], [1, '#000', 0]])}
        <mask id="${u}m"><rect width="${W}" height="${H}" fill="#fff"/>${mascara}</mask>
        ${A.lg(u + 'vt', [[0, '#000', 0.28], [0.25, '#000', 0], [0.75, '#000', 0], [1, '#000', 0.28]], false)}
        ${A.lg(u + 'tt', [[0, '#000', 0.25], [0.18, '#000', 0]])}</defs>
      <g clip-path="url(#${u}cl)">
        ${fons.draw(u + 'b', ap.fonsC || '#f3efe8', W, H)}
        <g transform="translate(0 ${TERRA_Y - 26})">${terra.draw(u + 't', W, H - TERRA_Y + 26)}</g>
        <rect x="0" y="${TERRA_Y - 26}" width="${W}" height="2.2" fill="#000" opacity=".18"/>
        <rect width="${W}" height="${H}" fill="url(#${u}vt)"/><rect width="${W}" height="${H}" fill="url(#${u}tt)"/>
        ${items.map((it, i) => S.objecte(it, u + 'i' + i)).join('')}
        <rect width="${W}" height="${H}" fill="${temp}" opacity="${0.1 + general * 0.06}" style="mix-blend-mode:multiply"/>
        <rect width="${W}" height="${H}" fill="#070910" opacity="${foscor.toFixed(2)}" mask="url(#${u}m)"/>
        ${feixos}
        <rect x="0" y="0" width="${W}" height="3" fill="#1d1f24"/>${spots}
      </g>`;
  }

  /* ---------- Vorera ---------- */
  function vorera(zona, u) {
    const h = SH - VORERA;
    if (zona === 'passeig') // panot hexagonal de Gaudí (gris blavós)
      return `<defs><pattern id="${u}hx" width="21" height="12.12" patternUnits="userSpaceOnUse"><rect width="21" height="12.12" fill="#8f9aa0"/>
        <path d="M0 6.06 L3.5 0 L10.5 0 L14 6.06 L10.5 12.12 L3.5 12.12 Z M14 6.06 L21 6.06" fill="#9aa6ac" stroke="#6f7a80" stroke-width="0.5"/>
        <circle cx="7" cy="6.06" r="2.2" fill="none" stroke="#76838a" stroke-width="0.6"/><path d="M4 3 Q7 6 10 3 M4 9 Q7 6 10 9" stroke="#76838a" stroke-width="0.5" fill="none"/></pattern></defs>
        <rect y="${VORERA}" width="${SW}" height="${h}" fill="url(#${u}hx)"/>`;
    // panot de la flor de Barcelona
    return `<defs><pattern id="${u}pf" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#b9b3a9"/>
      <rect width="20" height="20" fill="none" stroke="#9c958a" stroke-width="0.6"/>${[[5, 5], [15, 5], [5, 15], [15, 15]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.8" fill="#a8a196"/><circle cx="${x}" cy="${y}" r="1" fill="#9c958a"/>`).join('')}
      <circle cx="10" cy="10" r="1.6" fill="#a8a196"/></pattern></defs><rect y="${VORERA}" width="${SW}" height="${h}" fill="url(#${u}pf)"/>`;
  }

  /* ---------- Façanes per zona ---------- */
  const rotul = (marca, x, y, mida, color, font, extra = '') => `<text x="${x}" y="${y}" text-anchor="middle" font-family="${font}" font-size="${mida}" fill="${color}" ${extra}>${esc(marca.nom)}</text>`;
  const SERIF = "Georgia, 'DejaVu Serif', 'Times New Roman', serif", SANS = 'Inter, Arial, sans-serif';
  const F = {};
  // Passeig de Gràcia: pedra modernista, columnes, baranes de forja i rètol daurat sobre negre
  F.passeig = (m, u) => ({
    darrere: `<defs>${A.lg(u + 'pd', [[0, '#efe4cf'], [1, '#dccbaa']])}${A.lg(u + 'gr', [[0, '#3a3d42'], [1, '#1f2125']])}</defs>
      <rect width="${SW}" height="${VORERA}" fill="url(#${u}pd)"/>
      ${Array.from({ length: 12 }, (_, i) => `<path d="M0 ${i * 30 + 12} H${SW}" stroke="#cdb994" stroke-width="0.8"/>`).join('')}
      <path d="M40 0 Q60 30 40 60 M480 0 Q460 30 480 60" stroke="#cdb994" stroke-width="1.2" fill="none"/>
      <g transform="translate(${SW / 2} 18)"><path d="M-150 18 Q-150 0 -130 0 L130 0 Q150 0 150 18" fill="#d9c7a3"/>
        ${Array.from({ length: 21 }, (_, i) => `<path d="M${-140 + i * 14} 18 q4 -10 0 -16 q-4 6 0 16" stroke="#2b2b2b" stroke-width="1.1" fill="none"/>`).join('')}
        <rect x="-150" y="17" width="300" height="3" fill="#2b2b2b"/><rect x="-150" y="2" width="300" height="1.6" fill="#2b2b2b"/></g>
      <rect x="${FX - 6}" y="${FY - 6}" width="${W + 12}" height="${H + 12}" fill="#5b4a33"/>`,
    davant: `<rect x="${FX - 4}" y="${FY - 4}" width="${W + 8}" height="${H + 8}" fill="none" stroke="#a88b54" stroke-width="3"/>
      <rect x="${FX - 6}" y="${FY - 52}" width="${W + 12}" height="38" fill="#141518"/><rect x="${FX - 6}" y="${FY - 52}" width="${W + 12}" height="38" fill="none" stroke="#a88b54" stroke-width="1.2"/>
      ${[FX - 34, FX + W + 12].map(x => `<rect x="${x}" y="${FY - 60}" width="22" height="${SOL - FY + 60}" fill="#e6d8bd"/><rect x="${x}" y="${FY - 60}" width="22" height="${SOL - FY + 60}" fill="none" stroke="#c4ad83" stroke-width="0.8"/>
        <path d="M${x + 5} ${FY - 50} V${SOL - 8} M${x + 11} ${FY - 50} V${SOL - 8} M${x + 17} ${FY - 50} V${SOL - 8}" stroke="#cdb994" stroke-width="0.8"/>
        <path d="M${x - 4} ${FY - 60} h30 l-4 8 h-22 z" fill="#d6c19a"/><circle cx="${x + 11}" cy="${FY - 66}" r="6" fill="#d6c19a"/>`).join('')}
      <rect x="${FX - 34}" y="${SOL}" width="${W + 68}" height="40" fill="url(#${u}gr)"/><rect x="${FX - 34}" y="${SOL}" width="${W + 68}" height="2" fill="#a88b54"/>`,
    rotul: rotul(m, SW / 2, FY - 27, 17, '#d8b45a', SERIF, 'letter-spacing="5"')
  });
  // Portal de l'Àngel: façana moderna de grans panells, perfil negre i rètol gran
  F.angel = (m, u) => ({
    darrere: `<rect width="${SW}" height="${VORERA}" fill="#dfe2e5"/>${Array.from({ length: 6 }, (_, i) => `<path d="M${i * 104} 0 V${VORERA}" stroke="#c6cacf" stroke-width="1"/>`).join('')}
      <path d="M0 70 H${SW}" stroke="#c6cacf" stroke-width="1"/><rect x="${FX - 8}" y="${FY - 8}" width="${W + 16}" height="${H + 16}" fill="#15171a"/>`,
    davant: `<rect x="${FX - 8}" y="${FY - 8}" width="${W + 16}" height="${H + 16}" fill="none" stroke="#15171a" stroke-width="5"/>
      <rect x="${FX - 8}" y="${FY - 62}" width="${W + 16}" height="44" fill="${m.c1 || '#15171a'}"/>
      <rect x="${FX - 8}" y="${FY - 18}" width="${W + 16}" height="3" fill="${m.c2 || '#ffffff'}" opacity=".9"/>
      <rect x="${FX - 8}" y="${SOL}" width="${W + 16}" height="40" fill="#15171a"/>`,
    rotul: rotul(m, SW / 2, FY - 30, 26, m.c2 || '#ffffff', SANS, 'font-weight="800" letter-spacing="8"')
  });
  // El Born: pedra antiga, arc rebaixat, fusteria fosca i rètol de forja en banderola
  F.born = (m, u) => {
    const pedres = []; for (let r = 0; r < 13; r++) for (let c = 0; c < 14; c++) { const w = 38 + ((r * 7 + c * 13) % 4) * 6, x = c * 44 - (r % 2) * 20 + ((r * c) % 5); pedres.push(`<rect x="${x}" y="${r * 28}" width="${w}" height="26" rx="3" fill="${['#b7a283', '#ad9878', '#bfab8d', '#a8916f'][(r + c) % 4]}"/>`); }
    return {
      darrere: `<rect width="${SW}" height="${VORERA}" fill="#8e7b5e"/>${pedres.join('')}
        <path d="M${FX - 22} ${SOL} V${FY + 10} Q${SW / 2} ${FY - 52} ${FX + W + 22} ${FY + 10} V${SOL} Z" fill="#cbb999"/>
        <path d="M${FX - 22} ${FY + 10} Q${SW / 2} ${FY - 52} ${FX + W + 22} ${FY + 10}" stroke="#8e7b5e" stroke-width="2" fill="none"/>
        ${Array.from({ length: 11 }, (_, i) => { const t = i / 10, x = FX - 22 + (W + 44) * t, y = FY + 10 - 62 * 4 * t * (1 - t) * 0.98; return `<path d="M${x.toFixed(1)} ${y.toFixed(1)} L${(SW / 2 + (x - SW / 2) * 0.86).toFixed(1)} ${(y + 16).toFixed(1)}" stroke="#a8916f" stroke-width="1.2"/>`; }).join('')}
        <rect x="${FX - 6}" y="${FY - 6}" width="${W + 12}" height="${H + 12}" fill="#2c3d33"/>`,
      davant: `<rect x="${FX - 5}" y="${FY - 5}" width="${W + 10}" height="${H + 10}" fill="none" stroke="#2c3d33" stroke-width="6"/>
        <rect x="${FX - 5}" y="${FY - 5}" width="${W + 10}" height="${H + 10}" fill="none" stroke="#c9a35b" stroke-width="0.7"/>
        <g transform="translate(${FX - 40} ${FY - 30})"><path d="M-30 0 H60 M-30 0 q8 -14 22 -6" stroke="#222" stroke-width="2.2" fill="none"/><path d="M0 0 V6 M50 0 V6" stroke="#222" stroke-width="1"/>
          <ellipse cx="25" cy="22" rx="34" ry="17" fill="${m.c1 || '#2c3d33'}" stroke="#c9a35b" stroke-width="1.4"/>
</g>
        <path d="M${SW - 60} ${FY - 40} h22 M${SW - 49} ${FY - 40} v10" stroke="#222" stroke-width="1.6"/><path d="M${SW - 56} ${FY - 30} h14 l-3 18 h-8 z" fill="#2a2a2a"/>
        <rect x="${FX - 22}" y="${SOL}" width="${W + 44}" height="40" fill="#9c8869"/><rect x="${FX - 22}" y="${SOL}" width="${W + 44}" height="3" fill="#7d6b50"/>`,
      rotul: `<text x="${FX - 15}" y="${FY - 5}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="${Math.min(8.6, 105 / Math.max(6, m.nom.length))}" fill="#f1e2bf">${esc(m.nom)}</text>
        <rect x="${SW - 53}" y="${FY - 27}" width="8" height="12" fill="#ffd27a" opacity=".9"/><circle cx="${SW - 49}" cy="${FY - 21}" r="16" fill="#ffd27a" opacity=".12"/>`
    };
  };
  // Gràcia: façana arrebossada de color, balcó amb testos, fusteria pintada i sòcol de rajola hidràulica
  F.gracia = (m, u) => ({
    darrere: `<defs><pattern id="${u}rh" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#efe6d4"/>
        <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="${m.c1 || '#2f6b4f'}" opacity=".85"/><circle cx="10" cy="10" r="3.4" fill="#c86b4a"/><circle cx="0" cy="0" r="3" fill="#e9c46a"/><circle cx="20" cy="0" r="3" fill="#e9c46a"/><circle cx="0" cy="20" r="3" fill="#e9c46a"/><circle cx="20" cy="20" r="3" fill="#e9c46a"/></pattern></defs>
      <rect width="${SW}" height="${VORERA}" fill="${m.facana || '#e7b97c'}"/>
      <rect width="${SW}" height="${VORERA}" fill="#fff" opacity=".06"/>
      <g transform="translate(${SW / 2} 30)"><rect x="-120" y="22" width="240" height="5" fill="#8d7a63"/>
        ${Array.from({ length: 25 }, (_, i) => `<path d="M${-116 + i * 9.6} 22 V0" stroke="#2b2b2b" stroke-width="1"/>`).join('')}<rect x="-120" y="-1" width="240" height="2.4" fill="#2b2b2b"/>
        ${[-96, -40, 30, 92].map((x, i) => `<path d="M${x - 8} -1 l2 -9 h12 l2 9 z" fill="#c86b4a"/>${[[-5, -16], [0, -20], [5, -16]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${dy}" r="4" fill="${['#e76f51', '#f4a6b8', '#e9c46a', '#c1121f'][i]}"/>`).join('')}<ellipse cx="${x}" cy="-10" rx="10" ry="3" fill="#3a7d4f"/>`).join('')}</g>
      <rect x="${FX - 8}" y="${FY - 8}" width="${W + 16}" height="${H + 16}" fill="${m.c1 || '#2f6b4f'}"/>`,
    davant: `<rect x="${FX - 7}" y="${FY - 7}" width="${W + 14}" height="${H + 14}" fill="none" stroke="${m.c1 || '#2f6b4f'}" stroke-width="7"/>
      <rect x="${FX - 2}" y="${FY - 2}" width="${W + 4}" height="${H + 4}" fill="none" stroke="${A.light(m.c1 || '#2f6b4f', 0.3)}" stroke-width="1"/>
      <rect x="${FX - 8}" y="${FY - 50}" width="${W + 16}" height="36" fill="${m.c1 || '#2f6b4f'}"/>
      <rect x="${FX - 8}" y="${SOL}" width="${W + 16}" height="40" fill="url(#${u}rh)"/><rect x="${FX - 8}" y="${SOL}" width="${W + 16}" height="40" fill="none" stroke="#8d7a63" stroke-width="1.2"/>`,
    rotul: rotul(m, SW / 2, FY - 26, 17, '#fbf3df', SERIF, 'font-weight="700" letter-spacing="2"')
  });
  S.FACANES = F;

  /* ---------- Vianants (perfil pla, per a la vorera i la simulació) ---------- */
  S.vianant = (x, k = 0, mida = 1, mira = false) => {
    const pell = ['#f1c9a5', '#c68e62', '#8a5a3c', '#e8b48c', '#5a3a28'][k % 5], abric = ['#2b2d42', '#b23a48', '#5b7f95', '#6b4226', '#2f6b4f', '#e9c46a'][k % 6], pantalo = ['#1f2328', '#3d405b', '#5a4632'][k % 3], cabell = ['#2b1d14', '#6b4226', '#d9b26f', '#111', '#a33'][k % 5];
    const g = `<g transform="translate(${x} ${VORERA + 26}) scale(${mida})">
      <ellipse cx="0" cy="0" rx="14" ry="3" fill="#000" opacity=".25"/>
      <rect x="-6" y="-78" width="5.5" height="78" rx="2" fill="${pantalo}"/><rect x="0.5" y="-78" width="5.5" height="78" rx="2" fill="${A.dark(pantalo, 0.15)}"/>
      <path d="M-13 -140 Q0 -147 13 -140 L15 -72 L-15 -72 Z" fill="${abric}"/><path d="M-13 -138 L-17 -88 L-12 -86 L-9 -124 Z M13 -138 L17 -88 L12 -86 L9 -124 Z" fill="${A.dark(abric, 0.15)}"/>
      <rect x="-3.5" y="-150" width="7" height="10" fill="${pell}"/><ellipse cx="${mira ? 0 : 1.5}" cy="-160" rx="9.5" ry="11" fill="${pell}"/>
      <path d="M-10 -162 Q-9 -174 1 -173 Q11 -173 10 -160 Q6 -168 -10 -162 Z" fill="${cabell}"/>
      ${mira ? `<circle cx="-3" cy="-160" r="1" fill="#222"/><circle cx="3" cy="-160" r="1" fill="#222"/>` : ''}</g>`;
    return g;
  };

  /* ---------- Escena completa ---------- */
  // cfg: { zona, marca:{nom,c1,c2,facana}, ap:{fons,fonsC,terra,items,llums,general,temp}, nit, vianants:[{x,k,mira}], ancoratges:[...] }
  S.aparador = (cfg) => {
    const u = nou(), zona = cfg.zona || 'gracia', f = (F[zona] || F.gracia)(cfg.marca || { nom: 'Botiga' }, u), nit = !!cfg.nit, ap = cfg.ap || {};
    const temp = S.TEMP[ap.temp] || S.TEMP.neutra, general = ap.general == null ? 0.7 : ap.general;
    const lluminos = Math.min(1, general * 0.6 + (ap.llums || []).length * 0.12);
    const reflexos = `<g opacity="${nit ? 0.35 : 1}" style="pointer-events:none">
        <polygon points="${FX + 30},${FY} ${FX + 92},${FY} ${FX + 20},${SOL} ${FX - 42},${SOL}" fill="#fff" opacity=".09"/>
        <polygon points="${FX + 110},${FY} ${FX + 128},${FY} ${FX + 56},${SOL} ${FX + 38},${SOL}" fill="#fff" opacity=".07"/>
        <polygon points="${FX + 230},${FY} ${FX + 290},${FY} ${FX + 218},${SOL} ${FX + 158},${SOL}" fill="#fff" opacity=".05"/></g>`;
    const vianants = `<g${nit ? ' style="filter:brightness(.6) saturate(.8)"' : ''}>${(cfg.vianants || []).map(v => S.vianant(v.x, v.k, v.mida || 1, v.mira)).join('')}</g>`;
    const vespre = nit ? `<rect width="${SW}" height="${SH}" fill="#0b1026" opacity=".6" mask="url(#${u}fm)"/>` : '';
    const vessament = nit ? `<polygon points="${FX},${VORERA} ${FX + W},${VORERA} ${FX + W + 60},${SH} ${FX - 60},${SH}" fill="url(#${u}vs)" style="mix-blend-mode:screen"/>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SW} ${SH}" class="vt-escena" role="img" aria-label="Aparador de ${esc((cfg.marca || {}).nom || 'botiga')}">
      <defs><clipPath id="${u}vid"><rect x="${FX}" y="${FY}" width="${W}" height="${H}"/></clipPath>
        <mask id="${u}fm"><rect width="${SW}" height="${SH}" fill="#fff"/><rect x="${FX}" y="${FY}" width="${W}" height="${H}" fill="#000"/></mask>
        <filter id="${u}gl" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        ${A.lg(u + 'vs', [[0, temp, 0.35 * lluminos], [1, temp, 0]])}</defs>
      ${f.darrere}
      <g transform="translate(${FX} ${FY})">${interior(ap, u + 'a', nit)}</g>
      <g clip-path="url(#${u}vid)">${reflexos}</g>
      ${f.davant}
      ${vorera(zona, u)}
      ${vespre}${nit ? `<g filter="url(#${u}gl)">${f.rotul}</g>` : f.rotul}${vessament}
      ${vianants}
      ${cfg.extra || ''}
    </svg>`;
  };

  if (typeof module !== 'undefined') module.exports = S; else root.VE = S;
})(this);
