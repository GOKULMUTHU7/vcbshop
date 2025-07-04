 <template>
  <div class="product-page">
    <NavBar />
    <div class="container-fluid content-wrapper">
      <div class="row">
        <!-- Filters Column -->
        <div class="col-md-2 filters-col px-4">
          <div class="filters-card sticky-top">
            <h5 class="filter-title">Customer Reviews</h5>
            <div class="filter-section">
              <h6 class="filter-subtitle">Discount</h6>
              <div class="form-check" v-for="discount in discounts" :key="discount.value">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  :id="'discount-'+discount.value"
                  v-model="selectedDiscounts"
                  :value="discount.value"
                >
                <label class="form-check-label" :for="'discount-'+discount.value">
                  {{ discount.label }}
                </label>
              </div>
            </div>

            <div class="filter-section">
              <h6 class="filter-subtitle">Availability</h6>
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="out-of-stock"
                  v-model="includeOutOfStock"
                >
                <label class="form-check-label" for="out-of-stock">
                  Include Out of Stock
                </label>
              </div>
            </div>

            <div class="filter-section">
              <h6 class="filter-subtitle">Pay On Delivery</h6>
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="pay-on-delivery"
                  v-model="payOnDeliveryOnly"
                >
                <label class="form-check-label" for="pay-on-delivery">
                  Eligible for Pay On Delivery
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Products Column -->
        <div class="col-md-10 px-4 py-4">
          <div class="results-header mb-4">
            <h2 class="results-title">Results</h2>
            <p class="results-subtitle">Check each product page for other buying options. Price and other details may vary based on product size and colour.</p>
            <p v-if="filteredProducts.length === 0" class="no-results text-muted">
              No products match your selected filters. Try adjusting your criteria.
            </p>
          </div>

          <div class="row g-4">
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3" v-for="product in filteredProducts" :key="product.id">
              <div class="card product-card h-100">
                <div class="product-badge" v-if="product.discount">
                  {{ product.discount }}% OFF
                </div>
                <div class="product-img-container">
                  <img :src="product.image" class="product-img" :alt="product.title" />
                </div>
                
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">{{ product.title }}</h5>
                  <div class="ratings mb-2">
                    <span class="stars">★★★★★</span>
                    <span class="review-count">({{ product.rating.count }})</span>
                  </div>

                  <div class="price-section">
                    <span class="current-price">₹{{ product.price }}</span>
                    <span class="original-price">M.R.P. ₹{{ product.originalPrice }}</span>
                    <span class="discount-percent">({{ product.discount }}% off)</span>
                  </div>

                  <div class="delivery-info">
                    <span class="free-delivery">FREE delivery {{ deliveryDate }}</span>
                    <span class="prime-delivery">Or membership get FREE delivery Tomorrow, 5 Jul</span>
                  </div>

                  <div class="mt-auto pt-2">
                    <div class="d-flex justify-content-between">
                      <router-link :to="'/product/' + product.id" class="btn btn-outline-primary btn-sm">View Details</router-link>
                      <button @click="addToCart(product)" class="btn btn-primary btn-sm">Add to Cart</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Starry background -->
    <div ref="threeContainer" class="three-canvas"></div>
  </div>
</template>

<script>
import * as THREE from 'three'
import products from '@/assets/products.json'
import NavBar from './NavBar.vue'
import cart from '@/store/cart'
import eventBus from '@/eventBus'

export default {
  components: { NavBar },
  data() {
    return {
      allProducts: products.map(p => ({
        ...p,
        originalPrice: Math.round(p.price * (1 + (Math.random() * 0.3))),
        discount: Math.floor(Math.random() * 30) + 10,
        inStock: Math.random() > 0.3,
        payOnDelivery: Math.random() > 0.5
      })),
      discounts: [
        { value: 10, label: '10% Off or more' },
        { value: 25, label: '25% Off or more' },
        { value: 35, label: '35% Off or more' },
        { value: 50, label: '50% Off or more' },
        { value: 60, label: '60% Off or more' },
        { value: 70, label: '70% Off or more' }
      ],
      selectedDiscounts: [],
      includeOutOfStock: false,
      payOnDeliveryOnly: false,
      deliveryDate: this.getDeliveryDate()
    }
  },
  computed: {
    filteredProducts() {
      return this.allProducts.filter(product => {
        // Discount filter
        if (this.selectedDiscounts.length > 0) {
          const meetsDiscount = this.selectedDiscounts.some(minDiscount => 
            product.discount >= minDiscount
          )
          if (!meetsDiscount) return false
        }
        
        // Stock filter
        if (!this.includeOutOfStock && !product.inStock) {
          return false
        }
        
        // Pay on delivery filter
        if (this.payOnDeliveryOnly && !product.payOnDelivery) {
          return false
        }
        
        return true
      }).slice(0, 12)
    }
  },
  methods: {
    addToCart(product) {
      cart.addItem(product)
      eventBus.emit('cart-updated', cart.getCount())
    },
    getDeliveryDate() {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const date = new Date()
      date.setDate(date.getDate() + 3)
      return `${days[date.getDay()]}, ${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`
    }
  },
  mounted() {
    // Starfield setup
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
      positions[i + 1] = (Math.random() - 0.5) * 500
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
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap');

* {
  font-family: 'Outfit', sans-serif;
}

.product-page {
  background: #000;
  min-height: 100vh;
  overflow: hidden;
  position: relative;
  padding-top: 2rem;
}

.content-wrapper {
  position: relative;
  z-index: 2;
  min-height: calc(100vh - 70px);
}

.filters-col {
  padding-top: 1rem;
}

.filters-card {
  background: rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
  top: 1rem;
}

.filter-title {
  color: #fff;
  font-weight: 600;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.filter-subtitle {
  color: #fff;
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.filter-section {
  margin-bottom: 1.5rem;
}

.form-check {
  margin-bottom: 0.5rem;
}

.form-check-input {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.form-check-label {
  color: #d1d5db;
  font-size: 0.9rem;
}

/* Results Header */
.results-header {
  margin-bottom: 2rem;
}

.results-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
}

.results-subtitle {
  color: #d1d5db;
  font-size: 0.95rem;
  margin-bottom: 0;
}

/* Product Cards */
.product-card {
  background: rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 6px 25px rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
  backdrop-filter: blur(14px);
  color: #fff;
  overflow: hidden;
  height: 100%;
  margin-bottom: 0;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(255, 255, 255, 0.15);
}

.product-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #178bff;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 2;
}

.product-img-container {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.product-img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.product-img:hover {
  transform: scale(1.05);
}

.card-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: calc(100% - 200px);
}

.card-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.8rem;
}

.ratings {
  font-size: 0.85rem;
  color: #facc15;
  margin-bottom: 0.5rem;
}

.stars {
  margin-right: 0.25rem;
}

.review-count {
  color: #9ca3af;
}

.price-section {
  margin-bottom: 0.75rem;
}

.current-price {
  font-weight: bold;
  font-size: 1.25rem;
  color: #34d399;
  margin-right: 0.5rem;
}

.original-price {
  font-size: 0.9rem;
  color: #9ca3af;
  text-decoration: line-through;
  margin-right: 0.5rem;
}

.discount-percent {
  font-size: 0.9rem;
  color: #34d399;
}

.delivery-info {
  font-size: 0.85rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.free-delivery {
  display: block;
  margin-bottom: 0.25rem;
}

.prime-delivery {
  font-size: 0.8rem;
  color: #60a5fa;
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  white-space: nowrap;
}

.btn-outline-primary {
  border: 1px solid #60a5fa;
  color: #60a5fa;
  background-color: transparent;
}

.btn-outline-primary:hover {
  background-color: #3b82f6;
  color: #fff;
}

.btn-primary {
  background: linear-gradient(to right, #c987ff, #7151ff);
  border: none;
  color: #fff;
}

.btn-primary:hover {
  background: linear-gradient(to right, #c5ff31, #ffff55);
  transform: translateY(-1px);
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

/* Responsive adjustments */
@media (max-width: 1399.98px) {
  .product-img-container {
    height: 180px;
  }
}

@media (max-width: 1199.98px) {
  .filters-col {
    padding-right: 1rem;
    padding-left: 1rem;
  }
  
  .product-img-container {
    height: 160px;
  }
}

@media (max-width: 991.98px) {
  .filters-col {
    position: sticky;
    top: 0;
    z-index: 10;
    padding-bottom: 1rem;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
  }
  
  .filters-card {
    position: relative;
    top: auto;
  }
  
  .product-img-container {
    height: 140px;
    padding: 1rem;
  }
}

@media (max-width: 767.98px) {
  .results-title {
    font-size: 1.5rem;
  }
  
  .card-title {
    font-size: 1rem;
    min-height: 2.4rem;
  }
  
  .btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 575.98px) {
  .product-img-container {
    height: 120px;
  }
  
  .card-body {
    padding: 1rem;
  }
  
  .results-title {
    font-size: 1.3rem;
  }
}
</style>