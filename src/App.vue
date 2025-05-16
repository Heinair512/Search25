```vue
<template>
  <div class="app-container">
    <RouterView v-slot="{ Component }">
      <Suspense>
        <component :is="Component" />
        <template #fallback>
          <div class="flex align-items-center justify-content-center min-h-screen">
            <ProgressSpinner />
          </div>
        </template>
      </Suspense>
    </RouterView>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import ProgressSpinner from 'primevue/progressspinner';
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-ground);
}

/* Prevent content shift during loading */
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
```