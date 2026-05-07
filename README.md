# PowerFit Supplements 💪

**Projekt shkollor** — Hermann Gmeiner, Klasa 11-B  
**Anëtarët:** Albion Çaushi, Bjorni Kule

---

## Struktura e Projektit

```
Dyqan-Suplementesh/
├── index.html          ← Faqja kryesore (homepage)
├── products.html       ← Katalogu i produkteve me filtra
├── cart.html           ← Shporta e blerjeve
├── checkout.html       ← Pagesa me Stripe
├── css/
│   └── style.css       ← Stilizimi i plotë
├── js/
│   ├── products-data.js ← Të dhënat e produkteve
│   └── cart.js         ← Menaxhimi i shportës (localStorage)
├── php/
│   ├── config.php              ← Konfigurimi (Stripe keys, DB)
│   ├── create-payment-intent.php ← Stripe API endpoint
│   ├── process-order.php       ← Procesimi i porosisë
│   ├── webhook.php             ← Stripe webhook handler
│   └── db-setup.sql            ← SQL për bazën e të dhënave
└── images/             ← Imazhet (të shtohen)
```

## Si ta hapësh

### Frontend vetëm (pa PHP)
Hap direkt `index.html` në browser. Të gjitha faqet funksionojnë pa server.

### Me PHP + Stripe (i plotë)
1. Instalo PHP 8.0+ dhe server lokal (XAMPP/WAMP)
2. Kopjo projektin në `htdocs/` (XAMPP)
3. Instalo Stripe PHP library:
   ```bash
   cd php
   composer require stripe/stripe-php
   ```
4. Hapë `php/config.php` dhe vendos çelësat e Stripe:
   ```php
   define('STRIPE_SECRET_KEY', 'sk_test_tu_chelesin_ketu');
   define('STRIPE_PUBLISHABLE_KEY', 'pk_test_tu_chelesin_ketu');
   ```
5. Në `checkout.html`, ndryshoj `STRIPE_PUBLIC_KEY` me çelësin tënd
6. (Opsionale) Ekzekuto `php/db-setup.sql` në phpMyAdmin
7. Hap `http://localhost/Dyqan-Suplementesh/`

## Çelësat e Stripe (Test)
- Merr çelësat falas nga: **dashboard.stripe.com**
- Për teste, përdor kartën: `4242 4242 4242 4242`
- Data: çdo datë e ardhshme, CVC: çdo 3 shifra

## Teknologjitë
- **HTML5** — Struktura semantike
- **CSS3** — Custom properties, Grid, Flexbox, Animations
- **JavaScript (Vanilla)** — SPA-like, localStorage cart
- **PHP 8+** — API endpoints, Stripe integration
- **Stripe API** — Procesimi i pagesave online
- **Git** — Menaxhimi i versioneve
