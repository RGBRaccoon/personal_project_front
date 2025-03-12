import api from './axios'
import type { Lecture } from '@/types/lecture-type'
import type { PaymentProcessRequest, PaymentType, PaymentStatus, RentReqeust as RentRequest } from '@/types/payment-type'
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
  rentLectureRequest: async (rent_request:RentRequest) => {
    const response = await api.post(`/market/payment/rent_request`, rent_request)
    return response.data
  },

  // 대여 완료 처리
  processRentLecture: async (payment_info: PaymentProcessRequest) => {
    const response = await api.post(`/market/payment/process_rent_payment`, payment_info)
    return response.data
  },

  getPaymentHistory: async (page: number = 1, payment_status: PaymentStatus, payment_type: PaymentType) => {
    let request = `/market/payment/history?page=${page}`
    if (payment_status !== undefined && payment_type !== undefined) {
      request = request + `&payment_status=${payment_status}&payment_type=${payment_type}`
    }
    if (payment_status !== undefined) {
      request = request + `&payment_status=${payment_status}`
    }
    if (payment_type !== undefined) {
      request = request + `&payment_type=${payment_type}`
    }
    const response = await api.get(request)
    return response.data
  },

  getPaymentDetail: async (payment_id: string) => {
    const response = await api.get(`/market/payment/payment_detail/${payment_id}`)
    return response.data
  }

}
