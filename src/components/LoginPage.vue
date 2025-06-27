<template>
  <div class="login-page">
    <div class="login-box">
      <h2 class="login-title">Login</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch('https://your-api.com/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, password: this.password })
        });

        const data = await response.json();

        if (response.ok) {
          // Example: store token or user info if needed
          localStorage.setItem('token', data.token);
          this.$router.push('/welcome');
        } else {
          this.error = data.message || 'Invalid credentials';
        }
      } catch (err) {
        this.error = 'Something went wrong. Please try again later.';
      }
    }
  }
};
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #1e3a8a, #9333ea);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  color: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.login-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
}

button {
  width: 100%;
  background: #4f46e5;
  color: white;
  padding: 0.75rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: #3730a3;
}

.error {
  color: #f87171;
  margin-top: 0.5rem;
  text-align: center;
}
</style>
