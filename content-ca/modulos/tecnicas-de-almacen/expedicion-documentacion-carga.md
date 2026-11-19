---
id: A_expedicion
titulo: "Expedició: documents i ordre de càrrega"
objetivo: "Preparar la documentació de sortida i carregar el camió en l'ordre correcte."
orden: 18
codigos: ["5.5", "5.6"]
area: "Preparació de comandes i expedició"
capitulo: "4"
capitulo_titulo: "Cap d'equip"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "alegria", "texto": "Camió carregat! Primer hi he posat el de Vic, després Manlleu i al final Torelló."}]
  - [{"quien": "nexo", "gesto": "esceptico", "texto": "I per on comença el repartiment?"}, {"quien": "eco", "gesto": "pensativo", "texto": "…Per Vic."}]
  - [{"quien": "nexo", "gesto": "paciencia", "texto": "Doncs Vic ha d'anar al final, a tocar de la porta. El primer que es descarrega, l'últim que es carrega."}]
ejemplo: "A Palet, com a cap d'equip coordines diversos camions amb hores de sortida diferents. Si el camió de les 12:00 surt sense un palet, la botiga el rebrà un dia tard… i la cap ho sabrà."
errores: ["Carregar el camió en l'ordre en què es van preparar les comandes, no en el del repartiment.", "Deixar sortir el camió sense l'albarà signat o sense la carta de port."]
test:
  - {"p": "El repartiment comença a Vic i acaba a Torelló. Què es carrega primer (al fons del camió)?", "o": ["El de Vic", "El de Torelló", "Tant és", "El més lleuger"], "c": 1, "por": "L'últim que es lliura és el primer que es carrega."}
  - {"p": "Quin document acompanya el transport internacional per carretera?", "o": ["El CMR", "L'EAN", "L'inventari", "La factura proforma"], "c": 0, "por": "És la carta de port internacional."}
  - {"p": "Qui signa l'albarà de lliurament?", "o": ["El preparador", "El client que rep la mercaderia", "El fabricant", "Ningú"], "c": 1, "por": "Acredita que l'ha rebuda."}
  - {"p": "Què cal evitar en carregar?", "o": ["Repartir el pes", "Subjectar la càrrega", "Superar la massa màxima autoritzada del vehicle", "Carregar el que pesa a baix"], "c": 2, "por": "És perillós i està prohibit."}
---
Abans de sortir, la mercaderia es revisa contra la comanda i es prepara la <b>documentació</b>: l'<b>albarà de lliurament</b> (el que es lliura; el signa el client) i, en el transport per carretera, la <b>carta de port</b> o el <b>CMR</b> en l'internacional (dades del remitent, del destinatari, del transportista i de la mercaderia).

La <b>càrrega del vehicle</b> es planifica: l'<b>ordre invers al del repartiment</b> (el que es lliura primer va al final, a prop de les portes), el pes repartit i el que pesa a baix, la càrrega subjecta perquè no es mogui, sense superar la massa màxima autoritzada, i el refrigerat en vehicle frigorífic. Cada camió té una <b>hora de sortida</b>: si la mercaderia no és a punt al moll, la comanda es retarda.
