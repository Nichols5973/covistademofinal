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
 * DATA MODEL (AEM Content Fragment Model "Covista Banner", id: covista-banner):
 *   title        (single-line text)
 *   subtitle     (single-line text)
 *   description   (multi-line / rich text)
 *   bannerimage  (content reference — image)
 *   ctalabel     (single-line text)
 *   ctaurl       (content reference — page)
 *
 * GRAPHQL persisted query (endpoint: /graphql/execute.json/covistademo1/BannerByPath):
 *   query BannerByPath($path: String!, $variation: String!) {
 *     bannerByPath(_path: $path, variation: $variation) {
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
  // AEM GraphQL persisted query for the Covista banner CF model.
  GRAPHQL_QUERY: '/graphql/execute.json/covistademo1/BannerByPath',
  // GraphQL response root (matches the query name above).
  RESPONSE_ROOT: 'bannerByPath',
};

// --- Environment helpers (inlined so the block has no extra script deps) ---

/** True when running inside the AEM author / Universal Editor canvas. */
function isAuthorEnvironment() {
  return window.location.hostname.includes('adobeaemcloud.com')
    || window.location.hostname.includes('author')
    || !!document.querySelector('meta[name="urn:adobe:aue:system:aemconnection"]');
}

/** Author host, from page metadata (set by AEM) or the current origin. */
function getAuthorHost() {
  const meta = getMetadata('authorurl') || getMetadata('hostname');
  if (meta) return meta.replace(/\/$/, '');
  return `${window.location.protocol}//${window.location.host}`;
}

/** Publish host = author host with the "author" segment swapped to "publish". */
function getPublishHost() {
  return getAuthorHost().replace('author', 'publish').replace(/\/$/, '');
}

export default async function decorate(block) {
  // The dialog renders one row per field, in model order:
  //   1 reference (CF path, as a link) | 2 variation | 3 style | 4 alignment
  const contentPath = block.querySelector(':scope > div:nth-child(1) a')?.textContent?.trim()
    || block.querySelector(':scope > div:nth-child(1) > div')?.textContent?.trim();
  const variationName = block.querySelector(':scope > div:nth-child(2) > div')?.textContent?.trim()
    ?.toLowerCase().replace(/\s+/g, '_') || 'master';
  const displayStyle = block.querySelector(':scope > div:nth-child(3) > div')?.textContent?.trim() || '';
  const alignment = block.querySelector(':scope > div:nth-child(4) > div')?.textContent?.trim() || 'text-center';

  block.innerHTML = '';
  if (!contentPath) return;

  const isAuthor = isAuthorEnvironment();
  const authorHost = getAuthorHost();
  const publishHost = getPublishHost();
  const host = isAuthor ? authorHost : publishHost;

  const url = `${host}${CONFIG.GRAPHQL_QUERY};path=${encodeURIComponent(contentPath)}`
    + `;variation=${encodeURIComponent(variationName)};ts=${Date.now()}`;

  let item;
  try {
    const resp = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    if (!resp.ok) throw new Error(`GraphQL ${resp.status}`);
    const json = await resp.json();
    item = json?.data?.[CONFIG.RESPONSE_ROOT]?.item;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('content-fragment: failed to fetch CF', { contentPath, variationName, error: e.message });
    return;
  }
  if (!item) return;

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
        ? (cta._authorUrl || (cta._path ? `${authorHost}${cta._path}` : '#'))
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
