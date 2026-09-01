/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-dark. Base block: columns.
 * Source: https://www.covista.com/our-story (migration-work/block-context/columns-dark/source.html)
 * xwalk: Columns block (core/franklin/components/columns) — NO field-hint comments (hinting Rule 4);
 *   cells hold default content only.
 * Library convention (Columns): Row 1 block name; Row 2 has N side-by-side cells, each rich content (no nested blocks).
 * Structure: Row 2 has 2 columns:
 *   col 1 -> media image (video poster)
 *   col 2 -> H2 "Our name" + explanatory paragraphs
 * Selectors validated against source.html.
 */
export default function parse(element, { document }) {
  // Left cell: media poster image.
  const image = element.querySelector('.c-card__item--media img, .e-media-cover-img img, picture img, img');

  // Right cell: heading + copy paragraphs.
  const copy = element.querySelector('.c-card__item--copy, .c-cv-card__item--copy');
  const heading = copy ? copy.querySelector('h1, h2, h3') : element.querySelector('.c-card__item--content h2, h2');
  const paras = copy ? Array.from(copy.querySelectorAll('p')) : Array.from(element.querySelectorAll('.c-card__item--content p'));

  // Empty-block guard.
  if (!image && !heading && !paras.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const mediaCell = image ? [image] : '';

  const contentCell = [];
  if (heading) contentCell.push(heading);
  contentCell.push(...paras);

  const cells = [[
    mediaCell,
    contentCell.length ? contentCell : '',
  ]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-dark', cells });
  element.replaceWith(block);
}
