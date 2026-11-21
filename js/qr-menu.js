/* ==========================================================================
   The Urban Plate — QR Table Menu
   Opened by scanning the QR code on a table: qr-menu.html?table=12
   Features: table number, sticky category chips with scroll-spy, search,
   veg-only & popular filters, dish detail sheet, and a personal shortlist
   ("My List") with running total that guests can show to their server.
   Nothing is ordered or sent — the list lives only in this browser.
   ========================================================================== */
(function () {
  "use strict";

  const listRoot = document.getElementById("qrList");
  if (!listRoot || !window.UP_MENU) return;

  const { categories: CATEGORIES, dishes: DISHES } = window.UP_MENU;
  const byId = Object.fromEntries(DISHES.map((d) => [d.id, d]));
  const $ = (id) => document.getElementById(id);
  const inr = (n) => "₹" + n.toLocaleString("en-IN");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Table number from the QR link ---------- */
  const params = new URLSearchParams(location.search);
  const rawTable = (params.get("table") || "").trim();
  const table = /^[A-Za-z0-9-]{1,6}$/.test(rawTable) ? rawTable.toUpperCase() : "";
  if (table) {
    $("tableChip").hidden = false;
    $("tableNum").textContent = table;
    document.title = `Table ${table} · Menu | The Urban Plate`;
  }

  /* ---------- Greeting (India time) ---------- */
  const now = new Date();
  const ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);
  const h = ist.getHours();
  const greeting = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  $("qrGreeting").textContent = table ? `${greeting}, Table ${table}` : `${greeting}!`;

  /* ---------- Shortlist storage (per table, this browser only) ---------- */
  const STORE_KEY = `up-qr-list-${table || "guest"}`;
  let picks = {};
  try { picks = JSON.parse(localStorage.getItem(STORE_KEY) || "{}") || {}; } catch (e) { picks = {}; }
  Object.keys(picks).forEach((k) => { if (!byId[k] || !(picks[k] > 0)) delete picks[k]; });
  const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(picks)); } catch (e) { /* storage unavailable */ } };

  /* ---------- Render ---------- */
  function qtyCtrl(id, large) {
    const q = picks[id] || 0;
    const d = byId[id];
    if (!q) {
      return `<div class="qty-ctrl${large ? " lg" : ""}" data-id="${id}"><button type="button" class="add-btn" data-act="add" aria-label="Add ${esc(d.name)} to my list">ADD <i class="fa-solid fa-plus" aria-hidden="true"></i></button></div>`;
    }
    return `<div class="qty-ctrl has-qty${large ? " lg" : ""}" data-id="${id}">
      <button type="button" class="step" data-act="dec" aria-label="Remove one ${esc(d.name)}"><i class="fa-solid fa-minus" aria-hidden="true"></i></button>
      <span class="qty" aria-live="polite" aria-label="${q} in my list">${q}</span>
      <button type="button" class="step" data-act="inc" aria-label="Add one more ${esc(d.name)}"><i class="fa-solid fa-plus" aria-hidden="true"></i></button>
    </div>`;
  }
  const tagHTML = (d) => d.tag === "best"
    ? '<span class="qr-tag"><i class="fa-solid fa-star" aria-hidden="true"></i> Bestseller</span>'
    : d.tag === "chef" ? '<span class="qr-tag chef"><i class="fa-solid fa-award" aria-hidden="true"></i> Chef\'s Special</span>' : "";
  const dietHTML = (d) => `<span class="diet ${d.veg ? "veg" : "nonveg"}" role="img" aria-label="${d.veg ? "Vegetarian" : "Non-vegetarian"}"></span>`;

  listRoot.innerHTML = CATEGORIES.map((c) => {
    const items = DISHES.filter((d) => d.cat === c.id);
    return `<section class="qr-section" id="sec-${c.id}" data-cat="${c.id}" aria-labelledby="qh-${c.id}">
      <h2 id="qh-${c.id}">${c.name} <span class="sec-count">${items.length}</span></h2>
      <p>${c.blurb}</p>
      ${items.map((d) => `
        <article class="qr-item" data-id="${d.id}" data-veg="${d.veg}" data-tag="${d.tag || ""}" data-search="${esc((d.name + " " + d.desc + " " + c.name).toLowerCase())}">
          <div class="qr-item-info">
            <div class="qr-item-meta">${dietHTML(d)}${tagHTML(d)}</div>
            <h3><button type="button" class="dish-open" data-act="open" aria-label="${esc(d.name)} — view details">${esc(d.name)}</button></h3>
            <span class="qr-price">${inr(d.price)}</span>
            <p>${esc(d.desc)}</p>
          </div>
          <div class="qr-item-media">
            <img src="${d.img}" alt="${esc(d.name)}" loading="lazy" decoding="async" width="112" height="104">
            ${qtyCtrl(d.id)}
          </div>
        </article>`).join("")}
    </section>`;
  }).join("");

  const chipsEl = $("qrChips");
  chipsEl.innerHTML =
    `<button type="button" class="qr-chip popular" id="popularChip" aria-pressed="false"><i class="fa-solid fa-star" aria-hidden="true"></i> Popular</button>` +
    CATEGORIES.map((c) => `<button type="button" class="qr-chip" data-target="sec-${c.id}"><i class="fa-solid ${c.icon}" aria-hidden="true"></i> ${c.name}</button>`).join("");

  /* ---------- Quantity updates ---------- */
  function setQty(id, q) {
    if (q > 0) picks[id] = Math.min(q, 20); else delete picks[id];
    save();
    document.querySelectorAll(`.qty-ctrl[data-id="${id}"]`).forEach((el) => {
      el.outerHTML = qtyCtrl(id, el.classList.contains("lg"));
    });
    updateBar();
    if ($("listSheet").classList.contains("open")) renderList();
  }
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    const ctrl = btn && btn.closest(".qty-ctrl");
    if (ctrl) {
      e.stopPropagation();
      const id = ctrl.dataset.id;
      const q = picks[id] || 0;
      if (btn.dataset.act === "add" || btn.dataset.act === "inc") {
        setQty(id, q + 1);
        if (!q && navigator.vibrate) navigator.vibrate(10);
      } else if (btn.dataset.act === "dec") setQty(id, q - 1);
      return;
    }
    const item = e.target.closest(".qr-item");
    if (item) openDish(item.dataset.id);
  });

  /* ---------- Floating list bar ---------- */
  const totals = () => Object.entries(picks).reduce((acc, [id, q]) => {
    acc.count += q; acc.sum += byId[id].price * q; return acc;
  }, { count: 0, sum: 0 });
  function updateBar() {
    const { count, sum } = totals();
    $("barCount").textContent = `${count} ${count === 1 ? "item" : "items"} · ${inr(sum)}`;
    $("listBar").classList.toggle("show", count > 0);
    $("listBar").setAttribute("aria-hidden", String(count === 0));
  }

  /* ---------- Bottom sheets ---------- */
  const backdrop = $("sheetBackdrop");
  let openSheet = null, lastFocus = null;
  function showSheet(sheet) {
    if (openSheet && openSheet !== sheet) openSheet.classList.remove("open");
    lastFocus = lastFocus || document.activeElement;
    openSheet = sheet;
    sheet.classList.add("open");
    sheet.setAttribute("aria-hidden", "false");
    backdrop.classList.add("show");
    document.body.classList.add("sheet-open");
    setTimeout(() => sheet.querySelector(".sheet-close").focus(), 50);
  }
  function hideSheet() {
    if (!openSheet) return;
    openSheet.classList.remove("open");
    openSheet.setAttribute("aria-hidden", "true");
    openSheet = null;
    backdrop.classList.remove("show");
    document.body.classList.remove("sheet-open");
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    lastFocus = null;
  }
  backdrop.addEventListener("click", hideSheet);
  document.querySelectorAll("[data-close-sheet]").forEach((b) => b.addEventListener("click", hideSheet));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideSheet(); });

  function openDish(id) {
    const d = byId[id];
    const cat = CATEGORIES.find((c) => c.id === d.cat);
    $("dishSheetContent").innerHTML = `
      <img class="dish-sheet-img" src="${d.img}" alt="${esc(d.name)}">
      <div class="sheet-body dish-sheet-body">
        <div class="qr-item-meta">${dietHTML(d)}<span class="dish-cuisine">${cat.name}</span>${tagHTML(d)}</div>
        <h2 id="dishSheetTitle">${esc(d.name)}</h2>
        <p>${esc(d.desc)}</p>
        <p style="font-size:.82rem">Please tell your server about any allergies before ordering.</p>
        <div class="dish-sheet-foot">
          <span class="price">${inr(d.price)}</span>
          ${qtyCtrl(d.id, true)}
        </div>
      </div>`;
    showSheet($("dishSheet"));
  }

  function renderList() {
    const ids = Object.keys(picks);
    const { count, sum } = totals();
    $("listSub").textContent = `${table ? `Table ${table} · ` : ""}${count} ${count === 1 ? "item" : "items"}`;
    $("listRows").innerHTML = ids.length
      ? ids.map((id) => {
        const d = byId[id];
        return `<div class="list-row">${dietHTML(d)}<div class="list-row-info"><strong>${esc(d.name)}</strong><span>${inr(d.price)} × ${picks[id]} = ${inr(d.price * picks[id])}</span></div>${qtyCtrl(id)}</div>`;
      }).join("")
      : '<p class="sub" style="padding:20px 0;text-align:center">Your list is empty. Tap <strong>ADD</strong> on any dish.</p>';
    $("listTotal").textContent = inr(sum);
    $("listActions").hidden = !ids.length;
    if (!ids.length && openSheet === $("listSheet")) setTimeout(hideSheet, 600);
  }
  $("openList").addEventListener("click", () => { renderList(); showSheet($("listSheet")); });

  function listText() {
    const { sum } = totals();
    const lines = Object.entries(picks).map(([id, q]) => `${q} × ${byId[id].name} — ${inr(byId[id].price * q)}`);
    return `The Urban Plate${table ? ` · Table ${table}` : ""}\nMy shortlist:\n${lines.join("\n")}\nEstimated total: ${inr(sum)} (excl. taxes)`;
  }
  $("shareList").addEventListener("click", async () => {
    const text = listText();
    try {
      if (navigator.share) { await navigator.share({ title: "My Urban Plate shortlist", text }); return; }
      await navigator.clipboard.writeText(text);
      window.showToast && window.showToast("List copied — paste it anywhere to share.");
    } catch (e) {
      if (e && e.name === "AbortError") return;
      window.showToast && window.showToast("Couldn't share automatically. Show this screen to your server instead.", "fa-circle-info");
    }
  });
  $("clearList").addEventListener("click", () => {
    Object.keys(picks).forEach((id) => delete picks[id]);
    save();
    document.querySelectorAll(".qty-ctrl").forEach((el) => { el.outerHTML = qtyCtrl(el.dataset.id, el.classList.contains("lg")); });
    updateBar();
    renderList();
  });

  /* ---------- Filters: search, veg only, popular ---------- */
  const filters = { q: "", veg: false, popular: false };
  const search = $("qrSearch");
  const clearBtn = $("qrSearchClear");
  function applyFilters() {
    let shown = 0;
    document.querySelectorAll(".qr-section").forEach((sec) => {
      let n = 0;
      sec.querySelectorAll(".qr-item").forEach((it) => {
        const ok = (!filters.q || it.dataset.search.includes(filters.q)) &&
          (!filters.veg || it.dataset.veg === "true") &&
          (!filters.popular || it.dataset.tag);
        it.hidden = !ok;
        if (ok) n++;
      });
      sec.hidden = n === 0;
      sec.querySelector(".sec-count").textContent = n;
      const chip = chipsEl.querySelector(`[data-target="${sec.id}"]`);
      if (chip) chip.hidden = n === 0;
      shown += n;
    });
    $("qrEmpty").classList.toggle("show", shown === 0);
    spy();
  }
  let t;
  search.addEventListener("input", () => {
    clearBtn.classList.toggle("show", !!search.value);
    clearTimeout(t);
    t = setTimeout(() => { filters.q = search.value.trim().toLowerCase(); applyFilters(); }, 140);
  });
  clearBtn.addEventListener("click", () => { search.value = ""; clearBtn.classList.remove("show"); filters.q = ""; applyFilters(); search.focus(); });
  $("vegSwitch").addEventListener("click", (e) => {
    filters.veg = !filters.veg;
    e.currentTarget.setAttribute("aria-pressed", String(filters.veg));
    applyFilters();
  });
  $("popularChip").addEventListener("click", (e) => {
    filters.popular = !filters.popular;
    e.currentTarget.setAttribute("aria-pressed", String(filters.popular));
    applyFilters();
  });
  $("qrReset").addEventListener("click", () => {
    filters.q = ""; filters.veg = false; filters.popular = false;
    search.value = ""; clearBtn.classList.remove("show");
    $("vegSwitch").setAttribute("aria-pressed", "false");
    $("popularChip").setAttribute("aria-pressed", "false");
    applyFilters();
  });

  /* ---------- Category chips: jump + scroll-spy ---------- */
  chipsEl.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-target]");
    if (!chip) return;
    const sec = $(chip.dataset.target);
    sec.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
  });
  let activeId = null;
  function spy() {
    const offset = 140;
    let current = null;
    document.querySelectorAll(".qr-section:not([hidden])").forEach((sec) => {
      if (sec.getBoundingClientRect().top - offset <= 0) current = sec.id;
    });
    if (!current) {
      const first = document.querySelector(".qr-section:not([hidden])");
      current = first && first.id;
    }
    if (current === activeId) return;
    activeId = current;
    chipsEl.querySelectorAll("[data-target]").forEach((c) => {
      const on = c.dataset.target === current;
      c.classList.toggle("active", on);
      if (on) {
        const box = chipsEl;
        const left = c.offsetLeft - box.clientWidth / 2 + c.clientWidth / 2;
        box.scrollTo({ left, behavior: prefersReduced ? "auto" : "smooth" });
      }
    });
  }
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(() => { spy(); ticking = false; }); ticking = true; }
  }, { passive: true });

  // Init
  updateBar();
  spy();
})();
