---
id: A_rutas
titulo: "Rutas de preparación"
objetivo: "Ordenar las líneas de un pedido para hacer el recorrido más corto."
orden: 12
codigos: ["5.3"]
area: "Preparación de pedidos y expedición"
capitulo: "2"
capitulo_titulo: "Preparador de pedidos"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "sorpresa", "texto": "He ido del pasillo A al D, vuelta al A, luego al C…"}]
  - [{"quien": "nexo", "gesto": "paciencia", "texto": "Ordena las líneas por ubicación y recorre los pasillos una sola vez."}]
  - [{"quien": "eco", "gesto": "alegria", "texto": "¡Menos pasos, más pedidos!"}]
ejemplo: "En Palet, el reloj corre: si vas de un extremo al otro sin orden, no llegas al camión. Ordenar las líneas por pasillo te ahorra minutos en cada pedido."
errores: ["Seguir el orden en que el cliente escribió el pedido en lugar del orden de las ubicaciones.", "Coger los refrigerados al principio del recorrido."]
test:
  - {"p": "¿Dónde se pierde más tiempo en el picking?", "o": ["Imprimiendo la lista", "Caminando entre ubicaciones", "Escaneando", "Firmando el albarán"], "c": 1, "por": "Por eso se optimizan las rutas."}
  - {"p": "¿Qué productos se cogen al final del recorrido?", "o": ["Los más pesados", "Los frágiles y los refrigerados", "Los más baratos", "Los de la estantería más alta"], "c": 1, "por": "Así no se rompen ni se calientan."}
  - {"p": "En la ruta en S…", "o": ["Se recorren los pasillos con pedidos zigzagueando", "Se vuelve siempre al inicio", "Se coge un producto por viaje", "No se usan pasillos"], "c": 0, "por": "Se entra en cada pasillo y se sale por el otro extremo."}
  - {"p": "¿Cómo hay que ordenar las líneas de la lista de picking?", "o": ["Alfabéticamente", "Por ubicación, siguiendo la ruta", "Por precio", "Como las escribió el cliente"], "c": 1, "por": "Así el recorrido es más corto."}
---
La mayor parte del tiempo de picking se pierde <b>caminando</b>. Por eso la lista se ordena por <b>ubicación</b> y se sigue una ruta: <b>en S</b> (se entra en cada pasillo con pedidos y se recorre entero, zigzagueando), <b>de retorno</b> (se entra y se vuelve por el mismo lado) o la ruta más corta que calcule el SGA.

Otras reglas: empezar por los productos <b>pesados y resistentes</b> (van abajo en el palé) y terminar por los <b>frágiles</b> y los <b>refrigerados</b> (para que estén fuera del frío el menor tiempo posible); tener los productos de más rotación cerca de la expedición.
