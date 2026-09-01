/* eslint-disable */
/* global WebImporter */
/**
 * Parser for quote-accent. Base block: quote.
 * Source: https://www.covista.com/our-story (migration-work/block-context/quote-accent/source.html)
 * xwalk model: blocks/quote-accent/_quote-accent.json — fields: image (reference), imageAlt (text), quotation (richtext), attribution (richtext).
 * Simple block: 1 column, one row per unique field.
 *   Row 1: block name (createBlock)
 *   Row 2: portrait image -> field:image (+ imageAlt collapsed into <img alt>)
 *   Row 3: quotation      -> field:quotation
 *   Row 4: attribution    -> field:attribution
 * Selectors validated against source.html.
 */
export default function parse(element, { document }) {
  // Portrait image (Steve Beard) — first real <img> that is not the decorative SVG overlay.
  let portrait = null;
  const imgs = element.querySelectorAll('img');
  imgs.forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (!portrait && !src.startsWith('data:')) portrait = img;
  });

  // Quotation text.
  const quote = element.querySelector('.e-quote, blockquote, .p-carousel__content--subheading .cc-txt-tertiary');
  // Attribution: name + title paragraph following the quote.
  const attribution = element.querySelector('.p-carousel__content--subheading > p, .e-quote ~ p, .p-carousel__content-headings p');

  // Empty-block guard.
  if (!portrait && !quote && !attribution) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2 — portrait image (reference). imageAlt collapses into the <img alt>.
  const imageCell = [document.createComment(' field:image ')];
  if (portrait) {
    const img = document.createElement('img');
    img.setAttribute('src', portrait.getAttribute('src'));
    const alt = portrait.getAttribute('alt');
    if (alt) img.setAttribute('alt', alt);
    imageCell.push(img);
  }
  cells.push([imageCell]);

  // Row 3 — quotation (richtext).
  const quoteCell = [document.createComment(' field:quotation ')];
  if (quote) {
    const p = document.createElement('p');
    p.textContent = quote.textContent.trim();
    quoteCell.push(p);
  }
  cells.push([quoteCell]);

  // Row 4 — attribution (richtext).
  const attrCell = [document.createComment(' field:attribution ')];
  if (attribution) attrCell.push(attribution);
  cells.push([attrCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'quote-accent', cells });
  element.replaceWith(block);
}
