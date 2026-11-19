---
id: A_control
titulo: "Control de la mercancía e incidencias"
objetivo: "Hacer el control cuantitativo y cualitativo y decidir qué hacer con cada incidencia."
orden: 5
codigos: ["2.2", "2.3"]
area: "Recepción de mercancías"
capitulo: "1"
capitulo_titulo: "Mozo de almacén"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "sorpresa", "texto": "Esta caja está aplastada y los yogures llegan a 12 °C…"}]
  - [{"quien": "nexo", "gesto": "senalando", "texto": "Daño y rotura de la cadena de frío: lo anotas y lo rechazas."}]
  - [{"quien": "eco", "gesto": "pensativo", "texto": "Y si sobran cajas, ¿me las quedo?"}, {"quien": "nexo", "gesto": "paciencia", "texto": "Tampoco: también es una incidencia."}]
ejemplo: "En Palet, en la recepción decides caja a caja: aceptar, aceptar con anotación o rechazar. Aceptar un producto en mal estado acabará en merma y en una bronca de la jefa."
errores: ["Aceptar refrigerados sin medir la temperatura.", "Quedarse los sobrantes sin comunicarlos."]
test:
  - {"p": "Contar los bultos y comprobar el peso es un control…", "o": ["Cualitativo", "Cuantitativo", "De calidad", "Documental"], "c": 1, "por": "Mide cantidades."}
  - {"p": "Los yogures llegan a 11 °C. ¿Qué haces?", "o": ["Los aceptas y los pones rápido en la cámara", "Anotas la incidencia y los rechazas", "Los vendes con descuento", "Los guardas en el almacén normal"], "c": 1, "por": "Se ha roto la cadena de frío."}
  - {"p": "Llega una caja más de lo que dice el albarán. Es…", "o": ["Una falta", "Un sobrante", "Una rotura", "Un error de ubicación"], "c": 1, "por": "También se comunica al proveedor."}
  - {"p": "Un producto llega con fecha de caducidad muy próxima. ¿Qué tipo de control lo detecta?", "o": ["Cuantitativo", "Cualitativo", "De inventario", "De expedición"], "c": 1, "por": "Revisa el estado y las condiciones del producto."}
---
El <b>control cuantitativo</b> comprueba las cantidades: bultos, unidades, pesos. El <b>control cualitativo</b> comprueba el estado: embalaje intacto, producto correcto (referencia, formato), fecha de caducidad suficiente, temperatura de los refrigerados y congelados, etiquetado.

Incidencias habituales: <b>faltas</b> (llega menos de lo que dice el albarán), <b>sobrantes</b> (llega más o algo no pedido), <b>daños o roturas</b>, <b>caducidad corta</b>, <b>temperatura incorrecta</b> y <b>referencia equivocada</b>. Según la empresa, se acepta con reservas, se rechaza esa parte o todo el envío, y siempre se comunica al proveedor y se deja constancia.
