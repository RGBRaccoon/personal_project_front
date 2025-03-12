<template>
  <div class="payment-detail-container" v-if="payment">
    <div class="back-button">
      <button @click="goBack">
        <i class="fas fa-arrow-left"></i> 결제 내역으로 돌아가기
      </button>
    </div>

    <!-- 하나의 큰 결제 정보 컨테이너 -->
    <div class="payment-info">
      <h2>결제 상세 정보</h2>
      
      <div class="payment-content">
        <!-- 왼쪽: 결제 정보 -->
        <div class="info-grid">
          <div class="info-item">
            <label>결제 ID</label>
            <span>{{ payment.payment_id }}</span>
          </div>
          <div class="info-item">
            <label>결제 상태</label>
            <span :class="['status', payment.payment_status.toLowerCase()]">
              {{ getStatusLabel(payment.payment_status) }}
            </span>
          </div>
          <div class="info-item">
            <label>결제 방식</label>
            <span>{{ getPaymentTypeLabel(payment.payment_type) }}</span>
          </div>
          <div class="info-item">
            <label>결제 일시</label>
            <span>{{ formatDate(payment.payment_date) }}</span>
          </div>
          <div class="info-item">
            <label>결제 금액</label>
            <span>{{ formatPrice(payment.payment_amount) }}원</span>
          </div>
        </div>

        <!-- 오른쪽: 강의 카드 -->
        <div class="lecture-info">
          <LectureCard 
            :lecture="payment.lecture_detail"
            :showActions="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marketApi } from '@/api/market-api'
import type { PaymentDetail } from '@/types/payment-type'
import { PaymentStatus, PaymentType } from '@/types/payment-type'
import LectureCard from '@/components/lecture/LectureCard.vue'

const route = useRoute()
const router = useRouter()
const payment = ref<PaymentDetail | null>(null)

const getStatusLabel = (status: PaymentStatus) => {
  const labels = {
    [PaymentStatus.PENDING]: '처리중',
    [PaymentStatus.COMPLETED]: '완료',
    [PaymentStatus.FAILED]: '실패'
  }
  return labels[status]
}

const getPaymentTypeLabel = (type: PaymentType) => {
  const labels = {
    [PaymentType.CARD]: '카드',
    [PaymentType.BANK_TRANSFER]: '계좌이체',
    // ... 다른 결제 방식들
  }
  return labels[type] || type
}

const formatDate = (dateStr: string) => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateStr))
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR').format(price)
}

const goBack = () => {
  router.back()
}

const fetchPaymentDetail = async () => {
  try {
    const paymentId = route.params.payment_id as string
    const response = await marketApi.getPaymentDetail(paymentId)
    payment.value = response
  } catch (err) {
    console.error('결제 상세 정보 조회 실패:', err)
  }
}

onMounted(() => {
  fetchPaymentDetail()
})
</script>

<style scoped>
.payment-detail-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.payment-info {
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.payment-content {
  display: grid;
  grid-template-columns: 1fr 400px;  /* 결제정보와 강의카드 비율 */
  gap: 2rem;
  margin-top: 1.5rem;
  align-items: start;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.back-button {
  margin-bottom: 2rem;
}

.back-button button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  color: #666;
  font-size: 0.9rem;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  display: inline-block;
}

.status.completed {
  background-color: #d4edda;
  color: #155724;
}

.status.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status.failed {
  background-color: #f8d7da;
  color: #721c24;
}

.lecture-info {
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

@media (max-width: 1024px) {
  .payment-content {
    grid-template-columns: 1fr;  /* 모바일에서는 세로로 배치 */
  }
}
</style> 