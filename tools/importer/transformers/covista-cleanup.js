/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Covista site-wide cleanup.
 * Removes non-authorable site chrome (header, footer, skip link, consent bar,
 * tracking iframe). All selectors verified against migration-work/cleaned.html.
 *
 * NOTE: `nav` is intentionally NOT removed globally — the in-page sticky anchor
 * nav inside <main> (div...anchor-menu) is authorable content mapped to the
 * `columns-nav` block. Header/footer navs are removed together with their
 * header.page--header / footer.page--footer parents.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Consent bar and skip link sit at body level (cleaned.html lines 2, 5).
    WebImporter.DOMUtils.remove(element, [
      '#consent_blackbar', // <div id="consent_blackbar"> (TrustArc consent)
      '#teconsent', // <span id="teconsent"> (TrustArc consent trigger)
      'a.skip-link', // <a ... class="visually-hidden focusable skip-link">
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome and tracking. Selectors from cleaned.html.
    WebImporter.DOMUtils.remove(element, [
      'header.page--header', // <header class="page--header"> (line 10)
      'footer.page--footer', // <footer class="page--footer"> (line 1431)
      'iframe', // doubleclick tracking iframe (line 1692)
      'noscript',
      'link',
    ]);
  }
}
