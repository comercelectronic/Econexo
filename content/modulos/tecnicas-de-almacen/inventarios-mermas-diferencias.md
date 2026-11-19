---
id: A_inventario
titulo: "Inventarios, mermas y diferencias"
objetivo: "Hacer un recuento, calcular las diferencias de inventario y buscar sus causas."
orden: 20
codigos: ["4.4", "4.5"]
area: "Gestión de stocks e inventarios"
capitulo: "5"
capitulo_titulo: "Jefe de almacén"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "confusion", "texto": "El sistema dice 48 cajas de galletas y yo cuento 45…"}]
  - [{"quien": "nexo", "gesto": "pensativo", "texto": "Diferencia de inventario: −3. ¿Rotas? ¿Mal registradas? ¿Un error de picking?"}]
  - [{"quien": "nexo", "gesto": "guino", "texto": "Se ajusta el sistema… y se busca la causa."}]
ejemplo: "En Palet, el jefe de almacén hace recuentos cíclicos. Si las diferencias crecen, es señal de errores en la recepción o el picking del equipo."
errores: ["Ajustar el stock del sistema sin investigar por qué no cuadra.", "Hacer el inventario con mercancía entrando y saliendo sin controlarla."]
test:
  - {"p": "Contar cada semana una parte del almacén sin parar la actividad es un inventario…", "o": ["Periódico", "Rotativo o cíclico", "Anual", "Permanente"], "c": 1, "por": "Se reparte el recuento a lo largo del año."}
  - {"p": "El sistema dice 120 y cuentas 114. ¿Diferencia de inventario?", "o": ["+6", "−6", "114", "0"], "c": 1, "por": "Real − teórico = 114 − 120 = −6."}
  - {"p": "¿Qué es una merma?", "o": ["Un producto que se ha vendido", "Una pérdida de mercancía por caducidad, rotura o deterioro", "Un descuento", "Una devolución de un cliente"], "c": 1, "por": "Producto que ya no se puede vender."}
  - {"p": "¿Qué productos se cuentan más a menudo en un inventario cíclico?", "o": ["Los C", "Los A, de más valor o rotación", "Los que pesan más", "Los más baratos"], "c": 1, "por": "Son los que más impacto tienen."}
---
El <b>inventario</b> es contar físicamente las existencias y compararlas con las del sistema. Tipos: <b>periódico</b> (todo el almacén de una vez, normalmente al cierre del ejercicio; a menudo hay que parar la actividad), <b>permanente</b> (el sistema actualiza el stock con cada entrada y salida) y <b>rotativo o cíclico</b> (se cuenta cada día o cada semana una parte del almacén, sin parar; los productos A más a menudo).

Las <b>diferencias de inventario</b> (stock real − stock teórico) pueden venir de <b>mermas</b> (caducados, roturas, deterioros), errores de recepción o de picking, registros mal hechos o robos. Las mermas conocidas se registran como bajas; las diferencias se ajustan en el sistema y se investiga la causa para corregirla.
