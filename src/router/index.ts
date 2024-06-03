import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import OverviewMapView from '@/views/OverviewMapView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'overviewMap',
    component: OverviewMapView,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
