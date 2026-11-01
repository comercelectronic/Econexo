---
id: L_ads2
titulo: "Diagnosticar una campaña: CTR, CPC, CPA y ROAS"
objetivo: "Encontrar dónde falla una campaña antes de tocar nada."
orden: 36
codigos: ["1.6"]
area: "Publicidad digital"
capitulo: "5.1"
capitulo_titulo: "La campaña que sale mal"
estado: publicada
tira:
  - [{"quien":"eco","gesto":"alegria","texto":"¡Mi anuncio tiene muchísimos clics! Pero no vendo nada."}]
  - [{"quien":"nexo","gesto":"pensativo","texto":"Si el anuncio atrae, el problema está después del clic."},{"quien":"eco","gesto":"confusion","texto":"¿Después del clic hay algo?"}]
  - [{"quien":"nexo","gesto":"guino","texto":"La página de destino y la medición. Mira el CTR, el CPA y el ROAS juntos."}]
ejemplo: "CTR del 3 % (bueno), 400 clics, 0 compras registradas. Al revisarlo, la página de pago no funcionaba en móviles Android (caso simulado)."
errores: ["Cambiar el anuncio cuando el problema es la web.","Mirar el ROAS sin restar el margen del producto.","Sacar conclusiones con pocos datos."]
test:
  - {"p":"10.000 impresiones y 200 clics. ¿Cuál es el CTR?","o":["0,2 %","2 %","20 %","5 %"],"c":1,"por":"200 ÷ 10.000 = 0,02 → 2 %."}
  - {"p":"Has gastado 600 € y has hecho 20 ventas. ¿Cuál es el CPA?","o":["30 €","3,3 €","300 €","20 €"],"c":0,"por":"600 ÷ 20 = 30 €."}
  - {"p":"Muchos clics, CTR alto, cero conversiones. ¿Dónde miras primero?","o":["La página de destino y el seguimiento de conversiones","La segmentación del público del anuncio","El texto y la imagen del anuncio","La puja máxima por clic"],"c":0,"por":"El anuncio funciona; el problema está después del clic."}
  - {"p":"Caso real · Super Bowl 2024. Un anuncio de 30 segundos costaba unos 7 millones de dólares y el partido lo vieron unos 120 millones de personas. ¿Cuál es el coste por mil impresiones (CPM) aproximado?","o":["Unos 58 $","Unos 5,8 $","Unos 583 $","Unos 17 $"],"c":0,"por":"7.000.000 ÷ (120.000.000 ÷ 1.000) = 7.000.000 ÷ 120.000 ≈ 58 $ por mil espectadores."}
  - {"p":"Caso real · Google Ads. El «nivel de calidad» hace que un anuncio más relevante pueda pagar menos por clic que un competidor que puja más. ¿Cómo bajas el CPC?","o":["Pujando menos y esperando","Mejorando la relevancia del anuncio, de las palabras clave y de la página de destino","Añadiendo muchas más palabras clave","Mostrando el anuncio solo de noche"],"c":1,"por":"Google premia los anuncios útiles para el usuario: más calidad, más posición por menos dinero."}
---
<b>CTR</b> = clics ÷ impresiones. Indica si el anuncio llama la atención del público. <b>CPC</b> = coste ÷ clics. <b>CPA</b> = coste ÷ conversiones (cuánto cuesta cada venta o contacto). <b>ROAS</b> = ingresos generados ÷ inversión publicitaria.

Lee el embudo: si el CTR es bueno pero no hay conversiones, el problema puede ser la <b>página de destino</b>, el proceso de compra o el <b>seguimiento</b> (la conversión no se registra).

Antes de parar una campaña, comprueba que los datos son <b>fiables</b>.
