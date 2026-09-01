// Feature icons in source order. Served from the code origin (relative to this
// module) so they render in AEM regardless of DAM/CSS path resolution.
const FEATURE_ICONS = [
  'icon-expanding-access.png',
  'icon-preparing-professionals.png',
  'icon-connecting-students.png',
  'icon-serving-communities.png',
  'icon-powering-purpose.png',
];

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-approach-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-approach-img-col');
        }
      }
    });
  });

  // The right column is a flat list of h3 + paragraph(s) per feature. Group each
  // heading with its following content into a "feature" row so the (CSS) icon
  // sits in a left column and the heading + copy sit flush to its right,
  // matching the source layout.
  const row = block.firstElementChild;
  const textCol = row && row.children[1];
  if (textCol && textCol.querySelector('h3')) {
    const features = [];
    let current = null;
    [...textCol.children].forEach((node) => {
      if (node.tagName === 'H3') {
        current = document.createElement('div');
        current.className = 'columns-approach-feature';
        // Icon as a real <img> from the code origin (mirrors the logo fix).
        const iconName = FEATURE_ICONS[features.length];
        if (iconName) {
          const icon = document.createElement('img');
          icon.className = 'columns-approach-feature-icon';
          icon.src = new URL(`../../icons/${iconName}`, import.meta.url).href;
          icon.alt = '';
          icon.setAttribute('aria-hidden', 'true');
          current.append(icon);
        }
        const body = document.createElement('div');
        body.className = 'columns-approach-feature-body';
        body.append(node);
        current.append(body);
        features.push(current);
      } else if (current) {
        current.querySelector('.columns-approach-feature-body').append(node);
      }
    });
    if (features.length) {
      textCol.textContent = '';
      textCol.classList.add('columns-approach-features');
      features.forEach((f) => textCol.append(f));
    }
  }
}
