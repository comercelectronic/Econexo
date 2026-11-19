---
id: A_sga
titulo: "SGA, devoluciones e indicadores"
objetivo: "Conocer las funciones de un SGA, gestionar devoluciones y medir el almacén con indicadores."
orden: 23
codigos: ["8.1", "8.3", "8.4"]
area: "Gestión informatizada, trazabilidad e indicadores"
capitulo: "5"
capitulo_titulo: "Jefe de almacén"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "alegria", "texto": "¡Soy jefe de almacén! ¿Cómo sé si lo hacemos bien?"}]
  - [{"quien": "nexo", "gesto": "senalando", "texto": "Con indicadores: pedidos a tiempo, errores de picking, roturas, líneas por hora…"}]
  - [{"quien": "nexo", "gesto": "guino", "texto": "Y el SGA te los da cada día. Lo que no se mide, no se mejora."}]
ejemplo: "En Palet, al final de cada turno ves tus indicadores: pedidos a tiempo, errores, roturas, incidentes. La jefa decide con ellos si te asciende, te avisa… o te despide."
errores: ["Medir solo la velocidad y olvidar los errores y la seguridad.", "Volver a poner en stock una devolución sin revisarla."]
test:
  - {"p": "¿Qué hace un SGA?", "o": ["Solo la contabilidad", "Controla ubicaciones, stock, lotes y genera listas de picking", "Conduce las carretillas", "Fija los precios"], "c": 1, "por": "Es el cerebro informático del almacén."}
  - {"p": "Un cliente devuelve un producto. ¿Qué haces?", "o": ["Ponerlo directamente en la estantería", "Revisarlo y decidir: stock, reparación, proveedor o eliminación", "Tirarlo siempre", "Venderlo como nuevo sin mirarlo"], "c": 1, "por": "Es logística inversa."}
  - {"p": "Se han preparado 400 líneas y 8 tenían errores. ¿Errores de picking?", "o": ["8 %", "2 %", "0,5 %", "20 %"], "c": 1, "por": "8 ÷ 400 = 0,02."}
  - {"p": "¿Qué indicador mide la productividad del picking?", "o": ["Líneas preparadas por hora", "Ocupación del almacén", "Número de proveedores", "Precio medio"], "c": 0, "por": "Relaciona trabajo y tiempo."}
---
Un <b>sistema de gestión de almacén (SGA o WMS)</b> controla las ubicaciones, las entradas y salidas, el stock en tiempo real, los lotes y caducidades, genera las listas de picking y las rutas, y se comunica con los <b>terminales de radiofrecuencia</b> y los lectores de códigos.

La <b>logística inversa</b> gestiona lo que vuelve: devoluciones de clientes, producto defectuoso, envases y palés reutilizables, residuos. Cada devolución se recibe, se revisa y se decide: volver al stock, reparar, devolver al proveedor o eliminar.

<b>Indicadores (KPI)</b> habituales: porcentaje de <b>pedidos entregados a tiempo</b>, <b>errores de picking</b> (líneas erróneas ÷ líneas preparadas), <b>líneas por hora</b> (productividad), <b>roturas y mermas</b>, <b>ocupación</b> del almacén, <b>exactitud del inventario</b> y <b>rotación</b> del stock.
