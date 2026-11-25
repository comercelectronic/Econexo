/* Vianants del barri amb comportament natural i «pols del carrer».
   Cada zona real (Barcelona3D.ZONES) té les seves voreres i la seva densitat de gent.
   Els vianants s'aturen davant dels aparadors segons l'atractiu de cada botiga (appeal), hi entren,
   i tot queda comptat: vianants que passen, aturades, entrades i tiquets. Les pantalles de Prisma
   atrauen mirades però gairebé ningú entra. */
window.Vianants = (() => {
  const W = 2190, ROWS = 6;
  const Z = () => window.Barcelona3D ? Barcelona3D.ZONES : Array.from({length: 6}, () => ({road: true, lanes: [[-40, -33], [38, 62]], people: 4}));
  const road = r => window.Barcelona3D ? Barcelona3D.roadZ(r) : 26 + r * 335 + 262;
  const rowY = r => window.Barcelona3D ? Barcelona3D.ROWY[r] : 26 + r * 335;
  const CROSS = Array.from({length: 6}, (_, k) => 320 + k * 360);
  const SHOPS = Array.from({length: 6}, (_, k) => 158 + k * 360);
  const MODELS = ['avia', 'avi', 'turista', 'oficinista', 'estudiant', 'veina', 'noia', 'senyor'];
  let seed = 20261125;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const stats = Array.from({length: 36}, () => ({pas: 0, par: 0, ent: 0, tic: 0}));
  let appeal = () => .25, prisma = () => false, rush = null;   // rush: {shop, until} setmana accelerada

  const agents = []; let uid = 0;
  for (let row = 0; row < ROWS; row++) {
    const zone = Z()[row];
    for (let j = 0; j < zone.people; j++) {
      const side = rnd() < .5 ? 0 : 1, [a, b] = zone.lanes[side], model = MODELS[(uid * 3 + row) % MODELS.length];
      agents.push({uid: uid++, row, j, side, lane: a + rnd() * (b - a), x: 60 + rnd() * (W - 120), y: road(row) + a,
        dir: rnd() < .5 ? -1 : 1, speed: (model === 'avia' || model === 'avi' ? 16 : 24) + rnd() * 12, model, tint: rnd() < .5 ? 0 : 1 + (row * 7 + j) % 6,
        state: 'walk', until: 0, yaw: 0, moving: true, lastShop: -1, lastCross: -1, away: rnd() < .3, shop: -1});
    }
  }
  agents.forEach(a => a.y = road(a.row) + a.lane);
  let last = 0;
  const set = (a, s, now, secs) => { a.state = s; a.until = now + secs * 1000 };
  const shopOf = (a, k) => a.row * 6 + k;

  function update(now, contact) {
    const speedUp = rush && now < rush.until ? 3 : 1; if (rush && now >= rush.until) rush = null;
    const dt = Math.min(.1, last ? (now - last) / 1000 : 0) * speedUp; last = now;
    for (const a of agents) {
      const zone = Z()[a.row], ry = road(a.row);
      if (a.away && !a.until) a.until = now + rnd() * 15000;
      if (a.away) { if (now > a.until || (rush && rush.shop / 6 | 0) === a.row) { a.away = false; a.x = a.dir > 0 ? 20 : W - 20; a.state = 'walk' } else continue }
      if (contact && contact.uid === a.uid) { a.moving = false; continue }
      if (a.state === 'walk') {
        a.moving = true; a.x += a.dir * a.speed * dt;
        a.y += ((ry + a.lane) - a.y) * Math.min(1, dt * 2);
        a.yaw = a.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
        const k = SHOPS.findIndex(x => Math.abs(x - a.x) < 4);
        if (k >= 0 && k !== a.lastShop) {
          a.lastShop = k; const i = shopOf(a, k); stats[i].pas++;
          let p = a.side === 0 ? .1 + appeal(i) * .7 : .03 + appeal(i) * .15;
          if (prisma(i)) p = a.side === 0 ? .45 : .1;                    // la pantalla crida l'atenció…
          if (rush && rush.shop === i) p = .9;
          if (rnd() < p) { a.shop = i; stats[i].par++; a.x = SHOPS[k] + (rnd() - .5) * 60; set(a, 'look', now, 2 + rnd() * 5); continue }
        }
        const c = CROSS.findIndex(x => Math.abs(x - a.x) < 4);
        if (zone.road && c >= 0 && c !== a.lastCross) { a.lastCross = c; if (rnd() < .3) { a.x = CROSS[c]; set(a, 'wait', now, 1 + rnd() * 3); continue } }
        if (!zone.road && rnd() < dt * .02) { set(a, 'wait', now, .2); continue }
        if (rnd() < dt * .03) set(a, 'phone', now, 2 + rnd() * 4);
        else if (rnd() < dt * .015) a.dir *= -1;
        if (a.x < 10 || a.x > W - 10) { a.away = true; a.until = now + (4 + rnd() * 14) * 1000; a.dir *= -1; a.lastShop = a.lastCross = -1 }
      } else if (a.state === 'look' || a.state === 'phone' || a.state === 'wait') {
        a.moving = false;
        a.yaw = a.state === 'look' ? Math.PI : a.state === 'wait' ? (a.side === 0 ? 0 : Math.PI) : a.yaw;
        if (now > a.until) {
          if (a.state === 'wait') { const to = 1 - a.side, [p, q] = zone.lanes[to]; a.side = to; a.lane = p + rnd() * (q - p); a.state = 'cross' }
          else if (a.state === 'look' && a.shop >= 0) {
            const i = a.shop, pe = prisma(i) ? .04 : rush && rush.shop === i ? .8 : .15 + appeal(i) * .6;
            if (rnd() < pe) { stats[i].ent++; a.state = 'enter' } else { a.state = 'walk'; a.shop = -1 }
          } else a.state = 'walk';
        }
      } else if (a.state === 'enter') {                                    // camina fins a la porta i entra
        a.moving = true; const i = a.shop, dx = (36 + (i % 6) * 360 + 186) - a.x, dy = (rowY(i / 6 | 0) + 205) - a.y, d = Math.hypot(dx, dy);
        a.yaw = Math.atan2(dx, dy);
        if (d < 3) { a.state = 'inside'; a.until = now + (5 + rnd() * 10) * 1000; if (rnd() < .3 + appeal(i) * .5 || (rush && rush.shop === i)) stats[i].tic++ }
        else { const v = Math.min(d, a.speed * dt); a.x += dx / d * v; a.y += dy / d * v }
      } else if (a.state === 'inside') {
        a.moving = false; if (now > a.until) { a.state = 'cross'; a.side = 0; a.lane = zone.lanes[0][0]; a.shop = -1 }
      } else if (a.state === 'cross') {
        a.moving = true; const ty = ry + a.lane, d = ty - a.y;
        a.yaw = d > 0 ? 0 : Math.PI;
        if (Math.abs(d) < 1.5) { a.state = 'walk'; if (rnd() < .4) a.dir *= -1 } else a.y += Math.sign(d) * Math.min(Math.abs(d), a.speed * 1.1 * dt);
      }
    }
    return agents.filter(a => !a.away && a.state !== 'inside');
  }
  return {agents, update, MODELS, stats,
    setAppeal: f => appeal = f, setPrisma: f => prisma = f, isPrisma: i => prisma(i), appealOf: i => appeal(i),
    rush: (shop, ms) => { rush = {shop, until: performance.now() + ms} }};
})();
