import { parseBox, SOURCE_URL, monitorDue } from '../lib/box.ts';
import { chooseBox, needsDeployment } from '../lib/publication.mjs';
import { readJSON, writeJSON, output, summary } from './files.mjs';

const event = process.env.GITHUB_EVENT_NAME || 'workflow_dispatch';
const now = new Date();
if (event === 'schedule' && !monitorDue(now)) {
  await output('eligible', false);
  await summary('Outside the London checking window; nothing changed.');
} else {
  const previous = await readJSON('data/box.json');
  let box = previous;
  if (event !== 'push' || !previous) {
    const response = await fetch(SOURCE_URL, {
      redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(20000),
      headers: { 'User-Agent': 'BoxAndTable/1.0 weekly vegetable box checker', Accept: 'text/html' },
    });
    if (!response.ok) throw new Error(`NEOG returned HTTP ${response.status}; the existing site is unchanged.`);
    const html = await response.text();
    if (html.length > 1_000_000) throw new Error('Unexpected source size; keeping the existing site.');
    const result = chooseBox(previous, parseBox(html, now));
    box = result.box;
    if (result.changed) await writeJSON('data/box.json', box);
    await summary(result.changed ? `New box data saved for ${box.week}.` : `No change to the ${box.week} box.`);
  }
  const delivery = await readJSON('data/delivery.json', {});
  await output('eligible', true);
  await output('deploy', needsDeployment(box, delivery, event));
}
