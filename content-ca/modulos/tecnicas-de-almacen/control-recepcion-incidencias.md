---
id: A_control
titulo: "Control de la mercaderia i incidències"
objetivo: "Fer el control quantitatiu i qualitatiu i decidir què fer amb cada incidència."
orden: 5
codigos: ["2.2", "2.3"]
area: "Recepció de mercaderies"
capitulo: "1"
capitulo_titulo: "Mosso de magatzem"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "sorpresa", "texto": "Aquesta caixa està aixafada i els iogurts arriben a 12 °C…"}]
  - [{"quien": "nexo", "gesto": "senalando", "texto": "Dany i trencament de la cadena de fred: ho anotes i ho rebutges."}]
  - [{"quien": "eco", "gesto": "pensativo", "texto": "I si sobren caixes, me les quedo?"}, {"quien": "nexo", "gesto": "paciencia", "texto": "Tampoc: també és una incidència."}]
ejemplo: "A Palet, a la recepció decideixes caixa a caixa: acceptar, acceptar amb anotació o rebutjar. Acceptar un producte en mal estat acabarà en merma i en una bronca de la cap."
errores: ["Acceptar refrigerats sense mesurar la temperatura.", "Quedar-se els sobrants sense comunicar-los."]
test:
  - {"p": "Comptar els bults i comprovar el pes és un control…", "o": ["Qualitatiu", "Quantitatiu", "De qualitat", "Documental"], "c": 1, "por": "Mesura quantitats."}
  - {"p": "Els iogurts arriben a 11 °C. Què fas?", "o": ["Els acceptes i els poses ràpid a la cambra", "Anotes la incidència i els rebutges", "Els vens amb descompte", "Els guardes al magatzem normal"], "c": 1, "por": "S'ha trencat la cadena de fred."}
  - {"p": "Arriba una caixa més del que diu l'albarà. És…", "o": ["Una falta", "Un sobrant", "Un trencament", "Un error d'ubicació"], "c": 1, "por": "També es comunica al proveïdor."}
  - {"p": "Un producte arriba amb data de caducitat molt propera. Quin tipus de control ho detecta?", "o": ["Quantitatiu", "Qualitatiu", "D'inventari", "D'expedició"], "c": 1, "por": "Revisa l'estat i les condicions del producte."}
---
El <b>control quantitatiu</b> comprova les quantitats: bults, unitats, pesos. El <b>control qualitatiu</b> comprova l'estat: embalatge intacte, producte correcte (referència, format), data de caducitat suficient, temperatura dels refrigerats i congelats, etiquetatge.

Incidències habituals: <b>faltes</b> (arriba menys del que diu l'albarà), <b>sobrants</b> (arriba més o una cosa no demanada), <b>danys o trencaments</b>, <b>caducitat curta</b>, <b>temperatura incorrecta</b> i <b>referència equivocada</b>. Segons l'empresa, s'accepta amb reserves, es rebutja aquella part o tot l'enviament, i sempre es comunica al proveïdor i se'n deixa constància.
