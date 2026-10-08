# Box & Table — weekly website

A free, public weekly menu at **https://jamesnightingale.net/box-and-table-web/**.

The site shows NEOG's large vegetable and fruit bags and up to five complete six-portion recipes selected from an 18-recipe collection, with ingredients, cooking instructions and printing. It does not store household selections, shopping ticks, pantry or ratings. The full planner and household database remain in the separate private/local project.

## Automatic updates

GitHub Actions checks NEOG hourly at :17 on Wednesdays (07:00–22:59 Europe/London) and Thursdays (07:00–12:59). UTC triggers cover both GMT and BST; the script filters the extra hours. GitHub schedules may be delayed, so this is not an exact-time notification service. New contents, a new publication week or changes to the selected recipes trigger a Pages deployment. Failed source checks leave the existing site intact. The page shows a warning when its saved week becomes stale.

Only the public source listing, recipe code and illustrations are in this repository. No household database, credentials, ratings or personal notes are published. Standard runners in this public repository and GitHub Pages are free; there is no paid hosting service or continuously running server.

Source snapshots and deployment/notification fingerprints are committed under `data/`. Unchanged scheduled checks neither redeploy nor repeat successful Slack messages. A failed deployment is retried on the next check. A failed notification retries on a subsequent check without needing another source change. If Slack accepts a message but the job dies before saving its receipt, a duplicate is possible on retry.

GitHub can disable public-repository schedules after 60 days without repository activity. Weekly source commits normally keep this repository active; check the Actions tab if the source stops changing for that long.

## Recipes matched to the box

Each publication selects up to four vegetarian recipes and one chicken recipe using only confirmed vegetables from that week. Selection prioritises coverage of the box, then rotates dish choices by publication week. Missing or ambiguous produce is never silently substituted. The page identifies any uncovered vegetables and separates box ingredients from cupboard or shopping extras. Coverage is across the suggestions, not a guarantee about unknown bag weights.

The publication fingerprint includes the complete selected recipes, so recipe-only improvements are deployed and verified too. Tests cover autumn, winter, spring and summer boxes, weekly rotation, uncertain contents and recipe/source consistency.

## Slack setup (one time)

The website works without Slack. To activate notifications:

1. Install a Slack app in PyAutoLabs with the bot scope `chat:write` and access to an approved conversation containing Jam and Kelly. A bot cannot normally post to an existing two-human DM; a group conversation containing both people and the bot is suitable. If opening that group through the API, the bot also needs `mpim:write` and verified user IDs for both people.
2. In this repository's **Settings → Secrets and variables → Actions**, add `SLACK_BOT_TOKEN` and `SLACK_CONVERSATION_ID` as secrets. Keep tokens out of source files and chat.
3. Run **Actions → Update weekly box and publish → Run workflow**. It checks that the current publication fingerprint is actually served at the public site before posting the link to the configured conversation.

Until secrets are provided, the workflow summary explicitly says Slack is not configured. The current fresh box remains pending, so activating Slack does not require waiting for another week. Old weeks are not announced. Connecting Slack to ChatGPT alone does not give a GitHub runner a bot credential.

## Development

Node.js 24 or newer; no package installation or paid APIs needed:

```sh
npm test
npm run refresh
npm run build
python -m http.server 8080 --directory dist
```

Source validation, same-week changes, rollback protection, DST windows, notification retries, exact-publication checks, complete recipe output and HTML escaping are covered by tests. Publishing is restricted to the main-branch workflow; pull requests do not receive Slack secrets.

Recipe timings are estimates and the original adaptable recipes are not kitchen-tested. Dish-family pictures were generated for Box & Table and can differ from a particular week's ingredients. Other recipes show ingredient panels for the actual weekly produce; cooking steps are text instructions. Food storage guidance is included in each recipe. NEOG quantities are unknown until you measure your actual bags.
