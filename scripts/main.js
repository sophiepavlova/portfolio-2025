console.log("Hello from JS 👾");

// -----------------------------
// Nav highlighting setup for pretty URLs
// -----------------------------

// Get current path and section
const pathParts = location.pathname.split('/').filter(Boolean); // removes empty strings
const currentPage = pathParts[0] || 'home'; // e.g. 'about', 'case1', 'home'
const currentHash = location.hash.toLowerCase();

const navLinks = [...document.querySelectorAll('.site-nav a[href]')];

// Accept any reasonable home href
const homeHrefs = ['index.html', './index.html', '/index.html', '../index.html', '/'];
const homeLink = navLinks.find(link =>
  homeHrefs.includes(link.getAttribute('href'))
);
const workLink = navLinks.find(link =>
  link.getAttribute('href') === '#selected-work'
);

// Helper: is this a case study page?
const isCasePage = currentPage.startsWith('case');
const isWorkSection = (currentPage === 'home' && currentHash === '#selected-work');

// Clear all active states initially
navLinks.forEach(link => {
  link.classList.remove('active');
  link.removeAttribute('aria-current');
});

// Set active state for nav
if (isCasePage || isWorkSection) {
  if (workLink) setActive(workLink);
} else {
  navLinks.forEach(link => {
  const href = link.getAttribute('href');
  // Home: root or any index.html variant
  if (
    homeHrefs.includes(href) &&
    (
      location.pathname === '/' ||
      location.pathname === '/index.html'
    ) &&
    (!currentHash || currentHash === "#")
  ) {
    setActive(link);
  }
  // Work: #selected-work on Home, or any case page
  else if (
    (href === "#selected-work") &&
    (
      (location.pathname === '/' && currentHash === "#selected-work") ||
      (location.pathname === '/index.html' && currentHash === "#selected-work") ||
      currentPage.startsWith('case')
    )
  ) {
    setActive(link);
  }
  // About page
  else if (
    (href === "/about/" || href === "../about/" || href === "about/") &&
    (location.pathname.startsWith('/about/'))
  ) {
    setActive(link);
  }
  // Highlight resume if external doc
  else if (
    href && href.startsWith("https://docs.google.com") &&
    location.href.includes("docs.google.com")
  ) {
    setActive(link);
  }
});

}

// Shared smooth scroll to work section
function scrollToWorkSection() {
  const section = document.querySelector('#selected-work');
  if (!section) return;

  // trigger the glide animation
  document.body.classList.add('scrolled');

  // calculate header height
  const header = document.querySelector('.site-header');
  const headerHeight = header ? header.offsetHeight : 0;

  // scroll so the section sits directly below the header (no blue gap)
  const y = section.getBoundingClientRect().top + window.scrollY - headerHeight;

  window.scrollTo({ top: y, behavior: 'smooth' });

  if (workLink) setActive(workLink);
}



// Work link click handler
if (workLink) {
  workLink.addEventListener('click', (e) => {
    if (currentPage !== 'home') {
      // Go to home, then scroll
      e.preventDefault();
      window.location.href = '/#selected-work';
    } else {
      // On home, just scroll
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

document.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero");
  const selectedWork = document.querySelector(".selected-work");

  if (!hero || !selectedWork) return;

  // When user scrolls past hero height, stop fixing the hero
  if (window.scrollY > window.innerHeight) {
    hero.style.position = "relative";
  } else {
    hero.style.position = "fixed";
  }
});



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
if (selectedWorkSection && workLink && homeLink && currentPage === 'home') {
  function updateActiveMenuOnScroll() {
    const rect = selectedWorkSection.getBoundingClientRect();
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 0;
    if (rect.top - headerHeight <= 0 && rect.bottom - headerHeight > 0) {
      setActive(workLink);
    } else {
      setActive(homeLink);
    }
  }

  window.addEventListener('scroll', updateActiveMenuOnScroll, { passive: true });
  window.addEventListener('resize', updateActiveMenuOnScroll);
  document.addEventListener('DOMContentLoaded', updateActiveMenuOnScroll);
  updateActiveMenuOnScroll();
}

// Set active nav helper
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
  const originalSrc = '../assets/images/portrait.jpg'; // original portrait
  const looks = [
    '../assets/images/about1.jpg',
    '../assets/images/about2.jpg',
    '../assets/images/about3.jpg',
    '../assets/images/about5.jpg',
    '../assets/images/about6.jpg',
    '../assets/images/about7.jpg',
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

// -----------------------------
// Mobile menu logic
// -----------------------------
const menuToggle = document.querySelector('.menu-toggle');
const menuPanel = document.getElementById('mobile-menu');
const menuClose = menuPanel?.querySelector('.menu-close');
const mobileLinks = menuPanel?.querySelectorAll('.mobile-menu__nav a');

function openMenu() {
  menuPanel.setAttribute('aria-hidden', 'false');
  menuToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden'; // Prevent scroll behind
  // Focus first link
  // setTimeout(() => {
  //   mobileLinks[0]?.focus();
  // }, 100);
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

// Close when clicking a link in mobile menu
mobileLinks?.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = link.getAttribute('href');
    const isHome = location.pathname === "/" || location.pathname === "/index.html";

    // External link: let browser handle, do NOT close menu.
    if (href.startsWith('http')) return;

    // Internal page link (starts with "/")—let browser handle.
    if (href.startsWith('/') && !href.startsWith('/#')) return;

    // "Work" link in mobile menu: on home page, close menu and scroll
    if ((href === "#selected-work" || href === "/#selected-work") && isHome) {
      e.preventDefault();
      closeMenu();
      setTimeout(() => {
        const section = document.querySelector('#selected-work');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    // Other anchor links: close menu and scroll
    if (href.startsWith('#')) {
      closeMenu();
      const anchor = href.slice(1);
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
  });
});


// -----------------------------
// Set active links in both navs (desktop + mobile)
// -----------------------------
function setActiveMenuLinks() {
  const allLinks = document.querySelectorAll('.site-nav a, .mobile-menu__nav a');
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentPage = pathParts[0] || 'home';
  const hash = location.hash;

  allLinks.forEach(link => {
    link.classList.remove('active');
    link.removeAttribute('aria-current');
    // Home (root /), only highlight if NOT a hash to section
    if (
      link.getAttribute('href') === "/" &&
      currentPage === "home" &&
      (!hash || hash === "#")
    ) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
    // Work (selected-work anchor) or on any case page
    else if (
      link.getAttribute('href') === "#selected-work" &&
      (
        (currentPage === "home" && hash === "#selected-work") ||
        currentPage.startsWith('case')
      )
    ) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
    // About page
    else if (
      link.getAttribute('href') === "/about/" &&
      currentPage === "about"
    ) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
    // Resume (if you want to highlight when on resume page)
    else if (
      link.getAttribute('href') && link.getAttribute('href').startsWith("https://docs.google.com") &&
      location.href.includes("docs.google.com")
    ) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

// Run this on load and on navigation events
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
(function() {
  const jumpMenu = document.querySelector('.jump-menu');
  if (!jumpMenu) return;
  const links = jumpMenu.querySelectorAll('.jump-menu__link');
  const anchorIds = Array.from(links).map(link => link.getAttribute('href').replace('#',''));
  const sections = anchorIds.map(id => document.getElementById(id));
  function getHeaderOffset() {
    const header = document.querySelector('.site-header');
    return header ? header.offsetHeight + 0 : 80;
  }

  function updateJumpMenuActive() {
    const scrollY = window.scrollY + getHeaderOffset() + 5;
    let found = false;
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = sections[i];
      if (el && el.offsetTop <= scrollY) {
        links.forEach(l => l.classList.remove('active'));
        links[i].classList.add('active');
        found = true;
        break;
      }
    }
    if (!found) {
      links.forEach(l => l.classList.remove('active'));
    }
  }

  window.addEventListener('scroll', updateJumpMenuActive, { passive: true });
  window.addEventListener('resize', updateJumpMenuActive);
  document.addEventListener('DOMContentLoaded', updateJumpMenuActive);

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

// -----------------------------
// Scroll reveal animations
// -----------------------------
// document.addEventListener("DOMContentLoaded", () => {
//   const reveals = document.querySelectorAll(".reveal");

//   const observer = new IntersectionObserver((entries, obs) => {
//     entries.forEach(entry => {
//       if (entry.isIntersecting) {
//         entry.target.classList.add("visible");
//         obs.unobserve(entry.target); // animate only once
//       }
//     });
//   }, { threshold: 0.1 });

//   reveals.forEach(el => observer.observe(el));
// });

document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");   // show + animate
      } else {
        entry.target.classList.remove("visible"); // reset when out of view
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
});

document.addEventListener("DOMContentLoaded", () => {
  const phoneContainers = document.querySelectorAll(".case-card__phones");
  const standaloneImages = document.querySelectorAll(".image-animate");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // For phone containers: animate all children
        if (entry.target.classList.contains("case-card__phones")) {
          entry.target.querySelectorAll(".phone-animate").forEach(img => {
            img.classList.add("animate-in");
          });
        }

        // For standalone images
        if (entry.target.classList.contains("image-animate")) {
          entry.target.classList.add("animate-in");
        }
      } else {
        // Reset on scroll out
        if (entry.target.classList.contains("case-card__phones")) {
          entry.target.querySelectorAll(".phone-animate").forEach(img => {
            img.classList.remove("animate-in");
          });
        }
        if (entry.target.classList.contains("image-animate")) {
          entry.target.classList.remove("animate-in");
        }
      }
    });
  }, { threshold: 0.3 });

  phoneContainers.forEach(el => observer.observe(el));
  standaloneImages.forEach(el => observer.observe(el));
});



document.addEventListener("DOMContentLoaded", () => {
  const seeWorkBtn = document.querySelector(".hero__button");
  const selectedWork = document.querySelector(".selected-work");

  if (seeWorkBtn && selectedWork) {
    seeWorkBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const header = document.querySelector(".site-header");
      const offset = header ? header.offsetHeight + 50 : 50; // keep 50px visual gap
      const targetY =
        selectedWork.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    });
  }
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.5 });

document.querySelectorAll('.case-card').forEach(el => observer.observe(el));

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const seeWorkBtn = document.querySelector(".hero__button");
  const selectedWork = document.querySelector(".selected-work");
  const header = document.querySelector(".site-header");

  const startGlide = () => {
    body.classList.add("scrolled");
    // Align the viewport so Selected Work starts nicely under the header
    const offset = (header?.offsetHeight || 0) + 50;
    const y = selectedWork.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  // Start glide as soon as the user actually scrolls (no dead zone)
  let armed = true;
  window.addEventListener("scroll", () => {
    if (armed && window.scrollY > 2) {
      startGlide();
      armed = false;
    }
  });

  // Button triggers the same glide
  seeWorkBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    startGlide();
  });
});

if (location.pathname === '/' || location.pathname === '/index.html') {
  window.addEventListener('scroll', () => {
    // As soon as the user moves even a little, start the glide
    document.body.classList.toggle('scrolled', window.scrollY > 1);
  }, { passive: true });

  // safety: if the mobile menu ever left body locked, unlock it
  document.body.style.overflow = '';
}
