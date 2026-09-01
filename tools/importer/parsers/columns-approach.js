/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-approach. Base block: columns.
 * Source: https://www.covista.com/our-story (migration-work/block-context/columns-approach/source.html)
 * xwalk: Columns block (core/franklin/components/columns) — NO field-hint comments (hinting Rule 4);
 *   cells hold default content only.
 * Library convention (Columns): Row 1 block name; Row 2 has N side-by-side cells, each rich content (no nested blocks).
 * Structure: Row 2 has 2 columns:
 *   col 1 -> narrative (H2 "Our approach" + paragraphs)
 *   col 2 -> five feature items, each an H3 title + description paragraph
 * Selectors validated against source.html.
 */
export default function parse(element, { document }) {
  // Left cell: narrative richtext from the sidebar richtext region.
  const narrativeInner = element.querySelector('.c-richtext__content--inner, .layout__region--sidebar .c-richtext__content--inner');
  const narrativeCell = [];
  if (narrativeInner) {
    const heading = narrativeInner.querySelector('h1, h2, h3');
    if (heading) narrativeCell.push(heading);
    narrativeInner.querySelectorAll(':scope > p').forEach((p) => narrativeCell.push(p));
  }

  // Right cell: the feature-list items.
  const items = Array.from(element.querySelectorAll('.c-universal-grid__item--universal'));
  const featureCell = [];
  items.forEach((item) => {
    const title = item.querySelector('h3, h2');
    // The description paragraph lives in the wider text column (col-9), not the icon spacer (col-3).
    const descCol = item.querySelector('.e-rte-layout__col-9') || item;
    const desc = descCol.querySelector('p');
    if (title) featureCell.push(title);
    if (desc && desc.textContent.trim()) featureCell.push(desc);
  });

  // Empty-block guard.
  if (!narrativeCell.length && !featureCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[
    narrativeCell.length ? narrativeCell : '',
    featureCell.length ? featureCell : '',
  ]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-approach', cells });
  element.replaceWith(block);
}
