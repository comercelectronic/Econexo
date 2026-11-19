---
id: A_recepcion
titulo: "La recepción: pedido, albarán y registro"
objetivo: "Relacionar el pedido, el albarán y la factura y registrar la entrada de mercancía."
orden: 4
codigos: ["2.1", "2.5"]
area: "Recepción de mercancías"
capitulo: "1"
capitulo_titulo: "Mozo de almacén"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "alegria", "texto": "¡Ha llegado el camión! Firmo el albarán y listo."}]
  - [{"quien": "nexo", "gesto": "esceptico", "texto": "¿Sin contar las cajas? Si falta algo, ya has firmado que está todo."}]
  - [{"quien": "nexo", "gesto": "guino", "texto": "Primero comprueba, después firma. Y anota lo que no cuadre."}]
ejemplo: "En Palet, en cada recepción tienes el albarán en pantalla. Si firmas sin revisar y faltaban dos cajas, el error será tuyo en el inventario."
errores: ["Firmar el albarán sin haber contado ni revisado la mercancía.", "Ubicar la mercancía sin registrarla: para el sistema no existe."]
test:
  - {"p": "¿Qué documento firma el almacén al recibir la mercancía?", "o": ["El pedido", "El albarán", "La factura", "El inventario"], "c": 1, "por": "Acredita la entrega."}
  - {"p": "Faltan dos cajas. ¿Qué haces?", "o": ["Firmas y ya lo reclamarás", "Anotas la falta en el albarán antes de firmar y avisas", "Rechazas todo el camión", "Lo apuntas en una libreta"], "c": 1, "por": "Las reservas en el albarán son la prueba."}
  - {"p": "¿Con qué documento se compara el albarán para saber si llega lo que se pidió?", "o": ["Con la factura", "Con el pedido", "Con el inventario anual", "Con la carta de porte"], "c": 1, "por": "El pedido es lo que se solicitó."}
  - {"p": "¿Qué dato NO hace falta registrar en la entrada de un yogur?", "o": ["Lote", "Fecha de caducidad", "Cantidad", "Precio de venta al público"], "c": 3, "por": "El PVP es una decisión comercial, no de la recepción."}
---
Tres documentos acompañan la compra: el <b>pedido</b> (lo que la empresa pidió al proveedor), el <b>albarán</b> (lo que el proveedor dice que entrega; lo firma quien recibe) y la <b>factura</b> (lo que hay que pagar). En la recepción se comprueba que el albarán coincide con el pedido y con lo que realmente llega.

Al firmar el albarán, el almacén acepta la mercancía: si hay faltas o daños, hay que <b>anotarlo en el albarán</b> antes de firmar (reservas) y avisar al proveedor. Después se hace el <b>registro de entrada</b> en el sistema: referencia, cantidad, lote, fecha de caducidad, ubicación. Desde ese momento el stock está disponible para vender.
