<template>
  <div class="product-page">
    <NavBar />
    <div class="container my-5 content-wrapper">
      <h2 class="text-center mb-4 title">Top Selling Products</h2>

       <div class="row gx-5 gy-5">
  <div class="col-12 col-md-6 col-lg-4 d-flex justify-content-center" v-for="product in limitedProducts" :key="product.id">
    <div class="card product-card">

            <img :src="product.image" class="card-img-top product-img" :alt="product.title" />

            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ product.title }}</h5>
              <p class="card-text">{{ product.description.substring(0, 60) }}...</p>

              <div class="ratings mb-2">
                ⭐ {{ product.rating.rate }} | {{ product.rating.count }} reviews
              </div>

              <p class="price mb-2">₹{{ product.price }}</p>

              <div class="mt-auto d-flex justify-content-between">
                <router-link :to="'/product/' + product.id" class="btn btn-outline-primary btn-sm">View</router-link>
                <button @click="addToCart(product)" class="btn btn-primary btn-sm">Add to Cart</button>
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
      products
    }
  },
  computed: {
    limitedProducts() {
      return this.products.slice(0, 10)
    }
  },
  methods: {
    addToCart(product) {
      cart.addItem(product)
      eventBus.emit('cart-updated', cart.getCount())
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
      positions[i + 1] = (Math.random() - 0.5) *500
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

    // Responsive
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
  padding-bottom: 4rem;
}

.title {
  font-size: 2.3rem;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(270deg, #4ade80, #3b82f6, #a855f7);
  background-size: 800% 800%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientMove 8s ease infinite;
  margin-bottom: 2rem;
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
.product-card {
  width: 100%;
  max-width: 340px; /* Controls card width */
  background: rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 6px 25px rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
  backdrop-filter: blur(14px);
  color: #fff;
  padding: 1rem;
}


.product-card::before {
  content: '';
  position: absolute;
  top: -20%;
  left: -20%;
  width: 160%;
  height: 160%;
  background: radial-gradient(circle at top left, rgba(124, 58, 237, 0.15), transparent 60%);
  transform: rotate(25deg);
  pointer-events: none;
  z-index: 0;
}

.product-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 16px 48px rgba(255, 255, 255, 0.15);
  border-color: #7c3aed;
}

.product-img {
  height: 240px;
  object-fit: contain;
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
}


.card-body {
  position: relative;
  z-index: 2;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.4rem;
}

.card-text {
  font-size: 0.9rem;
  color: #d1d5db;
  min-height: 48px;
  margin-bottom: 0.5rem;
}

.ratings {
  font-size: 0.85rem;
  color: #facc15;
  margin-bottom: 0.5rem;
}

.price {
  font-weight: bold;
  font-size: 1.2rem;
  color: #34d399;
  margin-bottom: 0.5rem;
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
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
  background: linear-gradient(to right, #ef4444, #f97316);
  border: none;
  color: #fff;
  box-shadow: 0 0 0 transparent;
}

.btn-primary:hover {
  background: linear-gradient(to right, #dc2626, #f97316);
  box-shadow: 0 0 12px rgba(249, 115, 22, 0.6);
  transform: scale(1.05);
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
</style>
