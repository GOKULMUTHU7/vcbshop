<template>
  <div class="cart-page">
    <NavBar />
    <div class="cart-container">
      <h2 class="cart-title">Your Shopping Cart</h2>

      <div v-if="cartItems.length > 0" class="cart-content">
        <div class="table-wrapper">
          <table class="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cartItems" :key="item.id">
                <td>{{ item.title }}</td>
                <td>{{ item.quantity }}</td>
                <td>₹{{ item.price }}</td>
                <td>₹{{ (item.price * item.quantity).toFixed(2) }}</td>
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
  computed: {
    cartItems() {
      return cart.getItems()
    },
    grandTotal() {
      return this.cartItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      )
    }
  },
  mounted() {
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.cart-page {
  background: #000;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  padding-top: 2rem;
}

.three-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
}

.cart-container {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 20px;
  max-width: 1000px;
  margin: 3rem auto;
  box-shadow: 0 10px 40px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(14px);
  color: white;
}

.cart-title {
  font-size: 2.3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(270deg, #4ade80, #3b82f6, #a855f7);
  background-size: 800% 800%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientMove 8s ease infinite;
}

@keyframes gradientMove {
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

.cart-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  color: #e5e7eb;
}

.cart-table th,
.cart-table td {
  padding: 1rem;
  font-size: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.cart-table th {
  background-color: rgba(255, 255, 255, 0.1);
  text-transform: uppercase;
  color: #60a5fa;
  letter-spacing: 0.05em;
}

.cart-table tr:hover {
  background-color: rgba(255, 255, 255, 0.06);
}

.cart-summary {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.05);
}

.summary-text h4 {
  font-size: 1.4rem;
  font-weight: 600;
  color: #ffffff;
}

.amount {
  font-size: 1.8rem;
  font-weight: 700;
  color: #4ade80;
}

.checkout-btn {
  background: linear-gradient(to right, #ef4444, #f97316);
  border: none;
  color: #fff;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.checkout-btn:hover {
  background: linear-gradient(to right, #82f35d, #f97316);
  transform: scale(1.05);
}

.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  width: 120px;
  opacity: 0.7;
  margin-bottom: 1rem;
}

.empty-message {
  font-size: 1.25rem;
  color: #d1d5db;
  font-style: italic;
}
</style>
