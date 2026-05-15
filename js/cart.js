/* ===== ANNOUNCEMENT BAR ===== */
function closeBar() {
  const bar = document.getElementById('announcement-bar');
  if (bar) bar.style.display = 'none';
  document.documentElement.style.setProperty('--bar-h', '0px');
}

/* ===== CART MANAGER ===== */
const Cart = {
  get() {
    try { return JSON.parse(localStorage.getItem('powerfit_cart') || '[]'); }
    catch { return []; }
  },
  save(items) {
    localStorage.setItem('powerfit_cart', JSON.stringify(items));
    this.updateBadge();
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: items }));
  },
  add(productId, qty = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const items = this.get();
    const existing = items.find(i => i.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        category: product.categoryLabel,
        price: product.price,
        weight: product.weight,
        emoji: product.emoji,
        bgColor: product.bgColor,
        accentColor: product.accentColor,
        qty
      });
    }
    this.save(items);
  },
  remove(productId) {
    const items = this.get().filter(i => i.id !== productId);
    this.save(items);
  },
  updateQty(productId, qty) {
    const items = this.get();
    const item = items.find(i => i.id === productId);
    if (!item) return;
    if (qty < 1) { this.remove(productId); return; }
    item.qty = qty;
    this.save(items);
  },
  clear() {
    this.save([]);
  },
  total() {
    return this.get().reduce((sum, i) => sum + i.price * i.qty, 0);
  },
  count() {
    return this.get().reduce((sum, i) => sum + i.qty, 0);
  },
  updateBadge() {
    const count = this.count();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }
};

/* ===== WISHLIST ===== */
const Wishlist = {
  get() {
    try { return JSON.parse(localStorage.getItem('powerfit_wishlist') || '[]'); }
    catch { return []; }
  },
  toggle(productId) {
    const list = this.get();
    const idx = list.indexOf(productId);
    if (idx > -1) { list.splice(idx, 1); }
    else { list.push(productId); }
    localStorage.setItem('powerfit_wishlist', JSON.stringify(list));
    return idx === -1;
  },
  has(productId) { return this.get().includes(productId); }
};

/* ===== ANNOUNCEMENT BAR CLOSE ===== */
function closeBar() {
  const bar = document.getElementById('announcement-bar');
  if (bar) bar.style.display = 'none';
  document.documentElement.style.setProperty('--bar-h', '0px');
}

/* ===== TOAST ===== */
function showToast(title, sub = '', icon = '✅') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <div class="toast-text">
      <div class="toast-title">${title}</div>
      ${sub ? `<div class="toast-sub">${sub}</div>` : ''}
    </div>
    <button class="toast-close" onclick="removeToast(this.parentElement)">×</button>
  `;
  container.appendChild(toast);
  setTimeout(() => removeToast(toast), 4000);
}

function removeToast(toast) {
  if (!toast || !toast.parentElement) return;
  toast.classList.add('removing');
  setTimeout(() => toast.remove(), 250);
}

/* ===== ADD TO CART GLOBAL ===== */
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  Cart.add(productId);
  const btn = document.querySelector(`[data-id="${productId}"] .add-to-cart`);
  if (btn) {
    btn.classList.add('added');
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`;
    }, 1800);
  }
  showToast('U shtua në shportë!', product.name, '🛒');
}

function toggleWishlist(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  const added = Wishlist.toggle(productId);
  const btn = document.querySelector(`[data-id="${productId}"] .product-wishlist`);
  if (btn) {
    btn.style.color = added ? 'var(--orange)' : '';
  }
  showToast(
    added ? 'U shtua në favorite!' : 'U hoq nga favoritet',
    product ? product.name : '',
    added ? '❤️' : '🤍'
  );
}

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 2000;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start) + suffix;
  }, 16);
}

document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
  initScrollAnimations();

  /* Counter observer */
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

  /* Nav scroll */
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });
  }

  /* Hamburger */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const isOpen = mobileMenu.classList.contains('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', isOpen);
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
});
