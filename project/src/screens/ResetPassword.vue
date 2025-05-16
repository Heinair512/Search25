```vue
<template>
<div class="flex align-items-center justify-content-center min-h-screen surface-ground">
  <div class="surface-card p-6 shadow-2 border-round w-full lg:w-6">
    <div class="text-center mb-6">
      <div class="text-900 text-2xl font-medium mb-3">{{ $t('reset_password.title') }}</div>
      <span class="text-600 font-medium">{{ $t('reset_password.subtitle') }}</span>
    </div>

    <div class="flex flex-column gap-4">
      <FormInput
        id="password"
        v-model="password"
        type="password"
        :label="$t('reset_password.new_password')"
        :showError="submitted && !password"
        :error="$t('reset_password.password_required')"
        toggleMask
      />

      <FormInput
        id="confirmPassword"
        v-model="confirmPassword"
        type="password"
        :label="$t('reset_password.confirm_password')"
        :showError="submitted && !passwordsMatch"
        :error="$t('reset_password.passwords_mismatch')"
        toggleMask
      />

      <Button 
        :label="$t('reset_password.submit')" 
        @click="handleSubmit" 
        :loading="store.auth.loading" 
        class="w-full" 
      />
    </div>
  </div>
</div>

<Toast />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useStore } from '../store';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import FormInput from '../components/shared/FormInput.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const store = useStore();

const password = ref('');
const confirmPassword = ref('');
const submitted = ref(false);

const passwordsMatch = computed(() => password.value === confirmPassword.value);

const handleSubmit = async () => {
  submitted.value = true;
  
  if (!password.value || !passwordsMatch.value) {
    return;
  }
  
  try {
    await store.auth.resetPassword(route.params.token, password.value);
    
    toast.add({
      severity: 'success',
      summary: t('reset_password.success'),
      detail: t('reset_password.password_updated'),
      life: 3000
    });
    
    setTimeout(() => {
      router.push('/');
    }, 2000);
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('reset_password.error'),
      detail: t('reset_password.invalid_token'),
      life: 3000
    });
  }
};
</script>
```