---
id: L_zones
titulo: "Zones calentes, flux de caixa i eines de disseny"
objetivo: "Analitzar on mira i clica l'usuari, controlar la caixa de la botiga i fer servir eines gràfiques."
orden: 52
codigos: ["3.10","3.9","3.7","3.11","3.8"]
area: "Analítica"
capitulo: "7.6"
capitulo_titulo: "On mira l'usuari i on es perden els diners"
estado: publicada
tira:
  - [{"quien":"eco","gesto":"senalando","texto":"El botó de comprar és a baix de tot! Així la gent llegeix tot el web."}]
  - [{"quien":"nexo","gesto":"pensativo","texto":"El mapa de calor diu que ningú no arriba fins a baix."},{"quien":"eco","gesto":"sorpresa","texto":"Hi ha un mapa del meu web? Amb tresors?"}]
  - [{"quien":"nexo","gesto":"guino","texto":"Mostra on miren i fan clic. Posa l'important a dalt… i vigila la caixa de la botiga."}]
ejemplo: "El mapa de calor de la cansaladeria mostra que ningú veu el botó de l'enviament refrigerat perquè és a baix de tot: el pugen a la part superior i les comandes augmenten un 15 %."
errores: ["Posar la informació clau on ningú hi arriba fent scroll.","Obligar a crear un compte per comprar.","Confondre vendes amb diners disponibles al banc."]
test:
  - {"p":"Què mostra un mapa de calor?","o":["On miren, cliquen i fan scroll els usuaris","Quines pàgines tenen més visites","D'on vénen geogràficament les visites","Les hores del dia amb més trànsit"],"c":0,"por":"Revela les zones calentes i les que ningú veu."}
  - {"p":"Per què una botiga amb moltes vendes pot tenir problemes de caixa?","o":["Perquè paga estoc i publicitat abans de cobrar","Perquè el marge per comanda és massa baix","Perquè té massa devolucions","Perquè paga massa impostos"],"c":0,"por":"El marge baix o les devolucions també hi influeixen, però una botiga rendible es pot quedar sense caixa si els pagaments van abans que els cobraments."}
  - {"p":"Quin programa és vectorial, adequat per dissenyar un logo?","o":["Illustrator","Photoshop","GIMP","Canva"],"c":0,"por":"Els logos es fan en vectorial (Illustrator, Inkscape) perquè escalin sense perdre qualitat. Photoshop i GIMP treballen amb píxels."}
  - {"p":"Cas real · Amazon. Sovint cobra dels clients abans de pagar els proveïdors, i això li dona caixa per créixer. Com s'anomena aquest avantatge?","o":["Marge brut alt","Cicle de caixa favorable (cobrar abans de pagar)","Benefici extraordinari","Concentració de clients"],"c":1,"por":"Una botiga petita sovint fa el contrari: paga estoc i anuncis abans de cobrar. Per això cal un pla de flux de caixa."}
  - {"p":"Cas real · Nielsen Norman Group (2006). Amb estudis de seguiment ocular, van descobrir que molts usuaris llegeixen les webs seguint un patró en forma de F. Què implica per al disseny?","o":["Que cal posar la informació clau a baix de tot","Que la informació clau ha d'anar a dalt i a l'inici de les línies","Que cal escriure textos molt llargs","Que les imatges no es miren mai"],"c":1,"por":"La part superior i el començament de les línies són les zones calentes: allà hi van els missatges i botons clau."}
---
Els <b>mapes de calor</b> (Hotjar, Microsoft Clarity) mostren les <b>zones calentes</b> on l'usuari mira, clica i fins on fa scroll: la part superior de la pàgina i el patró en F reben més atenció. La <b>zona d'usuari</b> (àrea de client amb inici de sessió) permet veure comandes, guardar adreces i llistes de desitjos. El <b>carretó</b> ha de mostrar costos totals aviat i permetre comprar com a convidat.

El <b>flux de caixa</b> d'una botiga en línia inclou cobraments (que la passarel·la ingressa amb uns dies de retard), comissions de pagament i de marketplace, devolucions, enviaments, compres d'estoc, publicitat i impostos. Es pot vendre molt i quedar-se sense caixa si l'estoc i la publicitat es paguen abans de cobrar.

<b>Programes de disseny gràfic</b> i utilitats per al web: Canva o Adobe Express (ràpids), Photoshop i GIMP (retoc d'imatge), Illustrator i Inkscape (vectorial: logos), Figma (prototips de web) i compressors d'imatge (Squoosh, TinyPNG) perquè la web carregui ràpid.
