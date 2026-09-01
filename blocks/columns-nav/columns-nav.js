// Maps each in-page anchor (nav link hash) to the migrated block whose section
// it should scroll to. The source page uses #approach / #name / #faq.
const ANCHOR_TARGETS = {
  approach: 'columns-approach',
  name: 'columns-dark',
  faq: 'accordion-faq',
};

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-nav-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-nav-img-col');
        }
      }
    });
  });

  // In-page anchor navigation with scroll-spy: assign the anchor target ids to
  // the matching section, then highlight the nav link for the section in view.
  const anchorLinks = [...block.querySelectorAll('a[href^="#"]')]
    .filter((a) => (a.getAttribute('href') || '').length > 1);
  if (!anchorLinks.length) return;

  // Resolve each anchor to a section element and ensure it carries the target id.
  const entries = anchorLinks.map((link) => {
    const id = link.getAttribute('href').slice(1);
    let section = document.getElementById(id);
    if (!section) {
      const blockName = ANCHOR_TARGETS[id];
      const targetBlock = blockName ? document.querySelector(`.${blockName}`) : null;
      section = targetBlock ? (targetBlock.closest('.section') || targetBlock) : null;
      if (section && !section.id) section.id = id;
    }
    return { link, section };
  }).filter((e) => e.section);
  if (!entries.length) return;

  const setActive = (activeLink) => {
    anchorLinks.forEach((a) => a.classList.toggle('columns-nav-link-active', a === activeLink));
  };

  // Scroll-spy: the section whose top is nearest below the sticky bar is active.
  const observer = new IntersectionObserver((observed) => {
    observed.forEach((entry) => {
      if (entry.isIntersecting) {
        const match = entries.find((e) => e.section === entry.target);
        if (match) setActive(match.link);
      }
    });
  }, { rootMargin: '-73px 0px -60% 0px', threshold: 0 });

  entries.forEach((e) => observer.observe(e.section));

  // Clicking a link marks it active immediately (before the scroll settles).
  entries.forEach(({ link }) => {
    link.addEventListener('click', () => setActive(link));
  });
}
