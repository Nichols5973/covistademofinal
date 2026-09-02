/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsNavParser from './parsers/columns-nav.js';
import columnsAccentParser from './parsers/columns-accent.js';
import columnsApproachParser from './parsers/columns-approach.js';
import quoteAccentParser from './parsers/quote-accent.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import columnsLinksParser from './parsers/columns-links.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/covista-cleanup.js';
import sectionsTransformer from './transformers/covista-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  "name": "purpose-vision-values",
  "description": "Purpose, Vision & Values page: hero banner, purpose statement with image, vision + 5 values list, two pull-quotes, FAQ accordion, and a \"Learn more\" links band.",
  "urls": [
    "https://www.covista.com/our-story/purpose-vision-values"
  ],
  "blocks": [
    {
      "name": "columns-nav",
      "instances": [
        "div.t-layout__one-column.standard-width.p-universal-bg-color--white.pad-top-0.pad-bottom-0.p-section__align--none.layout.layout--atge-one-column"
      ]
    },
    {
      "name": "columns-accent",
      "instances": [
        "#purpose",
        "#vision"
      ]
    },
    {
      "name": "columns-approach",
      "instances": [
        "#values"
      ]
    },
    {
      "name": "quote-accent",
      "instances": [
        "div.t-layout__one-column.standard-width.p-universal-bg-color--secondary.pad-bottom-40.p-section__align--none.layout.layout--atge-one-column .c-carousel__item.c-cv-carousel__item"
      ]
    },
    {
      "name": "accordion-faq",
      "instances": [
        "#faqs"
      ]
    },
    {
      "name": "columns-links",
      "instances": [
        "div.t-layout__two-column.standard-width.layout__split--5050.sidebar-first.sidebar-left.p-universal-bg-color--secondary.pad-top-10.pad-bottom-40.p-section__align--none.layout__spacing--default.no_constrain_bg_witdh.layout.layout--atge-two-column"
      ]
    }
  ],
  "sections": [
    {
      "id": "pvv-subnav",
      "name": "Sticky sub-navigation",
      "selector": "div.t-layout__one-column.standard-width.p-universal-bg-color--white.pad-top-0.pad-bottom-0.p-section__align--none.layout.layout--atge-one-column",
      "style": null,
      "blocks": [
        "columns-nav"
      ],
      "defaultContent": []
    },
    {
      "id": "pvv-hero",
      "name": "Hero banner",
      "selector": "div.t-layout__one-column.edge-to-edge.no-padding.no-max-width.p-universal-bg-color--none.p-section__align--none.layout.layout--atge-one-column",
      "style": "light",
      "blocks": [],
      "defaultContent": [
        "div.t-layout__one-column.edge-to-edge.no-padding.no-max-width.p-universal-bg-color--none.p-section__align--none.layout.layout--atge-one-column"
      ]
    },
    {
      "id": "pvv-purpose",
      "name": "Our purpose accent band",
      "selector": "#purpose",
      "style": "soft-pink",
      "blocks": [
        "columns-accent"
      ],
      "defaultContent": []
    },
    {
      "id": "pvv-vision",
      "name": "Our vision accent band",
      "selector": "#vision",
      "style": "soft-pink",
      "blocks": [
        "columns-accent"
      ],
      "defaultContent": []
    },
    {
      "id": "pvv-values",
      "name": "Our values list",
      "selector": "#values",
      "style": "soft-pink",
      "blocks": [
        "columns-approach"
      ],
      "defaultContent": []
    },
    {
      "id": "pvv-quotes",
      "name": "Testimonials",
      "selector": "div.t-layout__one-column.standard-width.p-universal-bg-color--secondary.pad-bottom-40.p-section__align--none.layout.layout--atge-one-column",
      "style": "soft-pink",
      "blocks": [
        "quote-accent"
      ],
      "defaultContent": []
    },
    {
      "id": "pvv-faqs",
      "name": "FAQ",
      "selector": "#faqs",
      "style": "light",
      "blocks": [
        "accordion-faq"
      ],
      "defaultContent": []
    },
    {
      "id": "pvv-learnmore",
      "name": "Learn more links",
      "selector": "div.t-layout__two-column.standard-width.layout__split--5050.sidebar-first.sidebar-left.p-universal-bg-color--secondary.pad-top-10.pad-bottom-40.p-section__align--none.layout__spacing--default.no_constrain_bg_witdh.layout.layout--atge-two-column",
      "style": "soft-pink",
      "blocks": [
        "columns-links"
      ],
      "defaultContent": []
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'columns-nav': columnsNavParser,
  'columns-accent': columnsAccentParser,
  'columns-approach': columnsApproachParser,
  'quote-accent': quoteAccentParser,
  'accordion-faq': accordionFaqParser,
  'columns-links': columnsLinksParser,
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
