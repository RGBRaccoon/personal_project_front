import api from './axios'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export const authApi = {
  // 로그인
  login: async (data: LoginRequest) => {
    console.log('Login request data:', data)
    
    const params = new URLSearchParams()
    params.append('grant_type', 'password')
    params.append('username', data.email)
    params.append('password', data.password)
    
    try {
      const response = await api.post('/auth/jwt/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      return response
    } catch (error: any) {
      // 에러 상세 내용 출력
      console.log('Error details:', {
        data: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      })
      throw error
    }
  },

  // 회원가입
  register: (data: RegisterRequest) => 
    api.post('/auth/jwt/register', data),

  // 로그아웃
  logout: () => 
    api.post('/auth/jwt/logout'),

  // 현재 사용자 정보 조회
  getCurrentUser: () => 
    api.get('/auth/users/me')
}