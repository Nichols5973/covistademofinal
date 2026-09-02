# Hero Overlay Duplication — Resolved ✅

## Status
The Universal Editor block-duplication issue is **fixed and confirmed by the user** ("it worked, no more duplication"). No further code changes are required for this issue. This artifact records what was done and captures the optional follow-ups still open from earlier in the project, so nothing is lost.

## What was fixed (all deployed to `main`)
1. **DAM image picker enabled** (`b…` / hero-overlay model) — image field switched from `image` → `reference` so authors can pick the hero background from AEM Assets.
2. **DOMPurify undefined under AMD** (`d89e831`) — the UMD DOMPurify bundle registered as an AMD module in the editor, leaving `window.DOMPurify` undefined and crashing the re-render; fixed by hiding `define` during load + a safe fallback.
3. **applyChanges throw guard** (`6a0049c`) — wrapped the editor change handler in try/catch so any error reliably falls back to a reload instead of stranding a duplicate.
4. **Idempotent block swap** (`b1f265a`) — the re-render now removes every stale copy of a block except the freshly inserted one, so exactly one survives regardless of event timing. This resolved the final image-add duplication.

## Verification completed
- Saved content confirmed clean throughout (always exactly one hero block).
- Live + preview render a single hero; hero image loads correctly.
- DOMPurify fix tested against the deployed script under a simulated AMD environment.
- All fixes confirmed present in the served files; lint clean.

## Optional follow-ups (open items from earlier — not started)
- **MSM Live Copy demo** — create a Live Copy from `language-masters/en` (e.g. `us/en`), add `paths.json` mapping, run the publish pipeline for a clean URL, then demonstrate rollout + break-inheritance localization.
- **Content-fragment two-page reuse demo** — finish getting the content-fragment block to render (the earlier GraphQL `CTAByPath`/`ref-demo-eds` diagnosis) and show the same fragment on two pages.

## Checklist
- [x] Enable DAM image picker on hero-overlay (image → reference)
- [x] Fix DOMPurify-undefined crash in the editor re-render
- [x] Guard applyChanges so errors always fall back to reload
- [x] Make the block swap idempotent (remove all stale copies)
- [x] Confirm saved content and live render stay single-hero
- [x] User confirms no more duplication
- [ ] (Optional) Set up MSM Live Copy demo from the language master
- [ ] (Optional) Complete content-fragment render + two-page reuse demo

## Notes
- The duplication issue requires no more work.
- The two optional follow-ups are the remaining demo goals; **execution of either requires Execute mode**. Tell me which (if any) you'd like to pursue next and I'll build out a focused execution plan.
