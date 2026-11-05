---
id: L_ecom
titulo: "Botiga en línia: conversió i abandonament"
objetivo: "Dissenyar una botiga que vengui, no només que sigui bonica."
orden: 14
codigos: ["2.1","2.2","3.11"]
area: "Web i comerç electrònic"
capitulo: "2.3"
capitulo_titulo: "La botiga que vol vendre a tot Catalunya"
estado: publicada
tira:
  - [{"quien":"eco","gesto":"alegria","texto":"2.000 visites a la meva botiga en línia!"}]
  - [{"quien":"nexo","gesto":"pensativo","texto":"I quantes compres?"},{"quien":"eco","gesto":"verguenza","texto":"30… molts se'n van en veure les despeses d'enviament."}]
  - [{"quien":"nexo","gesto":"paciencia","texto":"Conversió de l'1,5 %. Mostra els costos des del principi i facilita el pagament."}]
ejemplo: "Una botiga d'embotits mostra el cost de l'enviament refrigerat només al final. Quan el mostra a la fitxa i ofereix enviament gratuït a partir de 45 €, l'abandonament baixa (cas simulat)."
errores: ["Prioritzar l'estètica per sobre de la usabilitat.","Amagar costos fins al darrer pas.","Oblidar la logística i l'atenció al client."]
test:
  - {"p":"2.000 visites i 30 comandes. Quina és la conversió?","o":["15 %","1,5 %","0,15 %","6,6 %"],"c":1,"por":"30 ÷ 2.000 = 0,015 → 1,5 %."}
  - {"p":"Quina és una causa típica d'abandonament?","o":["Costos d'enviament que apareixen al final","Poques fotos de cada producte","No tenir xat a la web","Massa productes a la pàgina d'inici"],"c":0,"por":"Les sorpreses de preu al final fan desconfiar."}
  - {"p":"Per què cal calcular el marge per comanda?","o":["Per saber si cada venda deixa diners després de tots els costos","Per saber quant pots gastar en publicitat cada mes","Per fixar el preu final dels productes","Per calcular els impostos de cada venda"],"c":0,"por":"Pots vendre molt i perdre diners en cada comanda."}
  - {"p":"Cas real · Amazon. El 1999 va patentar la compra amb «1-Click»: comprar sense tornar a escriure adreça ni targeta. Quin problema de la botiga en línia resolia?","o":["El cost d'enviament","La fricció al pagament, que provoca abandonaments","La seguretat de les dades de targeta","La manca de fotos dels productes"],"c":1,"por":"Cada pas extra en el pagament és una oportunitat perquè el client abandoni."}
  - {"p":"Cas real · Zappos. Aquesta botiga en línia de sabates va oferir enviament i devolucions gratuïts, amb un termini de devolució d'un any. Per què?","o":["Per tenir més dades dels clients","Perquè la llei ho obligava als Estats Units","Per reduir el risc percebut de comprar sabates sense provar-les","Per vendre l'estoc retornat a un preu més alt"],"c":2,"por":"Treure la por a equivocar-se augmenta la conversió, encara que les devolucions tinguin un cost."}
---
La <b>taxa de conversió</b> és el percentatge de visites que acaben comprant. Si 1.000 persones visiten la botiga i 15 compren, la conversió és de l'1,5 %.

Les causes habituals d'<b>abandonament del carretó</b> són: costos d'enviament inesperats al final, obligació de crear un compte, pocs mètodes de pagament, dubtes sobre l'entrega i webs lentes al mòbil.

Una bona <b>fitxa de producte</b> respon les preguntes del comprador: què és, quant pesa, com es conserva, quan arriba, què passa si no m'agrada.

Cal calcular el <b>marge per comanda</b>: preu − cost del producte − enviament − comissions − cost d'adquisició.
