import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { i18n } from './i18n';

// PrimeVue Core + Services
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';

// PrimeVue Styles
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

// Custom Styles
import './style.css';
import './assets/theme/avalon.css';

// Initialize store
import { useStore } from './store';
const store = useStore();

const app = createApp(App);

// Make store available globally
app.config.globalProperties.$store = store;

app.use(PrimeVue, {
  ripple: true,
  inputStyle: "filled"
});
app.use(router);
app.use(i18n);
app.use(ToastService);
app.directive('tooltip', Tooltip);

// Initialize theme and auth state
store.theme.initializeTheme();
store.auth.initializeAuth();
store.features.initializeFeatures();

app.mount('#app');