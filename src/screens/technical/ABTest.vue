<template>
  <div class="ab-test-container">
    <CardWrapper :title="t('technical.ab_test.title')">
      <div class="surface-card p-4 border-round mb-4">
        <div class="grid">
          <!-- Test Information Section -->
          <div class="col-12 lg:col-4">
            <div class="test-info-card p-3 border-round surface-ground">
              <h3 class="mt-0 mb-3">{{ t('technical.ab_test.test_info') }}</h3>
              <div class="flex flex-column gap-2">
                <div class="flex justify-content-between">
                  <span class="font-medium">{{ t('technical.ab_test.active_since') }}:</span>
                  <span>{{ testInfo.activeSince }}</span>
                </div>
                <div class="flex justify-content-between">
                  <span class="font-medium">{{ t('technical.ab_test.test_code') }}:</span>
                  <span>{{ testInfo.testCode }}</span>
                </div>
                <div class="flex justify-content-between">
                  <span class="font-medium">{{ t('technical.ab_test.distribution') }}:</span>
                  <span>{{ testInfo.distribution }}</span>
                </div>
                <Divider />
                <div class="flex justify-content-between">
                  <span class="font-medium">{{ t('technical.ab_test.total_sessions') }}:</span>
                  <span>{{ testInfo.totalSessions.toLocaleString() }}</span>
                </div>
                <div class="flex justify-content-between">
                  <span class="font-medium">{{ t('technical.ab_test.total_interactions') }}:</span>
                  <span>{{ testInfo.totalInteractions.toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Test Groups Section -->
          <div class="col-12 lg:col-8">
            <div class="test-groups-card p-3 border-round surface-ground">
              <h3 class="mt-0 mb-3">{{ t('technical.ab_test.test_groups') }}</h3>
              <div class="flex justify-content-between">
                <div class="group-card text-center p-3 border-round surface-card">
                  <h4 class="mt-0 mb-2">{{ testInfo.groupA.name }}</h4>
                  <div class="text-sm text-500">{{ t('technical.ab_test.control_group') }}</div>
                  <div class="text-lg font-medium mt-2">{{ testInfo.groupA.sessions.toLocaleString() }}</div>
                  <div class="text-sm text-500">{{ t('technical.ab_test.sessions') }}</div>
                </div>
                <div class="group-card text-center p-3 border-round surface-card">
                  <h4 class="mt-0 mb-2">{{ testInfo.groupB.name }}</h4>
                  <div class="text-sm text-500">{{ t('technical.ab_test.test_group') }}</div>
                  <div class="text-lg font-medium mt-2">{{ testInfo.groupB.sessions.toLocaleString() }}</div>
                  <div class="text-sm text-500">{{ t('technical.ab_test.sessions') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- KPI Comparison Section -->
      <div class="surface-card p-4 border-round">
        <h3 class="mt-0 mb-4">{{ t('technical.ab_test.kpi_comparison') }}</h3>
        
        <DataTable :value="kpiComparisons" class="p-datatable-sm" responsiveLayout="scroll">
          <Column field="name" :header="t('technical.ab_test.metric')" frozen>
            <template #body="slotProps">
              <div class="flex align-items-center">
                <span class="font-medium">{{ t(`technical.ab_test.metrics.${slotProps.data.id}`) || slotProps.data.name }}</span>
                <i 
                  v-if="slotProps.data.info" 
                  class="pi pi-info-circle ml-2 text-500 cursor-pointer"
                  v-tooltip="slotProps.data.info"
                ></i>
              </div>
            </template>
          </Column>
          
          <Column :header="testInfo.groupA.name">
            <template #body="slotProps">
              <div class="text-right">
                {{ formatValue(slotProps.data.groupA, slotProps.data.format) }}
              </div>
            </template>
          </Column>
          
          <Column :header="testInfo.groupB.name">
            <template #body="slotProps">
              <div class="text-right">
                {{ formatValue(slotProps.data.groupB, slotProps.data.format) }}
              </div>
            </template>
          </Column>
          
          <Column :header="t('technical.ab_test.difference')">
            <template #body="slotProps">
              <div class="flex align-items-center justify-content-end">
                <span 
                  :class="getDifferenceClass(slotProps.data.difference, slotProps.data.higherIsBetter)"
                >
                  {{ formatDifference(slotProps.data.difference, slotProps.data.format) }}
                </span>
                <i 
                  :class="getDifferenceIconClass(slotProps.data.difference, slotProps.data.higherIsBetter)"
                  class="ml-2"
                ></i>
              </div>
            </template>
          </Column>
          
          <Column :header="t('technical.ab_test.significance')">
            <template #body="slotProps">
              <div class="flex align-items-center justify-content-end">
                <Tag 
                  :value="getSignificanceLabel(slotProps.data.significance)" 
                  :severity="getSignificanceSeverity(slotProps.data.significance)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
        
        <!-- Significance Explanation -->
        <div class="significance-explanation p-3 border-round surface-ground mt-4">
          <h4 class="mt-0 mb-2">Was bedeutet statistische Signifikanz?</h4>
          <p class="mb-2">
            Die statistische Signifikanz gibt an, wie zuverlässig die beobachteten Unterschiede zwischen den Testgruppen sind und ob sie wahrscheinlich auf echte Verbesserungen zurückzuführen sind oder nur auf Zufall.
          </p>
          <ul class="mb-2 pl-3">
            <li><strong>p &lt; 0.01</strong>: Sehr hohe Signifikanz (99% Vertrauen) - Der Unterschied ist mit sehr hoher Wahrscheinlichkeit real und nicht zufällig.</li>
            <li><strong>p &lt; 0.05</strong>: Hohe Signifikanz (95% Vertrauen) - Der Unterschied ist wahrscheinlich real.</li>
            <li><strong>p &lt; 0.10</strong>: Moderate Signifikanz (90% Vertrauen) - Der Unterschied könnte real sein, aber es besteht eine höhere Unsicherheit.</li>
            <li><strong>p &gt; 0.10</strong>: Geringe Signifikanz - Der Unterschied könnte auf Zufall beruhen.</li>
          </ul>
          <p class="mb-0">
            Die Signifikanz wird berechnet, indem die Verteilung der Daten in beiden Gruppen verglichen wird. Je größer der Unterschied und je größer die Stichprobe, desto höher ist in der Regel die Signifikanz. Für geschäftliche Entscheidungen empfehlen wir, auf Ergebnisse mit mindestens 95% Signifikanz (p &lt; 0.05) zu vertrauen.
          </p>
        </div>
      </div>
    </CardWrapper>
    
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import CardWrapper from '../../components/shared/CardWrapper.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Divider from 'primevue/divider';
import Toast from 'primevue/toast';

const { t } = useI18n();
const toast = useToast();

// Mock API service
const abTestApi = {
  async getTestInfo() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      activeSince: '2025-03-15',
      testCode: 'search-v2-vs-search25',
      distribution: '50:50',
      totalSessions: 124568,
      totalInteractions: 356921,
      groupA: {
        name: 'Search V2',
        sessions: 62284
      },
      groupB: {
        name: 'Search25',
        sessions: 62284
      }
    };
  },
  
  async getKpiComparisons() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return [
      {
        id: 'ctr',
        name: 'CTR',
        info: 'Click-Through Rate: Percentage of searches that result in a click',
        groupA: 0.235,
        groupB: 0.287,
        difference: 0.052,
        format: 'percentage',
        higherIsBetter: true,
        significance: 0.98
      },
      {
        id: 'cr',
        name: 'CR',
        info: 'Conversion Rate: Percentage of searches that result in a purchase',
        groupA: 0.042,
        groupB: 0.051,
        difference: 0.009,
        format: 'percentage',
        higherIsBetter: true,
        significance: 0.94
      },
      {
        id: 'search_sessions',
        name: 'Suchsessions',
        info: 'Number of search sessions',
        groupA: 62284,
        groupB: 62284,
        difference: 0,
        format: 'number',
        higherIsBetter: true,
        significance: 0
      },
      {
        id: 'cart_additions',
        name: 'add2cart',
        info: 'Number of items added to cart from search results',
        groupA: 3737,
        groupB: 4172,
        difference: 435,
        format: 'number',
        higherIsBetter: true,
        significance: 0.97
      },
      {
        id: 'revenue',
        name: 'Revenue',
        info: 'Total revenue generated from search sessions',
        groupA: 187432.56,
        groupB: 224919.07,
        difference: 37486.51,
        format: 'currency',
        higherIsBetter: true,
        significance: 0.99
      },
      {
        id: 'mrr',
        name: 'MRR',
        info: 'Mean Reciprocal Rank: Measures how high the first relevant result appears',
        groupA: 0.78,
        groupB: 0.85,
        difference: 0.07,
        format: 'decimal',
        higherIsBetter: true,
        significance: 0.96
      },
      {
        id: 'ndcg',
        name: 'NDCG',
        info: 'Normalized Discounted Cumulative Gain: Measures ranking quality',
        groupA: 0.82,
        groupB: 0.91,
        difference: 0.09,
        format: 'decimal',
        higherIsBetter: true,
        significance: 0.99
      }
    ];
  }
};

// State
const testInfo = ref({
  activeSince: '',
  testCode: '',
  distribution: '',
  totalSessions: 0,
  totalInteractions: 0,
  groupA: { name: '', sessions: 0 },
  groupB: { name: '', sessions: 0 }
});

const kpiComparisons = ref([]);
const loading = ref(true);

// Formatters
const formatValue = (value, format) => {
  switch (format) {
    case 'percentage':
      return (value * 100).toFixed(1) + '%';
    case 'decimal':
      return value.toFixed(2);
    case 'currency':
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
    case 'number':
      return value.toLocaleString();
    default:
      return value;
  }
};

const formatDifference = (difference, format) => {
  if (typeof difference === 'number') {
    if (Math.abs(difference) < 0.001) {
      return '0.000';
    }
    
    if (format === 'percentage' || format === 'decimal') {
      // For small decimal differences (like CTR, CR)
      const formattedValue = (difference * 100).toFixed(3) + '%';
      return difference > 0 ? '+' + formattedValue : formattedValue;
    } else if (format === 'currency' || format === 'number') {
      // For larger differences (like revenue)
      const formattedValue = difference.toFixed(3);
      return difference > 0 ? '+' + formattedValue : formattedValue;
    }
  }
  return '0.000';
};

const getDifferenceClass = (difference, higherIsBetter) => {
  if (Math.abs(difference) < 0.001) return 'text-500'; // No significant difference
  
  const isPositive = difference > 0;
  const isGood = (isPositive && higherIsBetter) || (!isPositive && !higherIsBetter);
  
  return isGood ? 'text-green-500 font-medium' : 'text-red-500 font-medium';
};

const getDifferenceIconClass = (difference, higherIsBetter) => {
  if (Math.abs(difference) < 0.001) return 'pi pi-minus text-500'; // No significant difference
  
  const isPositive = difference > 0;
  const isGood = (isPositive && higherIsBetter) || (!isPositive && !higherIsBetter);
  
  return isGood ? 'pi pi-arrow-up text-green-500' : 'pi pi-arrow-down text-red-500';
};

const getSignificanceLabel = (significance) => {
  if (significance >= 0.99) return 'p < 0.01';
  if (significance >= 0.95) return 'p < 0.05';
  if (significance >= 0.90) return 'p < 0.10';
  if (significance > 0) return 'p > 0.10';
  return 'N/A';
};

const getSignificanceSeverity = (significance) => {
  if (significance >= 0.99) return 'success';
  if (significance >= 0.95) return 'info';
  if (significance >= 0.90) return 'warning';
  return 'secondary';
};

// Load data
const loadData = async () => {
  loading.value = true;
  
  try {
    // Load test info
    testInfo.value = await abTestApi.getTestInfo();
    
    // Load KPI comparisons
    kpiComparisons.value = await abTestApi.getKpiComparisons();
  } catch (error) {
    console.error('Error loading A/B test data:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load A/B test data',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

// Initialize
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.ab-test-container {
  padding: 1rem;
}

.test-info-card,
.test-groups-card {
  height: 100%;
}

.group-card {
  width: 48%;
  transition: transform 0.2s;
}

.group-card:hover {
  transform: translateY(-2px);
}

:deep(.p-datatable) {
  background-color: var(--surface-card);
  color: var(--text-color);
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: var(--surface-card);
  color: var(--text-color);
  border-color: var(--surface-border);
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  border-color: var(--surface-border);
}

:deep(.p-tag) {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

.significance-explanation {
  font-size: 0.9rem;
  line-height: 1.5;
}

.significance-explanation ul {
  margin: 0;
}

.significance-explanation li {
  margin-bottom: 0.5rem;
}
</style>