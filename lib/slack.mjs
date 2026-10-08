export async function deliverNotification({ token, conversation, siteURL, box, hash, fetcher = fetch }) {
  const site = new URL(siteURL);
  if (site.protocol !== 'https:' || site.username || site.password || /[<>|]/.test(site.href)) throw new Error('Invalid public site URL.');
  if (!/^[CDG][A-Z0-9]+$/.test(conversation)) throw new Error('Invalid Slack conversation ID.');
  // Verify the deployed data, not merely a successful HTTP response from an old site.
  const liveURL = new URL('publication.json', site.href.endsWith('/') ? site : `${site.href}/`);
  liveURL.searchParams.set('version', hash);
  const live = await fetcher(liveURL, { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(15000) });
  if (!live.ok || (await live.json()).fingerprint !== hash) throw new Error('The updated site is not yet available; notification will retry.');
  let response;
  try {
    response = await fetcher('https://slack.com/api/chat.postMessage', {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(15000),
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: conversation, unfurl_links: false, unfurl_media: false,
        text: `Box & Table is updated for the week of ${box.week}: this week's vegetables, fruit and five batch-cook recipes. <${site.href}|Open Box & Table>` }),
    });
    if (!response.ok || (await response.json()).ok !== true) throw new Error();
  } catch { throw new Error('Slack delivery failed. Check the bot token and conversation access; the next check will retry.'); }
}
