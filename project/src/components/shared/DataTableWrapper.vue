<template>
  <DataTable
    v-bind="$attrs"
    :paginator="true"
    :rows="10"
    :rowsPerPageOptions="[10, 20, 50]"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
    paginatorClassName="justify-content-center"
    class="p-datatable-sm"
  >
    <template #paginatorend>
      <div class="flex align-items-center gap-2">
        <span>{{ $t('curation.items_per_page') }}</span>
      </div>
    </template>
    <slot></slot>
  </DataTable>
</template>

<script setup>
import DataTable from 'primevue/datatable';
</script>

<style scoped>
:deep(.p-paginator) {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

:deep(.p-paginator .p-dropdown) {
  position: absolute;
  right: 0;
}

:deep(.p-paginator .p-paginator-end) {
  position: absolute;
  right: 8rem;
}

:deep(.p-paginator .p-paginator-pages) {
  margin: 0 auto;
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