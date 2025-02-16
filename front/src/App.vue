<template>
  <div id="app">
    <Header />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Header from '@/components/common/Header.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeAuth()
})
</script>

<style>
@import './assets/main.css';

#app {
  min-height: 100vh;
}
</style>