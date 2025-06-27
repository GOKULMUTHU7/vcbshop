<template>
  <nav class="custom-navbar">
    <div class="nav-container">
      <router-link to="/" class="brand-name">VCB StationeryShop</router-link>
      <div class="nav-links">
        <router-link to="/" class="nav-item">Home</router-link>
        <router-link to="/product-list" class="nav-item">Products</router-link>
        <router-link to="/cart" class="nav-item">Cart</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import eventBus from '@/eventBus'
import cart from '@/store/cart'

export default {
  setup() {
    const cartCount = ref(cart.getCount())
    const isCollapsed = ref(false)

    const updateCart = (newCount) => {
      cartCount.value = newCount
    }

    onMounted(() => {
      eventBus.on('cart-updated', updateCart)
    })

    onBeforeUnmount(() => {
      eventBus.off('cart-updated', updateCart)
    })

    return { cartCount, isCollapsed }
  }
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.custom-navbar {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
  box-shadow: 0 6px 25px rgba(255, 255, 255, 0.03);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-name {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(90deg, #4ade80, #3b82f6, #a855f7);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: animateText 5s ease infinite;
  text-decoration: none;
}

@keyframes animateText {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-item {
  color: #e5e7eb;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.nav-item::after {
  content: '';
  position: absolute;
  width: 0%;
  height: 2px;
  background: #60a5fa;
  left: 0;
  bottom: -3px;
  transition: width 0.3s ease;
}

.nav-item:hover::after {
  width: 100%;
}

.nav-item:hover {
  color: #60a5fa;
}
</style>
