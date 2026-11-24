// node scripts/validate.mjs [--links]   Integrity checks for the atlas data. --links also asks every site whether it still answers (needs the network).
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { execFile } from 'node:child_process';
// curl, not fetch: it honours the HTTPS proxy settings the environment may require.
const status = u => new Promise((res, rej) => execFile('curl', ['-s', '-o', '/dev/null', '-L', '-m', '25', '-A', 'Mozilla/5.0 atlas-link-check', '-w', '%{http_code}', u], (e, out) => (e && !out ? rej(e) : res(Number(out)))));
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const load = async f => import(pathToFileURL(path.join(root, 'src/data', f)).href);
const tsx = process.argv.includes('--links');
let fails = 0; const bad = m => { fails++; console.log('FAIL', m); };
const { CATEGORIES, REGIONS } = await load('categories.ts'); const { TOOLS_A } = await load('tools-a.ts'); const { TOOLS_B } = await load('tools-b.ts'); const { TOOLS_C } = await load('tools-c.ts');
const { ALT, PAIRS, STACKS } = await load('relations.ts');
const tools = [...TOOLS_A, ...TOOLS_B, ...TOOLS_C]; const ids = new Set(); const cats = new Set(CATEGORIES.map(c => c.id)); const regs = new Set(REGIONS.map(r => r.id));
for (const c of CATEGORIES) if (!regs.has(c.region)) bad(`category ${c.id}: unknown region ${c.region}`);
for (const t of tools) {
  if (ids.has(t.id)) bad(`duplicate id ${t.id}`); ids.add(t.id);
  if (!/^[a-z0-9-]+$/.test(t.id)) bad(`${t.id}: id must be lowercase letters, digits and hyphens`);
  if (!cats.has(t.cat)) bad(`${t.id}: unknown category ${t.cat}`);
  if (!/^https:\/\/[^\s]+$/.test(t.url)) bad(`${t.id}: url must be https`);
  if (t.what.length < 25 || t.what.length > 160) bad(`${t.id}: description length ${t.what.length}`);
  if (!/[.]$/.test(t.what)) bad(`${t.id}: description should end with a full stop`);
  if (/\b\d+(\.\d+)+\b|\b(million|billion)s?\b|\b#1\b|fastest|best\b|most popular/i.test(t.what)) bad(`${t.id}: description makes a version, number or superlative claim`);
}
for (const c of CATEGORIES) if (!tools.some(t => t.cat === c.id)) bad(`category ${c.id} has no tools`);
for (const g of ALT) { if (g.length < 2) bad(`alt group too small: ${g}`); for (const i of g) if (!ids.has(i)) bad(`ALT: unknown tool ${i}`); }
for (const [a, b] of PAIRS) { if (!ids.has(a)) bad(`PAIRS: unknown tool ${a}`); if (!ids.has(b)) bad(`PAIRS: unknown tool ${b}`); if (a === b) bad(`PAIRS: self edge ${a}`); }
for (const s of STACKS) for (const [, id] of s.picks) if (!ids.has(id)) bad(`stack ${s.id}: unknown tool ${id}`);
const touched = new Set([...ALT.flat(), ...PAIRS.flat()]); const orphans = tools.filter(t => !touched.has(t.id)).map(t => t.id);
console.log(`${tools.length} tools, ${CATEGORIES.length} categories, ${ALT.length} alternative groups, ${PAIRS.length} pairings, ${STACKS.length} stacks; ${orphans.length} tools with no relation${orphans.length ? ': ' + orphans.join(' ') : ''}`);
if (tsx) {
  const queue = tools.filter(t => !/^https:\/\/github\.com\//.test(t.url)); // github.com answers 400 through the session proxy; its links are checked by hand let n = 0;
  await Promise.all(Array.from({ length: 12 }, async () => { while (queue.length) { const t = queue.shift();
    try { const code = await status(t.url); n++; if (code >= 400 && code !== 403 && code !== 429 && code !== 999) bad(`${t.id}: ${t.url} answered ${code}`); else if (code === 403 || code === 429 || code === 999) console.log(`note ${t.id}: ${code} (site refuses automated checks)`); }
    catch (e) { bad(`${t.id}: ${t.url} ${e.message.split('\n')[0]}`); } } }));
  console.log(`checked ${n} sites`);
}
console.log(fails ? `${fails} problem(s)` : 'ok'); process.exit(fails ? 1 : 0);
