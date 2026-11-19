---
id: A_valoracion
titulo: "Valoración de existencias: PMP y FIFO"
objetivo: "Valorar las salidas y el stock final con el precio medio ponderado y con FIFO."
orden: 21
codigos: ["4.3"]
area: "Gestión de stocks e inventarios"
capitulo: "5"
capitulo_titulo: "Jefe de almacén"
estado: publicada
tira:
  - [{"quien": "eco", "gesto": "pensativo", "texto": "Compré harina a 2 € y después a 3 €. ¿A cuánto me ha costado la que he vendido?"}]
  - [{"quien": "nexo", "gesto": "guino", "texto": "Depende del método: precio medio ponderado o FIFO."}]
  - [{"quien": "eco", "gesto": "sorpresa", "texto": "¿Las matemáticas también están en el almacén?"}]
ejemplo: "Tienes 100 kg a 2 € y compras 100 kg a 3 €. PMP = (200 + 300) ÷ 200 = 2,50 €/kg. Si vendes 120 kg: con PMP cuestan 300 €; con FIFO, 100 × 2 + 20 × 3 = 260 €."
errores: ["Valorar todas las salidas al último precio de compra.", "Pensar que el método de valoración obliga a mover la mercancía de una determinada manera."]
test:
  - {"p": "Stock: 50 u a 4 €. Compras 50 u a 6 €. ¿PMP?", "o": ["4 €", "5 €", "6 €", "10 €"], "c": 1, "por": "(200 + 300) ÷ 100 = 5 €."}
  - {"p": "Con FIFO, las salidas se valoran…", "o": ["Al precio más reciente", "Al precio de las unidades más antiguas", "A la media", "Al precio de venta"], "c": 1, "por": "Primero salen (contablemente) las primeras que entraron."}
  - {"p": "Con los datos anteriores vendes 60 u. ¿Coste con FIFO?", "o": ["300 €", "260 €", "360 €", "240 €"], "c": 1, "por": "50 × 4 + 10 × 6 = 260 €."}
  - {"p": "¿Qué método NO admite el Plan General de Contabilidad para valorar existencias?", "o": ["PMP", "FIFO", "LIFO", "Ninguno de ellos"], "c": 2, "por": "El PGC de 2007 admite PMP y FIFO."}
---
Cuando el mismo producto se compra a precios distintos, hay que decidir a qué coste salen las unidades y cuánto vale el stock. Los métodos admitidos por el Plan General de Contabilidad son el <b>precio medio ponderado (PMP)</b> y el <b>FIFO</b>.

<b>PMP</b>: después de cada entrada se calcula el coste medio = (valor del stock anterior + valor de la entrada) ÷ (unidades totales), y las salidas se valoran a ese precio. <b>FIFO</b>: las salidas se valoran al precio de las unidades más antiguas.

Se registra en la <b>ficha de almacén</b> (entradas, salidas y existencias, en unidades y en euros). No hay que confundir el método de valoración con cómo se mueve físicamente la mercancía (FEFO en el almacén).
