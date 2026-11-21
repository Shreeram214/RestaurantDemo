/* ==========================================================================
   The Urban Plate — Shared site behaviour (all pages)
   Navigation, dropdowns, scroll effects, reveal animations, FAQ, back-to-top,
   open/closed status, contact form demo handling, toast helper.
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Image fallback for remote photos ---------- */
  document.addEventListener("error", (e) => {
    const t = e.target;
    if (t && t.tagName === "IMG" && !t.classList.contains("img-fallback")) {
      t.classList.add("img-fallback");
    }
  }, true);

  /* ---------- Toast helper (exposed for other scripts) ---------- */
  let toastTimer;
  window.showToast = function (message, icon = "fa-circle-check") {
    let toast = $(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid ${icon}" aria-hidden="true"></i><span></span>`;
    toast.querySelector("span").textContent = message;
    requestAnimationFrame(() => toast.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 4200);
  };

  /* ---------- Active navigation highlighting ---------- */
  const page = document.body.dataset.page;
  $$(".nav-list > li > a[data-page]").forEach((a) => {
    if (a.dataset.page === page) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });

  /* ---------- Mobile navigation ---------- */
  const header = $("#siteHeader");
  const nav = $("#mainNav");
  const burger = $("#hamburger");
  const backdrop = $(".nav-backdrop");

  function setNav(open) {
    if (!nav || !burger) return;
    nav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    backdrop && backdrop.classList.toggle("show", open);
    document.body.classList.toggle("nav-open", open);
    if (open) {
      const first = nav.querySelector("a");
      first && setTimeout(() => first.focus(), 300);
    }
  }
  burger && burger.addEventListener("click", () => setNav(!nav.classList.contains("open")));
  backdrop && backdrop.addEventListener("click", () => setNav(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav && nav.classList.contains("open")) {
      setNav(false);
      burger.focus();
    }
  });
  // Close mobile nav when a link is chosen
  nav && nav.addEventListener("click", (e) => {
    if (e.target.closest("a") && nav.classList.contains("open")) setNav(false);
  });
  // Reset when resizing to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100 && nav && nav.classList.contains("open")) setNav(false);
  });

  /* ---------- Dropdown toggles (click / touch / keyboard) ---------- */
  $$(".dd-toggle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const li = btn.closest(".has-dropdown");
      const isOpen = li.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(isOpen));
      $$(".has-dropdown.open").forEach((other) => {
        if (other !== li) {
          other.classList.remove("open");
          other.querySelector(".dd-toggle").setAttribute("aria-expanded", "false");
        }
      });
    });
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".has-dropdown")) {
      $$(".has-dropdown.open").forEach((li) => {
        li.classList.remove("open");
        li.querySelector(".dd-toggle").setAttribute("aria-expanded", "false");
      });
    }
  });

  /* ---------- Header shadow + back to top ---------- */
  const toTop = $(".back-to-top");
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    header && header.classList.toggle("scrolled", y > 10);
    toTop && toTop.classList.toggle("show", y > 600);
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();
  toTop && toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  });

  /* ---------- Smooth scrolling for same-page anchors ---------- */
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute("href");
    if (id.length < 2) return;
    const target = document.getElementById(id.slice(1));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", id);
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("revealed"));
  }
  // Auto-stagger children of grids marked data-stagger
  $$("[data-stagger]").forEach((grid) => {
    Array.from(grid.children).forEach((child, i) => child.style.setProperty("--delay", `${(i % 6) * 0.08}s`));
  });

  /* ---------- FAQ accordion ---------- */
  $$(".faq-q").forEach((q) => {
    const answer = document.getElementById(q.getAttribute("aria-controls"));
    if (!answer) return;
    q.addEventListener("click", () => {
      const expanded = q.getAttribute("aria-expanded") === "true";
      // Close others in the same FAQ group
      $$(".faq-q[aria-expanded='true']", q.closest(".faq")).forEach((other) => {
        if (other !== q) {
          other.setAttribute("aria-expanded", "false");
          const a = document.getElementById(other.getAttribute("aria-controls"));
          a.style.height = a.scrollHeight + "px";
          requestAnimationFrame(() => { a.style.height = "0px"; });
        }
      });
      q.setAttribute("aria-expanded", String(!expanded));
      if (expanded) {
        answer.style.height = answer.scrollHeight + "px";
        requestAnimationFrame(() => { answer.style.height = "0px"; });
      } else {
        answer.style.height = answer.scrollHeight + "px";
        answer.addEventListener("transitionend", function done() {
          if (q.getAttribute("aria-expanded") === "true") answer.style.height = "auto";
          answer.removeEventListener("transitionend", done);
        });
      }
    });
  });

  /* ---------- Open / closed status (11:00 AM – 11:00 PM IST, daily) ---------- */
  $$("[data-open-status]").forEach((el) => {
    // Compute current time in India (UTC+5:30) regardless of visitor timezone
    const now = new Date();
    const ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);
    const mins = ist.getHours() * 60 + ist.getMinutes();
    const open = mins >= 11 * 60 && mins < 23 * 60;
    el.classList.toggle("closed", !open);
    el.textContent = open ? "Open now · until 11:00 PM" : "Closed now · opens 11:00 AM";
  });

  /* ---------- Current year ---------- */
  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Contact form (demo only — nothing is sent) ---------- */
  const contactForm = $("#contactForm");
  if (contactForm) {
    const rules = {
      cName: (v) => v.trim().length >= 2 || "Please enter your name (at least 2 characters).",
      cEmail: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Please enter a valid email address.",
      cPhone: (v) => v.trim() === "" || /^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/.test(v.trim()) || "Enter a valid 10-digit Indian mobile number.",
      cSubject: (v) => v !== "" || "Please choose a subject.",
      cMessage: (v) => v.trim().length >= 10 || "Message should be at least 10 characters."
    };
    const validateField = (input) => {
      const rule = rules[input.id];
      if (!rule) return true;
      const result = rule(input.value);
      const field = input.closest(".field");
      const err = field.querySelector(".error-msg");
      const ok = result === true;
      field.classList.toggle("invalid", !ok);
      field.classList.toggle("valid", ok && input.value.trim() !== "");
      input.setAttribute("aria-invalid", String(!ok));
      err.textContent = ok ? "" : result;
      return ok;
    };
    Object.keys(rules).forEach((id) => {
      const input = document.getElementById(id);
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.closest(".field").classList.contains("invalid")) validateField(input);
      });
    });
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let firstBad = null;
      Object.keys(rules).forEach((id) => {
        const input = document.getElementById(id);
        if (!validateField(input) && !firstBad) firstBad = input;
      });
      if (firstBad) { firstBad.focus(); return; }
      contactForm.reset();
      $$(".field", contactForm).forEach((f) => f.classList.remove("valid", "invalid"));
      window.showToast("Demo only: your message looks good, but nothing was sent. Please call or email for real enquiries.", "fa-circle-info");
    });
  }
})();
