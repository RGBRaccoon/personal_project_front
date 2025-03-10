import { createRouter, createWebHistory } from 'vue-router'
import authRoutes from './modules/auth'
import lectureRoutes from './modules/lectures'
import MarketView from '@/views/market/MarketView.vue'
import PaymentView from '@/views/market/PaymentView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue')
    },
    ...authRoutes,
    ...lectureRoutes,
    {
      path: '/market/:lecture_type?/:page?/:keyword?',
      name: 'market',
      component: MarketView,
      props: true
    },
    {
      path: '/market_detail/:lecture_id',
      name: 'market-detail',
      component: () => import('@/views/market/MarketDetailView.vue')  
    },
    {
      path: '/market',
      children: [
        {
          path: 'payment/:lecture_id',
          name: 'payment',
          component: PaymentView,
          meta: {
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: () => import('@/views/auth/ResetPasswordView.vue')
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('@/views/auth/ForgotPasswordView.vue')
    }
  ]
})

export default router