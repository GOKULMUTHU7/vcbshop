<template>
  <div class="payment-page">
    <NavBar />
    
    <div class="payment-container">
      <div class="glass-box">
        <div class="payment-success" v-if="paymentSuccess">
          <div class="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
          </div>
          <h2>Order Placed Successfully!</h2>
          <p>Your order will be delivered soon</p>
          <router-link to="/" class="btn btn-continue">Continue Shopping</router-link>
        </div>

        <div class="payment-form" v-else>
          <div class="row">
            <div class="col-lg-6 customer-details">
              <h3 class="section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                </svg>
                Delivery Information
              </h3>
              <form>
                <div class="form-group">
                  <label>Full Name</label>
                  <input v-model="form.name" class="form-control" required />
                </div>

                <div class="form-group">
                  <label>Phone Number</label>
                  <input v-model="form.phone" class="form-control" type="tel" required />
                </div>

                <div class="form-group">
                  <label>Flat / House Number</label>
                  <input v-model="form.flat" class="form-control" required />
                </div>

                <div class="form-group">
                  <label>Street Address</label>
                  <input v-model="form.address" class="form-control" required />
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>City</label>
                      <input v-model="form.city" class="form-control" required />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Pincode</label>
                      <input v-model="form.pincode" class="form-control" required />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div class="col-lg-6 payment-options">
              <h3 class="section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z"/>
                  <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z"/>
                </svg>
                Payment Method
              </h3>

              <div class="payment-methods">
                <div class="payment-method" 
                     v-for="method in paymentMethods" 
                     :key="method.id"
                     :class="{active: selectedPayment === method.id}"
                     @click="selectPayment(method.id)">
                  <div class="method-radio">
                    <div class="radio-circle" :class="{checked: selectedPayment === method.id}"></div>
                  </div>
                  <div class="method-icon">
                    <img :src="method.icon" :alt="method.name" />
                  </div>
                  <div class="method-info">
                    <h5>{{ method.name }}</h5>
                    <p>{{ method.description }}</p>
                  </div>
                </div>
              </div>

              <div class="order-summary">
                <h4>Order Summary</h4>
                <div class="summary-row">
                  <span>Subtotal</span>
                  <span>₹{{ cartTotal.toFixed(2) }}</span>
                </div>
                <div class="summary-row">
                  <span>Tax ({{ (taxRate * 100).toFixed(0) }}%)</span>
                  <span>₹{{ taxAmount.toFixed(2) }}</span>
                </div>
                <div class="summary-row">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <div class="summary-row total">
                  <span>Total</span>
                  <span>₹{{ orderTotal.toFixed(2) }}</span>
                </div>
              </div>

              <button class="btn-pay" @click="processPayment">
                {{ selectedPayment === 'cod' ? 'Place Order' : 'Pay Now' }}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Three.js Starry Background -->
    <div ref="threeContainer" class="three-bg"></div>
  </div>
</template>

<script>
import * as THREE from 'three'
import NavBar from './NavBar.vue'

export default {
  components: { NavBar },
  data() {
    return {
      form: {
        name: '',
        phone: '',
        flat: '',
        address: '',
        city: '',
        pincode: ''
      },
      selectedPayment: 'upi',
      paymentSuccess: false,
      cartTotal: 2499.99,
      taxRate: 0.18, // 18% tax rate
      paymentMethods: [
        {
          id: 'upi',
          name: 'UPI Payment',
          description: 'Pay using any UPI app',
          icon: 'https://cdn-icons-png.flaticon.com/512/825/825454.png'
        },
        {
          id: 'card',
          name: 'Credit/Debit Card',
          description: 'Pay using your card',
          icon: 'https://cdn-icons-png.flaticon.com/512/196/196578.png'
        },
        {
          id: 'netbanking',
          name: 'Net Banking',
          description: 'Direct bank transfer',
          icon: 'https://cdn-icons-png.flaticon.com/512/2489/2489756.png'
        },
        {
          id: 'cod',
          name: 'Cash on Delivery',
          description: 'Pay when you receive',
          icon: 'https://cdn-icons-png.flaticon.com/512/159/159268.png'
        }
      ]
    }
  },
  computed: {
    taxAmount() {
      return this.cartTotal * this.taxRate;
    },
    orderTotal() {
      return this.cartTotal + this.taxAmount;
    }
  },
  methods: {
    selectPayment(methodId) {
      this.selectedPayment = methodId
    },
    processPayment() {
      // Validate form
      if (!this.form.name || !this.form.phone || !this.form.address) {
        alert('Please fill all required fields')
        return
      }
      
      // Process payment (simulated)
      this.paymentSuccess = true
    },
    initThreeJS() {
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
  },
  mounted() {
    this.initThreeJS()
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

* {
  font-family: 'Outfit', sans-serif;
  box-sizing: border-box;
}

.payment-page {
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

.payment-container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.glass-box {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title svg {
  color: #3b82f6;
}

.payment-form {
  padding: 2rem;
}

.customer-details {
  padding-right: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-control {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  width: 100%;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  outline: none;
}

label {
  color: #a1a1aa;
  margin-bottom: 8px;
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
}

.payment-options {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.payment-methods {
  margin-bottom: 2rem;
}

.payment-method {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.payment-method:hover {
  background: rgba(255, 255, 255, 0.05);
}

.payment-method.active {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.method-radio {
  margin-right: 1rem;
}

.radio-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.radio-circle.checked {
  border-color: #3b82f6;
  background: #3b82f6;
}

.radio-circle.checked::after {
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}

.method-icon {
  margin-right: 1rem;
}

.method-icon img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.method-info h5 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
}

.method-info p {
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: #a1a1aa;
}

.order-summary {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.order-summary h4 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  color: #fff;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 0.95rem;
  color: #d1d5db;
}

.summary-row.total {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 12px;
}

.summary-row span:last-child {
  text-align: right;
  min-width: 80px;
}

.btn-pay {
  background: linear-gradient(to right, #3b82f6, #6366f1);
  color: #fff;
  border: none;
  padding: 16px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  width: 100%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-pay:hover {
  background: linear-gradient(to right, #6366f1, #3b82f6);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
}

.btn-pay:active {
  transform: translateY(0);
}

.payment-success {
  text-align: center;
  padding: 4rem 2rem;
}

.success-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 2rem;
  background: rgba(74, 222, 128, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon svg {
  color: #4ade80;
  width: 48px;
  height: 48px;
}

.payment-success h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #fff;
}

.payment-success p {
  font-size: 1.1rem;
  color: #a1a1aa;
  margin-bottom: 2rem;
}

.btn-continue {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-continue:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 992px) {
  .customer-details {
    padding-right: 0;
    margin-bottom: 2rem;
  }
  
  .payment-form {
    padding: 1.5rem;
  }
  
  .payment-options {
    padding: 1.5rem;
  }
}

@media (max-width: 576px) {
  .payment-container {
    padding: 1rem;
  }
  
  .payment-method {
    padding: 0.75rem;
  }
  
  .method-icon img {
    width: 32px;
    height: 32px;
  }
  
  .success-icon {
    width: 80px;
    height: 80px;
  }
  
  .payment-success h2 {
    font-size: 1.5rem;
  }
}
</style>