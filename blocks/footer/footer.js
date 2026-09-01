// Covista footer: dark-green footer with a brand/address + multi-column link
// band, and a legal/social strip. All copy/links/images live in
// content/footer.plain.html; this module reads that fragment and renders the
// layout. Generic + reusable — no site-specific names.

// Inline brand icons for the social row (hrefs come from the fragment).
const SOCIAL_ICONS = {
  linkedin: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M4.98 3.5A2.5 2.5 0 1 1 2.5 6 2.5 2.5 0 0 1 4.98 3.5ZM3 8.98h4v12H3ZM9 8.98h3.8v1.64h.05a4.17 4.17 0 0 1 3.75-2.06c4 0 4.75 2.64 4.75 6.06v6.36h-4v-5.64c0-1.34 0-3.06-1.87-3.06s-2.15 1.46-2.15 2.96v5.74H9Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2.16c3.2 0 3.58 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.16 15.58 2.16 15.2 2.16 12s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.16 8.8 2.16 12 2.16Zm0 1.8c-3.15 0-3.5.01-4.75.07-.9.04-1.38.19-1.7.32-.43.16-.74.36-1.06.68-.32.32-.52.63-.68 1.06-.13.32-.28.8-.32 1.7-.06 1.25-.07 1.6-.07 4.75s.01 3.5.07 4.75c.04.9.19 1.38.32 1.7.16.43.36.74.68 1.06.32.32.63.52 1.06.68.32.13.8.28 1.7.32 1.25.06 1.6.07 4.75.07s3.5-.01 4.75-.07c.9-.04 1.38-.19 1.7-.32.43-.16.74-.36 1.06-.68.32-.32.52-.63.68-1.06.13-.32.28-.8.32-1.7.06-1.25.07-1.6.07-4.75s-.01-3.5-.07-4.75c-.04-.9-.19-1.38-.32-1.7a2.85 2.85 0 0 0-.68-1.06 2.85 2.85 0 0 0-1.06-.68c-.32-.13-.8-.28-1.7-.32-1.25-.06-1.6-.07-4.75-.07Zm0 3.06a4.98 4.98 0 1 1 0 9.96 4.98 4.98 0 0 1 0-9.96Zm0 8.22a3.24 3.24 0 1 0 0-6.48 3.24 3.24 0 0 0 0 6.48Zm6.34-8.42a1.16 1.16 0 1 1-2.32 0 1.16 1.16 0 0 1 2.32 0Z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M23.5 6.5a3 3 0 0 0-2.12-2.12C19.5 3.87 12 3.87 12 3.87s-7.5 0-9.38.5A3 3 0 0 0 .5 6.5 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.5 3 3 0 0 0 2.12 2.12c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3 3 0 0 0 2.12-2.12A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.5ZM9.6 15.6V8.4l6.2 3.6Z"/></svg>',
};

function socialKeyFromHref(href) {
  const h = (href || '').toLowerCase();
  if (h.includes('linkedin')) return 'linkedin';
  if (h.includes('instagram')) return 'instagram';
  if (h.includes('youtube')) return 'youtube';
  return null;
}

/**
 * Load the footer fragment. Metadata-independent dual-fetch:
 * /content first (localhost / aem up), then root (DA/EDS production).
 */
async function loadFooterFragment() {
  // Resolve the footer fragment relative to the current page's directory so it
  // works both on the published EDS site (/footer.plain.html) and in the AEM
  // author / Universal Editor canvas (/content/covistademo1/footer.plain.html).
  const dir = window.location.pathname.replace(/[^/]*$/, '');
  const candidates = [
    `${dir}footer.plain.html`,
    '/content/covistademo1/footer.plain.html',
    '/content/footer.plain.html',
    '/footer.plain.html',
  ];
  const html = await candidates.reduce(async (prev, url) => {
    const found = await prev;
    if (found !== null) return found;
    try {
      const resp = await fetch(url);
      return resp.ok ? resp.text() : null;
    } catch (e) {
      return null;
    }
  }, Promise.resolve(null));
  if (!html) return null;
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp;
}

export default async function decorate(block) {
  const frag = await loadFooterFragment();
  block.textContent = '';
  if (!frag) return;

  const sections = [...frag.children];
  // [0] brand/address, [1] link columns, [2] copyright, [3] legal + social
  const brandSection = sections[0];
  const linksSection = sections[1];
  const copySection = sections[2];
  const legalSection = sections[3];

  const footer = document.createElement('div');
  footer.className = 'footer-inner';

  // --- Top band: brand + link columns ---
  const topBand = document.createElement('div');
  topBand.className = 'footer-top';

  if (brandSection) {
    brandSection.className = 'footer-brand';
    topBand.append(brandSection);
  }

  if (linksSection) {
    linksSection.className = 'footer-links';
    topBand.append(linksSection);
  }
  footer.append(topBand);

  // --- Bottom band: copyright + legal/social strip ---
  const bottomBand = document.createElement('div');
  bottomBand.className = 'footer-bottom';

  if (copySection) {
    copySection.className = 'footer-copyright';
    bottomBand.append(copySection);
  }

  if (legalSection) {
    legalSection.className = 'footer-legal';
    // The second <ul> in this section is the social row — turn its links into icons.
    const lists = legalSection.querySelectorAll(':scope > ul');
    const socialList = lists[lists.length - 1];
    if (socialList && lists.length > 1) {
      socialList.classList.add('footer-social');
      socialList.querySelectorAll('a').forEach((a) => {
        const key = socialKeyFromHref(a.getAttribute('href'));
        if (key && SOCIAL_ICONS[key]) {
          a.setAttribute('aria-label', a.textContent.trim());
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener');
          a.innerHTML = SOCIAL_ICONS[key];
        }
      });
    }
    bottomBand.append(legalSection);
  }
  footer.append(bottomBand);

  block.append(footer);
}
