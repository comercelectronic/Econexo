---
id: L_pagaments
titulo: "Pagos en línea y dinero electrónico"
objetivo: "Elegir los medios de pago de una tienda en línea."
orden: 34
codigos: ["1.8","2.8","1.14"]
area: "Web y comercio electrónico"
capitulo: "4.7"
capitulo_titulo: "Mobles Ter: pagos y seguridad"
estado: publicada
tira:
  - [{"quien":"eco","gesto":"senalando","texto":"En mi tienda online solo se puede pagar con transferencia."}]
  - [{"quien":"nexo","gesto":"esceptico","texto":"¿Y por qué se van tantos clientes?"},{"quien":"eco","gesto":"confusion","texto":"¿Porque no les gusta comprar?"}]
  - [{"quien":"nexo","gesto":"guino","texto":"Ofrece lo que usa tu público: tarjeta, Bizum, PayPal… con pago seguro y verificación en dos pasos."}]
ejemplo: "La tienda de muebles ofrece tarjeta, Bizum, PayPal y financiación a 12 meses para compras de más de 600 €. El abandono del carrito baja un 20 %."
errores: ["Ofrecer solo transferencia bancaria.","Esconder las comisiones del contra reembolso hasta el final.","Guardar los datos de tarjeta de los clientes en tu base de datos."]
test:
  - {"p":"¿Qué es un TPV virtual?","o":["El sistema que permite cobrar con tarjeta en la web","El datáfono que se conecta por Wi-Fi en la tienda","El programa de facturación de la tienda en línea","Un monedero digital para pagar con el móvil"],"c":0,"por":"Es el equivalente en línea del datáfono."}
  - {"p":"¿Qué exige la directiva PSD2 en los pagos en línea?","o":["Autenticación reforzada con dos factores","Que todos los pagos se hagan con tarjeta","Que la tienda guarde los datos de las tarjetas cifrados","Un límite máximo para cada compra en línea"],"c":0,"por":"La autenticación reforzada reduce el fraude."}
  - {"p":"¿Qué es el dinero electrónico?","o":["Valor monetario almacenado electrónicamente, como en un monedero digital","Cualquier pago hecho con tarjeta","Una criptomoneda como el bitcoin","Una transferencia bancaria inmediata"],"c":0,"por":"Es un medio de pago regulado."}
  - {"p":"Caso real · eBay y PayPal. En 2002, eBay compró PayPal porque muchos compradores no se fiaban de pagar a desconocidos. ¿Qué problema resolvía PayPal?","o":["Los costes de envío","La confianza: pagar sin dar la tarjeta al vendedor","La velocidad de la web","El cambio de moneda"],"c":1,"por":"Un intermediario de pago de confianza reduce el miedo y aumenta las ventas."}
  - {"p":"Caso real · Klarna. Permite comprar ahora y pagar más adelante o a plazos, y muchas tiendas de moda lo ofrecen. ¿Qué debe vigilar la tienda?","o":["Que el cliente no pueda devolver la compra","Informar claramente de las condiciones y los costes del pago aplazado","Cobrar más caro a los clientes que lo usan","No ofrecer ningún otro método de pago"],"c":1,"por":"El pago aplazado puede aumentar la conversión, pero el cliente debe saber exactamente qué paga y cuándo."}
---
Medios de pago en línea: <b>tarjeta</b> con TPV virtual o pasarelas (Redsys, Stripe), <b>PayPal</b> y otros monederos, <b>Bizum</b>, <b>transferencia</b>, <b>domiciliación</b>, pago aplazado (financiación), <b>contra reembolso</b> y pago con el móvil (Apple Pay, Google Pay).

El <b>dinero electrónico</b> es un valor monetario almacenado electrónicamente (monederos digitales, tarjetas prepago) que se acepta como pago. Las entidades que lo emiten están supervisadas.

Hay que equilibrar <b>comisiones</b>, <b>confianza</b> del cliente y <b>seguridad</b>: ofrecer los métodos que usa tu público, mostrarlos antes del pago y cumplir la autenticación reforzada (PSD2: el banco pide un segundo factor).
