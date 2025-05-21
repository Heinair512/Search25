<template>
  <div class="search-preview">
    <!-- Search Header -->
    <div class="search-header mb-4">
      <div class="text-900 text-xl font-bold mb-2">Suche Vorschau</div>
      <p class="text-600 line-height-3 mb-4">
        Testen Sie hier die Suche und sehen Sie die Ergebnisse in Echtzeit
      </p>

      <div class="search-controls flex gap-4">
        <div class="search-input flex-grow-1">
          <InputText 
            v-model="searchTerm" 
            placeholder="Suchbegriff eingeben..." 
            class="w-full"
            @keyup.enter="search"
          />
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <div class="search-results flex">
      <!-- Filters -->
      <div class="filters surface-card p-3" style="min-width: 280px; max-width: 280px;">
        <div class="filter-header flex justify-content-between align-items-center mb-3">
          <span class="font-semibold">Filter</span>
          <Button 
            label="Zurücksetzen" 
            link 
            @click="clearFilters"
            class="p-0"
          />
        </div>

        <div class="filter-search mb-3">
          <InputText 
            v-model="filterSearchTerm" 
            placeholder="Filter durchsuchen" 
            class="w-full"
          />
        </div>

        <Accordion :multiple="true" :activeIndex="[0,1,2]">
          <AccordionTab v-for="filter in filters" :key="filter.name">
            <template #header>
              <div class="flex align-items-center justify-content-between w-full">
                <span>{{ filter.name }}</span>
                <span class="text-500">({{ filter.values.length }})</span>
              </div>
            </template>
            <div class="filter-values">
              <div v-for="value in getFilteredValues(filter)" :key="value.id" class="filter-value">
                <input
                  type="checkbox"
                  :id="value.id"
                  :name="`${filter.name}-${value.label}`"
                  v-model="value.selected"
                  @change="handleCheckboxChange"
                  class="checkbox"
                />
                <label :for="value.id" class="ml-2">
                  {{ value.label }}
                  <span class="text-500">({{ value.count }})</span>
                </label>
              </div>
            </div>
          </AccordionTab>
        </Accordion>
      </div>

      <!-- Results -->
      <div class="results flex-grow-1 pl-4">
        <div class="results-header flex justify-content-between align-items-center mb-3">
          <div class="results-count">
            {{ totalResults }} Ergebnisse
            <span v-if="responseTime" class="text-500 ml-2">
              <i class="pi pi-clock"></i> {{ responseTime }}ms
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

        <!-- Grid View -->
        <div v-if="isGridView">
          <div v-for="(group, groupIndex) in productGroups" :key="groupIndex" class="product-group mb-4">
            <div class="grid">
              <div v-for="product in group" :key="product.id" class="col-12 sm:col-6 lg:col-3">
                <div 
                  class="product-card surface-card p-2 border-1 surface-border border-round h-full cursor-pointer"
                  :class="{ 'selected': selectedProduct === product }"
                  @click="toggleProductSelection(product)"
                >
                  <img :src="product.image" :alt="product.name" class="w-full h-6rem object-cover border-round mb-2" />
                  <div class="product-info">
                    <div class="text-sm font-semibold mb-1 line-clamp-1">{{ product.name }}</div>
                    <div class="text-xs mb-1">Art.-Nr.: {{ product.id }}</div>
                    <div class="product-attributes text-xs">
                      <div class="grid">
                        <div class="col-6">
                          <span class="text-500">Hersteller:</span>
                          <div class="font-semibold line-clamp-1">{{ product.manufacturer }}</div>
                        </div>
                        <div class="col-6">
                          <span class="text-500">Kategorie:</span>
                          <div class="font-semibold line-clamp-1">{{ product.category }}</div>
                        </div>
                        <div class="col-6">
                          <span class="text-500">Farbe:</span>
                          <div class="font-semibold">{{ product.color }}</div>
                        </div>
                        <div class="col-6">
                          <span class="text-500">Länge:</span>
                          <div class="font-semibold">{{ product.length }} cm</div>
                        </div>
                      </div>
                    </div>
                    <div class="flex justify-content-between align-items-center mt-2">
                      <div class="text-lg font-bold text-primary">
                        {{ formatPrice(product.price) }}
                      </div>
                      <div v-if="store.features.isAdvancedMode" class="flex align-items-center gap-2">
                        <span class="pi pi-chart-bar"></span>
                        <span class="font-semibold">{{ product.debugInfo?.score }}</span>
                        <Badge value="i" severity="info" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Debug Info Panel -->
            <div v-if="store.features.isAdvancedMode && getSelectedProductInGroup(group)" class="debug-panel-container">
              <div class="debug-panel-arrow"></div>
              <Panel header="Score Details" class="debug-panel surface-card">
                <div class="panelgrids">
                  <div class="tagForm">
                    <span>{{ getSelectedProductInGroup(group).debugInfo.score }}</span>
                  </div>
                  <div class="tagForm">
                    <span>=</span>
                  </div>
                  <div class="panelgrid">
                    <template v-for="(match, index) in getSelectedProductInGroup(group).debugInfo.matches" :key="index">
                      <div class="tagForm">{{ match.value }}</div>
                      <div class="flex flex-no-wrap align-items-start">
                        <span class="tag blue">{{ match.details.term }}</span>
                        <span class="tagForm"> in</span>
                        <div class="flex flex-wrap">
                          <span v-for="(field, fieldIndex) in match.details.fields" :key="fieldIndex" class="tag">
                            {{ field }}
                          </span>
                        </div>
                      </div>
                      <div v-if="index < getSelectedProductInGroup(group).debugInfo.matches.length - 1" class="tagForm">
                        +
                      </div>
                      <div v-if="index < getSelectedProductInGroup(group).debugInfo.matches.length - 1"></div>
                    </template>
                  </div>

                  <div v-if="getSelectedProductInGroup(group).debugInfo.boost"></div>
                  <div v-if="getSelectedProductInGroup(group).debugInfo.boost"></div>
                  <div v-if="getSelectedProductInGroup(group).debugInfo.boost" class="tagForm xsign">
                    {{ getRankingSymbol(getSelectedProductInGroup(group).debugInfo.rankingType) }}
                  </div>

                  <div v-if="getSelectedProductInGroup(group).debugInfo.boost"></div>
                  <div v-if="getSelectedProductInGroup(group).debugInfo.boost"></div>
                  <div class="flex">
                    <div v-if="getSelectedProductInGroup(group).debugInfo.boost" class="tagForm xsign">
                      <span>{{ getSelectedProductInGroup(group).debugInfo.boost.value }}</span>
                    </div>
                    <div class="flex">
                      <div v-if="getSelectedProductInGroup(group).debugInfo.boost" class="form">
                        <div v-for="detail in getSelectedProductInGroup(group).debugInfo.boost.details" :key="detail.term" class="boost-detail">
                          <span class="tag yellow">{{ detail.term }}</span>
                          <span class="tagForm"> in</span>
                          <span class="tag">{{ detail.field }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Panel>
            </div>
          </div>
        </div>

        <!-- Table View -->
        <div v-else class="table-view">
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
            :rowsPerPageOptions="[12, 24, 48]"
            @page="onPageChange"
          >
            <Column field="image" header="Bild" style="width: 80px">
              <template #body="slotProps">
                <img :src="slotProps.data.image" :alt="slotProps.data.name" class="w-full" />
              </template>
            </Column>
            <Column field="name" header="Name"></Column>
            <Column field="id" header="Art.-Nr." style="width: 100px"></Column>
            <Column field="manufacturer" header="Hersteller"></Column>
            <Column field="category" header="Kategorie"></Column>
            <Column field="color" header="Farbe" style="width: 100px"></Column>
            <Column field="price" header="Preis" style="width: 120px">
              <template #body="slotProps">
                {{ formatPrice(slotProps.data.price) }}
              </template>
            </Column>
            <Column v-if="store.features.isAdvancedMode" field="debugInfo.score" header="Score" style="width: 100px">
              <template #body="slotProps">
                <div class="flex align-items-center gap-2">
                  <span class="pi pi-chart-bar"></span>
                  <span>{{ slotProps.data.debugInfo?.score }}</span>
                  <Badge value="i" severity="info" />
                </div>
              </template>
            </Column>
            <template #expansion="slotProps">
              <div v-if="store.features.isAdvancedMode" class="debug-panel-container list-view-panel">
                <Panel header="Score Details" class="debug-panel surface-card">
                  <div class="panelgrids">
                    <div class="tagForm">
                      <span>{{ slotProps.data.debugInfo.score }}</span>
                    </div>
                    <div class="tagForm">
                      <span>=</span>
                    </div>
                    <div class="panelgrid">
                      <template v-for="(match, index) in slotProps.data.debugInfo.matches" :key="index">
                        <div class="tagForm">{{ match.value }}</div>
                        <div class="flex flex-no-wrap align-items-start">
                          <span class="tag blue">{{ match.details.term }}</span>
                          <span class="tagForm"> in</span>
                          <div class="flex flex-wrap">
                            <span v-for="(field, fieldIndex) in match.details.fields" :key="fieldIndex" class="tag">
                              {{ field }}
                            </span>
                          </div>
                        </div>
                        <div v-if="index < slotProps.data.debugInfo.matches.length - 1" class="tagForm">
                          +
                        </div>
                        <div v-if="index < slotProps.data.debugInfo.matches.length - 1"></div>
                      </template>
                    </div>

                    <div v-if="slotProps.data.debugInfo.boost"></div>
                    <div v-if="slotProps.data.debugInfo.boost"></div>
                    <div v-if="slotProps.data.debugInfo.boost" class="tagForm xsign">
                      {{ getRankingSymbol(slotProps.data.debugInfo.rankingType) }}
                    </div>

                    <div v-if="slotProps.data.debugInfo.boost"></div>
                    <div v-if="slotProps.data.debugInfo.boost"></div>
                    <div class="flex">
                      <div v-if="slotProps.data.debugInfo.boost" class="tagForm xsign">
                        <span>{{ slotProps.data.debugInfo.boost.value }}</span>
                      </div>
                      <div class="flex">
                        <div v-if="slotProps.data.debugInfo.boost" class="form">
                          <div v-for="detail in slotProps.data.debugInfo.boost.details" :key="detail.term" class="boost-detail">
                            <span class="tag yellow">{{ detail.term }}</span>
                            <span class="tagForm"> in</span>
                            <span class="tag">{{ detail.field }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>
              </div>
            </template>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from '../store';
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
const filters = ref(mockFilters.map(filter => ({
  ...filter,
  values: filter.values.map(value => ({
    ...value,
    selected: false
  }))
})));

// Accordion state für Filtergruppen
const expandedFilterIndexes = ref([0, 1, 2]); // Hersteller, Kategorie, Unterkategorie

// Computed
const productGroups = computed(() => {
  const groups = [];
  for (let i = 0; i < products.value.length; i += 4) {
    groups.push(products.value.slice(i, i + 4));
  }
  return groups;
});

const selectedFilters = computed(() => {
  const selected = {};
  filters.value.forEach(filter => {
    const selectedValues = filter.values
      .filter(v => v.selected)
      .map(v => v.label);
    if (selectedValues.length > 0) {
      selected[filter.field] = selectedValues;
    }
  });
  return selected;
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
    Object.entries(selectedFilters.value).forEach(([field, selectedValues]) => {
      if (selectedValues.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
          if (field === 'price') {
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
          if (field === 'weight') {
            const weight = product.weight;
            return selectedValues.some(range => {
              if (range === 'Bis 1 kg') return weight <= 1;
              if (range === '1-3 kg') return weight > 1 && weight <= 3;
              if (range === '3-5 kg') return weight > 3 && weight <= 5;
              if (range === 'Über 5 kg') return weight > 5;
              return false;
            });
          }
          return selectedValues.includes(product[field]);
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

const handleCheckboxChange = async () => {
  await search();
};
</script>

<style scoped>
.search-preview {
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

.filters {
  height: calc(100vh - 250px);
  overflow-y: auto;
  position: sticky;
  top: 1rem;
  flex-shrink: 0;
  border: 1px solid var(--surface-border);
  border-radius: 6px;
}

.results {
  overflow-y: auto;
  height: calc(100vh - 250px);
}

.filter-value {
  margin-bottom: 0.5rem;
}

.filter-value label {
  cursor: pointer;
  color: var(--text-color);
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

.debug-panel-container {
  position: relative;
  margin-top: 2rem;
  grid-column: 1 / -1;
}

.debug-panel-arrow {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid var(--surface-border);
  position: absolute;
  top: -10px;
  left: calc(12.5% + 1rem);
  transform: translateX(-50%);
}

.debug-panel {
  margin-top: 10px;
  background: var(--surface-card);
  border-color: var(--surface-border);
}

.panelgrids {
  display: grid;
  grid-template-columns: 100px 20px 1fr;
  gap: 1rem;
  background-color: var(--surface-hover);
  border-radius: 6px;
  padding: 1rem;
}

.panelgrid {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 1rem;
  border-radius: 6px;
  border-left: 1px solid var(--text-color);
  border-right: 1px solid var(--text-color);
  margin-left: 50px;
  padding: 1rem;
}

.tag {
  background-color: var(--surface-border);
  padding: 0.5em 1em;
  border-radius: 0.25em;
  margin-left: 0.5em;
  margin-bottom: 0.25em;
  color: var(--text-color);
}

.tag.blue {
  background-color: var(--primary-color);
  color: white;
}

.tag.yellow {
  background-color: var(--warning-color);
  color: var(--warning-color-text);
}

.tagForm {
  padding: 0.5em 1em;
  border-radius: 0.25em;
  margin-left: 0.5em;
  margin-bottom: 0.25em;
  color: var(--text-color);
}

.tagForm.xsign {
  margin-left: 64px;
}

.form {
  margin-bottom: 0.25em;
  display: flex;
  flex-direction: column;
}

.boost-detail {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

:deep(.p-accordion-header-link) {
  padding: 0.75rem 0.5rem !important;
  background: var(--surface-card) !important;
  color: var(--text-color) !important;
  border-color: var(--surface-border) !important;
}

:deep(.p-accordion-content) {
  padding: 0.75rem 0.5rem !important;
  background: var(--surface-card) !important;
  color: var(--text-color) !important;
  border-color: var(--surface-border) !important;
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

.list-view-panel {
  margin: 0;
  padding: 1rem;
  background-color: var(--surface-hover);
}

.list-view-panel .debug-panel {
  margin-top: 0;
}

.list-view-panel .debug-panel-arrow {
  display: none;
}

:deep(.p-datatable-tbody > tr.p-row-expanded) {
  background-color: var(--surface-hover);
}

.checkbox {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
  cursor: pointer;
  accent-color: var(--primary-color);
}

/* Dark theme adjustments */
:deep(.dark) .product-card {
  background-color: var(--surface-card);
}

:deep(.dark) .product-card.selected {
  background-color: var(--primary-900);
}

:deep(.dark) .filters {
  background-color: var(--surface-card);
}

:deep(.dark) .tag {
  background-color: var(--surface-hover);
}

:deep(.dark) .debug-panel {
  background-color: var(--surface-card);
}

:deep(.dark) .panelgrids {
  background-color: var(--surface-hover);
}

:deep(.dark) .panelgrid {
  border-color: var(--surface-border);
}

:deep(.dark) .tagForm {
  color: var(--text-color);
}

:deep(.dark) .tag.blue {
  background-color: var(--primary-700);
  color: white;
}

:deep(.dark) .tag.yellow {
  background-color: var(--warning-600);
  color: var(--surface-0);
}
</style>