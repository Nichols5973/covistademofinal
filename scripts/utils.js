/*
 * scripts/utils.js
 *
 * covista did not have a scripts/utils.js (it 404s on the live origin). This is a
 * SCOPED port containing only the three helpers that te-connectdemo's
 * blocks/content-fragment/content-fragment.js imports, with byte-identical bodies:
 *
 *   - getHostname()          reads the `hostname` placeholder
 *   - getPathMappings()      loads /paths.json (cached)
 *   - mapAemPathToSitePath() maps a /content/... path to a site-relative path
 *
 * te-connectdemo's full utils.js also exports language/DM/tag helpers and imports
 * ./dom-helpers.js; none of that is needed by the CF block, so it is intentionally
 * omitted to avoid dragging RefDemo-only dependencies into covista. If you later
 * port other RefDemo blocks that need those exports, copy them in from
 * te-connectdemo/scripts/utils.js as needed.
 */

import { fetchPlaceholders } from './placeholders.js';

let cachedPathMappings;

export async function getHostname() {
  try {
    const listOfAllPlaceholdersData = await fetchPlaceholders();
    const hostname = listOfAllPlaceholdersData?.hostname;
    if (hostname) {
      return hostname;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Error fetching placeholders for hostname:', error);
  }
  return undefined;
}

export async function getPathMappings() {
  if (cachedPathMappings) return cachedPathMappings;
  try {
    const resp = await fetch('/paths.json', { headers: { Accept: 'application/json' } });
    if (!resp.ok) return { mappings: [], includes: [] };
    const json = await resp.json();
    cachedPathMappings = {
      mappings: Array.isArray(json.mappings) ? json.mappings.slice() : [],
      includes: Array.isArray(json.includes) ? json.includes.slice() : [],
    };
    return cachedPathMappings;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to load /paths.json', e);
    return { mappings: [], includes: [] };
  }
}

/**
 * Map a given AEM content path to a site-relative path using mappings from paths.json.
 * - Chooses the longest matching source prefix.
 * - Preserves the remaining suffix (without .html).
 * - Always returns a leading slash path.
 */
export async function mapAemPathToSitePath(aemPath) {
  try {
    if (!aemPath || typeof aemPath !== 'string') return aemPath || '/';
    const url = new URL(aemPath, window.location.origin);
    let pathname = url.pathname || aemPath;
    // Strip .html if present
    pathname = pathname.replace(/\.html$/i, '');
    const { mappings } = await getPathMappings();
    if (!mappings || !mappings.length) return pathname;
    // Find best match (longest src that is a prefix of pathname)
    let best = null;
    mappings.forEach((entry) => {
      if (typeof entry !== 'string' || !entry.includes(':')) return;
      const [srcRaw, destRaw] = entry.split(':');
      const src = srcRaw.trim();
      const dest = (destRaw || '').trim();
      if (src && pathname.startsWith(src)) {
        if (!best || src.length > best.src.length) {
          best = { src, dest };
        }
      }
    });
    if (!best) return pathname;
    const suffix = pathname.substring(best.src.length);
    const join = (a, b) => {
      if (!a) return b || '/';
      if (!b) return a || '/';
      const left = a.endsWith('/') ? a.slice(0, -1) : a;
      const right = b.startsWith('/') ? b.slice(1) : b;
      return `/${[left, right].filter(Boolean).join('/')}`.replace(/\/{2,}/g, '/');
    };
    let mapped = join(best.dest, suffix);
    // Normalize to have leading slash and collapse double slashes
    if (!mapped.startsWith('/')) mapped = `/${mapped}`;
    mapped = mapped.replace(/\/{2,}/g, '/');
    return mapped;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to map AEM path to site path', e);
    return aemPath;
  }
}
