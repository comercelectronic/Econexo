---
id: M_surtido
titulo: "Gama, línea y surtido"
objetivo: "Medir el surtido de una tienda en amplitud y profundidad y decidir cómo ampliarlo."
orden: 11
codigos: ["4.3"]
area: "Las políticas de producto"
capitulo: "2"
capitulo_titulo: "Tienda grande"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "alegria", "texto": "¡Tengo 20 tipos de mermelada!"}]
  - [{"quien": "nexo", "gesto": "esceptico", "texto": "¿Y pan? ¿Y leche? Los clientes vienen a por la compra, no solo a por mermelada."}]
  - [{"quien": "nexo", "gesto": "guino", "texto": "Mucha profundidad y poca amplitud. Equilibra el surtido."}]
ejemplo: "En Mercadeja cada estantería es una línea. Con más estanterías (tienda grande) puedes atender a más tipos de cliente: ganas amplitud."
errores: ["Añadir referencias sin mirar si las anteriores se venden.", "Confundir amplitud (cuántas líneas) con profundidad (cuántas referencias por línea)."]
test:
  - {"p": "Una tienda con 12 líneas de producto y pocas referencias en cada una tiene un surtido…", "o": ["Amplio y poco profundo", "Estrecho y profundo", "Estrecho y poco profundo", "Amplio y profundo"], "c": 0, "por": "Muchas líneas (amplio), pocas variantes (poco profundo)."}
  - {"p": "Una tienda de tés con 150 variedades de té tiene un surtido…", "o": ["Amplio", "Estrecho y profundo", "Incoherente", "Indiferenciado"], "c": 1, "por": "Una sola línea con muchas referencias."}
  - {"p": "¿Qué es una referencia?", "o": ["Una línea de productos", "Cada variante concreta de un producto (formato, sabor, tamaño)", "La marca de la tienda", "El proveedor principal"], "c": 1, "por": "Por ejemplo, el yogur natural de 4 unidades de una marca."}
  - {"p": "¿Qué inconveniente tiene ampliar mucho el surtido?", "o": ["Atrae menos clientes", "Más stock inmovilizado, más espacio y más mermas", "Baja la calidad", "Elimina la competencia"], "c": 1, "por": "Cada referencia cuesta espacio y dinero."}
---
La <b>gama</b> o cartera es el conjunto de productos que ofrece una empresa. Se divide en <b>líneas</b>: grupos de productos relacionados (lácteos, panadería, fruta). Cada variante concreta es una <b>referencia</b>.

El <b>surtido</b> se mide por su <b>amplitud</b> (número de líneas), su <b>profundidad</b> (referencias dentro de cada línea) y su <b>coherencia</b> (si las líneas tienen relación entre sí). Un súper tiene un surtido amplio; una tienda especializada, estrecho y profundo.

Ampliar el surtido atrae más clientes, pero ocupa espacio, inmoviliza dinero en stock y aumenta las mermas. Hay que eliminar las referencias que no rotan.
