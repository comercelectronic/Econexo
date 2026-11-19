---
id: A_frio
titulo: "Conservació, peribles i cadena de fred"
objetivo: "Mantenir les condicions de conservació i no trencar la cadena de fred."
orden: 14
codigos: ["3.1", "3.2"]
area: "Emmagatzematge i conservació"
capitulo: "3"
capitulo_titulo: "Carretoner"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "alegria", "texto": "Deixo el palet de congelats al moll i em prenc un cafè."}]
  - [{"quien": "nexo", "gesto": "enfado", "texto": "Mitja hora fora de la cambra! Es trenca la cadena de fred i s'han de llençar."}]
  - [{"quien": "eco", "gesto": "sorpresa", "texto": "Tan ràpid?"}, {"quien": "nexo", "gesto": "senalando", "texto": "El refrigerat i el congelat, sempre primer a la seva cambra."}]
ejemplo: "A Palet, des de carretoner gestiones la cambra de fred: cada minut que un palet de congelats passa al moll compta, i si es fa malbé és merma."
errores: ["Deixar els refrigerats al moll mentre es descarrega la resta del camió.", "Obrir la porta de la cambra més del necessari."]
test:
  - {"p": "A quina temperatura es conserven els congelats?", "o": ["Entre 0 i 4 °C", "A −18 °C o menys", "A temperatura ambient", "A 8 °C"], "c": 1, "por": "És la temperatura habitual de congelació."}
  - {"p": "Què és la cadena de fred?", "o": ["Una cadena de supermercats", "Mantenir la temperatura sense interrupcions del fabricant al client", "El sistema de refrigeració del camió", "Una màquina de gel"], "c": 1, "por": "Qualsevol interrupció la trenca."}
  - {"p": "En descarregar un camió amb secs i refrigerats, què fas primer?", "o": ["Els secs, que n'hi ha més", "Els refrigerats, directes a la cambra", "El que sigui més a prop de la porta", "Deixar-ho tot al moll"], "c": 1, "por": "Per no trencar la cadena de fred."}
  - {"p": "Es trenca la cadena de fred i el producte es torna a refredar. És segur?", "o": ["Sí, sempre", "No es pot garantir: pot no ser-ho", "Sí, si fa bona olor", "Sí, si és de marca"], "c": 1, "por": "Els bacteris han pogut créixer."}
---
Cada producte té les seves <b>condicions de conservació</b>: temperatura, humitat, llum i ventilació. Els secs (pasta, llaunes) van a temperatura ambient, en un lloc fresc i sec; els <b>refrigerats</b> (làctics, carn fresca) a la cambra de fred, en general entre <b>0 i 4-5 °C</b>; els <b>congelats</b>, a <b>−18 °C o menys</b>.

La <b>cadena de fred</b> és mantenir la temperatura sense interrupcions des del fabricant fins al client: transport frigorífic, recepció immediata, cambra, preparació ràpida i càrrega sense esperes. Si es trenca, encara que després es torni a refredar, el producte pot no ser segur.

Els <b>peribles</b> es controlen per data (FEFO), es revisen sovint i es registra la temperatura de les cambres.
