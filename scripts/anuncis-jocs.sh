#!/bin/sh
# Afegeix el codi d'anuncis automàtics de Google AdSense a tots els jocs de public/jocs.
# Es pot executar tantes vegades com calgui (no el duplica). Cal tornar-lo a executar
# després de copiar una versió nova d'un joc (per exemple, Agència Digital).
cd "$(dirname "$0")/../public/jocs" || exit 1
TAG='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6602866907047778" crossorigin="anonymous"></script>'
for f in */index.html; do
  grep -q 'adsbygoogle.js' "$f" && continue
  awk -v t="$TAG" '!fet && /<\/head>/ { print t; fet = 1 } { print }' "$f" > "$f.tmp" && mv "$f.tmp" "$f" && echo "anuncis: $f"
done
