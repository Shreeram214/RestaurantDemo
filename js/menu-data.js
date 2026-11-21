/* ==========================================================================
   The Urban Plate — Menu data (shared by menu.html and qr-menu.html)
   All dishes, descriptions and prices (INR) are fictional demo content.
   tag: "best" = Bestseller, "chef" = Chef's Special
   ========================================================================== */
window.UP_MENU = {
  categories: [
    { id: "starters", name: "Starters", icon: "fa-fire-burner", blurb: "Small plates, big flavour — perfect to share." },
    { id: "soups-salads", name: "Soups & Salads", icon: "fa-bowl-food", blurb: "Light, seasonal and made fresh every morning." },
    { id: "indian", name: "Indian Main Course", icon: "fa-pepper-hot", blurb: "Slow-cooked gravies and tandoor classics." },
    { id: "continental", name: "Continental", icon: "fa-drumstick-bite", blurb: "Grills, roasts and European comfort plates." },
    { id: "italian", name: "Italian", icon: "fa-pizza-slice", blurb: "Hand-stretched pizzas and fresh pasta." },
    { id: "asian", name: "Asian", icon: "fa-bowl-rice", blurb: "Woks, dumplings and bowls from across Asia." },
    { id: "desserts", name: "Desserts", icon: "fa-ice-cream", blurb: "A sweet finish to every great moment." },
    { id: "beverages", name: "Beverages", icon: "fa-martini-glass-citrus", blurb: "Mocktails, coolers, coffees and teas." }
  ],
  dishes: [
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
    { cat: "italian", name: "Wood-Fired Margherita", desc: "Classic wood-fired pizza with San Marzano tomato, fresh mozzarella, basil and extra-virgin olive oil.", price: 495, veg: true, tag: "best", img: "assets/images/food/wood-fired-margherita-640.webp" },
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
  ]
};

// Stable id per dish (used by the QR menu shortlist)
window.UP_MENU.dishes.forEach((d) => {
  d.id = d.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
});
