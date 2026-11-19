---
id: A_inventario
titulo: "Inventaris, mermes i diferències"
objetivo: "Fer un recompte, calcular les diferències d'inventari i buscar-ne les causes."
orden: 20
codigos: ["4.4", "4.5"]
area: "Gestió d'estocs i inventaris"
capitulo: "5"
capitulo_titulo: "Cap de magatzem"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "confusion", "texto": "El sistema diu 48 caixes de galetes i jo en compto 45…"}]
  - [{"quien": "nexo", "gesto": "pensativo", "texto": "Diferència d'inventari: −3. Trencades? Mal registrades? Un error de picking?"}]
  - [{"quien": "nexo", "gesto": "guino", "texto": "S'ajusta el sistema… i se'n busca la causa."}]
ejemplo: "A Palet, el cap de magatzem fa recomptes cíclics. Si les diferències creixen, és senyal d'errors en la recepció o el picking de l'equip."
errores: ["Ajustar l'estoc del sistema sense investigar per què no quadra.", "Fer l'inventari amb mercaderia entrant i sortint sense controlar-la."]
test:
  - {"p": "Comptar cada setmana una part del magatzem sense aturar l'activitat és un inventari…", "o": ["Periòdic", "Rotatiu o cíclic", "Anual", "Permanent"], "c": 1, "por": "Es reparteix el recompte al llarg de l'any."}
  - {"p": "El sistema diu 120 i en comptes 114. Diferència d'inventari?", "o": ["+6", "−6", "114", "0"], "c": 1, "por": "Real − teòric = 114 − 120 = −6."}
  - {"p": "Què és una merma?", "o": ["Un producte que s'ha venut", "Una pèrdua de mercaderia per caducitat, trencament o deteriorament", "Un descompte", "Una devolució d'un client"], "c": 1, "por": "Producte que ja no es pot vendre."}
  - {"p": "Quins productes es compten més sovint en un inventari cíclic?", "o": ["Els C", "Els A, de més valor o rotació", "Els que pesen més", "Els més barats"], "c": 1, "por": "Són els que més impacte tenen."}
---
L'<b>inventari</b> és comptar físicament les existències i comparar-les amb les del sistema. Tipus: <b>periòdic</b> (tot el magatzem d'un cop, normalment al tancament de l'exercici; sovint cal aturar l'activitat), <b>permanent</b> (el sistema actualitza l'estoc amb cada entrada i sortida) i <b>rotatiu o cíclic</b> (es compta cada dia o cada setmana una part del magatzem, sense aturar-se; els productes A més sovint).

Les <b>diferències d'inventari</b> (estoc real − estoc teòric) poden venir de <b>mermes</b> (caducats, trencaments, deterioraments), errors de recepció o de picking, registres mal fets o robatoris. Les mermes conegudes es registren com a baixes; les diferències s'ajusten al sistema i se n'investiga la causa per corregir-la.
