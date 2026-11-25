/* Sons, música i efectes d'Aparadors BCN, tot generat amb Web Audio (sense fitxers).
   Sons.play('tic'|'pop'|'ding'|'coin'|'error'|'win'|'fanfare'|'alarm'|'whoosh')
   Sons.music(on) · Sons.confetti() · botó 🔊 a la capçalera (es recorda a localStorage). */
window.Sons = (() => {
  let ctx = null, master = null, musicGain = null, musicTimer = null, musicOn = false, muted = false;
  try { muted = localStorage.getItem('aparadors-so') === '0'; musicOn = localStorage.getItem('aparadors-musica') !== '0' } catch {}
  function ac() {
    if (!ctx) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; ctx = new A(); master = ctx.createGain(); master.gain.value = muted ? 0 : .7; master.connect(ctx.destination) }
    if (ctx.state === 'suspended') ctx.resume(); return ctx;
  }
  function tone(f, t0, dur, type = 'sine', vol = .25, slide = 0, dest) {
    const c = ac(); if (!c) return; const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, c.currentTime + t0); if (slide) o.frequency.exponentialRampToValueAtTime(f * slide, c.currentTime + t0 + dur);
    g.gain.setValueAtTime(0, c.currentTime + t0); g.gain.linearRampToValueAtTime(vol, c.currentTime + t0 + .01); g.gain.exponentialRampToValueAtTime(.0008, c.currentTime + t0 + dur);
    o.connect(g); g.connect(dest || master); o.start(c.currentTime + t0); o.stop(c.currentTime + t0 + dur + .05);
  }
  function noise(t0, dur, vol = .15, freq = 1200) {
    const c = ac(); if (!c) return; const b = c.createBuffer(1, c.sampleRate * dur, c.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = b; f.type = 'bandpass'; f.frequency.value = freq; g.gain.value = vol;
    s.connect(f); f.connect(g); g.connect(master); s.start(c.currentTime + t0);
  }
  const SFX = {
    tic: () => tone(1400, 0, .04, 'square', .05),
    pop: () => { tone(520, 0, .09, 'sine', .25, 1.8); noise(0, .05, .06, 3000) },
    drop: () => { tone(180, 0, .12, 'sine', .3, .6); noise(0, .08, .08, 600) },
    ding: () => { tone(1318, 0, .5, 'sine', .18); tone(1976, .06, .45, 'sine', .12) },
    coin: () => { tone(988, 0, .08, 'square', .1); tone(1319, .08, .3, 'square', .1) },
    error: () => { tone(220, 0, .18, 'triangle', .22, .7); tone(165, .12, .25, 'triangle', .2, .8) },
    win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * .09, .35, 'triangle', .2)),
    fanfare: () => { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i * .12, i === 5 ? .9 : .3, 'sawtooth', .09)); [262, 330, 392].forEach(f => tone(f, .6, 1.1, 'triangle', .12)) },
    alarm: () => [0, .25, .5].forEach(t => tone(740, t, .18, 'square', .1, .7)),
    whoosh: () => noise(0, .35, .12, 900),
    star: () => tone(1760, 0, .3, 'sine', .14, 1.5)
  };
  function play(n) { if (muted) return; try { SFX[n]?.() } catch {} }

  /* Música: arpegi de guitarra (corda polsada) sobre la cadència andalusa La m – Sol – Fa – Mi. */
  function pluck(f, t, vol = .06) {
    const c = ac(); if (!c) return;
    const o = c.createOscillator(), o2 = c.createOscillator(), g = c.createGain(), lp = c.createBiquadFilter();
    o.type = 'triangle'; o2.type = 'sawtooth'; o.frequency.value = f; o2.frequency.value = f * 1.003; lp.type = 'lowpass';
    lp.frequency.setValueAtTime(3200, t); lp.frequency.exponentialRampToValueAtTime(500, t + .6);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .006); g.gain.exponentialRampToValueAtTime(.0005, t + 1.4);
    const g2 = c.createGain(); g2.gain.value = .25; o2.connect(g2); g2.connect(lp); o.connect(lp); lp.connect(g); g.connect(musicGain);
    o.start(t); o2.start(t); o.stop(t + 1.5); o2.stop(t + 1.5);
  }
  const CHORDS = [[220, 261.6, 329.6, 440], [196, 246.9, 293.7, 392], [174.6, 220, 261.6, 349.2], [164.8, 207.7, 246.9, 329.6]];
  const PATTERN = [0, 2, 1, 3, 2, 1, 3, 2];
  function music(on) {
    musicOn = on; try { localStorage.setItem('aparadors-musica', on ? '1' : '0') } catch {}
    const c = ac(); if (!c) return;
    if (!musicGain) { musicGain = c.createGain(); musicGain.gain.value = .55; musicGain.connect(master) }
    clearInterval(musicTimer); if (!on || muted) return;
    let bar = 0, next = c.currentTime + .1; const beat = .32;
    const sched = () => { while (next < c.currentTime + .8) { const ch = CHORDS[Math.floor(bar / 8) % 4], k = bar % 8;
      pluck(ch[PATTERN[k]] * (k === 0 ? .5 : 1), next, k === 0 ? .08 : .05); if (k === 0) pluck(ch[0] * .5, next + .002, .05); next += beat; bar++ } };
    sched(); musicTimer = setInterval(sched, 250);
  }

  /* Confeti a pantalla completa. */
  function confetti(n = 140) {
    const cv = document.createElement('canvas'); cv.className = 'confeti'; cv.width = innerWidth; cv.height = innerHeight; document.body.append(cv);
    const g = cv.getContext('2d'), cols = ['#e5483a', '#f8b62d', '#1f9d6b', '#1f7ae0', '#c2378a', '#ffffff'];
    const P = Array.from({length: n}, () => ({x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, r: Math.random() * 6, c: cols[Math.random() * 6 | 0], w: 6 + Math.random() * 6}));
    let t = 0; const step = () => { g.clearRect(0, 0, cv.width, cv.height); t++;
      P.forEach(p => { p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += .2; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.w / 2, -3, p.w, 6); g.restore() });
      if (t < 170) requestAnimationFrame(step); else cv.remove() }; step();
  }

  // Botó de so a la capçalera i sons de clic a tota la interfície.
  function button() {
    const tools = document.querySelector('.tools'); if (!tools || document.getElementById('soBtn')) return;
    const b = document.createElement('button'); b.id = 'soBtn'; b.title = 'So i música'; const paint = () => b.textContent = muted ? '🔇' : musicOn ? '🎵' : '🔊';
    b.onclick = () => { if (muted) { muted = false; musicOn = true } else if (musicOn) { musicOn = false } else { muted = true }
      try { localStorage.setItem('aparadors-so', muted ? '0' : '1') } catch {} if (master) master.gain.value = muted ? 0 : .7; music(musicOn && !muted); paint() };
    paint(); tools.append(b);
  }
  let started = false;
  document.addEventListener('pointerdown', e => {
    if (!started) { started = true; ac(); if (musicOn && !muted) music(true) }
    if (e.target.closest && e.target.closest('button') && !e.target.closest('#soBtn')) play('tic');
  }, true);
  // Error sonor quan apareix una resposta incorrecta als tallers.
  new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) if (n.nodeType === 1 && (n.matches?.('.reply.bad') || n.querySelector?.('.reply.bad'))) { play('error'); return } })
    .observe(document.documentElement, {childList: true, subtree: true});
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', button); else setTimeout(button, 50);
  return {play, music, confetti};
})();
