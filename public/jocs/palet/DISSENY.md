# Palet · el joc del magatzem (disseny)

Simulador del mòdul **Tècniques de magatzem** (CFGM Activitats Comercials), en català, amb l'estil de Mercadeja:
vista des de dalt, un treballador que es mou pel magatzem i torns de feina amb el rellotge en marxa.

## Bucle de joc
1. **Briefing del torn** (matí): la cap (la Montse) explica la feina del dia: camions que arriben, comandes i hora de sortida dels camions.
2. **Torn** (temps real, uns 5 minuts; ×2 i ×3): el treballador fa les tasques.
   - **Recepció**: el camió del proveïdor deixa les càrregues al moll. Per a cada càrrega: inspeccionar (albarà, EAN, lot, caducitat,
     temperatura, estat) i **acceptar o rebutjar** amb el motiu (dany, caducitat curta, temperatura, referència equivocada, sobrant).
   - **Ubicació**: portar cada càrrega acceptada a la ubicació que indica l'SGM (codi passadís-mòdul-nivell-posició) i triar el nivell.
     Criteris: pes (pesat a baix), fràgil (sense res a sobre), fred (cambra), perillós (zona de perillosos), compatibilitat.
   - **Picking**: llista de comanda (referència, ubicació, quantitat). Triar el lot **FEFO**, ordenar el recorregut, muntar el palet
     (pesat a baix, fràgil a dalt) i deixar-lo al **moll del camió** abans de l'hora de sortida.
   - **Expedició** (nivell 4): diversos camions; ordre de càrrega invers al de repartiment.
   - **Gestió** (nivell 5): recompte cíclic, diferències d'inventari, punt de comanda, devolucions.
3. **Resultat del torn** (vespre): KPI (comandes a temps, errors de picking, ubicacions errònies, trencaments i mermes, incidents de seguretat,
   temps), explicació de cada error i **valoració de la cap**.

## La cap
- Cada torn dona una nota (0-100) de **productivitat**, **qualitat** i **seguretat**.
- Errors greus (accident, acceptar producte en mal estat, tapar una sortida d'emergència, camió que surt sense comanda) → **bronca**.
- 3 avisos seguits sense un torn bo → **acomiadament** (es pot tornar a començar el nivell).
- Bons torns seguits → **ascens** al nivell següent.

## Nivells (carrera)
1. Mosso de magatzem: recepció i ubicació, transpalet manual, nivells 1-2.
2. Preparador de comandes: picking FEFO, rutes, paletització, un camió amb hora límit.
3. Carretoner: toro (nivells 3-4, diagrama de càrrega), cambra de fred, perillosos.
4. Cap d'equip: diversos camions i ordre de càrrega.
5. Cap de magatzem: inventari cíclic, punt de comanda, devolucions, indicadors.

## Arquitectura (com Mercadeja)
- `js/data.js` productes, ubicacions, nivells, textos de la cap.
- `js/engine.js` motor determinista (llavor): genera cada torn i puntua el registre d'accions.
- `js/escena.js` magatzem en temps real (agents DOM, camins pels passadissos).
- `js/ui.js` pantalles. `js/llicons.js` lliçons dins del joc lligades al temari.
- Lliçons de la web: `content*/modulos/tecnicas-de-almacen` (camp `capitulo` = nivell).

## Capa d'habilitat física (taller i mode habilitat)
Amplia les tasques existents sense substituir-les (`js/habilitat.js`, `js/vehicles.js`, `js/taller.js`; físiques 2D amb Matter.js a `js/vendor`).
- **Propietats físiques** de cada producte (`PH.prop`): pes, fragilitat, impacte que aguanta (m/s), pes màxim a sobre, estabilitat,
  mides, inclinació màxima, «sempre dret», conservació i si cal una mà, dues o un mitjà mecànic (> 25 kg).
- **Manipulació manual** (vista lateral): dues mans independents amb força limitada (el que pesa necessita les dues), canell per girar i
  inclinar, detecció de cops, aixafaments (pes a sobre) i bolcades; col·locació en una zona i orientació.
- **Transpalet i toro** (vista des de dalt + vista lateral): acceleració i frenada segons el pes, direcció (el toro gira amb la roda del
  darrere), forquilles que s'han d'alinear i introduir a l'alçada de l'obertura, bomba / elevació, inclinació del pal, bigues a cada nivell,
  estabilitat de la càrrega (rellisca amb girs i frenades bruscos i cau), bolcada del toro, cops contra prestatgeries i palets, precisió.
- **Taller d'habilitat**: la prova de validació (caixa, ampolla, ous, extracció, palet mixt amb transpalet, toro en alçada) amb nota.
- **Mode habilitat** del torn (`config.habilitat`: `delicades` · `totes` · `off`): en ubicar i en fer el picking s'obre la maniobra física,
  generada a partir de l'estat real (estoc del passadís, palet de la comanda). El rellotge del torn s'atura durant la maniobra i el
  resultat (`res.habilitat`) entra a l'informe de la cap: mermes, cops forts, bolcades i palets caiguts (greus).
