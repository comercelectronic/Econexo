# Genera content-ca/ (articles i pàgines) a partir de content/ (castellà) i de les traduccions d'articulos_ca.py i paginas_ca.py
import os, re, runpy, yaml, json
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
A = runpy.run_path(os.path.join(os.path.dirname(__file__), 'articulos_ca.py'))['A']
P = runpy.run_path(os.path.join(os.path.dirname(__file__), 'paginas_ca.py'))['P']

def dump_fm(d, order):
    out = []
    for k in order:
        if k not in d: continue
        v = d[k]
        if k in ('fuentes', 'faq', 'dialogo'):
            out.append(k + ':')
            for it in v:
                if k == 'fuentes': out.append('  - ' + 'nombre: ' + json.dumps(it['nombre'], ensure_ascii=False) + ((', url: ' + json.dumps(it['url'])) if 'url' in it else ''))
                elif k == 'faq': out += ['  - p: ' + json.dumps(it['p'], ensure_ascii=False), '    r: ' + json.dumps(it['r'], ensure_ascii=False)]
                else: out.append('  - ' + json.dumps(it, ensure_ascii=False).replace('{"quien"', '{ "quien"').replace('"}', '" }'))
        elif k == 'ficha': out.append('ficha: ' + json.dumps(v, ensure_ascii=False))
        elif isinstance(v, (list, dict)): out.append(f'{k}: ' + json.dumps(v, ensure_ascii=False))
        elif isinstance(v, bool): out.append(f'{k}: ' + ('true' if v else 'false'))
        else: out.append(f'{k}: ' + (json.dumps(v, ensure_ascii=False) if isinstance(v, str) else str(v)))
    return '\n'.join(out)

n = 0
for key, tr in A.items():
    src = open(os.path.join(root, 'content', key + '.md'), encoding='utf8').read()
    _, fm, _body = src.split('---', 2)
    d = yaml.safe_load(fm)
    order = list(d.keys())
    for k, v in tr.items():
        if k == 'body': continue
        if k == 'fuentes': d[k] = [dict(o, nombre=s) for o, s in zip(d[k], v)]
        elif k == 'dialogo': d[k] = [dict(o, texto=s) for o, s in zip(d[k], v)]
        elif k == 'faq': d[k] = v
        else: d[k] = v
    for k in ('fuentes', 'dialogo'):
        if k in tr: assert len(tr[k]) == len(yaml.safe_load(fm)[k]), (key, k)
    if str(d.get('autor', '')).startswith('Redacci'): d['autor'] = 'Redacció ECOyNEXO'
    d['fecha'] = d['fecha'].isoformat() if hasattr(d['fecha'], 'isoformat') else d['fecha']
    # la data original ve amb zona horària: es conserva el text original
    m = re.search(r'^fecha: (.*)$', fm, re.M); fecha_txt = m.group(1)
    fm_out = dump_fm({**d, 'fecha': fecha_txt}, order).replace('fecha: "' + fecha_txt + '"', 'fecha: ' + fecha_txt)
    path = os.path.join(root, 'content-ca', key + '.md'); os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'w', encoding='utf8').write('---\n' + fm_out + '\n---\n' + tr['body'].strip() + '\n'); n += 1
for slug, (titulo, desc, act, body) in P.items():
    path = os.path.join(root, 'content-ca', 'paginas', slug + '.md'); os.makedirs(os.path.dirname(path), exist_ok=True)
    fm = ['---', f'titulo: {json.dumps(titulo, ensure_ascii=False)}', f'descripcion: {json.dumps(desc, ensure_ascii=False)}'] + ([f'actualizado: {json.dumps(act, ensure_ascii=False)}'] if act else []) + ['---']
    open(path, 'w', encoding='utf8').write('\n'.join(fm) + '\n' + body.strip() + '\n'); n += 1
print(n, 'fitxers')
