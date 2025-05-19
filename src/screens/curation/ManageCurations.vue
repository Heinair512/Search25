<template>
<Card>
  <template #title>
    <div class="flex align-items-center justify-content-between w-full pl-3">
      <span class="text-xl font-semibold">{{ $t('menu.manage_curations') }}</span>
    </div>
  </template>
  <template #content>
    <div class="flex flex-column gap-4">
      <!-- Search Curations -->
      <div class="flex gap-2 mb-4">
        <InputText 
          v-model="curationSearchTerm" 
          :placeholder="$t('curation.search_curations')" 
          class="w-full"
        />
      </div>

      <!-- Curations Table -->
      <DataTable 
        :value="filteredCurations"
        v-model:filters="filters"
        :paginator="true" 
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        responsiveLayout="scroll"
        class="p-datatable-sm"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        paginatorClassName="justify-content-center"
      >
        <template #paginatorend>
          <div class="flex align-items-center gap-2">
            <span>{{ $t('curation.items_per_page') }}</span>
          </div>
        </template>
        <Column field="term" :header="$t('curation.search_term')" sortable></Column>
        <Column field="pinnedCount" header="Pinned Articles" sortable></Column>
        <Column field="pinnedKbns" header="Pinned KBNs" sortable>
          <template #body="slotProps">
            {{ slotProps.data.pinnedKbns?.join(', ') || '' }}
          </template>
        </Column>
        <Column field="createdBy" header="Created By" sortable>
          <template #body="slotProps">
            <div class="flex align-items-center gap-2">
              <Avatar 
                :image="slotProps.data.createdByImage" 
                icon="pi pi-user" 
                size="small" 
                shape="circle" 
              />
              <span>{{ slotProps.data.createdBy }}</span>
            </div>
          </template>
        </Column>
        <Column field="createdAt" header="Created" sortable>
          <template #body="slotProps">
            {{ $t('curation.created', { days: getDaysAgo(slotProps.data.createdAt) }) }}
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
                v-tooltip.bottom="'Curation verwalten'"
              />
              <Button 
                icon="pi pi-trash" 
                text 
                rounded 
                severity="danger"
                @click="confirmDeleteCuration(slotProps.data)"
                v-tooltip.bottom="'Curation löschen'"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <!-- Products Grid (when viewing a curation) -->
      <div v-if="selectedCuration" class="mt-4">
        <h3 class="mb-3">{{ selectedCuration.term }}</h3>
        <div class="grid">
          <div v-for="product in products" :key="product.id" class="col-12 md:col-3 lg:col-2">
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
      </div>
    </div>
  </template>
</Card>

<!-- Delete Curation Dialog -->
<Dialog v-model:visible="deleteDialog" modal class="w-30rem">
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
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';
import Toast from 'primevue/toast';
import Avatar from 'primevue/avatar';

const toast = useToast();
const router = useRouter();
const { t } = useI18n();

const curations = ref([
  { 
    term: 'hammer', 
    pinnedCount: 3, 
    pinnedKbns: ['123456', '789012'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    createdBy: 'Jörg Wehrenberg',
    createdByImage: null
  },
  { 
    term: 'schrauben', 
    pinnedCount: 2, 
    pinnedKbns: ['345678'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    createdBy: 'Steffen Giese',
    createdByImage: null
  },
  { 
    term: 'bohrer', 
    pinnedCount: 1,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    createdBy: 'Heiner Holzhüter',
    createdByImage: null
  },
  { 
    term: 'säge', 
    pinnedCount: 2,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    createdBy: 'Krzysztof Michalak',
    createdByImage: null
  },
  { 
    term: 'werkzeugkasten', 
    pinnedCount: 1,
    createdAt: new Date(), // today
    createdBy: 'Jörg Wehrenberg',
    createdByImage: null
  }
]);

const curationSearchTerm = ref('');
const filters = ref({});
const deleteDialog = ref(false);
const selectedCuration = ref(null);

// Mock products data
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
  }
];

const products = ref([]);

const getDaysAgo = (date) => {
  const diffTime = Math.abs(new Date() - new Date(date));
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const filteredCurations = computed(() => {
  if (!curationSearchTerm.value) return curations.value;
  return curations.value.filter(c => 
    c.term.toLowerCase().includes(curationSearchTerm.value.toLowerCase())
  );
});

const editCuration = (curation) => {
  selectedCuration.value = curation;
  // Load all products and mark the pinned ones
  products.value = mockProducts.map(product => ({
    ...product,
    pinned: curation.pinnedKbns?.includes(product.kbn) || false,
    hidden: false // Reset hidden state
  }));
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
  products.value = [];
};

const togglePin = (product) => {
  product.pinned = !product.pinned;
  if (selectedCuration.value) {
    if (product.pinned) {
      if (!selectedCuration.value.pinnedKbns) {
        selectedCuration.value.pinnedKbns = [];
      }
      selectedCuration.value.pinnedKbns.push(product.kbn);
      selectedCuration.value.pinnedCount++;
    } else {
      selectedCuration.value.pinnedKbns = selectedCuration.value.pinnedKbns.filter(kbn => kbn !== product.kbn);
      selectedCuration.value.pinnedCount--;
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
</script>

<style scoped>
:deep(.p-paginator) {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

:deep(.p-paginator .p-dropdown) {
  position: absolute;
  right: 0;
}

:deep(.p-paginator .p-paginator-end) {
  position: absolute;
  right: 8rem;
}

:deep(.p-paginator .p-paginator-pages) {
  margin: 0 auto;
}

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