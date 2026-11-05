# Articles en català (mateixa ruta i nom de fitxer que els de content/). Els camps que no hi són es copien del castellà.
A = {}
FICHA = {"Empresa": "Empresa", "Año": "Any", "Sector": "Sector", "Concepto": "Concepte"}

A["casos/airbnb-recorte-publicidad-2020"] = dict(
 titulo="Airbnb va retallar la publicitat i el trànsit gairebé no ho va notar",
 subtitulo="Durant la pandèmia, Airbnb va reduir dràsticament la inversió en publicitat de resultats. El trànsit va tornar gairebé al nivell anterior. Què ens diu sobre la incrementalitat.",
 etiquetas=["atribució", "incrementalitat", "publicitat digital", "airbnb"],
 ficha={"Empresa": "Airbnb", "Any": "2020", "Sector": "Turisme", "Concepte": "Incrementalitat"},
 fuentes=["Airbnb: presentacions de resultats trimestrals del 2020 i el 2021"],
 body="""## Què va passar

El 2020, amb el turisme paralitzat, Airbnb va retallar amb força la despesa en màrqueting, especialment en publicitat de resultats (anuncis de cerca i similars). Segons va explicar l'empresa a les presentacions de resultats, el trànsit al web es va recuperar gairebé als nivells anteriors sense tornar a aquell nivell d'inversió, i va decidir centrar el pressupost en marca i comunicació.

## Què revela

La lectura més habitual és que moltes de les visites i reserves que s'atribuïen als anuncis s'haurien produït igualment: la gent ja coneixia Airbnb i la cercava pel nom.

## Què n'aprenem

- **Atribució no és causalitat.** Que un anunci sigui en el camí d'una venda no vol dir que l'hagi causada.
- La manera de saber-ho és la **incrementalitat**: comparar què passa amb anuncis i sense, amb experiments controlats.
- Les marques conegudes solen tenir una part de la publicitat poc incremental.

## Per pensar

Com dissenyaries un experiment senzill per saber si els anuncis amb el nom de la teva marca et porten vendes noves?
""")

A["casos/burger-king-whopper-detour"] = dict(
 titulo="Whopper Detour: Burger King va fer servir McDonald's perquè et baixessis la seva app",
 subtitulo="El 2018, l'app de Burger King venia un Whopper per un cèntim, però només si feies la comanda a prop d'un McDonald's. Una lliçó de geolocalització i d'objectius clars.",
 etiquetas=["geolocalització", "apps", "publicitat digital", "burger king"],
 ficha={"Empresa": "Burger King", "Any": "2018", "Sector": "Restauració", "Concepte": "Geofencing"},
 fuentes=["Burger King i l'agència FCB New York: campanya «Whopper Detour», desembre del 2018"],
 body="""## Què va passar

El desembre del 2018, Burger King va llançar als Estats Units una promoció a la seva app: un Whopper per un cèntim. La condició era fer la comanda a menys d'uns 180 metres d'un McDonald's. Després, l'app portava l'usuari al Burger King més proper per recollir-lo. La campanya va tenir una enorme repercussió mediàtica i va disparar les descàrregues de l'aplicació.

## Per què va funcionar

- **Objectiu clar**: no era vendre hamburgueses, sinó aconseguir descàrregues de l'app.
- **Geolocalització (geofencing)**: una zona virtual al voltant de cada McDonald's activava l'oferta.
- **Provocació al líder**: convertir el competidor en part del joc va generar conversa.

## Què n'aprenem

Una campanya creativa funciona millor amb un objectiu concret i mesurable. La tecnologia (aquí, la ubicació del mòbil) és un mitjà, no la finalitat.

## Per pensar

Com podria un comerç local fer servir la geolocalització de manera respectuosa i amb permís de l'usuari?
""")

A["casos/dropbox-programa-referidos"] = dict(
 titulo="Dropbox i el programa de referits que va multiplicar els usuaris",
 subtitulo="Regalar espai a qui convidava un amic, i també a l'amic, va portar Dropbox de 100.000 a 4 milions d'usuaris en uns 15 mesos.",
 etiquetas=["màrqueting viral", "referits", "creixement", "dropbox"],
 ficha={"Empresa": "Dropbox", "Any": "2008–2010", "Sector": "Programari", "Concepte": "Programa de referits"},
 fuentes=["Drew Houston, presentació sobre el creixement de Dropbox (Startup Lessons Learned, 2010)"],
 body="""## Què va passar

Dropbox va provar la publicitat tradicional als seus inicis i li resultava cara per a un producte gratuït. Va canviar d'estratègia: cada usuari que convidava un amic rebia espai d'emmagatzematge extra, i l'amic també. Segons va explicar el seu fundador, el nombre d'usuaris va passar d'uns 100.000 a 4 milions en aproximadament 15 mesos.

## Per què va funcionar

- **Incentiu per a les dues parts**: convidar no semblava demanar un favor, sinó fer un regal.
- **El premi era el mateix producte**: més espai feia fer servir més Dropbox.
- **Fàcil de compartir**: el procés estava integrat a l'aplicació.

Quan cada usuari porta, de mitjana, més d'un usuari nou (coeficient viral superior a 1), el creixement s'alimenta sol.

## Què n'aprenem

Un bon programa de referits no es limita a «comparteix i guanya»: ofereix alguna cosa valuosa a qui convida i a qui arriba, i ho fa fàcil.

## Per pensar

Què podria regalar un gimnàs, una acadèmia o una botiga de barri perquè els seus clients portessin amics sense sentir-se venedors?
""")

A["casos/ice-bucket-challenge"] = dict(
 titulo="Ice Bucket Challenge: anatomia d'una campanya viral solidària",
 subtitulo="A l'estiu del 2014, milions de persones es van tirar un cubell d'aigua gelada per l'ELA. L'associació nord-americana va recaptar més de 100 milions de dòlars.",
 etiquetas=["màrqueting viral", "causes socials", "xarxes socials"],
 ficha={"Empresa": "ALS Association", "Any": "2014", "Sector": "Organització sense ànim de lucre", "Concepte": "Màrqueting viral"},
 fuentes=["ALS Association: balanç de l'Ice Bucket Challenge"],
 body="""## Què va passar

El repte era senzill: gravar-se mentre et tiren un cubell d'aigua gelada, donar a la investigació de l'ELA (esclerosi lateral amiotròfica) i nominar tres persones. En poques setmanes hi van participar milions de persones, inclosos molts famosos. L'ALS Association dels Estats Units va recaptar més de 100 milions de dòlars en unes setmanes.

## Per què va funcionar

- **Fàcil de fer** i divertit de veure.
- **Emoció i causa**: humor i solidaritat alhora.
- **Mecanisme de difusió incorporat**: cada participant nominava d'altres.
- **Pressió social positiva**: ser nominat era gairebé una invitació pública.

## Què n'aprenem

Allò viral no es fabrica per encàrrec, però hi ha elements que ho afavoreixen: emoció, facilitat i un motiu per passar-ho a altres. També té riscos: un repte mal plantejat pot ser perillós o girar-se en contra de la marca.

## Per pensar

Quin repte podria proposar una marca local sense posar ningú en risc?
""")

A["casos/kfc-fck-crisis-pollo"] = dict(
 titulo="KFC sense pollastre: com tres lletres van convertir una crisi en un exemple",
 subtitulo="El 2018, centenars de restaurants de KFC al Regne Unit es van quedar sense pollastre. La disculpa pública de la marca s'estudia avui a les escoles de negocis.",
 etiquetas=["comunicació de crisi", "reputació", "kfc"],
 ficha={"Empresa": "KFC Regne Unit", "Any": "2018", "Sector": "Restauració", "Concepte": "Comunicació de crisi"},
 fuentes=["KFC UK, anunci de disculpa publicat als diaris Metro i The Sun, febrer del 2018"],
 body="""## Què va passar

El febrer del 2018, KFC va canviar de proveïdor logístic al Regne Unit. Els problemes de distribució van deixar sense pollastre centenars de restaurants durant dies. Per a una cadena de pollastre fregit, era la pitjor crisi possible.

KFC va publicar a la premsa un anunci amb un cubell buit en què les lletres de la marca s'havien reordenat com a «FCK», acompanyat d'una disculpa directa: reconeixia el problema, demanava perdó a clients i treballadors i explicava que l'estaven resolent.

## Per què va funcionar

- **Va assumir l'error** sense buscar culpables en públic.
- Va fer servir un **to propi**, amb humor, sense treure importància al problema.
- **Va explicar què estava fent** per solucionar-ho.

## Què n'aprenem

Una bona resposta de crisi comença per entendre què ha passat, reconèixer-ho i explicar el pla. L'humor només funciona si la disculpa és sincera i el problema es resol.

## Per pensar

En quin tipus de crisi no seria adequat fer servir humor? Pensa en un exemple.
""")

A["casos/kodak-camara-digital"] = dict(
 titulo="Kodak va inventar la càmera digital, però no va saber canviar el seu negoci a temps",
 subtitulo="Un enginyer de Kodak va construir la primera càmera digital el 1975. Trenta-set anys després, l'empresa s'acollia a la protecció per fallida. Una lliçó clàssica sobre la miopia de màrqueting.",
 etiquetas=["estratègia", "innovació", "disrupció", "kodak"],
 ficha={"Empresa": "Kodak", "Any": "1975–2012", "Sector": "Fotografia", "Concepte": "Miopia de màrqueting"},
 fuentes=["Steven Sasson, entrevistes sobre el prototip de càmera digital del 1975", "Eastman Kodak: sol·licitud de protecció per fallida (Capítol 11), gener del 2012"],
 body="""## Què va passar

El 1975, Steven Sasson, enginyer de Kodak, va construir un prototip de càmera digital. Kodak dominava aleshores el mercat dels carrets i el revelatge, un negoci amb marges molt alts. L'empresa va continuar invertint en la fotografia digital, però la seva prioritat va seguir sent el negoci químic. Va arribar a vendre moltes càmeres digitals, però aquell negoci no va substituir mai els ingressos dels carrets i el revelatge, i els mòbils van acabar de transformar el mercat. El gener del 2012 es va acollir a la protecció per fallida als Estats Units.

## Què se sol assenyalar

L'anàlisi més estesa és que Kodak es definia pel producte que venia (carrets) i no per la necessitat que cobria: **guardar i compartir records**. És el que el professor Theodore Levitt va anomenar *miopia de màrqueting*. Quan la manera de fer fotos va canviar, li va costar adaptar un model de negoci construït al voltant del producte químic.

## Què n'aprenem

- Els clients no compren productes: compren solucions a una necessitat.
- Un negoci molt rendible pot frenar la innovació que el substituirà.
- Inventar no n'hi ha prou: cal portar la innovació al mercat abans que els altres.

## Per pensar

Quin «carret» té avui el teu sector? Quin producte rendible podria quedar obsolet d'aquí a cinc anys?
""")

A["casos/new-coke-1985"] = dict(
 titulo="New Coke: quan 200.000 tastos no van ser prou",
 subtitulo="El 1985, Coca-Cola va canviar la fórmula després d'una investigació enorme. Als 79 dies va haver de fer marxa enrere. Allò que la investigació de mercat no va mesurar.",
 etiquetas=["investigació de mercats", "marca", "coca-cola"],
 ficha={"Empresa": "Coca-Cola", "Any": "1985", "Sector": "Begudes", "Concepte": "Investigació de mercats"},
 fuentes=["The Coca-Cola Company: història de la «New Coke» (arxiu corporatiu)"],
 body="""## Què va passar

A principis dels vuitanta, Pepsi guanyava terreny amb tastos a cegues en què el públic preferia el seu sabor, més dolç. Coca-Cola va desenvolupar una nova fórmula i va fer unes 200.000 proves de sabor: la nova versió guanyava. L'abril del 1985 va llançar la «New Coke» i va retirar l'original. La reacció va ser enorme: trucades, cartes i protestes. Als 79 dies, l'empresa va recuperar la fórmula clàssica com a «Coca-Cola Classic».

## Per què va fallar

La investigació va respondre bé una pregunta, **quin sabor agrada més en un glop?**, però no la important: **què significa Coca-Cola per a la gent?** Per a molts consumidors, la marca era part de la seva identitat i la seva memòria. Canviar-la es va viure com una pèrdua.

## Què n'aprenem

- Una investigació pot ser enorme i, tot i això, fer la pregunta equivocada.
- Les marques tenen un valor emocional que no apareix en un tast.
- Abans d'un canvi gran, convé investigar també què perdria el client.

## Per pensar

Si haguessis d'investigar un canvi d'envàs d'un producte molt conegut, què preguntaries a part de «t'agrada més?»?
""")

A["casos/patagonia-dont-buy-this-jacket"] = dict(
 titulo="«No compris aquesta jaqueta»: l'anunci de Patagonia que va reforçar la seva marca",
 subtitulo="Al Black Friday del 2011, Patagonia va demanar als seus clients que no compressin el que no necessitaven. Per què un missatge anticonsum va enfortir la marca.",
 etiquetas=["branding", "valors de marca", "sostenibilitat", "patagonia"],
 ficha={"Empresa": "Patagonia", "Any": "2011", "Sector": "Roba outdoor", "Concepte": "Marca amb valors"},
 fuentes=["Patagonia, anunci «Don't Buy This Jacket», The New York Times, 25 de novembre del 2011"],
 body="""## Què va passar

El dia del Black Friday del 2011, Patagonia va publicar a The New York Times un anunci a pàgina completa amb una de les seves jaquetes i el titular «Don't Buy This Jacket» («No compris aquesta jaqueta»). El text explicava l'impacte ambiental de fabricar-la i demanava comprar només el necessari, reparar la roba i donar-li una segona vida.

## Per què va funcionar

El missatge era coherent amb el que l'empresa ja feia: reparacions, compromisos ambientals i una comunicació centrada en l'ús responsable. No era una provocació aïllada, sinó una **expressió dels seus valors**. Va atreure clients que els compartien i va allunyar els que només buscaven preu.

## Què n'aprenem

- Una marca clara atreu els clients adequats i allunya els altres, i això també és positiu.
- Els valors només són creïbles si es veuen en les decisions del dia a dia.
- Anar contra corrent (el dia de més consum de l'any) multiplica l'atenció.

## Per pensar

Podria una petita empresa de la teva zona fer una campanya que digui «no compris» sense que sembli una contradicció? Què necessitaria per ser creïble?
""")

A["casos/united-breaks-guitars"] = dict(
 titulo="United Breaks Guitars: la queixa que es va fer cançó (i viral)",
 subtitulo="Un músic va passar mesos reclamant a una aerolínia per una guitarra trencada. Sense resposta, va publicar una cançó a YouTube que van veure milions de persones.",
 etiquetas=["atenció al client", "reclamacions", "xarxes socials", "united airlines"],
 ficha={"Empresa": "United Airlines", "Any": "2009", "Sector": "Aviació", "Concepte": "Gestió de reclamacions"},
 fuentes=["Dave Carroll, vídeo «United Breaks Guitars», YouTube, juliol del 2009"],
 body="""## Què va passar

El 2008, el músic canadenc Dave Carroll va veure des de l'avió com es manipulava sense cura l'equipatge a la pista, segons el seu relat. La seva guitarra va arribar trencada. Durant mesos va reclamar a United Airlines que li compensés la reparació, sense èxit. El juliol del 2009 va publicar a YouTube la cançó «United Breaks Guitars», que es va convertir en un dels primers grans fenòmens virals d'atenció al client.

## Per què va ser un problema tan gran

La reparació costava poc. La reclamació mal gestionada es va convertir en un problema de reputació vist per milions de persones i comentat als mitjans de tot el món.

## Què n'aprenem

- Una reclamació resolta aviat i amb empatia és barata; ignorada, pot sortir carissima.
- A internet, qualsevol client té un altaveu.
- Les polítiques rígides («no podem fer res») generen més mal que el problema original.

## Per pensar

Què hauries fet tu com a responsable d'atenció al client quan va arribar la primera reclamació?
""")

A["finanzas/como-funciona-el-interes-compuesto"] = dict(
 titulo="Com funciona l'interès compost (i per què el temps importa més que la quantitat)",
 subtitulo="L'interès compost fa que els rendiments generin nous rendiments. T'expliquem la fórmula, un exemple pas a pas i els seus límits.",
 descripcion="Què és l'interès compost, com es calcula, exemple amb aportacions mensuals, efecte de la inflació i errors habituals. Amb simulador gratuït.",
 etiquetas=["interès compost", "estalvi", "inversió", "inflació"],
 fecha_datos="octubre del 2026 (exemples il·lustratius, sense dades de mercat)",
 fuentes=["Banc d'Espanya, Portal del Client Bancari: conceptes d'interès", "CNMV: guies d'educació financera"],
 faq=[{"p": "L'interès compost garanteix que els meus diners creixin?", "r": "No. És un mecanisme matemàtic: si la rendibilitat és negativa, l'efecte compost també amplifica les pèrdues."}, {"p": "Quina diferència hi ha entre interès simple i compost?", "r": "En el simple, els interessos es calculen sempre sobre el capital inicial. En el compost, se sumen al capital i generen nous interessos."}],
 dialogo=["Vull ser ric en tres dies. Quin és el truc?", "El truc té nom: interès compost. I l'ingredient principal no és la rendibilitat… és el temps.", "Tres dies no és temps?", "Pensa més aviat en vint anys."],
 body="""L'**interès compost** és l'efecte que es produeix quan els rendiments d'un estalvi o d'una inversió se sumen al capital i, al seu torn, generen nous rendiments. És «interès sobre interès».

## Interès simple davant d'interès compost

Amb 1.000 € al 5 % anual durant 3 anys:

| Any | Interès simple | Interès compost |
|---|---|---|
| 1 | 1.050 € | 1.050,00 € |
| 2 | 1.100 € | 1.102,50 € |
| 3 | 1.150 € | 1.157,63 € |

La diferència sembla petita al principi, però creix amb els anys perquè cada any es calcula sobre una base més gran.

## La fórmula

> Valor final = capital × (1 + r)^n

On *r* és la rendibilitat per període i *n* el nombre de períodes. Amb aportacions periòdiques, el càlcul es fa mes a mes: cada mes el saldo creix segons la rendibilitat mensual i se suma la nova aportació.

## Exemple amb aportacions mensuals

Suposem 10.000 € inicials i 100 € al mes durant 20 anys, amb una rendibilitat **suposada** del 5 % anual:

- Total aportat: 34.000 €.
- Valor final aproximat: 68.200 € (abans de comissions i impostos).
- La meitat del resultat prové dels rendiments, no del que s'ha aportat.

## No oblidis la inflació

Si els preus pugen de mitjana un 2,5 % l'any, aquests 68.200 € d'aquí a 20 anys equivaldran a uns 41.600 € d'avui. Per això convé mirar sempre el **valor real**, no només el nominal.

## Errors habituals

- Fer servir rendibilitats altes i constants: a la realitat hi ha anys negatius.
- Oblidar comissions i impostos, que també es «componen» en contra.
- Començar tard: el temps és el factor que més pesa a la fórmula.
""")

A["finanzas/que-es-la-inflacion-y-como-afecta-al-ahorro"] = dict(
 titulo="Què és la inflació i com afecta els teus estalvis",
 subtitulo="La inflació redueix el que pots comprar amb els mateixos diners. T'expliquem com es mesura, com calcular-ne l'efecte i què significa per a l'estalvi.",
 descripcion="Què és la inflació, com es mesura amb l'IPC, com calcular la pèrdua de poder adquisitiu i què és la rendibilitat real.",
 etiquetas=["inflació", "ipc", "estalvi", "poder adquisitiu"],
 fecha_datos="octubre del 2026 (exemples il·lustratius)",
 fuentes=["INE (Espanya): Índex de Preus de Consum", "INEGI (Mèxic): Índice Nacional de Precios al Consumidor", "Banc Central Europeu: què és la inflació"],
 dialogo=["Tinc 1.000 € guardats sota el matalàs des de fa deu anys. Intactes!", "Intactes en euros, sí. Però avui compren força menys que llavors.", "M'han robat sense obrir el matalàs?", "Es diu inflació. T'ho explico."],
 body="""La **inflació** és l'augment generalitzat i sostingut dels preus. Quan hi ha inflació, amb la mateixa quantitat de diners pots comprar menys coses: perds **poder adquisitiu**.

## Com es mesura

Cada país la mesura amb un índex de preus de consum, que segueix l'evolució d'una «cistella» de productes i serveis representativa: a Espanya, l'IPC de l'INE; a Mèxic, l'INPC de l'INEGI; en altres països, l'índex equivalent del seu institut d'estadística.

## Com calcular-ne l'efecte

> Valor real = valor nominal ÷ (1 + inflació)^anys

Amb una inflació mitjana del 3 % anual, 10.000 € d'aquí a 10 anys equivalen a uns **7.440 €** d'avui.

## Rendibilitat nominal i rendibilitat real

Si un compte et dona un 2 % i la inflació és del 3 %, la teva **rendibilitat real** és aproximadament de l'−1 %: tens més euros, però compres menys.

> Rendibilitat real ≈ rendibilitat nominal − inflació

## Què significa per a l'estalvi

- Tenir tot l'estalvi sense rendibilitat suposa perdre poder adquisitiu amb el temps.
- Un fons d'emergència ha d'estar disponible, encara que rendeixi poc: la seva funció és la liquiditat.
- Per a objectius a llarg termini, convé comparar sempre la rendibilitat esperada amb la inflació i amb el risc que s'assumeix.

Cada país té nivells d'inflació molt diferents: els exemples d'aquesta guia són il·lustratius.
""")

A["formacion/metricas-de-marketing-explicadas"] = dict(
 titulo="CTR, CPC, CPA, ROAS, ROI, CAC i LTV: les mètriques de màrqueting explicades amb exemples",
 subtitulo="Un diccionari pràctic de les sigles que més es fan servir en màrqueting digital, amb la fórmula i un exemple de cadascuna.",
 descripcion="Definició, fórmula i exemple de CTR, CPC, CPM, CPA, taxa de conversió, ROAS, ROI, CAC i LTV.",
 etiquetas=["mètriques", "kpi", "roas", "roi", "analítica"],
 dialogo=["El meu anunci té un CTR del 8 %! Sóc un geni!", "I quin és el CPA? I el ROAS? Un bon CTR només diu que la gent fa clic.", "CPA, ROAS, LTV… Això és màrqueting o una sopa de lletres?", "Les dues coses. Anem lletra per lletra."],
 body="""Les mètriques de màrqueting s'entenen millor en ordre: des que algú veu un anunci fins que es converteix en client fidel.

## Visibilitat i clics

| Mètrica | Fórmula | Exemple |
|---|---|---|
| **CPM** (cost per mil impressions) | inversió ÷ impressions × 1.000 | 300 € per a 100.000 impressions = 3 € |
| **CTR** (percentatge de clics) | clics ÷ impressions × 100 | 2.000 clics de 100.000 = 2 % |
| **CPC** (cost per clic) | inversió ÷ clics | 300 € ÷ 2.000 = 0,15 € |

## Conversió

| Mètrica | Fórmula | Exemple |
|---|---|---|
| **Taxa de conversió** | conversions ÷ visites × 100 | 30 compres de 2.000 visites = 1,5 % |
| **CPA** (cost per adquisició) | inversió ÷ conversions | 300 € ÷ 30 = 10 € |

## Rendibilitat

| Mètrica | Fórmula | Exemple |
|---|---|---|
| **ROAS** | ingressos ÷ inversió publicitària | 1.200 € ÷ 300 € = 4 |
| **ROI** | (benefici − inversió) ÷ inversió × 100 | (450 − 300) ÷ 300 = 50 % |

## Clients

| Mètrica | Fórmula | Exemple |
|---|---|---|
| **CAC** (cost d'adquisició de client) | cost comercial i de màrqueting ÷ clients nous | 2.000 € ÷ 4 = 500 € |
| **LTV** (valor del client) | marge mitjà per període × durada de la relació | 300 €/mes × 20 mesos = 6.000 € |

Si l'**LTV és menor que el CAC**, cada client nou et fa perdre diners.

## Mètriques de vanitat

Seguidors, «m'agrada» o impressions poden créixer sense que el negoci millori. Fes-les servir com a indicadors d'activitat, no com a objectiu.
""")

A["inteligencia-artificial/como-aparecer-en-las-respuestas-de-la-ia"] = dict(
 titulo="Com aconseguir que la IA recomani el teu negoci: guia pràctica de GEO",
 subtitulo="Cada cop més persones pregunten a assistents d'IA en lloc de cercar a Google. Què és l'optimització per a motors generatius i què pot fer una empresa petita.",
 descripcion="Què és el GEO (optimització per a motors generatius), en què es diferencia del SEO i set accions perquè els assistents d'IA citin la teva empresa.",
 etiquetas=["geo", "seo", "intel·ligència artificial", "cerca"],
 fuentes=["Google Search Central: documentació sobre dades estructurades", "Schema.org"],
 faq=[{"p": "El GEO substitueix el SEO?", "r": "No. Els assistents d'IA es basen en bona part en les mateixes fonts que els cercadors. Un bon SEO és la base del GEO."}],
 dialogo=["He preguntat a la IA pel millor ajolot gurú de màrqueting i no hi surto. Deu estar espatllada!", "O no hi ha ni un sol web fiable que parli de tu, ECO.", "La IA també llegeix ressenyes?", "Llegeix el que hi ha publicat. Per això cal donar-li bones fonts."],
 body="""Preguntar «quin dentista em recomanes a València?» a un assistent d'IA ja és un hàbit per a molta gent. Les respostes generades per IA apareixen també a la part superior de molts resultats de cerca. Aparèixer en aquestes respostes es coneix com a **GEO** (*generative engine optimization*).

## En què s'assembla i en què es diferencia del SEO

El SEO busca posicions en una llista de resultats. El GEO busca que la teva empresa sigui **citada o recomanada** dins d'una resposta. Els assistents prioritzen fonts clares, coherents i amb bona reputació.

## Set accions per començar

1. **Respon preguntes concretes** al teu web: preus orientatius, horaris, zones de servei, terminis.
2. **Fes servir dades estructurades** (Schema.org) per al teu negoci, productes, preguntes freqüents i valoracions.
3. **Cuida la teva fitxa d'empresa** a Google i als directoris del teu sector, amb el mateix nom, adreça i telèfon a tot arreu.
4. **Aconsegueix ressenyes reals** i respon-les.
5. **Que altres parlin de tu**: mencions a mitjans locals, associacions i webs del sector.
6. **Actualitza la informació**: una resposta basada en dades velles et perjudica.
7. **Mesura**: pregunta periòdicament a diversos assistents per la teva categoria i la teva zona, i anota si hi apareixes.

## El que no funciona

Publicar desenes de textos genèrics generats amb IA o repetir paraules clau. Els sistemes busquen fonts fiables, no volum.
""")

A["marketing-digital/como-calcular-el-roas"] = dict(
 titulo="Com calcular el ROAS i saber si la teva publicitat és rendible",
 subtitulo="El ROAS indica quant vens per cada euro invertit en anuncis. Però només té sentit si el compares amb el teu marge: t'expliquem com calcular el ROAS d'equilibri.",
 descripcion="Què és el ROAS, com es calcula, què és el ROAS d'equilibri i per què un ROAS alt no sempre significa benefici. Amb exemples i calculadora gratuïta.",
 etiquetas=["roas", "publicitat digital", "rendibilitat", "google ads", "meta ads"],
 fuentes=["Ajuda de Google Ads: ROAS objectiu", "Ajuda de Meta per a empreses: retorn de la inversió publicitària"],
 faq=[{"p": "Quin ROAS és bo?", "r": "El que supera el teu ROAS d'equilibri (1 ÷ marge brut) amb marge suficient per cobrir la resta de costos. Amb un marge del 25 %, necessites un ROAS superior a 4 només per no perdre diners amb la publicitat."}, {"p": "El ROAS que dona Google Ads o Meta és fiable?", "r": "És una estimació: cada plataforma s'atribueix les vendes en què ha participat, encara que d'altres també hagin influït. Compara'l amb les vendes reals de la teva botiga."}],
 dialogo=["He invertit 100 € en anuncis i he facturat 500 €. Sóc ric?", "Has aconseguit un ROAS de 5: has facturat 5 € per cada euro de publicitat. Però encara cal descomptar els costos.", "Costos? Si l'anunci ja està pagat!", "I el producte, l'enviament i les comissions també es paguen, ECO. Anem a veure-ho."],
 body="""El **ROAS** (*return on ad spend*, retorn de la inversió publicitària) és una de les mètriques més utilitzades en publicitat digital. Respon una pregunta senzilla: **quant he venut per cada euro que he invertit en anuncis?**

## La fórmula del ROAS

> ROAS = ingressos atribuïts a la campanya ÷ inversió publicitària

Si inverteixes 500 € en una campanya i genera 2.000 € en vendes, el ROAS és **4** (o «400 %»): cada euro invertit ha portat quatre euros de vendes.

## L'error més comú: confondre vendes amb benefici

Un ROAS de 4 sembla excel·lent, però aquests 2.000 € són **vendes**, no benefici. Si el producte et costa fabricar-lo, enviar-lo i cobrar-lo, només una part de cada venda és teva: el **marge brut**.

| Marge brut | ROAS d'equilibri | Un ROAS de 4 és rendible? |
|---|---|---|
| 60 % | 1,67 | Sí, amb folgança |
| 30 % | 3,33 | Sí, per poc |
| 20 % | 5,00 | No: perds diners |

## Com calcular el ROAS d'equilibri

> ROAS d'equilibri = 1 ÷ marge brut (en tant per u)

És el ROAS mínim perquè la publicitat es pagui a si mateixa. Per sota, cada venda que porta l'anunci et costa més del que et deixa.

**Exemple.** Una botiga en línia d'embotits té un marge brut del 30 %. El seu ROAS d'equilibri és 1 ÷ 0,30 = 3,33. Una campanya amb ROAS 3 li fa perdre diners encara que «vengui molt».

## Tres matisos abans de decidir

1. **Atribució.** Cada plataforma compta les vendes en què ha participat. Si sumes el que diuen Google i Meta, sovint supera les vendes reals.
2. **Incrementalitat.** Part de les vendes atribuïdes s'haurien produït igualment (per exemple, anuncis amb el nom de la teva pròpia marca). Per saber-ho, cal fer proves amb grup de control.
3. **Valor del client.** Si el client torna a comprar, una primera venda amb ROAS baix pot ser rendible a mitjà termini. Compara el cost de captació (CAC) amb el valor del client (LTV).

## En resum

El ROAS és útil, però no s'interpreta sol: compara'l sempre amb el teu ROAS d'equilibri i amb les vendes reals del negoci.
""")

A["marketing-digital/que-son-los-parametros-utm"] = dict(
 titulo="Paràmetres UTM: què són i com fer-los servir per mesurar les teves campanyes",
 subtitulo="Amb cinc etiquetes als teus enllaços, Google Analytics sabrà de quina campanya, canal i anunci ve cada visita.",
 descripcion="Guia dels paràmetres UTM: què és cadascun, exemples de nomenclatura, errors freqüents i generador gratuït d'enllaços.",
 etiquetas=["utm", "google analytics", "analítica", "campanyes"],
 fuentes=["Ajuda de Google Analytics: recopilar dades de campanyes amb URL personalitzades"],
 faq=[{"p": "Per què es diuen UTM?", "r": "Per Urchin Tracking Module. Urchin era una empresa d'analítica web que Google va comprar el 2005 i que va donar origen a Google Analytics."}],
 dialogo=["Analytics diu que gairebé totes les meves visites són «directes». Tinc fans que se saben el meu web de memòria!", "O no has etiquetat els enllaços de la teva newsletter, ECO.", "Etiquetar? Com la roba?", "Gairebé. Es diuen paràmetres UTM. T'ho explico."],
 body="""Quan algú arriba al teu web des d'una newsletter, un anunci o una publicació a xarxes, Google Analytics no sempre sap d'on ve. Els **paràmetres UTM** són etiquetes que afegeixes al final d'un enllaç per identificar-lo.

## Els cinc paràmetres

| Paràmetre | Per a què serveix | Exemple |
|---|---|---|
| utm_source | La font concreta | newsletter, google, instagram |
| utm_medium | El tipus de canal | email, cpc, social |
| utm_campaign | La campanya | black-friday-2026 |
| utm_term | La paraula clau (anuncis) | sabatilles-trail |
| utm_content | La versió de l'anunci o enllaç | banner-blau |

Els tres primers són els imprescindibles.

## Un exemple complet

`https://elteuweb.com/oferta/?utm_source=newsletter&utm_medium=email&utm_campaign=novembre`

## Una nomenclatura que no es trenqui

- Tot en **minúscules**: Analytics distingeix «Email» d'«email».
- Guions en lloc d'espais.
- Una llista compartida de valors permesos per a tot l'equip.

## Errors freqüents

1. Posar UTM en enllaços interns del teu propi web: substitueixen la font real de la visita (per exemple, Google) per la de la teva etiqueta i fan malbé l'atribució.
2. Fer servir noms diferents per a la mateixa campanya a cada canal.
3. Oblidar les UTM als enllaços de la biografia de xarxes socials.
""")
