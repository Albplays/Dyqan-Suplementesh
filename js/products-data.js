const PRODUCTS = [
  {
    id: 1,
    name: "Whey Protein Gold",
    category: "proteina",
    categoryLabel: "Proteina",
    price: 35.99,
    oldPrice: 44.99,
    weight: "1000g — 33 Serving",
    flavors: ["Çokollatë", "Vanilje", "Luleshtrydhe", "Karamel"],
    rating: 4.8,
    reviews: 124,
    badge: "bestseller",
    description: "Proteina e hirrës me cilësi premium. 24g proteina për serving, me BCAA dhe aminoacide esenciale. Ideal pas stërvitjes për rikuperim të shpejtë dhe ndërtim muskujsh.",
    bgColor: "#1a0d2e",
    accentColor: "#a855f7",
    emoji: "💪",
    featured: true
  },
  {
    id: 2,
    name: "Kreatinë Monohidrat",
    category: "kreatina",
    categoryLabel: "Kreatina",
    price: 18.99,
    oldPrice: null,
    weight: "300g — 60 Serving",
    flavors: ["Pa shije"],
    rating: 4.9,
    reviews: 89,
    badge: null,
    description: "Kreatina e pastër 100% Monohidrat, micronized për absorbtim optimal. Rrit forcën, endurancen dhe volumin e muskujve. Produkt i testuar në laborator.",
    bgColor: "#1a0a0a",
    accentColor: "#ef4444",
    emoji: "⚡",
    featured: true
  },
  {
    id: 3,
    name: "BCAA 2:1:1 Pro",
    category: "aminoacide",
    categoryLabel: "Aminoacide",
    price: 24.99,
    oldPrice: 29.99,
    weight: "400g — 50 Serving",
    flavors: ["Ananas-Kokos", "Limon", "Watermelon"],
    rating: 4.6,
    reviews: 67,
    badge: "sale",
    description: "Raporti optimal 2:1:1 Leucine, Isoleucine, Valine. Parandalon catabolizmin e muskujve, rrit endurancen dhe shpejton rikuperimin pas stërvitjes intensive.",
    bgColor: "#0a1a1a",
    accentColor: "#06b6d4",
    emoji: "🔬",
    featured: true
  },
  {
    id: 4,
    name: "Pre-Workout Extreme",
    category: "preworkout",
    categoryLabel: "Pre-Workout",
    price: 32.99,
    oldPrice: null,
    weight: "300g — 30 Serving",
    flavors: ["Blue Raspberry", "Fruit Punch", "Watermelon"],
    rating: 4.7,
    reviews: 103,
    badge: "new",
    description: "Formula e fuqishme me Caffeine, Beta-Alanine, Citrulline Malate dhe Niacin. Energji maksimale, fokus i lartë dhe pump i jashtëzakonshëm.",
    bgColor: "#1a0f00",
    accentColor: "#FF6B35",
    emoji: "🔥",
    featured: true
  },
  {
    id: 5,
    name: "Multivitaminë Sport",
    category: "vitamina",
    categoryLabel: "Vitamina",
    price: 19.99,
    oldPrice: 24.99,
    weight: "90 Tableta — 3 muaj",
    flavors: ["Tablet"],
    rating: 4.5,
    reviews: 45,
    badge: null,
    description: "Kompleks i plotë me 25 vitamina dhe minerale esenciale. Formula e veçantë për sportistë aktiv, mbështet sistemin imunitar dhe metabolizmin e energjisë.",
    bgColor: "#0a1a0a",
    accentColor: "#22c55e",
    emoji: "🌿",
    featured: false
  },
  {
    id: 6,
    name: "Omega-3 Fish Oil",
    category: "vitamina",
    categoryLabel: "Vitamina",
    price: 14.99,
    oldPrice: null,
    weight: "120 Capsule — 4 muaj",
    flavors: ["Capsule"],
    rating: 4.8,
    reviews: 78,
    badge: null,
    description: "Vaj peshku me pastërti të lartë, i pasur me EPA dhe DHA. Mbështet shëndetin e zemrës, trurit dhe kyçeve. I certifikuar pa metale të rënda.",
    bgColor: "#0a1018",
    accentColor: "#3b82f6",
    emoji: "🐟",
    featured: false
  },
  {
    id: 7,
    name: "Mass Gainer Pro",
    category: "massgainer",
    categoryLabel: "Mass Gainer",
    price: 44.99,
    oldPrice: 54.99,
    weight: "2500g — 25 Serving",
    flavors: ["Çokollatë", "Vanilje"],
    rating: 4.4,
    reviews: 56,
    badge: "sale",
    description: "Formula premium për shtim të shpejtë të masës muskulore. 1250 kcal, 50g proteina dhe 250g karbohidrate per serving. Ideal për hardgainer-ë.",
    bgColor: "#100a1a",
    accentColor: "#8b5cf6",
    emoji: "🏋️",
    featured: false
  },
  {
    id: 8,
    name: "Collagen Hydrolyzed",
    category: "vitamina",
    categoryLabel: "Vitamina",
    price: 28.99,
    oldPrice: 34.99,
    weight: "300g — 30 Serving",
    flavors: ["Pa shije", "Limon"],
    rating: 4.6,
    reviews: 34,
    badge: "new",
    description: "Kolagen i hidrolizuar tip I dhe III, 10g per serving. Mbështet shëndetin e lëkurës, kyçeve, tendinave dhe kockave. Përthithet shpejt dhe lehtë.",
    bgColor: "#1a1008",
    accentColor: "#f59e0b",
    emoji: "✨",
    featured: false
  },
  {
    id: 9,
    name: "Casein Protein Night",
    category: "proteina",
    categoryLabel: "Proteina",
    price: 39.99,
    oldPrice: null,
    weight: "900g — 30 Serving",
    flavors: ["Çokollatë", "Vanilje"],
    rating: 4.7,
    reviews: 41,
    badge: null,
    description: "Proteina Micellar Casein me tretje të ngadaltë, ideale para gjumit. Lëshon aminoacide gradualisht për 7-8 orë, duke mbrojtur muskujt gjatë natës.",
    bgColor: "#1a0d2e",
    accentColor: "#a855f7",
    emoji: "🌙",
    featured: false
  },
  {
    id: 10,
    name: "L-Glutamine Pure",
    category: "aminoacide",
    categoryLabel: "Aminoacide",
    price: 16.99,
    oldPrice: null,
    weight: "500g — 100 Serving",
    flavors: ["Pa shije"],
    rating: 4.5,
    reviews: 29,
    badge: null,
    description: "L-Glutamine 100% e pastër, 5g per serving. Mbështet rikuperimin e muskujve, shëndetin e zorrëve dhe sistemin imunitar. Ideal pas stërvitjeve intensive.",
    bgColor: "#0a1a1a",
    accentColor: "#06b6d4",
    emoji: "⚗️",
    featured: false
  },
  {
    id: 11,
    name: "ZMA — Zinc Magnesium",
    category: "vitamina",
    categoryLabel: "Vitamina",
    price: 22.99,
    oldPrice: 27.99,
    weight: "90 Capsule — 3 muaj",
    flavors: ["Capsule"],
    rating: 4.6,
    reviews: 38,
    badge: null,
    description: "Kombinimi ZMA (Zinc, Magnesium, Vitamin B6). Mbështet prodhimin natyral të testosteronit, cilësinë e gjumit dhe rikuperimin muscular.",
    bgColor: "#0a1a0a",
    accentColor: "#22c55e",
    emoji: "🛡️",
    featured: false
  },
  {
    id: 12,
    name: "Vitamin D3 + K2",
    category: "vitamina",
    categoryLabel: "Vitamina",
    price: 12.99,
    oldPrice: null,
    weight: "60 Capsule — 2 muaj",
    flavors: ["Capsule"],
    rating: 4.9,
    reviews: 92,
    badge: "bestseller",
    description: "Kombinimi i fuqishëm D3 + K2 MK-7. Mbështet shëndetin e kockave, sistemin imunitar dhe funksionin muskulor. Doza optimale 5000IU D3 + 100mcg K2.",
    bgColor: "#1a1008",
    accentColor: "#f59e0b",
    emoji: "☀️",
    featured: false
  }
];

const CATEGORIES = [
  { id: "proteina",  label: "Proteina",    count: 3, emoji: "💪", bgColor: "#1a0d2e", accentColor: "#a855f7" },
  { id: "kreatina",  label: "Kreatina",    count: 1, emoji: "⚡", bgColor: "#1a0a0a", accentColor: "#ef4444" },
  { id: "aminoacide",label: "Aminoacide",  count: 2, emoji: "🔬", bgColor: "#0a1a1a", accentColor: "#06b6d4" },
  { id: "vitamina",  label: "Vitamina",    count: 5, emoji: "🌿", bgColor: "#0a1a0a", accentColor: "#22c55e" },
  { id: "preworkout",label: "Pre-Workout", count: 1, emoji: "🔥", bgColor: "#1a0f00", accentColor: "#FF6B35" },
  { id: "massgainer",label: "Mass Gainer", count: 1, emoji: "🏋️", bgColor: "#100a1a", accentColor: "#8b5cf6" }
];

function renderStars(rating) {
  let html = '<div class="stars">';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      html += `<svg class="filled" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    } else {
      html += `<svg class="empty" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    }
  }
  html += '</div>';
  return html;
}

function renderBadge(badge) {
  if (!badge) return '';
  const labels = { bestseller: 'Bestseller', new: 'I Ri', sale: 'Ofertë' };
  return `<span class="product-badge badge-${badge}">${labels[badge]}</span>`;
}

function renderProductCard(product, index = 0) {
  const delay = (index % 4) * 100;
  return `
    <div class="product-card fade-up" style="transition-delay:${delay}ms" data-id="${product.id}">
      <div class="product-img-wrap">
        ${renderBadge(product.badge)}
        <button class="btn-icon product-wishlist" onclick="toggleWishlist(${product.id})" aria-label="Shto në favorite">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
        <div class="product-img" style="background:linear-gradient(135deg, ${product.bgColor} 0%, ${product.accentColor}22 100%)">
          <div class="product-img-icon">${product.emoji}</div>
          <div class="product-img-name">${product.name}</div>
        </div>
      </div>
      <div class="product-info">
        <div class="product-cat">${product.categoryLabel}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-weight">${product.weight}</div>
        <div class="product-rating">
          ${renderStars(product.rating)}
          <span class="rating-count">(${product.reviews})</span>
        </div>
        <div class="product-footer">
          <div class="product-price">
            <span class="price-main">€${product.price.toFixed(2)}</span>
            ${product.oldPrice ? `<span class="price-old">€${product.oldPrice.toFixed(2)}</span>` : ''}
          </div>
          <button class="add-to-cart" onclick="addToCart(${product.id})" aria-label="Shto në shportë">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}
