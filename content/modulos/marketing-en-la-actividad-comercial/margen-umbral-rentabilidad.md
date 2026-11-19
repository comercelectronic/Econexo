---
id: M_margen
titulo: "Margen y umbral de rentabilidad"
objetivo: "Calcular el margen sobre coste y sobre venta y el umbral de rentabilidad de una tienda."
orden: 16
codigos: ["5.4"]
area: "Las políticas de precio"
capitulo: "1"
capitulo_titulo: "Tienda de barrio"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "alegria", "texto": "¡Hoy he vendido 300 €! ¡Soy rico!"}]
  - [{"quien": "nexo", "gesto": "paciencia", "texto": "Resta lo que te costó el producto y el alquiler, la luz, el sueldo…"}]
  - [{"quien": "eco", "gesto": "verguenza", "texto": "…Me quedan 4 €."}, {"quien": "nexo", "gesto": "guino", "texto": "Por eso hay que conocer el margen y el umbral."}]
ejemplo: "Compras a 6 € y vendes a 10 €: margen de 4 €, un 40 % sobre el precio y un 66,7 % sobre el coste. Si tus costes fijos son 400 € al mes, necesitas vender 100 unidades al mes solo para quedarte a cero."
errores: ["Querer un 40 % de margen y multiplicar el coste por 1,4 (eso es un 40 % sobre el coste).", "Confundir ventas con beneficio."]
test:
  - {"p": "Compras a 6 € y vendes a 10 €. ¿Margen sobre el precio?", "o": ["40 %", "66,7 %", "4 %", "60 %"], "c": 0, "por": "(10 − 6) ÷ 10 = 0,40."}
  - {"p": "Quieres un 50 % de margen sobre el precio y el producto te cuesta 3 €. ¿A qué precio vendes?", "o": ["4,50 €", "6 €", "3,50 €", "5 €"], "c": 1, "por": "3 ÷ (1 − 0,5) = 6 €."}
  - {"p": "Costes fijos de 900 €, precio de 15 € y coste variable de 6 €. ¿Umbral en unidades?", "o": ["60", "100", "150", "90"], "c": 1, "por": "900 ÷ (15 − 6) = 100 unidades."}
  - {"p": "¿Qué es un coste fijo?", "o": ["El producto que compras para vender", "El alquiler del local", "La comisión del datáfono por venta", "El envase de cada producto"], "c": 1, "por": "No cambia aunque vendas más o menos."}
---
<b>Margen</b> por unidad = precio de venta − coste. En porcentaje se puede calcular <b>sobre el precio de venta</b> (margen ÷ precio) o <b>sobre el coste</b> (margen ÷ coste); no dan el mismo número. Si quieres un margen sobre el precio: <b>precio = coste ÷ (1 − margen)</b>.

Los <b>costes fijos</b> no cambian con las ventas (alquiler, sueldos, luz) y los <b>variables</b> sí (el producto que vendes). El <b>umbral de rentabilidad</b> o punto muerto es la venta mínima para no perder: <b>unidades = costes fijos ÷ (precio − coste variable unitario)</b>. Por encima del umbral, la empresa gana dinero.
