<template>
  <div class="flex flex-column min-h-screen">
    <AppHeader :user-role="currentUser.role" :user-b-us="currentUser.bu" />
    <div class="flex flex-grow-1 surface-ground">
      <SideMenu v-if="!hideMenu" />
      <div class="flex-grow-1 p-4 overflow-y-auto">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import SideMenu from '../components/SideMenu.vue';

const route = useRoute();
const router = useRouter();
const currentUser = ref({});

onMounted(() => {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) {
    router.push('/');
    return;
  }
  currentUser.value = JSON.parse(userStr);
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