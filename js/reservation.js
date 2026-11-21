/* ==========================================================================
   The Urban Plate — Reservation (DEMO)
   Validation, past-date prevention, time-slot picker, live summary and a
   confirmation UI that clearly states NO real booking is made.
   ========================================================================== */
(function () {
  "use strict";

  const form = document.getElementById("reservationForm");
  if (!form) return;

  const $ = (id) => document.getElementById(id);
  const nameI = $("rName"), phoneI = $("rPhone"), emailI = $("rEmail"), dateI = $("rDate"),
        timeI = $("rTime"), guestsI = $("rGuests"), reqI = $("rRequests"), agreeI = $("rAgree");
  const slotArea = $("slotArea");
  const reqCount = $("reqCount");
  const modal = $("confirmModal");
  const MAX_DAYS_AHEAD = 60;
  const MAX_GUESTS = 20;

  /* ---------- Dates in India Standard Time ---------- */
  function istNow() {
    const now = new Date();
    return new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);
  }
  const pad = (n) => String(n).padStart(2, "0");
  const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = istNow();
  const todayISO = toISO(today);
  const maxDate = new Date(today); maxDate.setDate(maxDate.getDate() + MAX_DAYS_AHEAD);
  dateI.min = todayISO;
  dateI.max = toISO(maxDate);

  function prettyDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  }
  function prettyTime(t) {
    const [h, m] = t.split(":").map(Number);
    const ap = h >= 12 ? "PM" : "AM";
    return `${((h + 11) % 12) + 1}:${pad(m)} ${ap}`;
  }

  /* ---------- Time slots ---------- */
  const SLOT_GROUPS = [
    { name: "Lunch", icon: "fa-sun", from: "12:00", to: "15:30" },
    { name: "Evening", icon: "fa-mug-hot", from: "16:00", to: "18:30" },
    { name: "Dinner", icon: "fa-moon", from: "19:00", to: "22:00" }
  ];
  const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const fromMin = (n) => `${pad(Math.floor(n / 60))}:${pad(n % 60)}`;

  // Deterministic pseudo-availability so the demo feels realistic.
  function availability(dateIso, time) {
    let h = 0;
    const s = dateIso + time;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    const r = h % 10;
    return r === 0 ? "full" : r <= 2 ? "few" : "open";
  }

  function renderSlots() {
    const date = dateI.value;
    if (!date || dateError(date)) {
      slotArea.innerHTML = '<div class="slot-placeholder"><i class="fa-regular fa-calendar" aria-hidden="true"></i> Choose a valid date to see available time slots.</div>';
      timeI.value = "";
      updateSummary();
      return;
    }
    const isToday = date === todayISO;
    const nowMin = istNow().getHours() * 60 + istNow().getMinutes();
    let anyAvailable = false;
    const html = SLOT_GROUPS.map((g) => {
      let buttons = "";
      for (let m = toMin(g.from); m <= toMin(g.to); m += 30) {
        const t = fromMin(m);
        const status = availability(date, t);
        const past = isToday && m < nowMin + 60; // need at least 1 hour notice
        const disabled = status === "full" || past;
        if (!disabled) anyAvailable = true;
        const label = `${prettyTime(t)}${past ? " (unavailable – too soon)" : status === "full" ? " (fully booked)" : status === "few" ? " (few tables left)" : ""}`;
        buttons += `<button type="button" class="slot${status === "few" && !disabled ? " few" : ""}${timeI.value === t && !disabled ? " selected" : ""}" data-time="${t}" ${disabled ? "disabled" : ""} aria-label="${label}" aria-pressed="${timeI.value === t && !disabled}">${prettyTime(t)}</button>`;
      }
      return `<div><div class="slot-group-title"><i class="fa-solid ${g.icon}" aria-hidden="true"></i> ${g.name}</div><div class="slot-grid">${buttons}</div></div>`;
    }).join("");
    slotArea.innerHTML = anyAvailable
      ? `<div class="slot-groups">${html}</div><div class="slot-legend"><span><span class="dot"></span> Few tables left</span><span><s>Time</s> Unavailable</span></div>`
      : '<div class="slot-placeholder">No more slots available today. Please choose another date.</div>';
    // Clear a previously chosen time that's no longer valid
    if (timeI.value && !slotArea.querySelector(`.slot.selected`)) timeI.value = "";
    updateSummary();
  }

  slotArea.addEventListener("click", (e) => {
    const btn = e.target.closest(".slot");
    if (!btn || btn.disabled) return;
    slotArea.querySelectorAll(".slot").forEach((s) => { s.classList.remove("selected"); s.setAttribute("aria-pressed", "false"); });
    btn.classList.add("selected");
    btn.setAttribute("aria-pressed", "true");
    timeI.value = btn.dataset.time;
    setError(timeI, "");
    updateSummary();
  });

  /* ---------- Guests stepper ---------- */
  const minus = $("guestMinus"), plus = $("guestPlus"), guestNote = $("guestNote");
  function syncGuests() {
    let n = parseInt(guestsI.value, 10);
    if (isNaN(n)) n = 2;
    n = Math.max(1, Math.min(MAX_GUESTS, n));
    guestsI.value = n;
    minus.disabled = n <= 1;
    plus.disabled = n >= MAX_GUESTS;
    guestNote.textContent = n > 10
      ? "Large group? We'll suggest a private dining space."
      : n >= 6 ? "Great for our family tables." : "";
    updateSummary();
  }
  minus.addEventListener("click", () => { guestsI.value = +guestsI.value - 1; syncGuests(); });
  plus.addEventListener("click", () => { guestsI.value = +guestsI.value + 1; syncGuests(); });
  guestsI.addEventListener("change", syncGuests);

  /* ---------- Validation ---------- */
  function setError(input, msg) {
    const field = input.closest(".field");
    const err = field.querySelector(".error-msg");
    field.classList.toggle("invalid", !!msg);
    field.classList.toggle("valid", !msg && input.type !== "hidden" && String(input.value).trim() !== "");
    input.setAttribute("aria-invalid", String(!!msg));
    if (err) err.textContent = msg;
    return !msg;
  }
  function dateError(v) {
    if (!v) return "Please choose a reservation date.";
    if (v < todayISO) return "Reservation date cannot be in the past.";
    if (v > dateI.max) return `Reservations open up to ${MAX_DAYS_AHEAD} days in advance.`;
    return "";
  }
  const validators = {
    rName: () => {
      const v = nameI.value.trim();
      if (!v) return "Please enter your full name.";
      if (v.length < 2) return "Name should be at least 2 characters.";
      if (!/^[A-Za-zÀ-ɏऀ-ॿ .'-]+$/.test(v)) return "Name can contain letters, spaces, dots and hyphens only.";
      return "";
    },
    rPhone: () => {
      const v = phoneI.value.replace(/[\s-]/g, "");
      if (!v) return "Please enter your mobile number.";
      if (!/^(\+?91)?[6-9]\d{9}$/.test(v)) return "Enter a valid 10-digit Indian mobile number (e.g. 98765 43210).";
      return "";
    },
    rEmail: () => {
      const v = emailI.value.trim();
      if (!v) return "Please enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Please enter a valid email address.";
      return "";
    },
    rDate: () => dateError(dateI.value),
    rTime: () => (timeI.value ? "" : "Please select a preferred time slot."),
    rGuests: () => {
      const n = +guestsI.value;
      return n >= 1 && n <= MAX_GUESTS ? "" : `Guests must be between 1 and ${MAX_GUESTS}.`;
    },
    rRequests: () => (reqI.value.length > 300 ? "Please keep special requests under 300 characters." : ""),
    rAgree: () => (agreeI.checked ? "" : "Please confirm you understand this is a demo form.")
  };
  const validate = (id) => setError($(id), validators[id]());

  ["rName", "rPhone", "rEmail"].forEach((id) => {
    const el = $(id);
    el.addEventListener("blur", () => { if (el.value.trim()) validate(id); });
    el.addEventListener("input", () => { if (el.closest(".field").classList.contains("invalid")) validate(id); });
  });
  dateI.addEventListener("change", () => { validate("rDate"); renderSlots(); });
  agreeI.addEventListener("change", () => validate("rAgree"));
  reqI.addEventListener("input", () => {
    reqCount.textContent = `${reqI.value.length}/300`;
    if (reqI.value.length > 300) validate("rRequests"); else setError(reqI, "");
  });

  /* ---------- Live summary ---------- */
  function occasion() {
    const c = form.querySelector('input[name="occasion"]:checked');
    return c ? c.value : "";
  }
  function setSum(id, value, fallback) {
    const el = $(id);
    if (!el) return;
    el.textContent = value || fallback;
    el.classList.toggle("empty", !value);
  }
  function updateSummary() {
    setSum("sumDate", dateI.value && !dateError(dateI.value) ? prettyDate(dateI.value) : "", "Not selected");
    setSum("sumTime", timeI.value ? prettyTime(timeI.value) : "", "Not selected");
    setSum("sumGuests", guestsI.value ? `${guestsI.value} ${+guestsI.value === 1 ? "guest" : "guests"}` : "", "—");
    setSum("sumOccasion", occasion(), "Casual dining");
  }
  form.addEventListener("change", (e) => { if (e.target.name === "occasion") updateSummary(); });

  /* ---------- Submit (demo) ---------- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const order = ["rName", "rPhone", "rEmail", "rDate", "rTime", "rGuests", "rRequests", "rAgree"];
    let firstBad = null;
    order.forEach((id) => { if (!validate(id) && !firstBad) firstBad = id; });
    if (firstBad) {
      const el = firstBad === "rTime" ? slotArea : $(firstBad);
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      if (firstBad !== "rTime") setTimeout(() => $(firstBad).focus({ preventScroll: true }), 350);
      window.showToast && window.showToast("Please fix the highlighted fields.", "fa-circle-exclamation");
      return;
    }
    openModal();
  });

  function openModal() {
    const ref = "DEMO-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    $("demoRef").textContent = ref;
    const rows = [
      ["Name", nameI.value.trim()],
      ["Mobile", phoneI.value.trim()],
      ["Email", emailI.value.trim()],
      ["Date", prettyDate(dateI.value)],
      ["Time", prettyTime(timeI.value)],
      ["Guests", guestsI.value],
      ["Occasion", occasion() || "Casual dining"],
      ["Requests", reqI.value.trim() || "None"]
    ];
    const list = $("modalSummary");
    list.innerHTML = "";
    rows.forEach(([k, v]) => {
      const li = document.createElement("li");
      const a = document.createElement("span"); a.textContent = k;
      const b = document.createElement("span"); b.textContent = v;
      li.append(a, b);
      list.appendChild(li);
    });
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => modal.querySelector(".modal-close").focus(), 100);
  }
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  modal.querySelectorAll("[data-close-modal]").forEach((b) => b.addEventListener("click", closeModal));
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });
  $("newRequest").addEventListener("click", () => {
    closeModal();
    form.reset();
    form.querySelectorAll(".field").forEach((f) => f.classList.remove("valid", "invalid"));
    form.querySelectorAll(".error-msg").forEach((m) => (m.textContent = ""));
    timeI.value = "";
    guestsI.value = 2;
    reqCount.textContent = "0/300";
    syncGuests();
    renderSlots();
    window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 120, behavior: "smooth" });
  });

  /* ---------- Prefill from offers (?offer=weekend) ---------- */
  const OFFERS = {
    weekend: "Weekend Special",
    family: "Family Feast offer",
    chef: "Chef's Tasting Menu",
    seasonal: "Seasonal Menu"
  };
  const offer = new URLSearchParams(window.location.search).get("offer");
  if (offer && OFFERS[offer]) {
    reqI.value = `I'm interested in the ${OFFERS[offer]} (demo offer).`;
    reqCount.textContent = `${reqI.value.length}/300`;
    const banner = $("offerBanner");
    if (banner) {
      banner.hidden = false;
      banner.querySelector("strong").textContent = OFFERS[offer];
    }
  }

  // Init
  syncGuests();
  renderSlots();
})();
