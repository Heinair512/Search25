<template>
  <div class="debug-search">
    <!-- Search Header -->
    <div class="search-header mb-4">
      <div class="text-900 text-xl font-bold mb-2">{{ t('technical.debug_search.title') }}</div>
      <p class="text-600 line-height-3 mb-4">
        {{ t('technical.debug_search.subtitle') }}
      </p>

      <div class="search-controls flex flex-column gap-3">
        <div class="flex justify-content-between align-items-center">
          <div class="flex align-items-center gap-2">
            <InputSwitch v-model="useRealApi" />
            <span>{{ t('technical.debug_search.use_real_api') }}</span>
          </div>
          <!-- Removed product count display -->
        </div>
        
        <div class="flex gap-2">
          <div class="search-input flex-grow-1">
            <InputText 
              v-model="searchTerm" 
              :placeholder="t('technical.debug_search.search.placeholder')" 
              class="w-full"
              @keyup.enter="search"
            />
          </div>
          <Button 
            icon="pi pi-search" 
            @click="search"
            :loading="loading"
          />
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <div class="search-results">
      <!-- Results Header -->
      <div class="results-header flex justify-content-between align-items-center mb-3">
        <div class="results-count">
          {{ totalResults }} {{ t('technical.debug_search.search.results') }}
          <span v-if="responseTime" class="text-500 ml-2">
            <i class="pi pi-clock"></i> {{ responseTime }}{{ t('technical.debug_search.search.response_time') }}
          </span>
        </div>
        <div class="view-controls flex gap-3 align-items-center">
          <div class="view-toggle flex align-items-center">
            <Button
              icon="pi pi-list"
              :class="{ 'text-primary': !isGridView, 'text-500': isGridView }"
              @click="isGridView = false"
              text
            />
            <Button
              icon="pi pi-th-large"
              :class="{ 'text-primary': isGridView, 'text-500': !isGridView }"
              @click="isGridView = true"
              text
            />
          </div>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="loading" class="flex justify-content-center">
        <ProgressSpinner style="width: 50px; height: 50px" />
      </div>

      <!-- Grid View -->
      <div v-else-if="isGridView && !loading">
        <div v-if="products.length > 0" class="grid">
          <div v-for="product in products" :key="product.id" class="col-12 sm:col-6 lg:col-3">
            <div 
              class="product-card surface-card p-3 border-1 surface-border border-round h-full cursor-pointer"
              :class="{ 'selected': selectedProduct === product }"
              @click="toggleProductSelection(product)"
            >
              <!-- Product Image -->
              <div class="product-image-container mb-3">
                <img 
                  src="/platzhalter.webp" 
                  :alt="product.description"
                  class="product-image"
                  loading="lazy"
                />
              </div>
              
              <!-- Product Info -->
              <div class="product-info">
                <div v-if="product.description" class="text-sm font-semibold mb-1 line-clamp-1">{{ product.description }}</div>
                <div v-if="product.id" class="text-xs mb-1">ID: {{ product.id }}</div>
                <div class="product-attributes text-xs">
                  <div class="grid">
                    <div v-if="product.productNumber" class="col-6">
                      <span class="text-500">{{ t('technical.debug_search.product.article_number') }}:</span>
                      <div class="font-semibold line-clamp-1">{{ product.productNumber }}</div>
                    </div>
                    <div v-if="product.supplier" class="col-6">
                      <span class="text-500">{{ t('technical.debug_search.product.supplier') }}:</span>
                      <div class="font-semibold line-clamp-1">{{ product.supplier }}</div>
                    </div>
                    <div v-if="product.runNumber" class="col-6">
                      <span class="text-500">{{ t('technical.debug_search.product.run_number') }}:</span>
                      <div class="font-semibold">{{ product.runNumber }}</div>
                    </div>
                    <div v-if="product.supplierProductNumber && product.supplierProductNumber.length > 0" class="col-6">
                      <span class="text-500">Supplier #:</span>
                      <div class="font-semibold line-clamp-1">{{ product.supplierProductNumber.join(', ') }}</div>
                    </div>
                  </div>
                </div>
                <div class="flex justify-content-between align-items-center mt-2">
                  <div v-if="product.grosPrice" class="text-lg font-bold text-primary">
                    {{ formatPrice(product.grosPrice, product.grosPriceCurrency) }}
                  </div>
                  <div class="flex gap-2">
                    <i v-if="product.locked" class="pi pi-lock text-red-500"></i>
                    <i v-if="product.priceHidden" class="pi pi-eye-slash text-red-500"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- No Results Message -->
        <div v-else-if="hasSearched" class="text-center p-4">
          <p>{{ t('technical.debug_search.search.no_results') }}</p>
        </div>
      </div>

      <!-- Table View -->
      <div v-else-if="!isGridView && !loading">
        <DataTable 
          :value="products" 
          stripedRows
          class="p-datatable-sm"
          responsiveLayout="scroll"
          v-model:expandedRows="expandedRows"
          selectionMode="single"
          v-model:selection="selectedTableRow"
          @rowSelect="onRowSelect"
          @rowUnselect="onRowUnselect"
          :paginator="true"
          :rows="rows"
          :totalRecords="totalResults"
          :rowsPerPageOptions="[10, 20, 50]"
          @page="onPageChange"
        >
          <Column field="image" :header="t('technical.debug_search.table.image')" style="width: 100px">
            <template #body>
              <div class="product-image-container" style="padding-top: 100%">
                <img 
                  src="/platzhalter.webp" 
                  alt="Product"
                  class="product-image"
                  loading="lazy"
                />
              </div>
            </template>
          </Column>
          <Column field="id" :header="t('technical.debug_search.table.id')"></Column>
          <Column field="productNumber" :header="t('technical.debug_search.table.article_no')" style="width: 120px"></Column>
          <Column field="supplier" :header="t('technical.debug_search.table.supplier')" style="width: 120px"></Column>
          <Column field="description" :header="t('technical.debug_search.table.description')"></Column>
          <Column field="grosPrice" :header="t('technical.debug_search.table.price')" style="width: 120px">
            <template #body="slotProps">
              {{ formatPrice(slotProps.data.grosPrice, slotProps.data.grosPriceCurrency) }}
            </template>
          </Column>
          <Column field="status" :header="t('technical.debug_search.table.status')" style="width: 100px">
            <template #body="slotProps">
              <div class="flex gap-2">
                <i v-if="slotProps.data.locked" class="pi pi-lock text-red-500" title="Locked"></i>
                <i v-if="slotProps.data.priceHidden" class="pi pi-eye-slash text-red-500" title="Price Hidden"></i>
              </div>
            </template>
          </Column>
          <template #expansion="slotProps">
            <div class="p-3">
              <h5>{{ slotProps.data.id }}</h5>
              <div class="grid">
                <!-- Only show fields that are not null or empty -->
                <template v-for="(value, key) in slotProps.data" :key="key">
                  <div v-if="shouldShowField(key, value)" class="col-12 md:col-6 lg:col-4 field">
                    <label>{{ formatFieldName(key) }}</label>
                    <div>{{ formatFieldValue(key, value) }}</div>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </DataTable>
      </div>

      <!-- Paginator for Grid View -->
      <Paginator
        v-if="isGridView && products.length > 0 && !loading"
        v-model:first="first"
        v-model:rows="rows"
        :totalRecords="totalResults"
        :rowsPerPageOptions="[12, 24, 48]"
        @page="onPageChange"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      >
        <template #start>
          <div class="flex align-items-center">
            <span class="mx-2">{{ t('technical.debug_search.search.items_per_page') }}</span>
          </div>
        </template>
      </Paginator>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { debugSearchApi } from '../../data/debugSearchMock';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';
import ProgressSpinner from 'primevue/progressspinner';
import InputSwitch from 'primevue/inputswitch';

const { t } = useI18n();
const route = useRoute();

// State
const searchTerm = ref('');
const isGridView = ref(true);
const first = ref(0);
const rows = ref(12);
const totalResults = ref(0);
const responseTime = ref(null);
const selectedProduct = ref(null);
const expandedRows = ref([]);
const selectedTableRow = ref(null);
const products = ref([]);
const loading = ref(false);
const hasSearched = ref(false);
const useRealApi = ref(false);
const totalKnownProducts = ref(null); // Kept for internal use but not displayed

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

const search = async () => {
  loading.value = true;
  hasSearched.value = true;
  
  try {
    const startTime = performance.now();
    
    if (useRealApi.value) {
      // Use the real API endpoint
      const headers = {
        'Installation': 'CG',
        'Language': 'DE',
        'Layout': 'EFG',
        'Content-Type': 'application/json'
      };
      
      // Construct the URL with query parameters
      const url = new URL('http://localhost:5000/search');
      url.searchParams.append('search-query', searchTerm.value);
      url.searchParams.append('company-id', '913');
      url.searchParams.append('is-sap', 'false');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      products.value = data.products || [];
      totalResults.value = data.hits || 0;
      responseTime.value = data.took || Math.round(performance.now() - startTime);
      
      // Update total known products if available
      if (data.totalKnownProducts !== undefined) {
        totalKnownProducts.value = data.totalKnownProducts;
      }
    } else {
      // Use the mock API
      const response = await debugSearchApi.search(searchTerm.value);
      
      products.value = response.products;
      totalResults.value = response.hits;
      responseTime.value = response.took || Math.round(performance.now() - startTime);
      
      // Set a mock value for total known products
      totalKnownProducts.value = 10000;
    }
    
    selectedProduct.value = null;
    selectedTableRow.value = null;
    expandedRows.value = [];
  } catch (error) {
    console.error('Search error:', error);
    products.value = [];
    totalResults.value = 0;
  } finally {
    loading.value = false;
  }
};

const onPageChange = (event) => {
  first.value = event.first;
  rows.value = event.rows;
};

const formatPrice = (price, currency = 'EUR') => {
  if (price === null || price === undefined) return '';
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency
  }).format(price);
};

const onRowSelect = (event) => {
  expandedRows.value = [event.data];
};

const onRowUnselect = () => {
  expandedRows.value = [];
};

// Helper function to determine if a field should be shown
const shouldShowField = (key, value) => {
  // Skip internal Vue properties
  if (key.startsWith('_')) return false;
  
  // Skip null values
  if (value === null) return false;
  
  // Skip empty strings
  if (typeof value === 'string' && value.trim() === '') return false;
  
  // Skip empty arrays
  if (Array.isArray(value) && value.length === 0) return false;
  
  return true;
};

// Format field names for display
const formatFieldName = (key) => {
  // Convert camelCase to Title Case with spaces
  const formatted = key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
  
  return formatted;
};

// Format field values for display
const formatFieldValue = (key, value) => {
  // Handle arrays
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  
  // Handle booleans
  if (typeof value === 'boolean') {
    return value ? 'Ja' : 'Nein';
  }
  
  // Handle price
  if (key === 'grosPrice' && value !== null) {
    return formatPrice(value, products.value.find(p => p.grosPrice === value)?.grosPriceCurrency || 'EUR');
  }
  
  return value;
};

// Initialize
onMounted(async () => {
  // Check if there's a search term in the URL query
  if (route.query.term) {
    searchTerm.value = route.query.term;
  }
  
  // Load initial data
  await search();
});
</script>

<style scoped>
.debug-search {
  padding: 1.5rem;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.search-header {
  max-width: 800px;
}

.search-results {
  flex: 1;
  overflow: hidden;
  margin-top: 2rem;
}

.product-card {
  transition: all 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--surface-card);
  border-color: var(--surface-border);
}

.product-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary-color);
}

.product-card.selected {
  border-color: var(--primary-color);
  background-color: var(--primary-50);
}

.product-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  color: var(--text-color);
}

.line-clamp-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.product-image-container {
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 aspect ratio */
  overflow: hidden;
  border-radius: 6px;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.2s;
  background-color: #f8f9fa;
}

.product-image:hover {
  transform: scale(1.05);
}

:deep(.p-datatable-wrapper) {
  border-radius: 6px;
  overflow: hidden;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: var(--surface-ground);
  padding: 0.5rem;
  color: var(--text-color);
  border-color: var(--surface-border);
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.5rem;
  color: var(--text-color);
  border-color: var(--surface-border);
}

:deep(.p-datatable-tbody > tr.p-row-expanded) {
  background-color: var(--surface-hover);
}

.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color-secondary);
}

/* Dark theme adjustments */
:deep(.dark) .product-card {
  background-color: var(--surface-card);
}

:deep(.dark) .product-card.selected {
  background-color: var(--primary-900);
}

:deep(.dark) .product-image {
  background-color: #2a2a2a;
}
</style>