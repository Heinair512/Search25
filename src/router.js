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
import TechnicalSettings from './screens/technical/Settings.vue';

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
      children: [
        {
          path: 'news',
          component: News
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
              redirect: '/dashboard/curation/pin-kbns'
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
        },
        {
          path: 'technical/settings',
          component: TechnicalSettings
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

  if (to.path === '/dashboard') {
    return next('/dashboard/news');
  }

  next();
});

export default router;