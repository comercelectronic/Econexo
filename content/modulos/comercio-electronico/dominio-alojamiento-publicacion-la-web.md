---
id: L_domini
titulo: "Dominio, alojamiento y publicación de la web"
objetivo: "Elegir y registrar un dominio, escoger el alojamiento y publicar una web de manera segura."
orden: 9
codigos: ["2.3","3.4","3.5"]
area: "Web y comercio electrónico"
capitulo: "1.7"
capitulo_titulo: "Osona Bikes quiere su propia web"
estado: publicada
tira:
  - [{"quien":"eco","gesto":"senalando","texto":"Dominio de la tienda: bicis-baratas-osona-online-24h.net"}]
  - [{"quien":"nexo","gesto":"esceptico","texto":"¿Y quién se acordará de eso?"},{"quien":"eco","gesto":"verguenza","texto":"Yo… si lo apunto."}]
  - [{"quien":"nexo","gesto":"paciencia","texto":"Corto, claro y a nombre de la empresa: osonabikes.cat. Y publica de forma segura."}]
ejemplo: "La tienda de bicis registra osonabikes.cat y osonabikes.com, conecta el repositorio de la web a Netlify con SSL automático y, cada vez que aprueba un cambio, la web se publica sola. Si algo falla, vuelve a la versión anterior con un clic."
errores: ["Registrar el dominio a nombre de un proveedor o de un familiar.","Dejar caducar el dominio porque no se renueva.","Hacer cambios directamente en la web publicada sin copia ni pruebas."]
test:
  - {"p":"¿Qué dominio es mejor para una tienda de bicis de Vic con clientes catalanes?","o":["osonabikes.com","osonabikes.cat","bicis-osona.cat","osonabikesvic.es"],"c":1,"por":"Corto, claro, sin guiones y con la extensión de su público. El .com también conviene registrarlo para proteger la marca."}
  - {"p":"¿Qué es el alojamiento web?","o":["El servidor donde se guardan y se sirven los archivos de la web","La dirección que la gente escribe para llegar a la web","El certificado que hace que la web sea segura","El programa con el que se crea y se edita la web"],"c":0,"por":"El dominio es la dirección; el alojamiento es donde vive la web."}
  - {"p":"¿Cuál es hoy una manera segura y habitual de publicar una web hecha a medida?","o":["Conectar un repositorio Git a una plataforma que la publica automáticamente","Subirla por FTP al servidor de producción directamente","Editar los archivos directamente en el servidor con el gestor del alojamiento","Comprimirla en un ZIP y enviarla al proveedor de alojamiento"],"c":0,"por":"Hay historial de cambios, SSL automático y se puede volver atrás. Si hace falta FTP, siempre SFTP."}
  - {"p":"Caso real · Tesla. Durante años la web fue teslamotors.com porque tesla.com tenía otro propietario. En 2016 consiguió tesla.com. ¿Por qué le importaba tanto?","o":["Porque el .com es más seguro","Porque un dominio corto e igual que la marca es más fácil de recordar y da más confianza","Porque era obligatorio para vender coches en línea","Porque así mejoraba la velocidad de la web"],"c":1,"por":"El dominio ideal es el nombre de la marca, corto y sin añadidos. Por eso conviene registrarlo cuanto antes."}
  - {"p":"Caso real · Dominio .cat. Se aprobó en 2005 para la comunidad lingüística y cultural catalana y lo gestiona la Fundació puntCAT. ¿Cuándo tiene más sentido usarlo?","o":["Para cualquier web que venda en España","Para webs con contenido en catalán o dirigidas al público catalanohablante","Solo para webs de la administración","Para webs que quieren vender en todo el mundo"],"c":1,"por":"La extensión debe encajar con el público: .cat para el catalán, .es para España y .com para lo internacional."}
---
El <b>dominio</b> es la dirección de la web (osonabikes.cat). Debe ser corto, fácil de decir y escribir, sin guiones ni números innecesarios, y con la extensión adecuada: <b>.cat</b> para el público catalán, <b>.es</b> para España, <b>.com</b> para el internacional. Se registra en un <b>registrador</b> acreditado y se renueva cada año; conviene registrarlo a nombre de la empresa.

El <b>alojamiento</b> (hosting) es el servidor donde vive la web: <b>compartido</b> (barato, para webs pequeñas), <b>VPS o nube</b> (más potencia y control), <b>gestionado</b> (WordPress gestionado, Shopify, Wix: todo incluido) o plataformas para webs modernas (Netlify, Vercel, Cloudflare Pages). Hay que mirar velocidad, ubicación de los servidores, copias de seguridad, certificado SSL y soporte.

Para publicar, hoy lo más habitual es hacerlo desde el propio <b>CMS</b> (WordPress, Shopify o Wix publican con un botón) o conectar un <b>repositorio Git</b> (GitHub) a una plataforma como Netlify o Vercel, que publica sola cada cambio revisado y permite volver atrás. El <b>FTP</b> clásico aún existe en alojamientos compartidos: si hay que usarlo, siempre <b>SFTP</b> (cifrado), con programas como FileZilla. Y antes de cambios grandes, una copia y un entorno de pruebas.
