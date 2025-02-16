import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '@/api/authApi'

interface User {
  id: number
  email: string
  name: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  // 로그인 상태 초기화 (페이지 새로고침 시 사용)
  const initializeAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await authApi.getCurrentUser()
        user.value = response.data
        isAuthenticated.value = true
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error)
        logout()
      }
    }
  }

  // 로그인
  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password })
      const { token, user: userData } = response.data
      
      localStorage.setItem('token', token)
      user.value = userData
      isAuthenticated.value = true
      
      return true
    } catch (error) {
      console.error('로그인 실패:', error)
      return false
    }
  }

  // 로그아웃
  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('로그아웃 실패:', error)
    } finally {
      user.value = null
      isAuthenticated.value = false
      localStorage.removeItem('token')
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    initializeAuth
  }
})