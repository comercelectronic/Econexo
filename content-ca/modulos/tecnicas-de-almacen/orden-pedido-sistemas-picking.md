---
id: A_picking
titulo: "La comanda i els sistemes de picking"
objetivo: "Llegir una llista de picking i triar el sistema de preparació adequat."
orden: 10
codigos: ["5.1", "5.2"]
area: "Preparació de comandes i expedició"
capitulo: "2"
capitulo_titulo: "Preparador de comandes"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "alegria", "texto": "Comanda de la botiga de Vic: 6 olis, 12 llets, 4 caixes de galetes!"}]
  - [{"quien": "nexo", "gesto": "guino", "texto": "Llista de picking a la mà: referència, ubicació i quantitat. I ho marques en agafar-ho."}]
  - [{"quien": "eco", "gesto": "pensativo", "texto": "I si hi ha deu comandes alhora?"}, {"quien": "nexo", "gesto": "senalando", "texto": "Llavors pensa en onades."}]
ejemplo: "A Palet, com a preparador reps comandes de botigues amb diverses línies. Si t'equivoques de referència o de quantitat, la botiga es queixa i baixa la teva nota de qualitat."
errores: ["Agafar el producte «de memòria» sense comprovar la referència ni el codi.", "Preparar moltes comandes petites una a una quan es podrien agrupar."]
test:
  - {"p": "Quina informació té cada línia d'una llista de picking?", "o": ["Només el nom del client", "Referència, ubicació i quantitat", "El preu de compra", "El nom del transportista"], "c": 1, "por": "És el que necessita el preparador."}
  - {"p": "S'agrupen diverses comandes, es recull tot junt i després se separa per client. És picking…", "o": ["Per comanda", "Per onades (per lots)", "Per zones", "Mercaderia a persona"], "c": 1, "por": "Redueix els recorreguts."}
  - {"p": "En un magatzem automatitzat, la caixa ve sola fins al preparador. És…", "o": ["Persona a mercaderia", "Mercaderia a persona", "Picking per comanda", "Cross-docking"], "c": 1, "por": "El sistema porta el producte."}
  - {"p": "Què redueix els errors de picking?", "o": ["Anar més ràpid", "Escanejar el codi de cada producte en agafar-lo", "Preparar de memòria", "Treure les etiquetes"], "c": 1, "por": "El sistema avisa si no és el producte correcte."}
---
L'<b>ordre de comanda</b> del client es converteix en una <b>llista de picking</b> (full o terminal) amb cada <b>línia</b>: referència, descripció, <b>ubicació</b>, quantitat i, si cal, lot. El preparador recull cada línia, comprova (escanejant el codi) i marca el que ha preparat.

Sistemes de picking: <b>per comanda</b> (un preparador fa una comanda sencera; senzill, però molt recorregut), <b>per lots o onades</b> (s'agrupen diverses comandes i es recull tot junt, després se separa), <b>per zones</b> (cada preparador s'encarrega d'una zona i la comanda passa d'una a l'altra). També es distingeix <b>persona a mercaderia</b> (el preparador va a la prestatgeria) i <b>mercaderia a persona</b> (la prestatgeria o la caixa ve al preparador, en magatzems automatitzats).
