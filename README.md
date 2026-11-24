# Web Development Atlas

A map of the tools of web development: the platform, languages and runtimes (Node.js, Deno, Bun), build tools, testing (Jest, Vitest, Playwright), UI libraries and meta-frameworks (React, Vue, Svelte, htmx, Next.js, Astro), styling, state, backend frameworks, APIs, databases, auth, CMS, hosting, developer tools and the other screens you can ship to.

- **282 tools in 21 territories**, drawn as one map: each dot is a tool.
- Every tool has a page: what it is, its official site, its **alternatives**, what it **builds on or pairs with**, what is built on it, and the starting stacks it appears in.
- **Explore** searches and filters; **Graph** draws the relations as a network; **Stacks** are editorial starting points.

## What it does not claim
No rankings, popularity figures or version numbers: they change faster than a hand-kept atlas can follow. Descriptions are plain statements written from general knowledge; the official site is the authority. Relations and stacks are editorial judgements. The validator refuses descriptions with numeric or superlative claims.

## Develop
```sh
npm install
npm run dev        # http://localhost:4321
npm run validate   # ids unique, relations resolve, descriptions plain, every category populated
npm run links      # asks every tool's site whether it still answers (needs the network)
npm run build      # validate, type-check, build to dist/
```
Add a tool as one line in `src/data/tools-*.ts`, then its relations in `src/data/relations.ts`.

## Stack
Astro (static pages generated from typed data files) with two small Preact islands (search, graph). Every other page ships no JavaScript. Deployed to GitHub Pages by `.github/workflows/pages.yml`, which sets `BASE_PATH`.

Made by SolutionsAsService.
