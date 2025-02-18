import { defineStore } from 'pinia'

interface User {
  user_id: string;
  username: string;
  email: string;
}

interface UserState {
  user: User | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null
  }),

  actions: {
    setUser(user: User) {
      this.user = user
    },
    
    clearUser() {
      this.user = null
    }
  },

  getters: {
    isLoggedIn: (state) => !!state.user,
    getUserId: (state) => state.user?.user_id
  }
}) 