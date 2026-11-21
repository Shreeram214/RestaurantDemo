/* ==========================================================================
   The Urban Plate — Gallery
   Category filtering + accessible lightbox (keyboard, swipe, prev/next).
   ========================================================================== */
(function () {
  "use strict";

  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll(".gallery-item"));
  const filters = Array.from(document.querySelectorAll(".filter-btn"));
  const lb = document.getElementById("lightbox");
  const lbImg = lb.querySelector("img");
  const lbTitle = lb.querySelector("figcaption strong");
  const lbCat = lb.querySelector("figcaption span");
  const lbCount = lb.querySelector(".lb-count");
  const btnClose = lb.querySelector(".lb-close");
  const btnPrev = lb.querySelector(".lb-prev");
  const btnNext = lb.querySelector(".lb-next");

  let visible = items.slice();
  let index = 0;
  let lastFocus = null;

  /* ---------- Filtering ---------- */
  function applyFilter(cat) {
    filters.forEach((f) => {
      const on = f.dataset.filter === cat;
      f.classList.toggle("active", on);
      f.setAttribute("aria-pressed", String(on));
    });
    items.forEach((it) => {
      const show = cat === "all" || it.dataset.cat === cat;
      it.classList.toggle("hide", !show);
    });
    visible = items.filter((it) => !it.classList.contains("hide"));
  }
  filters.forEach((f) => f.addEventListener("click", () => applyFilter(f.dataset.filter)));

  /* ---------- Lightbox ---------- */
  function show(i) {
    index = (i + visible.length) % visible.length;
    const it = visible[index];
    const full = it.dataset.full;
    lbImg.style.opacity = "0";
    const pre = new Image();
    pre.onload = pre.onerror = () => { lbImg.src = full; lbImg.style.opacity = "1"; };
    pre.src = full;
    lbImg.alt = it.querySelector("img").alt;
    lbTitle.textContent = it.dataset.title;
    lbCat.textContent = it.dataset.label;
    lbCount.textContent = `${index + 1} / ${visible.length}`;
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    btnClose.focus();
  }
  function close() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lastFocus && lastFocus.focus();
  }

  items.forEach((it) => it.addEventListener("click", () => open(visible.indexOf(it))));
  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", () => show(index - 1));
  btnNext.addEventListener("click", () => show(index + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(index - 1);
    else if (e.key === "ArrowRight") show(index + 1);
    else if (e.key === "Tab") {
      // Trap focus inside the lightbox controls
      const focusables = [btnClose, btnPrev, btnNext];
      const pos = focusables.indexOf(document.activeElement);
      e.preventDefault();
      const next = e.shiftKey ? (pos <= 0 ? focusables.length - 1 : pos - 1) : (pos + 1) % focusables.length;
      focusables[next].focus();
    }
  });

  // Touch swipe
  let startX = null;
  lb.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });

  // Deep-link a filter: gallery.html?cat=interior
  const cat = new URLSearchParams(window.location.search).get("cat");
  if (cat && filters.some((f) => f.dataset.filter === cat)) applyFilter(cat);
})();
