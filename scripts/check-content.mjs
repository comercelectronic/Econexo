// Revisió dels continguts abans de publicar: camps obligatoris, valors vàlids i avisos editorials.
// Ús: npm run check
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = 'content';
const TIPOS = ['noticia', 'guia', 'financiero', 'caso', 'analisis', 'opinion'];
const ESTADOS = ['borrador', 'revision', 'aprobada', 'programada', 'publicada', 'archivada'];
const site = fs.readFileSync('lib/site.ts', 'utf8');
let errors = 0, warnings = 0;
const err = (f, m) => { errors++; console.log(`✘ ${f}: ${m}`); };
const warn = (f, m) => { warnings++; console.log(`· ${f}: ${m}`); };

for (const sec of fs.readdirSync(ROOT)) {
  const dir = path.join(ROOT, sec);
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const f = `${sec}/${file}`, slug = file.replace(/\.md$/, '');
    const { data, content } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (content.includes('[PENDIENTE')) warn(f, 'tiene datos [PENDIENTE] por completar');
    if (sec === 'paginas') continue;
    if (sec === 'videos') {
      if (!data.titulo || !data.serie || !data.concepto) err(f, 'faltan título, serie o concepto');
      if (!ESTADOS.includes(data.estado)) err(f, `estado no válido: ${data.estado}`);
      if (!data.fecha || Number.isNaN(Date.parse(data.fecha))) err(f, 'falta una fecha válida');
      if (data.guia && !fs.existsSync(path.join(ROOT, data.guia.split('/')[1] || '', (data.guia.split('/')[2] || '') + '.md'))) err(f, `la guía relacionada no existe: ${data.guia}`);
      if (!data.youtube) warn(f, 'sin vídeo de YouTube todavía (se muestra «Próximamente»)');
      if (data.estado !== 'publicada') warn(f, `estado «${data.estado}»: no se publicará`);
      continue;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) err(f, 'el nombre del archivo debe ir en minúsculas, sin acentos ni espacios');
    if (!data.titulo) err(f, 'falta el titular');
    if (!data.fecha || Number.isNaN(Date.parse(data.fecha))) err(f, 'falta una fecha válida');
    if (!TIPOS.includes(data.tipo)) err(f, `tipo no válido: ${data.tipo}`);
    if (!ESTADOS.includes(data.estado)) err(f, `estado no válido: ${data.estado}`);
    if (site.includes(`['${slug}',`)) err(f, 'el slug coincide con una subsección: cámbialo');
    if (data.subseccion && !site.includes(`['${data.subseccion}',`)) err(f, `subsección desconocida: ${data.subseccion}`);
    if (!data.fuentes || !data.fuentes.length) warn(f, 'no tiene fuentes');
    else if (data.fuentes.some((x) => !x.url)) warn(f, 'hay fuentes sin enlace');
    if ((data.descripcion || data.subtitulo || '').length > 200) warn(f, 'la descripción SEO supera 200 caracteres');
    if (data.estado !== 'publicada') warn(f, `estado «${data.estado}»: no se publicará`);
  }
}
console.log(`\n${errors} errores, ${warnings} avisos`);
process.exit(errors ? 1 : 0);
