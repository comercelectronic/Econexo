---
id: A_paletizacion
titulo: "Unidades de carga, paletización y etiquetado"
objetivo: "Montar un palé estable y etiquetarlo para la expedición."
orden: 13
codigos: ["5.4", "3.5"]
area: "Preparación de pedidos y expedición"
capitulo: "2"
capitulo_titulo: "Preparador de pedidos"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "alegria", "texto": "¡Palé terminado! Las botellas de cristal abajo y los sacos de harina encima."}]
  - [{"quien": "nexo", "gesto": "enfado", "texto": "¡Al revés! Lo pesado y resistente abajo, lo frágil arriba. Y film para que no se caiga."}]
  - [{"quien": "eco", "gesto": "verguenza", "texto": "Lo desmonto…"}]
ejemplo: "En Palet, si montas el palé con lo frágil abajo o sin film, al moverlo con el transpalé puede caer algo: rotura, y la jefa lo apunta."
errores: ["Poner lo frágil debajo de lo pesado.", "Dejar cajas que sobresalen del palé: se golpean y se rompen."]
test:
  - {"p": "¿Cuánto mide un europalé?", "o": ["1.200 × 800 mm", "1.000 × 1.000 mm", "1.200 × 1.200 mm", "800 × 600 mm"], "c": 0, "por": "Es la medida estándar europea."}
  - {"p": "¿Qué va en la base del palé?", "o": ["Lo frágil", "Lo pesado y resistente", "Lo que se entrega primero", "Lo más caro"], "c": 1, "por": "Así soporta el peso."}
  - {"p": "¿Para qué sirve cruzar las cajas en cada capa (trenzado)?", "o": ["Para que el palé sea más estable", "Para que pese menos", "Para ahorrar film", "Para que quepan más etiquetas"], "c": 0, "por": "Las capas quedan trabadas."}
  - {"p": "¿Qué NO suele llevar la etiqueta de expedición?", "o": ["Destinatario", "Número de bultos", "Precio de coste de cada producto", "Código SSCC"], "c": 2, "por": "El coste no es información logística para el transporte."}
---
Las <b>unidades de carga</b> agrupan la mercancía para moverla de una vez: caja, <b>palé</b> (el europalé mide 1.200 × 800 mm; el americano o universal, 1.200 × 1.000 mm), contenedor. El palé es la unidad básica del almacén y del transporte.

<b>Paletizar</b> bien: lo <b>pesado y resistente abajo</b> y lo ligero y frágil arriba; las cajas bien encajadas, sin sobresalir del palé; las columnas o el <b>trenzado</b> (cruzar las cajas en cada capa) para que sea estable; altura y peso máximos según el transporte; y al final <b>film estirable</b> o flejes para que no se mueva.

La <b>etiqueta de expedición</b> identifica el palé: destinatario, número de pedido, número de bultos, peso, código SSCC (GS1-128) y avisos (frágil, este lado arriba, no apilar).
