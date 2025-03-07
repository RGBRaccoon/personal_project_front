import api from './axios'
import type { Lecture } from '@/types/lecture-type'

export const marketApi = {
  // 마켓에 등록된 강의 목록 조회
  getMarketLectures: async (lecture_type: string, page: number = 1, keyword: string = '') => {
    if (keyword === '') {
      const response = await api.get<Lecture[]>(`/market/lecture/search/${lecture_type}/${page}`)
      return {
        items: response.data
      }
    } else {
      const response = await api.get<Lecture[]>(`/market/lecture/search/${lecture_type}/${page}?keyword=${keyword}`)
      return {
        items: response.data
      }
    }
  },

  // 마켓 강의 페이지 정보
  getMarketLecturePageCount: async (lecture_type: string, keyword: string = '') => {
    if (keyword === '') {
      const response = await api.get<number>(`/market/lecture/page_count/${lecture_type}`)
      return response.data
    } else {
      const response = await api.get<number>(`/market/lecture/page_count/${lecture_type}?keyword=${keyword}`)
      return response.data
    }
  },

  // 마켓 강의 상세 조회
  getMarketLectureDetail: async (lecture_id: string) => {
    const response = await api.get<Lecture>(`/market/lecture/detail/${lecture_id}`)
    return response.data
  },

  // 강의 대여 요청
  rentLecture: async (lecture_id: string) => {
    const response = await api.post(`/market/payment/rent_request/${lecture_id}`)
    return response.data
  }
}
