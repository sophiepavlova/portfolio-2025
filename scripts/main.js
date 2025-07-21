console.log("Hello from JS 👾");

const currentPage = location.pathname;
document.querySelectorAll('.site-nav a').forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});