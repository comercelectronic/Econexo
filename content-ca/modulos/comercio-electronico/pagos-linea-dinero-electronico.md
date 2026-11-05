---
id: L_pagaments
titulo: "Pagaments en línia i diners electrònics"
objetivo: "Triar els mitjans de pagament d'una botiga en línia."
orden: 34
codigos: ["1.8","2.8","1.14"]
area: "Web i comerç electrònic"
capitulo: "4.7"
capitulo_titulo: "Mobles Ter: pagaments i seguretat"
estado: publicada
tira:
  - [{"quien":"eco","gesto":"senalando","texto":"A la meva botiga en línia només es pot pagar amb transferència."}]
  - [{"quien":"nexo","gesto":"esceptico","texto":"I per què se'n van tants clients?"},{"quien":"eco","gesto":"confusion","texto":"Perquè no els agrada comprar?"}]
  - [{"quien":"nexo","gesto":"guino","texto":"Ofereix el que fa servir el teu públic: targeta, Bizum, PayPal… amb pagament segur i verificació en dos passos."}]
ejemplo: "La botiga de mobles ofereix targeta, Bizum, PayPal i finançament a 12 mesos per a compres de més de 600 €. L'abandonament del carretó baixa un 20 %."
errores: ["Oferir només transferència bancària.","Amagar les comissions del contra reemborsament fins al final.","Guardar les dades de targeta dels clients a la teva base de dades."]
test:
  - {"p":"Què és un TPV virtual?","o":["El sistema que permet cobrar amb targeta a la web","El datàfon que es connecta per Wi-Fi a la botiga","El programa de facturació de la botiga en línia","Un moneder digital per pagar amb el mòbil"],"c":0,"por":"És l'equivalent en línia del datàfon."}
  - {"p":"Què exigeix la directiva PSD2 en els pagaments en línia?","o":["Autenticació reforçada amb dos factors","Que tots els pagaments es facin amb targeta","Que la botiga guardi les dades de les targetes xifrades","Un límit màxim per a cada compra en línia"],"c":0,"por":"L'autenticació reforçada redueix el frau."}
  - {"p":"Què és el diner electrònic?","o":["Valor monetari emmagatzemat electrònicament, com en un moneder digital","Qualsevol pagament fet amb targeta","Una criptomoneda com el bitcoin","Una transferència bancària immediata"],"c":0,"por":"És un mitjà de pagament regulat."}
  - {"p":"Cas real · eBay i PayPal. El 2002, eBay va comprar PayPal perquè molts compradors no es fiaven de pagar a desconeguts. Quin problema resolia PayPal?","o":["Els costos d'enviament","La confiança: pagar sense donar la targeta al venedor","La velocitat de la web","El canvi de moneda"],"c":1,"por":"Un intermediari de pagament de confiança redueix la por i augmenta les vendes."}
  - {"p":"Cas real · Klarna. Permet comprar ara i pagar més endavant o a terminis, i moltes botigues de moda l'ofereixen. Què ha de vigilar la botiga?","o":["Que el client no pugui retornar la compra","Informar clarament de les condicions i els costos del pagament ajornat","Cobrar més car als clients que el fan servir","No oferir cap altre mètode de pagament"],"c":1,"por":"El pagament ajornat pot augmentar la conversió, però el client ha de saber exactament què paga i quan."}
---
Mitjans de pagament en línia: <b>targeta</b> amb TPV virtual o passarel·les (Redsys, Stripe), <b>PayPal</b> i altres moneders, <b>Bizum</b>, <b>transferència</b>, <b>domiciliació</b>, pagament ajornat (finançament), <b>contra reemborsament</b> i pagament amb el mòbil (Apple Pay, Google Pay).

El <b>diner electrònic</b> és un valor monetari emmagatzemat electrònicament (moneders digitals, targetes prepagament) que s'accepta com a pagament. Les entitats que l'emeten estan supervisades.

Cal equilibrar <b>comissions</b>, <b>confiança</b> del client i <b>seguretat</b>: oferir els mètodes que el teu públic fa servir, mostrar-los abans del pagament i complir l'autenticació reforçada (PSD2: el banc demana un segon factor).
