
<template>
  <Sidebar>
    <Menu>
      <MenuItem label="Dashboard" icon="pi pi-home" to="/" />
      <MenuItem label="Search Preview" icon="pi pi-search" to="/search-preview" />
      <MenuItem label="Technical" icon="pi pi-cog">
        <MenuItem label="Debug-Suche" icon="pi pi-search" to="/technical/debug-search" v-if="hasAccess(['Admin', 'DEV'])" />
      </MenuItem>
    </Menu>
  </Sidebar>
</template>

<script setup>
import { useAuthStore } from '@/store/auth';
const auth = useAuthStore();

function hasAccess(roles) {
  return roles.includes(auth.role);
}
</script>
