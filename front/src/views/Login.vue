<template>
    <div class="login-container">
      <div class="login-box">
        <h2>로그인</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">이메일</label>
            <input 
              type="email" 
              id="email"
              v-model="email"
              required
              placeholder="이메일을 입력하세요"
            >
          </div>
          <div class="form-group">
            <label for="password">비밀번호</label>
            <input 
              type="password" 
              id="password"
              v-model="password"
              required
              placeholder="비밀번호를 입력하세요"
            >
          </div>
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          <div class="form-actions">
            <button type="submit" class="login-button" :disabled="isLoading">
              {{ isLoading ? '로그인 중...' : '로그인' }}
            </button>
          </div>
          <div class="form-footer">
            <router-link to="/register">계정이 없으신가요? 회원가입</router-link>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const email = ref('')
  const password = ref('')
  const error = ref('')
  const isLoading = ref(false)
  
  const handleLogin = async () => {
    if (isLoading.value) return
    
    error.value = ''
    isLoading.value = true
    
    try {
      const success = await authStore.login(email.value, password.value)
      if (success) {
        router.push('/')
      } else {
        error.value = '이메일 또는 비밀번호가 올바르지 않습니다.'
      }
    } catch (err: any) {
      console.error('로그인 실패:', err)
      error.value = err.response?.data?.message || '로그인 중 오류가 발생했습니다.'
    } finally {
      isLoading.value = false
    }
  }
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 64px);
    background-color: #f5f5f5;
  }
  
  .login-box {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #666;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  input:focus {
    outline: none;
    border-color: #4CAF50;
  }
  
  .form-actions {
    margin-top: 2rem;
  }
  
  .login-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
  }
  
  .login-button:hover {
    background-color: #45a049;
  }
  
  .form-footer {
    margin-top: 1rem;
    text-align: center;
  }
  
  .form-footer a {
    color: #4CAF50;
    text-decoration: none;
  }
  
  .form-footer a:hover {
    text-decoration: underline;
  }
  
  .error-message {
    color: #dc3545;
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
  }
  
  .login-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  </style>