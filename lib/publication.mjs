import { createHash } from 'node:crypto';
import { expectedWeek } from './box.ts';
import { suggestions } from './recipes.ts';

export function boxFingerprint(box) {
  const produce = rows => rows.map(({ name, original, origin, alternatives }) => ({ name, original, origin, alternatives }));
  return createHash('sha256').update(JSON.stringify({ week: box.week,
    vegetables: produce(box.vegetables), fruit: produce(box.fruit) })).digest('hex');
}
export function fingerprint(box) {
  // A changed menu must be deployed and verified even when the box is unchanged.
  return createHash('sha256').update(JSON.stringify({ box: boxFingerprint(box), recipes: suggestions(box) })).digest('hex');
}
export function chooseBox(previous, candidate) {
  if (previous && candidate.week < previous.week) throw new Error('NEOG returned an older week; keeping the published box.');
  const changed = !previous || boxFingerprint(previous) !== boxFingerprint(candidate);
  return { box: changed ? candidate : previous, changed };
}
export function needsNotification(box, delivery, now = new Date()) {
  const hash = fingerprint(box);
  return box.week >= expectedWeek(now) && delivery.deployed === hash && delivery.notified !== hash;
}
export function needsDeployment(box, delivery, event) {
  return event !== 'schedule' || delivery.deployed !== fingerprint(box);
}
