<template>
  <div class="cart-page">
    <NavBar />
    <div class="cart-container">
      <h2 class="cart-title">Your Shopping Cart</h2>

      <div v-if="localCartItems && localCartItems.length > 0" class="cart-content">
        <div class="table-wrapper">
          <table class="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in localCartItems" :key="item.id">
                <td class="product-cell">
                  <div class="product-info">
                    <img :src="item.image" :alt="item.title" class="product-image" />
                    <div>
                      <h4 class="product-title">{{ item.title }}</h4>
                      <p class="product-category">{{ item.category }}</p>
                    </div>
                  </div>
                </td>
                <td>₹{{ item.price.toFixed(2) }}</td>
                <td>
                  <div class="quantity-controls">
                    <button @click="decreaseQuantity(item)" class="qty-btn minus">-</button>
                    <span class="quantity">{{ item.quantity }}</span>
                    <button @click="increaseQuantity(item)" class="qty-btn plus">+</button>
                  </div>
                </td>
                <td>₹{{ (item.price * item.quantity).toFixed(2) }}</td>
                <td>
                  <button @click="removeItem(item)" class="remove-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                      <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="cart-summary">
          <div class="summary-text">
            <h4>Grand Total:</h4>
            <p class="amount">₹{{ grandTotal.toFixed(2) }}</p>
          </div>

          <router-link to="/payment">
            <button class="checkout-btn">Proceed to Payment</button>
          </router-link>
        </div>
      </div>

      <div v-else class="empty-cart">
        <img src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png" alt="Empty Cart" class="empty-icon" />
        <p class="empty-message">Your cart is currently empty.</p>
        <router-link to="/" class="shop-btn">Start Shopping</router-link>
      </div>
    </div>

    <!-- Three.js Starry Background -->
    <div ref="threeContainer" class="three-bg"></div>
  </div>
</template>

<script>
import * as THREE from 'three'
import cart from '@/store/cart'
import NavBar from './NavBar.vue'

export default {
  components: { NavBar },
  data() {
    return {
      localCartItems: cart.getItems() || [] // Initialize with cart items or empty array
    }
  },
  computed: {
    grandTotal() {
      return this.localCartItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      )
    }
  },
  methods: {
    updateLocalCart() {
      this.localCartItems = [...cart.getItems()] // Create new array for reactivity
    },
    increaseQuantity(item) {
      cart.addItem(item)
      this.updateLocalCart()
    },
    decreaseQuantity(item) {
      cart.decreaseQuantity(item.id)
      this.updateLocalCart()
    },
    removeItem(item) {
      cart.removeItem(item.id)
      this.updateLocalCart()
    }
  },
  mounted() {
    // Three.js initialization remains the same
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 1

    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    this.$refs.threeContainer.appendChild(renderer.domElement)

    const starsGeometry = new THREE.BufferGeometry()
    const starCount = 8000
    const positions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 500
      positions[i + 1] = (Math.random() - 0.5) * 100
      positions[i + 2] = (Math.random() - 0.5) * 500
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.8,
      sizeAttenuation: true
    })

    const starField = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(starField)

    const animate = () => {
      requestAnimationFrame(animate)
      starField.rotation.y += 0.0005
      starField.rotation.x += 0.0003
      renderer.render(scene, camera)
    }

    animate()

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    })
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

* {
  font-family: 'Outfit', sans-serif;
  box-sizing: border-box;
}

.cart-page {
  background: #0a0e17;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  color: #fff;
  padding-top: 80px;
}

.three-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
  opacity: 0.6;
}

.cart-container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.cart-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2.5rem;
  background: linear-gradient(90deg, #4ade80, #3b82f6, #a855f7);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientMove 8s ease infinite;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.cart-content {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.cart-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: rgba(31, 41, 55, 0.6);
}

.cart-table th {
  background-color: rgba(17, 24, 39, 0.9);
  color: #60a5fa;
  padding: 1.2rem 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.cart-table td {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  vertical-align: middle;
}

.product-cell {
  text-align: left;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.product-image {
  width: 90px;
  height: 90px;
  object-fit: contain;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
}

.product-category {
  margin: 0.5rem 0 0;
  font-size: 0.85rem;
  color: #a1a1aa;
  text-transform: capitalize;
}

.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.qty-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.quantity {
  min-width: 36px;
  text-align: center;
  font-weight: 500;
}

.remove-btn {
  background: rgba(239, 68, 68, 0.1);
  border: none;
  color: #ef4444;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

.remove-btn svg {
  width: 18px;
  height: 18px;
}

.cart-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.summary-text {
  text-align: right;
}

.summary-text h4 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
}

.amount {
  font-size: 2rem;
  font-weight: 700;
  color: #4ade80;
  margin-top: 0.5rem;
}

.checkout-btn {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: #fff;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.checkout-btn:hover {
  background: linear-gradient(135deg, #6366f1, #3b82f6);
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(59, 130, 246, 0.4);
}

.empty-cart {
  text-align: center;
  padding: 5rem 2rem;
}

.empty-icon {
  width: 160px;
  opacity: 0.8;
  margin-bottom: 1.5rem;
}

.empty-message {
  font-size: 1.5rem;
  color: #d1d5db;
  margin-bottom: 2rem;
}

.shop-btn {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: #fff;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
}

.shop-btn:hover {
  background: linear-gradient(135deg, #6366f1, #3b82f6);
  transform: translateY(-2px);
}

@media (max-width: 992px) {
  .cart-table {
    display: block;
    overflow-x: auto;
  }
  
  .product-info {
    gap: 1rem;
  }
  
  .product-image {
    width: 70px;
    height: 70px;
  }
}

@media (max-width: 768px) {
  .cart-container {
    padding: 1rem;
  }
  
  .cart-title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  .cart-table th,
  .cart-table td {
    padding: 1rem;
  }
  
  .cart-summary {
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-end;
  }
  
  .empty-icon {
    width: 120px;
  }
  
  .empty-message {
    font-size: 1.2rem;
  }
}

@media (max-width: 576px) {
  .product-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .product-title {
    font-size: 1rem;
  }
  
  .checkout-btn,
  .shop-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>