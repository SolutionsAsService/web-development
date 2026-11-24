import { useEffect, useRef, useState } from 'preact/hooks';
import { forceSimulation, forceLink, forceManyBody, forceX, forceY, forceCollide } from 'd3-force';
type D = { tools: { id: string; name: string; cat: string; what: string; region: string }[]; regions: { id: string; name: string }[]; edges: { s: string; t: string; k: string }[]; base: string };
const COLOR: Record<string, string> = { foundation: 'var(--r-foundation)', build: 'var(--r-build)', make: 'var(--r-make)', serve: 'var(--r-serve)', run: 'var(--r-run)' };
const W = 1000, H = 720;
export default function Graph({ data }: { data: D }) {
  const [nodes, setNodes] = useState<any[]>([]); const [links, setLinks] = useState<any[]>([]);
  const [sel, setSel] = useState<string | null>(null); const [alts, setAlts] = useState(true); const [, force] = useState(0);
  const sim = useRef<any>(null);
  useEffect(() => {
    const ns = data.tools.map(t => ({ ...t })); const by = Object.fromEntries(ns.map(n => [n.id, n]));
    const ls = data.edges.map(e => ({ source: by[e.s], target: by[e.t], k: e.k }));
    const s = forceSimulation(ns as any).force('link', forceLink(ls as any).distance((l: any) => (l.k === 'alt' ? 30 : 50)).strength(0.25)).force('charge', forceManyBody().strength(-70).distanceMax(320)).force('x', forceX(W / 2).strength(0.05)).force('y', forceY(H / 2).strength(0.09)).force('collide', forceCollide(10))
      .alphaDecay(0.03).on('tick', () => force(n => n + 1));
    sim.current = s; setNodes(ns); setLinks(ls);
    return () => { s.stop(); };
  }, [data]);
  const near = new Set<string>(); if (sel) { near.add(sel); for (const l of links) { if (l.source.id === sel) near.add(l.target.id); if (l.target.id === sel) near.add(l.source.id); } }
  const cur = sel ? data.tools.find(t => t.id === sel) : null;
  const clamp = (v: number, m: number) => Math.max(10, Math.min(m - 10, v || 0));
  return (
    <div>
      <div class="legend" style="margin:8px 0">{data.regions.map(r => <span><i style={`--c:${COLOR[r.id]}`}></i>{r.name}</span>)}
        <label><input type="checkbox" checked={alts} onChange={e => setAlts((e.target as HTMLInputElement).checked)} /> show alternatives (dashed)</label></div>
      <div class="graphbox"><svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Network of web development tools">
        {links.filter(l => alts || l.k !== 'alt').map((l, i) => { const on = !sel || (near.has(l.source.id) && near.has(l.target.id));
          return <line key={i} x1={clamp(l.source.x, W)} y1={clamp(l.source.y, H)} x2={clamp(l.target.x, W)} y2={clamp(l.target.y, H)} stroke="var(--dim)" stroke-width={on && sel ? 1.6 : 0.7} stroke-dasharray={l.k === 'alt' ? '3 3' : undefined} opacity={sel ? (on ? 0.9 : 0.06) : l.k === 'alt' ? 0.25 : 0.4} />; })}
        {nodes.map(n => { const on = !sel || near.has(n.id);
          return <g key={n.id} transform={`translate(${clamp(n.x, W)},${clamp(n.y, H)})`} opacity={on ? 1 : 0.15} style="cursor:pointer" role="button" tabIndex={0} aria-label={n.name}
            onClick={() => setSel(sel === n.id ? null : n.id)} onKeyDown={(e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(sel === n.id ? null : n.id); } }}>
            <circle r={sel === n.id ? 9 : 6} fill={COLOR[n.region]} stroke="var(--card)" stroke-width="2" />
            {(on && sel) && <text y={-11} text-anchor="middle" font-size="11" fill="var(--ink)" stroke="var(--card)" stroke-width="3" paint-order="stroke">{n.name}</text>}
          </g>; })}
      </svg></div>
      <div class="note" style="margin-top:12px" aria-live="polite">{cur ? <span><b>{cur.name}</b>: {cur.what} <a href={`${data.base}/tools/${cur.id}`}>Open page</a></span> : 'Select a dot to highlight what it connects to.'}</div>
    </div>
  );
}
