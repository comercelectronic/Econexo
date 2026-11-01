---
id: L_atribucio
titulo: "Atribución e incrementalidad"
objetivo: "Interpretar con prudencia quién «se lleva» cada venta."
orden: 38
codigos: ["1.6","1.9"]
area: "Analítica"
capitulo: "5.3"
capitulo_titulo: "Los datos no cuadran"
estado: publicada
tira:
  - [{"quien":"eco","gesto":"alegria","texto":"Google dice que vendí 100. Meta, 100. TikTok, 50. ¡250 ventas!"}]
  - [{"quien":"nexo","gesto":"esceptico","texto":"Y la tienda dice 160."},{"quien":"eco","gesto":"confusion","texto":"¿Alguien miente?"}]
  - [{"quien":"nexo","gesto":"paciencia","texto":"Cada plataforma se atribuye las mismas ventas. Para saber qué funciona de verdad, haz pruebas con grupo de control."}]
ejemplo: "Meta dice 120 ventas, Google 90, el email 40. La tienda ha hecho 160. No hay ningún error grave: los modelos de atribución se solapan."
errores: ["Sumar las ventas de todas las plataformas.","Creer que atribuir es demostrar causalidad.","Cambiar de modelo de atribución para que un canal quede bien."]
test:
  - {"p":"Las plataformas suman 250 ventas, pero la tienda ha hecho 160. ¿Por qué?","o":["Las plataformas cuentan también las ventas de la competencia","Varios canales se atribuyen la misma venta","La tienda no ha instalado bien el píxel","Hay ventas canceladas que no se han restado"],"c":1,"por":"Cada plataforma cuenta las ventas en las que ha participado."}
  - {"p":"¿Cómo mides la incrementalidad?","o":["Con un experimento con grupo de control","Comparando el ROAS de cada plataforma","Con el modelo de atribución del último clic","Comparando el mes de la campaña con el mes anterior"],"c":0,"por":"Compara lo que pasa con y sin la campaña."}
  - {"p":"¿Qué es una ventana de conversión?","o":["El periodo después de un clic o impresión en que una venta se atribuye al anuncio","El tiempo que el anuncio se muestra a cada usuario","Los días que dura una campaña de anuncios","El tiempo que tarda un usuario en hacer clic en el anuncio"],"c":0,"por":"Ventanas más largas atribuyen más ventas."}
  - {"p":"Caso real · eBay (2013). Detuvo los anuncios en Google para búsquedas con su propio nombre en algunas zonas y las ventas casi no cambiaron. ¿Qué concluyes?","o":["Que los anuncios en Google no funcionan nunca","Que muchos de esos clics habrían llegado igualmente: tenían poca incrementalidad","Que el ROAS de esos anuncios era negativo","Que hay que invertir más en la propia marca"],"c":1,"por":"La plataforma se atribuía esas ventas, pero sin anuncios la gente hacía clic en el resultado orgánico. Solo un experimento lo revela."}
  - {"p":"Caso real · Airbnb (2020). Durante la pandemia recortó mucho la publicidad de rendimiento y el tráfico a la web se recuperó casi al nivel anterior. ¿Qué aprendió?","o":["Que la publicidad no sirve para marcas conocidas","Que el tráfico orgánico siempre supera al de pago","Que parte de las ventas atribuidas a los anuncios se habrían hecho igualmente","Que hay que volver a invertir el doble para recuperarse"],"c":2,"por":"Medir la incrementalidad permitió redirigir el presupuesto hacia la marca y el producto."}
---
La <b>atribución</b> es la regla que decide qué canal recibe el mérito de una venta. Cada plataforma usa su modelo y su <b>ventana de conversión</b> (por ejemplo, 7 días después del clic), y a menudo todas se atribuyen la misma venta.

Por eso la suma de las ventas que dicen las plataformas puede ser mayor que las ventas reales de la tienda.

La <b>incrementalidad</b> responde a otra pregunta: ¿cuántas ventas <b>no</b> se habrían producido sin la campaña? Se mide con experimentos: un grupo que ve los anuncios y otro que no (por ejemplo, por zonas geográficas).
