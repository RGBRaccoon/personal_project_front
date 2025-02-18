import api from './axios'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface RegisterResponse {
  id: number;
}

interface LoginResponse {
  access_token: string;  // 실제 응답의 토큰 필드명 확인 필요
  // ... other fields
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
      
      // 토큰 저장 추가
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token)
        // axios 인스턴스의 기본 헤더에 토큰 설정
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`
      }
      
      console.log('Login response:', response)
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
  register: async (data: RegisterRequest) => {
    try {
      const response = await api.post<RegisterResponse>('/auth/register', {
        email: data.email,
        password: data.password,
        is_active: true,        // 기본값 추가
        is_superuser: false,    // 기본값 추가
        is_verified: false      // 기본값 추가
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      console.log('회원가입 성공:', response.data.id)
      return response
    } catch (error: any) {
      const apiError: ApiError = {
        message: error.response?.data?.message || '회원가입 중 오류가 발생했습니다.',
        status: error.response?.status || 500
      }
      throw apiError
    }
  },

  // 로그아웃
  logout: async () => {
    try {
      await api.post('/auth/jwt/logout')
      // 로그아웃 시 토큰 제거
      localStorage.removeItem('access_token')
      delete api.defaults.headers.common['Authorization']
    } catch (error: any) {
      throw error
    }
  },

  // 현재 사용자 정보 조회
  getCurrentUser: () => 
    api.get('/auth/users/me')
}