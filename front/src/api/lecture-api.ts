import type { CreateLectureRequest, Lecture } from '@/types/lecture-type'
import api from './axios'
import type { ContentInList } from '@/types/content-type'

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
    const response = await api.get<GetPageInfoResponse>('/lecture/management/my_lecture/page_count')
    return response.data
  },

  getLectureDetail: async (lectureId: string) => {
    const response = await api.get<Lecture>(`/market/lecture/detail/${lectureId}`)
    return response.data
  },

  getRentedLectures: async (page: number = 1) => {
    const response = await api.get<Lecture[]>(`/lecture/management/my_rented_lecture/${page}`)
    return {
      items: response.data
    }
  },

  getRentedLecturePageInfo: async () => {
    const response = await api.get<GetPageInfoResponse>('/lecture/management/page_count/my_rented_lecture')
    return response.data
  }
}