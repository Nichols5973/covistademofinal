/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-nav. Base block: columns.
 * Source: https://www.covista.com/our-story (migration-work/block-context/columns-nav/source.html)
 * xwalk: Columns block (core/franklin/components/columns) — NO field-hint comments (hinting Rule 4);
 *   cells hold default content only.
 * Library convention (Columns): Row 1 block name; Row 2 has N side-by-side cells, each rich content (no nested blocks).
 * Structure: Row 2 has 2 columns:
 *   col 1 -> section label (h3 "Our Story")
 *   col 2 -> the row of in-page anchor links
 * Selectors validated against source.html.
 */
export default function parse(element, { document }) {
  // Left cell: the section label heading.
  const label = element.querySelector('nav h3, h3');

  // Right cell: the anchor navigation links.
  const links = Array.from(element.querySelectorAll('li.c-anchor__menu--item a, ul.c-anchor__menu--items a, a.c-anchor__nav--link'));

  // Empty-block guard.
  if (!label && !links.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const labelCell = [];
  if (label) labelCell.push(label);

  const linksCell = [];
  links.forEach((a) => {
    const p = document.createElement('p');
    p.appendChild(a);
    linksCell.push(p);
  });

  const cells = [[
    labelCell.length ? labelCell : '',
    linksCell.length ? linksCell : '',
  ]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-nav', cells });
  element.replaceWith(block);
}
