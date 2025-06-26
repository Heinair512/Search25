<template>
  <div class="debug-search flex h-full">

    <Dialog
        v-model:visible="filtersVisible"
        modal
        header="Search filters"
        :style="{ width: '26rem' }"
        :breakpoints="{ '960px': '95vw' }"
    >
      <div class="filters-wrapper h-full overflow-auto">
        <div class="search-filters surface-card border-round p-3 flex flex-column gap-4">
          <!-- Installation filter -->
          <div class="flex flex-column gap-1 w-full">
            <label class="text-sm text-600">{{
                t('technical.debug_search.filter.installation') || 'Installation'
              }}</label>
            <Dropdown
                v-model="installation"
                :options="installationOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Install"
                class="w-full"
                inputClass="text-center"
            />
          </div>

          <!-- Language filter -->
          <div class="flex flex-column gap-1 w-full">
            <label class="text-sm text-600">{{ $t('technical.debug_search.filter.language') || 'Language' }}</label>
            <Dropdown
                v-model="language"
                :options="languageOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Lang"
                class="w-full"
                inputClass="text-center"
            />
          </div>

          <!-- Layout filter -->
          <div class="flex flex-column gap-1 w-full">
            <label class="text-sm text-600">{{ $t('technical.debug_search.filter.layout') || 'Layout' }}</label>
            <Dropdown
                v-model="layout"
                :options="layoutOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Layout"
                filter
                filterPlaceholder="Search layouts…"
                class="w-full"
                inputClass="text-center"
            />
          </div>

          <!-- Company-ID filter -->
          <div class="flex flex-column gap-1 w-full">
            <label class="text-sm text-600">{{ $t('technical.debug_search.filter.companyid') || 'Company ID' }}</label>
            <InputText
                v-model="companyId"
                placeholder="CID"
                inputmode="numeric"
                pattern="[0-9]{0,4}"
                maxlength="4"
                class="w-full text-center"
            />
          </div>
          <div class="flex align-items-center gap-2 w-full">
            <Checkbox
                v-model="isSap"
                binary
                inputId="sap-filter"
                class="cursor-pointer"
            />
            <label
                for="sap-filter"
                class="text-sm text-600 cursor-pointer"
            >
              {{ t('technical.debug_search.filter.sap') || 'SAP' }}
            </label>
          </div>
        </div>
      </div>
    </Dialog>

    <main class="flex-1 p-6 flex-col overflow-hidden">
      <div class="search-header mb-4 max-w-2xl">
        <!-- Search Header -->
        <div class="text-900 text-xl font-bold mb-2">{{ $t('technical.debug_search.title') }}</div>
        <p class="text-600 line-height-3 mb-4">
          {{ $t('technical.debug_search.subtitle') }}
        </p>

        <div class="search-controls flex gap-4">
          <div class="search-input flex-grow-1">
            <InputText
                v-model="searchTerm"
                :placeholder="$t('technical.debug_search.search.placeholder')"
                class="w-full"
                @keyup.enter="search"
            />
          </div>
          <Button
              icon="pi pi-search"
              @click="search"
          />
          <Button
              icon="pi pi-cog"
              class="ml-auto"
              @click="filtersVisible = true"
              rounded
              outlined
              aria-label="Open filters"
          />
        </div>
      </div>
      <div class="search-results flex-1 overflow-auto">
        <!-- Results Section -->
        <div class="search-results">
          <!-- Results Header -->
          <div class="results-header flex justify-content-between align-items-center mb-3">
            <div class="results-count">
              {{ totalResults }} {{ $t('technical.debug_search.search.results') }}
              <span v-if="responseTime" class="text-500 ml-2">
            <i class="pi pi-clock"></i> {{ responseTime }}{{ $t('technical.debug_search.search.response_time') }}
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
            <ProgressSpinner style="width: 50px; height: 50px"/>
          </div>

          <!-- Grid View -->
          <div v-else-if="isGridView && !loading">
            <div v-if="products.length > 0" class="grid">
              <div v-for="(product, idx) in products" :key="product.id" class="col-12 sm:col-6 lg:col-3">
                <div
                    class="product-card surface-card p-3 border-1 surface-border border-round h-full cursor-pointer"
                    :class="{ 'selected': selectedProduct === product }"
                    @click="toggleProductSelection(product)"
                >
                  <!-- ⭐ small rank badge (0-based) -->
                  <span class="rank-badge">
                    {{ first + idx }}
                  </span>
                  <!-- Product Image -->
                  <div class="product-image-container mb-3">
                    <img
                        :src="product.picturePath || '/platzhalter.webp'"
                        @error="onImgError"
                        :alt="product.description"
                        class="product-image"
                        loading="lazy"
                    />
                  </div>

                  <!-- Product Info -->
                  <div class="product-info">
                    <div v-if="product.description" class="text-sm font-semibold mb-1 line-clamp-1">
                      {{ product.description }}
                    </div>
                    <div v-if="product.id" class="text-xs mb-1">ID: {{ product.id }}</div>
                    <div class="product-attributes text-xs">
                      <div class="grid">
                        <div v-if="product.productNumber" class="col-6">
                          <span class="text-500">{{ $t('technical.debug_search.product.article_number') }}:</span>
                          <div class="font-semibold line-clamp-1">{{ product.productNumber }}</div>
                        </div>
                        <div v-if="product.supplier" class="col-6">
                          <span class="text-500">{{ $t('technical.debug_search.product.supplier') }}:</span>
                          <div class="font-semibold line-clamp-1">{{ product.supplier }}</div>
                        </div>
                        <div v-if="product.runNumber" class="col-6">
                          <span class="text-500">{{ $t('technical.debug_search.product.run_number') }}:</span>
                          <div class="font-semibold">{{ product.runNumber }}</div>
                        </div>
                        <div v-if="product.supplierProductNumber && product.supplierProductNumber.length > 0"
                             class="col-6">
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
              <p>{{ $t('technical.debug_search.search.no_results') }}</p>
            </div>
          </div>

          <!-- Table View -->
          <div v-else-if="!isGridView && !loading">
            <DataTable
                :value="products"
                lazy
                stripedRows
                class="p-datatable-sm"
                responsiveLayout="scroll"
                v-model:expandedRows="expandedRows"
                selectionMode="single"
                v-model:selection="selectedTableRow"
                @rowSelect="onRowSelect"
                @rowUnselect="onRowUnselect"
                :paginator="true"
                :first="first"
                @page="onPageChange"
                :rows="rows"
                :totalRecords="totalResults"
                :rowsPerPageOptions="[16]"
            >
              <Column header="#" style="width: 3rem; text-align: center">
                <template #body="slotProps">
                  <span class="rank-badge table-badge">
                  {{ first + slotProps.index }}
                </span>
                </template>
              </Column>
              <Column field="image" :header="$t('technical.debug_search.table.image')" style="width: 100px">
                <template #body="slotProps">
                  <div class="product-image-container" style="padding-top: 100%">
                    <img
                        :src="slotProps.data.picturePath || '/platzhalter.webp'"
                        :alt="slotProps.data.description || 'Product'"
                        class="product-image"
                        @error="onImgError"
                        loading="lazy"
                    />
                  </div>
                </template>
              </Column>
              <Column field="id" :header="$t('technical.debug_search.table.id')"></Column>
              <Column field="productNumber" :header="$t('technical.debug_search.table.article_no')"
                      style="width: 120px"></Column>
              <Column field="supplier" :header="$t('technical.debug_search.table.supplier')"
                      style="width: 120px"></Column>
              <Column field="description" :header="$t('technical.debug_search.table.description')"></Column>
              <Column field="grosPrice" :header="$t('technical.debug_search.table.price')" style="width: 120px">
                <template #body="slotProps">
                  {{ formatPrice(slotProps.data.grosPrice, slotProps.data.grosPriceCurrency) }}
                </template>
              </Column>
              <Column field="status" :header="$t('technical.debug_search.table.status')" style="width: 100px">
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
              :rowsPerPageOptions="[16]"
              @page="onPageChange"
              template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          >
            <template #start>
              <div class="flex align-items-center">
                <span class="mx-2">{{ $t('technical.debug_search.search.items_per_page') }}</span>
              </div>
            </template>
          </Paginator>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';
import ProgressSpinner from 'primevue/progressspinner';
import { useDebugSearch } from '../../composables/useDebugSearch';
import { useDebugFilters } from '../../composables/useDebugFilters';
import { usePagination } from '../../composables/usePagination';
import Dialog from 'primevue/dialog';

const { t } = useI18n();
const route = useRoute();

const searchTerm = ref('');
const totalResults = ref(0);
const responseTime = ref(null);
const selectedProduct = ref(null);
const expandedRows = ref([]);
const selectedTableRow = ref(null);
const hasSearched = ref(false);
const filtersVisible = ref(false);

const {
  installationOptions,
  languageOptions,
  layoutOptions,
  installation,
  language,
  layout,
  companyId,
  isSap
} = useDebugFilters();

// Group header config
const headerConfig = reactive({ installation, language, layout, isSap });

const {
  products, total, took, loading, runSearch
} = useDebugSearch(headerConfig);

const { first, rows, isGrid: isGridView, updateStateOnPageChange } = usePagination(16);

const search = async () => {
  hasSearched.value = true;
  await runSearch(searchTerm.value, companyId.value, 0, isSap.value);
  totalResults.value = total.value;
  responseTime.value = took.value;
  first.value = 0;
};

const onPageChange = async (event) => {
  first.value = event.first;
  const pageIndex = event.first / event.rows;
  await runSearch(
    searchTerm.value,
    companyId.value,
    pageIndex,
    isSap.value
  );
  totalResults.value = total.value;
  window.scrollTo({ top: 0, behavior: 'instant' });
};

const onImgError = (event) => {
  const img = event.target;
  img.onerror = null;
  img.src = '/platzhalter.webp';
};

const toggleProductSelection = (product) => {
  selectedProduct.value = selectedProduct.value === product ? null : product;
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
onMounted(() => {
  if (route.query.term) {
    searchTerm.value = String(route.query.term);
    search();
  }
});
</script>

<style scoped>
/* ── Layout containers ───────────────────────────────────────── */
.debug-search {
  display: flex; /* two-column layout */
  height: 100%;
  overflow: hidden;
}

.toggle-btn i {
  position: relative;
  margin-left: 0.25rem;
  font-size: 1rem;
  color: var(--primary-color);
}

/* ── Filters panel & items ───────────────────────────────────── */
.filters-wrapper {
  height: 100%;
  overflow: auto;
  padding: 1rem;
}

.search-filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.filter-item > label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.filter-item > div {
  padding: 0.5rem;
  background: var(--surface-ground);
  border-radius: var(--border-radius);
}

.filter-item :deep(.p-dropdown),
.filter-item :deep(.p-inputtext) {
  width: 100% !important;
  min-height: 2.5rem;
}

/* ── Main header & search bar ────────────────────────────────── */
.search-header {
  flex-shrink: 0;
  max-width: 800px;
  margin-bottom: 1rem;
}

.search-header .text-xl {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.search-header p {
  margin-bottom: 1rem;
  color: var(--text-color-secondary);
}

.search-controls {
  display: flex;
  gap: 1rem;
}

.search-input {
  flex-grow: 1;
}

/* ── Product cards (grid view) ───────────────────────────────── */
.product-card {
  position: relative;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  padding: 0.75rem;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary-color);
}

.product-card.selected {
  border-color: var(--primary-color);
  background: var(--primary-50);
}

.rank-badge {
  z-index: 99;
  position: absolute;
  top: 6px;
  left: 6px;
  background: #6c757d;
  color: #fff;
  padding: 2px 6px;
  border-radius: 1rem;
  font-weight: 800;
  font-size: clamp(0.65rem, 1vw, 0.9rem);
}

/* ── Product info ───────────────────────────────────────────── */
.product-image-container {
  position: relative;
  width: 100%;
  padding-top: 75%;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.product-image {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: var(--surface-ground);
  transition: transform 0.2s;
}

.product-image:hover {
  transform: scale(1.05);
}

.product-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-info .text-sm {
  font-size: 0.8rem;
}

/* ── DataTable styles (table view) ──────────────────────────── */
:deep(.p-datatable-wrapper) {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  overflow: hidden;
}

:deep(.p-datatable-thead > tr > th),
:deep(.p-datatable-tbody > tr > td) {
  padding: 0.5rem;
  border-color: var(--surface-border);
  color: var(--text-color);
}

:deep(.p-datatable-thead) {
  background: var(--surface-ground);
}

:deep(.p-datatable-tbody > tr.p-row-expanded) {
  background: var(--surface-hover);
}

/* ── Misc ───────────────────────────────────────────────────── */
.line-clamp-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

:deep(.p-datatable-tbody .table-badge) {
  position: relative !important;
  top: auto !important;
  left: auto !important;
  margin: 0 !important;
  /* align it nicely with text: */
  display: inline-block;
  vertical-align: middle;
  font-size: 0.85rem; /* slightly smaller if you like */
}
</style>