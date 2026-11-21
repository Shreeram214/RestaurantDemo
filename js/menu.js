/* ==========================================================================
   The Urban Plate — Interactive Menu
   Category filter, search, veg / non-veg filter, popular toggle,
   smooth category navigation. All dishes & prices are fictional (INR).
   ========================================================================== */
(function () {
  "use strict";

  const root = document.getElementById("menuRoot");
  if (!root) return;

  // Dish photos live in assets/images/food (WebP, 640px wide)
  const img = (file) => file;

  const { categories: CATEGORIES, dishes: DISHES } = window.UP_MENU;

  const state = { cat: "all", diet: "all", popular: false, q: "" };

  const tabs = document.getElementById("catTabs");
  const searchInput = document.getElementById("menuSearch");
  const searchClear = document.getElementById("searchClear");
  const popularBtn = document.getElementById("popularToggle");
  const dietBtns = Array.from(document.querySelectorAll("[data-diet]"));
  const resultCount = document.getElementById("resultCount");
  const empty = document.getElementById("menuEmpty");
  const resetBtns = Array.from(document.querySelectorAll("[data-menu-reset]"));
  const toolbar = document.querySelector(".menu-toolbar");

  const inr = (n) => "₹" + n.toLocaleString("en-IN");
  const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function cardHTML(d, i) {
    const badge = d.tag === "best"
      ? '<span class="dish-badge best"><i class="fa-solid fa-star" aria-hidden="true"></i> Bestseller</span>'
      : d.tag === "chef"
        ? '<span class="dish-badge chef"><i class="fa-solid fa-award" aria-hidden="true"></i> Chef\'s Special</span>'
        : "";
    return `
      <article class="dish-card" style="animation-delay:${Math.min(i, 8) * 0.05}s">
        <div class="dish-media">
          <img src="${img(d.img)}" alt="${escapeHtml(d.name)}" loading="lazy" decoding="async" width="640" height="480">
          ${badge}
        </div>
        <div class="dish-body">
          <div class="dish-top">
            <h3>${escapeHtml(d.name)}</h3>
            <span class="diet ${d.veg ? "veg" : "nonveg"}" role="img" aria-label="${d.veg ? "Vegetarian" : "Non-vegetarian"}" title="${d.veg ? "Vegetarian" : "Non-vegetarian"}"></span>
          </div>
          <p>${escapeHtml(d.desc)}</p>
          <div class="dish-foot">
            <span class="price">${inr(d.price)}</span>
            <span class="diet-label">${d.veg ? "Veg" : "Non-veg"}</span>
          </div>
        </div>
      </article>`;
  }

  function matches(d) {
    if (state.diet === "veg" && !d.veg) return false;
    if (state.diet === "nonveg" && d.veg) return false;
    if (state.popular && !d.tag) return false;
    if (state.q) {
      const q = state.q.toLowerCase();
      if (!d.name.toLowerCase().includes(q) && !d.desc.toLowerCase().includes(q)) return false;
    }
    return true;
  }

  function buildTabs() {
    const filtered = DISHES.filter(matches);
    const counts = CATEGORIES.reduce((acc, c) => { acc[c.id] = filtered.filter((d) => d.cat === c.id).length; return acc; }, {});
    const all = [{ id: "all", name: "All Dishes", icon: "fa-utensils" }, ...CATEGORIES];
    tabs.innerHTML = all.map((c) => {
      const n = c.id === "all" ? filtered.length : counts[c.id];
      return `<button type="button" class="cat-tab${state.cat === c.id ? " active" : ""}" role="tab" aria-selected="${state.cat === c.id}" data-cat="${c.id}">
        <i class="fa-solid ${c.icon}" aria-hidden="true"></i> ${c.name} <span class="count">${n}</span></button>`;
    }).join("");
  }

  function render() {
    const cats = state.cat === "all" ? CATEGORIES : CATEGORIES.filter((c) => c.id === state.cat);
    let total = 0;
    let html = "";
    cats.forEach((c) => {
      const items = DISHES.filter((d) => d.cat === c.id && matches(d));
      if (!items.length) return;
      total += items.length;
      html += `
        <section class="menu-category" id="cat-${c.id}" aria-labelledby="h-${c.id}">
          <div class="menu-category-head">
            <div class="menu-category-title">
              <span class="cat-icon"><i class="fa-solid ${c.icon}" aria-hidden="true"></i></span>
              <div>
                <h2 id="h-${c.id}">${c.name}</h2>
                <p>${c.blurb}</p>
              </div>
            </div>
            <span class="dish-cuisine">${items.length} ${items.length === 1 ? "dish" : "dishes"}</span>
          </div>
          <div class="menu-grid">${items.map(cardHTML).join("")}</div>
        </section>`;
    });
    root.innerHTML = html;
    empty.classList.toggle("show", total === 0);
    const catName = state.cat === "all" ? "all categories" : CATEGORIES.find((c) => c.id === state.cat).name;
    const extras = [
      state.diet === "veg" ? "vegetarian" : state.diet === "nonveg" ? "non-vegetarian" : "",
      state.popular ? "popular" : ""
    ].filter(Boolean).join(", ");
    resultCount.innerHTML = `Showing <strong>${total}</strong> ${total === 1 ? "dish" : "dishes"} in <strong>${catName}</strong>${extras ? ` · ${extras}` : ""}${state.q ? ` · matching “<strong>${escapeHtml(state.q)}</strong>”` : ""}`;
    buildTabs();
  }

  function scrollToMenuTop() {
    const anchor = document.getElementById("menuTop");
    if (!anchor) return;
    const headerH = document.getElementById("siteHeader").offsetHeight;
    const y = anchor.getBoundingClientRect().top + window.scrollY - headerH - toolbar.offsetHeight + 10;
    if (window.scrollY > y) window.scrollTo({ top: y, behavior: "smooth" });
  }

  function setCat(cat, scroll = true) {
    state.cat = cat;
    render();
    const url = new URL(window.location);
    if (cat === "all") url.searchParams.delete("cat"); else url.searchParams.set("cat", cat);
    history.replaceState(null, "", url);
    // Keep the active tab visible in the horizontal strip
    const active = tabs.querySelector(".cat-tab.active");
    active && active.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    if (scroll) scrollToMenuTop();
  }

  // Events
  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".cat-tab");
    if (btn) setCat(btn.dataset.cat);
  });

  let debounce;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounce);
    searchClear.classList.toggle("show", searchInput.value.length > 0);
    debounce = setTimeout(() => { state.q = searchInput.value.trim(); render(); }, 160);
  });
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { searchInput.value = ""; searchClear.classList.remove("show"); state.q = ""; render(); }
  });
  searchClear.addEventListener("click", () => {
    searchInput.value = ""; searchClear.classList.remove("show"); state.q = ""; render(); searchInput.focus();
  });

  dietBtns.forEach((b) => b.addEventListener("click", () => {
    state.diet = b.dataset.diet;
    dietBtns.forEach((x) => { x.classList.toggle("active", x === b); x.setAttribute("aria-pressed", String(x === b)); });
    render();
  }));

  popularBtn.addEventListener("click", () => {
    state.popular = !state.popular;
    popularBtn.setAttribute("aria-pressed", String(state.popular));
    render();
  });

  resetBtns.forEach((b) => b.addEventListener("click", () => {
    state.cat = "all"; state.diet = "all"; state.popular = false; state.q = "";
    searchInput.value = ""; searchClear.classList.remove("show");
    popularBtn.setAttribute("aria-pressed", "false");
    dietBtns.forEach((x) => { const on = x.dataset.diet === "all"; x.classList.toggle("active", on); x.setAttribute("aria-pressed", String(on)); });
    setCat("all");
  }));

  // Initial state from URL (?cat=indian or ?popular=1)
  const params = new URLSearchParams(window.location.search);
  const initialCat = params.get("cat");
  if (params.get("popular") === "1") { state.popular = true; popularBtn.setAttribute("aria-pressed", "true"); }
  if (initialCat && CATEGORIES.some((c) => c.id === initialCat)) {
    state.cat = initialCat;
  }
  render();
  if (initialCat || params.get("popular")) {
    setTimeout(scrollToMenuTop, 350);
  }
  /* ---------- QR promo: scannable code that opens the table menu ---------- */
  const promo = document.getElementById("qrPromoCode");
  if (promo && typeof window.qrcode === "function") {
    const local = location.protocol === "file:" || ["localhost", "127.0.0.1", ""].includes(location.hostname);
    const target = (local ? "https://ramrestaurant-demo.pages.dev" : location.origin) + "/qr-menu?table=7";
    const qr = window.qrcode(0, "M");
    qr.addData(target);
    qr.make();
    promo.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
  }
})();
