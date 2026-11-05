---
id: L_seguretat
titulo: "Seguretat: xifratge, certificats i firma digital"
objetivo: "Protegir les transaccions i els sistemes d'una empresa digital."
orden: 35
codigos: ["2.10","2.11","5.9"]
area: "Nivell avançat"
capitulo: "4.7"
capitulo_titulo: "Mobles Ter: pagaments i seguretat"
estado: publicada
tira:
  - [{"quien":"eco","gesto":"alegria","texto":"La meva contrasenya és «1234». Així no me n'oblido mai."}]
  - [{"quien":"nexo","gesto":"enfado","texto":"Ni els lladres."},{"quien":"eco","gesto":"sorpresa","texto":"Me la poden endevinar?"}]
  - [{"quien":"nexo","gesto":"paciencia","texto":"Contrasenyes llargues i úniques, verificació en dos passos, còpies de seguretat i web amb HTTPS."}]
ejemplo: "La botiga de mobles activa HTTPS, verificació en dos passos a tots els comptes i còpies diàries. Quan arriba un correu fals «del banc», l'equip el detecta perquè ha fet una formació de phishing."
errores: ["Fer servir la mateixa contrasenya a tot arreu.","No fer còpies de seguretat fora del servidor.","Clicar enllaços de correus urgents sense comprovar el remitent."]
test:
  - {"p":"En el xifratge asimètric...","o":["es fa servir una clau pública i una privada","es fa servir la mateixa clau per xifrar i desxifrar","es fan servir dues claus privades","la clau privada xifra i la pública desxifra"],"c":0,"por":"La clau pública xifra; només la privada desxifra."}
  - {"p":"Què garanteix la firma digital?","o":["La identitat del signant i que el document no s'ha modificat","Que el document és confidencial i només el pot llegir el destinatari","La identitat del signant i la data en què es va crear","Que el document s'ha enviat per un canal xifrat"],"c":0,"por":"Autenticitat i integritat."}
  - {"p":"Quina és una bona pràctica contra el phishing?","o":["Comprovar remitent i enllaços abans de clicar","Obrir només els adjunts en PDF","Confiar en els correus que porten el logo del banc","Canviar la contrasenya després de clicar l'enllaç"],"c":0,"por":"El phishing es basa en enganyar amb urgència i aparença oficial."}
  - {"p":"Cas real · Target (2013). Els atacants van entrar a la xarxa de la cadena amb les credencials d'un proveïdor de climatització i van robar dades de 40 milions de targetes. Quin va ser el punt feble?","o":["El xifratge de la web","L'accés d'un proveïdor extern sense prou control","Els datàfons de les botigues","La contrasenya del director"],"c":1,"por":"La seguretat és tan forta com la baula més feble: permisos mínims també per als proveïdors."}
  - {"p":"Cas real · WannaCry (2017). Aquest ransomware va afectar milers d'empreses, entre elles Telefónica, aprofitant una vulnerabilitat de Windows que ja tenia actualització. Quina mesura l'hauria evitat?","o":["Canviar totes les contrasenyes","Aplicar les actualitzacions de seguretat a temps","Tenir un antivirus gratuït","Fer servir xifratge asimètric"],"c":1,"por":"Moltes infeccions aprofiten errors ja corregits. Actualitzar i tenir còpies 3-2-1 és la base."}
---
L'<b>encriptació o xifratge</b> transforma la informació perquè només la pugui llegir qui té la clau. <b>Simètric</b>: la mateixa clau per xifrar i desxifrar. <b>Asimètric</b>: una clau pública per xifrar i una privada per desxifrar. L'<b>HTTPS</b> (TLS) xifra la connexió entre el navegador i la web: el cadenat és imprescindible en una botiga.

Un <b>certificat digital</b> identifica una persona, empresa o web (emès per una autoritat de certificació). La <b>firma digital</b> garanteix qui ha signat un document i que no s'ha modificat. El <b>DNI electrònic</b> porta certificats per identificar-se i signar en línia, com l'idCAT o el certificat de la FNMT.

Estratègia de <b>seguretat informàtica</b>: contrasenyes llargues i úniques amb gestor, verificació en dos passos, actualitzacions, còpies de seguretat (regla 3-2-1), permisos mínims, formació contra el <b>phishing</b> i un pla de resposta a incidents.
