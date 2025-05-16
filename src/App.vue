<template>
  <div class="app-container" :class="{ 'app-loading': isLoading }">
    <RouterView v-slot="{ Component }">
      <Suspense @pending="onPending" @resolve="onResolve">
        <component :is="Component" />
        <template #fallback>
          <div class="loading-container">
            <ProgressSpinner />
          </div>
        </template>
      </Suspense>
    </RouterView>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import ProgressSpinner from 'primevue/progressspinner';

const isLoading = ref(true);

const onPending = () => {
  isLoading.value = true;
};

const onResolve = () => {
  isLoading.value = false;
};
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-ground);
}

.app-loading {
  opacity: 0;
}

.loading-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-ground);
}

.p-progress-spinner {
  width: 50px;
  height: 50px;
}

/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>