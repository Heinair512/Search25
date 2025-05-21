<template>
  <div class="news-container">
    <CardWrapper :title="t('news_board.title')">
      <div class="welcome-message mb-4">{{ t('news_board.welcome', { name: userName }) }}</div>
      
      <div class="grid">
        <!-- Monthly Search Volume -->
        <div v-if="store.features.isAdvancedMode" class="col-12 md:col-3">
          <div class="metric-card">
            <div :class="['metric-content', searchVolumeTrendColor]">
              <div class="metric-icon">
                <i :class="['pi', searchVolumeTrend > 0 ? 'pi-arrow-up' : 'pi-arrow-down', searchVolumeTrendIconColor]"></i>
              </div>
              <div class="metric-text">
                {{ formatNumber(metrics.currentMonthSearches) }} vs {{ formatNumber(metrics.previousMonthSearches) }}
                <div class="text-sm">{{ searchVolumeChangeText }}</div>
              </div>
              <Button :label="t('news_board.view_analytics')" link class="metric-action" @click="router.push('/dashboard/analytics')" />
            </div>
          </div>
        </div>

        <!-- CTR Metric -->
        <div v-if="store.features.isAdvancedMode" class="col-12 md:col-3">
          <div class="metric-card">
            <div :class="['metric-content', ctrTrendColor]">
              <div class="metric-icon">
                <i :class="['pi', ctrTrend > 0 ? 'pi-arrow-up' : 'pi-arrow-down', ctrTrendIconColor]"></i>
              </div>
              <div class="metric-text">
                {{ metrics.currentWeekCTR?.toFixed(1) }}% vs {{ metrics.previousWeekCTR?.toFixed(1) }}%
                <div class="text-sm">{{ ctrChangeText }}</div>
              </div>
              <Button :label="t('news_board.view_details')" link class="metric-action" @click="router.push('/dashboard/analytics')" />
            </div>
          </div>
        </div>

        <!-- Zero Results Metric -->
        <div v-if="store.features.isAdvancedMode" class="col-12 md:col-3">
          <div class="metric-card">
            <div :class="['metric-content', zeroResultsTrendColor]">
              <div class="metric-icon">
                <i :class="['pi', zeroResultsTrend > 0 ? 'pi-arrow-up' : 'pi-arrow-down', zeroResultsTrendIconColor]"></i>
              </div>
              <div class="metric-text">
                {{ metrics.currentWeekZeroResults?.toFixed(1) }}% vs {{ metrics.previousWeekZeroResults?.toFixed(1) }}%
                <div class="text-sm">{{ zeroResultsChangeText }}</div>
              </div>
              <Button :label="t('news_board.review_now')" link class="metric-action" @click="router.push('/dashboard/analytics/no-results')" />
            </div>
          </div>
        </div>

        <!-- Top Search Term -->
        <div v-if="store.features.isAdvancedMode" class="col-12 md:col-3">
          <div class="metric-card">
            <div class="metric-content bg-primary">
              <div class="metric-icon">
                <i class="pi pi-search text-white"></i>
              </div>
              <div class="metric-text text-white">
                "{{ metrics.topSearchTerm }}"
                <div class="text-sm">({{ formatNumber(metrics.topSearchCount) }} searches)</div>
              </div>
              <Button :label="t('news_board.view_details')" link class="metric-action p-button-text text-white" @click="router.push('/dashboard/analytics/top-clicked')" />
            </div>
          </div>
        </div>

        <!-- Rest of the template remains unchanged -->
        <!-- ... -->
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
const metrics = ref({
  currentMonthSearches: 0,
  previousMonthSearches: 0,
  currentWeekCTR: 0,
  previousWeekCTR: 0,
  currentWeekZeroResults: 0,
  previousWeekZeroResults: 0,
  topSearchTerm: '',
  topSearchCount: 0,
  rankedTermsPercentage: 75.8
});

// Computed values for trends
const searchVolumeTrend = computed(() => 
  ((metrics.value.currentMonthSearches - metrics.value.previousMonthSearches) / metrics.value.previousMonthSearches) * 100
);

const ctrTrend = computed(() => 
  ((metrics.value.currentWeekCTR - metrics.value.previousWeekCTR) / metrics.value.previousWeekCTR) * 100
);

const zeroResultsTrend = computed(() => 
  ((metrics.value.currentWeekZeroResults - metrics.value.previousWeekZeroResults) / metrics.value.previousWeekZeroResults) * 100
);

// Computed styles for trend indicators
const searchVolumeTrendColor = computed(() => 
  searchVolumeTrend.value > 0 ? 'bg-green-50' : 'bg-red-50'
);

const searchVolumeTrendIconColor = computed(() => 
  searchVolumeTrend.value > 0 ? 'text-green-500' : 'text-red-500'
);

const ctrTrendColor = computed(() => 
  ctrTrend.value > 0 ? 'bg-green-50' : 'bg-red-50'
);

const ctrTrendIconColor = computed(() => 
  ctrTrend.value > 0 ? 'text-green-500' : 'text-red-500'
);

const zeroResultsTrendColor = computed(() => 
  zeroResultsTrend.value < 0 ? 'bg-green-50' : 'bg-red-50'
);

const zeroResultsTrendIconColor = computed(() => 
  zeroResultsTrend.value < 0 ? 'text-green-500' : 'text-red-500'
);

// Computed text for changes
const searchVolumeChangeText = computed(() => 
  `${Math.abs(searchVolumeTrend.value).toFixed(1)}% ${searchVolumeTrend.value > 0 ? 'increase' : 'decrease'}`
);

const ctrChangeText = computed(() => 
  `${Math.abs(ctrTrend.value).toFixed(1)}% ${ctrTrend.value > 0 ? 'increase' : 'decrease'}`
);

const zeroResultsChangeText = computed(() => 
  `${Math.abs(zeroResultsTrend.value).toFixed(1)}% ${zeroResultsTrend.value < 0 ? 'decrease' : 'increase'}`
);

// Format large numbers
const formatNumber = (num) => {
  return new Intl.NumberFormat('de-DE').format(num);
};

// Update metrics when BU changes
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
    metrics.value = buMetrics;
  }
};

// Watch for BU changes
watch(() => store.analytics.selectedBU, () => {
  updateMetrics();
});

onMounted(() => {
  updateMetrics();
  window.addEventListener('buChanged', updateMetrics);
});

onUnmounted(() => {
  window.removeEventListener('buChanged', updateMetrics);
});

// Rest of the script setup remains unchanged
// ...
</script>

<style scoped>
/* Existing styles remain unchanged */
</style>