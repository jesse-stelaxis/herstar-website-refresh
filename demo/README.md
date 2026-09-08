# Herstar B2B client demonstration

A copy of the existing B2B site, extended with connected procurement and sales workflows. Original `b2b/` and `b2c/` files remain unchanged. Assets are local to this copy.

## Open

Use the repository's static server at http://127.0.0.1:8787/demo/.

Start the guided demonstration at http://127.0.0.1:8787/demo/portal.html#guide.

Detailed Chinese handover: [功能交付清单](功能交付清单.md).

## Demonstration sequence

1. Manufacturing homepage → catalogue → compare products → configure a product.
2. Request a sample or technical documents; submit the inquiry with fictional details.
3. Open the Chinese workspace, assign an owner, next action and date.
4. Edit a quotation, save and download the HTML draft.
5. Prepare an editable follow-up email; save and download without sending.
6. Record sample progress and inspect the sales-stage view and operation history.
7. View local activity analytics and export the records.
8. Try the US and German sourcing pages. Product selection, preferred units, requested documentation and next steps carry into the sales record.

## Boundaries

No backend, authentication, payments, live agent, outbound message, advertising, logistics or real web analytics. Records and local demonstration events use browser storage. Clear only the `herstar-` keys to reset manually. HTML quotations and text resources are downloaded locally. Unknown specifications, commercial terms and documentation availability are marked as unconfirmed. German copy requires native technical-language review.

The original manufacturing story remains English. Buyer tools offer English/Chinese; the two market-specific pages are separate US/German journeys, not a claim of complete multilingual coverage. No consumer storefront or checkout is included.

## Implementation

- `index.html`, `assets/`, `vendor/`: copied manufacturing site plus inquiry bridge.
- `portal.html`, `app.js`, `features.js`, `style.css`: catalogue and B2B workflows.
- `us.html`, `de.html`, `market.js`: localized sourcing briefs.
- `activity.js`: bounded browser-local demonstration event log; no network transmission.
- `original-checksums.json`: original-file integrity checks.

## Validation

From the repository root:

```sh
node demo/tests/flows.cjs
node demo/tests/localization.cjs
```

These are isolated JavaScript workflow tests with DOM stubs, not browser visual tests. They cover route rendering, persistence, inquiry transfer, document requests, quote calculations and incomplete pricing, editable drafts, sample stages, filters, analytics events, escaping, unit conversion, local assets and original-folder hashes.

## Fictional demo data

`dummy-data.js` loads eight fictional customer records, saved quotations, follow-up drafts, sample progress, a scripted chat and sample analytics on first use. All contacts use example.com. The one-time seed preserves subsequent edits and existing local records. Chat responses are scripted; saving a chat creates a fictional lead with its transcript. Analytics can separate fixture data from local demonstration actions.

Run `node demo/tests/dummy-data.cjs` to verify fixtures and safe reloading.
