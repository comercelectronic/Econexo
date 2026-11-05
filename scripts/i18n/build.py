# Uneix les parts del diccionari castellà→català (p*.py) en lib/ca.json
import glob, json, runpy, os
root = os.path.dirname(os.path.abspath(__file__))
D = {}
for p in sorted(glob.glob(os.path.join(root, 'p[0-9].py'))): D.update(runpy.run_path(p)['D'])
json.dump(D, open(os.path.join(root, '..', '..', 'lib', 'ca.json'), 'w'), ensure_ascii=False, indent=0, sort_keys=True)
print(len(D), 'claus')
