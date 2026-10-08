import { fingerprint, needsNotification } from '../lib/publication.mjs';
import { deliverNotification } from '../lib/slack.mjs';
import { readJSON, writeJSON, summary } from './files.mjs';

const box = await readJSON('data/box.json');
const delivery = await readJSON('data/delivery.json', {});
if (!needsNotification(box, delivery)) {
  await summary('No new deployed, current-week box needs a Slack notification.');
} else if (!process.env.SLACK_BOT_TOKEN || !process.env.SLACK_CONVERSATION_ID) {
  await summary('Website published. Slack is not configured: add SLACK_BOT_TOKEN and SLACK_CONVERSATION_ID as repository Actions secrets, then run this workflow manually.');
} else {
  await deliverNotification({ token: process.env.SLACK_BOT_TOKEN,
    conversation: process.env.SLACK_CONVERSATION_ID, siteURL: process.env.SITE_URL,
    box, hash: fingerprint(box) });
  delivery.notified = fingerprint(box);
  await writeJSON('data/delivery.json', delivery);
  await summary('Slack notification sent.');
}
