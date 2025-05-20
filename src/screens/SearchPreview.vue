import { ref, computed, onMounted } from 'vue';
import { useStore } from '../store';
import { useRoute } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Checkbox from 'primevue/checkbox';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Panel from 'primevue/panel';
import Badge from 'primevue/badge';
import { products as mockProducts, filters as mockFilters } from '../data/products';

// Store
const store = useStore();
const route = useRoute();

// State
const searchTerm = ref('');
const isGridView = ref(true);
const filterSearchTerm = ref('');
const first = ref(0);
const rows = ref(12);
const totalResults = ref(mockProducts.length);
const responseTime = ref(null);
const selectedProduct = ref(null);
const expandedRows = ref([]);
const selectedTableRow = ref(null);

// Products and Filters
const products = ref(mockProducts);
const filters = ref(mockFilters);

// Handle search term from URL on mount
onMounted(() => {
  const termFromUrl = route.query.term;
  if (termFromUrl) {
    searchTerm.value = termFromUrl.toString();
    search();
  }
});

// Computed
const productGroups = computed(() => {
  const groups = [];
  for (let i = 0; i < products.value.length; i += 4) {
    groups.push(products.value.slice(i, i + 4));
  }
  return groups;
});

// Methods
const toggleProductSelection = (product) => {
  selectedProduct.value = selectedProduct.value === product ? null : product;
};

const getSelectedProductInGroup = (group) => {
  return group.find(p => p === selectedProduct.value);
};

const getRankingSymbol = (rankingType) => {
  if (rankingType === 'MULTIPLIKATIV') return 'x';
  if (rankingType === 'ADDITIV') return '+';
  return '';
};

const search = async () => {
  const startTime = performance.now();
  
  try {
    let filteredProducts = [...mockProducts];
    
    // Apply search term filter
    if (searchTerm.value) {
      const searchLower = searchTerm.value.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.manufacturer.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply active filters
    filters.value.forEach(filter => {
      const selectedValues = filter.values.filter(v => v.selected).map(v => v.label);
      if (selectedValues.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
          if (filter.field === 'price') {
            const price = product.price;
            return selectedValues.some(range => {
              if (range === 'Bis 50 €') return price <= 50;
              if (range === '50-100 €') return price > 50 && price <= 100;
              if (range === '100-250 €') return price > 100 && price <= 250;
              if (range === '250-500 €') return price > 250 && price <= 500;
              if (range === 'Über 500 €') return price > 500;
              return false;
            });
          }
          if (filter.field === 'weight') {
            const weight = product.weight;
            return selectedValues.some(range => {
              if (range === 'Bis 1 kg') return weight <= 1;
              if (range === '1-3 kg') return weight > 1 && weight <= 3;
              if (range === '3-5 kg') return weight > 3 && weight <= 5;
              if (range === 'Über 5 kg') return weight > 5;
              return false;
            });
          }
          return selectedValues.includes(product[filter.field]);
        });
      }
    });

    // Always sort by score in descending order
    filteredProducts.sort((a, b) => parseFloat(b.debugInfo.score) - parseFloat(a.debugInfo.score));

    // Update results
    products.value = filteredProducts;
    totalResults.value = filteredProducts.length;
    selectedProduct.value = null;
    
    // Calculate response time
    responseTime.value = Math.round(performance.now() - startTime);

  } catch (error) {
    console.error('Search error:', error);
  }
};

const clearFilters = () => {
  filters.value.forEach(filter => {
    filter.values.forEach(value => {
      value.selected = false;
    });
  });
  filterSearchTerm.value = '';
  search();
};

const getFilteredValues = (filter) => {
  const searchTerm = filterSearchTerm.value?.toLowerCase() || '';
  return filter.values.filter(value => 
    !searchTerm || value.label.toLowerCase().includes(searchTerm)
  );
};

const applyFilters = () => {
  search();
};

const onPageChange = (event) => {
  first.value = event.first;
  rows.value = event.rows;
  search();
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

const onRowSelect = (event) => {
  expandedRows.value = [event.data];
};

const onRowUnselect = () => {
  expandedRows.value = [];
};