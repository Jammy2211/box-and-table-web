# Public weekly site

This repository is public. Keep household databases, credentials, selections,
ratings and private planner history out of it. Import only the grower's public
listing and public-safe recipe code/assets from the separate private planner.

This is a dependency-free static generator using Node.js 24. Run `npm test` and
`npm run build` after changes. `dist/` is generated and published through the
main-branch Pages workflow. Slack credentials belong only in Actions secrets.

Preserve the sequence: validate source → build/deploy → verify the exact public
publication → notify → save receipts. Leave the last good site available when
source validation or publishing fails. Do not change the private planner's
repository visibility.
