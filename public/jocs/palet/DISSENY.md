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
