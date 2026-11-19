---
id: A_rutas
titulo: "Rutes de preparació"
objetivo: "Ordenar les línies d'una comanda per fer el recorregut més curt."
orden: 12
codigos: ["5.3"]
area: "Preparació de comandes i expedició"
capitulo: "2"
capitulo_titulo: "Preparador de comandes"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "sorpresa", "texto": "He anat del passadís A al D, tornada a l'A, després al C…"}]
  - [{"quien": "nexo", "gesto": "paciencia", "texto": "Ordena les línies per ubicació i recorre els passadissos una sola vegada."}]
  - [{"quien": "eco", "gesto": "alegria", "texto": "Menys passos, més comandes!"}]
ejemplo: "A Palet, el rellotge corre: si vas d'un extrem a l'altre sense ordre, no arribes al camió. Ordenar les línies per passadís t'estalvia minuts a cada comanda."
errores: ["Seguir l'ordre en què el client va escriure la comanda en lloc de l'ordre de les ubicacions.", "Agafar els refrigerats al principi del recorregut."]
test:
  - {"p": "On es perd més temps en el picking?", "o": ["Imprimint la llista", "Caminant entre ubicacions", "Escanejant", "Signant l'albarà"], "c": 1, "por": "Per això s'optimitzen les rutes."}
  - {"p": "Quins productes s'agafen al final del recorregut?", "o": ["Els més pesants", "Els fràgils i els refrigerats", "Els més barats", "Els de la prestatgeria més alta"], "c": 1, "por": "Així no es trenquen ni s'escalfen."}
  - {"p": "A la ruta en S…", "o": ["Es recorren els passadissos amb comandes fent ziga-zaga", "Es torna sempre a l'inici", "S'agafa un producte per viatge", "No es fan servir passadissos"], "c": 0, "por": "S'entra a cada passadís i se surt per l'altre extrem."}
  - {"p": "Com cal ordenar les línies de la llista de picking?", "o": ["Alfabèticament", "Per ubicació, seguint la ruta", "Per preu", "Com les va escriure el client"], "c": 1, "por": "Així el recorregut és més curt."}
---
La major part del temps de picking es perd <b>caminant</b>. Per això la llista s'ordena per <b>ubicació</b> i se segueix una ruta: <b>en S</b> (s'entra a cada passadís amb comandes i es recorre sencer, fent ziga-zaga), <b>de retorn</b> (s'entra i es torna pel mateix costat) o la ruta més curta que calculi l'SGM.

Altres regles: començar pels productes <b>pesants i resistents</b> (van a baix al palet) i acabar pels <b>fràgils</b> i els <b>refrigerats</b> (perquè siguin fora del fred el mínim temps possible); tenir els productes de més rotació a prop de l'expedició.
