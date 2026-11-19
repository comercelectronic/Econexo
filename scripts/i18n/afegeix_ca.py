# Afegeix traduccions al diccionari lib/ca.json (castellà → català) sense tocar les que ja hi són.
# Ús: python3 scripts/i18n/afegeix_ca.py fitxer.json   (un objecte {"text en castellà": "text en català"})
#  o des de Python: from afegeix_ca import afegeix; afegeix({...})
import json, os, sys

CA = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../lib/ca.json')

def afegeix(nous):
    d = json.load(open(CA, encoding='utf-8'))
    n = 0
    for k, v in nous.items():
        if k not in d:
            d[k] = v; n += 1
    with open(CA, 'w', encoding='utf-8') as f:
        f.write('{\n' + ',\n'.join(json.dumps(k, ensure_ascii=False) + ': ' + json.dumps(v, ensure_ascii=False) for k, v in d.items()) + '\n}\n')
    return n

if __name__ == '__main__':
    print(afegeix(json.load(open(sys.argv[1], encoding='utf-8'))), 'traduccions noves')
