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

  const CATEGORIES = [
    { id: "starters", name: "Starters", icon: "fa-fire-burner", blurb: "Small plates, big flavour — perfect to share." },
    { id: "soups-salads", name: "Soups & Salads", icon: "fa-bowl-food", blurb: "Light, seasonal and made fresh every morning." },
    { id: "indian", name: "Indian Main Course", icon: "fa-pepper-hot", blurb: "Slow-cooked gravies and tandoor classics." },
    { id: "continental", name: "Continental", icon: "fa-drumstick-bite", blurb: "Grills, roasts and European comfort plates." },
    { id: "italian", name: "Italian", icon: "fa-pizza-slice", blurb: "Hand-stretched pizzas and fresh pasta." },
    { id: "asian", name: "Asian", icon: "fa-bowl-rice", blurb: "Woks, dumplings and bowls from across Asia." },
    { id: "desserts", name: "Desserts", icon: "fa-ice-cream", blurb: "A sweet finish to every great moment." },
    { id: "beverages", name: "Beverages", icon: "fa-martini-glass-citrus", blurb: "Mocktails, coolers, coffees and teas." }
  ];

  // tag: "best" = Bestseller, "chef" = Chef's Special
  const DISHES = [
    // Starters
    { cat: "starters", name: "Tandoori Paneer Tikka", desc: "Cottage cheese marinated in hung curd and Kashmiri chilli, charred in the clay oven.", price: 345, veg: true, tag: "best", img: "assets/images/food/tandoori-paneer-tikka-640.webp" },
    { cat: "starters", name: "Crispy Samosa Chaat", desc: "Flaky samosas crushed with chickpeas, tamarind, mint chutney and sweet yoghurt.", price: 245, veg: true, img: "assets/images/food/crispy-samosa-chaat-640.webp" },
    { cat: "starters", name: "Smoky Chicken Skewers", desc: "Herb-marinated chicken skewers off the grill with garlic toum and pickled onions.", price: 395, veg: false, tag: "chef", img: "assets/images/food/smoky-chicken-skewers-640.webp" },
    { cat: "starters", name: "Harissa Grilled Chicken Wings", desc: "Sticky, spicy wings glazed in house harissa honey, finished with sesame.", price: 375, veg: false, img: "assets/images/food/harissa-grilled-chicken-wings-640.webp" },
    { cat: "starters", name: "Garden Mezze Bowl", desc: "Hummus, roasted vegetables, olives and warm pita with za'atar oil.", price: 325, veg: true, img: "assets/images/food/garden-mezze-bowl-640.webp" },
    { cat: "starters", name: "Classic Bruschetta Trio", desc: "Tomato basil, mushroom truffle and pesto ricotta on toasted sourdough.", price: 295, veg: true, img: "assets/images/food/classic-bruschetta-trio-640.webp" },

    // Soups & Salads
    { cat: "soups-salads", name: "Roasted Tomato & Basil Soup", desc: "Slow-roasted vine tomatoes, fresh basil and a swirl of cream. Served with garlic bread.", price: 225, veg: true, img: "assets/images/food/roasted-tomato-and-basil-soup-640.webp" },
    { cat: "soups-salads", name: "Lemon Coriander Chicken Soup", desc: "Clear, zesty chicken broth with fresh coriander and shredded chicken.", price: 255, veg: false, img: "assets/images/food/lemon-coriander-chicken-soup-640.webp" },
    { cat: "soups-salads", name: "Urban Buddha Bowl", desc: "Quinoa, roasted sweet potato, avocado, chickpeas and tahini dressing.", price: 375, veg: true, tag: "best", img: "assets/images/food/urban-buddha-bowl-640.webp" },
    { cat: "soups-salads", name: "Grilled Chicken Caesar", desc: "Crisp romaine, parmesan, sourdough croutons and our classic Caesar dressing.", price: 395, veg: false, img: "assets/images/food/grilled-chicken-caesar-640.webp" },
    { cat: "soups-salads", name: "Mediterranean Greek Salad", desc: "Cucumber, cherry tomato, kalamata olives, feta and oregano vinaigrette.", price: 325, veg: true, img: "assets/images/food/mediterranean-greek-salad-640.webp" },
    { cat: "soups-salads", name: "Rainbow Garden Salad", desc: "Seasonal greens, beetroot, citrus segments and toasted seeds with honey-mustard.", price: 295, veg: true, img: "assets/images/food/rainbow-garden-salad-640.webp" },

    // Indian Main Course
    { cat: "indian", name: "Old Delhi Butter Chicken", desc: "Tandoori chicken simmered in a velvety tomato, butter and fenugreek gravy.", price: 495, veg: false, tag: "best", img: "assets/images/food/old-delhi-butter-chicken-640.webp" },
    { cat: "indian", name: "Hyderabadi Dum Biryani", desc: "Fragrant basmati and tender mutton slow-cooked on dum with saffron. Served with raita.", price: 545, veg: false, tag: "chef", img: "assets/images/food/hyderabadi-dum-biryani-640.webp" },
    { cat: "indian", name: "Paneer Makhani", desc: "Soft paneer cubes in a rich, mildly sweet cashew and tomato gravy.", price: 425, veg: true, img: "assets/images/food/paneer-makhani-640.webp" },
    { cat: "indian", name: "Subz Dum Biryani", desc: "Seasonal vegetables and aged basmati layered with mint, fried onions and saffron.", price: 445, veg: true, img: "assets/images/food/subz-dum-biryani-640.webp" },
    { cat: "indian", name: "Dal Urban Plate", desc: "Black lentils slow-cooked overnight with butter and cream — our signature dal.", price: 365, veg: true, tag: "best", img: "assets/images/food/dal-urban-plate-640.webp" },
    { cat: "indian", name: "Malabar Fish Curry", desc: "Fresh catch simmered in coconut milk, kokum and curry leaves. Best with appam.", price: 525, veg: false, img: "assets/images/food/malabar-fish-curry-640.webp" },

    // Continental
    { cat: "continental", name: "Herb-Crusted Grilled Salmon", desc: "Norwegian salmon, lemon-butter sauce, crushed potatoes and sautéed greens.", price: 895, veg: false, tag: "chef", img: "assets/images/food/herb-crusted-grilled-salmon-640.webp" },
    { cat: "continental", name: "Peppercorn Tenderloin Steak", desc: "Grilled tenderloin with green peppercorn jus, mash and roasted vegetables.", price: 845, veg: false, img: "assets/images/food/peppercorn-tenderloin-steak-640.webp" },
    { cat: "continental", name: "Roast Chicken Provençal", desc: "Half chicken roasted with herbes de Provence, garlic and a light pan jus.", price: 625, veg: false, img: "assets/images/food/roast-chicken-proven-al-640.webp" },
    { cat: "continental", name: "The Urban Gourmet Burger", desc: "Grilled chicken patty, cheddar, caramelised onion and chipotle mayo. With fries.", price: 445, veg: false, tag: "best", img: "assets/images/food/the-urban-gourmet-burger-640.webp" },
    { cat: "continental", name: "Grilled Cottage Cheese Steak", desc: "Thick paneer steak with herb butter, mushroom sauce and grilled vegetables.", price: 495, veg: true, img: "assets/images/food/grilled-cottage-cheese-steak-640.webp" },
    { cat: "continental", name: "Classic Veg Burger", desc: "Crispy vegetable and potato patty, lettuce, tomato and house sauce. With fries.", price: 365, veg: true, img: "assets/images/food/classic-veg-burger-640.webp" },

    // Italian
    { cat: "italian", name: "Wood-Fired Margherita", desc: "San Marzano tomato, fresh mozzarella, basil and extra-virgin olive oil.", price: 495, veg: true, tag: "best", img: "assets/images/food/wood-fired-margherita-640.webp" },
    { cat: "italian", name: "Spicy Pepperoni Pizza", desc: "Hand-stretched base, chicken pepperoni, mozzarella and chilli honey.", price: 595, veg: false, img: "assets/images/food/spicy-pepperoni-pizza-640.webp" },
    { cat: "italian", name: "Truffle Mushroom Pizza", desc: "Wild mushrooms, truffle oil, caramelised onions and smoked scamorza.", price: 625, veg: true, tag: "chef", img: "assets/images/food/truffle-mushroom-pizza-640.webp" },
    { cat: "italian", name: "Penne Arrabbiata", desc: "Penne tossed in a fiery garlic, chilli and slow-cooked tomato sauce.", price: 425, veg: true, img: "assets/images/food/penne-arrabbiata-640.webp" },
    { cat: "italian", name: "Creamy Chicken Alfredo", desc: "Fettuccine in a parmesan cream sauce with grilled chicken and black pepper.", price: 525, veg: false, img: "assets/images/food/creamy-chicken-alfredo-640.webp" },
    { cat: "italian", name: "Spaghetti Aglio e Olio", desc: "Spaghetti with garlic, chilli flakes, parsley and good olive oil.", price: 395, veg: true, img: "assets/images/food/spaghetti-aglio-e-olio-640.webp" },

    // Asian
    { cat: "asian", name: "Tokyo Chicken Ramen", desc: "Rich chicken broth, ramen noodles, soft egg, nori and spring onion.", price: 545, veg: false, tag: "chef", img: "assets/images/food/tokyo-chicken-ramen-640.webp" },
    { cat: "asian", name: "Salmon Avocado Sushi Roll", desc: "Eight pieces of salmon and avocado uramaki with wasabi and pickled ginger.", price: 695, veg: false, img: "assets/images/food/salmon-avocado-sushi-roll-640.webp" },
    { cat: "asian", name: "Crystal Veg Dumplings", desc: "Steamed dumplings with water chestnut, bok choy and chilli oil dip.", price: 345, veg: true, tag: "best", img: "assets/images/food/crystal-veg-dumplings-640.webp" },
    { cat: "asian", name: "Burnt Garlic Fried Rice", desc: "Wok-tossed jasmine rice with burnt garlic, vegetables and spring onion.", price: 325, veg: true, img: "assets/images/food/burnt-garlic-fried-rice-640.webp" },
    { cat: "asian", name: "Chilli Basil Noodles", desc: "Hakka noodles tossed with Thai basil, chilli and crunchy vegetables.", price: 345, veg: true, img: "assets/images/food/chilli-basil-noodles-640.webp" },
    { cat: "asian", name: "Asian Poke Bowl", desc: "Sushi rice, marinated tuna, edamame, cucumber and sesame-soy dressing.", price: 595, veg: false, img: "assets/images/food/asian-poke-bowl-640.webp" },

    // Desserts
    { cat: "desserts", name: "Belgian Chocolate Fudge Cake", desc: "Warm, gooey chocolate cake with a scoop of vanilla bean ice cream.", price: 345, veg: true, tag: "best", img: "assets/images/food/belgian-chocolate-fudge-cake-640.webp" },
    { cat: "desserts", name: "Classic Tiramisu", desc: "Espresso-soaked savoiardi layered with mascarpone cream and cocoa.", price: 375, veg: true, tag: "chef", img: "assets/images/food/classic-tiramisu-640.webp" },
    { cat: "desserts", name: "Berry Cheesecake", desc: "Baked New York-style cheesecake with a mixed berry compote.", price: 365, veg: true, img: "assets/images/food/berry-cheesecake-640.webp" },
    { cat: "desserts", name: "Artisanal Gelato Trio", desc: "Three scoops — Alphonso mango, pistachio and dark chocolate.", price: 295, veg: true, img: "assets/images/food/artisanal-gelato-trio-640.webp" },
    { cat: "desserts", name: "Berry Yoghurt Parfait", desc: "Greek yoghurt, house granola, honey and fresh seasonal berries.", price: 275, veg: true, img: "assets/images/food/berry-yoghurt-parfait-640.webp" },
    { cat: "desserts", name: "Glazed Doughnut Platter", desc: "Freshly fried mini doughnuts with salted caramel and chocolate dips.", price: 295, veg: true, img: "assets/images/food/glazed-doughnut-platter-640.webp" },

    // Beverages
    { cat: "beverages", name: "Urban Sunset Mocktail", desc: "Orange, passion fruit, grenadine and soda — our signature zero-proof drink.", price: 245, veg: true, tag: "best", img: "assets/images/food/urban-sunset-mocktail-640.webp" },
    { cat: "beverages", name: "Virgin Mojito", desc: "Fresh mint, lime and soda over crushed ice.", price: 195, veg: true, img: "assets/images/food/virgin-mojito-640.webp" },
    { cat: "beverages", name: "Masala Nimbu Soda", desc: "Fresh lime and mint with black salt and roasted cumin — sweet or salted.", price: 155, veg: true, img: "assets/images/food/masala-nimbu-soda-640.webp" },
    { cat: "beverages", name: "Cold-Pressed Seasonal Juice", desc: "Ask your server for today's fresh pressing — no sugar added.", price: 215, veg: true, img: "assets/images/food/cold-pressed-seasonal-juice-640.webp" },
    { cat: "beverages", name: "Signature Cappuccino", desc: "Double-shot espresso from Chikmagalur beans with velvety milk foam.", price: 185, veg: true, img: "assets/images/food/signature-cappuccino-640.webp" },
    { cat: "beverages", name: "Sparkling Berry Cooler", desc: "Muddled berries, lemon and rosemary topped with sparkling water.", price: 225, veg: true, tag: "chef", img: "assets/images/food/sparkling-berry-cooler-640.webp" }
  ];

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
})();
