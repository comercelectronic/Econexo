# Comprova que tots els textos t('…') del codi tenen traducció al català (lib/ca.json)
import glob, json, os, re, sys
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
CA = json.load(open(os.path.join(root, 'lib', 'ca.json'), encoding='utf8'))
missing = set()
pat = re.compile(r"""\bt\(\s*(?:'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)")""")
for f in glob.glob(os.path.join(root, '{app,components,lib}/**/*.ts*'), recursive=True) + [p for d in ('app', 'components', 'lib') for p in glob.glob(os.path.join(root, d, '**', '*.ts*'), recursive=True)]:
    if f.endswith('ca.json'): continue
    for m in pat.finditer(open(f, encoding='utf8').read()):
        s = (m.group(1) if m.group(1) is not None else m.group(2)).replace("\\'", "'").replace('\\"', '"')
        if s not in CA and re.search(r'[a-záéíóúñ]{3}', s, re.I): missing.add((s, os.path.relpath(f, root)))
for s, f in sorted(missing): print(f, '|', json.dumps(s, ensure_ascii=False))
print(len(missing), 'textos sense traducció')
sys.exit(1 if missing else 0)
