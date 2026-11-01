---
id: L_seguretat
titulo: "Seguridad: cifrado, certificados y firma digital"
objetivo: "Proteger las transacciones y los sistemas de una empresa digital."
orden: 35
codigos: ["2.10","2.11","5.9"]
area: "Nivel avanzado"
capitulo: "4.7"
capitulo_titulo: "Mobles Ter: pagos y seguridad"
estado: publicada
tira:
  - [{"quien":"eco","gesto":"alegria","texto":"Mi contraseña es «1234». Así no la olvido nunca."}]
  - [{"quien":"nexo","gesto":"enfado","texto":"Ni los ladrones."},{"quien":"eco","gesto":"sorpresa","texto":"¿Me la pueden adivinar?"}]
  - [{"quien":"nexo","gesto":"paciencia","texto":"Contraseñas largas y únicas, verificación en dos pasos, copias de seguridad y web con HTTPS."}]
ejemplo: "La tienda de muebles activa HTTPS, verificación en dos pasos en todas las cuentas y copias diarias. Cuando llega un correo falso «del banco», el equipo lo detecta porque ha hecho una formación de phishing."
errores: ["Usar la misma contraseña en todas partes.","No hacer copias de seguridad fuera del servidor.","Hacer clic en enlaces de correos urgentes sin comprobar el remitente."]
test:
  - {"p":"En el cifrado asimétrico...","o":["se usa una clave pública y una privada","se usa la misma clave para cifrar y descifrar","se usan dos claves privadas","la clave privada cifra y la pública descifra"],"c":0,"por":"La clave pública cifra; solo la privada descifra."}
  - {"p":"¿Qué garantiza la firma digital?","o":["La identidad del firmante y que el documento no se ha modificado","Que el documento es confidencial y solo lo puede leer el destinatario","La identidad del firmante y la fecha en que se creó","Que el documento se ha enviado por un canal cifrado"],"c":0,"por":"Autenticidad e integridad."}
  - {"p":"¿Cuál es una buena práctica contra el phishing?","o":["Comprobar remitente y enlaces antes de hacer clic","Abrir solo los adjuntos en PDF","Confiar en los correos que llevan el logo del banco","Cambiar la contraseña después de hacer clic en el enlace"],"c":0,"por":"El phishing se basa en engañar con urgencia y apariencia oficial."}
  - {"p":"Caso real · Target (2013). Los atacantes entraron en la red de la cadena con las credenciales de un proveedor de climatización y robaron datos de 40 millones de tarjetas. ¿Cuál fue el punto débil?","o":["El cifrado de la web","El acceso de un proveedor externo sin suficiente control","Los datáfonos de las tiendas","La contraseña del director"],"c":1,"por":"La seguridad es tan fuerte como el eslabón más débil: permisos mínimos también para los proveedores."}
  - {"p":"Caso real · WannaCry (2017). Este ransomware afectó a miles de empresas, entre ellas Telefónica, aprovechando una vulnerabilidad de Windows que ya tenía actualización. ¿Qué medida lo habría evitado?","o":["Cambiar todas las contraseñas","Aplicar las actualizaciones de seguridad a tiempo","Tener un antivirus gratuito","Usar cifrado asimétrico"],"c":1,"por":"Muchas infecciones aprovechan errores ya corregidos. Actualizar y tener copias 3-2-1 es la base."}
---
La <b>encriptación o cifrado</b> transforma la información para que solo la pueda leer quien tiene la clave. <b>Simétrico</b>: la misma clave para cifrar y descifrar. <b>Asimétrico</b>: una clave pública para cifrar y una privada para descifrar. El <b>HTTPS</b> (TLS) cifra la conexión entre el navegador y la web: el candado es imprescindible en una tienda.

Un <b>certificado digital</b> identifica a una persona, empresa o web (emitido por una autoridad de certificación). La <b>firma digital</b> garantiza quién ha firmado un documento y que no se ha modificado. El <b>DNI electrónico</b> lleva certificados para identificarse y firmar en línea, como el idCAT o el certificado de la FNMT.

Estrategia de <b>seguridad informática</b>: contraseñas largas y únicas con gestor, verificación en dos pasos, actualizaciones, copias de seguridad (regla 3-2-1), permisos mínimos, formación contra el <b>phishing</b> y un plan de respuesta a incidentes.
