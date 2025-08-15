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
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(workLink);
        } else {
          setActive(homeLink);
        }
      });
    },
    {
      root: null,
      threshold: 0.3 // 30% visible = active
    }
  );
  observer.observe(selectedWorkSection);
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
