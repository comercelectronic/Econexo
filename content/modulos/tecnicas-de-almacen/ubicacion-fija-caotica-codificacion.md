---
id: A_ubicacion
titulo: "Ubicación fija, caótica y códigos de ubicación"
objetivo: "Leer y usar los códigos de ubicación y comparar la ubicación fija con la caótica."
orden: 2
codigos: ["1.4", "1.5"]
area: "Organización del almacén"
capitulo: "1"
capitulo_titulo: "Mozo de almacén"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "confusion", "texto": "«A-03-2-B»… ¿Es una matrícula?"}]
  - [{"quien": "nexo", "gesto": "senalando", "texto": "Pasillo A, módulo 3, nivel 2, posición B. Es la dirección exacta del producto."}]
  - [{"quien": "eco", "gesto": "alegria", "texto": "¡Como una calle con número y piso!"}]
ejemplo: "En Palet, en el nivel de mozo trabajas con ubicación fija y cada producto tiene su código en la estantería. Si dejas el aceite en B-02-1-A en lugar de A-02-1-A, el preparador no lo encontrará."
errores: ["Dejar el producto en una ubicación «parecida» porque la correcta está ocupada, sin registrarlo.", "Usar ubicación caótica sin un sistema que guarde dónde está cada palé."]
test:
  - {"p": "En el código B-05-3-A, ¿qué indica el 3?", "o": ["El pasillo", "El módulo", "El nivel (altura)", "La posición"], "c": 2, "por": "Pasillo-módulo-nivel-posición."}
  - {"p": "¿Qué ventaja tiene la ubicación caótica?", "o": ["No necesita informática", "Aprovecha mejor el espacio", "El personal memoriza mejor dónde está todo", "No hay errores nunca"], "c": 1, "por": "Cualquier hueco libre sirve."}
  - {"p": "¿Qué necesita imprescindiblemente la ubicación caótica?", "o": ["Más personal", "Un sistema de gestión de almacén que registre las ubicaciones", "Estanterías más altas", "Carretillas eléctricas"], "c": 1, "por": "Sin registro, nadie sabe dónde está cada producto."}
  - {"p": "Un almacén pequeño con pocas referencias y mucha rotación del personal suele preferir…", "o": ["Ubicación fija", "Ubicación caótica", "No ubicar", "Ubicación por colores"], "c": 0, "por": "Es más fácil de aprender y no exige un SGA."}
---
Cada hueco del almacén tiene una <b>dirección</b>: el <b>código de ubicación</b>. Lo más habitual es <b>pasillo - módulo (o columna) - nivel (altura) - posición</b>. Por ejemplo, <b>A-03-2-B</b> es el pasillo A, el módulo 3, el segundo nivel y la posición B. El nivel 1 suele ser el del suelo.

Con <b>ubicación fija</b>, cada producto tiene siempre el mismo sitio: es fácil de aprender, pero se desaprovecha espacio cuando hay poco stock. Con <b>ubicación caótica</b> (o libre), el producto va al primer hueco adecuado y el sistema informático guarda dónde está: aprovecha mejor el espacio, pero sin SGA es imposible encontrar nada. Muchos almacenes combinan las dos: fija para el picking y caótica para las reservas.
