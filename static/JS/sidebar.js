document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("main section");
  const navLinks = document.querySelectorAll(".menu-link");

  function activateLinkOnScroll() {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 50) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(currentSection)) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", activateLinkOnScroll);
});
