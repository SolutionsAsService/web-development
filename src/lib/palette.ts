// One colour and one shape per category (21), not five region colours repeated. Colours are generated in LCH so lightness and chroma
// can be spaced as well as hue; scripts/validate.mjs checks every pair for separation and every colour for contrast, in both themes.
export interface Look { hue: number; shape: string }
// Foundations, build, interface, serve, run: each region is a contiguous arc of the wheel, every category its own step on it.
export const LOOKS: Record<string, Look> = {
  platform: { hue: 28, shape: 'square' },
  languages: { hue: 45, shape: 'diamond' },
  runtimes: { hue: 62, shape: 'hexagon' },
  packages: { hue: 79, shape: 'circle' },
  build: { hue: 97, shape: 'triangle' },
  testing: { hue: 114, shape: 'ring' },
  quality: { hue: 131, shape: 'pentagon' },
  ui: { hue: 148, shape: 'star' },
  meta: { hue: 165, shape: 'diamond' },
  css: { hue: 182, shape: 'rounded' },
  state: { hue: 199, shape: 'plus' },
  graphics: { hue: 217, shape: 'chevron' },
  a11y: { hue: 234, shape: 'triangle-down' },
  backend: { hue: 251, shape: 'hexagon' },
  apis: { hue: 268, shape: 'triangle' },
  data: { hue: 285, shape: 'square' },
  auth: { hue: 302, shape: 'pentagon' },
  cms: { hue: 319, shape: 'rounded' },
  hosting: { hue: 337, shape: 'circle' },
  devtools: { hue: 354, shape: 'plus' },
  cross: { hue: 11, shape: 'star' },
};
const lin = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
/** CIE LCH(ab) (D65) to sRGB hex, clamped. */
export function lchToHex(L: number, C: number, H: number): string {
  const a = C * Math.cos((H * Math.PI) / 180), b = C * Math.sin((H * Math.PI) / 180);
  const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - b / 200; const inv = (t: number) => (t ** 3 > 0.008856 ? t ** 3 : (t - 16 / 116) / 7.787);
  const X = 0.95047 * inv(fx), Y = inv(fy), Z = 1.08883 * inv(fz);
  const rgb = [3.2406 * X - 1.5372 * Y - 0.4986 * Z, -0.9689 * X + 1.8758 * Y + 0.0415 * Z, 0.0557 * X - 0.204 * Y + 1.057 * Z];
  return '#' + rgb.map(v => Math.round(Math.min(1, Math.max(0, lin(Math.max(0, v)))) * 255).toString(16).padStart(2, '0')).join('');
}
// [lightness, chroma] candidates. The picks below come from a hill-climbing search that maximised the smallest pairwise colour difference
// subject to a contrast floor on the card surface; `npm run validate` re-checks the result so any edit that breaks it fails loudly.
const CAND = {
  light: [[42, 58], [48, 64], [54, 66], [60, 60], [38, 50], [46, 40]],
  dark: [[64, 54], [72, 60], [80, 62], [88, 50], [58, 46], [76, 40]],
} as const;
const PICK: Record<'light' | 'dark', Record<string, number>> = {
  light: { platform: 0, languages: 1, runtimes: 0, packages: 5, build: 2, testing: 1, quality: 4, ui: 2, meta: 1, css: 2, state: 2, graphics: 2, a11y: 4, backend: 2, apis: 4, data: 1, auth: 1, cms: 1, hosting: 1, devtools: 5, cross: 1 },
  dark: { platform: 5, languages: 3, runtimes: 0, packages: 2, build: 0, testing: 3, quality: 0, ui: 3, meta: 0, css: 2, state: 0, graphics: 3, a11y: 4, backend: 2, apis: 0, data: 3, auth: 4, cms: 2, hosting: 4, devtools: 5, cross: 4 },
};
export function colorOf(cat: string, theme: 'light' | 'dark'): string {
  const look = LOOKS[cat]; if (!look) throw new Error(`no look for category ${cat}`);
  const [L, C] = CAND[theme][PICK[theme][cat]]; return lchToHex(L, C, look.hue);
}
/** A region's colour is the average hue of its categories, so each territory visibly belongs to the colours inside it. Darker and quieter than a category colour: it carries headings and borders, not data. */
export function regionColor(hues: number[], theme: 'light' | 'dark'): string {
  const x = hues.reduce((n, h) => n + Math.cos((h * Math.PI) / 180), 0), y = hues.reduce((n, h) => n + Math.sin((h * Math.PI) / 180), 0);
  const hue = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360; return lchToHex(theme === 'light' ? 38 : 80, 48, hue);
}
export const shapeOf = (cat: string) => LOOKS[cat]?.shape ?? 'circle';
export const surface = { light: '#fbf8f0', dark: '#161b26' };

// ---- helpers for checks
const toLin = (c: number) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const rgbOf = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
export const luminance = (hex: string) => { const [r, g, b] = rgbOf(hex).map(toLin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const contrast = (a: string, b: string) => { const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
export function lab(hex: string): number[] {
  const [r, g, b] = rgbOf(hex).map(toLin);
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const x = f((0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047), y = f(0.2126 * r + 0.7152 * g + 0.0722 * b), z = f((0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}
export const deltaE = (a: string, b: string) => { const [p, q] = [lab(a), lab(b)]; return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };

const R = (n: number) => Number(n.toFixed(2)); const arc = (r: number, s = 1) => `A${r} ${r} 0 1 ${s} `;
const poly = (n: number, r: number, rot = -Math.PI / 2) => `M${Array.from({ length: n }, (_, i) => { const a = rot + (i * 2 * Math.PI) / n; return `${R(Math.cos(a) * r)} ${R(Math.sin(a) * r)}`; }).join('L')}Z`;
/** SVG path (centred on 0,0, nominal radius r) for a shape name. */
export function shapePath(shape: string, r = 6): string {
  switch (shape) {
    case 'diamond': return `M0 ${-r * 1.25}L${r * 1.25} 0L0 ${r * 1.25}L${-r * 1.25} 0Z`;
    case 'square': return `M${-r * 0.9} ${-r * 0.9}h${r * 1.8}v${r * 1.8}h${-r * 1.8}Z`;
    case 'rounded': { const s = r * 0.95, k = r * 0.45, m = 2 * s - 2 * k; return `M${-s + k} ${-s}h${m}a${k} ${k} 0 0 1 ${k} ${k}v${m}a${k} ${k} 0 0 1 ${-k} ${k}h${-m}a${k} ${k} 0 0 1 ${-k} ${-k}v${-m}a${k} ${k} 0 0 1 ${k} ${-k}Z`; }
    case 'hexagon': return poly(6, r * 1.1, 0);
    case 'pentagon': return poly(5, r * 1.1);
    case 'triangle': return poly(3, r * 1.25);
    case 'triangle-down': return poly(3, r * 1.25, Math.PI / 2);
    case 'star': { const pts = Array.from({ length: 8 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 4, d = i % 2 ? r * 0.5 : r * 1.4; return `${R(Math.cos(a) * d)} ${R(Math.sin(a) * d)}`; }); return `M${pts.join('L')}Z`; }
    case 'chevron': return `M0 ${-r * 1.3}L${r * 1.05} ${r}L0 ${r * 0.45}L${-r * 1.05} ${r}Z`;
    case 'plus': { const a = r * 0.38, b = r * 1.1; return `M${-a} ${-b}L${a} ${-b}L${a} ${-a}L${b} ${-a}L${b} ${a}L${a} ${a}L${a} ${b}L${-a} ${b}L${-a} ${a}L${-b} ${a}L${-b} ${-a}L${-a} ${-a}Z`; }
    case 'ring': { const i = r * 0.52; return `M${r} 0${arc(r)}${-r} 0${arc(r)}${r} 0ZM${i} 0${arc(i, 0)}${-i} 0${arc(i, 0)}${i} 0Z`; }
    default: return `M${r} 0${arc(r)}${-r} 0${arc(r)}${r} 0Z`;
  }
}
