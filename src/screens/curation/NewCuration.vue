<template>
<Card>
  <template #title>
    <div class="flex align-items-center justify-content-between w-full pl-3">
      <span class="text-xl font-semibold">{{ $t('menu.new_curation') }}</span>
    </div>
  </template>
  <template #content>
    <div class="flex flex-column gap-4">
      <!-- Search Input -->
      <div class="flex gap-2">
        <InputText 
          v-model="searchTerm" 
          :placeholder="$t('curation.search_placeholder')" 
          class="w-full"
          @keyup.enter="searchProducts"
        />
        <Button 
          :label="$t('curation.search_button')" 
          @click="searchProducts"
        />
      </div>

      <!-- Search Results -->
      <div v-if="searchResults.length > 0" class="grid">
        <div v-for="product in searchResults" :key="product.id" class="col-12 md:col-3 lg:col-2">
          <div class="surface-card p-2 border-round shadow-2 h-full" :class="{ 'opacity-50': product.hidden }">
            <div class="flex flex-column h-full">
              <div class="relative">
                <img :src="product.image" :alt="product.name" class="w-full h-6rem object-cover border-round" />
                <div class="absolute top-0 right-0 m-1 flex gap-1">
                  <Button 
                    :icon="product.pinned ? 'pi pi-star-fill' : 'pi pi-star'" 
                    :severity="product.pinned ? 'warning' : 'secondary'"
                    class="p-button-sm"
                    rounded
                    @click="togglePin(product)"
                    v-tooltip="product.pinned ? $t('curation.unpin_article') : $t('curation.pin_article')"
                  />
                  <Button 
                    :icon="product.hidden ? 'pi pi-eye-slash' : 'pi pi-eye'" 
                    :severity="product.hidden ? 'danger' : 'secondary'"
                    class="p-button-sm"
                    rounded
                    @click="toggleHide(product)"
                    v-tooltip="product.hidden ? $t('curation.show_article') : $t('curation.hide_article')"
                  />
                </div>
              </div>
              <div class="flex flex-column gap-1 mt-2 flex-grow-1">
                <h4 class="m-0 line-clamp-1 text-sm">{{ product.name }}</h4>
                <p class="text-xs line-clamp-2 mb-2">{{ product.description }}</p>
                <div class="flex align-items-center gap-2 mt-auto">
                  <span class="text-sm font-bold">{{ product.price }}</span>
                  <Tag :value="product.category" size="small" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- No Results Message -->
      <div v-else-if="hasSearched" class="text-center p-4">
        <p>{{ $t('curation.no_results') }}</p>
      </div>

      <!-- Paginator -->
      <Paginator
        v-if="searchResults.length > 0"
        v-model:first="first"
        v-model:rows="rows"
        :totalRecords="totalRecords"
        :rowsPerPageOptions="[12, 24, 48]"
        @page="onPageChange"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      >
        <template #start>
          <div class="flex align-items-center">
            <span class="mx-2">{{ $t('curation.items_per_page') }}</span>
          </div>
        </template>
      </Paginator>
    </div>
  </template>
</Card>

<Toast />
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Paginator from 'primevue/paginator';
import Toast from 'primevue/toast';

const toast = useToast();
const { t } = useI18n();

// Search
const searchTerm = ref('');
const hasSearched = ref(false);
const first = ref(0);
const rows = ref(12);
const totalRecords = ref(0);
const searchResults = ref([]);

// Mock product data
const mockProducts = [
  {
    id: 1,
    kbn: '123456',
    name: 'Professional Hammer',
    description: 'High-quality hammer for professional use with ergonomic grip and perfect balance',
    price: '€29.99',
    category: 'Tools',
    image: 'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg',
    pinned: false,
    hidden: false
  },
  {
    id: 2,
    kbn: '234567',
    name: 'Power Drill Set',
    description: 'Complete power drill set with various drill bits and carrying case',
    price: '€149.99',
    category: 'Power Tools',
    image: 'https://images.pexels.com/photos/825262/pexels-photo-825262.jpeg',
    pinned: false,
    hidden: false
  },
  {
    id: 3,
    kbn: '345678',
    name: 'Precision Screwdriver Kit',
    description: 'Professional screwdriver set with magnetic tips and comfort grip handles',
    price: '€34.99',
    category: 'Hand Tools',
    image: 'https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg',
    pinned: false,
    hidden: false
  },
  {
    id: 4,
    kbn: '456789',
    name: 'Heavy Duty Toolbox',
    description: 'Durable toolbox with multiple compartments and secure locking system',
    price: '€79.99',
    category: 'Storage',
    image: 'https://images.pexels.com/photos/175039/pexels-photo-175039.jpeg',
    pinned: false,
    hidden: false
  }
];

const searchProducts = async (term = searchTerm.value) => {
  searchTerm.value = term;
  hasSearched.value = true;
  searchResults.value = mockProducts;
  totalRecords.value = mockProducts.length;
};

const togglePin = (product) => {
  product.pinned = !product.pinned;
  
  // Create new curation when pinning first product
  if (product.pinned && !curations.value.find(c => c.term === searchTerm.value)) {
    curations.value.push({
      term: searchTerm.value,
      pinnedCount: 1,
      pinnedKbns: [product.kbn],
      createdAt: new Date()
    });
  } else {
    const curation = curations.value.find(c => c.term === searchTerm.value);
    if (curation) {
      if (product.pinned) {
        if (!curation.pinnedKbns) curation.pinnedKbns = [];
        curation.pinnedKbns.push(product.kbn);
        curation.pinnedCount++;
      } else {
        curation.pinnedKbns = curation.pinnedKbns.filter(kbn => kbn !== product.kbn);
        curation.pinnedCount--;
      }
    }
  }
  
  toast.add({
    severity: product.pinned ? 'success' : 'info',
    summary: t('curation.success'),
    detail: t(product.pinned ? 'curation.article_pinned' : 'curation.article_unpinned'),
    life: 3000
  });
};

const toggleHide = (product) => {
  product.hidden = !product.hidden;
  
  toast.add({
    severity: 'info',
    summary: t('curation.success'),
    detail: t(product.hidden ? 'curation.article_hidden' : 'curation.article_shown'),
    life: 3000
  });
};

const onPageChange = (event) => {
  first.value = event.first;
  rows.value = event.rows;
};
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:deep(.p-button.p-button-sm) {
  width: 2rem !important;
  height: 2rem !important;
  padding: 0 !important;
}

:deep(.p-button.p-button-sm .p-button-icon) {
  font-size: 0.875rem !important;
}
</style>