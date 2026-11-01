---
id: L_zones
titulo: "Zonas calientes, flujo de caja y herramientas de diseño"
objetivo: "Analizar dónde mira y hace clic el usuario, controlar la caja de la tienda y usar herramientas gráficas."
orden: 52
codigos: ["3.10","3.9","3.7","3.11","3.8"]
area: "Analítica"
capitulo: "7.6"
capitulo_titulo: "Dónde mira el usuario y dónde se pierde el dinero"
estado: publicada
tira:
  - [{"quien":"eco","gesto":"senalando","texto":"¡El botón de comprar está abajo del todo! Así la gente lee toda la web."}]
  - [{"quien":"nexo","gesto":"pensativo","texto":"El mapa de calor dice que nadie llega hasta abajo."},{"quien":"eco","gesto":"sorpresa","texto":"¿Hay un mapa de mi web? ¿Con tesoros?"}]
  - [{"quien":"nexo","gesto":"guino","texto":"Muestra dónde miran y hacen clic. Pon lo importante arriba… y vigila la caja de la tienda."}]
ejemplo: "El mapa de calor de la charcutería muestra que nadie ve el botón del envío refrigerado porque está abajo del todo: lo suben a la parte superior y los pedidos aumentan un 15 %."
errores: ["Poner la información clave donde nadie llega haciendo scroll.","Obligar a crear una cuenta para comprar.","Confundir ventas con dinero disponible en el banco."]
test:
  - {"p":"¿Qué muestra un mapa de calor?","o":["Dónde miran, hacen clic y hacen scroll los usuarios","Qué páginas tienen más visitas","De dónde vienen geográficamente las visitas","Las horas del día con más tráfico"],"c":0,"por":"Revela las zonas calientes y las que nadie ve."}
  - {"p":"¿Por qué una tienda con muchas ventas puede tener problemas de caja?","o":["Porque paga stock y publicidad antes de cobrar","Porque el margen por pedido es demasiado bajo","Porque tiene demasiadas devoluciones","Porque paga demasiados impuestos"],"c":0,"por":"El margen bajo o las devoluciones también influyen, pero una tienda rentable se puede quedar sin caja si los pagos van antes que los cobros."}
  - {"p":"¿Qué programa es vectorial, adecuado para diseñar un logo?","o":["Illustrator","Photoshop","GIMP","Canva"],"c":0,"por":"Los logos se hacen en vectorial (Illustrator, Inkscape) para que escalen sin perder calidad. Photoshop y GIMP trabajan con píxeles."}
  - {"p":"Caso real · Amazon. A menudo cobra de los clientes antes de pagar a los proveedores, y eso le da caja para crecer. ¿Cómo se llama esta ventaja?","o":["Margen bruto alto","Ciclo de caja favorable (cobrar antes de pagar)","Beneficio extraordinario","Concentración de clientes"],"c":1,"por":"Una tienda pequeña a menudo hace lo contrario: paga stock y anuncios antes de cobrar. Por eso hace falta un plan de flujo de caja."}
  - {"p":"Caso real · Nielsen Norman Group (2006). Con estudios de seguimiento ocular, descubrieron que muchos usuarios leen las webs siguiendo un patrón en forma de F. ¿Qué implica para el diseño?","o":["Que hay que poner la información clave abajo del todo","Que la información clave debe ir arriba y al inicio de las líneas","Que hay que escribir textos muy largos","Que las imágenes no se miran nunca"],"c":1,"por":"La parte superior y el comienzo de las líneas son las zonas calientes: ahí van los mensajes y botones clave."}
---
Los <b>mapas de calor</b> (Hotjar, Microsoft Clarity) muestran las <b>zonas calientes</b> donde el usuario mira, hace clic y hasta dónde hace scroll: la parte superior de la página y el patrón en F reciben más atención. La <b>zona de usuario</b> (área de cliente con inicio de sesión) permite ver pedidos, guardar direcciones y listas de deseos. El <b>carrito</b> debe mostrar los costes totales pronto y permitir comprar como invitado.

El <b>flujo de caja</b> de una tienda en línea incluye cobros (que la pasarela ingresa con unos días de retraso), comisiones de pago y de marketplace, devoluciones, envíos, compras de stock, publicidad e impuestos. Se puede vender mucho y quedarse sin caja si el stock y la publicidad se pagan antes de cobrar.

<b>Programas de diseño gráfico</b> y utilidades para la web: Canva o Adobe Express (rápidos), Photoshop y GIMP (retoque de imagen), Illustrator e Inkscape (vectorial: logos), Figma (prototipos de web) y compresores de imagen (Squoosh, TinyPNG) para que la web cargue rápido.
