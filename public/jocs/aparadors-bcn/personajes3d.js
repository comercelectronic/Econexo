/* Personajes GLB generados con Blender (scripts/aparadors/personajes/genera_personajes.py).
   Misma interfaz que DistrictArt.cast: {g, pose(x, z, ángulo, fase, moviéndose)}; mientras el GLB carga
   se muestra el personaje poligonal de respaldo. */
window.Personajes3D = (() => {
  const T = THREE, BASE = './personajes/', SCALE = 27;       // 1 m ≈ 27 unidades del barrio
  const MODELS = ['lia', 'joan', 'ada', 'laia', 'jan', 'nuria', 'nil'];
  const cache = {}, waiting = {};
  const loader = T.GLTFLoader ? new T.GLTFLoader() : null;
  const palette = {prenda: ['#8a3b52', '#2f6f73', '#b5832a', '#4b5f8f', '#6e7d43', '#a2503a', '#5d4a7a', '#c9b48f'],
                   pantalon: ['#2d3340', '#4b4540', '#3a5f8f', '#59513f', '#23262b', '#6b6f78'],
                   pelo: ['#2a1d17', '#5a3424', '#1d1a1c', '#8a3b22', '#c9a050', '#b8b2aa']};

  function load(id) {
    if (cache[id] || !loader) return Promise.resolve(cache[id]);
    return waiting[id] ||= new Promise(res => loader.load(BASE + id + '.glb', g => { cache[id] = g; res(g) }, undefined, () => res(null)));
  }
  function preload() { return Promise.all(MODELS.map(load)) }

  function actor(scene, id, fallback, tint) {
    const g = new T.Group(); scene.add(g);
    let mixer = null, actions = {}, current = null, inner = null, last = performance.now(), lx = null, lz = null, speed = 0;
    let oneShot = null, oneShotUntil = 0, mood = null;

    function attach(src) {
      if (!src) return;
      inner = T.SkeletonUtils.clone(src.scene); inner.scale.setScalar(SCALE);
      inner.traverse(o => {
        if (!o.isMesh) return;
        o.frustumCulled = false; o.castShadow = true;
        if (tint && o.material && palette[o.material.name]) {
          const opts = palette[o.material.name]; o.material = o.material.clone();
          o.material.color.set(opts[(tint * 7 + o.material.name.length) % opts.length]);
        }
      });
      g.add(inner); mixer = new T.AnimationMixer(inner);
      src.animations.forEach(a => actions[a.name] = mixer.clipAction(a));
      ['saludar', 'senalar'].forEach(n => { if (actions[n]) { actions[n].setLoop(T.LoopRepeat) } });
      if (fallback) fallback.g.visible = false;
      play('reposo', 0);
    }
    load(id).then(attach);

    function play(name, fade = .22) {
      const a = actions[name]; if (!a || a === current) return;
      a.reset(); a.setEffectiveTimeScale(1); a.setEffectiveWeight(1); a.play();
      if (current) current.crossFadeTo(a, fade, true);
      current = a;
    }

    return {
      g,
      get loaded() { return !!inner },
      /** Lanza un gesto durante unos segundos: 'saludar', 'senalar' o 'hablar'. */
      gesture(name, seconds = 2.2) { oneShot = name; oneShotUntil = performance.now() + seconds * 1000 },
      /** Estado de ánimo mientras está quieto: null (reposo) o 'hablar'. */
      set mood(v) { mood = v },
      pose(x, z, angle, phase, moving) {
        const now = performance.now(), dt = Math.min(.1, (now - last) / 1000); last = now;
        if (!inner) { if (fallback) { fallback.g.visible = g.visible; fallback.pose(x, z, angle, phase, moving) } return }
        if (lx !== null && dt > 0) { const v = Math.hypot(x - lx, z - lz) / dt; speed += (v - speed) * Math.min(1, dt * 8) }
        lx = x; lz = z;
        g.position.set(x, 0, z); g.rotation.y = angle;
        let clip = 'reposo', scale = 1;
        if (moving && speed > 6) {
          if (speed < 80) { clip = 'andar'; scale = Math.max(.6, speed / 40) }
          else { clip = 'correr'; scale = Math.min(1.9, speed / 100) }
        } else if (oneShot && now < oneShotUntil) clip = oneShot;
        else if (mood) clip = mood;
        if (oneShot && now >= oneShotUntil) oneShot = null;
        play(clip); if (current) current.timeScale = scale;
        mixer.update(dt);
      }
    };
  }
  return {actor, preload, MODELS, portrait: id => BASE + 'retrato-' + id + '.webp'};
})();
