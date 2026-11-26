# Instagram d'ECOyNEXO

Publicació automàtica: cada 15 minuts, la funció programada
`netlify/functions/instagram-publica.mjs` mira si a `calendario.json` hi ha un post al qual ja li ha arribat l'hora i el publica.

## Afegir posts

1. Afegeix el post a `calendario.json`: `id` (comença per la data), `fecha`, `hora` (de Madrid, per defecte 18:00), `tema` (`presentacion`, `concepto`, `caso`, `profes`, `test`),
   `slides` (1 a 10 diapositives) i `texto` (el peu del post: màxim 2.200 caràcters i 30 etiquetes).
   Tipus de diapositiva: `portada`, `texto`, `formula`, `dialogo`, `quiz` (amb `llisca` opcional), `respuesta`, `captura` (`titulo`, `imagen`: ruta dins de `public/`, `texto`) i `cta`. Mira'n exemples al calendari.
   El text admet `**negreta**` (surt amb el color del tema).
2. Genera les imatges: `node scripts/instagram/genera.mjs [id]` (JPEG 1080×1350 a `public/ig/<id>/`).
   Avisa si el text arriba al peu o si el personatge el tapa.
3. Revisa-les: `python3 scripts/instagram/mostra.py mostra.jpg <id>`.
4. Proves: `node scripts/test-instagram.mjs`. Després, commit i push a `main`.

## Històries

Un post amb `"historia": true` i **una sola** diapositiva es publica com a història (imatge vertical 1080×1920, `media_type=STORIES`).
Instagram no hi admet text ni enllaços per API: el `texto` es deixa buit i la imatge diu «enllaç a la bio». Es generen amb el mateix `genera.mjs`.

## Reels

Un post amb `reel` (en lloc de `slides`) es publica com a reel: vídeo vertical 1080×1920 que juga un simulador.

- `reel.guio`: guió (passos: `wait`, `click`, `css`, `drag:selector|x,y`, `key`, `eval`, `scroll`, `mark`) de `scripts/instagram/guions/<guio>.json` (què es clica al joc, amb marques de temps `mark:nom`).
- `reel.ganxo`: el text dels primers segons. `reel.escenes`: trossos de la gravació (`de` → `a`, entre marques), amb el `text` de dalt i la velocitat `vel`.
- `reel.final`: targeta final (`titol`, `boto`, `text`). `reel.personatge`: el personatge de sota el joc.

Genera'l amb `node scripts/instagram/reel.mjs [id]` (Playwright i ffmpeg): desa `public/ig/<id>/reel.mp4` i `portada.jpg`.
Si canvia un joc, torna'l a generar i revisa'l: el guió clica botons pel seu text.

Un post que no s'ha pogut publicar es torna a provar l'endemà; si ja fa més d'un dia, se salta.

## A Windows

Cal Playwright (`npm i playwright ffmpeg-static` en una carpeta d'eines i `NODE_PATH` apuntant-hi) i `ffmpeg` al PATH.
El gravador de reels fa servir la GPU (`--use-angle=d3d11`): amb el WebGL per programari, Aparadors BCN va a 1 fps i la gravació no funciona.

## Configuració (Netlify, variables d'entorn)

- `IG_TOKEN`: testimoni d'accés. Si és d'inici de sessió d'Instagram (comença per «IG», API d'Instagram amb inici de sessió d'Instagram,
  permisos `instagram_business_basic` i `instagram_business_content_publish`). La funció el renova sola cada 20 dies.
  Si se'n posa un de nou, la funció passa a fer servir el nou.
- `IG_USER_ID`: identificador del compte d'Instagram. Obligatori si el testimoni és de l'inici de sessió unificat o de Facebook (usuari del sistema, no caduca, graph.facebook.com).
- `IG_PROVA=1` (opcional): mode de prova, només escriu al registre què publicaria.

`perfil.jpg` és la foto de perfil del compte.
