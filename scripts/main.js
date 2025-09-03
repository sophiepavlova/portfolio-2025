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
// const portraitEl = document.getElementById('portrait');
// if (portraitEl) {
//   const looks = [
//     './assets/images/about1.jpeg',
//     './assets/images/about2.jpeg',
//     './assets/images/about3.jpeg',
//     './assets/images/about5.jpeg',
//     './assets/images/about6.jpeg',
//     './assets/images/about7.jpeg',
//   ];
//   let lastIndex = -1;
//   portraitEl.addEventListener('click', () => {
//     let nextIndex;
//     do {
//       nextIndex = Math.floor(Math.random() * looks.length);
//     } while (nextIndex === lastIndex);
//     portraitEl.src = looks[nextIndex];
//     lastIndex = nextIndex;
//   });
// }

const portraitEl = document.getElementById('portrait');
if (portraitEl) {
  const originalSrc = './assets/images/portrait.jpg'; // original portrait
  const looks = [
    './assets/images/about1.jpeg',
    './assets/images/about2.jpeg',
    './assets/images/about3.jpeg',
    './assets/images/about5.jpeg',
    './assets/images/about6.jpeg',
    './assets/images/about7.jpeg',
  ];
  let lastIndex = -1;
  let resetTimeout;

  portraitEl.addEventListener('click', () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * looks.length);
    } while (nextIndex === lastIndex);
    lastIndex = nextIndex;
    portraitEl.src = looks[nextIndex];

    // Clear previous timer and set restore
    if (resetTimeout) clearTimeout(resetTimeout);
    resetTimeout = setTimeout(() => {
      portraitEl.src = originalSrc;
    }, 3000); // 3 seconds
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

// --------- Sticky Sidenav ScrollSpy & Hide-on-19px Logic ----------
(function() {
  const sideNav = document.getElementById('case-sidenav');
  if (!sideNav) return;
  const navLinks = sideNav.querySelectorAll('a');
  const anchorIds = Array.from(navLinks).map(link => link.getAttribute('href').replace('#',''));
  const sections = anchorIds.map(id => document.getElementById(id));

  function updateActiveLink() {
    const scrollY = window.scrollY;
    let lastActive = navLinks[0];
    for (let i = 0; i < sections.length; i++) {
      const el = sections[i];
      if (el && el.getBoundingClientRect().top + window.scrollY - 120 <= scrollY) {
        lastActive = navLinks[i];
      }
    }
    navLinks.forEach(link => {
      link.classList.remove('active');
      link.blur();
    });
    if (lastActive) lastActive.classList.add('active');
  }

  function updateSideNavVisibility() {
    if (!sideNav) return;
    const rect = sideNav.getBoundingClientRect();
    sideNav.style.display = (rect.left < 19) ? 'none' : '';
  }

  window.addEventListener('scroll', updateActiveLink);
  window.addEventListener('scroll', updateSideNavVisibility);
  window.addEventListener('resize', updateSideNavVisibility);
  document.addEventListener('DOMContentLoaded', () => {
    updateActiveLink();
    updateSideNavVisibility();
  });

  // Optional: Smooth scroll on anchor click
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const id = this.getAttribute('href').replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' });
      }
    });
  });
})();

// Responsive Jump Menu: Smooth scroll + offset fix
// (function() {
//   const jumpMenu = document.querySelector('.jump-menu');
//   if (!jumpMenu) return;
//   const links = jumpMenu.querySelectorAll('.jump-menu__link');
//   links.forEach(link => {
//     link.addEventListener('click', function(e) {
//       const href = this.getAttribute('href');
//       if (href && href.startsWith('#')) {
//         const id = href.replace('#', '');
//         const el = document.getElementById(id);
//         if (el) {
//           e.preventDefault();
//           // Offset by header height (adjust if you change header height)
//           const header = document.querySelector('.site-header');
//           const offset = header ? header.offsetHeight + 0 : 80;
//           const y = el.getBoundingClientRect().top + window.scrollY - offset;
//           window.scrollTo({ top: y, behavior: 'smooth' });
//         }
//       }
//     });
//   });
// })();
(function() {
  const jumpMenu = document.querySelector('.jump-menu');
  if (!jumpMenu) return;
  const links = jumpMenu.querySelectorAll('.jump-menu__link');
  const anchorIds = Array.from(links).map(link => link.getAttribute('href').replace('#',''));
  const sections = anchorIds.map(id => document.getElementById(id));
  // Get the offset (header height + margin)
  function getHeaderOffset() {
    const header = document.querySelector('.site-header');
    return header ? header.offsetHeight + 0 : 80;
  }

  function updateJumpMenuActive() {
    const scrollY = window.scrollY + getHeaderOffset() + 5; // +5 for tolerance
    let found = false;

    // Check from last to first (so the current section is found)
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = sections[i];
      if (el && el.offsetTop <= scrollY) {
        links.forEach(l => l.classList.remove('active'));
        links[i].classList.add('active');
        found = true;
        break;
      }
    }
    // If above the first section, clear all highlights!
    if (!found) {
      links.forEach(l => l.classList.remove('active'));
    }
  }

  // Listen for scroll and resize
  window.addEventListener('scroll', updateJumpMenuActive, { passive: true });
  window.addEventListener('resize', updateJumpMenuActive);
  document.addEventListener('DOMContentLoaded', updateJumpMenuActive);

  // Smooth scroll + update highlights after scroll
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          const y = el.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
          window.scrollTo({ top: y, behavior: 'smooth' });
          setTimeout(updateJumpMenuActive, 700);
          link.blur();
        }
      }
    });
  });
})();

// Fix for sticky :hover on touch devices
document.addEventListener('touchend', function() {
  try {
    // Remove hover by forcing a redraw
    document.body.style.cursor = 'pointer';
    setTimeout(() => { document.body.style.cursor = ''; }, 1);
  } catch(e) {}
}, { passive: true });

// --------- Back to Top Button ----------
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
