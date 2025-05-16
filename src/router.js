import { createRouter, createWebHistory } from 'vue-router';
import Login from './screens/Login.vue';
import Dashboard from './screens/Dashboard.vue';
import News from './screens/News.vue';
import Rechtemanagement from './screens/Rechtemanagement.vue';
import Profile from './screens/Profile.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Login,
      beforeEnter: (to, from, next) => {
        const user = localStorage.getItem('currentUser');
        if (user) {
          next('/dashboard/news');
        } else {
          next();
        }
      }
    },
    {
      path: '/dashboard',
      component: Dashboard,
      redirect: '/dashboard/news',
      children: [
        {
          path: 'news',
          component: News
        },
        {
          path: 'rechtemanagement',
          component: Rechtemanagement
        },
        {
          path: 'profile',
          component: Profile
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/'];
  const authRequired = !publicPages.includes(to.path);
  const user = localStorage.getItem('currentUser');

  if (authRequired && !user) {
    return next('/');
  }

  next();
});

export default router;