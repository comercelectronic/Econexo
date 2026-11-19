---
id: A_codigos
titulo: "Códigos de barras, etiquetas y trazabilidad"
objetivo: "Interpretar los códigos EAN y GS1-128 y explicar para qué sirve la trazabilidad."
orden: 6
codigos: ["2.4", "8.2"]
area: "Recepción de mercancías"
capitulo: "1"
capitulo_titulo: "Mozo de almacén"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "confusion", "texto": "8 41 23456 78901 2… ¿Es la lotería?"}]
  - [{"quien": "nexo", "gesto": "guino", "texto": "Es un EAN-13. El 84 es el prefijo de España. Y el último número comprueba que esté bien leído."}]
  - [{"quien": "eco", "gesto": "sorpresa", "texto": "¡El código habla!"}]
ejemplo: "En Palet, el lector de códigos te dice el lote y la caducidad de cada caja. Si un día hay una alerta por un lote de mayonesa, sabrás a qué tiendas ha ido."
errores: ["Pensar que el EAN indica dónde se ha fabricado el producto: indica dónde se registró la empresa.", "No registrar el lote: sin lote no hay trazabilidad."]
test:
  - {"p": "¿Qué prefijo GS1 corresponde a España?", "o": ["84", "34", "76", "00"], "c": 0, "por": "Las empresas registradas en GS1 España usan el 84."}
  - {"p": "¿Para qué sirve el último dígito del EAN-13?", "o": ["Indica el precio", "Es un dígito de control que detecta errores de lectura", "Indica el país de fabricación", "Es el número de lote"], "c": 1, "por": "Se calcula a partir de los otros dígitos."}
  - {"p": "¿Qué código identifica de forma única cada palé?", "o": ["EAN-13", "SSCC (en GS1-128)", "QR del producto", "Código de ubicación"], "c": 1, "por": "El SSCC tiene 18 dígitos y es único para cada unidad logística."}
  - {"p": "Hay una alerta sanitaria por un lote de queso. ¿Qué permite la trazabilidad?", "o": ["Retirar solo ese lote y saber a qué clientes ha ido", "Retirar todos los quesos del mercado", "Cambiar el precio", "Nada"], "c": 0, "por": "Se localiza el lote exacto."}
---
El <b>EAN-13</b> es el código de barras de 13 dígitos de los productos de consumo: prefijo de la organización GS1 del país (84 para España), código de la empresa, código del producto y un <b>dígito de control</b> que detecta errores de lectura.

El <b>GS1-128</b> se usa en las unidades logísticas (cajas y palés) y puede llevar varios datos con <b>identificadores de aplicación</b>: código del artículo, <b>lote</b>, fecha de caducidad, cantidad o el <b>SSCC</b> (código único de 18 dígitos de cada palé). El <b>RFID</b> son etiquetas con chip que se leen por radiofrecuencia sin verlas.

La <b>trazabilidad</b> permite saber de dónde viene cada lote y a qué clientes ha ido. Es obligatoria en alimentación: si hay una alerta sanitaria, se retira solo el lote afectado.
