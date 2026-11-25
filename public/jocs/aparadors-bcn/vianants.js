/* Vianants del barri: poca gent i amb comportament natural.
   Caminen per les voreres (mai per la calçada), cadascú al seu ritme; s'aturen a mirar aparadors,
   consulten el mòbil, esperen al pas de vianants i creuen, o fan mitja volta.
   index.html llegeix Vianants.agents (per al plànol 2D) i Vianants.update(now, contact) cada fotograma. */
window.Vianants = (() => {
  const W = 2190, ROWS = 6, PER_ROW = 4;
  const road = r => 26 + r * 335 + 262;                         // centre de la calçada de cada fila
  const LANE = {north: [-40, -33], south: [38, 62]};             // voreres (desplaçament respecte a la calçada)
  const CROSS = Array.from({length: 6}, (_, k) => 320 + k * 360);// passos de vianants
  const SHOPS = Array.from({length: 6}, (_, k) => 36 + k * 360 + 122);
  const MODELS = ['avia', 'avi', 'turista', 'oficinista', 'estudiant', 'veina', 'noia', 'senyor'];
  let seed = 20261125;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const pick = a => a[Math.floor(rnd() * a.length)];

  const agents = [];
  for (let row = 0; row < ROWS; row++) for (let j = 0; j < PER_ROW; j++) {
    const side = rnd() < .5 ? 'north' : 'south', [a, b] = LANE[side];
    const model = MODELS[(row * PER_ROW + j * 3) % MODELS.length];
    agents.push({uid: row * PER_ROW + j, row, j, side, lane: a + rnd() * (b - a), x: 60 + rnd() * (W - 120), y: 0,
      dir: rnd() < .5 ? -1 : 1, speed: (model === 'avia' || model === 'avi' ? 16 : 24) + rnd() * 12, model, tint: rnd() < .5 ? 0 : 1 + (row * 7 + j) % 6,
      state: 'walk', until: 0, yaw: 0, moving: true, lastShop: -1, lastCross: -1, cross: null, away: rnd() < .35});
  }
  agents.forEach(a => a.y = road(a.row) + a.lane);
  let last = 0;

  function setState(a, s, now, secs) { a.state = s; a.until = now + secs * 1000 }

  function update(now, contact) {
    const dt = Math.min(.1, last ? (now - last) / 1000 : 0); last = now;
    for (const a of agents) {
      // Alguns vianants «no hi són» una estona: així la gent no passa constantment.
      if (a.away && !a.until) a.until = now + rnd() * 15000;
      if (a.away) { if (now > a.until) { a.away = false; a.x = a.dir > 0 ? 20 : W - 20 } else continue }
      if (contact && contact.uid === a.uid) { a.moving = false; continue }   // parla amb la Lia
      const ry = road(a.row);
      if (a.state === 'walk') {
        a.moving = true; a.x += a.dir * a.speed * dt;
        a.y += ((ry + a.lane) - a.y) * Math.min(1, dt * 2);
        a.yaw = a.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
        // Mirar aparadors (només a la vorera dels comerços)
        const shop = SHOPS.findIndex(x => Math.abs(x - a.x) < 4);
        if (a.side === 'north' && shop >= 0 && shop !== a.lastShop) { a.lastShop = shop; if (rnd() < .35) { setState(a, 'look', now, 3 + rnd() * 6); continue } }
        // Arribar a un pas de vianants: de vegades esperar i creuar
        const cross = CROSS.findIndex(x => Math.abs(x - a.x) < 4);
        if (cross >= 0 && cross !== a.lastCross) { a.lastCross = cross; if (rnd() < .3) { a.x = CROSS[cross]; setState(a, 'wait', now, 1 + rnd() * 3); continue } }
        // Mirar el mòbil o fer mitja volta, de tant en tant
        if (rnd() < dt * .03) setState(a, 'phone', now, 2 + rnd() * 4);
        else if (rnd() < dt * .015) a.dir *= -1;
        // Sortir pels extrems i tornar més tard
        if (a.x < 10 || a.x > W - 10) { a.away = true; a.until = now + (4 + rnd() * 14) * 1000; a.dir *= -1; a.lastShop = a.lastCross = -1 }
      } else if (a.state === 'look' || a.state === 'phone' || a.state === 'wait') {
        a.moving = false;
        a.yaw = a.state === 'look' ? Math.PI : a.state === 'wait' ? (a.side === 'north' ? 0 : Math.PI) : a.yaw;
        if (now > a.until) {
          if (a.state === 'wait') { const to = a.side === 'north' ? 'south' : 'north', [p, q] = LANE[to]; a.side = to; a.lane = p + rnd() * (q - p); a.state = 'cross' }
          else a.state = 'walk';
        }
      } else if (a.state === 'cross') {
        a.moving = true; const ty = ry + a.lane, d = ty - a.y;
        a.yaw = d > 0 ? 0 : Math.PI;
        if (Math.abs(d) < 1.5) { a.state = 'walk'; if (rnd() < .4) a.dir *= -1 } else a.y += Math.sign(d) * Math.min(Math.abs(d), a.speed * 1.1 * dt);
      }
    }
    return agents.filter(a => !a.away);
  }
  return {agents, update, MODELS};
})();
