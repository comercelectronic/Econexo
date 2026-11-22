/* Vitrina · art: catàleg d'objectes dibuixats en SVG (productes, suports, decoració i cartells), fons i terres.
   Cada objecte es dibuixa en centímetres amb l'origen a baix al centre (x de -w/2 a w/2, y de -h a 0).
   draw(o) rep { c: color principal, u: identificador únic per als degradats, t: text } i torna SVG. */
(function (root) {
  const A = {};
  // ---------- Colors ----------
  const hex = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const toHex = (r, g, b) => '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  A.mix = (a, b, t) => { const x = hex(a), y = hex(b); return toHex(x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t); };
  A.dark = (c, t = 0.3) => A.mix(c, '#000000', t);
  A.light = (c, t = 0.3) => A.mix(c, '#ffffff', t);
  A.hsl = (h) => { // hex → [hue 0-360, sat 0-1, lum 0-1]
    let [r, g, b] = hex(h).map(v => v / 255); const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
    if (mx === mn) return [0, 0, l];
    const d = mx - mn, s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    let hh = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [hh * 60, s, l];
  };
  // degradat lineal vertical o horitzontal
  const lg = (id, stops, vert = true) => `<linearGradient id="${id}" x1="0" y1="0" x2="${vert ? 0 : 1}" y2="${vert ? 1 : 0}">${stops.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op != null ? ` stop-opacity="${op}"` : ''}/>`).join('')}</linearGradient>`;
  const rg = (id, stops, cx = 0.5, cy = 0.5, r = 0.5) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op != null ? ` stop-opacity="${op}"` : ''}/>`).join('')}</radialGradient>`;
  A.lg = lg; A.rg = rg;
  const esc = (t) => String(t == null ? '' : t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // cilindre (podi) vist de front
  const cil = (u, w, h, c) => `<defs>${lg(u + 'c', [[0, A.dark(c, 0.25)], [0.35, A.light(c, 0.25)], [0.6, c], [1, A.dark(c, 0.35)]], false)}</defs>
    <rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="url(#${u}c)"/><ellipse cx="0" cy="0" rx="${w / 2}" ry="${w * 0.09}" fill="${A.dark(c, 0.35)}"/>
    <ellipse cx="0" cy="${-h}" rx="${w / 2}" ry="${w * 0.09}" fill="${A.light(c, 0.18)}"/>`;
  const cub = (u, w, h, c) => `<defs>${lg(u + 'k', [[0, A.light(c, 0.12)], [1, A.dark(c, 0.12)]])}</defs>
    <rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="url(#${u}k)"/><rect x="${-w / 2}" y="${-h}" width="${w}" height="${Math.min(4, h * 0.12)}" fill="${A.light(c, 0.3)}"/>
    <rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="none" stroke="${A.dark(c, 0.25)}" stroke-width="0.4"/>`;

  // ---------- Catàleg ----------
  // cat: producte | suport | deco | cartell · tema: per comprovar si l'objecte encaixa amb un encàrrec
  const C = A.cataleg = {};
  const def = (id, o) => { C[id] = Object.assign({ id, colors: [] }, o); };

  /* ===== Suports ===== */
  def('podi-alt', { nom: 'Podi cilíndric alt', cat: 'suport', w: 42, h: 70, c: '#f3efe8', colors: ['#f3efe8', '#1f2328', '#c9a35b', '#d8c3a5', '#b23a48', '#8fb9a8'], suport: true, draw: (o) => cil(o.u, 42, 70, o.c) });
  def('podi-mig', { nom: 'Podi cilíndric mitjà', cat: 'suport', w: 42, h: 45, c: '#f3efe8', colors: ['#f3efe8', '#1f2328', '#c9a35b', '#d8c3a5', '#b23a48', '#8fb9a8'], suport: true, draw: (o) => cil(o.u, 42, 45, o.c) });
  def('podi-baix', { nom: 'Podi cilíndric baix', cat: 'suport', w: 48, h: 22, c: '#f3efe8', colors: ['#f3efe8', '#1f2328', '#c9a35b', '#d8c3a5', '#b23a48', '#8fb9a8'], suport: true, draw: (o) => cil(o.u, 48, 22, o.c) });
  def('cub', { nom: 'Cub', cat: 'suport', w: 40, h: 40, c: '#ffffff', colors: ['#ffffff', '#1f2328', '#d8c3a5', '#c9a35b', '#e9d6c5', '#a3c4bc'], suport: true, draw: (o) => cub(o.u, 40, 40, o.c) });
  def('cub-baix', { nom: 'Plataforma baixa', cat: 'suport', w: 90, h: 14, c: '#ffffff', colors: ['#ffffff', '#1f2328', '#d8c3a5', '#c9a35b', '#e9d6c5'], suport: true, draw: (o) => cub(o.u, 90, 14, o.c) });
  def('escala', { nom: 'Escala de tres graons', cat: 'suport', w: 75, h: 54, c: '#efe7dc', colors: ['#efe7dc', '#1f2328', '#c9a35b', '#ffffff'], suport: true, superficies: [[-37.5, -12.5, 18], [-12.5, 12.5, 36], [12.5, 37.5, 54]],
    draw: (o) => [0, 1, 2].map(i => `<g transform="translate(${-25 + i * 25},0)">${cub(o.u + i, 25, 18 * (i + 1), o.c)}</g>`).join('') });
  def('taula', { nom: 'Tauleta', cat: 'suport', w: 90, h: 72, c: '#8b5e3c', colors: ['#8b5e3c', '#1f2328', '#f3efe8', '#c9a35b'], suport: true,
    draw: (o) => `<rect x="-45" y="-72" width="90" height="6" rx="1.5" fill="${o.c}"/><rect x="-45" y="-72" width="90" height="2" fill="${A.light(o.c, 0.25)}"/>
      <rect x="-40" y="-66" width="4" height="66" fill="${A.dark(o.c, 0.2)}"/><rect x="36" y="-66" width="4" height="66" fill="${A.dark(o.c, 0.2)}"/>` });
  def('prestatge', { nom: 'Prestatge penjat', cat: 'suport', w: 80, h: 4, c: '#efe7dc', colors: ['#efe7dc', '#8b5e3c', '#1f2328', '#ffffff'], suport: true, penjat: true,
    draw: (o) => `<rect x="-40" y="-4" width="80" height="4" fill="${o.c}"/><rect x="-40" y="-4" width="80" height="1.2" fill="${A.light(o.c, 0.3)}"/><rect x="-40" y="0" width="80" height="2.5" fill="#000" opacity=".12"/>` });

  /* ===== Maniquins i bustos (el color és el de la roba) ===== */
  def('maniqui', { nom: 'Maniquí amb vestit', cat: 'producte', tipus: 'moda', w: 46, h: 172, c: '#d98f8f', colors: ['#d98f8f', '#f2c6a0', '#9cc5d6', '#c8d9a8', '#1f2328', '#f3efe8', '#b23a48', '#c9a35b'],
    draw: (o) => `<defs>${lg(o.u + 'v', [[0, A.light(o.c, 0.12)], [1, A.dark(o.c, 0.22)]])}${lg(o.u + 'p', [[0, '#f6f1ea'], [1, '#d9d2c8']], false)}</defs>
      <rect x="-1.5" y="-12" width="3" height="12" fill="#9aa0a6"/><ellipse cx="0" cy="0" rx="16" ry="2.4" fill="#5f6368"/>
      <ellipse cx="0" cy="-158" rx="10" ry="12.5" fill="url(#${o.u}p)"/><rect x="-3.5" y="-147" width="7" height="8" fill="#e4ddd3"/>
      <path d="M-15 -139 Q0 -144 15 -139 L13 -100 Q20 -60 22 -24 L-22 -24 Q-20 -60 -13 -100 Z" fill="url(#${o.u}v)"/>
      <path d="M-15 -139 L-20 -96 L-16 -94 L-12 -125 Z M15 -139 L20 -96 L16 -94 L12 -125 Z" fill="${A.dark(o.c, 0.1)}"/>
      <path d="M-13 -100 Q0 -96 13 -100" stroke="${A.dark(o.c, 0.3)}" stroke-width="1.2" fill="none"/>
      <rect x="-19" y="-95" width="4" height="22" rx="2" fill="#e4ddd3"/><rect x="15" y="-95" width="4" height="22" rx="2" fill="#e4ddd3"/>
      <rect x="-9" y="-24" width="5" height="12" fill="#e4ddd3"/><rect x="4" y="-24" width="5" height="12" fill="#e4ddd3"/>` });
  def('bust', { nom: 'Bust amb jersei', cat: 'producte', tipus: 'moda', w: 34, h: 62, c: '#c8d9a8', colors: ['#c8d9a8', '#d98f8f', '#9cc5d6', '#f2c6a0', '#1f2328', '#f3efe8', '#b23a48'],
    draw: (o) => `<defs>${lg(o.u + 'v', [[0, A.light(o.c, 0.1)], [1, A.dark(o.c, 0.25)]])}</defs><rect x="-1.5" y="-14" width="3" height="14" fill="#9aa0a6"/><ellipse cx="0" cy="0" rx="10" ry="2" fill="#5f6368"/>
      <path d="M-17 -54 Q0 -60 17 -54 L15 -14 L-15 -14 Z" fill="url(#${o.u}v)"/><path d="M-6 -57 Q0 -50 6 -57" stroke="${A.dark(o.c, 0.3)}" stroke-width="1.5" fill="none"/>
      <rect x="-3" y="-62" width="6" height="6" fill="#e4ddd3"/>` });

  /* ===== Productes: moda i complements ===== */
  def('bossa', { nom: 'Bossa de mà', cat: 'producte', tipus: 'moda', w: 34, h: 30, c: '#8c4a2f', colors: ['#8c4a2f', '#1f2328', '#c9a35b', '#b23a48', '#e9d6c5', '#5b7f95'],
    draw: (o) => `<defs>${lg(o.u + 'b', [[0, A.light(o.c, 0.15)], [1, A.dark(o.c, 0.2)]])}</defs><path d="M-9 -20 Q-9 -31 0 -31 Q9 -31 9 -20" stroke="${A.dark(o.c, 0.25)}" stroke-width="2.4" fill="none"/>
      <path d="M-16 -20 L16 -20 L17 0 L-17 0 Z" fill="url(#${o.u}b)"/><rect x="-16" y="-20" width="32" height="3" fill="${A.dark(o.c, 0.15)}"/><rect x="-3" y="-15" width="6" height="4" rx="1" fill="#d8b45a"/>` });
  def('sabata', { nom: 'Sabata de taló', cat: 'producte', tipus: 'sabates', w: 26, h: 14, c: '#b23a48', colors: ['#b23a48', '#1f2328', '#c9a35b', '#e9d6c5', '#5b7f95', '#2f6b4f'],
    draw: (o) => `<path d="M-13 0 L-13 -13 Q-11 -14 -9 -12 L-8 -4 Q2 -5 8 -8 Q13 -9 13 -3 L13 0 Z" fill="${o.c}"/><path d="M-13 0 L-12 -11 L-10 0 Z" fill="${A.dark(o.c, 0.3)}"/><path d="M-8 -4 Q2 -5 8 -8" stroke="${A.light(o.c, 0.35)}" stroke-width="0.8" fill="none"/>` });
  def('bota', { nom: 'Bota', cat: 'producte', tipus: 'sabates', w: 24, h: 30, c: '#6b4226', colors: ['#6b4226', '#1f2328', '#8c4a2f', '#c9a35b', '#5b7f95'],
    draw: (o) => `<defs>${lg(o.u + 'b', [[0, A.light(o.c, 0.1)], [1, A.dark(o.c, 0.2)]], false)}</defs><path d="M-11 -30 L1 -30 L2 -10 Q10 -9 12 -4 L12 0 L-11 0 Z" fill="url(#${o.u}b)"/><rect x="-11" y="-2" width="23" height="2" fill="${A.dark(o.c, 0.45)}"/><path d="M-11 -24 L1 -24" stroke="${A.light(o.c, 0.3)}" stroke-width="0.8"/>` });
  def('sabatilla', { nom: 'Sabatilla esportiva', cat: 'producte', tipus: 'sabates', w: 30, h: 13, c: '#f3efe8', colors: ['#f3efe8', '#1f2328', '#5b7f95', '#e76f51', '#2a9d8f', '#e9c46a'],
    draw: (o) => `<path d="M-15 0 L-15 -9 Q-13 -12 -8 -12 L-2 -12 Q4 -6 13 -5 Q15 -4 15 -1 L15 0 Z" fill="${o.c}" stroke="${A.dark(o.c, 0.25)}" stroke-width="0.5"/>
      <rect x="-15" y="-2.5" width="30" height="2.5" fill="${o.c === '#f3efe8' ? '#e76f51' : '#f3efe8'}"/><path d="M-6 -11 L-1 -7 M-4 -11 L1 -7" stroke="${A.dark(o.c, 0.4)}" stroke-width="0.6"/>` });
  def('barret', { nom: 'Barret', cat: 'producte', tipus: 'moda', w: 34, h: 15, c: '#d8c3a5', colors: ['#d8c3a5', '#1f2328', '#8c4a2f', '#b23a48'],
    draw: (o) => `<ellipse cx="0" cy="-2" rx="17" ry="2.5" fill="${A.dark(o.c, 0.15)}"/><path d="M-10 -2 Q-10 -15 0 -15 Q10 -15 10 -2 Z" fill="${o.c}"/><rect x="-10" y="-6" width="20" height="2.5" fill="${A.dark(o.c, 0.45)}"/>` });
  def('pila-roba', { nom: 'Pila de roba plegada', cat: 'producte', tipus: 'moda', w: 30, h: 16, c: '#9cc5d6', colors: ['#9cc5d6', '#d98f8f', '#c8d9a8', '#f3efe8', '#1f2328', '#e9c46a'],
    draw: (o) => [0, 1, 2, 3].map(i => `<rect x="-15" y="${-4 * (i + 1)}" width="30" height="4" rx="1.2" fill="${i % 2 ? A.light(o.c, 0.15) : o.c}" stroke="${A.dark(o.c, 0.2)}" stroke-width="0.4"/>`).join('') });
  def('ulleres', { nom: 'Ulleres de sol', cat: 'producte', tipus: 'moda', w: 16, h: 6, c: '#1f2328', colors: ['#1f2328', '#8c4a2f', '#c9a35b'],
    draw: (o) => `<rect x="-8" y="-6" width="7" height="5" rx="2" fill="${o.c}"/><rect x="1" y="-6" width="7" height="5" rx="2" fill="${o.c}"/><path d="M-1 -4.5 L1 -4.5" stroke="${o.c}" stroke-width="1"/><rect x="-7" y="-5.5" width="2" height="1" fill="#fff" opacity=".4"/>` });
  def('rellotge', { nom: 'Rellotge', cat: 'producte', tipus: 'luxe', w: 9, h: 13, c: '#c9a35b', colors: ['#c9a35b', '#c0c4c8', '#1f2328'],
    draw: (o) => `<rect x="-2.5" y="-13" width="5" height="13" rx="1" fill="${A.dark(o.c, 0.3)}"/><circle cx="0" cy="-6.5" r="4.3" fill="${o.c}"/><circle cx="0" cy="-6.5" r="3.4" fill="#fbfaf6"/><path d="M0 -6.5 L0 -9 M0 -6.5 L1.8 -6" stroke="#333" stroke-width="0.5"/>` });

  /* ===== Productes: perfumeria i luxe ===== */
  def('perfum', { nom: 'Ampolla de perfum', cat: 'producte', tipus: 'luxe', w: 11, h: 17, c: '#e9b8c8', colors: ['#e9b8c8', '#c9a35b', '#9cc5d6', '#1f2328', '#b23a48', '#f3efe8'],
    draw: (o) => `<defs>${lg(o.u + 'g', [[0, A.light(o.c, 0.45), 0.95], [0.5, o.c, 0.85], [1, A.dark(o.c, 0.25), 0.95]], false)}</defs>
      <rect x="-5.5" y="-12" width="11" height="12" rx="2" fill="url(#${o.u}g)" stroke="${A.dark(o.c, 0.3)}" stroke-width="0.3"/><rect x="-2" y="-15" width="4" height="3" fill="#c9a35b"/><rect x="-3" y="-17" width="6" height="2.4" rx="0.6" fill="#1f2328"/>
      <rect x="-4" y="-10.5" width="1.4" height="8" rx="0.7" fill="#fff" opacity=".6"/><rect x="-3.4" y="-6" width="6.8" height="2.2" fill="#fff" opacity=".85"/>` });
  def('perfum-gran', { nom: 'Perfum gegant (decoratiu)', cat: 'producte', tipus: 'luxe', w: 34, h: 52, c: '#e9b8c8', colors: ['#e9b8c8', '#c9a35b', '#9cc5d6', '#1f2328', '#b23a48'],
    draw: (o) => `<g transform="scale(3.1)">${C.perfum.draw({ c: o.c, u: o.u })}</g>` });
  def('capsa-regal', { nom: 'Capsa de regal', cat: 'producte', tipus: 'regal', w: 22, h: 20, c: '#b23a48', colors: ['#b23a48', '#1f2328', '#c9a35b', '#f3efe8', '#2f6b4f', '#9cc5d6'],
    draw: (o) => `<defs>${lg(o.u + 'r', [[0, A.light(o.c, 0.12)], [1, A.dark(o.c, 0.15)]])}</defs><rect x="-11" y="-16" width="22" height="16" fill="url(#${o.u}r)"/><rect x="-12" y="-19" width="24" height="4" fill="${A.dark(o.c, 0.1)}"/>
      <rect x="-1.6" y="-19" width="3.2" height="19" fill="#d8b45a"/><path d="M0 -19 Q-7 -26 -6 -19 Z M0 -19 Q7 -26 6 -19 Z" fill="#d8b45a"/>` });
  def('crema', { nom: 'Pot de crema', cat: 'producte', tipus: 'luxe', w: 12, h: 9, c: '#f3efe8', colors: ['#f3efe8', '#e9b8c8', '#1f2328', '#c9a35b'],
    draw: (o) => `<rect x="-6" y="-6" width="12" height="6" rx="1.5" fill="${o.c}" stroke="${A.dark(o.c, 0.2)}" stroke-width="0.3"/><rect x="-6.5" y="-9" width="13" height="3.2" rx="1" fill="#c9a35b"/>` });

  /* ===== Productes: llibreria ===== */
  def('llibre', { nom: 'Llibre dret', cat: 'producte', tipus: 'llibres', w: 15, h: 22, c: '#2f6b4f', colors: ['#2f6b4f', '#b23a48', '#1f2328', '#e9c46a', '#5b7f95', '#e76f51'],
    draw: (o) => `<rect x="-7.5" y="-22" width="15" height="22" rx="0.6" fill="${o.c}"/><rect x="-7.5" y="-22" width="2" height="22" fill="${A.dark(o.c, 0.25)}"/>
      <rect x="-4" y="-17" width="9" height="1.6" fill="#fff" opacity=".85"/><rect x="-4" y="-14.5" width="6" height="1" fill="#fff" opacity=".6"/><circle cx="0.5" cy="-7" r="3" fill="${A.light(o.c, 0.4)}"/>` });
  def('pila-llibres', { nom: 'Pila de llibres', cat: 'producte', tipus: 'llibres', w: 22, h: 14, c: '#5b7f95', colors: ['#5b7f95', '#b23a48', '#2f6b4f', '#e9c46a'],
    draw: (o) => [o.c, '#e9c46a', '#b23a48', '#2f6b4f'].map((col, i) => `<rect x="${-11 + (i % 2) * 1.5}" y="${-3.5 * (i + 1)}" width="20" height="3.5" rx="0.6" fill="${col}" stroke="${A.dark(col, 0.25)}" stroke-width="0.3"/><rect x="${-11 + (i % 2) * 1.5}" y="${-3.5 * (i + 1) + 1.2}" width="20" height="0.6" fill="#fff" opacity=".7"/>`).join('') });
  def('llibre-obert', { nom: 'Llibre obert', cat: 'producte', tipus: 'llibres', w: 30, h: 8, c: '#f3efe8', colors: ['#f3efe8'],
    draw: (o) => `<path d="M-15 -2 Q-8 -8 0 -5 Q8 -8 15 -2 L15 0 Q8 -5 0 -2 Q-8 -5 -15 0 Z" fill="#fbf8f2" stroke="#c9bfae" stroke-width="0.4"/><path d="M0 -5 L0 -2" stroke="#c9bfae" stroke-width="0.4"/>` });

  /* ===== Productes: alimentació ===== */
  def('ampolla-vi', { nom: 'Ampolla de vi', cat: 'producte', tipus: 'alimentacio', w: 8, h: 32, c: '#5c1a2b', colors: ['#5c1a2b', '#2f4f2f', '#c9a35b'],
    draw: (o) => `<path d="M-4 0 L-4 -20 Q-4 -24 -1.3 -26 L-1.3 -32 L1.3 -32 L1.3 -26 Q4 -24 4 -20 L4 0 Z" fill="${o.c}"/><rect x="-4" y="-14" width="8" height="7" fill="#f3e7c9"/><rect x="-1.5" y="-32" width="3" height="3" fill="#b23a48"/><rect x="-3" y="-19" width="1" height="15" fill="#fff" opacity=".25"/>` });
  def('bombons', { nom: 'Capsa de bombons', cat: 'producte', tipus: 'alimentacio', w: 28, h: 8, c: '#6b3a24', colors: ['#6b3a24', '#b23a48', '#c9a35b', '#1f2328'],
    draw: (o) => `<rect x="-14" y="-8" width="28" height="8" rx="1" fill="${o.c}"/><rect x="-14" y="-8" width="28" height="2" fill="${A.light(o.c, 0.2)}"/><rect x="-5" y="-6" width="10" height="4" fill="#d8b45a"/>` });
  def('pot-mel', { nom: 'Pot de mel', cat: 'producte', tipus: 'alimentacio', w: 10, h: 13, c: '#e9a23b', colors: ['#e9a23b', '#b23a48', '#6b3a24'],
    draw: (o) => `<rect x="-5" y="-10" width="10" height="10" rx="2" fill="${o.c}" opacity=".9"/><rect x="-5.5" y="-13" width="11" height="3.4" rx="0.8" fill="#8b5e3c"/><rect x="-3.5" y="-7" width="7" height="3.5" fill="#fbf3dc"/>` });
  def('cistell', { nom: 'Cistell de productes', cat: 'producte', tipus: 'alimentacio', w: 40, h: 26, c: '#c49a6c', colors: ['#c49a6c'],
    draw: (o) => `<path d="M-14 -12 Q0 -36 14 -12" stroke="#8b5e3c" stroke-width="2" fill="none"/><rect x="-6" y="-24" width="5" height="12" fill="#5c1a2b"/><circle cx="6" cy="-16" r="5" fill="#e76f51"/>
      <path d="M-20 -12 L20 -12 L16 0 L-16 0 Z" fill="${o.c}"/><path d="M-18 -8 L18 -8 M-17 -4 L17 -4" stroke="${A.dark(o.c, 0.25)}" stroke-width="0.8"/>` });

  /* ===== Productes: flors i plantes ===== */
  def('rosa', { nom: 'Rosa', cat: 'producte', tipus: 'flors', tema: ['santjordi', 'primavera'], w: 8, h: 40, c: '#c1121f', colors: ['#c1121f', '#f4a6b8', '#f3efe8', '#e9c46a'],
    draw: (o) => `<path d="M0 0 Q-1 -20 0 -32" stroke="#2f6b4f" stroke-width="1.2" fill="none"/><path d="M0 -16 Q-6 -20 -5 -24 Q-1 -21 0 -16 Z" fill="#3a7d4f"/>
      <circle cx="0" cy="-35" r="4.3" fill="${o.c}"/><path d="M-3 -36 Q0 -40 3 -36" stroke="${A.dark(o.c, 0.35)}" stroke-width="0.8" fill="none"/><path d="M-2 -34 Q0 -32 2 -34" stroke="${A.light(o.c, 0.3)}" stroke-width="0.7" fill="none"/>` });
  def('ram', { nom: 'Ram de flors', cat: 'producte', tipus: 'flors', tema: ['primavera', 'santjordi'], w: 30, h: 42, c: '#f4a6b8', colors: ['#f4a6b8', '#c1121f', '#e9c46a', '#9cc5d6', '#f3efe8'],
    draw: (o) => `<path d="M-6 0 L6 0 L12 -18 L-12 -18 Z" fill="#e9d6c5"/><path d="M-6 0 L6 0 L12 -18 L-12 -18 Z" fill="none" stroke="#c9b49c" stroke-width="0.4"/>
      ${[[-8, -26], [0, -32], [8, -26], [-4, -38], [5, -38], [-11, -34], [11, -33]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${4.2 - (i % 2) * 0.6}" fill="${i % 3 === 2 ? A.light(o.c, 0.35) : o.c}"/>`).join('')}
      ${[[-12, -22], [12, -21], [0, -24]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.5" ry="1.6" fill="#3a7d4f"/>`).join('')}` });
  def('test-planta', { nom: 'Test amb planta', cat: 'deco', w: 28, h: 40, c: '#c86b4a', colors: ['#c86b4a', '#f3efe8', '#1f2328', '#d8c3a5'],
    draw: (o) => `<path d="M-10 0 L10 0 L12 -16 L-12 -16 Z" fill="${o.c}"/><rect x="-13" y="-18" width="26" height="3" fill="${A.dark(o.c, 0.15)}"/>
      ${[[-9, -30, -30], [0, -38, 0], [9, -30, 30], [-5, -26, -15], [5, -26, 15]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="9" fill="#3a7d4f" transform="rotate(${r} ${x} ${y})"/>`).join('')}` });
  def('planta-alta', { nom: 'Planta alta', cat: 'deco', w: 60, h: 150, c: '#d8c3a5', colors: ['#d8c3a5', '#f3efe8', '#1f2328', '#c86b4a'],
    draw: (o) => `<path d="M-15 0 L15 0 L18 -30 L-18 -30 Z" fill="${o.c}"/><path d="M0 -30 L0 -110" stroke="#5a4632" stroke-width="2"/>
      ${[[-18, -120, -25], [16, -125, 25], [0, -140, 0], [-22, -95, -45], [22, -92, 45], [-10, -75, -30], [12, -70, 30], [0, -100, 0]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="22" fill="${['#2f6b4f', '#3a7d4f', '#46915c'][Math.abs(x) % 3]}" transform="rotate(${r} ${x} ${y})"/>`).join('')}` });

  /* ===== Tecnologia ===== */
  def('auriculars', { nom: 'Auriculars', cat: 'producte', tipus: 'tecnologia', w: 20, h: 20, c: '#1f2328', colors: ['#1f2328', '#f3efe8', '#5b7f95', '#e76f51'],
    draw: (o) => `<path d="M-8 -6 Q-8 -20 0 -20 Q8 -20 8 -6" stroke="${o.c}" stroke-width="2" fill="none"/><rect x="-10" y="-9" width="5" height="9" rx="2" fill="${o.c}"/><rect x="5" y="-9" width="5" height="9" rx="2" fill="${o.c}"/>` });
  def('mobil', { nom: 'Telèfon mòbil', cat: 'producte', tipus: 'tecnologia', w: 8, h: 16, c: '#1f2328', colors: ['#1f2328', '#c0c4c8', '#e9b8c8'],
    draw: (o) => `<rect x="-4" y="-16" width="8" height="16" rx="1.4" fill="${o.c}"/><rect x="-3.3" y="-15" width="6.6" height="13.5" rx="0.8" fill="#4ea5f5"/><rect x="-3.3" y="-15" width="6.6" height="5" fill="#fff" opacity=".2"/>` });

  /* ===== Decoració temàtica ===== */
  def('estrella', { nom: 'Estrella penjant', cat: 'deco', tema: ['nadal'], w: 22, h: 40, c: '#d8b45a', colors: ['#d8b45a', '#f3efe8', '#c1121f'], penjat: true,
    draw: (o) => `<path d="M0 -40 L0 -22" stroke="#bbb" stroke-width="0.4"/><path d="M0 -22 L2.9 -13 L12 -13 L4.6 -7.5 L7.4 1.5 L0 -4 L-7.4 1.5 L-4.6 -7.5 L-12 -13 L-2.9 -13 Z" fill="${o.c}" stroke="${A.dark(o.c, 0.2)}" stroke-width="0.4"/>` });
  def('bola-nadal', { nom: 'Bola de Nadal penjant', cat: 'deco', tema: ['nadal'], w: 12, h: 34, c: '#c1121f', colors: ['#c1121f', '#d8b45a', '#2f6b4f', '#f3efe8', '#1f2328'], penjat: true,
    draw: (o) => `<defs>${rg(o.u + 'b', [[0, A.light(o.c, 0.5)], [0.6, o.c], [1, A.dark(o.c, 0.35)]], 0.35, 0.35, 0.7)}</defs><path d="M0 -34 L0 -13" stroke="#bbb" stroke-width="0.4"/><rect x="-1.5" y="-14" width="3" height="2" fill="#c9a35b"/><circle cx="0" cy="-6" r="6" fill="url(#${o.u}b)"/>` });
  def('avet', { nom: 'Avet petit', cat: 'deco', tema: ['nadal'], w: 50, h: 90, c: '#2f6b4f', colors: ['#2f6b4f', '#f3efe8', '#d8b45a'],
    draw: (o) => `<rect x="-4" y="-12" width="8" height="12" fill="#6b4226"/>${[[0, -90, 14, -60], [0, -70, 20, -38], [0, -50, 25, -12]].map(([x, t, w, b]) => `<path d="M${x} ${t} L${w} ${b} L${-w} ${b} Z" fill="${o.c}"/>`).join('')}
      ${[[-8, -40, '#c1121f'], [9, -30, '#d8b45a'], [-4, -58, '#d8b45a'], [6, -52, '#c1121f'], [-14, -20, '#d8b45a'], [13, -18, '#c1121f']].map(([x, y, col]) => `<circle cx="${x}" cy="${y}" r="2" fill="${col}"/>`).join('')}<path d="M0 -96 L1.5 -91 L-1.5 -91 Z" fill="#d8b45a"/>` });
  def('llums', { nom: 'Garlanda de llums', cat: 'deco', tema: ['nadal', 'festa'], w: 120, h: 18, c: '#ffd166', colors: ['#ffd166', '#f3efe8'], penjat: true, brilla: true,
    draw: (o) => `<path d="M-60 -18 Q-30 -2 0 -10 Q30 -2 60 -18" stroke="#555" stroke-width="0.5" fill="none"/>${Array.from({ length: 11 }, (_, i) => { const x = -55 + i * 11, y = -18 + Math.sin((i / 10) * Math.PI * 2) * 3 + 10; return `<circle cx="${x}" cy="${y - 6}" r="2.4" fill="${o.c}"/><circle cx="${x}" cy="${y - 6}" r="5" fill="${o.c}" opacity=".25"/>`; }).join('')}` });
  def('fulles-tardor', { nom: 'Fulles de tardor', cat: 'deco', tema: ['tardor'], w: 60, h: 10, c: '#e07a3a', colors: ['#e07a3a', '#c1121f', '#e9c46a'],
    draw: (o) => [[-24, -3, 20], [-10, -5, -30], [4, -2, 50], [18, -6, -10], [27, -3, 30], [-18, -7, 70]].map(([x, y, r], i) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="2.6" fill="${[o.c, '#e9c46a', '#c1121f'][i % 3]}" transform="rotate(${r} ${x} ${y})"/>`).join('') });
  def('castanyes', { nom: 'Cucurulla de castanyes', cat: 'deco', tema: ['tardor'], w: 16, h: 24, c: '#e9d6c5', colors: ['#e9d6c5'],
    draw: (o) => `<path d="M-7 -18 L7 -18 L0 0 Z" fill="${o.c}" stroke="#c9b49c" stroke-width="0.4"/>${[[-4, -20], [1, -22], [5, -19], [-1, -18]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="2.4" fill="#6b3a24"/>`).join('')}` });
  def('globus', { nom: 'Globus', cat: 'deco', tema: ['festa', 'rebaixes'], w: 16, h: 60, c: '#e76f51', colors: ['#e76f51', '#e9c46a', '#2a9d8f', '#f4a6b8', '#c1121f'], penjat: true,
    draw: (o) => `<path d="M0 -38 Q3 -20 -1 0" stroke="#999" stroke-width="0.4" fill="none"/><ellipse cx="0" cy="-48" rx="8" ry="10" fill="${o.c}"/><ellipse cx="-2.6" cy="-51" rx="2" ry="3" fill="#fff" opacity=".45"/>` });
  def('mirall', { nom: 'Mirall rodó', cat: 'deco', w: 60, h: 60, c: '#c9a35b', colors: ['#c9a35b', '#1f2328', '#f3efe8'], penjat: true,
    draw: (o) => `<defs>${lg(o.u + 'm', [[0, '#e9eef2'], [0.5, '#c5d0d8'], [1, '#eef3f6']])}</defs><circle cx="0" cy="-30" r="30" fill="${o.c}"/><circle cx="0" cy="-30" r="26" fill="url(#${o.u}m)"/><path d="M-14 -44 L4 -52" stroke="#fff" stroke-width="2" opacity=".7"/>` });
  def('arc-flors', { nom: 'Arc de flors', cat: 'deco', tema: ['primavera', 'santjordi'], w: 160, h: 120, c: '#f4a6b8', colors: ['#f4a6b8', '#c1121f', '#f3efe8', '#e9c46a'],
    draw: (o) => `<path d="M-75 0 L-75 -60 Q-75 -118 0 -118 Q75 -118 75 -60 L75 0" stroke="#3a7d4f" stroke-width="3" fill="none"/>${Array.from({ length: 22 }, (_, i) => { const t = i / 21, a = Math.PI * t; const x = -75 * Math.cos(a), y = t < 0.5 ? -60 - 58 * Math.sin(a) : -60 - 58 * Math.sin(a); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${5 - (i % 2)}" fill="${i % 3 === 0 ? A.light(o.c, 0.4) : o.c}"/>`; }).join('')}${[[-75, -30], [75, -30], [-75, -10], [75, -12]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${o.c}"/>`).join('')}` });
  def('drap-sant-jordi', { nom: 'Bandera de Sant Jordi', cat: 'deco', tema: ['santjordi'], w: 30, h: 50, c: '#f3efe8', colors: ['#f3efe8'],
    draw: (o) => `<rect x="-15" y="-50" width="1.5" height="50" fill="#8b5e3c"/><rect x="-13.5" y="-48" width="28" height="20" fill="#fff" stroke="#ddd" stroke-width="0.3"/><rect x="-1" y="-48" width="3" height="20" fill="#c1121f"/><rect x="-13.5" y="-39.5" width="28" height="3" fill="#c1121f"/>` });

  /* ===== Cartells i preus ===== */
  def('cartell', { nom: 'Cartell amb missatge', cat: 'cartell', w: 70, h: 32, c: '#1f2328', colors: ['#1f2328', '#f3efe8', '#b23a48', '#c9a35b', '#2f6b4f', '#e76f51'], text: true, t: 'Nova col·lecció',
    draw: (o) => { const fg = A.hsl(o.c)[2] > 0.6 ? '#1f2328' : '#fbf8f2'; return `<rect x="-35" y="-32" width="70" height="32" rx="2" fill="${o.c}"/><rect x="-33" y="-30" width="66" height="28" rx="1.5" fill="none" stroke="${fg}" stroke-width="0.4" opacity=".6"/>
      <text x="0" y="-12" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${Math.max(5, Math.min(9, 105 / Math.max(6, String(o.t || '').length)))}" fill="${fg}">${esc(o.t)}</text>`; } });
  def('cartell-penjat', { nom: 'Cartell penjat', cat: 'cartell', w: 80, h: 50, c: '#f3efe8', colors: ['#f3efe8', '#1f2328', '#b23a48', '#c9a35b', '#2f6b4f'], text: true, penjat: true, t: 'Bon Nadal',
    draw: (o) => { const fg = A.hsl(o.c)[2] > 0.6 ? '#1f2328' : '#fbf8f2'; return `<path d="M-30 -50 L-30 -30 M30 -50 L30 -30" stroke="#999" stroke-width="0.4"/><rect x="-40" y="-30" width="80" height="30" rx="2" fill="${o.c}"/>
      <text x="0" y="-11" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${Math.max(5, Math.min(10, 120 / Math.max(6, String(o.t || '').length)))}" fill="${fg}">${esc(o.t)}</text>`; } });
  def('rebaixes', { nom: 'Rètol de rebaixes', cat: 'cartell', tema: ['rebaixes'], w: 60, h: 40, c: '#c1121f', colors: ['#c1121f', '#1f2328', '#e9c46a'], text: true, t: '-30 %',
    draw: (o) => `<rect x="-30" y="-40" width="60" height="40" rx="3" fill="${o.c}"/><text x="0" y="-25" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="7" fill="#fff">REBAIXES</text>
      <text x="0" y="-8" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="14" fill="#fff">${esc(o.t)}</text>` });
  def('preu', { nom: 'Etiqueta de preu', cat: 'cartell', preu: true, w: 14, h: 8, c: '#fbf8f2', colors: ['#fbf8f2', '#1f2328', '#c9a35b'], text: true, t: '49 €',
    draw: (o) => { const fg = A.hsl(o.c)[2] > 0.6 ? '#1f2328' : '#fbf8f2'; return `<rect x="-7" y="-8" width="14" height="8" rx="1" fill="${o.c}" stroke="${A.dark(o.c, 0.25)}" stroke-width="0.3"/><text x="0" y="-2.6" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="600" font-size="3.6" fill="${fg}">${esc(o.t)}</text>`; } });
  def('preu-gran', { nom: 'Preu gran', cat: 'cartell', preu: true, gran: true, w: 34, h: 18, c: '#e9c46a', colors: ['#e9c46a', '#c1121f', '#fbf8f2', '#1f2328'], text: true, t: '29,90 €',
    draw: (o) => { const fg = A.hsl(o.c)[2] > 0.6 ? '#1f2328' : '#fbf8f2'; return `<path d="M-17 -18 L13 -18 L17 -9 L13 0 L-17 0 Z" fill="${o.c}"/><circle cx="-12" cy="-9" r="1.6" fill="#fff"/><text x="2" y="-5.5" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="8" fill="${fg}">${esc(o.t)}</text>`; } });

  /* ---------- Fons i terres ---------- */
  A.fons = {
    llis: { nom: 'Paret llisa', draw: (u, c, W, H) => `<rect width="${W}" height="${H}" fill="${c}"/>` },
    mao: { nom: 'Maó vist', draw: (u, c, W, H) => `<defs><pattern id="${u}mao" width="24" height="10" patternUnits="userSpaceOnUse"><rect width="24" height="10" fill="${c}"/><path d="M0 0 H24 M0 5 H24 M12 0 V5 M0 5 V10 M24 5 V10" stroke="${A.dark(c, 0.25)}" stroke-width="0.6"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#${u}mao)"/>` },
    marbre: { nom: 'Marbre', draw: (u, c, W, H) => `<rect width="${W}" height="${H}" fill="${c}"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 40 - 30} ${H} Q${i * 40 + 10} ${H * 0.6} ${i * 40 - 10} ${H * 0.35} T${i * 40 + 20} 0" stroke="${A.dark(c, 0.14)}" stroke-width="0.7" fill="none" opacity=".6"/>`).join('')}` },
    cortina: { nom: 'Cortina de vellut', draw: (u, c, W, H) => `<defs>${lg(u + 'ct', [[0, A.dark(c, 0.35)], [0.5, A.light(c, 0.15)], [1, A.dark(c, 0.35)]], false)}<pattern id="${u}cp" width="22" height="${H}" patternUnits="userSpaceOnUse"><rect width="22" height="${H}" fill="url(#${u}ct)"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#${u}cp)"/>` },
    ratlles: { nom: 'Paper a ratlles', draw: (u, c, W, H) => `<defs><pattern id="${u}rt" width="20" height="10" patternUnits="userSpaceOnUse"><rect width="20" height="10" fill="${c}"/><rect width="10" height="10" fill="${A.light(c, 0.35)}"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#${u}rt)"/>` },
    arc: { nom: 'Arc de pedra', draw: (u, c, W, H) => `<rect width="${W}" height="${H}" fill="${A.dark(c, 0.08)}"/><path d="M${W * 0.18} ${H} L${W * 0.18} ${H * 0.45} Q${W / 2} ${H * 0.02} ${W * 0.82} ${H * 0.45} L${W * 0.82} ${H} Z" fill="${c}"/><path d="M${W * 0.18} ${H} L${W * 0.18} ${H * 0.45} Q${W / 2} ${H * 0.02} ${W * 0.82} ${H * 0.45} L${W * 0.82} ${H}" stroke="${A.dark(c, 0.25)}" stroke-width="2" fill="none"/>` }
  };
  A.colorsFons = ['#f3efe8', '#ffffff', '#1f2328', '#2b2d42', '#b23a48', '#7a1f2b', '#2f6b4f', '#a3c4bc', '#e9d6c5', '#f4d7dd', '#d8e2ef', '#e9c46a', '#e07a3a', '#c9a35b'];
  A.terres = {
    fusta: { nom: 'Fusta clara', c: '#d9b48a', draw: (u, W, Hf) => `<defs>${lg(u + 'ft', [[0, '#c9a072'], [1, '#e2c39b']])}</defs><rect width="${W}" height="${Hf}" fill="url(#${u}ft)"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 26} ${Hf} L${W / 2 + (i * 26 - W / 2) * 0.75} 0" stroke="#a98058" stroke-width="0.5" opacity=".6"/>`).join('')}` },
    fosca: { nom: 'Fusta fosca', c: '#5a3d2b', draw: (u, W, Hf) => `<defs>${lg(u + 'fd', [[0, '#3f2a1d'], [1, '#6a4a34']])}</defs><rect width="${W}" height="${Hf}" fill="url(#${u}fd)"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 26} ${Hf} L${W / 2 + (i * 26 - W / 2) * 0.75} 0" stroke="#2c1d13" stroke-width="0.5" opacity=".7"/>`).join('')}` },
    marbre: { nom: 'Marbre blanc', c: '#eeeae3', draw: (u, W, Hf) => `<defs>${lg(u + 'mb', [[0, '#dcd7cf'], [1, '#f6f3ee']])}</defs><rect width="${W}" height="${Hf}" fill="url(#${u}mb)"/><path d="M0 ${Hf * 0.6} Q${W * 0.3} ${Hf * 0.2} ${W * 0.6} ${Hf * 0.7} T${W} ${Hf * 0.3}" stroke="#c8c2b8" stroke-width="0.6" fill="none"/>` },
    moqueta: { nom: 'Moqueta vermella', c: '#8e1b2b', draw: (u, W, Hf) => `<defs>${lg(u + 'mq', [[0, '#6e1420'], [1, '#a32336']])}</defs><rect width="${W}" height="${Hf}" fill="url(#${u}mq)"/>` },
    gespa: { nom: 'Gespa', c: '#6aa84f', draw: (u, W, Hf) => `<defs>${lg(u + 'gs', [[0, '#4f8a3b'], [1, '#7cba5c']])}</defs><rect width="${W}" height="${Hf}" fill="url(#${u}gs)"/>${Array.from({ length: 60 }, (_, i) => `<path d="M${(i * 37) % W} ${Hf * (0.3 + (i % 7) / 10)} l1 -2" stroke="#3d7a2c" stroke-width="0.5"/>`).join('')}` },
    negre: { nom: 'Negre brillant', c: '#1a1b1f', draw: (u, W, Hf) => `<defs>${lg(u + 'ng', [[0, '#0d0e10'], [1, '#2a2c31']])}</defs><rect width="${W}" height="${Hf}" fill="url(#${u}ng)"/>` }
  };
  A.esc = esc;
  if (typeof module !== 'undefined') module.exports = A; else root.VA = A;
})(this);
