# Hero Overlay — Add DAM Image Authoring Plan

## Goal
On the Covista **Our Story** page (`/content/covistademo1/language-masters/en`), enable authors to pick the **hero overlay background image** from AEM Assets (DAM) via the Universal Editor dialog. Today the dialog only exposes the **Text** and **Alt** fields — there is no working image control — so the hero image can't be changed from the UE.

## Root cause
The Hero Overlay model (`blocks/hero-overlay/_hero-overlay.json`) defines its image with `"component": "image"`. In this project's Universal Editor, that field type isn't surfacing an editable image control in the dialog — which is why you only see Text and Alt. Every other block that offers a proper image picker in this repo (`hero`, `cards`, `carousel`, `tabs`, `video`) uses **`"component": "reference"`**, which renders the DAM asset picker. Switching Hero Overlay to `reference` gives it the same browse-and-select DAM picker.

## Approach (per your choice: DAM asset picker)
- Change the Hero Overlay `image` field from `component: "image"` to `component: "reference"` so the UE shows the **DAM asset picker**.
- Keep the `imageAlt` and `text` fields as-is.
- The existing `hero-overlay.js` already converts an image anchor into an `<img>` and is harmless when AEM emits a `<picture>`/`<img>` from a DAM reference — but I'll verify it handles the DAM-rendered markup and adjust only if needed.
- Rebuild the aggregated component JSON so the UE picks up the new field definition.
- Redeploy (git push) and re-run the Edge Delivery preview→publish pipeline for the page.

> ⚠️ **DAM caveat (important for this project):** Earlier in this project, DAM-referenced assets caused **publish failures** ("Invalid Fragments" / unpublished-reference errors) because the referenced asset must itself be **published** before the page can go live. For this to work end-to-end you'll need to **upload the hero image into AEM Assets and Publish that asset** before/at rollout. If publishing breaks again, the fallback is the external-URL field approach.

## Files to change
- `blocks/hero-overlay/_hero-overlay.json` — swap `image` field to `component: "reference"`.
- (Regenerated) `component-models.json` / `component-definition.json` via `npm run build:json`.
- `blocks/hero-overlay/hero-overlay.js` — verify/adjust only if DAM markup needs it (likely no change).

## Checklist
- [ ] Read current `_hero-overlay.json`, `hero-overlay.js`, and a working `reference`-based example (`hero`) to match the exact field shape
- [ ] Change the `image` field in `blocks/hero-overlay/_hero-overlay.json` from `"component": "image"` to `"component": "reference"` (keep `name`, `label`, `valueType`, `multi: false`)
- [ ] Run `npm run build:json` to regenerate the aggregated component model/definition files
- [ ] Run `npm run lint` (eslint + stylelint) to confirm no violations
- [ ] Verify `hero-overlay.js` renders correctly whether AEM emits a `<picture>`/`<img>` (DAM) or an image anchor (URL); adjust only if the background image doesn't appear
- [ ] Commit and push to `main` (triggers code deploy)
- [ ] In AEM: confirm the UE dialog now shows an **Image** DAM picker on the Hero Overlay block; pick/upload the hero image and **Publish the asset** in AEM Assets
- [ ] Run the Edge Delivery preview→publish pipeline for `/content/covistademo1/language-masters/en`
- [ ] Verify the live page renders the hero background image (check preview + `.aem.live`, watch for 404s on the asset)

## Notes
- Live URL for verification: `https://main--covistademofinal--nichols5973.aem.live/content/covistademo1/language-masters/en`
- **Execution requires Execute mode** — this plan makes file changes (`_hero-overlay.json`, regenerated JSON), pushes to git, and runs the publish pipeline, none of which run in Plan mode.
