import type { CreateLectureRequest, Lecture } from '@/types/lecture'
import api from './axios'

// 페이지네이션 응답 인터페이스
interface PaginatedResponse<T> {
  items: T[];
}

// 페이지 정보 조회 응답
interface GetPageInfoResponse {
  total_pages: number;
}

export const lectureApi = {
  // 강의 생성
  create: async (data: CreateLectureRequest) => {
    const response = await api.post<Lecture>('/lecture/management/create', data)
    return response.data
  },

  // 내 강의 목록 조회
  getMyLectures: async (page: number = 1) => {
    const response = await api.get<Lecture[]>(`lecture/management/my_lecture/${page}`)
    return {
      items: response.data  // 배열을 items 프로퍼티로 감싸서 반환
    }
  },

  getMyLecturePageInfo: async () => {
    const response = await api.get<GetPageInfoResponse>('/lecture/management/my_lecture/pages')
    return response.data
  },

  // (추후 필요시) 강의 상세 조회
  // getById: async (id: number) => {
  //   const response = await axiosInstance.get<Lecture>(`/lectures/${id}`)
  //   return response.data
  // }
}