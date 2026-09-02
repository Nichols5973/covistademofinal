export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-links-${cols.length}-cols`);

  // The links column is the cell that has no heading — tag it so CSS can
  // render its links as a stacked, arrow-led "explore more" list.
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      if (!col.querySelector('h1, h2, h3, h4') && col.querySelector('a')) {
        col.classList.add('columns-links-list-col');
      }
    });
  });
}
