import { reactive, computed } from 'vue';

const state = reactive({
  isAdvancedMode: true
});

export const useFeatureStore = () => {
  const toggleAdvancedMode = () => {
    state.isAdvancedMode = !state.isAdvancedMode;
    localStorage.setItem('advancedMode', state.isAdvancedMode.toString());
  };

  const initializeFeatures = () => {
    const savedMode = localStorage.getItem('advancedMode');
    // Only use saved mode if it exists, otherwise keep default true
    if (savedMode !== null) {
      state.isAdvancedMode = savedMode === 'true';
    } else {
      // Ensure default true state is saved
      localStorage.setItem('advancedMode', 'true');
    }
  };

  return {
    isAdvancedMode: computed(() => state.isAdvancedMode),
    toggleAdvancedMode,
    initializeFeatures
  };
};