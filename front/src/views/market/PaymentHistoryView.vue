<template>
  <div class="payment-history-container">
    <h1>결제 내역</h1>

    <!-- 필터 섹션 -->
    <div class="filter-section">
      <select v-model="selectedStatus">
        <option value="">전체 상태</option>
        <option v-for="status in Object.values(PaymentStatus)" 
                :key="status" 
                :value="status">
          {{ getStatusLabel(status) }}
        </option>
      </select>
    </div>

    <!-- 결제 내역 테이블 -->
    <div class="payment-table" v-if="payments.length > 0">
      <table>
        <thead>
          <tr>
            <th>결제일</th>
            <th>결제 방식</th>
            <th>금액</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="payment in payments" 
            :key="payment.payment_id"
            @click="goToDetail(payment.payment_id)"
            class="payment-row"
          >
            <td>{{ formatDate(payment.payment_date) }}</td>
            <td>{{ getPaymentTypeLabel(payment.payment_type) }}</td>
            <td>{{ formatPrice(payment.payment_amount) }}원</td>
            <td>
              <span :class="['status', payment.payment_status.toLowerCase()]">
                {{ getStatusLabel(payment.payment_status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 페이지네이션 -->
      <div class="pagination">
        <button 
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          이전
        </button>
        <span>{{ currentPage }}</span>
        <button 
          :disabled="payments.length < pageSize"
          @click="changePage(currentPage + 1)"
        >
          다음
        </button>
      </div>
    </div>

    <!-- 데이터 없음 -->
    <div v-else class="no-data">
      결제 내역이 없습니다.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { marketApi } from '@/api/market-api'
import type { PaymentHistory } from '@/types/payment-type'
import { PaymentStatus, PaymentType } from '@/types/payment-type'
import { useRouter } from 'vue-router'

const payments = ref<PaymentHistory[]>([])
const currentPage = ref(1)
const pageSize = 10
const selectedStatus = ref<PaymentStatus | ''>('')
const isLoading = ref(false)
const router = useRouter()

// 결제 상태 라벨
const getStatusLabel = (status: PaymentStatus) => {
  const labels = {
    [PaymentStatus.PENDING]: '처리중',
    [PaymentStatus.COMPLETED]: '완료',
    [PaymentStatus.FAILED]: '실패'
  }
  return labels[status]
}

// 결제 방식 라벨
const getPaymentTypeLabel = (type: PaymentType) => {
  const labels = {
    [PaymentType.CARD]: '카드',
    [PaymentType.BANK_TRANSFER]: '계좌이체',
    // ... 다른 결제 방식들
  }
  return labels[type] || type
}

// 날짜 포맷
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// 가격 포맷
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR').format(price)
}

// 결제 내역 조회
const fetchPayments = async () => {
  isLoading.value = true
  try {
    const response = await marketApi.getPaymentHistory(
      currentPage.value,
      selectedStatus.value || undefined
    )
    payments.value = response
  } catch (err) {
    console.error('결제 내역 조회 실패:', err)
  } finally {
    isLoading.value = false
  }
}

// 페이지 변경
const changePage = (page: number) => {
  currentPage.value = page
}

// 필터 변경 감지
watch([selectedStatus, currentPage], () => {
  fetchPayments()
})

const goToDetail = (paymentId: string) => {
  router.push(`/payment/detail/${paymentId}`)
}

onMounted(() => {
  fetchPayments()
})
</script>

<style scoped>
.payment-history-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.filter-section {
  margin-bottom: 2rem;
}

.filter-section select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.payment-table table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.payment-table th,
.payment-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.payment-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
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

.pagination {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.payment-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.payment-row:hover {
  background-color: #f8f9fa;
}
</style> 