import { createRouter, createWebHistory } from 'vue-router'
import authRoutes from './modules/auth'
import lectureRoutes from './modules/lectures'

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
  ]
})

export default router