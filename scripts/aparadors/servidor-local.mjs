// Servidor estático mínimo para probar los juegos de /public en local: node scripts/aparadors/servidor-local.mjs [puerto]
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname, join, normalize} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..', 'public');
const port = Number(process.argv[2] || 8765);
const types = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.glb': 'model/gltf-binary', '.webp': 'image/webp',
  '.png': 'image/png', '.json': 'application/json', '.css': 'text/css', '.svg': 'image/svg+xml'};

http.createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([\\/])+/, '');
  if (path.includes('..')) { res.writeHead(403); return res.end() }
  if (!extname(path)) path = join(path, 'index.html');
  try {
    const body = await readFile(join(root, path));
    res.writeHead(200, {'content-type': types[extname(path)] || 'application/octet-stream', 'cache-control': 'no-store'});
    res.end(body);
  } catch { res.writeHead(404); res.end('no encontrado') }
}).listen(port, () => console.log(`Sirviendo ${root} en http://localhost:${port}`));
