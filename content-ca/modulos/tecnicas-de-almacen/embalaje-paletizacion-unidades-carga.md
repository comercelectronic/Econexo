---
id: A_paletizacion
titulo: "Unitats de càrrega, paletització i etiquetatge"
objetivo: "Muntar un palet estable i etiquetar-lo per a l'expedició."
orden: 13
codigos: ["5.4", "3.5"]
area: "Preparació de comandes i expedició"
capitulo: "2"
capitulo_titulo: "Preparador de comandes"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "alegria", "texto": "Palet acabat! Les ampolles de vidre a baix i els sacs de farina a sobre."}]
  - [{"quien": "nexo", "gesto": "enfado", "texto": "Al revés! El que pesa i és resistent a baix, el fràgil a dalt. I film perquè no caigui."}]
  - [{"quien": "eco", "gesto": "verguenza", "texto": "El desmunto…"}]
ejemplo: "A Palet, si muntes el palet amb el fràgil a baix o sense film, en moure'l amb el transpalet pot caure alguna cosa: trencament, i la cap ho apunta."
errores: ["Posar el fràgil sota el que pesa.", "Deixar caixes que sobresurten del palet: es colpegen i es trenquen."]
test:
  - {"p": "Quant fa un europalet?", "o": ["1.200 × 800 mm", "1.000 × 1.000 mm", "1.200 × 1.200 mm", "800 × 600 mm"], "c": 0, "por": "És la mida estàndard europea."}
  - {"p": "Què va a la base del palet?", "o": ["El fràgil", "El que pesa i és resistent", "El que es lliura primer", "El més car"], "c": 1, "por": "Així aguanta el pes."}
  - {"p": "Per a què serveix creuar les caixes a cada capa (trenat)?", "o": ["Perquè el palet sigui més estable", "Perquè pesi menys", "Per estalviar film", "Perquè hi càpiguen més etiquetes"], "c": 0, "por": "Les capes queden travades."}
  - {"p": "Què NO sol portar l'etiqueta d'expedició?", "o": ["Destinatari", "Nombre de bults", "Preu de cost de cada producte", "Codi SSCC"], "c": 2, "por": "El cost no és informació logística per al transport."}
---
Les <b>unitats de càrrega</b> agrupen la mercaderia per moure-la d'un cop: caixa, <b>palet</b> (l'europalet fa 1.200 × 800 mm; l'americà o universal, 1.200 × 1.000 mm), contenidor. El palet és la unitat bàsica del magatzem i del transport.

<b>Paletitzar</b> bé: el <b>pesant i resistent a baix</b> i el lleuger i fràgil a dalt; les caixes ben encaixades, sense sobresortir del palet; les columnes o el <b>trenat</b> (creuar les caixes a cada capa) perquè sigui estable; alçada i pes màxims segons el transport; i al final <b>film estirable</b> o fleixos perquè no es mogui.

L'<b>etiqueta d'expedició</b> identifica el palet: destinatari, número de comanda, nombre de bults, pes, codi SSCC (GS1-128) i avisos (fràgil, aquest costat amunt, no apilar).
