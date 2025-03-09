<template>
  <div class="payment-container">
    <div v-if="lecture" class="payment-content">
      <h1>결제 정보 확인</h1>
      
      <!-- 강의 정보 요약 -->
      <div class="lecture-summary">
        <img 
          :src="getImageUrl(lecture.image)" 
          :alt="lecture.title"
          class="lecture-thumbnail"
        >
        <div class="lecture-info">
          <h2>{{ lecture.title }}</h2>
          <p class="instructor">강사: {{ lecture.instructor_id }}</p>
          <p class="price">{{ formatPrice(lecture.price) }}원</p>
        </div>
      </div>

      <!-- 결제 수단 선택 -->
      <div class="payment-method">
        <h3>결제 수단 선택</h3>
        <div class="method-options">
          <label class="method-option">
            <input type="radio" v-model="selectedMethod" value=PaymentType.CARD>
            <span>신용/체크카드</span>
          </label>
          <label class="method-option">
            <input type="radio" v-model="selectedMethod" value=PaymentType.BANK_TRANSFER>
            <span>무통장입금</span>
          </label>
        </div>
      </div>

      <!-- 결제 버튼 -->
      <div class="payment-actions">
        <button 
          class="cancel-button" 
          @click="goBack"
        >
          취소
        </button>
        <button 
          class="payment-button" 
          @click="processPayment"
          :disabled="isProcessing"
        >
          {{ isProcessing ? '결제 처리중...' : '결제하기' }}
        </button>
      </div>
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    <div v-else class="loading-message">
      결제 정보를 불러오는 중...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { marketApi } from '@/api/market-api'
import type { Lecture } from '@/types/lecture-type'
import { PaymentType, PaymentStatus } from '@/types/payment-type'

const router = useRouter()
const route = useRoute()

const lecture = ref<Lecture | null>(null)
const error = ref<string | null>(null)
const isProcessing = ref(false)
const selectedMethod = ref<PaymentType>(PaymentType.CARD)

const DEFAULT_IMAGE = '/images/default_lecture_image.png'

const getImageUrl = (imageUrl: string | null | undefined): string => {
  return imageUrl || DEFAULT_IMAGE
}

const formatPrice = (price: number) => {
  return price.toLocaleString()
}

// PG사 결제 처리 모의 함수 (실제 PG사 연동 시 교체)
const processPGPayment = async (): Promise<string> => {
  // 실제 PG사 결제 위젯/창 호출 및 결제 처리 로직이 들어갈 자리
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`PAY_${Date.now()}`)
    }, 1000)
  })
}

const processPayment = async () => {
  if (!lecture.value || isProcessing.value) return

  isProcessing.value = true
    // 1. 강의 대여 요청
    const payment_id =await marketApi.rentLectureRequest({
      lecture_id: lecture.value.lecture_id
    })

    // 2-4. PG사 결제 처리 (목 구현)
    try {

    // 5. 결제 완료 처리
    await marketApi.processRentLecture({
      payment_id: payment_id,
      payment_type: selectedMethod.value,
      payment_status: PaymentStatus.COMPLETED
    })

    // 성공 시 강의 페이지로 이동
    router.push(`/lecture/${lecture.value.lecture_id}`)
  } catch (err: any) {
    console.error('결제 처리 에러:', err)
    // 에러 응답 데이터 상세 출력
    if (err.response) {
      console.error('에러 응답 데이터:', err.response.data)
      console.error('에러 상태:', err.response.status)
      console.error('에러 헤더:', err.response.headers)
    }
    error.value = '결제 처리 중 오류가 발생했습니다.'

    // 결제 실패 시 결제 취소 처리
    await marketApi.processRentLecture({
      payment_id: payment_id,
      payment_type: selectedMethod.value,
      payment_status: PaymentStatus.FAILED
    })
  } finally {
    isProcessing.value = false
  }
}

const fetchLectureInfo = async () => {
  try {
    const lectureId = route.params.lecture_id as string
    const response = await marketApi.getMarketLectureDetail(lectureId)
    lecture.value = response
  } catch (err) {
    error.value = '강의 정보를 불러오는데 실패했습니다.'
    console.error('강의 정보 조회 에러:', err)
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchLectureInfo()
})
</script>

<style scoped>
.payment-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.payment-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.payment-content h1 {
  margin-bottom: 2rem;
  color: #333;
}

.lecture-summary {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.lecture-thumbnail {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.lecture-info h2 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.instructor {
  color: #666;
  margin-bottom: 0.5rem;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4CAF50;
}

.payment-method {
  margin-bottom: 2rem;
}

.method-options {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.method-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.payment-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.payment-button, .cancel-button {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.payment-button {
  background-color: #4CAF50;
  color: white;
}

.payment-button:hover {
  background-color: #45a049;
}

.payment-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #f8f9fa;
  color: #333;
}

.cancel-button:hover {
  background-color: #e9ecef;
}

.error-message, .loading-message {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error-message {
  color: #dc3545;
}
</style> 