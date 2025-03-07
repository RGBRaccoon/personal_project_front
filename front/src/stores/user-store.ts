import { defineStore } from 'pinia'
import { authApi } from '@/api/auth-api'
import type { User } from '@/types/user-types' 

interface UserState {
  user: User | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null
  }),

  actions: {
    async fetchCurrentUser() {
      try {
        console.log('fetchCurrentUser 시작')
        const response = await authApi.getCurrentUser()
        console.log('서버 응답:', response)
        console.log('응답 데이터:', response.data)
        this.user = response.data
        return response.data
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error)
        return null
      }
    },

    setUser(user: User) {
      this.user = user
    },
    
    clearUser() {
      this.user = null
    }
  },

  getters: {
    isLoggedIn: (state) => !!state.user,
    getCurrentUser: (state) => state.user
  }
}) 