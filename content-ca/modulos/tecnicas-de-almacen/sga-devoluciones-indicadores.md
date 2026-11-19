---
id: A_sga
titulo: "SGM, devolucions i indicadors"
objetivo: "Conèixer les funcions d'un SGM, gestionar devolucions i mesurar el magatzem amb indicadors."
orden: 23
codigos: ["8.1", "8.3", "8.4"]
area: "Gestió informatitzada, traçabilitat i indicadors"
capitulo: "5"
capitulo_titulo: "Cap de magatzem"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "alegria", "texto": "Soc cap de magatzem! Com sé si ho fem bé?"}]
  - [{"quien": "nexo", "gesto": "senalando", "texto": "Amb indicadors: comandes a temps, errors de picking, trencaments, línies per hora…"}]
  - [{"quien": "nexo", "gesto": "guino", "texto": "I l'SGM te'ls dona cada dia. El que no es mesura no es millora."}]
ejemplo: "A Palet, al final de cada torn veus els teus indicadors: comandes a temps, errors, trencaments, incidents. La cap decideix amb aquests indicadors si t'ascendeix, t'avisa… o t'acomiada."
errores: ["Mesurar només la velocitat i oblidar els errors i la seguretat.", "Tornar a posar en estoc una devolució sense revisar-la."]
test:
  - {"p": "Què fa un SGM?", "o": ["Només la comptabilitat", "Controla ubicacions, estoc, lots i genera llistes de picking", "Condueix els carretons", "Fixa els preus"], "c": 1, "por": "És el cervell informàtic del magatzem."}
  - {"p": "Un client retorna un producte. Què fas?", "o": ["Posar-lo directament a la prestatgeria", "Revisar-lo i decidir: estoc, reparació, proveïdor o eliminació", "Llençar-lo sempre", "Vendre'l com a nou sense mirar-lo"], "c": 1, "por": "És logística inversa."}
  - {"p": "S'han preparat 400 línies i 8 tenien errors. Errors de picking?", "o": ["8 %", "2 %", "0,5 %", "20 %"], "c": 1, "por": "8 ÷ 400 = 0,02."}
  - {"p": "Quin indicador mesura la productivitat del picking?", "o": ["Línies preparades per hora", "Ocupació del magatzem", "Nombre de proveïdors", "Preu mitjà"], "c": 0, "por": "Relaciona feina i temps."}
---
Un <b>sistema de gestió de magatzem (SGM o WMS)</b> controla les ubicacions, les entrades i sortides, l'estoc en temps real, els lots i les caducitats, genera les llistes de picking i les rutes, i es comunica amb els <b>terminals de radiofreqüència</b> i els lectors de codis.

La <b>logística inversa</b> gestiona el que torna: devolucions de clients, producte defectuós, envasos i palets reutilitzables, residus. Cada devolució es rep, es revisa i es decideix: tornar a l'estoc, reparar, retornar al proveïdor o eliminar.

<b>Indicadors (KPI)</b> habituals: percentatge de <b>comandes lliurades a temps</b>, <b>errors de picking</b> (línies errònies ÷ línies preparades), <b>línies per hora</b> (productivitat), <b>trencaments i mermes</b>, <b>ocupació</b> del magatzem, <b>exactitud de l'inventari</b> i <b>rotació</b> de l'estoc.
