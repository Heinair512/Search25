<template>
  <Dialog
    :visible="modelValue"
    @update:visible="$emit('update:modelValue', $event)"
    :modal="true"
    :closable="false"
    :class="dialogClass"
  >
    <template #header>
      <div class="flex align-items-center justify-content-between w-full">
        <span class="text-xl font-medium">{{ title }}</span>
        <Button icon="pi pi-times" text rounded @click="$emit('update:modelValue', false)" />
      </div>
    </template>
    
    <slot></slot>
    
    <template #footer>
      <slot name="footer">
        <div class="flex justify-content-end gap-2">
          <Button :label="cancelLabel" @click="$emit('update:modelValue', false)" text />
          <Button :label="confirmLabel" :severity="confirmSeverity" @click="$emit('confirm')" />
        </div>
      </slot>
    </template>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  dialogClass: {
    type: String,
    default: 'w-30rem'
  },
  cancelLabel: {
    type: String,
    default: 'Cancel'
  },
  confirmLabel: {
    type: String,
    default: 'Confirm'
  },
  confirmSeverity: {
    type: String,
    default: 'primary'
  }
});

defineEmits(['update:modelValue', 'confirm']);
</script>

<style scoped>
:deep(.p-dialog) {
  background-color: var(--surface-card);
  color: var(--text-color);
}

:deep(.p-dialog .p-dialog-header),
:deep(.p-dialog .p-dialog-content),
:deep(.p-dialog .p-dialog-footer) {
  background-color: var(--surface-card);
  color: var(--text-color);
}
</style>