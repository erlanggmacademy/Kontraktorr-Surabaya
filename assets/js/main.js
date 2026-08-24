/**
 * main.js — Kontraktor Surabaya
 * Brand: Maroon | Platform: Bootstrap 5
 */

(function () {
  "use strict";

  /* ── Navbar & Back to top scroll effect ── */
  const navbar = document.getElementById("navbar");
  const bttElements = document.querySelectorAll("#back-to-top, #scroll-top-btn, .scroll-top");

  function onScroll() {
    if (navbar) {
      if (window.scrollY > 60) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }
    // Back to top visibility
    bttElements.forEach((el) => {
      el.classList.toggle("visible", window.scrollY > 350);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── Back to top click ── */
  bttElements.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  /* ── AOS Init ── */
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
  }

  /* ── GLightbox Init ── */
  if (typeof GLightbox !== "undefined") {
    GLightbox({
      selector: ".portfolio-glightbox, .glightbox",
      touchNavigation: true,
      loop: true,
      autoplayVideos: false,
      zoomable: true,
    });
  }

  /* ── PureCounter Init ── */
  if (typeof PureCounter !== "undefined") {
    new PureCounter();
  }

  /* ── Portfolio Isotope Filter ── */
  const isotopeGrid = document.querySelector(".portfolio-grid");
  if (isotopeGrid && typeof Isotope !== "undefined") {
    let iso;
    // Wait until images are loaded
    if (typeof imagesLoaded !== "undefined") {
      imagesLoaded(isotopeGrid, function () {
        iso = new Isotope(isotopeGrid, {
          itemSelector: ".portfolio-item-wrap",
          layoutMode: "fitRows",
        });
        // Filter buttons
        const filterBtns = document.querySelectorAll(".filter-btn");
        filterBtns.forEach((btn) => {
          btn.addEventListener("click", function () {
            filterBtns.forEach((b) => b.classList.remove("active"));
            this.classList.add("active");
            iso.arrange({ filter: this.dataset.filter });
          });
        });
      });
    }
  }

  /* ── Active nav link on scroll (Homepage only) ── */
  const heroAnchor = document.querySelector('.nav-link[href="#hero"]');
  if (heroAnchor) {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link[href^='#']");

    function updateActiveNav() {
      const scrollPosition = window.scrollY;

      // At the top of the page, ensure hero / Beranda is active
      if (scrollPosition < 180) {
        navLinks.forEach((l) => l.classList.remove("active"));
        heroAnchor.classList.add("active");
        return;
      }

      const scrollY = scrollPosition + 120;
      sections.forEach((sec) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute("id");
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
          if (scrollY >= top && scrollY < top + height) {
            navLinks.forEach((l) => l.classList.remove("active"));
            link.classList.add("active");
          }
        }
      });
    }
    window.addEventListener("scroll", updateActiveNav, { passive: true });
    updateActiveNav();
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
        // Close mobile offcanvas drawer if open
        const navOffcanvas = document.getElementById("navOffcanvas");
        if (navOffcanvas && typeof bootstrap !== "undefined" && bootstrap.Offcanvas) {
          const instance = bootstrap.Offcanvas.getInstance(navOffcanvas);
          if (instance) {
            instance.hide();
          }
        }
        const navCollapse = document.querySelector(".navbar-collapse");
        if (navCollapse && navCollapse.classList.contains("show")) {
          const toggler = document.querySelector(".navbar-toggler");
          if (toggler) toggler.click();
        }
      }
    });
  });

  /* ── Hero parallax ── */
  const heroBg = document.querySelector(".hero-bg");
  if (heroBg) {
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.3}px)`;
    }, { passive: true });
  }

  /* ── Testimonials Swiper Init ── */
  if (typeof Swiper !== "undefined") {
    new Swiper(".testimonials-slider", {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      slidesPerView: 1,
      spaceBetween: 24,
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 28,
        },
      },
    });
  }

  /* ── FAQ Accordion Interactivity ── */
  const faqButtons = document.querySelectorAll(".faq-question");
  faqButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const isExpanded = this.getAttribute("aria-expanded") === "true";
      const answer = this.nextElementSibling;

      // Close other open answers
      faqButtons.forEach((otherBtn) => {
        if (otherBtn !== this) {
          otherBtn.setAttribute("aria-expanded", "false");
          if (otherBtn.nextElementSibling) {
            otherBtn.nextElementSibling.style.display = "none";
          }
        }
      });

      if (isExpanded) {
        this.setAttribute("aria-expanded", "false");
        if (answer) answer.style.display = "none";
      } else {
        this.setAttribute("aria-expanded", "true");
        if (answer) answer.style.display = "block";
      }
    });
  });

  /* ── Entire Service Card Clickable ── */
  const serviceCards = document.querySelectorAll(".service-card");
  serviceCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      const link = this.querySelector(".service-card-link");
      if (link && link.href) {
        window.location.href = link.href;
      }
    });
  });

})();

