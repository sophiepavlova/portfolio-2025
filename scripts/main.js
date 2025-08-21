console.log("Hello from JS 👾");

// -----------------------------
// Nav highlighting setup
// -----------------------------
const currentFile = location.pathname.split('/').pop() || 'index.html';
const currentHash = location.hash.toLowerCase();
const fileNoParams = currentFile.split('?')[0].split('#')[0].toLowerCase();

const navLinks = [...document.querySelectorAll('.site-nav a[href]')];
const homeLink = navLinks.find(link => link.getAttribute('href').toLowerCase() === 'index.html');
const workLink = navLinks.find(link => {
  const href = link.getAttribute('href').toLowerCase();
  return ['#selected-work', 'index.html#selected-work', './index.html#selected-work'].includes(href);
});

const isCasePage = fileNoParams.startsWith('case');
const isWorkSection = fileNoParams === 'index.html' && currentHash === '#selected-work';

// Clear all active states initially
navLinks.forEach(link => {
  link.classList.remove('active');
  link.removeAttribute('aria-current');
});

// Initial active link logic
if (isCasePage || isWorkSection) {
  if (workLink) setActive(workLink);
} else {
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (
      href === currentFile ||
      href === `${currentFile}${currentHash}` ||
      (href.startsWith('#') && currentHash === href.toLowerCase())
    ) {
      setActive(link);
    }
  });
}

// Shared smooth scroll to work section
function scrollToWorkSection() {
  const section = document.querySelector('#selected-work');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
    if (workLink) setActive(workLink);
  }
}

// Work link click handler
if (workLink) {
  workLink.addEventListener('click', (e) => {
    if (fileNoParams !== 'index.html') {
      e.preventDefault();
      window.location.href = './index.html#selected-work';
    } else {
      e.preventDefault();
      scrollToWorkSection();
    }
  });
}

// "See my work" button click handler (uses same smooth scroll)
const seeMyWorkBtn = document.querySelector('a.button--primary[href="#selected-work"]');
if (seeMyWorkBtn) {
  seeMyWorkBtn.addEventListener('click', (e) => {
    e.preventDefault();
    scrollToWorkSection();
  });
}

// Case card click handler
document.querySelectorAll('a.work-card__link').forEach(cardLink => {
  cardLink.addEventListener('click', () => {
    if (workLink) setActive(workLink);
  });
});

// -----------------------------
// Scroll spy for Home & Work
// -----------------------------
const selectedWorkSection = document.querySelector('#selected-work');

if (selectedWorkSection && workLink && homeLink && fileNoParams === 'index.html') {
  function updateActiveMenuOnScroll() {
    const rect = selectedWorkSection.getBoundingClientRect();
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 0;

    // Only highlight "Work" when the section top is at or above header, and bottom is below header
    if (rect.top - headerHeight <= 0 && rect.bottom - headerHeight > 0) {
      setActive(workLink);
    } else {
      setActive(homeLink);
    }
  }

  window.addEventListener('scroll', updateActiveMenuOnScroll, { passive: true });
  window.addEventListener('resize', updateActiveMenuOnScroll);
  document.addEventListener('DOMContentLoaded', updateActiveMenuOnScroll);

  // Call once at start to ensure correct highlight on reload
  updateActiveMenuOnScroll();
}


function setActive(link) {
  navLinks.forEach(a => {
    a.classList.remove('active');
    a.removeAttribute('aria-current');
  });
  link.classList.add('active');
  link.setAttribute('aria-current', 'page');
}

// --- About page portrait click handler ---
const portraitEl = document.getElementById('portrait');
if (portraitEl) {
  const looks = [
    './assets/images/look1.jpg',
    './assets/images/look2.jpg',
    './assets/images/look3.jpg'
  ];
  let lastIndex = -1;
  portraitEl.addEventListener('click', () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * looks.length);
    } while (nextIndex === lastIndex);
    portraitEl.src = looks[nextIndex];
    lastIndex = nextIndex;
  });
}

// --- About page small pictures location ---
document.querySelectorAll('.hover-preview').forEach(preview => {
  const img = preview.querySelector('.hover-preview__img');
  
  preview.addEventListener('mouseenter', () => {
    const rect = preview.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const imgHeight = img.offsetHeight || 200; // fallback if not loaded
    
    if (spaceBelow < imgHeight + 20) {
      img.style.top = 'auto';
      img.style.bottom = '1.5em';
    } else {
      img.style.bottom = 'auto';
      img.style.top = '1.5em';
    }
  });
});

// Mobile menu logic
const menuToggle = document.querySelector('.menu-toggle');
const menuPanel = document.getElementById('mobile-menu');
const menuClose = menuPanel?.querySelector('.menu-close');
const mobileLinks = menuPanel?.querySelectorAll('.mobile-menu__nav a');

function openMenu() {
  menuPanel.setAttribute('aria-hidden', 'false');
  menuToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden'; // Prevent scroll behind
  // Focus first link
  setTimeout(() => {
    mobileLinks[0]?.focus();
  }, 100);
}

function closeMenu() {
  menuPanel.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  menuToggle.focus();
}

menuToggle?.addEventListener('click', openMenu);
menuClose?.addEventListener('click', closeMenu);

// Close on esc key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuPanel.getAttribute('aria-hidden') === 'false') {
    closeMenu();
  }
});

// Close when clicking a link
// mobileLinks?.forEach(link => {
//   link.addEventListener('click', closeMenu);
// });

mobileLinks?.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = link.getAttribute('href');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // 1. External or other-page links: let browser handle, do NOT close menu
    if (href.startsWith('http') ||
      (href.endsWith('.html') && !href.startsWith('#') && !currentPage.startsWith(href.replace(/#.*$/, '')))) {
      return;
    }

    // 2. Same-page anchor (e.g., #selected-work)
    if (href.startsWith('#')) {
      closeMenu();
      // Optionally scroll to anchor if needed
      return;
    }

    // 3. Link is index.html#anchor and you are ALREADY on index.html
    // (e.g. on Home, click "Work" which is href="index.html#selected-work")
    if (
      href.startsWith('index.html#') &&
      currentPage === 'index.html'
    ) {
      e.preventDefault();
      closeMenu();
      // Scroll to anchor (browser will do this by default, but you can force it if needed)
      const anchor = href.split('#')[1];
      if (anchor) {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // 4. For any other page+anchor, let browser navigate
    // (this covers the "from About, go to Work" scenario)
    // Overlay stays until browser navigates away
  });
});



function setActiveMenuLinks() {
  const allLinks = document.querySelectorAll('.site-nav a, .mobile-menu__nav a');
  const path = location.pathname.split('/').pop() || 'index.html';
  const hash = location.hash;

  allLinks.forEach(link => {
    // Remove old states
    link.classList.remove('active');
    link.removeAttribute('aria-current');
    // Home (index.html), only highlight if NOT a hash to section
    if (
      link.getAttribute('href') === "index.html" &&
      path === "index.html" &&
      (!hash || hash === "#")
    ) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
    // WORK: Highlight for selected-work anchor OR on case pages
    else if (
      // On home + #selected-work (desktop OR mobile menu)
      (
        (link.getAttribute('href') === "#selected-work" ||
         link.getAttribute('href') === "index.html#selected-work") &&
        (
          (path === "index.html" && hash === "#selected-work") ||
          /^case\d+\.html$/.test(path)
        )
      )
    ) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
    // About page
    else if (
      link.getAttribute('href') === "about.html" &&
      path === "about.html"
    ) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
    // Resume link (optional: highlight on external resume if wanted)
    else if (
      link.getAttribute('href') === "https://docs.google.com/document/d/.../view" &&
      location.href.includes("docs.google.com")
    ) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

// Run this on load and hashchange/popstate
setActiveMenuLinks();
window.addEventListener('hashchange', setActiveMenuLinks);
window.addEventListener('popstate', setActiveMenuLinks);

