<template>
  <div id="ecommerce-wrapper">

    <!-- ═══════════════════════════════════════════════════════════════════
         LAYER 1 — The "bait" e-commerce storefront
         This is what the user initially sees. A normal-looking shopping site.
         ═══════════════════════════════════════════════════════════════════ -->

    <!-- Top bar -->
    <div class="top-bar">
      <div class="container flex justify-between items-center">
        <span>🚚 Free Shipping on Orders Over $99 | Use Code: <strong>JACKET25</strong></span>
        <span>📞 Customer Support: 1-800-555-0199</span>
      </div>
    </div>

    <!-- Navbar -->
    <nav class="ecom-nav">
      <div class="container flex justify-between items-center">
        <div class="logo">Jacket<span>District</span></div>
        <div class="nav-links">
          <a href="#">Home</a>
          <a href="#">Men</a>
          <a href="#">Women</a>
          <a href="#">Kids</a>
          <a href="#">Sale 🔥</a>
        </div>
        <div class="nav-right flex items-center gap-3">
          <a href="#" class="nav-icon">🔍</a>
          <a href="#" class="nav-icon">👤</a>
          <a href="#" class="nav-icon cart-icon">🛒 <span class="cart-count">2</span></a>
        </div>
      </div>
    </nav>

    <!-- Hero banner -->
    <section class="hero">
      <div class="hero-content">
        <p class="hero-tag">New Season Collection</p>
        <h1>Premium Leather<br>Jackets 2026</h1>
        <p class="hero-sub">Handcrafted from genuine Italian leather. Free returns within 30 days.</p>
        <div class="flex gap-3">
          <a href="#" class="cta-btn">Shop Now →</a>
          <a href="#" class="cta-btn outline">View Lookbook</a>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">Shop by Category</h2>
        <div class="cat-grid">
          <div class="cat-card" v-for="c in categories" :key="c.name">
            <div class="cat-img" :style="{ background: c.bg }">{{ c.icon }}</div>
            <div class="cat-name">{{ c.name }}</div>
            <div class="cat-count">{{ c.count }} items</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Products grid -->
    <section class="section section-alt">
      <div class="container">
        <h2 class="section-title">Bestsellers</h2>
        <div class="product-grid">
          <div class="product-card" v-for="p in products" :key="p.name">
            <div class="product-img" :style="{ background: p.bg }">
              <span class="product-emoji">{{ p.icon }}</span>
              <span v-if="p.badge" class="product-badge">{{ p.badge }}</span>
            </div>
            <div class="product-info">
              <div class="product-name">{{ p.name }}</div>
              <div class="product-desc">{{ p.desc }}</div>
              <div class="product-price flex justify-between items-center">
                <div>
                  <span class="price">${{ p.price }}</span>
                  <span v-if="p.oldPrice" class="old-price">${{ p.oldPrice }}</span>
                </div>
                <div class="stars">{{ '★'.repeat(p.stars) }}{{ '☆'.repeat(5 - p.stars) }}</div>
              </div>
              <button class="add-to-cart">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust badges -->
    <section class="section">
      <div class="container">
        <div class="trust-grid">
          <div class="trust-item" v-for="t in trust" :key="t.label">
            <div class="trust-icon">{{ t.icon }}</div>
            <div class="trust-label">{{ t.label }}</div>
            <div class="trust-sub">{{ t.sub }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="newsletter">
      <div class="container" style="text-align:center;">
        <h2>Get 15% Off Your First Order</h2>
        <p style="color:#aaa;margin:8px 0 20px;">Subscribe to our newsletter for exclusive deals and new arrivals.</p>
        <div class="flex justify-center gap-2" style="justify-content:center;">
          <input type="email" placeholder="Enter your email" class="nl-input" />
          <button class="nl-btn">Subscribe</button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="ecom-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="logo" style="margin-bottom:12px;">Jacket<span>District</span></div>
            <p style="color:#777;font-size:13px;line-height:1.6;">Premium outerwear since 2018. Crafted for style, built
              for durability.</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <a href="#">About Us</a><a href="#">Contact</a><a href="#">FAQs</a><a href="#">Size Guide</a>
          </div>
          <div>
            <h4>Customer Service</h4>
            <a href="#">Track Order</a><a href="#">Returns</a><a href="#">Shipping Info</a><a href="#">Gift Cards</a>
          </div>
          <div>
            <h4>Follow Us</h4>
            <a href="#">Instagram</a><a href="#">Facebook</a><a href="#">Twitter</a><a href="#">TikTok</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2026 JacketDistrict. All rights reserved. | <a href="#">Privacy Policy</a> | <a href="#">Terms of
              Service</a></p>
        </div>
      </div>
    </footer>






  </div>
</template>

<script setup>

// ── E-commerce dummy data ────────────────────────────────────────────────────
const categories = [
  { name: 'Leather Jackets', icon: '🧥', count: 48, bg: 'linear-gradient(135deg, #2c1810, #4a2520)' },
  { name: 'Denim', icon: '👖', count: 36, bg: 'linear-gradient(135deg, #1a2a4a, #2a3a5a)' },
  { name: 'Outerwear', icon: '🧤', count: 24, bg: 'linear-gradient(135deg, #1a3a2a, #2a4a3a)' },
  { name: 'Accessories', icon: '🧣', count: 62, bg: 'linear-gradient(135deg, #3a2a1a, #4a3a2a)' },
]

const products = [
  { name: 'Classic Rider Jacket', desc: 'Genuine cowhide leather', price: 289, oldPrice: 399, stars: 5, icon: '🧥', badge: 'SALE', bg: 'linear-gradient(135deg, #1a1a1a, #2a2020)' },
  { name: 'Urban Bomber', desc: 'Water-resistant nylon', price: 179, stars: 4, icon: '🧥', bg: 'linear-gradient(135deg, #1a1a2a, #202030)' },
  { name: 'Wool Peacoat', desc: 'Italian merino blend', price: 349, stars: 5, icon: '🧥', badge: 'NEW', bg: 'linear-gradient(135deg, #2a1a1a, #3a2020)' },
  { name: 'Sherpa Denim Jacket', desc: 'Lined with faux sherpa', price: 159, oldPrice: 219, stars: 4, icon: '🧥', badge: '-27%', bg: 'linear-gradient(135deg, #1a2a3a, #203040)' },
  { name: 'Suede Trucker', desc: 'Genuine suede leather', price: 249, stars: 4, icon: '🧥', bg: 'linear-gradient(135deg, #2a2a1a, #3a3020)' },
  { name: 'Windbreaker Pro', desc: 'Lightweight & packable', price: 119, stars: 3, icon: '🧥', bg: 'linear-gradient(135deg, #1a1a2a, #202040)' },
  { name: 'Heritage Moto', desc: 'Distressed Italian hide', price: 429, stars: 5, icon: '🧥', badge: 'BEST', bg: 'linear-gradient(135deg, #2a1a0a, #3a2a1a)' },
  { name: 'Down Parka', desc: '800-fill goose down', price: 399, oldPrice: 549, stars: 5, icon: '🧥', badge: 'SALE', bg: 'linear-gradient(135deg, #0a1a2a, #1a2a3a)' },
]

const trust = [
  { icon: '🚚', label: 'Free Shipping', sub: 'On orders over $99' },
  { icon: '🔄', label: '30-Day Returns', sub: 'No questions asked' },
  { icon: '🛡️', label: 'Secure Payment', sub: '256-bit SSL encryption' },
  { icon: '⭐', label: '50,000+ Reviews', sub: '4.8 average rating' },
]


</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap');

/* ═══════ Reset for ecommerce scope ═══════ */
#ecommerce-wrapper {
  font-family: 'Inter', sans-serif;
  color: #111;
  background: #fff;
  line-height: 1.6;
}

#ecommerce-wrapper * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-center {
  justify-content: center;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

/* ═══════ Top bar ═══════ */
.top-bar {
  background: #111;
  color: #ccc;
  font-size: 12px;
  padding: 8px 0;
}

/* ═══════ Navbar ═══════ */
.ecom-nav {
  background: #fff;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-family: 'Playfair Display', serif;
  font-size: 26px;
  font-weight: 900;
  color: #111;
  letter-spacing: -1px;
}

.logo span {
  color: #c0392b;
}

.nav-links {
  display: flex;
  gap: 28px;
}

.nav-links a {
  color: #333;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.15s;
}

.nav-links a:hover {
  color: #c0392b;
}

.nav-icon {
  text-decoration: none;
  font-size: 18px;
  position: relative;
}

.cart-icon {
  position: relative;
}

.cart-count {
  position: absolute;
  top: -6px;
  right: -10px;
  background: #c0392b;
  color: #fff;
  font-size: 10px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

/* ═══════ Hero ═══════ */
.hero {
  background: linear-gradient(135deg, #1a1a1a 0%, #2c1810 50%, #111 100%);
  padding: 100px 40px;
  min-height: 500px;
  display: flex;
  align-items: center;
}

.hero-content {
  max-width: 600px;
}

.hero-tag {
  color: #c0392b;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 12px;
}

.hero h1 {
  font-family: 'Playfair Display', serif;
  font-size: 52px;
  font-weight: 900;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 16px;
}

.hero-sub {
  color: #999;
  font-size: 16px;
  margin-bottom: 28px;
}

.cta-btn {
  display: inline-block;
  padding: 14px 32px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.15s;
  cursor: pointer;
  background: #c0392b;
  color: #fff;
  border: 2px solid #c0392b;
}

.cta-btn:hover {
  background: #a93226;
}

.cta-btn.outline {
  background: transparent;
  color: #fff;
  border-color: rgba(255, 255, 255, 0.3);
}

.cta-btn.outline:hover {
  border-color: #fff;
}

/* ═══════ Sections ═══════ */
.section {
  padding: 60px 0;
}

.section-alt {
  background: #f8f7f5;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 40px;
  color: #111;
}

/* ═══════ Category cards ═══════ */
.cat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.cat-card {
  text-align: center;
  cursor: pointer;
}

.cat-img {
  height: 180px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56px;
  margin-bottom: 12px;
  transition: transform 0.2s;
}

.cat-card:hover .cat-img {
  transform: scale(1.03);
}

.cat-name {
  font-weight: 600;
  font-size: 15px;
  color: #111;
}

.cat-count {
  font-size: 12px;
  color: #999;
}

/* ═══════ Product cards ═══════ */
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eee;
  transition: box-shadow 0.2s, transform 0.2s;
}

.product-card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.product-img {
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.product-emoji {
  font-size: 72px;
}

.product-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #c0392b;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 4px;
  text-transform: uppercase;
}

.product-info {
  padding: 16px;
}

.product-name {
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 4px;
  color: #111;
}

.product-desc {
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
}

.price {
  font-weight: 700;
  font-size: 18px;
  color: #111;
}

.old-price {
  text-decoration: line-through;
  color: #bbb;
  font-size: 14px;
  margin-left: 6px;
}

.stars {
  color: #f39c12;
  font-size: 13px;
}

.add-to-cart {
  width: 100%;
  padding: 10px;
  margin-top: 12px;
  border: 1px solid #111;
  background: transparent;
  color: #111;
  font-size: 13px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.add-to-cart:hover {
  background: #111;
  color: #fff;
}

/* ═══════ Trust ═══════ */
.trust-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  text-align: center;
}

.trust-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.trust-label {
  font-weight: 600;
  font-size: 14px;
  color: #111;
}

.trust-sub {
  font-size: 12px;
  color: #999;
}

/* ═══════ Newsletter ═══════ */
.newsletter {
  background: #111;
  padding: 60px 0;
}

.newsletter h2 {
  color: #fff;
  font-family: 'Playfair Display', serif;
  font-size: 28px;
}

.nl-input {
  padding: 12px 20px;
  border: 1px solid #333;
  background: #222;
  color: #fff;
  border-radius: 4px;
  font-size: 14px;
  width: 320px;
  outline: none;
}

.nl-input::placeholder {
  color: #666;
}

.nl-btn {
  padding: 12px 28px;
  background: #c0392b;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.nl-btn:hover {
  background: #a93226;
}

/* ═══════ Footer ═══════ */
.ecom-footer {
  background: #0a0a0a;
  padding: 48px 0 24px;
  color: #999;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 32px;
}

.footer-grid h4 {
  color: #fff;
  font-size: 14px;
  margin-bottom: 12px;
}

.footer-grid a {
  display: block;
  color: #777;
  text-decoration: none;
  font-size: 13px;
  padding: 3px 0;
}

.footer-grid a:hover {
  color: #fff;
}

.footer-bottom {
  border-top: 1px solid #222;
  padding-top: 20px;
  text-align: center;
  font-size: 12px;
}

.footer-bottom a {
  color: #666;
  text-decoration: none;
}

/* ═══════ Custom Popup (loading overlay) ═══════ */
.popup {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.popup-content {
  background: #1a1a1a;
  color: #f0f0f0;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  width: 90%;
  max-width: 550px;
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.loading-spinner {
  width: 80px;
  height: 80px;
  margin: 0 auto 25px;
  animation: rotate 2s linear infinite;
}

.loading-spinner .path {
  stroke: #c9a050;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }

  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

.popup-content p {
  font-size: 28px;
  color: #e0e0e0;
  margin-bottom: 50px;
  font-weight: 400;
  letter-spacing: 0.5px;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.buttons button {
  padding: 20px 48px;
  border: 1px solid transparent;
  border-radius: 12px;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

#cancelBtn {
  background: transparent;
  color: #888;
  border-color: #444;
}

#cancelBtn:hover {
  color: #fff;
  border-color: #888;
}

#continueBtn {
  background: #c9a050;
  /* Premium gold accent */
  color: #111;
}

#continueBtn:hover:not(:disabled) {
  background: #e6c070;
  box-shadow: 0 0 15px rgba(201, 160, 80, 0.4);
}

#continueBtn:disabled {
  background: #333;
  color: #666;
  cursor: not-allowed;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
