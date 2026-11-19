---
id: A_fefo
titulo: "Rotación del stock: FIFO, FEFO y LIFO"
objetivo: "Aplicar FIFO y FEFO al preparar pedidos para evitar caducados."
orden: 11
codigos: ["4.2"]
area: "Gestión de stocks e inventarios"
capitulo: "2"
capitulo_titulo: "Preparador de pedidos"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "alegria", "texto": "Cojo los yogures de delante, que son los que acaban de llegar."}]
  - [{"quien": "nexo", "gesto": "enfado", "texto": "¡Y los de detrás caducan mañana! Primero sale lo que caduca antes."}]
  - [{"quien": "nexo", "gesto": "guino", "texto": "Eso es FEFO. Y al reponer, lo nuevo detrás."}]
ejemplo: "En Palet, al hacer picking de perecederos el lector te muestra las fechas de cada caja. Si coges la nueva y dejas la vieja, a final de semana tendrás caducados y la jefa preguntará por qué."
errores: ["Colocar la mercancía nueva delante de la antigua al reponer.", "Aplicar FIFO a productos con fechas de caducidad distintas a las de entrada (debería ser FEFO)."]
test:
  - {"p": "¿Qué sistema sale primero lo que caduca antes?", "o": ["FIFO", "FEFO", "LIFO", "ABC"], "c": 1, "por": "First expired, first out."}
  - {"p": "Al reponer leche, ¿dónde va la nueva?", "o": ["Delante de la antigua", "Detrás o debajo de la antigua", "Encima de cualquier otra", "En otra ubicación sin registrar"], "c": 1, "por": "Así sale primero la antigua."}
  - {"p": "¿Para qué mercancía puede servir LIFO?", "o": ["Yogures", "Medicamentos", "Arena a granel que no caduca", "Pan"], "c": 2, "por": "Solo si no caduca ni se deteriora."}
  - {"p": "Lote A: entró el lunes, caduca el día 20. Lote B: entró el martes, caduca el día 15. Con FEFO, ¿cuál sale primero?", "o": ["El lote A", "El lote B", "Da igual", "Los dos a la vez"], "c": 1, "por": "Caduca antes, aunque entró después."}
---
La <b>rotación</b> decide qué unidades salen primero:

<b>FIFO</b> (<i>first in, first out</i>): sale primero lo que entró primero. <b>FEFO</b> (<i>first expired, first out</i>): sale primero lo que <b>caduca antes</b>, aunque haya entrado después; es el criterio de los productos perecederos y de la alimentación. <b>LIFO</b> (<i>last in, first out</i>): sale primero lo último que entró; solo tiene sentido con mercancía que no caduca y se apila (arena, ladrillos).

Para que funcione, al <b>reponer</b> se coloca la mercancía nueva <b>detrás</b> o debajo de la antigua, y al preparar se coge la de fecha más próxima. Si no se respeta, el producto antiguo caduca y se convierte en <b>merma</b>.
