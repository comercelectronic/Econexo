---
id: A_stock
titulo: "Tipos de stock y punto de pedido"
objetivo: "Calcular el stock de seguridad y el punto de pedido para no quedarse sin existencias."
orden: 19
codigos: ["4.1"]
area: "Gestión de stocks e inventarios"
capitulo: "5"
capitulo_titulo: "Jefe de almacén"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "sorpresa", "texto": "¡Se ha acabado el aceite y el proveedor tarda cinco días!"}]
  - [{"quien": "nexo", "gesto": "pensativo", "texto": "Tenías que haber pedido cuando quedaban unas cuantas cajas: el punto de pedido."}]
  - [{"quien": "nexo", "gesto": "guino", "texto": "Consumo diario × plazo de entrega + stock de seguridad."}]
ejemplo: "Salen 20 cajas al día, el proveedor tarda 5 días y quieres 30 cajas de seguridad: punto de pedido = 20 × 5 + 30 = 130 cajas. En Palet, como jefe de almacén decides cuándo pedir."
errores: ["Esperar a quedarse sin stock para hacer el pedido.", "No tener en cuenta el plazo de entrega del proveedor."]
test:
  - {"p": "Consumo de 10 u/día, plazo de 4 días, stock de seguridad de 20 u. ¿Punto de pedido?", "o": ["40", "60", "30", "24"], "c": 1, "por": "10 × 4 + 20 = 60 unidades."}
  - {"p": "¿Para qué sirve el stock de seguridad?", "o": ["Para tener siempre el almacén lleno", "Para cubrir imprevistos (retrasos, picos de demanda)", "Para cobrar más caro", "Para el inventario anual"], "c": 1, "por": "Es una reserva."}
  - {"p": "¿Qué es una rotura de stock?", "o": ["Un palé roto", "Quedarse sin existencias cuando un cliente las pide", "Un error de inventario", "Una devolución"], "c": 1, "por": "Se pierden ventas."}
  - {"p": "¿Qué problema tiene un stock demasiado alto?", "o": ["Ninguno", "Dinero inmovilizado, espacio ocupado y más mermas", "Roturas de stock", "Menos trabajo"], "c": 1, "por": "El stock también cuesta."}
---
<b>Stock máximo</b>: lo máximo que conviene tener (por espacio y dinero inmovilizado). <b>Stock mínimo</b>: por debajo, hay riesgo de quedarse sin. <b>Stock de seguridad</b>: reserva para imprevistos (un pedido grande, un retraso del proveedor). <b>Punto de pedido</b>: la cantidad a la que hay que hacer el pedido para que llegue antes de acabarse.

<b>Punto de pedido = consumo medio diario × plazo de entrega (días) + stock de seguridad.</b>

Tener poco stock provoca <b>roturas de stock</b> (pedidos sin servir, clientes perdidos); tener demasiado inmoviliza dinero, ocupa espacio y aumenta las mermas. El objetivo es el equilibrio.
