import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/user-types'
import { authApi } from '@/api/auth-api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const token = ref<string | null>(null)

  // 토큰 설정 메서드 추가
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
    isAuthenticated.value = true
  }

  // 로그인 상태 초기화 (페이지 새로고침 시 사용)
  const initializeAuth = async () => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      token.value = savedToken
      isAuthenticated.value = true
      // 필요한 경우 여기서 토큰을 사용하여 사용자 정보를 가져올 수 있습니다
    }
  }

  // 로그인
  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password })
      user.value = response.user
      setToken(response.access_token)  // 토큰 저장
      isAuthenticated.value = true
      return response
    } catch (error) {
      throw error
    }
  }

  // 로그아웃
  const logout = async () => {
    user.value = null
    token.value = null  // 토큰 제거
    localStorage.removeItem('token')  // localStorage에서도 토큰 제거
    isAuthenticated.value = false
  }

  return {
    user,
    isAuthenticated,
    token,  // 토큰 상태 노출
    setToken,  // 토큰 설정 메서드 노출
    login,
    logout,
    initializeAuth
  }
})