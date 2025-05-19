<template>
  <div
    class="surface-section h-screen shadow-1 p-3 overflow-y-auto relative menu-container"
    :class="[isCollapsed ? 'collapsed' : '']"
  >
    <Button
      icon="pi pi-angle-left"
      text
      rounded
      class="absolute top-0 right-0 m-2 toggle-button"
      :class="{ 'rotate-180': isCollapsed }"
      @click="toggleCollapse"
    />

    <div v-if="!isCollapsed" class="flex flex-column gap-2 mt-4">
      <div class="menu-section">
        <div class="text-lg font-semibold mb-2 text-color uppercase">
          {{ $t('menu.search_preview') }}
        </div>
        <Button
          icon="pi pi-eye"
          :label="$t('menu.search_preview')"
          text
          class="w-full justify-content-start menu-button"
          @click="$router.push('/dashboard/search-preview')"
        />

        <!-- Recent Searches -->
        <div class="mt-3">
          <div class="text-sm font-semibold mb-2">Recent Searches</div>
          <div class="flex flex-column gap-1">
            <Button
              v-for="search in recentSearches"
              :key="search.term"
              :label="search.term"
              text
              class="w-full justify-content-start menu-button text-left"
              @click="navigateToSearch(search.term)"
            >
              <template #icon>
                <i class="pi pi-clock mr-2"></i>
              </template>
            </Button>
          </div>
        </div>

        <!-- Top Clicked Terms -->
        <div class="mt-3">
          <div class="text-sm font-semibold mb-2">Most Clicked Terms</div>
          <div class="flex flex-column gap-1">
            <Button
              v-for="term in topClickedTerms"
              :key="term.term"
              :label="term.term"
              text
              class="w-full justify-content-start menu-button text-left"
              @click="navigateToSearch(term.term)"
            >
              <template #icon>
                <i class="pi pi-star-fill mr-2"></i>
              </template>
              <template #badge>
                <Badge :value="term.clicks.toString()" severity="info" />
              </template>
            </Button>
          </div>
        </div>
      </div>

      <div class="menu-section mt-3">
        <div class="text-lg font-semibold mb-2 text-color uppercase">
          {{ $t('menu.search_management') }}
        </div>
        <div class="flex flex-column gap-1">
          <Button
            v-if="store.features.isAdvancedMode"
            icon="pi pi-plus"
            :label="$t('menu.new_curation')"
            text
            class="w-full justify-content-start menu-button"
            :class="{
              'p-button-text p-highlight': $route.path === '/dashboard/curation/new',
            }"
            @click="$router.push('/dashboard/curation/new')"
          />
          <Button
            icon="pi pi-list"
            :label="$t('menu.kbn_curation')"
            text
            class="w-full justify-content-start menu-button"
            :class="{
              'p-button-text p-highlight': $route.path === '/dashboard/curation/pin-kbns',
            }"
            @click="$router.push('/dashboard/curation/pin-kbns')"
          />
          <Button
            icon="pi pi-cog"
            :label="$t('menu.manage_curations')"
            text
            class="w-full justify-content-start menu-button"
            :class="{
              'p-button-text p-highlight': $route.path === '/dashboard/curation/manage',
            }"
            @click="$router.push('/dashboard/curation/manage')"
          />
          <Button
            icon="pi pi-arrows-h"
            :label="$t('menu.manage_synonyms')"
            text
            class="w-full justify-content-start menu-button"
            :class="{
              'p-button-text p-highlight': $route.path === '/dashboard/synonyms',
            }"
            @click="$router.push('/dashboard/synonyms')"
          />
        </div>
      </div>

      <div v-if="store.features.isAdvancedMode" class="menu-section mt-3">
        <div class="text-lg font-semibold mb-2 text-color uppercase">
          {{ $t('menu.analytics') }}
        </div>
        <div class="flex flex-column gap-1">
          <Button
            icon="pi pi-chart-line"
            :label="$t('menu.analytics_dashboard')"
            text
            class="w-full justify-content-start menu-button text-xs"
            :class="{
              'p-button-text p-highlight': $route.path === '/dashboard/analytics',
            }"
            @click="$router.push('/dashboard/analytics')"
          />
          <Button
            icon="pi pi-search-minus"
            :label="$t('menu.no_result_searches')"
            text
            class="w-full justify-content-start menu-button text-xs"
            :class="{
              'p-button-text p-highlight':
                $route.path === '/dashboard/analytics/no-results',
            }"
            @click="$router.push('/dashboard/analytics/no-results')"
          />
          <Button
            icon="pi pi-chart-bar"
            :label="$t('menu.low_click_searches')"
            text
            class="w-full justify-content-start menu-button text-xs"
            :class="{
              'p-button-text p-highlight':
                $route.path === '/dashboard/analytics/low-clicks',
            }"
            @click="$router.push('/dashboard/analytics/low-clicks')"
          />
          <Button
            icon="pi pi-star"
            :label="$t('menu.top_clicked_searches')"
            text
            class="w-full justify-content-start menu-button text-xs"
            :class="{
              'p-button-text p-highlight':
                $route.path === '/dashboard/analytics/top-clicked',
            }"
            @click="$router.push('/dashboard/analytics/top-clicked')"
          />
        </div>
      </div>

      <!-- Feature Toggle Switch -->
      <div class="feature-toggle mt-auto pt-4 border-top-1 surface-border">
        <div class="flex align-items-center gap-2">
          <InputSwitch v-model="isAdvancedMode" />
          <span class="text-sm">Extended Office</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useStore } from '../store';
import Button from 'primevue/button';
import InputSwitch from 'primevue/inputswitch';
import Badge from 'primevue/badge';

const router = useRouter();
const route = useRoute();
const { locale } = useI18n();
const store = useStore();
const isCollapsed = ref(false);

const isAdvancedMode = computed({
  get: () => store.features.isAdvancedMode,
  set: () => store.features.toggleAdvancedMode(),
});

// Mock data for recent searches and top clicked terms
const recentSearches = ref([
  { term: 'hammer', timestamp: new Date() },
  { term: 'screwdriver', timestamp: new Date() },
  { term: 'drill', timestamp: new Date() },
  { term: 'saw', timestamp: new Date() },
  { term: 'wrench', timestamp: new Date() }
]);

const topClickedTerms = ref([
  { term: 'hammer', clicks: 156 },
  { term: 'power drill', clicks: 143 },
  { term: 'screwdriver set', clicks: 128 },
  { term: 'toolbox', clicks: 112 },
  { term: 'measuring tape', clicks: 98 }
]);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const navigateToSearch = (term) => {
  router.push({
    path: '/dashboard/search-preview',
    query: { term }
  });
};

// Watch for language changes and force re-render
watch(
  () => store.theme.language,
  (newLang) => {
    locale.value = newLang;
  }
);
</script>

<style scoped>
.menu-container {
  position: relative;
  width: 15rem;
  min-width: 15rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.menu-section button {
  font-family: 'Klavika';
  font-size: 16px !important;
  font-weight: 300 !important;
}

.menu-container.collapsed {
  width: 3rem;
  min-width: 3rem;
}

.menu-button {
  color: var(--text-color) !important;
  transition: all 0.3s ease;
  font-size: 0.875rem !important;
  padding: 0.4rem 0.5rem !important;
  text-align: start;
}

.menu-button:hover,
.menu-button:focus {
  background-color: rgba(0, 181, 184, 0.04) !important;
}

.menu-button.p-button-text:enabled:active,
.menu-button.p-button-text.p-highlight {
  background-color: rgba(0, 181, 184, 0.16) !important;
  color: var(--primary-color) !important;
}

.menu-button :deep(.p-button-label) {
  color: inherit !important;
  font-weight: 300;
}

.menu-button :deep(.p-button-icon) {
  color: var(--primary-color) !important;
  font-size: 0.875rem !important;
}

.toggle-button {
  transition: transform 0.3s ease;
}

.toggle-button.rotate-180 {
  transform: rotate(180deg);
}

.toggle-button :deep(.p-button-icon) {
  color: var(--primary-color) !important;
}

.text-xs {
  font-size: 0.75rem !important;
}

.feature-toggle {
  margin-top: auto;
  padding-top: 1rem;
}
</style>