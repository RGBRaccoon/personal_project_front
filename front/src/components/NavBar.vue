<template>
  <nav class="navbar">
    <div class="nav-links">
      <!-- 기존 네비게이션 항목들 -->
      <router-link 
        v-if="isLoggedIn" 
        to="/mypage" 
        class="nav-link"
      >
        마이페이지
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth-store'

const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isAuthenticated)
</script>

<style scoped>
.nav-link {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #333;
}

.nav-link:hover {
  color: #4CAF50;
}
</style> 