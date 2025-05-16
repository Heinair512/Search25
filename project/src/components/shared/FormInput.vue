<template>
  <div class="flex flex-column gap-2">
    <label :for="id" class="font-medium">{{ label }}</label>
    <component
      :is="component"
      :id="id"
      v-model="value"
      v-bind="$attrs"
      :class="{'p-invalid': showError}"
      @update:modelValue="$emit('update:modelValue', $event)"
      :toggleMask="type === 'password'"
      :feedback="false"
    >
      <slot></slot>
    </component>
    <small class="p-error" v-if="showError">{{ error }}</small>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import Textarea from 'primevue/textarea';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Number, Array],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  error: {
    type: String,
    default: ''
  },
  showError: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const component = computed(() => {
  switch (props.type) {
    case 'password':
      return Password;
    case 'dropdown':
      return Dropdown;
    case 'multiselect':
      return MultiSelect;
    case 'textarea':
      return Textarea;
    default:
      return InputText;
  }
});

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});
</script>

<style scoped>
:deep(.p-inputtext),
:deep(.p-password),
:deep(.p-dropdown),
:deep(.p-multiselect) {
  width: 100%;
}

:deep(.p-password-panel) {
  background-color: var(--surface-card);
  color: var(--text-color);
}

:deep(.p-dropdown-panel),
:deep(.p-multiselect-panel) {
  background-color: var(--surface-card);
  color: var(--text-color);
}

:deep(.p-dropdown-items),
:deep(.p-multiselect-items) {
  background-color: var(--surface-card);
}

:deep(.p-dropdown-item),
:deep(.p-multiselect-item) {
  color: var(--text-color);
}
</style>