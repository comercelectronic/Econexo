---
id: L_html
titulo: "Estructura web, HTML i editors"
objetivo: "Conèixer l'estructura d'una web corporativa, l'HTML bàsic i les eines actuals per crear webs."
orden: 10
codigos: ["3.1","3.2","3.3"]
area: "Web i comerç electrònic"
capitulo: "1.7"
capitulo_titulo: "Osona Bikes vol la seva pròpia web"
estado: publicada
tira:
  - [{"quien":"eco","gesto":"alegria","texto":"El meu web té deu títols principals! Així Google veu que tot és important."}]
  - [{"quien":"nexo","gesto":"pensativo","texto":"Deu h1?"},{"quien":"eco","gesto":"confusion","texto":"h1? És una autopista?"}]
  - [{"quien":"nexo","gesto":"guino","texto":"És el títol principal. Un per pàgina, imatges amb text alternatiu i un menú clar."}]
ejemplo: "La pàgina d'inici de la botiga de bicis té un únic &lt;h1&gt; («Bicicletes i reparacions a Vic»), un &lt;nav&gt; amb cinc enllaços i imatges amb text alternatiu. El primer esborrany el van fer amb un constructor amb IA, però van reescriure els textos i van revisar l'accessibilitat."
errores: ["Fer servir diversos &lt;h1&gt; a la mateixa pàgina.","Oblidar el text alternatiu de les imatges.","Publicar tal qual la web que genera una IA, sense revisar-la."]
test:
  - {"p":"Quina etiqueta HTML conté el menú de navegació?","o":["&lt;nav&gt;","&lt;header&gt;","&lt;menu&gt;","&lt;aside&gt;"],"c":0,"por":"&lt;nav&gt; agrupa els enllaços de navegació principals; &lt;header&gt; és la capçalera, que sovint el conté."}
  - {"p":"Per a què serveix l'atribut alt d'una imatge?","o":["Per mostrar un text si la imatge triga a carregar","Per descriure-la a cercadors i lectors de pantalla","Per mostrar un text quan el ratolí passa per sobre","Per indicar l'autor i la llicència de la imatge"],"c":1,"por":"Millora l'accessibilitat i el SEO."}
  - {"p":"Quina eina faries servir per dissenyar el prototip d'una web abans de construir-la?","o":["Figma","Canva","Webflow","Visual Studio Code"],"c":0,"por":"Figma és l'eina de prototipat més habitual. Canva és per a peces gràfiques, Webflow construeix la web i Visual Studio Code és per escriure codi."}
  - {"p":"Cas real · Domino's Pizza (2019). Un home cec no podia fer comandes a la web amb el lector de pantalla i va guanyar el plet. Quin element hi tenia un paper clau?","o":["El disseny de la pàgina d'inici","L'accessibilitat: textos alternatius, etiquetes i navegació amb teclat","La velocitat de càrrega","El certificat SSL"],"c":1,"por":"Una web ben feta en HTML és usable per a tothom. A Europa, l'accessibilitat ja és obligatòria per a moltes botigues."}
  - {"p":"Cas real · WordPress. Fa funcionar més del 40 % de les webs del món. Què és?","o":["Un editor de codi","Un allotjament web","Un gestor de continguts (CMS)","Un llenguatge de programació"],"c":2,"por":"Un CMS permet crear i editar la web sense programar, amb temes i extensions."}
---
Una <b>web corporativa</b> sol tenir: inici (què fem i per a qui), qui som, serveis o productes, casos o opinions, blog, contacte, i les pàgines legals (avís legal, privacitat i galetes). El menú ha de ser simple, el contacte a un clic i la web ha de ser <b>accessible</b> (contrast, text alternatiu, navegació amb teclat).

L'<b>HTML</b> descriu l'estructura amb etiquetes: <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;footer&gt;</code>, títols de <code>&lt;h1&gt;</code> a <code>&lt;h6&gt;</code>, paràgrafs <code>&lt;p&gt;</code>, enllaços <code>&lt;a href&gt;</code> i imatges <code>&lt;img alt&gt;</code>. El CSS en defineix l'aspecte i el JavaScript, el comportament.

Les eines més habituals són els <b>CMS i constructors visuals</b> (WordPress amb l'editor de blocs, Shopify, Wix, Webflow, Framer), les <b>eines de disseny</b> per prototipar (Figma) i els <b>editors de codi</b> (Visual Studio Code, Cursor) amb assistents d'IA que generen i revisen codi. També hi ha constructors amb IA que fan un primer esborrany de web a partir d'una descripció: cal revisar-ne sempre els textos, l'accessibilitat i el SEO.
