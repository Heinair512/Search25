<template>
  <div class="flex justify-content-between align-items-center w-full px-4 py-2 surface-section shadow-1">
    <div class="flex align-items-center gap-3">
      <Button icon="pi pi-bars" @click="toggleMenu" text rounded class="menu-button" />
      <img src="/logo.svg" alt="Logo" class="h-4rem cursor-pointer" @click="router.push('/dashboard/news')" />
    </div>
    
    <div class="flex align-items-center gap-3">
      <Dropdown v-model="selectedBU" :options="businessUnits" class="w-12rem menu-dropdown" placeholder="Business Unit" @change="handleBUChange" />
      <div class="flex align-items-center gap-2">
        <Button 
          :icon="store.theme.isDark ? 'pi pi-sun' : 'pi pi-moon'" 
          @click="store.theme.toggleTheme" 
          text 
          rounded 
          v-tooltip.bottom="$t(store.theme.isDark ? 'tooltips.light_mode' : 'tooltips.dark_mode')"
          class="menu-button"
        />
        <div class="language-toggle flex">
          <Button 
            label="DE" 
            :class="{ 'active': store.theme.language === 'DE' }"
            @click="store.theme.setLanguage('DE')" 
            text
            class="w-3rem menu-button"
          />
          <Button 
            label="EN" 
            :class="{ 'active': store.theme.language === 'EN' }"
            @click="store.theme.setLanguage('EN')" 
            text
            class="w-3rem menu-button"
          />
        </div>
      </div>
    </div>
    
    <Menu ref="menu" :model="menuItems" :popup="true" class="menu-popup" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useStore } from '../store';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Menu from 'primevue/menu';

const props = defineProps({
  userRole: {
    type: String,
    required: true
  },
  userBUs: {
    type: Array,
    required: true
  }
});

const router = useRouter();
const { t } = useI18n();
const store = useStore();
const menu = ref();
const selectedBU = ref(null);

const businessUnits = computed(() => props.userBUs);

watch(() => props.userBUs, (newBUs) => {
  if (newBUs && newBUs.length > 0 && !selectedBU.value) {
    selectedBU.value = newBUs[0];
    handleBUChange({ value: newBUs[0] });
  }
}, { immediate: true });

const handleBUChange = (event) => {
  // Save selected BU to localStorage for persistence
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  currentUser.selectedBU = event.value;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  
  // Update store
  store.analytics.setSelectedBU(event.value);
  
  // Dispatch event for components to listen to
  window.dispatchEvent(new Event('buChanged'));
};

const menuItems = computed(() => {
  const items = [
    {
      label: t('menu.news'),
      icon: 'pi pi-home',
      command: () => router.push('/dashboard/news')
    },
    {
      label: t('menu.profile'),
      icon: 'pi pi-user',
      command: () => router.push('/dashboard/profile')
    },
    {
      separator: true
    },
    {
      label: t('menu.logout'),
      icon: 'pi pi-sign-out',
      command: () => {
        store.auth.logout();
        router.push('/');
      }
    }
  ];

  if (props.userRole === 'Admin') {
    items.splice(1, 0, {
      label: t('menu.rights_management'),
      icon: 'pi pi-users',
      command: () => router.push('/dashboard/rechtemanagement')
    });
  }

  return items;
});

const toggleMenu = (event) => {
  menu.value.toggle(event);
};
</script>

<style scoped>
:deep(.p-dropdown-label) {
  padding: 0.75rem 1rem;
  color: var(--text-color) !important;
}

:deep(.p-dropdown-item) {
  padding: 0.75rem 1rem;
  color: var(--text-color) !important;
}

.language-toggle {
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  overflow: hidden;
}

.language-toggle .p-button {
  border-radius: 0;
  margin: 0;
  padding: 0.5rem 1rem;
}

.language-toggle .p-button.active {
  background-color: var(--primary-color);
  color: white !important;
}

.menu-button {
  color: var(--text-color) !important;
}

.menu-button :deep(.p-button-icon) {
  color: var(--primary-color) !important;
}

:deep(.p-menu) {
  background: var(--surface-card) !important;
  border: 1px solid var(--surface-border) !important;
  
  .p-menuitem-text {
    color: var(--text-color) !important;
  }
  .p-menuitem-icon {
    color: var(--primary-color) !important;
  }
}
</style>