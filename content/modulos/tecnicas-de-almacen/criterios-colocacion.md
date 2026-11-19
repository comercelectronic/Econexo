---
id: A_colocacion
titulo: "Dónde colocar cada producto"
objetivo: "Aplicar los criterios de rotación, peso, volumen, fragilidad y compatibilidad para ubicar la mercancía."
orden: 3
codigos: ["1.6"]
area: "Organización del almacén"
capitulo: "1"
capitulo_titulo: "Mozo de almacén"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "alegria", "texto": "¡Las garrafas de agua arriba del todo, que abajo no caben!"}]
  - [{"quien": "nexo", "gesto": "enfado", "texto": "¡ECO! Lo pesado, abajo. Y lo que más sale, cerca del muelle y a la altura de la cintura."}]
  - [{"quien": "eco", "gesto": "verguenza", "texto": "Vale, vale… bajo las garrafas."}]
ejemplo: "En Palet, si colocas el detergente encima de las galletas o el palé de agua en el nivel 3, la jefa te lo hará notar… y si cae, hay rotura y accidente."
errores: ["Colocar lo pesado en los niveles altos.", "Poner productos químicos junto a alimentos."]
test:
  - {"p": "¿Dónde debería ir un producto de mucha rotación?", "o": ["Al fondo del almacén", "Cerca de la expedición y a una altura cómoda", "En el nivel más alto", "En la cámara de frío"], "c": 1, "por": "Así el recorrido y el esfuerzo son menores."}
  - {"p": "¿Qué producto debería ir en el nivel más bajo?", "o": ["Paquetes de papel de cocina", "Sacos de 25 kg de pienso", "Cajas de bombillas", "Cajas de pañuelos"], "c": 1, "por": "Lo pesado, abajo."}
  - {"p": "¿Qué combinación es incompatible?", "o": ["Arroz y pasta", "Lejía y galletas", "Agua y zumo", "Latas y conservas"], "c": 1, "por": "Los químicos pueden contaminar los alimentos."}
  - {"p": "¿Qué hay que evitar con los productos frágiles?", "o": ["Etiquetarlos", "Poner peso encima", "Ubicarlos en estantería", "Registrarlos"], "c": 1, "por": "Se pueden romper."}
---
Para decidir dónde va cada producto se combinan varios criterios:

<b>Rotación</b>: lo que sale más (productos A) va cerca de la zona de expedición y a la altura entre la cintura y los hombros, para recorrer menos y no agacharse. <b>Peso</b>: lo pesado, abajo; lo ligero, arriba. <b>Volumen</b>: lo voluminoso en ubicaciones grandes o en el suelo. <b>Fragilidad</b>: sin nada pesado encima y fuera de los pasos con más tráfico. <b>Compatibilidad</b>: los alimentos separados de los productos de limpieza o químicos, y los peligrosos en su zona. <b>Conservación</b>: lo refrigerado o congelado, en la cámara de frío.
