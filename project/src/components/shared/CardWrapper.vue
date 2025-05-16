<template>
  <Card>
    <template #title>
      <div class="flex align-items-center justify-content-between w-full pl-3">
        <span class="text-xl font-semibold">{{ title }}</span>
        <slot name="title-actions"></slot>
      </div>
    </template>
    <template #content>
      <slot></slot>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card';

defineProps({
  title: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
:deep(.p-card) {
  background-color: var(--surface-card) !important;
}

:deep(.p-card .p-card-title) {
  background-color: var(--surface-section) !important;
  color: var(--text-color) !important;
}
</style>