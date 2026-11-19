---
id: A_abc
titulo: "L'anàlisi ABC"
objetivo: "Classificar les referències en A, B i C i decidir com gestionar cada grup."
orden: 22
codigos: ["4.6"]
area: "Gestió d'estocs i inventaris"
capitulo: "5"
capitulo_titulo: "Cap de magatzem"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "confusion", "texto": "Tinc 500 referències. Les controlo totes igual?"}]
  - [{"quien": "nexo", "gesto": "senalando", "texto": "Unes poques suposen gairebé tot el valor. Aquestes, les A, controla-les al detall."}]
  - [{"quien": "eco", "gesto": "alegria", "texto": "El 80-20!"}]
ejemplo: "A Palet, el cap de magatzem veu quines referències són A: l'oli i la llet surten cada dia i suposen gran part del valor; les espècies són C."
errores: ["Controlar igual 500 referències en lloc de centrar-se en les A.", "Classificar només per preu sense tenir en compte el consum."]
test:
  - {"p": "En una anàlisi ABC típica, les referències A són…", "o": ["Moltes referències amb poc valor", "Poques referències que concentren la major part del valor", "Les més barates", "Les que tenen menys sortides"], "c": 1, "por": "Principi de Pareto (80-20)."}
  - {"p": "Com es calcula el valor que ordena l'ABC?", "o": ["Preu de venda", "Consum anual × cost unitari", "Pes × volum", "Nombre de proveïdors"], "c": 1, "por": "Combina quantitat i cost."}
  - {"p": "Quines referències es compten amb més freqüència?", "o": ["Les A", "Les B", "Les C", "Cap"], "c": 0, "por": "Un error en aquestes pesa molt."}
  - {"p": "Un ABC per nombre de sortides serveix sobretot per…", "o": ["Fixar el preu", "Decidir les ubicacions (les de més rotació a prop de l'expedició)", "Triar el transportista", "Calcular l'IVA"], "c": 1, "por": "Redueix els recorreguts de picking."}
---
L'<b>anàlisi ABC</b> aplica el principi de Pareto: poques referències concentren la major part del valor (o de les sortides). S'ordenen les referències de més a menys valor anual (consum × cost) i es classifiquen: <b>A</b> (al voltant del 20 % de les referències, prop del 80 % del valor), <b>B</b> (un 30 % de referències, un 15 % del valor) i <b>C</b> (al voltant del 50 % de les referències, només un 5 % del valor). Els percentatges són orientatius.

Usos: les <b>A</b> es controlen sovint (inventari cíclic freqüent, previsió ajustada, millors ubicacions si són d'alta rotació); les <b>C</b>, amb controls més senzills i comandes més espaiades. L'ABC per <b>rotació</b> (nombre de sortides) serveix per decidir les ubicacions.
