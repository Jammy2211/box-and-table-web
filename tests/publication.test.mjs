import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseBox, monitorDue } from '../lib/box.ts';
import { fingerprint, chooseBox, needsDeployment, needsNotification } from '../lib/publication.mjs';
import { renderPage } from '../lib/render.mjs';
import { deliverNotification } from '../lib/slack.mjs';

const now = new Date('2026-09-30T10:00:00Z');
const fixture = readFileSync(new URL('./neog.html', import.meta.url), 'utf8');
const box = parseBox(fixture, now);
const hash = fingerprint(box);

test('ignores fetch timestamps but detects same-week content and new weeks', () => {
  const same = { ...box, fetchedAt: '2026-09-30T15:00:00Z' };
  assert.equal(chooseBox(box, same).changed, false);
  assert.equal(chooseBox(box, same).box, box);
  const edited = structuredClone(box); edited.vegetables[0].origin = 'Another grower';
  assert.equal(chooseBox(box, edited).changed, true);
  assert.equal(chooseBox(box, { ...box, week: '2026-10-07' }).changed, true);
  assert.throws(() => chooseBox(box, { ...box, week: '2026-09-23' }), /older week/);
  assert.throws(() => parseBox('broken source', now), /publication date/);
});
test('deploys unpublished changes and retries notifications without redeploying unchanged content', () => {
  assert.equal(needsDeployment(box, {}, 'schedule'), true);
  assert.equal(needsNotification(box, {}, now), false);
  assert.equal(needsDeployment(box, { deployed: hash }, 'schedule'), false);
  assert.equal(needsDeployment(box, { deployed: hash }, 'push'), true);
  assert.equal(needsNotification(box, { deployed: hash }, now), true);
  assert.equal(needsNotification(box, { deployed: hash, notified: hash }, now), false);
  assert.equal(needsNotification(box, { deployed: hash }, new Date('2026-10-07T10:00:00Z')), false);
});
test('London schedule handles summer time, winter time and Thursday retries', () => {
  assert.equal(monitorDue(new Date('2026-09-30T06:17:00Z')), true);
  assert.equal(monitorDue(new Date('2026-09-30T22:17:00Z')), false);
  assert.equal(monitorDue(new Date('2026-10-28T06:17:00Z')), false);
  assert.equal(monitorDue(new Date('2026-10-28T22:17:00Z')), true);
  assert.equal(monitorDue(new Date('2026-10-01T07:17:00Z')), true);
  assert.equal(monitorDue(new Date('2026-10-02T07:17:00Z')), false);
});
test('renders full recipes and escapes source text with relative asset URLs for project Pages', () => {
  const injected = structuredClone(box); injected.vegetables[0].original = '<script>alert(1)</script>';
  const html = renderPage(injected, now);
  assert.equal((html.match(/<article class="recipe"/g) || []).length, 5);
  assert.ok((html.match(/<h5>/g) || []).length >= 20);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>alert/);
  assert.doesNotMatch(html, /(?:src|href)="\/(?:steps|assets|api)/);
  assert.match(html, /does not save selections/);
  assert.match(renderPage(box, new Date('2026-10-07')), /id="stale"[^>]*data-week="2026-09-30" >The grower/);
});
test('does not send Slack before the exact updated site is live', async () => {
  const calls = [];
  await assert.rejects(deliverNotification({ token: 'test-only', conversation: 'GTEST', siteURL: 'https://example.com/box/', box, hash,
    fetcher: async url => { calls.push(String(url)); return Response.json({ fingerprint: 'previous' }); },
  }), /not yet available/);
  assert.equal(calls.length, 1);
  assert.match(calls[0], /\/box\/publication.json/);
});
test('sends the site link to the configured conversation and treats Slack API failures as retryable', async () => {
  let posted = 0;
  let fail = false;
  const fetcher = async (url, init) => {
    if (String(url).includes('publication.json')) return Response.json({ fingerprint: hash });
    posted++;
    const message = JSON.parse(init.body);
    assert.equal(message.channel, 'GTEST');
    assert.match(message.text, /https:\/\/example.com\/box\//);
    assert.equal(init.redirect, 'error');
    return Response.json({ ok: !fail });
  };
  const options = { token: 'test-only', conversation: 'GTEST', siteURL: 'https://example.com/box/', box, hash, fetcher };
  await deliverNotification(options);
  fail = true;
  await assert.rejects(deliverNotification(options), /Slack delivery failed/);
  assert.equal(posted, 2);
});
