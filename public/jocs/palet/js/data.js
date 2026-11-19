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
    detergent:{ nom: 'Detergent 3 × 5 kg', ean: '8412345000192', pes: 16, rot: 'B', quimic: 1, color: '#58a6ff', icona: 'garrafa' },
    // Frigorífic
    lletfresca:{ nom: 'Llet fresca 6 × 1 L', ean: '8412345000208', pes: 6.5, rot: 'A', cad: 8, fred: 'refri', color: '#eef6ff', icona: 'brik' },
    mantega:  { nom: 'Mantega 20 pastilles', ean: '8412345000215', pes: 5, rot: 'B', cad: 60, fred: 'refri', color: '#ffe9a8', icona: 'paquet' },
    pollastre:{ nom: 'Pollastre fresc 6 safates', ean: '8412345000222', pes: 7, rot: 'A', cad: 6, fred: 'refri', color: '#f5c6a5', icona: 'safata' },
    peix:     { nom: 'Peix fresc 5 kg', ean: '8412345000239', pes: 6, rot: 'A', cad: 4, fred: 'refri', color: '#a9d6e5', icona: 'safata' },
    pizza:    { nom: 'Pizzes congelades 12', ean: '8412345000246', pes: 5, rot: 'A', cad: 300, fred: 'conge', color: '#f4a261', icona: 'caixa' },
    croquetes:{ nom: 'Croquetes congelades 10 bosses', ean: '8412345000253', pes: 6, rot: 'B', cad: 300, fred: 'conge', color: '#e9c46a', icona: 'bossa' },
    verdura:  { nom: 'Verdura congelada 12 bosses', ean: '8412345000260', pes: 6, rot: 'B', cad: 365, fred: 'conge', color: '#90be6d', icona: 'bossa' },
    // Comerç electrònic (vol: volum de cada unitat per triar la caixa)
    llibre:   { nom: 'Llibre', ean: '9788412345017', pes: 0.6, rot: 'A', vol: 1, color: '#c9b79c', icona: 'llibre' },
    samarreta:{ nom: 'Samarreta', ean: '8412345001014', pes: 0.3, rot: 'A', vol: 1, color: '#e76f51', icona: 'roba' },
    auriculars:{ nom: 'Auriculars sense fil', ean: '8412345001021', pes: 0.4, rot: 'A', vol: 1, fragil: 1, color: '#264653', icona: 'caixa' },
    mobil:    { nom: 'Telèfon mòbil', ean: '8412345001038', pes: 0.5, rot: 'B', vol: 1, fragil: 1, color: '#1d3557', icona: 'caixa' },
    sabates:  { nom: 'Sabates esportives', ean: '8412345001045', pes: 1.1, rot: 'A', vol: 2, color: '#f4f1de', icona: 'caixa' },
    joguina:  { nom: 'Joc de construcció', ean: '8412345001052', pes: 1.4, rot: 'B', vol: 2, color: '#ffb703', icona: 'caixa' },
    motxilla: { nom: 'Motxilla', ean: '8412345001069', pes: 0.9, rot: 'B', vol: 2, color: '#2a9d8f', icona: 'roba' },
    cafetera: { nom: 'Cafetera', ean: '8412345001076', pes: 3.5, rot: 'C', vol: 3, fragil: 1, color: '#6d6875', icona: 'caixa' },
    llum:     { nom: 'Llum de taula', ean: '8412345001083', pes: 2.2, rot: 'C', vol: 3, fragil: 1, color: '#ffd166', icona: 'caixa' },
    esprai:   { nom: 'Esprai fixador (aerosol)', ean: '8412345001090', pes: 0.4, rot: 'C', vol: 1, perill: 'aerosol', color: '#bde0fe', icona: 'ampolla' },
    // Recanvis i materials
    cargols:  { nom: 'Cargols (caixa de 1.000)', ean: '8412345002011', pes: 6, rot: 'A', petit: 1, color: '#adb5bd', icona: 'caixa' },
    filtres:  { nom: 'Filtres d\'oli 10 unitats', ean: '8412345002028', pes: 3, rot: 'A', petit: 1, color: '#f77f00', icona: 'caixa' },
    rodaments:{ nom: 'Rodaments 20 unitats', ean: '8412345002035', pes: 5, rot: 'B', petit: 1, color: '#8d99ae', icona: 'caixa' },
    guants:   { nom: 'Guants de treball 24 parells', ean: '8412345002042', pes: 2, rot: 'B', petit: 1, color: '#fcbf49', icona: 'roba' },
    tubs:     { nom: 'Tubs de PVC 3 m (feix)', ean: '8412345002059', pes: 14, rot: 'B', llarg: 1, color: '#e5e5e5', icona: 'tub' },
    barres:   { nom: 'Barres d\'acer 6 m (feix)', ean: '8412345002066', pes: 45, rot: 'C', llarg: 1, color: '#6c757d', icona: 'tub' },
    perfils:  { nom: 'Perfils d\'alumini 4 m (feix)', ean: '8412345002073', pes: 16, rot: 'C', llarg: 1, color: '#ced4da', icona: 'tub' },
    ciment:   { nom: 'Palet de sacs de ciment', ean: '8412345002080', pes: 25, rot: 'A', sacs: 1, color: '#b0a99f', icona: 'sac' },
    morter:   { nom: 'Palet de sacs de morter', ean: '8412345002097', pes: 25, rot: 'B', sacs: 1, color: '#c2b8a3', icona: 'sac' },
    cable:    { nom: 'Bobina de cable 100 m', ean: '8412345002103', pes: 30, rot: 'C', color: '#d62828', icona: 'bobina' },
    pintura:  { nom: 'Pintura plàstica 4 × 15 L', ean: '8412345002110', pes: 16, rot: 'B', perill: 'inflamable', color: '#a8dadc', icona: 'garrafa' },
    dissolvent:{ nom: 'Dissolvent 12 × 1 L', ean: '8412345002127', pes: 10, rot: 'C', perill: 'inflamable', color: '#e9edc9', icona: 'ampolla' }
  };
  D.PROD = Object.keys(D.productes);
  D.PERILLS = { corrosiu: 'Corrosiu (classe 8)', inflamable: 'Líquid inflamable (classe 3)', aerosol: 'Aerosol (classe 2)' };
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

  // Tipus d'estanteria: nivells màxims i com s'agafa la mercaderia
  D.ESTANTERIES = {
    convencional: { nom: 'Convencional', curt: 'CONV', nivells: 4, desc: 'Accés directe a cada palet. Molt versàtil.' },
    dinamic: { nom: 'Dinàmica (per gravetat)', curt: 'DIN', nivells: 2, desc: 'Els palets entren pel darrere i llisquen fins al davant: el primer que entra és el primer que surt (FIFO automàtic).' },
    mobil: { nom: 'Mòbil', curt: 'MÒB', nivells: 4, desc: 'Les prestatgeries es desplacen sobre rails: hi cap molt més, però cal obrir el passadís abans d\'entrar-hi.' },
    compacte: { nom: 'Compacta (drive-in)', curt: 'CMP', nivells: 3, desc: 'El carretó entra dins de la prestatgeria: aprofita l\'espai, però només es pot agafar l\'últim palet que ha entrat (LIFO). Per a molts palets d\'una sola referència que no caduca.' },
    cantilever: { nom: 'Cantilever', curt: 'CANT', nivells: 3, desc: 'Braços en voladís per a càrregues llargues: tubs, barres i perfils.' },
    picking: { nom: 'De picking', curt: 'PICK', nivells: 4, desc: 'Prestatges per a peces petites i lleugeres que es preparen a mà.' }
  };
  // Tipus de magatzem que es poden triar. tipus de cada passadís (i excepcions per mòdul), temperatura, zones, ubicació fixa i mode de joc.
  D.MAGATZEMS = {
    aliment: { nom: 'Distribució alimentària', icona: '🛒', mode: 'estoc', desc: 'Magatzem regulador d\'una cadena de supermercats: secs, frescos a la cambra de fred i productes de neteja.',
      prods: ['aigua', 'oli', 'llet', 'arros', 'pasta', 'galetes', 'tomaquet', 'sucre', 'vi', 'melmelada', 'ous', 'iogurt', 'formatge', 'embotit', 'gelat', 'pesols', 'lleixiu', 'alcohol', 'detergent'],
      passadissos: { A: { tipus: 'convencional' }, B: { tipus: 'convencional' }, C: { tipus: 'convencional', neteja: [5, 6] } }, zones: ['fred', 'perill'],
      ubicacio: { aigua: 'A-01-1-A', oli: 'A-01-1-B', sucre: 'A-02-1-A', llet: 'A-02-2-A', arros: 'B-01-1-A', pasta: 'B-01-2-A', galetes: 'B-02-2-A', tomaquet: 'C-03-2-A', ous: 'A-03-2-A', vi: 'B-03-1-A', melmelada: 'C-04-2-B', detergent: 'C-05-1-A',
        iogurt: 'F-01-2-A', formatge: 'F-01-2-B', embotit: 'F-02-1-A', gelat: 'F-02-2-A', pesols: 'F-02-2-B', lleixiu: 'P-01-1-A', alcohol: 'P-02-1-A' } },
    fred: { nom: 'Magatzem frigorífic', icona: '❄️', mode: 'estoc', desc: 'Tot el magatzem és fred: cambra de refrigerats (0-4 °C) amb estanteria dinàmica i convencional, i cambra de congelats (−18 °C) amb estanteria mòbil.',
      prods: ['iogurt', 'formatge', 'embotit', 'lletfresca', 'mantega', 'pollastre', 'peix', 'gelat', 'pesols', 'pizza', 'croquetes', 'verdura'],
      passadissos: { A: { tipus: 'dinamic', temp: 'refri' }, B: { tipus: 'convencional', temp: 'refri' }, C: { tipus: 'mobil', temp: 'conge' } }, zones: [],
      ubicacio: { iogurt: 'A-01-1-A', formatge: 'A-01-1-B', lletfresca: 'A-02-1-A', mantega: 'A-02-1-B', pollastre: 'B-01-1-A', peix: 'B-01-1-B', embotit: 'B-02-2-A',
        gelat: 'C-01-1-A', pesols: 'C-01-2-A', pizza: 'C-02-1-A', croquetes: 'C-02-2-A', verdura: 'C-03-1-A' } },
    cross: { nom: 'Plataforma de cross-docking', icona: '🔀', mode: 'cross', desc: 'Magatzem de trànsit: la mercaderia que arriba no s\'ubica. Es revisa, es classifica per destinació i es porta directament al moll del camió que hi va, el mateix dia.',
      prods: ['aigua', 'oli', 'llet', 'arros', 'pasta', 'galetes', 'tomaquet', 'vi', 'melmelada', 'ous', 'iogurt', 'formatge', 'embotit'],
      passadissos: { A: { tipus: 'cap' }, B: { tipus: 'cap' }, C: { tipus: 'cap' } }, zones: [], ubicacio: {} },
    ecom: { nom: 'Comerç electrònic', icona: '📦', mode: 'ecom', desc: 'Centre de comandes en línia: moltes comandes petites, picking per onades amb estanteries de picking, caixa a mida i hora de recollida del transportista.',
      prods: ['llibre', 'samarreta', 'auriculars', 'mobil', 'sabates', 'joguina', 'motxilla', 'cafetera', 'llum', 'esprai'],
      passadissos: { A: { tipus: 'picking' }, B: { tipus: 'picking' }, C: { tipus: 'convencional' } }, zones: ['perill'],
      ubicacio: { llibre: 'A-01-1-A', samarreta: 'A-01-2-A', auriculars: 'A-02-2-A', mobil: 'A-02-2-B', joguina: 'A-03-1-A', motxilla: 'A-03-2-A', sabates: 'B-01-1-A', cafetera: 'C-01-1-A', llum: 'C-02-1-A', esprai: 'P-01-1-A' } },
    recanvis: { nom: 'Recanvis i materials', icona: '🔩', mode: 'estoc', lliure: true, desc: 'Magatzem d\'un distribuïdor de ferreteria i construcció: peces petites en estanteries de picking, tubs i barres en cantilever, sacs en estanteria compacta i ubicació caòtica.',
      prods: ['cargols', 'filtres', 'rodaments', 'guants', 'tubs', 'barres', 'perfils', 'ciment', 'morter', 'cable', 'pintura', 'dissolvent'],
      passadissos: { A: { tipus: 'picking' }, B: { tipus: 'cantilever' }, C: { tipus: 'compacte', mods: { 4: 'convencional', 5: 'convencional', 6: 'convencional' } } }, zones: ['perill'], ubicacio: {} }
  };
  D.MAGATZEM_PER_DEFECTE = 'aliment';
  // Temps màxim fora del fred (minuts de joc) des que s'accepta al moll fins que és a la cambra
  D.FRED_MAX = { refri: 40, conge: 25 };
  // Caixes del comerç electrònic: volum màxim que hi cap
  D.CAIXES = { S: { nom: 'Petita', vol: 2 }, M: { nom: 'Mitjana', vol: 4 }, L: { nom: 'Gran', vol: 8 } };

  // Activa un magatzem: productes, ubicacions i zones del joc en curs
  D.usa = function (id) {
    const M = D.MAGATZEMS[id] || D.MAGATZEMS[D.MAGATZEM_PER_DEFECTE];
    D.MAG = M; D.MAG_ID = D.MAGATZEMS[id] ? id : D.MAGATZEM_PER_DEFECTE;
    D.PROD = M.prods.slice(); D.UBICACIO = M.ubicacio;
    D.PASSADISSOS.forEach(p => { p.tipus = M.passadissos[p.id].tipus; p.temp = M.passadissos[p.id].temp || null; p.mods = M.passadissos[p.id].mods || {}; p.neteja = M.passadissos[p.id].neteja || []; });
    return M;
  };
  D.tipusDe = (pas, mod) => { const p = D.PASSADISSOS.find(x => x.id === pas); return p ? (p.mods[mod] || p.tipus) : 'convencional'; };

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

  D.usa(D.MAGATZEM_PER_DEFECTE);
  if (typeof module !== 'undefined' && module.exports) module.exports = D; else root.PD = D;
})(typeof window !== 'undefined' ? window : globalThis);
