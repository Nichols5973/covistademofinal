// hero-overlay: full-bleed background image + overlaid headline/subtitle.
//
// The image field is a DAM `reference`, so on delivery the pipeline already
// emits a proper <picture>/<img> — no conversion needed. The only case that
// still needs help is a legacy EXTERNAL image URL, which crosswalk renders as
// a bare <a href="https://…/x.jpg">alt</a>; we convert that to an <img>.
//
// We must NOT touch the markup inside the Universal Editor (author) canvas:
// rewriting instrumented nodes breaks the editor's re-render matching and makes
// the block paint twice on every field edit. So this is a publish-only helper.

const EXTERNAL_IMG_URL = /^https?:\/\/\S+\.(?:png|jpe?g|webp|gif|svg|avif)(?:[?#]|$)/i;

function isAuthorEnvironment() {
  return window.location.hostname.includes('adobeaemcloud.com')
    || !!document.querySelector('meta[name="urn:adobe:aue:system:aemconnection"]');
}

export default function decorate(block) {
  // In the author/UE canvas, leave the instrumented DAM markup untouched.
  if (isAuthorEnvironment()) return;

  block.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    // Only convert genuine external image URLs; DAM references already render
    // as <picture>, and converting them would strip needed markup.
    if (!EXTERNAL_IMG_URL.test(href)) return;
    if (a.closest('picture') || a.querySelector('img')) return;
    const img = document.createElement('img');
    img.src = href;
    img.alt = a.textContent.trim();
    img.loading = 'eager';
    a.replaceWith(img);
  });
}
