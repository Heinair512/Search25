import { reactive, readonly } from 'vue';
import { useAuthStore } from './modules/auth';
import { useCurationStore } from './modules/curation';
import { useAnalyticsStore } from './modules/analytics';
import { useThemeStore } from './modules/theme';
import { useFeatureStore } from './modules/features';

const store = reactive({
  auth: useAuthStore(),
  curation: useCurationStore(),
  analytics: useAnalyticsStore(),
  theme: useThemeStore(),
  features: useFeatureStore()
});

export const useStore = () => readonly(store);