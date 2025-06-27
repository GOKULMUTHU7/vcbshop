<template>
  <div class="welcome-page">
    <NavBar />
    <div class="hero-wrapper">
      <div class="glass-box text-center p-5">
        <h1 class="headline mb-3">
          Welcome to <span class="highlight">VCB stationary</span>
        </h1>
        <p class="subtext">
          Discover a premium range of stationery. Stylish books, vibrant sticky notes, and tools tailored for creators, students, and pros.
        </p>
        <router-link to="/product-list" class="btn btn-start mt-4">Start Shopping</router-link>
      </div>
    </div>

    <div ref="threeContainer" class="three-canvas"></div>
  </div>
</template>

<script>
import * as THREE from 'three'
import NavBar from './NavBar.vue'

export default {
  components: { NavBar },
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
      starField.rotation.y += 0.0004
      starField.rotation.x += 0.00025
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

.welcome-page {
  font-family: 'Outfit', sans-serif;
  background: #000;
  min-height: 100vh;
  overflow: hidden;
  position: relative;
  color: #fff;
}

.hero-wrapper {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.glass-box {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-width: 700px;
  padding: 3rem;
}

.headline {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(to bottom right, #9843ff, #0a91ff, #26dbff, #1dfd9c, #32ff36, #f003f4);  background-size: 1000% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientMove 10s ease infinite;
}

.highlight {
  font-weight: 700;
  background: linear-gradient(to bottom right, #9843ff, #0a91ff, #26dbff, #1dfd9c, #32ff36, #f003f4);
  background-size: 1000% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientMove 8s linear infinite;
}


.subtext {
  font-size: 1.2rem;
  color: #e2e8f0;
  margin-top: 1rem;
  font-weight: 400;
  line-height: 1.6;
}

.btn-start {
  background: linear-gradient(to right, #ef4444, #f97316);
  color: #fff;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(249, 115, 22, 0.3);
  transition: all 0.3s ease;
}

.btn-start:hover {
  background: linear-gradient(to right, #44dc26, #f9e616);
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

@keyframes glow {
  0%, 100% {
    text-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
  }
  50% {
    text-shadow: 0 0 20px rgba(255, 184, 108, 0.8);
  }
}

@media (max-width: 768px) {
  .headline {
    font-size: 2rem;
  }

  .subtext {
    font-size: 1rem;
  }

  .btn-start {
    font-size: 0.95rem;
    padding: 0.6rem 1.5rem;
  }
}
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

</style>
