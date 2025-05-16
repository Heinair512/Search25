<template>
<div class="grid">
  <div class="col-12">
    <Card>
      <template #title>
        <div class="flex align-items-center justify-content-between w-full pl-3">
          <span class="text-xl font-semibold">{{ $t('curation.title') }}</span>
          <Button 
            :label="$t('curation.pin_kbns')"
            icon="pi pi-list" 
            severity="secondary"
            @click="showKbnDialog = true"
          />
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

          <!-- Existing Curations Table -->
          <div class="surface-card p-4 border-round">
            <h3>{{ $t('curation.existing_curations') }}</h3>
            <div class="flex gap-2 mb-4">
              <InputText 
                v-model="curationSearchTerm" 
                :placeholder="$t('curation.search_curations')" 
                class="w-full"
              />
            </div>
            <DataTable 
              :value="filteredCurations"
              v-model:filters="filters"
              :paginator="true" 
              :rows="10"
              :rowsPerPageOptions="[5, 10, 20, 50]"
              responsiveLayout="scroll"
              class="p-datatable-sm"
            >
              <Column field="term" :header="$t('curation.search_term')" sortable></Column>
              <Column field="pinnedCount" header="Pinned Articles" sortable></Column>
              <Column field="pinnedKbns" header="Pinned KBNs" sortable>
                <template #body="slotProps">
                  {{ slotProps.data.pinnedKbns?.join(', ') || '' }}
                </template>
              </Column>
              <Column header="Actions" style="width: 8rem">
                <template #body="slotProps">
                  <div class="flex gap-1">
                    <Button 
                      icon="pi pi-pencil" 
                      text 
                      rounded 
                      severity="secondary"
                      @click="editCuration(slotProps.data)"
                    />
                    <Button 
                      icon="pi pi-trash" 
                      text 
                      rounded 
                      severity="danger"
                      @click="confirmDeleteCuration(slotProps.data)"
                    />
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </template>
    </Card>
  </div>

  <!-- KBN Dialog -->
  <Dialog v-model:visible="showKbnDialog" :modal="true" class="w-30rem">
    <template #header>
      <h3>{{ $t('curation.pin_kbns_title') }}</h3>
    </template>
    <div class="flex flex-column gap-3">
      <div class="flex flex-column gap-2">
        <label for="search-term" class="font-medium">{{ $t('curation.search_term') }}</label>
        <InputText id="search-term" v-model="kbnSearchTerm" :placeholder="$t('curation.search_placeholder')" />
      </div>
      <div class="flex flex-column gap-2">
        <label for="kbn-list" class="font-medium">{{ $t('curation.kbn_list') }}</label>
        <Textarea 
          id="kbn-list" 
          v-model="kbnList" 
          :placeholder="$t('curation.kbn_list_placeholder')"
          rows="5"
          class="w-full"
        />
      </div>
    </div>
    <template #footer>
      <div class="flex justify-content-end gap-2">
        <Button :label="$t('curation.cancel')" @click="showKbnDialog = false" text />
        <Button :label="$t('curation.save')" severity="success" @click="saveKbns" />
      </div>
    </template>
  </Dialog>

  <!-- Delete Curation Dialog -->
  <Dialog v-model:visible="deleteDialog" :modal="true" class="w-30rem">
    <template #header>
      <h3>{{ $t('curation.delete_curation') }}</h3>
    </template>
    <p>{{ $t('curation.delete_confirm') }}</p>
    <template #footer>
      <div class="flex justify-content-end gap-2">
        <Button :label="$t('curation.cancel')" @click="deleteDialog = false" text />
        <Button :label="$t('curation.delete_curation')" severity="danger" @click="deleteCuration" />
      </div>
    </template>
  </Dialog>

  <Toast />
</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Paginator from 'primevue/paginator';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import { curations } from '../data/curations';

const toast = useToast();
const { t } = useI18n();

// Search
const searchTerm = ref('');
const hasSearched = ref(false);
const first = ref(0);
const rows = ref(12);
const totalRecords = ref(0);

// KBN Dialog
const showKbnDialog = ref(false);
const kbnSearchTerm = ref('');
const kbnList = ref('');

// Curations
const curationSearchTerm = ref('');
const filters = ref({});
const deleteDialog = ref(false);
const selectedCuration = ref(null);

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
  },
  {
    id: 5,
    kbn: '567890',
    name: 'Circular Saw',
    description: 'Professional grade circular saw with laser guide and dust collection',
    price: '€199.99',
    category: 'Power Tools',
    image: 'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg',
    pinned: false,
    hidden: false
  },
  {
    id: 6,
    kbn: '678901',
    name: 'Measuring Tape Set',
    description: 'Set of 3 measuring tapes with metric and imperial measurements',
    price: '€19.99',
    category: 'Measuring Tools',
    image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
    pinned: false,
    hidden: false
  },
  {
    id: 7,
    kbn: '789012',
    name: 'Safety Goggles',
    description: 'Impact-resistant safety goggles with anti-fog coating',
    price: '€14.99',
    category: 'Safety Equipment',
    image: 'https://images.pexels.com/photos/1474993/pexels-photo-1474993.jpeg',
    pinned: false,
    hidden: false
  },
  {
    id: 8,
    kbn: '890123',
    name: 'Work Gloves Pro',
    description: 'Heavy-duty work gloves with reinforced palms and touchscreen compatibility',
    price: '€24.99',
    category: 'Safety Equipment',
    image: 'https://images.pexels.com/photos/1449844/pexels-photo-1449844.jpeg',
    pinned: false,
    hidden: false
  },
  {
    id: 9,
    kbn: '901234',
    name: 'Level Set',
    description: 'Professional 3-piece level set with magnetic strips',
    price: '€44.99',
    category: 'Measuring Tools',
    image: 'https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg',
    pinned: false,
    hidden: false
  },
  {
    id: 10,
    kbn: '012345',
    name: 'Adjustable Wrench',
    description: 'Premium adjustable wrench with wide jaw capacity',
    price: '€27.99',
    category: 'Hand Tools',
    image: 'https://images.pexels.com/photos/210881/pexels-photo-210881.jpeg',
    pinned: false,
    hidden: false
  },
  {
    id: 11,
    kbn: '112233',
    name: 'Tool Belt',
    description: 'Heavy-duty tool belt with multiple pockets and padded waist support',
    price: '€39.99',
    category: 'Storage',
    image: 'https://images.pexels.com/photos/1027508/pexels-photo-1027508.jpeg',
    pinned: false,
    hidden: false
  },
  {
    id: 12,
    kbn: '445566',
    name: 'Utility Knife Set',
    description: 'Professional utility knife set with replacement blades',
    price: '€16.99',
    category: 'Hand Tools',
    image: 'https://images.pexels.com/photos/3846220/pexels-photo-3846220.jpeg',
    pinned: false,
    hidden: false
  }
];

const searchResults = ref([]);

// Computed
const filteredCurations = computed(() => {
  if (!curationSearchTerm.value) return curations.value;
  return curations.value.filter(c => 
    c.term.toLowerCase().includes(curationSearchTerm.value.toLowerCase())
  );
});

// Methods
const searchProducts = async (term = searchTerm.value) => {
  searchTerm.value = term;
  hasSearched.value = true;
  const curation = curations.value.find(c => c.term === term);
  
  searchResults.value = mockProducts.map(product => ({
    ...product,
    pinned: curation?.pinnedKbns?.includes(product.kbn) || false
  }));
  
  // Sort pinned products to the top
  searchResults.value.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });
  
  totalRecords.value = mockProducts.length;
};

const togglePin = (product) => {
  product.pinned = !product.pinned;
  
  // Update curations
  let existingCuration = curations.value.find(c => c.term === searchTerm.value);
  if (!existingCuration) {
    existingCuration = { 
      term: searchTerm.value, 
      pinnedCount: 0,
      pinnedKbns: []
    };
    curations.value.push(existingCuration);
  }
  
  if (product.pinned) {
    existingCuration.pinnedCount++;
    if (!existingCuration.pinnedKbns) existingCuration.pinnedKbns = [];
    existingCuration.pinnedKbns.push(product.kbn);
  } else {
    existingCuration.pinnedCount--;
    existingCuration.pinnedKbns = existingCuration.pinnedKbns.filter(kbn => kbn !== product.kbn);
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

const editCuration = (curation) => {
  kbnSearchTerm.value = curation.term;
  kbnList.value = curation.pinnedKbns?.join('\n') || '';
  showKbnDialog.value = true;
};

const confirmDeleteCuration = (curation) => {
  selectedCuration.value = curation;
  deleteDialog.value = true;
};

const deleteCuration = () => {
  const index = curations.value.findIndex(c => c.term === selectedCuration.value.term);
  if (index > -1) {
    curations.value.splice(index, 1);
    toast.add({
      severity: 'success',
      summary: t('curation.success'),
      detail: t('curation.curation_deleted'),
      life: 3000
    });
  }
  deleteDialog.value = false;
  selectedCuration.value = null;
};

const saveKbns = () => {
  const kbns = kbnList.value.split('\n').map(kbn => kbn.trim()).filter(kbn => kbn);
  let existingCuration = curations.value.find(c => c.term === kbnSearchTerm.value);
  
  if (!existingCuration) {
    existingCuration = {
      term: kbnSearchTerm.value,
      pinnedCount: 0,
      pinnedKbns: []
    };
    curations.value.push(existingCuration);
  }
  
  existingCuration.pinnedKbns = kbns;
  showKbnDialog.value = false;
  
  toast.add({
    severity: 'success',
    summary: t('curation.success'),
    detail: t('curation.kbns_saved'),
    life: 3000
  });
  
  if (searchTerm.value === kbnSearchTerm.value) {
    searchProducts(kbnSearchTerm.value);
  }
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

:deep(.p-card) {
  background-color: var(--surface-card) !important;
}

:deep(.p-card .p-card-title) {
  background-color: var(--surface-section) !important;
  color: var(--text-color) !important;
}

:deep(.p-datatable) {
  background-color: var(--surface-card);
  color: var(--text-color);
}

:deep(.p-datatable .p-datatable-header) {
  background-color: var(--surface-card);
  color: var(--text-color);
  border-color: var(--surface-border);
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: var(--surface-card);
  color: var(--text-color);
  border-color: var(--surface-border);
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  background-color: var(--surface-card);
  color: var(--text-color);
  border-color: var(--surface-border);
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  border-color: var(--surface-border);
}

:deep(.p-paginator) {
  background-color: var(--surface-card) !important;
  color: var(--text-color) !important;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page) {
  color: var(--text-color) !important;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background-color: var(--primary-color) !important;
  color: white !important;
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