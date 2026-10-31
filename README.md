# ECONEXO

**Economía · Tecnología · Negocios** — Entiende el presente. Anticípate al futuro.

Medio digital independiente para España y Latinoamérica que combina **actualidad**, **formación** y **herramientas** sobre economía, finanzas, marketing, tecnología e inteligencia artificial.

## Tecnología

| Componente | Elección |
|---|---|
| Web | Next.js (App Router) + TypeScript, exportación estática |
| Diseño | Tailwind CSS · Manrope (titulares) e Inter (texto, cifras tabulares) |
| Contenido | Archivos Markdown en `content/<sección>/<slug>.md` |
| Panel editorial | Sveltia CMS en `/admin` (compatible con Decap CMS), publica con commits en GitHub |
| Alojamiento | Netlify (gratuito), formulario de newsletter con Netlify Forms |
| Publicidad | Google AdSense, desactivado hasta tener la aprobación |

Los artículos en Markdown se pueden migrar más adelante a WordPress u otro CMS sin perder nada.

## Estados editoriales

Cada artículo tiene un `estado`: `borrador`, `revision`, `aprobada`, `programada`, `publicada` o `archivada`.

- **Producción** solo muestra los `publicada` cuya fecha ya ha llegado (una fecha futura programa la publicación: hace falta una recompilación ese día, por ejemplo con un *build hook* diario de Netlify).
- **Previsualizaciones** (ramas y *deploy previews* de Netlify) muestran también los artículos en revisión, con un aviso, y no se indexan.

Todo el contenido inicial está en `revision`: revísalo, añade los enlaces de las fuentes y cámbialo a `publicada`.

## Secciones

Publicadas en la fase 1: Actualidad, Marketing digital, Inteligencia artificial, Finanzas, Casos, Aprende y Herramientas. Las URL de Economía, Tecnología, Redes sociales, Empresas y Ofimática están reservadas en `lib/site.ts` (`live: false`) y se activan cuando tengan contenido.

URL: `/<sección>/` · `/<sección>/<subsección>/` · `/<sección>/<slug-del-artículo>/` · `/herramientas/<herramienta>/`.

## Universo CROMO

La marca educativa de ECONEXO (`/universo-cromo/`), con dos protagonistas de personalidades opuestas y complementarias:

- **CROMO**, el camaleón que siempre mete la pata: impulsivo, presumido, se apunta a todas las modas.
- **PROFE SURICATA**, el conocimiento y el sentido común: paciente, irónico y didáctico.
- Secundarios: DON PRESU (finanzas) y CHATARRA (la IA), con retratos provisionales.

Personajes, frases, series y enlaces de redes en `lib/cromo.ts`. Ilustraciones oficiales y expresiones en `public/media/personajes/` (`cromo-<gesto>.webp`, `profe-<gesto>.webp`).

Dónde aparecen (solo en contenido educativo, nunca en noticias):

- **Vídeos** (`content/videos/`, colección «Universo CROMO · Vídeos» en `/admin`): página con reproductor, «Lo que aprendes», guion y enlaces a la guía y la herramienta. Sin enlace de YouTube aparece como «Próximamente». El reproductor no conecta con YouTube hasta pulsar play (youtube-nocookie.com).
- **Guías ilustradas**: cualquier artículo con el campo `dialogo` muestra el bloque «En 30 segundos» (CROMO pregunta, el Profe responde) antes de la explicación técnica.
- **Herramientas**: el campo `dialogo` de `lib/tools.ts` presenta cada calculadora («Antes de calcular»).
- **Portada** (bloque Universo CROMO) y **newsletter** «El consejo semanal del Profe Suricata» en las páginas del universo.

Gestos disponibles: CROMO `alegria, sorpresa, enfado, confusion, verguenza, hablando, senalando`; Profe `alegria, pensativo, sorpresa, guino, esceptico, paciencia`.

Redes: `NEXT_PUBLIC_YOUTUBE_URL`, `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_TIKTOK_URL`, `NEXT_PUBLIC_LINKEDIN_URL`. La antigua dirección `/videos/` redirige a `/universo-cromo/`.

## Plantillas por tipo de contenido

- `noticia`: fecha y hora, fuentes, noticias relacionadas.
- `guia`: índice automático, preguntas frecuentes, herramienta relacionada.
- `financiero`: fecha de referencia de los datos y aviso de información educativa (no asesoramiento).
- `caso`: ficha (empresa, año, sector, concepto) y estructura «Qué pasó / Por qué / Qué aprendemos / Para pensar».

## Puesta en marcha

1. Sube este repositorio a GitHub (`comercelectronic/econexo`) y conéctalo a Netlify (detecta `netlify.toml`).
2. Variables de entorno en Netlify:
   - `NEXT_PUBLIC_SITE_URL`: el dominio definitivo (por ejemplo, `https://econexo.com`).
   - `NEXT_PUBLIC_ADSENSE_CLIENT`: el identificador `ca-pub-…`, solo cuando AdSense apruebe la web.
3. Panel editorial: entra en `/admin/` y accede con GitHub (Sveltia permite un *token* personal de GitHub con permiso de escritura en el repositorio).
4. Completa los datos `[PENDIENTE]` del aviso legal, privacidad, cookies, contacto y quiénes somos.
5. Revisa el contenido con `npm run check`.

## AdSense y lectores del juego «Agència Digital»

Los anuncios solo se cargan si existe `NEXT_PUBLIC_ADSENSE_CLIENT`. Quien llega desde el juego educativo con `?des=joc` en el enlace no ve publicidad durante toda la visita. El consentimiento de cookies debe gestionarse con el mensaje de privacidad certificado de Google (AdSense > Privacidad y mensajes).

## Desarrollo

```bash
npm install
npm run dev                                   # http://localhost:3000
ECONEXO_MOSTRAR_BORRADORES=1 npm run build    # compilación con artículos en revisión
npm run check                                 # tipos y revisión del contenido
```
