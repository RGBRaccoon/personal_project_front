<template>
  <header class="header">
    <div class="header-left">
      <!-- 로고 클릭시 홈으로 이동 -->
      <router-link to="/" class="logo">
        <h1>LMS</h1>
      </router-link>
    </div>

    <div class="header-center">
      <div class="search-bar">
        <input 
          type="text" 
          placeholder="강의 검색하기"
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        >
        <button class="search-button" @click="handleSearch">검색</button>
      </div>
    </div>

    <div class="header-right">
      <!-- 비로그인 상태 -->
      <div v-if="!authStore.isAuthenticated" class="auth-buttons">
        <button class="login-btn" @click="goToLogin">로그인</button>
        <button class="register-btn" @click="goToRegister">회원가입</button>
      </div>
      
      <!-- 로그인 상태 -->
      <div v-else class="profile-menu">
        <button class="profile-btn" @click="isMenuOpen = !isMenuOpen">
          {{ authStore.user?.name }}
        </button>
        <div v-if="isMenuOpen" class="dropdown-menu">
          <router-link to="/mypage">마이페이지</router-link>
          <router-link to="/my-lectures">내 강의실</router-link>
          <router-link to="/profile">프로필 설정</router-link>
          <button @click="handleLogout">로그아웃</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth-store'

const router = useRouter()
const authStore = useAuthStore()
const searchQuery = ref('')
const isMenuOpen = ref(false)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${searchQuery.value}`)
  }
}

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

// 드롭다운 메뉴 외부 클릭시 닫기
const closeMenu = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.profile-menu')) {
    isMenuOpen.value = false
  }
}

// 컴포넌트 마운트시 이벤트 리스너 추가
onMounted(() => {
  document.addEventListener('click', closeMenu)
})

// 컴포넌트 언마운트시 이벤트 리스너 제거
onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  text-decoration: none;
}

.header-left h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.search-bar {
  display: flex;
  gap: 0.5rem;
}

.search-bar input {
  padding: 0.5rem 1rem;
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.search-button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
}

.login-btn, .register-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.login-btn {
  background-color: white;
  border: 1px solid #4CAF50;
  color: #4CAF50;
}

.register-btn {
  background-color: #4CAF50;
  color: white;
}

.login-btn:hover, .register-btn:hover {
  opacity: 0.9;
}

.profile-menu {
  position: relative;
}

.profile-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dropdown-menu a {
  display: block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #333;
}

.dropdown-menu button {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  background-color: transparent;
  text-align: left;
}

.dropdown-menu a:hover,
.dropdown-menu button:hover {
  background-color: #f5f5f5;
}

.dropdown-menu a {
  white-space: nowrap;  /* 텍스트 줄바꿈 방지 */
}
</style>