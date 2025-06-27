<template>
  <div class="product-detail-page">
    <NavBar />
    <div class="container my-5 content-wrapper">
      <button @click="$router.go(-1)" class="btn btn-outline-secondary mb-4 premium-btn-back">
        <i class="fas fa-arrow-left me-2"></i> Back to Products
      </button>

      <div class="row g-4">
        <div class="col-md-6">
          <div class="premium-product-image-container">
            <img :src="product.image" class="img-fluid rounded premium-product-image" :alt="product.title">
          </div>
        </div>

        <div class="col-md-6">
          <div class="premium-product-info">
            <h1 class="premium-product-title gradient-text">{{ product.title }}</h1>

            <div class="d-flex align-items-center mb-3">
              <div class="premium-rating-badge me-3">
                {{ product.rating.rate }} <i class="fas fa-star"></i>
              </div>
              <span class="text-muted premium-review-count">({{ product.rating.count }} reviews)</span>
              <span class="premium-bought-count ms-3">{{ product.rating.bought }} bought</span>
            </div>

            <div class="premium-price-container mb-4">
              <h2 class="premium-current-price gradient-text">₹{{ product.price }}</h2>
              <div class="premium-original-price" v-if="product.price > 1000">
                <del>₹{{ Math.round(product.price * 1.1) }}</del>
                <span class="premium-discount">10% OFF</span>
              </div>
            </div>

            <div class="premium-product-description mb-4">
              <h4 class="premium-section-title">Description</h4>
              <p>{{ product.description }}</p>
            </div>

            <div class="premium-product-actions">
              <button @click="addToCart" class="btn btn-primary premium-add-to-cart">
                <i class="fas fa-cart-plus me-2"></i> Add to Cart
              </button>
              <button class="btn btn-outline-light premium-buy-now">
                <i class="fas fa-bolt me-2"></i> Buy Now
              </button>
            </div>

            <div class="premium-product-meta mt-4">
              <div class="premium-meta-item">
                <i class="fas fa-shield-alt me-2"></i> <span>1 Year Warranty</span>
              </div>
              <div class="premium-meta-item">
                <i class="fas fa-truck me-2"></i> <span>Free Delivery</span>
              </div>
              <div class="premium-meta-item">
                <i class="fas fa-undo me-2"></i> <span>7-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-12">
          <div class="premium-product-specs">
            <h4 class="premium-section-title mb-4">Specifications</h4>
            <div class="row">
              <div class="col-md-6" v-for="(spec, index) in specifications" :key="index">
                <div class="premium-spec-item">
                  <span class="premium-spec-name">{{ spec.name }}</span>
                  <span class="premium-spec-value">{{ spec.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Three.js starry background -->
    <div ref="threeContainer" class="three-canvas"></div>
  </div>
</template>

<script>
import NavBar from './NavBar.vue'
import products from '@/assets/products.json'
import cart from '@/store/cart'
import eventBus from '@/eventBus'
import * as THREE from 'three'

export default {
  name: 'ProductDetail',
  components: { NavBar },
  props: ['id'],
  data() {
    return {
      product: {},
      specifications: [
        { name: 'Brand', value: 'Premium Brand' },
        { name: 'Model', value: '2023 Edition' },
        { name: 'Color', value: 'Classic Black' },
        { name: 'Material', value: 'High-grade Materials' },
        { name: 'Dimensions', value: '10 x 5 x 2 inches' },
        { name: 'Weight', value: '1.2 kg' },
        { name: 'Warranty', value: '1 Year Manufacturer' },
        { name: 'SKU', value: 'PRD' + this.id.toString().padStart(4, '0') }
      ]
    }
  },
  created() {
    this.product = products.find(p => p.id == this.id) || {}
    if (!this.product.rating.bought) {
      this.product.rating.bought = Math.floor(Math.random() * 500) + 50
    }
  },
  methods: {
    addToCart() {
      cart.addItem(this.product)
      eventBus.emit('cart-updated', cart.getCount())
    }
  },
  mounted() {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 1

    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    this.$refs.threeContainer.appendChild(renderer.domElement)

    const starGeometry = new THREE.BufferGeometry()
    const starCount = 3000
    const starVertices = new Float32Array(starCount * 3)

    for (let i = 0; i < starCount * 3; i += 3) {
      starVertices[i] = (Math.random() - 0.5) * 500
      starVertices[i + 1] = (Math.random() - 0.5) * 500
      starVertices[i + 2] = (Math.random() - 0.5) * 500
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starVertices, 3))
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1, sizeAttenuation: true })
    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    const animate = () => {
      requestAnimationFrame(animate)
      stars.rotation.y += 0.0005
      stars.rotation.x += 0.0003
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
.product-detail-page {
  background-color: #000;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  color: #fff;
}

.content-wrapper {
  position: relative;
  z-index: 2;
}

.three-canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}

.gradient-text {
  background: linear-gradient(90deg, #8b5cf6, #ec4899, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 5s ease infinite;
  background-size: 300% 300%;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.premium-product-title {
  font-size: 2rem;
  font-weight: 700;
}

.premium-current-price {
  font-size: 2rem;
  font-weight: 700;
}

.premium-product-image-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #4b5563;
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.05);
}

.premium-product-description, .premium-product-meta, .premium-product-specs {
  color: #e5e7eb;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
  margin-top: 20px;
  border: 1px solid #374151;
}

.premium-section-title {
  color: #c084fc;
}

.premium-add-to-cart {
  background: linear-gradient(to right, #8b5cf6, #ec4899);
  border: none;
  color: white;
}

.premium-add-to-cart:hover {
  background: linear-gradient(to right, #7c3aed, #f43f5e);
}

.premium-buy-now {
  border-color: #f9a8d4;
  color: #f9a8d4;
}

.premium-buy-now:hover {
  background: #f9a8d4;
  color: black;
}

.premium-rating-badge {
  background: #fde68a;
  color: #92400e;
}
</style>
