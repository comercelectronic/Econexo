---
id: A_stock
titulo: "Tipus d'estoc i punt de comanda"
objetivo: "Calcular l'estoc de seguretat i el punt de comanda per no quedar-se sense existències."
orden: 19
codigos: ["4.1"]
area: "Gestió d'estocs i inventaris"
capitulo: "5"
capitulo_titulo: "Cap de magatzem"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "sorpresa", "texto": "S'ha acabat l'oli i el proveïdor triga cinc dies!"}]
  - [{"quien": "nexo", "gesto": "pensativo", "texto": "Havies d'haver demanat quan en quedaven unes quantes caixes: el punt de comanda."}]
  - [{"quien": "nexo", "gesto": "guino", "texto": "Consum diari × termini de lliurament + estoc de seguretat."}]
ejemplo: "Surten 20 caixes al dia, el proveïdor triga 5 dies i vols 30 caixes de seguretat: punt de comanda = 20 × 5 + 30 = 130 caixes. A Palet, com a cap de magatzem decideixes quan demanar."
errores: ["Esperar a quedar-se sense estoc per fer la comanda.", "No tenir en compte el termini de lliurament del proveïdor."]
test:
  - {"p": "Consum de 10 u/dia, termini de 4 dies, estoc de seguretat de 20 u. Punt de comanda?", "o": ["40", "60", "30", "24"], "c": 1, "por": "10 × 4 + 20 = 60 unitats."}
  - {"p": "Per a què serveix l'estoc de seguretat?", "o": ["Per tenir sempre el magatzem ple", "Per cobrir imprevistos (retards, pics de demanda)", "Per cobrar més car", "Per a l'inventari anual"], "c": 1, "por": "És una reserva."}
  - {"p": "Què és un trencament d'estoc?", "o": ["Un palet trencat", "Quedar-se sense existències quan un client les demana", "Un error d'inventari", "Una devolució"], "c": 1, "por": "Es perden vendes."}
  - {"p": "Quin problema té un estoc massa alt?", "o": ["Cap", "Diners immobilitzats, espai ocupat i més mermes", "Trencaments d'estoc", "Menys feina"], "c": 1, "por": "L'estoc també costa."}
---
<b>Estoc màxim</b>: el màxim que convé tenir (per espai i diners immobilitzats). <b>Estoc mínim</b>: per sota, hi ha risc de quedar-se sense. <b>Estoc de seguretat</b>: reserva per a imprevistos (una comanda gran, un retard del proveïdor). <b>Punt de comanda</b>: la quantitat a la qual cal fer la comanda perquè arribi abans d'acabar-se.

<b>Punt de comanda = consum mitjà diari × termini de lliurament (dies) + estoc de seguretat.</b>

Tenir poc estoc provoca <b>trencaments d'estoc</b> (comandes sense servir, clients perduts); tenir-ne massa immobilitza diners, ocupa espai i augmenta les mermes. L'objectiu és l'equilibri.
