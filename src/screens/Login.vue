<template>
<div class="flex align-items-center justify-content-center min-h-screen surface-ground">
  <div class="surface-card p-6 shadow-2 border-round w-full lg:w-6">
    <div class="text-center mb-6">
      <img src="/logo.svg" alt="Logo" class="h-4rem mb-4" />
      <div class="text-900 text-2xl font-medium mb-3">{{ $t('login.welcome') }}</div>
      <span class="text-600 font-medium">{{ $t('login.please_login') }}</span>
    </div>

    <div>
      <div class="flex flex-column gap-4">
        <div>
          <label for="email" class="block text-900 font-medium mb-2">{{ $t('login.email') }}</label>
          <InputText id="email" v-model="email" type="text" class="w-full" :class="{'p-invalid': submitted && !email}" />
          <small class="p-error" v-if="submitted && !email">{{ $t('login.email_required') }}</small>
        </div>

        <div>
          <label for="password" class="block text-900 font-medium mb-2">{{ $t('login.password') }}</label>
          <Password id="password" v-model="password" class="w-full" :feedback="false" :class="{'p-invalid': submitted && !password}" toggleMask />
          <small class="p-error" v-if="submitted && !password">{{ $t('login.password_required') }}</small>
        </div>

        <div v-if="errorMessage" class="p-error text-center">{{ errorMessage }}</div>

        <Button :label="$t('login.login_button')" @click="handleLogin" class="w-full" />
      </div>
    </div>
  </div>

  <!-- Set Password Dialog -->
  <DialogWrapper
    v-model="showPasswordDialog"
    :title="$t('login.set_password')"
    :confirm-label="$t('login.save_password')"
    :cancel-label="$t('login.cancel')"
    confirm-severity="success"
    @confirm="saveNewPassword"
  >
    <div class="flex flex-column gap-4">
      <small class="text-color-secondary">{{ $t('login.password_requirements') }}</small>
      
      <FormInput
        id="newPassword"
        v-model="newPassword"
        type="password"
        :label="$t('login.password')"
        :showError="passwordSubmitted && !isPasswordValid"
        :error="$t('login.password_too_weak')"
        toggleMask
      />

      <FormInput
        id="confirmPassword"
        v-model="confirmPassword"
        type="password"
        :label="$t('login.confirm_password')"
        :showError="passwordSubmitted && !passwordsMatch"
        :error="$t('login.passwords_mismatch')"
        toggleMask
      />
    </div>
  </DialogWrapper>
</div>

<Toast />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Toast from 'primevue/toast';
import DialogWrapper from '../components/shared/DialogWrapper.vue';
import FormInput from '../components/shared/FormInput.vue';
import { users } from '../data/users';

const router = useRouter();
const toast = useToast();
const { t } = useI18n();

const email = ref('');
const password = ref('');
const submitted = ref(false);
const errorMessage = ref('');

// Password reset state
const showPasswordDialog = ref(false);
const newPassword = ref('');
const confirmPassword = ref('');
const passwordSubmitted = ref(false);
const currentUser = ref(null);

const passwordsMatch = computed(() => newPassword.value === confirmPassword.value);

const isPasswordValid = computed(() => {
  const password = newPassword.value;
  return password.length >= 8 &&
         /[A-Z]/.test(password) &&
         /[a-z]/.test(password) &&
         /[0-9]/.test(password) &&
         /[^A-Za-z0-9]/.test(password);
});

const handleLogin = () => {
  submitted.value = true;
  errorMessage.value = '';

  if (!email.value || !password.value) return;

  const user = users.find(u => u.email === email.value);
  
  if (!user) {
    errorMessage.value = t('login.invalid_credentials');
    return;
  }

  // Check if user has OTP
  if (user.otp) {
    if (password.value !== user.otp) {
      errorMessage.value = t('login.invalid_otp');
      return;
    }

    if (!user.needsPasswordReset) {
      errorMessage.value = t('login.otp_expired');
      return;
    }

    // Show password reset dialog
    currentUser.value = user;
    showPasswordDialog.value = true;
    return;
  }

  // Normal password login
  if (user.password !== password.value) {
    errorMessage.value = t('login.invalid_credentials');
    return;
  }

  loginSuccess(user);
};

const saveNewPassword = () => {
  passwordSubmitted.value = true;

  if (!isPasswordValid.value || !passwordsMatch.value) {
    return;
  }

  // Update user in users array
  const userIndex = users.findIndex(u => u.email === currentUser.value.email);
  if (userIndex !== -1) {
    const updatedUser = {
      ...users[userIndex],
      password: newPassword.value,
      needsPasswordReset: false
    };
    delete updatedUser.otp;
    users[userIndex] = updatedUser;

    loginSuccess(updatedUser);
    showPasswordDialog.value = false;
  }
};

const loginSuccess = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
  router.push('/dashboard/news');
};
</script>

<style scoped>
:deep(.p-password-input) {
  width: 100%;
}

:deep(.p-inputtext),
:deep(.p-password) {
  background-color: var(--surface-card);
  color: var(--text-color);
  border-color: var(--surface-border);
}

:deep(.p-inputtext:enabled:hover),
:deep(.p-password:hover) {
  border-color: var(--primary-color);
}

:deep(.p-inputtext:enabled:focus),
:deep(.p-password:focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 1px var(--primary-color);
}

:deep(.p-password-panel) {
  background-color: var(--surface-card);
  border-color: var(--surface-border);
  color: var(--text-color);
}
</style>