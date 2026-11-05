---
id: L_domini
titulo: "Domini, allotjament i publicació de la web"
objetivo: "Triar i registrar un domini, escollir l'allotjament i publicar una web de manera segura."
orden: 9
codigos: ["2.3","3.4","3.5"]
area: "Web i comerç electrònic"
capitulo: "1.7"
capitulo_titulo: "Osona Bikes vol la seva pròpia web"
estado: publicada
tira:
  - [{"quien":"eco","gesto":"senalando","texto":"Domini de la botiga: bicis-barates-osona-online-24h.net"}]
  - [{"quien":"nexo","gesto":"esceptico","texto":"I qui se'n recordarà, d'això?"},{"quien":"eco","gesto":"verguenza","texto":"Jo… si ho apunto."}]
  - [{"quien":"nexo","gesto":"paciencia","texto":"Curt, clar i a nom de l'empresa: osonabikes.cat. I publica de manera segura."}]
ejemplo: "La botiga de bicis registra osonabikes.cat i osonabikes.com, connecta el repositori de la web a Netlify amb SSL automàtic i, cada vegada que aprova un canvi, la web es publica sola. Si alguna cosa falla, torna a la versió anterior amb un clic."
errores: ["Registrar el domini a nom d'un proveïdor o d'un familiar.","Deixar caducar el domini perquè no es renova.","Fer canvis directament a la web publicada sense còpia ni proves."]
test:
  - {"p":"Quin domini és millor per a una botiga de bicis de Vic amb clients catalans?","o":["osonabikes.com","osonabikes.cat","bicis-osona.cat","osonabikesvic.es"],"c":1,"por":"Curt, clar, sense guions i amb l'extensió del seu públic. El .com també convé registrar-lo per protegir la marca."}
  - {"p":"Què és l'allotjament web?","o":["El servidor on es guarden i se serveixen els fitxers de la web","L'adreça que la gent escriu per arribar a la web","El certificat que fa que la web sigui segura","El programa amb què es crea i s'edita la web"],"c":0,"por":"El domini és l'adreça; l'allotjament és on viu la web."}
  - {"p":"Quina és avui una manera segura i habitual de publicar una web feta a mida?","o":["Connectar un repositori Git a una plataforma que la publica automàticament","Pujar-la per FTP al servidor de producció directament","Editar els fitxers directament al servidor amb el gestor de l'allotjament","Comprimir-la en un ZIP i enviar-la al proveïdor d'allotjament"],"c":0,"por":"Hi ha historial de canvis, SSL automàtic i es pot tornar enrere. Si cal FTP, sempre SFTP."}
  - {"p":"Cas real · Tesla. Durant anys la web va ser teslamotors.com perquè tesla.com tenia un altre propietari. El 2016 va aconseguir tesla.com. Per què li importava tant?","o":["Perquè el .com és més segur","Perquè un domini curt i igual que la marca és més fàcil de recordar i fa més confiança","Perquè era obligatori per vendre cotxes en línia","Perquè així millorava la velocitat de la web"],"c":1,"por":"El domini ideal és el nom de la marca, curt i sense afegits. Per això convé registrar-lo com més aviat millor."}
  - {"p":"Cas real · Domini .cat. Es va aprovar el 2005 per a la comunitat lingüística i cultural catalana i el gestiona la Fundació puntCAT. Quan té més sentit fer-lo servir?","o":["Per a qualsevol web que vengui a Espanya","Per a webs amb contingut en català o adreçades al públic catalanoparlant","Només per a webs de l'administració","Per a webs que volen vendre a tot el món"],"c":1,"por":"L'extensió ha d'encaixar amb el públic: .cat per al català, .es per a Espanya i .com per a l'internacional."}
---
El <b>domini</b> és l'adreça de la web (osonabikes.cat). Ha de ser curt, fàcil de dir i escriure, sense guions ni números innecessaris, i amb l'extensió adequada: <b>.cat</b> per al públic català, <b>.es</b> per a Espanya, <b>.com</b> per a l'internacional. Es registra en un <b>registrador</b> acreditat i es renova cada any; convé registrar-lo a nom de l'empresa.

L'<b>allotjament</b> (hosting) és el servidor on viu la web: <b>compartit</b> (barat, per a webs petites), <b>VPS o núvol</b> (més potència i control), <b>gestionat</b> (WordPress gestionat, Shopify, Wix: tot inclòs) o plataformes per a webs modernes (Netlify, Vercel, Cloudflare Pages). Cal mirar velocitat, ubicació dels servidors, còpies de seguretat, certificat SSL i suport.

Per publicar, avui el més habitual és fer-ho des del mateix <b>CMS</b> (WordPress, Shopify o Wix publiquen amb un botó) o connectar un <b>repositori Git</b> (GitHub) a una plataforma com Netlify o Vercel, que publica sola cada canvi revisat i permet tornar enrere. L'<b>FTP</b> clàssic encara existeix en allotjaments compartits: si cal fer-lo servir, sempre <b>SFTP</b> (xifrat), amb programes com FileZilla. I abans de canvis grans, una còpia i un entorn de proves.
