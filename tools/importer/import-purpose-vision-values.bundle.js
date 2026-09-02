/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-purpose-vision-values.js
  var import_purpose_vision_values_exports = {};
  __export(import_purpose_vision_values_exports, {
    default: () => import_purpose_vision_values_default
  });

  // tools/importer/parsers/columns-nav.js
  function parse(element, { document: document2 }) {
    const label = element.querySelector("nav h3, h3");
    const links = Array.from(element.querySelectorAll("li.c-anchor__menu--item a, ul.c-anchor__menu--items a, a.c-anchor__nav--link"));
    if (!label && !links.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const labelCell = [];
    if (label) labelCell.push(label);
    const linksCell = [];
    links.forEach((a) => {
      const p = document2.createElement("p");
      p.appendChild(a);
      linksCell.push(p);
    });
    const cells = [[
      labelCell.length ? labelCell : "",
      linksCell.length ? linksCell : ""
    ]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-nav", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-accent.js
  function parse2(element, { document: document2 }) {
    const image = element.querySelector(".c-universal-grid__content--media img, .c-media img, .e-image img, picture img, img");
    const heading = element.querySelector("h1, h2, h3");
    const contentRoot = element.querySelector(".c-universal-grid__content--inner, .c-universal-grid__content") || element;
    const paras = Array.from(contentRoot.querySelectorAll("p")).filter((p) => p.textContent.trim());
    if (!image && !heading && !paras.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const mediaCell = image ? [image] : "";
    const contentCell = [];
    if (heading) {
      paras.forEach((p) => {
        if (heading.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_PRECEDING) contentCell.push(p);
      });
      contentCell.push(heading);
      paras.forEach((p) => {
        if (heading.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING) contentCell.push(p);
      });
    } else {
      contentCell.push(...paras);
    }
    const cells = [[
      mediaCell,
      contentCell.length ? contentCell : ""
    ]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-accent", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-approach.js
  function parse3(element, { document: document2 }) {
    const narrativeInner = element.querySelector(".c-richtext__content--inner, .layout__region--sidebar .c-richtext__content--inner");
    const narrativeCell = [];
    if (narrativeInner) {
      const heading = narrativeInner.querySelector("h1, h2, h3");
      if (heading) narrativeCell.push(heading);
      narrativeInner.querySelectorAll(":scope > p").forEach((p) => narrativeCell.push(p));
      const narrativeImg = narrativeInner.querySelector(".c-image img, .embedded-entity img, img");
      if (narrativeImg && !(narrativeImg.getAttribute("src") || "").startsWith("data:")) {
        narrativeCell.push(narrativeImg);
      }
    }
    const items = Array.from(element.querySelectorAll(".c-universal-grid__item--universal"));
    const featureCell = [];
    items.forEach((item) => {
      const title = item.querySelector("h3, h2");
      const descCol = item.querySelector(".e-rte-layout__col-9") || item;
      const desc = descCol.querySelector("p");
      if (title) featureCell.push(title);
      if (desc && desc.textContent.trim()) featureCell.push(desc);
    });
    if (!narrativeCell.length && !featureCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[
      narrativeCell.length ? narrativeCell : "",
      featureCell.length ? featureCell : ""
    ]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-approach", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/quote-accent.js
  function parse4(element, { document: document2 }) {
    const cls = element.className || "";
    if (/clone|duplicate/i.test(cls)) {
      element.remove();
      return;
    }
    let portrait = null;
    const imgs = element.querySelectorAll("img");
    imgs.forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!portrait && !src.startsWith("data:")) portrait = img;
    });
    const quote = element.querySelector(".e-quote, blockquote, .p-carousel__content--heading, .p-cv-carousel__content--heading, .p-carousel__content--subheading .cc-txt-tertiary");
    const attribution = element.querySelector(".p-carousel__content--subheading > p, .p-carousel__content--subheading, .p-cv-carousel__content--subheading, .e-quote ~ p, .p-carousel__content-headings p");
    if (!portrait && !quote && !attribution) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const imageCell = [document2.createComment(" field:image ")];
    if (portrait) {
      const img = document2.createElement("img");
      img.setAttribute("src", portrait.getAttribute("src"));
      const alt = portrait.getAttribute("alt");
      if (alt) img.setAttribute("alt", alt);
      imageCell.push(img);
    }
    cells.push([imageCell]);
    const quoteCell = [document2.createComment(" field:quotation ")];
    if (quote) {
      const p = document2.createElement("p");
      p.textContent = quote.textContent.trim();
      quoteCell.push(p);
    }
    cells.push([quoteCell]);
    const attrCell = [document2.createComment(" field:attribution ")];
    if (attribution) attrCell.push(attribution);
    cells.push([attrCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "quote-accent", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse5(element, { document: document2 }) {
    const introInner = element.querySelector(".layout__region--sidebar .c-richtext__content--inner, .c-richtext__content--inner");
    const introNodes = [];
    if (introInner) {
      Array.from(introInner.childNodes).forEach((n) => introNodes.push(n));
    }
    const items = Array.from(element.querySelectorAll(".p-accordion__item, .p-cv-accordion__item"));
    const cells = [];
    items.forEach((item) => {
      const headingEl = item.querySelector(".p-accordion__item--heading, .p-cv-accordion__item--heading");
      const bodyEl = item.querySelector(".p-accordion__item--body, .p-cv-accordion__item--body");
      if (!headingEl && !bodyEl) return;
      let summaryText = "";
      if (headingEl) {
        const clone = headingEl.cloneNode(true);
        clone.querySelectorAll('.icon, span.icon, [class*="icon-"]').forEach((s) => s.remove());
        summaryText = clone.textContent.replace(/\s+/g, " ").trim();
      }
      const summaryFrag = document2.createDocumentFragment();
      if (summaryText) {
        summaryFrag.appendChild(document2.createComment(" field:summary "));
        summaryFrag.appendChild(document2.createTextNode(summaryText));
      }
      const textFrag = document2.createDocumentFragment();
      textFrag.appendChild(document2.createComment(" field:text "));
      if (bodyEl) {
        while (bodyEl.firstChild) {
          textFrag.appendChild(bodyEl.firstChild);
        }
      }
      cells.push([summaryFrag, textFrag]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(...introNodes, block);
  }

  // tools/importer/parsers/columns-links.js
  function parse6(element, { document: document2 }) {
    const heading = element.querySelector("h1, h2, h3");
    const linksRoot = element.querySelector(".layout__region--sidebar, .e-rte-layout__col-3, .layout__region--main") || element;
    let links = Array.from(linksRoot.querySelectorAll("a[href]"));
    if (!links.length) links = Array.from(element.querySelectorAll("a[href]"));
    links = links.filter((a) => a.textContent.trim());
    if (!heading && !links.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const headingCell = [];
    if (heading) headingCell.push(heading);
    const linksCell = [];
    links.forEach((a) => {
      const p = document2.createElement("p");
      p.appendChild(a);
      linksCell.push(p);
    });
    const cells = [[
      headingCell.length ? headingCell : "",
      linksCell.length ? linksCell : ""
    ]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-links", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/covista-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#consent_blackbar",
        // <div id="consent_blackbar"> (TrustArc consent)
        "#teconsent",
        // <span id="teconsent"> (TrustArc consent trigger)
        "a.skip-link"
        // <a ... class="visually-hidden focusable skip-link">
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.page--header",
        // <header class="page--header"> (line 10)
        "footer.page--footer",
        // <footer class="page--footer"> (line 1431)
        "iframe",
        // doubleclick tracking iframe (line 1692)
        "noscript",
        "link"
      ]);
    }
  }

  // tools/importer/transformers/covista-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-purpose-vision-values.js
  var PAGE_TEMPLATE = {
    "name": "purpose-vision-values",
    "description": 'Purpose, Vision & Values page: hero banner, purpose statement with image, vision + 5 values list, two pull-quotes, FAQ accordion, and a "Learn more" links band.',
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
  var parsers = {
    "columns-nav": parse,
    "columns-accent": parse2,
    "columns-approach": parse3,
    "quote-accent": parse4,
    "accordion-faq": parse5,
    "columns-links": parse6
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_purpose_vision_values_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_purpose_vision_values_exports);
})();
