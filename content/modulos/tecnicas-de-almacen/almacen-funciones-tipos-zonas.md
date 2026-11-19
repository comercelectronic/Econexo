---
id: A_almacen
titulo: "El almacén: funciones, tipos y zonas"
objetivo: "Explicar para qué sirve un almacén, qué tipos hay y cómo se reparte su espacio."
orden: 1
codigos: ["1.1", "1.2"]
area: "Organización del almacén"
capitulo: "1"
capitulo_titulo: "Mozo de almacén"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "alegria", "texto": "¡Primer día en el almacén! Dejo las cajas donde haya sitio, ¿no?"}]
  - [{"quien": "nexo", "gesto": "esceptico", "texto": "¿Y cómo las encontrará el compañero que prepara los pedidos?"}]
  - [{"quien": "nexo", "gesto": "guino", "texto": "Cada zona tiene su función: recepción, almacenaje, preparación y expedición."}]
ejemplo: "En Palet, el camión del proveedor descarga en el muelle 1, revisas la mercancía en la zona de recepción, la llevas a su estantería y, cuando llega un pedido, la preparas y la dejas en el muelle de expedición."
errores: ["Dejar mercancía en los pasillos o en la zona de recepción «un momento»: bloquea el flujo y es peligroso.", "Confundir la zona de preparación con la de expedición."]
test:
  - {"p": "¿Qué almacén guarda la mercancía solo unas horas para repartirla a otros destinos?", "o": ["Almacén regulador", "Plataforma de cross-docking (de tránsito)", "Almacén de materias primas", "Almacén de recambios"], "c": 1, "por": "La mercancía entra y sale casi sin almacenarse."}
  - {"p": "¿En qué zona se comprueba que la mercancía coincide con el albarán?", "o": ["Expedición", "Recepción y control", "Picking", "Zona de servicios"], "c": 1, "por": "Antes de ubicarla hay que revisarla."}
  - {"p": "En un almacén con flujo en U…", "o": ["La entrada y la salida están en el mismo lado", "La entrada y la salida están en lados opuestos", "No hay muelles", "Solo hay una estantería"], "c": 0, "por": "Los muelles de entrada y salida comparten fachada."}
  - {"p": "¿Qué NO es una función del almacén?", "o": ["Recibir la mercancía", "Conservar la mercancía", "Fijar el precio de venta", "Preparar los pedidos"], "c": 2, "por": "El precio es una decisión comercial."}
---
El <b>almacén</b> guarda la mercancía entre que llega del proveedor y sale hacia el cliente. Sus funciones: <b>recibir</b>, <b>almacenar y conservar</b>, <b>controlar el stock</b>, <b>preparar los pedidos</b> y <b>expedirlos</b>.

Tipos: según la mercancía (materias primas, producto acabado, recambios), la función (de fábrica, de distribución, regulador, de tránsito o <i>cross-docking</i>, donde la mercancía casi no se guarda), el régimen (propio, alquilado, de un operador logístico) o el grado de automatización.

Zonas habituales: <b>muelles</b> de carga y descarga, <b>recepción y control</b>, <b>almacenaje</b> (estanterías, cámara de frío, zona de peligrosos), <b>preparación de pedidos</b> (picking), <b>expedición</b>, zonas de servicio (oficina, vestuarios, carga de baterías) y pasillos. El <b>flujo</b> puede ser en U (entrada y salida por el mismo lado) o en línea recta (entrada por un lado y salida por el otro).
