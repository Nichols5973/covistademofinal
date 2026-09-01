/* Builds a CRX/Vault DAM asset package for the nav/footer logo images so
   /content/dam/covistademo1/* resolves in AEM. Upload via Package Manager. */
import JSZip from '/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-content-import/scripts/node_modules/jszip/lib/index.js';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = '/workspace/current';
const DAM = 'content/dam/covistademo1';
const zip = new JSZip();

const assets = [
  { file: 'content/images/covista-logo.svg', name: 'covista-logo.svg', mime: 'image/svg+xml' },
  { file: 'content/images/footer-logo.png', name: 'footer-logo.png', mime: 'image/png' },
  { file: 'content/images/footer-logo-mark.svg', name: 'footer-logo-mark.svg', mime: 'image/svg+xml' },
];

// dam:Asset .content.xml — declares the asset, jcr:content metadata, and the
// renditions FOLDER only. The binary rendition is added as a plain file so
// FileVault imports it as an nt:file/nt:resource automatically (no conflict).
function assetContentXml(mime) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0" xmlns:dam="http://www.day.com/dam/1.0" xmlns:dc="http://purl.org/dc/elements/1.1/"
    jcr:primaryType="dam:Asset">
  <jcr:content jcr:primaryType="dam:AssetContent">
    <metadata jcr:primaryType="nt:unstructured" dc:format="${mime}"/>
    <renditions jcr:primaryType="nt:folder"/>
  </jcr:content>
</jcr:root>
`;
}

// DAM folder node
zip.file(`jcr_root/${DAM}/.content.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    jcr:primaryType="sling:OrderedFolder"/>
`);

const filters = [];
for (const a of assets) {
  const bin = fs.readFileSync(path.join(ROOT, a.file));
  const assetPath = `jcr_root/${DAM}/${a.name}`;
  zip.file(`${assetPath}/.content.xml`, assetContentXml(a.mime));
  // binary as plain file -> FileVault wraps as nt:file at renditions/original
  zip.file(`${assetPath}/_jcr_content/renditions/original`, bin);
  filters.push(`  <filter root="/${DAM}/${a.name}"/>`);
}

zip.file('META-INF/vault/filter.xml', `<?xml version="1.0" encoding="UTF-8"?>
<workspaceFilter version="1.0">
${filters.join('\n')}
</workspaceFilter>
`);
zip.file('META-INF/vault/properties.xml', `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
  <entry key="name">covista-dam-assets</entry>
  <entry key="group">covista</entry>
  <entry key="version">1.0</entry>
</properties>
`);

const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
fs.mkdirSync(path.join(ROOT, 'tools/importer/packages'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'tools/importer/packages/covista-dam-assets.zip'), buf);
console.log('wrote covista-dam-assets.zip', buf.length, 'bytes,', assets.length, 'assets');
