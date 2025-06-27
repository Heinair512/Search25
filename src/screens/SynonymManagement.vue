<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">{{ t('synonyms.title') }}</div>
    <p class="text-l line-height-3 mb-4" v-html="t('synonyms.description')"></p>

    <div class="flex justify-content-between mb-4">
      <div class="flex align-items-center">
        <span class="mr-2 font-medium">{{ t('analytics.business_unit') }}:</span>
        <span class="text-primary font-bold">{{ selectedBU }}</span>
      </div>
      <Button
        :label="t('synonyms.publish')"
        severity="success"
        @click="publishChanges"
      />
    </div>

    <div class="card">
      <div>
        <div class="flex ml-3 mr-3 mt-3 justify-content-between">
          <InputText
            v-model="searchTerm"
            :placeholder="t('synonyms.search_placeholder')"
            @keydown="handleKeydown"
          />
          <div class="flex justify-content-between gap-2">
            <Button
              severity="success"
              icon="pi pi-plus"
              :label="t('synonyms.new_rule')"
              class="p-button-sm"
              @click="createNewSynonym"
            />
            <Button
              v-if="store.features.isAdvancedMode"
              severity="secondary"
              icon="pi pi-download"
              :label="t('synonyms.export')"
              class="p-button-sm"
              @click="exportSynonyms"
            />
            <Button
              v-if="store.features.isAdvancedMode"
              severity="secondary"
              icon="pi pi-upload"
              :label="t('synonyms.import')"
              class="p-button-sm"
              @click="triggerFileInput"
            />
          </div>
        </div>
        <Divider />

        <DataTable
          :value="filteredSynonyms"
          :dataKey="'id'"
          v-model:expandedRows="expandedRows"
          tableStyle="min-width: 60rem"
          @row-click="toggleRow"
          class="cursor-pointer"
        >
          <template #empty>
            <div class="p-4 text-center">
              {{
                filteredSynonyms.length === 0
                  ? t('synonyms.no_data')
                  : t('synonyms.loading')
              }}
            </div>
          </template>

          <Column field="name" :header="t('synonyms.search_term')">
            <template #body="slotProps">
              <div class="flex align-items-center justify-content-between">
                <InputText
                  v-model="localName[slotProps.data.id]"
                  @blur="
                    updateName(slotProps.data.id, localName[slotProps.data.id])
                  "
                  @keydown="handleKeydown"
                  :placeholder="t('synonyms.enter_search_term')"
                  @click.stop
                />
                <i
                  :class="[
                    'pi ml-2',
                    expandedRows[slotProps.data.id]
                      ? 'pi-chevron-down'
                      : 'pi-chevron-right',
                  ]"
                ></i>
              </div>
            </template>
          </Column>

          <template #expansion="slotProps">
            <div v-if="slotProps.data && slotProps.data.regelset">
              <template v-for="regel in slotProps.data.regelset">
                <div
                  class="flex w-full align-items-center justify-content-start gap-3 mb-2"
                >
                  <Checkbox
                    :model-value="regel.aktiv"
                    :binary="true"
                    class="p-mr-2"
                    @update:modelValue="
                      updateAktiv(slotProps.data.id, regel.id, $event)
                    "
                  />
                  <div class="synonym">
                    <i class="pi pi-arrows-h"></i>
                    <SelectButton
                      class="select-button"
                      :allowEmpty="false"
                      :model-value="regel.art"
                      :options="[
                        { value: 'gerichtet', label: t('synonyms.directed') },
                        {
                          value: 'ungerichtet',
                          label: t('synonyms.undirected'),
                        },
                      ]"
                      optionLabel="label"
                      optionValue="value"
                      @update:modelValue="
                        (value) =>
                          changeRule(slotProps.data.id, regel.id, value)
                      "
                    />
                  </div>

                  <p v-if="regel.art === 'gerichtet'" class="gerichtet">
                    {{ slotProps.data.name }}
                  </p>
                  <i
                    class="pi pi-arrow-right synonym-arrow"
                    v-if="regel.art === 'gerichtet'"
                  />

                  <Chips
                    v-model="regel.synonyme"
                    class="flex-grow-1"
                    @update:modelValue="
                      (newValue) =>
                        handleChipsUpdate(slotProps.data.id, regel.id, newValue)
                    "
                    :addOnBlur="true"
                    @click.stop
                  />

                  <Button
                    icon="pi pi-trash"
                    text
                    rounded
                    severity="danger"
                    @click.stop="deleteRule(slotProps.data.id, regel.id)"
                  />
                </div>
              </template>

              <div class="flex gap-2 mt-3">
                <Button
                  icon="pi pi-arrows-h"
                  :label="t('synonyms.add_synonym')"
                  @click.stop="addSynonym(slotProps.data.id)"
                />
              </div>

              <div class="mt-4">
                <span class="font-medium">{{ t('synonyms.comment') }}:</span>
                <InputTextarea
                  v-model="slotProps.data.kommentar"
                  rows="2"
                  class="w-full mt-2"
                  @change="notifyChange"
                  @click.stop
                />
                <div class="text-sm text-500 mt-2">
                  {{ t('synonyms.last_modified') }}:
                  {{ slotProps.data.aenderungsdatum }} {{ t('synonyms.by') }}
                  {{ slotProps.data.bearbeiter }}
                </div>
              </div>

              <div class="flex gap-2 mt-4">
                <Button
                  severity="danger"
                  icon="pi pi-trash"
                  :label="t('synonyms.delete_search_term')"
                  @click.stop="deleteSynonym(slotProps.data.id)"
                />
                <Button
                  severity="secondary"
                  :label="t('synonyms.duplicate_search_term')"
                  @click.stop="duplicateSynonym(slotProps.data.id)"
                />
              </div>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
  </div>

  <Dialog
    v-model:visible="hasChanges"
    :closable="false"
    position="bottom"
    :header="t('synonyms.unsaved_changes')"
  >
    <div class="flex flex-column gap-3">
      <p>{{ t('synonyms.unsaved_changes_message') }}</p>
    </div>
    <template #footer>
      <div class="flex justify-content-end gap-2">
        <Button
          :label="t('synonyms.discard')"
          severity="secondary"
          @click="discardChanges"
        />
        <Button
          :label="t('synonyms.save')"
          severity="success"
          @click="saveAll"
        />
      </div>
    </template>
  </Dialog>

  <!-- Hidden file input for import -->
  <input
    type="file"
    ref="fileInput"
    style="display: none"
    accept=".csv"
    @change="handleFileImport"
  />

  <Toast />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useStore } from '../store';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputTextarea from 'primevue/textarea';
import Divider from 'primevue/divider';
import SelectButton from 'primevue/selectbutton';
import Checkbox from 'primevue/checkbox';
import Chips from 'primevue/chips';
import Toast from 'primevue/toast';
import Papa from 'papaparse';
import { synonyms, updateSynonyms } from '../data/synonyms';

const toast = useToast();
const { t } = useI18n();
const store = useStore();
const searchTerm = ref('');
const hasChanges = ref(false);
const expandedRows = ref({});
const localName = ref({});
const fileInput = ref(null);

// Get current user from auth store
const currentUser = computed(() => store.auth.currentUser?.name || 'Current User');
// Get current business unit from analytics store
const selectedBU = computed(() => store.analytics.selectedBU);

// Initialize localName with current values and reset expanded rows when BU changes
const initializeSynonyms = () => {
  localName.value = {};
  synonyms.value.forEach((synonym) => {
    localName.value[synonym.id] = synonym.name;
  });
  // Reset expanded rows when BU changes
  expandedRows.value = {};
};

onMounted(() => {
  initializeSynonyms();
  // Listen for BU changes from header
  window.addEventListener('buChanged', handleBUChange);
});

// Handle BU changes from header
const handleBUChange = () => {
  initializeSynonyms();
};

// Clean up event listener
watch(() => store.analytics.selectedBU, () => {
  initializeSynonyms();
});

const filteredSynonyms = computed(() => {
  const searchLower = searchTerm.value.toLowerCase();
  return synonyms.value.filter(
    (synonym) =>
      synonym.bu === selectedBU.value && // Filter by business unit
      (synonym.name.toLowerCase().includes(searchLower) ||
      synonym.kommentar?.toLowerCase().includes(searchLower) ||
      synonym.regelset.some((regel) =>
        regel.synonyme.some((s) => s.toLowerCase().includes(searchLower))
      ))
  );
});

const handleKeydown = (event) => {
  if (event.key === ' ') {
    event.stopPropagation();
  }
};

const toggleRow = (event) => {
  const rowData = event.data;
  expandedRows.value = expandedRows.value[rowData.id]
    ? {}
    : { [rowData.id]: true };
};

const updateName = (id, newName) => {
  const synonym = synonyms.value.find((s) => s.id === id);
  if (synonym) {
    synonym.name = newName;
    synonym.aenderungsdatum = new Date().toLocaleString();
    synonym.bearbeiter = currentUser.value;
    notifyChange();
  }
};

const updateAktiv = (synonymId, regelId, value) => {
  const synonym = synonyms.value.find((s) => s.id === synonymId);
  if (synonym) {
    const regel = synonym.regelset.find((r) => r.id === regelId);
    if (regel) {
      regel.aktiv = value;
      synonym.aenderungsdatum = new Date().toLocaleString();
      synonym.bearbeiter = currentUser.value;
      notifyChange();
    }
  }
};

const changeRule = (synonymId, regelId, newArt) => {
  const synonym = synonyms.value.find((s) => s.id === synonymId);
  if (synonym) {
    const regel = synonym.regelset.find((r) => r.id === regelId);
    if (regel) {
      regel.art = newArt;
      synonym.aenderungsdatum = new Date().toLocaleString();
      synonym.bearbeiter = currentUser.value;
      notifyChange();
    }
  }
};

const handleChipsUpdate = (synonymId, regelId, newValue) => {
  const synonym = synonyms.value.find((s) => s.id === synonymId);
  if (synonym) {
    const regel = synonym.regelset.find((r) => r.id === regelId);
    if (regel) {
      regel.synonyme = newValue;
      synonym.aenderungsdatum = new Date().toLocaleString();
      synonym.bearbeiter = currentUser.value;
      notifyChange();
    }
  }
};

const deleteRule = (synonymId, regelId) => {
  const synonym = synonyms.value.find((s) => s.id === synonymId);
  if (synonym) {
    synonym.regelset = synonym.regelset.filter((r) => r.id !== regelId);
    synonym.aenderungsdatum = new Date().toLocaleString();
    synonym.bearbeiter = currentUser.value;
    notifyChange();
  }
};

const addSynonym = (synonymId) => {
  const synonym = synonyms.value.find((s) => s.id === synonymId);
  if (synonym) {
    const newId = Math.max(...synonym.regelset.map((r) => r.id)) + 1;
    synonym.regelset.push({
      id: newId,
      typ: 'synonym',
      synonyme: [],
      art: 'ungerichtet',
      aktiv: true,
    });
    synonym.aenderungsdatum = new Date().toLocaleString();
    synonym.bearbeiter = currentUser.value;
    notifyChange();
  }
};

const createNewSynonym = () => {
  const newId = String(
    Math.max(...synonyms.value.map((s) => parseInt(s.id) || 0)) + 1
  );
  const newSynonym = {
    id: newId,
    name: '',
    kommentar: '',
    aenderungsdatum: new Date().toLocaleString(),
    bearbeiter: currentUser.value,
    bu: selectedBU.value, // Assign current business unit
    regelset: [
      {
        id: 1,
        typ: 'synonym',
        synonyme: [],
        art: 'ungerichtet',
        aktiv: true,
      },
    ],
  };
  synonyms.value.push(newSynonym);
  localName.value[newId] = '';
  notifyChange();
};

const deleteSynonym = (id) => {
  synonyms.value = synonyms.value.filter((s) => s.id !== id);
  delete localName.value[id];
  notifyChange();
};

const duplicateSynonym = (id) => {
  const original = synonyms.value.find((s) => s.id === id);
  if (original) {
    const newId = String(
      Math.max(...synonyms.value.map((s) => parseInt(s.id) || 0)) + 1
    );
    const duplicate = JSON.parse(JSON.stringify(original));
    duplicate.id = newId;
    duplicate.name = `${original.name} (Copy)`;
    duplicate.aenderungsdatum = new Date().toLocaleString();
    duplicate.bearbeiter = currentUser.value;
    duplicate.bu = selectedBU.value; // Assign current business unit to the duplicate
    synonyms.value.push(duplicate);
    localName.value[newId] = duplicate.name;
    notifyChange();
  }
};

const notifyChange = () => {
  hasChanges.value = true;
};

const saveAll = () => {
  hasChanges.value = false;
  updateSynonyms(JSON.parse(JSON.stringify(synonyms.value)));
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: t('synonyms.save_success'),
    life: 3000,
  });
};

const discardChanges = () => {
  initializeSynonyms();
  hasChanges.value = false;
  expandedRows.value = {};
};

const publishChanges = async () => {
  saveAll();
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: t('synonyms.publish_success'),
    life: 3000,
  });
};

const exportSynonyms = () => {
  const csvData = [];
  
  // Create a flat structure with one row per synonym pair
  // Only export synonyms for the current business unit
  filteredSynonyms.value.forEach(synonym => {
    synonym.regelset.forEach(regel => {
      regel.synonyme.forEach(syn => {
        csvData.push({
          'Search Term': synonym.name,
          'Synonym': syn,
          'Type': regel.art,
          'Active': regel.aktiv ? 'Yes' : 'No',
          'Comment': synonym.kommentar || '',
          'Business Unit': synonym.bu, // Include business unit in export
          'Last Modified': synonym.aenderungsdatum,
          'Modified By': synonym.bearbeiter
        });
      });
    });
  });

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = t('synonyms.export_filename');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileImport = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    Papa.parse(text, {
      header: true,
      complete: (results) => {
        // Group synonyms by search term and business unit
        const groupedSynonyms = {};
        
        results.data.forEach(row => {
          if (!row['Search Term']) return;
          
          const bu = row['Business Unit'] || selectedBU.value;
          const key = `${row['Search Term']}_${bu}`;
          
          if (!groupedSynonyms[key]) {
            groupedSynonyms[key] = {
              name: row['Search Term'],
              kommentar: row['Comment'] || '',
              aenderungsdatum: new Date().toLocaleString(),
              bearbeiter: currentUser.value,
              bu: bu,
              regelset: [{
                id: 1,
                typ: 'synonym',
                synonyme: [],
                art: row['Type'] || 'ungerichtet',
                aktiv: row['Active']?.toLowerCase() === 'yes'
              }]
            };
          }
          
          if (row['Synonym']) {
            groupedSynonyms[key].regelset[0].synonyme.push(row['Synonym']);
          }
        });
        
        const imported = Object.values(groupedSynonyms).map((synonym, index) => ({
          id: String(synonyms.value.length + index + 1),
          ...synonym
        }));

        synonyms.value = [...synonyms.value, ...imported];
        imported.forEach((synonym) => {
          localName.value[synonym.id] = synonym.name;
        });
        notifyChange();

        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: t('synonyms.import_success'),
          life: 3000,
        });
      },
      error: (error) => {
        throw new Error(error);
      },
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: t('synonyms.import_error'),
      life: 3000,
    });
  }

  event.target.value = '';
};
</script>

<style scoped>
.select-button {
  white-space: nowrap;
}

:deep(.p-selectbutton) {
  display: flex;
}

:deep(.p-selectbutton .p-button) {
  flex: 1;
  white-space: nowrap;
}

.synonym {
  display: flex;
  align-items: center;
  gap: 18px;
  min-width: 250px;
  margin-right: 18px;
}

.gerichtet {
  padding: 0;
  margin: 0;
  margin-left: 19px;
}

.synonym-arrow {
  margin-left: -9px;
  margin-right: -10px;
}

:deep(.p-chips) {
  width: 100%;
}

:deep(.p-chips-multiple-container) {
  width: 100%;
}

:deep(.p-datatable-tbody > tr > td) {
  cursor: pointer;
  user-select: none;
}

.cursor-pointer {
  cursor: pointer;
}
</style>