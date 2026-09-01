// hero-overlay: full-bleed background image + overlaid headline/subtitle.
// In AEM crosswalk, the image field renders as an <a href="image-url">alt</a>
// (a bare link, not a picture) when the source is an external URL. Convert any
// such image-URL anchor into an <img> so the background renders. Harmless when
// the block already contains a <picture>/<img> (local .plain.html path).

const IMG_URL = /\.(?:png|jpe?g|webp|gif|svg|avif)(?:[?#]|$)/i;

export default function decorate(block) {
  block.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (!IMG_URL.test(href)) return;
    if (a.closest('picture') || a.querySelector('img')) return;
    const img = document.createElement('img');
    img.src = href;
    img.alt = a.textContent.trim();
    img.loading = 'eager';
    a.replaceWith(img);
  });
}
