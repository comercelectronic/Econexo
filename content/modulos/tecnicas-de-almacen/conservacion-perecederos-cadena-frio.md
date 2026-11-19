---
id: A_frio
titulo: "Conservación, perecederos y cadena de frío"
objetivo: "Mantener las condiciones de conservación y no romper la cadena de frío."
orden: 14
codigos: ["3.1", "3.2"]
area: "Almacenaje y conservación"
capitulo: "3"
capitulo_titulo: "Carretillero"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "alegria", "texto": "Dejo el palé de congelados en el muelle y me tomo un café."}]
  - [{"quien": "nexo", "gesto": "enfado", "texto": "¡Media hora fuera de la cámara! Se rompe la cadena de frío y se tiran."}]
  - [{"quien": "eco", "gesto": "sorpresa", "texto": "¿Tan rápido?"}, {"quien": "nexo", "gesto": "senalando", "texto": "Lo refrigerado y lo congelado, siempre primero a su cámara."}]
ejemplo: "En Palet, desde carretillero gestionas la cámara de frío: cada minuto que un palé de congelados pasa en el muelle cuenta, y si se estropea es merma."
errores: ["Dejar los refrigerados en el muelle mientras se descarga el resto del camión.", "Abrir la puerta de la cámara más de lo necesario."]
test:
  - {"p": "¿A qué temperatura se conservan los congelados?", "o": ["Entre 0 y 4 °C", "A −18 °C o menos", "A temperatura ambiente", "A 8 °C"], "c": 1, "por": "Es la temperatura habitual de congelación."}
  - {"p": "¿Qué es la cadena de frío?", "o": ["Una cadena de supermercados", "Mantener la temperatura sin interrupciones del fabricante al cliente", "El sistema de refrigeración del camión", "Una máquina de hielo"], "c": 1, "por": "Cualquier interrupción la rompe."}
  - {"p": "Al descargar un camión con secos y refrigerados, ¿qué haces primero?", "o": ["Los secos, que son más", "Los refrigerados, directos a la cámara", "Lo que esté más cerca de la puerta", "Dejarlo todo en el muelle"], "c": 1, "por": "Para no romper la cadena de frío."}
  - {"p": "Se rompe la cadena de frío y el producto se vuelve a enfriar. ¿Es seguro?", "o": ["Sí, siempre", "No se puede garantizar: puede no serlo", "Sí, si huele bien", "Sí, si es de marca"], "c": 1, "por": "Las bacterias han podido crecer."}
---
Cada producto tiene sus <b>condiciones de conservación</b>: temperatura, humedad, luz y ventilación. Los secos (pasta, latas) van en ambiente, en lugar fresco y seco; los <b>refrigerados</b> (lácteos, carne fresca) en cámara de frío, en general entre <b>0 y 4-5 °C</b>; los <b>congelados</b>, a <b>−18 °C o menos</b>.

La <b>cadena de frío</b> es mantener la temperatura sin interrupciones desde el fabricante hasta el cliente: transporte frigorífico, recepción inmediata, cámara, preparación rápida y carga sin esperas. Si se rompe, aunque después vuelva a enfriarse, el producto puede no ser seguro.

Los <b>perecederos</b> se controlan por fecha (FEFO), se revisan a menudo y se registra la temperatura de las cámaras.
