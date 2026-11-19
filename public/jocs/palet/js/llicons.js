/* Palet · lliçons dins del joc. Surten a l'informe del torn quan hi ha errors d'aquell tema (o en començar un nivell nou).
   Cada lliçó enllaça amb la lliçó completa d'ECO i NEXO a ecoynexo.com. La resposta correcta és la primera (o[0]); el joc les barreja. */
(function (root) {
  const WEB = 'https://ecoynexo.com/ca/aprender/actividades-comerciales/tecnicas-de-almacen/';
  const L = [
    { id: 'recepcio', tema: ['recepcio'], nivell: 1, web: 'control-recepcion-incidencias', titol: 'Control de la recepció',
      text: 'Abans de signar l\'albarà, comprova cada càrrega: que sigui la referència de l\'albarà, que l\'embalatge estigui bé, que la caducitat sigui prou llarga i, en els refrigerats i congelats, la temperatura. Si hi ha un problema, rebutja-la i anota el motiu.',
      p: 'Uns iogurts arriben a 11 °C. Què fas?', o: ['Rebutjar-los: s\'ha trencat la cadena de fred', 'Acceptar-los i posar-los ràpid a la cambra', 'Acceptar-los amb descompte', 'Guardar-los al magatzem sec'], per: 'Els refrigerats han d\'arribar entre 0 i 4-5 °C.' },
    { id: 'codis', tema: ['ubicacio'], nivell: 1, web: 'ubicacion-fija-caotica-codificacion', titol: 'Codis d\'ubicació',
      text: 'El codi A-03-2-B vol dir: passadís A, mòdul 3, nivell 2 (alçada), posició B. Amb ubicació fixa, cada producte va sempre al lloc que indica el sistema; si el deixes en un altre, ningú no el trobarà.',
      p: 'Al codi C-05-1-A, què indica l\'1?', o: ['El nivell (alçada)', 'El passadís', 'El mòdul', 'La posició'], per: 'Passadís-mòdul-nivell-posició.' },
    { id: 'criteris', tema: ['ubicacio'], nivell: 3, web: 'criterios-colocacion', titol: 'On va cada producte',
      text: 'Amb ubicació lliure tries tu el lloc: el que pesa, a terra; el fràgil, als nivells baixos o mitjans; els refrigerats i congelats, a la cambra de fred; els perillosos, a la seva zona; els químics de neteja, separats dels aliments. I no barregis referències a la mateixa ubicació.',
      p: 'On hauria d\'anar un sac de sucre de 25 kg?', o: ['A terra (nivell 1)', 'Al nivell 4', 'A la cambra de fred', 'A la zona de perillosos'], per: 'El que pesa va a baix.' },
    { id: 'fefo', tema: ['fefo', 'merma'], nivell: 2, web: 'rotacion-fifo-fefo-lifo', titol: 'FEFO: primer el que caduca abans',
      text: 'En fer el picking de productes amb data, agafa sempre el lot que caduca abans (FEFO), encara que hagi entrat després. Si deixes el lot antic, caducarà a la prestatgeria i serà una merma.',
      p: 'Lot A caduca el dia 20 i lot B el dia 15. Quin surt primer?', o: ['El lot B', 'El lot A', 'El que sigui més a prop', 'Tant és'], per: 'FEFO: first expired, first out.' },
    { id: 'picking', tema: ['picking'], nivell: 2, web: 'orden-pedido-sistemas-picking', titol: 'La llista de picking',
      text: 'Cada línia de la comanda diu referència, ubicació i quantitat. Comprova el producte abans d\'agafar-lo i la quantitat exacta: un error de picking arriba directament a la botiga.',
      p: 'Què redueix els errors de picking?', o: ['Comprovar (escanejar) cada producte en agafar-lo', 'Anar més ràpid', 'Preparar de memòria', 'Agafar una unitat de més per si de cas'], per: 'El sistema avisa si no és el producte correcte.' },
    { id: 'paletitzar', tema: ['trencament'], nivell: 2, web: 'embalaje-paletizacion-unidades-carga', titol: 'Muntar el palet',
      text: 'El palet es munta de baix a dalt en l\'ordre en què agafes els productes. Per això comença pel que pesa i és resistent i acaba pel fràgil: si poses ampolles a sota i garrafes a sobre, es trenquen.',
      p: 'Quin ordre de picking és millor?', o: ['Primer el pesat, al final el fràgil', 'Primer el fràgil, al final el pesat', 'Per ordre alfabètic', 'Tant és, el film ho aguanta tot'], per: 'El que agafes primer queda a baix del palet.' },
    { id: 'rutes', tema: ['expedicio'], nivell: 2, web: 'rutas-preparacion', titol: 'Rutes i hora de sortida',
      text: 'El temps es perd caminant: ordena les línies per passadís i fes el recorregut d\'una sola vegada. I mira l\'hora del camió: si el palet arriba tard al moll, la botiga no el rep fins l\'endemà.',
      p: 'On es perd més temps en el picking?', o: ['Caminant entre ubicacions', 'Imprimint la llista', 'Signant l\'albarà', 'Posant el film'], per: 'Per això s\'optimitzen les rutes.' },
    { id: 'carrega', tema: ['carrega'], nivell: 4, web: 'expedicion-documentacion-carga', titol: 'Ordre de càrrega',
      text: 'El camió es carrega en ordre invers al del repartiment: el primer client a descarregar ha d\'anar a prop de la porta, és a dir, s\'hi carrega l\'últim. Al joc, l\'ordre de càrrega és l\'ordre en què deixes els palets al moll.',
      p: 'El repartiment és Vic → Manlleu → Torelló. Quin palet deixes primer al moll?', o: ['El de Torelló', 'El de Vic', 'El de Manlleu', 'Tant és'], per: 'L\'últim que es descarrega és el primer que es carrega.' },
    { id: 'seguretat', tema: ['seguretat'], nivell: 1, web: 'riesgos-manipulacion-manual-cargas', titol: 'Seguretat al magatzem',
      text: 'Amb càrrega, a poc a poc: anar de pressa provoca cops i caigudes de mercaderia. No pugis a mà càrregues pesants als nivells alts (sobreesforç) i no deixis mai res al passadís ni davant de la sortida d\'emergència.',
      p: 'Què és un incident de seguretat?', o: ['Deixar un palet davant de la sortida d\'emergència', 'Ordenar la comanda per passadissos', 'Fer servir el transpalet', 'Revisar l\'albarà'], per: 'Les sortides i els extintors han d\'estar sempre lliures.' },
    { id: 'transpalet', tema: ['seguretat'], nivell: 1, web: 'transpale-manual-electrico', titol: 'El transpalet',
      text: 'El transpalet només aixeca el palet uns centímetres per moure\'l arran de terra. Per als nivells alts cal el toro (carretó elevador), que només pot conduir qui té la formació.',
      p: 'Per a què serveix el transpalet?', o: ['Per moure palets arran de terra', 'Per pujar palets al nivell 4', 'Per transportar persones', 'Per embolicar palets'], per: 'Per elevar cal un apilador o un carretó.' },
    { id: 'fred', tema: ['ubicacio'], nivell: 3, web: 'conservacion-perecederos-cadena-frio', titol: 'Cadena de fred',
      text: 'Els refrigerats (0-4 °C) i els congelats (−18 °C o menys) han d\'anar de seguida a la cambra. Cada minut al moll pot trencar la cadena de fred.',
      p: 'A quina temperatura es guarden els congelats?', o: ['A −18 °C o menys', 'Entre 0 i 4 °C', 'A temperatura ambient', 'A 8 °C'], per: 'És la temperatura habitual de congelació.' },
    { id: 'perillosos', tema: ['ubicacio'], nivell: 3, web: 'fragiles-mercancias-peligrosas', titol: 'Mercaderies perilloses',
      text: 'Els productes amb pictograma de perill (corrosius, inflamables…) van a la zona de perillosos, ventilada i senyalitzada, separats dels aliments. La fitxa de dades de seguretat explica com emmagatzemar-los.',
      p: 'On trobes com s\'ha d\'emmagatzemar un producte químic?', o: ['A la fitxa de dades de seguretat', 'A la factura', 'A l\'albarà', 'Al codi de barres'], per: 'També hi ha els primers auxilis.' },
    { id: 'estanteries', tema: ['ubicacio'], nivell: 1, mag: ['fred', 'recanvis', 'ecom'], web: 'sistemas-almacenaje', titol: 'Tipus d\'estanteria',
      text: 'Convencional: accés directe a cada palet. Dinàmica: els palets llisquen i surt primer el que va entrar primer (FIFO). Mòbil: hi cap molt més, però cal obrir el passadís. Compacta (drive-in): molts palets d\'una sola referència; només surt l\'últim que ha entrat. Cantilever: càrregues llargues. Picking: peces petites que es preparen a mà.',
      p: 'On guardaries feixos de tubs de 3 metres?', o: ['En una estanteria cantilever', 'En una estanteria compacta', 'En una estanteria de picking', 'En una estanteria dinàmica'], per: 'El cantilever té braços en voladís per a càrregues llargues.' },
    { id: 'compacta', tema: ['ubicacio'], nivell: 1, mag: ['recanvis'], web: 'sistemas-almacenaje', titol: 'L\'estanteria compacta',
      text: 'En una estanteria compacta (drive-in) el carretó entra dins del carril i només pot treure l\'últim palet que ha entrat (LIFO). Per això cada carril ha de ser d\'una sola referència i mai no s\'hi posen productes que caduquen.',
      p: 'Què NO hauries de posar en una estanteria compacta?', o: ['Iogurts que caduquen', 'Molts palets de sacs de ciment', 'Palets d\'una sola referència', 'Mercaderia que no caduca'], per: 'Els primers palets quedarien atrapats i caducarien.' },
    { id: 'cross', tema: ['cross'], nivell: 1, mag: ['cross'], web: 'almacen-funciones-tipos-zonas', titol: 'Cross-docking',
      text: 'En una plataforma de cross-docking la mercaderia no s\'emmagatzema: entra pel moll de recepció, es revisa, es classifica per destinació i surt el mateix dia pel moll del camió que va a cada botiga. Redueix l\'estoc, però exigeix rapidesa i coordinació amb els horaris dels camions.',
      p: 'Què caracteritza el cross-docking?', o: ['La mercaderia entra i surt el mateix dia sense ubicar-se', 'La mercaderia es guarda mesos', 'Només es fa picking per unitats', 'Tot és refrigerat'], per: 'És un magatzem de trànsit.' },
    { id: 'ecom', tema: ['caixa', 'picking'], nivell: 2, mag: ['ecom'], web: 'embalaje-paletizacion-unidades-carga', titol: 'Comerç electrònic: onades i embalatge',
      text: 'Al comerç electrònic hi ha moltes comandes petites. Per no caminar tant, se n\'agafen diverses alhora (picking per onades). Després cada comanda s\'embala en la caixa més petita on hi cap tot: una caixa massa gran gasta cartró i farciment i encareix el transport.',
      p: 'Per què es fa el picking per onades?', o: ['Per recórrer menys camí preparant diverses comandes alhora', 'Perquè els clients ho demanen', 'Per fer servir caixes més grans', 'Perquè és obligatori per llei'], per: 'Agrupar comandes redueix els recorreguts.' },
    { id: 'fredtemps', tema: ['fred'], nivell: 1, web: 'conservacion-perecederos-cadena-frio', titol: 'Temps fora del fred',
      text: 'Un refrigerat o un congelat que espera massa al moll s\'escalfa: s\'ha trencat la cadena de fred i s\'ha de llençar. Quan arriba un camió, revisa primer els productes de fred i, un cop acceptats, porta\'ls directament a la cambra abans de revisar la resta.',
      p: 'Arriba un camió amb secs i congelats. Què fas primer?', o: ['Revisar i ubicar els congelats', 'Ubicar els secs, que són més', 'Esperar que arribi un altre camió', 'Deixar-ho tot al moll'], per: 'Els productes de fred no poden esperar.' },
    { id: 'inventari', tema: ['inventari'], nivell: 5, web: 'inventarios-mermas-diferencias', titol: 'Inventari i punt de comanda',
      text: 'Al recompte, compta el que hi ha de veritat, no el que diu el sistema: la diferència s\'ajusta i se\'n busca la causa. Demana al proveïdor quan l\'estoc arriba al punt de comanda = consum diari × termini + estoc de seguretat.',
      p: 'Consum de 4 al dia, termini de 3 dies i seguretat de 2. Punt de comanda?', o: ['14', '12', '9', '7'], per: '4 × 3 + 2 = 14.' }
  ];
  L.forEach(l => { l.url = WEB + l.web + '/'; l.c = 0; });
  const API = { llicons: L, per: (id) => L.find(l => l.id === id),
    // Lliçons que toquen després d'un torn: les dels temes amb errors (i que encara no s'han respost bé)
    perErrors: (h, fetes, mag) => { const temes = new Set(h.errors.concat(h.greus).map(e => e[0])); return L.filter(l => (!l.mag || l.mag.includes(mag)) && l.tema.some(t => temes.has(t)) && l.nivell <= h.nivell && !(fetes[l.id] && fetes[l.id].ok)).sort((a, b) => (b.mag ? 1 : 0) - (a.mag ? 1 : 0)).slice(0, 2); },
    // Lliçons per començar un nivell (les del magatzem, primer)
    deNivell: (n, mag) => L.filter(l => (!l.mag || l.mag.includes(mag)) && (l.nivell === n || (n === 1 && l.mag && l.mag.includes(mag)))).filter(l => mag !== 'cross' || ['cross', 'recepcio', 'seguretat', 'transpalet'].includes(l.id)) };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.PLL = API;
})(typeof window !== 'undefined' ? window : globalThis);
