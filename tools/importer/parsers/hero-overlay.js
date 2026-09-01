/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay. Base block: hero.
 * Source: https://www.covista.com/our-story (migration-work/block-context/hero-overlay/source.html)
 * xwalk model: blocks/hero-overlay/_hero-overlay.json — fields: image (reference), imageAlt (collapsed into <img alt>), text (richtext).
 * Library convention (Hero): 1 column, max 3 rows.
 *   Row 1: block name (createBlock)
 *   Row 2: background image (optional) -> field:image
 *   Row 3: title + subheading + CTA (optional) -> field:text
 * Selectors validated against source.html.
 */
export default function parse(element, { document }) {
  // Background image lives in the banner media region.
  const bgImage = element.querySelector('.p-cv-banner__media img, .p-banner__media img, picture img, img');

  // Heading + copy live in the banner content/text region.
  const heading = element.querySelector('.p-cv-banner--heading, .p-banner-heading, h1, h2');
  const copy = element.querySelector('.p-cv-banner--copy, .p-banner-copy');
  const copyParas = copy ? Array.from(copy.querySelectorAll('p')) : [];

  // Empty-block guard: nothing meaningful to author.
  if (!bgImage && !heading && !copyParas.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2 — image (asset reference). imageAlt collapses into <img alt>, so no separate hint.
  if (bgImage) {
    cells.push([[document.createComment(' field:image '), bgImage]]);
  }

  // Row 3 — text (richtext): heading followed by copy paragraphs.
  const textCell = [document.createComment(' field:text ')];
  if (heading) textCell.push(heading);
  textCell.push(...copyParas);
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
