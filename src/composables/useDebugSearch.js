import { ref, watch } from 'vue';
import { debugSearchApi } from '../data/debugSearchMock';

export function useDebugSearch(headerConfig) {
  const products = ref([]);
  const total = ref(0);
  const took = ref(0);
  const loading = ref(false);
  const error = ref(null);

  // Watch for header config changes to update the API headers
  watch(headerConfig, () => {
    // In a real implementation, this would update the API client's headers
    console.log('Header config changed:', headerConfig);
  }, { deep: true });

  const runSearch = async (searchTerm, companyId, pageIndex = 0, isSap = false) => {
    loading.value = true;
    error.value = null;

    try {
      // Determine if we should use the real API or mock API
      const useRealApi = false; // This would be configurable in a real implementation

      if (useRealApi) {
        // Real API implementation
        const headers = {
          'Installation': headerConfig.installation,
          'Language': headerConfig.language,
          'Layout': headerConfig.layout,
          'Content-Type': 'application/json'
        };
        
        // Construct the URL with query parameters
        const url = new URL('http://localhost:5000/search');
        url.searchParams.append('search-query', searchTerm);
        url.searchParams.append('company-id', companyId);
        url.searchParams.append('is-sap', isSap.toString());
        url.searchParams.append('page', pageIndex.toString());
        
        const response = await fetch(url, {
          method: 'GET',
          headers: headers
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        products.value = data.products || [];
        total.value = data.hits || 0;
        took.value = data.took || 0;
      } else {
        // Use mock API
        const response = await debugSearchApi.search(searchTerm);
        
        products.value = response.products;
        total.value = response.hits;
        took.value = response.took;
      }
    } catch (err) {
      console.error('Search error:', err);
      error.value = err.message || 'An error occurred during search';
      products.value = [];
      total.value = 0;
      took.value = 0;
    } finally {
      loading.value = false;
    }
  };

  return {
    products,
    total,
    took,
    loading,
    error,
    runSearch
  };
}