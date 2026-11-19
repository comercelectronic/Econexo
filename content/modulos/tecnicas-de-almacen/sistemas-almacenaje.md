---
id: A_sistemas
titulo: "Sistemas de almacenaje"
objetivo: "Comparar los sistemas de estanterías y elegir el adecuado según el producto."
orden: 17
codigos: ["1.3"]
area: "Organización del almacén"
capitulo: "3"
capitulo_titulo: "Carretillero"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "pensativo", "texto": "¿Por qué en este almacén las estanterías se mueven solas?"}]
  - [{"quien": "nexo", "gesto": "guino", "texto": "Son estanterías móviles: abren solo el pasillo que necesitas y caben muchas más."}]
  - [{"quien": "eco", "gesto": "sorpresa", "texto": "¡Como los archivos de las películas!"}]
ejemplo: "En Palet, el almacén tiene estanterías convencionales y una cámara de frío con estantería dinámica: el palé entra por detrás y sale por delante, así el FIFO es automático."
errores: ["Usar un sistema compacto con muchas referencias distintas: hay que mover palés para llegar al que necesitas.", "Apilar en bloque productos que no aguantan peso."]
test:
  - {"p": "¿Qué sistema garantiza el FIFO de forma natural?", "o": ["Compacto drive-in", "Dinámico (por gravedad)", "Bloque", "Cantilever"], "c": 1, "por": "Entra por un lado y sale por el otro."}
  - {"p": "¿Qué sistema da acceso directo a todos los palés?", "o": ["Convencional", "Compacto", "Móvil", "Bloque"], "c": 0, "por": "Cada palé tiene acceso desde el pasillo."}
  - {"p": "Para almacenar tubos y barras largas se usa…", "o": ["Estantería dinámica", "Cantilever", "Drive-in", "Estantería de picking"], "c": 1, "por": "Tiene brazos en voladizo."}
  - {"p": "Muchos palés de pocas referencias y poco espacio. ¿Qué sistema conviene?", "o": ["Compacto", "Convencional", "Cantilever", "Picking manual"], "c": 0, "por": "Aprovecha al máximo el espacio."}
---
<b>Convencional</b> (estanterías de palés con un pasillo para cada fila): acceso directo a todos los palés; ideal con muchas referencias. <b>Compacto</b> o <i>drive-in</i> (las carretillas entran dentro de la estantería): aprovecha mucho el espacio, pero solo para pocas referencias con muchos palés iguales; funciona con LIFO (o FIFO en la versión <i>drive-through</i>). <b>Dinámico</b> (rodillos inclinados por donde los palés o las cajas se deslizan): entran por un lado y salen por el otro, ideal para <b>FIFO</b> y perecederos. <b>Móvil</b> (las estanterías se desplazan sobre raíles): mucha capacidad, poco acceso simultáneo. <b>Cantilever</b>: para cargas largas (tubos, maderas). Para cajas pequeñas: estanterías de picking o de media carga.

También existe el <b>almacenaje en bloque</b> (palés apilados en el suelo, sin estantería) y los almacenes <b>automáticos</b> (transelevadores y robots).
