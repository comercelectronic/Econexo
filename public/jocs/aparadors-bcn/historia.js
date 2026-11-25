/* La última vitrina · Acto 3 «Reunir apoyos».
   Diálogos con opciones: cada nodo tiene la pregunta del vecino (q) y opciones {t: texto, ok: correcta, r: respuesta}.
   Las respuestas correctas aplican criterios de escaparatismo (Dinamización del punto de venta). */
window.HistoriaVitrina = {
  apoyos: {
    2: { // Laia · Fotógrafa
      gana: 'Laia guarda la carta de Prisma en un cajón. «Mañana cambio la vitrina: una sola foto grande, la cámara delante y luz rasante. Cuenta con mi voto.»',
      arbol: [
        {q: 'Prisma me ofrece 300 € al mes por tapar mi escaparate con una pantalla. Mi estudio va justo de dinero. ¿Por qué no aceptarlo?',
         o: [{t: 'Porque las pantallas no atraen a nadie.', ok: false, r: 'Eso no es verdad: una pantalla brillante se mira. Dame un motivo que sea mío, no contra Prisma.'},
             {t: 'Porque tu escaparate es tu portfolio: enseña tu trabajo real, con textura y escala, y nadie más lo puede mostrar.', ok: true, r: 'Mi portfolio… Es cierto: la gente entra cuando ve una copia en papel, no un vídeo.'},
             {t: 'Pide más dinero a Prisma y luego decides.', ok: false, r: 'Entonces el escaparate dejaría de ser mío igual. No me ayudas a decidir.'}]},
        {q: 'Vale, pero ¿cómo lo monto para que alguien se pare?',
         o: [{t: 'Pon todas tus fotos para que se vea que tienes mucho trabajo.', ok: false, r: 'Así fue el año pasado y nadie se detenía: demasiadas cosas compitiendo.'},
             {t: 'Una foto grande como punto focal a la altura de los ojos, la cámara delante y luz lateral que marque la textura.', ok: true, r: 'Un punto focal y luz rasante. Eso sí lo sé hacer.'},
             {t: 'Pon un cartel grande de «OFERTAS».', ok: false, r: 'No vendo ofertas, vendo una mirada. Eso desentona con mi tienda.'}]}
      ]
    },
    3: { // Jan · Diseñador de producto
      gana: 'Jan dibuja un calendario en una servilleta. «Campañas de tres semanas, y repito el ensayo cada mes. Tienes mi apoyo, Lía.»',
      arbol: [
        {q: 'Una pantalla se cambia en segundos. Mi escaparate me cuesta una tarde entera. ¿No es más moderno lo de Prisma?',
         o: [{t: 'Un buen escaparate no se cambia a diario: se planifica por campañas con el calendario comercial y rota cada dos o tres semanas.', ok: true, r: 'Planificar en lugar de improvisar. Eso me ahorraría muchas tardes.'},
             {t: 'Pues no lo cambies nunca, así no pierdes tiempo.', ok: false, r: 'Un escaparate que no cambia se vuelve invisible para los vecinos. No.'},
             {t: 'Lo moderno siempre es mejor, pero las pantallas son caras.', ok: false, r: 'Prisma las paga, ese no es el problema.'}]},
        {q: 'Y si alguien solo quiere ver un anuncio, ¿qué gana mi tienda con una vitrina?',
         o: [{t: 'Nada, en realidad es lo mismo.', ok: false, r: 'Entonces no tengo motivos para votar contra Prisma.'},
             {t: 'Más anuncios: pon también una pantalla pequeña dentro.', ok: false, r: 'Eso no responde a la pregunta.'},
             {t: 'El escaparate muestra el producto real, a escala y con su material; invita a entrar a tocarlo. Es la primera venta de la tienda.', ok: true, r: 'La primera venta… Mis lámparas encendidas no las explica ningún vídeo.'}]}
      ]
    },
    4: { // Núria · Estilista
      gana: 'Núria sonríe. «Una calle con personalidad y atrezo que se reutiliza. Te ayudo a montar el de la cerería. Voto que no a Prisma.»',
      arbol: [
        {q: 'Yo quiero mis vitrinas, pero montar cada temporada me cuesta un dineral en atrezo. Prisma no me pide nada.',
         o: [{t: 'Contrata a Prisma solo para el montaje.', ok: false, r: 'Prisma no monta escaparates: los tapa.'},
             {t: 'Con atrezo reutilizable y un tema por temporada el coste baja mucho: las mismas peanas y telas cuentan historias distintas.', ok: true, r: 'Peanas, telas, cajas… Tengo un almacén lleno. Tienes razón.'},
             {t: 'Haz el escaparate solo con productos, sin atrezo.', ok: false, r: 'Sin atrezo una prenda no cuenta ninguna historia.'}]},
        {q: '¿Y qué hace que una persona se pare delante de mi tienda y no de la de al lado?',
         o: [{t: 'Un punto focal claro, a la altura de la vista, con contraste de color y una composición que guíe la mirada.', ok: true, r: 'Contraste y recorrido de la mirada. Lo apunto.'},
             {t: 'Mucho texto con todos los precios.', ok: false, r: 'Nadie lee un muro de precios caminando.'},
             {t: 'Que esté muy lleno, cuanto más mejor.', ok: false, r: 'Un escaparate saturado no tiene dónde mirar.'}]}
      ]
    },
    5: { // Nil · Barista
      gana: 'Nil te sirve un cortado. «Luz cálida, la barra a la vista y el temporizador encendido hasta medianoche. La cafetería vota contigo.»',
      arbol: [
        {q: 'Prisma dice que un vídeo de café humeante vende más que mi escaparate. ¿Qué le contesto?',
         o: [{t: 'Que pongas tú también un vídeo, pero mejor.', ok: false, r: 'Entonces mi cafetería sería una pantalla más de la calle.'},
             {t: 'Tu escaparate puede mostrar el ritual: la barra, las tazas, el grano y la luz cálida. Es real y se ve desde la acera.', ok: true, r: 'El ritual… La gente se para cuando ve la cafetera de verdad.'},
             {t: 'Que los vídeos son aburridos.', ok: false, r: 'No a todo el mundo le aburren. Necesito un argumento mejor.'}]},
        {q: 'Pero por la noche, con la persiana bajada, la pantalla sigue brillando y mi escaparate no.',
         o: [{t: 'Apaga todo por la noche para ahorrar.', ok: false, r: 'Justo eso es lo que quiere Prisma: que mi vitrina desaparezca.'},
             {t: 'Pon una persiana metálica pintada.', ok: false, r: 'Bonito, pero no enseña lo que vendo.'},
             {t: 'Iluminación cálida con temporizador: la vitrina sigue trabajando cuando el local cierra y la calle se ve más segura.', ok: true, r: 'Que mi vitrina trabaje de noche. Me gusta.'}]}
      ]
    }
  },
  ada: [
    {q: 'Nuestras pantallas registran 12.000 impactos al día en esta calle. ¿Vuestros escaparates pueden decir lo mismo?',
     o: [{t: 'Un impacto solo significa que una pantalla estaba encendida delante de alguien. En nuestro ensayo contamos personas que se detuvieron.', ok: true, r: 'Paradas frente a impactos… Es una métrica más exigente, lo reconozco.'},
         {t: 'Eso es mentira.', ok: false, r: 'Los datos son reales. La cuestión es qué miden. Piénsalo mejor.'},
         {t: 'Nosotros tenemos 20.000.', ok: false, r: '¿Contados cómo? Si no explicas el método, el número no vale nada.'}]},
    {q: 'Una pantalla no necesita escaparatista, ni montaje, ni atrezo. ¿Por qué complicarse?',
     o: [{t: 'Porque las pantallas se rompen.', ok: false, r: 'Las reparamos en 24 horas. Eso no es un argumento.'},
         {t: 'Porque cada vitrina es distinta: comunica la identidad de cada comercio y hace que la calle tenga personalidad. Treinta pantallas iguales la borran.', ok: true, r: 'Una calle con identidad propia… Lo defenderé ante mi jefe, aunque no le va a gustar.'},
         {t: 'Porque somos más baratos.', ok: false, r: 'Nosotros pagamos a los comercios. No sois más baratos.'}]},
    {q: 'Última pregunta: si mañana nuestras pantallas tuvieran más paradas, ¿cambiarías de opinión?',
     o: [{t: 'No, nunca.', ok: false, r: 'Entonces no es una prueba, es una opinión. En la asamblea te lo dirán.'},
         {t: 'Sí: repetiremos la medición cada mes con el mismo método, y decidiremos con los datos.', ok: true, r: 'Medir cada mes y aceptar el resultado. Eso es honesto. Nos vemos en la asamblea.'},
         {t: 'Depende de lo que diga Joan.', ok: false, r: 'Joan no puede decidir por toda la calle.'}]}
  ],
  joan: 'Los ensayos me han convencido a mí, pero en la asamblea vota toda la calle. Prisma ha pasado por todas las tiendas con su carta. Habla con los vecinos, responde a sus dudas y escucha a Ada antes de convocarnos.'
};
