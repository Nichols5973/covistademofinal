/* Builds a CRX/Vault content package with the nav + footer pages (crosswalk JCR)
   for upload via AEM Package Manager. Converts markdown → JCR via helix-md2jcr. */
import md2jcr from '/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-content-import/scripts/node_modules/@adobe/helix-md2jcr/src/md2jcr/index.js';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = '/workspace/current';
const SITE = '/content/covistademo1';
const OUT = path.join(ROOT, 'migration-work/nav-footer-package');

const models = JSON.parse(fs.readFileSync(path.join(ROOT, 'component-models.json'), 'utf8'));
const definition = JSON.parse(fs.readFileSync(path.join(ROOT, 'component-definition.json'), 'utf8'));
const filters = JSON.parse(fs.readFileSync(path.join(ROOT, 'component-filters.json'), 'utf8'));

// Sections separated by `---`. Matches the DOM sections header.js/footer.js parse.
const navMd = `[Employer Partners](/employer-partners)

[Media Resources](/news-insights/media-resources)

---

![Covista](/content/dam/covistademo1/covista-logo.svg)

---

- [Our Story](/our-story)
  - [Purpose, Vision & Values](/our-story/purpose-vision-values)
  - [Leadership](/our-story/leadership)
  - [Innovation](/our-story/innovation)
- [Our Institutions](/our-institutions)
  - [Institutions](/our-institutions/institutions)
  - [Alumni](/our-institutions/alumni)
- [Our Impact](/our-impact)
  - [Covista Foundation](/covista-foundation)
- [Join Us](/join-us)
  - [Careers Site](https://careers.covista.com)
- [Investors](https://investors.covista.com/overview/default.aspx)
  - [Financial News](https://investors.covista.com/press-releases)
  - [Events & Presentations](https://investors.covista.com/events-and-presentations/default.aspx)
  - [Stock Information](https://investors.covista.com/stock-info/default.aspx)
  - [Financials](https://investors.covista.com/financials/quarterly-results/default.aspx)
  - [Resources](https://investors.covista.com/resources/information-request-form/default.aspx)
- [News & Insights](/news-insights)
  - [Research](/research)
  - [Features](/news-insights/features)
  - [Press Releases](/news-insights/press-releases)
  - [Media Resources](/news-insights/media-resources)
`;

const footerMd = `![Covista](/content/dam/covistademo1/footer-logo.png)

233 S. Wacker Drive, Suite 800

Chicago, IL, 60606

![Covista logo mark](/content/dam/covistademo1/footer-logo-mark.svg)

---

- [Our Story](/our-story)
  - [Purpose, Vision & Values](/our-story/purpose-vision-values)
  - [Leadership](/our-story/leadership)
  - [Innovation](/our-story/innovation)
- [Our Institutions](/our-institutions)
  - [Institutions](/our-institutions/institutions)
  - [Alumni](/our-institutions/alumni)
- [Our Impact](/our-impact)
  - [Covista Foundation](/covista-foundation)
- [Join Us](/join-us)
  - [Careers Site](https://careers.covista.com)
- [Investors](https://investors.covista.com/overview/default.aspx)
  - [Financial News](https://investors.covista.com/press-releases)
  - [Events & Presentations](https://investors.covista.com/events-and-presentations/default.aspx)
  - [Stock Information](https://investors.covista.com/stock-info/default.aspx)
  - [Financials](https://investors.covista.com/financials/quarterly-results/default.aspx)
  - [Resources](https://investors.covista.com/resources/information-request-form/default.aspx)
- [News & Insights](/news-insights)
  - [Research](/research)
  - [Features](/news-insights/features)
  - [Press Releases](/news-insights/press-releases)
  - [Media Resources](/news-insights/media-resources)
- [Employer Partners](/employer-partners)
- [Contact Us](/contact)

---

© 2026 Covista Inc. All Rights Reserved

Covista™ is a trademark of Covista Inc. in the United States, European Union, United Kingdom, as well as certain other jurisdictions.

---

- [Privacy Policy](/privacy-policy)
- [Cookie Policy](/cookie-policy)
- [Accessibility](/accessibility)
- [Governance](/governance)

- [LinkedIn](https://www.linkedin.com/company/covista-official/)
- [Instagram](https://www.instagram.com/lifeatcovista_)
- [YouTube](https://www.youtube.com/channel/UCCcTofNvWpslEydQb-zEU9w)
`;

const opts = { componentModels: models, componentDefinition: definition, filters };

function writePage(name, xml) {
  const dir = path.join(OUT, 'jcr_root', SITE.slice(1), name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, '.content.xml'), xml, 'utf8');
  console.log(`wrote ${name}/.content.xml (${xml.length} bytes)`);
}

const navXml = await md2jcr(navMd, opts);
const footerXml = await md2jcr(footerMd, opts);
writePage('nav', navXml);
writePage('footer', footerXml);

// filter.xml
const metaDir = path.join(OUT, 'META-INF/vault');
fs.mkdirSync(metaDir, { recursive: true });
fs.writeFileSync(path.join(metaDir, 'filter.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<workspaceFilter version="1.0">
  <filter root="${SITE}/nav"/>
  <filter root="${SITE}/footer"/>
</workspaceFilter>
`, 'utf8');
fs.writeFileSync(path.join(metaDir, 'properties.xml'), `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
  <entry key="name">covista-nav-footer</entry>
  <entry key="group">covista</entry>
  <entry key="version">1.0</entry>
</properties>
`, 'utf8');

// zip it
const zipPath = path.join(ROOT, 'migration-work/covista-nav-footer.zip');
try { fs.unlinkSync(zipPath); } catch { /* noop */ }
execSync(`cd "${OUT}" && zip -r -q "${zipPath}" jcr_root META-INF`, { stdio: 'inherit' });
console.log(`\nPackage: ${zipPath}`);
