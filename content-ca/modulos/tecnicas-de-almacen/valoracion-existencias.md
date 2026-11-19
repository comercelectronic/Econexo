---
id: A_valoracion
titulo: "Valoració d'existències: PMP i FIFO"
objetivo: "Valorar les sortides i l'estoc final amb el preu mitjà ponderat i amb FIFO."
orden: 21
codigos: ["4.3"]
area: "Gestió d'estocs i inventaris"
capitulo: "5"
capitulo_titulo: "Cap de magatzem"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "pensativo", "texto": "Vaig comprar farina a 2 € i després a 3 €. A quant m'ha costat la que he venut?"}]
  - [{"quien": "nexo", "gesto": "guino", "texto": "Depèn del mètode: preu mitjà ponderat o FIFO."}]
  - [{"quien": "eco", "gesto": "sorpresa", "texto": "Les matemàtiques també són al magatzem?"}]
ejemplo: "Tens 100 kg a 2 € i en compres 100 kg a 3 €. PMP = (200 + 300) ÷ 200 = 2,50 €/kg. Si en vens 120 kg: amb PMP costen 300 €; amb FIFO, 100 × 2 + 20 × 3 = 260 €."
errores: ["Valorar totes les sortides a l'últim preu de compra.", "Pensar que el mètode de valoració obliga a moure la mercaderia d'una manera determinada."]
test:
  - {"p": "Estoc: 50 u a 4 €. En compres 50 u a 6 €. PMP?", "o": ["4 €", "5 €", "6 €", "10 €"], "c": 1, "por": "(200 + 300) ÷ 100 = 5 €."}
  - {"p": "Amb FIFO, les sortides es valoren…", "o": ["Al preu més recent", "Al preu de les unitats més antigues", "A la mitjana", "Al preu de venda"], "c": 1, "por": "Primer surten (comptablement) les primeres que van entrar."}
  - {"p": "Amb les dades anteriors en vens 60 u. Cost amb FIFO?", "o": ["300 €", "260 €", "360 €", "240 €"], "c": 1, "por": "50 × 4 + 10 × 6 = 260 €."}
  - {"p": "Quin mètode NO admet el Pla General de Comptabilitat per valorar existències?", "o": ["PMP", "FIFO", "LIFO", "Cap d'ells"], "c": 2, "por": "El PGC del 2007 admet PMP i FIFO."}
---
Quan el mateix producte es compra a preus diferents, cal decidir a quin cost surten les unitats i quant val l'estoc. Els mètodes admesos pel Pla General de Comptabilitat són el <b>preu mitjà ponderat (PMP)</b> i el <b>FIFO</b>.

<b>PMP</b>: després de cada entrada es calcula el cost mitjà = (valor de l'estoc anterior + valor de l'entrada) ÷ (unitats totals), i les sortides es valoren a aquest preu. <b>FIFO</b>: les sortides es valoren al preu de les unitats més antigues.

Es registra a la <b>fitxa de magatzem</b> (entrades, sortides i existències, en unitats i en euros). No s'ha de confondre el mètode de valoració amb com es mou físicament la mercaderia (FEFO al magatzem).
