export interface Category { id: string; name: string; region: string; blurb: string }
export interface Tool { id: string; name: string; cat: string; url: string; what: string }
export interface Stack { id: string; name: string; for: string; picks: [string, string][] }
