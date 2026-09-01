/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base block: accordion.
 * Source: https://www.covista.com/our-story (migration-work/block-context/accordion-faq/source.html)
 * xwalk model: blocks/accordion-faq/_accordion-faq.json — container block with accordion-faq-item children.
 *   Item fields: summary (text), text (richtext) — neither is a collapsed suffix, both get field hints.
 * Library convention (Accordion): 2 columns; one row per accordion item:
 *   col 1 -> field:summary (question / clickable title)
 *   col 2 -> field:text (answer richtext / content)
 * The #faq section also carries an intro (heading + "Contact us" prompt) in the sidebar that has no
 * field in the accordion model; it is preserved as default content before the block so no content is lost.
 * Selectors validated against source.html.
 */
export default function parse(element, { document }) {
  // Intro (sidebar richtext) — preserved as default content, not part of the accordion model.
  const introInner = element.querySelector('.layout__region--sidebar .c-richtext__content--inner, .c-richtext__content--inner');
  const introNodes = [];
  if (introInner) {
    Array.from(introInner.childNodes).forEach((n) => introNodes.push(n));
  }

  // Accordion items — skip empty placeholder items (no heading/body).
  const items = Array.from(element.querySelectorAll('.p-accordion__item, .p-cv-accordion__item'));

  const cells = [];
  items.forEach((item) => {
    const headingEl = item.querySelector('.p-accordion__item--heading, .p-cv-accordion__item--heading');
    const bodyEl = item.querySelector('.p-accordion__item--body, .p-cv-accordion__item--body');
    if (!headingEl && !bodyEl) return; // skip empty placeholder item

    // Column 1: summary (question). Strip the leading icon span, keep just the text.
    let summaryText = '';
    if (headingEl) {
      const clone = headingEl.cloneNode(true);
      clone.querySelectorAll('.icon, span.icon, [class*="icon-"]').forEach((s) => s.remove());
      summaryText = clone.textContent.replace(/\s+/g, ' ').trim();
    }
    const summaryFrag = document.createDocumentFragment();
    if (summaryText) {
      summaryFrag.appendChild(document.createComment(' field:summary '));
      summaryFrag.appendChild(document.createTextNode(summaryText));
    }

    // Column 2: text (richtext answer).
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    if (bodyEl) {
      while (bodyEl.firstChild) {
        textFrag.appendChild(bodyEl.firstChild);
      }
    }

    cells.push([summaryFrag, textFrag]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(...introNodes, block);
}
