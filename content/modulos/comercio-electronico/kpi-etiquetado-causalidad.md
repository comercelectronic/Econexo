---
id: L_kpi
titulo: "KPI, etiquetado y causalidad"
objetivo: "Construir un informe que separe actividad, resultados de marketing y resultados comerciales."
orden: 16
codigos: ["1.1","3.10"]
area: "Analítica"
capitulo: "2.4"
capitulo_titulo: "El cliente que solo mira los seguidores"
estado: publicada
tira:
  - [{"quien":"eco","gesto":"alegria","texto":"¡Este mes he publicado 30 vídeos!"}]
  - [{"quien":"nexo","gesto":"pensativo","texto":"¿Y qué ha pasado con las ventas?"},{"quien":"eco","gesto":"confusion","texto":"¿Publicar 30 vídeos no es un resultado?"}]
  - [{"quien":"nexo","gesto":"guino","texto":"Es actividad. El resultado es lo que consigues. Y etiqueta los enlaces para saber de dónde viene cada visita."}]
ejemplo: "Un informe honesto: «Hemos publicado 20 veces (actividad), han llegado 1.200 visitas desde Instagram (marketing) y 18 han comprado, 540 € (comercial)»."
errores: ["Mezclar actividad con resultados.","Atribuir todo el cambio a la campaña.","Enlaces sin etiquetar."]
test:
  - {"p":"«Hemos publicado 30 vídeos.» ¿Qué nivel es?","o":["Actividad","Resultado comercial","Interacción","Alcance"],"c":0,"por":"Describe el trabajo hecho, no el resultado obtenido."}
  - {"p":"¿Para qué sirven los parámetros UTM?","o":["Para identificar de qué campaña viene cada visita","Para saber cuántas veces se ha visto el anuncio","Para contar las ventas de cada producto","Para evitar que las visitas se dupliquen en Analytics"],"c":0,"por":"Permiten atribuir visitas y ventas a cada acción."}
  - {"p":"Las ventas suben en diciembre y la campaña también era en diciembre. ¿Qué puedes afirmar?","o":["La campaña ha causado la subida, porque coinciden","Hay correlación, pero hay que descartar la estacionalidad","La campaña ha funcionado si las ventas han subido más de un 10 %","No se puede saber nada de ninguna campaña hecha en diciembre"],"c":1,"por":"Hay que comparar con años anteriores o con un grupo de control."}
  - {"p":"Caso real · Wells Fargo (2016). El banco fijó objetivos muy agresivos de cuentas abiertas por cliente. Miles de empleados abrieron cuentas sin permiso de los clientes. ¿Qué ilustra?","o":["Que los objetivos de ventas no se deben medir","Que un KPI mal elegido puede incentivar conductas que dañan el negocio","Que el problema era que el KPI no tenía plazo","Que había que medir más KPI a la vez"],"c":1,"por":"Cuando una métrica se convierte en el objetivo, la gente puede optimizar el número en lugar del resultado real."}
  - {"p":"Caso real · Google Analytics. Los parámetros UTM se llaman así por Urchin, la empresa que Google compró en 2005 y que dio origen a Google Analytics. ¿Cuál de estos enlaces está bien etiquetado para un boletín?","o":["web.cat/?font=correo","web.cat/?utm_source=boletin&utm_medium=email&utm_campaign=noviembre","web.cat/?utm_campaign=noviembre","web.cat/boletin-noviembre"],"c":1,"por":"Fuente, medio y campaña permiten saber de dónde viene cada visita y comparar canales."}
---
Un <b>KPI</b> (indicador clave de rendimiento) es la métrica que dice si avanzas hacia el objetivo. Separa tres niveles: <b>actividad</b> (publicaciones hechas), <b>resultados de marketing</b> (visitas, contactos) y <b>resultados comerciales</b> (ventas, ingresos).

Para saber de dónde viene cada visita hay que <b>etiquetar</b> los enlaces de las campañas (parámetros UTM) y definir <b>eventos y conversiones</b> en la analítica web.

<b>Correlación no es causalidad</b>: que dos cosas ocurran a la vez no quiere decir que una provoque la otra. Las ventas pueden subir en diciembre por Navidad, no por la campaña.
