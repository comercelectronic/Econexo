---
id: A_sistemas
titulo: "Sistemes d'emmagatzematge"
objetivo: "Comparar els sistemes de prestatgeries i triar l'adequat segons el producte."
orden: 17
codigos: ["1.3"]
area: "Organització del magatzem"
capitulo: "3"
capitulo_titulo: "Carretoner"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "pensativo", "texto": "Per què en aquest magatzem les prestatgeries es mouen soles?"}]
  - [{"quien": "nexo", "gesto": "guino", "texto": "Són prestatgeries mòbils: obren només el passadís que necessites i n'hi caben moltes més."}]
  - [{"quien": "eco", "gesto": "sorpresa", "texto": "Com els arxius de les pel·lícules!"}]
ejemplo: "A Palet, el magatzem té prestatgeries convencionals i una cambra de fred amb prestatgeria dinàmica: el palet entra pel darrere i surt pel davant, així el FIFO és automàtic."
errores: ["Fer servir un sistema compacte amb moltes referències diferents: cal moure palets per arribar al que necessites.", "Apilar en bloc productes que no aguanten pes."]
test:
  - {"p": "Quin sistema garanteix el FIFO de manera natural?", "o": ["Compacte drive-in", "Dinàmic (per gravetat)", "Bloc", "Cantilever"], "c": 1, "por": "Entra per un costat i surt per l'altre."}
  - {"p": "Quin sistema dona accés directe a tots els palets?", "o": ["Convencional", "Compacte", "Mòbil", "Bloc"], "c": 0, "por": "Cada palet té accés des del passadís."}
  - {"p": "Per emmagatzemar tubs i barres llargues es fa servir…", "o": ["Prestatgeria dinàmica", "Cantilever", "Drive-in", "Prestatgeria de picking"], "c": 1, "por": "Té braços en voladís."}
  - {"p": "Molts palets de poques referències i poc espai. Quin sistema convé?", "o": ["Compacte", "Convencional", "Cantilever", "Picking manual"], "c": 0, "por": "Aprofita al màxim l'espai."}
---
<b>Convencional</b> (prestatgeries de palets amb un passadís per a cada fila): accés directe a tots els palets; ideal amb moltes referències. <b>Compacte</b> o <i>drive-in</i> (els carretons entren dins la prestatgeria): aprofita molt l'espai, però només per a poques referències amb molts palets iguals; funciona amb LIFO (o FIFO en la versió <i>drive-through</i>). <b>Dinàmic</b> (rodets inclinats per on els palets o les caixes llisquen): entren per un costat i surten per l'altre, ideal per a <b>FIFO</b> i peribles. <b>Mòbil</b> (les prestatgeries es desplacen sobre rails): molta capacitat, poc accés simultani. <b>Cantilever</b>: per a càrregues llargues (tubs, fustes). Per a caixes petites: prestatgeries de picking o de mitja càrrega.

També hi ha l'<b>emmagatzematge en bloc</b> (palets apilats a terra, sense prestatgeria) i els magatzems <b>automàtics</b> (transelevadors i robots).
