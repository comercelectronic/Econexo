/* La última vitrina · Acto 3 «Reunir apoyos» (castellano / catalán).
   Cada nodo tiene la pregunta del vecino (q) y opciones {t: texto, ok: correcta, r: respuesta}.
   Las respuestas correctas aplican criterios de escaparatismo (Dinamización del punto de venta). */
window.HistoriaVitrina = {
  apoyos: {
    2: { // Laia · Fotógrafa
      gana: {es: 'Laia guarda la carta de Prisma en un cajón. «Mañana cambio la vitrina: una sola foto grande, la cámara delante y luz rasante. Cuenta con mi voto.»',
             ca: 'La Laia desa la carta de Prisma en un calaix. «Demà canvio la vitrina: una sola foto gran, la càmera al davant i llum rasant. Compta amb el meu vot.»'},
      arbol: [
        {q: {es: 'Prisma me ofrece 300 € al mes por tapar mi escaparate con una pantalla. Mi estudio va justo de dinero. ¿Por qué no aceptarlo?',
             ca: 'Prisma m\'ofereix 300 € al mes per tapar el meu aparador amb una pantalla. L\'estudi va just de diners. Per què no ho hauria d\'acceptar?'},
         o: [{t: {es: 'Porque las pantallas no atraen a nadie.', ca: 'Perquè les pantalles no atrauen ningú.'}, ok: false,
              r: {es: 'Eso no es verdad: una pantalla brillante se mira. Dame un motivo que sea mío, no contra Prisma.', ca: 'Això no és veritat: una pantalla brillant es mira. Dona\'m un motiu que sigui meu, no contra Prisma.'}},
             {t: {es: 'Porque tu escaparate es tu portfolio: enseña tu trabajo real, con textura y escala, y nadie más lo puede mostrar.', ca: 'Perquè el teu aparador és el teu portfoli: ensenya la teva feina real, amb textura i escala, i ningú més la pot mostrar.'}, ok: true,
              r: {es: 'Mi portfolio… Es cierto: la gente entra cuando ve una copia en papel, no un vídeo.', ca: 'El meu portfoli… És cert: la gent entra quan veu una còpia en paper, no un vídeo.'}},
             {t: {es: 'Pide más dinero a Prisma y luego decides.', ca: 'Demana més diners a Prisma i després decideixes.'}, ok: false,
              r: {es: 'Entonces el escaparate dejaría de ser mío igual. No me ayudas a decidir.', ca: 'Aleshores l\'aparador deixaria de ser meu igualment. No m\'ajudes a decidir.'}}]},
        {q: {es: 'Vale, pero ¿cómo lo monto para que alguien se pare?', ca: 'D\'acord, però com el munto perquè algú s\'aturi?'},
         o: [{t: {es: 'Pon todas tus fotos para que se vea que tienes mucho trabajo.', ca: 'Posa-hi totes les fotos perquè es vegi que tens molta feina.'}, ok: false,
              r: {es: 'Así fue el año pasado y nadie se detenía: demasiadas cosas compitiendo.', ca: 'Així el vaig fer l\'any passat i ningú no s\'aturava: massa coses competint.'}},
             {t: {es: 'Una foto grande como punto focal a la altura de los ojos, la cámara delante y luz lateral que marque la textura.', ca: 'Una foto gran com a punt focal a l\'altura dels ulls, la càmera al davant i llum lateral que marqui la textura.'}, ok: true,
              r: {es: 'Un punto focal y luz rasante. Eso sí lo sé hacer.', ca: 'Un punt focal i llum rasant. Això sí que ho sé fer.'}},
             {t: {es: 'Pon un cartel grande de «OFERTAS».', ca: 'Posa-hi un cartell gran d\'«OFERTES».'}, ok: false,
              r: {es: 'No vendo ofertas, vendo una mirada. Eso desentona con mi tienda.', ca: 'No venc ofertes, venc una mirada. Això desentona amb la meva botiga.'}}]}
      ]
    },
    3: { // Jan · Diseñador de producto
      gana: {es: 'Jan dibuja un calendario en una servilleta. «Campañas de tres semanas, y repito el ensayo cada mes. Tienes mi apoyo, Lía.»',
             ca: 'En Jan dibuixa un calendari en un tovalló. «Campanyes de tres setmanes, i repeteixo l\'assaig cada mes. Tens el meu suport, Lia.»'},
      arbol: [
        {q: {es: 'Una pantalla se cambia en segundos. Mi escaparate me cuesta una tarde entera. ¿No es más moderno lo de Prisma?',
             ca: 'Una pantalla es canvia en segons. El meu aparador em costa una tarda sencera. No és més modern el que proposa Prisma?'},
         o: [{t: {es: 'Un buen escaparate no se cambia a diario: se planifica por campañas con el calendario comercial y rota cada dos o tres semanas.', ca: 'Un bon aparador no es canvia cada dia: es planifica per campanyes amb el calendari comercial i roda cada dues o tres setmanes.'}, ok: true,
              r: {es: 'Planificar en lugar de improvisar. Eso me ahorraría muchas tardes.', ca: 'Planificar en lloc d\'improvisar. Això m\'estalviaria moltes tardes.'}},
             {t: {es: 'Pues no lo cambies nunca, así no pierdes tiempo.', ca: 'Doncs no el canviïs mai, així no perds temps.'}, ok: false,
              r: {es: 'Un escaparate que no cambia se vuelve invisible para los vecinos. No.', ca: 'Un aparador que no canvia es torna invisible per als veïns. No.'}},
             {t: {es: 'Lo moderno siempre es mejor, pero las pantallas son caras.', ca: 'El que és modern sempre és millor, però les pantalles són cares.'}, ok: false,
              r: {es: 'Prisma las paga, ese no es el problema.', ca: 'Les paga Prisma, aquest no és el problema.'}}]},
        {q: {es: 'Y si alguien solo quiere ver un anuncio, ¿qué gana mi tienda con una vitrina?', ca: 'I si algú només vol veure un anunci, què hi guanya la meva botiga amb una vitrina?'},
         o: [{t: {es: 'Nada, en realidad es lo mismo.', ca: 'Res, en realitat és el mateix.'}, ok: false,
              r: {es: 'Entonces no tengo motivos para votar contra Prisma.', ca: 'Aleshores no tinc motius per votar contra Prisma.'}},
             {t: {es: 'Más anuncios: pon también una pantalla pequeña dentro.', ca: 'Més anuncis: posa també una pantalla petita a dins.'}, ok: false,
              r: {es: 'Eso no responde a la pregunta.', ca: 'Això no respon la pregunta.'}},
             {t: {es: 'El escaparate muestra el producto real, a escala y con su material; invita a entrar a tocarlo. Es la primera venta de la tienda.', ca: 'L\'aparador mostra el producte real, a escala i amb el seu material; convida a entrar a tocar-lo. És la primera venda de la botiga.'}, ok: true,
              r: {es: 'La primera venta… Mis lámparas encendidas no las explica ningún vídeo.', ca: 'La primera venda… Els meus llums encesos no els explica cap vídeo.'}}]}
      ]
    },
    4: { // Núria · Estilista
      gana: {es: 'Núria sonríe. «Una calle con personalidad y atrezo que se reutiliza. Te ayudo a montar el de la cerería. Voto que no a Prisma.»',
             ca: 'La Núria somriu. «Un carrer amb personalitat i atrezzo que es reutilitza. T\'ajudo a muntar el de la cereria. Voto que no a Prisma.»'},
      arbol: [
        {q: {es: 'Yo quiero mis vitrinas, pero montar cada temporada me cuesta un dineral en atrezo. Prisma no me pide nada.',
             ca: 'Jo vull les meves vitrines, però muntar-les cada temporada em costa un dineral en atrezzo. Prisma no em demana res.'},
         o: [{t: {es: 'Contrata a Prisma solo para el montaje.', ca: 'Contracta Prisma només per al muntatge.'}, ok: false,
              r: {es: 'Prisma no monta escaparates: los tapa.', ca: 'Prisma no munta aparadors: els tapa.'}},
             {t: {es: 'Con atrezo reutilizable y un tema por temporada el coste baja mucho: las mismas peanas y telas cuentan historias distintas.', ca: 'Amb atrezzo reutilitzable i un tema per temporada el cost baixa molt: les mateixes peanyes i teles expliquen històries diferents.'}, ok: true,
              r: {es: 'Peanas, telas, cajas… Tengo un almacén lleno. Tienes razón.', ca: 'Peanyes, teles, caixes… Tinc un magatzem ple. Tens raó.'}},
             {t: {es: 'Haz el escaparate solo con productos, sin atrezo.', ca: 'Fes l\'aparador només amb productes, sense atrezzo.'}, ok: false,
              r: {es: 'Sin atrezo una prenda no cuenta ninguna historia.', ca: 'Sense atrezzo una peça no explica cap història.'}}]},
        {q: {es: '¿Y qué hace que una persona se pare delante de mi tienda y no de la de al lado?', ca: 'I què fa que una persona s\'aturi davant la meva botiga i no davant la del costat?'},
         o: [{t: {es: 'Un punto focal claro, a la altura de la vista, con contraste de color y una composición que guíe la mirada.', ca: 'Un punt focal clar, a l\'altura de la vista, amb contrast de color i una composició que guiï la mirada.'}, ok: true,
              r: {es: 'Contraste y recorrido de la mirada. Lo apunto.', ca: 'Contrast i recorregut de la mirada. Ho apunto.'}},
             {t: {es: 'Mucho texto con todos los precios.', ca: 'Molt de text amb tots els preus.'}, ok: false,
              r: {es: 'Nadie lee un muro de precios caminando.', ca: 'Ningú no llegeix un mur de preus mentre camina.'}},
             {t: {es: 'Que esté muy lleno, cuanto más mejor.', ca: 'Que estigui molt ple, com més millor.'}, ok: false,
              r: {es: 'Un escaparate saturado no tiene dónde mirar.', ca: 'Un aparador saturat no té on mirar.'}}]}
      ]
    },
    5: { // Nil · Barista
      gana: {es: 'Nil te sirve un cortado. «Luz cálida, la barra a la vista y el temporizador encendido hasta medianoche. La cafetería vota contigo.»',
             ca: 'En Nil et serveix un tallat. «Llum càlida, la barra a la vista i el temporitzador encès fins a mitjanit. La cafeteria vota amb tu.»'},
      arbol: [
        {q: {es: 'Prisma dice que un vídeo de café humeante vende más que mi escaparate. ¿Qué le contesto?', ca: 'Prisma diu que un vídeo de cafè fumejant ven més que el meu aparador. Què li contesto?'},
         o: [{t: {es: 'Que pongas tú también un vídeo, pero mejor.', ca: 'Que hi posis tu també un vídeo, però millor.'}, ok: false,
              r: {es: 'Entonces mi cafetería sería una pantalla más de la calle.', ca: 'Aleshores la meva cafeteria seria una pantalla més del carrer.'}},
             {t: {es: 'Tu escaparate puede mostrar el ritual: la barra, las tazas, el grano y la luz cálida. Es real y se ve desde la acera.', ca: 'El teu aparador pot mostrar el ritual: la barra, les tasses, el gra i la llum càlida. És real i es veu des de la vorera.'}, ok: true,
              r: {es: 'El ritual… La gente se para cuando ve la cafetera de verdad.', ca: 'El ritual… La gent s\'atura quan veu la cafetera de debò.'}},
             {t: {es: 'Que los vídeos son aburridos.', ca: 'Que els vídeos són avorrits.'}, ok: false,
              r: {es: 'No a todo el mundo le aburren. Necesito un argumento mejor.', ca: 'No a tothom li avorreixen. Necessito un argument millor.'}}]},
        {q: {es: 'Pero por la noche, con la persiana bajada, la pantalla sigue brillando y mi escaparate no.', ca: 'Però de nit, amb la persiana abaixada, la pantalla continua brillant i el meu aparador no.'},
         o: [{t: {es: 'Apaga todo por la noche para ahorrar.', ca: 'Apaga-ho tot a la nit per estalviar.'}, ok: false,
              r: {es: 'Justo eso es lo que quiere Prisma: que mi vitrina desaparezca.', ca: 'Això és just el que vol Prisma: que la meva vitrina desaparegui.'}},
             {t: {es: 'Pon una persiana metálica pintada.', ca: 'Posa-hi una persiana metàl·lica pintada.'}, ok: false,
              r: {es: 'Bonito, pero no enseña lo que vendo.', ca: 'Bonic, però no ensenya el que venc.'}},
             {t: {es: 'Iluminación cálida con temporizador: la vitrina sigue trabajando cuando el local cierra y la calle se ve más segura.', ca: 'Il·luminació càlida amb temporitzador: la vitrina continua treballant quan el local tanca i el carrer sembla més segur.'}, ok: true,
              r: {es: 'Que mi vitrina trabaje de noche. Me gusta.', ca: 'Que la meva vitrina treballi de nit. M\'agrada.'}}]}
      ]
    }
  },
  ada: [
    {q: {es: 'Nuestras pantallas registran 12.000 impactos al día en esta calle. ¿Vuestros escaparates pueden decir lo mismo?', ca: 'Les nostres pantalles registren 12.000 impactes al dia en aquest carrer. Els vostres aparadors poden dir el mateix?'},
     o: [{t: {es: 'Un impacto solo significa que una pantalla estaba encendida delante de alguien. En nuestro ensayo contamos personas que se detuvieron.', ca: 'Un impacte només vol dir que una pantalla estava encesa davant d\'algú. En el nostre assaig comptem persones que es van aturar.'}, ok: true,
          r: {es: 'Paradas frente a impactos… Es una métrica más exigente, lo reconozco.', ca: 'Aturades davant d\'impactes… És una mètrica més exigent, ho reconec.'}},
         {t: {es: 'Eso es mentira.', ca: 'Això és mentida.'}, ok: false,
          r: {es: 'Los datos son reales. La cuestión es qué miden. Piénsalo mejor.', ca: 'Les dades són reals. La qüestió és què mesuren. Pensa-ho millor.'}},
         {t: {es: 'Nosotros tenemos 20.000.', ca: 'Nosaltres en tenim 20.000.'}, ok: false,
          r: {es: '¿Contados cómo? Si no explicas el método, el número no vale nada.', ca: 'Comptats com? Si no expliques el mètode, el número no val res.'}}]},
    {q: {es: 'Una pantalla no necesita escaparatista, ni montaje, ni atrezo. ¿Por qué complicarse?', ca: 'Una pantalla no necessita aparadorista, ni muntatge, ni atrezzo. Per què complicar-se?'},
     o: [{t: {es: 'Porque las pantallas se rompen.', ca: 'Perquè les pantalles s\'espatllen.'}, ok: false,
          r: {es: 'Las reparamos en 24 horas. Eso no es un argumento.', ca: 'Les reparem en 24 hores. Això no és un argument.'}},
         {t: {es: 'Porque cada vitrina es distinta: comunica la identidad de cada comercio y hace que la calle tenga personalidad. Treinta pantallas iguales la borran.', ca: 'Perquè cada vitrina és diferent: comunica la identitat de cada comerç i fa que el carrer tingui personalitat. Trenta pantalles iguals l\'esborren.'}, ok: true,
          r: {es: 'Una calle con identidad propia… Lo defenderé ante mi jefe, aunque no le va a gustar.', ca: 'Un carrer amb identitat pròpia… Ho defensaré davant el meu cap, encara que no li agradarà.'}},
         {t: {es: 'Porque somos más baratos.', ca: 'Perquè som més barats.'}, ok: false,
          r: {es: 'Nosotros pagamos a los comercios. No sois más baratos.', ca: 'Nosaltres paguem els comerços. No sou més barats.'}}]},
    {q: {es: 'Última pregunta: si mañana nuestras pantallas tuvieran más paradas, ¿cambiarías de opinión?', ca: 'Última pregunta: si demà les nostres pantalles tinguessin més aturades, canviaries d\'opinió?'},
     o: [{t: {es: 'No, nunca.', ca: 'No, mai.'}, ok: false,
          r: {es: 'Entonces no es una prueba, es una opinión. En la asamblea te lo dirán.', ca: 'Aleshores no és una prova, és una opinió. A l\'assemblea t\'ho diran.'}},
         {t: {es: 'Sí: repetiremos la medición cada mes con el mismo método, y decidiremos con los datos.', ca: 'Sí: repetirem la mesura cada mes amb el mateix mètode, i decidirem amb les dades.'}, ok: true,
          r: {es: 'Medir cada mes y aceptar el resultado. Eso es honesto. Nos vemos en la asamblea.', ca: 'Mesurar cada mes i acceptar el resultat. Això és honest. Ens veiem a l\'assemblea.'}},
         {t: {es: 'Depende de lo que diga Joan.', ca: 'Depèn del que digui en Joan.'}, ok: false,
          r: {es: 'Joan no puede decidir por toda la calle.', ca: 'En Joan no pot decidir per tot el carrer.'}}]}
  ],
  joan: {es: 'Los ensayos me han convencido a mí, pero en la asamblea vota toda la calle. Prisma ha pasado por todas las tiendas con su carta. Habla con los vecinos, responde a sus dudas, escucha a Ada y trae un informe con números antes de convocarnos.',
         ca: 'Els assajos m\'han convençut a mi, però a l\'assemblea hi vota tot el carrer. Prisma ha passat per totes les botigues amb la seva carta. Parla amb els veïns, respon els seus dubtes, escolta l\'Ada i porta un informe amb números abans de convocar-nos.'}
};
