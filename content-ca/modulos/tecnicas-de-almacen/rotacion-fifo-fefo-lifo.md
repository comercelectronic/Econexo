---
id: A_fefo
titulo: "Rotació de l'estoc: FIFO, FEFO i LIFO"
objetivo: "Aplicar FIFO i FEFO en preparar comandes per evitar caducats."
orden: 11
codigos: ["4.2"]
area: "Gestió d'estocs i inventaris"
capitulo: "2"
capitulo_titulo: "Preparador de comandes"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "alegria", "texto": "Agafo els iogurts del davant, que són els que acaben d'arribar."}]
  - [{"quien": "nexo", "gesto": "enfado", "texto": "I els del darrere caduquen demà! Primer surt el que caduca abans."}]
  - [{"quien": "nexo", "gesto": "guino", "texto": "Això és FEFO. I en reposar, el nou al darrere."}]
ejemplo: "A Palet, en fer picking de peribles el lector et mostra les dates de cada caixa. Si agafes la nova i deixes la vella, a final de setmana tindràs caducats i la cap preguntarà per què."
errores: ["Col·locar la mercaderia nova davant de l'antiga en reposar.", "Aplicar FIFO a productes amb dates de caducitat diferents de les d'entrada (hauria de ser FEFO)."]
test:
  - {"p": "Quin sistema fa sortir primer el que caduca abans?", "o": ["FIFO", "FEFO", "LIFO", "ABC"], "c": 1, "por": "First expired, first out."}
  - {"p": "En reposar llet, on va la nova?", "o": ["Davant de l'antiga", "Darrere o a sota de l'antiga", "A sobre de qualsevol altra", "En una altra ubicació sense registrar"], "c": 1, "por": "Així surt primer l'antiga."}
  - {"p": "Per a quina mercaderia pot servir LIFO?", "o": ["Iogurts", "Medicaments", "Sorra a granel que no caduca", "Pa"], "c": 2, "por": "Només si no caduca ni es deteriora."}
  - {"p": "Lot A: va entrar dilluns, caduca el dia 20. Lot B: va entrar dimarts, caduca el dia 15. Amb FEFO, quin surt primer?", "o": ["El lot A", "El lot B", "Tant és", "Tots dos alhora"], "c": 1, "por": "Caduca abans, encara que va entrar després."}
---
La <b>rotació</b> decideix quines unitats surten primer:

<b>FIFO</b> (<i>first in, first out</i>): surt primer el que va entrar primer. <b>FEFO</b> (<i>first expired, first out</i>): surt primer el que <b>caduca abans</b>, encara que hagi entrat després; és el criteri dels productes peribles i de l'alimentació. <b>LIFO</b> (<i>last in, first out</i>): surt primer l'últim que va entrar; només té sentit amb mercaderia que no caduca i s'apila (sorra, maons).

Perquè funcioni, en <b>reposar</b> es col·loca la mercaderia nova <b>darrere</b> o a sota de l'antiga, i en preparar s'agafa la de data més propera. Si no es respecta, el producte antic caduca i es converteix en <b>merma</b>.
