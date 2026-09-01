// Covista header: cream utility bar + dark-green main nav with logo, dropdown
// menus (logo-mark + sub-links), and an expandable search. All copy/links/images
// live in content/nav.plain.html; this module reads that fragment and builds the
// interactive header. Generic + reusable — no site-specific names.

const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Load the nav fragment. Metadata-independent dual-fetch:
 * /content first (localhost / aem up), then root (DA/EDS production).
 */
async function loadNavFragment() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp;
}

function closeAllDropdowns(nav) {
  nav.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((li) => {
    li.setAttribute('aria-expanded', 'false');
  });
}

export default async function decorate(block) {
  const frag = await loadNavFragment();
  block.textContent = '';
  if (!frag) return;

  const sections = [...frag.children];
  // Expected order: [0] utility links, [1] brand/logo, [2] main nav list.
  const utilitySection = sections[0];
  const brandSection = sections[1];
  const navSection = sections[2];

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');

  // --- Row 1: utility bar ---
  const utilityBar = document.createElement('div');
  utilityBar.className = 'nav-utility';
  if (utilitySection) {
    const list = document.createElement('ul');
    utilitySection.querySelectorAll('a').forEach((a) => {
      const li = document.createElement('li');
      li.append(a);
      list.append(li);
    });
    utilityBar.append(list);
  }

  // --- Row 2: main bar (brand + nav + search) ---
  const mainBar = document.createElement('div');
  mainBar.className = 'nav-main';

  // Brand / logo
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  if (brandSection) {
    const logoLink = brandSection.querySelector('a');
    if (logoLink) brand.append(logoLink);
  }
  mainBar.append(brand);

  // Main nav list with dropdowns
  const navSections = document.createElement('div');
  navSections.className = 'nav-sections';
  if (navSection) {
    const topList = navSection.querySelector(':scope > ul');
    if (topList) {
      [...topList.children].forEach((li) => {
        const topLink = li.querySelector(':scope > a');
        const logoMark = li.querySelector(':scope > p');
        const subList = li.querySelector(':scope > ul');
        if (subList) {
          li.classList.add('nav-drop');
          li.setAttribute('aria-expanded', 'false');
          // Wrap the panel (logo-mark + sub-links) in a dropdown container
          const panel = document.createElement('div');
          panel.className = 'nav-dropdown';
          if (logoMark) panel.append(logoMark);
          panel.append(subList);
          // Keep the top-level label, then the panel
          li.textContent = '';
          if (topLink) li.append(topLink);
          li.append(panel);

          // Desktop: hover shows only the white underline (styled in CSS);
          // the panel opens on CLICK (matching the source). Mobile: click toggles.
          if (topLink) {
            topLink.addEventListener('click', (e) => {
              e.preventDefault();
              const open = li.getAttribute('aria-expanded') === 'true';
              closeAllDropdowns(nav);
              li.setAttribute('aria-expanded', open ? 'false' : 'true');
            });
          }
        }
      });
      navSections.append(topList);
    }
  }
  mainBar.append(navSections);

  // Search (expandable icon → input). Control built in JS per contract.
  const search = document.createElement('div');
  search.className = 'nav-search';
  const searchBtn = document.createElement('button');
  searchBtn.type = 'button';
  searchBtn.className = 'nav-search-toggle';
  searchBtn.setAttribute('aria-label', 'Search');
  searchBtn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2" d="M10.5 3a7.5 7.5 0 1 0 4.55 13.46l5 5 1.4-1.42-5-4.99A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z"/></svg>';
  const searchForm = document.createElement('form');
  searchForm.className = 'nav-search-form';
  searchForm.setAttribute('role', 'search');
  searchForm.action = '/search';
  searchForm.hidden = true;
  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.name = 'q';
  searchInput.placeholder = 'Search';
  searchInput.setAttribute('aria-label', 'Search');
  searchForm.append(searchInput);
  searchBtn.addEventListener('click', () => {
    const open = !searchForm.hidden;
    searchForm.hidden = open;
    if (!open) searchInput.focus();
  });
  search.append(searchBtn, searchForm);
  mainBar.append(search);

  // Hamburger (mobile)
  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span></span><span></span><span></span>';
  hamburger.addEventListener('click', () => {
    const open = nav.getAttribute('data-menu-open') === 'true';
    nav.setAttribute('data-menu-open', open ? 'false' : 'true');
    hamburger.setAttribute('aria-expanded', open ? 'false' : 'true');
    hamburger.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
  });
  mainBar.append(hamburger);

  nav.append(utilityBar, mainBar);

  // Close dropdowns on outside click / Escape
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) closeAllDropdowns(nav);
  });
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      closeAllDropdowns(nav);
      searchForm.hidden = true;
    }
  });

  // Reset state when crossing the desktop/mobile breakpoint
  isDesktop.addEventListener('change', () => {
    closeAllDropdowns(nav);
    nav.setAttribute('data-menu-open', 'false');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation');
    searchForm.hidden = true;
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(nav);
  block.append(wrapper);
}
