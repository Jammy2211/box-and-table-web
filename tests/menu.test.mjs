import test from 'node:test';
import assert from 'node:assert/strict';
import { collection, weeklyMenu, candidates, validateMenu } from '../lib/recipes.ts';
import { normalise } from '../lib/box.ts';
import { fingerprint, boxFingerprint, needsDeployment } from '../lib/publication.mjs';
import { renderPage } from '../lib/render.mjs';

// A fixed regression fixture for the vegetables the old menu ignored.
const makeBox = (names, week = '2026-10-07') => ({ week, fetchedAt: '2026-10-08T10:00:00Z', source: 'neog', fruit: [],
  vegetables: names.map(name => ({ name: normalise(name), original: name, origin: 'UK', quantity: null, alternatives: [] })) });
const autumn = makeBox(['potatoes', 'carrots', 'onions', 'chard', 'swede', 'cavolo nero', 'cauliflower', 'broccoli']);

test('the autumn menu covers all eight actual vegetables with four vegetarian meals and one chicken meal', () => {
  const menu = weeklyMenu(autumn);
  assert.equal(collection.length, 18);
  assert.equal(menu.recipes.length, 5);
  assert.equal(menu.recipes.filter(r => r.vegetarian).length, 4);
  assert.deepEqual(new Set(menu.used), new Set(autumn.vegetables.map(p => p.name)));
  assert.deepEqual(menu.uncovered, []);
  for (const name of ['swede', 'cavolo nero', 'cauliflower']) assert.ok(menu.recipes.some(r => r.mainVegetables.includes(name)));
  for (const recipe of menu.recipes) {
    assert.equal(recipe.week, autumn.week);
    assert.ok(recipe.ingredients.every(i => !['cucumber', 'leek', 'kale'].includes(i.name)));
    assert.ok(recipe.mainVegetables.every(n => recipe.boxNames.includes(n)));
  }
});
test('seasonal boxes produce eligible menus without inventing primary vegetables or compulsory onions', () => {
  const boxes = [
    ['courgette','aubergine','pepper','tomato','cucumber','carrot','chard'],
    ['leek','potato','kale','carrot','cabbage','parsnip'],
    ['asparagus','peas','spinach','radish','carrot','broccoli'],
    ['mushroom','cavolo nero','sweet potato','cauliflower','onion'],
  ];
  for (const names of boxes) {
    const box = makeBox(names);
    const menu = weeklyMenu(box);
    assert.equal(menu.recipes.length, 5, names.join(', '));
    const confirmed = new Set(box.vegetables.map(p => p.name));
    for (const recipe of candidates(box)) {
      validateMenu(box, [recipe]);
      assert.ok(recipe.mainVegetables.every(n => confirmed.has(n)));
      assert.ok(recipe.steps.length >= 4);
      assert.doesNotMatch(JSON.stringify(recipe), /undefined|NaN/);
      if (!confirmed.has('onion')) assert.ok(!recipe.ingredients.some(i => i.name === 'onion'));
    }
    const html = renderPage(box, new Date('2026-10-08'));
    for (const recipe of menu.recipes) assert.ok(html.includes(recipe.id));
  }
});
test('menus rotate with the publication week and are stable on repeated checks within that week', () => {
  const original = weeklyMenu(autumn).recipes;
  assert.deepEqual(weeklyMenu({ ...autumn, fetchedAt: '2026-10-08T23:00:00Z' }).recipes, original);
  assert.deepEqual(weeklyMenu({ ...autumn, vegetables: [...autumn.vegetables].reverse() }).recipes, original);
  const next = weeklyMenu({ ...autumn, week: '2026-10-14' }).recipes;
  assert.notDeepEqual(next.map(r => r.id).sort(), original.map(r => r.id).sort());
  assert.ok(next.every(r => r.week === '2026-10-14'));
});
test('uncertain, absent and unknown produce is not silently replaced with other vegetables', () => {
  const box = makeBox(['other', 'carrot', 'onion']);
  box.vegetables[1].quantity = 0;
  box.vegetables.push({ name: 'aubergine/cucumber', original: 'aubergine/cucumber', origin: 'UK', quantity: null, alternatives: ['aubergine','cucumber'] });
  const menu = weeklyMenu(box);
  assert.equal(menu.recipes.length, 0);
  assert.deepEqual(menu.unconfirmed, ['aubergine/cucumber']);
  assert.deepEqual(menu.uncovered, ['other','onion']);
  const html = renderPage(box, new Date('2026-10-08'));
  assert.match(html, /Fewer than five recipes fit/);
  assert.match(html, /Not covered this week/);
  assert.doesNotMatch(html, /<article class="recipe"/);
});
test('validation rejects a mismatched week or vegetables missing from the box', () => {
  const recipe = structuredClone(weeklyMenu(autumn).recipes[0]);
  assert.throws(() => validateMenu(autumn, [{ ...recipe, week: '2026-09-30' }]), /does not match/);
  assert.throws(() => validateMenu(autumn, [{ ...recipe, mainVegetables: ['cucumber'] }]), /does not match/);
});
test('recipe edits change the publication fingerprint even with unchanged source contents', () => {
  const before = fingerprint(autumn);
  const source = boxFingerprint(autumn);
  const spec = collection.find(s => s.id === weeklyMenu(autumn).recipes[0].id);
  const method = spec.method;
  try {
    spec.method = 'Updated recipe description';
    assert.equal(boxFingerprint(autumn), source);
    assert.notEqual(fingerprint(autumn), before);
    assert.equal(needsDeployment(autumn, { deployed: before }, 'schedule'), true);
  } finally { spec.method = method; }
});
