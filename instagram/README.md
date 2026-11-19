# Instagram d'ECOyNEXO

Publicació automàtica: cada dia a les 17:00 UTC (18:00 a Madrid a l'hivern), la funció programada
`netlify/functions/instagram-publica.mjs` mira si a `calendario.json` hi ha un post per a avui i el publica.

## Afegir posts

1. Afegeix el post a `calendario.json`: `id` (comença per la data), `fecha`, `tema` (`presentacion`, `concepto`, `caso`, `profes`, `test`),
   `slides` (1 a 10 diapositives) i `texto` (el peu del post: màxim 2.200 caràcters i 30 etiquetes).
   Tipus de diapositiva: `portada`, `texto`, `formula`, `dialogo`, `quiz`, `respuesta` i `cta`. Mira'n exemples al calendari.
   El text admet `**negreta**` (surt amb el color del tema).
2. Genera les imatges: `node scripts/instagram/genera.mjs [id]` (JPEG 1080×1350 a `public/ig/<id>/`).
   Avisa si el text arriba al peu o si el personatge el tapa.
3. Revisa-les: `python3 scripts/instagram/mostra.py mostra.jpg <id>`.
4. Proves: `node scripts/test-instagram.mjs`. Després, commit i push a `main`.

Un post que no s'ha pogut publicar es torna a provar l'endemà; si ja fa més d'un dia, se salta.

## Configuració (Netlify, variables d'entorn)

- `IG_TOKEN`: testimoni d'accés. Si és d'inici de sessió d'Instagram (comença per «IG», API d'Instagram amb inici de sessió d'Instagram,
  permisos `instagram_business_basic` i `instagram_business_content_publish`). La funció el renova sola cada 20 dies.
  Si se'n posa un de nou, la funció passa a fer servir el nou.
- `IG_USER_ID`: identificador del compte d'Instagram. Obligatori si el testimoni és de l'inici de sessió unificat o de Facebook (usuari del sistema, no caduca, graph.facebook.com).
- `IG_PROVA=1` (opcional): mode de prova, només escriu al registre què publicaria.

`perfil.jpg` és la foto de perfil del compte.
