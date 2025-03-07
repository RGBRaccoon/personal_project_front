<template>
  <div class="home">
    <!-- 히어로 섹션 -->
    <div class="hero-section">
      <h1>온라인 강의 플랫폼</h1>
      <p>다양한 강의를 찾아보고 학습하세요</p>
      <div class="hero-buttons">
        <router-link to="/market" class="market-button">
          강의 둘러보기
        </router-link>
        <router-link to="/register" class="register-button" v-if="!authStore.isAuthenticated">
          시작하기
        </router-link>
      </div>
    </div>

    <!-- 기존 Home.vue의 다른 컨텐츠들 -->

  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth-store'

const authStore = useAuthStore()
</script>

<style scoped>
.home {
  min-height: calc(100vh - 64px);
}

.hero-section {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  margin-bottom: 2rem;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-section p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.market-button, .register-button {
  padding: 1rem 2rem;
  border-radius: 4px;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.market-button {
  background-color: white;
  color: #4CAF50;
}

.market-button:hover {
  background-color: #f0f0f0;
}

.register-button {
  background-color: transparent;
  border: 2px solid white;
  color: white;
}

.register-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .market-button, .register-button {
    width: 100%;
    max-width: 300px;
  }
}
</style>