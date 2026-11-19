/* Palet · dades del joc: productes, plànol del magatzem, nivells de la carrera i textos de la cap. */
(function (root) {
  const D = {};

  // Productes. Cada «càrrega» és un paquet de caixes que es mou d'un cop.
  // pes (kg per càrrega) · fragil · cad: dies de vida (peribles) · fred: 'refri' | 'conge' · perill: classe (pictograma) · rot: A/B/C · zona: on va
  D.productes = {
    aigua:    { nom: 'Aigua 6 × 1,5 L', ean: '8412345000017', pes: 9.5, rot: 'A', color: '#7cc4f5', icona: 'ampolla' },
    oli:      { nom: 'Oli d\'oliva 12 × 1 L', ean: '8412345000024', pes: 12, rot: 'A', color: '#d9c45a', icona: 'ampolla' },
    llet:     { nom: 'Llet UHT 6 × 1 L', ean: '8412345000031', pes: 6.5, rot: 'A', cad: 90, color: '#f3f4f6', icona: 'brik' },
    arros:    { nom: 'Arròs 10 × 1 kg', ean: '8412345000048', pes: 10, rot: 'B', color: '#efe7d2', icona: 'paquet' },
    pasta:    { nom: 'Pasta 20 × 500 g', ean: '8412345000055', pes: 10, rot: 'B', color: '#f2c86b', icona: 'paquet' },
    galetes:  { nom: 'Galetes 12 paquets', ean: '8412345000062', pes: 4, rot: 'B', cad: 180, color: '#e2a35a', icona: 'paquet' },
    tomaquet: { nom: 'Tomàquet triturat 12 llaunes', ean: '8412345000079', pes: 6, rot: 'C', color: '#e0614a', icona: 'llauna' },
    sucre:    { nom: 'Sac de sucre 25 kg', ean: '8412345000086', pes: 25, rot: 'C', color: '#ffffff', icona: 'sac' },
    vi:       { nom: 'Vi negre 6 ampolles', ean: '8412345000093', pes: 8, rot: 'B', fragil: 1, color: '#8a2c4a', icona: 'ampolla' },
    melmelada:{ nom: 'Melmelada 12 pots de vidre', ean: '8412345000109', pes: 5, rot: 'C', fragil: 1, cad: 365, color: '#c8406b', icona: 'pot' },
    ous:      { nom: 'Ous 12 dotzenes', ean: '8412345000116', pes: 8, rot: 'A', fragil: 1, cad: 28, color: '#f5deb3', icona: 'ous' },
    iogurt:   { nom: 'Iogurts 24 unitats', ean: '8412345000123', pes: 3.2, rot: 'A', cad: 21, fred: 'refri', color: '#f7f7ff', icona: 'iogurt' },
    formatge: { nom: 'Formatge fresc 12 unitats', ean: '8412345000130', pes: 3, rot: 'B', cad: 14, fred: 'refri', color: '#fff6d6', icona: 'formatge' },
    embotit:  { nom: 'Embotit 10 peces', ean: '8412345000147', pes: 5, rot: 'B', cad: 45, fred: 'refri', color: '#c0505a', icona: 'embotit' },
    gelat:    { nom: 'Gelats 20 unitats', ean: '8412345000154', pes: 4, rot: 'C', cad: 365, fred: 'conge', color: '#bfe3ff', icona: 'gelat' },
    pesols:   { nom: 'Pèsols congelats 10 bosses', ean: '8412345000161', pes: 5, rot: 'B', cad: 365, fred: 'conge', color: '#7bc67e', icona: 'bossa' },
    lleixiu:  { nom: 'Lleixiu 4 × 5 L', ean: '8412345000178', pes: 21, rot: 'B', perill: 'corrosiu', color: '#9ad0ec', icona: 'garrafa' },
    alcohol:  { nom: 'Alcohol de netejar 12 × 1 L', ean: '8412345000185', pes: 10, rot: 'C', perill: 'inflamable', color: '#e8f4fb', icona: 'ampolla' },
    detergent:{ nom: 'Detergent 3 × 5 kg', ean: '8412345000192', pes: 16, rot: 'B', quimic: 1, color: '#58a6ff', icona: 'garrafa' }
  };
  D.PROD = Object.keys(D.productes);
  D.PERILLS = { corrosiu: 'Corrosiu (classe 8)', inflamable: 'Líquid inflamable (classe 3)' };
  D.PES_MANUAL = 25;   // kg: més pes, sobreesforç si es col·loca a mà en un nivell alt

  // Plànol (unitats de la pantalla: 1100 × 720). Passadissos A, B i C de prestatgeries; F = cambra de fred; P = zona de perillosos.
  D.W = 1100; D.H = 720;
  D.PASSADISSOS = [
    { id: 'A', y: 150, x0: 330, moduls: 6 },
    { id: 'B', y: 300, x0: 330, moduls: 6 },
    { id: 'C', y: 450, x0: 330, moduls: 6 }
  ];
  D.MODUL_W = 92;      // amplada d'un mòdul
  D.ZONES = {
    recepcio: { x: 60, y: 70, w: 200, h: 170, nom: 'Recepció', moll: 'Moll 1' },
    expedicio: { x: 60, y: 450, w: 200, h: 200, nom: 'Expedició', moll: 'Molls 2 i 3' },
    fred: { x: 930, y: 60, w: 150, h: 230, nom: 'Cambra de fred', id: 'F', moduls: 2 },
    perill: { x: 930, y: 470, w: 150, h: 170, nom: 'Perillosos', id: 'P', moduls: 2 },
    sortida: { x: 1086, y: 350, nom: 'Sortida d\'emergència' }
  };
  D.NIVELLS_RACK = 4;      // nivells de cada mòdul (1 = terra)
  D.POSICIONS = ['A', 'B'];

  // Ubicació fixa de cada producte (nivells 1-2). Pesats a terra, rotació A a prop dels molls, fred a la cambra, perillosos a la seva zona.
  D.UBICACIO = {
    aigua: 'A-01-1-A', oli: 'A-01-1-B', sucre: 'A-02-1-A', llet: 'A-02-2-A', arros: 'B-01-1-A', pasta: 'B-01-2-A', galetes: 'B-02-2-A',
    tomaquet: 'C-03-2-A', ous: 'A-03-2-A', vi: 'B-03-1-A', melmelada: 'C-04-2-B', detergent: 'C-05-1-A',
    iogurt: 'F-01-2-A', formatge: 'F-01-2-B', embotit: 'F-02-1-A', gelat: 'F-02-2-A', pesols: 'F-02-2-B',
    lleixiu: 'P-01-1-A', alcohol: 'P-02-1-A'
  };

  // Carrera: la cap t'hi ascendeix
  D.NIVELLS = [
    { n: 1, nom: 'Mosso de magatzem', icona: 'caixa', equip: 'transpalet', nivellsRack: 2, tasques: ['recepcio', 'ubicacio'],
      desc: 'Reps la mercaderia, la revises i la deixes a la ubicació que indica el sistema.' },
    { n: 2, nom: 'Preparador de comandes', icona: 'llista', equip: 'transpalet', nivellsRack: 2, tasques: ['recepcio', 'ubicacio', 'picking'],
      desc: 'A més, prepares comandes de les botigues: FEFO, ruta i palet ben muntat abans que surti el camió.' },
    { n: 3, nom: 'Carretoner', icona: 'toro', equip: 'toro', nivellsRack: 4, tasques: ['recepcio', 'ubicacio', 'picking'], lliure: true,
      desc: 'Amb el toro arribes als nivells alts. Tries tu la ubicació (fred, perillosos, pes) i vigiles el diagrama de càrrega.' },
    { n: 4, nom: 'Cap d\'equip', icona: 'equip', equip: 'toro', nivellsRack: 4, tasques: ['recepcio', 'ubicacio', 'picking', 'carrega'], lliure: true,
      desc: 'Diversos camions amb hores de sortida diferents. Cal carregar-los en l\'ordre invers del repartiment.' },
    { n: 5, nom: 'Cap de magatzem', icona: 'estrella', equip: 'toro', nivellsRack: 4, tasques: ['recepcio', 'ubicacio', 'picking', 'carrega', 'inventari'], lliure: true,
      desc: 'Fas recomptes, decideixes les comandes al proveïdor amb el punt de comanda i gestiones les devolucions.' }
  ];
  D.TORNS_ASCENS = 2;      // torns bons seguits per ascendir
  D.NOTA_BONA = 75;        // nota del torn per comptar com a bo
  D.AVISOS_ACOMIADAMENT = 3;

  // Equips
  D.EQUIPS = {
    transpalet: { nom: 'Transpalet manual', vel: 150, velCarregat: 110, maxKg: 1000 },
    toro: { nom: 'Toro (carretó contrapesat)', vel: 220, velCarregat: 170, maxKg: 1500,
      // diagrama de càrrega: kg màxims per nivell
      diagrama: { 1: 1500, 2: 1500, 3: 1000, 4: 700 } }
  };
  D.VEL_PRESSA = 1.5;      // anar de pressa: més ràpid, però més risc d'accident

  // Clients (botigues) que fan comandes i rutes dels camions
  D.CLIENTS = [
    { id: 'vic', nom: 'Botiga de Vic' }, { id: 'manlleu', nom: 'Botiga de Manlleu' }, { id: 'torello', nom: 'Botiga de Torelló' },
    { id: 'tona', nom: 'Botiga de Tona' }, { id: 'centelles', nom: 'Botiga de Centelles' }
  ];
  D.PROVEIDORS = ['Distribucions Osona', 'Majorista del Ter', 'Proveïments Lluçanès', 'Logística Plana de Vic', 'Central de Compres Ripollès'];

  // Torn: durada en minuts del rellotge (de 8:00 a 14:00) i segons reals a velocitat ×1
  D.TORN_INICI = 8 * 60; D.TORN_FI = 14 * 60; D.TORN_SEGONS = 420;

  // Motius de rebuig a la recepció
  D.MOTIUS = {
    dany: 'Embalatge malmès',
    caducitat: 'Caducitat massa curta',
    temperatura: 'Temperatura incorrecta (cadena de fred)',
    referencia: 'Referència equivocada',
    sobrant: 'Sobrant: no és a la comanda'
  };
  D.CAD_MINIMA = 0.5;      // s'accepta si queda com a mínim la meitat de la vida útil

  // La cap
  D.CAP = { nom: 'Montse', carrec: 'cap de magatzem' };
  D.FRASES = {
    benvinguda: ['Bon dia! Soc la Montse, la cap de magatzem. Avui comences de mosso: revisa bé el que arriba i deixa-ho on toca.'],
    bo: ['Bona feina avui. Així m\'agrada.', 'Torn net: comandes a temps i sense incidents. Continua així.', 'Avui ho has fet molt bé.'],
    regular: ['Correcte, però hi ha coses a millorar. Mira l\'informe.', 'No està malament, però vull menys errors demà.'],
    bronca: ['Això no pot ser. Llegeix bé l\'informe i que no torni a passar.', 'Avui m\'has fet passar vergonya amb els clients. Vull més cura.', 'La seguretat no es negocia. Primer avís.'],
    ascens: ['Felicitats! T\'ho has guanyat: a partir de demà ets {0}.'],
    acomiadament: ['Ho sento, però amb tants avisos no puc continuar comptant amb tu. Pots tornar a provar-ho des del principi del nivell.']
  };

  // Valor de cada aspecte a la nota del torn
  D.PESOS_NOTA = { productivitat: 0.35, qualitat: 0.4, seguretat: 0.25 };

  if (typeof module !== 'undefined' && module.exports) module.exports = D; else root.PD = D;
})(typeof window !== 'undefined' ? window : globalThis);
