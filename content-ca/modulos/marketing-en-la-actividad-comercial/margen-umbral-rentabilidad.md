---
id: M_margen
titulo: "Marge i llindar de rendibilitat"
objetivo: "Calcular el marge sobre cost i sobre venda i el llindar de rendibilitat d'una botiga."
orden: 16
codigos: ["5.4"]
area: "Les polítiques de preu"
capitulo: "1"
capitulo_titulo: "Rebost de barri"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "alegria", "texto": "Avui he venut 300 €! Soc ric!"}]
  - [{"quien": "nexo", "gesto": "paciencia", "texto": "Resta el que et va costar el producte i el lloguer, la llum, el sou…"}]
  - [{"quien": "eco", "gesto": "verguenza", "texto": "…Em queden 4 €."}, {"quien": "nexo", "gesto": "guino", "texto": "Per això cal conèixer el marge i el llindar."}]
ejemplo: "Compres a 6 € i vens a 10 €: marge de 4 €, un 40 % sobre el preu i un 66,7 % sobre el cost. Si els teus costos fixos són 400 € al mes, has de vendre 100 unitats al mes només per quedar-te a zero."
errores: ["Voler un 40 % de marge i multiplicar el cost per 1,4 (això és un 40 % sobre el cost).", "Confondre vendes amb benefici."]
test:
  - {"p": "Compres a 6 € i vens a 10 €. Marge sobre el preu?", "o": ["40 %", "66,7 %", "4 %", "60 %"], "c": 0, "por": "(10 − 6) ÷ 10 = 0,40."}
  - {"p": "Vols un 50 % de marge sobre el preu i el producte et costa 3 €. A quin preu el vens?", "o": ["4,50 €", "6 €", "3,50 €", "5 €"], "c": 1, "por": "3 ÷ (1 − 0,5) = 6 €."}
  - {"p": "Costos fixos de 900 €, preu de 15 € i cost variable de 6 €. Llindar en unitats?", "o": ["60", "100", "150", "90"], "c": 1, "por": "900 ÷ (15 − 6) = 100 unitats."}
  - {"p": "Què és un cost fix?", "o": ["El producte que compres per vendre", "El lloguer del local", "La comissió del datàfon per venda", "L'envàs de cada producte"], "c": 1, "por": "No canvia encara que venguis més o menys."}
---
<b>Marge</b> per unitat = preu de venda − cost. En percentatge es pot calcular <b>sobre el preu de venda</b> (marge ÷ preu) o <b>sobre el cost</b> (marge ÷ cost); no donen el mateix número. Si vols un marge sobre el preu: <b>preu = cost ÷ (1 − marge)</b>.

Els <b>costos fixos</b> no canvien amb les vendes (lloguer, sous, llum) i els <b>variables</b> sí (el producte que vens). El <b>llindar de rendibilitat</b> o punt mort és la venda mínima per no perdre: <b>unitats = costos fixos ÷ (preu − cost variable unitari)</b>. Per sobre del llindar, l'empresa guanya diners.
