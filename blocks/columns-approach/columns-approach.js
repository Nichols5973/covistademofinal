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
