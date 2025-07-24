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
          
          <Column :header="testInfo.groupA.name" headerClass="text-right" bodyClass="text-right">
            <template #body="slotProps">
              <div class="font-medium">
                {{ formatValue(slotProps.data.groupA, slotProps.data.format) }}
              </div>
            </template>
          </Column>
          
          <Column :header="testInfo.groupB.name" headerClass="text-right" bodyClass="text-right">
            <template #body="slotProps">
              <div class="font-medium">
                {{ formatValue(slotProps.data.groupB, slotProps.data.format) }}
              </div>
            </template>
          </Column>
          
          <Column :header="t('technical.ab_test.difference')" headerClass="text-right" bodyClass="text-right">
            <template #body="slotProps">
              <div class="flex align-items-center justify-content-end gap-2">
                <span 
                  :class="getDifferenceClass(slotProps.data.difference, slotProps.data.higherIsBetter)"
                >
                  {{ formatDifference(slotProps.data.difference, slotProps.data.format) }}
                </span>
                <i 
                  :class="getDifferenceIconClass(slotProps.data.difference, slotProps.data.higherIsBetter)"
                ></i>
              </div>
            </template>
          </Column>
          
          <Column :header="t('technical.ab_test.significance')" headerClass="text-center" bodyClass="text-center">
            <template #body="slotProps">
              <div class="flex align-items-center justify-content-center">
                <Tag 
                  :value="getSignificanceLabel(slotProps.data.p_value)" 
                  :severity="getSignificanceSeverity(slotProps.data.p_value)"
                  class="significance-tag"
                />
              </div>
            </template>
          </Column>
        </DataTable>
        
        <!-- Significance Explanation - German -->
        <div v-if="$i18n.locale === 'DE'" class="significance-explanation p-3 border-round surface-ground mt-4">
          <h4 class="mt-0 mb-2">Was bedeutet statistische Signifikanz?</h4>
          <p class="mb-0">
            Die statistische Signifikanz gibt an, ob ein beobachteter Unterschied zwischen zwei Gruppen wahrscheinlich auf einen echten Effekt zurückzuführen ist oder nur auf Zufall beruht.
            <br><br>
            Ein Ergebnis ist <strong>signifikant</strong>, wenn der p-Wert kleiner als 0.05 ist (p < 0.05). Dies bedeutet, dass die Wahrscheinlichkeit, ein solches oder ein extremeres Ergebnis zufällig zu beobachten, weniger als 5% beträgt.
            <br><br>
            Ein Ergebnis ist <strong>nicht signifikant</strong>, wenn der p-Wert 0.05 oder größer ist (p ≥ 0.05). In diesem Fall ist der beobachtete Unterschied wahrscheinlich auf Zufall zurückzuführen.
          </p>
        </div>
        
        <!-- Significance Explanation - English -->
        <div v-if="$i18n.locale === 'EN'" class="significance-explanation p-3 border-round surface-ground mt-4">
          <h4 class="mt-0 mb-2">What is statistical significance?</h4>
          <p class="mb-0">
            Statistical significance indicates whether an observed difference between two groups is likely due to a real effect or merely due to chance.
            <br><br>
            A result is <strong>significant</strong> if the p-value is less than 0.05 (p < 0.05). This means the probability of observing such a result or a more extreme one by chance is less than 5%.
            <br><br>
            A result is <strong>not significant</strong> if the p-value is 0.05 or greater (p ≥ 0.05). In this case, the observed difference is likely due to chance.
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
import abTestMetrics from '../../data/abTestMetrics.json';

const { t } = useI18n();
const toast = useToast();

// Mock API service
const abTestApi = {
  async getTestInfo() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return abTestMetrics.testInfo;
  },
  
  async getKpiComparisons() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    return abTestMetrics.kpiComparisons;
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
    let formattedValue;
    if (format === 'percentage') {
      formattedValue = (difference * 100).toFixed(2) + '%';
    } else if (format === 'decimal') {
      formattedValue = difference.toFixed(2);
    } else if (format === 'currency') {
      formattedValue = difference.toFixed(2);
    } else {
      formattedValue = difference.toFixed(2);
    }
    
    return difference > 0 ? '+' + formattedValue : formattedValue;
  }
  return '0.00';
};

const getDifferenceClass = (difference, higherIsBetter) => {
  if (difference === 0) return 'text-500';
  
  if (difference < 0) {
    return 'text-red-500 font-medium';
  } else {
    return 'text-green-500 font-medium';
  }
};

const getDifferenceIconClass = (difference, higherIsBetter) => {
  if (difference === 0) return 'pi pi-minus text-500';
  
  if (difference < 0) {
    return 'pi pi-arrow-down text-red-500';
  } else {
    return 'pi pi-arrow-up text-green-500';
  }
};

const getSignificanceLabel = (p_value) => {
  if (p_value < 0.05) {
    return t('technical.ab_test.metrics.significant');
  } else {
    return t('technical.ab_test.metrics.not_significant');
  }
};

const getSignificanceSeverity = (p_value) => {
  if (p_value < 0.05) {
    return 'success';
  } else {
    return 'secondary';
  }
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

/* Modern table styling */
:deep(.p-datatable .p-datatable-tbody > tr) {
  transition: background-color 0.2s ease;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: var(--surface-hover) !important;
}

:deep(.p-datatable .p-datatable-tbody > tr:nth-child(even)) {
  background-color: rgba(var(--primary-color-rgb), 0.02);
}

:deep(.p-datatable .p-datatable-tbody > tr:nth-child(even):hover) {
  background-color: var(--surface-hover) !important;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  padding: 1rem 0.75rem !important;
  font-weight: 600 !important;
  font-size: 0.875rem !important;
  border-bottom: 2px solid var(--surface-border) !important;
  border-left: none !important;
  border-right: none !important;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 1rem 0.75rem !important;
  border-left: none !important;
  border-right: none !important;
  border-bottom: 1px solid rgba(var(--surface-border-rgb, 223, 231, 239), 0.3) !important;
}

:deep(.p-datatable .p-datatable-tbody > tr:last-child > td) {
  border-bottom: none !important;
}

.significance-tag {
  min-width: 6rem !important;
  text-align: center !important;
  font-weight: 500 !important;
}

/* Improved spacing for difference column */
:deep(.p-datatable .p-datatable-tbody .text-right) {
  font-variant-numeric: tabular-nums;
}
</style>