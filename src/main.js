import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { i18n } from './i18n';

// PrimeVue Core + Services
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

// PrimeVue Styles
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

// Custom Styles
import './style.css';
import './assets/theme/avalon.css';

const app = createApp(App);

app.use(PrimeVue, {
  ripple: true,
  inputStyle: "filled"
});
app.use(router);
app.use(i18n);
app.use(ToastService);

app.mount('#app');