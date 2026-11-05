// Diccionari castellà → català (la clau és el text castellà). Es genera a partir de scripts/i18n/*.py:
// edita-hi les parts i executa `python3 scripts/i18n/build.py` per regenerar lib/ca.json.
import ca from './ca.json';
export const CA = ca as Record<string, string>;
