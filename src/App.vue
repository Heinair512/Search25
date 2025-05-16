<template>
  <div class="app-container">
    <RouterView v-if="store.auth.isInitialized" />
    <div v-else class="loading-container">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import { useStore } from './store';

const store = useStore();
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.loading-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-ground);
}
</style>