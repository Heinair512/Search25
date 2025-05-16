import { createRouter, createWebHistory } from 'vue-router';
import Login from './screens/Login.vue';
import Dashboard from './screens/Dashboard.vue';
import SearchPreview from './screens/SearchPreview.vue';
import News from './screens/News.vue';
import Rechtemanagement from './screens/Rechtemanagement.vue';
import Profile from './screens/Profile.vue';
import CurationLayout from './screens/curation/Layout.vue';
import NewCuration from './screens/curation/NewCuration.vue';
import PinKbns from './screens/curation/PinKbns.vue';
import ManageCurations from './screens/curation/ManageCurations.vue';
import Analytics from './screens/Analytics/Dashboard.vue';
import NoResultSearches from './screens/Analytics/NoResultSearches.vue';
import LowClickSearches from './screens/Analytics/LowClickSearches.vue';
import TopClickedSearches from './screens/Analytics/TopClickedSearches.vue';
import SynonymManagement from './screens/SynonymManagement.vue';
import { useStore } from './store';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
      beforeEnter: (to, from, next) => {
        const store = useStore();
        if (store.auth.isAuthenticated) {
          next('/dashboard');
        } else {
          next();
        }
      }
    },
    {
      path: '/dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          component: News
        },
        {
          path: 'rights',
          component: Rechtemanagement
        },
        {
          path: 'profile',
          component: Profile
        },
        {
          path: 'curation',
          component: CurationLayout,
          children: [
            {
              path: '',
              redirect: '/curation/pin-kbns'
            },
            {
              path: 'new',
              component: NewCuration
            },
            {
              path: 'pin-kbns',
              component: PinKbns
            },
            {
              path: 'manage',
              component: ManageCurations
            }
          ]
        },
        {
          path: 'analytics',
          component: Analytics
        },
        {
          path: 'analytics/no-results',
          component: NoResultSearches
        },
        {
          path: 'analytics/low-clicks',
          component: LowClickSearches
        },
        {
          path: 'analytics/top-clicked',
          component: TopClickedSearches
        },
        {
          path: 'search-preview',
          component: SearchPreview
        },
        {
          path: 'rechtemanagement',
          component: Rechtemanagement
        },
        {
          path: 'synonyms',
          component: SynonymManagement
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  const store = useStore();
  
  if (!store.auth.isInitialized) {
    store.auth.initializeAuth();
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.auth.isAuthenticated) {
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;