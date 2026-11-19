---
id: A_recepcion
titulo: "La recepció: comanda, albarà i registre"
objetivo: "Relacionar la comanda, l'albarà i la factura i registrar l'entrada de mercaderia."
orden: 4
codigos: ["2.1", "2.5"]
area: "Recepció de mercaderies"
capitulo: "1"
capitulo_titulo: "Mosso de magatzem"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "alegria", "texto": "Ha arribat el camió! Signo l'albarà i llestos."}]
  - [{"quien": "nexo", "gesto": "esceptico", "texto": "Sense comptar les caixes? Si falta alguna cosa, ja has signat que hi és tot."}]
  - [{"quien": "nexo", "gesto": "guino", "texto": "Primer comprova, després signa. I anota el que no quadri."}]
ejemplo: "A Palet, a cada recepció tens l'albarà a la pantalla. Si signes sense revisar i faltaven dues caixes, l'error serà teu a l'inventari."
errores: ["Signar l'albarà sense haver comptat ni revisat la mercaderia.", "Ubicar la mercaderia sense registrar-la: per al sistema no existeix."]
test:
  - {"p": "Quin document signa el magatzem en rebre la mercaderia?", "o": ["La comanda", "L'albarà", "La factura", "L'inventari"], "c": 1, "por": "Acredita el lliurament."}
  - {"p": "Falten dues caixes. Què fas?", "o": ["Signes i ja ho reclamaràs", "Anotes la falta a l'albarà abans de signar i avises", "Rebutges tot el camió", "Ho apuntes en una llibreta"], "c": 1, "por": "Les reserves a l'albarà són la prova."}
  - {"p": "Amb quin document es compara l'albarà per saber si arriba el que es va demanar?", "o": ["Amb la factura", "Amb la comanda", "Amb l'inventari anual", "Amb la carta de port"], "c": 1, "por": "La comanda és el que es va sol·licitar."}
  - {"p": "Quina dada NO cal registrar a l'entrada d'un iogurt?", "o": ["Lot", "Data de caducitat", "Quantitat", "Preu de venda al públic"], "c": 3, "por": "El PVP és una decisió comercial, no de la recepció."}
---
Tres documents acompanyen la compra: la <b>comanda</b> (el que l'empresa va demanar al proveïdor), l'<b>albarà</b> (el que el proveïdor diu que lliura; el signa qui rep) i la <b>factura</b> (el que cal pagar). A la recepció es comprova que l'albarà coincideix amb la comanda i amb el que arriba de debò.

En signar l'albarà, el magatzem accepta la mercaderia: si hi ha faltes o danys, cal <b>anotar-ho a l'albarà</b> abans de signar (reserves) i avisar el proveïdor. Després es fa el <b>registre d'entrada</b> al sistema: referència, quantitat, lot, data de caducitat, ubicació. A partir d'aquest moment l'estoc està disponible per vendre.
