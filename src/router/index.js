import { createRouter, createWebHistory } from 'vue-router'
import { useFeedingItemsStore } from "@/stores/useFeedingItemsStore";

const HomeView = () => import('@/views/HomeView.vue')

// TODO: it will be in feature
// const StatisticsView = () => import('@/views/StatisticsView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },

    // TODO: it will be in feature
    // {
    //   path: '/statistics',
    //   name: 'statistics',
    //   component: StatisticsView
    // }
  ]
})

export default router
