---
id: A_codigos
titulo: "Codis de barres, etiquetes i traçabilitat"
objetivo: "Interpretar els codis EAN i GS1-128 i explicar per a què serveix la traçabilitat."
orden: 6
codigos: ["2.4", "8.2"]
area: "Recepció de mercaderies"
capitulo: "1"
capitulo_titulo: "Mosso de magatzem"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "confusion", "texto": "8 41 23456 78901 2… És la loteria?"}]
  - [{"quien": "nexo", "gesto": "guino", "texto": "És un EAN-13. El 84 és el prefix d'Espanya. I l'últim número comprova que s'hagi llegit bé."}]
  - [{"quien": "eco", "gesto": "sorpresa", "texto": "El codi parla!"}]
ejemplo: "A Palet, el lector de codis et diu el lot i la caducitat de cada caixa. Si un dia hi ha una alerta per un lot de maionesa, sabràs a quines botigues ha anat."
errores: ["Pensar que l'EAN indica on s'ha fabricat el producte: indica on es va registrar l'empresa.", "No registrar el lot: sense lot no hi ha traçabilitat."]
test:
  - {"p": "Quin prefix GS1 correspon a Espanya?", "o": ["84", "34", "76", "00"], "c": 0, "por": "Les empreses registrades a GS1 Espanya fan servir el 84."}
  - {"p": "Per a què serveix l'últim dígit de l'EAN-13?", "o": ["Indica el preu", "És un dígit de control que detecta errors de lectura", "Indica el país de fabricació", "És el número de lot"], "c": 1, "por": "Es calcula a partir dels altres dígits."}
  - {"p": "Quin codi identifica de manera única cada palet?", "o": ["EAN-13", "SSCC (en GS1-128)", "QR del producte", "Codi d'ubicació"], "c": 1, "por": "L'SSCC té 18 dígits i és únic per a cada unitat logística."}
  - {"p": "Hi ha una alerta sanitària per un lot de formatge. Què permet la traçabilitat?", "o": ["Retirar només aquell lot i saber a quins clients ha anat", "Retirar tots els formatges del mercat", "Canviar el preu", "Res"], "c": 0, "por": "Es localitza el lot exacte."}
---
L'<b>EAN-13</b> és el codi de barres de 13 dígits dels productes de consum: prefix de l'organització GS1 del país (84 per a Espanya), codi de l'empresa, codi del producte i un <b>dígit de control</b> que detecta errors de lectura.

El <b>GS1-128</b> es fa servir a les unitats logístiques (caixes i palets) i pot portar diverses dades amb <b>identificadors d'aplicació</b>: codi de l'article, <b>lot</b>, data de caducitat, quantitat o l'<b>SSCC</b> (codi únic de 18 dígits de cada palet). L'<b>RFID</b> són etiquetes amb xip que es llegeixen per radiofreqüència sense veure-les.

La <b>traçabilitat</b> permet saber d'on ve cada lot i a quins clients ha anat. És obligatòria en alimentació: si hi ha una alerta sanitària, es retira només el lot afectat.
