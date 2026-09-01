/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature. Base block: columns.
 * Source: https://www.covista.com/our-story (migration-work/block-context/columns-feature/source.html)
 * Reused across 3 instances (rc8 "What drives us forward", rc10 "Meet our leaders", rc12 "AI-ready graduates").
 * xwalk: Columns block (core/franklin/components/columns) — NO field-hint comments (hinting Rule 4);
 *   cells hold default content only.
 * Library convention (Columns): Row 1 block name; Row 2 has N side-by-side cells, each rich content (no nested blocks).
 * Structure: Row 2 has 2 columns:
 *   col 1 -> feature image
 *   col 2 -> H2 title + paragraph + "Learn more" CTA
 * Selectors validated against source.html.
 */
export default function parse(element, { document }) {
  // Left cell: feature image.
  const image = element.querySelector('.c-card__item--media img, .c-image img, picture img, img');

  // Right cell: heading + copy + CTA.
  const copy = element.querySelector('.c-card__item--copy, .c-cv-card__item--copy');
  const heading = copy ? copy.querySelector('h1, h2, h3') : element.querySelector('.c-card__item--content h2, h2');
  const paras = copy ? Array.from(copy.querySelectorAll('p')) : Array.from(element.querySelectorAll('.c-card__item--content p'));
  const cta = element.querySelector('.c-card__item--cta a, a[class*="e-btn"]');

  // Empty-block guard.
  if (!image && !heading && !paras.length && !cta) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const mediaCell = image ? [image] : '';

  const contentCell = [];
  if (heading) contentCell.push(heading);
  contentCell.push(...paras);
  if (cta) contentCell.push(cta);

  const cells = [[
    mediaCell,
    contentCell.length ? contentCell : '',
  ]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
