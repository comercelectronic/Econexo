---
id: A_ubicacion
titulo: "Ubicació fixa, caòtica i codis d'ubicació"
objetivo: "Llegir i fer servir els codis d'ubicació i comparar la ubicació fixa amb la caòtica."
orden: 2
codigos: ["1.4", "1.5"]
area: "Organització del magatzem"
capitulo: "1"
capitulo_titulo: "Mosso de magatzem"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "confusion", "texto": "«A-03-2-B»… És una matrícula?"}]
  - [{"quien": "nexo", "gesto": "senalando", "texto": "Passadís A, mòdul 3, nivell 2, posició B. És l'adreça exacta del producte."}]
  - [{"quien": "eco", "gesto": "alegria", "texto": "Com un carrer amb número i pis!"}]
ejemplo: "A Palet, al nivell de mosso treballes amb ubicació fixa i cada producte té el seu codi a la prestatgeria. Si deixes l'oli a B-02-1-A en lloc d'A-02-1-A, el preparador no el trobarà."
errores: ["Deixar el producte en una ubicació «semblant» perquè la correcta està ocupada, sense registrar-ho.", "Fer servir ubicació caòtica sense un sistema que guardi on és cada palet."]
test:
  - {"p": "Al codi B-05-3-A, què indica el 3?", "o": ["El passadís", "El mòdul", "El nivell (alçada)", "La posició"], "c": 2, "por": "Passadís-mòdul-nivell-posició."}
  - {"p": "Quin avantatge té la ubicació caòtica?", "o": ["No necessita informàtica", "Aprofita millor l'espai", "El personal recorda millor on és tot", "No hi ha mai errors"], "c": 1, "por": "Qualsevol buit lliure serveix."}
  - {"p": "Què necessita imprescindiblement la ubicació caòtica?", "o": ["Més personal", "Un sistema de gestió de magatzem que registri les ubicacions", "Prestatgeries més altes", "Carretons elèctrics"], "c": 1, "por": "Sense registre, ningú no sap on és cada producte."}
  - {"p": "Un magatzem petit amb poques referències i molta rotació del personal sol preferir…", "o": ["Ubicació fixa", "Ubicació caòtica", "No ubicar", "Ubicació per colors"], "c": 0, "por": "És més fàcil d'aprendre i no exigeix un SGM."}
---
Cada buit del magatzem té una <b>adreça</b>: el <b>codi d'ubicació</b>. El més habitual és <b>passadís - mòdul (o columna) - nivell (alçada) - posició</b>. Per exemple, <b>A-03-2-B</b> és el passadís A, el mòdul 3, el segon nivell i la posició B. El nivell 1 sol ser el de terra.

Amb <b>ubicació fixa</b>, cada producte té sempre el mateix lloc: és fàcil d'aprendre, però es desaprofita espai quan hi ha poc estoc. Amb <b>ubicació caòtica</b> (o lliure), el producte va al primer buit adequat i el sistema informàtic guarda on és: aprofita millor l'espai, però sense SGM és impossible trobar res. Molts magatzems combinen les dues: fixa per al picking i caòtica per a les reserves.
