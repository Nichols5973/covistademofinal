/* eslint-disable no-underscore-dangle */
// AEM GraphQL exposes system fields with leading underscores
// (_authorUrl, _publishUrl, _path); the rule is disabled for this file.
import { getMetadata } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/*
 * Content Fragment block — Covista.
 *
 * Renders an AEM Content Fragment (picked in the Universal Editor dialog) as a
 * banner: image + title + subtitle + description + CTA. The SAME fragment can be
 * placed on any number of pages; edit it once and every placement updates.
 *
 * DATA MODEL (AEM Content Fragment Model "CTA"):
 *   title        (single-line text)
 *   subtitle     (single-line text)
 *   description  (multi-line / rich text)
 *   bannerimage  (content reference — image)
 *   ctalabel     (single-line text)
 *   ctaurl       (content reference — page)
 *
 * GRAPHQL persisted query (endpoint: /graphql/execute.json/ref-demo-eds/CTAByPath):
 *   query CTAByPath($path: String!, $variation: String!) {
 *     ctaByPath(_path: $path, variation: $variation) {
 *       item {
 *         title subtitle
 *         description { plaintext html }
 *         bannerimage { _authorUrl _publishUrl }
 *         ctalabel
 *         ctaurl { _path _authorUrl _publishUrl }
 *       }
 *     }
 *   }
 */

const CONFIG = {
  // AEM GraphQL persisted query for the CTA content-fragment model.
  // "ref-demo-eds" is the GraphQL endpoint (config) name where the CTA model +
  // CTAByPath persisted query live. The query filters by the fragment's _path,
  // so any CTA-model fragment (regardless of DAM folder) resolves through it.
  GRAPHQL_QUERY: '/graphql/execute.json/ref-demo-eds/CTAByPath',
  // GraphQL response root (matches the query name above).
  RESPONSE_ROOT: 'ctaByPath',
  // AEM publish origin that serves the persisted query on the DELIVERY tier
  // (aem.live / aem.page). The Edge Delivery host does NOT serve
  // /graphql/execute.json, so on delivery we must call AEM publish directly.
  // CORS on publish already allows the aem.live / aem.page origins.
  // Override per-site (e.g. when cloning this block to another demo) by
  // publishing a `publishurl` metadata value on the page — see getServiceHost.
  PUBLISH_HOST: 'https://publish-p87302-e1492027.adobeaemcloud.com',
};

// --- Environment helpers (inlined so the block has no extra script deps) ---

/** True when running inside the AEM author / Universal Editor canvas. */
function isAuthorEnvironment() {
  return window.location.hostname.includes('adobeaemcloud.com')
    || window.location.hostname.includes('author')
    || !!document.querySelector('meta[name="urn:adobe:aue:system:aemconnection"]');
}

/**
 * Resolve the host that serves the AEM GraphQL persisted query.
 *
 * - Author / Universal Editor canvas: the same-origin author host, taken from
 *   the `authorurl`/`hostname` page meta if present, else the current origin.
 *   (Same-origin, so the session cookie authenticates the request.)
 * - Delivery (aem.live / aem.page): the AEM PUBLISH origin — from a `publishurl`
 *   page meta if present, otherwise CONFIG.PUBLISH_HOST. We deliberately do NOT
 *   fall back to the EDS origin (window.location), because the Edge Delivery
 *   host returns 404 for /graphql/execute.json — that fallback was the bug.
 */
function getServiceHost(isAuthor) {
  if (isAuthor) {
    const meta = getMetadata('authorurl') || getMetadata('hostname');
    const host = meta || `${window.location.protocol}//${window.location.host}`;
    return host.replace(/\/$/, '');
  }
  const meta = getMetadata('publishurl');
  return (meta || CONFIG.PUBLISH_HOST).replace(/\/$/, '');
}

/** Find the content-fragment path anywhere in the block (href or text). */
function findContentPath(block) {
  // Prefer an anchor/href pointing at a DAM content-fragment.
  const link = [...block.querySelectorAll('a[href]')]
    .map((a) => a.getAttribute('href'))
    .find((h) => h && h.includes('/content/dam/'));
  if (link) {
    const m = link.match(/\/content\/dam\/[^"'?#\s]+/);
    if (m) return m[0];
  }
  // Fall back to any cell whose text is a /content/dam/ path.
  const cell = [...block.querySelectorAll('div')]
    .map((d) => d.textContent.trim())
    .find((t) => /^\/content\/dam\/\S+$/.test(t));
  return cell || '';
}

export default async function decorate(block) {
  // The dialog renders one row per field, in model order:
  //   1 reference (CF path) | 2 variation | 3 style | 4 alignment
  const rows = [...block.children];
  const contentPath = findContentPath(block);
  const cellText = (i) => rows[i]?.querySelector(':scope > div')?.textContent?.trim()
    || rows[i]?.textContent?.trim() || '';
  const variationName = (cellText(1) || 'master').toLowerCase().replace(/\s+/g, '_');
  const displayStyle = cellText(2);
  const alignment = cellText(3) || 'text-center';

  if (!contentPath) {
    // eslint-disable-next-line no-console
    console.warn('content-fragment: no /content/dam/ path found in block. Raw block HTML:', block.innerHTML);
    block.innerHTML = '';
    return;
  }

  block.innerHTML = '';

  const isAuthor = isAuthorEnvironment();
  const host = getServiceHost(isAuthor);

  const url = `${host}${CONFIG.GRAPHQL_QUERY};path=${encodeURIComponent(contentPath)}`
    + `;variation=${encodeURIComponent(variationName)};ts=${Date.now()}`;

  // eslint-disable-next-line no-console
  console.info('content-fragment: fetching', {
    contentPath, variationName, displayStyle, alignment, isAuthor, host, url,
  });

  let item;
  try {
    const resp = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    const json = await resp.json().catch(() => null);
    // eslint-disable-next-line no-console
    console.info('content-fragment: response', { status: resp.status, json });
    if (!resp.ok) throw new Error(`GraphQL ${resp.status}`);
    item = json?.data?.[CONFIG.RESPONSE_ROOT]?.item;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('content-fragment: failed to fetch CF', {
      contentPath, variationName, url, error: e.message,
    });
    return;
  }
  if (!item) {
    // eslint-disable-next-line no-console
    console.warn('content-fragment: query returned no item — the GraphQL response above shows why (GraphQL "errors" array = model not on this endpoint / wrong query; empty data = fragment not published or path not matched).', { contentPath, variationName });
    return;
  }

  const imgUrl = (isAuthor ? item.bannerimage?._authorUrl : item.bannerimage?._publishUrl)
    || item.bannerimage?._publishUrl || item.bannerimage?._authorUrl || '';

  // Layout: named styles set a plain background image; default uses an overlay.
  const isNamedStyle = ['image-left', 'image-right', 'image-top', 'image-bottom'].includes(displayStyle);
  const bannerContentStyle = isNamedStyle && imgUrl ? `background-image: url(${imgUrl});` : '';
  const bannerDetailStyle = !isNamedStyle && imgUrl
    ? `background-image: linear-gradient(90deg, rgba(0,0,0,0.6), rgba(0,0,0,0.1) 80%), url(${imgUrl});`
    : '';

  // CTA href — supports author paths, publish URLs, and site-relative paths.
  let ctaHref = '#';
  const cta = item.ctaurl;
  if (cta) {
    if (typeof cta === 'string') {
      ctaHref = /^https?:\/\//i.test(cta) ? cta : `${host}${cta}`;
    } else if (typeof cta === 'object') {
      ctaHref = isAuthor
        ? (cta._authorUrl || (cta._path ? `${host}${cta._path}` : '#'))
        : (cta._publishUrl || cta._path || '#');
    }
  }

  const itemId = `urn:aemconnection:${contentPath}/jcr:content/data/${variationName}`;
  block.setAttribute('data-aue-type', 'container');
  block.innerHTML = `
    <div class="banner-content ${displayStyle}" data-aue-resource="${itemId}" data-aue-label="${variationName || 'Content Fragment'}" data-aue-type="reference" data-aue-filter="contentfragment" style="${bannerContentStyle}">
      <div class="banner-detail ${alignment}" style="${bannerDetailStyle}" data-aue-prop="bannerimage" data-aue-label="Main Image" data-aue-type="media">
        <h2 class="cftitle" data-aue-prop="title" data-aue-label="Title" data-aue-type="text">${item.title || ''}</h2>
        <h3 class="cfsubtitle" data-aue-prop="subtitle" data-aue-label="Subtitle" data-aue-type="text">${item.subtitle || ''}</h3>
        <div class="cfdescription" data-aue-prop="description" data-aue-label="Description" data-aue-type="richtext"><p>${item.description?.plaintext || ''}</p></div>
        <p class="button-container">
          <a class="button" href="${ctaHref}" data-aue-prop="ctaurl" data-aue-label="Button Link" data-aue-type="reference" data-aue-filter="page" target="_blank" rel="noopener">
            <span data-aue-prop="ctalabel" data-aue-label="Button Label" data-aue-type="text">${item.ctalabel || ''}</span>
          </a>
        </p>
      </div>
      <div class="banner-logo"></div>
    </div>`;

  if (!isAuthor) {
    moveInstrumentation(block, null);
    block.querySelectorAll('*').forEach((el) => moveInstrumentation(el, null));
  }
}
