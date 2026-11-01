---
id: L_normativa
titulo: "Normativa: comunicaciones electrónicas, privacidad y consumidores"
objetivo: "Aplicar la LSSI, el RGPD, la normativa de cookies, de accesibilidad y los derechos de los consumidores en línea."
orden: 27
codigos: ["1.7","2.9"]
area: "Email y CRM"
capitulo: "3.7"
capitulo_titulo: "Una inspección a la vista"
estado: publicada
tira:
  - [{"quien":"eco","gesto":"alegria","texto":"¡Mi banner de cookies solo tiene el botón «Aceptar»! Así todo el mundo acepta."}]
  - [{"quien":"nexo","gesto":"enfado","texto":"Eso puede costar una multa."},{"quien":"eco","gesto":"sorpresa","texto":"¿Por un botón?"}]
  - [{"quien":"nexo","gesto":"paciencia","texto":"Rechazar tiene que ser tan fácil como aceptar. Y el cliente tiene 14 días para desistir de una compra online."}]
ejemplo: "Una tienda revisa la web: añade el aviso legal, un banner de cookies con el botón «Rechazar» y el modo de consentimiento activado, casilla de consentimiento no marcada en el formulario, la información del desistimiento en las condiciones de venta y mejoras de accesibilidad en el proceso de compra."
errores: ["Casilla de consentimiento marcada por defecto.","Cargar Google Analytics antes de que el usuario acepte las cookies.","No informar del derecho de desistimiento."]
test:
  - {"p":"¿Cuántos días tiene el consumidor para desistir de una compra en línea?","o":["7 días naturales","14 días naturales","14 días hábiles","30 días naturales"],"c":1,"por":"Es el plazo general de la normativa de consumidores."}
  - {"p":"¿Se puede enviar un correo comercial a cualquier dirección que encontremos en internet?","o":["Sí, si es la dirección genérica de una empresa","No, hace falta consentimiento previo","Sí, si incluye un enlace para darse de baja","Sí, si la dirección es pública en su web"],"c":1,"por":"La LSSI prohíbe las comunicaciones comerciales no solicitadas."}
  - {"p":"¿Qué exige la Ley europea de accesibilidad a muchas tiendas en línea desde 2025?","o":["Que la web y el proceso de compra sean accesibles para personas con discapacidad","Que la web esté disponible en varios idiomas","Que la web funcione bien en el móvil","Que la tienda tenga atención al cliente por teléfono"],"c":0,"por":"Contraste, texto alternativo, navegación con teclado y formularios claros, entre otros."}
  - {"p":"Caso real · Google (2022). La autoridad francesa de protección de datos le impuso 150 millones de euros de multa. ¿Por qué?","o":["Por no tener aviso legal","Porque rechazar las cookies era más difícil que aceptarlas","Por enviar correos comerciales sin permiso","Por no respetar el derecho de desistimiento"],"c":1,"por":"El consentimiento debe ser libre: rechazar debe costar lo mismo que aceptar."}
  - {"p":"Caso real · Meta (2023). Recibió una multa de 1.200 millones de euros, la más alta hasta entonces por protección de datos, por transferir datos de usuarios europeos a Estados Unidos. ¿Qué norma incumplió?","o":["La LSSI","La Ley de servicios digitales","El Reglamento general de protección de datos (RGPD)","La Ley europea de accesibilidad"],"c":2,"por":"El RGPD regula dónde y cómo se pueden tratar los datos personales, también cuando salen de la UE."}
---
La <b>LSSI-CE</b> obliga a identificar a la empresa en la web (aviso legal con razón social, NIF, dirección y contacto) y prohíbe enviar comunicaciones comerciales por correo o SMS sin <b>consentimiento previo</b>, salvo a clientes anteriores con productos parecidos y posibilidad de baja.

El <b>RGPD</b> y la <b>LOPDGDD</b> regulan los datos personales: base legal para tratarlos, información clara (política de privacidad), mínimo de datos necesarios, seguridad y los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad. Las <b>cookies</b> no necesarias requieren consentimiento, y rechazar debe ser tan fácil como aceptar.

En las ventas a distancia, el consumidor tiene un <b>derecho de desistimiento de 14 días naturales</b> sin tener que justificarlo (con excepciones como los productos perecederos o personalizados), y hay que informar de las condiciones de venta, devolución y cancelación antes de comprar.

Normas más recientes: la <b>Ley europea de accesibilidad</b> obliga desde junio de 2025 a muchas tiendas en línea a ser accesibles; la <b>Ley de servicios digitales</b> (DSA) exige a los marketplaces identificar a los vendedores y hacer transparente la publicidad; las <b>reseñas falsas</b> están prohibidas; y la publicidad con creadores debe identificarse como publicidad. Para medir respetando el consentimiento, Google usa el <b>modo de consentimiento</b>.
