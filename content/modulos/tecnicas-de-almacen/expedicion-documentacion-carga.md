---
id: A_expedicion
titulo: "Expedición: documentos y orden de carga"
objetivo: "Preparar la documentación de salida y cargar el camión en el orden correcto."
orden: 18
codigos: ["5.5", "5.6"]
area: "Preparación de pedidos y expedición"
capitulo: "4"
capitulo_titulo: "Jefe de equipo"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "alegria", "texto": "¡Camión cargado! Primero metí lo de Vic, después Manlleu y al final Torelló."}]
  - [{"quien": "nexo", "gesto": "esceptico", "texto": "¿Y por dónde empieza el reparto?"}, {"quien": "eco", "gesto": "pensativo", "texto": "…Por Vic."}]
  - [{"quien": "nexo", "gesto": "paciencia", "texto": "Pues Vic tiene que ir al final, junto a la puerta. Lo primero que se descarga, lo último que se carga."}]
ejemplo: "En Palet, como jefe de equipo coordinas varios camiones con horas de salida distintas. Si el camión de las 12:00 sale sin un palé, la tienda lo recibirá un día tarde… y la jefa lo sabrá."
errores: ["Cargar el camión en el orden en que se prepararon los pedidos, no en el del reparto.", "Dejar salir el camión sin el albarán firmado o sin la carta de porte."]
test:
  - {"p": "El reparto empieza en Vic y termina en Torelló. ¿Qué se carga primero (al fondo del camión)?", "o": ["Lo de Vic", "Lo de Torelló", "Da igual", "Lo más ligero"], "c": 1, "por": "Lo último que se entrega es lo primero que se carga."}
  - {"p": "¿Qué documento acompaña el transporte internacional por carretera?", "o": ["El CMR", "El EAN", "El inventario", "La factura proforma"], "c": 0, "por": "Es la carta de porte internacional."}
  - {"p": "¿Quién firma el albarán de entrega?", "o": ["El preparador", "El cliente que recibe la mercancía", "El fabricante", "Nadie"], "c": 1, "por": "Acredita que la ha recibido."}
  - {"p": "¿Qué hay que evitar al cargar?", "o": ["Repartir el peso", "Sujetar la carga", "Superar la masa máxima autorizada del vehículo", "Cargar lo pesado abajo"], "c": 2, "por": "Es peligroso y está prohibido."}
---
Antes de salir, la mercancía se revisa contra el pedido y se prepara la <b>documentación</b>: el <b>albarán de entrega</b> (lo que se entrega; lo firma el cliente) y, en el transporte por carretera, la <b>carta de porte</b> o el <b>CMR</b> en el internacional (datos del remitente, del destinatario, del transportista y de la mercancía).

La <b>carga del vehículo</b> se planifica: el <b>orden inverso al de reparto</b> (lo que se entrega primero va al final, cerca de las puertas), el peso repartido y lo pesado abajo, la carga sujeta para que no se mueva, sin superar la masa máxima autorizada, y lo refrigerado en vehículo frigorífico. Cada camión tiene una <b>hora de salida</b>: si la mercancía no está lista en el muelle, el pedido se retrasa.
