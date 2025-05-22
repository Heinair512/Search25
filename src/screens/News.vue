<template>
  <div class="news-container">
    <CardWrapper :title="t('news_board.title')">
      <div class="welcome-message mb-4">{{ t('news_board.welcome', { name: userName }) }}</div>
      
      <div class="grid">
        <!-- Search Usage Metric -->
        <div v-if="store.features.isAdvancedMode" class="col-12 md:col-3">
          <div class="metric-card">
            <div 
              :class="['metric-content', searchTrendColor, 'cursor-pointer']"
              @click="router.push('/dashboard/analytics')"
            >
              <div class="metric-icon">
                <i :class="['pi', searchTrend > 0 ? 'pi-arrow-up' : 'pi-arrow-down', searchTrendIconColor]"></i>
              </div>
              <div class="metric-text">{{ searchUsageText }}</div>
              <div class="metric-action">{{ t('news_board.view_analytics') }}</div>
            </div>
          </div>
        </div>

        <!-- CTR Metric -->
        <div v-if="store.features.isAdvancedMode" class="col-12 md:col-3">
          <div class="metric-card">
            <div 
              class="metric-content bg-red-50 cursor-pointer"
              @click="router.push('/dashboard/analytics')"
            >
              <div class="metric-icon">
                <i class="pi pi-arrow-down text-red-500"></i>
              </div>
              <div class="metric-text">{{ ctrText }}</div>
              <div class="metric-action">{{ t('news_board.view_details') }}</div>
            </div>
          </div>
        </div>

        <!-- Zero Results Metric -->
        <div v-if="store.features.isAdvancedMode" class="col-12 md:col-3">
          <div class="metric-card">
            <div 
              class="metric-content bg-green-50 cursor-pointer"
              @click="router.push('/dashboard/analytics/no-results')"
            >
              <div class="metric-icon">
                <i class="pi pi-arrow-down text-green-500"></i>
              </div>
              <div class="metric-text">{{ zeroResultsText }}</div>
              <div class="metric-action">{{ t('news_board.review_now') }}</div>
            </div>
          </div>
        </div>

        <!-- Top Search Term -->
        <div v-if="store.features.isAdvancedMode" class="col-12 md:col-3">
          <div class="metric-card">
            <div 
              class="metric-content bg-primary cursor-pointer"
              @click="router.push('/dashboard/analytics/top-clicked')"
            >
              <div class="metric-icon">
                <i class="pi pi-search text-white"></i>
              </div>
              <div class="metric-text text-white">{{ topSearchText }}</div>
              <div class="metric-action text-white">{{ t('news_board.view_details') }}</div>
            </div>
          </div>
        </div>

        <!-- Relevance Metrics Section -->
        <div class="col-12">
          <div class="surface-card p-4 border-round mt-4">
            <h3 class="mb-4">{{ t('news_board.relevance.title') }}</h3>
            <div class="grid">
              <!-- Chart -->
              <div class="col-12 md:col-8">
                <Chart type="scatter" :data="relevanceData" :options="scatterOptions" class="h-30rem" />
              </div>
              
              <!-- Additional Metrics -->
              <div class="col-12 md:col-4">
                <div class="flex flex-column gap-4">
                  <div class="metric-box p-4 border-round surface-ground">
                    <div class="text-lg font-medium mb-2">{{ t('news_board.relevance.reranking_terms') }}</div>
                    <div class="text-2xl font-bold">13 491</div>
                    <div class="text-sm text-500">{{ metrics.rankedTermsPercentage.toFixed(1) }}% {{ t('news_board.relevance.ranked_terms') }}</div>
                  </div>
                  
                  <div class="metric-box p-4 border-round surface-ground">
                    <div class="text-lg font-medium mb-2">{{ t('news_board.relevance.current_metrics') }}</div>
                    <div class="flex align-items-center gap-4">
                      <div>
                        <span class="block text-sm">MRR</span>
                        <span class="text-xl font-bold">0.847</span>
                      </div>
                      <div>
                        <span class="block text-sm">NDCG</span>
                        <span class="text-xl font-bold">0.912</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="metric-box p-4 border-round surface-ground">
                    <div class="text-lg font-medium mb-2">{{ t('news_board.relevance.click_position') }}</div>
                    <div class="flex flex-column gap-2">
                      <div>
                        <span class="block text-sm">{{ t('news_board.relevance.current') }}</span>
                        <span class="text-xl font-bold">2.4</span>
                      </div>
                      <div>
                        <span class="block text-sm">{{ t('news_board.relevance.previous_week') }}</span>
                        <span class="text-xl font-bold">2.8</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardWrapper>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '../store';
import { useI18n } from 'vue-i18n';
import CardWrapper from '../components/shared/CardWrapper.vue';
import Button from 'primevue/button';
import Chart from 'primevue/chart';

const router = useRouter();
const store = useStore();
const { t } = useI18n();

// Get user name from store
const userName = computed(() => store.auth.currentUser?.name?.split(' ')[0] || 'User');

// Initialize metrics with default values
const searchTrend = ref(15);
const ctrTrend = ref(-5);
const zeroResultsTrend = ref(-8);
const topSearchTerm = ref('hammer');
const metrics = ref({
  rankedTermsPercentage: 75.8
});

// Computed styles for trend indicators
const searchTrendColor = computed(() => 
  searchTrend.value > 0 ? 'bg-green-50' : 'bg-red-50'
);

const searchTrendIconColor = computed(() => 
  searchTrend.value > 0 ? 'text-green-500' : 'text-red-500'
);

// Computed text for metrics using translations
const ctrText = computed(() => 
  t('news_board.metrics.ctr_decrease', { value: Math.abs(ctrTrend.value) })
);

const zeroResultsText = computed(() => 
  t('news_board.metrics.zero_results_decrease', { value: Math.abs(zeroResultsTrend.value) })
);

const topSearchText = computed(() => 
  t('news_board.metrics.top_search', { term: topSearchTerm.value })
);

const searchUsageText = computed(() => 
  t('news_board.metrics.search_increase', { value: searchTrend.value })
);

// Scatter plot data
const relevanceData = {
  datasets: [
    {
      label: 'CTR 0.2',
      data: generateScatterData(0.2, 500),
      backgroundColor: 'rgba(103, 71, 183, 0.6)',
      pointRadius: 4
    },
    {
      label: 'CTR 0.4',
      data: generateScatterData(0.4, 400),
      backgroundColor: 'rgba(72, 146, 175, 0.6)',
      pointRadius: 4
    },
    {
      label: 'CTR 0.6',
      data: generateScatterData(0.6, 300),
      backgroundColor: 'rgba(85, 174, 128, 0.6)',
      pointRadius: 4
    },
    {
      label: 'CTR 0.8',
      data: generateScatterData(0.8, 200),
      backgroundColor: 'rgba(156, 204, 89, 0.6)',
      pointRadius: 4
    },
    {
      label: 'CTR 1.0',
      data: generateScatterData(1.0, 100),
      backgroundColor: 'rgba(241, 196, 15, 0.6)',
      pointRadius: 4
    }
  ]
};

const scatterOptions = {
  scales: {
    x: {
      type: 'logarithmic',
      position: 'bottom',
      title: {
        display: true,
        text: 'Impressions'
      },
      min: 10,
      max: 100000
    },
    y: {
      type: 'logarithmic',
      title: {
        display: true,
        text: 'Clicks'
      },
      min: 1,
      max: 10000
    }
  },
  plugins: {
    legend: {
      position: 'right',
      title: {
        display: true,
        text: 'Click-Through-Rate'
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const impressions = context.parsed.x;
          const clicks = context.parsed.y;
          const ctr = ((clicks / impressions) * 100).toFixed(1);
          return `Impressions: ${impressions}, Clicks: ${clicks}, CTR: ${ctr}%`;
        }
      }
    }
  },
  aspectRatio: false,
  maintainAspectRatio: false
};

function generateScatterData(targetCtr, count) {
  const data = [];
  const distributions = [
    { weight: 0.4, range: [10, 100] },
    { weight: 0.3, range: [101, 1000] },
    { weight: 0.2, range: [1001, 10000] },
    { weight: 0.1, range: [10001, 100000] }
  ];

  for (let i = 0; i < count; i++) {
    // Select impression range based on distribution weights
    const rand = Math.random();
    let cumWeight = 0;
    const distribution = distributions.find(d => {
      cumWeight += d.weight;
      return rand <= cumWeight;
    });

    // Generate impressions within selected range
    const [min, max] = distribution.range;
    const impressions = Math.floor(Math.random() * (max - min + 1)) + min;

    // Calculate clicks with noise
    const perfectClicks = impressions * targetCtr;
    const noiseRange = perfectClicks * 0.3; // 30% noise
    const noise = (Math.random() - 0.5) * noiseRange;
    const clicks = Math.max(1, Math.floor(perfectClicks + noise));

    data.push({
      x: impressions,
      y: clicks
    });
  }

  return data;
}

const updateMetrics = () => {
  const selectedBU = store.analytics.selectedBU;
  if (!selectedBU) {
    const currentUser = store.auth.currentUser;
    if (currentUser?.bu?.length > 0) {
      store.analytics.setSelectedBU(currentUser.bu[0]);
    }
    return;
  }

  const buMetrics = store.analytics.getMetricsByBU(selectedBU);
  if (buMetrics) {
    searchTrend.value = Math.round((buMetrics.totalSearches / 1000 - 1) * 100);
    ctrTrend.value = Math.round((buMetrics.ctr / 20 - 1) * 100);
    zeroResultsTrend.value = Math.round((buMetrics.noResultsRate / 5 - 1) * 100);
    metrics.value.rankedTermsPercentage = buMetrics.rankedTermsPercentage;
  }

  const topSearches = store.analytics.getSearchesByBU('topClicked', selectedBU);
  if (topSearches?.value && topSearches.value.length > 0) {
    topSearchTerm.value = topSearches.value[0].term;
  }
};

// Define handleBUChange function
const handleBUChange = () => {
  updateMetrics();
};

// Watch for BU changes
watch(() => store.analytics.selectedBU, () => {
  updateMetrics();
});

onMounted(() => {
  updateMetrics();
  window.addEventListener('buChanged', handleBUChange);
});

onUnmounted(() => {
  window.removeEventListener('buChanged', handleBUChange);
});
</script>

<style scoped>
.news-container {
  padding: 1rem;
}

.welcome-message {
  font-size: 1.25rem;
  line-height: 1.75rem;
  color: var(--text-color);
  font-weight: 500;
}

.metric-card {
  height: 100%;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.2s;
}

.metric-card:hover {
  transform: translateY(-2px);
}

.metric-content {
  height: 100%;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--surface-border);
  transition: all 0.2s ease;
}

.metric-content:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.bg-primary {
  background-color: var(--primary-color);
}

.metric-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.metric-text {
  color: var(--text-color);
  font-size: 0.875rem;
  line-height: 1.25rem;
  flex-grow: 1;
}

.metric-action {
  color: inherit;
  font-size: 0.875rem;
  text-decoration: none;
}

.text-white {
  color: white !important;
}

.metric-box {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  transition: transform 0.2s;
}

.metric-box:hover {
  transform: translateY(-2px);
}

/* Dark theme adjustments */
:deep(.dark) .metric-content {
  border-color: var(--surface-border);
}

:deep(.dark) .bg-green-50 {
  background-color: rgba(0, 200, 83, 0.15);
}

:deep(.dark) .bg-red-50 {
  background-color: rgba(255, 77, 79, 0.15);
}

:deep(.dark) .text-red-500 {
  color: #ff4d4f;
}

:deep(.dark) .text-green-500 {
  color: #00c853;
}

:deep(.dark) .metric-text {
  color: var(--text-color);
}
</style>