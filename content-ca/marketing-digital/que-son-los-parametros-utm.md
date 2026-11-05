---
modulos: ["comercio-electronico"]
codigos: ["1.1", "3.10"]
titulo: "Paràmetres UTM: què són i com fer-los servir per mesurar les teves campanyes"
subtitulo: "Amb cinc etiquetes als teus enllaços, Google Analytics sabrà de quina campanya, canal i anunci ve cada visita."
descripcion: "Guia dels paràmetres UTM: què és cadascun, exemples de nomenclatura, errors freqüents i generador gratuït d'enllaços."
tipo: "guia"
subseccion: "analitica"
estado: "publicada"
fecha: 2026-10-29T10:00:00+01:00
autor: "Redacció ECOyNEXO"
etiquetas: ["utm", "google analytics", "analítica", "campanyes"]
pais: ["global"]
herramienta: "generador-utm"
faq:
  - p: "Per què es diuen UTM?"
    r: "Per Urchin Tracking Module. Urchin era una empresa d'analítica web que Google va comprar el 2005 i que va donar origen a Google Analytics."
fuentes:
  - nombre: "Ajuda de Google Analytics: recopilar dades de campanyes amb URL personalitzades"
dialogo:
  - { "quien": "eco", "gesto": "confusion", "texto": "Analytics diu que gairebé totes les meves visites són «directes». Tinc fans que se saben el meu web de memòria!" }
  - { "quien": "nexo", "gesto": "esceptico", "texto": "O no has etiquetat els enllaços de la teva newsletter, ECO." }
  - { "quien": "eco", "gesto": "verguenza", "texto": "Etiquetar? Com la roba?" }
  - { "quien": "nexo", "gesto": "alegria", "texto": "Gairebé. Es diuen paràmetres UTM. T'ho explico." }
---
Quan algú arriba al teu web des d'una newsletter, un anunci o una publicació a xarxes, Google Analytics no sempre sap d'on ve. Els **paràmetres UTM** són etiquetes que afegeixes al final d'un enllaç per identificar-lo.

## Els cinc paràmetres

| Paràmetre | Per a què serveix | Exemple |
|---|---|---|
| utm_source | La font concreta | newsletter, google, instagram |
| utm_medium | El tipus de canal | email, cpc, social |
| utm_campaign | La campanya | black-friday-2026 |
| utm_term | La paraula clau (anuncis) | sabatilles-trail |
| utm_content | La versió de l'anunci o enllaç | banner-blau |

Els tres primers són els imprescindibles.

## Un exemple complet

`https://elteuweb.com/oferta/?utm_source=newsletter&utm_medium=email&utm_campaign=novembre`

## Una nomenclatura que no es trenqui

- Tot en **minúscules**: Analytics distingeix «Email» d'«email».
- Guions en lloc d'espais.
- Una llista compartida de valors permesos per a tot l'equip.

## Errors freqüents

1. Posar UTM en enllaços interns del teu propi web: substitueixen la font real de la visita (per exemple, Google) per la de la teva etiqueta i fan malbé l'atribució.
2. Fer servir noms diferents per a la mateixa campanya a cada canal.
3. Oblidar les UTM als enllaços de la biografia de xarxes socials.
