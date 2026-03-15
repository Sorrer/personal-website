import App from '@/App.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: App
    },
    {
      path: '/photos',
      name: 'photos',
      component: App
    }
  ]
})

export default router
