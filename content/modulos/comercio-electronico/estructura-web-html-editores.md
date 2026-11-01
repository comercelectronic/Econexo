---
id: L_html
titulo: "Estructura web, HTML y editores"
objetivo: "Conocer la estructura de una web corporativa, el HTML básico y las herramientas actuales para crear webs."
orden: 10
codigos: ["3.1","3.2","3.3"]
area: "Web y comercio electrónico"
capitulo: "1.7"
capitulo_titulo: "Osona Bikes quiere su propia web"
estado: publicada
tira:
  - [{"quien":"eco","gesto":"alegria","texto":"¡Mi web tiene diez títulos principales! Así Google ve que todo es importante."}]
  - [{"quien":"nexo","gesto":"pensativo","texto":"¿Diez h1?"},{"quien":"eco","gesto":"confusion","texto":"¿h1? ¿Es una autopista?"}]
  - [{"quien":"nexo","gesto":"guino","texto":"Es el título principal. Uno por página, imágenes con texto alternativo y un menú claro."}]
ejemplo: "La página de inicio de la tienda de bicis tiene un único &lt;h1&gt; («Bicicletas y reparaciones en Vic»), un &lt;nav&gt; con cinco enlaces e imágenes con texto alternativo. El primer borrador lo hicieron con un constructor con IA, pero reescribieron los textos y revisaron la accesibilidad."
errores: ["Usar varios &lt;h1&gt; en la misma página.","Olvidar el texto alternativo de las imágenes.","Publicar tal cual la web que genera una IA, sin revisarla."]
test:
  - {"p":"¿Qué etiqueta HTML contiene el menú de navegación?","o":["&lt;nav&gt;","&lt;header&gt;","&lt;menu&gt;","&lt;aside&gt;"],"c":0,"por":"&lt;nav&gt; agrupa los enlaces de navegación principales; &lt;header&gt; es la cabecera, que a menudo lo contiene."}
  - {"p":"¿Para qué sirve el atributo alt de una imagen?","o":["Para mostrar un texto si la imagen tarda en cargar","Para describirla a buscadores y lectores de pantalla","Para mostrar un texto cuando el ratón pasa por encima","Para indicar el autor y la licencia de la imagen"],"c":1,"por":"Mejora la accesibilidad y el SEO."}
  - {"p":"¿Qué herramienta usarías para diseñar el prototipo de una web antes de construirla?","o":["Figma","Canva","Webflow","Visual Studio Code"],"c":0,"por":"Figma es la herramienta de prototipado más habitual. Canva es para piezas gráficas, Webflow construye la web y Visual Studio Code es para escribir código."}
  - {"p":"Caso real · Domino's Pizza (2019). Un hombre ciego no podía hacer pedidos en la web con el lector de pantalla y ganó el pleito. ¿Qué elemento tenía un papel clave?","o":["El diseño de la página de inicio","La accesibilidad: textos alternativos, etiquetas y navegación con teclado","La velocidad de carga","El certificado SSL"],"c":1,"por":"Una web bien hecha en HTML es usable para todo el mundo. En Europa, la accesibilidad ya es obligatoria para muchas tiendas."}
  - {"p":"Caso real · WordPress. Hace funcionar más del 40 % de las webs del mundo. ¿Qué es?","o":["Un editor de código","Un alojamiento web","Un gestor de contenidos (CMS)","Un lenguaje de programación"],"c":2,"por":"Un CMS permite crear y editar la web sin programar, con temas y extensiones."}
---
Una <b>web corporativa</b> suele tener: inicio (qué hacemos y para quién), quiénes somos, servicios o productos, casos u opiniones, blog, contacto, y las páginas legales (aviso legal, privacidad y cookies). El menú debe ser simple, el contacto a un clic y la web debe ser <b>accesible</b> (contraste, texto alternativo, navegación con teclado).

El <b>HTML</b> describe la estructura con etiquetas: <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;footer&gt;</code>, títulos de <code>&lt;h1&gt;</code> a <code>&lt;h6&gt;</code>, párrafos <code>&lt;p&gt;</code>, enlaces <code>&lt;a href&gt;</code> e imágenes <code>&lt;img alt&gt;</code>. El CSS define su aspecto y el JavaScript, el comportamiento.

Las herramientas más habituales son los <b>CMS y constructores visuales</b> (WordPress con el editor de bloques, Shopify, Wix, Webflow, Framer), las <b>herramientas de diseño</b> para prototipar (Figma) y los <b>editores de código</b> (Visual Studio Code, Cursor) con asistentes de IA que generan y revisan código. También hay constructores con IA que hacen un primer borrador de web a partir de una descripción: hay que revisar siempre los textos, la accesibilidad y el SEO.
