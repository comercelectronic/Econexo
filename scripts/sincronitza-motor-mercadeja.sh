#!/usr/bin/env bash
# Copia el motor de Mercadeja a la funció del servidor (projecte agenciadigital, a Netlify), que el fa servir
# per tornar a jugar i verificar els resultats dels reptes. Cal executar-lo cada vegada que canvia el motor,
# les dades o les lliçons; si no, el servidor podria calcular resultats diferents dels del joc.
# Ús: scripts/sincronitza-motor-mercadeja.sh [carpeta d'agenciadigital]
set -euo pipefail
ORIGEN="$(cd "$(dirname "$0")/.." && pwd)/public/jocs/mercadeja/js"
DESTI="${1:-$(cd "$(dirname "$0")/../.." && pwd)/agenciadigital}/netlify/mercadeja-motor"
mkdir -p "$DESTI"
for f in data.js engine.js llicons.js; do cp "$ORIGEN/$f" "$DESTI/$f"; done
echo "Motor de Mercadeja copiat a $DESTI"
