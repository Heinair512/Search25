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
                <span class="font-medium">{{ slotProps.data.name }}</span>
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
                  {{ formatDifference(slotProps.data.difference) }}
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
      </div>
      
      <!-- Charts Section -->
      <div class="surface-card p-4 border-round mt-4">
        <h3 class="mt-0 mb-4">{{ t('technical.ab_test.trend_analysis') }}</h3>
        
        <div class="grid">
          <div class="col-12 lg:col-6 mb-4">
            <div class="chart-container">
              <h4 class="mt-0 mb-3">{{ t('technical.ab_test.ctr_trend') }}</h4>
              <Chart type="line" :data="ctrTrendData" :options="lineChartOptions" />
            </div>
          </div>
          
          <div class="col-12 lg:col-6 mb-4">
            <div class="chart-container">
              <h4 class="mt-0 mb-3">{{ t('technical.ab_test.conversion_trend') }}</h4>
              <Chart type="line" :data="conversionTrendData" :options="lineChartOptions" />
            </div>
          </div>
          
          <div class="col-12 lg:col-6 mb-4">
            <div class="chart-container">
              <h4 class="mt-0 mb-3">{{ t('technical.ab_test.revenue_trend') }}</h4>
              <Chart type="line" :data="revenueTrendData" :options="lineChartOptions" />
            </div>
          </div>
          
          <div class="col-12 lg:col-6 mb-4">
            <div class="chart-container">
              <h4 class="mt-0 mb-3">{{ t('technical.ab_test.relevance_metrics') }}</h4>
              <Chart type="bar" :data="relevanceData" :options="barChartOptions" />
            </div>
          </div>
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
import Chart from 'primevue/chart';
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
        name: 'Search Sessions',
        info: 'Number of search sessions',
        groupA: 62284,
        groupB: 62284,
        difference: 0,
        format: 'number',
        higherIsBetter: true,
        significance: 0
      },
      {
        name: 'Cart Additions',
        info: 'Number of items added to cart from search results',
        groupA: 3737,
        groupB: 4172,
        difference: 435,
        format: 'number',
        higherIsBetter: true,
        significance: 0.97
      },
      {
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
  },
  
  async getTrendData() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Generate dates for the last 14 days
    const dates = Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (13 - i));
      return date.toISOString().split('T')[0];
    });
    
    // Generate CTR trend data
    const ctrTrendData = {
      labels: dates,
      datasets: [
        {
          label: 'Search V2',
          data: dates.map(() => 0.2 + Math.random() * 0.07),
          borderColor: '#64B5F6',
          backgroundColor: 'rgba(100, 181, 246, 0.2)',
          tension: 0.4
        },
        {
          label: 'Search25',
          data: dates.map(() => 0.25 + Math.random() * 0.08),
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          tension: 0.4
        }
      ]
    };
    
    // Generate conversion trend data
    const conversionTrendData = {
      labels: dates,
      datasets: [
        {
          label: 'Search V2',
          data: dates.map(() => 0.035 + Math.random() * 0.015),
          borderColor: '#64B5F6',
          backgroundColor: 'rgba(100, 181, 246, 0.2)',
          tension: 0.4
        },
        {
          label: 'Search25',
          data: dates.map(() => 0.045 + Math.random() * 0.015),
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          tension: 0.4
        }
      ]
    };
    
    // Generate revenue trend data
    const revenueTrendData = {
      labels: dates,
      datasets: [
        {
          label: 'Search V2',
          data: dates.map(() => 12000 + Math.random() * 5000),
          borderColor: '#64B5F6',
          backgroundColor: 'rgba(100, 181, 246, 0.2)',
          tension: 0.4
        },
        {
          label: 'Search25',
          data: dates.map(() => 14000 + Math.random() * 6000),
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          tension: 0.4
        }
      ]
    };
    
    // Generate relevance metrics data
    const relevanceData = {
      labels: ['MRR', 'NDCG'],
      datasets: [
        {
          label: 'Search V2',
          data: [0.78, 0.82],
          backgroundColor: 'rgba(100, 181, 246, 0.7)'
        },
        {
          label: 'Search25',
          data: [0.85, 0.91],
          backgroundColor: 'rgba(76, 175, 80, 0.7)'
        }
      ]
    };
    
    return {
      ctrTrendData,
      conversionTrendData,
      revenueTrendData,
      relevanceData
    };
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

// Chart data
const ctrTrendData = ref({
  labels: [],
  datasets: []
});

const conversionTrendData = ref({
  labels: [],
  datasets: []
});

const revenueTrendData = ref({
  labels: [],
  datasets: []
});

const relevanceData = ref({
  labels: [],
  datasets: []
});

// Chart options
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    x: {
      ticks: {
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: 7
      }
    },
    y: {
      beginAtZero: false
    }
  }
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 1
    }
  }
};

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

const formatDifference = (difference) => {
  if (typeof difference === 'number') {
    if (Math.abs(difference) < 0.01) {
      return '0.0%';
    }
    
    if (difference < 1 && difference > -1) {
      // For small decimal differences (like CTR, CR)
      return (difference * 100).toFixed(1) + '%';
    } else {
      // For larger differences (like revenue)
      return difference > 0 ? '+' + difference.toLocaleString() : difference.toLocaleString();
    }
  }
  return '0';
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
    
    // Load trend data
    const trendData = await abTestApi.getTrendData();
    ctrTrendData.value = trendData.ctrTrendData;
    conversionTrendData.value = trendData.conversionTrendData;
    revenueTrendData.value = trendData.revenueTrendData;
    relevanceData.value = trendData.relevanceData;
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

.chart-container {
  height: 300px;
  padding: 1rem;
  background-color: var(--surface-ground);
  border-radius: 6px;
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
</style>