import { reactive, computed } from 'vue';
import { curations } from '../../data/curations';

const state = reactive({
  curations: curations,
  loading: false,
  error: null
});

export const useCurationStore = () => {
  const addCuration = (curation) => {
    state.curations.value.push({
      ...curation,
      createdAt: new Date()
    });
  };

  const updateCuration = (term, updates) => {
    const index = state.curations.value.findIndex(c => c.term === term);
    if (index !== -1) {
      state.curations.value[index] = {
        ...state.curations.value[index],
        ...updates
      };
    }
  };

  const deleteCuration = (term) => {
    const index = state.curations.value.findIndex(c => c.term === term);
    if (index !== -1) {
      state.curations.value.splice(index, 1);
    }
  };

  const getCurationByTerm = (term) => {
    return state.curations.value.find(c => c.term === term);
  };

  return {
    // State
    curations: computed(() => state.curations.value),
    loading: computed(() => state.loading),
    error: computed(() => state.error),

    // Actions
    addCuration,
    updateCuration,
    deleteCuration,
    getCurationByTerm
  };
};