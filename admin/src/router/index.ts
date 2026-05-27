import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/login/index.vue'),
    },
    {
      path: '/',
      component: () => import('../views/layout/index.vue'),
      redirect: '/dashboard',
      children: [
        { path: 'dashboard', name: 'Dashboard', component: () => import('../views/dashboard/index.vue') },
        { path: 'users', name: 'Users', component: () => import('../views/user/index.vue') },
        { path: 'notes', name: 'Notes', component: () => import('../views/note/index.vue') },
        { path: 'orders', name: 'Orders', component: () => import('../views/order/index.vue') },
        { path: 'withdrawals', name: 'Withdrawals', component: () => import('../views/withdrawal/index.vue') },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.path !== '/login' && !auth.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
