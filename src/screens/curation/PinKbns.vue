<template>
<CardWrapper title="KBN Curation">
  <div class="flex flex-column gap-4">
    <!-- Position Section -->
    <div class="surface-card p-4 border-round">
      <h3 class="mt-0 mb-4">KBN Positionen</h3>
      <div class="flex flex-column gap-2">
        <label for="search-term" class="font-medium">{{ $t('curation.search_term') }}</label>
        <InputText id="search-term" v-model="searchTerm" placeholder="Suchbegriff" />
      </div>

      <div class="flex flex-column gap-3 mt-3">
        <div v-for="(row, index) in kbnRows" :key="index" class="flex gap-3">
          <div class="flex-grow-1">
            <label :for="`kbn-${index}`" class="block font-medium mb-2">KBN {{ index + 1 }}</label>
            <InputText 
              :id="`kbn-${index}`" 
              v-model="row.kbn" 
              placeholder="KBN eingeben"
              class="w-full"
            />
          </div>
          <div class="flex-grow-1">
            <label :for="`position-${index}`" class="block font-medium mb-2">Position {{ index + 1 }}</label>
            <InputNumber 
              :id="`position-${index}`" 
              v-model="row.position" 
              placeholder="Position"
              :min="1"
              :max="100"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-content-end mt-3">
        <Button :label="$t('curation.save')" severity="success" @click="saveKbns" />
      </div>
    </div>

    <!-- Hide Section -->
    <div class="surface-card p-4 border-round">
      <h3 class="mt-0 mb-4">KBNs ausblenden</h3>
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-2">
          <label for="hide-search-term" class="font-medium">{{ $t('curation.search_term') }}</label>
          <InputText id="hide-search-term" v-model="hideSearchTerm" placeholder="Suchbegriff" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="hide-kbn-list" class="font-medium">{{ $t('curation.kbn_list') }}</label>
          <Textarea 
            id="hide-kbn-list" 
            v-model="hideKbnList" 
            :placeholder="$t('curation.kbn_list_placeholder')"
            rows="5"
            class="w-full"
          />
        </div>
        <div class="flex justify-content-end">
          <Button :label="$t('curation.save')" severity="success" @click="saveHiddenKbns" />
        </div>
      </div>
    </div>
  </div>
</CardWrapper>

<Toast />
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useStore } from '../../store';
import CardWrapper from '../../components/shared/CardWrapper.vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

const toast = useToast();
const { t } = useI18n();
const store = useStore();

// Position section
const searchTerm = ref('');
const kbnRows = ref(Array(10).fill(null).map(() => ({ kbn: '', position: null })));

// Hide section
const hideSearchTerm = ref('');
const hideKbnList = ref('');

const saveKbns = () => {
  // Filter out empty rows
  const validRows = kbnRows.value.filter(row => row.kbn && row.position);
  
  if (validRows.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'Warnung',
      detail: 'Bitte geben Sie mindestens eine KBN mit Position ein',
      life: 3000
    });
    return;
  }

  if (!searchTerm.value) {
    toast.add({
      severity: 'warn',
      summary: 'Warnung',
      detail: 'Bitte geben Sie einen Suchbegriff ein',
      life: 3000
    });
    return;
  }

  // Create or update curation
  store.curation.updateCuration(searchTerm.value, {
    term: searchTerm.value,
    pinnedKbns: validRows.map(row => row.kbn),
    positions: validRows.reduce((acc, row) => {
      acc[row.kbn] = row.position;
      return acc;
    }, {}),
    createdAt: new Date()
  });
  
  toast.add({
    severity: 'success',
    summary: t('curation.success'),
    detail: 'KBNs wurden mit Positionen gespeichert',
    life: 3000
  });
  
  // Reset position form
  searchTerm.value = '';
  kbnRows.value = Array(10).fill(null).map(() => ({ kbn: '', position: null }));
};

const saveHiddenKbns = () => {
  if (!hideSearchTerm.value) {
    toast.add({
      severity: 'warn',
      summary: 'Warnung',
      detail: 'Bitte geben Sie einen Suchbegriff ein',
      life: 3000
    });
    return;
  }

  const kbns = hideKbnList.value.split('\n').map(kbn => kbn.trim()).filter(kbn => kbn);
  
  if (kbns.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'Warnung',
      detail: 'Bitte geben Sie mindestens eine KBN ein',
      life: 3000
    });
    return;
  }

  // Update curation with hidden KBNs
  store.curation.updateCuration(hideSearchTerm.value, {
    term: hideSearchTerm.value,
    hiddenKbns: kbns,
    createdAt: new Date()
  });
  
  toast.add({
    severity: 'success',
    summary: t('curation.success'),
    detail: 'KBNs wurden ausgeblendet',
    life: 3000
  });
  
  // Reset hide form
  hideSearchTerm.value = '';
  hideKbnList.value = '';
};
</script>

<style scoped>
:deep(.p-inputnumber) {
  width: 100%;
}

:deep(.p-inputnumber-input) {
  width: 100%;
  text-align: left;
}

.surface-card {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
}

:deep(.p-inputtext),
:deep(.p-inputnumber),
:deep(.p-textarea) {
  background-color: var(--surface-card);
  color: var(--text-color);
  border-color: var(--surface-border);
}

:deep(.p-inputtext:enabled:hover),
:deep(.p-inputnumber:enabled:hover),
:deep(.p-textarea:enabled:hover) {
  border-color: var(--primary-color);
}

:deep(.p-inputtext:enabled:focus),
:deep(.p-inputnumber:enabled:focus),
:deep(.p-textarea:enabled:focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 1px var(--primary-color);
}

/* Dark theme adjustments */
:deep(.dark) .surface-card {
  background-color: var(--surface-card);
  border-color: var(--surface-border);
}

:deep(.dark) .p-inputtext,
:deep(.dark) .p-inputnumber,
:deep(.dark) .p-textarea {
  background-color: var(--surface-card);
  color: var(--text-color);
  border-color: var(--surface-border);
}
</style>