<template>
  <div class="market-container">
    <div class="market-header">
      <h1>강의 마켓</h1>
      <p>다양한 강의를 둘러보세요</p>
    </div>

    <div class="market-content">
      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="loading">
        강의 목록을 불러오는 중...
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="error" class="error">
        {{ error }}
      </div>

      <!-- 강의 없음 -->
      <div v-else-if="!lectures || lectures.length === 0" class="empty">
        현재 등록된 강의가 없습니다.
      </div>

      <!-- 강의 목록 -->
      <div v-else class="lecture-grid">
        <LectureCard
          v-for="lecture in lectures"
          :key="lecture.lecture_id"
          :lecture="lecture"
          @click="goToLectureDetail(lecture.lecture_id)"
        />
      </div>

      <!-- 페이지네이션 -->
      <div v-if="lectures && lectures.length > 0" class="pagination">
        <button 
          :disabled="currentPage === 1"
          @click="changePage(lectureType, currentPage - 1, keyword)"
          class="page-button"
        >
          이전
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button 
          :disabled="currentPage === totalPages"
          @click="changePage(lectureType, currentPage + 1, keyword)"
          class="page-button"
        >
          다음
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { marketApi } from '@/api/market-api'
import type { Lecture } from '@/types/lecture-type'
import LectureCard from '@/components/lecture/LectureCard.vue'

const router = useRouter()
const route = useRoute()

const lectures = ref<Lecture[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const totalPages = ref(1)
const lectureType = ref('all')
const keyword = ref('')

// URL에서 파라미터 가져오기
const initializeFromUrl = () => {
  const type = (route.params.lecture_type as string) || 'all'
  const page = Number(route.params.page) || 1
  const searchKeyword = (route.params.keyword as string) || ''

  lectureType.value = type
  currentPage.value = page
  keyword.value = searchKeyword

  fetchLectures(type, page, searchKeyword)
}

const fetchPageInfo = async (type: string, searchKeyword: string = '') => {
  try {
    const response = await marketApi.getMarketLecturePageCount(type, searchKeyword)
    totalPages.value = response
  } catch (err: any) {
    console.error('페이지 정보 조회 에러:', err)
  }
}

const fetchLectures = async (type: string, page: number, searchKeyword: string = '') => {
  isLoading.value = true
  try {
    const response = await marketApi.getMarketLectures(type, page, searchKeyword)
    lectures.value = response.items
    currentPage.value = page
    
    // URL 업데이트
    const newPath = searchKeyword 
      ? `/market/${type}/${page}/${searchKeyword}`
      : `/market/${type}/${page}`
    router.push(newPath)
  } catch (err: any) {
    console.error('강의 목록 조회 에러:', err)
    error.value = '강의 목록을 불러오는데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

const changePage = (type: string, newPage: number, searchKeyword: string = '') => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    fetchLectures(type, newPage, searchKeyword)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToLectureDetail = (lectureId: string) => {
  router.push(`/market_detail/${lectureId}`)
}

const formatPrice = (price: number) => {
  return price.toLocaleString()
}

// URL 변경 감지
watch(
  () => route.params,
  () => {
    initializeFromUrl()
  }
)

onMounted(async () => {
  const type = (route.params.lecture_type as string) || 'all'
  const searchKeyword = (route.params.keyword as string) || ''
  await fetchPageInfo(type, searchKeyword)
  initializeFromUrl()
})
</script>

<style scoped>
.market-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.market-header {
  text-align: center;
  margin-bottom: 3rem;
}

.market-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.market-header p {
  color: #666;
  font-size: 1.1rem;
}

.lecture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
}

.page-button:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.page-info {
  color: #666;
}

.loading, .error, .empty {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error {
  color: #dc3545;
}
</style> 