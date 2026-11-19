---
id: A_abc
titulo: "El análisis ABC"
objetivo: "Clasificar las referencias en A, B y C y decidir cómo gestionar cada grupo."
orden: 22
codigos: ["4.6"]
area: "Gestión de stocks e inventarios"
capitulo: "5"
capitulo_titulo: "Jefe de almacén"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "confusion", "texto": "Tengo 500 referencias. ¿Las controlo todas igual?"}]
  - [{"quien": "nexo", "gesto": "senalando", "texto": "Unas pocas suponen casi todo el valor. Esas, las A, contrólalas al detalle."}]
  - [{"quien": "eco", "gesto": "alegria", "texto": "¡El 80-20!"}]
ejemplo: "En Palet, el jefe de almacén ve qué referencias son A: el aceite y la leche salen cada día y suponen gran parte del valor; las especias son C."
errores: ["Controlar igual 500 referencias en lugar de centrarse en las A.", "Clasificar solo por precio sin tener en cuenta el consumo."]
test:
  - {"p": "En un análisis ABC típico, las referencias A son…", "o": ["Muchas referencias con poco valor", "Pocas referencias que concentran la mayor parte del valor", "Las más baratas", "Las que tienen menos salidas"], "c": 1, "por": "Principio de Pareto (80-20)."}
  - {"p": "¿Cómo se calcula el valor que ordena el ABC?", "o": ["Precio de venta", "Consumo anual × coste unitario", "Peso × volumen", "Número de proveedores"], "c": 1, "por": "Combina cantidad y coste."}
  - {"p": "¿Qué referencias se cuentan con más frecuencia?", "o": ["Las A", "Las B", "Las C", "Ninguna"], "c": 0, "por": "Un error en ellas pesa mucho."}
  - {"p": "Un ABC por número de salidas sirve sobre todo para…", "o": ["Fijar el precio", "Decidir las ubicaciones (las de más rotación cerca de la expedición)", "Elegir el transportista", "Calcular el IVA"], "c": 1, "por": "Reduce los recorridos de picking."}
---
El <b>análisis ABC</b> aplica el principio de Pareto: pocas referencias concentran la mayor parte del valor (o de las salidas). Se ordenan las referencias de más a menos valor anual (consumo × coste) y se clasifican: <b>A</b> (alrededor del 20 % de las referencias, cerca del 80 % del valor), <b>B</b> (unos 30 % de referencias, 15 % del valor) y <b>C</b> (alrededor del 50 % de las referencias, solo un 5 % del valor). Los porcentajes son orientativos.

Usos: las <b>A</b> se controlan a menudo (inventario cíclico frecuente, previsión ajustada, mejores ubicaciones si son de alta rotación); las <b>C</b>, con controles más sencillos y pedidos más espaciados. El ABC por <b>rotación</b> (número de salidas) sirve para decidir las ubicaciones.
