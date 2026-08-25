/**
 * main.js — Kontraktor Surabaya
 * Brand: Maroon | Platform: Bootstrap 5
 * High Performance & GPU Optimized
 */

(function () {
  "use strict";

  /* ── DOM Elements ── */
  const navbar = document.getElementById("navbar");
  const bttElements = document.querySelectorAll("#back-to-top, #scroll-top-btn, .scroll-top");
  const heroAnchor = document.querySelector('.nav-link[href="#hero"]');
  const heroBg = document.querySelector(".hero-bg");

  let isTicking = false;
  let lastScrollY = 0;
  let isDesktop = window.innerWidth >= 992;

  // Window resize handler to update desktop status
  window.addEventListener("resize", () => {
    isDesktop = window.innerWidth >= 992;
    cacheSectionOffsets();
  }, { passive: true });

  /* ── Cache Section Offsets for Fast ScrollSpy (Prevents Layout Thrashing) ── */
  let cachedSections = [];
  function cacheSectionOffsets() {
    if (!heroAnchor) return;
    const sectionEls = document.querySelectorAll("section[id]");
    cachedSections = Array.from(sectionEls).map((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      return { id, top, height, link };
    });
  }

  // Initial cache after DOM & styles ready
  if (document.readyState === "complete") {
    cacheSectionOffsets();
  } else {
    window.addEventListener("load", cacheSectionOffsets, { passive: true });
  }

  /* ── Unified High-Performance Scroll Handler (requestAnimationFrame) ── */
  function onScrollTick() {
    const scrollY = lastScrollY;

    // 1. Navbar & Back to Top Toggle
    if (navbar) {
      if (scrollY > 50) {
        if (!navbar.classList.contains("scrolled")) navbar.classList.add("scrolled");
      } else {
        if (navbar.classList.contains("scrolled")) navbar.classList.remove("scrolled");
      }
    }

    const bttVisible = scrollY > 350;
    bttElements.forEach((el) => {
      el.classList.toggle("visible", bttVisible);
    });

    // 2. Active Nav Link on Scroll (Homepage only)
    if (heroAnchor && cachedSections.length > 0) {
      const navLinks = document.querySelectorAll(".nav-link[href^='#']");
      if (scrollY < 180) {
        navLinks.forEach((l) => l.classList.remove("active"));
        heroAnchor.classList.add("active");
      } else {
        const checkPos = scrollY + 130;
        for (let i = 0; i < cachedSections.length; i++) {
          const sec = cachedSections[i];
          if (checkPos >= sec.top && checkPos < sec.top + sec.height) {
            if (sec.link && !sec.link.classList.contains("active")) {
              navLinks.forEach((l) => l.classList.remove("active"));
              sec.link.classList.add("active");
            }
            break;
          }
        }
      }
    }

    // 3. Hero Parallax — ONLY ON DESKTOP (Disabled on mobile to ensure 60fps smooth scroll)
    if (isDesktop && heroBg && scrollY < 900) {
      heroBg.style.transform = `translate3d(0, ${scrollY * 0.25}px, 0) scale(1.05)`;
    }

    isTicking = false;
  }

  window.addEventListener("scroll", () => {
    lastScrollY = window.scrollY;
    if (!isTicking) {
      window.requestAnimationFrame(onScrollTick);
      isTicking = true;
    }
  }, { passive: true });

  // Initial trigger
  lastScrollY = window.scrollY;
  onScrollTick();

  /* ── Back to Top Click ── */
  bttElements.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  /* ── AOS Init (Optimized for Mobile Performance) ── */
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
      debounceDelay: 50,
      throttleDelay: 99,
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

  /* ── Portfolio / Blog Isotope Filter ── */
  const isotopeGrid = document.querySelector(".portfolio-grid");
  if (isotopeGrid && typeof Isotope !== "undefined") {
    let iso;
    const initIsotope = () => {
      iso = new Isotope(isotopeGrid, {
        itemSelector: ".portfolio-item-wrap",
        layoutMode: "fitRows",
      });
      const filterBtns = document.querySelectorAll(".filter-btn");
      filterBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          filterBtns.forEach((b) => b.classList.remove("active"));
          this.classList.add("active");
          iso.arrange({ filter: this.dataset.filter });
        });
      });
    };

    if (typeof imagesLoaded !== "undefined") {
      imagesLoaded(isotopeGrid, initIsotope);
    } else {
      initIsotope();
    }
  }

  /* ── Smooth Scroll for Anchor Links ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href === "") return;
      const target = document.querySelector(href);
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
      }
    });
  });

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

  /* ── Service Card Clickable ── */
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
