import { reactive, computed } from 'vue';

const state = reactive({
  isDark: false,
  language: 'DE'
});

export const useThemeStore = () => {
  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const savedLanguage = localStorage.getItem('language');

    if (savedTheme) {
      state.isDark = savedTheme === 'dark';
      applyTheme(state.isDark);
    }

    if (savedLanguage) {
      state.language = savedLanguage;
    }
  };

  const toggleTheme = () => {
    state.isDark = !state.isDark;
    applyTheme(state.isDark);
    localStorage.setItem('theme', state.isDark ? 'dark' : 'light');
  };

  const setLanguage = (lang) => {
    state.language = lang;
    localStorage.setItem('language', lang);
  };

  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return {
    // State
    isDark: computed(() => state.isDark),
    language: computed(() => state.language),

    // Actions
    initializeTheme,
    toggleTheme,
    setLanguage
  };
};