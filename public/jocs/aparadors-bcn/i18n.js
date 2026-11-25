/* Idioma del juego: castellano (base) o catalán.
   Los textos nuevos llevan {es, ca}; los textos antiguos escritos en castellano dentro de index.html
   se traducen al vuelo con este diccionario (fragmentos, del más largo al más corto).
   Para traducir más partes del juego basta con añadir pares [castellano, catalán]. */
window.I18N = (() => {
  const KEY = 'aparadors-barrio-v1';
  let lang = 'es';
  try { lang = JSON.parse(localStorage.getItem(KEY) || '{}').lang || 'es' } catch {}
  const CA = [
    // Cabecera y paseo
    ['Toca el suelo para caminar, una vitrina para visitarla o un vecino para hablar · WASD / flechas para moverte · E para entrar', 'Toca el terra per caminar, una vitrina per visitar-la o un veí per parlar-hi · WASD / fletxes per moure\'t · E per entrar'],
    ['Toca el suelo para caminar, una vitrina para visitarla o un vecino para hablar', 'Toca el terra per caminar, una vitrina per visitar-la o un veí per parlar-hi'],
    [' · WASD / flechas para moverte · E para entrar', ' · WASD / fletxes per moure\'t · E per entrar'],
    ['Paseo en perspectiva. Flechas para caminar, E para hablar o visitar.', 'Passeig en perspectiva. Fletxes per caminar, E per parlar o visitar.'],
    ['Barrio de los escaparates', 'Barri dels aparadors'], ['BARRIO DE LOS ESCAPARATES', 'BARRI DELS APARADORS'],
    ['La ciudad de los escaparates', 'La ciutat dels aparadors'],
    ['Cuaderno de resultados de aprendizaje', 'Quadern de resultats d\'aprenentatge'],
    ['E · Saludar al peatón', 'E · Saludar el vianant'], ['E · Hablar con ', 'E · Parlar amb '],
    ['Vista plana', 'Vista plana'], ['Paseo 3D', 'Passeig 3D'], ['3D no disponible', '3D no disponible'],
    ['Historia', 'Història'], ['Teoría', 'Teoria'], ['Plano', 'Plànol'], ['Cuaderno', 'Quadern'],
    [' encargos', ' encàrrecs'], ['ENCARGOS', 'ENCÀRRECS'], ['Volver a la calle', 'Tornar al carrer'],
    // Historia · La última vitrina
    ['Historia · La última vitrina', 'Història · La darrera vitrina'],
    ['Dos comercios, dos pruebas', 'Dos comerços, dues proves'], ['Reunir apoyos', 'Reunir suports'],
    ['La asamblea de comerciantes', 'L\'assemblea de comerciants'], ['La asamblea', 'L\'assemblea'], ['El acuerdo', 'L\'acord'],
    ['La oferta de Prisma', 'L\'oferta de Prisma'], ['La oferta', 'L\'oferta'],
    ['Una carta bajo la persiana', 'Una carta sota la persiana'],
    ['Joan despliega un contrato sobre el mostrador. Prisma Exterior quiere alquilar los escaparates de la calle y cubrirlos con pantallas idénticas. La votación es el domingo.', 'En Joan desplega un contracte sobre el taulell. Prisma Exterior vol llogar els aparadors del carrer i cobrir-los amb pantalles idèntiques. La votació és diumenge.'],
    ['«Lía, si quieres que rechace una renta fija, enséñame qué hará que la gente se pare aquí».', '«Lia, si vols que rebutgi una renda fixa, ensenya\'m què farà que la gent s\'aturi aquí».'],
    ['Buscar a Joan', 'Buscar en Joan'], ['Buscar a Ada', 'Buscar l\'Ada'], ['Buscar', 'Buscar'], ['Visitar', 'Visitar'],
    ['El ensayo de la calle', 'L\'assaig del carrer'],
    ['Diseña una vitrina para la cerería y otra para la tienda de discos. Entrega cada encargo y registra su ensayo frente a la pantalla de Prisma.', 'Dissenya una vitrina per a la cereria i una altra per a la botiga de discos. Lliura cada encàrrec i registra\'n l\'assaig davant la pantalla de Prisma.'],
    [' paradas frente a ', ' aturades davant de '], ['Registrar ensayo', 'Registrar assaig'], ['Pendiente', 'Pendent'],
    ['Prisma ha dejado su carta en cada tienda. Habla con los vecinos y responde a sus dudas con argumentos de escaparatismo. Necesitas ', 'Prisma ha deixat la seva carta a cada botiga. Parla amb els veïns i respon els seus dubtes amb arguments d\'aparadorisme. Necessites '],
    [' y escuchar a Ada antes de convocar la asamblea.', ' i escoltar l\'Ada abans de convocar l\'assemblea.'],
    ['✓ Te apoya', '✓ Et dona suport'], ['Indeciso', 'Indecís'], ['Analista de Prisma', 'Analista de Prisma'],
    ['✓ Debate escuchado', '✓ Debat escoltat'], ['Quiere hablar contigo', 'Vol parlar amb tu'],
    ['Informe de resultados', 'Informe de resultats'], ['✓ Listo para la asamblea', '✓ A punt per a l\'assemblea'],
    ['Falta calcular las ratios con Ada', 'Falta calcular les ràtios amb l\'Ada'], ['Primero, una promoción con Núria', 'Primer, una promoció amb la Núria'],
    ['Ver informe', 'Veure l\'informe'], ['Preparar', 'Preparar'], ['Convocar la asamblea', 'Convocar l\'assemblea'],
    ['Los comercios se reúnen en la plaza. Ada ha venido en nombre de Prisma a escuchar tus resultados. Lleva los dos ensayos y explica qué has medido.', 'Els comerços es reuneixen a la plaça. L\'Ada ha vingut en nom de Prisma a escoltar els teus resultats. Porta els dos assajos i explica què has mesurat.'],
    ['Las vitrinas se quedan', 'Les vitrines es queden'],
    [' comercios votan conservar sus escaparates. ', ' comerços voten conservar els aparadors. '],
    ['La calle crea un calendario común de campañas y una ruta de escaparates para los domingos.', 'El carrer crea un calendari comú de campanyes i una ruta d\'aparadors per als diumenges.'],
    ['Ha sido por poco: los indecisos quieren ver la próxima medición.', 'Ha anat per poc: els indecisos volen veure la propera mesura.'],
    [' Joan guarda el contrato sin firmar. Ada se lleva tu método de prueba y propone a Prisma colaborar con la calle en lugar de taparla.', ' En Joan desa el contracte sense signar. L\'Ada s\'endú el teu mètode de prova i proposa a Prisma col·laborar amb el carrer en lloc de tapar-lo.'],
    ['Sigue completando encargos: cada vitrina que montas es una prueba más.', 'Continua completant encàrrecs: cada vitrina que muntes és una prova més.'],
    ['«¿Qué le cuento a la asamblea?»', '«Què li explico a l\'assemblea?»'],
    ['Prisma promete más miradas. Hagamos dos ensayos con el mismo número de peatones: una cerería y una tienda de discos. Tú eliges los montajes.', 'Prisma promet més mirades. Fem dos assajos amb el mateix nombre de vianants: una cereria i una botiga de discos. Tu tries els muntatges.'],
    ['Aceptar el reto', 'Acceptar el repte'], ['Hablar del barrio', 'Parlar del barri'],
    ['¡Nuevo apoyo!', 'Nou suport!'], [' · Te falta escuchar a Ada', ' · Et falta escoltar l\'Ada'],
    ['Ayudar a Núria con una promoción (RA5)', 'Ajudar la Núria amb una promoció (RA5)'],
    ['Ver la campaña', 'Veure la campanya'], ['Seguir paseando', 'Continuar passejant'],
    ['Cara a cara con Prisma', 'Cara a cara amb Prisma'], ['Debate con Prisma', 'Debat amb Prisma'],
    ['Ada cierra su carpeta. «Tus argumentos se sostienen. Pero en la asamblea no bastan las palabras: tráeme las ratios de una promoción real y las presentaré yo misma».', 'L\'Ada tanca la carpeta. «Els teus arguments s\'aguanten. Però a l\'assemblea no n\'hi ha prou amb paraules: porta\'m les ràtios d\'una promoció real i les presentaré jo mateixa».'],
    ['Preparar el informe (RA6)', 'Preparar l\'informe (RA6)'], ['Antes de la asamblea', 'Abans de l\'assemblea'],
    ['Ya tenemos la calle de nuestra parte. Convoquemos la asamblea.', 'Ja tenim el carrer de la nostra banda. Convoquem l\'assemblea.'],
    ['Ada escuchada', 'Ada escoltada'], ['Ada pendiente', 'Ada pendent'], ['Informe listo', 'Informe a punt'], ['Informe pendiente', 'Informe pendent'],
    ['La votación', 'La votació'], ['«¿Qué prueban tus dos escaparates?»', '«Què proven els teus dos aparadors?»'],
    [' paradas de 40, frente a 16.', ' aturades de 40, davant de 16.'],
    ['Que las ventas han subido', 'Que les vendes han pujat'],
    ['Que captaron más atención en el ensayo, con el mismo número de peatones', 'Que van captar més atenció a l\'assaig, amb el mateix nombre de vianants'],
    ['Ada pide los tickets de compra. El ensayo solo contó paradas. ¿Qué conclusión sí puedes defender?', 'L\'Ada demana els tiquets de compra. L\'assaig només va comptar aturades. Quina conclusió sí que pots defensar?'],
    ['Ensayo de atención', 'Assaig d\'atenció'], ['Guardar resultado', 'Desar el resultat'],
    ['Argumento ', 'Argument '], [' de 2', ' de 2'], [' de 3', ' de 3'],
    [' apoyos', ' suports'], ['Artesano', 'Artesà'], ['Fotógrafa', 'Fotògrafa'], ['Barista', 'Barista'], ['Estilista', 'Estilista'],
    ['Diseñador de producto', 'Dissenyador de producte'], ['Conversación de barrio', 'Conversa de barri'],
    ['Una vecina del barrio', 'Una veïna del barri'], ['«¿Paseamos con otra mirada?»', '«Passegem amb una altra mirada?»'],
    ['Ruta de observación', 'Ruta d\'observació'], ['Aceptar la ruta', 'Acceptar la ruta'], ['Ruta completada', 'Ruta completada'],
    ['Recoger sello', 'Recollir segell'], ['Seguir explorando', 'Continuar explorant'], ['Pedir una pista', 'Demanar una pista'],
    // Editor de escaparates
    ['Taller de escaparatismo', 'Taller d\'aparadorisme'], ['Manual de escaparatismo', 'Manual d\'aparadorisme'],
    ['Temperatura', 'Temperatura'], ['Acabado 3D', 'Acabat 3D'], ['Fondo', 'Fons'], ['Suelo', 'Terra'], ['Textura', 'Textura'],
    ['Focos', 'Focus'], ['Intensidad', 'Intensitat'], ['Cálida', 'Càlida'], ['Neutra', 'Neutra'], ['Fría', 'Freda'],
    ['Desde la acera', 'Des de la vorera'], ['Ángulo desde la acera', 'Angle des de la vorera'], ['Volver al montaje', 'Tornar al muntatge'],
    ['Producto visible', 'Producte visible'], ['Asociación comercial', 'Associació comercial'], ['Jerarquía y aire', 'Jerarquia i aire'],
    ['Ritmo y alturas', 'Ritme i alçades'], ['Iluminación', 'Il·luminació'], ['Soporte y mensaje', 'Suport i missatge'], ['Viabilidad', 'Viabilitat'],
    ['Plano del barrio', 'Plànol del barri'], ['Cristal con reflejos', 'Vidre amb reflexos'], ['Paseo de estudio con Joan (RA4)', 'Passeig d\'estudi amb en Joan (RA4)'], ['Atardecer', 'Capvespre'], ['Noche', 'Nit'],
    ['Este navegador no ofrece aceleración 3D. Puedes continuar el montaje en el editor.', 'Aquest navegador no ofereix acceleració 3D. Pots continuar el muntatge a l\'editor.']
  ].sort((a, b) => b[0].length - a[0].length);

  function tr(s) {
    if (lang !== 'ca' || !s || !/[a-záéíóúñ]/i.test(s)) return s;
    let out = s;
    for (const [es, ca] of CA) if (out.includes(es)) out = out.split(es).join(ca);
    return out;
  }
  function walk(root) {
    const it = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode: n => n.parentNode && /^(SCRIPT|STYLE)$/.test(n.parentNode.nodeName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT});
    const nodes = []; while (it.nextNode()) nodes.push(it.currentNode);
    for (const n of nodes) { const t = tr(n.nodeValue); if (t !== n.nodeValue) n.nodeValue = t }
    if (root.querySelectorAll) root.querySelectorAll('[title],[aria-label],[placeholder]').forEach(el => {
      for (const a of ['title', 'aria-label', 'placeholder']) { const v = el.getAttribute(a); if (v) { const t = tr(v); if (t !== v) el.setAttribute(a, t) } }
    });
  }
  function start() {
    document.documentElement.lang = lang;
    const sel = document.createElement('select'); sel.id = 'langSel'; sel.title = 'Idioma / Llengua';
    sel.innerHTML = '<option value="es">ES · Castellano</option><option value="ca">CA · Català</option>'; sel.value = lang;
    sel.onchange = () => { if (typeof saved !== 'undefined') { saved.lang = sel.value; save() } location.reload() };
    (document.querySelector('.tools') || document.querySelector('header') || document.body).prepend(sel);
    if (lang !== 'ca') return;
    walk(document.body);
    new MutationObserver(ms => { for (const m of ms) { if (m.type === 'characterData') { const t = tr(m.target.nodeValue); if (t !== m.target.nodeValue) m.target.nodeValue = t } else m.addedNodes.forEach(n => n.nodeType === 3 ? (n.nodeValue = tr(n.nodeValue)) : n.nodeType === 1 && walk(n)) } })
      .observe(document.body, {childList: true, subtree: true, characterData: true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else setTimeout(start);
  return {tr, get lang() { return lang }};
})();
