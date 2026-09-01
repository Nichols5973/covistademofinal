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

  // tools/importer/import-our-story.js
  var import_our_story_exports = {};
  __export(import_our_story_exports, {
    default: () => import_our_story_default
  });

  // tools/importer/parsers/hero-overlay.js
  function parse(element, { document: document2 }) {
    const bgImage = element.querySelector(".p-cv-banner__media img, .p-banner__media img, picture img, img");
    const heading = element.querySelector(".p-cv-banner--heading, .p-banner-heading, h1, h2");
    const copy = element.querySelector(".p-cv-banner--copy, .p-banner-copy");
    const copyParas = copy ? Array.from(copy.querySelectorAll("p")) : [];
    if (!bgImage && !heading && !copyParas.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) {
      cells.push([[document2.createComment(" field:image "), bgImage]]);
    }
    const textCell = [document2.createComment(" field:text ")];
    if (heading) textCell.push(heading);
    textCell.push(...copyParas);
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-nav.js
  function parse2(element, { document: document2 }) {
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

  // tools/importer/parsers/columns-approach.js
  function parse3(element, { document: document2 }) {
    const narrativeInner = element.querySelector(".c-richtext__content--inner, .layout__region--sidebar .c-richtext__content--inner");
    const narrativeCell = [];
    if (narrativeInner) {
      const heading = narrativeInner.querySelector("h1, h2, h3");
      if (heading) narrativeCell.push(heading);
      narrativeInner.querySelectorAll(":scope > p").forEach((p) => narrativeCell.push(p));
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
    let portrait = null;
    const imgs = element.querySelectorAll("img");
    imgs.forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!portrait && !src.startsWith("data:")) portrait = img;
    });
    const quote = element.querySelector(".e-quote, blockquote, .p-carousel__content--subheading .cc-txt-tertiary");
    const attribution = element.querySelector(".p-carousel__content--subheading > p, .e-quote ~ p, .p-carousel__content-headings p");
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

  // tools/importer/parsers/columns-dark.js
  function parse5(element, { document: document2 }) {
    const image = element.querySelector(".c-card__item--media img, .e-media-cover-img img, picture img, img");
    const copy = element.querySelector(".c-card__item--copy, .c-cv-card__item--copy");
    const heading = copy ? copy.querySelector("h1, h2, h3") : element.querySelector(".c-card__item--content h2, h2");
    const paras = copy ? Array.from(copy.querySelectorAll("p")) : Array.from(element.querySelectorAll(".c-card__item--content p"));
    if (!image && !heading && !paras.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const mediaCell = image ? [image] : "";
    const contentCell = [];
    if (heading) contentCell.push(heading);
    contentCell.push(...paras);
    const cells = [[
      mediaCell,
      contentCell.length ? contentCell : ""
    ]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-dark", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse6(element, { document: document2 }) {
    const image = element.querySelector(".c-card__item--media img, .c-image img, picture img, img");
    const copy = element.querySelector(".c-card__item--copy, .c-cv-card__item--copy");
    const heading = copy ? copy.querySelector("h1, h2, h3") : element.querySelector(".c-card__item--content h2, h2");
    const paras = copy ? Array.from(copy.querySelectorAll("p")) : Array.from(element.querySelectorAll(".c-card__item--content p"));
    const cta = element.querySelector('.c-card__item--cta a, a[class*="e-btn"]');
    if (!image && !heading && !paras.length && !cta) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const mediaCell = image ? [image] : "";
    const contentCell = [];
    if (heading) contentCell.push(heading);
    contentCell.push(...paras);
    if (cta) contentCell.push(cta);
    const cells = [[
      mediaCell,
      contentCell.length ? contentCell : ""
    ]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse7(element, { document: document2 }) {
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

  // tools/importer/import-our-story.js
  var PAGE_TEMPLATE = {
    name: "our-story",
    description: "Our Story narrative page: hero banner, sticky anchor nav, approach feature list, pull-quote, dark media section, three image+text+CTA feature sections, FAQ accordion, and a footnote.",
    urls: [
      "https://www.covista.com/our-story"
    ],
    blocks: [
      {
        name: "hero-overlay",
        instances: [
          "div.t-layout__one-column.edge-to-edge.no-padding.no-max-width.p-universal-bg-color--none.p-section__align--none.layout.layout--atge-one-column"
        ]
      },
      {
        name: "columns-nav",
        instances: [
          "div.t-layout__one-column.standard-width.p-universal-bg-color--none.pad-top-0.pad-bottom-0.p-section__align--none.layout.layout--atge-one-column"
        ]
      },
      {
        name: "columns-approach",
        instances: [
          "#approach"
        ]
      },
      {
        name: "quote-accent",
        instances: [
          "div.t-layout__one-column.standard-width.p-universal-bg-color--secondary.pad-bottom-50.p-section__align--none.layout.layout--atge-one-column"
        ]
      },
      {
        name: "columns-dark",
        instances: [
          "#name"
        ]
      },
      {
        name: "columns-feature",
        instances: [
          "div.t-layout__one-column.edge-to-edge.no-padding.no-max-width.p-universal-bg-color--white.pad-y-20-desktop.p-section__align--none.layout.layout--atge-one-column:nth-of-type(6)",
          "div.t-layout__one-column.edge-to-edge.no-padding.no-max-width.p-universal-bg-color--white.p-section__align--none.layout.layout--atge-one-column:nth-of-type(8)",
          "div.t-layout__one-column.edge-to-edge.no-padding.no-max-width.p-universal-bg-color--white.pad-y-20-desktop.pad-top-0.pad-bottom-50-desktop.p-section__align--none.layout.layout--atge-one-column"
        ]
      },
      {
        name: "accordion-faq",
        instances: [
          "#faq"
        ]
      }
    ],
    sections: [
      { id: "rc4", name: "Hero banner", selector: "div.t-layout__one-column.edge-to-edge.no-padding.no-max-width.p-universal-bg-color--none.p-section__align--none.layout.layout--atge-one-column", style: null, blocks: ["hero-overlay"], defaultContent: [] },
      { id: "rc3", name: "Sticky anchor navigation", selector: "div.t-layout__one-column.standard-width.p-universal-bg-color--none.pad-top-0.pad-bottom-0.p-section__align--none.layout.layout--atge-one-column", style: null, blocks: ["columns-nav"], defaultContent: [] },
      { id: "rc5", name: "Our Approach feature list", selector: "#approach", style: "light", blocks: ["columns-approach"], defaultContent: [] },
      { id: "rc6", name: "Pull-quote", selector: "div.t-layout__one-column.standard-width.p-universal-bg-color--secondary.pad-bottom-50.p-section__align--none.layout.layout--atge-one-column", style: "soft-pink", blocks: ["quote-accent"], defaultContent: [] },
      { id: "rc7", name: "Our Name dark media section", selector: "#name", style: "dark-green", blocks: ["columns-dark"], defaultContent: [] },
      { id: "rc8", name: "What drives us forward feature", selector: "div.t-layout__one-column.edge-to-edge.no-padding.no-max-width.p-universal-bg-color--white.pad-y-20-desktop.p-section__align--none.layout.layout--atge-one-column:nth-of-type(6)", style: "light", blocks: ["columns-feature"], defaultContent: [] },
      { id: "rc10", name: "Meet our leaders feature", selector: "div.t-layout__one-column.edge-to-edge.no-padding.no-max-width.p-universal-bg-color--white.p-section__align--none.layout.layout--atge-one-column:nth-of-type(8)", style: "light", blocks: ["columns-feature"], defaultContent: [] },
      { id: "rc12", name: "AI-ready graduates feature", selector: "div.t-layout__one-column.edge-to-edge.no-padding.no-max-width.p-universal-bg-color--white.pad-y-20-desktop.pad-top-0.pad-bottom-50-desktop.p-section__align--none.layout.layout--atge-one-column", style: "light", blocks: ["columns-feature"], defaultContent: [] },
      { id: "rc13", name: "FAQ", selector: "#faq", style: "light", blocks: ["accordion-faq"], defaultContent: [] },
      { id: "rc14", name: "Disclaimer footnote", selector: "div.t-layout__one-column.standard-width.p-universal-bg-color--none.pad-top-40.pad-bottom-30.p-section__align--none.layout.layout--atge-one-column", style: null, blocks: [], defaultContent: ["div.t-layout__one-column.standard-width.p-universal-bg-color--none.pad-top-40.pad-bottom-30.p-section__align--none.layout.layout--atge-one-column"] }
    ]
  };
  var parsers = {
    "hero-overlay": parse,
    "columns-nav": parse2,
    "columns-approach": parse3,
    "quote-accent": parse4,
    "columns-dark": parse5,
    "columns-feature": parse6,
    "accordion-faq": parse7
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
  var import_our_story_default = {
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
  return __toCommonJS(import_our_story_exports);
})();
