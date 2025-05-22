<template>
<div class="grid">
  <div class="col-12">
    <Card>
      <template #title>
        <div class="flex align-items-center justify-content-between w-full pl-3">
          <span class="text-base font-semibold">{{ $t('analytics.dashboard') }}</span>
          <Calendar v-model="selectedPeriod" selectionMode="range" :showIcon="true" :maxDate="maxDate" class="w-20rem text-xs" />
        </div>
      </template>
      <template #content>
        <div class="grid">
          <!-- Metrics Cards -->
          <div class="col-12 md:col-6 lg:col-3">
            <div class="surface-card p-3 border-round shadow-2">
              <div class="flex justify-content-between mb-2">
                <div>
                  <span class="block text-500 text-xs mb-2">CTR</span>
                  <div class="text-900 text-base">{{ metrics.ctr?.toFixed(1) }}%</div>
                </div>
                <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width:2rem;height:2rem">
                  <i class="pi pi-percentage text-blue-500 text-base"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 md:col-6 lg:col-3">
            <div class="surface-card p-3 border-round shadow-2">
              <div class="flex justify-content-between mb-2">
                <div>
                  <span class="block text-500 text-xs mb-2">{{ $t('analytics.conversion_rate') }}</span>
                  <div class="text-900 text-base">{{ metrics.conversionRate?.toFixed(1) }}%</div>
                </div>
                <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width:2rem;height:2rem">
                  <i class="pi pi-chart-line text-green-500 text-base"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 md:col-6 lg:col-3">
            <div class="surface-card p-3 border-round shadow-2">
              <div class="flex justify-content-between mb-2">
                <div>
                  <span class="block text-500 text-xs mb-2">{{ $t('analytics.total_searches') }}</span>
                  <div class="text-900 text-base">{{ metrics.totalSearches?.toLocaleString() }}</div>
                </div>
                <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width:2rem;height:2rem">
                  <i class="pi pi-search text-orange-500 text-base"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 md:col-6 lg:col-3">
            <div class="surface-card p-3 border-round shadow-2">
              <div class="flex justify-content-between mb-2">
                <div>
                  <span class="block text-500 text-xs mb-2">{{ $t('analytics.no_results_rate') }}</span>
                  <div class="text-900 text-base">{{ metrics.noResultsRate?.toFixed(1) }}%</div>
                </div>
                <div class="flex align-items-center justify-content-center bg-red-100 border-round" style="width:2rem;height:2rem">
                  <i class="pi pi-times-circle text-red-500 text-base"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Trend Charts -->
          <div class="col-12">
            <div class="flex align-items-center gap-3 mb-3">
              <span class="font-medium text-sm">Metrics:</span>
              <div class="flex gap-2">
                <div class="filter-value">
                  <input
                    type="checkbox"
                    id="ctr"
                    v-model="selectedMetrics"
                    value="ctr"
                    class="checkbox"
                  />
                  <label for="ctr" class="text-xs">CTR</label>
                </div>
              </div>
              <div class="flex gap-2">
                <div class="filter-value">
                  <input
                    type="checkbox"
                    id="conversionRate"
                    v-model="selectedMetrics"
                    value="conversionRate"
                    class="checkbox"
                  />
                  <label for="conversionRate" class="text-xs">Conversion Rate</label>
                </div>
              </div>
              <div class="flex gap-2">
                <div class="filter-value">
                  <input
                    type="checkbox"
                    id="mrr"
                    v-model="selectedMetrics"
                    value="mrr"
                    class="checkbox"
                  />
                  <label for="mrr" class="text-xs">MRR</label>
                </div>
              </div>
              <div class="flex gap-2">
                <div class="filter-value">
                  <input
                    type="checkbox"
                    id="ndcg"
                    v-model="selectedMetrics"
                    value="ndcg"
                    class="checkbox"
                  />
                  <label for="ndcg" class="text-xs">NDCG</label>
                </div>
              </div>
              <div class="flex gap-2">
                <div class="filter-value">
                  <input
                    type="checkbox"
                    id="searchTerms"
                    v-model="selectedMetrics"
                    value="searchTerms"
                    class="checkbox"
                  />
                  <label for="searchTerms" class="text-xs">Search Terms Count</label>
                </div>
              </div>
              <div class="flex gap-2">
                <div class="filter-value">
                  <input
                    type="checkbox"
                    id="rankedTerms"
                    v-model="selectedMetrics"
                    value="rankedTerms"
                    class="checkbox"
                  />
                  <label for="rankedTerms" class="text-xs">Ranked Terms %</label>
                </div>
              </div>
            </div>
            <Chart type="line" :data="trendData" :options="lineOptions" class="h-20rem" />
          </div>

          <!-- Tables -->
          <div class="col-12">
            <div class="grid">
              <div class="col-12 lg:col-4">
                <div class="text-sm font-medium mb-2">{{ $t('analytics.no_result_searches') }}</div>
                <DataTable :value="filteredNoResultSearches.slice(0, 20)" class="p-datatable-sm" scrollable scrollHeight="400px">
                  <Column field="term" :header="$t('analytics.search_term')" headerClass="text-xs compact-header" bodyClass="text-xs compact-cell" frozen></Column>
                  <Column field="searches" :header="$t('analytics.searches')" headerClass="text-xs compact-header" bodyClass="text-xs text-right compact-cell"></Column>
                </DataTable>
                <div class="flex justify-content-end mt-2">
                  <Button :label="$t('analytics.view_all')" link @click="router.push('/dashboard/analytics/no-results')" class="text-xs" />
                </div>
              </div>

              <div class="col-12 lg:col-4">
                <div class="text-sm font-medium mb-2">{{ $t('analytics.low_click_searches') }}</div>
                <DataTable :value="filteredLowClickSearches.slice(0, 20)" class="p-datatable-sm" scrollable scrollHeight="400px">
                  <Column field="term" :header="$t('analytics.search_term')" headerClass="text-xs compact-header" bodyClass="text-xs compact-cell" frozen></Column>
                  <Column field="searches" :header="$t('analytics.searches')" headerClass="text-xs compact-header" bodyClass="text-xs text-right compact-cell"></Column>
                  <Column field="clicks" :header="$t('analytics.clicks')" headerClass="text-xs compact-header" bodyClass="text-xs text-right compact-cell"></Column>
                  <Column field="ctr" header="CTR" headerClass="text-xs compact-header" bodyClass="text-xs text-right compact-cell"></Column>
                </DataTable>
                <div class="flex justify-content-end mt-2">
                  <Button :label="$t('analytics.view_all')" link @click="router.push('/dashboard/analytics/low-clicks')" class="text-xs" />
                </div>
              </div>

              <div class="col-12 lg:col-4">
                <div class="text-sm font-medium mb-2">{{ $t('analytics.top_clicked_searches') }}</div>
                <DataTable :value="filteredTopClickedSearches.slice(0, 20)" class="p-datatable-sm" scrollable scrollHeight="400px">
                  <Column field="term" :header="$t('analytics.search_term')" headerClass="text-xs compact-header" bodyClass="text-xs compact-cell" frozen></Column>
                  <Column field="searches" :header="$t('analytics.searches')" headerClass="text-xs compact-header" bodyClass="text-xs text-right compact-cell"></Column>
                  <Column field="clicks" :header="$t('analytics.clicks')" headerClass="text-xs compact-header" bodyClass="text-xs text-right compact-cell"></Column>
                  <Column field="ctr" header="CTR" headerClass="text-xs compact-header" bodyClass="text-xs text-right compact-cell"></Column>
                  <Column field="position" :header="$t('analytics.position')" headerClass="text-xs compact-header" bodyClass="text-xs text-right compact-cell">
                    <template #body="slotProps">
                      {{ slotProps.data.position?.toFixed(1) }}
                    </template>
                  </Column>
                </DataTable>
                <div class="flex justify-content-end mt-2">
                  <Button :label="$t('analytics.view_all')" link @click="router.push('/dashboard/analytics/top-clicked')" class="text-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useStore } from '../../store';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';

const router = useRouter();
const { t } = useI18n();
const store = useStore();

// Date range selection
const maxDate = new Date();
const selectedPeriod = ref([
  new Date(maxDate.getFullYear(), maxDate.getMonth() - 1, maxDate.getDate()),
  maxDate
]);

// Get current BU from store
const selectedBU = computed(() => store.analytics.selectedBU);

// Initialize metrics with current BU data
const metrics = ref(store.analytics.getMetricsByBU(selectedBU.value));

// Watch for BU changes and update metrics
watch(selectedBU, (newBU) => {
  metrics.value = store.analytics.getMetricsByBU(newBU);
}, { immediate: true });

// Initialize selectedMetrics with CTR and Conversion Rate by default
const selectedMetrics = ref(['ctr', 'conversionRate']);

// Update selectedBU when BU changes in header
const handleBUChange = () => {
  metrics.value = store.analytics.getMetricsByBU(selectedBU.value);
};

onMounted(() => {
  window.addEventListener('buChanged', handleBUChange);
});

onUnmounted(() => {
  window.removeEventListener('buChanged', handleBUChange);
});

// Line Chart Data
const trendData = computed(() => {
  if (!selectedPeriod.value?.[0] || !selectedPeriod.value?.[1]) return { labels: [], datasets: [] };
  
  const data = store.analytics.getDailyData(selectedPeriod.value[0], selectedPeriod.value[1]);
  
  const datasets = [];
  
  if (selectedMetrics.value.includes('ctr')) {
    datasets.push({
      label: 'CTR',
      data: data.map(d => d.ctr),
      borderColor: '#42A5F5',
      tension: 0.4,
      yAxisID: 'y'
    });
  }
  
  if (selectedMetrics.value.includes('conversionRate')) {
    datasets.push({
      label: 'Conversion Rate',
      data: data.map(d => d.conversionRate),
      borderColor: '#66BB6A',
      tension: 0.4,
      yAxisID: 'y'
    });
  }
  
  if (selectedMetrics.value.includes('mrr')) {
    datasets.push({
      label: 'MRR',
      data: data.map(d => d.mrr),
      borderColor: '#FFA726',
      tension: 0.4,
      yAxisID: 'y1'
    });
  }
  
  if (selectedMetrics.value.includes('ndcg')) {
    datasets.push({
      label: 'NDCG',
      data: data.map(d => d.ndcg),
      borderColor: '#EC407A',
      tension: 0.4,
      yAxisID: 'y1'
    });
  }
  
  if (selectedMetrics.value.includes('searchTerms')) {
    datasets.push({
      label: 'Search Terms',
      data: data.map(d => d.searchTermsCount),
      borderColor: '#AB47BC',
      tension: 0.4,
      yAxisID: 'y2'
    });
  }
  
  if (selectedMetrics.value.includes('rankedTerms')) {
    datasets.push({
      label: 'Ranked Terms %',
      data: data.map(d => d.rankedTermsPercentage),
      borderColor: '#26A69A',
      tension: 0.4,
      yAxisID: 'y'
    });
  }

  return {
    labels: data.map(d => d.date),
    datasets
  };
});

const lineOptions = {
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
  plugins: {
    legend: {
      labels: {
        color: '#495057',
        font: {
          size: 11
        }
      },
      position: 'top'
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          let label = context.dataset.label || '';
          let value = context.parsed.y;
          
          if (context.dataset.yAxisID === 'y1') {
            return `${label}: ${value.toFixed(3)}`;
          } else if (context.dataset.yAxisID === 'y2') {
            return `${label}: ${value.toLocaleString()}`;
          } else {
            return `${label}: ${value.toFixed(1)}%`;
          }
        }
      }
    }
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      min: 0,
      max: 100,
      ticks: {
        color: '#495057',
        font: {
          size: 11
        },
        callback: (value) => `${value}%`
      },
      grid: {
        color: '#ebedef'
      }
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      min: 0,
      max: 1,
      ticks: {
        color: '#495057',
        font: {
          size: 11
        },
        callback: (value) => value.toFixed(2)
      },
      grid: {
        drawOnChartArea: false
      }
    },
    y2: {
      type: 'linear',
      display: true,
      position: 'right',
      ticks: {
        color: '#495057',
        font: {
          size: 11
        }
      },
      grid: {
        drawOnChartArea: false
      }
    },
    x: {
      ticks: {
        color: '#495057',
        font: {
          size: 11
        }
      },
      grid: {
        color: '#ebedef'
      }
    }
  }
};

// Filtered data based on selected BU
const filteredNoResultSearches = computed(() => {
  return store.analytics.getSearchesByBU('noResult', selectedBU.value);
});

const filteredLowClickSearches = computed(() => {
  return store.analytics.getSearchesByBU('lowClick', selectedBU.value);
});

const filteredTopClickedSearches = computed(() => {
  return store.analytics.getSearchesByBU('topClicked', selectedBU.value);
});
</script>

<style scoped>
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
  padding: 0.4rem;
  font-size: 0.7rem;
  font-weight: 600;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.4rem;
  border-color: var(--surface-border);
  font-size: 0.75rem;
}

:deep(.p-datatable .p-datatable-tbody > tr > td.text-right) {
  text-align: right;
}

:deep(.p-calendar) {
  font-size: 0.75rem;
}

:deep(.p-calendar .p-inputtext) {
  padding: 0.3rem 0.6rem;
}

:deep(.p-calendar .p-button) {
  padding: 0.3rem;
}

:deep(.text-xs) {
  font-size: 0.75rem !important;
}

:deep(.text-sm) {
  font-size: 0.875rem !important;
}

:deep(.text-base) {
  font-size: 1rem !important;
}

:deep(.p-datatable .p-datatable-thead > tr > th.compact-header) {
  padding: 0.25rem 0.4rem;
  font-size: 0.7rem;
  font-weight: 600;
}

:deep(.p-datatable .p-datatable-tbody > tr > td.compact-cell) {
  padding: 0.25rem 0.4rem;
  font-size: 0.75rem;
}

.filter-value {
  margin-bottom: 0.5rem;
}

.filter-value label {
  cursor: pointer;
  color: var(--text-color);
}

.checkbox {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
  cursor: pointer;
  accent-color: var(--primary-color);
}
</style>