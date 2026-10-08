import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { readJSON, writeJSON } from './files.mjs';
import { fingerprint } from '../lib/publication.mjs';
import { renderPage } from '../lib/render.mjs';
import { weeklyMenu } from '../lib/recipes.ts';
const box = await readJSON('data/box.json');
if (!box) throw new Error('No published box. Run npm run refresh first.');
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
await cp('assets', 'dist/assets', { recursive: true });
await writeFile('dist/index.html', renderPage(box));
await writeFile('dist/.nojekyll', '');
const menu = weeklyMenu(box);
await writeJSON('dist/publication.json', { week: box.week, fingerprint: fingerprint(box),
  recipes: menu.recipes.map(r => ({ id: r.id, title: r.title, boxNames: r.boxNames })),
  coveredVegetables: menu.used, uncoveredVegetables: menu.uncovered, unconfirmed: menu.unconfirmed });
console.log(`Built ${menu.recipes.length} recipes for ${box.week}; ${menu.used.length} vegetable varieties covered.`);
