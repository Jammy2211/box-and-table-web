import { fingerprint } from '../lib/publication.mjs';
import { readJSON, writeJSON } from './files.mjs';
const delivery = await readJSON('data/delivery.json', {});
delivery.deployed = fingerprint(await readJSON('data/box.json'));
await writeJSON('data/delivery.json', delivery);
