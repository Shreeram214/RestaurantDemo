# The Urban Plate — Premium Restaurant Website (Demo)

**Live demo:** https://ramrestaurant-demo.pages.dev

**Good Food. Great Moments.**

A complete, responsive, multi-page website for a fictional premium casual dining restaurant in Pune.
It's built with plain **HTML5, CSS3 and Vanilla JavaScript**: no frameworks, no build step and no backend.

> ⚠️ **Demo content:** The Urban Plate is a fictional brand. The business details, phone number, offers, reviews, ratings and prices (INR) are sample content for a portfolio demo. The reservation and contact forms don't send or store anything.

---

## Pages

| Page | File | Highlights |
|---|---|---|
| Home | `index.html` | Announcement bar, hero, welcome, 6 signature dishes, specialties, why choose us, experience mosaic, testimonials, offers, reservation CTA, location & hours |
| About | `about.html` | Story, journey timeline, philosophy, mission & vision, chef & team, ingredients, ambience, why guests love us |
| Menu | `menu.html` | 48 dishes in 8 categories, search, veg/non-veg filter, "Popular only" toggle, category tabs, deep links (`menu.html?cat=italian`, `menu.html?popular=1`) |
| Gallery | `gallery.html` | 24-photo masonry grid, 6 category filters, lightbox (keyboard, swipe, prev/next) |
| Our Experience | `experience.html` | Ambience, family, romantic, birthdays, corporate, private events, spaces |
| Reservation | `reservation.html` | Validated demo form, no past dates (60-day window), live time-slot picker, guest stepper, occasion chips, live summary, confirmation modal saying **no booking was made**, FAQ |
| Contact | `contact.html` | Contact cards, demo contact form, WhatsApp, opening hours with live open/closed status, map placeholder with Get Directions, FAQ |
| QR Table Menu | `qr-menu.html` | Mobile-first menu opened by scanning a table's QR code (`/qr-menu?table=12`). Shows the table number, sticky category chips with scroll-spy, search, Veg-only and Popular filters, dish detail sheets, and a "My List" shortlist with a ₹ estimated total that guests can share or show to their server (no ordering) |
| Table QR Codes | `qr-codes.html` | Staff tool (not indexed by search engines). Generates printable QR table cards for any table range (6 per A4 page), plus a general entrance card. Each card can be downloaded as an image |
| 404 | `404.html` | Custom not-found page (Cloudflare Pages serves it automatically) |

## Features

- Sticky header, dropdown menus, mobile hamburger drawer and a mobile quick-action bar (Call / Menu / Reserve)
- Active page highlighting, smooth scrolling, scroll-reveal animations and a back-to-top button
- Indian-standard veg (green dot) and non-veg (red triangle) markers, plus Bestseller and Chef's Special labels
- Accessibility: semantic landmarks, skip link, ARIA states, keyboard support, visible focus styles and `prefers-reduced-motion` support
- SEO: unique titles and meta descriptions, Open Graph tags, `sitemap.xml`, `robots.txt` and a favicon
- Performance: local WebP images, below-the-fold images are lazy-loaded, the hero image is preloaded, image sizes are set to avoid layout shift, and there are no JS libraries

## QR Digital Menu

1. Open **`/qr-codes`** (or `qr-codes.html`), choose a table range and click **Print cards**.
2. Put each card on its table. Its code opens `https://ramrestaurant-demo.pages.dev/qr-menu?table=N`.
3. Guests scan the code with their phone camera. The table menu opens with their table number shown, and they can shortlist dishes and show the list to their server.

Notes:
- The shortlist is saved separately for each table in the guest's own browser (`localStorage`). Nothing is sent or ordered.
- Menu items come from one shared file, `js/menu-data.js`, so `menu.html` and `qr-menu.html` always match.
- QR codes are generated in the browser with the open-source [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) library (MIT), loaded from cdnjs. The menu page also shows a scannable code so desktop visitors can try the mobile menu.
- If you host the site on another domain, change the **Menu link** field on the QR codes page before printing.

## Project structure

```
restaurant-website/
├── index.html  about.html  menu.html  gallery.html
├── experience.html  reservation.html  contact.html  404.html
├── qr-menu.html  qr-codes.html
├── css/
│   ├── style.css        # design system + all components
│   ├── responsive.css   # breakpoints (1280 / 1100 / 992 / 768 / 560 / 400)
│   ├── animations.css   # reveal + keyframes, reduced-motion support
│   └── qr-menu.css      # mobile QR table menu
├── js/
│   ├── main.js          # nav, dropdowns, reveal, FAQ, back-to-top, contact form, toast
│   ├── menu-data.js     # shared menu data (48 dishes, INR)
│   ├── menu.js          # menu page filtering/search
│   ├── qr-menu.js       # QR table menu + shortlist
│   ├── qr-codes.js      # printable table QR cards
│   ├── gallery.js       # filters + lightbox
│   └── reservation.js   # validation, date limits, time slots, confirmation modal
├── assets/
│   ├── icons/favicon.svg
│   └── images/{hero,food,interior,gallery}/   # local WebP photos
├── _headers             # Cloudflare Pages security & cache headers
├── robots.txt
└── sitemap.xml
```

## Run locally

**Option 1: just open it.** Double-click `index.html`. Every page and feature works from the file system.

**Option 2: local server** (recommended, because it matches production URLs):

```powershell
npx serve .
```

or, with Python:

```powershell
python -m http.server 8080
```

Then open http://localhost:8080 (or the port `serve` prints).

## Deploy to Cloudflare Pages

**A. Direct upload (no Git)**
1. Go to the Cloudflare dashboard, then **Workers & Pages → Create → Pages → Upload assets**.
2. Name the project (for example `the-urban-plate`) and drag in the **contents** of the `restaurant-website` folder.
3. Click **Deploy**. Your site will be live at `https://<project>.pages.dev`.

**B. From GitHub / GitLab**
1. Push this folder to a repository.
2. Go to **Workers & Pages → Create → Pages → Connect to Git** and pick the repository.
3. Build settings: Framework preset **None**, build command **(leave empty)**, build output directory **`/`** (or `restaurant-website` if it's a sub-folder).
4. Click **Save and Deploy**. Every push redeploys the site automatically.

**C. From the command line**

```powershell
npx wrangler pages deploy . --project-name the-urban-plate
```

The live demo is deployed at https://ramrestaurant-demo.pages.dev (Git-connected: every push to `main` redeploys).
Cloudflare Pages serves clean URLs automatically (`/menu` serves `menu.html`) and uses `404.html` for missing pages.

## Images

All 144 photos are stored locally in `assets/images/` as optimised WebP files (about 22 MB in total), so the site doesn't depend on any outside image host:

| Folder | Contents |
|---|---|
| `hero/` | Full-width page banners and call-to-action backgrounds (1800px) |
| `food/` | Dish photos for the menu and home page cards (600–900px) |
| `interior/` | Dining room and ambience photos |
| `gallery/` | Gallery thumbnails plus 1600px versions for the lightbox |

The photos are from [Unsplash](https://unsplash.com) and are free to use under the Unsplash License. File names describe each photo, for example `food/hyderabadi-dum-biryani-640.webp`. Below-the-fold images are lazy-loaded, and the 1600px gallery versions only load when the lightbox opens.

To swap a photo, replace the file and keep the same name, or point the `src` in the HTML (or the `img` field in `js/menu.js`) at a new file. Use WebP files about 1600–1800px wide for banners and 640–800px wide for cards.

> Live demo: https://ramrestaurant-demo.pages.dev — `og:image`, canonical links, `sitemap.xml` and `robots.txt` already use this domain. Change them if you move to another domain.

## Customising

- **Colours and fonts:** edit the CSS variables at the top of `css/style.css` (`--accent`, `--ink`, `--cream`, `--font-display` and so on).
- **Menu items and prices:** edit `js/menu-data.js` (shared by the menu and the QR table menu).
- **Time slots:** edit `SLOT_GROUPS` in `js/reservation.js`.
- **Real bookings:** connect the reservation form to a service such as Formspree, Cloudflare Workers or a reservations platform, and remove the demo notices.
