---
titulo: "Parámetros UTM: qué son y cómo usarlos para medir tus campañas"
subtitulo: "Con cinco etiquetas en tus enlaces, Google Analytics sabrá de qué campaña, canal y anuncio viene cada visita."
descripcion: "Guía de los parámetros UTM: qué es cada uno, ejemplos de nomenclatura, errores frecuentes y generador gratuito de enlaces."
tipo: guia
subseccion: analitica
estado: revision
fecha: 2026-10-29T10:00:00+01:00
autor: Redacción ECONEXO
etiquetas: [utm, google analytics, analítica, campañas]
pais: [global]
herramienta: generador-utm
faq:
  - p: "¿Por qué se llaman UTM?"
    r: "Por Urchin Tracking Module. Urchin era una empresa de analítica web que Google compró en 2005 y que dio origen a Google Analytics."
fuentes:
  - nombre: "Ayuda de Google Analytics: recopilar datos de campañas con URLs personalizadas"
dialogo:
  - { quien: cromo, gesto: confusion, texto: "Analytics dice que casi todas mis visitas son «directas». ¡Tengo fans que se saben mi web de memoria!" }
  - { quien: profe, gesto: esceptico, texto: "O no has etiquetado los enlaces de tu newsletter, CROMO." }
  - { quien: cromo, gesto: verguenza, texto: "¿Etiquetar? ¿Como la ropa?" }
  - { quien: profe, gesto: alegria, texto: "Casi. Se llaman parámetros UTM. Te lo explico." }
---
Cuando alguien llega a tu web desde una newsletter, un anuncio o una publicación en redes, Google Analytics no siempre sabe de dónde viene. Los **parámetros UTM** son etiquetas que añades al final de un enlace para identificarlo.

## Los cinco parámetros

| Parámetro | Para qué sirve | Ejemplo |
|---|---|---|
| utm_source | La fuente concreta | newsletter, google, instagram |
| utm_medium | El tipo de canal | email, cpc, social |
| utm_campaign | La campaña | black-friday-2026 |
| utm_term | La palabra clave (anuncios) | zapatillas-trail |
| utm_content | La versión del anuncio o enlace | banner-azul |

Los tres primeros son los imprescindibles.

## Un ejemplo completo

`https://tuweb.com/oferta/?utm_source=newsletter&utm_medium=email&utm_campaign=noviembre`

## Una nomenclatura que no se rompa

- Todo en **minúsculas**: Analytics distingue «Email» de «email».
- Guiones en lugar de espacios.
- Una lista compartida de valores permitidos para todo el equipo.

## Errores frecuentes

1. Poner UTM en enlaces internos de tu propia web: crean sesiones nuevas y estropean la atribución.
2. Usar nombres diferentes para la misma campaña en cada canal.
3. Olvidar las UTM en los enlaces de la biografía de redes sociales.
