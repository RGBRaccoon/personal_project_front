import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000  // 10초 타임아웃 추가
})

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    console.log('현재 토큰:', token)  // 토큰 확인용 로그
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('요청 헤더:', config.headers)  // 헤더 확인용 로그
    }
    return config
  },
  error => {
    console.error('API 요청 중 에러:', error)
    return Promise.reject(error)
  }
)


api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        // 토큰이 만료되었거나 유효하지 않은 경우
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )
  
  export default api