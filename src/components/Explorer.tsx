import { useMemo, useState } from 'preact/hooks';
type D = { tools: { id: string; name: string; cat: string; what: string; region: string }[]; cats: { id: string; name: string; region: string }[]; regions: { id: string; name: string }[]; base: string };
export default function Explorer({ data }: { data: D }) {
  const [q, setQ] = useState(''); const [region, setRegion] = useState(''); const [cat, setCat] = useState('');
  const catName = useMemo(() => Object.fromEntries(data.cats.map(c => [c.id, c.name])), [data]);
  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    return data.tools.filter(t => (!region || t.region === region) && (!cat || t.cat === cat) && (!s || t.name.toLowerCase().includes(s) || t.what.toLowerCase().includes(s) || catName[t.cat].toLowerCase().includes(s)))
      .sort((a, b) => Number(b.name.toLowerCase().startsWith(s)) - Number(a.name.toLowerCase().startsWith(s)) || a.name.localeCompare(b.name));
  }, [q, region, cat, data]);
  const cats = data.cats.filter(c => !region || c.region === region);
  return (
    <div>
      <label class="sr" for="q">Search tools</label>
      <input id="q" type="search" placeholder="Search tools: bundler, testing, htmx, Rust…" value={q} onInput={e => setQ((e.target as HTMLInputElement).value)} />
      <div class="chips" role="group" aria-label="Territory">
        <button class="chip" aria-pressed={region === ''} onClick={() => { setRegion(''); setCat(''); }}>All</button>
        {data.regions.map(r => <button class="chip" aria-pressed={region === r.id} onClick={() => { setRegion(r.id); setCat(''); }}>{r.name}</button>)}
      </div>
      <div class="chips" role="group" aria-label="Category">
        {cats.map(c => <button class="chip" aria-pressed={cat === c.id} onClick={() => setCat(cat === c.id ? '' : c.id)}>{c.name}</button>)}
      </div>
      <p aria-live="polite" style="color:var(--dim)">{hits.length} of {data.tools.length} tools</p>
      <ul class="cards">{hits.map(t => <li data-cat={t.cat}><a class="card" href={`${data.base}/tools/${t.id}/`}><b>{t.name}</b><span>{t.what}</span><em>{catName[t.cat]}</em></a></li>)}</ul>
      {hits.length === 0 && <p class="note">Nothing matches. Try fewer words, or clear the filters.</p>}
    </div>
  );
}
