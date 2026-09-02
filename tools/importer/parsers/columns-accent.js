/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-accent. Base block: columns.
 * Source: https://www.covista.com/our-story/purpose-vision-values
 *   (migration-work/block-context/columns-accent/source.html)
 * Reused across 2 instances (#purpose text-left/image-right, #vision image-left/text-right).
 * xwalk: Columns block (core/franklin/components/columns) — NO field-hint comments (hinting Rule 4);
 *   cells hold default content only. Image-side alternation is handled at render time by columns-accent.js.
 * Columns convention: Row 1 = block name; Row 2 = N side-by-side cells of rich content (no nested blocks).
 * Structure: Row 2 has 2 columns:
 *   media cell   -> the accent photo
 *   content cell -> eyebrow (e.g. "Our purpose") + H2 + supporting paragraph(s). No CTA.
 * Selectors validated against source.html / cleaned.html.
 */
export default function parse(element, { document }) {
  // Media cell: the accent photo.
  const image = element.querySelector('.c-universal-grid__content--media img, .c-media img, .e-image img, picture img, img');

  // Content cell: eyebrow + heading + supporting copy.
  const heading = element.querySelector('h1, h2, h3');
  const contentRoot = element.querySelector('.c-universal-grid__content--inner, .c-universal-grid__content') || element;
  const paras = Array.from(contentRoot.querySelectorAll('p')).filter((p) => p.textContent.trim());

  // Empty-block guard.
  if (!image && !heading && !paras.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const mediaCell = image ? [image] : '';

  // Preserve source order: eyebrow paragraph(s) before the heading, heading, then body copy.
  const contentCell = [];
  if (heading) {
    paras.forEach((p) => {
      if (heading.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_PRECEDING) contentCell.push(p);
    });
    contentCell.push(heading);
    paras.forEach((p) => {
      if (heading.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING) contentCell.push(p);
    });
  } else {
    contentCell.push(...paras);
  }

  const cells = [[
    mediaCell,
    contentCell.length ? contentCell : '',
  ]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-accent', cells });
  element.replaceWith(block);
}
