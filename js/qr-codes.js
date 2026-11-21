/* ==========================================================================
   The Urban Plate — Table QR code cards (staff tool)
   Generates printable cards whose QR codes open qr-menu.html?table=N.
   Uses the open-source qrcode-generator library (MIT) from cdnjs.
   ========================================================================== */
(function () {
  "use strict";

  const LIVE_URL = "https://ramrestaurant-demo.pages.dev/qr-menu";
  const MAX_CARDS = 60;

  const form = document.getElementById("qrForm");
  const cards = document.getElementById("cards");
  const baseInput = document.getElementById("baseUrl");
  const fromInput = document.getElementById("fromTable");
  const toInput = document.getElementById("toTable");
  const generalInput = document.getElementById("generalCard");
  const baseErr = document.getElementById("baseUrl-err");
  const rangeErr = document.getElementById("range-err");

  // Default link: this site's own QR menu when hosted; the live demo when opened locally
  // (a phone can't reach localhost or a file on this computer).
  const host = location.hostname;
  const isLocal = location.protocol === "file:" || host === "localhost" || host === "127.0.0.1" || host === "";
  baseInput.value = isLocal ? LIVE_URL : `${location.origin}/qr-menu`;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function qrSvg(text) {
    const qr = window.qrcode(0, "M"); // auto version, medium error correction
    qr.addData(text);
    qr.make();
    return qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true, alt: "QR code", title: text });
  }
  function qrPng(text) {
    const qr = window.qrcode(0, "M");
    qr.addData(text);
    qr.make();
    return qr.createDataURL(10, 4); // GIF data URL, large enough to print
  }

  function linkFor(base, table) {
    const u = new URL(base);
    if (table) u.searchParams.set("table", table); else u.searchParams.delete("table");
    return u.toString();
  }

  function cardHTML(base, table) {
    const url = linkFor(base, table);
    return `<article class="qr-card">
      <span class="logo-mark" aria-hidden="true">UP</span>
      <h2>The Urban Plate</h2>
      <span class="tag">Good Food. Great Moments.</span>
      <p class="scan">Scan to view our menu</p>
      <div class="code" role="img" aria-label="QR code linking to ${esc(url)}">${qrSvg(url)}</div>
      <span class="table-no">${table ? `Table ${esc(table)}` : "Welcome"}</span>
      <p class="steps">Open your phone camera · point at the code · tap the link</p>
      <div class="card-tools">
        <a href="${esc(url)}" target="_blank" rel="noopener">Test link</a>
        <a href="${qrPng(url)}" download="urban-plate-qr-${table ? "table-" + esc(table) : "general"}.gif">Download image</a>
      </div>
    </article>`;
  }

  function validate() {
    let ok = true;
    baseErr.textContent = ""; rangeErr.textContent = "";
    try {
      const u = new URL(baseInput.value.trim());
      if (!/^https?:$/.test(u.protocol)) throw new Error();
    } catch (e) { baseErr.textContent = "Enter a full link starting with https://"; ok = false; }
    const from = parseInt(fromInput.value, 10), to = parseInt(toInput.value, 10);
    if (!(from >= 1 && to >= from && to <= 999)) { rangeErr.textContent = "Use a range like 1 to 12."; ok = false; }
    else if (to - from + 1 > MAX_CARDS) { rangeErr.textContent = `Up to ${MAX_CARDS} cards at a time.`; ok = false; }
    return ok;
  }

  function generate() {
    if (typeof window.qrcode !== "function") {
      document.getElementById("libError").classList.add("show");
      return false;
    }
    if (!validate()) return false;
    const base = baseInput.value.trim();
    const from = parseInt(fromInput.value, 10), to = parseInt(toInput.value, 10);
    let html = generalInput.checked ? cardHTML(base, "") : "";
    for (let t = from; t <= to; t++) html += cardHTML(base, String(t));
    cards.innerHTML = html;
    return true;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (generate()) window.showToast && window.showToast(`Generated ${cards.children.length} QR cards.`);
  });
  document.getElementById("printBtn").addEventListener("click", () => {
    if (!cards.children.length && !generate()) return;
    window.print();
  });

  generate();
})();
