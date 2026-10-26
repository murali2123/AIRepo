# Little Lantern

A privacy-first product prototype for two related experiences:

1. Parent-directed personalized animated stories for children.
2. Bilingual Tamil–English educational shorts based on Thirukkural, vocabulary and moral stories.

## Run locally

No build step or dependencies are required. You can open `index.html` directly, or serve the folder locally:

```powershell
npx serve .
```

Open `http://localhost:4173`.

## Run automated tests

The test suite uses Node's built-in test runner and has no third-party dependencies:

```powershell
npm test
```

It verifies all ten included Kurals, five-scene story generation, safe HTML rendering, Kural parsing, downloadable script construction, required page elements, upload restrictions, parental consent, and privacy messaging.

## Important

This repository currently contains a front-end prototype. The upload interaction previews a selected image locally and does **not** transmit it. Do not connect the form to storage or an AI provider until the controls in [docs/PRODUCT_BUILD_PROMPT.md](docs/PRODUCT_BUILD_PROMPT.md) and [SECURITY.md](SECURITY.md) are implemented and reviewed.

The name “Little Lantern” is a working brand and should receive trademark/domain clearance before commercial use.
