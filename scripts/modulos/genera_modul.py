# Genera les lliçons (content/ i content-ca/) i el temari (data/) d'un mòdul a partir de les dades de scripts/modulos.
# Ús: python3 scripts/modulos/genera_modul.py marketing   (llegeix <nom>_temari.py i <nom>_1.py, <nom>_2.py…)
#
# Cada lliçó: dict(slug, id, orden, codigos, fase, es=dict(...), ca=dict(...)) amb
#   titulo, objetivo, tira [[(quien, gesto, text), …], …], cos (HTML curt, paràgrafs separats per \n\n),
#   ejemplo, errores [..], test [(pregunta, [4 opcions], correcta, per què), …]
# El temari: MODUL (slug), BLOCS {es: {'1': nom…}, ca: {...}}, TEMARI {es: [[codi, text]…], ca: [...]},
#   AHORA {es: {codi: text}, ca: {...}}, FASES {es: {n: nom}, ca: {n: nom}} (nom de cada fase o capítol del simulador)
import glob, importlib.util, json, os, sys

ARREL = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../..')
nom = sys.argv[1]
def carrega(f):
    sp = importlib.util.spec_from_file_location(os.path.basename(f)[:-3], f); m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m); return m
dir_ = os.path.dirname(os.path.abspath(__file__))
T = carrega(os.path.join(dir_, nom + '_temari.py'))
L = []
for f in sorted(glob.glob(os.path.join(dir_, nom + '_[0-9]*.py'))): L += carrega(f).L
L.sort(key=lambda x: x['orden'])

codis = {c for c, _ in T.TEMARI['es']}
errors = []
ids = set()
for x in L:
    if x['id'] in ids: errors.append('id repetit ' + x['id'])
    ids.add(x['id'])
    for c in x['codigos']:
        if c not in codis: errors.append(f"{x['slug']}: codi {c} no és al temari")
    for lg in ('es', 'ca'):
        d = x[lg]
        for q in d['test']:
            if len(q[1]) != 4 or not (0 <= q[2] < 4): errors.append(f"{x['slug']} {lg}: pregunta mal formada: {q[0]}")
        if len(d['test']) != len(x['es']['test']): errors.append(f"{x['slug']}: nombre de preguntes diferent es/ca")
falten = sorted(codis - {c for x in L for c in x['codigos']}, key=lambda c: [int(p) for p in c.split('.')])
if falten: errors.append('Punts del temari sense lliçó: ' + ', '.join(falten))
if errors: print('\n'.join('✘ ' + e for e in errors)); sys.exit(1)

j = lambda v: json.dumps(v, ensure_ascii=False)
for lg, carpeta in (('es', 'content'), ('ca', 'content-ca')):
    out = os.path.join(ARREL, carpeta, 'modulos', T.MODUL); os.makedirs(out, exist_ok=True)
    for f in glob.glob(os.path.join(out, '*.md')): os.remove(f)
    for x in L:
        d = x[lg]; bloc = x['codigos'][0].split('.')[0] if x['codigos'] else None
        fm = ['---', f"id: {x['id']}", f"titulo: {j(d['titulo'])}", f"objetivo: {j(d['objetivo'])}", f"orden: {x['orden']}", f"codigos: {j(x['codigos'])}",
              f"area: {j(T.BLOCS[lg][bloc] if bloc else '')}", f"capitulo: {j(str(x['fase']))}", f"capitulo_titulo: {j(T.FASES[lg][x['fase']])}", 'estado: publicada', 'tira:']
        for panel in d['tira']: fm.append('  - ' + j([{'quien': q, 'gesto': g, 'texto': t} for q, g, t in panel]))
        fm += [f"ejemplo: {j(d['ejemplo'])}", f"errores: {j(d['errores'])}", 'test:']
        for p, o, c, por in d['test']: fm.append('  - ' + j({'p': p, 'o': o, 'c': c, 'por': por}))
        fm.append('---')
        open(os.path.join(out, x['slug'] + '.md'), 'w', encoding='utf-8').write('\n'.join(fm) + '\n' + d['cos'].strip() + '\n')
    tm = {'bloques': T.BLOCS[lg], 'temario': T.TEMARI[lg], 'ahora': T.AHORA[lg]}
    json.dump(tm, open(os.path.join(ARREL, 'data', T.MODUL + ('.ca' if lg == 'ca' else '') + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'✔ {T.MODUL}: {len(L)} lliçons en castellà i català, temari de {len(codis)} punts')
