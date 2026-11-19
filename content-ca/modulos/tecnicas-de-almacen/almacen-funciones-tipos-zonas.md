---
id: A_almacen
titulo: "El magatzem: funcions, tipus i zones"
objetivo: "Explicar per a què serveix un magatzem, quins tipus n'hi ha i com es reparteix l'espai."
orden: 1
codigos: ["1.1", "1.2"]
area: "Organització del magatzem"
capitulo: "1"
capitulo_titulo: "Mosso de magatzem"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "alegria", "texto": "Primer dia al magatzem! Deixo les caixes on hi hagi lloc, oi?"}]
  - [{"quien": "nexo", "gesto": "esceptico", "texto": "I com les trobarà el company que prepara les comandes?"}]
  - [{"quien": "nexo", "gesto": "guino", "texto": "Cada zona té la seva funció: recepció, emmagatzematge, preparació i expedició."}]
ejemplo: "A Palet, el camió del proveïdor descarrega al moll 1, revises la mercaderia a la zona de recepció, la portes a la seva prestatgeria i, quan arriba una comanda, la prepares i la deixes al moll d'expedició."
errores: ["Deixar mercaderia als passadissos o a la zona de recepció «un moment»: bloqueja el flux i és perillós.", "Confondre la zona de preparació amb la d'expedició."]
test:
  - {"p": "Quin magatzem guarda la mercaderia només unes hores per repartir-la a altres destinacions?", "o": ["Magatzem regulador", "Plataforma de cross-docking (de trànsit)", "Magatzem de matèries primeres", "Magatzem de recanvis"], "c": 1, "por": "La mercaderia entra i surt gairebé sense emmagatzemar-se."}
  - {"p": "A quina zona es comprova que la mercaderia coincideix amb l'albarà?", "o": ["Expedició", "Recepció i control", "Picking", "Zona de serveis"], "c": 1, "por": "Abans d'ubicar-la cal revisar-la."}
  - {"p": "En un magatzem amb flux en U…", "o": ["L'entrada i la sortida són al mateix costat", "L'entrada i la sortida són a costats oposats", "No hi ha molls", "Només hi ha una prestatgeria"], "c": 0, "por": "Els molls d'entrada i sortida comparteixen façana."}
  - {"p": "Quina NO és una funció del magatzem?", "o": ["Rebre la mercaderia", "Conservar la mercaderia", "Fixar el preu de venda", "Preparar les comandes"], "c": 2, "por": "El preu és una decisió comercial."}
---
El <b>magatzem</b> guarda la mercaderia entre que arriba del proveïdor i surt cap al client. Les seves funcions: <b>rebre</b>, <b>emmagatzemar i conservar</b>, <b>controlar l'estoc</b>, <b>preparar les comandes</b> i <b>expedir-les</b>.

Tipus: segons la mercaderia (matèries primeres, producte acabat, recanvis), la funció (de fàbrica, de distribució, regulador, de trànsit o <i>cross-docking</i>, on la mercaderia gairebé no es guarda), el règim (propi, llogat, d'un operador logístic) o el grau d'automatització.

Zones habituals: <b>molls</b> de càrrega i descàrrega, <b>recepció i control</b>, <b>emmagatzematge</b> (prestatgeries, cambra de fred, zona de perillosos), <b>preparació de comandes</b> (picking), <b>expedició</b>, zones de servei (oficina, vestidors, càrrega de bateries) i passadissos. El <b>flux</b> pot ser en U (entrada i sortida pel mateix costat) o en línia recta (entrada per un costat i sortida per l'altre).
