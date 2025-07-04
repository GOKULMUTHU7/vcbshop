import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from '@/components/WelcomePage.vue';
import ProductList from '@/components/ProductList.vue';
import CartPage from '@/components/CartPage.vue';
import ProductDetail from '@/components/ProductDetail.vue';
import LoginPage from '@/components/LoginPage.vue'; // <-- Add this
// PaymentPage is lazy-loaded below

const routes = [
  {
    path: '/',
    name: 'WelcomePage',
    component: WelcomePage
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/product-list',
    name: 'ProductList',
    component: ProductList
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true
  },
  {
    path: '/cart',
    name: 'CartPage',
    component: CartPage
  },
  {
    path: '/payment',
    name: 'PaymentPage',
    component: () => import('@/components/PaymentPage.vue') // lazy load
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
