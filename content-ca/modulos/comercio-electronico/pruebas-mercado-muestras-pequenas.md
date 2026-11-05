---
id: L_experiments
titulo: "Proves de mercat i mostres petites"
objetivo: "No treure conclusions precipitades de poques dades."
orden: 49
codigos: ["1.1"]
area: "Analítica"
capitulo: "7.2"
capitulo_titulo: "La campanya internacional"
estado: publicada
tira:
  - [{"quien":"eco","gesto":"alegria","texto":"L'anunci A va vendre 2 i el B, 1! L'A és el doble de bo!"}]
  - [{"quien":"nexo","gesto":"esceptico","texto":"Amb tan poques vendes pot ser pura sort."},{"quien":"eco","gesto":"sorpresa","texto":"La sort també fa màrqueting?"}]
  - [{"quien":"nexo","gesto":"paciencia","texto":"Defineix el criteri abans de començar i espera a tenir prou dades."}]
ejemplo: "França: 12 vendes amb 1.000 €. Bèlgica: 4 vendes amb 300 €. El CPA és semblant (83 € vs 75 €); no hi ha prou dades per dir que Bèlgica és millor."
errores: ["Declarar guanyador després de dos dies.","Canviar diverses variables alhora.","No definir el criteri d'èxit abans."]
test:
  - {"p":"Anunci A: 2 vendes. Anunci B: 1 venda. Conclusió?","o":["A és el doble de bo que B","No hi ha prou dades","A és millor, però només una mica","Cal invertir tot el pressupost en A"],"c":1,"por":"Amb tan poques dades, la diferència pot ser atzar."}
  - {"p":"Quan defineixes el criteri d'èxit d'una prova?","o":["Abans de començar","A meitat de la prova, amb les primeres dades","Quan acaba la prova","Quan el client veu els resultats"],"c":0,"por":"Així evites interpretar les dades a conveniència."}
  - {"p":"Per comparar dos mercats…","o":["Fes servir el mateix indicador i període","Fes servir el mateix pressupost als dos","Compara el mercat que més ha venut","Fes servir indicadors diferents adaptats a cada mercat"],"c":0,"por":"Només així la comparació és justa."}
  - {"p":"Cas real · Google (2009). Per triar el blau dels enllaços, Google va provar 41 tons diferents amb usuaris reals. Per què una empresa petita no pot fer el mateix?","o":["Perquè les proves A/B són il·legals per a empreses petites","Perquè amb poques visites les diferències petites no són fiables","Perquè els colors no influeixen en els clics","Perquè cal pagar Google per fer proves"],"c":1,"por":"Google té milions de visites i pot detectar diferències mínimes. Amb poques dades, cal provar canvis grans."}
  - {"p":"Cas real · Booking.com. Té centenars d'experiments en marxa alhora i qualsevol canvi a la web s'ha de provar abans de quedar-se. Què n'aprens?","o":["Que cal canviar la web cada setmana","Que les opinions de l'equip no compten mai","Que les decisions es prenen amb proves i criteris fixats abans, no amb intuïcions","Que els experiments només serveixen a les agències de viatges"],"c":2,"por":"Una cultura d'experiments evita discussions d'opinió: guanya el que funciona amb el públic real."}
---
Una <b>prova de mercat</b> és una inversió petita per aprendre abans d'apostar fort. Defineix abans què mesuraràs i quin resultat et faria continuar.

Amb <b>mostres petites</b> l'atzar pesa molt: 3 vendes contra 1 no demostra que un mercat sigui el triple de bo. Cal un volum mínim de dades o repetir la prova.

Compara mercats amb el mateix indicador i el mateix període.
