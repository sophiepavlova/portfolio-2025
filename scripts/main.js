console.log("Hello from JS 👾");

// -----------------------------
// Nav highlighting setup for pretty URLs
// -----------------------------

// Get current path and section
const pathParts = location.pathname.split("/").filter(Boolean); // removes empty strings
const currentPage = pathParts[0] || "home"; // e.g. 'about', 'case1', 'home'
const currentHash = location.hash.toLowerCase();

const navLinks = [...document.querySelectorAll(".site-nav a[href]")];

// Accept any reasonable home href
const homeHrefs = [
  "index.html",
  "./index.html",
  "/index.html",
  "../index.html",
  "/",
];
const homeLink = navLinks.find((link) =>
  homeHrefs.includes(link.getAttribute("href"))
);
const workLink = navLinks.find(
  (link) => link.getAttribute("href") === "#selected-work"
);

// Helper: is this a case study page?
const isCasePage = currentPage.startsWith("case");
const isWorkSection =
  currentPage === "home" && currentHash === "#selected-work";

// Clear all active states initially
navLinks.forEach((link) => {
  link.classList.remove("active");
  link.removeAttribute("aria-current");
});

// Set active state for nav
if (isCasePage || isWorkSection) {
  if (workLink) setActive(workLink);
} else {
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    // Home: root or any index.html variant
    if (
      homeHrefs.includes(href) &&
      (location.pathname === "/" || location.pathname === "/index.html") &&
      (!currentHash || currentHash === "#")
    ) {
      setActive(link);
    }
    // Work: #selected-work on Home, or any case page
    else if (
      href === "#selected-work" &&
      ((location.pathname === "/" && currentHash === "#selected-work") ||
        (location.pathname === "/index.html" &&
          currentHash === "#selected-work") ||
        currentPage.startsWith("case"))
    ) {
      setActive(link);
    }
    // About page
    else if (
      (href === "/about/" || href === "../about/" || href === "about/") &&
      location.pathname.startsWith("/about/")
    ) {
      setActive(link);
    }
    // Highlight resume if external doc
    else if (
      href &&
      href.startsWith("https://docs.google.com") &&
      location.href.includes("docs.google.com")
    ) {
      setActive(link);
    }
  });
}

// Case card click handler
document.querySelectorAll("a.work-card__link").forEach((cardLink) => {
  cardLink.addEventListener("click", () => {
    if (workLink) setActive(workLink);
  });
});

// -----------------------------
// Scroll spy for Home & Work
// -----------------------------
const selectedWorkSection = document.querySelector("#selected-work");
if (selectedWorkSection && workLink && homeLink && currentPage === "home") {
  function updateActiveMenuOnScroll() {
    const rect = selectedWorkSection.getBoundingClientRect();
    const header = document.querySelector(".site-header");
    const headerHeight = header ? header.offsetHeight : 0;
    if (rect.top - headerHeight <= 0 && rect.bottom - headerHeight > 0) {
      setActive(workLink);
    } else {
      setActive(homeLink);
    }
  }

  window.addEventListener("scroll", updateActiveMenuOnScroll, {
    passive: true,
  });
  window.addEventListener("resize", updateActiveMenuOnScroll);
  document.addEventListener("DOMContentLoaded", updateActiveMenuOnScroll);
  updateActiveMenuOnScroll();
}

// Set active nav helper
function setActive(link) {
  navLinks.forEach((a) => {
    a.classList.remove("active");
    a.removeAttribute("aria-current");
  });
  link.classList.add("active");
  link.setAttribute("aria-current", "page");
}

// --- About page portrait click handler ---

const portraitEl = document.getElementById("portrait");
const fashionHighlight = document.querySelector(".about-fashion-highlight");

if (portraitEl) {
  const originalSrc = "../assets/images/portrait.jpg"; // original portrait
  const looks = [
    "../assets/images/about1.jpg",
    "../assets/images/about2.jpg",
    "../assets/images/about3.jpg",
    "../assets/images/about5.jpg",
    "../assets/images/about6.jpg",
    "../assets/images/about7.jpg",
  ];
  let lastIndex = -1;
  let resetTimeout;

  const changeLook = () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * looks.length);
    } while (nextIndex === lastIndex);
    lastIndex = nextIndex;
    portraitEl.src = looks[nextIndex];

    if (resetTimeout) clearTimeout(resetTimeout);
    resetTimeout = setTimeout(() => {
      portraitEl.src = originalSrc;
    }, 3000);
  };

  // Trigger on both photo and span clicks
  portraitEl.addEventListener("click", changeLook);
  fashionHighlight?.addEventListener("click", changeLook);
}

// --- About page small pictures location ---
document.querySelectorAll(".hover-preview").forEach((preview) => {
  const img = preview.querySelector(".hover-preview__img");

  preview.addEventListener("mouseenter", () => {
    const rect = preview.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const imgHeight = img.offsetHeight || 200; // fallback if not loaded

    if (spaceBelow < imgHeight + 20) {
      img.style.top = "auto";
      img.style.bottom = "1.5em";
    } else {
      img.style.bottom = "auto";
      img.style.top = "1.5em";
    }
  });
});

// -----------------------------
// Mobile menu logic
// -----------------------------
const menuToggle = document.querySelector(".menu-toggle");
const menuPanel = document.getElementById("mobile-menu");
const menuClose = menuPanel?.querySelector(".menu-close");
const mobileLinks = menuPanel?.querySelectorAll(".mobile-menu__nav a");

function openMenu() {
  menuPanel.setAttribute("aria-hidden", "false");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden"; // Prevent scroll behind
  // Focus first link
  // setTimeout(() => {
  //   mobileLinks[0]?.focus();
  // }, 100);
}

function closeMenu() {
  menuPanel.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
  menuToggle.focus();
}

menuToggle?.addEventListener("click", openMenu);
menuClose?.addEventListener("click", closeMenu);

// Close on esc key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menuPanel.getAttribute("aria-hidden") === "false") {
    closeMenu();
  }
});

// Close when clicking a link in mobile menu
mobileLinks?.forEach((link) => {
  link.addEventListener("click", function (e) {
    const href = link.getAttribute("href");
    const isHome =
      location.pathname === "/" || location.pathname === "/index.html";

    // External link: let browser handle, do NOT close menu.
    if (href.startsWith("http")) return;

    // Internal page link (starts with "/")—let browser handle.
    if (href.startsWith("/") && !href.startsWith("/#")) return;

    // "Work" link in mobile menu: on home page, close menu and scroll
    if ((href === "#selected-work" || href === "/#selected-work") && isHome) {
      e.preventDefault();
      closeMenu();
      setTimeout(() => {
        const section = document.querySelector("#selected-work");
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }

    // Other anchor links: close menu and scroll
    if (href.startsWith("#")) {
      closeMenu();
      const anchor = href.slice(1);
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
  });
});

// -----------------------------
// Set active links in both navs (desktop + mobile)
// -----------------------------
function setActiveMenuLinks() {
  const allLinks = document.querySelectorAll(
    ".site-nav a, .mobile-menu__nav a"
  );
  const pathParts = location.pathname.split("/").filter(Boolean);
  const currentPage = pathParts[0] || "home";
  const hash = location.hash;

  allLinks.forEach((link) => {
    link.classList.remove("active");
    link.removeAttribute("aria-current");
    // Home (root /), only highlight if NOT a hash to section
    if (
      link.getAttribute("href") === "/" &&
      currentPage === "home" &&
      (!hash || hash === "#")
    ) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
    // Work (selected-work anchor) or on any case page
    else if (
      link.getAttribute("href") === "#selected-work" &&
      ((currentPage === "home" && hash === "#selected-work") ||
        currentPage.startsWith("case"))
    ) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
    // About page
    else if (
      link.getAttribute("href") === "/about/" &&
      currentPage === "about"
    ) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
    // Resume (if you want to highlight when on resume page)
    else if (
      link.getAttribute("href") &&
      link.getAttribute("href").startsWith("https://docs.google.com") &&
      location.href.includes("docs.google.com")
    ) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

// Run this on load and on navigation events
setActiveMenuLinks();
window.addEventListener("hashchange", setActiveMenuLinks);
window.addEventListener("popstate", setActiveMenuLinks);

// --------- Sticky Sidenav ScrollSpy & Hide-on-19px Logic ----------
(function () {
  const sideNav = document.getElementById("case-sidenav");
  if (!sideNav) return;
  const navLinks = sideNav.querySelectorAll("a");
  const anchorIds = Array.from(navLinks).map((link) =>
    link.getAttribute("href").replace("#", "")
  );
  const sections = anchorIds.map((id) => document.getElementById(id));

  function updateActiveLink() {
    const scrollY = window.scrollY;
    let lastActive = navLinks[0];
    for (let i = 0; i < sections.length; i++) {
      const el = sections[i];
      if (
        el &&
        el.getBoundingClientRect().top + window.scrollY - 120 <= scrollY
      ) {
        lastActive = navLinks[i];
      }
    }
    navLinks.forEach((link) => {
      link.classList.remove("active");
      link.blur();
    });
    if (lastActive) lastActive.classList.add("active");
  }

  function updateSideNavVisibility() {
    if (!sideNav) return;
    const rect = sideNav.getBoundingClientRect();
    sideNav.style.display = rect.left < 19 ? "none" : "";
  }

  window.addEventListener("scroll", updateActiveLink);
  window.addEventListener("scroll", updateSideNavVisibility);
  window.addEventListener("resize", updateSideNavVisibility);
  document.addEventListener("DOMContentLoaded", () => {
    updateActiveLink();
    updateSideNavVisibility();
  });

  // Optional: Smooth scroll on anchor click
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const id = this.getAttribute("href").replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        // window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();

// Fix for sticky :hover on touch devices
document.addEventListener(
  "touchend",
  function () {
    try {
      document.body.style.cursor = "pointer";
      setTimeout(() => {
        document.body.style.cursor = "";
      }, 1);
    } catch (e) {}
  },
  { passive: true }
);
// 🍭Recolor the side menu when links overlap any blue strip
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("#case-sidenav nav a");
  const blues = document.querySelectorAll(".design-intro_bg");
  if (!links.length || !blues.length) return;

  const checkOverlap = () => {
    const blueRects = Array.from(blues).map((b) => b.getBoundingClientRect());

    links.forEach((link) => {
      const r = link.getBoundingClientRect();
      const midY = (r.top + r.bottom) / 2;

      // true if link midpoint is inside *any* blue section
      const onBlue = blueRects.some((b) => midY >= b.top && midY <= b.bottom);
      link.classList.toggle("on-dark", onBlue);
    });
  };

  window.addEventListener("scroll", checkOverlap, { passive: true });
  window.addEventListener("resize", checkOverlap);
  checkOverlap();
});

// --------- Back to Top Button ----------
const backToTop = document.getElementById("backToTop");
if (backToTop) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 350) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "auto" });
  });
}

// -----------------------------
// Scroll reveal animations
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".reveal, .hi--reveal"); // 👈 include highlights

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.1 }
  );

  reveals.forEach((el) => observer.observe(el));
});

// 📚Animation of the images inside the cards in cases on the Home page
document.addEventListener("DOMContentLoaded", () => {
  const phoneContainers = document.querySelectorAll(".case-card__phones");
  const standaloneImages = document.querySelectorAll(".image-animate");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Animate when first visible
          if (entry.target.classList.contains("case-card__phones")) {
            entry.target.querySelectorAll(".phone-animate").forEach((img) => {
              img.classList.add("animate-in");
            });
          }
          if (entry.target.classList.contains("image-animate")) {
            entry.target.classList.add("animate-in");
          }
          // Stop observing once animated (no reset when scrolling up)
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  phoneContainers.forEach((el) => observer.observe(el));
  standaloneImages.forEach((el) => observer.observe(el));
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".case-card").forEach((el) => observer.observe(el));

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const seeWorkBtn = document.querySelector(".hero__button");
  const selectedWork = document.querySelector(".selected-work");
  const header = document.querySelector(".site-header");

  // Only run this script if .selected-work exists (i.e. on the home page)
  if (!selectedWork) return;

  const startGlide = () => {
    body.classList.add("scrolled");
    const offset = header?.offsetHeight || 0;
    const y =
      selectedWork.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  let armed = true;
  window.addEventListener("scroll", () => {
    if (armed && window.scrollY > 2) {
      startGlide();
      armed = false;
    }
  });

  seeWorkBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    startGlide();
  });
});

// if (location.pathname === '/' || location.pathname === '/index.html') {
//   window.addEventListener('scroll', () => {
//     // As soon as the user moves even a little, start the glide
//     document.body.classList.toggle('scrolled', window.scrollY > 1);
//   }, { passive: true });

//   // safety: if the mobile menu ever left body locked, unlock it
//   document.body.style.overflow = '';
// }

// 🐹 Glide on the home screeen
(function homeGlide() {
  const onHome =
    location.pathname === "/" || location.pathname.endsWith("/index.html");

  if (!onHome) return;

  const header = document.querySelector(".site-header");
  const selectedWork = document.querySelector("#selected-work");
  const hero = document.querySelector(".hero");
  if (!selectedWork || !hero) return;

  const getHeaderH = () => (header ? header.offsetHeight : 0);

  function glideToSelectedWork() {
    document.body.classList.add("scrolled");
    const y =
      selectedWork.getBoundingClientRect().top + window.scrollY - getHeaderH();
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  window.__glideToSelectedWork = glideToSelectedWork;

  const anchors = document.querySelectorAll(
    'a[href="#selected-work"], a[href="/#selected-work"]'
  );
  anchors.forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      glideToSelectedWork();
    });
  });

  let armed = true;
  window.addEventListener(
    "scroll",
    () => {
      // Don't auto-glide if user is already at #selected-work
      const alreadyAtWork =
        location.hash === "#selected-work" ||
        selectedWork.getBoundingClientRect().top <= getHeaderH();

      if (
        armed &&
        window.scrollY > 2 &&
        window.scrollY < window.innerHeight * 0.5 &&
        !alreadyAtWork
      ) {
        armed = false;
        glideToSelectedWork();
      }
    },
    { passive: true }
  );

  // window.addEventListener('scroll', () => {
  //   hero.style.position = (window.scrollY > window.innerHeight) ? 'relative' : 'fixed';
  // }, { passive: true });
})();

// 🐹 End of Glide on the home screeen

// Optional: tune breakpoint if needed
// 📚 Hide .hero only after scrolling down
const hero = document.querySelector(".home .hero");

if (hero) {
  window.addEventListener("scroll", () => {
    if (window.innerWidth < 600) {
      const isPastHero = window.scrollY > window.innerHeight * 0.5;
      hero.dataset.hidden = isPastHero ? "true" : "false";
    } else {
      hero.dataset.hidden = "false";
    }
  });
}
// 📚END:  Hide .hero only after scrolling down

// 🦉About page, the last element of the cards, the automatically changing of the photos in the 8th element
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".about-photo-slider");
  if (!slider) return; // 🧊 Exit early if not on the About page

  const slides = Array.from(
    slider.querySelectorAll(".about-photo-slider__img")
  );
  if (slides.length === 0) return; // 🧊 Extra guard

  const interval = 3000; // ms per photo
  const duration = 800; // ms slide animation
  const wheelThreshold = 80; // wheel deltaY to trigger once
  const swipeThreshold = 50; // px for manual swipe
  let current = 0;
  let timer = null;
  let isAnimating = false;
  let wheelAccum = 0;
  let touchStartY = 0;

  // --- helpers
  function setImmediateState(index, state) {
    const s = slides[index];
    if (!s) return; // ✅ prevents "undefined.style" errors

    s.style.transition = "none";
    if (state === "below") {
      s.style.transform = "translateY(100%)";
      s.style.opacity = "1";
      s.classList.remove("is-active");
      s.style.zIndex = 1;
    } else if (state === "active") {
      s.style.transform = "translateY(0)";
      s.style.opacity = "1";
      s.classList.add("is-active");
      s.style.zIndex = 2;
    } else if (state === "above") {
      s.style.transform = "translateY(-100%)";
      s.style.opacity = "0";
      s.classList.remove("is-active");
      s.style.zIndex = 1;
    }
    s.offsetHeight; // force reflow
  }

  // --- animations
  function animatePair(fromIdx, toIdx, direction = "up") {
    const from = slides[fromIdx];
    const to = slides[toIdx];
    if (!from || !to) return;

    setImmediateState(toIdx, direction === "up" ? "below" : "above");

    from.style.transition =
      to.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;

    requestAnimationFrame(() => {
      from.style.transform =
        direction === "up" ? "translateY(-100%)" : "translateY(100%)";
      from.style.opacity = "0";
      from.style.zIndex = 3;

      to.style.transform = "translateY(0)";
      to.style.opacity = "1";
      to.style.zIndex = 2;
      to.classList.add("is-active");
    });

    // cleanup
    setTimeout(() => {
      setImmediateState(fromIdx, "below");
      slides.forEach((s, i) => {
        if (i !== toIdx) s.classList.remove("is-active");
      });
      isAnimating = false;
    }, duration);
  }

  // --- forward / backward logic
  function showNext() {
    if (isAnimating) return;
    isAnimating = true;
    const next = (current + 1) % slides.length;
    animatePair(current, next, "up");
    current = next;
    resetAuto();
  }

  function showPrev() {
    if (isAnimating) return;
    isAnimating = true;
    const prev = (current - 1 + slides.length) % slides.length;
    animatePair(current, prev, "down");
    current = prev;
    resetAuto();
  }

  // --- autoplay controls
  function startAuto() {
    stopAuto();
    timer = setInterval(showNext, interval);
  }
  function stopAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
  function resetAuto() {
    stopAuto();
    startAuto();
  }

  // --- initialization
  slides.forEach((_, i) => setImmediateState(i, i === 0 ? "active" : "below"));
  startAuto();

  // --- manual swipe (touch)
  slider.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  slider.addEventListener(
    "touchend",
    (e) => {
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (
        Math.abs(diff) > swipeThreshold &&
        Math.abs(diff) < 200 &&
        !isAnimating
      ) {
        if (diff > 0) showNext();
        else showPrev();
      }
    },
    { passive: true }
  );

  // --- manual wheel (desktop)
  slider.addEventListener(
    "wheel",
    (e) => {
      if (window.innerWidth > 900) e.preventDefault();
      if (isAnimating) return;

      wheelAccum += e.deltaY;
      if (wheelAccum > wheelThreshold) {
        wheelAccum = 0;
        showNext();
      } else if (wheelAccum < -wheelThreshold) {
        wheelAccum = 0;
        showPrev();
      }
    },
    { passive: false }
  );
});

// 🦉🦉END: About page, the last element of the cards, the automaticall changing of the photos in the 8-th element

// 😎Cursor label
document.addEventListener("DOMContentLoaded", () => {
  // 🧊 Disable feature on tablet & mobile
  if (window.innerWidth <= 1024) return;

  const label = document.getElementById("cursor-label");
  if (!label) return;

  const cards = document.querySelectorAll(".case-card");
  cards.forEach((card) => {
    const link = card.querySelector(".case-card__link");
    const isInactive = link?.classList.contains("case-card__link--nonactive");
    const text = isInactive
      ? `<span class="cursor-icon">✨</span> Coming soon :)`
      : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.33333 2H5.33333C6.04058 2 6.71885 2.28095 7.21895 2.78105C7.71905 3.28115 8 3.95942 8 4.66667V14C8 13.4696 7.78929 12.9609 7.41421 12.5858C7.03914 12.2107 6.53043 12 6 12H1.33333V2Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14.6667 2H10.6667C9.95942 2 9.28115 2.28095 8.78105 2.78105C8.28095 3.28115 8 3.95942 8 4.66667V14C8 13.4696 8.21071 12.9609 8.58579 12.5858C8.96086 12.2107 9.46957 12 10 12H14.6667V2Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
    </svg> Read case study`;

    card.addEventListener("mouseenter", () => {
      label.innerHTML = text;
      label.classList.add("cursor-label--visible");
      label.classList.toggle("cursor-label--inactive", isInactive);
    });

    card.addEventListener("mousemove", (e) => {
      label.style.top = `${e.clientY + 35}px`;
      label.style.left = `${e.clientX + 85}px`;
    });

    card.addEventListener("mouseleave", () => {
      label.classList.remove("cursor-label--visible");
    });
  });
});

// 😎End Cursor label
//🍊 --- Floating flower click effect (About page only) ---
document.addEventListener("DOMContentLoaded", () => {
  const aboutPage = document.querySelector(".about-page");
  if (!aboutPage) return;

  // 🌸 Array of available flower images
  const flowerImages = [
    "../assets/shapes/flower_red.svg",
    "../assets/shapes/flower_blue.svg",
    // add more later e.g. "../assets/shapes/flower_yellow.svg"
  ];

  document.querySelectorAll(".about-card").forEach((card) => {
    card.addEventListener("click", () => {
      const randomFlower =
        flowerImages[Math.floor(Math.random() * flowerImages.length)];
      const flower = document.createElement("img");
      flower.src = randomFlower;
      flower.classList.add("floating-flower");

      const rect = card.getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const startY = rect.bottom + window.scrollY + 20; // below card

      flower.style.left = `${startX}px`;
      flower.style.top = `${startY}px`;
      document.body.appendChild(flower);

      // 🌿 Randomized curved + breezy motion
      const arcHeight = 100 + Math.random() * 200;
      const distanceX =
        (Math.random() > 0.5 ? 1 : -1) * (300 + Math.random() * 200);
      const distanceY = -400 - Math.random() * 200;
      const rotation =
        (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 180);
      const sway = 30 + Math.random() * 40; // horizontal sway amplitude

      const animation = flower.animate(
        [
          {
            transform: "translate(-50%, 40px) scale(0.4) rotate(0deg)",
            opacity: 0,
          },
          {
            transform: `translate(calc(-50% + ${
              distanceX * 0.25
            }px), ${-arcHeight}px) scale(1) rotate(${rotation / 2}deg)`,
            opacity: 1,
            offset: 0.25,
          },
          {
            transform: `translate(calc(-50% + ${distanceX * 0.5}px), ${
              distanceY * 0.4
            }px) scale(1.3) rotate(${
              rotation * 0.75
            }deg) translateX(${sway}px)`,
            opacity: 1,
            offset: 0.6,
          },
          {
            transform: `translate(calc(-50% + ${distanceX}px), ${distanceY}px) scale(1.6) rotate(${rotation}deg) translateX(-${sway}px)`,
            opacity: 0,
          },
        ],
        {
          duration: 4500,
          easing: "cubic-bezier(0.3, 0.6, 0.4, 1)",
          fill: "forwards",
        }
      );

      animation.onfinish = () => flower.remove();
    });
  });
});

//🍊 END--- Floating flower click effect (About page only) ---
// 🥦The unerline on hover in About page (measure lines → draw bars)

// 🥦End:The unerline on hover in About page

// 🩰 Smooth scrolling for the Jump Menu (mobile/tablet)
document.addEventListener("DOMContentLoaded", () => {
  const jumpMenu = document.querySelector(".jump-menu");
  if (!jumpMenu) return;

  const header = document.querySelector(".site-header");
  const headerOffset = header ? header.offsetHeight + 8 : 80;
  const links = jumpMenu.querySelectorAll(".jump-menu__link[href^='#']");

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const targetY =
        target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: targetY, behavior: "smooth" });

      // Optional: briefly highlight the target section
      target.classList.add("section-flash");
      setTimeout(() => target.classList.remove("section-flash"), 800);
    });
  });
});
// 🩰END: Smooth scrolling for the Jump Menu (mobile/tablet)

// 🧊 Hide header when scrolling down, show when scrolling up
(() => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let lastY = window.scrollY;

  const update = () => {
    const y = window.scrollY;
    if (y > lastY && y > 80) {
      header.classList.add("hidden");
    } else {
      header.classList.remove("hidden");
    }
    lastY = y;
  };

  window.addEventListener("scroll", update, { passive: true });
})();

// END:🧊 Hide header when scrolling down, show when scrolling up

// 🧩 Smooth scroll ONLY for the inline "click here" link in Design Highlights
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const headerHeight = header ? header.offsetHeight : 0;
  const specialLink = document.querySelector(
    '.inline-link[href="#nav-problem"]'
  );

  if (specialLink) {
    specialLink.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById("nav-problem");
      if (!target) return;

      const offsetTop =
        target.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    });
  }
});
