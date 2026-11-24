import type { Category } from './types';
/** The map's territories. `region` groups categories into the five areas drawn on the atlas. */
export const REGIONS: { id: string; name: string; blurb: string }[] = [
  { id: 'foundation', name: 'Foundations', blurb: 'The platform the browser gives you, the languages you write, and the runtimes that execute them.' },
  { id: 'build', name: 'Build and ship', blurb: 'Package managers, bundlers, compilers, monorepos, quality gates and tests.' },
  { id: 'make', name: 'Make the interface', blurb: 'UI libraries, meta-frameworks, styling, state, motion and graphics.' },
  { id: 'serve', name: 'Serve and store', blurb: 'Backend frameworks, APIs, databases, auth, content and search.' },
  { id: 'run', name: 'Run and reach', blurb: 'Hosting, infrastructure, observability, developer tools and the other screens you can ship to.' },
];
export const CATEGORIES: Category[] = [
  { id: 'platform', region: 'foundation', name: 'Web platform', blurb: 'Standards and browser APIs. Everything else compiles down to these.' },
  { id: 'languages', region: 'foundation', name: 'Languages', blurb: 'What you write the web in, in the browser and on the server.' },
  { id: 'runtimes', region: 'foundation', name: 'Runtimes', blurb: 'Where JavaScript and TypeScript run outside the browser.' },
  { id: 'packages', region: 'build', name: 'Packages and monorepos', blurb: 'Installing dependencies, publishing them, and managing many packages in one repository.' },
  { id: 'build', region: 'build', name: 'Build tools', blurb: 'Bundlers, compilers and transpilers that turn source into what ships.' },
  { id: 'testing', region: 'build', name: 'Testing', blurb: 'Unit, component, end-to-end, mocking and visual testing.' },
  { id: 'quality', region: 'build', name: 'Quality', blurb: 'Linting, formatting, validation and the hooks that run them.' },
  { id: 'ui', region: 'make', name: 'UI libraries', blurb: 'The layer that turns state into DOM.' },
  { id: 'meta', region: 'make', name: 'Meta-frameworks and site generators', blurb: 'Routing, rendering modes and build pipelines wrapped around a UI library or templates.' },
  { id: 'css', region: 'make', name: 'CSS and components', blurb: 'Styling approaches, preprocessors and component kits.' },
  { id: 'state', region: 'make', name: 'State, data fetching and forms', blurb: 'Client state, server-state caches, routers, forms and tables.' },
  { id: 'graphics', region: 'make', name: 'Graphics and motion', blurb: 'Charts, canvas, WebGL, animation.' },
  { id: 'a11y', region: 'make', name: 'Accessibility, i18n and realtime', blurb: 'Checking access, translating, and keeping many clients in sync.' },
  { id: 'backend', region: 'serve', name: 'Backend frameworks', blurb: 'Servers and application frameworks, in JavaScript and beyond.' },
  { id: 'apis', region: 'serve', name: 'APIs', blurb: 'Styles, specifications and tools for talking between programs.' },
  { id: 'data', region: 'serve', name: 'Databases, ORMs and search', blurb: 'Where data lives and how code reaches it.' },
  { id: 'auth', region: 'serve', name: 'Authentication', blurb: 'Who is asking: libraries, standards and hosted services.' },
  { id: 'cms', region: 'serve', name: 'Content management', blurb: 'Where non-developers edit the content.' },
  { id: 'hosting', region: 'run', name: 'Hosting and infrastructure', blurb: 'Platforms, containers and web servers.' },
  { id: 'devtools', region: 'run', name: 'Developer tools and observability', blurb: 'Editors, browsers tools, version control, CI, performance and error tracking.' },
  { id: 'cross', region: 'run', name: 'Beyond the browser tab', blurb: 'Native apps, desktop shells and installable web apps.' },
];
