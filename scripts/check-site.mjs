// node scripts/check-site.mjs   Checks the built site/ (run after `npm run build`): deploy files agree, every internal link resolves, each page has one h1 and a title.
import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'); const site = path.join(root, 'site');
const rd = p => fs.readFileSync(path.join(root, p), 'utf8'); let fails = 0; const bad = m => { fails++; console.log('FAIL', m); };
const j = p => JSON.parse(rd(p));
const v = j('vercel.json'), vi = j('site/vercel.json'), f = j('fluid.json');
if (!(v.framework === null && v.installCommand === '' && v.buildCommand === '' && v.outputDirectory === 'site' && v.cleanUrls === true && v.fluid === true)) bad('root vercel.json');
if (!(vi.framework === null && vi.outputDirectory === '.' && vi.cleanUrls === true && vi.fluid === true)) bad('site/vercel.json');
if (!(f.project === 'web-development' && f.static_dir === 'site' && JSON.stringify(f.routes) === JSON.stringify([{ pattern: '/', target: 'static' }]) && Object.keys(f).length === 3)) bad('fluid.json');
if (!/url=site\//.test(rd('index.html'))) bad('root index.html must redirect to site/');
if (!rd('.vercelignore').split('\n').filter(Boolean).every(l => l.startsWith('/'))) bad('.vercelignore entries must be anchored at the root');
const pages = []; (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith('.html')) pages.push(p); } })(site);
const exists = rel => { const clean = rel.split('#')[0].split('?')[0]; const p = path.join(site, clean); return fs.existsSync(p) && (fs.statSync(p).isFile() || fs.existsSync(path.join(p, 'index.html'))); };
let links = 0;
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8'), rel = path.relative(site, page);
  if ((html.match(/<h1[ >]/g) || []).length !== 1) bad(`${rel}: needs exactly one h1`);
  if (!/<title>[^<]{6,}<\/title>/.test(html)) bad(`${rel}: title`);
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#]*)(#[^"]*)?"/g)) { links++; if (m[1].startsWith('//')) continue; if (!exists(m[1])) bad(`${rel}: broken link ${m[1]}`); }
}
console.log(`${pages.length} pages, ${links} internal links checked`); console.log(fails ? `${fails} problem(s)` : 'ok'); process.exit(fails ? 1 : 0);
