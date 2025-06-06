<template>
<Card>
  <template #title>
    <div class="flex align-items-center justify-content-between w-full pl-3">
      <span class="text-xl font-semibold">{{ $t('analytics.low_click_searches') }}</span>
      <div class="flex gap-2">
        <Calendar v-model="selectedPeriod" selectionMode="range" :showIcon="true" :maxDate="maxDate" class="w-20rem" />
        <Button icon="pi pi-download" @click="exportToCSV" />
      </div>
    </div>
  </template>
  <template #content>
    <div class="flex flex-column gap-3">
      <InputText v-model="searchTerm" placeholder="Suchbegriff filtern..." class="w-full md:w-20rem" />
      <DataTableWrapper 
        :value="filteredSearches" 
        sortField="searches"
        :sortOrder="-1"
      >
        <Column field="term" :header="$t('analytics.search_term')" sortable>
          <template #body="slotProps">
            <Button 
              :label="slotProps.data.term"
              link
              class="p-0"
              @click="navigateToPreview(slotProps.data.term)"
            />
          </template>
        </Column>
        <Column field="searches" :header="$t('analytics.searches')" sortable></Column>
        <Column field="clicks" :header="$t('analytics.clicks')" sortable></Column>
        <Column field="ctr" header="CTR" sortable>
          <template #body="slotProps">
            {{ slotProps.data.ctr }}
          </template>
        </Column>
      </DataTableWrapper>
    </div>
  </template>
</Card>

<Toast />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from '../../store';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import DataTableWrapper from '../../components/shared/DataTableWrapper.vue';
import Papa from 'papaparse';

const store = useStore();
const router = useRouter();
const { t } = useI18n();
const searchTerm = ref('');
const maxDate = new Date();
const selectedPeriod = ref([
  new Date(maxDate.getFullYear(), maxDate.getMonth() - 1, maxDate.getDate()),
  maxDate
]);

// Get current BU from store
const selectedBU = computed(() => store.analytics.selectedBU);

// Update selectedBU when BU changes in header
const handleBUChange = () => {
  window.dispatchEvent(new Event('buChanged'));
};

onMounted(() => {
  window.addEventListener('buChanged', handleBUChange);
});

onUnmounted(() => {
  window.removeEventListener('buChanged', handleBUChange);
});

const filteredSearches = computed(() => {
  let searches = store.analytics.getSearchesByBU('lowClick', selectedBU.value);
  if (searchTerm.value) {
    const searchLower = searchTerm.value.toLowerCase();
    searches = searches.filter(s => s.term.toLowerCase().includes(searchLower));
  }
  return searches;
});

const navigateToPreview = (term) => {
  router.push({
    path: '/dashboard/search-preview',
    query: { term }
  });
};

const exportToCSV = () => {
  const data = filteredSearches.value.map(item => ({
    'Search Term': item.term,
    'Searches': item.searches,
    'Clicks': item.clicks,
    'CTR': item.ctr
  }));

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `low-click-searches-${selectedBU.value}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>