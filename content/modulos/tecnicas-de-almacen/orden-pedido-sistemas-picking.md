---
id: A_picking
titulo: "El pedido y los sistemas de picking"
objetivo: "Leer una lista de picking y elegir el sistema de preparación adecuado."
orden: 10
codigos: ["5.1", "5.2"]
area: "Preparación de pedidos y expedición"
capitulo: "2"
capitulo_titulo: "Preparador de pedidos"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "alegria", "texto": "¡Pedido de la tienda de Vic: 6 aceites, 12 leches, 4 cajas de galletas!"}]
  - [{"quien": "nexo", "gesto": "guino", "texto": "Lista de picking en mano: referencia, ubicación y cantidad. Y lo marcas al cogerlo."}]
  - [{"quien": "eco", "gesto": "pensativo", "texto": "¿Y si hay diez pedidos a la vez?"}, {"quien": "nexo", "gesto": "senalando", "texto": "Entonces piensa en oleadas."}]
ejemplo: "En Palet, como preparador recibes pedidos de tiendas con varias líneas. Si te equivocas de referencia o de cantidad, la tienda se queja y baja tu nota de calidad."
errores: ["Coger el producto «de memoria» sin comprobar la referencia ni el código.", "Preparar muchos pedidos pequeños uno a uno cuando se podrían agrupar."]
test:
  - {"p": "¿Qué información tiene cada línea de una lista de picking?", "o": ["Solo el nombre del cliente", "Referencia, ubicación y cantidad", "El precio de compra", "El nombre del transportista"], "c": 1, "por": "Es lo que necesita el preparador."}
  - {"p": "Se agrupan varios pedidos, se recoge todo junto y después se separa por cliente. Es picking…", "o": ["Por pedido", "Por oleadas (por lotes)", "Por zonas", "Mercancía a hombre"], "c": 1, "por": "Reduce los recorridos."}
  - {"p": "En un almacén automatizado, la caja viene sola hasta el preparador. Es…", "o": ["Hombre a mercancía", "Mercancía a hombre", "Picking por pedido", "Cross-docking"], "c": 1, "por": "El sistema trae el producto."}
  - {"p": "¿Qué reduce los errores de picking?", "o": ["Ir más rápido", "Escanear el código de cada producto al cogerlo", "Preparar de memoria", "Quitar las etiquetas"], "c": 1, "por": "El sistema avisa si no es el producto correcto."}
---
La <b>orden de pedido</b> del cliente se convierte en una <b>lista de picking</b> (hoja o terminal) con cada <b>línea</b>: referencia, descripción, <b>ubicación</b>, cantidad y, si hace falta, lote. El preparador recoge cada línea, comprueba (escaneando el código) y marca lo preparado.

Sistemas de picking: <b>por pedido</b> (un preparador hace un pedido entero; sencillo, pero mucho recorrido), <b>por lotes u oleadas</b> (se agrupan varios pedidos y se recoge todo junto, después se separa), <b>por zonas</b> (cada preparador se encarga de una zona y el pedido pasa de una a otra). También se distingue <b>hombre a mercancía</b> (el preparador va a la estantería) y <b>mercancía a hombre</b> (la estantería o la caja viene al preparador, en almacenes automatizados).
