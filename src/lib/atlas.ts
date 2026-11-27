import { CATEGORIES, REGIONS } from '../data/categories';
import { TOOLS_A } from '../data/tools-a';
import { TOOLS_B } from '../data/tools-b';
import { TOOLS_C } from '../data/tools-c';
import { ALT, PAIRS, STACKS } from '../data/relations';
import type { Tool } from '../data/types';
import { shapeOf, shapePath } from './palette';

export const TOOLS: Tool[] = [...TOOLS_A, ...TOOLS_B, ...TOOLS_C];
export const BY_ID = Object.fromEntries(TOOLS.map(t => [t.id, t])) as Record<string, Tool>;
export const CAT_BY_ID = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
export { CATEGORIES, REGIONS, STACKS, PAIRS, ALT };
export { shapeOf, shapePath, colorOf } from './palette';
import { LOOKS, regionColor } from './palette';
export const regionCss = REGIONS.map(r => { const hues = CATEGORIES.filter(c => c.region === r.id).map(c => LOOKS[c.id].hue); return `[data-region="${r.id}"]{--cl:${regionColor(hues, 'light')};--cd:${regionColor(hues, 'dark')}}`; }).join('');

const uniq = <T,>(a: T[]) => [...new Set(a)];
export const alternativesOf = (id: string) => uniq(ALT.filter(g => g.includes(id)).flat().filter(x => x !== id));
export const buildsOn = (id: string) => uniq(PAIRS.filter(([a]) => a === id).map(([, b]) => b));
export const usedBy = (id: string) => uniq(PAIRS.filter(([, b]) => b === id).map(([a]) => a));
export const stacksWith = (id: string) => STACKS.filter(s => s.picks.some(([, t]) => t === id));
export const regionOf = (cat: string) => CAT_BY_ID[cat].region;
export const toolsIn = (cat: string) => TOOLS.filter(t => t.cat === cat);
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
/** Directory-style URLs (`/tools/htmx/`) work on every static host, with or without clean-URL rewriting. */
export const href = (p = '') => `${base}/${p}${p && !p.endsWith('/') && !p.includes('#') ? '/' : ''}`;
/** Plain data the browser islands need. */
export const clientData = () => ({
  tools: TOOLS.map(t => ({ id: t.id, name: t.name, cat: t.cat, what: t.what, region: regionOf(t.cat) })),
  cats: CATEGORIES.map(c => ({ id: c.id, name: c.name, region: c.region, path: shapePath(shapeOf(c.id), 6) })),
  regions: REGIONS,
  edges: [
    ...PAIRS.map(([s, t]) => ({ s, t, k: 'pair' })),
    ...ALT.flatMap(g => g.flatMap((a, i) => g.slice(i + 1).map(b => ({ s: a, t: b, k: 'alt' })))),
  ],
  base,
});
