# Full de contactes d'un o més posts (per revisar-los d'un cop d'ull). Ús: python3 scripts/instagram/mostra.py <sortida.jpg> <id> [<id>...]
import sys, os
from PIL import Image
arrel = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../..')
out, ids = sys.argv[1], sys.argv[2:]
files = []
for i in ids:
    d = os.path.join(arrel, 'public/ig', i)
    files += [os.path.join(d, f) for f in sorted(os.listdir(d), key=lambda x: int(x.split('.')[0]))]
W, H, cols = 360, 450, 4
rows = (len(files) + cols - 1) // cols
full = Image.new('RGB', (cols * W + (cols + 1) * 10, rows * H + (rows + 1) * 10), (200, 205, 212))
for k, f in enumerate(files):
    im = Image.open(f).resize((W, H))
    full.paste(im, (10 + (k % cols) * (W + 10), 10 + (k // cols) * (H + 10)))
full.save(out, quality=85)
