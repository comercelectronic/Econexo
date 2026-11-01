---
id: L_rendibilitat
titulo: "Rentabilidad por cliente"
objetivo: "Saber qué clientes hacen crecer la empresa y cuáles la desgastan."
orden: 32
codigos: []
area: "Dirección empresarial"
capitulo: "4.5"
capitulo_titulo: "La reunión que lo cambia todo"
estado: publicada
tira:
  - [{"quien":"eco","gesto":"alegria","texto":"¡Mi mejor cliente me paga 1.000 € al mes!"}]
  - [{"quien":"nexo","gesto":"pensativo","texto":"¿Cuántas horas le dedicas?"},{"quien":"eco","gesto":"sorpresa","texto":"Unas 50… ¡ay, a 25 € la hora!"}]
  - [{"quien":"nexo","gesto":"paciencia","texto":"Te cuesta 1.250 €: pierdes dinero. Habla con él para revisar el alcance o el precio."}]
ejemplo: "Cliente A: 1.500 €/mes, 80 h reales × 25 € = 2.000 € de coste → −500 €. Cliente B: 600 €/mes, 12 h × 25 € = 300 € → +300 €."
errores: ["Mirar solo la facturación.","No registrar las horas reales.","Rebajar precios por miedo."]
test:
  - {"p":"Un cliente paga 1.000 €/mes y consume 50 h a 25 €/h. ¿Qué margen deja?","o":["−250 €","+250 €","0 €","−1.250 €"],"c":0,"por":"50 × 25 = 1.250 € de coste: 1.000 − 1.250 = −250 €."}
  - {"p":"¿Qué dato necesitas para calcular la rentabilidad por cliente?","o":["Las horas reales dedicadas","Las horas presupuestadas en el contrato","La facturación anual del cliente","El número de proyectos que te ha encargado"],"c":0,"por":"Sin horas reales no sabes el coste."}
  - {"p":"Ante un cliente poco rentable, la primera opción debería ser…","o":["Subirle el precio a partir del mes siguiente","Hablar con él para revisar alcance o precio","Dedicarle menos horas hasta que cuadre","Pasarlo a un becario para reducir el coste"],"c":1,"por":"A menudo se puede reconducir con una conversación clara."}
  - {"p":"Caso real · Best Buy (2004). La cadena de electrónica detectó clientes que solo compraban en rebajas, devolvían productos y los revendían. ¿Qué hizo?","o":["Bajó los precios para todo el mundo","Analizó la rentabilidad por cliente y dejó de priorizar a los que le hacían perder dinero","Hizo más publicidad para captar nuevos","Quitó las rebajas para siempre"],"c":1,"por":"No todos los clientes son rentables. Saber cuáles lo son permite decidir dónde poner el esfuerzo."}
  - {"p":"Caso real · Ryanair. Cobra aparte el equipaje grande, elegir asiento o embarcar primero. ¿Qué consigue con este modelo?","o":["Que todos los pasajeros paguen lo mismo","Que el billete sea más caro pero con todo incluido","Que cada cliente pague por el servicio que usa y el precio base sea bajo","Que los clientes usen más servicios gratuitos"],"c":2,"por":"Separar el servicio básico de los extras hace que cada cliente sea rentable. En una agencia, es lo mismo con las revisiones o trabajos fuera del alcance."}
---
No todos los clientes son igual de rentables. Para cada cliente: <b>ingresos</b> − <b>horas reales × coste por hora</b> − otros costes = <b>margen</b>.

Un cliente que paga mucho pero consume el triple de horas de las presupuestadas puede ser menos rentable que uno pequeño y ordenado.

Opciones: <b>revisar precios</b>, <b>ajustar el alcance</b>, <b>mejorar procesos</b> o, como último recurso, <b>dejar al cliente</b> de forma profesional.
