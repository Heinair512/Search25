```vue
<template>
  <div class="flex flex-column min-h-screen">
    <template v-if="isLoading">
      <div class="flex align-items-center justify-content-center min-h-screen">
        <ProgressSpinner />
      </div>
    </template>
    <template v-else>
      <AppHeader :user-role="currentUser.role" :user-b-us="currentUser.bu" />
      <div class="flex flex-grow-1 surface-ground">
        <SideMenu v-if="!hideMenu" />
        <div class="flex-grow-1 p-4 overflow-y-auto">
          <RouterView v-slot="{ Component }">
            <Suspense>
              <component :is="Component" />
              <template #fallback>
                <div class="flex align-items-center justify-content-center p-4">
                  <ProgressSpinner />
                </div>
              </template>
            </Suspense>
          </RouterView>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '../store';
import AppHeader from '../components/AppHeader.vue';
import SideMenu from '../components/SideMenu.vue';
import ProgressSpinner from 'primevue/progressspinner';

const route = useRoute();
const router = useRouter();
const store = useStore();
const currentUser = ref({});
const isLoading = ref(true);

onMounted(async () => {
  try {
    if (!store.auth.checkSession()) {
      router.push('/login');
      return;
    }
    
    currentUser.value = store.auth.currentUser;
    
    if (!store.analytics.selectedBU) {
      store.analytics.initializeSelectedBU();
    }
  } catch (error) {
    console.error('Dashboard initialization error:', error);
    router.push('/login');
  } finally {
    isLoading.value = false;
  }
});

const hideMenu = computed(() => {
  return route.path.includes('rechtemanagement') || route.path.includes('profile');
});
</script>

<style scoped>
.overflow-y-auto {
  overflow-y: auto;
}
</style>
```