import { render } from '@testing-library/vue';
import { createI18n } from 'vue-i18n';
import { createRouter, createWebHistory } from 'vue-router';
import PrimeVue from 'primevue/config';
import de from '../i18n/locales/de.json';
import en from '../i18n/locales/en.json';

export function createTestRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        name: 'login',
        component: { template: '<div>Login</div>' }
      },
      {
        path: '/dashboard',
        component: { template: '<div>Dashboard</div>' }
      }
    ]
  });
}

export function createTestI18n() {
  return createI18n({
    legacy: false,
    locale: 'DE',
    fallbackLocale: 'DE',
    messages: {
      DE: de,
      EN: en
    }
  });
}

export function renderWithPlugins(component, options = {}) {
  const router = options.router || createTestRouter();
  const i18n = options.i18n || createTestI18n();

  return render(component, {
    global: {
      plugins: [router, i18n, PrimeVue],
      ...options.global
    },
    ...options
  });
}