/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroOverlayParser from './parsers/hero-overlay.js';
import columnsNavParser from './parsers/columns-nav.js';
import columnsApproachParser from './parsers/columns-approach.js';
import quoteAccentParser from './parsers/quote-accent.js';
import columnsDarkParser from './parsers/columns-dark.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import accordionFaqParser from './parsers/accordion-faq.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/covista-cleanup.js';
import sectionsTransformer from './transformers/covista-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'our-story',
  description: 'Our Story narrative page: hero banner, sticky anchor nav, approach feature list, pull-quote, dark media section, three image+text+CTA feature sections, FAQ accordion, and a footnote.',
  urls: [
    'https://www.covista.com/our-story',
  ],
  blocks: [
    {
      name: 'hero-overlay',
      instances: [
        'div.t-layout__one-column.edge-to-edge.no-padding.no-max-width.p-universal-bg-color--none.p-section__align--none.layout.layout--atge-one-column',
      ],
    },
    {
      name: 'columns-nav',
      instances: [
        'div.t-layout__one-column.standard-width.p-universal-bg-color--none.pad-top-0.pad-bottom-0.p-section__align--none.layout.layout--atge-one-column',
      ],
    },
    {
      name: 'columns-approach',
      instances: [
        '#approach',
      ],
    },
    {
      name: 'quote-accent',
      instances: [
        'div.t-layout__one-column.standard-width.p-universal-bg-color--secondary.pad-bottom-50.p-section__align--none.layout.layout--atge-one-column',
      ],
    },
    {
      name: 'columns-dark',
      instances: [
        '#name',
      ],
    },
    {
      name: 'columns-feature',
      instances: [
        'div.t-layout__one-column.edge-to-edge.no-padding.no-max-width.p-universal-bg-color--white.pad-y-20-desktop.p-section__align--none.layout.layout--atge-one-column:nth-of-type(6)',
        'div.t-layout__one-column.edge-to-edge.no-padding.no-max-width.p-universal-bg-color--white.p-section__align--none.layout.layout--atge-one-column:nth-of-type(8)',
        'div.t-layout__one-column.edge-to-edge.no-padding.no-max-width.p-universal-bg-color--white.pad-y-20-desktop.pad-top-0.pad-bottom-50-desktop.p-section__align--none.layout.layout--atge-one-column',
      ],
    },
    {
      name: 'accordion-faq',
      instances: [
        '#faq',
      ],
    },
  ],
  sections: [
    { id: 'rc4', name: 'Hero banner', selector: 'div.t-layout__one-column.edge-to-edge.no-padding.no-max-width.p-universal-bg-color--none.p-section__align--none.layout.layout--atge-one-column', style: null, blocks: ['hero-overlay'], defaultContent: [] },
    { id: 'rc3', name: 'Sticky anchor navigation', selector: 'div.t-layout__one-column.standard-width.p-universal-bg-color--none.pad-top-0.pad-bottom-0.p-section__align--none.layout.layout--atge-one-column', style: null, blocks: ['columns-nav'], defaultContent: [] },
    { id: 'rc5', name: 'Our Approach feature list', selector: '#approach', style: 'light', blocks: ['columns-approach'], defaultContent: [] },
    { id: 'rc6', name: 'Pull-quote', selector: 'div.t-layout__one-column.standard-width.p-universal-bg-color--secondary.pad-bottom-50.p-section__align--none.layout.layout--atge-one-column', style: 'soft-pink', blocks: ['quote-accent'], defaultContent: [] },
    { id: 'rc7', name: 'Our Name dark media section', selector: '#name', style: 'dark-green', blocks: ['columns-dark'], defaultContent: [] },
    { id: 'rc8', name: 'What drives us forward feature', selector: 'div.t-layout__one-column.edge-to-edge.no-padding.no-max-width.p-universal-bg-color--white.pad-y-20-desktop.p-section__align--none.layout.layout--atge-one-column:nth-of-type(6)', style: 'light', blocks: ['columns-feature'], defaultContent: [] },
    { id: 'rc10', name: 'Meet our leaders feature', selector: 'div.t-layout__one-column.edge-to-edge.no-padding.no-max-width.p-universal-bg-color--white.p-section__align--none.layout.layout--atge-one-column:nth-of-type(8)', style: 'light', blocks: ['columns-feature'], defaultContent: [] },
    { id: 'rc12', name: 'AI-ready graduates feature', selector: 'div.t-layout__one-column.edge-to-edge.no-padding.no-max-width.p-universal-bg-color--white.pad-y-20-desktop.pad-top-0.pad-bottom-50-desktop.p-section__align--none.layout.layout--atge-one-column', style: 'light', blocks: ['columns-feature'], defaultContent: [] },
    { id: 'rc13', name: 'FAQ', selector: '#faq', style: 'light', blocks: ['accordion-faq'], defaultContent: [] },
    { id: 'rc14', name: 'Disclaimer footnote', selector: 'div.t-layout__one-column.standard-width.p-universal-bg-color--none.pad-top-40.pad-bottom-30.p-section__align--none.layout.layout--atge-one-column', style: null, blocks: [], defaultContent: ['div.t-layout__one-column.standard-width.p-universal-bg-color--none.pad-top-40.pad-bottom-30.p-section__align--none.layout.layout--atge-one-column'] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-overlay': heroOverlayParser,
  'columns-nav': columnsNavParser,
  'columns-approach': columnsApproachParser,
  'quote-accent': quoteAccentParser,
  'columns-dark': columnsDarkParser,
  'columns-feature': columnsFeatureParser,
  'accordion-faq': accordionFaqParser,
};

// TRANSFORMER REGISTRY - cleanup runs first, section transformer runs after (both hooks)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook.
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration.
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup + section markers)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block; skip elements already replaced by an earlier parser
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root URL to /index to avoid empty-path crash)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
