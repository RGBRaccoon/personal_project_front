<template>
    <div class="register-container">
      <div class="register-box">
        <h2>회원가입</h2>
        <form @submit.prevent="handleRegister">
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
          <div class="form-group">
            <label for="passwordConfirm">비밀번호 확인</label>
            <input 
              type="password" 
              id="passwordConfirm"
              v-model="passwordConfirm"
              required
              placeholder="비밀번호를 다시 입력하세요"
            >
          </div>
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          <div class="form-actions">
            <button type="submit" class="register-button" :disabled="isLoading">
              {{ isLoading ? '가입 중...' : '회원가입' }}
            </button>
          </div>
          <div class="form-footer">
            <router-link to="/login">이미 계정이 있으신가요? 로그인</router-link>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth-store'
  import { authApi } from '@/api/auth-api'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const email = ref('')
  const password = ref('')
  const passwordConfirm = ref('')
  const error = ref('')
  const isLoading = ref(false)
  
  const handleRegister = async () => {
    if (isLoading.value) return
    
    error.value = ''
    
    // 비밀번호 확인
    if (password.value !== passwordConfirm.value) {
      error.value = '비밀번호가 일치하지 않습니다.'
      return
    }
    
    isLoading.value = true
    
    try {
      await authApi.register({
        email: email.value,
        password: password.value
      })
      
      // 회원가입 성공 후 로그인 페이지로 이동
      router.push('/login')
    } catch (err: any) {
      console.error('회원가입 실패:', err)
      error.value = err.message || '회원가입 중 오류가 발생했습니다.'
    } finally {
      isLoading.value = false
    }
  }
  </script>
  
  <style scoped>
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 64px);
    background-color: #f5f5f5;
  }
  
  .register-box {
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
  
  .error-message {
    color: #dc3545;
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
  }
  
  .form-actions {
    margin-top: 2rem;
  }
  
  .register-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
  }
  
  .register-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .register-button:not(:disabled):hover {
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
  </style>