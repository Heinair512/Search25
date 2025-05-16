<template>
<div class="surface-ground flex-grow-1">
  <div class="p-4">
    <Card>
      <template #title>
        <div class="flex align-items-center justify-content-between w-full pl-3 surface-section">
          <span class="text-xl font-semibold">{{ $t('rights_management.title') }}</span>
          <Button icon="pi pi-plus" severity="success" text :aria-label="$t('rights_management.new_user')" @click="showDialog = true" class="p-2 text-sm mr-2" />
        </div>
      </template>
      <template #content>
        <DataTable :value="usersList" class="p-datatable-sm" responsiveLayout="scroll">
          <Column :header="$t('rights_management.user')">
            <template #body="slotProps">
              <div class="flex align-items-center gap-3">
                <Avatar :image="slotProps.data.image" icon="pi pi-user" size="large" shape="circle" />
                <div>
                  <div class="font-medium">{{ slotProps.data.name }}</div>
                  <div class="text-sm text-color-secondary">{{ slotProps.data.email }}</div>
                </div>
              </div>
            </template>
          </Column>

          <Column :header="$t('rights_management.role')">
            <template #body="slotProps">
              <Tag :value="slotProps.data.role" :style="roleStyle(slotProps.data.role)" />
            </template>
          </Column>

          <Column :header="$t('rights_management.business_unit')">
            <template #body="slotProps">
              <div>{{ Array.isArray(slotProps.data.bu) ? slotProps.data.bu.join(', ') : slotProps.data.bu }}</div>
            </template>
          </Column>

          <Column :header="$t('rights_management.actions')">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button icon="pi pi-envelope" text rounded severity="info" @click="resendInvitation(slotProps.data)" v-tooltip.bottom="$t('rights_management.send_invitation')" />
                <Button icon="pi pi-pencil" text rounded severity="secondary" v-tooltip.bottom="'Nutzer bearbeiten'" @click="editUser(slotProps.data, slotProps.index)" />
                <Button icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(slotProps.index)" v-tooltip.bottom="$t('rights_management.delete_user')" />
              </div>
            </template>
          </Column>
        </DataTable>

        <Dialog v-model:visible="showDialog" modal class="w-30rem" :closable="false">
          <template #header>
            <div class="flex align-items-center justify-content-between w-full">
              <span class="text-xl font-medium">{{ $t('rights_management.new_user') }}</span>
              <Button icon="pi pi-times" text rounded @click="closeNewUserDialog" />
            </div>
          </template>
          <div class="flex flex-column gap-4">
            <div class="flex flex-column gap-2">
              <label for="name" class="font-medium">{{ $t('rights_management.name') }}</label>
              <InputText id="name" v-model="newUser.name" :placeholder="$t('rights_management.name')" :class="{'p-invalid': isSubmitted && !newUser.name}" />
              <small class="p-error" v-if="isSubmitted && !newUser.name">{{ $t('rights_management.name_required') }}</small>
            </div>
            
            <div class="flex flex-column gap-2">
              <label for="email" class="font-medium">{{ $t('rights_management.email') }}</label>
              <InputText id="email" v-model="newUser.email" :placeholder="$t('rights_management.email')" :class="{'p-invalid': isSubmitted && (!newUser.email || !isValidEmail(newUser.email))}" />
              <small class="p-error" v-if="isSubmitted && !newUser.email">{{ $t('rights_management.email_required') }}</small>
              <small class="p-error" v-if="isSubmitted && newUser.email && !isValidEmail(newUser.email)">{{ $t('rights_management.invalid_email') }}</small>
            </div>
            
            <div class="flex flex-column gap-2">
              <label for="role" class="font-medium">{{ $t('rights_management.role') }}</label>
              <Dropdown id="role" v-model="newUser.role" :options="roles" :placeholder="$t('rights_management.role')" class="w-full" :class="{'p-invalid': isSubmitted && !newUser.role}" />
              <small class="p-error" v-if="isSubmitted && !newUser.role">{{ $t('rights_management.role_required') }}</small>
            </div>
            
            <div class="flex flex-column gap-2">
              <label for="bu" class="font-medium">{{ $t('rights_management.business_unit') }}</label>
              <MultiSelect id="bu" v-model="newUser.bu" :options="businessUnits" :placeholder="$t('rights_management.business_unit')" display="chip" class="w-full" :class="{'p-invalid': isSubmitted && (!newUser.bu || newUser.bu.length === 0)}" />
              <small class="p-error" v-if="isSubmitted && (!newUser.bu || newUser.bu.length === 0)">{{ $t('rights_management.bu_required') }}</small>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-content-end">
              <Button :label="$t('rights_management.send_invitation')" severity="success" @click="validateAndSend" />
            </div>
          </template>
        </Dialog>

        <Dialog v-model:visible="editDialog" modal class="w-30rem" :closable="false">
          <template #header>
            <div class="flex align-items-center justify-content-between w-full">
              <span class="text-xl font-medium">{{ $t('rights_management.edit_user') }}</span>
              <Button icon="pi pi-times" text rounded @click="closeEditDialog" />
            </div>
          </template>
          <div class="flex flex-column gap-4">
            <div class="flex flex-column gap-2">
              <label for="edit-name" class="font-medium">{{ $t('rights_management.name') }}</label>
              <InputText id="edit-name" v-model="editedUser.name" :placeholder="$t('rights_management.name')" :class="{'p-invalid': isSubmitted && !editedUser.name}" />
              <small class="p-error" v-if="isSubmitted && !editedUser.name">{{ $t('rights_management.name_required') }}</small>
            </div>
            
            <div class="flex flex-column gap-2">
              <label for="edit-email" class="font-medium">{{ $t('rights_management.email') }}</label>
              <InputText id="edit-email" v-model="editedUser.email" :placeholder="$t('rights_management.email')" :class="{'p-invalid': isSubmitted && (!editedUser.email || !isValidEmail(editedUser.email))}" />
              <small class="p-error" v-if="isSubmitted && !editedUser.email">{{ $t('rights_management.email_required') }}</small>
              <small class="p-error" v-if="isSubmitted && editedUser.email && !isValidEmail(editedUser.email)">{{ $t('rights_management.invalid_email') }}</small>
            </div>
            
            <div class="flex flex-column gap-2">
              <label for="edit-role" class="font-medium">{{ $t('rights_management.role') }}</label>
              <Dropdown id="edit-role" v-model="editedUser.role" :options="roles" :placeholder="$t('rights_management.role')" class="w-full" :class="{'p-invalid': isSubmitted && !editedUser.role}" />
              <small class="p-error" v-if="isSubmitted && !editedUser.role">{{ $t('rights_management.role_required') }}</small>
            </div>
            
            <div class="flex flex-column gap-2">
              <label for="edit-bu" class="font-medium">{{ $t('rights_management.business_unit') }}</label>
              <MultiSelect id="edit-bu" v-model="editedUser.bu" :options="businessUnits" :placeholder="$t('rights_management.business_unit')" display="chip" class="w-full" :class="{'p-invalid': isSubmitted && (!editedUser.bu || editedUser.bu.length === 0)}" />
              <small class="p-error" v-if="isSubmitted && (!editedUser.bu || editedUser.bu.length === 0)">{{ $t('rights_management.bu_required') }}</small>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-content-end">
              <Button :label="$t('rights_management.save')" severity="success" @click="validateAndSaveEdit" />
            </div>
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteDialog" modal class="w-30rem">
          <template #header>
            <div class="flex align-items-center justify-content-between w-full">
              <span class="text-xl font-medium">{{ $t('rights_management.delete_user') }}</span>
              <Button icon="pi pi-times" text rounded @click="deleteDialog = false" />
            </div>
          </template>
          <div class="flex flex-column gap-3">
            <p class="m-0">{{ $t('rights_management.delete_confirm') }}</p>
          </div>
          <template #footer>
            <div class="flex justify-content-end gap-2">
              <Button :label="$t('rights_management.cancel')" severity="secondary" @click="deleteDialog = false" />
              <Button :label="$t('rights_management.delete_user')" severity="danger" @click="deleteUser" />
            </div>
          </template>
        </Dialog>

        <Toast />
      </template>
    </Card>
  </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import Avatar from 'primevue/avatar';
import Tag from 'primevue/tag';
import Toast from 'primevue/toast';
import { users as initialUsers } from '../data/users';
import { mailServer } from '../utils/mailServer';

const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const showDialog = ref(false);
const deleteDialog = ref(false);
const deleteIndex = ref(null);
const isSubmitted = ref(false);

const roles = ['Admin', 'Dev', 'Analyst'];
const businessUnits = ['GC Gruppe', 'Search', 'GC', 'bimsplus', 'hti'];

const usersList = ref([...initialUsers]);

const newUser = ref({
  name: '',
  email: '',
  role: '',
  bu: [],
  image: null,
  password: '12345'
});

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const roleStyle = (role) => {
  switch (role) {
    case 'Admin':
      return { backgroundColor: '#fdecea', color: '#b73e3e' };
    case 'Dev':
      return { backgroundColor: '#e6f1fb', color: '#3a6ea5' };
    case 'Analyst':
      return { backgroundColor: '#e6f7f1', color: '#31796b' };
    default:
      return {};
  }
};

const updateUsersStorage = () => {
  localStorage.setItem('users', JSON.stringify(usersList.value));
  Object.assign(initialUsers, usersList.value);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    const updatedCurrentUser = usersList.value.find(u => u.email === currentUser.email);
    if (updatedCurrentUser) {
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
    }
  }
};

const closeNewUserDialog = () => {
  showDialog.value = false;
  isSubmitted.value = false;
  newUser.value = { name: '', email: '', role: '', bu: [], image: null, password: '12345' };
};

const closeEditDialog = () => {
  editDialog.value = false;
  isSubmitted.value = false;
};

const validateForm = (user) => {
  isSubmitted.value = true;
  return user.name && 
         user.email && 
         isValidEmail(user.email) && 
         user.role && 
         user.bu && 
         user.bu.length > 0;
};

const validateAndSend = () => {
  if (validateForm(newUser.value)) {
    sendInvitation();
    isSubmitted.value = false;
  }
};

const validateAndSaveEdit = () => {
  if (validateForm(editedUser.value)) {
    saveUserEdits();
    isSubmitted.value = false;
  }
};

const sendInvitation = async () => {
  const otp = mailServer.generateOTP(newUser.value.email);
  await mailServer.sendInvitation(newUser.value.email, otp);
  
  usersList.value.push({ 
    ...newUser.value,
    needsPasswordReset: true,
    otp
  });
  
  updateUsersStorage();
  showDialog.value = false;
  toast.add({ 
    severity: 'success', 
    summary: t('rights_management.success'), 
    detail: t('rights_management.user_invited'), 
    life: 3000 
  });
  
  newUser.value = { 
    name: '', 
    email: '', 
    role: '', 
    bu: [], 
    image: null, 
    password: '12345' 
  };
};

const resendInvitation = async (user) => {
  const otp = mailServer.generateOTP(user.email);
  await mailServer.sendInvitation(user.email, otp);
  
  const userIndex = usersList.value.findIndex(u => u.email === user.email);
  if (userIndex !== -1) {
    usersList.value[userIndex] = {
      ...user,
      needsPasswordReset: true,
      otp
    };
    updateUsersStorage();
  }
  
  toast.add({ 
    severity: 'success', 
    summary: t('rights_management.success'), 
    detail: t('rights_management.invitation_resent'), 
    life: 3000 
  });
};

const confirmDelete = (index) => {
  deleteIndex.value = index;
  deleteDialog.value = true;
};

const deleteUser = () => {
  if (deleteIndex.value !== null) {
    usersList.value.splice(deleteIndex.value, 1);
    updateUsersStorage();
    deleteDialog.value = false;
    deleteIndex.value = null;
    toast.add({ severity: 'success', summary: t('rights_management.success'), detail: t('rights_management.user_deleted'), life: 3000 });
  }
};

const editDialog = ref(false);
const editedUser = ref({ name: '', email: '', role: '', bu: [], image: null });
const editIndex = ref(null);

const editUser = (user, index) => {
  editedUser.value = { ...user };
  editIndex.value = index;
  editDialog.value = true;
  isSubmitted.value = false;
};

const saveUserEdits = () => {
  if (editIndex.value !== null) {
    usersList.value[editIndex.value] = { ...editedUser.value };
    updateUsersStorage();
    toast.add({ severity: 'success', summary: t('rights_management.success'), detail: t('rights_management.user_updated'), life: 3000 });
    editDialog.value = false;
    editIndex.value = null;
  }
};
</script>

<style scoped>
:deep(.p-card) {
  background-color: var(--surface-card) !important;
}

:deep(.p-card .p-card-title) {
  background-color: var(--surface-section) !important;
  color: var(--text-color) !important;
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

:deep(.p-dropdown-panel) {
  background-color: var(--surface-card);
  color: var(--text-color);
}

:deep(.p-dropdown-items) {
  background-color: var(--surface-card);
}

:deep(.p-dropdown-item) {
  color: var(--text-color);
}

:deep(.p-multiselect-panel) {
  background-color: var(--surface-card);
  color: var(--text-color);
}

:deep(.p-multiselect-items) {
  background-color: var(--surface-card);
}

:deep(.p-multiselect-item) {
  color: var(--text-color);
}
</style>