/* Vitrina · dades: carrers, marques (fictícies) i aparadors d'exemple. */
(function (root) {
  const D = {};
  D.ZONES = {
    passeig: { nom: 'Passeig de Gràcia', tipus: 'Luxe i grans marques', desc: 'Façanes modernistes, panot hexagonal de Gaudí i clientela que busca exclusivitat. Aparadors amb pocs productes, molt espai i llum càlida.' },
    angel: { nom: "Portal de l'Àngel", tipus: 'Moda jove i grans cadenes', desc: "El carrer comercial amb més vianants de la ciutat. Aparadors que s'han de llegir en 3 segons: missatge clar, repetició i colors de temporada." },
    born: { nom: 'El Born', tipus: 'Disseny, llibreries i obradors', desc: 'Carrers medievals estrets, pedra i arcs. Botigues amb història que expliquen una història a l\'aparador.' },
    gracia: { nom: 'Gràcia', tipus: 'Comerç de barri', desc: 'Places i carrers de veïns. Botigues properes, preus visibles i aparadors que canvien amb el calendari del barri.' }
  };
  D.MARQUES = {
    aurelia: { nom: 'MAISON AURÈLIA', zona: 'passeig', sector: 'Perfumeria i cosmètica de luxe', c1: '#141518', c2: '#d8b45a' },
    urba: { nom: 'URBA', zona: 'angel', sector: 'Moda jove', c1: '#15171a', c2: '#ffffff' },
    llibres: { nom: 'Llibres del Born', zona: 'born', sector: 'Llibreria independent', c1: '#2c3d33' },
    pasapas: { nom: 'Pas a Pas', zona: 'gracia', sector: 'Sabateria', c1: '#7a1f2b', facana: '#e7b97c' }
  };
  // Aparadors d'exemple (els punts calents s'afegiran per a la part d'aprendre)
  D.EXEMPLES = [
    { id: 'aurelia-nadal', marca: 'aurelia', titol: 'Nadal a Maison Aurèlia', nit: true,
      ap: { fons: 'cortina', fonsC: '#5e1622', terra: 'marbre', general: 0.3, temp: 'calida',
        items: [
          { id: 'podi-alt', x: 150, c: '#141518' }, { id: 'perfum-gran', x: 150, y: 70, c: '#c9a35b' },
          { id: 'podi-mig', x: 92, c: '#141518' }, { id: 'perfum', x: 92, y: 45, s: 1.8, c: '#e9b8c8' },
          { id: 'podi-mig', x: 208, c: '#141518' }, { id: 'capsa-regal', x: 208, y: 45, s: 1.4, c: '#141518' },
          { id: 'podi-baix', x: 48, c: '#141518' }, { id: 'crema', x: 48, y: 22, s: 1.6 },
          { id: 'podi-baix', x: 252, c: '#141518' }, { id: 'perfum', x: 252, y: 22, s: 1.5, c: '#9cc5d6' },
          { id: 'estrella', x: 70, y: 168, s: 0.9 }, { id: 'estrella', x: 236, y: 176, s: 0.75 }, { id: 'estrella', x: 150, y: 190, s: 0.6 },
          { id: 'cartell', x: 150, y: 0, s: 0.62, c: '#141518', t: "L'art de regalar", z: 2 }
        ],
        llums: [{ x: 150, tx: 150, ty: 105, r: 34, temp: 'calida' }, { x: 80, tx: 92, ty: 62, r: 26, temp: 'calida', i: 0.8 }, { x: 222, tx: 208, ty: 60, r: 26, temp: 'calida', i: 0.8 }] },
      vianants: [{ x: 70, k: 3, mira: true }, { x: 470, k: 1 }] },
    { id: 'urba-primavera', marca: 'urba', titol: 'Primavera a URBA', nit: false,
      ap: { fons: 'llis', fonsC: '#f4d7dd', terra: 'marbre', general: 0.85, temp: 'neutra',
        items: [
          { id: 'cub-baix', x: 150, c: '#ffffff', s: 1.6 },
          { id: 'maniqui', x: 80, y: 0, c: '#9cc5d6' }, { id: 'maniqui', x: 150, y: 22, c: '#f2c6a0' }, { id: 'maniqui', x: 220, y: 0, c: '#c8d9a8' },
          { id: 'ram', x: 30, s: 1.4 }, { id: 'test-planta', x: 275, s: 1.2 },
          { id: 'bossa', x: 112, y: 22, s: 0.9, c: '#e9d6c5' }, { id: 'sabatilla', x: 186, y: 22, c: '#f3efe8' },
          { id: 'cartell-penjat', x: 150, y: 168, c: '#15171a', t: 'NOVA COL·LECCIÓ', s: 1.1 }
        ],
        llums: [{ x: 80, tx: 80, ty: 120, r: 40, temp: 'neutra' }, { x: 150, tx: 150, ty: 140, r: 40, temp: 'neutra' }, { x: 220, tx: 220, ty: 120, r: 40, temp: 'neutra' }] },
      vianants: [{ x: 40, k: 4 }, { x: 488, k: 5, mira: true, mida: 0.95 }] },
    { id: 'llibres-santjordi', marca: 'llibres', titol: 'Sant Jordi a Llibres del Born', nit: true,
      ap: { fons: 'mao', fonsC: '#b8673f', terra: 'fosca', general: 0.35, temp: 'calida',
        items: [
          { id: 'arc-flors', x: 150, c: '#c1121f', s: 1.15 },
          { id: 'escala', x: 150, c: '#efe7dc' },
          { id: 'pila-llibres', x: 125, y: 18, s: 1.3 }, { id: 'llibre', x: 150, y: 36, s: 1.5, c: '#b23a48' }, { id: 'llibre', x: 175, y: 54, s: 1.6, c: '#2f6b4f' },
          { id: 'rosa', x: 165, y: 36, s: 1.1, z: 1 }, { id: 'rosa', x: 188, y: 54, s: 1.1, z: 1 },
          { id: 'llibre-obert', x: 62, y: 0, s: 1.4 }, { id: 'rosa', x: 70, y: 0, s: 0.9, flip: true },
          { id: 'drap-sant-jordi', x: 250, s: 1.1 }, { id: 'pila-llibres', x: 230, s: 1.2 },
          { id: 'cartell', x: 150, y: 128, s: 0.95, c: '#f3efe8', t: 'Llibres i roses' }
        ],
        llums: [{ x: 150, tx: 155, ty: 60, r: 42, temp: 'calida' }, { x: 60, tx: 66, ty: 10, r: 26, temp: 'calida', i: 0.7 }, { x: 150, tx: 150, ty: 135, r: 30, temp: 'calida', i: 0.6 }] },
      vianants: [{ x: 486, k: 2, mira: true }] },
    { id: 'pasapas-rebaixes', marca: 'pasapas', titol: 'Rebaixes a Pas a Pas', nit: false,
      ap: { fons: 'ratlles', fonsC: '#e9d6c5', terra: 'fusta', general: 0.9, temp: 'neutra',
        items: [
          { id: 'escala', x: 85, c: '#ffffff' },
          { id: 'sabata', x: 60, y: 18, s: 2, c: '#b23a48' }, { id: 'sabata', x: 85, y: 36, s: 2, c: '#1f2328' }, { id: 'sabata', x: 110, y: 54, s: 2, c: '#c9a35b' },
          { id: 'cub', x: 205, c: '#ffffff' }, { id: 'bota', x: 205, y: 40, s: 2 },
          { id: 'cub', x: 262, s: 0.7, c: '#ffffff' }, { id: 'sabatilla', x: 262, y: 28, s: 1.8, c: '#5b7f95' },
          { id: 'preu', x: 60, y: 18, s: 1.2, t: '39 €', z: 2 }, { id: 'preu', x: 85, y: 36, s: 1.2, t: '45 €', z: 2 }, { id: 'preu', x: 110, y: 54, s: 1.2, t: '52 €', z: 2 },
          { id: 'preu-gran', x: 205, y: 4, s: 1, t: '59 €', z: 2 },
          { id: 'rebaixes', x: 165, y: 120, s: 1.5, t: '-30 %' },
          { id: 'globus', x: 30, y: 150, c: '#c1121f' }, { id: 'globus', x: 278, y: 140, c: '#e9c46a' }
        ],
        llums: [{ x: 85, tx: 85, ty: 50, r: 40, temp: 'neutra' }, { x: 220, tx: 215, ty: 55, r: 40, temp: 'neutra' }] },
      vianants: [{ x: 60, k: 0, mira: true }, { x: 455, k: 7 }] }
  ];
  if (typeof module !== 'undefined') module.exports = D; else root.VD = D;
})(this);
