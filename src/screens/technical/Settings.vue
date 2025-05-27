<template>
  <div class="settings-container">
    <CardWrapper :title="t('technical.settings.title')">
      <template #title-actions>
        <InputSwitch 
          v-model="relevanceRankingEnabled" 
          @change="updateRelevanceRanking" 
          class="mr-2"
        />
        <span>{{ t('technical.settings.enable_relevance_ranking') }}</span>
      </template>
      
      <div class="grid">
        <!-- Feature Flags Section -->
        <div class="col-12 lg:col-6">
          <div class="surface-card p-4 border-round mb-4">
            <h3 class="mt-0 mb-4">{{ t('technical.settings.feature_flags') }}</h3>
            
            <div class="flex flex-column gap-3">
              <div v-for="(value, key) in featureFlags" :key="key" class="flex align-items-center justify-content-between">
                <label :for="key" class="font-medium">{{ t(`technical.feature_flags.${key}`) }}</label>
                <InputSwitch 
                  :id="key" 
                  v-model="featureFlags[key]" 
                  @change="updateFeatureFlag(key)"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Product Attribute Boosts Section -->
        <div class="col-12">
          <div class="surface-card p-4 border-round">
            <h3 class="mt-0 mb-4">{{ t('technical.settings.product_attribute_boosts') }}</h3>
            
            <DataTable 
              :value="productAttributes" 
              :paginator="true" 
              :rows="10"
              :rowsPerPageOptions="[5, 10, 20, 50]"
              responsiveLayout="scroll"
              class="p-datatable-sm"
            >
              <Column field="name" :header="t('technical.settings.attribute')" sortable></Column>
              <Column field="boost" :header="t('technical.settings.boost_value')" style="width: 300px">
                <template #body="slotProps">
                  <div class="flex align-items-center gap-2">
                    <Slider 
                      v-model="slotProps.data.boost" 
                      :min="1" 
                      :max="5" 
                      :step="0.1"
                      class="w-full" 
                      @change="updateProductAttributeBoost(slotProps.data.id, slotProps.data.boost)"
                    />
                    <span class="font-bold">{{ slotProps.data.boost.toFixed(1) }}</span>
                  </div>
                </template>
              </Column>
            </DataTable>
            
            <div class="flex justify-content-end gap-2 mt-4">
              <Button 
                :label="t('technical.settings.reset')" 
                severity="secondary" 
                @click="resetSettings"
              />
              <Button 
                :label="t('technical.settings.save')" 
                severity="success" 
                @click="saveSettings"
              />
            </div>
          </div>
        </div>
      </div>
    </CardWrapper>
    
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from '../../store';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import CardWrapper from '../../components/shared/CardWrapper.vue';
import InputSwitch from 'primevue/inputswitch';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Slider from 'primevue/slider';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

const store = useStore();
const { t } = useI18n();
const toast = useToast();

// Get current BU from store
const selectedBU = computed(() => store.analytics.selectedBU);

// Reactive state for the current BU settings
const relevanceRankingEnabled = ref(true);
const featureFlags = ref({});
const productAttributes = ref([]);

// Load settings for the current BU
const loadSettings = () => {
  const settings = store.technical.getSettingsForBU(selectedBU.value);
  relevanceRankingEnabled.value = settings.relevanceRankingEnabled;
  featureFlags.value = { ...settings.featureFlags };
  productAttributes.value = [...settings.productAttributes];
};

// Watch for BU changes and update settings
watch(selectedBU, () => {
  loadSettings();
});

// Update handlers
const updateRelevanceRanking = () => {
  store.technical.updateRelevanceRanking(selectedBU.value, relevanceRankingEnabled.value);
};

const updateFeatureFlag = (flagName) => {
  store.technical.updateFeatureFlag(selectedBU.value, flagName, featureFlags.value[flagName]);
};

const updateProductAttributeBoost = (attributeId, boostValue) => {
  store.technical.updateProductAttributeBoost(selectedBU.value, attributeId, boostValue);
};

const resetSettings = () => {
  store.technical.resetSettings(selectedBU.value);
  loadSettings();
};

const saveSettings = () => {
  store.technical.saveSettings();
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: t('technical.settings.changes_saved'),
    life: 3000
  });
};

// Update settings when BU changes in header
const handleBUChange = () => {
  loadSettings();
};

onMounted(() => {
  loadSettings();
  window.addEventListener('buChanged', handleBUChange);
});
</script>

<style scoped>
.settings-container {
  padding: 1rem;
}

:deep(.p-slider) {
  height: 0.5rem;
}

:deep(.p-slider .p-slider-handle) {
  height: 1.25rem;
  width: 1.25rem;
  background: var(--primary-color);
  border: 2px solid var(--primary-color);
  margin-top: -0.5rem;
  margin-left: -0.625rem;
}

:deep(.p-slider-range) {
  background: var(--primary-color);
}

:deep(.p-inputswitch.p-inputswitch-checked .p-inputswitch-slider) {
  background: var(--primary-color);
}

:deep(.p-inputswitch.p-inputswitch-checked:not(.p-disabled):hover .p-inputswitch-slider) {
  background: var(--primary-dark);
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
</style>