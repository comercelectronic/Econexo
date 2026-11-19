---
id: M_surtido
titulo: "Gamma, línia i assortiment"
objetivo: "Mesurar l'assortiment d'una botiga en amplitud i profunditat i decidir com ampliar-lo."
orden: 11
codigos: ["4.3"]
area: "Les polítiques de producte"
capitulo: "2"
capitulo_titulo: "Botiga gran"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "alegria", "texto": "Tinc 20 tipus de melmelada!"}]
  - [{"quien": "nexo", "gesto": "esceptico", "texto": "I pa? I llet? Els clients vénen a fer la compra, no només a buscar melmelada."}]
  - [{"quien": "nexo", "gesto": "guino", "texto": "Molta profunditat i poca amplitud. Equilibra l'assortiment."}]
ejemplo: "A Mercadeja cada prestatgeria és una línia. Amb més prestatgeries (botiga gran) pots atendre més tipus de client: guanyes amplitud."
errores: ["Afegir referències sense mirar si les anteriors es venen.", "Confondre amplitud (quantes línies) amb profunditat (quantes referències per línia)."]
test:
  - {"p": "Una botiga amb 12 línies de producte i poques referències a cadascuna té un assortiment…", "o": ["Ampli i poc profund", "Estret i profund", "Estret i poc profund", "Ampli i profund"], "c": 0, "por": "Moltes línies (ampli), poques variants (poc profund)."}
  - {"p": "Una botiga de tes amb 150 varietats de te té un assortiment…", "o": ["Ampli", "Estret i profund", "Incoherent", "Indiferenciat"], "c": 1, "por": "Una sola línia amb moltes referències."}
  - {"p": "Què és una referència?", "o": ["Una línia de productes", "Cada variant concreta d'un producte (format, gust, mida)", "La marca de la botiga", "El proveïdor principal"], "c": 1, "por": "Per exemple, el iogurt natural de 4 unitats d'una marca."}
  - {"p": "Quin inconvenient té ampliar molt l'assortiment?", "o": ["Atrau menys clients", "Més estoc immobilitzat, més espai i més mermes", "Baixa la qualitat", "Elimina la competència"], "c": 1, "por": "Cada referència costa espai i diners."}
---
La <b>gamma</b> o cartera és el conjunt de productes que ofereix una empresa. Es divideix en <b>línies</b>: grups de productes relacionats (làctics, fleca, fruita). Cada variant concreta és una <b>referència</b>.

L'<b>assortiment</b> es mesura per la seva <b>amplitud</b> (nombre de línies), la seva <b>profunditat</b> (referències dins de cada línia) i la seva <b>coherència</b> (si les línies tenen relació entre elles). Un súper té un assortiment ampli; una botiga especialitzada, estret i profund.

Ampliar l'assortiment atrau més clients, però ocupa espai, immobilitza diners en estoc i augmenta les mermes. Cal eliminar les referències que no roten.
