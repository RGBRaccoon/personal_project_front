<template>
  <div class="forgot-password-container">
    <form @submit.prevent="handleSubmit" class="forgot-password-form">
      <h1>비밀번호 찾기</h1>
      <p class="description">
        가입하신 이메일을 입력하시면, 비밀번호 재설정 링크를 보내드립니다.
      </p>
      
      <div class="form-group">
        <label for="email">이메일</label>
        <input 
          type="email" 
          id="email"
          v-model="email"
          required
          placeholder="가입하신 이메일을 입력하세요"
        >
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="success" class="success-message">
        {{ success }}
      </div>

      <button 
        type="submit" 
        class="submit-button"
        :disabled="isProcessing"
      >
        {{ isProcessing ? '처리 중...' : '재설정 링크 받기' }}
      </button>

      <div class="back-to-login">
        <router-link to="/login">로그인 페이지로 돌아가기</router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { authApi } from '@/api/auth-api'

const email = ref('')
const error = ref('')
const success = ref('')
const isProcessing = ref(false)

const handleSubmit = async () => {
  if (!email.value.trim()) {
    error.value = '이메일을 입력해주세요.'
    return
  }

  isProcessing.value = true
  error.value = ''
  success.value = ''

  try {
    await authApi.requestPasswordReset({ email: email.value })
    success.value = '비밀번호 재설정 링크가 이메일로 전송되었습니다.'
    email.value = '' // 입력 필드 초기화
  } catch (err: any) {
    console.error('비밀번호 찾기 에러:', err)
    error.value = '이메일 전송에 실패했습니다. 다시 시도해주세요.'
  } finally {
    isProcessing.value = false
  }
}
</script>

<style scoped>
.forgot-password-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
}

.forgot-password-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.description {
  color: #666;
  text-align: center;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: bold;
}

input {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.submit-button {
  padding: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  text-align: center;
}

.success-message {
  color: #28a745;
  text-align: center;
}

.back-to-login {
  text-align: center;
}

.back-to-login a {
  color: #666;
  text-decoration: none;
}

.back-to-login a:hover {
  text-decoration: underline;
}
</style> 