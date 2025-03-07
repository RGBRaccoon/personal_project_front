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
              v-model="loginForm.email"
              required
              placeholder="이메일을 입력하세요"
            >
          </div>
          <div class="form-group">
            <label for="password">비밀번호</label>
            <input 
              type="password" 
              id="password"
              v-model="loginForm.password"
              required
              placeholder="비밀번호를 입력하세요"
            >
          </div>
          <div v-if="error" class="error-message">
            {{ error }}
            <button 
              v-if="showResendButton" 
              @click="handleResendVerification"
              class="resend-button"
              :disabled="isResending"
            >
              {{ isResending ? '전송 중...' : '인증 메일 재전송' }}
            </button>
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

    <!-- 알림 모달 -->
    <div v-if="showNotification" class="notification-modal">
      <div class="notification-content">
        <p>{{ notificationMessage }}</p>
        <button @click="closeNotification" class="close-button">확인</button>
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
  
  const loginForm = ref({
    email: '',
    password: ''
  })
  const error = ref('')
  const isLoading = ref(false)
  const showResendButton = ref(false)
  const isResending = ref(false)
  const showNotification = ref(false)
  const notificationMessage = ref('')
  
  const handleLogin = async () => {
    if (isLoading.value) return
    
    error.value = ''
    isLoading.value = true
    showResendButton.value = false
    
    try {
      localStorage.removeItem('token')
      const response = await authApi.login(loginForm.value)
      
      const token = response.data.access_token
      if (!token) {
        throw new Error('토큰이 없습니다.')
      }
      
      localStorage.setItem('token', token)
      authStore.isAuthenticated = true
      router.push('/mypage')
    } catch (err: any) {
      console.error('로그인 에러:', err)
      
      console.log('에러 상태 코드:', err.response?.status)
      console.log('에러 데이터:', err.response?.data)
      
      if (err.response && err.response.status === 403) {
        error.value = '이메일 인증이 필요합니다.'
        showResendButton.value = true
        showNotification.value = true
        notificationMessage.value = '이메일 인증이 필요합니다. 인증 메일을 재전송하시겠습니까?'
      } else {
        error.value = err.response?.data?.message || err.message || '로그인에 실패했습니다.'
      }
    } finally {
      isLoading.value = false
    }
  }

  const handleResendVerification = async () => {
    if (isResending.value) return
    
    isResending.value = true
    try {
      await authApi.resendVerification(loginForm.value.email)
      notificationMessage.value = '인증 메일이 재전송되었습니다. 이메일을 확인해주세요.'
      showNotification.value = true
      showResendButton.value = false
    } catch (err: any) {
      console.error('인증 메일 재전송 에러:', err)
      notificationMessage.value = '인증 메일 재전송에 실패했습니다.'
      showNotification.value = true
    } finally {
      isResending.value = false
    }
  }

  const closeNotification = () => {
    showNotification.value = false
    notificationMessage.value = ''
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
  
  .resend-button {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  .resend-button:hover {
    background-color: #0056b3;
  }
  
  .resend-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .notification-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .notification-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
  }
  
  .close-button {
    margin-top: 1rem;
    padding: 0.5rem 2rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .close-button:hover {
    background-color: #45a049;
  }
  </style>