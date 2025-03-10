<template>
  <div class="reset-password-container">
    <h1>비밀번호 재설정</h1>
    
    <form @submit.prevent="handleResetPassword" class="reset-password-form">
      <div class="form-group">
        <label for="password">새 비밀번호</label>
        <input 
          type="password" 
          id="password"
          v-model="password"
          required
          placeholder="새 비밀번호를 입력하세요"
        >
      </div>
      
      <div class="form-group">
        <label for="confirmPassword">비밀번호 확인</label>
        <input 
          type="password" 
          id="confirmPassword"
          v-model="confirmPassword"
          required
          placeholder="비밀번호를 다시 입력하세요"
        >
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button 
        type="submit" 
        class="reset-button"
        :disabled="isProcessing"
      >
        {{ isProcessing ? '처리 중...' : '비밀번호 변경' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authApi } from '@/api/auth-api'

const route = useRoute()
const router = useRouter()

const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const isProcessing = ref(false)

const handleResetPassword = async () => {
  // 입력값 검증
  if (password.value !== confirmPassword.value) {
    error.value = '비밀번호가 일치하지 않습니다.'
    return
  }

//   if (password.value.length < 8) {
//     error.value = '비밀번호는 8자 이상이어야 합니다.'
//     return
//   }

  isProcessing.value = true
  error.value = ''

  try {
    const token = route.query.token as string
    if (!token) {
      throw new Error('유효하지 않은 접근입니다.')
    }

    await authApi.resetPassword({
      token: token,
      password: password.value
    })

    // 성공 시 로그인 페이지로 이동
    router.push({
      path: '/login',
      query: { message: '비밀번호가 성공적으로 변경되었습니다.' }
    })
  } catch (err: any) {
    console.error('비밀번호 재설정 에러:', err)
    error.value = '비밀번호 재설정에 실패했습니다.'
  } finally {
    isProcessing.value = false
  }
}
</script>

<style scoped>
.reset-password-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
}

.reset-password-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.reset-button {
  padding: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.reset-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  text-align: center;
}
</style> 