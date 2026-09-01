// AEM crosswalk renders the image field as an <a href="image-url">alt</a> (a
// bare link) when the source is an external URL. Convert any image-URL anchor
// to an <img> so the portrait renders. Harmless when a <picture>/<img> exists.
const IMG_URL = /\.(?:png|jpe?g|webp|gif|svg|avif)(?:[?#]|$)/i;

export default async function decorate(block) {
  block.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (!IMG_URL.test(href) || a.closest('picture') || a.querySelector('img')) return;
    const img = document.createElement('img');
    img.src = href;
    img.alt = a.textContent.trim();
    a.replaceWith(img);
  });

  const rows = [...block.children].map((c) => c.firstElementChild);
  // Detect an optional leading portrait image row.
  let imageRow;
  let quotation;
  let attribution;
  if (rows[0] && rows[0].querySelector('picture, img')) {
    [imageRow, quotation, attribution] = rows;
  } else {
    [quotation, attribution] = rows;
  }

  // Portrait figure (left column) when present.
  let figure;
  if (imageRow) {
    figure = document.createElement('div');
    figure.className = 'quote-accent-figure';
    figure.append(imageRow.querySelector('picture') || imageRow.querySelector('img'));
  }

  const blockquote = document.createElement('blockquote');
  // decorate quotation
  if (quotation) {
    quotation.className = 'quote-accent-quotation';
    blockquote.append(quotation);
  }
  // decoration attribution
  if (attribution) {
    attribution.className = 'quote-accent-attribution';
    blockquote.append(attribution);
    const ems = attribution.querySelectorAll('em');
    ems.forEach((em) => {
      const cite = document.createElement('cite');
      cite.innerHTML = em.innerHTML;
      em.replaceWith(cite);
    });
  }

  block.innerHTML = '';
  if (figure) {
    block.classList.add('quote-accent-has-image');
    block.append(figure);
  }
  block.append(blockquote);
}
