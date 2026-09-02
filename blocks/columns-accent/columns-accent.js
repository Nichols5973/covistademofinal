export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-accent-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-accent-img-col');
        }
      }
    });
  });

  // Source alternates the image side between consecutive accent rows
  // (purpose = text left / image right, vision = image left / text right).
  // Determine this block's ordinal among all columns-accent blocks on the
  // page; odd-indexed instances render reversed (image on the left).
  const all = [...document.querySelectorAll('.columns-accent')];
  const index = all.indexOf(block);
  if (index % 2 === 1) {
    block.classList.add('columns-accent-reverse');
  }
}
