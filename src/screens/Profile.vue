<template>
  <div class="surface-ground flex-grow-1">
    <div class="flex justify-content-center p-4">
      <div class="surface-card p-6 shadow-2 border-round w-full lg:w-8">
        <div class="text-900 text-2xl font-medium mb-6">{{ $t('profile.title') }}</div>
        
        <div class="grid">
          <div class="col-12 md:col-4">
            <div class="flex flex-column align-items-center">
              <Avatar 
                :image="previewImage || user.image" 
                icon="pi pi-user" 
                size="xlarge" 
                class="mb-3" 
                style="width: 150px; height: 150px; object-fit: cover;" 
              />
              <FileUpload 
                mode="basic" 
                accept="image/*" 
                :maxFileSize="1000000" 
                :chooseLabel="$t('profile.change_image')"
                class="mb-3"
                :auto="true"
                @select="onFileSelect"
                @upload="onUpload"
                @error="onError"
              />
              <small class="text-color-secondary">{{ $t('profile.max_size') }}</small>
            </div>
          </div>
          
          <div class="col-12 md:col-8">
            <div class="flex flex-column gap-4">
              <div class="flex flex-column gap-2">
                <label for="name" class="font-medium">{{ $t('profile.name') }}</label>
                <InputText id="name" v-model="user.name" class="w-full" />
              </div>
              
              <div class="flex flex-column gap-2">
                <label for="email" class="font-medium">{{ $t('profile.email') }}</label>
                <InputText id="email" v-model="user.email" class="w-full" disabled />
              </div>
              
              <div class="flex flex-column gap-2">
                <label for="role" class="font-medium">{{ $t('profile.role') }}</label>
                <InputText id="role" v-model="user.role" class="w-full" disabled />
              </div>
              
              <div class="flex flex-column gap-2">
                <label for="bu" class="font-medium">{{ $t('profile.business_units') }}</label>
                <Chips v-model="user.bu" class="w-full" disabled />
              </div>
              
              <Divider />
              
              <small class="text-color-secondary">{{ $t('profile.password_requirements') }}</small>
              
              <div class="flex flex-column gap-2">
                <label for="password" class="font-medium">{{ $t('profile.new_password') }}</label>
                <Password id="password" v-model="newPassword" toggleMask class="w-full" :class="{'p-invalid': !isPasswordValid && newPassword}" />
                <small class="p-error" v-if="!isPasswordValid && newPassword">{{ $t('profile.password_too_weak') }}</small>
              </div>
              
              <div class="flex flex-column gap-2">
                <label for="confirmPassword" class="font-medium">{{ $t('profile.confirm_password') }}</label>
                <Password id="confirmPassword" v-model="confirmPassword" toggleMask class="w-full" :class="{'p-invalid': !passwordsMatch && confirmPassword}" />
                <small class="p-error" v-if="!passwordsMatch && confirmPassword">{{ $t('profile.passwords_mismatch') }}</small>
              </div>
              
              <div class="flex justify-content-end">
                <Button :label="$t('profile.save')" icon="pi pi-check" severity="success" @click="saveProfile" :disabled="!canSave" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Toast />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import Avatar from 'primevue/avatar';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import Chips from 'primevue/chips';
import FileUpload from 'primevue/fileupload';
import Toast from 'primevue/toast';

const toast = useToast();
const router = useRouter();
const { t } = useI18n();
const user = ref({});
const newPassword = ref('');
const confirmPassword = ref('');
const previewImage = ref(null);

onMounted(() => {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) {
    router.push('/');
    return;
  }
  user.value = JSON.parse(userStr);
});

const isPasswordValid = computed(() => {
  if (!newPassword.value) return true;
  return newPassword.value.length >= 8 &&
         /[A-Z]/.test(newPassword.value) &&
         /[a-z]/.test(newPassword.value) &&
         /[0-9]/.test(newPassword.value) &&
         /[^A-Za-z0-9]/.test(newPassword.value);
});

const passwordsMatch = computed(() => {
  if (!confirmPassword.value) return true;
  return newPassword.value === confirmPassword.value;
});

const canSave = computed(() => {
  if (newPassword.value || confirmPassword.value) {
    return passwordsMatch.value && isPasswordValid.value;
  }
  return true;
});

const onFileSelect = (event) => {
  const file = event.files[0];
  if (!file) return;

  if (file.size > 1000000) {
    toast.add({
      severity: 'error',
      summary: t('profile.success'),
      detail: t('profile.file_too_large'),
      life: 3000
    });
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target.result;
    user.value.image = e.target.result;
    saveProfile();
  };
  reader.readAsDataURL(file);
};

const onUpload = () => {
  toast.add({
    severity: 'success',
    summary: t('profile.success'),
    detail: t('profile.image_uploaded'),
    life: 3000
  });
};

const onError = () => {
  toast.add({
    severity: 'error',
    summary: t('profile.success'),
    detail: t('profile.upload_error'),
    life: 3000
  });
};

const saveProfile = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const updatedUser = { ...user.value };
  
  if (newPassword.value) {
    updatedUser.password = newPassword.value;
  }
  
  const userIndex = users.findIndex(u => u.email === user.value.email);
  if (userIndex !== -1) {
    users[userIndex] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));
  }

  localStorage.setItem('currentUser', JSON.stringify(updatedUser));

  toast.add({
    severity: 'success',
    summary: t('profile.success'),
    detail: t('profile.changes_saved'),
    life: 3000
  });
  
  newPassword.value = '';
  confirmPassword.value = '';
};
</script>

<style scoped>
:deep(.p-fileupload-choose) {
  background-color: var(--surface-card) !important;
  border-color: var(--surface-border) !important;
  color: var(--text-color) !important;
}

:deep(.p-fileupload-choose:hover) {
  background-color: var(--surface-hover) !important;
  border-color: var(--primary-color) !important;
  color: var(--primary-color) !important;
}

:deep(.p-chips) {
  background-color: var(--surface-card) !important;
  border-color: var(--surface-border) !important;
}

:deep(.p-chips-token) {
  background-color: var(--primary-color) !important;
  color: white !important;
}

:deep(.p-password-panel) {
  background-color: var(--surface-card) !important;
  border-color: var(--surface-border) !important;
  color: var(--text-color) !important;
}

:deep(.p-divider) {
  border-color: var(--surface-border) !important;
}
</style>