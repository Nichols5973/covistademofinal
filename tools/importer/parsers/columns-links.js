/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-links. Base block: columns.
 * Source: https://www.covista.com/our-story/purpose-vision-values
 *   (migration-work/block-context/columns-links/source.html)
 * xwalk: Columns block (core/franklin/components/columns) — NO field-hint comments (hinting Rule 4);
 *   cells hold default content only.
 * Columns convention: Row 1 = block name; Row 2 = N side-by-side cells of rich content (no nested blocks).
 * Structure: Row 2 has 2 columns:
 *   heading cell -> H2 "Learn more about Covista" (+ any intro copy)
 *   links cell   -> the stacked list of related-page links (rendered arrow-led by columns-links.js)
 * Selectors validated against source.html / cleaned.html.
 */
export default function parse(element, { document }) {
  // Heading cell: the section heading (+ optional intro copy).
  const heading = element.querySelector('h1, h2, h3');

  // Links cell: related-page links. Scope to the sidebar/links region when present.
  const linksRoot = element.querySelector('.layout__region--sidebar, .e-rte-layout__col-3, .layout__region--main') || element;
  let links = Array.from(linksRoot.querySelectorAll('a[href]'));
  if (!links.length) links = Array.from(element.querySelectorAll('a[href]'));
  links = links.filter((a) => a.textContent.trim());

  // Empty-block guard.
  if (!heading && !links.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const headingCell = [];
  if (heading) headingCell.push(heading);

  const linksCell = [];
  links.forEach((a) => {
    const p = document.createElement('p');
    p.appendChild(a);
    linksCell.push(p);
  });

  const cells = [[
    headingCell.length ? headingCell : '',
    linksCell.length ? linksCell : '',
  ]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-links', cells });
  element.replaceWith(block);
}
