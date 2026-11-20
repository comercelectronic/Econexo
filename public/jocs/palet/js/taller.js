/* Palet · Taller d'habilitat: exercicis de manipulació manual, extracció, transpalet i toro (prova de validació de la capa física). */
(function () {
  const PH = window.PH, esc = PH.esc;
  const KEY = 'palet-taller-v1';
  const llegeix = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } };
  const desa = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { } };

  // Mapa comú dels exercicis de vehicles: moll de recepció a l'esquerra, dues files de prestatgeries i un passadís
  const mapaBase = (extra) => Object.assign({
    zones: [{ x: 20, y: 170, w: 240, h: 220, nom: 'Moll de recepció' }],
    linies: [[370, 130, 960, 130], [370, 386, 960, 386]],
    files: [{ pas: 'A', x0: 380, y: 60, n: 9, cara: 1 }, { pas: 'B', x0: 380, y: 400, n: 9, cara: -1 }],
    parets: [{ x: 560, y: 246, w: 18, h: 18, tipus: 'columna', nom: 'una columna' }, { x: 300, y: 0, w: 20, h: 150, nom: 'la paret del moll' }, { x: 300, y: 410, w: 20, h: 150, nom: 'la paret del moll' }]
  }, extra);

  PH.EXERCICIS = [
    { id: 'manual', icona: '✋', nom: 'Prepara una comanda a mà', fase: 'Manipulació manual', desc: 'Passa una caixa, una ampolla de vidre i una capsa d\'ous a la caixa de la comanda. Les mans, una a una: el que pesa, amb les dues.',
      obre: (fi) => PH.manual({
        titol: 'Prepara una comanda a mà',
        consigna: 'Passa els tres productes a la <b>caixa de la comanda</b>. L\'ampolla, dreta. Els ous, a dalt de tot: no aguanten pes.',
        estatics: [{ x: 60, y: 380, w: 880, h: 18, tipus: 'taula' }, { x: 110, y: 262, w: 12, h: 118, tipus: 'caixa' }, { x: 420, y: 262, w: 12, h: 118, tipus: 'caixa' }, { x: 600, y: 270, w: 12, h: 110, tipus: 'caixa' }, { x: 872, y: 270, w: 12, h: 110, tipus: 'caixa' }],
        zones: { comanda: { x: 612, y: 180, w: 260, h: 200, nom: 'a la caixa de la comanda', etiqueta: 'Caixa de la comanda' } },
        objectes: [{ id: 'p_caixa', x: 190, y: 349, desti: 'comanda' }, { id: 'p_ampolla', x: 290, y: 347, desti: 'comanda' }, { id: 'p_ous', x: 360, y: 372, desti: 'comanda' }],
        consell: 'Primer el que pesa i aguanta (a baix), després l\'ampolla dreta i, a dalt de tot, el que és delicat. Mou el fràgil a poc a poc i no el deixis caure.'
      }, fi) },
    { id: 'extraccio', icona: '🍷', nom: 'Extreu una ampolla de vidre', fase: 'Extracció i col·locació', desc: 'Treu l\'ampolla de vi del mig de la caixa sense tocar les del costat i deixa-la dreta al prestatge.',
      obre: (fi) => PH.manual({
        titol: 'Extreu una ampolla de vidre',
        consigna: 'Treu l\'<b>ampolla del mig</b> (la verda) sense colpejar les altres i deixa-la <b>dreta al prestatge</b>. Les parets de la caixa són altes: puja recte.',
        estatics: [{ x: 60, y: 380, w: 880, h: 18, tipus: 'taula' }, { x: 150, y: 240, w: 12, h: 140, tipus: 'caixa' }, { x: 300, y: 240, w: 12, h: 140, tipus: 'caixa' }, { x: 640, y: 220, w: 260, h: 12, tipus: 'prestatge' }, { x: 890, y: 130, w: 10, h: 90, tipus: 'prestatge' }],
        zones: { prestatge: { x: 640, y: 120, w: 250, h: 100, nom: 'al prestatge', etiqueta: 'Prestatge' } },
        objectes: [{ id: 'p_llauna', x: 172, y: 368 }, { id: 'p_vi', x: 192, y: 347 }, { id: 'p_ampolla', x: 211, y: 347, desti: 'prestatge' }, { id: 'p_vi', x: 230, y: 347 }, { id: 'p_vi', x: 249, y: 347 }, { id: 'p_llauna', x: 272, y: 368 }, { id: 'p_llauna', x: 290, y: 368 }],
        consell: 'Per extreure un producte d\'una caixa plena: agafa\'l per dalt, puja\'l recte i a poc a poc fins que surti del tot, i només llavors el desplaces.'
      }, fi) },
    { id: 'transpalet', icona: '🛒', nom: 'Ubica un palet amb transpalet', fase: 'Transpalet manual', desc: 'Introdueix les forquilles al palet del moll, aixeca\'l amb la bomba i deixa\'l a B-05 (a terra), entre dos palets.',
      obre: (fi) => PH.vehicle({
        vehicle: 'transpalet', titol: 'Ubica un palet amb transpalet',
        consigna: 'Agafa el palet del moll (alinea les forquilles i <b>empeny</b> fins al fons, bomba amb <b>E</b>) i deixa\'l a <b>B-05</b>, a terra. Baixa\'l amb <b>Q</b>.',
        mapa: mapaBase({
          inici: { x: 250, y: 280, a: 0 },
          palets: [{ x: 120, y: 280, a: 0, objectiu: true, prods: ['aigua', 'aigua', 'oli', 'oli', 'arros', 'pasta', 'tomaquet', 'galetes', 'vi', 'ous', 'melmelada', 'llet'] },
            { bay: 'B-04', prods: ['sucre', 'sucre', 'sucre', 'sucre'] }, { bay: 'B-06', prods: ['detergent', 'detergent', 'lleixiu', 'lleixiu'] }, { bay: 'A-02', prods: ['pasta', 'arros', 'pasta', 'arros'] }]
        }),
        desti: { bay: 'B-05', nivell: 1 },
        consell: 'Amb un transpalet carregat, arrenca i frena a poc a poc: el pes no s\'atura de cop. Estira per desplaçar-te i empeny només per entrar a la ubicació, ben alineat.'
      }, fi) },
    { id: 'toro', icona: '🚜', nom: 'Ubica un palet en alçada amb el toro', fase: 'Carretó elevador', desc: 'Agafa el palet, circula amb les forquilles baixes i el pal enrere, i deixa\'l a A-03, nivell 3 (2,6 m).',
      obre: (fi) => PH.vehicle({
        vehicle: 'toro', titol: 'Ubica un palet en alçada amb el toro',
        consigna: 'Agafa el palet (forquilles a l\'alçada de l\'obertura, 5-10 cm), circula baix i amb el pal enrere, i deixa\'l a <b>A-03, nivell 3</b>. Puja (<b>R</b>) davant la prestatgeria, entra, baixa (<b>F</b>) i surt.',
        mapa: mapaBase({
          inici: { x: 340, y: 280, a: Math.PI },
          parets: [{ x: 760, y: 246, w: 18, h: 18, tipus: 'columna', nom: 'una columna' }, { x: 300, y: 0, w: 20, h: 150, nom: 'la paret del moll' }, { x: 300, y: 410, w: 20, h: 150, nom: 'la paret del moll' }],
          palets: [{ x: 150, y: 280, a: 0, objectiu: true, prods: ['aigua', 'aigua', 'aigua', 'aigua', 'arros', 'arros', 'galetes', 'galetes', 'vi', 'vi'] },
            { bay: 'A-02', nivell: 3, prods: ['pasta', 'pasta', 'arros', 'arros'] }, { bay: 'A-04', nivell: 3, prods: ['oli', 'oli', 'tomaquet', 'tomaquet'] }, { bay: 'A-03', nivell: 1, prods: ['sucre', 'sucre', 'sucre', 'sucre'] }, { bay: 'B-03', prods: ['detergent', 'detergent', 'lleixiu', 'lleixiu'] }]
        }),
        desti: { bay: 'A-03', nivell: 3 },
        consell: 'Regla d\'or del carretoner: circula amb la càrrega a 15-20 cm del terra i el pal inclinat enrere; puja-la només quan siguis davant de la prestatgeria i aturat. Gira sempre a poc a poc.'
      }, fi) }
  ];

  // Pàgina del taller
  PH.taller = function (app, onTorna, onNota) {
    const d = llegeix();
    app.innerHTML = `<main class="config taller"><button class="btn ghost small" id="enr">← Tornar</button>
      <h1>🎯 Taller d'habilitat</h1>
      <p class="muted">Practica la feina física del magatzem: manipular amb les mans, extreure i col·locar productes delicats, i conduir el transpalet i el toro amb la càrrega. Aquí la precisió i la cura compten més que la velocitat.</p>
      <div class="exercicis">${PH.EXERCICIS.map((x, i) => { const r = d[x.id]; return `<button class="niv exer" data-x="${i}"><span class="ex-ic">${x.icona}</span><b>${esc(x.nom)}</b><span class="small muted">${esc(x.fase)}</span><span class="small">${esc(x.desc)}</span>${r ? `<span class="ex-nota ${r.nota >= 65 ? 'pos' : 'neg'}">Millor nota: <b>${r.nota}</b>/100</span>` : '<span class="ex-nota muted">Encara no l\'has fet</span>'}</button>`; }).join('')}</div>
      <section class="ex-props"><h2>Propietats dels productes</h2><p class="small muted">Cada producte es comporta segons el seu pes, fragilitat, resistència a la pressió i estabilitat.</p>
      <div class="taula-w"><table class="t"><thead><tr><th>Producte</th><th class="n">Pes</th><th>Fragilitat</th><th class="n">Aguanta un cop de</th><th class="n">Pes a sobre màx.</th><th>Altres</th></tr></thead><tbody>
      ${['p_caixa', 'p_ampolla', 'p_ous', 'p_sac'].map(id => { const p = PH.prop(id); return `<tr><td>${esc(p.nom)}</td><td class="n">${p.pes} kg</td><td>${PH.fragilitatTxt(p)}</td><td class="n">${p.impacte} m/s</td><td class="n">${p.pressio} kg</td><td class="small">${[p.mans === 2 ? 'dues mans' : p.mans === 0 ? 'mitjà mecànic' : 'una mà', p.dreta ? 'sempre dret' : '', p.inclinacio ? 'màx. ' + p.inclinacio + '° d\'inclinació' : ''].filter(Boolean).join(' · ')}</td></tr>`; }).join('')}
      </tbody></table></div></section></main>`;
    app.querySelector('#enr').onclick = onTorna;
    app.querySelectorAll('[data-x]').forEach(b => b.onclick = () => {
      const x = PH.EXERCICIS[+b.dataset.x];
      x.obre((r) => {
        if (r) { const dd = llegeix(); if (!dd[x.id] || r.nota > dd[x.id].nota) dd[x.id] = { nota: r.nota, data: Date.now() }; desa(dd); onNota && onNota(x.id, r.nota); }
        PH.taller(app, onTorna, onNota);
      });
    });
  };
})();
